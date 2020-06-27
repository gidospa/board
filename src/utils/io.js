import {FIELD_DATA_LIST, EXPORT_FILE_NAME_PREFIX, PLAYER_DB_FILE_PREFIX} from './config.js'
import Dropbox from './dropbox.js'

/*================================================================================ 
** localStorge
**==============================================================================*/
export const local = []
local.isAvailable = function() {
  return 'available'
}
local.fetch = function(success) {
  console.log('load from localStorage')
  if (FIELD_DATA_LIST in localStorage) {
    let bds = JSON.parse(localStorage[FIELD_DATA_LIST])
    this.splice(0) // clear array
    Array.prototype.push.apply(this, bds.boardStorage)
    console.log('load boards from localStorage')
  }
  else {
    let boardString = JSON.stringify({
      timestamp: new Date().getTime(),
      boardStorage: [],
    })
    localStorage[FIELD_DATA_LIST] = boardString
    this.splice(0) // clear array
    console.log('create new boards at localStorage')
  }

  success && success()
}
local.append = function(board, success) {
  console.log('save to localStorage')
  let newBoards = [board].concat(this)
  let newBoardsString = JSON.stringify({
    timestamp: new Date().getTime(),
    boardStorage: newBoards
  })
  localStorage[FIELD_DATA_LIST] = newBoardsString
  this.fetch(success)
}
local.remove = function(n, success) {
  console.log(`remove board at index ${n} from localStorage`)
  let newBoards = [].concat(this)  // copy array
  newBoards.splice(n, 1)
  let newBoardsString = JSON.stringify({
    timestamp: new Date().getTime(),
    boardStorage: newBoards
  })
  localStorage[FIELD_DATA_LIST] = newBoardsString
  this.fetch(success)
}


/*================================================================================ 
** google drive
**
** /.env
**   VUE_APP_GOOGLE_DRIVE_CLIENT_ID = 'DropboxMyappsAppkey';
**==============================================================================*/
const GOOGLE_DRIVE_CLIENT_ID = process.env.VUE_APP_GOOGLE_DRIVE_CLIENT_ID

export const google = []
google.isAvailable = function() {
  if (!GOOGLE_DRIVE_CLIENT_ID) {
    return 'unavailable'
  }

  return 'available'
}
google.fetch = function() {}
google.appende = function() {}
google.remove = function() {}


/*================================================================================ 
** dropbox
**
** /.env
**   VUE_APP_DROPBOX_CLIENT_ID = 'DropboxMyappsAppkey';
**==============================================================================*/
const  DROPBOX_CLIENT_ID = process.env.VUE_APP_DROPBOX_CLIENT_ID
const  DROPBOX_FIELD_FILE = `/${EXPORT_FILE_NAME_PREFIX}.json`
const  DROPBOX_PLAYER_DB_FILE = `/${PLAYER_DB_FILE_PREFIX}.json`

