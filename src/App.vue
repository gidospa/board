<template>
<div id="app">
  <Storage
    :capture="capture"
    :storage="storage"
    :exportBoardData="exportBoardData"
    :clearBoardList="clearBoardList"
    :clearAccesskey="clearAccesskey"
    @changeStorage="changeStorage" 
    @captureBoard="captureBoard"
    @importBoard="importBoard"
    @exportBoard="exportBoard"
    @clearLocalStorage="clearLocalStorage">
  </Storage>
  <Files
    :storage="storage"
    @saveBoard="saveBoard"
    @clickIcon="onClickIcon"
    @openNewBoard="openNewBoard">
  </Files>
  <Member
    :members="members"
    :colors="colors"
    :playerdb="playerDB"
    @changeMemberList="changeMemberList"
    @changeTeamColors="changeTeamColors"
    @changeEnds="changeEnds"
    @showTeamId="showTeamId"
    @loadPlayerDB="loadPlayerDB">
  </Member>
  <Board 
    :colors="colors"
    :save="doSave"
    :capture="doCapture"
    :playerInfo="players"
    @updatePlayerPosition="updatePlayerPosition"
    @changePlayerInfo="changePlayerInfo" 
    @changeTeamColors="changeTeamColors"
    @doneSave="doneSave"
    @doneCapture="doneCapture">
  </Board>
  <Modal v-if="showModal" @close="closeModal" :type="modalType" :board="modalParam"></Modal>
</div>
</template>

<script>
import Board from './components/Board.vue'
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
    Board,
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
      playerDB: null,
      showModal: false,
      modalType: 'saved-board',
      modalParam: {},
      capture: {image: ''},
      exportBoardData: {},
      clearBoardList: {},
      clearAccesskey: {},
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
    changeMemberList(memberList, teamName) {
      let teams = memberList.split('\n\n')
      let newTeams = {}
      teams.forEach((team, teamId) => {
        if (team == "") return
        newTeams[teamId] = team.split('\n')
        if (this.playerDB['teams'] && this.playerDB['teams'][teamName[teamId]]) {
          newTeams[teamId].playerDB = this.playerDB['teams'][teamName[teamId]].players
        }
      })
      this.players.forEach((player) => {
        let newPlayer = newTeams[player.team][player.id].split(',')
        player.number = newPlayer[0]
        player.name = newPlayer[1]
        if (!player.name && newTeams[player.team].playerDB) {
          let name = newTeams[player.team].playerDB[player.number]
          if (name) {
            player.name = name
          }
        }
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
    loadPlayerDB(playerDB) {
      console.log('loadPlayerDB')
      this.storage.savePlayerDB(playerDB, () => {
        this.playerDB = playerDB
      })
    },
    showTeamId() {
      console.log('showTeamId')
      if (!this.playerDB) return;

      let categoryList = {}
      for (const team in this.playerDB.teams) {
        let category = this.playerDB.teams[team].category
        if (!categoryList[category]) {
          categoryList[category] = []
        }
        categoryList[category].push(team)
      }

      let teamHtml = ''
      for (const category in categoryList) {
        let max_character_in_row = 33
        teamHtml += `<div>${category}<div>`

        let line = ''
        for (const teamId of categoryList[category]) {
          if (line.length + teamId.length < max_character_in_row) {
            line += teamId + ' '
          }
          else {
            teamHtml += `<div>${line}</div>`
            line = teamId + ' '
          }
        }
        teamHtml += `<div>${line}</div><br>`
      }

      // show modal
      this.modalType = 'show-team-id'
      this.modalParam = {teamHtml, version: this.playerDB.version}
      this.showModal = true
    },
    saveBoard() {
      console.log('saved filed')
      this.doSave = {} // fire method in Board.vue
    },
    doneSave(board) {
      this.storage.append(board)
    },
    closeModal(state) {
      this.showModal = false
      console.log('close modal')

      if (this.modalType === 'saved-board') {
        if (state.type === 'delete') {
          this.storage.remove(state.index)
        }
        if (state.type === 'open') {
          this.players = this.storage[state.index].players
          this.colors = rgba2hex(this.storage[state.index].color)          
        }
      }
      if (this.modalType === 'open-new-board') {
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
      if (this.modalType === 'show-team-id') {
        if (state.type === 'delete') {
          console.log('delete player db')
          this.storage.deletePlayerDB(() => {
            this.playerDB = null
          })
        }
      }
      if (this.modalType === 'clear-localstorage') {
        if (state.type === 'clear') {
          for (let i = 0; i < state.items.length; i++) {
            if (state.items[i] === 'board-list') {
              console.log('clear board list')
              this.clearBoardList = {}
              this.playerDB = null
              delete localStorage.lastField
            }
            if (state.items[i] === 'accesskey') {
              console.log('clear access key')
              this.clearAccesskey = {}
            }
          }
        }
      }
    },
    onClickIcon(index) {
      console.log(index)
      this.modalType = 'saved-board'
      this.modalParam = {index, icon:this.storage[index].icon, timestamp:this.storage[index].timestamp}
      this.showModal = true
    },
    openNewBoard() {
      console.log("openNewBoard")
      this.modalType = 'open-new-board'

      let c = this.colors.split(',')
      this.modalParam = {homeColor:c[0], awayColor:c[1]}
      
      this.showModal = true
    },
    changeStorage(boards) {
      console.log('changeStorage')
      this.storage = boards
      
      if (boards.playerDB) {
        this.playerDB = boards.playerDB
      }
      else {
        if (this.playerDB) {
          this.storage.savePlayerDB(this.playerDB, () => {
            console.log('copy playerDB to storage')
          }, () => {
            console.log('cannot copy playerDB to storage')
            this.playerDB = null
          })
        }
      }
    },
    captureBoard() {
      console.log('captured board')
      this.doCapture = {} // fire method in Board.vue
    },
    doneCapture(image) {
      this.capture = {image}
    },
    importBoard(board) {
      this.players = board.players
      this.colors = board.color
    },
    exportBoard() {
      console.log('export filed')
      this.exportBoardData = {version: Config.VERSION, players: this.players, color: this.colors}
    },
    clearLocalStorage() {
      console.log('claer localStorage')
      this.modalType = 'clear-localstorage'
      this.showModal = true
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
