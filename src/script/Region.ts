import Node, { NodeType } from "./Node"
import BattleMaps from "../map/BattleMaps";
export enum Direction{
    None,
    UP,
    Down,
    Left,
    Right
}
export enum RegionType{
    Undefined,
    Grass,
    Desert,
    Snow,
    Lava
}

export default class Region{
    public index;
    public upConnect:boolean;
    public downConnect:boolean;
    public leftConnect:boolean;
    public rightConnect:boolean;
    public node:Node;
    public regiontype:RegionType;

    // 地图数组
    public tileArray:number[][];
    // 敌人战斗力
    public enmeyForce:number;
    constructor(_index:number){
        this.index = _index;
        this.upConnect = false;
        this.downConnect = false;
        this.leftConnect = false;
        this.rightConnect = false;
        this.regiontype = RegionType.Undefined;

        let rndIndex = Math.floor(Math.random() * 6);
        let targetMap;
        if(rndIndex == 0){
            targetMap = BattleMaps.bm0;
        }else if(rndIndex == 1){
            targetMap = BattleMaps.bm1;
        }else if(rndIndex == 2){
            targetMap = BattleMaps.bm2;
        }else if(rndIndex == 3){
            targetMap = BattleMaps.bm3;
        }else if(rndIndex == 4){
            targetMap = BattleMaps.bm4;
        }else if(rndIndex == 5){
            targetMap = BattleMaps.bm5;
        }
        this.tileArray = [];
        for(let j = 0; j < targetMap.length; j++){
            let tmprow = [];
            for(let i = 0; i < targetMap[0].length; i++){
                tmprow.push(targetMap[j][i]);
            }
            this.tileArray.push(tmprow);
        }

        this.enmeyForce = 2;

    }
}