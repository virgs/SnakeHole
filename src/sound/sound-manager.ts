export class SoundManager {
    private soundsToPlayNextIteration: {};
    private scene: Phaser.Scene;

    public constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.soundsToPlayNextIteration = {};
        //
        // this.addSoundToEvent(Events.MOLE_CREATED, ['charPop']);
        // this.addSoundToEvent(Events.MOLE_HIT, [...Array(5)].map((_, index) => `die${index}`));
        //
        // this.addSoundToEvent(Events.RABBIT_CREATED, ['charPop']);
        // this.addSoundToEvent(Events.RABBIT_HIT, ['rabbitHit']);
        //
        // this.addSoundToEvent(Events.STAR_CREATED, ['starRaise']);
        // this.addSoundToEvent(Events.STAR_HIT, ['starHit']);
        //
        // this.addSoundToEvent(Events.HOLE_EMPTY_HIT, ['wrongHit']);
        // this.addSoundToEvent(Events.SPECIAL_BAR_HIT, ['specialBarHit']);

        // this.addGameStateSounds();
    }

    public update() {
        (Object.keys(this.soundsToPlayNextIteration) || []).forEach(key => this.soundsToPlayNextIteration[key].play());
        this.soundsToPlayNextIteration = {};
    }
    //
    // private addSoundToEvent(event: Events, sounds: string[]) {
    //     EventManager.on(event, () => {
    //         const randomizedIndex = Math.floor((Math.random() * sounds.length));
    //         const name = sounds[randomizedIndex];
    //         this.soundsToPlayNextIteration[name] = this.scene.sound.add(name);
    //     });
    // }

    // private addGameStateSounds() {
    //     const backgroundMusic = this.scene.sound.add('backgroundMusic', {loop: true});
    //     EventManager.on(Events.GAME_BEGIN, () => backgroundMusic.play());
    //     const gameOver = this.scene.sound.add('gameOver');
    //     EventManager.on(Events.GAME_OVER, () => {
    //         backgroundMusic.stop();
    //         gameOver.play();
    //     });
    // }
}
