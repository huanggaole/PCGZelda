import Character, { CharacterAction } from "./Character"
import EnemyFactory from "../map/EnemyFactory";
import BulletFactory from "../map/BulletFactory";
import { PlayerArrow } from "../bullet/PlayerArrow";
import BattleScene from "../scene/BattleScene";
import { NodeType } from "../script/Node";
import { PlayerArrow2 } from "../bullet/PlayerArrow2";
import { PlayerArrow3 } from "../bullet/PlayerArrow3";
export default class Player extends Character{
    static Level = 1;
    static exp = 0;
    static maxExp = 10;
    attacktick = 0;
    
    attackInterval = 20;
    attackPre = 2;
    attackAft = 5;

    static attackdamage = 0;
    static weapontype = 0;

    onUpdate(){
        if(this.HP <= 0 && this.hurtFrame == 0){
            this.HP = 12;
        }
        super.onUpdate();
        // 刷新HP的显示
        for(let i = 0; i < BattleScene.hearts.length; i++){
            if(this.maxHP / 4.0 <= i){
                BattleScene.hearts[i].visible = false;
            }else{
                BattleScene.hearts[i].visible = true;
                if(this.HP / 4.0 >= i + 1){
                    BattleScene.hearts[i].index = 0;
                }else if(this.HP / 4.0 < i){
                    BattleScene.hearts[i].index = 4;
                }else{
                    BattleScene.hearts[i].index = Math.round(4 - (this.HP / 4.0 - i) * 4);
                }
            }
        }
        if(this.HP <= 0 && this.hurtFrame == 0){
            Laya.SoundManager.playSound("game-over-2.ogg");
            alert("你失败了！要看广告后复活吗？");
        }
        if(this.x == 0 && this.y == 0){
            this.attacktick++;
            if(this.action != CharacterAction.Attack){
                this.action = CharacterAction.Attack;
                this.attacktick = 0;
            }
            if(this.attacktick < this.attackInterval){
                let res = this.onAttackWait();
                if(!res){
                    // EnemyFactory.clearEnemey();
                    // 如果当前地图是一张锁的地图
                    let tmpregion = BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX];
                    if(tmpregion.node.type == NodeType.k){
                        Laya.timer.once(500,this,()=>{
                            Laya.SoundManager.playSound("sound/alert.ogg");
                            alert("你获得了"+tmpregion.node.keyTo[0]+"号钥匙，"+tmpregion.node.keyTo[0]+"号关卡的守卫已经离开了！");
                        })
                        tmpregion.node.type = NodeType.t;
                        for(let i = 0; i<BattleScene.regionmap.length;i++){
                            for(let j = 0; j < BattleScene.regionmap[i].length;j++){
                                if(BattleScene.regionmap[i][j] && BattleScene.regionmap[i][j].node.index == tmpregion.node.keyTo[0]){
                                    BattleScene.regionmap[i][j].node.type = NodeType.t;
                                }
                            }
                        }
                    }
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
        Laya.SoundManager.playSound("sound/13.ogg");
        if(Player.weapontype == 0){
            BulletFactory.initBullet(PlayerArrow,owner.x, owner.y, this.dirx,this.diry);
        }else if(Player.weapontype == 1){
            BulletFactory.initBullet(PlayerArrow2,owner.x, owner.y, this.dirx,this.diry);
        }else{
            BulletFactory.initBullet(PlayerArrow3,owner.x, owner.y, this.dirx,this.diry);
        }
    }
}