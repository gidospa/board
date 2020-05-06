<template>
<div id="app">
  <Storage :capture="capture" @changeStorage="changeStorage" @captureField="captureField"></Storage>
  <Files :storage="storage" @saveField="saveField" @clickIcon="onClickIcon"></Files>
  <Member
    :members="members"
    :colors="colors"
    @changeMemberList="changeMemberList"
    @changeTeamColors="changeTeamColors"
    @changeEnds="changeEnds">
  </Member>
  <Field 
    :members="members"
    :colors="colors"
    :isChangeEnds="isChangeEnds"
    :save="doSave"
    :capture="doCapture"
    @changePlayerInfo="changePlayerInfo" 
    @changeTeamColors="changeTeamColors"
    @doneSave="doneSave"
    @doneCapture="doneCapture">
  </Field>
  <Modal v-if="showModal" @close="closeModal" :type="modalType" :field="modalParam"></Modal>
</div>
</template>

<script>
import Field from './components/Field.vue'
import Member from './components/Member.vue'
import Files from './components/Files.vue'
import Storage from './components/Storage.vue'
import Modal from './components/Modal.vue'

export default {
  name: 'App',
  components: {
    Field,
    Member,
    Files,
    Storage,
    Modal
  },
  data() {
    return {
      members: '',
      colors: '',
      isChangeEnds: false,
      doCapture: false,
      doSave: false,
      storage: [],
      showModal: false,
      modalType: 'delete-field',
      modalParam: {},
      capture: {image: ''}
    }
  },
  methods: {
    changeMemberList(memberList) {
      this.members = memberList
    },
    changeTeamColors(colors) {
      this.colors = colors
      console.log(this.colors)
    },
    changePlayerInfo(players) {
      let members = [Array(players.length),Array(players.length)]

      // sort by 'team' and 'id'
      for (let p of players) {
        members[p.team][p.id] = `${p.number},${p.name}`
      }

      // to string
      let strMembers = ''
      for (let team = 0; team < 2; team++) {
        for (let p of members[team]) {
          if (p) {
            strMembers += p + '\n'
          }
        }
        strMembers += '\n' // seperator of each team
      }
      this.members = strMembers
    },
    changeEnds() {
      this.isChangeEnds = !this.isChangeEnds
    },
    saveField() {
      console.log('saved filed')
      this.doSave = !this.doSave
    },
    doneSave(field) {
      this.storage.unshift(field)
    },
    closeModal(state) {
      this.showModal = false
      console.log(state)
      if (this.modalType === 'delete-field') {
        if (state.type === 'delete') {
          this.storage.splice(state.index, 1)
        }
      }
    },
    onClickIcon(index) {
      console.log(index)
      this.modalType = 'delete-field'
      this.modalParam = {index, icon:this.storage[index].icon, timestamp:this.storage[index].timestamp}
      this.showModal = true
    },
    changeStorage() {
      console.log('changeStorage')
    },
    captureField() {
      console.log('captured field')
      this.doCapture = !this.doCapture
    },
    doneCapture(image) {
      this.capture = {image}
    }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
