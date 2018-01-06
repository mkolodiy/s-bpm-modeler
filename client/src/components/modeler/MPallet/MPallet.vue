<template>
  <div>
    <transition name="fade">
      <div class="ma-4 MPallet" v-if="!palletCollapsed">
        <v-card>
          <v-toolbar dark dense flat class="primary">
            <v-toolbar-title class="subheading">Pallet</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn flat icon @click="setCanvasToOrigin()" v-tooltip:bottom="{ html: 'Center' }"><v-icon dark>fa-dot-circle-o</v-icon></v-btn>
            <v-btn flat icon @click="save()" v-tooltip:bottom="{ html: 'Save' }"><v-icon dark>fa-floppy-o</v-icon></v-btn>
          </v-toolbar>
          <v-card-text>
            <v-layout wrap row>
              <v-flex xs12>
                <v-btn primary block @click="showMessageSpecificationsDialog()" class="ma-0">Manage message specifications</v-btn>
              </v-flex>
              <v-flex xs12 class="pt-3 pb-3"><v-divider></v-divider></v-flex>
              <v-flex xs12 v-if="showSBPMElements()">
                <v-layout wrap row>
                  <v-flex>
                    <v-layout row wrap>
                      <v-flex xs6>
                        <div class="MPallet__SubjectElement" id="subjectElement" draggable="true" @dragstart="onDragStart">Subject</div>
                      </v-flex>
                      <v-flex xs6>
                        <div class="MPallet__InterfaceSubjectElement MPallet__float-right"
                             id="interfaceSubjectElement" draggable="true" @dragstart="onDragStart">Interface Subject</div>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 v-if="!showSBPMElements()">
                <v-layout row wrap>
                  <v-flex xs6>
                    <div class="MPallet__StateElement" id="sendStateElement" draggable="true" @dragstart="onDragStart">
                      <div class="MPallet__StateElement-icon"><i class="fa fa-paper-plane" aria-hidden="true"></i></div>
                      <div class="MPallet__StateElement-name">SendState</div>
                    </div>
                  </v-flex>
                  <v-flex xs6>
                    <div class="MPallet__StateElement MPallet__float-right" id="receiveStateElement" draggable="true" @dragstart="onDragStart">
                      <div class="MPallet__StateElement-icon"><i class="fa fa-envelope" aria-hidden="true"></i></div>
                      <div class="MPallet__StateElement-name">ReceiveState</div>
                    </div>
                  </v-flex>
                  <v-flex xs6>
                    <div class="MPallet__StateElement" id="functionStateElement" draggable="true" @dragstart="onDragStart">
                      <div class="MPallet__StateElement-icon"><i class="fa fa-cog" aria-hidden="true"></i></div>
                      <div class="MPallet__StateElement-name">FunctionState</div>
                    </div>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </div>
    </transition>
    <div class="MPallet__collapse text-xs-center">
      <v-btn
        primary
        class="MPallet__collapse-btn"
        @click="palletCollapsed = !palletCollapsed"
        v-tooltip:bottom="{ html: palletCollapsed ? 'Show pallet' : 'Hide pallet' }"></v-btn>
    </div>
  </div>
</template>

<script>
  import jointOptions from '@/joint-services/joint-options'
  import jointService from '@/joint-services/joint-service'
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'MPallet',
    data () {
      return {
        palletCollapsed: false
      }
    },
    props: {
      save: Function,
      showMessageSpecificationsDialog: Function
    },
    computed: {
      ...mapGetters('modeler', ['currentSelectedView'])
    },
    methods: {
      ...mapActions('messages', ['createMessage']),
      onDragStart (evt) {
        if (evt.srcElement.id === 'subjectElement') {
          evt.dataTransfer.setData('text/plain', jointOptions.elements.SUBJECT_ELEMENT)
        } else if (evt.srcElement.id === 'interfaceSubjectElement') {
          evt.dataTransfer.setData('text/plain', jointOptions.elements.INTERFACE_SUBJECT_ELEMENT)
        } else if (evt.srcElement.id === 'sendStateElement') {
          evt.dataTransfer.setData('text/plain', jointOptions.elements.SEND_STATE_ELEMENT)
        } else if (evt.srcElement.id === 'receiveStateElement') {
          evt.dataTransfer.setData('text/plain', jointOptions.elements.RECEIVE_STATE_ELEMENT)
        } else if (evt.srcElement.id === 'functionStateElement') {
          evt.dataTransfer.setData('text/plain', jointOptions.elements.FUNCTION_STATE_ELEMENT)
        }
      },
      showSBPMElements () {
        return this.currentSelectedView === jointOptions.views.SID_VIEW
      },
      setCanvasToOrigin () {
        jointService.setCanvasToOrigin()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .MPallet {
    position: fixed;
    width: 375px;
    z-index: 25;
    padding-top: 10px;
  }

  .MPallet__collapse {
    position: fixed;
    width: 375px;
    left: 25px;
    padding-top: 5px;
    z-index: 25;
  }

  .MPallet__collapse-btn {
    width: 20px;
    height: 10px;
  }

  .MPallet__SubjectElement, .MPallet__InterfaceSubjectElement  {
    background: #ffffff;
    border-radius: 6px;
    width: 161.803px;
    height: 100px;
    text-align: center;
    margin-bottom: 20px;
    padding-top: 20%;
  }

  .MPallet__SubjectElement {
    border: 3px solid #000000;
  }

  .MPallet__InterfaceSubjectElement {
    border: 3px dashed #000000;
  }

  .MPallet__StateElement {
    background: #ffffff;
    border-radius: 6px;
    border: 3px solid #000000;
    width: 161.803px;
    height: 100px;
    text-align: center;
    margin-bottom: 20px;
  }

  .MPallet__StateElement-name {
    padding-top: 20%;
  }

  .MPallet__StateElement-icon {
    font-size: 1.5em;
    position: fixed;
    padding-left: 5px;
  }

  .MPallet__float-right {
    float: right;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0
  }
</style>
