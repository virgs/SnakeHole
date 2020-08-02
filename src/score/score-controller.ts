import {Events} from '../event-manager/events';
import {EventManager} from '../event-manager/event-manager';

export class ScoreController {
    private score: number = 0;

    public constructor() {
        EventManager.on(Events.SNAKE_ATE, () => ++this.score);
        EventManager.on(Events.SNAKE_DIED, () => EventManager.emit(Events.GAME_OVER, this.score));
    }

    public destroy() {

    }
}
