import 'phaser';


export class TopAndBottomBar extends Phaser.GameObjects.Container {

  statusCorrectText?: Phaser.GameObjects.Text;
  statusIncorrectText?: Phaser.GameObjects.Text;
  statusText?: Phaser.GameObjects.Text;
  statusLevelText?: Phaser.GameObjects.Text;
  timerText?: Phaser.GameObjects.Text;
  correctSound?: Phaser.Sound.BaseSound;
  wrongSound?: Phaser.Sound.BaseSound;
  level = 0;
  sceneName = '';

  constructor(scene: Phaser.Scene, sceneName: string, level: number) {

    const levelX = 400;
    const checkMarkX = levelX + 240;
    const crossX = checkMarkX + 140;
    const timerX = crossX + 140;
    const Y = 70;

    super(scene)
    this.sceneName = sceneName
    this.level = level;


    const logo = this.scene.add.image(180, Y, 'logo')
    logo.setScale(0.15);
    this.add(logo);
    logo.setInteractive({ pixelPerfect: true })

    const levelImage = this.scene.add.image(levelX, Y, 'level')
    levelImage.setScale(0.3);
    this.add(levelImage);

    this.statusLevelText = this.scene.add.text(levelX + 100, Y - 10, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#000', fontSize: '50px' });
    this.statusLevelText.setOrigin(0, 0.5)
    this.add(this.statusLevelText);


    const checkmark = this.scene.add.image(checkMarkX, Y, 'checkmark')
    checkmark.setScale(0.1);
    this.add(checkmark);
    this.statusCorrectText = this.scene.add.text(checkMarkX + 30, Y, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#000', fontSize: '36px' });
    this.statusCorrectText.setOrigin(0, 0.5)
    this.add(this.statusCorrectText);

    const cross = this.scene.add.image(crossX, Y, 'cross')
    cross.setScale(0.1);
    this.add(cross);
    this.statusIncorrectText = this.scene.add.text(crossX + 30, Y, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#000', fontSize: '36px' });
    this.statusIncorrectText.setOrigin(0, 0.5)
    this.add(this.statusIncorrectText);


    const timer = this.scene.add.image(timerX, Y, 'timer')
    timer.setScale(0.1);
    this.add(timer);
    this.timerText = this.scene.add.text(timerX + 30, Y, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#000', fontSize: '36px' });
    this.timerText.setOrigin(0, 0.5)
    this.add(this.timerText);



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


    logo.on('pointerdown', () => {
      this.scene.scene.start('MenuScene')
    })

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
  setTimerText = (text: string): void => {
    this.timerText?.setText(`${text}`)
  }
  playCorrectSound = (): void => {
    this.correctSound?.play();
  }
  playWrongSound = (): void => {
    this.wrongSound?.play();
  }

}
