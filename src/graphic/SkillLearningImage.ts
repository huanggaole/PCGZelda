import Player from "../character/Player";
import BattleImage from "../map/BattleImage";
import BattleScene from "../scene/BattleScene";

export default class SkillLearningImage extends Laya.Image{
    static curetime = 0;
    static speedlvl = 0;
    static weaponlvl = 0;
    static lifelvl = 0;
    static weaponspeed = 0;
    static damagelvl = 0;

    static player;

    static curebtn:Laya.Button;
    static speedbtn:Laya.Button;
    static weaponbtn:Laya.Button;
    static lifebtn:Laya.Button;
    static weaponspeedbtn:Laya.Button;
    static damagebtn:Laya.Button;
    constructor(player:Player){
        super();
        SkillLearningImage.player = player;
        this.skin = ("comp/dialogue-bubble.png");
		this.width = 400;
		this.height = 200;
		this.sizeGrid = "20,20,20,20";
        this.centerX = 0;
        this.centerY = 0;
        this.zOrder = 1003;
        SkillLearningImage.curebtn = new Laya.Button("comp/cure.png","回复所有体力");
        SkillLearningImage.speedbtn = new Laya.Button("comp/cure.png","强化速度\vLv." + (SkillLearningImage.speedlvl + 1));
        SkillLearningImage.weaponbtn = new Laya.Button("comp/cure.png","强化武器\vLv." + (SkillLearningImage.weaponlvl + 1));
        SkillLearningImage.lifebtn = new Laya.Button("comp/cure.png","强化生命容量\vLv." + (SkillLearningImage.lifelvl + 1));
        SkillLearningImage.weaponspeedbtn = new Laya.Button("comp/cure.png","强化攻击频率\vLv." + (SkillLearningImage.weaponspeed + 1));
        SkillLearningImage.damagebtn = new Laya.Button("comp/cure.png","强化伤害\vLv." + (SkillLearningImage.damagelvl + 1));

        SkillLearningImage.curebtn.stateNum = 1;
        SkillLearningImage.speedbtn.stateNum = 1;
        SkillLearningImage.weaponbtn.stateNum = 1;
        SkillLearningImage.lifebtn.stateNum = 1;
        SkillLearningImage.weaponspeedbtn.stateNum = 1;
        SkillLearningImage.damagebtn.stateNum = 1;

        // this.curebtn.x = 10;
        SkillLearningImage.curebtn.y = 40;
        SkillLearningImage.speedbtn.y = 40;
        SkillLearningImage.weaponbtn.y = 40;
        SkillLearningImage.lifebtn.y = 40;
        SkillLearningImage.weaponspeedbtn.y = 40;
        SkillLearningImage.damagebtn.y = 40;

        this.addChild(SkillLearningImage.curebtn);
        this.addChild(SkillLearningImage.speedbtn);
        this.addChild(SkillLearningImage.weaponbtn);
        this.addChild(SkillLearningImage.lifebtn);
        this.addChild(SkillLearningImage.weaponspeedbtn);
        this.addChild(SkillLearningImage.damagebtn);
    }

