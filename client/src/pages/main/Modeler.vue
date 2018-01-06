<template>
  <div>
    <m-pallet :save="save" :showMessageSpecificationsDialog="showMessageSpecificationsDialog"></m-pallet>
    <m-canvas ref="mCanvas"></m-canvas>
    <m-properties v-if="showProperties()"></m-properties>
    <m-navigation :saveElements="saveElements" :loadElements="loadElements" :setDataLoading="setDataLoading"></m-navigation>
    <v-progress-loader v-if="dataLoading"></v-progress-loader>
    <message-specifications-dialog ref="messageSpecificationsDialog"></message-specifications-dialog>
  </div>
</template>

<script>
  /* eslint-disable brace-style */

  import MCanvas from '@/components/modeler/MCanvas'
  import MPallet from '@/components/modeler/MPallet/MPallet'
  import MProperties from '@/components/modeler/MProperties/MProperties'
  import MNavigation from '@/components/modeler/MNavigation'
  import VProgressLoader from '@/components/VProgressLoader'
  import jointService from '@/joint-services/joint-service'
  import jointOptions from '@/joint-services/joint-options'
  import {mapActions, mapGetters} from 'vuex'
  import MessageSpecificationsDialog from '@/components/modeler/MPallet/dialogs/MessageSpecificationsDialog'
  export default {
    name: 'Modeler',
    components: {MCanvas, MPallet, MProperties, MNavigation, VProgressLoader, MessageSpecificationsDialog},
    data () {
      return {
        dataLoading: true,
        dialog: false
      }
    },
    computed: {
      ...mapGetters('modeler', ['currentSelectedView', 'currentSelectedProcessLayer', 'currentSelectedElement', 'currentSelectedSubject', 'currentSelectedBehavior']),
      ...mapGetters('subjects', ['subjects']),
      ...mapGetters('interfaceSubjects', ['interfaceSubjects']),
      ...mapGetters('messageExchanges', ['messageExchanges']),
      ...mapGetters('states', ['states']),
      ...mapGetters('sendTransitions', ['sendTransitions']),
      ...mapGetters('receiveTransitions', ['receiveTransitions']),
      ...mapGetters('functionTransitions', ['functionTransitions'])
    },
    methods: {
      ...mapActions('subjects', ['fetchSubjects', 'createSubject', 'removeSubject', 'patchSubject']),
      ...mapActions('interfaceSubjects', ['fetchInterfaceSubjects', 'createInterfaceSubject', 'removeInterfaceSubject', 'patchInterfaceSubject']),
      ...mapActions('messageSpecifications', ['fetchMessageSpecifications']),
      ...mapActions('states', ['createState', 'removeState', 'patchState']),
      ...mapActions('sendTransitions', ['createSendTransition', 'removeSendTransition', 'patchSendTransition']),
      ...mapActions('receiveTransitions', ['createReceiveTransition', 'removeReceiveTransition', 'patchReceiveTransition']),
      ...mapActions('functionTransitions', ['createFunctionTransition', 'removeFunctionTransition', 'patchFunctionTransition']),
      ...mapActions('messageExchanges', ['fetchMessageExchanges', 'createMessageExchange', 'removeMessageExchange', 'patchMessageExchange']),
      ...mapActions('modeler', ['setCurrentSelectedElement', 'setCurrentSelectedView', 'setCurrentSelectedSubject', 'setSbdViewEnabled', 'setCurrentSelectedBehavior']),
      isNotEmpty (arrayObj) {
        return arrayObj.length !== 0
      },
      showProperties () {
        return this.currentSelectedElement !== null
      },
      initCurrentView () {
        this.setCurrentSelectedView(jointOptions.views.SID_VIEW)
        this.setCurrentSelectedSubject(null)
      },
      setDataLoading (value) {
        this.dataLoading = value
      },
      showMessageSpecificationsDialog () {
        this.$refs.messageSpecificationsDialog.show()
      },
      sendNotification (title, text, type) {
        this.$notify({
          title: title,
          text: text,
          group: 'v-notifications',
          type: type
        })
      },
      handleSuccess () {
        this.sendNotification('Saved successfully', 'All elements present on the canvas are saved successfully.', 'success')
        this.setDataLoading(false)
      },
      handleError () {
        this.sendNotification('An error occured', 'Please add a proper configuration to all elements present on the canvas.', 'error')
        this.setDataLoading(false)
      },
      save () {
        this.setDataLoading(true)
        this.saveElements()
          .then(() => this.handleSuccess())
          .catch(() => this.handleError())
      },
      loadElements () {
        jointService.clearGraph()
        jointService.setLoadElements(true)

        /** Load all elements for currentSelectedView */
        if (this.currentSelectedView === jointOptions.views.SID_VIEW) {
          /** Load subjects */
          if (this.isNotEmpty(this.subjects)) {
            this.setSbdViewEnabled(true)
            jointService.loadSubjectElements(this.subjects)
          } else {
            this.setSbdViewEnabled(false)
          }

          /** Load interfaceSubjects */
          if (this.isNotEmpty(this.interfaceSubjects)) {
            jointService.loadInterfaceSubjectElements(this.interfaceSubjects)
          }

          /** Load messageExchanges */
          if (this.isNotEmpty(this.messageExchanges)) {
            jointService.loadMessageExchanges(this.messageExchanges)
          }
        } else {
          /** Load states */
          if (this.isNotEmpty(this.states)) {
            jointService.loadStates(this.states)
          }

          /** Load sendTransitions */
          if (this.isNotEmpty(this.sendTransitions)) {
            jointService.loadSendTransitions(this.sendTransitions)
          }

          /** Load receiveTransitions */
          if (this.isNotEmpty(this.receiveTransitions)) {
            jointService.loadReceiveTransitions(this.receiveTransitions)
          }

          /** Load functionTransitions */
          if (this.isNotEmpty(this.functionTransitions)) {
            jointService.loadFunctionTransitions(this.functionTransitions)
          }
        }
        console.log('Modeler.vue - Loaded')
        jointService.unhighlightAllElements()
        jointService.setLoadElements(false)
      },
      saveElements () {
        let promises = []

        /** Save all elements for currentSelectedView */
        if (this.currentSelectedView === jointOptions.views.SID_VIEW) {
          /** Subjects */
          promises = [].concat(promises, this.saveSubjects())

          /** InterfaceSubjects */
          promises = [].concat(promises, this.saveInterfaceSubjects())

          /** MessageExchanges */
          promises = [].concat(promises, this.saveMessageExchanges())
        } else {
          /** States */
          promises = [].concat(promises, this.saveStates())

          /** SendTransitions */
          promises = [].concat(promises, this.saveSendTransitions())

          /** ReceiveTransitions */
          promises = [].concat(promises, this.saveReceiveTransitions())

          /** FunctionTransitions */
          promises = [].concat(promises, this.saveFunctionTransitions())
        }

        return Promise.all(promises).then(() => {
          console.log('Modeler.vue - Saved')
        })
      },
      saveSubjects () {
        const promises = []
        /** Subjects - add new or update existing one */
        jointService.getSubjectElements().forEach(el => {
          const subject = this.subjects.find(s => s.canvasId === el.get('id'))

          /** Add new subject */
          if (typeof subject === 'undefined') {
            const newSubject = {
              name: el.get('customAttrs').name,
              parent: this.currentSelectedProcessLayer,
              position: el.get('position'),
              size: el.get('size'),
              canvasId: el.get('id')
            }
            promises.push(this.createSubject(newSubject))
          }
          /** Update existing subject */
          else if (typeof subject !== 'undefined') {
            const existingSubject = {
              id: subject._id.toString(),
              body: {
                name: el.get('customAttrs').name,
                parent: this.currentSelectedProcessLayer,
                position: el.get('position'),
                size: el.get('size'),
                canvasId: el.get('id')
              }
            }
            promises.push(this.patchSubject(existingSubject))
          }
        })
        /** Subjects - remove subjects that are no longer present on the canvas */
        this.subjects.forEach(s => {
          const subjectElement = jointService.getSubjectElements().find(el => el.get('id') === s.canvasId)
          if (typeof subjectElement === 'undefined') {
            promises.push(this.removeSubject(s._id.toString()))
          }
        })

        return promises
      },
      saveInterfaceSubjects () {
        const promises = []
        /** InterfaceSubjects - add new or update existing one */
        jointService.getInterfaceSubjectElements().forEach(el => {
          const interfaceSubject = this.interfaceSubjects.find(s => s.canvasId === el.get('id'))

          /** Add new interfaceSubject */
          if (typeof interfaceSubject === 'undefined') {
            const newInterfaceSubject = {
              name: el.get('customAttrs').name,
              reference: el.get('customAttrs').reference,
              parent: this.currentSelectedProcessLayer,
              position: el.get('position'),
              size: el.get('size'),
              canvasId: el.get('id')
            }
            promises.push(this.createInterfaceSubject(newInterfaceSubject))
          }
          /** Update existing subject */
          else if (typeof interfaceSubject !== 'undefined') {
            const existingInterfaceSubject = {
              id: interfaceSubject._id.toString(),
              body: {
                name: el.get('customAttrs').name,
                reference: el.get('customAttrs').reference,
                parent: this.currentSelectedProcessLayer,
                position: el.get('position'),
                size: el.get('size'),
                canvasId: el.get('id')
              }
            }
            promises.push(this.patchInterfaceSubject(existingInterfaceSubject))
          }
        })
        /** InterfaceSubjects - remove subjects that are no longer present on the canvas */
        this.interfaceSubjects.forEach(s => {
          const interfaceSubjectElement = jointService.getInterfaceSubjectElements().find(el => el.get('id') === s.canvasId)
          if (typeof interfaceSubjectElement === 'undefined') {
            promises.push(this.removeInterfaceSubject(s._id.toString()))
          }
        })

        return promises
      },
      saveMessageExchanges () {
        const promises = []
        /** Save messageExchanges */
        jointService.getMessageExchangeElements().forEach(link => {
          const messageExchange = this.messageExchanges.find(s => s.canvasId === link.get('id'))
          const sourceToTargetMessageSpecifications = link.get('customAttrs').sourceToTargetMessageSpecifications.map(el => el._id.toString())
          const targetToSourceMessageSpecifications = link.get('customAttrs').targetToSourceMessageSpecifications.map(el => el._id.toString())
          let vertices = []

          if (typeof link.get('vertices') !== 'undefined') {
            vertices = link.get('vertices')
          }

          /** Add new messageExchange */
          if (typeof messageExchange === 'undefined') {
            const newMessageExchange = {
              isBidirectional: link.attributes.customAttrs.isBidirectional,
              sourceToTargetMessageSpecifications: sourceToTargetMessageSpecifications,
              targetToSourceMessageSpecifications: targetToSourceMessageSpecifications,
              source: link.attributes.source,
              target: link.attributes.target,
              canvasId: link.get('id'),
              parent: this.currentSelectedProcessLayer,
              vertices: vertices
            }
            promises.push(this.createMessageExchange(newMessageExchange))
          }
          /** Update existing messageExchange */
          else if (typeof messageExchange !== 'undefined') {
            const existingMessageExchange = {
              id: messageExchange._id.toString(),
              body: {
                isBidirectional: link.get('customAttrs').isBidirectional,
                sourceToTargetMessageSpecifications: sourceToTargetMessageSpecifications,
                targetToSourceMessageSpecifications: targetToSourceMessageSpecifications,
                source: link.get('source'),
                target: link.get('target'),
                canvasId: link.get('id'),
                parent: this.currentSelectedProcessLayer,
                vertices: vertices
              }
            }
            promises.push(this.patchMessageExchange(existingMessageExchange))
          }
        })
        /** MessageExchanges - remove messageExchange that are no longer present on the canvas */
        this.messageExchanges.forEach(el => {
          const messageExchange = jointService.getMessageExchangeElements().find(link => link.get('id') === el.canvasId)
          if (typeof messageExchange === 'undefined') {
            promises.push(this.removeMessageExchange(el._id.toString()))
          }
        })

        return promises
      },
      saveStates () {
        const promises = []
        /** Add new or update existing state */
        jointService.getElements().forEach(el => {
          const state = this.states.find(s => s.canvasId === el.get('id'))

          /** Add new subject */
          if (typeof state === 'undefined') {
            const newState = {
              name: el.get('customAttrs').name,
              startState: el.get('customAttrs').startState,
              endState: el.get('customAttrs').endState,
              canvasId: el.get('id'),
              type: el.get('type'),
              parent: this.currentSelectedSubject._id.toString(),
              position: el.get('position'),
              size: el.get('size')
            }
            promises.push(this.createState(newState))
          }
          /** Update existing state */
          else if (typeof state !== 'undefined') {
            const existingState = {
              id: state._id.toString(),
              body: {
                name: el.get('customAttrs').name,
                startState: el.get('customAttrs').startState,
                endState: el.get('customAttrs').endState,
                canvasId: el.get('id'),
                type: el.get('type'),
                parent: this.currentSelectedSubject._id.toString(),
                position: el.get('position'),
                size: el.get('size')
              }
            }
            promises.push(this.patchState(existingState))
          }
        })
        /** Remove states that are no longer present on the canvas */
        this.states.forEach(s => {
          const stateElement = jointService.getElements().find(el => el.get('id') === s.canvasId)
          if (typeof stateElement === 'undefined') {
            promises.push(this.removeState(s._id.toString()))
          }
        })

        return promises
      },
      saveSendTransitions () {
        const promises = []
        /** Add new or update existing sendTransition */
        jointService.getSendTransitionElements().forEach(link => {
          const sendTransition = this.sendTransitions.find(s => s.canvasId === link.get('id'))
          let vertices = []

          if (typeof link.get('vertices') !== 'undefined') {
            vertices = link.get('vertices')
          }

          /** Add new subject */
          if (typeof sendTransition === 'undefined') {
            const newSendTransition = {
              subject: link.get('customAttrs').subject,
              messageSpecification: link.get('customAttrs').messageSpecification,
              canvasId: link.get('id'),
              parent: this.currentSelectedSubject._id.toString(),
              source: link.attributes.source,
              target: link.attributes.target,
              vertices: vertices
            }
            promises.push(this.createSendTransition(newSendTransition))
          }
          /** Update existing sendTransition */
          else if (typeof sendTransition !== 'undefined') {
            const existingSendTransition = {
              id: sendTransition._id.toString(),
              body: {
                subject: link.get('customAttrs').subject,
                messageSpecification: link.get('customAttrs').messageSpecification,
                canvasId: link.get('id'),
                parent: this.currentSelectedSubject._id.toString(),
                source: link.attributes.source,
                target: link.attributes.target,
                vertices: vertices
              }
            }
            promises.push(this.patchSendTransition(existingSendTransition))
          }
        })
        /** Remove sendTransitions that are no longer present on the canvas */
        this.sendTransitions.forEach(s => {
          const sendTransitionElement = jointService.getSendTransitionElements().find(link => link.get('id') === s.canvasId)
          if (typeof sendTransitionElement === 'undefined') {
            promises.push(this.removeSendTransition(s._id.toString()))
          }
        })

        return promises
      },
      saveReceiveTransitions () {
        const promises = []
        /** Add new or update existing receiveTransitions */
        jointService.getReceiveTransitionElements().forEach(link => {
          const receiveTransition = this.receiveTransitions.find(s => s.canvasId === link.get('id'))
          let vertices = []

          if (typeof link.get('vertices') !== 'undefined') {
            vertices = link.get('vertices')
          }

          /** Add new receiveTransition */
          if (typeof receiveTransition === 'undefined') {
            const newReceiveTransition = {
              subject: link.get('customAttrs').subject,
              messageSpecification: link.get('customAttrs').messageSpecification,
              canvasId: link.get('id'),
              parent: this.currentSelectedSubject._id.toString(),
              source: link.attributes.source,
              target: link.attributes.target,
              vertices: vertices
            }
            promises.push(this.createReceiveTransition(newReceiveTransition))
          }
          /** Update existing receiveTransition */
          else if (typeof receiveTransition !== 'undefined') {
            const existingReceiveTransition = {
              id: receiveTransition._id.toString(),
              body: {
                subject: link.get('customAttrs').subject,
                messageSpecification: link.get('customAttrs').messageSpecification,
                canvasId: link.get('id'),
                parent: this.currentSelectedSubject._id.toString(),
                source: link.attributes.source,
                target: link.attributes.target,
                vertices: vertices
              }
            }
            promises.push(this.patchReceiveTransition(existingReceiveTransition))
          }
        })
        /** Remove receiveTransitions that are no longer present on the canvas */
        this.receiveTransitions.forEach(s => {
          const receiveTransitionElement = jointService.getReceiveTransitionElements().find(link => link.get('id') === s.canvasId)
          if (typeof receiveTransitionElement === 'undefined') {
            promises.push(this.removeReceiveTransition(s._id.toString()))
          }
        })

        return promises
      },
      saveFunctionTransitions () {
        const promises = []
        /** Add new or update existing functionTransitions */
        jointService.getFunctionTransitionElements().forEach(link => {
          const functionTransition = this.functionTransitions.find(s => s.canvasId === link.get('id'))
          let vertices = []

          if (typeof link.get('vertices') !== 'undefined') {
            vertices = link.get('vertices')
          }

          /** Add new functionTransition */
          if (typeof functionTransition === 'undefined') {
            const newFunctionTransition = {
              name: link.get('customAttrs').name,
              canvasId: link.get('id'),
              parent: this.currentSelectedSubject._id.toString(),
              source: link.attributes.source,
              target: link.attributes.target,
              vertices: vertices
            }
            promises.push(this.createFunctionTransition(newFunctionTransition))
          }
          /** Update existing functionTransition */
          else if (typeof functionTransition !== 'undefined') {
            const existingFunctionTransition = {
              id: functionTransition._id.toString(),
              body: {
                name: link.get('customAttrs').name,
                canvasId: link.get('id'),
                parent: this.currentSelectedSubject._id.toString(),
                source: link.attributes.source,
                target: link.attributes.target,
                vertices: vertices
              }
            }
            promises.push(this.patchFunctionTransition(existingFunctionTransition))
          }
        })
        /** Remove functionTransitions that are no longer present on the canvas */
        this.functionTransitions.forEach(s => {
          const functionTransitionElement = jointService.getFunctionTransitionElements().find(link => link.get('id') === s.canvasId)
          if (typeof functionTransitionElement === 'undefined') {
            promises.push(this.removeFunctionTransition(s._id.toString()))
          }
        })

        return promises
      }
    },
    created () {
      const promises = []

      /** Fetch all data for currently selected processLayer */
      promises.push(this.fetchSubjects())
      promises.push(this.fetchInterfaceSubjects())
      promises.push(this.fetchMessageSpecifications())
      promises.push(this.fetchMessageExchanges())
      Promise.all(promises).then(() => {
        this.loadElements()
        this.setDataLoading(false)
      })

      /** Set currentSelectedElement to null so that after page reload there is no element on the canvas selected. */
      this.setCurrentSelectedElement(null)
    },
    mounted () {
      this.initCurrentView()
      jointService.initialize(this.$refs.mCanvas.getContainer())
      this.loadElements()
    }
  }
</script>

<style lang="scss" scoped>
</style>
