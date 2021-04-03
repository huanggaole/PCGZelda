import BattleScene from "../scene/BattleScene";
import Player from "../character/Player";

export default class toLeft extends Laya.Script{
    conce = true;
    static keyindex = -1;
    onTriggerEnter(other){
        console.log("conce",this.conce);        
        if(other.owner.getComponent(Player) && this.conce){
            if(toLeft.keyindex == -1){
                BattleScene.tmpMapX -= 1;
                BattleScene.switchMap(880,0);
                this.conce = false;   
                Laya.timer.once(500,this,()=>{this.conce = true;});
            }else{
                alert("想要通过这里继续前进，你必须想首先办法获得" + toLeft.keyindex + "号钥匙证明自己的实力！");
            }                
        }
    }
}