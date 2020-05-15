<template>
<div id="files">
  <div class="icon" id="append-mark" @click="$emit('saveField')">+</div>
  <div class="icon" id="open-new-field" @click="$emit('openNewField')">New</div>
  <div id="saved-field-icon">
    <img class="icon" v-for="(field, index) in fieldStorage" :key="field.timestamp+index" :src="field.icon" @click="onClickIcon(index)"/>
  </div>
</div>
</template>

<script>
export default {
  props: {
    storage: Array
  },
  data() {
    return {
      fieldStorage: [],
    }
  },
  methods: {
    onClickAppend() {
      console.log('append')
    },
    onClickIcon(index) {
      console.log("click icon", index)
      this.$emit("clickIcon", index)
    }
  },
  watch: {
    storage: function() {
      this.fieldStorage = this.storage
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

#saved-field-icon {
    text-align: left;
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    flex: 1;
}
#saved-field-icon::-webkit-scrollbar {
    height: 3px;
}
#saved-field-icon::-webkit-scrollbar-track {
    background: transparent;
    border: none;
}
#saved-field-icon::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
}

#saved-field-icon img {
    vertical-align: bottom;
    margin-bottom: 2px;
    height: 50px;
    border: 1px solid #888;
}
#saved-field-icon img:hover {
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

#open-new-field {
    border: 1px solid #888;
    margin-bottom: 2px;
}
#open-new-field:hover,
#open-new-field:focus {
    border-color: #222;    
}
</style>
