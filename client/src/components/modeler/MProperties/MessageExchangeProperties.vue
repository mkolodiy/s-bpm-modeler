<template>
  <div class="MessageExchangeProperties">
    <v-container fluid class="pa-0 ma-0">
      <v-layout wrap row>
        <v-flex xs12>
          <v-checkbox label="Bidirectional"
                      v-model="properties.isBidirectional"
                      color="primary"
                      class="pa-0"></v-checkbox>
        </v-flex>
        <v-flex xs12 class="mb-3">
          <v-card flat>
            <v-card-title class="subheading pa-0 ma-0">
              <span>Source</span>
              <span>&nbsp;<i class="fa fa-long-arrow-right" aria-hidden="true"></i>&nbsp;</span>
              <span>Target</span>
            </v-card-title>
            <v-card-text class="pa-0 ma-0">
              <v-btn primary block @click="showManageMessageSpecificationsDialog(true)">Manage</v-btn>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 v-if="properties.isBidirectional">
          <v-card flat>
            <v-card-title class="subheading pa-0 ma-0">
              <span>Source</span>
              <span>&nbsp;<i class="fa fa-long-arrow-left" aria-hidden="true"></i>&nbsp;</span>
              <span>Target</span>
            </v-card-title>
            <v-card-text class="pa-0 ma-0">
              <v-btn primary block @click="showManageMessageSpecificationsDialog(false)">Manage</v-btn>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <manage-message-specifications-dialog ref="manageMessageSpecificationsDialog" :sourceToTarget="sourceToTarget" :properties="properties"></manage-message-specifications-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import jointService from '@/joint-services/joint-service'
  import ManageMessageSpecificationsDialog from '@/components/modeler/MProperties/dialogs/ManageMessageSpecificationsDialog'
  export default {
    name: 'MessageExchangeProperties',
    components: {ManageMessageSpecificationsDialog},
    data () {
      return {
        properties: {
          isBidirectional: false
        },
        sourceToTarget: false
      }
    },
    computed: {
      ...mapGetters('modeler', ['currentSelectedElement'])
    },
    methods: {
      setProperties () {
        Object.keys(this.currentSelectedElement.customAttrs).forEach(key => {
          this.properties[key] = this.currentSelectedElement.customAttrs[key]
        })
      },
      showManageMessageSpecificationsDialog (sourceToTarget) {
        this.sourceToTarget = sourceToTarget
        this.$refs.manageMessageSpecificationsDialog.show()
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
      currentSelectedElement (newVal) {
        this.setProperties()
      }
    },
    mounted () {
      this.setProperties()
    }
  }
</script>

<style lang="scss" scoped>
</style>
