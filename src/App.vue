<template>
<div id="app">
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
    @changePlayerInfo="changePlayerInfo" 
    @changeTeamColors="changeTeamColors">
  </Field>
</div>
</template>

<script>
import Field from './components/Field.vue'
import Member from './components/Member.vue'

export default {
  name: 'App',
  components: {
    Field,
    Member
  },
  data() {
    return {
      members: '',
      colors: '',
      isChangeEnds: false
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
    }
  }
}
</script>

<style>
* {
  font-family: "Yu Gothic", "YuGothic", Arial, sans-serif;
  color: #444;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
button {
  padding: 0.3rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #888;
  background-color: white;
  text-decoration: none;
}
</style>
