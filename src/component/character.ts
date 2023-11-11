import 'phaser';
import { Profession } from '@/state/battlefield';

const DIRECTIONS: Array<string> = [
  'D',
  'L',
  'R',
  'U'
];

export class CharacterObject extends Phaser.GameObjects.Container {
  directionKeys: Array<string> = [];
  direction = 0;
  actor?: Phaser.GameObjects.Sprite;
  constructor(scene: Phaser.Scene, profession: Profession, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.actor = this.scene.add.sprite(0, 0, profession.spriteFile as string);
    for (let direction = 0; direction < 4; direction++) {
      const firstI = profession.spriteIndex[direction];
      this.directionKeys[direction] = `${profession.spriteFile} -${firstI} -${DIRECTIONS[direction]}`;
      this.scene.anims.create({
        key: this.directionKeys[direction],
        frameRate: 7,
        frames: this.scene.anims.generateFrameNumbers(profession.spriteFile, { frames: [firstI, firstI + 1, firstI + 2, firstI + 1] }),
        repeat: -1
      });
    }
    this.actor.play(this.directionKeys[0]);
    this.add(this.actor);
    this.scene.add.existing(this);
  }

  onDirectionChange(direction: number): void {
    this.direction = direction;
    this.actor?.play(this.directionKeys[direction]);
  }

}

