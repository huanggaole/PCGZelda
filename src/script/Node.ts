export enum NodeType{
    S,
    e,
    t,
    b,
    g,
    l,
    k,
    T,
    Any
}

export default class Node{
    index:number;
    type:NodeType;
    pointTo:number[];
    keyTo:number[];

    countTypeNum:number[];

    candidates:number[];

    constructor(_index:number, _type:NodeType, _pointto:number[], _keyto = []){
        this.index = _index;
        this.type = _type;
        this.pointTo = _pointto;
        this.candidates = [];
        this.keyTo = _keyto;
    }

    ifcandidate(node:Node){   
        if(node.type == this.type){
            for(let i = 0; i < this.countTypeNum.length; i++){
                // console.log(this.countTypeNum[i] , node.countTypeNum[i],this.countTypeNum[i] > node.countTypeNum[i]);
                if(this.countTypeNum[i] > node.countTypeNum[i]){
                    return;
                }
            }
             this.candidates.push(node.index);
             
        }
        
    }
}