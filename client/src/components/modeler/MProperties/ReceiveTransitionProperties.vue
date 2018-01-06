<template>
  <div class="ReceiveTransitionProperties">
    <v-container fluid class="pa-0 ma-0">
      <v-layout wrap row>
        <v-flex>
          <v-select
            :items="allSubjects"
            item-text="name"
            item-value="_id"
            v-model="properties.subject"
            label="Sender of the message"
            bottom
            required
          ></v-select>
          <v-select
            :items="messageSpecifications"
            item-text="name"
            item-value="_id"
            v-model="properties.messageSpecification"
            label="Message to be send"
            bottom
            required
          ></v-select>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import jointService from '@/joint-services/joint-service'
  export default {
    name: 'ReceiveTransitionProperties',
    data () {
      return {
        properties: {
          subject: null,
          messageSpecification: null
        }
      }
    },
    computed: {
      ...mapGetters('modeler', ['currentSelectedElement']),
      ...mapGetters('subjects', ['subjects']),
      ...mapGetters('interfaceSubjects', ['interfaceSubjects']),
      ...mapGetters('messageSpecifications', ['messageSpecifications']),
      allSubjects () {
        return [].concat(this.subjects, this.interfaceSubjects)
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
