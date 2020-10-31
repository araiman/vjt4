<template>
  <div>
    <div id="header">
      <div>{{ loginUserName }}さんようこそ！！</div>
      <div class="loginUserBalance">残高 : {{ loginUserBalance }}</div>
    </div>
    <div id="content">
      <h1 class="title">ユーザ一覧</h1>
    </div>
  </div>
</template>

<style scoped>
#header {
  display: flex;
}

.loginUserBalance {
  margin-left: auto;
}
</style>

<script>
export default {
  data() {
    return {
      loginUserName: this.$store.getters.loginUser.mailAddress,
      loginUserBalance: this.$store.getters.loginUser.balance
    }
  }
}
</script>