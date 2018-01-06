<template>
  <v-card class="mb-3">
    <v-toolbar dark dense flat class="primary">
      <v-toolbar-title class="subheading">Current selection</v-toolbar-title>
    </v-toolbar>
    <v-card-text class="DCurrentSelection__card-text">
      <div v-if="isCSEmpty">
        <v-breadcrumbs divider="/" class="DCurrentSelection__breadcrumbs" :style="{width: breadcrumbsLength}">
          <v-breadcrumbs-item @click="selectItem(breadcrumb)"
            v-for="breadcrumb in breadcrumbsData" :key="breadcrumb.itemId" >
            {{ breadcrumb.itemName }}
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </div>
      <div class="DCurrentSelection__no-selection" v-else>Nothing selected</div>
    </v-card-text>
  </v-card>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    name: 'DCurrentSelection',
    computed: {
      ...mapGetters('common', ['currentSelection', 'breadcrumbsData']),
      isCSEmpty () {
        return this.currentSelection
      },
      breadcrumbsLength () {
        if (this.breadcrumbsData.length < 7) {
          return 100 + '%'
        } else {
          return (this.breadcrumbsData.length * 10) + 'rem'
        }
      }
    },
    methods: {
      ...mapActions('common', ['setCurrentSelection', 'generateBreadcrumbsData']),
      selectItem (item) {
        this.setCurrentSelection(item)
        this.generateBreadcrumbsData()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .DCurrentSelection__card-text {
    padding: 0.44rem;
    overflow: auto;
  }

  .DCurrentSelection__breadcrumbs {
    justify-content: flex-start;
    padding: 0;
  }

  .DCurrentSelection__no-selection {
    padding: 0.65rem;
  }
</style>
