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

export function getDatetime() {
  let now = new Date()
  let datetime = now.getFullYear();
  datetime += ('0' + (now.getMonth()+1)).slice(-2);
  datetime += ('0' + now.getDate()).slice(-2);
  datetime += '-';
  datetime += ('0' + now.getHours()).slice(-2);
  datetime += ('0' + now.getMinutes()).slice(-2);
  datetime += ('0' + now.getSeconds()).slice(-2);

  return datetime;
}

export function download(filename, url) {
  let a = document.createElement('a')
  a.download = filename
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}