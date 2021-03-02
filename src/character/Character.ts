export enum CharacterAction{
    None,
    Walk,
    RandomWalk,
    Attack
}
export default class Character extends Laya.Script{
    speed:number;
    frame:number;
    stepindex:number;
    directindex:number;

    x:number;
    y:number;
    dirx:number;
    diry:number;
    rigidbody:Laya.RigidBody;
    maxHP:number;
    HP:number;

    action:CharacterAction = CharacterAction.None;

    static Values = [["一","八","匕","厂"],["刀","儿","二","几"],["力","人","入","十"],["又","川","寸","大"],["飞","干","工","弓"],["广","己","口","马"],["门","女","山","尸"]];

    setDirection(_x,_y){
        this.x = _x;
        this.y = _y;
    }

    onStart(){
        this.x = 0;
        this.y = 0;
        this.speed = 3.0;
        this.frame = 0;
        this.stepindex = 0;
        this.directindex = 0;
        
        this.rigidbody = this.owner.getComponent(Laya.RigidBody);
    }

    doTurnAround(){
        // 确定朝向
        if(Math.abs(this.dirx) > Math.abs(this.diry)){
            if(this.dirx > 0){
                this.directindex = 3;
            }else{
                this.directindex = 2;
            }
        }else{
            if(this.diry > 0){
                this.directindex = 0;
            }else{
                this.directindex = 1;
            }
        }

        (this.owner as Laya.FontClip).value = Character.Values[0][this.directindex];
    }

    doMove(){
        this.rigidbody.setVelocity({x:this.x * this.speed,y:this.y * this.speed});
        if(this.x == 0 && this.y == 0){
            return;
        }
        this.dirx = this.x;
        this.diry = this.y;
        this.frame++;
        // 确定行走步数
        if(this.frame * this.speed >= 50){
            this.frame = 0;
            this.stepindex++;
            if(this.stepindex >= 4){
                this.stepindex = 0;
            }
        }
        // 确定朝向
        if(Math.abs(this.x) > Math.abs(this.y)){
            if(this.x > 0){
                this.directindex = 3;
            }else{
                this.directindex = 2;
            }
        }else{
            if(this.y > 0){
                this.directindex = 0;
            }else{
                this.directindex = 1;
            }
        }

        (this.owner as Laya.FontClip).value = Character.Values[this.stepindex][this.directindex];
    }

    onStopMove(){
        this.x = 0;
        this.y = 0;
    }

    onSetRandomWalk(){
        this.x = 0.5 - Math.random();
        this.y = 0.5 - Math.random();
        let mod = Math.sqrt(this.x * this.x + this.y * this.y);
        if(mod != 0){
            this.x /= mod;
            this.y /= mod;
        }
    }
    

}