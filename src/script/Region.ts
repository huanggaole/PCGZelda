import Node from "./Node"
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

    constructor(_index:number){
        this.index = _index;
        this.upConnect = false;
        this.downConnect = false;
        this.leftConnect = false;
        this.rightConnect = false;
        this.regiontype = RegionType.Undefined;
    }
}