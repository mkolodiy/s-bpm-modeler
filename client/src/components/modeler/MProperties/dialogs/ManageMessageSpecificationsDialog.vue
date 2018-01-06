<template>
  <div>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex>
          <modal name="manageMessageSpecificationsDialog" height="600px" width="800px">
            <v-card class="ManageMessageSpecificationsDialog__card">
              <v-toolbar dark dense flat class="primary">
                <v-toolbar-title class="subheading">Messages</v-toolbar-title>
              </v-toolbar>
              <v-card-text class="ManageMessageSpecificationsDialog__card-text">
                <v-layout wrap row>
                  <v-flex xs6 class="pa-0">
                    <div class="ManageMessageSpecificationsDialog__card-messages mr-1 pb-2">
                      <div class="subheading pa-2">Available message specifications</div>
                      <v-divider></v-divider>
                      <div class="ManageMessageSpecificationsDialog__card-messages--scroll">
                        <div v-for="messageSpecification in availableMessageSpecifications" v-if="!availableMessageSpecificationsEmpty" class="pt-2 pl-2 pr-2">
                          <v-layout row wrap>
                            <v-flex xs11>
                              <div>{{messageSpecification.name}}</div>
                            </v-flex>
                            <v-flex xs1>
                              <v-icon class="ManageMessageSpecificationsDialog__card-action-icon" @click="addMessageSpecification(messageSpecification)">fa-plus</v-icon>
                            </v-flex>
                          </v-layout>
                        </div>
                        <div v-if="availableMessageSpecificationsEmpty" class="pt-2 pl-2 pr-2">
                          No data available
                        </div>
                      </div>
                    </div>
                  </v-flex>
                  <v-flex xs6 class="pa-0">
                    <div class="ManageMessageSpecificationsDialog__card-messages ml-1 pb-2">
                      <div class="subheading pa-2">Added message specifications</div>
                      <v-divider></v-divider>
                      <div class="ManageMessageSpecificationsDialog__card-messages--scroll">
                        <div v-for="messageSpecification in addedMessageSpecifications" v-if="!addedMessageSpecificationsEmpty" class="pt-2 pl-2 pr-2">
                          <v-layout row wrap>
                            <v-flex xs11>
                              <div>{{messageSpecification.name}}</div>
                            </v-flex>
                            <v-flex xs1>
                              <v-icon class="ManageMessageSpecificationsDialog__card-action-icon" @click="removeMessageSpecification(messageSpecification)">fa-minus</v-icon>
                            </v-flex>
                          </v-layout>
                        </div>
                        <div v-if="addedMessageSpecificationsEmpty" class="pt-2 pl-2 pr-2">
                          No data available
                        </div>
                      </div>
                    </div>
                  </v-flex>
                </v-layout>
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
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import jointService from '@/joint-services/joint-service'
  export default {
    name: 'ManageMessageSpecificationsDialog',
    props: {
      sourceToTarget: Boolean
    },
    data () {
      return {
        properties: {
          sourceToTargetMessageSpecifications: [],
          targetToSourceMessageSpecifications: []
        },
        availableMessageSpecifications: []
      }
    },
    computed: {
      ...mapGetters('messageSpecifications', ['messageSpecifications', 'selectReadyMessageSpecifications']),
      ...mapGetters('modeler', ['currentSelectedElement']),
      availableMessageSpecificationsEmpty () {
        return this.availableMessageSpecifications.length === 0
      },
      addedMessageSpecificationsEmpty () {
        return this.addedMessageSpecifications.length === 0
      },
      addedMessageSpecifications () {
        if (this.sourceToTarget) {
          return this.properties.sourceToTargetMessageSpecifications
        } else {
          return this.properties.targetToSourceMessageSpecifications
        }
      }
    },
    watch: {
      sourceToTarget () {
        this.setProperties()
      },
      properties: {
        handler (val) {
          // TODO Check that fields are not empty
          jointService.updateElement(val)
        },
        deep: true
      }
    },
    methods: {
      addMessageSpecification (messageSpecification) {
        /** Remove messageSpecification from availableMessageSpecifications array */
        const index = this.availableMessageSpecifications.findIndex(el => {
          return el._id.toString() === messageSpecification._id.toString()
        })
        if (index !== -1) {
          this.availableMessageSpecifications.splice(index, 1)
        }

        /** Add messageSpecification to addedMessageSpecifications */
        this.addedMessageSpecifications.push(messageSpecification)
      },
      removeMessageSpecification (messageSpecification) {
        /** Remove messageSpecification from addedMessageSpecifications array */
        const index = this.addedMessageSpecifications.findIndex(el => {
          return el._id.toString() === messageSpecification._id.toString()
        })
        if (index !== -1) {
          this.addedMessageSpecifications.splice(index, 1)
        }

        /** Add messageSpecification to availableMessageSpecifications */
        this.availableMessageSpecifications.push(messageSpecification)
      },
      setProperties () {
        this.properties.sourceToTargetMessageSpecifications = this.currentSelectedElement.customAttrs.sourceToTargetMessageSpecifications
        this.properties.targetToSourceMessageSpecifications = this.currentSelectedElement.customAttrs.targetToSourceMessageSpecifications

        this.availableMessageSpecifications = this.messageSpecifications.filter(el1 => {
          const index = this.addedMessageSpecifications.findIndex(el2 => {
            return el1._id.toString() === el2._id.toString()
          })
          if (index === -1) {
            return el1
          }
        })
      },
      show () {
        this.$modal.show('manageMessageSpecificationsDialog')
      },
      hide () {
        this.$modal.hide('manageMessageSpecificationsDialog')
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
  .ManageMessageSpecificationsDialog__card {
    height: 100% !important;
  }

  .ManageMessageSpecificationsDialog__card-text {
    height: 500px !important;
  }

  .ManageMessageSpecificationsDialog__card-action-icon {
    font-size: 1.5em;
    width: 1.8rem;
    cursor: pointer;
    float: right;
  }

  .ManageMessageSpecificationsDialog__card-messages {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .ManageMessageSpecificationsDialog__card-messages--scroll {
    overflow: auto;
    height: 430px !important;
  }
</style>
