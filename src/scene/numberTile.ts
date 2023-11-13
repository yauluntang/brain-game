import 'phaser';
import { STATUS_CORRECT, STATUS_INCORRECT, shuffleArray } from '../utils/utils';
import { NumberTileObject } from '@/component/numberTile';
import { VictoryObject } from '@/component/victory';
import { TopAndBottomBar } from '@/component/topAndBottomBar';


const totalWidth = 1200;
const totalHeight = 1600;

type Config = {
  columns: number,
  rows: number,
  layers: number,
  max: number
}

type LevelData = {
  level: number
}

export default class NumberTileScene extends Phaser.Scene {

  topBottomBar?: TopAndBottomBar;
  config?: Config;
  level = 0;
  tile: Array<Array<number>> = []
  numberTile: Array<NumberTileObject> = []
  numberTileMap: Map<number, NumberTileObject> = new Map<number, NumberTileObject>();
  currentNumber = 0;
  solved = 0;
  incorrect = 0;
  startTime: number = new Date().getTime();
  endTime: number = new Date().getTime();
  timerText?: Phaser.GameObjects.Text;
  won = false;

  constructor() {
    super('NumberTileScene');
  }

  preload(): void {

    this.load.json('leveldata', 'assets/config/numberTileLevels.json');


  }
  init(data: LevelData): void {

    this.level = data.level;
  }

  tileClicked = (tileId: number): void => {

    const numberTile = this.numberTileMap.get(tileId);
    if (!this.config) {
      return;
    }
    if (this.currentNumber === tileId) {
      numberTile?.setStatus(STATUS_CORRECT);
      this.solved++;
      this.currentNumber++;
      this.topBottomBar?.playCorrectSound();

      if (this.currentNumber >= this.config.max) {
        this.victory();
      }
    }
    else {
      this.topBottomBar?.playWrongSound();
      this.incorrect++;
      numberTile?.setStatus(STATUS_INCORRECT);
    }
  }

  victory = (): void => {
    this.add.existing(new VictoryObject(this));
    this.won = true;
  }

  restart = (level: number): void => {
    this.currentNumber = 1;

    this.won = false;
    const configData = this.cache.json.get('leveldata');
    this.config = configData[level]
    if (!this.config) {
      return;
    }

    const numberPerLayer = this.config.columns * this.config.rows;
    const maxNumber = numberPerLayer * (this.config.layers)

    for (let layer = 0; layer < this.config.layers; layer++) {
      this.tile[layer] = []
      for (let i = 0; i < numberPerLayer; i++) {
        this.tile[layer][i] = i + (layer * numberPerLayer) + 1;
      }

      shuffleArray(this.tile[layer])
    }

    for (let i = 0; i < maxNumber; i++) {
      const numberTile = new NumberTileObject(this, i, 0, this.tileClicked)
      this.numberTile.push(numberTile)
      numberTile.setScale(0.7)
      this.add.existing(numberTile);
    }

    const tileWidth = totalWidth / this.config.columns;
    const tileHeight = (totalHeight - 600) / this.config.rows;

    let position = 0;
    for (let layer = this.config.layers - 1; layer >= 0; layer--) {
      let layerPosition = 0;
      for (let x = 0; x < this.config.columns; x++) {
        for (let y = 0; y < this.config.rows; y++) {
          this.numberTile[position].setPosition(x * tileWidth + tileWidth / 2, y * tileHeight + tileHeight / 2 + 200);
          const id = this.tile[layer][layerPosition];
          this.numberTile[position].setId(id);

          this.numberTileMap.set(id, this.numberTile[position]);
          position++;
          layerPosition++;
        }
      }
    }

    this.startTime = new Date().getTime();
  }

  create(): void {
    this.topBottomBar = new TopAndBottomBar(this, 'NumberTileScene', this.level)
    this.add.existing(this.topBottomBar);
    this.restart(this.level)

  }

  update(): void {


    for (let i = 0; i < this.numberTile.length; i++) {
      this.numberTile[i].update()
    }
    if (!this.won) {
      this.endTime = new Date().getTime();
    }
    this.timerText?.setText(`${Math.round((this.endTime - this.startTime) / 10) / 100}`)
  }

}
