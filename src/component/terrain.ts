import { autotile } from '@/utils/tile';
import { mapGenerateRandomSpots, pickOneOfMany } from '@/utils/utils';
import terrain from '../state/terrain.json';
import 'phaser';
import { GRID_SIZE } from '@/utils/constants';


const terrainId = { 0: 194, 1: 128, 2: 129, 3: 130, 4: 96, 5: [97, 160, 161, 162], 6: 98, 7: 64, 8: 65, 9: 66, 10: 1, 11: 2, 12: 33, 13: 34 };

export class TerrainObject extends Phaser.GameObjects.Container {

  myLevel?: Array<Array<number>>;
  myLevelLite?: Array<Array<number>>;
  layers: Array<Phaser.Tilemaps.TilemapLayer> = [];
  mapWidth = 0;
  mapHeight = 0;

  //layer2?: Phaser.Tilemaps.TilemapLayer;
  update(): void {
    super.update();
    for (let i = 0; i < this.layers?.length; i++) {
      const layer = this.layers[i];
      layer.setPosition(this.x, this.y);
    }
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;
    this.mapWidth = 200;
    this.mapHeight = 200;

    const map: Phaser.Tilemaps.Tilemap = this.scene.make.tilemap({ width: this.mapWidth * 2, height: this.mapHeight * 2, tileWidth: GRID_SIZE / 2, tileHeight: GRID_SIZE / 2 });
    const tiles: Phaser.Tilemaps.Tileset | null = map.addTilesetImage('terrain', undefined, GRID_SIZE / 2, GRID_SIZE / 2, 1, 2);
    this.layers = [];
    //this.layer2 = map.createBlankLayer('layer2', tiles, 0, 0);
    //this.layer = map.createBlankLayer('layer1', tiles, 0, 0);
    //this.layer2.fill(321, 0, 0, 80, 80);


    //layer.randomize(0, 0, map.width, map.height, [0, 1, 2, 3, 4, 5, 6, 7]);\
    this.scene.add.existing(this);




    mapGenerateRandomSpots
    this.myLevel = [];
    /*
    this.myLevel = [
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
      [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0],
      [0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
      [0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
      [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0],
      [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1],
      [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
      [1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1],
    ];*/

    const levels = [];
    levels[0] = mapGenerateRandomSpots(this.mapWidth, this.mapHeight, 1, 2, 5);

    levels[1] = mapGenerateRandomSpots(this.mapWidth, this.mapHeight, 2, 3, 2);

    //this.myLevelLite = autotile(this.myLevel, true);


    if (!tiles) {
      return;
    }
    const layer = map.createBlankLayer('layer1', tiles, 0, 0);

    if (!layer) {
      return;
    }

    for (let x = 0; x < this.mapWidth * 2; x++) {
      for (let y = 0; y < this.mapHeight * 2; y++) {
        layer.fill(pickOneOfMany(terrainId[5]), x, y, 1, 1);
      }
    }

    this.layers.push(layer);
    this.add(layer);

    for (let i = 2; i <= 3; i++) {
      const specificTile = levels[i - 2].map((terrainy) => terrainy.map((terrain) => {
        if (terrain === i) {
          return 1;
        } else {
          return 0;
        }
      }));
      const terraintiles = autotile(specificTile);
      const layer = map.createBlankLayer('layer' + i, tiles, 0, 0);
      if (!layer) {
        break;
      }
      const baseIndex = terrain[i].textureBaseIndex as number;
      terraintiles.map((terrainy, y) => terrainy.map((terrain, x) => {
        if (terrain > 0) {
          layer.fill(pickOneOfMany(terrainId[terrain]) + baseIndex, x, y, 1, 1);
        }
      }));



      this.add(layer);
      this.layers.push(layer);
    }

    //console.log(newTer);


  }
}

