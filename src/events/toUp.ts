import BattleScene from "../scene/BattleScene";
import Player from "../character/Player";

export default class toUp extends Laya.Script{
    conce = true;
    static keyindex = -1;
    onTriggerEnter(other){
        console.log("conce",this.conce);        
        if(other.owner.getComponent(Player) && this.conce){
            if(toUp.keyindex == -2){
                alert("囚禁公主的房间锁上了，必须打败魔王才能拿到钥匙！");
            }else if(toUp.keyindex == -1){
                BattleScene.tmpMapY -= 1;
                BattleScene.switchMap(0, 400);
                this.conce = false;    
                Laya.timer.once(500,this,()=>{this.conce = true;});
            }else{
                alert("想要通过这里继续前进，你必须想首先办法获得" + toUp.keyindex + "号钥匙证明自己的实力！");
            }        
        }
    }
}