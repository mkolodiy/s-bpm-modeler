<template>
  <div>
    <v-navigation-drawer temporary v-model="sideNav">
      <v-toolbar flat class="Main__drawer">
        <v-toolbar-title>S-BPM Modeler</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile to="/main/dashboard">
          <v-list-tile-action>
            <v-icon class="drawer-icon">fa-tachometer</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Dashboard</v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/main/modeler">
          <v-list-tile-action>
            <v-icon class="Main__drawer-icon">fa-sitemap</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Modeler</v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click.native="logoutUser()">
          <v-list-tile-action>
            <v-icon class="drawer-icon">fa-sign-out</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Log out</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dark class="primary Main_toolbar" dense>
      <span class="hidden-sm-and-up"><v-toolbar-side-icon
        @click.stop="sideNav = !sideNav"
        class="hidden-sm-and-up"></v-toolbar-side-icon></span>
      <v-toolbar-title class="mr-3">S-BPM Modeler</v-toolbar-title>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat to="/main/dashboard">
          <v-icon left dark>fa-tachometer</v-icon>
          Dashboard
        </v-btn>
        <v-btn flat to="/main/modeler" :disabled="isModelerActive()">
          <v-icon left dark>fa-sitemap</v-icon>
          Modeler
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat @click.native="logoutUser()">
          <v-icon left dark>fa-sign-out</v-icon>
          Log out
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'Main',
    data () {
      return {
        sideNav: false
      }
    },
    computed: {
      ...mapGetters('modeler', ['currentSelectedProcessLayer'])
    },
    methods: {
      ...mapActions('processGroups', ['fetchProcessGroups']),
      ...mapActions('processModels', ['fetchProcessModels']),
      ...mapActions('processLayers', ['fetchProcessLayers']),
      ...mapActions('common', ['generateTreeData']),
      ...mapActions('auth', ['logout']),
      logoutUser () {
        this.logout().then(() => {
          this.$router.replace({path: '/'})
          localStorage.removeItem('vuex')
          location.reload()
        })
      },
      isModelerActive () {
        return this.currentSelectedProcessLayer === null
      }
    },
    created () {
      const promises = []
      promises.push(this.fetchProcessGroups())
      promises.push(this.fetchProcessModels())
      promises.push(this.fetchProcessLayers())

      Promise.all(promises)
        .then(() => this.generateTreeData())
    }
  }
</script>

<style lang="scss" scoped>
  .Main__drawer {
    background-color: #ffffff !important;
  }

  .Main__drawer-icon {
    color: #676767 !important;
  }

  .Main_toolbar {
    z-index: 1000;
  }
</style>