export const dropbox = []
dropbox.isAvailable = function() {
  console.log(DROPBOX_PLAYER_DB_FILE)
  if (!DROPBOX_CLIENT_ID) {
    return 'unavailable'
  }
    
  if (Dropbox.checkRedirect()) {
    this.startConnecting && this.startConnecting()
    this.download()
    return 'connected'
  }
    
  return 'available'
}
dropbox.fetch = function(success, failure) {
  this.startConnecting && this.startConnecting()
 
  let parameter = {
    client_id: DROPBOX_CLIENT_ID,
    redirect_uri: location.href
  };
  let callbacks = {
    onComplete: () => {
      console.log('complete dropbox authenticate');
      this.download(success, failure);
      //this._downloadPlayerDBFromDropbox();
    },
    onError: (e) => {
      console.log('incomplete dropbox authenticate');
      console.log(e);
      this.endConnecting && this.endConnecting()
      failure && failure()
    }
  }

  Dropbox.authenticate(parameter, callbacks)
}
dropbox.download = function(success, failure) {
  console.log('download')
    
  let callbacks = {
    onComplete: (result, response) => {this.loadBoard(result, response, success, failure)},
    onError: (e) => {
      console.log(e);
      switch (e.status) {
      case 401: // Unauthorized
        console.log('401 Unauthorized')
        console.log('remove dropbox access token');
        Dropbox.clear();
        this.endConnecting && this.endConnecting()
        failure && failure()
        break;
          
      case 409: // Conflict(path not found)
        console.log('create new boards')
        this.createNewFile(success, failure)
        break;
          
      default:
        console.log('cannot download from dropbox');
        this.endConnecting && this.endConnecting()
        failure && failure()
      }
    }
  }
  Dropbox('files/download', {path: DROPBOX_FIELD_FILE}, callbacks);
}
dropbox.loadBoard = function(result, response, success, failure) {
  let reader = new FileReader()
  let self = this
  reader.addEventListener('loadend', () => {
    try {
      let boards = JSON.parse(reader.result)
      if (boards) {
        self.splice(0) // clear dropbox array
        Array.prototype.push.apply(self, boards) // append boards to empty array
        self.endConnecting && self.endConnecting()
        success && success()
      }
      else {
        self.endConnecting && self.endConnecting()
        failure && failure()
      }
    }
    catch (e) {
      console.error(e)
      self.endConnecting && self.endConnecting()
      failure && failure()
    }
  })

  reader.readAsText(response)
}
dropbox.createNewFile = function(success, failure) {
  console.log('create New boards file')
  let emptyString = '[]'
  let param = {
    path: DROPBOX_FIELD_FILE,
    mode: 'overwrite'
  }
  let callbacks = {
    onComplete: () => {
      this.download(success, failure)
    },
    onError: (e) => {
      console.log(`cannot create ${DROPBOX_FIELD_FILE}`)
      console.log(e)
      failure && failure()
      this.endConnecting && this.endConnecting()
    }
  }
  Dropbox('files/upload', param, emptyString, callbacks)
}
dropbox.append = function(board, success, failure) {
  this.startConnecting && this.startConnecting()
  let newBoards = [board].concat(this)
  
  let newBoardsString = JSON.stringify(newBoards)
  this.upload(newBoardsString, () => {
    this.download(success, failure)
  }, () => {
    console.log('fail to append')
    this.endConnecting && this.endConnecting()
    failure && failure()
  })
}
dropbox.remove = function(n, success, failure) {
  this.startConnecting && this.startConnecting()
  let newBoards = [].concat(this) // copy array
  newBoards.splice(n, 1) // remove a element at index n
  
  let newBoardsString = JSON.stringify(newBoards)
  this.upload(newBoardsString, () => {
    this.download(success, failure)
  }, () => {
    console.log('fail to append')
    this.endConnecting && this.endConnecting()
    failure && failure()
  })
}
dropbox.upload = function(contents, success, failure) {
  let param = {
    path: DROPBOX_FIELD_FILE,
    mode: 'overwrite'
  }
  let callbacks = {
    onComplete: () => {this.download(success, failure)},
    onError: () => {
      this.endConnecting && this.endConnecting()
      failure && failure()
    }
  }
  Dropbox('files/upload', param, contents, callbacks)
}
dropbox.startConnecting = null
dropbox.endConnectig = null


/*================================================================================ 
** storage template
**==============================================================================*/
const template = []
template.isAvailable = function() {
  console.log('isAvailable')
  return 'available'
}
template.fetch = function(success) {
  console.log('fetch')
  this.splice(0)
  success && success(this)
}
template.append = function(board, success) {
  console.log('append:', board)
  this.splice(0, 0, board)
  success && success(this)
}
template.remove = function(n, success) {
  console.log('remove')
  this.splice(n,1)
  success && success(this)
}


/*================================================================================ 
** utility
**==============================================================================*/
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