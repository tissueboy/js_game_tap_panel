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
    for(var i = 0; i < 26 ; i++){

      var panel_x = 0;
      var panel_y = 0;

      var panel_count = i % 5; 

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
        case 3:
            panel_x = this.panelGroup.x + 32*3;
          break;
        case 4:
            panel_x = this.panelGroup.x + 32*4;
          break; 
        default:
          break; 
      }
      
      
      if(i < 6){
        panel_y = this.panelGroup.y;
      }
      if( 6 <= i && i < 11){
        panel_y = this.panelGroup.y + 32;
      }
      if( 11 <= i && i < 16){
        panel_y = this.panelGroup.y + 32*2;
      }
      if( 16 <= i && i < 21){
        panel_y = this.panelGroup.y + 32*3;
      }
      if( 21 <= i && i < 26){
        panel_y = this.panelGroup.y + 32*4;
      }

      this.addPanel( panel_x, panel_y);
    }

  }

  update(time, delta) {
    
    this.nextTapGroup.children.entries.forEach(
      (sprite) => {
          sprite.update(time, delta);
      }
    );
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

    var nextTap = new NextTap({
      scene: this,
      x: panel_x,
      y: panel_y,
      key:"next_tap_"+randomNumb,
      type: randomNumb,
    });
    nextTap.setInteractive();
    nextTap.on('pointerdown', function (pointer) {

      var _nextTapNumb = Number(this.scene.nextTapNumb);

      if(_nextTapNumb === Number(this.type)){
      
        this.scene.addPanel( this.x, this.y);
        this.scene.nextTapGroup.children.entries[_nextTapNumb-1].tween1.stop();
        this.scene.nextTapGroup.children.entries[_nextTapNumb-1].alpha = 1;
        this.scene.nextTapGroup.children.entries[_nextTapNumb-1].tween_flg = false;

        if(_nextTapNumb >= 7){
          this.scene.nextTapNumb = 1;
        }else{
          this.scene.nextTapNumb = _nextTapNumb+1;
        }
        this.scene.nextTapGroup.children.entries[Number(this.scene.nextTapNumb)-1].tween_flg = true;

        this.destroy();

      }
        
    });
    this.panelGroup.add(nextTap);
  }
}

export default GameScene;
