import { RegionType } from "../script/Region";
import GrassEnemy1 from "../character/GrassEnemy1";

export default class EnemyFactory{
    static mainsp:Laya.Sprite;
    static enemylist:Laya.FontClip[];
    grassEnemies = [GrassEnemy1];
    constructor(battlesprite:Laya.Sprite){
        EnemyFactory.mainsp = battlesprite;
        EnemyFactory.enemylist = [];
    }

    initEnemy(regiontype:RegionType,enemyforce:number){
        let Enemies = [];
        if(regiontype == RegionType.Grass){
            Enemies = this.grassEnemies;
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
            fc.x = 96 + Math.random() * 96 * 8;
            fc.y = 96 + Math.random() * 96 * 3;
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