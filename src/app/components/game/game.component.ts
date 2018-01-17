import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Block } from '../../models/block';
   
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewChecked {

  @ViewChild("canvas") canvas;

  fallingBlock: any;

  constructor() { 
  }

  // setup canvas stuff
  //ngOnInit() {
  //  this.initGame();
  //}

  ngAfterViewChecked() {
    this.initGame();
    this.spawnBlock();
    console.log(this);
    this.draw();
  }

  /*
    2d array of board layout for keeping track
    of all "landed" blocks.
    Landed blocks are blocks that have hit
    the floor or hit other blocks collected at bottom.

    landed array is all 0's to start, since no
    blocks have hit the floor.  Every coordinate
    with a landed block will have that
    block's letter.
  */

  landed = [
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0']
  ];

  ctx: CanvasRenderingContext2D;
  canWidth: number;

  /*
    "Pixel" is unit of height/width, 1/10 width of board.
    Each block is made of 4 pixels.
  */

  pixel: number;

  // frame counter (needed for block entrance timing)
  frame: number = 0;

  speed: number = 125;
  fontStyle: string = '30px Georgia';

  initGame() {
    console.log('init');
    let canvas = this.canvas.nativeElement;
    this.ctx = canvas.getContext("2d");
    this.canWidth = this.canvas.width; 
  } 

  drawBlock(coords, numPix, emoji) {
    let ctx = this.ctx;
    let pixel = this.pixel;
    for (let i=0; i<numPix; i++) {
      this.ctx.font = this.fontStyle;
      this.ctx.fillText(emoji, (coords[i][0]) * pixel, (coords[i][1]) * pixel);
    }
  }

  checkFullRows() {
    // check for any full rows
    for (let i=0; i<20; i++) {
      // goes down far left pixel from top of board to bottom
      // if far left pixel is a landed block, then it checks
      // that whole row to see if its a full row ready to clear
      if (this.landed[i][0] !== '0') {
        let fullRow = true;
        for (let j=1; j<10; j++) {
          if (this.landed[i][j] === '0') {
            fullRow = false;
          }
        }
        if (fullRow) {
          // clear the found full row
          for (let j=0; j<10; j++) {
            this.landed[i][j] = '0';
          }

          /*

            not positive, but i think theres an
            intermittant bug here leaving certain
            pixels floating and not dropping when
            they should be dropped down one

          */
          for (let k=i-1; k>=0; k--) {
            for (let l=0; l<10; l++) {
              if (this.landed[k][l] !== '0') {
                this.landed[k+1][l] = this.landed[k][l];
                this.landed[k][l] = '0';
              }
            }
          }
        }
      }
    }
  }

  // move the falling block down
  moveDown() {

    if (this.fallingBlock) {

      // check if block is touching bottom now
      let touchingFloor = false;
      for (let i=0; i<this.fallingBlock.coords.length && touchingFloor===false; i++) {
        if (this.fallingBlock['coords'][i][1] === 19) {
          touchingFloor = true;
        }
      }

      // check if touching another block
      // (this approach to collision detection from https://gamedevelopment.tutsplus.com/tutorials/implementing-tetris-collision-detection--gamedev-852 )
      let collision = false;
      if (!touchingFloor) {
        for (let coords of this.fallingBlock.coords) {
          const [ x, y ] = coords;
          if (this.landed[ y + 1 ][ x ] !== '0') {
            collision = true;
          }
        }
      }

      // if at floor or , add blocks pixels to landed array
      if (touchingFloor || collision) {
        for (let coords of this.fallingBlock.coords) {
          const [ x, y ] = coords;
          if (y === 0) {
            return 'boardFull';
          } 
          this.landed[y][x] = this.fallingBlock.letter;
        }
        this.fallingBlock = null;
        return 'cantMoveDown';
      } else {
        // lower the block
        for (let i=0; i<this.fallingBlock.coords.length; i++) {
          this.fallingBlock['coords'][i][1]++;
        }
      }
    }
    return 'movedDown';
  }


  moveSide(direction) {

    if (direction === 'left') {
      // if not at left edge, move left
      let firstPixel = this.fallingBlock['coords'][0];
      if (firstPixel[0] > 0) {

        // check if touching another block
        // (this approach to collision detection from https://gamedevelopment.tutsplus.com/tutorials/implementing-tetris-collision-detection--gamedev-852 )
        let collision = false;
        for (let coords of this.fallingBlock.coords) {
          const [ x, y ] = coords;
          if ( (x > 0) && ( y >= 0) ) {
            //console.log(x+','+y+'   '+this.landed[y]);
            if (this.landed[ y ][ x - 1 ] !== '0') {
              collision = true;
            }
          }
        }

        if (!collision) {
          for (let i=0; i<this.fallingBlock.coords.length; i++) {
            this.fallingBlock['coords'][i][0]--;
          }

        }

      }
    }

    if (direction === 'right') {

      // TODO: run this check on every pixel in block, not just last
      // if not at right edge, move right
      let length = this.fallingBlock.coords.length;
      let lastPixel = this.fallingBlock['coords'][length-1];
      if (lastPixel[0] < 9) {

        // check if touching another block
        // (this approach to collision detection from https://gamedevelopment.tutsplus.com/tutorials/implementing-tetris-collision-detection--gamedev-852 )
        let collision = false;
        for (let coords of this.fallingBlock.coords) {
          const [ x, y ] = coords;
          if ( (x < 9) && (y>=0) ) {
            if (this.landed[ y ][ x + 1 ] !== '0') {
              collision = true;
            }
          }
        }

        if (!collision) {
          for (let i=0; i<this.fallingBlock.coords.length; i++) {
            this.fallingBlock['coords'][i][0]++;
          }
        }

      }
    }

  }

  // rotate block
  rotate() {
    // todo: add collision detection
    this.fallingBlock.rotate();
  }

  // clear the whole board each frame to redraw all pieces in new pos
  clearBoard() {
    this.ctx.clearRect(0, 0, 10 * this.pixel, 20 * this.pixel);
  }

  getEmoji(block) {
    // let color;
    let emoji;
    switch (block) {
      case 'I':
        // color = colorI;
        emoji = "🚀";
        break;
      case 'T':
        // color = colorT;
        emoji = "🚔";
        break;
      case 'O':
        // color = colorO;
        emoji = "🍆";
        break;
      case 'S':
        // color = colorS;
        emoji = "🐮";
        break;
      case 'Z':
        // color = colorZ;
        emoji = "🐶";
        break;
      case 'J':
        // color = colorJ;
        emoji = "💩";
        break;
      case 'L':
        // color = colorL;
        emoji = "😀";
        break;
    }
    // return color;
    return emoji;
  }

  // draw all pieces that have hit the bottom
  // (this set grows as new pieces hit the bottom)
  drawLanded() {
    for (let i=0; i<this.landed.length; i++) {
      for (let j=0; j<this.landed[i].length; j++) {
        if (this.landed[i][j] !== '0') {
          //let color = this.getColor(this.landed[i][j]);
          let emoji = this.getEmoji(this.landed[i][j]);
        //  drawPixel(j,i,color);
        //ctx.fillStyle = '#1abc9c';
        this.ctx.font=this.fontStyle;
        this.ctx.fillText(emoji, j * this.pixel, i * this.pixel);
        }
      }
    }
  }

  drawFallingBlock() {
    if (this.fallingBlock) {
      //let color = getColor(fallingBlock.letter);
      this.drawBlock(
        this.fallingBlock.coords,
        this.fallingBlock.numPix,
        this.fallingBlock.emoji
      );
    }
  }

  moveDownOrNewBlock() {
    //console.log(speed);
    if (this.frame % (this.speed / 5) === 0) {
      if (!this.fallingBlock) {
        this.spawnBlock();
      }
    }
    if (this.frame % this.speed === 0) {
      if (this.moveDown() === 'boardFull') {
        return 'boardFull';
      }
    }
    return 'spawned';
  }

  checkSpeedUp() {
    console.log('checkSpeedUp');
    //console.log(frame, speed);
    if (this.frame % 1000 === 0) {
      if (this.speed > 49) {
        //console.log('a');
        this.speed -= 25;
      }
      if (this.speed > 10 && this.speed < 50) {
        //console.log('b');
        this.speed -= 5;
      }
    }
  }

  // spawns new block at top
  // (todo: x-pos will be random & will account for block width
  //        so not over either edge)
  // this falling var couldn't be seen by the other functions
  // (scoping issues), so scrapping for now...
  spawnBlock() {

    console.log('spawn');

    let blockType;
    let x;
    const numBlock = Math.floor(Math.random() * 7);

    switch (numBlock) {

      case 0:
        blockType = 'i';
        x = Math.floor(Math.random() * (10 - 3));
        break;

      case 1:
        blockType = 'o';
        x = Math.floor(Math.random() * (10 - 2));
        break;

      case 2:
        blockType = 't';
        x = Math.floor(Math.random() * (10 - 2));
        break;

      case 3:
        blockType = 's';
        x = Math.floor(Math.random() * (10 - 2));
        break;

      case 4:
        blockType = 'z';
        x = Math.floor(Math.random() * (10 - 2));
        break;

      case 5:
        blockType = 'j';
        x = Math.floor(Math.random() * (10 - 2));
        break;

      case 6:
        blockType = 'l';
        x = Math.floor(Math.random() * (10 - 2));
        break;

    }

    const y = 0;
    this.fallingBlock = new Block(blockType, x, y);
  }

  // process all keystrokes
  processKeystroke(key) {

    if (!this.fallingBlock) {
      return;
    }

    // move block keyboard input
    switch (key) {

      case 38:  // up arrow
        this.rotate();
        break;
      case 40:  // down arrow
        this.moveDown();
        break;
      case 39:  // right arrow
        this.moveSide('right');
        break;
      case 37:  // left arrow
        this.moveSide('left');
        break;
    }
  }

  // main draw loop (calls itself recursively at end)
  draw() {
    this.checkSpeedUp();
    if (this.moveDownOrNewBlock() === 'boardFull') {
      //console.log('boardFull: ' + boardFull);
      this.speed = 125;
      for (let i=0; i<10; i++) {
        for (let j=0; j<20; j++) {
          this.landed[j][i] = '0';
        }
      }
    }
    this.checkFullRows();
    this.clearBoard();
    //makeGrid();
    //drawText();
    this.drawLanded();
    this.drawFallingBlock();
    this.frame++;
    requestAnimationFrame(() => {
      this.draw();
    });
  }

  // event listeners
  // for testing - "next" button below board
  // (make sure moveDown() in draw() is uncommented)
  // document.getElementById("next").addEventListener("click", drawOnEvent);

  // event listener for all keystrokes
  onkeydown(event: any) {
    this.processKeystroke(event.keyCode);
  }


}
