import Vue from 'vue'
import Vuex from 'vuex'
import {db} from '@/main'
import {validationMessage} from '@/validation';

Vue.use(Vuex)


export const store = new Vuex.Store({
  actions: {
    async register(_, payload) {
      const users = await db.collection('users');

      if ((await users.where('name', '==', payload.userName).get()).size) {
        alert(validationMessage.duplicatedField('ユーザ名'));
        return;
      }

      if ((await users.where('mailAddress', '==', payload.mailAddress).get()).size) {
        alert(validationMessage.duplicatedField('メールアドレス'));
        return;
      }

      if ((await users.where('password', '==', payload.password).get()).size) {
        alert(validationMessage.duplicatedField('パスワード'));
        return;
      }

      await users.doc().set({
        name: payload.userName,
        mailAddress: payload.mailAddress,
        password: payload.password,
        balance: 0
      })
        .then(() => {
          console.log('登録成功!')
        })
        .catch(e => {
          console.log(e);
          alert('登録に失敗しました。再度新規登録を試みてください。');
        })
    }
  }
})
