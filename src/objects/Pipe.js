export default class Pipe {
  constructor(scene, x, y, flipped) {
    this.scene = scene;

    const g = scene.add.graphics();
    g.fillStyle(0x20a020, 1);
    g.fillRect(0, 0, 52, 320);
    g.generateTexture("pipeTex", 52, 320);
    g.destroy();

    this.sprite = scene.physics.add.sprite(x, y, "pipeTex");
    this.sprite.body.allowGravity = false;
    this.sprite.body.immovable = true;
    this.sprite.body.setVelocityX(-200);

    if (flipped) this.sprite.setFlipY(true);
  }

  update() {
    if (this.sprite.x < -50) this.sprite.destroy();
  }
}
