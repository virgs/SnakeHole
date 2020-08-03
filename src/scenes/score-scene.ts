export class ScoreScene extends Phaser.Scene {
    private static readonly MIN_WAITING_TIME_MS = 1000;
    private lastScore: number | string;

    constructor() {
        super({
            key: 'ScoreScene'
        });
    }

    public create(value: { score: number }) {
        this.lastScore = value ? value.score || '-' : '-';
        this.addBackground();
        this.addScoreBoard();
    }

    private addScoreBoard() {
        const scoreTitle = this.add.bitmapText(this.game.renderer.width * 0.05, this.game.renderer.height * 0.35,
            'scoreFont', `SCORE:`, 40, 0);
        scoreTitle.setTintFill(0xb6b600);
        const titleScaleRatio = window.innerWidth * 0.35 / scoreTitle.getTextBounds().global.width;
        scoreTitle.setScale(titleScaleRatio, titleScaleRatio);

        const scoreText = this.add.bitmapText(this.game.renderer.width * 0.95, this.game.renderer.height * 0.35,
            'scoreFont', `${this.lastScore}`, 40, 2);
        scoreText.setOrigin(1, 0);
        scoreText.setTintFill(0xb6b600);
        scoreText.setScale(titleScaleRatio, titleScaleRatio);
    }

    private addBackground() {
        const background = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height / 2, 'background-castle')
            .setInteractive();
        background.setAlpha(0.2);
        background.setBlendMode(Phaser.BlendModes.ADD);
        background.setTint(0xFFFFFF);

        this.time.addEvent({
            delay: ScoreScene.MIN_WAITING_TIME_MS,
            callback: () => background.on('pointerdown', () => this.scene.start('MainScene'))
        });
        const backgroundScaleRatio = Math.max(window.innerWidth / background.getBounds().width,
            window.innerHeight / background.getBounds().height);
        background.setScale(backgroundScaleRatio, backgroundScaleRatio);
    }
}
