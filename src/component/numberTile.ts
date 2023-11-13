import { STATUS_CORRECT, STATUS_INCORRECT, STATUS_UNFLIPPED } from '@/utils/utils';
import 'phaser';


export class NumberTileObject extends Phaser.GameObjects.Container {
  status = STATUS_UNFLIPPED;
  picture?: Phaser.GameObjects.Image;
  backImage?: Phaser.GameObjects.Image;
  checkImage?: Phaser.GameObjects.Image;
  crossImage?: Phaser.GameObjects.Image;
  statusText?: Phaser.GameObjects.Text;
  imageId = 0;
  tileId = 0;
  nextStatus: number | null = null;
  nextStatusTime = 0;
  clickCallback?: (tileId: number) => void;

  constructor(scene: Phaser.Scene, tileId: number, status: number, clickCallback: (tileId: number) => void) {

    super(scene)
    this.scene = scene;
    this.tileId = tileId;
    this.status = status;



    const r6 = this.scene.add.image(0, 0, 'tile');
    r6.setScale(0.4)
    r6.setInteractive({ pixelPerfect: true })
    this.add(r6);

    r6.on('pointerdown', () => {
      this.clicking();
    });

    this.statusText = this.scene.add.text(0, -10, `${this.tileId}`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#000', fontSize: '200px' });
    this.statusText.setScale(0.5)
    this.statusText.setOrigin(0.5);
    this.add(this.statusText)
    this.clickCallback = clickCallback;

    this.checkImage = this.scene.add.image(0, 0, 'checkmark');
    this.checkImage.setAlpha(0)
    this.checkImage.setScale(0.3)
    this.add(this.checkImage);

    this.crossImage = this.scene.add.image(0, 0, 'cross');
    this.crossImage.setAlpha(0)
    this.crossImage.setScale(0.3)
    this.add(this.crossImage);
  }

  clicking = (): void => {
    if (this.clickCallback) {
      this.clickCallback(this.tileId)
    }
  }

  update(): void {

    if (this.nextStatusTime < new Date().getTime() && this.nextStatus !== null) {
      const status = this.nextStatus;
      this.nextStatus = null;
      this.setStatus(status);
    }
  }


  setId(tileId: number): void {
    this.tileId = tileId
    this.statusText?.setText(`${this.tileId}`);
  }

  setStatus(status: number): void {


    const previousStatus = this.status;
    if (previousStatus !== status) {
      this.status = status;

      if (status === STATUS_CORRECT) {
        this.scene.add.tween({
          targets: this,
          props: {
            alpha: {
              value: 0,
              duration: 400
            },
            visible: {
              value: false,
              duration: 0,
              delay: 400
            }
          }
        });

        this.scene.add.tween({
          targets: this.checkImage,
          props: {
            scale: {
              value: 0.5,
              duration: 400
            },
            alpha: {
              value: 1,
              duration: 50,
              delay: 0
            }
          }
        });
      }

      if (status === STATUS_INCORRECT) {
        this.scene.add.tween({
          targets: this.crossImage,
          props: {
            scale: {
              value: 0.5,
              duration: 400
            },
            alpha: {
              value: 1,
              duration: 400,
              delay: 0
            }
          }
        });

        this.scene.add.tween({
          targets: this.crossImage,
          props: {
            alpha: {
              value: 0,
              duration: 400,
              delay: 400
            }
          }
        });
        this.nextStatus = STATUS_UNFLIPPED;
        this.nextStatusTime = new Date().getTime() + 500;
      }
    }
  }

}
