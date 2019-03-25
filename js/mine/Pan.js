import Cube from './Cube'
import TetrisTime from './TetrisTime'
const Contant = require('./Contant.js').Contant

let width = canvas.width;
// let height = canvas.height;
const musicicon = 'images/music.png';
export default class Pan {
  constructor(tetris) {
    this.img = new Image();
    this.img.src = musicicon;
    this.tetris = tetris;
    this.bg = [];
    this.list = [];
    this.reNum=0;
    this.clearCubes();
    var row = tetris.rows;
    var clown = tetris.clowns;
    for (var i= 0; i < row;i++){
      for (var j= 0; j < clown;j++){
        this.bg[this.bg.length] = new Cube(tetris.panelPadding + tetris.cell * j, tetris.panelPadding + tetris.cell * i, '#aebaae', tetris);
      }
    }
    this.init();
  }

  init() {
    this.scoreI = 0;
    this.highestScoreI = 0;
    this.speedI = 1;
    this.checkPointI = 1;
    let timeWidth = this.tetris.timeWidth;
    let panelWidth = this.tetris.panelWidth;
    let panelPadding = this.tetris.panelPadding;
    let cell = this.tetris.cell;
        
    var ax = width - panelWidth * 2;
    var ay = panelPadding + cell;
    this.score = new TetrisTime(ax, ay + cell * 3 / 2, timeWidth, this.scoreI, width, cell);

    ay = panelPadding + cell * 3.5;
    this.highestScore = new TetrisTime(ax, ay + cell * 3 / 2, timeWidth, this.highestScoreI, width, cell);

    ay = panelPadding + cell * 11;
    this.speedI = parseInt(1000 / this.tetris.updataTimeDruing);
    this.speed = new TetrisTime(ax, ay + cell * 3 / 2, timeWidth, this.speedI, width, cell);

    ay = panelPadding + cell * 14;
    this.checkPoint = new TetrisTime(ax, ay, timeWidth, this.checkPointI, width, cell);

  }
      
  drawFenshu(canvas) {
    canvas.lineWidth=1;
    canvas.fillStyle = '#000000';
    canvas.strokeStyle = '#000000';
    canvas.font = "15px 楷体";
    
    var text = "得分";
    var ax = this.tetris.panelWidth + this.tetris.panelPadding + this.tetris.timeWidth * 8;
    var ay = this.tetris.panelPadding + this.tetris.cell;
    canvas.fillText(text, ax - this.tetris.timeWidth * 2, ay);

    this.score.drawSelf(canvas);

    text = "最高分";
    ay = this.tetris.panelPadding + this.tetris.cell * 3.5;
    canvas.fillText(text, ax - this.tetris.timeWidth * 2, ay);

    this.highestScore.drawSelf(canvas);

    text = "速度";
    ay = this.tetris.panelPadding + this.tetris.cell * 11;
    canvas.fillText(text, ax, ay);

    this.speed.drawSelf(canvas);

    text = "关卡";
    ay = this.tetris.panelPadding + this.tetris.cell * 14;
    canvas.fillText(text, ax, ay + this.tetris.cell);
    this.checkPoint.drawSelf(canvas);

    if (this.tetris.soundOnOff) {
      var size = 24;
      var left = this.tetris.panelWidth + (width - this.tetris.panelWidth - size) / 2;
      var top = this.tetris.panelPadding + this.tetris.cell * 17;
      canvas.drawImage(this.img, left, top,size,size)
    }
  }

  canDraw(x, y) {
    let cell = this.tetris.cell;
    let rows = this.tetris.rows;
    var bottom = parseInt(this.tetris.panelPadding + cell * rows - cell);
    if (y >= bottom) {
      return false;
    }
    for (var i=0;i<this.cubes.length;i++){
      var cube = this.cubes[i];
      if (cube && cube.x == x && cube.y == y + cell) {
        return false;
      }
    }
    return true;
  }
      
