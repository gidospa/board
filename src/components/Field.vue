<template>
<div id="view">
  <svg id="field" :width="screenWidth" :height="screenHeight">
    <image href="../assets/field.jpg" :transform="fieldRotate" x="0" y="0" :width="fieldWidth" :height="fieldHeight" 
      @mousedown="fieldMouseDown"
      @touchstart="fieldTouchStart" />
    <g v-for="player in players" :key="player.team + ':' + player.id"
        :transform="`translate(${player.cx},${player.cy})`"
        :visibility="visibility[player.team][player.id]"
        @mousedown="mouseDown($event, player.team, player.id)"
        @touchstart="touchStart($event, player.team, player.id)">
      <text class="player name" x=0 :y="playerSize*1.2" :font-size="fontSize*0.7">{{ player.name }}</text>
      <circle class="player shadow" :cx="playerSize/10" :cy="playerSize/10" :r="playerSize"></circle>
      <circle class="player body" cx=0 cy=0 :r="playerSize" stroke="#333" stroke-width="2" :fill="teamColor[player.team]"></circle>
      <text class="player number" x=0 y=0 :font-size="fontSize">{{ player.number }}</text>
    </g>
  </svg>
</div>
</template>

<script>
import Players from '../utils/players.js'
import Capture from '../utils/capture.js'
import * as Config from '../utils/config.js'

