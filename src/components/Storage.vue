<template>
<div id="storage">
  <div class="storage-button">
    <label for="import-board">Import</label>
    <input id="import-board" type="file" accept="text/plain, application/json" style="display:none" @change="onImport">
  </div>
  <div class="storage-button" @click="$emit('export-board')">
    Export
  </div>
  <div class="storage-button" @click="$emit('capture-board')">
    Capture
  </div>
  <span class="blank">&nbsp;</span>
  <div v-show="isDropboxAvailable" id="dropbox" class="storage-button" @click="dropboxStorage">
    Dropbox
  </div>
  <div v-show="isGoogleAvailable" id="google" class="storage-button" @click="googleStorage">
    Google
  </div>
  <div class="storage-button" id="clear-local-storage" @click="$emit('clear-local-storage')">
    Clear
  </div>
</div>
</template>

<script>
import {CAPTURE_FILE_PREFIX, EXPORT_FILE_NAME_PREFIX} from '../utils/config.js'
import {local, google, dropbox, getDatetime, download} from '../utils/io.js'

export default {
  props: {
    capture: Object,
    exportBoardData: Object,
    clearBoardList: Object,
    clearAccesskey: Object,
  },
  data: function() {
    return {
      currentStorage: {},
      isDropboxAvailable: false,
      isGoogleAvailable: false,
    }
  },
  methods: {
    googleStorage(e) {
      if (e.target.classList.contains('connected')) {
        console.log('change storage to localStorage')
        this.currentStorage.disconnect && this.currentStorage.disconnect()
        this.currentStorage = local
        local.fetch(() => {
          this.$emit('change-storage', this.currentStorage)
        })
      }
      else {
        console.log('change storage to Google Drive')
        google.fetch(() => {
          console.log('connected to Google Drive')
          this.currentStorage.disconnect && this.currentStorage.disconnect()
          this.currentStorage = google
          this.currentStorage.disconnect = function() {
            let ggl = document.getElementById('google')
            ggl.classList.remove('connected')
          }
          this.$emit('change-storage', this.currentStorage)
          const ggl = document.getElementById('google')
          ggl.classList.add('connected')
        }, (e) => {
          console.log('fail to connect to Google Drive:', e)
        })
      }
    },
    dropboxStorage(e) {
      if (e.target.classList.contains('connected')) {
        console.log('change storage to localStorage')
        this.currentStorage.disconnect && this.currentStorage.disconnect()
        this.currentStorage = local
        local.fetch(() => {
          this.$emit('change-storage', this.currentStorage)
        })
      }
      else {
        console.log('change storage to Dropbox')
        dropbox.fetch(() => {
          console.log('connected to Dropbox')
          this.currentStorage.disconnect && this.currentStorage.disconnect()
          this.currentStorage = dropbox
          this.currentStorage.disconnect = function() {
            let dbx = document.getElementById('dropbox')
            dbx.classList.remove('connected')
          }
          this.$emit('change-storage', this.currentStorage)
          let dbx = document.getElementById('dropbox')
          dbx.classList.add('connected')
        }, (e) => {
          console.log('fail to connect to Dropbox:', e)
        })
      }
    },
    onImport(e) {
      const boardFile = e.target.files[0]
      e.target.value = '' // fire when same file is selected next time

      let reader = new FileReader()
      reader.addEventListener('load', () => {
        try {
          let board = JSON.parse(reader.result)
          if (board) {
            this.$emit('import-board', {players:board.players, color:board.color})
          }
        }
        catch (e) {
          console.error(e)
        }
      })
      reader.readAsText(boardFile)
    },
  },
  watch: {
    capture: function() {
      let filename = CAPTURE_FILE_PREFIX + getDatetime() + '.png'
      console.log(filename)

      download(filename, this.capture.image)
    },
    exportBoardData: function() {
      let filename = EXPORT_FILE_NAME_PREFIX + getDatetime() + '.txt'
      let boardString = JSON.stringify(this.exportBoardData)
      let url = URL.createObjectURL(new Blob([boardString], {type: 'text/play'}))
      download(filename, url)
    },
    clearBoardList: function() {
      console.log('clear board list on localStorage')
      local.clear()
    },
    clearAccesskey: function() {
      console.log('clear access key')
      dropbox.clearAccesskey()
      google.clearAccesskey()
    }
  },
  created() {
    window.googleInit = () => {
      console.log('gapi loaded')
      google.isAvailable(() => {
          this.isGoogleAvailable = true
      }, () => {
          this.isGoogleAvailable = false
      })
    }
  },
  mounted() {
    this.currentStorage = local
    this.currentStorage.fetch()
    this.$emit('change-storage', this.currentStorage)
    
    // initialize Dropbox
    dropbox.startConnecting = function() {
      let dbx = document.getElementById('dropbox')
      dbx.classList.add('connecting')
    }
    dropbox.endConnecting = function() {
      let dbx = document.getElementById('dropbox')
      dbx.classList.remove('connecting')
    }
    switch (dropbox.isAvailable()) {
    case 'available':
      this.isDropboxAvailable = true
      break
    case 'unavailable':
      this.isDropboxAvailable = false
      break
    case 'connected': // Dropbox OAuth redirecting
      this.isDropboxAvailable = true
      dropbox.fetch(() => {
        console.log('connected to Dropbox')
        this.currentStorage.disconnect && this.currentStorage.disconnect()
        this.currentStorage = dropbox
        this.currentStorage.disconnect = function() {
          let dbx = document.getElementById('dropbox')
          dbx.classList.remove('connected')
        }
        this.$emit('change-storage', this.currentStorage)
        let dbx = document.getElementById('dropbox')
        dbx.classList.add('connected')
      }, (e) => {
        console.log('fail to connect to Dropbox:', e)
      })
      break
    }

    // initialize Google
    google.startConnecting = function() {
      let dbx = document.getElementById('google')
      dbx.classList.add('connecting')
    }
    google.endConnecting = function() {
      let dbx = document.getElementById('google')
      dbx.classList.remove('connecting')
    }
  }
}
</script>

<style scoped>
#storage {
  margin: 30px 10px 20px;
  padding: 0px 16px 0px;
  text-align: left;
  user-select: none;
  touch-action: none;
}
.storage-button {
    cursor: default;
    display: inline-block;
    margin: 0 5px;
    border: 1px solid #888;
    border-radius: 0.25rem;
    text-align: center;
    line-height: 24px;
    width: 64px;
    vertical-align: top;
    background: #fff;
    font-size: 0.9rem;
}
.storage-button:hover {
    border-color: #222;
}
#clear-local-storage {
    float: right;
}
#clear-local-storage:hover,
#clear-local-storage:focus {
    cursor: default;
    float: right;
    color: #222;
}
.blank {
  padding: 0 0.5rem;
}
.connected {
  background: #007ee5 !important;
  color: white !important;
}
.connecting {
    animation-name: blink-background;
    animation-duration: 2s;
    animation-timing-function: ease;
    animation-iteration-count: infinite;
}
@keyframes blink-background {
    0% {
        border-color: #0000ff;
    }
    50% {
        border-color: #ffffff;
    }
    100% {
        border-color: #0000ff;
    }
}
</style>
