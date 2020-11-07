<template>
  <div>
    <tr>
      <td>{{ target.name }}</td>
      <td><button @click="switchWalletVisibility">walletを見る</button></td>
      <td><button>送る</button></td>
    </tr>
    <modal v-if="isWalletVisible" v-on:switchWalletVisibility="switchWalletVisibility">
      <template v-slot:header>
        {{ target.name }}さんの残高
      </template>
      <template v-slot:body>
        {{ target.balance }}
      </template>
      <template v-slot:footer>
        <button class="modal-default-button" @click="switchWalletVisibility">
          close
        </button>
      </template>
    </modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal";

export default {
  props: ['target'],
  data() {
    return {
      balance: this.target.balance
    }
  },
  computed: {
    isWalletVisible() {
      return this.$store.getters.isWalletVisible
    }
  },
  methods: {
    switchWalletVisibility() {
      this.$store.commit('setWalletVisibility', !this.isWalletVisible);
    }
  },
  components: {
    Modal
  }
}
</script>