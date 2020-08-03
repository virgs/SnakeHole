import {scale} from '../scale';
import {Events} from '../event-manager/events';
import {EventManager} from '../event-manager/event-manager';
import Point = Phaser.Geom.Point;

export class SnakeHole {
    private static readonly colors: number[] = [0xb6b600, 0xb60000, 0x0000b6];
    private readonly sprites: Phaser.GameObjects.Sprite[] = [];

    public constructor(options: { scene: Phaser.Scene, points: number[], index: number }) {
        const color = SnakeHole.generateColor();
        const points = [new Point(options.points[0], options.points[1]), new Point(options.points[2], options.points[3])];
        points
            .forEach(point => {
                const sprite = options.scene.add.sprite(point.x * scale + (scale / 2), point.y * scale + (scale / 2),
                    'hole.bmp');
                sprite.setTintFill(color as any);
                sprite.setScale(scale / sprite.width);
                this.sprites.push(sprite);

            });
        EventManager.emit(Events.SNAKE_HOLE_CREATION, points);
        EventManager.on(Events.SNAKE_MOVED, (snakeBody: Phaser.Geom.Point[]) => {
            const snakeHeadPosition = snakeBody[0];
            points.find((hole, index) => {
                if (hole.x === snakeHeadPosition.x && hole.y === snakeHeadPosition.y) {
                    EventManager.emit(Events.SNAKE_ENTERED_HOLE, points[1 - index]);
                }
            });
        });
    }

    public destroy() {
        this.sprites
            .forEach(sprite => sprite.destroy());
    }

    private static generateHexaNumber(): string {
        const possibles = '0123456789abcdef';
        return possibles[Math.floor(Math.random() * possibles.length)];
    }

    private static generateColor(): string {
        const r = SnakeHole.generateHexaNumber() + SnakeHole.generateHexaNumber();
        const g = SnakeHole.generateHexaNumber() + SnakeHole.generateHexaNumber();
        const b = SnakeHole.generateHexaNumber() + SnakeHole.generateHexaNumber();
        return '0x' + r + g + b;
    }
}
