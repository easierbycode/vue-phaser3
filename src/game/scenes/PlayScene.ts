import { Scene } from 'phaser'
import WeaponPlugin from 'phaser3-weapon-plugin'


class SparkGun extends WeaponPlugin.Weapon {
  constructor(scene: any, bulletLimit: number = 32, key: string = 'spark', frame: number = 0, group?: any) {
    super(scene, bulletLimit, key, frame, group);
  }
}

export default class PlayScene extends Scene {
  graphics: any;
  triangle: any;
  point: any;
  a: number = 0;
  game: any;
  phoneDiv: any;
  gamepad: any;
  sprite: any;

  constructor () {
    super({ key: 'PlayScene' })
  }

  preload() {
    this.load.image('spark', require('@/game/assets/blue.png'))
    this.plugins.installScenePlugin('WeaponPlugin', WeaponPlugin, 'weapons', this);
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

        this.sprite = this.add.text(x1, y1, '🤬', { fontFamily: 'Arial', fontSize: 48, fill: '#ff0000' });
        this.sprite.setOrigin(0.5, 0.5);

        const weapon = this.weapons.add(32, 'spark');
        weapon.nextFire = 0;
        weapon.bulletSpeed = 600;
        weapon.fireRate = 40;
        weapon.bulletAngleVariance = 10;

        // add(bulletLimit, key, frame, group, weaponClass)
        // const weapon = this.weapons.add(32, 'spark', 0, null, SparkGun);
        weapon.trackSprite(this.sprite, 0, 0, true);
        
        this.sprite.weapons = [
          weapon
        ];

        this.sprite.currentWeapon = 0;
    });
  }

  update () {
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

    if (this.input.gamepad.total === 0)
    {
        return;
    }

    var pad = this.input.gamepad.getPad(0);

    if (this.sprite && pad.axes.length)
    {
        var axisH = pad.axes[0].getValue();
        var axisV = pad.axes[1].getValue();

        if (axisH) {
          this.sprite.x += 4 * axisH;
          this.sprite.flipX = true;
        }
        if (axisV)  this.sprite.y += 4 * axisV;

        let rightStickX     = pad.axes[(Phaser.Input.Gamepad.Configs.XBOX_360 as IGamepad).RIGHT_STICK_H].getValue();  // gamepad.axis( Phaser.Gamepad.XBOX360_STICK_RIGHT_X );
        let rightStickY     = pad.axes[(Phaser.Input.Gamepad.Configs.XBOX_360 as IGamepad).RIGHT_STICK_V].getValue();  // gamepad.axis( Phaser.Gamepad.XBOX360_STICK_RIGHT_Y );
        rightStickX         = ( Math.abs( rightStickX ) > pad.axes[2].threshold ) ? rightStickX : 0;
        rightStickY         = ( Math.abs( rightStickY ) > pad.axes[3].threshold ) ? rightStickY : 0;
        let thumbstickAngle = this.coordinatesToRadians( rightStickX, rightStickY );

        if ( thumbstickAngle != null ) {
            this.sprite.rotation  = thumbstickAngle;  // - 90;

            this.sprite.weapons[ this.sprite.currentWeapon ].fire();

            this.sprite.rotation  = thumbstickAngle - 90;  // TODO: rotate emoji -90 instead of hack
        }
    }
  }

  coordinatesToRadians(x: number, y: number): number | null {
      if (x === 0 && y === 0) {
          return null;
      }

      let radians = Math.atan2(y, x);
      if (radians < 0) {
          radians += 2 * Math.PI;
      }
      return Math.abs(radians);
  }
}


interface IGamepad {
  UP: number;
  DOWN: number;
  LEFT: number;
  RIGHT: number;

  MENU: number;

  A: number;
  B: number;
  X: number;
  Y: number;

  LB: number;
  RB: number;

  LT: number;
  RT: number;

  BACK: number;
  START: number;

  LS: number;
  RS: number;

  LEFT_STICK_H: number;
  LEFT_STICK_V: number;
  RIGHT_STICK_H: number;
  RIGHT_STICK_V: number;
}