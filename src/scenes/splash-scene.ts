export class SplashScene extends Phaser.Scene {

    private static readonly MIN_TIME: 250;
    private loadCompleted: boolean;

    constructor() {
        super({
            key: 'SplashScene'
        });
        this.loadCompleted = false;
    }

    public preload(): void {
        this.load.image('splash', './assets/images/gui.png');
    }

    public create(): void {
        const logo = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height / 2, 'splash');
        let scaleRatio = Math.min(window.innerWidth / logo.getBounds().width, window.innerHeight / logo.getBounds().height);
        logo.setScale(scaleRatio, scaleRatio);

        this.loadImages();
        this.loadFonts();
        this.loadSounds();
        this.load.start();
        this.load.on('complete', () => this.loadCompleted = true);

        this.time.addEvent({
            delay: SplashScene.MIN_TIME, callback: () => {
                if (this.loadCompleted) {
                    this.scene.start('ScoreScene');
                } else {
                    this.load.on('complete', () => this.scene.start('ScoreScene'));
                }
            }
        });

    }

    private loadImages() {
        const imagesToLoad = [
            'empty-background.bmp',
            'food.bmp',
            'gui.png',
            'hole.bmp',
            'snake-curved-body.bmp',
            'snake-head.bmp',
            'snake-straight-body.bmp',
            'wall.bmp'
        ];

        imagesToLoad.forEach(image => this.load.image(image, `./assets/images/${image}`));
    }

    private loadSounds() {
        this.load.audio('backgroundMusic', `./assets/sounds/backgroundMusic.mp3`);
        this.load.audio('charPop', `./assets/sounds/charPop.mp3`);
        this.load.audio('die0', `./assets/sounds/die0.wav`);
        this.load.audio('die1', `./assets/sounds/die1.wav`);
        this.load.audio('die2', `./assets/sounds/die2.wav`);
        this.load.audio('die3', `./assets/sounds/die3.mp3`);
        this.load.audio('die4', `./assets/sounds/die4.mp3`);
        this.load.audio('gameOver', `./assets/sounds/gameOver.wav`);
        this.load.audio('rabbitHit', `./assets/sounds/rabbitHit.wav`);
        this.load.audio('specialBarHit', `./assets/sounds/specialBarHit.wav`);
        this.load.audio('starHit', `./assets/sounds/starHit.wav`);
        this.load.audio('starRaise', `./assets/sounds/starRaise.mp3`);
        this.load.audio('wrongHit', `./assets/sounds/wrongHit.wav`);

    }

    private loadFonts() {
        this.load.bitmapFont('scoreFont',
            `./assets/fonts/PressStart2P-Regular.png`,
            `./assets/fonts/PressStart2P-Regular.fnt`);
    }
}
