import BattleScene from "../scene/BattleScene";
import Player from "../character/Player";
export default class toUp extends Laya.Script{
    conce = true;
    onTriggerEnter(other){
        console.log("conce",this.conce);        
        if(other.owner.getComponent(Player) && this.conce){
            BattleScene.tmpMapY -= 1;
            BattleScene.switchMap(0, 400);
            this.conce = false;    
            Laya.timer.once(500,this,()=>{this.conce = true;});
                     
        }
    }
}