<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm12 md4 offset-md4 class="mb-5">
        <v-card>
          <v-card-title class="display-2 primary card-title">Registration</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <form id="registrationForm" method="post" @submit.prevent="onSubmit()">
              <v-text-field
                name="firstName"
                label="First name"
                id="firstName"
                type="text"
                required
                v-model="user.firstName"
              ></v-text-field>
              <v-text-field
                name="lastName"
                label="Last name"
                id="lastName"
                type="text"
                required
                v-model="user.lastName"
              ></v-text-field>
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
            <v-btn block primary type="submit" form="registrationForm">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md4 offset-md4 class="mb-5">
        <div class="subheading mb-3">Already have an account?</div>
        <v-btn block primary to="/login">Go to login page</v-btn>
      </v-flex>
      <v-flex xs12 sm12 md4 offset-md4 class="mb-5">
        <v-divider class="mb-3"></v-divider>
        <div class="text-xs-center">
          <v-btn outline to="/">Return to home page</v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    name: 'Registration',
    data () {
      return {
        user: {
          firstName: null,
          lastName: null,
          email: null,
          password: null
        }
      }
    },
    methods: {
      ...mapActions('auth', ['register']),
      onSubmit () {
        this.register(this.user)
          .then(response => {
            this.sendNotification('Registration successful', null, 'success')
            this.$router.replace({path: '/login'})
          })
          .catch(error => {
            this.sendNotification('Registration failed', error.message, 'error')
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
