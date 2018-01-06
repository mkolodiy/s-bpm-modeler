<template>
  <div class="FunctionStateProperties">
    <v-container fluid class="pa-0 ma-0">
      <v-layout wrap row>
        <v-flex>
          <v-text-field
            name="name"
            label="Name"
            id="name"
            type="text"
            required
            v-model="properties.name"
          ></v-text-field>
          <v-checkbox label="Start state"
                      v-model="properties.startState"
                      color="primary"
                      class="pa-0"></v-checkbox>
          <v-checkbox label="End state"
                      v-model="properties.endState"
                      color="primary"
                      class="pa-0"></v-checkbox>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import jointService from '@/joint-services/joint-service'
  export default {
    name: 'FunctionStateProperties',
    data () {
      return {
        properties: {
          name: null,
          startState: false,
          endState: false
        }
      }
    },
    computed: {
      ...mapGetters('modeler', ['currentSelectedElement']),
      startState () {
        return this.properties.startState
      },
      endState () {
        return this.properties.endState
      }
    },
    methods: {
      setProperties () {
        Object.keys(this.currentSelectedElement.customAttrs).forEach(key => {
          this.properties[key] = this.currentSelectedElement.customAttrs[key]
        })
      }
    },
    watch: {
      startState (val) {
        if (val) {
          this.properties.endState = false
        }
      },
      endState (val) {
        if (val) {
          this.properties.startState = false
        }
      },
      properties: {
        handler (val) {
          // TODO Check that fields are not empty
          jointService.updateElement(val)
        },
        deep: true
      },
      currentSelectedElement () {
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
