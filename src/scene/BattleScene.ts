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

    controller:GameControl;
    player:Laya.FontClip;

    static player;
    static battleimagedeal:BattleImage[];
    static battleindex = 0;
    battlesprite1:Laya.Sprite;
    battlesprite2:Laya.Sprite;

    static tmpMapX = 0;
    static tmpMapY = 0;

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
        playercontroller.HP = playercontroller.maxHP = 15;
        BattleScene.player = this.player;

        let MapImage = new SmallMapImage(BattleScene.regionmap);
		this.addChild(MapImage);

        this.controller = new GameControl(playercontroller);
        this.addChild(this.controller);
    }

    static switchMap(delx:number, dely:number){
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