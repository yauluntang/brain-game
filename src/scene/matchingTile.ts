import 'phaser';
import { MatchingTileObject } from '../component/matchingTile';
import { STATUS_FLIPPED, STATUS_FLIPPING, STATUS_UNFLIPPING, STATUS_UNFLIPPED, shuffleArray, STATUS_UNFLIPPING_WAIT } from '../utils/utils';
import { TopAndBottomBar } from '@/component/topAndBottomBar';
import { VictoryObject } from '@/component/victory';

const fruitImages = [
  'apple',
  'bananas',
  'blueberry',
  'grapes',
  'orange',
  'pear',
  'pineapple',
  'strawberry',
  'lemon',
  'peach',
  'lime',
  'watermelon'
]


const totalWidth = 1200;
const totalHeight = 1600;

type Config = {
  columns: number,
  fruits: number,
  rows: number,
  revealTime: number,
  skips: Array<number>
}

type LevelData = {
  level: number
}

export default class MatchingTileScene extends Phaser.Scene {


  constructor() {
    super('MatchingTileScene');
  }
  tileArray: Array<number> = [];
  matchingTileObjects: Array<MatchingTileObject> = [];
  incorrect = 0;
  solved = 0;
  topBottomBar?: TopAndBottomBar;
  config?: Config;
  level = 0;
  flipTime: number = new Date().getTime();
  startTime: number = new Date().getTime();
  endTime: number = new Date().getTime();
  flippedAllImages = false;
  won = false;

  preload(): void {
    for (let i = 0; i < fruitImages.length; i++) {
      this.load.image(`fruit_${i}`, `assets/images/${fruitImages[i]}.png`);
    }
    this.load.json('matchingTileLevels', 'assets/config/matchingTileLevels.json');
  }

  victory = (): void => {
    this.add.existing(new VictoryObject(this));
    this.won = true;
  }

  cardFlipped = (tileId: number): void => {
    const flippingObjects = this.matchingTileObjects.filter((object: MatchingTileObject) => object.status === STATUS_FLIPPING);

    if (flippingObjects.length < 2 && this.matchingTileObjects[tileId].status === STATUS_UNFLIPPED) {

      this.matchingTileObjects[tileId].setStatus(STATUS_FLIPPING)
      flippingObjects.push(this.matchingTileObjects[tileId]);
      if (flippingObjects.length == 2) {
        if (flippingObjects[0].imageId === this.matchingTileObjects[tileId].imageId) {
          flippingObjects[0].setStatus(STATUS_FLIPPED);
          this.matchingTileObjects[tileId].setStatus(STATUS_FLIPPED);
          this.solved++;
          this.topBottomBar?.setCorrectText(this.solved);
          this.topBottomBar?.playCorrectSound();
          if (this.solved === this.config?.fruits) {
            this.victory();
          }
        }
        else {
          this.incorrect++;
          this.topBottomBar?.setIncorrectText(this.incorrect);
          this.topBottomBar?.playWrongSound();
          flippingObjects[0].setStatus(STATUS_UNFLIPPING_WAIT);
          this.matchingTileObjects[tileId].setStatus(STATUS_UNFLIPPING_WAIT);
        }
      }
    }
  }

  init(data: LevelData): void {

    this.level = data.level;
  }

  restart = (level: number): void => {
    const configData = this.cache.json.get('matchingTileLevels');
    this.won = false;
    this.flippedAllImages = false;
    this.solved = 0;
    this.incorrect = 0;
    this.config = configData[level]
    if (!this.config) {
      return;
    }
    const tileWidth = totalWidth / this.config.columns;
    const tileHeight = (totalHeight - 600) / this.config.rows;
    this.tileArray.length = 0;
    for (let i = 0; i < this.config.fruits; i++) {
      for (let d = 0; d < 2; d++) {
        this.tileArray.push(i);
      }
    }
    shuffleArray(this.tileArray);
    let i = 0;
    let position = 0;
    this.matchingTileObjects.length = 0;
    for (let x = 0; x < this.config.columns; x++) {
      for (let y = 0; y < this.config.rows; y++) {
        if (this.config.skips && this.config.skips.indexOf(position) === -1) {
          const newTileObject = new MatchingTileObject(this, this.tileArray[i], i, STATUS_FLIPPED, this.cardFlipped)
          newTileObject.setScale(0.35);
          this.matchingTileObjects.push(newTileObject);
          this.add.existing(newTileObject);
          newTileObject.setPosition(x * tileWidth + tileWidth / 2, y * tileHeight + tileHeight / 2 + 200)
          i++;
        }
        position++;
      }
    }

    this.flipTime = new Date().getTime() + this.config.revealTime;

  }

  flipAllImages = (): void => {
    for (let i = 0; i < this.matchingTileObjects.length; i++) {
      this.matchingTileObjects[i].setStatus(STATUS_UNFLIPPING);
    }
  }

  create(): void {
    this.topBottomBar = new TopAndBottomBar(this, 'MatchingTileScene', this.level)
    this.add.existing(this.topBottomBar);
    this.restart(this.level)
  }

  update(): void {

    if (this.flipTime < new Date().getTime() && !this.flippedAllImages) {
      this.flipAllImages();
      this.flippedAllImages = true;
      this.startTime = new Date().getTime();
    }

    if (!this.won) {
      this.endTime = new Date().getTime();
    }

    for (let i = 0; i < this.matchingTileObjects.length; i++) {
      this.matchingTileObjects[i].update()
    }

    if (this.flippedAllImages) {
      this.topBottomBar?.setTimerText(`${Math.round((this.endTime - this.startTime) / 10) / 100}`)
    }

  }
}
