import {Snake} from '../actors/snake';
import {Direction} from '../direction';
import {FoodCreator} from '../food-creator';
import {LevelMap} from '../actors/level-map';
import {Events} from '../event-manager/events';
import {SnakeHole} from '../actors/snake-hole';
import {SoundManager} from '../sound/sound-manager';
import {UrlQueryHandler} from '../url-query-handler';
import {CollisionManager} from '../collision-manager';
import {ScoreController} from '../score/score-controller';
import {EventManager} from '../event-manager/event-manager';
import Point = Phaser.Geom.Point;
import KeyCodes = Phaser.Input.Keyboard.KeyCodes;

export class MainScene extends Phaser.Scene {
    private static readonly SWIPE_THRESHOLD = 50;

    private snake: Snake;
    private levelMap: LevelMap;
    private gameRunning: boolean;
    private foodCreator: FoodCreator;
    private soundManager: SoundManager;
    private collisionManager: CollisionManager;
    private keyboardInput: { keyCode: Phaser.Input.Keyboard.Key; direction: Direction }[];
    private holes: SnakeHole[];
    private scoreController: ScoreController;

    constructor() {
        super({
            key: 'MainScene'
        });
    }

    public create(): void {
        this.registerInputEvents();
        const [dimensionWidth, dimensionHeight] = new UrlQueryHandler()
            .getParameterByName('levelDimension', '50,50').split(',');
        const snakeInitialPosition = new Point(...new UrlQueryHandler()
            .getParameterByName('snakeInitialPosition', '0,0')
            .split(',')
            .map(point => +point));
        const mapDimension = new Point(dimensionWidth, dimensionHeight);
        const walls = new UrlQueryHandler().getParameterByName('blocks',
            '5,5;6,6;7,7;8,8;12,34;9,1;4,5;4,6;4,7;4,8;4,9;20,12;34,43;12,34;19,2;29,0;0,5;0,6;0,7')
            .split(';')
            .map(point => new Point(...point.split(',').map(coordinate => +coordinate)));
        this.scoreController = new ScoreController();
        this.gameRunning = true;
        this.collisionManager = new CollisionManager({walls, scene: this});
        this.levelMap = new LevelMap({mapDimension, walls, scene: this});
        this.foodCreator = new FoodCreator({scene: this, mapDimension, walls, snakeInitialPosition});
        this.holes = new UrlQueryHandler().getParameterByName('holes',
            '12,13,20,16;0,0,18,18')
            .split(';')
            .map((point, index) => new SnakeHole({
                index,
                scene: this,
                points: point.split(',').map(coordinate => +coordinate)
            }));
        this.snake = new Snake({initialPosition: snakeInitialPosition, mapDimension: mapDimension, scene: this});
        this.soundManager = new SoundManager(this);

        EventManager.emit(Events.GAME_BEGAN);
        EventManager.on(Events.GAME_OVER, score => {
            this.gameRunning = false;
            setTimeout(() => {
                this.destroy();
                this.scene.start('ScoreScene', {score});
            }, 2000);
        });

        // this.input.addPointer(3);
        // http://labs.phaser.io/edit.html?src=src\input\multitouch\two%20touch%20inputs.js
    }

    private registerInputEvents() {
        this.keyboardInput = [
            {direction: Direction.Up, keyCode: this.input.keyboard.addKey(KeyCodes.UP)},
            {direction: Direction.Left, keyCode: this.input.keyboard.addKey(KeyCodes.LEFT)},
            {direction: Direction.Down, keyCode: this.input.keyboard.addKey(KeyCodes.DOWN)},
            {direction: Direction.Right, keyCode: this.input.keyboard.addKey(KeyCodes.RIGHT)}
        ];

        this.input.on('pointerup', (pointer: any) => {
            const xDifference = pointer.upX - pointer.downX;
            const yDifference = pointer.upY - pointer.downY;
            if (xDifference < -MainScene.SWIPE_THRESHOLD) {
                EventManager.emit(Events.SNAKE_DIRECTION_CHANGED, Direction.Left);
            } else if (xDifference > MainScene.SWIPE_THRESHOLD) {
                EventManager.emit(Events.SNAKE_DIRECTION_CHANGED, Direction.Right);
            } else if (yDifference < -MainScene.SWIPE_THRESHOLD) {
                EventManager.emit(Events.SNAKE_DIRECTION_CHANGED, Direction.Up);
            } else if (yDifference > MainScene.SWIPE_THRESHOLD) {
                EventManager.emit(Events.SNAKE_DIRECTION_CHANGED, Direction.Down);
            }
        });
    }

    public update(time: number, delta: number): void {
        if (this.gameRunning) {
            this.snake.update(delta);
            this.soundManager.update();
            this.checkInputEvents();
        }
    }

    private destroy() {
        EventManager.destroy();
        this.snake.destroy();
        this.levelMap.destroy();
        this.holes.forEach(hole => hole.destroy());
    }

    private checkInputEvents() {
        this.keyboardInput
            .filter(key => key.keyCode.isDown)
            .forEach(key => EventManager.emit(Events.SNAKE_DIRECTION_CHANGED, key.direction));
    }
}
