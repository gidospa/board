<template>
<div id="app">
  <Storage
    :capture="capture"
    :storage="storage"
    :exportFieldData="exportFieldData"
    @changeStorage="changeStorage" 
    @captureField="captureField"
    @importField="importField"
    @exportField="exportField">
  </Storage>
  <Files
    :storage="storage"
    @saveField="saveField"
    @clickIcon="onClickIcon"
    @openNewField="openNewField">
  </Files>
  <Member
    :members="members"
    :colors="colors"
    @changeMemberList="changeMemberList"
    @changeTeamColors="changeTeamColors"
    @changeEnds="changeEnds">
  </Member>
  <Field 
    :colors="colors"
    :save="doSave"
    :capture="doCapture"
    :playerInfo="players"
    @updatePlayerPosition="updatePlayerPosition"
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
import Players from './utils/players.js'
import * as Config from './utils/config.js'
import {rgba2hex, hex2rgba} from './utils/color.js'

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
      colors: Config.TEAM_COLORS,
      players: [],
      doCapture: {},
      doSave: {},
      storage: [],
      showModal: false,
      modalType: 'saved-field',
      modalParam: {},
      capture: {image: ''},
      exportFieldData: {},
    }
  },
  methods: {
    saveToLocalStorage() {
      localStorage[Config.LAST_FIELD_DATA] = JSON.stringify({
          version: Config.VERSION,
          players: this.players,
          color: hex2rgba(this.colors),
      })
    },
    updatePlayerPosition(players) {
      this.players = players
      this.saveToLocalStorage()
    },
    changeMemberList(memberList) {
      let teams = memberList.split('\n\n')
      let newTeams = {}
      teams.forEach((team, teamId) => {
        if (team == "") return
        newTeams[teamId] = team.split('\n')
      })
      this.players.forEach((player) => {
        let newPlayer = newTeams[player.team][player.id].split(',')
        player.number = newPlayer[0]
        player.name = newPlayer[1]
      })
      this.saveToLocalStorage()
    },
    changeTeamColors(colors) {
      this.colors = colors
      this.saveToLocalStorage()
    },
    changePlayerInfo(player, number, name) {
      for (let p of this.players) {
        if (p.team == player.team && p.id == player.id) {
          p.number = number
          p.name = name
        }
      }
      this.saveToLocalStorage()
    },
    changeEnds() {
      // rotation matrix
      // |X|   | -1,  0, 2cx |   |x|
      // |Y| = |  0, -1, 2cy | x |y|
      // |1| = |  0,  0,   1 |   |1|
      // X = -x + 2cx
      // Y = -y + 2cy
      // (x, y) (cx, cy)
      let cx = Config.NORMALIZED.CENTERMARK.LEFT;
      let cy = Config.NORMALIZED.CENTERMARK.TOP;

      for (let p of this.players) {
          if (p.y < Config.NORMALIZED.BENCH.TOP) {
              p.x = 2*cx - p.x;
              p.y = 2*cy - p.y;
          }
      }
      this.players.splice(0, 1, this.players[0]) // update DOM
      this.saveToLocalStorage()
      console.log('changeEnds')
    },
    saveField() {
      console.log('saved filed')
      this.doSave = {} // fire method in Field.vue
    },
    doneSave(field) {
      this.storage.append(field)
    },
    closeModal(state) {
      this.showModal = false
      console.log('close modal')

      if (this.modalType === 'saved-field') {
        if (state.type === 'delete') {
          this.storage.remove(state.index)
        }
        if (state.type === 'open') {
          this.players = this.storage[state.index].players
          this.colors = rgba2hex(this.storage[state.index].color)          
        }
      }
      if (this.modalType === 'open-new-field') {
        if (state.type === 'open') {
          let formations = []
          for (const team of ['home', 'away']) {
            let f = state[team].split('-')
            if (f[0] === 'none') {
              formations.push([])
            }
            else {
              f.unshift('1')
              formations.push(f.map(Number))
            }
          }
          this.players = Players.newPlayers(formations)
          this.saveToLocalStorage()
        }
      }
    },
    onClickIcon(index) {
      console.log(index)
      this.modalType = 'saved-field'
      this.modalParam = {index, icon:this.storage[index].icon, timestamp:this.storage[index].timestamp}
      this.showModal = true
    },
    openNewField() {
      console.log("openNewfield")
      this.modalType = 'open-new-field'

      let c = this.colors.split(',')
      this.modalParam = {homeColor:c[0], awayColor:c[1]}
      
      this.showModal = true
    },
    changeStorage(fields) {
      console.log('changeStorage')
      this.storage = fields
    },
    captureField() {
      console.log('captured field')
      this.doCapture = {} // fire method in Field.vue
    },
    doneCapture(image) {
      this.capture = {image}
    },
    importField(field) {
      this.players = field.players
      this.colors = field.color
    },
    exportField() {
      console.log('export filed')
      this.exportFieldData = {version: Config.VERSION, players: this.players, color: this.colors}
    }
  },
  created() {
    if (localStorage[Config.LAST_FIELD_DATA]) {
      let lastFieldData = JSON.parse(localStorage[Config.LAST_FIELD_DATA])
      if (lastFieldData.version == Config.VERSION) {
        this.players = lastFieldData.players
        this.colors = rgba2hex(lastFieldData.color)
      }
      else {
        // todo old format
        console.log('check local storage version', lastFieldData.version)
      }
    }

    if (this.players.length == 0) {
      this.players = Players.newPlayers(null)
    }
  },
  watch: {
    players: function() {
      console.log('watch players')
    }
  },
  computed: {
    members: function() {
      // sort by 'team' and 'id'
      let members = [Array(this.players.length), Array(this.players.length)]
      for (let p of this.players) {
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
      return strMembers
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
