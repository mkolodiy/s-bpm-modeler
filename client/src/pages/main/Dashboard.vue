<template>
  <div>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 sm12 md6>

          <d-actions></d-actions>

          <d-navigator></d-navigator>

        </v-flex>
        <v-flex xs12 sm12 md6>

          <d-current-selection></d-current-selection>

          <d-properties></d-properties>

        </v-flex>
      </v-layout>
    </v-container>
    <v-progress-loader v-if="dataLoading"></v-progress-loader>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import DActions from '@/components/dashboard/DActions/DActions'
  import DNavigator from '@/components/dashboard/DNavigator/DNavigator'
  import DCurrentSelection from '@/components/dashboard/DCurrentSelection'
  import DProperties from '@/components/dashboard/DProperties/DProperties'
  import VProgressLoader from '@/components/VProgressLoader'
  export default {
    name: 'Dashboard',
    components: {
      DActions,
      DNavigator,
      DCurrentSelection,
      DProperties,
      VProgressLoader
    },
    computed: {
      ...mapGetters('common', ['dataLoading'])
    }
  }
</script>

<style lang="scss" scoped>
  .VProgressLoader {
    top: 0;
  }
</style>
