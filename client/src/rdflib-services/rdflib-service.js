/* eslint-disable */
import store from '@/store/'
import * as StringBuilder from 'stringbuilder'
import * as FileSaver from 'file-saver'
import standardExportService from '@/rdflib-services/standard-export-service'
import standardImportService from '@/rdflib-services/standard-import-service'
import customExportService from '@/rdflib-services/custom-export-service'
import customImportService from '@/rdflib-services/custom-import-service'

class RdflibService {
  /***************************************************
   ***************** INITIALIZATION ******************
   ***************************************************/

  /**
   * Create a new rdflib store.
   */
  initialize () {
    StringBuilder.extend('string')
  }

  export (isStandard, isCustom, processGroupIds, includeVisualRepresentation) {
    const owlData = store.dispatch('common/generateOwlData', processGroupIds)
    owlData
      .then(result => {
        if (isStandard) {
          return standardExportService.export(result, includeVisualRepresentation)
        }
        if (isCustom) {
          return customExportService.export(result, includeVisualRepresentation)
        }
      })
      .then(result => {
        result.forEach(el => {
          el.file.toString((res, res1) => {
            this.downloadFile(this.removeWhitespaces(el.name), res1)
            store.dispatch('common/setDataLoading', false)
          })
        })
      })
  }

  import (isStandard, isCustom, fileName, fileAsString) {
    let promise = null
    if (isStandard) {
      promise = standardImportService.import(fileName, fileAsString)
    }
    if (isCustom) {
      promise = customImportService.import(fileName, fileAsString)
    }

    promise.then(() => {
      store.dispatch('common/setDataLoading', false)
    })
  }

  downloadFile (fileName, textFile) {
    FileSaver.saveAs(new File([textFile], '{0}.owl'.format(fileName), {type: 'application/xml;charset=utf-8'}))
  }

  generateRandonAlphanumericString () {
    var text = ''
    var possible = 'abcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < 24; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
  }

  removeWhitespaces (value) {
    return value.replace(/\s/g, '_')
  }
}

/** Make the jointService a singleton */
const rdflibService = new RdflibService()
Object.freeze(rdflibService)

export default rdflibService
