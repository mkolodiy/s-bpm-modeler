<template>
  <div class="ma-4 MProperties">
    <v-card>
      <v-toolbar dark dense flat class="primary">
        <v-toolbar-title class="subheading">Properties</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <subject-properties v-if="showSubjectProperties()"></subject-properties>
        <interface-subject-properties v-if="showInterfaceSubjectProperties()"></interface-subject-properties>
        <message-exchange-properties v-if="showMessageEschangeProperties()"></message-exchange-properties>
        <send-state-properties v-if="showSendStateProperties()"></send-state-properties>
        <receive-state-properties v-if="showReceiveStateProperties()"></receive-state-properties>
        <function-state-properties v-if="showFunctionStateProperties()"></function-state-properties>
        <send-transition-properties v-if="showSendTransitionProperties()"></send-transition-properties>
        <receive-transition-properties v-if="showReceiveTransitionProperties()"></receive-transition-properties>
        <function-transition-properties v-if="showFunctionTransitionProperties()"></function-transition-properties>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import SubjectProperties from '@/components/modeler/MProperties/SubjectProperties'
  import InterfaceSubjectProperties from '@/components/modeler/MProperties/InterfaceSubjectProperties'
  import MessageExchangeProperties from '@/components/modeler/MProperties/MessageExchangeProperties'
  import SendStateProperties from '@/components/modeler/MProperties/SendStateProperties'
  import ReceiveStateProperties from '@/components/modeler/MProperties/ReceiveStateProperties'
  import FunctionStateProperties from '@/components/modeler/MProperties/FunctionStateProperties'
  import SendTransitionProperties from '@/components/modeler/MProperties/SendTransitionProperties'
  import ReceiveTransitionProperties from '@/components/modeler/MProperties/ReceiveTransitionProperties'
  import FunctionTransitionProperties from '@/components/modeler/MProperties/FunctionTransitionProperties'
  import {mapGetters} from 'vuex'
  import jointOptions from '@/joint-services/joint-options'
  export default {
    name: 'MProperties',
    components: {
      SubjectProperties,
      InterfaceSubjectProperties,
      MessageExchangeProperties,
      SendStateProperties,
      ReceiveStateProperties,
      FunctionStateProperties,
      SendTransitionProperties,
      ReceiveTransitionProperties,
      FunctionTransitionProperties
    },
    computed: {
      ...mapGetters('modeler', ['currentSelectedElement'])
    },
    methods: {
      showSubjectProperties () {
        if (this.currentSelectedElement) {
          return this.currentSelectedElement.type === jointOptions.types.elements.SUBJECT_ELEMENT
        }
      },
      showInterfaceSubjectProperties () {
        if (this.currentSelectedElement) {
          return this.currentSelectedElement.type === jointOptions.types.elements.INTERFACE_SUBJECT_ELEMENT
        }
      },
      showMessageEschangeProperties () {
        if (this.currentSelectedElement) {
          return this.currentSelectedElement.type === jointOptions.types.links.MESSAGE_EXCHANGE_ELEMENT
        }
      },
      showSendStateProperties () {
        if (this.currentSelectedElement) {
          return this.currentSelectedElement.type === jointOptions.types.elements.SEND_STATE_ELEMENT
        }
      },
      showReceiveStateProperties () {
        if (this.currentSelectedElement) {
          return this.currentSelectedElement.type === jointOptions.types.elements.RECEIVE_STATE_ELEMENT
        }
      },
      showFunctionStateProperties () {
        if (this.currentSelectedElement) {
          return this.currentSelectedElement.type === jointOptions.types.elements.FUNCTION_STATE_ELEMENT
        }
      },
      showSendTransitionProperties () {
        if (this.currentSelectedElement) {
          return this.currentSelectedElement.type === jointOptions.types.links.SEND_TRANSITION_ELEMENT
        }
      },
      showReceiveTransitionProperties () {
        if (this.currentSelectedElement) {
          return this.currentSelectedElement.type === jointOptions.types.links.RECEIVE_TRANSITION_ELEMENT
        }
      },
      showFunctionTransitionProperties () {
        if (this.currentSelectedElement) {
          return this.currentSelectedElement.type === jointOptions.types.links.FUNCTION_TRANSITION_ELEMENT
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .MProperties {
    position: fixed;
    width: 375px;
    right: 0;
    padding-top: 10px;
    z-index: 25;
  }
</style>
