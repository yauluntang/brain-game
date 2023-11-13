import 'phaser';


export class TopAndBottomBar extends Phaser.GameObjects.Container {

  statusCorrectText?: Phaser.GameObjects.Text;
  statusIncorrectText?: Phaser.GameObjects.Text;
  statusText?: Phaser.GameObjects.Text;
  statusLevelText?: Phaser.GameObjects.Text;
  correctSound?: Phaser.Sound.BaseSound;
  wrongSound?: Phaser.Sound.BaseSound;
  level = 0;
  sceneName = '';

  constructor(scene: Phaser.Scene, sceneName: string, level: number) {

    super(scene)
    this.sceneName = sceneName
    this.level = level;

    const levelImage = this.scene.add.image(100, 50, 'level')
    levelImage.setScale(0.3);
    this.add(levelImage);

    const checkmark = this.scene.add.image(350, 50, 'checkmark')
    checkmark.setScale(0.1);
    this.add(checkmark);

    const cross = this.scene.add.image(500, 50, 'cross')
    cross.setScale(0.1);
    this.add(cross);

    this.statusCorrectText = this.scene.add.text(380, 26, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#000', fontSize: '36px' });
    this.statusIncorrectText = this.scene.add.text(530, 26, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#000', fontSize: '36px' });

    this.statusLevelText = this.scene.add.text(200, 10, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#000', fontSize: '50px' });

    this.add(this.statusCorrectText);
    this.add(this.statusIncorrectText);
    this.add(this.statusLevelText);

    const reload = this.scene.add.image(600, 1400, 'reload');
    reload.setScale(0.4);
    reload.setInteractive({ pixelPerfect: true })


    const previous = this.scene.add.image(200, 1400, 'next');
    previous.setScale(-0.4, 0.4);
    previous.setInteractive({ pixelPerfect: true })

    const next = this.scene.add.image(1000, 1400, 'next');
    next.setScale(0.4);
    next.setInteractive({ pixelPerfect: true })

    this.add(reload);
    this.add(previous);
    this.add(next);

    this.correctSound = this.scene.sound.add('correct');
    this.wrongSound = this.scene.sound.add('wrong');




    reload.on('pointerdown', () => {
      this.scene.scene.start(this.sceneName, { level: this.level })
    })

    previous.on('pointerdown', () => {
      if (this.level > 1) {
        this.scene.scene.start(this.sceneName, { level: this.level - 1 })
      }
    })

    next.on('pointerdown', () => {
      if (this.level < 5) {
        this.scene.scene.start(this.sceneName, { level: this.level + 1 })
      }
    })

    this.setLevel(this.level);
    this.setCorrectText(0);
    this.setIncorrectText(0);


  }

  setLevel = (level: number): void => {
    this.statusLevelText?.setText(`${level}`)
    this.level = level;
  }
  setCorrectText = (text: number): void => {
    this.statusCorrectText?.setText(`${text}`)
  }
  setIncorrectText = (text: number): void => {
    this.statusIncorrectText?.setText(`${text}`)
  }
  playCorrectSound = (): void => {
    this.correctSound?.play();
  }
  playWrongSound = (): void => {
    this.wrongSound?.play();
  }

}
