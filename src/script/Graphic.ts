import Node, { NodeType } from "./Node";
export default class Graphic{
    nodes:Node[];
    typename = [
        "S",
        "e",
        "t",
        "b",
        "g",
        "l",
        "k",
        "T",
        "Any"
    ]

    matrix:number[];
    countTypeNums(){
        for(let index = 0; index < this.nodes.length; index ++){
            let node = this.nodes[index];
            node.countTypeNum = [];
            for(let i = 0; i < this.typename.length; i++){
                node.countTypeNum.push(0);
            }
            for(let i = 0; i < node.pointTo.length; i++){
                node.countTypeNum[this.nodes[node.pointTo[i]].type]++;
            }
        }
    }
    printGraphic(){
        for(let i = 0; i < this.nodes.length; i++){
            let out = i + this.typename[this.nodes[i].type] + "->";
            for(let j = 0; j < this.nodes[i].pointTo.length; j++){
                let index = this.nodes[i].pointTo[j];
                out += index + this.typename[this.nodes[index].type] + ",";
            } 
            if(this.nodes[i].keyTo.length > 0){
                out += "keyto:";
                for(let j = 0; j < this.nodes[i].keyTo.length; j++){
                    let index = this.nodes[i].keyTo[j];
                    out += index + this.typename[this.nodes[index].type] + ",";
                } 
            }
            /*
            out += "[";
            for(let j = 0; j < this.typename.length; j++){
                out += this.nodes[i].countTypeNum[j] + " ";
            }
            out += "]"
            */
            console.log(out);
        }
    }
    printCandidates(){
        for(let i = 0; i < this.nodes.length; i++){
            console.log(this.nodes[i].candidates);
        }
    }

    getMatrix(){
        if(this.matrix == null){
            let matrix = [];
            for(let j = 0; j < this.nodes.length; j++){
                for(let i = 0; i < this.nodes.length; i++){
                    matrix.push(0);
                }
            }
            for(let j = 0; j < this.nodes.length; j++){
                for(let i = 0; i < this.nodes[j].pointTo.length; i++){
                    matrix[j * this.nodes.length + this.nodes[j].pointTo[i]] = 1;
                }
            }
            this.matrix = matrix;
        }
        return this.matrix;
    }

    getSubMatrix(indices:any[]){
        let matrix = [];
        for(let j = 0; j < indices.length; j++){
            for(let i = 0; i < indices.length; i++){
                matrix.push(0);
            }
        }
        for(let j = 0; j < indices.length; j++){
            for(let i = 0; i < this.nodes[indices[j]].pointTo.length; i++){
                let pt = this.nodes[indices[j]].pointTo[i];
                let newindex = indices.indexOf(pt);
                if(newindex > -1){
                    matrix[j * indices.length + newindex] = 1;
                }
            }
        }
        return matrix;
    }

    clearSubMatrixEdges(indices:any[]){
        for(let j = 0; j < indices.length; j++){
            for(let i = 0; i < this.nodes[indices[j]].pointTo.length; i++){
                let pt = this.nodes[indices[j]].pointTo[i];
                let newindex = indices.indexOf(pt);
                if(newindex > -1){
                    this.nodes[indices[j]].pointTo = this.nodes[indices[j]].pointTo.filter(item => item != pt);
                }
            }
        }
    }

    addNewNodes(indices:any[],newG:Graphic){
        while(newG.nodes.length > indices.length){
            let newnode = new Node(this.nodes.length,newG.nodes[indices.length].type,[]);
            this.nodes.push(newnode);
            indices.push(newnode.index);
        }
        for(let i = 0; i < newG.nodes.length; i++){
            this.nodes[indices[i]].type = newG.nodes[i].type;
        }
    }

    addNewEdges(indices:any[],newG:Graphic){
        for(let i = 0; i < newG.nodes.length; i++){
            for(let j = 0; j < newG.nodes[i].pointTo.length; j++){
                this.nodes[indices[i]].pointTo.push(indices[newG.nodes[i].pointTo[j]]);
            }
            if(this.nodes[indices[i]].type == NodeType.k){
                for(let j = 0; j < newG.nodes[i].keyTo.length; j++){
                    this.nodes[indices[i]].keyTo.push(indices[newG.nodes[i].keyTo[j]]);
                }
            }
        }
    }
}