import {scale} from '../scale';
import {EventManager} from '../event-manager/event-manager';
import {Events} from '../event-manager/events';

export class LevelMap {
    private sprites: Phaser.GameObjects.Sprite[] = [];
    private mapDimension: Phaser.Geom.Point;
    private walls: Phaser.Geom.Point[] = [];

    constructor(options: { mapDimension: Phaser.Geom.Point, walls: Phaser.Geom.Point[], scene: Phaser.Scene }) {
        this.mapDimension = options.mapDimension;
        [...Array(+options.mapDimension.y).keys()]
            .forEach(y => {
                [...Array(+options.mapDimension.x).keys()]
                    .forEach(x => {
                        let textureKey = 'empty-background.bmp';
                        if (options.walls.find(wall => wall.x === x && wall.y === y)) {
                            textureKey = 'wall.bmp';
                            this.walls.push(new Phaser.Geom.Point(x, y));
                        }
                        const sprite = options.scene.add.sprite(x * scale + (scale / 2), y * scale + (scale / 2), textureKey);
                        sprite.setScale(scale / sprite.width);
                        this.sprites.push(sprite);
                    });
            });
        EventManager.on(Events.SNAKE_MOVED, (snakeBody: Phaser.Geom.Point[]) => {
            const snakeHeadPosition = snakeBody[0];
            if (this.walls
                .find(collidable => collidable.y === snakeHeadPosition.y && collidable.x === snakeHeadPosition.x)) {
                EventManager.emit(Events.SNAKE_COLLIDED_WITH_WALL);
            }
        });
    }

    public destroy() {
        this.sprites.forEach(sprite => sprite.destroy());
    }

}
