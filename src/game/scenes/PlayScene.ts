import { Scene } from 'phaser'


export default class PlayScene extends Scene {
  graphics: any;
  triangle: any;
  point: any;
  a: number = 0;
  game: any;
  phoneDiv: any;
  gamepad: any;
  
  constructor () {
    super({ key: 'PlayScene' })
  }

  preload() {
    this.load.image('spark', require('@/game/assets/blue.png'))
  }

  create() {
    var emitter = this.add.particles('spark').createEmitter({
        blendMode: 'SCREEN',
        scale: { start: 0.2, end: 0 },
        speed: { min: -100, max: 100 },
        quantity: 10
    });

    var emitZones = [];

    this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});

    //  Random
    var x1 = Phaser.Math.Between(50, 400);
    var y1 = Phaser.Math.Between(50, 300);

    var x2 = Phaser.Math.Between(450, 750);
    var y2 = Phaser.Math.Between(50, 300);

    var x3 = Phaser.Math.Between(50, 750);
    var y3 = Phaser.Math.Between(350, 550);

    this.triangle = new Phaser.Geom.Triangle(x1, y1, x2, y2, x3, y3);

    const graphics = this.add.graphics();
    const colorA = 0xaa0000;
    const lineA = this.triangle.getLineA();
    const lineA_pointA = lineA.getPointA();
    const circleA = new Phaser.Geom.Circle(lineA_pointA.x, lineA_pointA.y, 20);
    
    graphics.lineStyle(3, colorA);
    graphics.strokeCircleShape(circleA);
    graphics.strokeLineShape(lineA);
    emitZones.push({
        source: circleA,
        type: 'edge',
        quantity: 50
    });

    const colorB = 0x00aa00;
    const lineB = this.triangle.getLineB();
    const lineB_pointA = lineB.getPointA();
    const circleB = new Phaser.Geom.Circle(lineB_pointA.x, lineB_pointA.y, 20);
    
    graphics.lineStyle(3, colorB);
    graphics.strokeCircleShape(circleB);
    graphics.strokeLineShape(lineB);

    const colorC = 0x0000aa;
    const lineC = this.triangle.getLineC();
    const lineC_pointA = lineC.getPointA();
    const circleC = new Phaser.Geom.Circle(lineC_pointA.x, lineC_pointA.y, 20);
    
    graphics.lineStyle(3, colorC);
    graphics.strokeCircleShape(circleC);
    graphics.strokeLineShape(lineC);

    this.point = new Phaser.Geom.Rectangle(0, 0, 16, 16);

    var emitZoneIndex = 0;

    emitter.setEmitZone(emitZones[emitZoneIndex]);

    this.phoneDiv = this.add.dom(400, 300).createFromHTML(require('@/game/assets/phone.html'));
    this.physics.add.existing(this.phoneDiv, false);

    this.phoneDiv.body.setSize(0.5, 0.5, 0.5);
    this.phoneDiv.body.setVelocity(100, 200);
    this.phoneDiv.body.setBounce(1, 1);
    this.phoneDiv.body.setCollideWorldBounds(true);

    this.input.gamepad.once('down', (pad: any, button: any, index: any) => {
        this.gamepad = pad;
        console.log('GAMEPAD DETECTED:');
        console.log(this.gamepad);
    });
  }

  update () {
    if (this.gamepad) {
      // do stuff.  i.e.:
      // if (gamepad.left) {}
    }

    this.physics.world.collide(this.phoneDiv);

    this.a += 0.005;

    if (this.a > 1)
    {
        this.a = 0;
    }

    this.triangle.getPoint(this.a, this.point);

    this.graphics.clear();
    this.graphics.lineStyle(2, 0x00ff00);
    this.graphics.strokeTriangleShape(this.triangle);

    this.graphics.fillStyle(0xff00ff);
    this.graphics.fillRect(this.point.x - 8, this.point.y - 8, this.point.width, this.point.height);
  }
}
