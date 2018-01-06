<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex>
        <v-dialog v-model="isOpen" width="500">
          <v-card>
            <v-card-title class="headline">
              Export
            </v-card-title>
            <v-card-text>
              <p class="body-2">Please select an ontology version*:</p>
              <v-checkbox class="pa-0" :label="'Standard S-BPM Ontology'" v-model="standardOnt" light></v-checkbox>
              <v-checkbox class="pa-0" :label="'Custom S-BPM Ontology'" v-model="customOnt" light></v-checkbox>
              <v-divider></v-divider>
              <p class="body-2 pt-3">Please select if visual representation should be included:</p>
              <v-checkbox class="pa-0" :label="'Include visual representation'" v-model="includeVisualRepresentation" light></v-checkbox>
              <v-divider></v-divider>
              <p class="body-2 pt-3">Please select one or multiple process groups*:</p>
              <v-select
                label="Process groups"
                :items="processGroups"
                v-model="data"
                multiple
                chips
                persistent-hint
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat primary @click.native="exportProcessGroups()">Export</v-btn>
              <v-btn flat error @click.native="hide()">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import rdflibService from '@/rdflib-services/rdflib-service'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    name: 'DActionsExportDialog',
    data () {
      return {
        isOpen: false,
        data: null,
        standardOnt: false,
        customOnt: false,
        includeVisualRepresentation: false
      }
    },
    computed: {
      ...mapGetters('processGroups', ['selectReadyProcessGroups']),
      processGroups () {
        return this.selectReadyProcessGroups.slice(1, this.selectReadyProcessGroups.length)
      }
    },
    methods: {
      ...mapActions('common', ['setDataLoading']),
      exportProcessGroups () {
        if ((this.standardOnt !== false || this.customOnt !== false) && this.data !== null) {
          rdflibService.export(this.standardOnt, this.customOnt, this.data, this.includeVisualRepresentation)
          this.setDataLoading(true)
          this.hide()
        }
      },
      reset () {
        this.data = []
        this.standardOnt = false
        this.customOnt = false
        this.includeVisualRepresentation = false
      },
      show () {
        this.isOpen = true
      },
      hide () {
        this.reset()
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
    },
    watch: {
      standardOnt (val) {
        if (val) {
          this.customOnt = false
        }
      },
      customOnt (val) {
        if (val) {
          this.standardOnt = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
