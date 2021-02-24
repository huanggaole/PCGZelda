import Graphic from "./Graphic";
import Node,{NodeType} from "./Node"
import GraphOperations from "./GraphOperations";
import Rules from "./Rules";
import Region, { RegionType } from "./Region";
export default class Map{

    static generateWorld(){
        Rules.initRules();
		let oriG = new Graphic();
		oriG.nodes=[new Node(0,NodeType.S,[])];

		// 开始规则 * 1
		let MatchRes = GraphOperations.FindSubGraph(oriG, Rules.startpre);
		// console.log(MatchRes);
		let match = MatchRes[0];
		GraphOperations.changeOriG(oriG, Rules.startpre, Rules.startnew, match);
		// 添加任务 * 6
		for(let i = 0; i < 12; i ++){
			let MatchRes = GraphOperations.FindSubGraph(oriG, Rules.addpre);
			// console.log(MatchRes);
			let match = MatchRes[Math.floor(Math.random() * MatchRes.length)];
			if(Math.random() < 0.5){
				GraphOperations.changeOriG(oriG, Rules.addpre, Rules.add2new, match);
			}else{
				GraphOperations.changeOriG(oriG, Rules.addpre, Rules.add3new, match);
			}
		}
		// 添加boss * 1
		MatchRes = GraphOperations.FindSubGraph(oriG, Rules.addpre);
		// console.log(MatchRes);
		match = MatchRes[Math.floor(Math.random() * MatchRes.length)];
		GraphOperations.changeOriG(oriG, Rules.addpre, Rules.add1new, match);
		oriG.countTypeNums();
		oriG.printGraphic();
		// 定义任务
		while(true){
			let MatchRes = GraphOperations.FindTs(oriG);
			if(MatchRes.length == 0){
				break;
			}
			// console.log(MatchRes);
			let match = MatchRes[Math.floor(Math.random() * MatchRes.length)];
			if(Math.random() < 0.5){
				Rules.setDefineT1new(oriG,match);
				GraphOperations.changeOriG(oriG, Rules.addpre, Rules.defineT1new, match);
			}else{
				Rules.setDefineT2new(oriG,match);				
				GraphOperations.changeOriG(oriG, Rules.addpre, Rules.defineT2new, match);
			}
		}
		// 移动锁 * 5
		for(let i = 0; i < 10; i++){
			let MatchRes = GraphOperations.FindLs(oriG);
			if(MatchRes.length == 0){
				break;
			}
			let match = MatchRes[Math.floor(Math.random() * MatchRes.length)];

			Rules.setDefineLnew(oriG,match);
			GraphOperations.changeOriG(oriG, Rules.addpre, Rules.defineLnew, match);

		}

        let map = Map.GenotoPheno(oriG);
        return map;
    }

    static setGrid(oriG:Graphic, index:number, map:any, size:number, gridindex:number,unoccupied:number[],rect:{minx,maxx,miny,maxy}):boolean{
        let res = true;
        map[gridindex] = index;
        let x = gridindex % (size);
        let y = Math.floor((gridindex - x) / (size));
        if (x < rect.minx){
            rect.minx = x;
        }
        if (x > rect.maxx){
            rect.maxx = x;
        }
        if (y < rect.miny){
            rect.miny = y
        }
        if (y > rect.maxy){
            rect.maxy = y;
        }
        if(x > 0 && map[y * size + x - 1] == -1 && unoccupied.indexOf(y * size + x - 1) == -1){
            unoccupied.push(y * size + x - 1);
        }
        if(x < size - 1 && map[y * size + x + 1] == -1 && unoccupied.indexOf(y * size + x + 1) == -1){
            unoccupied.push(y * size + x + 1);
        }
        if(y > 0 && map[(y - 1) * size + x] == -1 && unoccupied.indexOf((y - 1) * size + x) == -1){
            unoccupied.push((y - 1) * size + x);
        }
        if(y < size - 1 && map[(y + 1) * size + x] == -1 && unoccupied.indexOf((y + 1) * size + x) == -1){
            unoccupied.push((y + 1) * size + x);
        }
        if(oriG.nodes[index].pointTo.length > unoccupied.length){
            if(unoccupied.length == 0){
                return false;
            }
            let randomUindex = Math.floor(Math.random() * unoccupied.length);
            let newGridindex = unoccupied[randomUindex];
            unoccupied = unoccupied.filter(item => item!=newGridindex);
            res = res && this.setGrid(oriG, index, map, size, newGridindex, unoccupied, rect);
        }else{
            let forchild = [];
            for(let i = 0; i < oriG.nodes[index].pointTo.length; i++){
                let randomUindex = Math.floor(Math.random() * unoccupied.length);
                let newGridindex = unoccupied[randomUindex];
                forchild.push(newGridindex)
                unoccupied = unoccupied.filter(item => item!=newGridindex);
                map[newGridindex] = oriG.nodes[index].pointTo[i];
            }
            for(let i = 0; i < oriG.nodes[index].pointTo.length; i++){
                res = res && this.setGrid(oriG, oriG.nodes[index].pointTo[i], map, size, forchild[i], [], rect);                
            }
        }
        
        return res;
    }

