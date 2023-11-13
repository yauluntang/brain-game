import { STATUS_FLIPPED, STATUS_FLIPPING, STATUS_UNFLIPPED, STATUS_UNFLIPPING, STATUS_UNFLIPPING_WAIT } from '@/utils/utils';
import 'phaser';


export class MatchingTileObject extends Phaser.GameObjects.Container {
  status = STATUS_FLIPPING;
  picture?: Phaser.GameObjects.Image;
  backImage?: Phaser.GameObjects.Image;
  checkImage?: Phaser.GameObjects.Image;
  statusText?: Phaser.GameObjects.Text;
  imageId = 0;
  tileId = 0;
  nextStatus: number | null = null;
  nextStatusTime = 0;


  constructor(scene: Phaser.Scene, imageId: number, tileId: number, status: number, cardFlipCallback: (tileId: number) => void) {

    super(scene)
    this.scene = scene;
    this.imageId = imageId;
    this.tileId = tileId;
    this.status = status;

    this.picture = this.scene.add.image(0, 0, `fruit_${imageId}`);
    this.picture.setInteractive({ pixelPerfect: true })
    this.picture.setScale(1)
    this.add(this.picture);

    this.backImage = this.scene.add.image(0, 0, 'backImage');
    this.backImage.setInteractive({ pixelPerfect: true })
    this.backImage.setScale(0)
    this.add(this.backImage);

    this.checkImage = this.scene.add.image(0, 0, 'checkmark');
    this.checkImage.setVisible(false);
    this.add(this.checkImage);

    this.picture.on('pointerdown', () => {
      cardFlipCallback(this.tileId);
    });

    this.backImage.on('pointerdown', () => {
      cardFlipCallback(this.tileId);
    });


    this.statusText = this.scene.add.text(0, 0, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#000', fontSize: '120px' });
    this.add(this.statusText)
  }

  update(): void {

    //this.statusText?.setText(`${this.status}`);

    if (this.nextStatusTime < new Date().getTime() && this.nextStatus !== null) {
      const status = this.nextStatus;
      this.nextStatus = null;
      this.setStatus(status);
    }
  }


  setStatus(status: number): void {


    const previousStatus = this.status;
    if (previousStatus !== status) {
      this.status = status;

      if (status === STATUS_UNFLIPPING_WAIT) {
        this.nextStatusTime = new Date().getTime() + 1000;
        this.nextStatus = STATUS_UNFLIPPING;
      }

      if (status === STATUS_UNFLIPPING) {

        this.picture?.setScale(1, 1);

        this.scene.add.tween({
          targets: this.picture,
          props: {
            scaleX: {
              value: 0,
              duration: 150,
              delay: 0,
              ease: 'Linear'
            }
          }
        });

        this.backImage?.setScale(0, 1);
        this.scene.add.tween({
          targets: this.backImage,
          props: {
            scaleX: {
              value: 1,
              duration: 150,
              delay: 150,
              ease: 'Linear'
            }
          }
        });
        this.nextStatusTime = new Date().getTime() + 500;
        this.nextStatus = STATUS_UNFLIPPED;
      }

      if (status === STATUS_FLIPPED) {
        this.checkImage?.setVisible(true);
        this.checkImage?.setAlpha(0);

        this.scene.add.tween({
          targets: this.checkImage,
          props: {
            scale: {
              value: 1.2,
              duration: 400
            },
            alpha: {
              value: 1,
              duration: 400,
              delay: 500
            }
          }
        });

        this.scene.add.tween({
          targets: this.checkImage,
          props: {
            alpha: {
              value: 0,
              duration: 200,
              delay: 1100
            }
          }
        });
      }

      if (previousStatus === STATUS_UNFLIPPED && (status === STATUS_FLIPPING || status === STATUS_FLIPPED)) {

        this.picture?.setScale(0, 1);

        this.scene.add.tween({
          targets: this.picture,
          props: {
            scaleX: {
              value: 1,
              duration: 150,
              delay: 150,
              ease: 'Linear'
            }
          }
        });

        this.backImage?.setScale(1, 1);
        this.scene.add.tween({
          targets: this.backImage,
          props: {
            scaleX: {
              value: 0,
              duration: 150,
              delay: 0,
              ease: 'Linear'
            }
          }
        });
      }
      return;
    }
  }

}
