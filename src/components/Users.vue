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
          <user :target="target" v-bind:key="target.id"></user>
        </template>
      </table>
    </div>
    <modal v-if="isWalletVisible">
      <template v-slot:header>
        {{ actionTargetUser.name }}さんの残高
      </template>
      <template v-slot:body>
        {{ actionTargetUser.balance }}
      </template>
      <template v-slot:footer>
        <button class="modal-default-button" @click="closeWallet">
          close
        </button>
      </template>
    </modal>
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
import Modal from './Modal'

export default {
  data() {
    return {
      loginUserName: this.$store.getters.loginUser.mailAddress,
      loginUserBalance: this.$store.getters.loginUser.balance,
      users: this.$store.getters.users
    }
  },
  computed: {
    isWalletVisible() {
      return this.$store.getters.isWalletVisible;
    },
    actionTargetUser() {
      return this.$store.getters.actionTargetUser;
    },
  },
  methods: {
    logout() {
      this.$store.commit('unsetLoginUser');
      this.$router.push({name: 'loginForm'});
    },
    closeWallet() {
      this.$store.commit('setWalletVisibility', !this.isWalletVisible);
    },
  },
  components: {
    User,
    Modal
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