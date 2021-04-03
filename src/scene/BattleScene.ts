import { GameControl } from "./GameControl";
import SmallMapImage from "../graphic/SmallMapImage";
import Player from "../character/Player";
import BattleImage from "../map/BattleImage";
import Region, { RegionType } from "../script/Region";
import BattleMaps from "../map/BattleMaps";
import { NodeType } from "../script/Node";
import EnemyFactory from "../map/EnemyFactory";
export default class BattleScene extends Laya.Scene{
    static regionmap:Region[][];
    static Lv;

    controller:GameControl;
    player:Laya.FontClip;
    map_button:Laya.Button;

    static player;
    static battleimagedeal:BattleImage[];
    static battleindex = 0;
    battlesprite1:Laya.Sprite;
    battlesprite2:Laya.Sprite;

    heart1:Laya.Clip;
    heart2:Laya.Clip;
    heart3:Laya.Clip;
    heart4:Laya.Clip;
    heart5:Laya.Clip;
    heart6:Laya.Clip;

    lv:Laya.Label;

    static hearts = [];

    static tmpMapX = 0;
    static tmpMapY = 0;

    static MapImage:SmallMapImage;

    constructor(regionmap:Region[][]){
        super();
        BattleScene.regionmap = regionmap;
        for(let j = 0; j < regionmap.length; j++){
            for(let i = 0; i < regionmap[0].length; i++){
                if(regionmap[j][i] && regionmap[j][i].node.type == NodeType.e){
                    BattleScene.tmpMapX = i;
                    BattleScene.tmpMapY = j;
                }
            }
        }
    }
    createChildren(){
        super.createChildren();
        this.loadScene("BattleScene");
        
    }
    onAwake(){
        BattleScene.Lv = this.lv;
        
        BattleScene.battleimagedeal = [];
        BattleScene.battleimagedeal.push(new BattleImage(this.battlesprite1));
        BattleScene.battleimagedeal.push(new BattleImage(this.battlesprite2));
        
        // 加载地图
        let tmpregion = BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX];
        BattleScene.battleimagedeal[BattleScene.battleindex].initMap(tmpregion.regiontype,tmpregion.tileArray, tmpregion.enmeyForce);
        BattleScene.battleimagedeal[BattleScene.battleindex].mainsp.visible = true;
        BattleScene.battleimagedeal[1 - BattleScene.battleindex].mainsp.visible = false;
        // 增加游标
        let playercontroller = this.player.getComponent(Player) as Player;
        
        playercontroller.maxHP = 12;
        playercontroller.HP = 12;

        BattleScene.player = this.player;

        BattleScene.MapImage = new SmallMapImage(BattleScene.regionmap);
        BattleScene.MapImage.visible = false;
        this.addChild(BattleScene.MapImage);
        BattleScene.MapImage.centerX = 0;
        BattleScene.MapImage.centerY = 0;
        this.map_button.on(Laya.Event.CLICK, BattleScene, ()=>{BattleScene.MapImage.redraw(BattleScene.tmpMapX,BattleScene.tmpMapY);BattleScene.MapImage.visible = !BattleScene.MapImage.visible;console.log("map");});

        this.controller = new GameControl(playercontroller);
        BattleScene.hearts = [];
        BattleScene.hearts.push(this.heart1);
        BattleScene.hearts.push(this.heart2);
        BattleScene.hearts.push(this.heart3);
        BattleScene.hearts.push(this.heart4);
        BattleScene.hearts.push(this.heart5);
        BattleScene.hearts.push(this.heart6);
        this.addChild(this.controller);       
    }

    static switchMap(delx:number, dely:number){
        BattleScene.MapImage.redraw(BattleScene.tmpMapX,BattleScene.tmpMapY);
        console.log(BattleScene.regionmap);
        // 加载地图
        let tmpregion = BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX];
        let preindex = BattleScene.battleindex;
        let nowindex = BattleScene.battleindex = 1 - BattleScene.battleindex;
        EnemyFactory.clearEnemey();
        BattleScene.battleimagedeal[preindex].clearTiles(); 
        BattleScene.battleimagedeal[preindex].mainsp.removeChild(BattleScene.player);
        // BattleScene.battleimagedeal[preindex].mainsp.visible = false;
        BattleScene.battleimagedeal[preindex].mainsp.x = -2000;

        BattleScene.battleimagedeal[nowindex].mainsp.x = 0;
        BattleScene.battleimagedeal[nowindex].initMap(tmpregion.regiontype,tmpregion.tileArray, tmpregion.enmeyForce);
        BattleScene.player.x  += delx;
        BattleScene.player.y  += dely;
        console.log(BattleScene.player);
        BattleScene.battleimagedeal[nowindex].mainsp.addChild(BattleScene.player);
        BattleScene.battleimagedeal[BattleScene.battleindex].mainsp.visible = true; 
    }
}