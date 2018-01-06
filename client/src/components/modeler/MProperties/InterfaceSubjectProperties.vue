<template>
  <div class="InterfaceSubjectProperties">
    <v-container fluid class="pa-0 ma-0">
      <v-layout wrap row>
        <v-flex xs12>
          <v-text-field
            name="name"
            label="Name"
            id="name"
            type="text"
            required
            v-model="properties.name"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-layout wrap row>
            <v-flex xs10>
              <v-text-field
                name="reference"
                id="reference"
                label="Reference"
                type="text"
                required
                v-model="referenceName"
                disabled
              ></v-text-field>
            </v-flex>
            <v-flex xs2 class="InterfaceSubjectProperties__reference-edit-btn">
              <v-btn icon @click="showInterfaceSubjectReferenceDialog()"><v-icon>fa-pencil</v-icon></v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <interface-subject-reference-dialog ref="interfaceSubjectReferenceDialog"></interface-subject-reference-dialog>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import jointService from '@/joint-services/joint-service'
  import InterfaceSubjectReferenceDialog from '@/components/modeler/MProperties/dialogs/InterfaceSubjectReferenceDialog'
  export default {
    name: 'InterfaceSubjectProperties',
    components: {InterfaceSubjectReferenceDialog},
    data () {
      return {
        properties: {
          name: null,
          reference: null
        },
        referenceName: null
      }
    },
    computed: {
      ...mapGetters('modeler', ['currentSelectedElement'])
    },
    methods: {
      ...mapActions('subjects', ['fetchSubjectById']),
      setProperties () {
        Object.keys(this.currentSelectedElement.customAttrs).forEach(key => {
          this.properties[key] = this.currentSelectedElement.customAttrs[key]
        })
      },
      showInterfaceSubjectReferenceDialog () {
        this.$refs.interfaceSubjectReferenceDialog.show()
      },
      getReferenceName () {
        if (this.properties.reference !== null) {
          const payload = {
            id: this.properties.reference
          }
          this.fetchSubjectById(payload).then(result => {
            this.referenceName = result.name
          })
        }
      }
    },
    watch: {
      properties: {
        handler (val) {
          // TODO Check that fields are not empty
          jointService.updateElement(val)
          this.getReferenceName()
        },
        deep: true
      },
      currentSelectedElement: {
        handler (val) {
          this.setProperties()
        },
        deep: true
      }
    },
    mounted () {
      this.setProperties()
    }
  }
</script>

<style lang="scss" scoped>
  .InterfaceSubjectProperties__reference-edit-btn {
    padding-top: 15px;
  }
</style>
