<template>
  <div class="ma-0 pa-0">
    <v-app light>
      <router-view></router-view>
    </v-app>

    <v-notifications></v-notifications>
  </div>
</template>

<script>
  import VNotifications from '@/components/VNotifications'
  export default {
    name: 'App',
    components: {VNotifications},
    computed: {
      user () {
        return this.$store.state.auth.user
      }
    },
    watch: {
      user (newVal) {
        if (newVal !== null) {
          this.$router.replace({path: '/main/dashboard'})
        }
      }
    },
    mounted () {
      this.$store.dispatch('auth/login').catch(error => {
        if (!error.message.includes('Could not find stored JWT')) {
          console.error(error)
        }
      })
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'
  html, body {
    overflow: auto;
  }

  .menu__content {
    z-index: 30;
  }
</style>
