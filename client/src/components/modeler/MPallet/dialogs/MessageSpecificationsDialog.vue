<template>
  <div>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex>
          <modal name="messageSpecificationsDialog" height="600px" width="500px">
            <v-card class="MessageSpecificationsDialog__card">
              <v-toolbar dark dense flat class="primary">
                <v-toolbar-title class="subheading">Message specifications</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn flat icon @click="showAddNewMessageSpecificationDialog(true)"><v-icon>fa-plus</v-icon></v-btn>
              </v-toolbar>
              <v-card-text class="MessageSpecificationsDialog__card-text">
                <div>
                  <div v-for="messageSpecification in messageSpecifications" v-if="!messageSpecificationsEmpty">
                    <v-layout row wrap>
                      <v-flex xs10>
                        <div>{{messageSpecification.name}}</div>
                      </v-flex>
                      <v-flex xs2>
                        <v-icon class="MessageSpecificationsDialog__card-action-icon" @click="removeMessageSpecification(messageSpecification._id.toString())">
                          fa-trash
                        </v-icon>
                        <v-icon class="MessageSpecificationsDialog__card-action-icon" @click="showAddNewMessageSpecificationDialog(false, messageSpecification)">fa-pencil</v-icon>
                      </v-flex>
                      <v-flex class="pt-2 pb-2">
                        <v-divider></v-divider>
                      </v-flex>
                    </v-layout>
                  </div>
                  <div v-if="messageSpecificationsEmpty">
                    No data available
                  </div>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn error @click.native="hide()">Close</v-btn>
              </v-card-actions>
            </v-card>
          </modal>
        </v-flex>
      </v-layout>
    </v-container>
    <add-new-message-specification-dialog
      ref="addNewMessageSpecificationDialog"
      :createNewMessageSpecification="createNewMessageSpecification"
      :messageSpecification="messageSpecification"></add-new-message-specification-dialog>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import AddNewMessageSpecificationDialog from '@/components/modeler/MPallet/dialogs/AddNewMessageSpecificationDialog'
  export default {
    name: 'MessageSpecificationsDialog',
    components: {AddNewMessageSpecificationDialog},
    data () {
      return {
        createNewMessageSpecification: false,
        messageSpecification: {}
      }
    },
    computed: {
      ...mapGetters('messageSpecifications', ['messageSpecifications']),
      messageSpecificationsEmpty () {
        return this.messageSpecifications.length === 0
      }
    },
    methods: {
      ...mapActions('messageSpecifications', ['removeMessageSpecification']),
      showAddNewMessageSpecificationDialog (createNewMessageSpecification, messageSpecification) {
        if (typeof messageSpecification !== 'undefined') {
          this.messageSpecification = {
            id: messageSpecification._id.toString(),
            name: messageSpecification.name
          }
        } else {
          this.messageSpecification = {
            id: '',
            name: ''
          }
        }
        this.createNewMessageSpecification = createNewMessageSpecification
        this.$refs.addNewMessageSpecificationDialog.show()
      },
      show () {
        this.$modal.show('messageSpecificationsDialog')
      },
      hide () {
        this.$modal.hide('messageSpecificationsDialog')
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
  .MessageSpecificationsDialog__card {
    height: 100% !important;
  }

  .MessageSpecificationsDialog__card-text {
    overflow: auto;
    height: 500px !important;
  }

  .MessageSpecificationsDialog__card-action-icon {
    font-size: 1.5em;
    width: 1.8rem;
    cursor: pointer;
    float: right;
  }
</style>
