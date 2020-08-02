import {scale} from '../scale';
import {Direction} from '../direction';
import {Events} from '../event-manager/events';
import {EventManager} from '../event-manager/event-manager';

export type SnakeBodyElement = {
    currentDirection: Direction,
    point: Phaser.Geom.Point,
    sprite: Phaser.GameObjects.Sprite
};

const initialLength: number = 5;

export class Snake {

    private readonly mapDimension: Phaser.Geom.Point;
    private readonly body: SnakeBodyElement[] = [];

    private milliSecondsPerTile: number = 125;
    private increaseLength: number = initialLength;
    private updateTimeCounter: number = 0;
    private currentDirection: Direction = Direction.Right;
    private nextDirection: Direction = Direction.Right;
    private scene: Phaser.Scene;

    public constructor(options: { initialPosition: Phaser.Geom.Point, mapDimension: Phaser.Geom.Point, scene: Phaser.Scene }) {
        this.mapDimension = options.mapDimension;
        this.scene = options.scene;
        this.registerEvents();
        this.addHead(options.initialPosition);
    }

    private registerEvents() {
        EventManager.on(Events.SNAKE_ENTERED_HOLE, (exitPoint: Phaser.Geom.Point) => {
            const head = this.body[0];
            if (head) {
                this.adjustSnakeNeck(head);
            }
            this.addHead(exitPoint);
        });
        EventManager.on(Events.SNAKE_ATE, () => ++this.increaseLength);
        EventManager.on(Events.MILLISECONDS_PER_TILE_CHANGED, (tilesPerSecond: number) => this.milliSecondsPerTile = tilesPerSecond);
        EventManager.on(Events.SNAKE_DIRECTION_CHANGED, (nextDirection: Direction) => {
            if ((this.currentDirection + nextDirection) % 2 !== 0) {
                this.nextDirection = nextDirection;
            }
        });
    }

    public update(delta: number): void {
        this.updateTimeCounter += delta;
        if (this.updateTimeCounter > this.milliSecondsPerTile) {
            while (this.updateTimeCounter > this.milliSecondsPerTile) {
                this.updateTimeCounter -= this.milliSecondsPerTile;
            }
            this.increaseBodyLength();
            this.decreaseBodyLength();
            EventManager.emit(Events.SNAKE_MOVED, this.body.map(item => item.point));
            this.currentDirection = this.nextDirection;
        }
    }

    private increaseBodyLength(): void {
        const head = this.body[0];
        if (head) {
            this.adjustSnakeNeck(head);
        }
        this.addHead(head.point);
    }

    private addHead(point: Phaser.Geom.Point): void {
        let nextPosition = null;
        const sprite = this.scene.add.sprite(point.x * scale + (scale / 2), point.y * scale + (scale / 2), 'snake-head.bmp');
        switch (this.nextDirection) {
            case Direction.Up:
                nextPosition = new Phaser.Geom.Point(point.x, point.y - 1);
                sprite.setAngle(0);
                break;
            case Direction.Right:
                nextPosition = new Phaser.Geom.Point(point.x + 1, point.y);
                sprite.setAngle(90);
                break;
            case Direction.Down:
                nextPosition = new Phaser.Geom.Point(point.x, point.y + 1);
                sprite.setAngle(180);
                break;
            default: // case Direction.Left:
                nextPosition = new Phaser.Geom.Point(point.x - 1, point.y);
                sprite.setAngle(-90);
                break;
        }
        sprite.setScale(scale / sprite.width);
        nextPosition.x = (nextPosition.x + +this.mapDimension.x) % +this.mapDimension.x;
        nextPosition.y = (nextPosition.y + +this.mapDimension.y) % +this.mapDimension.y;
        const head: SnakeBodyElement = {
            currentDirection: this.nextDirection,
            sprite: sprite,
            point: nextPosition,
        };
        this.body.unshift(head);
    }

    private adjustSnakeNeck(bodyElement: SnakeBodyElement) {
        bodyElement.sprite.destroy();
        if (bodyElement.currentDirection !== this.nextDirection) {
            bodyElement.sprite = this.scene.add.sprite(bodyElement.point.x * scale + (scale / 2), bodyElement.point.y * scale + (scale / 2),
                'snake-curved-body.bmp');
            if (bodyElement.currentDirection === Direction.Up && this.nextDirection === Direction.Left) {
                bodyElement.sprite.setAngle(90);
            } else if (bodyElement.currentDirection === Direction.Left && this.nextDirection === Direction.Up) {
                bodyElement.sprite.setAngle(270);
            } else if (bodyElement.currentDirection === Direction.Right && this.nextDirection === Direction.Up) {
                bodyElement.sprite.setAngle(180);
            } else if (bodyElement.currentDirection === Direction.Down && this.nextDirection === Direction.Left) {
                bodyElement.sprite.setAngle(180);
            } else if (bodyElement.currentDirection === Direction.Down && this.nextDirection === Direction.Right) {
                bodyElement.sprite.setAngle(270);
            } else if (bodyElement.currentDirection === Direction.Right && this.nextDirection === Direction.Down) {
                bodyElement.sprite.setAngle(90);
            }
        } else {
            bodyElement.sprite = this.scene.add.sprite(bodyElement.point.x * scale + (scale / 2), bodyElement.point.y * scale + (scale / 2),
                'snake-straight-body.bmp');
            switch (this.nextDirection) {
                case Direction.Down:
                case Direction.Up:
                    bodyElement.sprite.setAngle(90);
            }
        }
        bodyElement.sprite.setScale(scale / bodyElement.sprite.width);

    }

    private decreaseBodyLength() {
        if (this.increaseLength > 0) {
            --this.increaseLength;
        } else {
            const tail = this.body.pop();
            tail.sprite.destroy();
        }
    }

    public destroy() {
        this.body.forEach(element => element.sprite.destroy());
    }
}
