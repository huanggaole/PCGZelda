import Graphic from "./Graphic";
import { NodeType } from "./Node";

export default class GraphOperations{
    static MatchRes:any[];
    static FindSubGraph(oriG:Graphic, subG:Graphic):any[]{
		oriG.countTypeNums();
        subG.countTypeNums();
		console.log("oriG");
		oriG.printGraphic();
		console.log("subG");
		subG.printGraphic();

		for(let i = 0; i < subG.nodes.length; i++){
			let subN = subG.nodes[i];
			subN.candidates = [];
			for(let j = 0; j < oriG.nodes.length; j++){
				let oriN = oriG.nodes[j];
				subN.ifcandidate(oriN);
			}
		}
		subG.printCandidates();

		// 组合所有可能的情况
		GraphOperations.MatchRes = [];
		let match = [];
		GraphOperations.countMatch(oriG, subG, 0, match);
        return GraphOperations.MatchRes;
	}
	
	static FindTs(oriG:Graphic):any[]{
		GraphOperations.MatchRes = [];
		for(let i = 0; i < oriG.nodes.length; i++){
			for(let j = 0; j < oriG.nodes[i].pointTo.length; j++){
				let tempT = oriG.nodes[oriG.nodes[i].pointTo[j]];
				if(tempT.type == NodeType.T){
					for(let k = 0; k < tempT.pointTo.length; k++){
						let match = [i,oriG.nodes[i].pointTo[j],tempT.pointTo[k]];
						GraphOperations.MatchRes.push(match);
					}
				}
			}
		}
		return GraphOperations.MatchRes;
	}

	static FindLs(oriG:Graphic):any[]{
		GraphOperations.MatchRes = [];
		for(let i = 0; i < oriG.nodes.length; i++){
			for(let j = 0; j < oriG.nodes[i].pointTo.length; j++){
				let tempN = oriG.nodes[oriG.nodes[i].pointTo[j]];
				for(let k = 0; k < tempN.pointTo.length; k++){
					let tempL = oriG.nodes[tempN.pointTo[k]];
					if(tempL.type == NodeType.l){
						let match = [i,oriG.nodes[i].pointTo[j],tempN.pointTo[k]];
						GraphOperations.MatchRes.push(match);
					}
				}

			}
		}
		return GraphOperations.MatchRes;
	}

    static countMatch(oriG:Graphic, subG:Graphic, index:number, match:any[]):boolean{
		if(index == subG.nodes.length){
			// console.log(match);
			// 如果当前组合满足匹配要求，则将该匹配添加至最终结果
			let subM = subG.getMatrix();
			let oriM = oriG.getSubMatrix(match);
			let ifaccept = true;
			for(let i = 0; i < subM.length; i++){
				if(subM[i] == 1 && oriM[i] == 0){
					ifaccept = false;
				}
			}
			if(ifaccept){
				GraphOperations.MatchRes.push(match);
			}
			return true;
		}

		if(subG.nodes[index].candidates.length == 0){
			return false
		}
		
		let newMatch = [];
		for(let i = 0; i < subG.nodes[index].candidates.length; i++){
			let candidate = subG.nodes[index].candidates[i];
			let tmpMatch = [];
			for(let j = 0; j < match.length; j++){
				tmpMatch.push(match[j]);
			}
			tmpMatch.push(candidate);
			if(!GraphOperations.countMatch(oriG, subG, index + 1, tmpMatch)){
				return false;
			}
		}
		return true;
	}

	static changeOriG(oriG:Graphic,subG:Graphic,newG:Graphic,match:any[]){
		oriG.clearSubMatrixEdges(match);
		oriG.addNewNodes(match,newG);
		oriG.addNewEdges(match,newG);
		oriG.countTypeNums();
		console.log("==========");		
		oriG.printGraphic();
		console.log("==========");
	}
}