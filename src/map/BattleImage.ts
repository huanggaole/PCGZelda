import Region, { RegionType } from "../script/Region";
import BattleMaps from "./BattleMaps";
import EnemyFactory from "./EnemyFactory";
import BulletFactory from "./BulletFactory";
import BattleScene from "../scene/BattleScene";
import toDown from "../events/toDown";
import toUp from "../events/toUp";
import toLeft from "../events/toLeft";
import toRight from "../events/toRight";
import { NodeType } from "../script/Node";

export default class BattleImage{
    tilePool:Laya.FontClip[][];
    enemyFactory:EnemyFactory;
    bulletFactory:BulletFactory;
    mainsp:Laya.Sprite;
    
    ifcanMove = true;
    static grasstilename = ["","一","八","匕","厂","刀","儿","二"];
    static sandtilename = ["","入","十","又","川","寸","大","飞"];
    static deserttilename = ["","广","己","口","马","门","女","山"];
    static snowtilename = ["","土","兀","夕","小","子","贝","比"];
    static lavatilename = ["","斗","厄","方","风","父","戈","户"];
    
    constructor(battlesprite:Laya.Sprite){
        this.mainsp = battlesprite;
        this.tilePool = [];
    }

    initMap(regiontype:RegionType,battlemap:number[][],enemyforce:number){
        let tmpregion = BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX];
        this.enemyFactory = new EnemyFactory(this.mainsp);
        this.bulletFactory = new BulletFactory(this.mainsp);
        console.log(this.mainsp.numChildren);
        for(let i = 0; i < this.mainsp.numChildren; i++){
            let c = this.mainsp.getChildAt(i);
            let d = c.getComponent(toDown) as toDown;
            let u = c.getComponent(toUp) as toUp;
            let l = c.getComponent(toLeft) as toLeft;
            let r = c.getComponent(toRight) as toRight;
            
            if(d){
                toDown.keyindex = -1;
                (c as Laya.Sprite).visible = false;
                if(tmpregion.downConnect && BattleScene.regionmap[BattleScene.tmpMapY + 1][BattleScene.tmpMapX].node.type == NodeType.l){
                    toDown.keyindex = BattleScene.regionmap[BattleScene.tmpMapY + 1][BattleScene.tmpMapX].node.index;
                    (c as Laya.Sprite).visible = true;
                }else if(tmpregion.downConnect && BattleScene.regionmap[BattleScene.tmpMapY + 1][BattleScene.tmpMapX].node.type == NodeType.g){
                    toDown.keyindex = -2;
                }
            }
            if(u){
                toUp.keyindex = -1;
                (c as Laya.Sprite).visible = false;
                if(tmpregion.upConnect && BattleScene.regionmap[BattleScene.tmpMapY - 1][BattleScene.tmpMapX].node.type == NodeType.l){
                    toUp.keyindex = BattleScene.regionmap[BattleScene.tmpMapY - 1][BattleScene.tmpMapX].node.index;
                    (c as Laya.Sprite).visible = true;
                }else if(tmpregion.upConnect && BattleScene.regionmap[BattleScene.tmpMapY - 1][BattleScene.tmpMapX].node.type == NodeType.g){
                    toUp.keyindex = -2;
                }
            }
            if(l){
                toLeft.keyindex = -1;
                (c as Laya.Sprite).visible = false;
                if(tmpregion.leftConnect && BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX - 1].node.type == NodeType.l){
                    toLeft.keyindex = BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX - 1].node.index;
                    (c as Laya.Sprite).visible = true;
                }else if(tmpregion.leftConnect && BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX - 1].node.type == NodeType.g){
                    toLeft.keyindex = -2;
                }
            }
            if(r){
                toRight.keyindex = -1;
                (c as Laya.Sprite).visible = false;
                if(tmpregion.rightConnect && BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX + 1].node.type == NodeType.l){
                    toRight.keyindex = BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX + 1].node.index;
                    (c as Laya.Sprite).visible = true;
                }else if(tmpregion.rightConnect && BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX + 1].node.type == NodeType.g){
                    toRight.keyindex = -2;
                }
            }
            
            if(d){
                d.conce = true;
            }
            if(u){
                u.conce = true;
            }
            if(l){
                l.conce = true;
            }
            if(r){
                r.conce = true;
            }
        }
        for(let j = 0; j < 5; j++){
            let tmppool = [];
            for(let i = 0; i < 10; i++){
                let tmptile = Laya.Pool.getItemByClass('TileType',Laya.FontClip) as Laya.FontClip;
                tmptile.skin = "Battle/map1.png";
                tmptile.sheet = "一八匕厂刀儿二几力人 入十又川寸大飞干工弓 广己口马门女山尸士巳 土兀夕小子贝比长车歹 斗厄方风父戈户火见斤";

                let tmprigid = tmptile.getComponent(Laya.RigidBody);
                if(!tmprigid){
                    tmprigid = tmptile.addComponent(Laya.RigidBody);
                }
                
                tmprigid.type = "static";
                tmprigid.gravityScale = 0;
                let tmpcld = tmptile.getComponent(Laya.BoxCollider);
                if(!tmpcld){
                    tmpcld = tmptile.addComponent(Laya.BoxCollider);
                }
                
                tmpcld.width = tmpcld.height = 96;

                tmptile.x = 96 * i;
                tmptile.y = 96 * j;

                tmppool.push(tmptile);
            }
            this.tilePool.push(tmppool);
            this.ifcanMove = true;
        }
        BattleMaps.currentBattleMap = battlemap;
        // 将图块添加到地图上
        for(let j = 0; j < 5; j++){
            for(let i = 0; i < 10; i++){
                if(battlemap[j][i] == 0){
                    this.mainsp.removeChild(this.tilePool[j][i]);
                }else{
                    if(regiontype == RegionType.Grass){
                        this.mainsp.loadImage("Battle/GrassLand.png");
                        this.tilePool[j][i].value = BattleImage.grasstilename[battlemap[j][i]];
                        this.mainsp.addChild(this.tilePool[j][i]);
                    }
                    if(regiontype == RegionType.Desert){
                        this.mainsp.loadImage("Battle/SandLand.png");                        
                        this.tilePool[j][i].value = BattleImage.deserttilename[battlemap[j][i]];
                        this.mainsp.addChild(this.tilePool[j][i]);
                    }
                    if(regiontype == RegionType.Lava){
                        this.mainsp.loadImage("Battle/LavaLand.png");                        
                        this.tilePool[j][i].value = BattleImage.lavatilename[battlemap[j][i]];
                        this.mainsp.addChild(this.tilePool[j][i]);
                    }
                    if(regiontype == RegionType.Snow){
                        this.mainsp.loadImage("Battle/SnowLand.png");                        
                        this.tilePool[j][i].value = BattleImage.snowtilename[battlemap[j][i]];
                        this.mainsp.addChild(this.tilePool[j][i]);
                    }
                }
            }
        }
        // 将敌人添加到地图上
        if(tmpregion.node.type == NodeType.b){
            this.enemyFactory.initBoss(battlemap);
        }else if(tmpregion.node.type == NodeType.g){

        }else{
            this.enemyFactory.initEnemy(regiontype,enemyforce,battlemap);
        }
    }

    clearTiles(){
        for(let j = 0; j < 5; j++){
            for(let i = 0; i < 10; i++){
                this.mainsp.removeChild(this.tilePool[j][i]);

                let rg = this.tilePool[j][i].getComponent(Laya.RigidBody) as Laya.RigidBody;
                let bc = this.tilePool[j][i].getComponent(Laya.BoxCollider) as Laya.BoxCollider;                
                if(rg){
                    rg.enabled = false;
                }
                if(bc){
                    bc.enabled = false;
                }
                if(bc){
                    this.tilePool[j][i]._destroyComponent(bc);
                }
                if(rg){
                    this.tilePool[j][i]._destroyComponent(rg);
                }
                
                
                Laya.Pool.recover('TileType',this.tilePool[j][i]);
            }
        }
    }
}