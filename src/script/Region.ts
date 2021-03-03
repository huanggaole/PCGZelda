import Node from "./Node"
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

        let targetMap = BattleMaps.bm1;
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