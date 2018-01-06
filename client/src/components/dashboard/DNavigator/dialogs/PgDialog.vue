<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex>
        <v-dialog v-model="isOpen">
          <v-card>
            <v-card-title class="headline">
              Process group
            </v-card-title>
            <v-card-text>
              <form id="pgDialogForm" method="post" @submit.prevent="onSubmit()">
                <v-text-field
                  name="name"
                  label="Name"
                  id="name"
                  type="text"
                  required
                  v-model="name"
                ></v-text-field>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat primary type="submit" form="pgDialogForm">Create</v-btn>
              <v-btn flat error @click.native="hide()">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    name: 'PgDialog',
    data () {
      return {
        isOpen: false,
        name: null
      }
    },
    methods: {
      ...mapActions('processGroups', ['createProcessGroup']),
      ...mapActions('common', ['generateTreeData']),
      clearData () {
        this.name = null
      },
      onSubmit () {
        this.createProcessGroup({name: this.name})
          .then(() => {
            this.generateTreeData()
            this.clearData()
            this.hide()
            this.sendNotification('Creation successful', 'Process group was created successfully.', 'success')
          })
          .catch(error => {
            this.sendNotification('Creation failed', error.message, 'error')
          })
      },
      show () {
        this.isOpen = true
      },
      hide () {
        this.isOpen = false
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
</style>
