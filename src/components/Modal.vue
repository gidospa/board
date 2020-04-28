<template>
  <div id="modal-dialog">
    <div class="dialog-overlay"></div>
    <div class="modal-container" v-if="type == 'delete-field'">
      <div class="modal-close">
        <div @click="$emit('close', {type:'close'})">&times;</div>
      </div>

      <div class="modal-header">
        {{ field.timestamp }}
      </div>

      <div>
        <img :src="field.icon"/>
      </div>

      <div class="modal-button">
        <div class="left-button">
          <button class="default-button" @click="$emit('close', {type:'open', index:field.index})">Open</button>
        </div>
        <div class="right-button">
          <button class="default-button" @click="$emit('close', {type:'delete', index:field.index})">Delete</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    field: Object
  }
}
</script>

<style>
.dialog-overlay {
    z-index: 1;
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 120%;
    background-color: rgba(0, 0, 0, 0.6);
}

.modal-container {
  display: block;
  background-color: #f8f8f8;
  margin: 0;
  padding: 0px 0px 10px;
  border: 0px solid #888;
  width: 300px;
  text-align: center;
  z-index: 99;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border-radius: 4px;
}

.modal-body {
  margin: 20px 0;
}

.modal-button {
  margin: 1rem auto 0rem;
  width: 256px;
}
.left-button {
    text-align: left;
    float: left;
}
.right-button {
    text-align: right;
}
.modal-close {
    padding-top: 8px;
    padding-right: 10px;
    text-align: right;
    font-weight: bold;
    -moz-user-select: none;
    -webkit-user-select: none;
}
.modal-close:hover,
.modal-close:focus {
    color: #000;
    text-decoration: none;
}

</style>
