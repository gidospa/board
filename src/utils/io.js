import {BOARD_LIST, OLD_BOARD_LIST, PLAYER_DB, EXPORT_FILE_NAME_PREFIX, PLAYER_DB_FILE_PREFIX} from './config.js'
import Dropbox from './dropbox.js'
import Google from './google.js'

/*================================================================================ 
** localStorge
**==============================================================================*/
export const local = []
local.isAvailable = function() {
  return 'available'
}
local.fetch = function(success) {
  console.log('load from localStorage')
  if (OLD_BOARD_LIST in localStorage) {  //  convert old list
    localStorage[BOARD_LIST] = localStorage[OLD_BOARD_LIST]
    delete localStorage[OLD_BOARD_LIST]
  }
  if (BOARD_LIST in localStorage) {
    let bds = JSON.parse(localStorage[BOARD_LIST])
    this.splice(0) // clear array
    Array.prototype.push.apply(this, bds.boardStorage)
    console.log('load boards from localStorage')
  }
  else {
    let boardString = JSON.stringify({
      timestamp: new Date().getTime(),
      boardStorage: [],
    })
    localStorage[BOARD_LIST] = boardString
    this.splice(0) // clear array
    console.log('create new boards at localStorage')
  }
  
  // playerDB
  if (localStorage[PLAYER_DB]) {
    let playerDB = JSON.parse(localStorage[PLAYER_DB])
    this.playerDB = playerDB
  }
  else {
    delete this.playerDB
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
  localStorage[BOARD_LIST] = newBoardsString
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
  localStorage[BOARD_LIST] = newBoardsString
  this.fetch(success)
}
local.clear = function() {
  const boardString = JSON.stringify({
    timestamp: new Date().getTime(),
    boardStorage: []
  })
  localStorage[BOARD_LIST] = boardString
  this.splice(0)
  localStorage.removeItem(PLAYER_DB)
  delete this.playerDB
}
local.savePlayerDB = function(db, success) {
  let playerDBString = JSON.stringify(db)
  localStorage.setItem(PLAYER_DB, playerDBString)
  this.playerDB = db
  success && success()
}
local.deletePlayerDB = function(success) {
  localStorage.removeItem(PLAYER_DB)
  delete this.playerDB
  success && success()
}

/*================================================================================ 
** google drive
**
** /.env
**   VUE_APP_GOOGLE_DRIVE_CLIENT_ID = 'GoogleDriveMyClientID';
**==============================================================================*/
const GOOGLE_DRIVE_CLIENT_ID = process.env.VUE_APP_GOOGLE_DRIVE_CLIENT_ID
const GOOGLE_BOARD_FILE = `${EXPORT_FILE_NAME_PREFIX}.json`
const GOOGLE_PLAYER_DB_FILE = `${PLAYER_DB_FILE_PREFIX}.json`

export const google = []
google.isAvailable = function(available, unavailable) {
  if (!GOOGLE_DRIVE_CLIENT_ID) {
    return 'unavailable'
  }
  window.gapi.load('client:auth2',() => {
    window.gapi.client.init({
      clientId: GOOGLE_DRIVE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.file'
    })
    .then(
      window.gapi.client.load('drive', 'v3')
    )
    .then(() => {
      available && available()
    })
    .catch((e) => {
      console.log('Google Drive is not available:', e)
      unavailable && unavailable()
    })
  })
}
google.fetch = async function(success, failure) {
  this.startConnecting && this.startConnecting()

  if (!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
    try {
      await window.gapi.auth2.getAuthInstance().signIn()
    }
    catch (e) {
      console.error(e.error)
      this.endConnecting && this.endConnecting()
      failure && failure()
      return
    }
  }
  
  if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
    try {
      let boardsString = await Google.download(GOOGLE_BOARD_FILE)
      if (boardsString == null) {
        await Google.upload(GOOGLE_BOARD_FILE, '[]')
        boardsString = await Google.download(GOOGLE_BOARD_FILE)
      }
      const boards = JSON.parse(boardsString)
      if (boards) {
        this.splice(0)
        Array.prototype.push.apply(this, boards)
        success && success()
      }
      else {
        console.log('cannot download or create board file')
        failure && failure()
      }
    }
    catch (e) {
      console.log(e)
      failure && failure()
    }

    try {
      const playerDBString = await Google.download(GOOGLE_PLAYER_DB_FILE)
      const playerDB = JSON.parse(playerDBString)
      if (playerDB) {
        this.playerDB = playerDB
      }
      else {
        console.log('cannot download player DB')
      } 
    }
    catch (e) {
      console.log(e)
    }
  }

  this.endConnecting && this.endConnecting()  
}
google.append = async function(board, success, failure) {
  this.startConnecting && this.startConnecting()
  const newBoards = [board].concat(this)

  const newBoardsString = JSON.stringify(newBoards)
  await Google.upload(GOOGLE_BOARD_FILE, newBoardsString)
  const boardsString = await Google.download(GOOGLE_BOARD_FILE)
  const boards = JSON.parse(boardsString)
  if (boards) {
    this.splice(0)
    Array.prototype.push.apply(this, boards)
    this.endConnecting && this.endConnecting()
    success && success()
    return
  }
  this.endConnecting && this.endConnecting()
  failure && failure()
}
google.remove = async function(n, success, failure) {
  this.startConnecting && this.startConnecting()
  let newBoards = [].concat(this) // copy array
  newBoards.splice(n, 1) // remove a element at index n

  const newBoardsString = JSON.stringify(newBoards)
  await Google.upload(GOOGLE_BOARD_FILE, newBoardsString)
  const boardsString = await Google.download(GOOGLE_BOARD_FILE)
  const boards = JSON.parse(boardsString)
  if (boards) {
    this.splice(0)
    Array.prototype.push.apply(this, boards)
    this.endConnecting && this.endConnecting()
    success && success()
    return
  }
  this.endConnecting && this.endConnecting()
  failure && failure()
}
google.savePlayerDB = async function(playerDB, success, failure) {
  this.startConnecting && this.startConnecting()

  try {
    const playerDBString = JSON.stringify(playerDB)
    await Google.upload(GOOGLE_PLAYER_DB_FILE, playerDBString)
    this.playerDB = playerDB
    success && success()  
  }
  catch (e) {
    console.log(e)
    failure && failure()
  }

  this.endConnecting && this.endConnecting()
}
google.deletePlayerDB = async function(success, failure) {
  this.startConnecting && this.startConnecting()

  try {
    await Google.delete(GOOGLE_PLAYER_DB_FILE)
    delete this.playerDB
    success && success()
  }
  catch (e) {
    console.log(e)
    failure && failure
  }

  this.endConnecting && this.endConnecting()
}
google.clearAccesskey = Google.clear
google.startConnecting = null
google.endConnecting = null


