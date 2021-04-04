import { RegionType } from "../script/Region";
import GrassEnemy1 from "../character/GrassEnemy1";
import SandEnemy1 from "../character/SandEnemy1";
import SnowEnemy1 from "../character/SnowEnemy1";
import LavaEnemy1 from "../character/LavaEnemy1";
import GrassEnemy2 from "../character/GrassEnemy2";

export default class EnemyFactory{
    static mainsp:Laya.Sprite;
    static enemylist:Laya.FontClip[];
    grassEnemies = [GrassEnemy1, GrassEnemy2];
    sandEnemies = [SandEnemy1];
    snowEnemies = [SnowEnemy1];
    lavaEnemies = [LavaEnemy1];
    
    constructor(battlesprite:Laya.Sprite){
        EnemyFactory.mainsp = battlesprite;
        EnemyFactory.enemylist = [];
    }

    initEnemy(regiontype:RegionType,enemyforce:number,battlemap:number[][]){
        let Enemies = [];
        if(regiontype == RegionType.Grass){
            Enemies = this.grassEnemies;
        }
        if(regiontype == RegionType.Desert){
            Enemies = this.sandEnemies;
        }
        if(regiontype == RegionType.Snow){
            Enemies = this.snowEnemies;
        }
        if(regiontype == RegionType.Lava){
            Enemies = this.lavaEnemies;
        }
        while(enemyforce > 0){
            let Enemy = Enemies[Math.floor(Math.random() * Enemies.length)];
            if(Enemy.BattlePoint > enemyforce){
                continue;
            }
            let fc = Laya.Pool.getItemByClass('EnemyType',Laya.FontClip) as Laya.FontClip;
            fc.skin = Enemy.skinname;
            fc.sheet = "一八匕厂 刀儿二几 力人入十 又川寸大";
            fc.scaleX = fc.scaleY = 3;
            fc.value = "一";
            let xindex = Math.floor(Math.random() * 8);
            let yindex = Math.floor(Math.random() * 3);
            while(true){
                if(battlemap[yindex + 1][xindex + 1] == 0){
                    break;
                }else{
                    xindex = Math.floor(Math.random() * 8);
                    yindex = Math.floor(Math.random() * 3);
                }
            }
            
            fc.x = 96 * (xindex + 1) + Math.floor(32 + Math.random() * 32);
            fc.y = 96 * (yindex + 1) + Math.floor(32 + Math.random() * 32);
            let rigid = fc.getComponent(Laya.RigidBody);
            if(!rigid){
                rigid = fc.addComponent(Laya.RigidBody) as Laya.RigidBody;
            }
            rigid.type = "dynamic";
            rigid.gravityScale = 0;
            rigid.allowRotation = false;
            let collider = fc.getComponent(Laya.BoxCollider);
            if(!collider){
                collider = fc.addComponent(Laya.BoxCollider);
            }
            collider.width = collider.height = 16;
            let enemy = fc.getComponent(Laya.Script);
            if(enemy){
               fc._destroyComponent(enemy); 
            }
            enemy = fc.addComponent(Enemy);
            enemy.HP = enemy.maxHP;
            // 为enemy增加血条绘制Image
            let hpbar = fc.getChildByName("hpbar") as Laya.Image;
            if(!hpbar){
                hpbar = new Laya.Image();
                hpbar.name = "hpbar";
                hpbar.y = -5;
                fc.addChild(hpbar);
            }
            hpbar.graphics.drawRect(0, 0, 16, 4,"#000000");
            hpbar.graphics.drawRect(1, 1, 14, 2, "#ff0000");
            EnemyFactory.enemylist.push(fc);
            EnemyFactory.mainsp.addChild(fc);
            enemyforce -= Enemy.BattlePoint;
        }
    }
    static clearEnemey(){
        for(let i = 0; i < EnemyFactory.enemylist.length; i++){
            Laya.Pool.recover('EnemyType',EnemyFactory.enemylist[i]);
            this.mainsp.removeChild(EnemyFactory.enemylist[i]);
        }
        EnemyFactory.enemylist = [];
    }
}