import Player from "../character/Player";
import BulletFactory from "../map/BulletFactory";
import Character from "../character/Character";

export class PlayerArrow3 extends Laya.Script{
    static skin = "Bullet/arrow3.png";
    static scale = 2;
    static width = 16;
    static height = 16;
    static speed = 5;
    damage = 1;
    onUpdate(){
        let owner = this.owner as Laya.Image;
        if(owner.x < 0 || owner.y < 0 || owner.x > 960 || owner.y > 480){
            this.removeOwner(owner);
        }
    }
    onTriggerEnter(other:any){
        let owner = this.owner as Laya.Image;
        if(this.owner && other.owner){
            let player = (other.owner as Laya.Node).getComponent(Player);
            if(player){
                // console.log(true);
            }else{
                let character = (other.owner as Laya.Node).getComponent(Character);
                if(character && !character.invincibleStatus){
                    character.hurtFrame = 20;
                    character.HP -= (this.damage + Player.attackdamage);
                    Laya.SoundManager.playSound("sound/kill.ogg");
                    this.removeOwner(owner);
                }else{
                    if(Player.weapontype == 3){
                        let rb = owner.getComponent(Laya.RigidBody) as Laya.RigidBody;
                        if(owner.y < other.owner.y || owner.y > other.owner.y + other.owner.height - 5){
                            // rb.linearVelocity.x *= 1;
                            rb.setVelocity({x:-rb.linearVelocity.x,y:rb.linearVelocity.y});
                        }else{
                            // rb.linearVelocity.y *= 1;
                            rb.setVelocity({x:rb.linearVelocity.x,y:-rb.linearVelocity.y});
                        }
                    }else{
                        this.removeOwner(owner);
                    }
                }
            }
        }
    }
    removeOwner(owner){
        let rg = owner.getComponent(Laya.RigidBody) as Laya.RigidBody;
        let bc = owner.getComponent(Laya.BoxCollider) as Laya.BoxCollider;

        if(rg){
            rg.enabled = false;
        }
        if(bc){
            bc.enabled = false;
        }
        if(bc){
            owner._destroyComponent(bc);
        }
        if(rg){
            owner._destroyComponent(rg);
        }
        (owner as Laya.Clip)._destroyAllComponent();
        BulletFactory.mainsp.removeChild(owner);
        Laya.Pool.recover('BulletType',owner);
    }
}