import Vue from 'vue'
import Vuex from 'vuex'
import {db} from '@/main'
import {validationMessage} from '@/validation';

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: {},
  },
  mutations: {
    setUser(state, user) {
      Object.assign(state.user, user);
    }
  },
  actions: {
    async register(_, payload) {
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
    async login(context, payload) {
      await db.collection('users')
        .where('mailAddress', '==', payload.mailAddress)
        .where('password', '==', payload.password)
        .get()
        .then(user => {
          if (!user.size) return Promise.reject('メールアドレス、もしくはパスワードが誤っています。入力し直してください。');

          context.commit('setUser', user.docs[0].data());
          return;
        })
        .catch(e => {
          console.log(e);
          return Promise.reject('ログインに失敗しました。再度新規登録を試みてください。');
        })
    }
  }
})
