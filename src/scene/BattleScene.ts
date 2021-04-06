import { GameControl } from "./GameControl";
import SmallMapImage from "../graphic/SmallMapImage";
import SkillLearningImage from "../graphic/SkillLearningImage";

import Player from "../character/Player";
import BattleImage from "../map/BattleImage";
import Region, { RegionType } from "../script/Region";
import BattleMaps from "../map/BattleMaps";
import { NodeType } from "../script/Node";
import EnemyFactory from "../map/EnemyFactory";
import BulletFactory from "../map/BulletFactory";
export default class BattleScene extends Laya.Scene{
    static regionmap:Region[][];
    static Lv;
    static lvup_button:Laya.Button;

    controller:GameControl;
    player:Laya.FontClip;
    princess:Laya.FontClip;
    map_button:Laya.Button;
    lvup:Laya.Button;

    static player;
    static princess;
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
    static SkillImage:SkillLearningImage;

    static lastRegionType;

    constructor(regionmap:Region[][]){
        super();
        BattleScene.regionmap = regionmap;
        for(let j = 0; j < regionmap.length; j++){
            for(let i = 0; i < regionmap[0].length; i++){
                if(regionmap[j][i] && regionmap[j][i].node.type == NodeType.e){
                    regionmap[j][i].tileArray[2][4] = 0;
                    regionmap[j][i].tileArray[2][5] = 0;
                    BattleScene.tmpMapX = i;
                    BattleScene.tmpMapY = j;
                }
                if(regionmap[j][i] && (regionmap[j][i].node.type == NodeType.b || regionmap[j][i].node.type == NodeType.g)){
                    regionmap[j][i].tileArray[2][4] = 0;
                    regionmap[j][i].tileArray[2][5] = 0;
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
        BattleScene.lastRegionType = tmpregion.regiontype;
        
        BattleScene.battleimagedeal[BattleScene.battleindex].initMap(tmpregion.regiontype,tmpregion.tileArray, tmpregion.enmeyForce);
        BattleScene.battleimagedeal[BattleScene.battleindex].mainsp.visible = true;
        BattleScene.battleimagedeal[1 - BattleScene.battleindex].mainsp.visible = false;
        // 增加游标
        let playercontroller = this.player.getComponent(Player) as Player;
        
        playercontroller.maxHP = 12;
        playercontroller.HP = 12;

        BattleScene.player = this.player;
        BattleScene.princess = this.princess;
        BattleScene.lvup_button = this.lvup;

        BattleScene.MapImage = new SmallMapImage(BattleScene.regionmap);
        BattleScene.SkillImage = new SkillLearningImage(this.player.getComponent(Player));
        BattleScene.MapImage.visible = false;
        BattleScene.SkillImage.visible = false;
        this.addChild(BattleScene.MapImage);
        

        BattleScene.MapImage.centerX = 0;
        BattleScene.MapImage.centerY = 0;
        this.map_button.on(Laya.Event.CLICK, BattleScene, ()=>{Laya.SoundManager.playSound("sound/menu-2.ogg");BattleScene.MapImage.redraw(BattleScene.tmpMapX,BattleScene.tmpMapY);BattleScene.MapImage.visible = !BattleScene.MapImage.visible;console.log("map");});
        this.lvup.on(Laya.Event.CLICK, BattleScene, ()=>{Laya.SoundManager.playSound("sound/menu-1.ogg");BattleScene.SkillImage.visible = !BattleScene.SkillImage.visible;});

        this.controller = new GameControl(playercontroller);
        BattleScene.hearts = [];
        BattleScene.hearts.push(this.heart1);
        BattleScene.hearts.push(this.heart2);
        BattleScene.hearts.push(this.heart3);
        BattleScene.hearts.push(this.heart4);
        BattleScene.hearts.push(this.heart5);
        BattleScene.hearts.push(this.heart6);
        this.addChild(this.controller);
        this.addChild(BattleScene.SkillImage);
        Laya.SoundManager.playMusic("music/theme-5.ogg",0);
    }

    static switchMap(delx:number, dely:number){
        BattleScene.MapImage.redraw(BattleScene.tmpMapX,BattleScene.tmpMapY);
        console.log(BattleScene.regionmap);
        // 加载地图
        
        let tmpregion = BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX];
        if(this.lastRegionType != tmpregion.regiontype){
            if(tmpregion.regiontype == RegionType.Grass){
                Laya.SoundManager.playMusic("music/theme-5.ogg",0);
            }
            else if(tmpregion.regiontype == RegionType.Desert){
                Laya.SoundManager.playMusic("music/theme-6.ogg",0);
            }
            else if(tmpregion.regiontype == RegionType.Snow){
                Laya.SoundManager.playMusic("music/theme-7.ogg",0);
            }else{
                Laya.SoundManager.playMusic("music/theme-2.ogg",0);
            }
        }
        this.lastRegionType = tmpregion.regiontype;
        let preindex = BattleScene.battleindex;
        let nowindex = BattleScene.battleindex = 1 - BattleScene.battleindex;
        EnemyFactory.clearEnemey();
        BulletFactory.clearBullet();
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

        if(tmpregion.node.type == NodeType.g){
            this.princess.visible = true;
            Laya.SoundManager.playMusic("music/theme-18.ogg",0);
            Laya.timer.once(500,this,
                ()=>{
                    Laya.SoundManager.playSound("sound/succes-3.ogg");
                    alert("恭喜你！成功救出了公主！");
                    alert("本游戏为字节跳动第二届EMagic Jam作品");
                    alert("作者：黄高乐 huanggaole@bytedance.com");
                    alert("感谢您的试玩～");
                    alert("点击确定重新开始游戏。");
                    location.reload();
                })
        }
    }
}