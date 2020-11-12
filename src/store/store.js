import Vue from 'vue'
import Vuex from 'vuex'
import {db} from '@/main'
import {validationMessage} from '@/validation';

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: {},
    users: [],
    actionTargetUser: {},
    isWalletVisible: false,
    isSendMoneyFormVisible: false
  },
  getters: {
    loginUser: state => state.user,
    users: state => state.users,
    actionTargetUser: state => state.actionTargetUser,
    isWalletVisible: state => state.isWalletVisible,
    isSendMoneyFormVisible: state => state.isSendMoneyFormVisible
  },
  mutations: {
    setLoginUser: (state, user) => state.user = user,
    unsetLoginUser: state => state.user = {},
    setUsers: (state, users) => state.users = users,
    setActionTargetUser: (state, user) => state.actionTargetUser = user,
    setWalletVisibility: (state, value) => state.isWalletVisible = value,
    setSendMoneyFormVisibility: (state, value) => state.isSendMoneyFormVisible = value
  },
  actions: {
    register: async (_, payload) => {
      const users = await db.collection('users');

      if ((await users.where('name', '==', payload.userName).get()).size) {
        return Promise.reject(validationMessage.duplicatedField('ユーザ名'));
      }

      if ((await users.where('mailAddress', '==', payload.mailAddress).get()).size) {
        return Promise.reject(validationMessage.duplicatedField('メールアドレス'));
      }

      if ((await users.where('password', '==', payload.password).get()).size) {
        return Promise.reject(validationMessage.duplicatedField('パスワード'));
      }

      await users.doc().set({
        name: payload.userName,
        mailAddress: payload.mailAddress,
        password: payload.password,
        balance: 0
      })
        .then(() => {
          return;
        })
        .catch(e => {
          console.log(e);
          return Promise.reject('登録に失敗しました。再度新規登録を試みてください。');
        })
    },
    login: async (context, payload) => {
      const usersQuerySnapShot = db.collection('users');

      await usersQuerySnapShot
        .where('mailAddress', '==', payload.mailAddress)
        .where('password', '==', payload.password)
        .get()
        .then(userDocument => {
          if (!userDocument.size) return Promise.reject('メールアドレス、もしくはパスワードが誤っています。入力し直してください。');

          const loginUser = {
            id: userDocument.docs[0].id,
            ...userDocument.docs[0].data()
          }
          context.commit('setLoginUser', loginUser);
        })
        .catch(e => {
          console.log(e);
          return Promise.reject('ログインに失敗しました。再度新規登録を試みてください。');
        })

      await usersQuerySnapShot
        .get()
        .then(usersDocument => {
          const usersOtherThanLoginUser = usersDocument.docs
            .filter(user => user.id !== context.getters.loginUser.id)
            .map(user => Object.assign({ id: user.id }, user.data()));
          context.commit('setUsers', usersOtherThanLoginUser);
        })
    },
    sendMoney: async (context, payload) => {
      const users = db.collection('users');

      const batch = db.batch();
      batch.update(users.doc(payload.from.id), { balance: Number(payload.from.balance) - Number(payload.amount) });
      batch.update(users.doc(payload.to.id), { balance: Number(payload.to.balance) + Number(payload.amount) });
      await batch.commit();

      const updatedUsers = (await users.get())
        .docs
        .map(user => Object.assign({ id: user.id}, user.data()));
      const loginUser = updatedUsers.filter(user => user.id === payload.from.id)[0];
      const usersExcludingLoginOne = updatedUsers.filter(user => user.id !== payload.from.id);
      context.commit('setLoginUser', loginUser);
      context.commit('setUsers', usersExcludingLoginOne);
    }
  }
})