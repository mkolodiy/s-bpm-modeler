<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex>
        <v-dialog v-model="isOpen">
          <v-card>
            <v-card-title class="headline">
              Process model
            </v-card-title>
            <v-card-text>
              <form id="pmDialogForm" method="post" @submit.prevent="onSubmit()">
                <v-text-field
                  name="name"
                  label="Name"
                  id="name"
                  type="text"
                  required
                  v-model="name"
                ></v-text-field>
                <div>
                  <v-select
                    :items="selectReadyProcessGroups"
                    v-model="processGroup"
                    label="Process group"
                    bottom
                    required
                  ></v-select>
                </div>
                <v-select
                  :items="getSelectReadyProcessModels()"
                  v-model="processModel"
                  label="Process model"
                  bottom
                  v-if="processGroup"
                ></v-select>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat primary type="submit" form="pmDialogForm">Create</v-btn>
              <v-btn flat error @click.native="hide()">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'PmDialog',
    data () {
      return {
        isOpen: false,
        name: null,
        processGroup: null,
        processModel: null
      }
    },
    watch: {
      processGroup () {
        this.processModel = null
      }
    },
    computed: {
      ...mapGetters('processGroups', ['selectReadyProcessGroups']),
      ...mapGetters('processModels', ['selectReadyProcessModels'])
    },
    methods: {
      ...mapActions('processModels', ['createProcessModel']),
      ...mapActions('processLayers', ['createProcessLayer']),
      ...mapActions('common', ['generateTreeData']),
      clearData () {
        this.name = null
        this.processGroup = null
        this.processModel = null
      },
      onSubmit () {
        let parent = null

        if (this.processModel) {
          parent = this.processModel
        } else {
          parent = this.processGroup
        }

        const processModel = {
          name: this.name,
          processGroup: this.processGroup,
          parent: parent
        }

        this.createProcessModel(processModel)
          .then(result => {
            return this.createProcessLayer({
              name: 'Base layer',
              layerType: 'base',
              processGroup: this.processGroup,
              parent: result._id.toString()
            })
          })
          .then(() => {
            this.generateTreeData()
            this.clearData()
            this.hide()
            this.sendNotification('Creation successful', 'Process layer was created successfully.', 'success')
          })
          .catch(error => {
            this.sendNotification('Creation failed', error.message, 'error')
          })
      },
      getSelectReadyProcessModels () {
        const payload = {
          processGroupId: this.processGroup
        }
        return this.selectReadyProcessModels(payload)
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
