<template>
  <div class="InterfaceSubjectReferenceDialog">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex>
          <modal name="interfaceSubjectReferenceDialog" height="500px" width="400px">
            <v-card class="InterfaceSubjectReferenceDialog__card">
              <v-toolbar dark dense flat class="primary">
                <v-toolbar-title class="subheading">Select reference subject</v-toolbar-title>
              </v-toolbar>
              <v-card-text class="InterfaceSubjectReferenceDialog__card-text">
                <v-select
                  :items="selectReadyProcessGroups"
                  v-model="processGroup"
                  label="Process group"
                  bottom
                ></v-select>
                <v-select
                  :items="getSelectReadyProcessModels()"
                  v-model="processModel"
                  label="Process model"
                  bottom
                  v-if="processGroup"
                ></v-select>
                <v-select
                  :items="getSelectReadyProcessLayers()"
                  v-model="processLayer"
                  label="Process layer"
                  bottom
                  v-if="processModel"
                ></v-select>
                <v-select
                  :items="selectableSubjects"
                  v-model="subject"
                  label="Subject (Reference)"
                  bottom
                  v-if="processLayer"
                ></v-select>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn primary :disabled="subjectIsNull" @click="onSelect()">Select</v-btn>
                <v-btn error @click="hide()">Close</v-btn>
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
  import jointService from '@/joint-services/joint-service'
  export default {
    name: 'InterfaceSubjectReferenceDialog',
    data () {
      return {
        properties: {
          reference: null
        },
        processGroup: null,
        processModel: null,
        processLayer: null,
        subject: null,
        selectableSubjects: []
      }
    },
    computed: {
      ...mapGetters('modeler', ['currentSelectedElement']),
      ...mapGetters('processGroups', ['selectReadyProcessGroups']),
      ...mapGetters('processModels', ['selectReadyProcessModels']),
      ...mapGetters('processLayers', ['selectReadyProcessLayers']),
      subjectIsNull () {
        return this.subject === null
      }
    },
    methods: {
      ...mapActions('subjects', ['fetchSubjectsByLayerId']),
      setProperties () {
        Object.keys(this.currentSelectedElement.customAttrs).forEach(key => {
          this.properties[key] = this.currentSelectedElement.customAttrs[key]
        })
      },
      show () {
        this.$modal.show('interfaceSubjectReferenceDialog')
      },
      hide () {
        this.$modal.hide('interfaceSubjectReferenceDialog')
      },
      getSelectReadyProcessModels () {
        const payload = {
          processGroupId: this.processGroup
        }
        return this.selectReadyProcessModels(payload)
      },
      getSelectReadyProcessLayers () {
        const payload = {
          processModelId: this.processModel
        }
        return this.selectReadyProcessLayers(payload)
      },
      getSelectReadySubjects () {
        const payload = {
          processLayerId: this.processLayer
        }
        this.fetchSubjectsByLayerId(payload).then(result => {
          this.selectableSubjects = result
        })
      },
      onSelect () {
        if (this.subject !== null) {
          this.properties.reference = this.subject
        }
        this.processGroup = null
        this.hide()
      }
    },
    watch: {
      properties: {
        handler (val) {
          // TODO Check that fields are not empty
          jointService.updateElement(val)
        },
        deep: true
      },
      currentSelectedElement () {
        this.setProperties()
      },
      processGroup () {
        this.processModel = null
      },
      processModel () {
        this.processLayer = null
      },
      processLayer () {
        this.subject = null
        this.getSelectReadySubjects()
      }
    },
    mounted () {
      this.setProperties()
    }
  }
</script>

<style lang="scss" scoped>
  .InterfaceSubjectReferenceDialog__card {
    height: 100% !important;
  }

  .InterfaceSubjectReferenceDialog__card-text {
    height: 400px !important;
  }
</style>
