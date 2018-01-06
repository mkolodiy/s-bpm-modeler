<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex>
        <v-dialog v-model="isOpen">
          <v-card>
            <v-card-title class="headline">
              Process layer
            </v-card-title>
            <v-card-text>
              <form id="plDialogForm" method="post" @submit.prevent="onSubmit()">
                <v-text-field
                  name="name"
                  label="Name"
                  id="name"
                  type="text"
                  required
                  v-model="name"
                ></v-text-field>
                <v-select
                  :items="layerTypes"
                  v-model="layerType"
                  label="Layer type"
                  bottom
                  required
                ></v-select>
                <v-select
                  :items="selectReadyProcessGroups"
                  v-model="processGroup"
                  label="Process group"
                  bottom
                  required
                ></v-select>
                <v-select
                  :items="getSelectReadyProcessModels()"
                  v-model="processModel"
                  label="Process model"
                  bottom
                  required
                  v-if="processGroup"
                ></v-select>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat primary type="submit" form="plDialogForm">Create</v-btn>
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
        layerType: null,
        processGroup: null,
        processModel: null,
        layerTypes: [
          {text: 'base', value: 'base'},
          {text: 'abstract', value: 'abstract'},
          {text: 'extension', value: 'extension'},
          {text: 'guard', value: 'guard'}
        ]
      }
    },
    computed: {
      ...mapGetters('processGroups', ['selectReadyProcessGroups']),
      ...mapGetters('processModels', ['selectReadyProcessModels'])
    },
    methods: {
      ...mapActions('processLayers', ['createProcessLayer']),
      ...mapActions('common', ['generateTreeData']),
      clearData () {
        this.name = null
        this.layerType = null
        this.processGroup = null
        this.processModel = null
      },
      onSubmit () {
        const processLayer = {
          name: this.name,
          layerType: this.layerType,
          processGroup: this.processGroup,
          parent: this.processModel
        }

        this.createProcessLayer(processLayer)
          .then(() => {
            this.generateTreeData()
            this.clearData()
            this.hide()
            this.sendNotification('Creation successful', 'Process model was created successfully.', 'success')
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
