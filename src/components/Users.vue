<template>
  <div>
    <div id="header">
      <div>{{ loginUser.name }}さんようこそ！！</div>
      <div>残高 : {{ loginUser.balance }}</div>
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
      <modal v-if="isWalletVisible">
        <template v-slot:header>
          {{ targetUser.name }}さんの残高
        </template>
        <template v-slot:body>
          {{ targetUser.balance }}
        </template>
        <template v-slot:footer>
          <button class="modal-default-button" @click="closeWallet">
            close
          </button>
        </template>
      </modal>
      <modal v-if="isSendMoneyFormVisible">
        <template v-slot:header>
          あなたの残高:{{ loginUser.balance }} <br> 送る金額
        </template>
        <template v-slot:body>
          <input type="number" v-model="sendAmount" />
        </template>
        <template v-slot:footer>
          <button class="modal-default-button" @click="sendMoney">
            送信
          </button>
        </template>
      </modal>
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
import Modal from './Modal'

export default {
  data() {
    return {
      amount: 0
    }
  },
  computed: {
    loginUser() {
      return this.$store.getters.loginUser
    },
    users() {
      return this.$store.getters.users
    },
    isWalletVisible() {
      return this.$store.getters.isWalletVisible;
    },
    isSendMoneyFormVisible() {
      return this.$store.getters.isSendMoneyFormVisible;
    },
    targetUser() {
      return this.$store.getters.targetUser;
    },
    sendAmount: {
      get() {
        return this.amount;
      },
      set(value) {
        this.amount = value;
      }
    }
  },
  methods: {
    logout() {
      this.$store.commit('unsetUser');
      this.$router.push({name: 'loginForm'});
    },
    closeWallet() {
      this.$store.commit('setWalletVisibility', !this.isWalletVisible);
    },
    sendMoney() {
      if (this.amount <= 0) {
        alert('0より大きな金額を指定してください。')
        this.$store.commit('setSendMoneyFormVisibility', !this.isSendMoneyFormVisible);
        return;
      }

      if (this.loginUser.balance < this.amount) {
        alert('送金額が残高を超えています。減らしてください。');
        this.$store.commit('setSendMoneyFormVisibility', !this.isSendMoneyFormVisible);
        return;
      }

      try {
        this.$store.dispatch('sendMoney', {
          amount: this.amount,
          from: this.loginUser,
          to: this.targetUser
        })
      } catch (e) {
        console.log(e);
        alert('送金に失敗しました。再度送金を試みてください。');
      } finally {
        this.amount = 0;
        this.$store.commit('setSendMoneyFormVisibility', !this.isSendMoneyFormVisible);
      }
    }
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