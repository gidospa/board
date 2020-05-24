import * as Config from './config.js'


export function rgba2hex(rgb) {
    let hex = ''
    let delimiter = ','
    for (let t = 0; t < rgb.length; t++) {
        // rgb: ['rgba(255, 0, 0, 0.8)', 'rgba(0, 0, 255, 0.8)']
        let rgba = rgb[t].split('(')[1].split(')')[0].split(',')
        hex += '#'
        for (let c = 0; c < 3; c++) {
            hex += `0${parseInt(rgba[c]).toString(16)}`.slice(-2)
        }
        hex += delimiter
        delimiter = ''
    }

    return hex
}


export function hex2rgba(hex) {
    // hex: '#FF0000,#0000FF'
    let c = hex.split(',')
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

    return [
      `rgba(${home.join(',')}, ${Config.PLAYER_ALPHA})`,
      `rgba(${away.join(',')}, ${Config.PLAYER_ALPHA})`,
    ]    
}