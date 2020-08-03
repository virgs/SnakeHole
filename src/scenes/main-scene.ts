import {Snake} from '../actors/snake';
import {Direction} from '../direction';
import {FoodCreator} from '../food-creator';
import {LevelMap} from '../actors/level-map';
import {Events} from '../event-manager/events';
import {SnakeHole} from '../actors/snake-hole';
import {SoundManager} from '../sound/sound-manager';
import {UrlQueryHandler} from '../url-query-handler';
import {ScoreController} from '../score/score-controller';
import {EventManager} from '../event-manager/event-manager';
import Point = Phaser.Geom.Point;
import KeyCodes = Phaser.Input.Keyboard.KeyCodes;

export class MainScene extends Phaser.Scene {
    private static readonly SWIPE_THRESHOLD = 30;

    private snake: Snake;
    private levelMap: LevelMap;
    private gameRunning: boolean;
    private foodCreator: FoodCreator;
    private soundManager: SoundManager;
    private keyboardInput: { keyCode: Phaser.Input.Keyboard.Key; direction: Direction }[];
    private holes: SnakeHole[];
    private scoreController: ScoreController;

    constructor() {
        super({
            key: 'MainScene'
        });
    }

    public async create(): Promise<void> {
        this.registerInputEvents();
        const [dimensionWidth, dimensionHeight] = new UrlQueryHandler()
            .getParameterByName('levelDimension', '25,25').split(',');
        const snakeInitialPosition = new Point(...new UrlQueryHandler()
            .getParameterByName('snakeInitialPosition', '1,1')
            .split(',')
            .map(point => +point));
        const mapDimension = new Point(dimensionWidth, dimensionHeight);
        const walls = new UrlQueryHandler().getParameterByName('blocks',
            '5,5;6,5;7,5;8,5;9,5;10,5;11,5;12,5;13,5;14,5;15,5;16,5;17,5;18,5;19,5;' +
            '5,5;5,6;5,7;5,8;5,9;5,10;5,11;5,12;5,13;5,14;5,15;5,16;5,20;' +
            '20,5;20,6;20,7;20,8;20,9;20,10;20,11;20,12;20,13;20,14;20,15;20,16;20,20;' +
            '5,16;6,16;7,16;8,16;9,16;10,16;11,16;12,16;13,16;14,16;15,16;16,16;17,16;18,16;19,16;20,16;' +
            '5,21;6,21;7,21;8,21;9,21;10,21;11,21;12,21;13,21;14,21;15,21;16,21;17,21;18,21;19,21;20,21;'
        )
            .split(';')
            .map(point => new Point(...point.split(',').map(coordinate => +coordinate)));
        this.scoreController = new ScoreController();
        this.gameRunning = true;
        this.levelMap = new LevelMap({mapDimension, walls, scene: this});
        this.foodCreator = new FoodCreator({scene: this, mapDimension, walls, snakeInitialPosition});
        this.holes = await new UrlQueryHandler().getParameterByName('holes',
            '13,2,12,11')
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
