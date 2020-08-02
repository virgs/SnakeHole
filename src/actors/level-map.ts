import {scale} from '../scale';

export class LevelMap {
    private sprites: Phaser.GameObjects.Sprite[] = [];
    private mapDimension: Phaser.Geom.Point;

    constructor(options: { mapDimension: Phaser.Geom.Point, walls: Phaser.Geom.Point[], scene: Phaser.Scene }) {
        this.mapDimension = options.mapDimension;
        [...Array(+options.mapDimension.y).keys()]
            .forEach(y => {
                [...Array(+options.mapDimension.x).keys()]
                    .forEach(x => {
                        let textureKey = 'empty-background.bmp';
                        if (options.walls.find(wall => wall.x === x && wall.y === y)) {
                            textureKey = 'wall.bmp';
                        }
                        const sprite = options.scene.add.sprite(x * scale + (scale / 2), y * scale + (scale / 2), textureKey);
                        sprite.setScale(scale / sprite.width);
                        this.sprites.push(sprite);
                    });
            });
        // this.garden.on('pointerdown', (event) => this.holes.forEach(hole => hole.checkEmptyHit(event.position)));
    }

    public destroy() {
        this.sprites.forEach(sprite => sprite.destroy());
    }

}