    static GenotoPheno(oriG:Graphic){
        let size = Math.ceil(Math.sqrt(oriG.nodes.length)) * 2;
        let map = [];
        for(let j = 0; j < size; j++){
            for(let i = 0; i < size; i++){
                map.push(-1);
            }
        }
        let count = 0;
        while(true){
            let initindex = Math.floor(size / 2) * size + Math.floor(size / 2);
            let minx = initindex % size;
            let maxx = initindex % size;
            let miny = (initindex - minx) / size;
            let maxy = (initindex - maxx) / size;
            let rect =  {minx, maxx, miny, maxy};
            let res = this.setGrid(oriG, 0, map, size, initindex, [], rect);
            count ++;
            if(res){
                let width = rect.maxx - rect.minx + 1;
                let height = rect.maxy - rect.miny + 1;
                let tmpcol = [];
                for(let j = 0; j < height; j++){
                    let tmprow = [];
                    for(let i = 0; i < width; i++){
                        if(map[(rect.miny + j) * size + rect.minx + i] == -1){
                            tmprow.push(null);
                        }else{
                            let index = map[(rect.miny + j) * size + rect.minx + i];
                            let newregion = new Region(index);                            
                            tmprow.push(newregion);
                        }
                    }
                    tmpcol.push(tmprow);
                }
                map = tmpcol;
              
                for(let j = 0; j < height; j++){
                    for(let i = 0; i < width; i++){
                        if(map[j][i] != null){
                            let curmap = map[j][i] as Region;
                            let index = curmap.index;
                            // 找到相应节点连通的区域
                            curmap.node = oriG.nodes[index];
                            let pointto = oriG.nodes[index].pointTo;
                            if(curmap.node.PlaceinGrid.x == -1 && curmap.node.PlaceinGrid.y == -1){
                                curmap.node.PlaceinGrid.x = i;
                                curmap.node.PlaceinGrid.y = j;
                            }else{
                                curmap.node = new Node(curmap.node.index,NodeType.T,curmap.node.keyTo);
                                curmap.node.PlaceinGrid.x = i;
                                curmap.node.PlaceinGrid.y = j;
                            }
                            // 判断上侧是否连通
                            if(j > 0){
                                let tmpmap = map[(j - 1)][i]
                                if(tmpmap != null){
                                    let tmpindex = tmpmap.index;
                                    if(pointto.indexOf(tmpindex) > -1 || tmpindex == index){
                                        (curmap as Region).upConnect = true;
                                        (tmpmap as Region).downConnect = true;                               
                                    }
                                }
                            }
                            // 判断下侧是否连通
                            if(j < height - 1){
                                let tmpmap = map[(j + 1)][i]                            
                                if(tmpmap != null){
                                    let tmpindex = tmpmap.index;
                                    if(pointto.indexOf(tmpindex) > -1 || tmpindex == index){
                                        (curmap as Region).downConnect = true;
                                        (tmpmap as Region).upConnect = true;                                    
                                    }
                                }
                            }
                            // 判断左侧是否连通
                            if(i > 0){
                                let tmpmap = map[j][i - 1]                            
                                if(tmpmap != null){
                                    let tmpindex = tmpmap.index;
                                    if(pointto.indexOf(tmpindex) > -1 || tmpindex == index){
                                        (curmap as Region).leftConnect = true;
                                        (tmpmap as Region).rightConnect = true;                                    
                                    }
                                }
                            }
                            // 判断右侧是否连通
                            if(i < width - 1){
                                let tmpmap = map[j][i + 1]                            
                                if(tmpmap != null){
                                    let tmpindex = tmpmap.index;
                                    if(pointto.indexOf(tmpindex) > -1 || tmpindex == index){
                                        (curmap as Region).rightConnect = true;
                                        (tmpmap as Region).leftConnect = true;                                    
                                    }
                                }
                            }
                        }
                    }
                }

                // 设置地形

                this.setRegionType(map,oriG.nodes[0].PlaceinGrid.x,oriG.nodes[0].PlaceinGrid.y,RegionType.Grass);
                break;
            }
            if(count > 100){
                console.log("映射失败！");
                break;
            }
        }
        return map;
    }

    static setRegionType(map:any[],x:number,y:number,type:RegionType){
        let region = map[y][x] as Region
        if(region.regiontype != RegionType.Undefined){
            return;
        }
        if(region.node.type == NodeType.b || region.node.type == NodeType.g){
            type = RegionType.Lava;
        }
        region.regiontype = type;
        if(region.upConnect){
            let rnd = Math.random();
            let newtype = type;
            if(rnd < 0.1){
                newtype = RegionType.Desert;
            }else if(rnd < 0.2){
                newtype = RegionType.Grass;
            }else if(rnd < 0.3){
                newtype = RegionType.Snow;
            }
            this.setRegionType(map, x, y - 1, newtype);
        }
        if(region.downConnect){
            let rnd = Math.random();
            let newtype = type;
            if(rnd < 0.1){
                newtype = RegionType.Desert;
            }else if(rnd < 0.2){
                newtype = RegionType.Grass;
            }else if(rnd < 0.3){
                newtype = RegionType.Snow;
            }
            this.setRegionType(map, x, y + 1, newtype);
        }
        if(region.leftConnect){
            let rnd = Math.random();
            let newtype = type;
            if(rnd < 0.1){
                newtype = RegionType.Desert;
            }else if(rnd < 0.2){
                newtype = RegionType.Grass;
            }else if(rnd < 0.3){
                newtype = RegionType.Snow;
            }
            this.setRegionType(map, x - 1, y, newtype);
        }
        if(region.rightConnect){
            let rnd = Math.random();
            let newtype = type;
            if(rnd < 0.1){
                newtype = RegionType.Desert;
            }else if(rnd < 0.2){
                newtype = RegionType.Grass;
            }else if(rnd < 0.3){
                newtype = RegionType.Snow;
            }
            this.setRegionType(map, x + 1, y, newtype);
        }
    }
}