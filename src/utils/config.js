export const VERSION = '0.9.4';

export const PREVIEW_IMAGE_WIDTH = 256;
export const CAPTURE_IMAGE_WIDTH = 1920;

// capture file name
export const CAPTURE_FILE_PREFIX = 'board_';

// localStorage
export const LAST_FIELD_DATA = 'lastField';
export const BOARD_LIST = 'boardList';
export const OLD_BOARD_LIST = 'fields';
export const PLAYER_DB = 'playerDB';

// import board
//export const EXPORT_FILE_NAME_PREFIX = 'board_';
export const EXPORT_FILE_NAME_PREFIX = 'board';
export const PLAYER_DB_FILE_PREFIX = 'playerdb';

// field size [m]
export const REAL_FIELD_SIZE = {
  TOUCH_LINE: 105,
  GOAL_LINE: 68,
  PENALTY_BOX: {h: 40.4, w: 16.5},
  GOAL_AREA: {h: 18.4, w: 5.5},
  CENTER_CIRCLE_R: 9.15,
  GOAL: {w: 7.32, d: 1.6},
  LINE_WIDTH: 0.12,
}

// player
export const NUMBER_OF_PLAYERS = 18;
export const NUMBER_OF_TEAMS = 2;

// default formations
export const FORMATIONS = [
  'none',
  '3-4-3',
  '4-3-3',
  '4-4-2',
  '5-4-1',
]

// default team colors
export const TEAM_COLORS = '#FF0000,#0000FF'
export const PLAYER_ALPHA = 0.8

// field.png size [px]
export const PNG = {
  WIDTH: 1280,
  HEIGHT: 960,
  FONT_SIZE: 28,
  PLAYER_SIZE: 30
}

PNG.FIELD = {
  w: PNG.WIDTH/22*20
}
PNG.FIELD.h = (REAL_FIELD_SIZE.GOAL_LINE/REAL_FIELD_SIZE.TOUCH_LINE)*PNG.FIELD.w
PNG.MARGIN = {
  TOP: 25,
  BOTTOM: 25,
  LEFT: PNG.WIDTH/22,
  RIGHT: PNG.WIDTH/22
}
PNG.BENCH = {
  LEFT: 0,
  TOP: PNG.MARGIN.TOP + PNG.FIELD.h + PNG.MARGIN.BOTTOM,
  w: PNG.WIDTH,
  h: PNG.HEIGHT - PNG.FIELD.h - PNG.MARGIN.TOP - PNG.MARGIN.BOTTOM
}
PNG.CENTERMARK = {
  LEFT: PNG.WIDTH/2,
  TOP: PNG.MARGIN.TOP + PNG.FIELD.h/2
}
PNG.SIZE = {
  false: { // with bench
    w: PNG.WIDTH,
    h: PNG.HEIGHT
  },
  true: { // no bench
    w: PNG.WIDTH,
    h: PNG.HEIGHT - PNG.BENCH.h
  }
}
PNG.ASPECT = {
  // with bench
  false: PNG.SIZE[false].w/PNG.SIZE[false].h,
  // no bench
  true: PNG.SIZE[true].w/PNG.SIZE[true].h
}
  
// normalized field
export const NORMALIZED = {
  WIDTH: 1.0,
  HEIGHT: PNG.HEIGHT/PNG.WIDTH,
  FIELD: {
    w: PNG.FIELD.w/PNG.WIDTH,
    h: PNG.FIELD.h/PNG.WIDTH
  },
  FONT_SIZE: PNG.FONT_SIZE/PNG.WIDTH,
  PLAYER_SIZE: PNG.PLAYER_SIZE/PNG.WIDTH,
  MARGIN: {
    TOP: PNG.MARGIN.TOP/PNG.WIDTH,
    BOTTOM: PNG.MARGIN.BOTTOM/PNG.WIDTH,
    LEFT: PNG.MARGIN.LEFT/PNG.WIDTH,
    RIGHT: PNG.MARGIN.RIGHT/PNG.WIDTH
  }
}
NORMALIZED.CENTERMARK = {
  LEFT: NORMALIZED.WIDTH/2,
  TOP: NORMALIZED.MARGIN.TOP + NORMALIZED.FIELD.h/2,
}
NORMALIZED.BENCH = {
  LEFT: PNG.BENCH.LEFT/PNG.WIDTH,
  TOP: PNG.BENCH.TOP/PNG.WIDTH,
  w: PNG.BENCH.w/PNG.WIDTH,
  h: PNG.BENCH.h/PNG.WIDTH,
}
