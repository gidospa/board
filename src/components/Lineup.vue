<template>
<div id="lineup" v-bind:class="hidden ? 'hidden' : ''">
  <div @dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop.stop.prevent="onDropPlayerDB">
    <div id="player-db-information">
      <div :class="{'player-db-information__dragover': isDragOver}">
        <span class="player-db-information__text" @click="$emit('show-team-id')">Player DB</span>
      </div>
    </div>
    <div class="lineup">
      <input class="team-color" type="color" v-model="homeColor" list="colorList" />
    </div>
    <div class="lineup">
      <textarea v-model="home" @blur="onBlur()" spellcheck="false"/>
    </div>
    <div class="lineup">
      <button class="default-button" type="button" onfocus="this.blur()" id="changing-ends" @click="onClickChange">Changing ends</button>
    </div>
    <div class="lineup">
      <textarea v-model="away" @blur="onBlur()" spellcheck="false"/>
    </div>
    <div class="lineup">
      <input class="team-color" type="color" v-model="awayColor" list="colorList" />
    </div>
    <datalist id="colorList">
      <option>#000000</option>
      <option>#ffffff</option>
      <option>#ff0000</option>
      <option>#dd3300</option>
      <option>#ff8000</option>
      
      <option>#00cc00</option>
      <option>#ffcc00</option>
      <option>#ff0066</option>
      <option>#cc0044</option>
      <option>#880011</option>

      <option>#006600</option>
      <option>#113355</option>
      <option>#8000ff</option>
      <option>#0000ff</option>
      <option>#0080ff</option>
    </datalist>
  </div>
</div>
</template>

<script>
export default {
  props: {
    lineup: String,
    colors: String,
    playerdb: Object,
    hidden: Boolean,
  },
  data() {
    return {
      home: '',
      away: '',
      homeColor: '#ff0000',
      awayColor: '#0000ff',
      isDragOver: false
    }
  },
  methods: {
    onBlur() {
      if (!this.home.match(/\S/g) || !this.away.match(/\S/g)) {
        let m = this.lineup.split('\n\n')
        this.home = m[0]
        this.away = m[1]
        return
      }
      let teams = [this.home, this.away]
      let newLineup = ''
      let teamName = []
      for (let team of teams) {
        let lines = team.split('\n')
        teamName.push(lines[0])
        for (let player of lines) {
          let info = player.split(',')
          let number = parseInt(info[0])
          if (!number) continue // ignore this player information

          let name = ''
          if (info[1]) {
            name = info[1].trim()
          }
          newLineup += `${number},${name}\n`
        }
        if (newLineup == '') {
          newLineup += '\n'
        }
        newLineup += '\n'
      }
      let m = this.lineup.split('\n\n')
      this.home = m[0]
      this.away = m[1]
      this.$emit("change-lineup", newLineup, teamName)
    },
    onClickChange() {
      this.$emit('change-ends')
    },
    onDragOver() {
      if (!this.playerdb) {
        this.isDragOver = true
        let pdb = document.getElementById('player-db-information')
        pdb.style.visibility = 'visible'
      }
    },
    onDragLeave() {
      this.isDragOver = false
      if (!this.playerdb) {
        let pdb = document.getElementById('player-db-information')
        pdb.style.visibility = 'hidden'
      }
    },
    onDropPlayerDB(event) {
      console.log('drop file:', event.dataTransfer.files)
      this.onDragLeave()
      if (this.playerdb) {
        console.log('player db already exists')
        return
      }

      const file = event.dataTransfer.files[0]
      let fileReader = new FileReader()
      fileReader.onload = () => {
        try {
          let playerDB = JSON.parse(fileReader.result)
          console.log(`version: ${playerDB.version}, teams: ${playerDB.teams}`)          
          if (playerDB.version && playerDB.teams) {
            const teams = Object.keys(playerDB.teams)
            let i = 0;
            for (i = 0; i < teams.length;i ++) {
              const team = teams[i]
              const teamInfo = playerDB.teams[team]
              if (!teamInfo.nationality || !teamInfo.category || !teamInfo.players) {
                console.log('playerDB format error:', team)
                console.log('  nationality:', teamInfo.nationality)
                console.log('  category:', teamInfo.category)
                console.log('  players:', teamInfo.players)
                break
              }
            }
            if (i == teams.length) {
              console.log('playerDB updated')
              this.$emit('load-player-db', playerDB)
            }
          }
          else {
            console.log('cannot read playerDB file')          
          }
        }
        catch (e) {
          console.log(e)
        }
      }
      fileReader.readAsText( file )
    }
  },
  created() {
    let m = this.lineup.split('\n\n')
    this.home = m[0]
    this.away = m[1]

    let c = this.colors.split(',')
    this.homeColor = c[0]
    this.awayColor = c[1]   
  },
  watch: {
    lineup: function(newLineup) {
      let m = newLineup.split('\n\n')
      this.home = m[0]
      this.away = m[1]
    },
    colors: function() {
      let c = this.colors.split(',')
      this.homeColor = c[0]
      this.awayColor = c[1]
    },
    homeColor: function() {
      this.$emit('change-team-colors', `${this.homeColor},${this.awayColor}`)
    },
    awayColor: function() {
      this.$emit('change-team-colors', `${this.homeColor},${this.awayColor}`)
    },
    playerdb: function() {
      let pdb = document.getElementById('player-db-information')
      if (this.playerdb) {
        console.log('playerDB visible')
        pdb.style.visibility = 'visible'
      }
      else {
        console.log('playerDB hidden')
        pdb.style.visibility = 'hidden'
      }
    }
  }
}
</script>

<style scoped>
#lineup {
  padding-bottom: 2vh;
  max-height: 100vh;
  visibility: visible;
  opacity: 1;
  transition: opacity 0.4s, visibility 0.4s, max-height 0.3s;
}
#lineup.hidden {
  max-height: 0;
  visibility: hidden;
  opacity: 0;
  padding: 0;
  transition: opacity 0.1s, visibility 0.1s, max-height 0.2s;
}
textarea {
  font-family: "Yu Gothic", "YuGothic", Arial, sans-serif;
  resize: none;
  width: 160px;
  max-height: 1024px;
  height: calc( 1.4em * 18 );
  line-height: 1.4;
  vertical-align: bottom;
  font-size: 1rem;
  border: 1px solid #888;
}
#changing-ends {
  font-size: 0.9rem;
}
.lineup {
  display: inline-block;
  vertical-align: bottom;
  margin: 0 1rem;
}
.team-color {
  border-radius: 0.25rem;
  border: 1px solid #888;
  background-color: white;
  width: 5em;
}
#player-db-information {
  display: block;
  color: #ddd;
  cursor: default;
  visibility: hidden;
}
.player-db-information__dragover {
  color: #ddd;
}
.player-db-information__text:hover,
.player-db-information__text:focus {
  color: #ccc;
}
</style>
