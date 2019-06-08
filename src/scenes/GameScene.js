import NextTap from '../sprites/NextTap';

class GameScene extends Phaser.Scene {
  constructor(test) {
      super({
          key: 'GameScene'
      });
  }
  create(){

    this.score = 0;
    this.scoreText = this.add.text(60, 20, this.score).setScrollFactor(0, 0);

    this.tapArray = [1,2,3,4,5,6,7];
    this.tapAddArray = []
    this.nextPanelNumb = 0;

    // this.time = 0;

    this.timeText1 = this.add.text(60, 40,"0").setScrollFactor(0, 0);
    this.timeText2 = this.add.text(100, 40,"00").setScrollFactor(0, 0);

    this.time1 = 0;
    this.time2 = 0;

    this.gameMaxCount = 10;
    this.gameCount = 0;
    this.gameClear_flg = false;



    // this.panelGroup = this.add.sprite(20, 20, 'btn_stop').setScrollFactor(0, 0).setInteractive();

    this.nextTapGroup = this.add.group();

    this.nextTapGroup.x = 32;
    

    /*次のタッチを表示
    ================*/
    for(var i = 1; i <= 7 ; i++){
      // 0〜9までの乱数を吐き出す
      // var randNum = Math.floor(Math.random()*(10-1)+1);
      var nextTap = new NextTap({
        scene: this,
        x: this.nextTapGroup.x + (i * 32),
        y: 100,
        key:"next_tap_"+i,
        type: i,
        // texture: 'next_tap',
        // frames: 2
      });
      this.nextTapGroup.add(nextTap);
    }

    //一枚目はアニメーションで点滅
    this.nextTapGroup.children.entries[0].tween_flg = true;
    this.nextTapNumb = Number(this.nextTapGroup.children.entries[0].type);
    
    this.panelGroup = this.add.group();
    this.panelGroup.x = 32;
    this.panelGroup.y = 140;    

    /*パネルエリアを表示 5x5
    ================*/
    this.tapAddArray = this.tapArray.slice(0, this.tapArray.length);
    for(var i = 0; i < 9 ; i++){

      var panel_x = 0;
      var panel_y = 0;

      var panel_count = i % 3; 

      switch (panel_count) {
        case 0:
          panel_x = this.panelGroup.x;
          break;
        case 1:
            panel_x = this.panelGroup.x + 32;
          break;
        case 2:
            panel_x = this.panelGroup.x + 32*2;
          break;
        default:
          break; 
      }

      if(i < 3){
        panel_y = this.panelGroup.y;
      }
      if( 3 <= i && i < 6){
        panel_y = this.panelGroup.y + 32;
      }
      if( 6 <= i && i < 9){
        panel_y = this.panelGroup.y + 32*2;
      }
      
      
      // if(i < 4){
      //   panel_y = this.panelGroup.y;
      // }
      // if( 4 <= i && i < 8){
      //   panel_y = this.panelGroup.y + 32;
      // }
      // if( 8 <= i && i < 12){
      //   panel_y = this.panelGroup.y + 32*2;
      // }
      // if( 12 <= i && i < 16){
      //   panel_y = this.panelGroup.y + 32*3;
      // }
      // if( 16 <= i && i < 21){
      //   panel_y = this.panelGroup.y + 32*4;
      // }

      this.addPanel( panel_x, panel_y);
    }
    this.menu = this.add.container(160, 200).setScrollFactor(0, 0).setInteractive();
    this.menu.setVisible(false);
    this.menu.setDepth(1);

    this.title_start = this.add.sprite(10, 10, 'title_start').setScrollFactor(0, 0).setInteractive();

    this.menu.add(this.title_start);

    this.menu.on('pointerdown', function (pointer) {
      console.log("click title");
    });

    this.title_start.on('pointerdown', function (pointer) {
      console.log("click title");

      this.scene.resetGame();

    });

    // this.physics.world.pause();

    this.startCountDown = 3;
    this.startCount = this.add.text(100, 200,this.startCountDown).setScrollFactor(0, 0);
    // this.scene.pause();
    this.world_start = false;
    this.disp_time = 0;
    this.disp_time_after = 0;
    this.startTimer = this.time.addEvent({
      delay: 1000,
      callback: function() {
        this.startCountDown--;
        if(this.startCountDown === 0){
          this.startCount.setVisible(false);
          // this.physics.world.resume();
          this.world_start = true;
          this.disp_time_after = this.disp_time;
          this.startTimer.remove(false);
        }else{
          this.startCount.text = this.startCountDown;
        }
      },
      callbackScope: this,
      loop: true
    });    
  }
  // create(){
  //   this.scene.pause();
  // }

