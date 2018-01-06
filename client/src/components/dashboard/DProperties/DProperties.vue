<template>
  <v-card class="mb-3">
    <v-toolbar dark dense flat class="primary">
      <v-toolbar-title class="subheading">Properties</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text>
      <div v-show="isPg">
        <d-properties-pg></d-properties-pg>
      </div>
      <div v-show="isPm">
        <d-properties-pm></d-properties-pm>
      </div>
      <div v-show="isPl">
        <d-properties-pl></d-properties-pl>
      </div>
      <div class="DCurrentSelection__no-selection" v-if="!isCSEmpty">Nothing selected</div>
    </v-card-text>
  </v-card>
</template>

<script>
  import {mapGetters} from 'vuex'
  import DPropertiesPg from '@/components/dashboard/DProperties/DPropertiesPg'
  import DPropertiesPm from '@/components/dashboard/DProperties/DPropertiesPm'
  import DPropertiesPl from '@/components/dashboard/DProperties/DPropertiesPl'
  export default {
    name: 'DProperties',
    components: {DPropertiesPg, DPropertiesPm, DPropertiesPl},
    computed: {
      ...mapGetters('common', ['currentSelection', 'breadcrumbsData']),
      isPg () {
        return this.currentSelection && this.currentSelection.itemType === 'processGroup'
      },
      isPm () {
        return this.currentSelection && this.currentSelection.itemType === 'processModel'
      },
      isPl () {
        return this.currentSelection && this.currentSelection.itemType === 'processLayer'
      },
      isCSEmpty () {
        return this.currentSelection
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
