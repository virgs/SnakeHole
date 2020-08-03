import {Events} from './event-manager/events';
import {EventManager} from './event-manager/event-manager';

//TODO remove this class
export class CollisionManager {
    private scene: Phaser.Scene;
    private walls: Phaser.Geom.Point[];
    private foodPosition: Phaser.Geom.Point;
    private holes: Phaser.Geom.Point[][] = [];

    constructor(options: { walls: Phaser.Geom.Point[], scene: Phaser.Scene }) {
        this.walls = options.walls;
        this.scene = options.scene;

        this.registerToEvents();
    }

    private registerToEvents() {
        EventManager.on(Events.SNAKE_HOLE_CREATION, (points: Phaser.Geom.Point[]) => this.holes.push(points));
        EventManager.on(Events.FOOD_CREATED, (foodPosition) => this.foodPosition = foodPosition);
        EventManager.on(Events.SNAKE_MOVED, (snakeBody: Phaser.Geom.Point[]) => {
            const snakeHeadPosition = snakeBody[0];
            if (this.walls
                .find(collidable => collidable.y === snakeHeadPosition.y && collidable.x === snakeHeadPosition.x)) {
                EventManager.emit(Events.SNAKE_DIED);
            } else if (snakeBody
                .filter((_, index) => index > 0)
                .find(collidable => collidable.y === snakeHeadPosition.y && collidable.x === snakeHeadPosition.x)) {
                EventManager.emit(Events.SNAKE_DIED);
            } else if (this.foodPosition && snakeHeadPosition.x === this.foodPosition.x && snakeHeadPosition.y === this.foodPosition.y) {
                EventManager.emit(Events.SNAKE_ATE);
            }
            this.holes
                .find(holes => {
                    return holes.find((hole, index) => {
                        if (hole.x === snakeHeadPosition.x && hole.y === snakeHeadPosition.y) {
                            EventManager.emit(Events.SNAKE_ENTERED_HOLE, holes[1 - index]);
                        }
                    });
                });
        });

    }
}
