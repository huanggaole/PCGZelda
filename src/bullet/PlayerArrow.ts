import Player from "../character/Player";
import BulletFactory from "../map/BulletFactory";

export class PlayerArrow extends Laya.Script{
    static skin = "Bullet/arrow.png";
    static scale = 2;
    static width = 13;
    static height = 5;
    static speed = 5;
    damage = 1;
    
    onTriggerEnter(other:any){
        let player = (other.owner as Laya.Node).getComponent(Player);
        if(player){
            console.log(true);
        }else{
            let owner = this.owner as Laya.Image;
            BulletFactory.mainsp.removeChild(owner);
            this.enabled = false;
        }
    }
}