  update(time, delta) {
    // console.log(time);
    this.nextTapGroup.children.entries.forEach(
      (sprite) => {
          sprite.update(time, delta);
      }
    );
    
    if(this.world_start === true){
      this.timeText1.text = String(Math.floor((time - this.disp_time_after )*0.001));    
      this.timeText2.text = String(Math.floor(time - this.disp_time_after)).slice(-3).slice(0,2);  
    }else{
      this.disp_time = time;
    }
    if(this.gameClear_flg === true){
      this.timeText1.text = this.time1;    
      this.timeText2.text = this.time2;
    }else{
      this.time1 = String(Math.floor((time - this.disp_time_after )*0.001));
      this.time2 = String(Math.floor(time - this.disp_time_after)).slice(-3).slice(0,2);
    }

  }
  updateScore(score){
    this.scoreText.text = Number(this.scoreText.text) + Number(score);
  }
  addPanel(panel_x,panel_y){
    // var randNum = Math.floor(Math.random()*(10-1)+1);
    if(this.tapAddArray.length === 0){
      this.tapAddArray = this.tapArray.slice(0, this.tapArray.length);  
    }
    var random = Math.floor(Math.random() * this.tapAddArray.length);
    var randomNumb = this.tapAddArray[random];
    this.tapAddArray.splice(random, 1);
    this.nextPanelNumb = randomNumb;

    var nextTap = new NextTap({
      scene: this,
      x: panel_x,
      y: panel_y,
      key:"next_tap_"+randomNumb,
      type: randomNumb,
    });
    nextTap.setInteractive();
    nextTap.on('pointerdown', function (pointer) {

      if(Number(this.scene.nextTapNumb) === Number(this.type)){

        this.scene.nextTapNumb = Number(this.scene.nextTapGroup.children.entries[1].type);
      
        this.scene.addPanel( this.x, this.y);
        console.log("this.nextPanelNumb=="+this.scene.nextPanelNumb);
        this.scene.changeNextPanel(this.scene.nextPanelNumb);
        this.scene.gameCount++;
        if(this.scene.gameCount >= this.scene.gameMaxCount){
          this.scene.gameClear_flg = true;
          this.scene.gameClear();
        }
        this.destroy();

      }
        
    });
    this.panelGroup.add(nextTap);
  }
  changeNextPanel(_nextPanelNumb){
    // var _nextTapNumb = Number(this.nextTapNumb);
    

    this.nextTapGroup.children.entries[0].tween1.stop();
    this.nextTapGroup.children.entries[0].destroy();
    // this.nextTapGroup.children.entries[_nextTapNumb-1].alpha = 1;
    // this.nextTapGroup.children.entries[_nextTapNumb-1].tween_flg = false;

    // if(_nextTapNumb >= 7){
    //   this.nextTapNumb = 1;
    // }else{
    //   this.nextTapNumb = _nextTapNumb+1;
    // }

    /*
    addPanelで追加したパネルと同じものを追加する。
    =============*/
    
    // this.tapAddArray.splice(random, 1);

    this.nextTapGroup.children.entries.forEach(
      (sprite) => {
          sprite.x -= 32;
      }
    );

    console.log("nextPanelNumb=="+_nextPanelNumb);

    var nextTap = new NextTap({
      scene: this,
      x: this.nextTapGroup.x + (7 * 32),
      y: 100,
      key:"next_tap_"+_nextPanelNumb,
      type: _nextPanelNumb,
    });
    this.nextTapGroup.add(nextTap);

    this.nextTapGroup.children.entries[0].tween_flg = true;

  }
  gameClear(){
    this.gameOverText = this.add.text(90, 128, "GAME CLEAR", {
      fontFamily: 'monospace',
      fontSize: 24,
      fontStyle: 'bold',
      color: '#ffffff',
      style:{
      }
    });
    this.gameClear_flg = true;
    this.menu.setVisible(true);
  }
  resetGame(){
    console.log("resetGame");
    this.scene.start('GameScene');
  }
}

export default GameScene;
