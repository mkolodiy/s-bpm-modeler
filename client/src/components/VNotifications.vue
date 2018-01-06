<template>
  <notifications group="v-notifications"
                 position="top right">
    <template slot="body" slot-scope="props">
      <div v-if="props.item.type === 'success'">
        <v-alert success value="true">
          <div>
            <div class="subheading">
              {{props.item.title}}
            </div>
            <div>
              {{props.item.text}}
            </div>
          </div>
        </v-alert>
      </div>
      <div v-else-if="props.item.type === 'error'">
        <v-alert error value="true">
          <div>
            <div class="subheading">
              {{props.item.title}}
            </div>
            <div>
              {{props.item.text}}
            </div>
          </div>
        </v-alert>
      </div>
      <div v-else-if="props.item.type === 'warning'">
        <v-alert warning value="true">
          <div>
            <div class="subheading">
              {{props.item.title}}
            </div>
            <div>
              {{props.item.text}}
            </div>
          </div>
        </v-alert>
      </div>
      <div v-else>
        <v-alert info value="true">
          <div>
            <div class="subheading">
              {{props.item.title}}
            </div>
            <div>
              {{props.item.text}}
            </div>
          </div>
        </v-alert>
      </div>
    </template>
  </notifications>
</template>

<script>
  export default {
    name: 'VNotifications'
  }
</script>

<style lang="scss" scoped>
</style>
