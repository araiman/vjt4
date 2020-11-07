import Vue from 'vue'
import Vuex from 'vuex'
import {db} from '@/main'
import {validationMessage} from '@/validation';
import _ from 'lodash'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: {},
    users: [],
    isWalletVisible: false
  },
  getters: {
    loginUser: state => state.user,
    users: state => state.users,
    isWalletVisible: state => state.isWalletVisible
  },
  mutations: {
    setUser: (state, user) => Object.assign(state.user, user),
    unsetUser: state => state.user = {},
    setUsers: (state, users) => state.users = users,
    setWalletVisibility: (state, value) => state.isWalletVisible = value
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
      const users = db.collection('users');

      await users
        .where('mailAddress', '==', payload.mailAddress)
        .where('password', '==', payload.password)
        .get()
        .then(user => {
          if (!user.size) return Promise.reject('メールアドレス、もしくはパスワードが誤っています。入力し直してください。');

          context.commit('setUser', user.docs[0].data());
        })
        .catch(e => {
          console.log(e);
          return Promise.reject('ログインに失敗しました。再度新規登録を試みてください。');
        })

      await users
        .get()
        .then(users => {
          users.docs.map(user => user.data());
          context.commit('setUsers', users.docs
            .filter(user => !_.isEqual(context.getters.loginUser, user.data()))
            .map(user => user.data()));
        })
    }
  }
})
