import Bird from "../objects/Bird.js";
import Pipe from "../objects/Pipe.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.score = 0;
    this.isGameOver = false;
    this.rörAntal = 0; 
  }

  create() {
    
    this.bird = new Bird(this, 100, 320);
    this.add.existing(this.bird);
    this.physics.add.existing(this.bird);
    this.bird.body.setCollideWorldBounds(true);

    
    this.pipes = this.physics.add.group();

    
    this.scoreText = this.add.text(16, 16, "Poäng: 0", { fontSize: "24px", fill: "#000" });

    
    this.pipeTimer = this.time.addEvent({
      delay: 1500,
      callback: this.spawnPipes,
      callbackScope: this,
      loop: true
    });

    
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);

    
    this.input.keyboard.on("keydown-SPACE", () => this.jump());
    this.input.on("pointerdown", () => this.jump());

    
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    
    this.finishX = 480 + 10 * 400; 
  }

  jump() {
    if (!this.isGameOver) this.bird.jump();
    else this.scene.restart();
  }

  spawnPipes() {
    if (this.isGameOver) return;

    const gap = 140;
    const holeY = Phaser.Math.Between(120, 480);

    const topPipe = new Pipe(this, 480, holeY - gap / 2 - 320, true);
    const bottomPipe = new Pipe(this, 480, holeY + gap / 2 + 320, false);

    this.pipes.add(topPipe.sprite);
    this.pipes.add(bottomPipe.sprite);

   
    const zone = this.add.rectangle(480, holeY, 10, gap);
    this.physics.add.existing(zone);
    zone.body.allowGravity = false;
    zone.body.setVelocityX(-200);
    zone.body.setImmovable(true);

    this.physics.add.overlap(this.bird, zone, () => {
      zone.destroy();
      this.score++;
      this.rörAntal++;
      this.scoreText.setText("Poäng: " + this.score);

      
      if (this.rörAntal >= 10) {
        this.winGame();
      }
    });
  }

  winGame() {
    this.isGameOver = true;
    this.physics.pause();
    this.add.text(80, 250, `GRATTIS!\nDu nådde målet!\nPoäng: ${this.score}`, {
      fontSize: "24px",
      fill: "#00aa00",
      align: "center"
    });
  }

  gameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.physics.pause();
    this.scoreText.setText("Game Over! Poäng: " + this.score);
  }

  update() {
    if (!this.isGameOver) {
      
      this.pipes.getChildren().forEach(p => {
        if (p.x < -50) p.destroy();
      });

      
      if (this.rightKey.isDown) {
        this.pipes.getChildren().forEach(pipe => {
          pipe.x -= 5; 
        });
        this.finishX -= 5;
      }
    }
  }
}
