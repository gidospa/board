<template>
<div id="storage">
  <div class="storage-button">
    <label>Import</label>
  </div>
  <div class="storage-button">
    Export
  </div>
  <div class="storage-button">
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
