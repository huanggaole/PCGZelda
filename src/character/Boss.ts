import Character, { CharacterAction } from "./Character"
import Player from "./Player";
import BattleScene from "../scene/BattleScene"
import BulletFactory from "../map/BulletFactory";
import { IceArrow } from "../bullet/IceArrow";
import { NodeType } from "../script/Node";
import toUp from "../events/toUp";
import toDown from "../events/toDown";
import toLeft from "../events/toLeft";
import toRight from "../events/toRight";

export default class SnowEnemy2 extends Character{
    static BattlePoint = 100;
    static skinname = "Enemy/8.png";
    AItick = 0;
    maxHP = 100;
    damage = 1;

    onStart(){
        this.x = 0;
        this.y = 0;
        this.speed = 3.0;
        this.frame = 0;
        this.AItick = 0;
        this.stepindex = 0;
        this.directindex = 0;
        this.action == CharacterAction.RandomWalk;
        this.rigidbody = this.owner.getComponent(Laya.RigidBody);
    }

    onUpdate(){
        super.onUpdate();
        if(this.HP <= 0){
            BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX].node.type = NodeType.e;
            toUp.keyindex = -1;
            toDown.keyindex = -1;
            toLeft.keyindex = -1;
            toRight.keyindex = -1;
        }
        this.AI();
    }

    addExp(){
        super.addExp();
        Player.exp += 0;
        BattleScene.Lv.text = "lv." + Player.Level + " exp/next:" + Player.exp + "/" + Player.maxExp;
    }

    doShoot(){
        let owner = this.owner as Laya.FontClip;
        BulletFactory.initBullet(IceArrow,owner.x, owner.y, this.dirx,this.diry);
    }

    AI(){
        this.AItick++;
        if(this.action == CharacterAction.Attack){
            // 确定招式
            let skillidx = Math.floor(Math.random() * 2);
            if(skillidx == 0){
                if(this.AItick == 30){
                    this.dirx = (BattleScene.player.x - (this.owner as Laya.Clip).x);
                    this.diry = (BattleScene.player.y - (this.owner as Laya.Clip).y);
                    let mod = Math.sqrt(this.dirx * this.dirx + this.diry * this.diry);
                    this.dirx /= mod;
                    this.diry /= mod;
                    let orix = this.dirx;
                    let oriy = this.diry;
                    for(let i = 0; i < 360; i+=30){
                        let alpha = Math.PI * i / 180;
                        this.dirx = orix * Math.cos(alpha) - oriy * Math.sin(alpha);
                        this.diry = orix * Math.sin(alpha) + oriy * Math.cos(alpha);
                        mod = Math.sqrt(this.dirx * this.dirx + this.diry * this.diry);
                        this.dirx /= mod;
                        this.diry /= mod;
                        this.doShoot();
                    }
                }
            }else if(skillidx == 1){
                this.dirx = (BattleScene.player.x - (this.owner as Laya.Clip).x);
                this.diry = (BattleScene.player.y - (this.owner as Laya.Clip).y);
                let mod = Math.sqrt(this.dirx * this.dirx + this.diry * this.diry);
                this.dirx /= mod;
                this.diry /= mod;
                let orix = this.dirx;
                let oriy = this.diry;
                for(let i = 0; i < 360; i+=30){
                    let alpha = Math.PI * i / 180;
                    this.dirx = orix * Math.cos(alpha) - oriy * Math.sin(alpha);
                    this.diry = orix * Math.sin(alpha) + oriy * Math.cos(alpha);
                    mod = Math.sqrt(this.dirx * this.dirx + this.diry * this.diry);
                    this.dirx /= mod;
                    this.diry /= mod;
                    if(this.AItick == (i / 10) * 3){
                        this.doTurnAround();
                        this.doShoot();
                    }
                }
            }
            
            if(this.AItick == 100){
                this.AItick = 0;
                this.action = CharacterAction.RandomWalk;
            }
            return;
        }

        if(this.AItick >= 100){
            this.onStopMove();
            this.AItick = 0;
            this.action = CharacterAction.Attack;
        }else{
            // 随机移动
            if(Math.random() < 0.05){
                this.onSetRandomWalk();
            }
        }

        this.doMove();
    }

    onTriggerEnter(other:any){
        if(this.owner && other.owner){
            let character = (other.owner as Laya.Node).getComponent(Player);
            if(character && !character.invincibleStatus){
                character.hurtFrame = 20;
                character.HP -= this.damage;
            }
        }
    }
}