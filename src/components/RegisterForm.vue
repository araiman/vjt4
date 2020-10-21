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
import {db} from "@/main"

export default {
  data() {
    return {
      userName: "",
      mailAddress: "",
      password: ""
    }
  },
  methods: {
    async register() {
      if (!this.userName) {
        alert(this.invalid("ユーザ名"));
        return;
      }
      if (!this.mailAddress ||
          !this.validEmail(this.mailAddress)) {
        alert(this.invalid("メールアドレス"));
        return;
      }
      if (!this.password) {
        alert(this.invalid("パスワード"));
        return;
      }

      const users = await db.collection("users");

      if ((await users.where("name", "==", this.userName).get()).size) {
        alert(this.duplicated("ユーザ名"));
        return;
      }

      if ((await users.where("mailAddress", "==", this.mailAddress).get()).size) {
        alert(this.duplicated("メールアドレス"));
        return;
      }

      if ((await users.where("password", "==", this.password).get()).size) {
        alert(this.duplicated("パスワード"));
        return;
      }

      await users.doc().set({
        "name": this.userName,
        "mailAddress": this.mailAddress,
        "password": this.password,
        "balance": 0
      })
          .then(() => {
            console.log("登録成功!")
          })
          .catch(e => {
            console.log(e);
            alert("登録に失敗しました。再度新規登録を試みてください。");
          })
    },
    validEmail(email) {
      const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailValidator.test(email);
    },
    invalid(target) {
      return `${target}が入力されていないか、不正な形式です。`;
    },
    duplicated(target) {
      return `同一${target}のユーザが存在します。変更してください。`;
    }
  }
}
</script>