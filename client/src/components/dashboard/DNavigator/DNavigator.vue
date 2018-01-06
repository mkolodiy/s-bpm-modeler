<template>
  <div>
    <v-card class="mb-3">
      <v-toolbar dark dense flat class="primary">
        <v-toolbar-title class="subheading">Navigator</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu left class="mr-0">
          <v-btn icon slot="activator"><v-icon>fa-plus</v-icon></v-btn>
          <v-list>
            <v-list-tile @click="showPgDialog()">
              <v-list-tile-title>Process Group</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="showPmDialog()">
              <v-list-tile-title>Process Model</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="showPlDialog()">
              <v-list-tile-title>Process Layer</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-card-text>
        <div v-if="treeDataEmpty">No data available</div>
        <div v-else>
         <d-navigator-item v-for="item in treeData" :key="item.id" :item="item" :firstLevel="true"></d-navigator-item>
        </div>
      </v-card-text>
    </v-card>

    <pg-dialog ref="pgDialog" class="pa-0 ma-0"></pg-dialog>
    <pm-dialog ref="pmDialog" class="pa-0 ma-0"></pm-dialog>
    <pl-dialog ref="plDialog" class="pa-0 ma-0"></pl-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import DNavigatorItem from '@/components/dashboard/DNavigator/DNavigatorItem'
  import PgDialog from '@/components/dashboard/DNavigator/dialogs/PgDialog'
  import PmDialog from '@/components/dashboard/DNavigator/dialogs/PmDialog'
  import PlDialog from '@/components/dashboard/DNavigator/dialogs/PlDialog'
  export default {
    name: 'DNavigator',
    components: {
      DNavigatorItem,
      PgDialog,
      PmDialog,
      PlDialog
    },
    computed: {
      ...mapGetters('common', ['treeData']),
      treeDataEmpty () {
        return this.treeData.length === 0
      }
    },
    methods: {
      showPgDialog () {
        this.$refs.pgDialog.show()
      },
      showPmDialog () {
        this.$refs.pmDialog.show()
      },
      showPlDialog () {
        this.$refs.plDialog.show()
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