/*================================================================================ 
** dropbox
**
** /.env
**   VUE_APP_DROPBOX_CLIENT_ID = 'DropboxMyappsAppkey';
**==============================================================================*/
const DROPBOX_CLIENT_ID = process.env.VUE_APP_DROPBOX_CLIENT_ID
const DROPBOX_BOARD_FILE = `/${EXPORT_FILE_NAME_PREFIX}.json`
const DROPBOX_PLAYER_DB_FILE = `/${PLAYER_DB_FILE_PREFIX}.json`

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
      console.log('complete dropbox authenticate')
      this.download(success, failure)
      console.log('download player db from dropbox')
      this.downloadPlayerDB((db) => {
        this.playerDB = db
      })
    },
    onError: (e) => {
      console.log('incomplete dropbox authenticate')
      this.endConnecting && this.endConnecting()
      failure && failure(e)
    }
  }

  Dropbox.authenticate(parameter, callbacks)
}
dropbox.download = function(success, failure) {
  console.log('download')
    
  let callbacks = {
    onComplete: (result, response) => {this.loadBoard(result, response, success, failure)},
    onError: (e) => {
      switch (e.status) {
      case 401: // Unauthorized
        console.log('401 Unauthorized')
        console.log('remove dropbox access token');
        Dropbox.clear();
        this.endConnecting && this.endConnecting()
        failure && failure(e)
        break;
          
      case 409: // Conflict(path not found)
        console.log('create new boards')
        this.createNewFile(success, failure)
        break;
          
      default:
        console.log('cannot download from dropbox');
        this.endConnecting && this.endConnecting()
        failure && failure(e)
      }
    }
  }
  Dropbox('files/download', {path: DROPBOX_BOARD_FILE}, callbacks);
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
        failure && failure(`parsing ${DROPBOX_BOARD_FILE} failed`)
      }
    }
    catch (e) {
      self.endConnecting && self.endConnecting()
      failure && failure(e)
    }
  })

  reader.readAsText(response)
}
dropbox.createNewFile = function(success, failure) {
  console.log('create New boards file')
  let emptyString = '[]'
  let param = {
    path: DROPBOX_BOARD_FILE,
    mode: 'overwrite'
  }
  let callbacks = {
    onComplete: () => {
      this.download(success, failure)
    },
    onError: (e) => {
      console.log(`cannot create ${DROPBOX_BOARD_FILE}`)
      failure && failure(e)
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
  }, (e) => {
    console.log('fail to append')
    this.endConnecting && this.endConnecting()
    failure && failure(e)
  })
}
dropbox.remove = function(n, success, failure) {
  this.startConnecting && this.startConnecting()
  let newBoards = [].concat(this) // copy array
  newBoards.splice(n, 1) // remove a element at index n
  
  let newBoardsString = JSON.stringify(newBoards)
  this.upload(newBoardsString, () => {
    this.download(success, failure)
  }, (e) => {
    console.log('fail to append')
    this.endConnecting && this.endConnecting()
    failure && failure(e)
  })
}
dropbox.upload = function(contents, success, failure) {
  let param = {
    path: DROPBOX_BOARD_FILE,
    mode: 'overwrite'
  }
  let callbacks = {
    onComplete: () => {this.download(success, failure)},
    onError: (e) => {
      this.endConnecting && this.endConnecting()
      failure && failure(e)
    }
  }
  Dropbox('files/upload', param, contents, callbacks)
}
dropbox.downloadPlayerDB = function(success, failure) {
  let callbacks = {
    onComplete: (result, response) => {
      let reader = new FileReader()
      reader.addEventListener('loadend', () => {
        try {
          let playerDB = JSON.parse(reader.result)
          if (playerDB) {
            success && success(playerDB)
          }
          else {
            failure && failure()
          }
        }
        catch (e) {
          console.log(`cannot parse ${PLAYER_DB}:`, e)
          failure && failure()
        }
      })
      reader.readAsText(response)
    },
    onError: (e) => {
      switch (e.status) {
      case 401: // Unauthorized
        console.log('401 Unauthorized')
        break;
      default:
        console.log('playerDB not found');
      }
    }
  }
  Dropbox('files/download', {path: DROPBOX_PLAYER_DB_FILE}, callbacks);
}
dropbox.uploadPlayerDB = function(contents, success, failure) {
  let param = {
    path: DROPBOX_PLAYER_DB_FILE,
    mode: 'overwrite'
  }
  let callbacks = {
    onComplete: () => {this.downloadPlayerDB(success, failure)},
    onError: (e) => {
      console.log(e)
      failure && failure(e)
    }
  }
  Dropbox('files/upload', param, contents, callbacks)
}
dropbox.savePlayerDB = function(db, success, failure) {
  console.log(db)
  let playerDBString = JSON.stringify(db)
  this.uploadPlayerDB(playerDBString, (playerDB) => {
    this.playerDB = playerDB
    console.log('upload succeeded')
    success && success()
  }, () => {failure && failure()})
}
dropbox.deletePlayerDB = function(success, failure) {
  console.log('deletePlayerDB')
  this.uploadPlayerDB("", (playerDB) => {
    // can't delete playerDB
    console.log('cannot delete playerDB:', playerDB)
    failure && failure()
  }, () => {
    // deleted playerDB
    delete this.playerDB
    success && success()  
  })
}
dropbox.clearAccesskey = Dropbox.clear
dropbox.startConnecting = null
dropbox.endConnecting = null

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
