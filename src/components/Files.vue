<template>
<div id="files" v-bind:class="hidden ? 'hidden' : ''">
  <div class="icon" id="append-mark" @click="$emit('save-board')">+</div>
  <div class="icon" id="open-new-board" @click="$emit('open-new-board')">New</div>
  <div id="saved-board-icon">
    <img class="icon" v-for="(board, index) in boardStorage" :key="board.timestamp+index" :src="board.icon" @click="onClickIcon(index)"/>
  </div>
</div>
</template>

<script>
export default {
  props: {
    storage: Array,
    hidden: Boolean,
  },
  data() {
    return {
      boardStorage: [],
    }
  },
  methods: {
    onClickIcon(index) {
      console.log("click icon", index)
      this.$emit("click-icon", index)
    }
  },
  watch: {
    storage: function() {
      console.log('update boards list')
      this.boardStorage = this.storage
    }
  }
}
</script>

<style>
#files {
  display: flex;
  justify-content: flex-start;
  margin: 20px 10px 30px;
  padding: 0rem 1rem;
  text-align: left;
  max-height: 100vh;
  visibility: visible;
  opacity: 1;
  transition: opacity 0.4s, visibility 0.4s, max-height 0.3s;
}
#files.hidden {
  margin: 0;
  max-height: 0;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.1s, visibility 0.1s, max-height 0.2s;
}
.icon {
    display: inline-block;
    margin: 0 5px;
    border-radius: 0.25rem;
    width: 64px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    -moz-user-select: none;
    -webkit-user-select: none;
    background: #fff;
}

#saved-board-icon {
    text-align: left;
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    flex: 1;
}
#saved-board-icon::-webkit-scrollbar {
    height: 3px;
}
#saved-board-icon::-webkit-scrollbar-track {
    background: transparent;
    border: none;
}
#saved-board-icon::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
}

#saved-board-icon img {
    vertical-align: bottom;
    margin-bottom: 2px;
    height: 50px;
    border: 1px solid #888;
}
#saved-board-icon img:hover {
    border: 1px solid #222;
}

#append-mark {
    font-size: 28px;
    padding: 0px 1px;
    background: none;
}
#append-mark:hover,
#append-mark:focus {
    color: #222;
    text-decoration: none;
    font-weight: bold;
}

#open-new-board {
    border: 1px solid #888;
    margin-bottom: 2px;
}
#open-new-board:hover,
#open-new-board:focus {
    border-color: #222;    
}
</style>
