<template>
  <div class="DActionExportDialog">
    <v-card class="mb-3">
      <v-toolbar dark dense flat class="primary">
        <v-toolbar-title class="subheading">Actions</v-toolbar-title>
      </v-toolbar>
      <v-card-actions>
        <v-btn primary @click.stop="showDActionsImportDialog()"><v-icon dark left>fa-upload</v-icon>Import</v-btn>
        <v-btn primary @click.stop="showDActionsExportDialog()"><v-icon dark left>fa-download</v-icon>Export</v-btn>
      </v-card-actions>
    </v-card>

    <d-actions-export-dialog ref="dActionsExportDialog" class="pa-0 ma-0"></d-actions-export-dialog>
    <d-actions-import-dialog ref="dActionsImportDialog" class="pa-0 ma-0"></d-actions-import-dialog>
  </div>
</template>

<script>
  import rdflibService from '@/rdflib-services/rdflib-service'
  import DActionsExportDialog from '@/components/dashboard/DActions/dialogs/DActionsExportDialog'
  import DActionsImportDialog from '@/components/dashboard/DActions/dialogs/DActionsImportDialog'
  export default {
    name: 'DActions',
    components: {DActionsExportDialog, DActionsImportDialog},
    methods: {
      showDActionsExportDialog () {
        this.$refs.dActionsExportDialog.show()
      },
      showDActionsImportDialog () {
        this.$refs.dActionsImportDialog.show()
      }
    },
    mounted () {
      rdflibService.initialize()
    }
  }
</script>

<style lang="scss" scoped>
</style>
