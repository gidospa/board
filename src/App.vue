<template>
<div id="app">
  <Files></Files>
  <Storage :storage="storage" @captureField="captureField"></Storage>
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
    :capture="doCapture"
    @changePlayerInfo="changePlayerInfo" 
    @changeTeamColors="changeTeamColors"
    @doneCapture="doneCapture">
  </Field>
</div>
</template>

<script>
import Field from './components/Field.vue'
import Member from './components/Member.vue'
import Files from './components/Files.vue'
import Storage from './components/Storage.vue'

export default {
  name: 'App',
  components: {
    Field,
    Member,
    Files,
    Storage
  },
  data() {
    return {
      members: '',
      colors: '',
      isChangeEnds: false,
      doCapture: false,
      storage: [],
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
      this.isChangeEnds = this.isChangeEnds ? false : true
    },
    captureField() {
      console.log('captured filed')
      this.doCapture = this.doCapture ? false : true
      console.log(this.doCapture)
    },
    doneCapture(capture) {
      this.storage.unshift(capture)
    },
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
