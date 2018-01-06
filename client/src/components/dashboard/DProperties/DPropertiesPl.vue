<template>
  <v-container class="pa-0 ma-0 DPropertiesPm__container">
    <v-layout wrap row>
      <v-flex xs12>
        <form id="plPropertiesForm" method="post" @submit.prevent="onSubmit()">
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
      </v-flex>
      <v-flex xs12 class="text-xs-right">
        <v-btn primary flat type="submit" form="plPropertiesForm" class="mt-0 mb-0">Save</v-btn>
        <v-btn error flat class="mt-0 mb-0 mr-0" @click="close()">Close</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'DPropertiesPl',
    watch: {
      currentSelection () {
        this.setProcessLayerProperties()
      },
      processGroup (newVal) {
        this.watchProcessGroup(newVal)
      }
    },
    mounted () {
      this.setProcessLayerProperties()
    },
    data () {
      return {
        name: null,
        layerType: null,
        processGroup: null,
        processModel: null,
        selectedProcessLayer: null,
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
      ...mapGetters('processModels', ['selectReadyProcessModels']),
      ...mapGetters('processLayers', ['getProcessLayerById']),
      ...mapGetters('common', ['currentSelection'])
    },
    methods: {
      ...mapActions('processLayers', ['patchProcessLayer']),
      ...mapActions('common', ['generateTreeData', 'setCurrentSelection', 'generateBreadcrumbsData']),
      onSubmit () {
        const processLayer = {
          id: this.selectedProcessLayer._id.toString(),
          body: {
            name: this.name,
            layerType: this.layerType,
            processGroup: this.processGroup,
            parent: this.processModel
          }
        }

        this.patchProcessLayer(processLayer)
          .then(() => {
            this.setCurrentSelection({
              itemType: 'processLayer',
              itemName: this.name,
              itemId: this.selectedProcessLayer._id.toString()
            })
            this.generateTreeData()
            this.generateBreadcrumbsData()
            this.close()
            this.sendNotification('Saved', 'Process layer updated successfully.', 'success')
          })
      },
      setProcessLayerProperties () {
        if (this.currentSelection && this.currentSelection.itemType === 'processLayer') {
          this.selectedProcessLayer = this.getProcessLayerById(this.currentSelection.itemId)
          this.name = this.selectedProcessLayer.name
          this.layerType = this.selectedProcessLayer.layerType
          this.processGroup = this.selectedProcessLayer.processGroup.toString()
          this.processModel = this.selectedProcessLayer.parent.toString()
        }
      },
      close () {
        this.setCurrentSelection(null)
      },
      getSelectReadyProcessModels () {
        const payload = {
          processGroupId: this.processGroup
        }
        return this.selectReadyProcessModels(payload)
      },
      watchProcessGroup (newVal) {
        if (this.selectedProcessLayer.processGroup !== newVal) {
          this.processModel = null
        }
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
  .DPropertiesPm__container {
    max-width: 100%;
    width: 100%;
  }
</style>
