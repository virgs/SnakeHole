/// <reference path="./phaser.d.ts"/>

import 'phaser';
import {scale} from './scale';
import {MainScene} from './scenes/main-scene';
import {ScoreScene} from './scenes/score-scene';
import {SplashScene} from './scenes/splash-scene';
import {UrlQueryHandler} from './url-query-handler';

const [dimensionWidth, dimensionHeight] = new UrlQueryHandler().getParameterByName('levelDimension', '25,25').split(',');
const config: GameConfig = {
    width: dimensionWidth * scale,
    height: dimensionHeight * scale,
    type: Phaser.AUTO,
    parent: 'game',
    scene: [SplashScene, ScoreScene, MainScene],
};

export class Game extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
}

window.addEventListener('load', () => new Game(config));
