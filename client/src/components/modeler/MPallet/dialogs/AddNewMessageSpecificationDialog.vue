<template>
  <div>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex>
          <modal name="addNewMessageSpecificationDialog" width="300px" height="235px">
            <v-card class="AddNewMessageSpecificationDialog__card">
              <v-card-title class="headline">
                {{createTitleText()}}
              </v-card-title>
              <v-card-text>
                <form id="addNewMessageSpecificationDialogForm" method="post" @submit.prevent="onSubmit()">
                  <v-text-field
                    name="name"
                    label="Name"
                    id="name"
                    type="text"
                    required
                    v-model="messageSpecification.name"
                  ></v-text-field>
                </form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat primary type="submit" form="addNewMessageSpecificationDialogForm">{{createSaveBtnText()}}</v-btn>
                <v-btn flat error @click.native="hide()">Close</v-btn>
              </v-card-actions>
            </v-card>
          </modal>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    name: 'AddNewMessageSpecificationDialog',
    props: {
      createNewMessageSpecification: Boolean,
      messageSpecification: Object
    },
    computed: {
      ...mapGetters('modeler', ['currentSelectedProcessLayer'])
    },
    methods: {
      ...mapActions('messageSpecifications', ['createMessageSpecification', 'patchMessageSpecification']),
      onSubmit () {
        if (this.createNewMessageSpecification) {
          this.createMessageSpecification({
            name: this.messageSpecification.name,
            parent: this.currentSelectedProcessLayer
          }).then(() => {
            this.hide()
            this.sendNotification('Creation successful', 'Message specification was created successfully.', 'success')
          })
            .catch(error => {
              this.sendNotification('Creation failed', error.message, 'error')
            })
        } else {
          this.patchMessageSpecification({
            id: this.messageSpecification.id,
            body: {
              name: this.messageSpecification.name,
              parent: this.currentSelectedProcessLayer
            }
          }).then(() => {
            this.hide()
            this.sendNotification('Saved', 'Message specification was updated successfully.', 'success')
          })
            .catch(error => {
              this.sendNotification('Creation failed', error.message, 'error')
            })
        }
      },
      createTitleText () {
        let text = null
        if (this.createNewMessageSpecification) {
          text = 'Add new'
        } else {
          text = 'Update'
        }
        return text
      },
      createSaveBtnText () {
        let text = null
        if (this.createNewMessageSpecification) {
          text = 'Create'
        } else {
          text = 'Save'
        }
        return text
      },
      show () {
        this.$modal.show('addNewMessageSpecificationDialog')
      },
      hide () {
        this.$modal.hide('addNewMessageSpecificationDialog')
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
  .AddNewMessageSpecificationDialog__card {
    height: 100% !important;
  }
</style>
