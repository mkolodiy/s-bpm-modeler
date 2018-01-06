<template>
  <div class="SubjectProperties">
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
          <v-checkbox label="Start subject"
                      v-model="properties.startSubject"
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
    name: 'SubjectProperties',
    data () {
      return {
        properties: {
          name: null,
          startSubject: false
        }
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
