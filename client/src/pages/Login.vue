<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm12 md4 offset-md4 class="mb-5">
        <v-card>
          <v-card-title class="display-2 primary card-title">Login</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <form id="loginForm" method="post" @submit.prevent="onSubmit()">
              <v-text-field
                name="email"
                label="Email"
                id="email"
                type="email"
                required
                v-model="user.email"
              ></v-text-field>
              <v-text-field
                name="password"
                label="Password"
                id="password"
                type="password"
                required
                v-model="user.password"
              ></v-text-field>
            </form>
          </v-card-text>
          <v-card-actions>
            <v-btn block primary type="submit" form="loginForm">Log in</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md4 offset-md4 class="mb-5">
        <div class="subheading mb-3">Need an account?</div>
        <v-btn block primary to="/register">Create a new account</v-btn>
      </v-flex>
      <v-flex xs12 sm12 md4 offset-md4 class="mb-5">
        <v-divider class="mb-3"></v-divider>
        <div class="text-xs-center"><v-btn outline to="/">Return to home page</v-btn></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    name: 'Login',
    data () {
      return {
        user: {
          email: null,
          password: null,
          strategy: 'local'
        }
      }
    },
    methods: {
      ...mapActions('auth', ['login']),
      onSubmit () {
        this.login(this.user)
          .then(response => {
            this.$router.replace({path: '/main/dashboard'})
          })
          .catch(() => {
            this.sendNotification('Login failed', 'The email address or password you entered is incorrect.', 'error')
          })
      },
      sendNotification (title, text, type) {
        this.$notify({
          title: title,
          text: text,
          group: 'v-notifications',
          type: type
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card-title {
    color: #ffffff;
  }
</style>
