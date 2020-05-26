<template>
<div id="storage">
  <div class="storage-button">
    <label for="import-board">Import</label>
    <input id="import-board" type="file" accept="text/plain, application/json" style="display:none" @change="onImport">
  </div>
  <div class="storage-button" @click="$emit('exportField')">
    Export
  </div>
  <div class="storage-button" @click="$emit('captureField')">
    Capture
  </div>
  <span class="blank">&nbsp;</span>
  <div id="dropbox" class="storage-button" @click="dropboxStorage">
    Dropbox
  </div>
  <div id="google" class="storage-button" @click="googleStorage">
    Google
  </div>
  <div class="storage-button" id="clear-local-storage">
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
    storage: Array,
    exportFieldData: Object,
  },
  data: function() {
    return {
      currentStorage: {},
    }
  },
  methods: {
    googleStorage() {
      console.log('change storage to Google Drive')
      this.currentStorage = google
    },
    dropboxStorage(e) {
      let dbx = document.getElementById('dropbox')

      if (e.target.classList.contains('connected')) {
        console.log('change storage to localStorage')
        dbx.classList.remove('connected')
        this.currentStorage = local
      }
      else {
        console.log('change storage to Dropbox')
        dbx.classList.add('connected')
        this.currentStorage = dropbox
      }
    },
    onImport(e) {
      const fieldFile = e.target.files[0]
      e.target.value = '' // fire when same file is selected next time

      let reader = new FileReader()
      reader.addEventListener('load', () => {
        try {
          let field = JSON.parse(reader.result)
          if (field) {
            this.$emit('importField', {players:field.players, color:field.color})
          }
        }
        catch (e) {
          console.error(e)
        }
      })
      reader.readAsText(fieldFile)
    },
  },
  watch: {
    capture: function() {
      let filename = CAPTURE_FILE_PREFIX + getDatetime() + '.png'
      console.log(filename)

      download(filename, this.capture.image)
    },
    exportFieldData: function() {
      let filename = EXPORT_FILE_NAME_PREFIX + getDatetime() + '.txt'
      let boardString = JSON.stringify(this.exportFieldData)
      let url = URL.createObjectURL(new Blob([boardString], {type: 'text/play'}))
      download(filename, url)
    },
    storage: function(newStorage) {
      console.log('Storage detected changing storage')
      this.currentStorage.save(newStorage)
    }
  },
  created() {
    this.currentStorage = local
    let fieldDataList = this.currentStorage.load()
    console.log('local storage fields:', fieldDataList)
    if (fieldDataList) {
      if ('boardStorage' in fieldDataList) {
        this.$emit('changeStorage', fieldDataList.boardStorage)
      }
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
</style>