export default {
  props: {
    members: String,
    colors: String,
    isChangeEnds: Boolean,
    save: Boolean,
    capture: Boolean,
  },
  data() {
    return {
      screenWidth: 800,
      screenHeight: 600,
      playerSize: 30,
      fontSize: 30,
      fontColor: `${this.color}`,
      players: [],
      visibility: [[],[]],
      teamColor: [`rgba(255, 0, 0, 0.8)`, `rgba(0, 0, 255, 0.8)`],
      selectedPlayer: null,
      startOffset: null,
      noBench: false,
      isLandscape: null,
      fieldRotate: null,
      fieldWidth: null,
      fieldHeight: null,
      isClick: false,
      fieldClick: null,
    }
  },
  methods: {
    getCursorPosition(e) {
      let fieldPos = document.getElementById('field').getBoundingClientRect()
      let x = Math.round(e.clientX - fieldPos.left)
      let y = Math.round(e.clientY - fieldPos.top)
      return {x, y}
    },
    getTouchPosition(e) {
      let fieldPos = document.getElementById('field').getBoundingClientRect()
      let x = Math.round(e.touches[0].clientX - fieldPos.left)
      let y = Math.round(e.touches[0].clientY - fieldPos.top)
      return {x, y}
    },
    getIndex(team, id) {
      let i = 0
      for (; i < this.players.length; i++) {
        if (this.players[i].id == id && this.players[i].team == team) break
      }
      if (i == this.players.length) return null

      return i
    },
    mouseDown(e, team, player) {
      console.log(e.type)
      let pos = this.getCursorPosition(e)
      this.touchPlayer(team, player, pos)
      this.isClick = true
    },
    touchStart(e, team, player) {
      console.log(e.type)
      e.preventDefault()
      let pos = this.getTouchPosition(e)
      this.touchPlayer(team, player, pos)
      this.isClick = true
    },
    touchPlayer(team, player, pos) {
      console.log('touch player(' + team + ':' + player + ')', pos)
      let idx = this.getIndex(team, player)
      if (idx == null) {
        console.log(`player ${team}:${player} not found`)
        return
      }
      this.selectedPlayer = this.players[idx];

      // bring player to front
      this.players.splice(idx,1)
      this.players.push(this.selectedPlayer)

      this.startOffset = pos
      this.startOffset.x -= this.selectedPlayer.cx
      this.startOffset.y -= this.selectedPlayer.cy
    },
    mouseMove(e) {
      if (this.selectedPlayer) {
        console.log('mouseMove', e.type)
        this.movePlayer(this.getCursorPosition(e))
      }
      this.isClick = false
      this.fieldClick = false
    },
    touchMove(e) {
      if (this.selectedPlayer) {
        console.log('touchMove', e.type)
        this.movePlayer(this.getTouchPosition(e))
      }
      this.isClick = false
      this.fieldClick = false
    },
    movePlayer(pos) {
      if (!this.selectedPlayer) return
      console.log('movePlayer pos:', pos)
      console.log('movePlayer selectedPlayer:', this.selectedPlayer)
      this.selectedPlayer.cx = pos.x - this.startOffset.x
      this.selectedPlayer.cy = pos.y - this.startOffset.y
      if (this.selectedPlayer.cx < 0) this.selectedPlayer.cx = 0
      if (this.selectedPlayer.cy < 0) this.selectedPlayer.cy = 0
      if (this.selectedPlayer.cx > this.screenWidth) this.selectedPlayer.cx = this.screenWidth
      if (this.selectedPlayer.cy > this.screenHeight) this.selectedPlayer.cy = this.screenHeight
      
      if (this.isLandscape) {
        this.selectedPlayer.x = this.selectedPlayer.cx/this.screenWidth
        this.selectedPlayer.y = this.selectedPlayer.cy/this.screenWidth
      }
      else {
        this.selectedPlayer.x = (this.screenHeight - this.selectedPlayer.cy)/this.screenHeight
        this.selectedPlayer.y = this.selectedPlayer.cx/this.screenHeight
      }
    },
    click() {
      // click player
      if (this.isClick) {
        this.isClick = false
        this.inputPlayerName()
      }
      this.selectedPlayer = null;
      this.moveStart = null;

      // click filed
      if (this.fieldClick) {
        console.log('field click!!', this.fieldClick)
        console.log(Config)

      // click bench area
        let fieldBottom = this.isLandscape ? this.fieldClick.y : this.fieldClick.x
        if (fieldBottom > (Config.NORMALIZED.FIELD.h + Config.NORMALIZED.MARGIN.TOP)*this.fieldWidth) {
          this.noBench = this.noBench ? false : true
          this.screenResize()
        }
      }
      this.fieldClick = null
    },
    mouseUp() {
      if (this.selectedPlayer || this.fieldClick) {
        console.log('mouseUp')
        this.click()
      }
    },
    inputPlayerName() {
      console.log('click: ', this.selectedPlayer)
      let message = this.selectedPlayer.number + ','
      if (this.selectedPlayer.name) {
        message += this.selectedPlayer.name
      }
      let prompt = window.prompt("Change player's number and name", message)
      if (prompt) {
        let p = prompt.split(',')
        let number = parseInt(p[0])
        if (number) {
          this.selectedPlayer.number = number
          this.selectedPlayer.name = ''
          if (p.length > 1) {
            this.selectedPlayer.name = p[1].trim()
          }
          this.$emit('changePlayerInfo', this.players)
        }
      }
    },
    fieldMouseDown(e) {
      console.log('field mouse:', e.type)
      this.fieldClick = this.getCursorPosition(e)
    },
    fieldTouchStart(e) {
      console.log('field touch:', e.type)
      this.fieldClick = this.getTouchPosition(e)
    },
    screenResize() {
      let width = document.body.clientWidth*0.99
      let height = document.documentElement.clientHeight*0.98

      console.log('screenResize: ', width, height)
      if (width > height) {
        console.log('landscape')
        this.isLandscape = true
        if (width/height < Config.PNG.ASPECT[this.noBench]) {
          this.screenWidth = width
          this.screenHeight = width/Config.PNG.ASPECT[this.noBench]
        }
        else {
          this.screenWidth = height*Config.PNG.ASPECT[this.noBench]
          this.screenHeight = height
        }
      }
      else {
        console.log('portrate')
        this.isLandscape = false
        if (height/width < Config.PNG.ASPECT[this.noBench]) {
          this.screenWidth = height/Config.PNG.ASPECT[this.noBench]
          this.screenHeight = height
        }
        else {
          this.screenWidth = width
          this.screenHeight = width*Config.PNG.ASPECT[this.noBench]
        }
      }

      if (this.isLandscape) {
        for (let player of this.players) {
          if (this.noBench && player.y > Config.NORMALIZED.BENCH.TOP) {
            this.visibility[player.team][player.id] = 'hidden'
          }
          else {
            this.visibility[player.team][player.id] = 'visible'
          }
          player.cx = player.x*this.screenWidth
          player.cy = player.y*this.screenWidth
        }
        this.fieldRotate = `rotate(0, 0, 0) translate(0,0)`
        this.fieldWidth = this.screenWidth
        this.fieldHeight = this.fieldWidth/Config.PNG.ASPECT[false] // always with bench
      }
      else {
        for (let player of this.players) {
          if (this.noBench && player.y > Config.NORMALIZED.BENCH.TOP) {
            this.visibility[player.team][player.id] = 'hidden'
          }
          else {
            this.visibility[player.team][player.id] = 'visible'
          }
          player.cx = player.y*this.screenHeight
          player.cy = this.screenHeight - player.x*this.screenHeight
        }
        this.fieldRotate = `rotate(-90, 0, 0) translate(${-this.screenHeight},0)`
        this.fieldWidth = this.screenHeight
        this.fieldHeight = this.fieldWidth/Config.PNG.ASPECT[false] // always with bench
      }

      this.playerSize = Config.NORMALIZED.PLAYER_SIZE*this.fieldWidth
      this.fontSize = Config.NORMALIZED.FONT_SIZE*this.fieldWidth

      console.log('screen: ', this.screenWidth, this.screenHeight)
      console.log('field: ', this.fieldWidth, this.fieldHeight)
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
    }
  },
  created() {
    if (localStorage[Config.LAST_FIELD_DATA]) {
      let lastFieldData = JSON.parse(localStorage[Config.LAST_FIELD_DATA])
      console.log('created: ', lastFieldData)
      if (lastFieldData.version == Config.VERSION) {
        this.players = lastFieldData.players
        this.teamColor = lastFieldData.color
      }
      else {
        // todo old format
        console.log('check local storage version', lastFieldData.version)
      }
    }

    if (this.players.length == 0) {
      this.players = Players.newPlayers(null)
    }

    this.$emit('changePlayerInfo', this.players)

    // RGB to Hex
    let teamColor = ''
    let delimiter = ','
    for (let t = 0; t < this.teamColor.length; t++) {
      let rgba = this.teamColor[t].split('(')[1].split(')')[0].split(',')
      teamColor += '#'
      for (let c = 0; c < 3; c++) {
        teamColor += `0${parseInt(rgba[c]).toString(16)}`.slice(-2)
      }
      teamColor += delimiter
      delimiter = ''
    }
    this.$emit('changeTeamColors', teamColor)

    this.visibility.forEach((team) => {
      for (let i = 0; i < Config.NUMBER_OF_PLAYERS; i++) {
        team.push('visibile')
      }
    })
  },
  mounted() {
    document.addEventListener('mouseup', this.mouseUp)
    document.addEventListener('touchend', this.mouseUp)
    document.addEventListener('mousemove', this.mouseMove)
    document.addEventListener('touchmove', this.touchMove)
    window.addEventListener('resize', this.screenResize)
    this.screenResize()
  },
  watch: {
    players: {
      deep: true,
      handler() {
        localStorage[Config.LAST_FIELD_DATA] = JSON.stringify({
          version: Config.VERSION,
          players: this.players,
          color: this.teamColor,
        })
      }
    },
    members: function(newMember) {
      let teams = newMember.split('\n\n')
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
    },
    colors: function(newColors) {
      let c = newColors.split(',')
      if (c.length != 2) return
      let home = [ // Hex to RGB
        parseInt(c[0].substring(1, 3), 16),
        parseInt(c[0].substring(3, 5), 16),
        parseInt(c[0].substring(5, 7), 16)
      ]
      let away = [ // Hex to RGB
        parseInt(c[1].substring(1, 3), 16),
        parseInt(c[1].substring(3, 5), 16),
        parseInt(c[1].substring(5, 7), 16)
      ]
      this.teamColor = [
        `rgba(${home.join(',')}, 0.8)`,
        `rgba(${away.join(',')}, 0.8)`,
      ]
    },
    isChangeEnds: function() {
      this.changeEnds()
      this.screenResize()
    },
    save: function() {
      Capture.capture({
        teams: {
          players: this.players,
          color: this.teamColor,
        }, 
        w: Config.PREVIEW_IMAGE_WIDTH,
        onLoad: (url) => {
          let now = new Date()
          this.$emit("doneSave",
            {
              players: this.players,
              color: this.teamColor,
              icon: url,
              timestamp: now.toLocaleString()
            },
          )
        },
        isLandscape: true,
        noBench: false
      })
    },
    capture: function() {
      Capture.capture({
        teams: {
          players: this.players,
          color: this.teamColor,
        },
        w: Config.CAPTURE_IMAGE_WIDTH,
        onLoad: (url) => {
          this.$emit("doneCapture", url)
        },
        isLandscape: this.isLandscape,
        noBench: this.noBench
      })
    }
  }
}
</script>

<style scoped>
#view {
  height: 98vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
svg{
  color: #444;
  user-select: none;
  touch-action: none;
}
.shadow{
  fill: #000;
  fill-opacity: 0.2;
}
g{
  text-anchor: middle;
}
text.player{
  fill: #fff;
  dominant-baseline: central;
}
text.name {
  dominant-baseline: hanging;
}
</style>
