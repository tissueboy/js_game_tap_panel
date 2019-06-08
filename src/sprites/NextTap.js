export default class NextTap extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key,config.type);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    // console.log(config.scene);
    this.alive = true;
    this.type = config.type;
    // this.on('pointerdown', function (pointer) {

    //   console.log("this.type="+this.type);


    // });
    this.tween1;
    this.tween_flg = false;
  }
  update(){
    if(this.tween_flg === true){
      this.addTween();
    }
  }
  addTween(){
    this.tween1 = this.scene.tweens.add({
      targets: this,
      alpha: 0.1,
      duration: 600,
      loop: -1,
    }); 
    this.tween_flg = false; 
  }
}