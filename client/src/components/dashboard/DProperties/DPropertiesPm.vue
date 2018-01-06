<template>
  <v-container class="pa-0 ma-0 DPropertiesPm__container">
    <v-layout wrap row>
      <v-flex xs12>
        <form id="pmPropertiesForm" method="post" @submit.prevent="onSubmit()">
          <v-text-field
            name="name"
            label="Name"
            id="name"
            type="text"
            required
            v-model="name"
          ></v-text-field>
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
            v-if="processGroup"
          ></v-select>
        </form>
      </v-flex>
      <v-flex xs12 class="text-xs-right">
        <v-btn primary flat type="submit" form="pmPropertiesForm" class="mt-0 mb-0">Save</v-btn>
        <v-btn error flat class="mt-0 mb-0 mr-0" @click="close()">Close</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'DPropertiesPm',
    watch: {
      currentSelection () {
        this.setProcessModelProperties()
      },
      processGroup (newVal) {
        this.watchProcessGroup(newVal)
      }
    },
    mounted () {
      this.setProcessModelProperties()
    },
    data () {
      return {
        name: null,
        processGroup: null,
        processModel: null,
        selectedProcessModel: null
      }
    },
    computed: {
      ...mapGetters('processGroups', ['selectReadyProcessGroups']),
      ...mapGetters('processModels', ['getProcessModelById', 'selectReadyProcessModels']),
      ...mapGetters('common', ['currentSelection'])
    },
    methods: {
      ...mapActions('processModels', ['patchProcessModel']),
      ...mapActions('common', ['generateTreeData', 'setCurrentSelection', 'generateBreadcrumbsData']),
      onSubmit () {
        let parent = null

        if (this.processModel) {
          parent = this.processModel
        } else {
          parent = this.processGroup
        }

        const processModel = {
          id: this.selectedProcessModel._id.toString(),
          body: {
            name: this.name,
            processGroup: this.processGroup,
            parent: parent
          }
        }

        this.patchProcessModel(processModel)
          .then(() => {
            this.setCurrentSelection({
              itemType: 'processModel',
              itemName: this.name,
              itemId: this.selectedProcessModel._id.toString()
            })
            this.generateTreeData()
            this.generateBreadcrumbsData()
            this.close()
            this.sendNotification('Saved', 'Process model updated successfully.', 'success')
          })
      },
      setProcessModelProperties () {
        if (this.currentSelection && this.currentSelection.itemType === 'processModel') {
          this.selectedProcessModel = this.getProcessModelById(this.currentSelection.itemId)
          this.name = this.selectedProcessModel.name
          this.processGroup = this.selectedProcessModel.processGroup.toString()
          if (this.selectedProcessModel.processGroup.toString() !== this.selectedProcessModel.parent.toString()) {
            this.processModel = this.selectedProcessModel.parent.toString()
          }
        }
      },
      close () {
        this.setCurrentSelection(null)
      },
      getSelectReadyProcessModels () {
        const payload = {
          processGroupId: this.processGroup,
          processModelId: this.selectedProcessModel._id.toString()
        }
        return this.selectReadyProcessModels(payload)
      },
      watchProcessGroup (newVal) {
        if (this.selectedProcessModel.processGroup !== newVal) {
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
