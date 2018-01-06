<template>
  <div>
    <transition name="fade">
      <div class="MNavigation" v-if="!navigationCollapsed">
        <div class="MNavigation__views">
          <v-card>
            <v-layout wrap row class="pl-1 pr-1">
              <v-flex xs6>
                <v-btn block primary :disabled="disableSIDBtn" @click="changeCurrentSelectedView()">SID</v-btn>
              </v-flex>
              <v-flex xs6>
                <v-btn block primary :disabled="disableSBDBtn" @click="changeCurrentSelectedView()">SBD</v-btn>
              </v-flex>
            </v-layout>
          </v-card>
        </div>
        <div class="MNavigation__subjects" v-if="showSubjectSelector()">
          <v-card>
            <v-layout wrap row class="pl-1 pr-1">
              <v-flex xs12>
                <v-select
                  :items="subjects"
                  item-text="name"
                  v-model="selectedValue"
                  single-line
                  bottom
                  autocomplete
                  hide-details
                  class="pa-0 pt-1 pb-1"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-card>
        </div>
      </div>
    </transition>
    <div class="MNavigation__collapse">
      <v-btn
        primary
        class="MNavigation__collapse-btn"
        @click="navigationCollapsed = !navigationCollapsed"
        v-tooltip:bottom="{ html: navigationCollapsed ? 'Show navigation' : 'Hide navigation' }"></v-btn>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import jointOptions from '@/joint-services/joint-options'
  import jointService from '@/joint-services/joint-service'
  export default {
    name: 'MNavigation',
    props: {
      saveElements: Function,
      loadElements: Function,
      setDataLoading: Function
    },
    data () {
      return {
        selectedValue: null,
        previouslySelectedValue: null,
        navigationCollapsed: false
      }
    },
    computed: {
      ...mapGetters('modeler', ['currentSelectedView', 'currentSelectedElement', 'currentSelectedBehavior', 'sbdViewEnabled', 'currentSelectedSubject']),
      ...mapGetters('subjects', ['subjects']),
      disableSIDBtn () {
        return this.currentSelectedView === jointOptions.views.SID_VIEW
      },
      disableSBDBtn () {
        if (this.currentSelectedView === jointOptions.views.SID_VIEW && !this.sbdViewEnabled) {
          return true
        }
        return this.currentSelectedView === jointOptions.views.SBD_VIEW
      }
    },
    methods: {
      ...mapActions('modeler', ['setCurrentSelectedView', 'setCurrentSelectedSubject', 'setCurrentSelectedElement']),
      ...mapActions('states', ['fetchStates']),
      ...mapActions('sendTransitions', ['fetchSendTransitions']),
      ...mapActions('receiveTransitions', ['fetchReceiveTransitions']),
      ...mapActions('functionTransitions', ['fetchFunctionTransitions']),
      showSubjectSelector () {
        return this.currentSelectedView === jointOptions.views.SBD_VIEW
      },
      changeCurrentSelectedView () {
        this.setDataLoading(true)
        this.setCurrentSelectedElement(null)
        jointService.setCanvasToOrigin()
        if (this.currentSelectedView === jointOptions.views.SID_VIEW) {
          this.saveElements().then(() => {
            this.setCurrentSelectedView(jointOptions.views.SBD_VIEW)
            this.selectedValue = this.getFirstAvailableSubject()
            this.onCurrentSelectedSubjectChanged(this.getFirstAvailableSubject())
          })
        } else {
          this.saveElements()
            .then(() => {
              this.setCurrentSelectedView(jointOptions.views.SID_VIEW)
              this.loadElements()
              this.setDataLoading(false)
            })
            .catch(() => {
              this.handleError()
            })
        }
      },
      onCurrentSelectedSubjectChanged (newVal) {
        this.setCurrentSelectedSubject(newVal)

        const promises = []
        promises.push(this.fetchStates())
        promises.push(this.fetchSendTransitions())
        promises.push(this.fetchReceiveTransitions())
        promises.push(this.fetchFunctionTransitions())

        return Promise.all(promises).then(() => {
          this.loadElements()
          this.setDataLoading(false)
        })
      },
      getFirstAvailableSubject () {
        if (this.subjects.length !== 0) {
          return this.subjects[0]
        }
      },
      handleError () {
        this.sendNotification('An error occured', 'Please add a proper configuration to all elements present on the canvas.', 'error')
        this.setDataLoading(false)
      },
      sendNotification (title, text, type) {
        this.$notify({
          title: title,
          text: text,
          group: 'v-notifications',
          type: type
        })
      }
    },
    watch: {
      selectedValue (newVal) {
        if (this.currentSelectedView === jointOptions.views.SBD_VIEW) {
          this.setCurrentSelectedElement(null)
          jointService.setCanvasToOrigin()
          if (this.currentSelectedSubject !== null && this.currentSelectedSubject._id.toString() !== newVal._id.toString()) {
            console.log('selectedValue changed')
            this.setDataLoading(true)
            this.saveElements()
              .then(() => {
                this.onCurrentSelectedSubjectChanged(newVal)
              })
              .catch(() => {
                this.selectedValue = this.currentSelectedSubject
                this.handleError()
              })
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .MNavigation {
    position: fixed;
    top: 78px;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 20;
  }

  .MNavigation__collapse {
    position: fixed;
    top: 52px;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 20;
  }

  .MNavigation__collapse-btn {
    width: 20px;
    height: 10px;
  }

  .MNavigation__views {
    width: 300px;
    margin-bottom: 10px;
    background-color: white;
  }

  .MNavigation__subjects {
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0
  }
</style>
