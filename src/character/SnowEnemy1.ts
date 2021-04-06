import Character, { CharacterAction } from "./Character"
import Player from "./Player";
import BattleScene from "../scene/BattleScene"
export default class SnowEnemy1 extends Character{
    static BattlePoint = 1;
    static skinname = "Enemy/7.png";
    AItick = 0;
    maxHP = 1;
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
        this.AI();
    }

    addExp(){
        Player.exp += 2;  
        BattleScene.Lv.text = "lv. " + Player.Level + " exp/next:" + Player.exp + "/" + Player.maxExp;
        super.addExp();
    }

    AI(){
        this.AItick++;
        if(this.action == CharacterAction.Attack){
            
            if(this.AItick == 100){
                this.AItick = 0;
                this.action = CharacterAction.RandomWalk;
            }
            return;
        }

        if(this.AItick >= 200){
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
                Laya.SoundManager.playSound("sound/12.ogg");
            }
        }
    }
}