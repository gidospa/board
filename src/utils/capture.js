import * as Config from './config.js'

const fieldImage = require('../assets/field.jpg');

function capture({teams, w, onLoad, isLandscape=true, noBench=false}={}) {
    // load background
    let image = new Image();
    image.onload = () => {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        //document.getElementById('app').appendChild(canvas);

        // draw field
        let width = null;
        let height = null;
        if (isLandscape) {
            canvas.width = w;
            canvas.height = w/Config.PNG.ASPECT[noBench];
            width = w;
            height = w/Config.PNG.ASPECT[noBench];
            context.drawImage(
                image,
                0, 0, Config.PNG.SIZE[noBench].w, Config.PNG.SIZE[noBench].h,
                0, 0, width, height
            );
        }
        else {
            canvas.width = w;
            canvas.height = Config.PNG.ASPECT[noBench]*w;
            width = Config.PNG.ASPECT[noBench]*w;
            height = w;
            context.save();
            context.rotate(-90*Math.PI/180);
            context.translate(-width,0);
            context.drawImage(
                image,
                0, 0, Config.PNG.SIZE[noBench].w, Config.PNG.SIZE[noBench].h,
                0, 0, width, height
            );
            context.restore();
        }

        let playerSize = Config.NORMALIZED.PLAYER_SIZE*width;
        let fontSize = Config.NORMALIZED.FONT_SIZE*width;

        // draw player
        for (let p of teams.players) {
            if (noBench && p.y > Config.NORMALIZED.BENCH.TOP) continue;

            let px = 0;
            let py = 0;
            if (isLandscape) {
                px = width * p.x;
                py = width * p.y;
            }
            else {
                px = width * p.y;
                py = width - width * p.x;
            }

            // shadow
            context.beginPath();
            context.fillStyle = 'rgba(10, 10, 10, 0.3)'; //TODO
            context.arc(px+3, py+3, playerSize, 0, Math.PI*2, false);
            context.fill();

            // player
            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = 'rgba(10, 10, 10, 0.5)'; //TODO
            context.fillStyle = teams.color[p.team]; //TODO
            context.arc(px, py, playerSize, 0, Math.PI*2, false);
            context.fill();
            context.stroke();
            context.closePath();

            // name of player
            context.textAlign = 'center';
            context.textBaseline ='middle';
            context.font = fontSize + 'px "Yu Gothic", "YuGothic", "Arial"';
            context.fillStyle = '#fff';
            context.fillText(p.number, px, py);
            if (p.name) {
                context.textAlign = 'center';
                context.textBaseline ='middle';
                context.font = parseInt(fontSize*0.7) + 'px "Yu Gothic", "YuGothic", "Arial"';
                context.fillStyle = 'rgba(255,255,255,1.0)';
                context.fillText(p.name, px, py + playerSize+fontSize/2);
            }
        }
        onLoad(canvas.toDataURL());
        console.log('capture load image....');
    }
    image.onerror = (e) => {
        console.log(e)
    }
    image.src = fieldImage
}

export default { capture }