    static initBtns(){
        let ups = [];
        while(ups.length < 3){
            let rnd = Math.floor(Math.random() * 6);
            if(ups.includes(rnd)){
                continue;
            }
            if(rnd == 2 && this.weaponlvl >= 3){
                continue;
            }
            if(rnd == 3 && this.lifelvl >= 3){
                continue;
            }
            ups.push(rnd);
        }
        SkillLearningImage.curebtn.visible = false;
        SkillLearningImage.speedbtn.visible = false;
        SkillLearningImage.weaponbtn.visible = false;
        SkillLearningImage.lifebtn.visible = false;
        SkillLearningImage.weaponspeedbtn.visible = false;
        SkillLearningImage.damagebtn.visible = false;

        SkillLearningImage.curebtn.on(Laya.Event.CLICK, SkillLearningImage, SkillLearningImage.onCure);
        SkillLearningImage.speedbtn.on(Laya.Event.CLICK, SkillLearningImage, SkillLearningImage.onSpeed);
        SkillLearningImage.weaponbtn.on(Laya.Event.CLICK, SkillLearningImage, SkillLearningImage.onWeapon);
        SkillLearningImage.lifebtn.on(Laya.Event.CLICK, SkillLearningImage, SkillLearningImage.onLife);
        SkillLearningImage.weaponspeedbtn.on(Laya.Event.CLICK, SkillLearningImage, SkillLearningImage.onWeaponspeed);
        SkillLearningImage.damagebtn.on(Laya.Event.CLICK, SkillLearningImage, SkillLearningImage.onDamage);

        for(let i = 0; i < 3; i++){
            let index = ups[i];
            if(index == 0){
                SkillLearningImage.curebtn.x = 120 * i + 10 * (i + 1);
                SkillLearningImage.curebtn.visible = true;
                SkillLearningImage.curebtn.label = "回复所有体力";
            }else if(index == 1){
                SkillLearningImage.speedbtn.x = 120 * i + 10 * (i + 1);
                SkillLearningImage.speedbtn.visible = true;
                SkillLearningImage.speedbtn.label = "强化速度\vLv." + (SkillLearningImage.speedlvl + 1);

            }else if(index == 2){
                SkillLearningImage.weaponbtn.x = 120 * i + 10 * (i + 1);
                SkillLearningImage.weaponbtn.visible = true;
                SkillLearningImage.weaponbtn.label = "强化武器\vLv." + (SkillLearningImage.weaponlvl + 1);

            }else if(index == 3){
                SkillLearningImage.lifebtn.x = 120 * i + 10 * (i + 1);
                SkillLearningImage.lifebtn.visible = true;
                SkillLearningImage.lifebtn.label = "强化生命容量\vLv." + (SkillLearningImage.lifelvl + 1);

            }else if(index == 4){
                SkillLearningImage.weaponspeedbtn.x = 120 * i + 10 * (i + 1);
                SkillLearningImage.weaponspeedbtn.visible = true;
                SkillLearningImage.weaponspeedbtn.label = "强化攻击频率\vLv." + (SkillLearningImage.weaponspeed + 1);

            }else if(index == 5){
                SkillLearningImage.damagebtn.x = 120 * i + 10 * (i + 1);
                SkillLearningImage.damagebtn.visible = true;
                SkillLearningImage.damagebtn.label = "强化伤害\vLv." + (SkillLearningImage.damagelvl + 1);

            }
        }
    }

    static onCure(){
        this.player.HP = this.player.maxHP;
        this.curetime++;
        this.onButton();
    }
    static onSpeed(){
        this.player.speed++;
        this.speedlvl++;
        this.onButton();
    }
    static onWeapon(){
        Player.weapontype++;
        this.weaponlvl++;
        this.onButton();
    }
    static onLife(){
        this.player.maxHP++;
        this.lifelvl++;
        this.onButton();
    }
    static onWeaponspeed(){
        this.player.attackInterval = Math.floor(this.player.attackInterval * 0.8);
        this.weaponspeed++;
        this.onButton();
    }
    static onDamage(){
        Player.attackdamage += 0.5;
        this.damagelvl++;
        this.onButton();
    }

    static onButton(){
        Laya.SoundManager.playSound("sound/succes.ogg");
        Player.Level++;
        Player.exp -= Player.maxExp;
        Player.maxExp = Math.floor(Player.maxExp * 1.3);
        BattleScene.Lv.text = "lv." + Player.Level + " exp/next:" + Player.exp + "/" + Player.maxExp;
        if(Player.maxExp > Player.exp){
            BattleScene.lvup_button.visible = false;
        }else{
            this.initBtns();
        }
        BattleScene.SkillImage.visible = false;
    }
}