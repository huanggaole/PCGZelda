import { GameControl } from "./GameControl";
import SmallMapImage from "../graphic/SmallMapImage";
import Player from "../character/Player";
import BattleImage from "../map/BattleImage";
import Region, { RegionType } from "../script/Region";
import BattleMaps from "../map/BattleMaps";
import { NodeType } from "../script/Node";
export default class BattleScene extends Laya.Scene{
    regionmap:Region[][];

    controller:GameControl;
    player:Laya.FontClip;

    battleimagedeal:BattleImage[];
    battleindex = 0;
    battlesprite1:Laya.Sprite;
    battlesprite2:Laya.Sprite;

    tmpMapX = 0;
    tmpMapY = 0;

    constructor(regionmap:Region[][]){
        super();
        this.regionmap = regionmap;
        for(let j = 0; j < regionmap.length; j++){
            for(let i = 0; i < regionmap[0].length; i++){
                if(regionmap[j][i] && regionmap[j][i].node.type == NodeType.e){
                    this.tmpMapX = i;
                    this.tmpMapY = j;
                }
            }
        }
    }
    createChildren(){
        super.createChildren();
        this.loadScene("BattleScene");
        
    }
    onAwake(){
        this.battleimagedeal = [];
        this.battleimagedeal.push(new BattleImage(this.battlesprite1));
        this.battleimagedeal.push(new BattleImage(this.battlesprite2));
        
        // 加载地图
        let tmpregion = this.regionmap[this.tmpMapY][this.tmpMapX];
        this.battleimagedeal[this.battleindex].initMap(tmpregion.regiontype,tmpregion.tileArray,2);
        this.battleimagedeal[this.battleindex].mainsp.visible = true;
        this.battleimagedeal[1 - this.battleindex].mainsp.visible = false;
        // 增加游标
        let playercontroller = this.player.getComponent(Player) as Player;
        playercontroller.HP = playercontroller.maxHP = 15;

        let MapImage = new SmallMapImage(this.regionmap);
		this.addChild(MapImage);

        this.controller = new GameControl(playercontroller);
        this.addChild(this.controller);
    }
}