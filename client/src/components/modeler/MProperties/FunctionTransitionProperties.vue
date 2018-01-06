<template>
  <div class="FunctionTransitionProperties">
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
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import jointService from '@/joint-services/joint-service'
  export default {
    name: 'FunctionTransitionProperties',
    data () {
      return {
        properties: {
          name: null
        }
      }
    },
    computed: {
      ...mapGetters('modeler', ['currentSelectedElement']),
      ...mapGetters('subjects', ['subjects']),
      ...mapGetters('messageSpecifications', ['messageSpecifications']),
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
