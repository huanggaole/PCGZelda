import BattleScene from "../scene/BattleScene";
import BulletFactory from "../map/BulletFactory";
import EnemyFactory from "../map/EnemyFactory";
import Player from "./Player";
import SkillLearningImage from "../graphic/SkillLearningImage";

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

    hurtFrame = 0;
    invincibleStatus = false;
    

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
        if(!this.rigidbody){
            return;
        }
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
            this.dirx = this.x /= mod;
            this.diry = this.y /= mod;
        }
    }
    addExp(){
        if(Player.exp >= Player.maxExp){
            SkillLearningImage.initBtns();
            BattleScene.lvup_button.visible = true;
        }
    }
    onUpdate(){
        if(this.HP < 0){
            this.HP = 0;
        }
        if(this.HP <= 0 && this.hurtFrame == 0){
            this.addExp();
            (this.owner as Laya.FontClip).x = -100;
            (this.owner as Laya.FontClip).y = -100;
            this.removeOwner(this.owner);
        }
        if(this.hurtFrame > 0){
            const ColorFilter = Laya.ColorFilter;
            //由 20 个项目（排列成 4 x 5 矩阵）组成的数组，红色
            let redMat;
            if(this.HP > 0){
            redMat = [
                    1, 0, 0, 0, 0, // R
                    0, 1 - this.hurtFrame / 40, 0, 0, 0, // G
                    0, 0, 1 - this.hurtFrame / 40, 0, 0, // B
                    0, 0, 0, 1, 0  // A
                ];
            }else{
                redMat = [
                    1, 0, 0, 0, 0, // R
                    0, 0, 0, 0, 0, // G
                    0, 0, 0, 0, 0, // B
                    0, 0, 0, this.hurtFrame / 40, 0  // A
                ];
            }
            
            // 创建一个颜色滤镜对象,红色
            let redFilter = new ColorFilter(redMat);

            (this.owner as Laya.Clip).filters = [redFilter];

            this.hurtFrame --;
            this.invincibleStatus = true;
            // 修改血条
            let hpbar = this.owner.getChildByName("hpbar") as Laya.Image;
            if(hpbar){
                hpbar.graphics.drawRect(0, 0, 16, 4,"#000000");
                hpbar.graphics.drawRect(1, 1, 14 * this.HP / this.maxHP, 2, "#ff0000");
            }
        }else{
            (this.owner as Laya.Clip).filters = [];
            this.invincibleStatus = false;
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
        Laya.Pool.recover('EnemyType',owner);
        BulletFactory.mainsp.removeChild(owner);
    }
}