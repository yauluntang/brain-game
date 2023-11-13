import 'phaser';
import { MatchingTileObject } from './component/matchingTile';
import MatchingTileScene from './scene/matchingTile';
import NumberTileScene from './scene/numberTile';


const totalWidth = 1200;
const totalHeight = 1600;

type Config = {
  columns: number,
  fruits: number,
  rows: number,
  revealTime: number,
  skips: Array<number>
}

export default class MenuScene extends Phaser.Scene {


  constructor() {
    super('MenuScene');
  }

  tileArray: Array<number> = [];
  matchingTileObjects: Array<MatchingTileObject> = [];
  incorrect = 0;
  solved = 0;
  statusText?: Phaser.GameObjects.Text;
  correctSound?: Phaser.Sound.BaseSound;
  wrongSound?: Phaser.Sound.BaseSound;
  config?: Config;

  preload(): void {
    this.load.image('level', 'assets/images/level.png');
    this.load.image('checkmark', 'assets/images/checkmark.png');
    this.load.image('cross', 'assets/images/cross.png');
    this.load.image('backImage', 'assets/images/question.png');
    this.load.image('youwin', 'assets/images/youwin.png');

    this.load.image('next', 'assets/images/next.png');
    this.load.image('reload', 'assets/images/reload.png');

    this.load.audio('wrong', ['assets/sound/wrong.mp3', 'assets/sound/wrong.ogg']);
    this.load.audio('correct', ['assets/sound/correct.mp3', 'assets/sound/correct.ogg']);

    this.load.image('tile', 'assets/images/tile.png');
    this.load.image('timer', 'assets/images/timer.png');
    this.load.image('human-head', 'assets/images/human-head.png');
    this.load.image('logo', 'assets/images/logo.png');
    this.load.image('matching', 'assets/images/matching.png');
    this.load.image('number1234', 'assets/images/number1234.png');
  }


  create(): void {
    const logo = this.add.image(600, 300, 'human-head');
    logo.setScale(0.5)

    const matchingTile = this.add.image(600, 800, 'matching')
    matchingTile.setScale(0.5)
    matchingTile.setInteractive({ pixelPerfect: true })
    matchingTile.on('pointerdown', () => {
      this.scene.start('MatchingTileScene', { level: 1 })
    });


    const numberTile = this.add.image(600, 1000, 'number1234')
    numberTile.setScale(0.5)
    numberTile.setInteractive({ pixelPerfect: true })


    numberTile.on('pointerdown', () => {
      this.scene.start('NumberTileScene', { level: 1 })
    });
  }
}
const config = {
  type: Phaser.AUTO,
  backgroundColor: '#FFF',
  antialias: true,
  mipmapFilter: 'LINEAR',
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-example',
    width: totalWidth,
    height: totalHeight
  },
  level: 1,
  scene: [MenuScene, MatchingTileScene, NumberTileScene]
};

new Phaser.Game(config);

