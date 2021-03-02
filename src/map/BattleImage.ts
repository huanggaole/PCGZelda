import { RegionType } from "../script/Region";
import BattleMaps from "./BattleMaps";
import EnemyFactory from "./EnemyFactory";
import BulletFactory from "./BulletFactory";

export default class BattleImage{
    tilePool:Laya.FontClip[][];
    enemyFactory:EnemyFactory;
    bulletFactory:BulletFactory;
    mainsp:Laya.Sprite;
    static grasstilename = ["","匕","八","一"];
    constructor(battlesprite:Laya.Sprite){
        this.mainsp = battlesprite;
        this.tilePool = [];
        this.enemyFactory = new EnemyFactory(battlesprite);
        this.bulletFactory = new BulletFactory(battlesprite);
        for(let j = 0; j < 5; j++){
            let tmppool = [];
            for(let i = 0; i < 10; i++){
                let tmptile = new Laya.FontClip("Battle/map1.png","一八匕厂刀儿二几力人 入十又川寸大飞干工弓 广己口马门女山尸士巳 土兀夕小子贝比长车歹 斗厄方风父戈户火见斤");

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

    initMap(regiontype:RegionType,battlemap:number[][],enemyforce:number){
        BattleMaps.currentBattleMap = battlemap;
        // 将图块添加到地图上
        for(let j = 0; j < 5; j++){
            for(let i = 0; i < 10; i++){
                if(battlemap[j][i] == 0){
                    this.mainsp.removeChild(this.tilePool[j][i]);
                }else{
                    if(regiontype == RegionType.Grass){
                        this.tilePool[j][i].value = BattleImage.grasstilename[battlemap[j][i]];
                        this.mainsp.addChild(this.tilePool[j][i]);
                    }
                }
            }
        }
        // 将敌人添加到地图上
        this.enemyFactory.initEnemy(regiontype,enemyforce);
    }
}