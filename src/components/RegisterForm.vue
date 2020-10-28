<template>
  <div id="content">
    <h1>新規登録画面</h1>
    <form>
      <table>
        <tr>
          <td>ユーザ名</td>
          <td><input type="text" v-model.trim="userName"></td>
        </tr>
        <tr>
          <td>メールアドレス</td>
          <td><input type="email" v-model.trim="mailAddress"></td>
        </tr>
        <tr>
          <td>パスワード</td>
          <td><input type="password" v-model.trim="password"></td>
        </tr>
      </table>
      <input type="button" value="新規登録" @click="register">
    </form>
  </div>
</template>

<script>
import {validationMessage} from "@/validation";
import {validator} from "@/validation";

export default {
  data() {
    return {
      userName: '',
      mailAddress: '',
      password: ''
    }
  },
  methods: {
    register() {
      if (validator.validUserName(this.userName)) {
        alert(validationMessage.invalidField('ユーザ名'));
        return;
      }
      if (validator.validEmail(this.mailAddress)) {
        alert(validationMessage.invalidField('メールアドレス'));
        return;
      }
      if (validator.validPassword(this.password)) {
        alert(validationMessage.invalidField('パスワード'));
        return;
      }

      this.$store.dispatch('register', {
        userName: this.userName,
        mailAddress: this.mailAddress,
        password: this.password
      });
    }
  }
}
</script>