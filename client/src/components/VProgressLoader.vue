<template>
  <div class="VProgressLoader">
    <div class="VProgressLoader__background"></div>
    <v-progress-circular indeterminate :size="100" :width="7" class="cyan--text VProgressLoader__loader"></v-progress-circular>
  </div>
</template>

<script>
  export default {
    name: 'VProcessLoader'
  }
</script>

<style lang="scss" scoped>
  .VProgressLoader {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 100;
  }

  .VProgressLoader__background {
    position: fixed;
    background-color: #000000;
    opacity: 0.1;
    height: 100%;
    width: 100%;
  }

  .VProgressLoader__loader {
    z-index: 110;
    top: calc(50% - 100px);
    left: calc(50% - 100px);
  }
</style>
