export default class Bird extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, null);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setGravityY(600);

    // Skapa enkel gul rektangel
    const g = scene.add.graphics();
    g.fillStyle(0xffcc00, 1);
    g.fillRect(0, 0, 34, 24);
    g.generateTexture("birdTex", 34, 24);
    g.destroy();
    this.setTexture("birdTex");
  }

  jump() {
    this.body.setVelocityY(-280);
  }
}
