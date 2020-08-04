import {scale} from './scale';
import {Direction} from './direction';
import {Events} from './event-manager/events';
import {EventManager} from './event-manager/event-manager';
import KeyCodes = Phaser.Input.Keyboard.KeyCodes;
import Point = Phaser.Geom.Point;

export class InputManager {
    private readonly scene: Phaser.Scene;

    private readonly mapDimension: Phaser.Geom.Point;
    private readonly sprites: Phaser.GameObjects.Sprite[] = [];
    private keyboardInput: { keyCode: Phaser.Input.Keyboard.Key; direction: Direction }[];


    constructor(options: { scene: Phaser.Scene, mapDimension: Phaser.Geom.Point }) {
        this.scene = options.scene;
        this.mapDimension = options.mapDimension;
        this.registerInputEvents();
        this.sprites.push(this.createSprite(new Point(options.mapDimension.x / 4, options.mapDimension.y / 4),
            () => EventManager.emit(Events.SNAKE_DIRECTION_CHANGED, [Direction.Left, Direction.Up])));
        this.sprites.push(this.createSprite(new Point(3 * options.mapDimension.x / 4, options.mapDimension.y / 4),
            () => EventManager.emit(Events.SNAKE_DIRECTION_CHANGED, [Direction.Right, Direction.Up])));
        this.sprites.push(this.createSprite(new Point(options.mapDimension.x / 4, 3 * options.mapDimension.y / 4),
            () => EventManager.emit(Events.SNAKE_DIRECTION_CHANGED, [Direction.Left, Direction.Down])));
        this.sprites.push(this.createSprite(new Point(3 * options.mapDimension.x / 4, 3 * options.mapDimension.y / 4),
            () => EventManager.emit(Events.SNAKE_DIRECTION_CHANGED, [Direction.Right, Direction.Down])));
    }

    public update() {
        this.keyboardInput
            .filter(key => key.keyCode.isDown)
            .forEach(key => EventManager.emit(Events.SNAKE_DIRECTION_CHANGED, [key.direction]));
    }

    private registerInputEvents() {
        this.keyboardInput = [
            {direction: Direction.Up, keyCode: this.scene.input.keyboard.addKey(KeyCodes.UP)},
            {direction: Direction.Left, keyCode: this.scene.input.keyboard.addKey(KeyCodes.LEFT)},
            {direction: Direction.Down, keyCode: this.scene.input.keyboard.addKey(KeyCodes.DOWN)},
            {direction: Direction.Right, keyCode: this.scene.input.keyboard.addKey(KeyCodes.RIGHT)}
        ];
    }

    public destroy() {
        this.sprites
            .forEach(sprite => sprite.destroy());
    }

    private createSprite(point: Phaser.Geom.Point, callback: Function): Phaser.GameObjects.Sprite {
        const sprite = this.scene.add.sprite(point.x * scale - (scale / 2),
            point.y * scale - (scale / 2),
            'hole.bmp');
        sprite.setInteractive();
        sprite.on('pointerdown', callback);
        sprite.setTintFill(0xFFFFFF);
        sprite.setAlpha(0.01);
        sprite.setScale((scale / sprite.width) * this.mapDimension.x / 2, (scale / sprite.height) * this.mapDimension.y / 2);
        return sprite;
    }
}
