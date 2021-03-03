import BattleScene from "../scene/BattleScene";
import Player from "../character/Player";

export default class toRight extends Laya.Script{
    conce = true;
    onTriggerEnter(other){
        console.log("conce",this.conce);        
        if(other.owner.getComponent(Player) && this.conce){
            BattleScene.tmpMapX += 1;
            BattleScene.switchMap(-880, 0);
            this.conce = false;            
            Laya.timer.once(500,this,()=>{this.conce = true;});              
        }
    }
}