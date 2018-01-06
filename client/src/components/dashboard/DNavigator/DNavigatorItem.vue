<template>
  <div>
    <v-container fluid class="pa-0">
      <v-layout row wrap>
        <v-flex xs12>
          <v-container fluid class="pa-0">
            <v-layout row wrap>
              <v-flex x9>
                <div>
                  <v-icon class="DNavigatorItem__icon DNavigatorItem__icon--clickable" @click="toggle()"
                          :class="[hasChildren ? 'DNavigatorItem__icon--visible' : 'DNavigatorItem__icon--hidden']">
                    {{isOpen ? 'fa-chevron-down' : 'fa-chevron-right'}}
                  </v-icon>
                  <v-icon class="DNavigatorItem__icon">
                    {{isOpen ? 'fa-folder-open' : 'fa-folder'}}
                  </v-icon>
                  <div class="DNavigatorItem__text">
                    {{item.name}}
                    <span class="DNavigatorItem__identifier">
                      <span v-if="firstLevel">(G)</span>
                      <span v-else>(M)</span>
                    </span>
                  </div>
                </div>
              </v-flex>
              <v-flex xs3>
                <div>
                  <v-icon class="DNavigatorItem__action-icon" @click="removePgOrPm(item.id)">fa-trash</v-icon>
                  <v-icon class="DNavigatorItem__action-icon" @click="selectPgOrPm(item.id, item.name)">fa-pencil
                  </v-icon>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex v-for="layer in item.layers" :key="layer.id" v-show="isOpen" v-if="hasLayers" xs12
                class="DNavigatorItem__layer">
          <v-container fluid class="pa-0">
            <v-layout row wrap>
              <v-flex xs9>
                <div class="DNavigatorItem__layer--clickable" @click="openPl(layer.id)">
                  <v-icon class="DNavigatorItem__icon">fa-sitemap</v-icon>
                  <div class="DNavigatorItem__text">{{layer.name}} <span class="DNavigatorItem__identifier">(L)</span>
                  </div>
                </div>
              </v-flex>
              <v-flex xs3>
                <v-icon class="DNavigatorItem__action-icon" @click="removePl(layer.id)">fa-trash</v-icon>
                <v-icon class="DNavigatorItem__action-icon" @click="selectPl(layer.id, layer.name)">fa-pencil</v-icon>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
    <d-navigator-item v-if="hasChildren" v-show="isOpen" v-for="item in item.models" :key="item.id"
                      :item="item" :firstLevel="false"
                      class="DNavigatorItem__nested-item"></d-navigator-item>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'DNavigatorItem',
    props: {
      item: Object,
      firstLevel: Boolean
    },
    data: function () {
      return {
        open: true
      }
    },
    computed: {
      ...mapGetters('common', ['currentSelection']),
      hasChildren () {
        return (this.item.models && this.item.models.length) || (this.item.layers && this.item.layers.length)
      },
      hasLayers () {
        return this.item.layers && this.item.layers.length
      },
      isOpen () {
        if (this.firstLevel) {
          return this.open && (this.item.models && this.item.models.length)
        } else {
          return this.open && (this.item.layers && this.item.layers.length)
        }
      }
    },
    methods: {
      ...mapActions('processGroups', ['removeProcessGroup', 'fetchProcessGroups']),
      ...mapActions('processModels', ['removeProcessModel', 'fetchProcessModels']),
      ...mapActions('processLayers', ['removeProcessLayer', 'fetchProcessLayers']),
      ...mapActions('common', ['generateTreeData', 'setCurrentSelection', 'generateBreadcrumbsData']),
      ...mapActions('modeler', ['setCurrentSelectedProcessLayer']),
      removePg (pGId) {
        this.removeProcessGroup(pGId).then(() => this.fetchStructuralElements())
      },
      removePm (pMId) {
        this.removeProcessModel(pMId).then(() => this.fetchStructuralElements())
      },
      removePl (pLId) {
        this.removeProcessLayer(pLId).then(() => this.fetchStructuralElements())
      },
      removePgOrPm (itemId) {
        if (this.firstLevel) {
          this.removePg(itemId)
        } else {
          this.removePm(itemId)
        }
      },
      selectPg (pGId, pGName) {
        this.setCurrentSelection({
          itemType: 'processGroup',
          itemName: pGName,
          itemId: pGId
        }).then(() => this.generateBreadcrumbsData())
      },
      selectPM (pMId, pMName) {
        this.setCurrentSelection({
          itemType: 'processModel',
          itemName: pMName,
          itemId: pMId
        }).then(() => this.generateBreadcrumbsData())
      },
      selectPl (pLId, pLName) {
        this.setCurrentSelection({
          itemType: 'processLayer',
          itemName: pLName,
          itemId: pLId
        }).then(() => this.generateBreadcrumbsData())
      },
      selectPgOrPm (itemId, itemName) {
        if (this.firstLevel) {
          this.selectPg(itemId, itemName)
        } else {
          this.selectPM(itemId, itemName)
        }
      },
      fetchStructuralElements () {
        // TODO Instead of fetching all the data again from db, remove all the necessary elements in the vuex store
        const promises = []
        promises.push(this.fetchProcessGroups())
        promises.push(this.fetchProcessModels())
        promises.push(this.fetchProcessLayers())

        Promise.all(promises)
          .then(() => {
            this.setCurrentSelection(null)
            this.setCurrentSelectedProcessLayer(null)
            location.reload()
            this.generateTreeData()
          })
      },
      toggle: function () {
        if (this.hasChildren) {
          this.open = !this.open
        }
      },
      openPl (pLId) {
        this.setCurrentSelectedProcessLayer(pLId)
        this.$router.replace({path: '/main/modeler'})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .DNavigatorItem__icon {
    font-size: 1.5em;
    width: 1.8rem;
    float: left;
  }

  .DNavigatorItem__icon--clickable {
    cursor: pointer;
  }

  .DNavigatorItem__icon--visible {
    visibility: visible;
  }

  .DNavigatorItem__icon--hidden {
    visibility: hidden;
  }

  .DNavigatorItem__text {
    font-size: 1em;
    float: left;
    padding-top: .1rem;
    padding-left: .1rem;
  }

  .DNavigatorItem__action-icon {
    font-size: 1.5em;
    width: 1.8rem;
    float: right;
    cursor: pointer;
  }

  .DNavigatorItem__identifier {
    font-weight: bold;
    font-size: 1em;
  }

  .DNavigatorItem__layer {
    padding-left: 3.9rem;
  }

  .DNavigatorItem__layer--clickable {
    cursor: pointer;
  }

  .DNavigatorItem__nested-item {
    padding-left: 1.8rem;
  }
</style>
