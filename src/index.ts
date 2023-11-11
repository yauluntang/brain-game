import 'phaser';
import { MatchingTileObject } from './component/matchingTile';
import { STATUS_FLIPPED, STATUS_FLIPPING, STATUS_UNFLIPPED, shuffleArray } from './utils/utils';

const fruitImages = [
  'apple',
  'bananas',
  'blueberry',
  'grapes',
  'orange',
  'pear',
  'pineapple',
  'strawberry'
]



export default class Demo extends Phaser.Scene {


  constructor() {
    super('demo');
  }

  tileArray: Array<number> = [];
  matchingTileObjects: Array<MatchingTileObject> = [];
  incorrect = 0;
  solved = 0;
  statusText?: Phaser.GameObjects.Text;

  preload(): void {
    //this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('checkmark', 'assets/images/checkmark.png');
    this.load.image('backImage', 'assets/images/question.png');

    for (let i = 0; i < fruitImages.length; i++) {
      this.load.image(`fruit_${i}`, `assets/images/${fruitImages[i]}.png`);
    }
    this.load.spritesheet('fruit', 'assets/images/fruit.png', { frameWidth: 1380, frameHeight: 1480 });


  }


  cardFlipped = (tileId: number): void => {

    const flippingObjects = this.matchingTileObjects.filter((object: MatchingTileObject) => object.status === STATUS_FLIPPING);
    console.log(flippingObjects.length)

    if (flippingObjects.length < 2 && this.matchingTileObjects[tileId].status === STATUS_UNFLIPPED) {
      this.matchingTileObjects[tileId].setStatus(STATUS_FLIPPING)
      flippingObjects.push(this.matchingTileObjects[tileId]);
      if (flippingObjects.length == 2) {
        if (flippingObjects[0].imageId === this.matchingTileObjects[tileId].imageId) {
          flippingObjects[0].setStatus(STATUS_FLIPPED);
          this.matchingTileObjects[tileId].setStatus(STATUS_FLIPPED);
          this.solved += 2;
        }
        else {
          this.incorrect++;
          setTimeout(() => {
            flippingObjects[0].setStatus(STATUS_UNFLIPPED);
            this.matchingTileObjects[tileId].setStatus(STATUS_UNFLIPPED);
          }, 1000)
        }
      }
    }
  }


  create(): void {

    for (let i = 0; i < 8; i++) {
      for (let d = 0; d < 2; d++) {
        this.tileArray.push(i);
      }
    }

    shuffleArray(this.tileArray);
    console.log(this.tileArray);

    let i = 0;

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        const newTileObject = new MatchingTileObject(this, this.tileArray[i], i, STATUS_FLIPPED, this.cardFlipped)
        newTileObject.setScale(0.4);
        this.matchingTileObjects.push(newTileObject);
        this.add.existing(newTileObject);
        newTileObject.setPosition(x * 300 + 150, y * 300 + 250)
        i++;
      }
    }

    setTimeout(() => {
      for (let i = 0; i < 16; i++) {
        this.matchingTileObjects[i].setStatus(STATUS_UNFLIPPED);
      }
    }, 3000)

    this.statusText = this.add.text(10, 10, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#000', fontSize: '36px' });


  }

  update(): void {

    this.statusText?.setText(`SOLVED: ${this.solved}  INCORRECT: ${this.incorrect}`)

  }
}
const config = {
  type: Phaser.AUTO,
  backgroundColor: '#FFF',
  antialias: true,
  mipmapFilter: 'NEAREST_MIPMAP_NEAREST',
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-example',
    width: 1200,
    height: 1600
  },
  scene: Demo
};

new Phaser.Game(config);
