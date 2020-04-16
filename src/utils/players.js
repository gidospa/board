function newPlayers(formations, config) {
  let players = [];
  let cx = 0;
  let cy = 0;

  // place all players in bench (initialized position)
  let number_of_rows = 2;
  let number_of_cols = config.NUMBER_OF_PLAYERS/number_of_rows;
  let eachWidth = config.normalized.bench.w/config.NUMBER_OF_TEAMS/number_of_cols;
  let eachHeight = (config.normalized.bench.h + config.normalized.margin.bottom)/number_of_rows;
  for (let team = 0; team < config.NUMBER_OF_TEAMS; team++) {
    let startX = eachWidth/2 + config.normalized.bench.w/2*team;
    let startY = config.normalized.bench.top - config.normalized.margin.bottom + eachHeight/2;
    let x = startX;
    let y = startY;
    for (let id = 0; id < config.NUMBER_OF_PLAYERS; id++) {
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
