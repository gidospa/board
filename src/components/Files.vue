<template>
<div id="files">
  <div class="file-io-button">
    <label>Import</label>
  </div>
  <div class="file-io-button">
    Export
  </div>
  <div class="file-io-button">
    capture
  </div>
  <span>&nbsp;</span><!--
  --><div class="file-io-button">
    Dropbox
  </div>
  <div class="file-io-button">
    Google
  </div>
  <div class="file-io-button" id="clear-local-storage">
    Clear
  </div>
</div>
</template>

<script>
</script>

<style>
#files {
  margin: 30px 10px 20px;
  padding: 0px 16px 0px;
  text-align: left;
  user-select: none;
  touch-action: none;
}
.file-io-button {
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
.file-io-button:hover {
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
</style>
