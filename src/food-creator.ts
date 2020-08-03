import {scale} from './scale';
import {SnakeHole} from './actors/snake-hole';
import {Events} from './event-manager/events';
import {EventManager} from './event-manager/event-manager';

export class FoodCreator {
    private scene: Phaser.Scene;
    private mapDimension: Phaser.Geom.Point;
    private walls: Phaser.Geom.Point[];
    private snakeBody: Phaser.Geom.Point[];
    private sprite: Phaser.GameObjects.Sprite;
    private snakeHoles: SnakeHole[];
    private foodPosition: Phaser.Geom.Point;

    public constructor(options: {
        scene: Phaser.Scene,
        mapDimension: Phaser.Geom.Point,
        walls: Phaser.Geom.Point[],
        snakeInitialPosition: Phaser.Geom.Point
    }) {
        this.scene = options.scene;
        this.mapDimension = options.mapDimension;
        this.walls = options.walls;
        this.snakeBody = [options.snakeInitialPosition];
        this.createFood();
        EventManager.on(Events.SNAKE_MOVED, body => {
            const snakeHeadPosition = body[0];
            this.snakeBody = body;
            if (this.foodPosition && snakeHeadPosition.x === this.foodPosition.x && snakeHeadPosition.y === this.foodPosition.y) {
                EventManager.emit(Events.SNAKE_ATE);
                this.createFood();
            }
        });
    }

    private createFood() {
        const x = Math.floor(Math.random() * this.mapDimension.x);
        const y = Math.floor(Math.random() * this.mapDimension.y);
        if (this.snakeBody.find(item => item.x === x && item.y === y)) {
            return this.createFood();
        }
        if (this.walls.find(item => item.x === x && item.y === y)) {
            return this.createFood();
        }
        this.foodPosition = new Phaser.Geom.Point(x, y);
        EventManager.emit(Events.FOOD_CREATED, this.foodPosition);
        if (this.sprite) {
            this.sprite.destroy();
        }
        this.sprite = this.scene.add.sprite(x * scale + (scale / 2), y * scale + (scale / 2), 'food.bmp');
        this.sprite.setScale(scale / this.sprite.width);
    }
}
