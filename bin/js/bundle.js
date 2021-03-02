(function () {
    'use strict';

    class GameControl extends Laya.Image {
        constructor(_player) {
            super();
            this.player = _player;
            this.width = Laya.Browser.width;
            this.height = Laya.Browser.height;
            this.dirR = new Laya.Sprite();
            this.proR = new Laya.Sprite();
            this.proR.graphics.drawCircle(0, 0, 5, "#FFFFFF");
            this.proR.graphics.drawCircle(0, 0, 75, "#878787");
            this.dirR.visible = false;
            this.proR.visible = false;
            this.proR.zOrder = 1001;
            this.dirR.zOrder = 1002;
            this.addChild(this.dirR);
            this.addChild(this.proR);
            this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            this.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
        }
        onMouseDown() {
            this.dirR.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            this.dirR.alpha = 0.6;
            this.dirR.graphics.drawCircle(0, 0, 25, "#A9AAAB");
            this.proR.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            this.proR.alpha = 0.5;
            this.dirR.visible = true;
            this.proR.visible = true;
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        }
        onMouseUp() {
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            this.player.setDirection(0, 0);
            this.dirR.visible = false;
            this.proR.visible = false;
        }
        dis(ax, ay, bx, by) {
            let dx = ax - bx;
            let dy = ay - by;
            return Math.sqrt(dx * dx + dy * dy);
        }
        onMouseMove(e) {
            let dis = this.dis(this.proR.x, this.proR.y, Laya.stage.mouseX, Laya.stage.mouseY);
            let ang = Math.atan2(Laya.stage.mouseY - this.proR.y, Laya.stage.mouseX - this.proR.x);
            if (dis < 200) {
                if (dis > 50) {
                    this.dirR.pos(this.proR.x + Math.cos(ang) * 50, this.proR.y + Math.sin(ang) * 50);
                    this.player.setDirection(Math.cos(ang), (Math.sin(ang)));
                }
                else {
                    this.dirR.pos(Laya.stage.mouseX, Laya.stage.mouseY);
                    this.player.setDirection(Math.cos(ang) * dis / 50, (Math.sin(ang) * dis / 50));
                }
            }
        }
    }

    var CharacterAction;
    (function (CharacterAction) {
        CharacterAction[CharacterAction["None"] = 0] = "None";
        CharacterAction[CharacterAction["Walk"] = 1] = "Walk";
        CharacterAction[CharacterAction["RandomWalk"] = 2] = "RandomWalk";
        CharacterAction[CharacterAction["Attack"] = 3] = "Attack";
    })(CharacterAction || (CharacterAction = {}));
    class Character extends Laya.Script {
        constructor() {
            super(...arguments);
            this.action = CharacterAction.None;
        }
        setDirection(_x, _y) {
            this.x = _x;
            this.y = _y;
        }
        onStart() {
            this.x = 0;
            this.y = 0;
            this.speed = 3.0;
            this.frame = 0;
            this.stepindex = 0;
            this.directindex = 0;
            this.rigidbody = this.owner.getComponent(Laya.RigidBody);
        }
        doTurnAround() {
            if (Math.abs(this.dirx) > Math.abs(this.diry)) {
                if (this.dirx > 0) {
                    this.directindex = 3;
                }
                else {
                    this.directindex = 2;
                }
            }
            else {
                if (this.diry > 0) {
                    this.directindex = 0;
                }
                else {
                    this.directindex = 1;
                }
            }
            this.owner.value = Character.Values[0][this.directindex];
        }
        doMove() {
            this.rigidbody.setVelocity({ x: this.x * this.speed, y: this.y * this.speed });
            if (this.x == 0 && this.y == 0) {
                return;
            }
            this.dirx = this.x;
            this.diry = this.y;
            this.frame++;
            if (this.frame * this.speed >= 50) {
                this.frame = 0;
                this.stepindex++;
                if (this.stepindex >= 4) {
                    this.stepindex = 0;
                }
            }
            if (Math.abs(this.x) > Math.abs(this.y)) {
                if (this.x > 0) {
                    this.directindex = 3;
                }
                else {
                    this.directindex = 2;
                }
            }
            else {
                if (this.y > 0) {
                    this.directindex = 0;
                }
                else {
                    this.directindex = 1;
                }
            }
            this.owner.value = Character.Values[this.stepindex][this.directindex];
        }
        onStopMove() {
            this.x = 0;
            this.y = 0;
        }
        onSetRandomWalk() {
            this.x = 0.5 - Math.random();
            this.y = 0.5 - Math.random();
            let mod = Math.sqrt(this.x * this.x + this.y * this.y);
            if (mod != 0) {
                this.x /= mod;
                this.y /= mod;
            }
        }
    }
    Character.Values = [["一", "八", "匕", "厂"], ["刀", "儿", "二", "几"], ["力", "人", "入", "十"], ["又", "川", "寸", "大"], ["飞", "干", "工", "弓"], ["广", "己", "口", "马"], ["门", "女", "山", "尸"]];

    var Direction;
    (function (Direction) {
        Direction[Direction["None"] = 0] = "None";
        Direction[Direction["UP"] = 1] = "UP";
        Direction[Direction["Down"] = 2] = "Down";
        Direction[Direction["Left"] = 3] = "Left";
        Direction[Direction["Right"] = 4] = "Right";
    })(Direction || (Direction = {}));
    var RegionType;
    (function (RegionType) {
        RegionType[RegionType["Undefined"] = 0] = "Undefined";
        RegionType[RegionType["Grass"] = 1] = "Grass";
        RegionType[RegionType["Desert"] = 2] = "Desert";
        RegionType[RegionType["Snow"] = 3] = "Snow";
        RegionType[RegionType["Lava"] = 4] = "Lava";
    })(RegionType || (RegionType = {}));

    class GrassEnemy1 extends Character {
        constructor() {
            super(...arguments);
            this.AItick = 0;
            this.maxHP = 2;
        }
        onStart() {
            this.x = 0;
            this.y = 0;
            this.speed = 2.0;
            this.frame = 0;
            this.AItick = 0;
            this.stepindex = 0;
            this.directindex = 0;
            this.action == CharacterAction.RandomWalk;
            this.rigidbody = this.owner.getComponent(Laya.RigidBody);
        }
        onUpdate() {
            this.AI();
        }
        AI() {
            this.AItick++;
            if (this.action == CharacterAction.Attack) {
                if (this.AItick == 100) {
                    this.AItick = 0;
                    this.action = CharacterAction.RandomWalk;
                }
                return;
            }
            if (this.AItick >= 200) {
                this.onStopMove();
                this.AItick = 0;
                this.action = CharacterAction.Attack;
            }
            else {
                if (Math.random() < 0.05) {
                    this.onSetRandomWalk();
                }
            }
            this.doMove();
        }
    }
    GrassEnemy1.BattlePoint = 1;
    GrassEnemy1.skinname = "Enemy/3.png";

    class EnemyFactory {
        constructor(battlesprite) {
            this.grassEnemies = [GrassEnemy1];
            this.mainsp = battlesprite;
            EnemyFactory.enemylist = [];
        }
        initEnemy(regiontype, enemyforce) {
            let Enemies = [];
            if (regiontype == RegionType.Grass) {
                Enemies = this.grassEnemies;
            }
            while (enemyforce > 0) {
                let Enemy = Enemies[Math.floor(Math.random() * Enemies.length)];
                if (Enemy.BattlePoint > enemyforce) {
                    continue;
                }
                let fc = new Laya.FontClip(Enemy.skinname, "一八匕厂 刀儿二几 力人入十 又川寸大");
                fc.scaleX = fc.scaleY = 3;
                fc.value = "一";
                fc.x = 96 + Math.random() * 96 * 8;
                fc.y = 96 + Math.random() * 96 * 3;
                let rigid = fc.addComponent(Laya.RigidBody);
                rigid.type = "dynamic";
                rigid.gravityScale = 0;
                rigid.allowRotation = false;
                let collider = fc.addComponent(Laya.BoxCollider);
                collider.width = collider.height = 16;
                let enemy = fc.addComponent(Enemy);
                enemy.HP = enemy.maxHP;
                EnemyFactory.enemylist.push(fc);
                this.mainsp.addChild(fc);
                enemyforce -= Enemy.BattlePoint;
            }
        }
        clearEnemey() {
            for (let i = 0; i < EnemyFactory.enemylist.length; i++) {
                this.mainsp.removeChild(EnemyFactory.enemylist[i]);
                EnemyFactory.enemylist[i].destroy();
            }
            EnemyFactory.enemylist = [];
        }
    }

    class BulletFactory {
        constructor(battlesprite) {
            BulletFactory.mainsp = battlesprite;
            BulletFactory.bulletlist = [];
        }
        static initBullet(BulletScript, x, y, dirx, diry) {
            let bl = new Laya.Image(BulletScript.skin);
            let rot = 0;
            if (dirx == 0) {
                if (diry > 0) {
                    rot = 90;
                }
                else {
                    rot = 270;
                }
            }
            else {
                rot = Math.atan2(diry, dirx) * 180 / 3.1415926;
            }
            bl.rotation = rot;
            bl.x = x + 24 - BulletScript.width / 2;
            bl.y = y + 24 - BulletScript.height / 2;
            BulletFactory.bulletlist.push(bl);
            BulletFactory.mainsp.addChild(bl);
            bl.scale(BulletScript.scale, BulletScript.scale);
            let rigid = bl.addComponent(Laya.RigidBody);
            rigid.type = "dynamic";
            rigid.gravityScale = 0;
            rigid.setVelocity({ x: dirx * BulletScript.speed, y: diry * BulletScript.speed });
            let collider = bl.addComponent(Laya.BoxCollider);
            collider.width = BulletScript.width;
            collider.height = BulletScript.height;
            collider.isSensor = true;
            let bs = bl.addComponent(BulletScript);
        }
        static clearBullet() {
            for (let i = 0; i < BulletFactory.bulletlist.length; i++) {
                BulletFactory.mainsp.removeChild(BulletFactory.bulletlist[i]);
                BulletFactory.bulletlist[i].destroy();
            }
            BulletFactory.bulletlist = [];
        }
    }

    class PlayerArrow extends Laya.Script {
        constructor() {
            super(...arguments);
            this.damage = 1;
        }
        onTriggerEnter(other) {
            let player = other.owner.getComponent(Player);
            if (player) {
                console.log(true);
            }
            else {
                let owner = this.owner;
                BulletFactory.mainsp.removeChild(owner);
                this.enabled = false;
            }
        }
    }
    PlayerArrow.skin = "Bullet/arrow.png";
    PlayerArrow.scale = 2;
    PlayerArrow.width = 13;
    PlayerArrow.height = 5;
    PlayerArrow.speed = 5;

    class Player extends Character {
        constructor() {
            super(...arguments);
            this.attacktick = 0;
            this.attackInterval = 20;
            this.attackPre = 2;
            this.attackAft = 5;
        }
        onUpdate() {
            if (this.x == 0 && this.y == 0 && EnemyFactory.enemylist.length > 0) {
                this.attacktick++;
                if (this.action != CharacterAction.Attack) {
                    this.action = CharacterAction.Attack;
                    this.attacktick = 0;
                }
                if (this.attacktick < this.attackInterval) {
                    this.onAttackWait();
                }
                else if (this.attacktick < this.attackInterval + this.attackPre) {
                    this.onAttackPre();
                }
                else if (this.attacktick == this.attackInterval + this.attackPre) {
                    this.onAttackAft();
                    this.doShoot();
                }
                else if (this.attacktick < this.attackInterval + this.attackPre + this.attackAft) {
                    this.onAttackAft();
                }
                else {
                    this.attacktick = 0;
                }
            }
            else {
                this.action = CharacterAction.Walk;
            }
            this.doMove();
        }
        onAttackWait() {
            let enemyx = -1;
            let enemyy = -1;
            let mindist = 999999;
            let owner = this.owner;
            for (let i = 0; i < EnemyFactory.enemylist.length; i++) {
                let enemy = EnemyFactory.enemylist[i];
                let enemyHP = EnemyFactory.enemylist[i].getComponent(Character).HP;
                if (enemyHP > 0) {
                    let delx = enemy.x - owner.x;
                    let dely = enemy.y - owner.y;
                    let newdist = Math.sqrt(delx * delx + dely * dely);
                    if (newdist < mindist) {
                        enemyx = enemy.x;
                        enemyy = enemy.y;
                        mindist = newdist;
                    }
                }
            }
            let dirx = enemyx - owner.x;
            let diry = enemyy - owner.y;
            let mod = Math.sqrt(dirx * dirx + diry * diry);
            this.dirx = dirx / mod;
            this.diry = diry / mod;
            this.doTurnAround();
        }
        onAttackPre() {
            this.owner.value = Character.Values[4][this.directindex];
        }
        onAttackAft() {
            this.owner.value = Character.Values[5][this.directindex];
        }
        doShoot() {
            let owner = this.owner;
            BulletFactory.initBullet(PlayerArrow, owner.x, owner.y, this.dirx, this.diry);
        }
    }

    class BattleMaps {
    }
    BattleMaps.bm1 = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [3, 0, 0, 0, 3, 0, 0, 0, 0, 3],
        [3, 0, 3, 0, 0, 0, 0, 3, 0, 3],
        [3, 0, 0, 0, 0, 3, 0, 0, 0, 3],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];

    class BattleImage {
        constructor(battlesprite) {
            this.mainsp = battlesprite;
            this.tilePool = [];
            this.enemyFactory = new EnemyFactory(battlesprite);
            this.bulletFactory = new BulletFactory(battlesprite);
            for (let j = 0; j < 5; j++) {
                let tmppool = [];
                for (let i = 0; i < 10; i++) {
                    let tmptile = new Laya.FontClip("Battle/map1.png", "一八匕厂刀儿二几力人 入十又川寸大飞干工弓 广己口马门女山尸士巳 土兀夕小子贝比长车歹 斗厄方风父戈户火见斤");
                    let tmprigid = tmptile.addComponent(Laya.RigidBody);
                    tmprigid.type = "static";
                    tmprigid.gravityScale = 0;
                    let tmpcld = tmptile.addComponent(Laya.BoxCollider);
                    tmpcld.width = tmpcld.height = 96;
                    tmptile.x = 96 * i;
                    tmptile.y = 96 * j;
                    tmppool.push(tmptile);
                }
                this.tilePool.push(tmppool);
            }
        }
        initMap(regiontype, battlemap, enemyforce) {
            BattleMaps.currentBattleMap = battlemap;
            for (let j = 0; j < 5; j++) {
                for (let i = 0; i < 10; i++) {
                    if (battlemap[j][i] == 0) {
                        this.mainsp.removeChild(this.tilePool[j][i]);
                    }
                    else {
                        if (regiontype == RegionType.Grass) {
                            this.tilePool[j][i].value = BattleImage.grasstilename[battlemap[j][i]];
                            this.mainsp.addChild(this.tilePool[j][i]);
                        }
                    }
                }
            }
            this.enemyFactory.initEnemy(regiontype, enemyforce);
        }
    }
    BattleImage.grasstilename = ["", "匕", "八", "一"];

    class BattleScene extends Laya.Scene {
        createChildren() {
            super.createChildren();
            this.loadScene("BattleScene");
        }
        onAwake() {
            this.battleimagedeal = new BattleImage(this.battlesprite);
            this.battleimagedeal.initMap(RegionType.Grass, BattleMaps.bm1, 2);
            let playercontroller = this.player.getComponent(Player);
            playercontroller.HP = playercontroller.maxHP = 15;
            this.controller = new GameControl(playercontroller);
            console.log(this.player);
            this.addChild(this.controller);
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("scene/BattleScene.ts", BattleScene);
            reg("character/Character.ts", Character);
            reg("character/Player.ts", Player);
            reg("character/GrassEnemy1.ts", GrassEnemy1);
        }
    }
    GameConfig.width = 960;
    GameConfig.height = 640;
    GameConfig.scaleMode = "showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = true;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            let bs = new BattleScene();
            Laya.stage.addChild(bs);
        }
        onMapLoaded() {
            this.tMap.setViewPortPivotByScale(0, 0);
            this.tMap.scale = 2;
            console.log(this.tMap);
        }
    }
    new Main();

}());
