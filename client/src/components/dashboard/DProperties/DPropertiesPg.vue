<template>
  <v-container class="pa-0 ma-0 DPropertiesPg__container">
    <v-layout wrap row>
      <v-flex xs12>
        <form id="pgPropertiesForm" method="post" @submit.prevent="onSubmit()">
          <v-text-field
            name="name"
            label="Name"
            id="name"
            type="text"
            required
            v-model="name"
          ></v-text-field>
        </form>
      </v-flex>
      <v-flex xs12 class="text-xs-right">
        <v-btn primary flat type="submit" form="pgPropertiesForm" class="mt-0 mb-0">Save</v-btn>
        <v-btn error flat class="mt-0 mb-0 mr-0" @click="close()">Close</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'DPropertiesPg',
    watch: {
      currentSelection () {
        this.setProcessGroupProperties()
      }
    },
    mounted () {
      this.setProcessGroupProperties()
    },
    data () {
      return {
        name: null,
        selectedProcessGroup: null
      }
    },
    computed: {
      ...mapGetters('processGroups', ['getProcessGroupById']),
      ...mapGetters('common', ['currentSelection'])
    },
    methods: {
      ...mapActions('processGroups', ['patchProcessGroup']),
      ...mapActions('common', ['generateTreeData', 'setCurrentSelection', 'generateBreadcrumbsData']),
      onSubmit () {
        const processGroup = {
          id: this.selectedProcessGroup._id.toString(),
          body: {name: this.name}
        }
        this.patchProcessGroup(processGroup)
          .then(() => {
            this.setCurrentSelection({
              itemType: 'processGroup',
              itemName: this.name,
              itemId: this.selectedProcessGroup._id.toString()
            })
            this.generateTreeData()
            this.generateBreadcrumbsData()
            this.close()
            this.sendNotification('Saved', 'Process group updated successfully.', 'success')
          })
      },
      setProcessGroupProperties () {
        if (this.currentSelection && this.currentSelection.itemType === 'processGroup') {
          this.selectedProcessGroup = this.getProcessGroupById(this.currentSelection.itemId)
          this.name = this.selectedProcessGroup.name
        }
      },
      close () {
        this.setCurrentSelection(null)
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
  .DPropertiesPg__container {
    max-width: 100%;
    width: 100%;
  }
</style>
