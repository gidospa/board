import * as Config from './config.js'

function newPlayers(formations) {
  let players = [];
  let cx = 0;
  let cy = 0;
  
  // place all players in bench (initialized position)
  let number_of_rows = 2;
  let number_of_cols = Config.NUMBER_OF_PLAYERS/number_of_rows;
  let eachWidth = Config.NORMALIZED.BENCH.w/Config.NUMBER_OF_TEAMS/number_of_cols;
  let eachHeight = (Config.NORMALIZED.BENCH.h + Config.NORMALIZED.MARGIN.BOTTOM)/number_of_rows;
  for (let team = 0; team < Config.NUMBER_OF_TEAMS; team++) {
    let startX = eachWidth/2 + Config.NORMALIZED.BENCH.w/2*team;
    let startY = Config.NORMALIZED.BENCH.TOP - Config.NORMALIZED.MARGIN.BOTTOM + eachHeight/2;
    let x = startX;
    let y = startY;
    for (let id = 0; id < Config.NUMBER_OF_PLAYERS; id++) {
      if (id == number_of_cols) {
        x = startX;
        y += eachHeight;
      }
      players.push({id, x, y, team, name: '', cx, cy, number: id+1})
      x += eachWidth;
    }
  }

  if (!formations) return players

  // set players in the position of formations
  let halfPitch = {
    left: Config.NORMALIZED.MARGIN.LEFT,
    top: Config.NORMALIZED.MARGIN.TOP,
    w: Config.NORMALIZED.FIELD.w/2 - Config.NORMALIZED.PLAYER_SIZE*2,
    h: Config.NORMALIZED.FIELD.h + Config.NORMALIZED.MARGIN.TOP + Config.NORMALIZED.MARGIN.BOTTOM,
  }

  for (let team = 0; team < Config.NUMBER_OF_TEAMS; team++) {
    let numRows = formations[team].length;
    if (numRows == 0) continue;

    let id = 0;
    for (let row = 0; row < numRows; row++) {
      let x = halfPitch.w/(numRows-1)*row + Config.NORMALIZED.MARGIN.LEFT;
      if (team == 1) {
        // Players of away team are set player from the right to the left.
        x = Config.NORMALIZED.WIDTH - x;
      }
      for (let col = 0; col < formations[team][row]; col++) {
        let c = (formations[team][row] -1) - col;
        if (team == 1) {
          // Players of away team are set player from the top to the bottom.
          c = col;
        }
        let y = halfPitch.h/(formations[team][row]+1)*(c+1);

        for (let p of players) {
          if (p.team != team || p.id != id) continue;
          p.x = x;
          p.y = y;
        }
        id++;
      }
    }
  }
  
  return players
}

export default { newPlayers }
