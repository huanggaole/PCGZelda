import { RegionType } from "../script/Region";
import GrassEnemy1 from "../character/GrassEnemy1";

export default class EnemyFactory{
    mainsp:Laya.Sprite;
    static enemylist:Laya.FontClip[];
    grassEnemies = [GrassEnemy1];
    constructor(battlesprite:Laya.Sprite){
        this.mainsp = battlesprite;
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
            let fc = new Laya.FontClip(Enemy.skinname,"一八匕厂 刀儿二几 力人入十 又川寸大");
            fc.scaleX = fc.scaleY = 3;
            fc.value = "一";
            fc.x = 96 + Math.random() * 96 * 8;
            fc.y = 96 + Math.random() * 96 * 3;
            let rigid = fc.addComponent(Laya.RigidBody) as Laya.RigidBody;
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
    clearEnemey(){
        for(let i = 0; i < EnemyFactory.enemylist.length; i++){
            this.mainsp.removeChild(EnemyFactory.enemylist[i]);
            EnemyFactory.enemylist[i].destroy();
        }
        EnemyFactory.enemylist = [];
    }
}