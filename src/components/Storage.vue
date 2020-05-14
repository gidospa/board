<template>
<div id="storage">
  <div class="storage-button">
    <label>Import</label>
  </div>
  <div class="storage-button">
    Export
  </div>
  <div class="storage-button" @click="$emit('captureField')">
    Capture
  </div>
  <span class="blank">&nbsp;</span>
  <div class="storage-button">
    Dropbox
  </div>
  <div class="storage-button">
    Google
  </div>
  <div class="storage-button" id="clear-local-storage">
    Clear
  </div>
</div>
</template>

<script>
import {CAPTURE_FILE_PREFIX} from '../utils/config.js'

export default {
  props: {
    capture: Object
  },
  watch: {
    capture: function() {
      console.log(this.capture)

      // filename
      let now = new Date()
      let datetime = now.getFullYear()
      datetime += ('0' + (now.getMonth()+1)).slice(-2)
      datetime += ('0' + now.getDate()).slice(-2)
      datetime += '-'
      datetime += ('0' + now.getHours()).slice(-2)
      datetime += ('0' + now.getMinutes()).slice(-2)
      datetime += ('0' + now.getSeconds()).slice(-2)
      let filename = CAPTURE_FILE_PREFIX + datetime + '.png'
      console.log(filename)

      // download capture image
      let a = document.createElement('a')
      a.download = filename
      a.href = this.capture.image
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
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
</style>
