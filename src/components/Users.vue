<template>
  <div>
    <div id="header">
      <div>{{ loginUserName }}さんようこそ！！</div>
      <div>残高 : {{ loginUserBalance }}</div>
      <button class="logout" @click="logout">ログアウト</button>
    </div>
    <div id="content">
      <h1 class="title">ユーザ一覧</h1>
      <table>
        <tr>
          <th>ユーザ名</th>
          <th></th>
          <th></th>
        </tr>
        <template v-for="target in users">
          <user :target="target" v-bind:key="target.name"></user>
        </template>
      </table>
    </div>
  </div>
</template>

<style scoped>
#header {
  display: flex;
}

.logout {
  margin-left: auto;
}
</style>

<script>
import User from './User'

export default {
  data() {
    return {
      loginUserName: this.$store.getters.loginUser.mailAddress,
      loginUserBalance: this.$store.getters.loginUser.balance,
      users: this.$store.getters.users
    }
  },
  methods: {
    logout() {
      this.$store.commit('unsetUser');
      this.$router.push({name: 'loginForm'});
    }
  },
  components: {
    User
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!Object.keys(vm.$store.getters.loginUser).length) {
        next({name: 'loginForm'});
      }
    })
  }
}
</script>