import BattleScene from "./scene/BattleScene";
import Character from "./character/Character";
import Player from "./character/Player";
import GrassEnemy1 from "./character/GrassEnemy1";

/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=960;
    static height:number=640;
    static scaleMode:string="showall";
    static screenMode:string="none";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="test/TestScene.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("scene/BattleScene.ts",BattleScene);
        reg("character/Character.ts",Character);
        reg("character/Player.ts",Player);
        reg("character/GrassEnemy1.ts",GrassEnemy1);
        

    }
}
GameConfig.init();