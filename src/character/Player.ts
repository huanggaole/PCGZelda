import Character, { CharacterAction } from "./Character"
import EnemyFactory from "../map/EnemyFactory";
import BulletFactory from "../map/BulletFactory";
import { PlayerArrow } from "../bullet/PlayerArrow";
export default class Player extends Character{
    attacktick = 0;
    
    attackInterval = 20;
    attackPre = 2;
    attackAft = 5;

    onUpdate(){
        super.onUpdate();        
        if(this.x == 0 && this.y == 0){
            this.attacktick++;
            if(this.action != CharacterAction.Attack){
                this.action = CharacterAction.Attack;
                this.attacktick = 0;
            }
            if(this.attacktick < this.attackInterval){
                let res = this.onAttackWait();
                if(!res){
                    EnemyFactory.clearEnemey();
                    this.attacktick--;
                }
            }else if(this.attacktick < this.attackInterval + this.attackPre){
                this.onAttackPre();
            }else if(this.attacktick == this.attackInterval + this.attackPre){
                this.onAttackAft();
                this.doShoot();
            }else if(this.attacktick < this.attackInterval + this.attackPre + this.attackAft){
                this.onAttackAft();
            }else{
                this.attacktick = 0;
            }

        }else{
            this.action = CharacterAction.Walk;
        }
        this.doMove();
    }

    onAttackWait():boolean{
        // 判断当前离哪个敌人近，将射击方向修改为从主角到相应敌人的矢量。同时将角色的方向修改为对应方向
        let index = -1;
        let enemyx = -1;
        let enemyy = -1;
        let mindist = 999999;
        let owner = this.owner as Laya.FontClip;
        for(let i = 0; i < EnemyFactory.enemylist.length; i++){
            let enemy = EnemyFactory.enemylist[i];
            let enemyHP = (EnemyFactory.enemylist[i].getComponent(Character) as Character).HP;
            if(enemyHP > 0){
                let delx = enemy.x - owner.x;
                let dely = enemy.y - owner.y;
                let newdist = Math.sqrt(delx * delx + dely * dely);
                if(newdist < mindist){
                    index = i;
                    enemyx = enemy.x;
                    enemyy = enemy.y;
                    mindist = newdist;
                }
            }
        }
        if(index == -1){
            return false;
        }
        let dirx = enemyx - owner.x;
        let diry = enemyy - owner.y;
        let mod = Math.sqrt(dirx * dirx + diry * diry);
        this.dirx = dirx / mod;
        this.diry = diry / mod;
        this.doTurnAround();
        return true;
    }

    onAttackPre(){
        (this.owner as Laya.FontClip).value = Character.Values[4][this.directindex];
    }

    onAttackAft(){
        (this.owner as Laya.FontClip).value = Character.Values[5][this.directindex];
    }

    doShoot(){
        let owner = this.owner as Laya.FontClip;
        BulletFactory.initBullet(PlayerArrow,owner.x, owner.y, this.dirx,this.diry);
    }
}