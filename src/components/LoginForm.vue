<template>
  <div id="content">
    <h1>ログイン画面</h1>
    <table>
      <tr>
        <td>メールアドレス</td>
        <td><input type="email" v-model.trim="mailAddress"></td>
      </tr>
      <tr>
        <td>パスワード</td>
        <td><input type="password" v-model.trim="password"></td>
      </tr>
    </table>
    <button @click="login">ログイン</button>
    <div><router-link :to="{name: 'registerForm'}">新規登録はこちらから</router-link></div>
  </div>
</template>

<script>
import {validationMessage} from '@/validation';
import {validator} from '@/validation';

export default {
  data() {
    return {
      mailAddress: "",
      password: ""
    }
  },
  methods: {
    login() {
      if (validator.validEmail(this.mailAddress)) {
        alert(validationMessage.invalidField('メールアドレス'));
        return;
      }

      if (validator.validPassword(this.password)) {
        alert(validationMessage.invalidField('パスワード'));
        return;
      }

      this.$store.dispatch('login', {
        mailAddress: this.mailAddress,
        password: this.password
      }).then(() => {
        this.$router.push({name: 'users'})
      }).catch((errorMessage) => {
        alert(errorMessage);
      })
    }
  }
}
</script>