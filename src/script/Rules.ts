import Graphic from "./Graphic";
import Node, {NodeType} from "./Node"
export default class Rules{
    static startpre:Graphic;
    static startnew:Graphic;
    static addpre:Graphic;
    static add1new:Graphic;
    static add2new:Graphic;
    static add3new:Graphic;
    static defineT1new:Graphic;
    static defineT2new:Graphic;
    static defineLnew:Graphic;
    
    static initRules(){
        this.startpre = new Graphic();
        this.startnew = new Graphic();
        this.addpre = new Graphic();
        this.add1new = new Graphic();
        this.add2new = new Graphic();
        this.add3new = new Graphic();
        this.defineT1new = new Graphic();
        this.defineT2new = new Graphic();
        this.defineLnew = new Graphic();

		this.startpre.nodes = [new Node(0,NodeType.S,[])];
		this.startnew.nodes = [new Node(0,NodeType.e,[1]),new Node(1,NodeType.T,[2]),new Node(2,NodeType.g,[])];
        this.addpre.nodes = [new Node(0,NodeType.T,[1]),new Node(1,NodeType.g,[])];
        this.add1new.nodes = [new Node(0,NodeType.b,[1]),new Node(1,NodeType.g,[])];
        this.add2new.nodes = [new Node(0,NodeType.T,[1]),new Node(1,NodeType.T,[2]),new Node(2,NodeType.g,[])];
        this.add3new.nodes = [new Node(0,NodeType.T,[1]),new Node(1,NodeType.T,[2]),new Node(2,NodeType.T,[3]),new Node(3,NodeType.g,[])];
    }

    static setDefineT1new(oriG:Graphic, match:any[]){
        this.defineT1new.nodes = [];
        let node0 = new Node(0, oriG.nodes[match[0]].type,[1]);
        let node1 = new Node(1, NodeType.t,[2]);
        let node2 = new Node(2, oriG.nodes[match[2]].type,[]);
        this.defineT1new.nodes = [node0, node1, node2];
    }

    static setDefineT2new(oriG:Graphic, match:any[]){
        this.defineT2new.nodes = [];
        let node0 = new Node(0, oriG.nodes[match[0]].type,[1,3]);
        let node1 = new Node(1, NodeType.l,[2]);
        let node2 = new Node(2, oriG.nodes[match[2]].type,[]);
        let node3 = new Node(3, NodeType.k,[],[1]);
        this.defineT2new.nodes = [node0, node1, node2, node3];
    }

    static setDefineLnew(oriG:Graphic, match:any[]){
        this.defineLnew.nodes = [];
        let node0 = new Node(0, oriG.nodes[match[0]].type,[1,2]);
        let node1 = new Node(1, oriG.nodes[match[1]].type,[]);
        let node2 = new Node(2, oriG.nodes[match[2]].type,[]);
        this.defineLnew.nodes = [node0, node1, node2];
    }
}