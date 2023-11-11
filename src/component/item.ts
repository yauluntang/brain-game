/*
import 'phaser';

export class ItemObject extends Phaser.GameObjects.Container {
  //grid?: Phaser.GameObjects.Rectangle;
  item?: Phaser.GameObjects.Sprite;
  constructor(scene: Phaser.Scene, itemType: string, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;

    if (itemType === 'tree') {
      //const texture = this.scene.textures.get('item1');
      //new Phaser.Textures.Frame(texture, 'tree', 0, 0, 0, 60, 60)
      this.item = this.scene.add.sprite(32, 32, 'item1', 0);
    }

    if (itemType === 'crystal') {
      //const texture = this.scene.textures.get('item2');
      //new Phaser.Textures.Frame(texture, 'crystal', 0, 0, 0, 60, 60)
      this.item = this.scene.add.sprite(32, 32, 'item2', 0);
    }

    //const card1 = this.add.sprite(200, 300, 'cards', 1).setInteractive();



    const timeline = this.scene.add.timeline([{

      at: 200,
      set: {
        rotation: 10,
      }
    },
    {
      target: this.item,
      at: 500,
      set: {
        rotation: -10,
      }
    }])


    timeline.play();


    if (this.item) {
      this.add(this.item);
      this.scene.add.existing(this);
    }
  }

}*/