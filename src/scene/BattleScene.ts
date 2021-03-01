import { GameControl } from "./GameControl";
import Player from "../character/Player";
import BattleImage from "../map/BattleImage";
import { RegionType } from "../script/Region";
import BattleMaps from "../map/BattleMaps";
export default class BattleScene extends Laya.Scene{
    controller:GameControl;
    initTile:Laya.FontClip;
    player:Laya.FontClip;

    battleimagedeal:BattleImage;
    battlesprite:Laya.Sprite;

    
    createChildren(){
        super.createChildren();
        this.loadScene("BattleScene");
        
    }
    onAwake(){
        this.battleimagedeal = new BattleImage(this.battlesprite);
        // 加载地图
        this.battleimagedeal.initMap(RegionType.Grass,BattleMaps.bm1,2);
        // 增加游标
        let playercontroller = this.player.getComponent(Player) as Player;
        playercontroller.HP = playercontroller.maxHP = 15;
        this.controller = new GameControl(playercontroller);
        console.log(this.player);
        this.addChild(this.controller);
    }
}