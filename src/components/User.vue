<template>
  <div>
    <tr>
      <td>{{ target.name }}</td>
      <td>
        <button @click="showWallet">walletを見る</button>
      </td>
      <td>
        <button @click="showSendMoneyForm">送る</button>
      </td>
    </tr>
  </div>
</template>

<script>
export default {
  props: ['target'],
  methods: {
    showWallet() {
      this.$store.commit('setActionTargetUser', this.target);
      this.$store.commit('setWalletVisibility', !this.$store.getters.isWalletVisible);
    },
    showSendMoneyForm() {
      this.$store.commit('setActionTargetUser', this.target);
      this.$store.commit('setSendMoneyFormVisibility', !this.$store.getters.isSendMoneyFormVisible);
    }
  }
}
</script>
