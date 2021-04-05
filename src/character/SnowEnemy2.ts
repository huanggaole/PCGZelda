import Character, { CharacterAction } from "./Character"
import Player from "./Player";
import BattleScene from "../scene/BattleScene"
import BulletFactory from "../map/BulletFactory";
import { BeanArrow } from "../bullet/BeanArrow";
import { PlayerArrow } from "../bullet/PlayerArrow";
export default class SnowEnemy2 extends Character{
    static BattlePoint = 3;
    static skinname = "Enemy/4.png";
    AItick = 0;
    maxHP = 5;
    damage = 1;

    onStart(){
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

    onUpdate(){
        super.onUpdate();
        this.AI();
    }

    addExp(){
        super.addExp();
        Player.exp += 5;
        BattleScene.Lv.text = "lv." + Player.Level + " exp/next:" + Player.exp + "/" + Player.maxExp;
    }

    doShoot(){
        let owner = this.owner as Laya.FontClip;
        BulletFactory.initBullet(BeanArrow,owner.x, owner.y, this.dirx,this.diry);
    }

    AI(){
        this.AItick++;
        if(this.action == CharacterAction.Attack){
            if(this.AItick % 30 == 0){
                this.dirx = (BattleScene.player.x - (this.owner as Laya.Clip).x);
                this.diry = (BattleScene.player.y - (this.owner as Laya.Clip).y);
                let mod = Math.sqrt(this.dirx * this.dirx + this.diry * this.diry);
                this.dirx /= mod;
                this.diry /= mod;
                this.doShoot();
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