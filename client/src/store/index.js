import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import authModule from '@/store/modules/auth/auth-module'
import commonModule from '@/store/modules/common/common-module'
import modelerModule from '@/store/modules/modeler/modeler-module'

import processGroupsModule from '@/store/modules/structural-elements/process-groups/process-groups-module'
import processModelsModule from '@/store/modules/structural-elements/process-models/process-models-module'
import processLayersModule from '@/store/modules/structural-elements/process-layers/process-layers-module'
import subjectsModule from '@/store/modules/sid-elements/subjects/subjects-module'
import interfaceSubjectsModule from '@/store/modules/sid-elements/interface-subjects/interface-subjects-module'
import messageExchangesModule from '@/store/modules/sid-elements/message-exchanges/message-exchanges-module'
import messageSpecificationsModule from '@/store/modules/sid-elements/message-specifications/message-specifications-module'
import statesModule from '@/store/modules/sbd-elements/states/states-module'
import sendTransitionsModule from '@/store/modules/sbd-elements/send-transitions/send-transitions-module'
import receiveTransitionsModule from '@/store/modules/sbd-elements/receive-transitions/receive-transitions-module'
import functionTransitionsModule from '@/store/modules/sbd-elements/function-transitions/function-transitions-module'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    auth: authModule,
    processGroups: processGroupsModule,
    processModels: processModelsModule,
    processLayers: processLayersModule,
    subjects: subjectsModule,
    interfaceSubjects: interfaceSubjectsModule,
    messageExchanges: messageExchangesModule,
    messageSpecifications: messageSpecificationsModule,
    states: statesModule,
    sendTransitions: sendTransitionsModule,
    receiveTransitions: receiveTransitionsModule,
    functionTransitions: functionTransitionsModule,
    common: commonModule,
    modeler: modelerModule
  }
})
