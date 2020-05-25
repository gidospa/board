import {FIELD_DATA_LIST} from './config.js'

export const local = {
  save(files) {
    console.log('save to localStorage')
    let fieldDataList = JSON.stringify({
      timestamp: new Date().getTime(),
      boardStorage: files
    })
    localStorage[FIELD_DATA_LIST] = fieldDataList
  },
  load() {
    console.log('load from localStorage')
    let fieldDataList = null
    if (FIELD_DATA_LIST in localStorage) {
      fieldDataList = JSON.parse(localStorage[FIELD_DATA_LIST])
    }
    return fieldDataList
  }
}

export const google = {
  save(files) {
    console.log('save to Google Drive')
    let fieldDataList = JSON.stringify({
      timestamp: new Date().getTime(),
      boardStorage: files
    })
    localStorage[FIELD_DATA_LIST] = fieldDataList
  },
  load() {
    console.log('load from Google Drive')
    let fieldDataList = null
    if (FIELD_DATA_LIST in localStorage) {
      fieldDataList = JSON.parse(localStorage[FIELD_DATA_LIST])
    }
    return fieldDataList
  }
}

export const dropbox = {
  save(files) {
    console.log('save to Dropbox')
    let fieldDataList = JSON.stringify({
      timestamp: new Date().getTime(),
      boardStorage: files
    })
    localStorage[FIELD_DATA_LIST] = fieldDataList
  },
  load() {
    console.log('load from Dropbox')
    let fieldDataList = null
    if (FIELD_DATA_LIST in localStorage) {
      fieldDataList = JSON.parse(localStorage[FIELD_DATA_LIST])
    }
    return fieldDataList
  }
}