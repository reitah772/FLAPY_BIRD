import Bird from "../objects/Bird.js";
import Pipe from "../objects/Pipe.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.score = 0;
    this.isGameOver = false;
    this.rörAntal = 0; // räknar hur många rör-par som passerat
  }

  create() {
    // Fågel
    this.bird = new Bird(this, 100, 320);
    this.add.existing(this.bird);
    this.physics.add.existing(this.bird);
    this.bird.body.setCollideWorldBounds(true);

    // Grupp för rören
    this.pipes = this.physics.add.group();

    // Poäng
    this.scoreText = this.add.text(16, 16, "Poäng: 0", { fontSize: "24px", fill: "#000" });

    // Timer för rör
    this.pipeTimer = this.time.addEvent({
      delay: 1500,
      callback: this.spawnPipes,
      callbackScope: this,
      loop: true
    });

    // Kollision
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);

    // Hoppa
    this.input.keyboard.on("keydown-SPACE", () => this.jump());
    this.input.on("pointerdown", () => this.jump());

    // Finish-linje (osynlig)
    this.finishX = 480 + 10 * 400; // typ 10 rör-par bort
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

    // Poäng-zon
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

      // Kontrollera om vi nått finish
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
    }
  }
}