  addCubes(list){
    if (list != null) {
      let panelPadding = this.tetris.panelPadding;
      let cell = this.tetris.cell;
      let rows = this.tetris.rows;
      let clowns = this.tetris.clowns;
      for (var i = 0; i < list.length; i++){
        var cube = list[i];
        var row = parseInt((cube.y - panelPadding) / cell);
        var clown = parseInt((cube.x - panelPadding) / cell);
        if (row < 0 || row > rows || clown < 0 || clown > clowns) {
          return;
        }
        this.re[row][clown] = 1;
        this.cubes[this.cubes.length] = cube;
      }
      this.tetris.sendEmptyMessageDelayed(400, this.tetris.updataTimeDruing);
    }
  }

  drawSelf(canvas) {
    for (var i = 0; i < this.bg.length; i++){
      var cube = this.bg[i];
      cube.drawSelf(canvas);
    }
    for (var j = 0; j < this.cubes.length; j++){
      var cube = this.cubes[j];
      if (cube) {
        cube.drawSelf(canvas);
      }
    }
    this.drawFenshu(canvas);
  }

  check() {
    this.checkXiaochu();
    if (this.list.length > 0) {
      this.tetris.removeMessages(100);
    }
    if (this.list && this.list.length > 0) {
      var remove = true;
      for (var i = 0; i < this.list.length;i++){
        var integer = this.list[i];
        var isremove = this.removeCubeByRow(integer);
        if (!isremove) {
          remove = false;
        }
      }
      if (remove==true) {
        this.tetris.palyGameSound(Contant.TETRIS_MATCH);
        this.tetris.updateUI();
      }
    }
  }
      
  removeCubeByRow(integer) {
    var resu = false;
    var remove = [];
    var panelPadding = this.tetris.panelPadding;
    var cell = this.tetris.cell;
    for (var j = 0; j < this.cubes.length; j++){
      var cube = this.cubes[j];
      if (cube) {
        if (cube.y == panelPadding + cell * integer) {
          var clown = parseInt((cube.x - panelPadding) / cell);
          this.re[integer][clown] = 0;
          remove[remove.length] = cube;
          delete this.cubes[j];
        } else if (cube.y < panelPadding + cell * integer) {
          cube.y = cube.y + cell;
        }
      }
    }
    if (remove.length > 0) {
      resu = true;
      this.scoreI += parseInt(remove.length * 10 + (remove.length / 10 - 1) * 50);
      this.score.updateNumber(this.scoreI);
      if (this.scoreI > this.highestScoreI) {
        this.highestScoreI = this.scoreI;
        this.highestScore.updateNumber(this.highestScoreI);
      }
      this.reNum = this.reNum + remove.length / 10;
      for (var i= integer - 1; i >= 0;i--){
        for (var j= 0; j < this.tetris.clowns;j++){
          this.re[i + 1][j] = this.re[i][j];
        }
      }
      if (this.reNum >= 30) {
        this.reNum = 0;
        this.speedI = parseInt(1000 / updataTimeDruing);
        this.checkPointI++;
        this.tetris.updataTimeDruing = this.tetris.updataTimeDruing - 15;
        if (this.tetris.updataTimeDruing < 150) {
          this.tetris.updataTimeDruing = 150;
        }
        this.speed.updateNumber(speedI);
        this.checkPoint.updateNumber(checkPointI);
      }
    }
    return resu;
  }

  checkXiaochu(){
    this.list=[];
    for (var i= 0; i < this.tetris.rows;i++){
      var man = true;
      for (var j = 0; j < this.tetris.clowns;j++){
        if (this.re[i][j] == 0) {
          man = false;
        }
      }
      if (man) {
        this.list[this.list.length] = i;
      }
    }
  }

  toString() {
    return re.toString();
  }
  canUpdate(x, y) {
    let panelPadding = this.tetris.panelPadding;
    let cell = this.tetris.cell;
    var row = parseInt((y - panelPadding) / cell);
    var clown = parseInt((x - panelPadding) / cell);
    if (row >= 0 && row < this.tetris.rows && clown >= 0 && clown < this.tetris.clowns) {
      return this.re[row][clown] == 0;
    }
    return false;
  }
  clearCubes() {
    this.cubes = [];
    this.re = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  }

}