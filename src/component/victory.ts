import 'phaser';


export class VictoryObject extends Phaser.GameObjects.Container {

  constructor(scene: Phaser.Scene) {

    super(scene)

  }

  create(): void {
    const youwin = this.scene.add.image(600, 600, 'youwin')
    this.add(youwin);
    youwin.setAlpha(0);
    youwin.setScale(0.3);
    this.scene.add.tween({
      targets: youwin,
      props: {
        alpha: {
          value: 1,
          duration: 500,
          delay: 0,
          ease: 'Linear'
        },
        scale: {
          value: 0.4,
          duration: 500,
          delay: 0,
          ease: 'Linear'
        }
      }
    });
  }
}
