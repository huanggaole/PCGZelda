import Character, { CharacterAction } from "./Character"
export default class Player extends Character{
    attacktick = 0;
    
    attackInterval = 10;
    attackPre = 2;
    attackAft = 5;

    onUpdate(){
        if(this.x == 0 && this.y == 0){
            this.attacktick++;
            if(this.action != CharacterAction.Attack){
                this.action = CharacterAction.Attack;
                this.attacktick = 0;
            }
            if(this.attacktick < this.attackInterval){
                this.onAttackWait();
            }else if(this.attacktick < this.attackInterval + this.attackPre){

            }else if(this.attacktick == this.attackInterval + this.attackPre){

            }else if(this.attacktick < this.attackInterval + this.attackPre + this.attackAft){

            }else{
                this.attacktick = 0;
            }

        }else{
            this.action = CharacterAction.Walk;
            this.doMove();
        }
    }

    onAttackWait(){
        // 判断当前离哪个敌人近，将射击方向修改为从主角到相应敌人的矢量。同时将角色的方向修改为对应方向

    }

    onAttackPre(){

    }

    onAttackAft(){

    }
}