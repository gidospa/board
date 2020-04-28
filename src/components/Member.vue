<template>
<div id="member">
  <div class="member">
    <input class="team-color" type="color" v-model="homeColor" list="colorList" />
  </div>
  <div class="member">
    <textarea v-model="home" @blur="onBlur()" spellcheck="false"/>
  </div>
  <div class="member">
    <button class="default-button" type="button" onfocus="this.blur()" id="changing-ends" @click="onClickChange">Changing ends</button>
  </div>
  <div class="member">
    <textarea v-model="away" @blur="onBlur()" spellcheck="false"/>
  </div>
  <div class="member">
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
</template>

<script>
export default {
  props: {
    members: String,
    colors: String,
  },
  data() {
    return {
      home: '',
      away: '',
      homeColor: '#ff0000',
      awayColor: '#0000ff',
    }
  },
  methods: {
    onBlur() {
      let teams = [this.home, this.away]
      let newMember = ''
      for (let team of teams) {
        let member = team.split('\n')
        for (let player of member) {
          let info = player.split(',')
          let number = parseInt(info[0])
          if (!number) continue // ignore this player information

          let name = ''
          if (info[1]) {
            name = info[1].trim()
          }
          newMember += `${number},${name}\n`
        }
        newMember += `\n`
      }
      let m = newMember.split('\n\n')
      this.home = m[0]
      this.away = m[1]
      this.$emit("changeMemberList", newMember)
    },
    onClickChange() {
      this.$emit('changeEnds')
    }
  },
  watch: {
    members: function(newMember) {
      let m = newMember.split('\n\n')
      this.home = m[0]
      this.away = m[1]
    },
    colors: function() {
      let c = this.colors.split(',')
      this.homeColor = c[0]
      this.awayColor = c[1]
    },
    homeColor: function() {
      this.$emit('changeTeamColors', `${this.homeColor},${this.awayColor}`)
    },
    awayColor: function() {
      this.$emit('changeTeamColors', `${this.homeColor},${this.awayColor}`)
    },
  }
}
</script>

<style scoped>
#member {
  padding-bottom: 2vh;
}
textarea {
  font-family: "Yu Gothic", "YuGothic", Arial, sans-serif;
  resize: none;
  width: 160px;
  max-height: 1024px;
  height: calc( 1.3em * 18 );
  line-height: 1.3;
  padding: 0;
  vertical-align: bottom;
}
#changing-ends {
  font-size: 0.8rem;
}
.member {
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
</style>
