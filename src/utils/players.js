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

  if (formations) {
    console.log(formations);
  }
  
  return players
}

export default { newPlayers }
