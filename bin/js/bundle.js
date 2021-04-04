(function () {
    'use strict';

    var NodeType;
    (function (NodeType) {
        NodeType[NodeType["S"] = 0] = "S";
        NodeType[NodeType["e"] = 1] = "e";
        NodeType[NodeType["t"] = 2] = "t";
        NodeType[NodeType["b"] = 3] = "b";
        NodeType[NodeType["g"] = 4] = "g";
        NodeType[NodeType["l"] = 5] = "l";
        NodeType[NodeType["k"] = 6] = "k";
        NodeType[NodeType["T"] = 7] = "T";
        NodeType[NodeType["Any"] = 8] = "Any";
    })(NodeType || (NodeType = {}));
    class Node {
        constructor(_index, _type, _pointto, _keyto = []) {
            this.index = _index;
            this.type = _type;
            this.pointTo = _pointto;
            this.candidates = [];
            this.keyTo = _keyto;
            let x = -1;
            let y = -1;
            this.PlaceinGrid = { x, y };
        }
        ifcandidate(node) {
            if (node.type == this.type) {
                for (let i = 0; i < this.countTypeNum.length; i++) {
                    if (this.countTypeNum[i] > node.countTypeNum[i]) {
                        return;
                    }
                }
                this.candidates.push(node.index);
            }
        }
    }

    class Graphic {
        constructor() {
            this.typename = [
                "S",
                "e",
                "t",
                "b",
                "g",
                "l",
                "k",
                "T",
                "Any"
            ];
        }
        countTypeNums() {
            for (let index = 0; index < this.nodes.length; index++) {
                let node = this.nodes[index];
                node.countTypeNum = [];
                for (let i = 0; i < this.typename.length; i++) {
                    node.countTypeNum.push(0);
                }
                for (let i = 0; i < node.pointTo.length; i++) {
                    node.countTypeNum[this.nodes[node.pointTo[i]].type]++;
                }
            }
        }
        printGraphic() {
            for (let i = 0; i < this.nodes.length; i++) {
                let out = i + this.typename[this.nodes[i].type] + "->";
                for (let j = 0; j < this.nodes[i].pointTo.length; j++) {
                    let index = this.nodes[i].pointTo[j];
                    out += index + this.typename[this.nodes[index].type] + ",";
                }
                if (this.nodes[i].keyTo.length > 0) {
                    out += "keyto:";
                    for (let j = 0; j < this.nodes[i].keyTo.length; j++) {
                        let index = this.nodes[i].keyTo[j];
                        out += index + this.typename[this.nodes[index].type] + ",";
                    }
                }
                console.log(out);
            }
        }
        printCandidates() {
            for (let i = 0; i < this.nodes.length; i++) {
                console.log(this.nodes[i].candidates);
            }
        }
        getMatrix() {
            if (this.matrix == null) {
                let matrix = [];
                for (let j = 0; j < this.nodes.length; j++) {
                    for (let i = 0; i < this.nodes.length; i++) {
                        matrix.push(0);
                    }
                }
                for (let j = 0; j < this.nodes.length; j++) {
                    for (let i = 0; i < this.nodes[j].pointTo.length; i++) {
                        matrix[j * this.nodes.length + this.nodes[j].pointTo[i]] = 1;
                    }
                }
                this.matrix = matrix;
            }
            return this.matrix;
        }
        getSubMatrix(indices) {
            let matrix = [];
            for (let j = 0; j < indices.length; j++) {
                for (let i = 0; i < indices.length; i++) {
                    matrix.push(0);
                }
            }
            for (let j = 0; j < indices.length; j++) {
                for (let i = 0; i < this.nodes[indices[j]].pointTo.length; i++) {
                    let pt = this.nodes[indices[j]].pointTo[i];
                    let newindex = indices.indexOf(pt);
                    if (newindex > -1) {
                        matrix[j * indices.length + newindex] = 1;
                    }
                }
            }
            return matrix;
        }
        clearSubMatrixEdges(indices) {
            for (let j = 0; j < indices.length; j++) {
                for (let i = 0; i < this.nodes[indices[j]].pointTo.length; i++) {
                    let pt = this.nodes[indices[j]].pointTo[i];
                    let newindex = indices.indexOf(pt);
                    if (newindex > -1) {
                        this.nodes[indices[j]].pointTo = this.nodes[indices[j]].pointTo.filter(item => item != pt);
                    }
                }
            }
        }
        addNewNodes(indices, newG) {
            while (newG.nodes.length > indices.length) {
                let newnode = new Node(this.nodes.length, newG.nodes[indices.length].type, []);
                this.nodes.push(newnode);
                indices.push(newnode.index);
            }
            for (let i = 0; i < newG.nodes.length; i++) {
                this.nodes[indices[i]].type = newG.nodes[i].type;
            }
        }
        addNewEdges(indices, newG) {
            for (let i = 0; i < newG.nodes.length; i++) {
                for (let j = 0; j < newG.nodes[i].pointTo.length; j++) {
                    this.nodes[indices[i]].pointTo.push(indices[newG.nodes[i].pointTo[j]]);
                }
                if (this.nodes[indices[i]].type == NodeType.k) {
                    for (let j = 0; j < newG.nodes[i].keyTo.length; j++) {
                        this.nodes[indices[i]].keyTo.push(indices[newG.nodes[i].keyTo[j]]);
                    }
                }
            }
        }
    }

    class GraphOperations {
        static FindSubGraph(oriG, subG) {
            oriG.countTypeNums();
            subG.countTypeNums();
            console.log("oriG");
            oriG.printGraphic();
            console.log("subG");
            subG.printGraphic();
            for (let i = 0; i < subG.nodes.length; i++) {
                let subN = subG.nodes[i];
                subN.candidates = [];
                for (let j = 0; j < oriG.nodes.length; j++) {
                    let oriN = oriG.nodes[j];
                    subN.ifcandidate(oriN);
                }
            }
            subG.printCandidates();
            GraphOperations.MatchRes = [];
            let match = [];
            GraphOperations.countMatch(oriG, subG, 0, match);
            return GraphOperations.MatchRes;
        }
        static FindTs(oriG) {
            GraphOperations.MatchRes = [];
            for (let i = 0; i < oriG.nodes.length; i++) {
                for (let j = 0; j < oriG.nodes[i].pointTo.length; j++) {
                    let tempT = oriG.nodes[oriG.nodes[i].pointTo[j]];
                    if (tempT.type == NodeType.T) {
                        for (let k = 0; k < tempT.pointTo.length; k++) {
                            let match = [i, oriG.nodes[i].pointTo[j], tempT.pointTo[k]];
                            GraphOperations.MatchRes.push(match);
                        }
                    }
                }
            }
            return GraphOperations.MatchRes;
        }
        static FindLs(oriG) {
            GraphOperations.MatchRes = [];
            for (let i = 0; i < oriG.nodes.length; i++) {
                for (let j = 0; j < oriG.nodes[i].pointTo.length; j++) {
                    let tempN = oriG.nodes[oriG.nodes[i].pointTo[j]];
                    for (let k = 0; k < tempN.pointTo.length; k++) {
                        let tempL = oriG.nodes[tempN.pointTo[k]];
                        if (tempL.type == NodeType.l) {
                            let match = [i, oriG.nodes[i].pointTo[j], tempN.pointTo[k]];
                            GraphOperations.MatchRes.push(match);
                        }
                    }
                }
            }
            return GraphOperations.MatchRes;
        }
        static countMatch(oriG, subG, index, match) {
            if (index == subG.nodes.length) {
                let subM = subG.getMatrix();
                let oriM = oriG.getSubMatrix(match);
                let ifaccept = true;
                for (let i = 0; i < subM.length; i++) {
                    if (subM[i] == 1 && oriM[i] == 0) {
                        ifaccept = false;
                    }
                }
                if (ifaccept) {
                    GraphOperations.MatchRes.push(match);
                }
                return true;
            }
            if (subG.nodes[index].candidates.length == 0) {
                return false;
            }
            let newMatch = [];
            for (let i = 0; i < subG.nodes[index].candidates.length; i++) {
                let candidate = subG.nodes[index].candidates[i];
                let tmpMatch = [];
                for (let j = 0; j < match.length; j++) {
                    tmpMatch.push(match[j]);
                }
                tmpMatch.push(candidate);
                if (!GraphOperations.countMatch(oriG, subG, index + 1, tmpMatch)) {
                    return false;
                }
            }
            return true;
        }
        static changeOriG(oriG, subG, newG, match) {
            oriG.clearSubMatrixEdges(match);
            oriG.addNewNodes(match, newG);
            oriG.addNewEdges(match, newG);
            oriG.countTypeNums();
            console.log("==========");
            oriG.printGraphic();
            console.log("==========");
        }
    }

    class Rules {
        static initRules() {
            this.startpre = new Graphic();
            this.startnew = new Graphic();
            this.addpre = new Graphic();
            this.add1new = new Graphic();
            this.add2new = new Graphic();
            this.add3new = new Graphic();
            this.defineT1new = new Graphic();
            this.defineT2new = new Graphic();
            this.defineLnew = new Graphic();
            this.startpre.nodes = [new Node(0, NodeType.S, [])];
            this.startnew.nodes = [new Node(0, NodeType.e, [1]), new Node(1, NodeType.T, [2]), new Node(2, NodeType.g, [])];
            this.addpre.nodes = [new Node(0, NodeType.T, [1]), new Node(1, NodeType.g, [])];
            this.add1new.nodes = [new Node(0, NodeType.b, [1]), new Node(1, NodeType.g, [])];
            this.add2new.nodes = [new Node(0, NodeType.T, [1]), new Node(1, NodeType.T, [2]), new Node(2, NodeType.g, [])];
            this.add3new.nodes = [new Node(0, NodeType.T, [1]), new Node(1, NodeType.T, [2]), new Node(2, NodeType.T, [3]), new Node(3, NodeType.g, [])];
        }
        static setDefineT1new(oriG, match) {
            this.defineT1new.nodes = [];
            let node0 = new Node(0, oriG.nodes[match[0]].type, [1]);
            let node1 = new Node(1, NodeType.t, [2]);
            let node2 = new Node(2, oriG.nodes[match[2]].type, []);
            this.defineT1new.nodes = [node0, node1, node2];
        }
        static setDefineT2new(oriG, match) {
            this.defineT2new.nodes = [];
            let node0 = new Node(0, oriG.nodes[match[0]].type, [1, 3]);
            let node1 = new Node(1, NodeType.l, [2]);
            let node2 = new Node(2, oriG.nodes[match[2]].type, []);
            let node3 = new Node(3, NodeType.k, [], [1]);
            this.defineT2new.nodes = [node0, node1, node2, node3];
        }
        static setDefineLnew(oriG, match) {
            this.defineLnew.nodes = [];
            let node0 = new Node(0, oriG.nodes[match[0]].type, [1, 2]);
            let node1 = new Node(1, oriG.nodes[match[1]].type, []);
            let node2 = new Node(2, oriG.nodes[match[2]].type, []);
            this.defineLnew.nodes = [node0, node1, node2];
        }
    }

    class BattleMaps {
    }
    BattleMaps.bm1 = [[3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];

    var Direction;
    (function (Direction) {
        Direction[Direction["None"] = 0] = "None";
        Direction[Direction["UP"] = 1] = "UP";
        Direction[Direction["Down"] = 2] = "Down";
        Direction[Direction["Left"] = 3] = "Left";
        Direction[Direction["Right"] = 4] = "Right";
    })(Direction || (Direction = {}));
    var RegionType;
    (function (RegionType) {
        RegionType[RegionType["Undefined"] = 0] = "Undefined";
        RegionType[RegionType["Grass"] = 1] = "Grass";
        RegionType[RegionType["Desert"] = 2] = "Desert";
        RegionType[RegionType["Snow"] = 3] = "Snow";
        RegionType[RegionType["Lava"] = 4] = "Lava";
    })(RegionType || (RegionType = {}));
    class Region {
        constructor(_index) {
            this.index = _index;
            this.upConnect = false;
            this.downConnect = false;
            this.leftConnect = false;
            this.rightConnect = false;
            this.regiontype = RegionType.Undefined;
            let targetMap = BattleMaps.bm1;
            this.tileArray = [];
            for (let j = 0; j < targetMap.length; j++) {
                let tmprow = [];
                for (let i = 0; i < targetMap[0].length; i++) {
                    tmprow.push(targetMap[j][i]);
                }
                this.tileArray.push(tmprow);
            }
            this.enmeyForce = 2;
        }
    }

    class Map {
        static generateWorld() {
            Rules.initRules();
            let oriG = new Graphic();
            oriG.nodes = [new Node(0, NodeType.S, [])];
            let MatchRes = GraphOperations.FindSubGraph(oriG, Rules.startpre);
            let match = MatchRes[0];
            GraphOperations.changeOriG(oriG, Rules.startpre, Rules.startnew, match);
            for (let i = 0; i < 12; i++) {
                let MatchRes = GraphOperations.FindSubGraph(oriG, Rules.addpre);
                let match = MatchRes[Math.floor(Math.random() * MatchRes.length)];
                if (Math.random() < 0.5) {
                    GraphOperations.changeOriG(oriG, Rules.addpre, Rules.add2new, match);
                }
                else {
                    GraphOperations.changeOriG(oriG, Rules.addpre, Rules.add3new, match);
                }
            }
            MatchRes = GraphOperations.FindSubGraph(oriG, Rules.addpre);
            match = MatchRes[Math.floor(Math.random() * MatchRes.length)];
            GraphOperations.changeOriG(oriG, Rules.addpre, Rules.add1new, match);
            oriG.countTypeNums();
            oriG.printGraphic();
            while (true) {
                let MatchRes = GraphOperations.FindTs(oriG);
                if (MatchRes.length == 0) {
                    break;
                }
                let match = MatchRes[Math.floor(Math.random() * MatchRes.length)];
                if (Math.random() < 0.5) {
                    Rules.setDefineT1new(oriG, match);
                    GraphOperations.changeOriG(oriG, Rules.addpre, Rules.defineT1new, match);
                }
                else {
                    Rules.setDefineT2new(oriG, match);
                    GraphOperations.changeOriG(oriG, Rules.addpre, Rules.defineT2new, match);
                }
            }
            for (let i = 0; i < 10; i++) {
                let MatchRes = GraphOperations.FindLs(oriG);
                if (MatchRes.length == 0) {
                    break;
                }
                let match = MatchRes[Math.floor(Math.random() * MatchRes.length)];
                Rules.setDefineLnew(oriG, match);
                GraphOperations.changeOriG(oriG, Rules.addpre, Rules.defineLnew, match);
            }
            let map = Map.GenotoPheno(oriG);
            return map;
        }
        static setGrid(oriG, index, map, size, gridindex, unoccupied, rect) {
            let res = true;
            map[gridindex] = index;
            let x = gridindex % (size);
            let y = Math.floor((gridindex - x) / (size));
            if (x < rect.minx) {
                rect.minx = x;
            }
            if (x > rect.maxx) {
                rect.maxx = x;
            }
            if (y < rect.miny) {
                rect.miny = y;
            }
            if (y > rect.maxy) {
                rect.maxy = y;
            }
            if (x > 0 && map[y * size + x - 1] == -1 && unoccupied.indexOf(y * size + x - 1) == -1) {
                unoccupied.push(y * size + x - 1);
            }
            if (x < size - 1 && map[y * size + x + 1] == -1 && unoccupied.indexOf(y * size + x + 1) == -1) {
                unoccupied.push(y * size + x + 1);
            }
            if (y > 0 && map[(y - 1) * size + x] == -1 && unoccupied.indexOf((y - 1) * size + x) == -1) {
                unoccupied.push((y - 1) * size + x);
            }
            if (y < size - 1 && map[(y + 1) * size + x] == -1 && unoccupied.indexOf((y + 1) * size + x) == -1) {
                unoccupied.push((y + 1) * size + x);
            }
            if (oriG.nodes[index].pointTo.length > unoccupied.length) {
                if (unoccupied.length == 0) {
                    return false;
                }
                let randomUindex = Math.floor(Math.random() * unoccupied.length);
                let newGridindex = unoccupied[randomUindex];
                unoccupied = unoccupied.filter(item => item != newGridindex);
                res = res && this.setGrid(oriG, index, map, size, newGridindex, unoccupied, rect);
            }
            else {
                let forchild = [];
                for (let i = 0; i < oriG.nodes[index].pointTo.length; i++) {
                    let randomUindex = Math.floor(Math.random() * unoccupied.length);
                    let newGridindex = unoccupied[randomUindex];
                    forchild.push(newGridindex);
                    unoccupied = unoccupied.filter(item => item != newGridindex);
                    map[newGridindex] = oriG.nodes[index].pointTo[i];
                }
                for (let i = 0; i < oriG.nodes[index].pointTo.length; i++) {
                    res = res && this.setGrid(oriG, oriG.nodes[index].pointTo[i], map, size, forchild[i], [], rect);
                }
            }
            return res;
        }
        static GenotoPheno(oriG) {
            let size = Math.ceil(Math.sqrt(oriG.nodes.length)) * 2;
            let map = [];
            for (let j = 0; j < size; j++) {
                for (let i = 0; i < size; i++) {
                    map.push(-1);
                }
            }
            let count = 0;
            while (true) {
                let initindex = Math.floor(size / 2) * size + Math.floor(size / 2);
                let minx = initindex % size;
                let maxx = initindex % size;
                let miny = (initindex - minx) / size;
                let maxy = (initindex - maxx) / size;
                let rect = { minx, maxx, miny, maxy };
                let res = this.setGrid(oriG, 0, map, size, initindex, [], rect);
                count++;
                if (res) {
                    let width = rect.maxx - rect.minx + 1;
                    let height = rect.maxy - rect.miny + 1;
                    let tmpcol = [];
                    for (let j = 0; j < height; j++) {
                        let tmprow = [];
                        for (let i = 0; i < width; i++) {
                            if (map[(rect.miny + j) * size + rect.minx + i] == -1) {
                                tmprow.push(null);
                            }
                            else {
                                let index = map[(rect.miny + j) * size + rect.minx + i];
                                let newregion = new Region(index);
                                tmprow.push(newregion);
                            }
                        }
                        tmpcol.push(tmprow);
                    }
                    map = tmpcol;
                    for (let j = 0; j < height; j++) {
                        for (let i = 0; i < width; i++) {
                            if (map[j][i] != null) {
                                let curmap = map[j][i];
                                let index = curmap.index;
                                curmap.node = oriG.nodes[index];
                                let pointto = oriG.nodes[index].pointTo;
                                if (curmap.node.PlaceinGrid.x == -1 && curmap.node.PlaceinGrid.y == -1) {
                                    curmap.node.PlaceinGrid.x = i;
                                    curmap.node.PlaceinGrid.y = j;
                                }
                                else {
                                    curmap.node = new Node(curmap.node.index, NodeType.T, curmap.node.keyTo);
                                    curmap.node.PlaceinGrid.x = i;
                                    curmap.node.PlaceinGrid.y = j;
                                }
                                if (j > 0) {
                                    let tmpmap = map[(j - 1)][i];
                                    if (tmpmap != null) {
                                        let tmpindex = tmpmap.index;
                                        if (pointto.indexOf(tmpindex) > -1 || tmpindex == index) {
                                            curmap.upConnect = true;
                                            tmpmap.downConnect = true;
                                        }
                                    }
                                }
                                if (j < height - 1) {
                                    let tmpmap = map[(j + 1)][i];
                                    if (tmpmap != null) {
                                        let tmpindex = tmpmap.index;
                                        if (pointto.indexOf(tmpindex) > -1 || tmpindex == index) {
                                            curmap.downConnect = true;
                                            tmpmap.upConnect = true;
                                        }
                                    }
                                }
                                if (i > 0) {
                                    let tmpmap = map[j][i - 1];
                                    if (tmpmap != null) {
                                        let tmpindex = tmpmap.index;
                                        if (pointto.indexOf(tmpindex) > -1 || tmpindex == index) {
                                            curmap.leftConnect = true;
                                            tmpmap.rightConnect = true;
                                        }
                                    }
                                }
                                if (i < width - 1) {
                                    let tmpmap = map[j][i + 1];
                                    if (tmpmap != null) {
                                        let tmpindex = tmpmap.index;
                                        if (pointto.indexOf(tmpindex) > -1 || tmpindex == index) {
                                            curmap.rightConnect = true;
                                            tmpmap.leftConnect = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.setRegionType(map, oriG.nodes[0].PlaceinGrid.x, oriG.nodes[0].PlaceinGrid.y, RegionType.Grass, 2);
                    break;
                }
                if (count > 100) {
                    console.log("映射失败！");
                    location.reload();
                    break;
                }
            }
            return map;
        }
        static setRegionType(map, x, y, type, force) {
            let region = map[y][x];
            if (region.regiontype != RegionType.Undefined) {
                return;
            }
            if (region.node.type == NodeType.b || region.node.type == NodeType.g) {
                type = RegionType.Lava;
            }
            region.regiontype = type;
            region.enmeyForce = force;
            if (region.upConnect) {
                let rnd = Math.random();
                let newtype = type;
                if (rnd < 0.1) {
                    newtype = RegionType.Desert;
                }
                else if (rnd < 0.2) {
                    newtype = RegionType.Grass;
                }
                else if (rnd < 0.3) {
                    newtype = RegionType.Snow;
                }
                region.tileArray[0][3] = 7;
                region.tileArray[0][4] = 0;
                region.tileArray[0][5] = 0;
                region.tileArray[0][6] = 6;
                this.setRegionType(map, x, y - 1, newtype, force + 1);
            }
            if (region.downConnect) {
                let rnd = Math.random();
                let newtype = type;
                if (rnd < 0.1) {
                    newtype = RegionType.Desert;
                }
                else if (rnd < 0.2) {
                    newtype = RegionType.Grass;
                }
                else if (rnd < 0.3) {
                    newtype = RegionType.Snow;
                }
                region.tileArray[4][3] = 4;
                region.tileArray[4][4] = 0;
                region.tileArray[4][5] = 0;
                region.tileArray[4][6] = 5;
                this.setRegionType(map, x, y + 1, newtype, force + 1);
            }
            if (region.leftConnect) {
                let rnd = Math.random();
                let newtype = type;
                if (rnd < 0.1) {
                    newtype = RegionType.Desert;
                }
                else if (rnd < 0.2) {
                    newtype = RegionType.Grass;
                }
                else if (rnd < 0.3) {
                    newtype = RegionType.Snow;
                }
                region.tileArray[2][0] = 0;
                this.setRegionType(map, x - 1, y, newtype, force + 1);
            }
            if (region.rightConnect) {
                let rnd = Math.random();
                let newtype = type;
                if (rnd < 0.1) {
                    newtype = RegionType.Desert;
                }
                else if (rnd < 0.2) {
                    newtype = RegionType.Grass;
                }
                else if (rnd < 0.3) {
                    newtype = RegionType.Snow;
                }
                region.tileArray[2][9] = 0;
                this.setRegionType(map, x + 1, y, newtype, force + 1);
            }
        }
    }

    class GameControl extends Laya.Image {
        constructor(_player) {
            super();
            this.player = _player;
            this.width = 960;
            this.height = 480;
            this.y = 80;
            this.dirR = new Laya.Sprite();
            this.proR = new Laya.Sprite();
            this.proR.graphics.drawCircle(0, -80, 5, "#FFFFFF");
            this.proR.graphics.drawCircle(0, -80, 75, "#878787");
            this.dirR.visible = false;
            this.proR.visible = false;
            this.proR.zOrder = 1001;
            this.dirR.zOrder = 1002;
            this.addChild(this.dirR);
            this.addChild(this.proR);
            this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            this.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
        }
        onMouseDown() {
            this.dirR.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            this.dirR.alpha = 0.6;
            this.dirR.graphics.drawCircle(0, -80, 25, "#A9AAAB");
            this.proR.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            this.proR.alpha = 0.5;
            this.dirR.visible = true;
            this.proR.visible = true;
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        }
        onMouseUp() {
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            this.player.setDirection(0, 0);
            this.dirR.visible = false;
            this.proR.visible = false;
        }
        dis(ax, ay, bx, by) {
            let dx = ax - bx;
            let dy = ay - by;
            return Math.sqrt(dx * dx + dy * dy);
        }
        onMouseMove(e) {
            let dis = this.dis(this.proR.x, this.proR.y, Laya.stage.mouseX, Laya.stage.mouseY);
            let ang = Math.atan2(Laya.stage.mouseY - this.proR.y, Laya.stage.mouseX - this.proR.x);
            if (dis < 200) {
                if (dis > 50) {
                    this.dirR.pos(this.proR.x + Math.cos(ang) * 50, this.proR.y + Math.sin(ang) * 50);
                    this.player.setDirection(Math.cos(ang), (Math.sin(ang)));
                }
                else {
                    this.dirR.pos(Laya.stage.mouseX, Laya.stage.mouseY);
                    this.player.setDirection(Math.cos(ang) * dis / 50, (Math.sin(ang) * dis / 50));
                }
            }
        }
    }

    class Smallthis extends Laya.Image {
        constructor(map) {
            super();
            this.map = map;
            let width = map[0].length;
            let height = map.length;
            let gridwidth = 60;
            let gridheight = 30;
            let marginwidth = 10;
            let marginheight = 5;
            this.skin = ("comp/dialogue-bubble.png");
            this.width = gridwidth * (width + 2);
            this.height = gridheight * (height + 2);
            this.sizeGrid = "20,20,20,20";
        }
        redraw(x, y) {
            let map = this.map;
            let width = map[0].length;
            let height = map.length;
            let gridwidth = 60;
            let gridheight = 30;
            let marginwidth = 10;
            let marginheight = 5;
            for (let j = 0; j < height; j++) {
                for (let i = 0; i < width; i++) {
                    if (map[j][i] == null) {
                    }
                    else {
                        let tmpmap = map[j][i];
                        let groundcolor = "#00ff00";
                        let barriercolor = "#00cc00";
                        if (tmpmap.regiontype == RegionType.Snow) {
                            groundcolor = "#ffffff";
                            barriercolor = "#cccccc";
                        }
                        else if (tmpmap.regiontype == RegionType.Desert) {
                            groundcolor = "#ffff00";
                            barriercolor = "#cccc00";
                        }
                        else if (tmpmap.regiontype == RegionType.Lava) {
                            groundcolor = "#9f8f8f";
                            barriercolor = "#0c0c0c";
                        }
                        this.graphics.drawRect((i + 1) * gridwidth, (j + 1) * gridheight, gridwidth, gridheight, groundcolor, groundcolor);
                        if (tmpmap.upConnect) {
                            this.graphics.drawRect((i + 1) * gridwidth, (j + 1) * gridheight, marginwidth, marginheight, barriercolor, barriercolor);
                            this.graphics.drawRect((i + 1) * gridwidth + (gridwidth - marginwidth), (j + 1) * gridheight, marginwidth, marginheight, barriercolor, barriercolor);
                        }
                        else {
                            this.graphics.drawRect((i + 1) * gridwidth, (j + 1) * gridheight, gridwidth, marginheight, barriercolor, barriercolor);
                        }
                        if (tmpmap.downConnect) {
                            this.graphics.drawRect((i + 1) * gridwidth, (j + 1) * gridheight + (gridheight - marginheight), marginwidth, marginheight, barriercolor, barriercolor);
                            this.graphics.drawRect((i + 1) * gridwidth + (gridwidth - marginwidth), (j + 1) * gridheight + (gridheight - marginheight), marginwidth, marginheight, barriercolor, barriercolor);
                        }
                        else {
                            this.graphics.drawRect((i + 1) * gridwidth, (j + 1) * gridheight + (gridheight - marginheight), gridwidth, marginheight, barriercolor, barriercolor);
                        }
                        if (tmpmap.leftConnect) {
                            this.graphics.drawRect((i + 1) * gridwidth, (j + 1) * gridheight, marginheight, marginheight, barriercolor, barriercolor);
                            this.graphics.drawRect((i + 1) * gridwidth, (j + 1) * gridheight + (gridheight - marginheight), marginheight, marginheight, barriercolor, barriercolor);
                        }
                        else {
                            this.graphics.drawRect((i + 1) * gridwidth, (j + 1) * gridheight, marginheight, gridheight, barriercolor, barriercolor);
                        }
                        if (tmpmap.rightConnect) {
                            this.graphics.drawRect((i + 1) * gridwidth + (gridwidth - marginheight), (j + 1) * gridheight, marginheight, marginheight, barriercolor, barriercolor);
                            this.graphics.drawRect((i + 1) * gridwidth + (gridwidth - marginheight), (j + 1) * gridheight + (gridheight - marginheight), marginheight, marginheight, barriercolor, barriercolor);
                        }
                        else {
                            this.graphics.drawRect((i + 1) * gridwidth + (gridwidth - marginheight), (j + 1) * gridheight, marginheight, gridheight, barriercolor, barriercolor);
                        }
                        if (i == x && j == y) {
                            this.graphics.fillText("🦸", (i + 1) * gridwidth + gridwidth / 2.0, (j + 1) * gridheight + gridheight * 0.3, "20px Arial", "#000000", "center");
                        }
                        if (tmpmap.node.type == NodeType.b) {
                            this.graphics.fillText("👹", (i + 1) * gridwidth + gridwidth / 2.0, (j + 1) * gridheight + gridheight * 0.3, "20px Arial", "#000000", "center");
                        }
                        if (tmpmap.node.type == NodeType.g) {
                            this.graphics.fillText("👸", (i + 1) * gridwidth + gridwidth / 2.0, (j + 1) * gridheight + gridheight * 0.3, "20px Arial", "#000000", "center");
                        }
                        if (tmpmap.node.type == NodeType.k) {
                            this.graphics.fillText("🔑" + tmpmap.node.keyTo[0], (i + 1) * gridwidth + gridwidth / 2.0, (j + 1) * gridheight + gridheight * 0.3, "20px Arial", "#000000", "center");
                        }
                        if (tmpmap.node.type == NodeType.l) {
                            this.graphics.fillText("🔒" + tmpmap.node.index, (i + 1) * gridwidth + gridwidth / 2.0, (j + 1) * gridheight + gridheight * 0.3, "20px Arial", "#000000", "center");
                        }
                    }
                }
            }
        }
    }

    class BulletFactory {
        constructor(battlesprite) {
            BulletFactory.mainsp = battlesprite;
        }
        static initBullet(BulletScript, x, y, dirx, diry) {
            let bl = Laya.Pool.getItemByClass('BulletType', Laya.Image);
            bl.skin = BulletScript.skin;
            let rot = 0;
            if (dirx == 0) {
                if (diry > 0) {
                    rot = 90;
                }
                else {
                    rot = 270;
                }
            }
            else {
                rot = Math.atan2(diry, dirx) * 180 / 3.1415926;
            }
            bl.rotation = rot;
            bl.x = x + 24 - BulletScript.width / 2;
            bl.y = y + 24 - BulletScript.height / 2;
            BulletFactory.mainsp.addChild(bl);
            bl.scale(BulletScript.scale, BulletScript.scale);
            let rigid = bl.getComponent(Laya.RigidBody);
            if (!rigid) {
                rigid = bl.addComponent(Laya.RigidBody);
            }
            rigid.type = "dynamic";
            rigid.gravityScale = 0;
            rigid.setVelocity({ x: dirx * BulletScript.speed, y: diry * BulletScript.speed });
            let collider = bl.getComponent(Laya.BoxCollider);
            if (!collider) {
                collider = bl.addComponent(Laya.BoxCollider);
            }
            collider.width = BulletScript.width;
            collider.height = BulletScript.height;
            collider.isSensor = true;
            let bs = bl.getComponent(Laya.Script);
            if (!bs) {
                bs = bl.addComponent(BulletScript);
            }
            bs = new BulletScript();
            console.log(bl);
        }
    }

    var CharacterAction;
    (function (CharacterAction) {
        CharacterAction[CharacterAction["None"] = 0] = "None";
        CharacterAction[CharacterAction["Walk"] = 1] = "Walk";
        CharacterAction[CharacterAction["RandomWalk"] = 2] = "RandomWalk";
        CharacterAction[CharacterAction["Attack"] = 3] = "Attack";
    })(CharacterAction || (CharacterAction = {}));
    class Character extends Laya.Script {
        constructor() {
            super(...arguments);
            this.action = CharacterAction.None;
            this.hurtFrame = 0;
            this.invincibleStatus = false;
        }
        setDirection(_x, _y) {
            this.x = _x;
            this.y = _y;
        }
        onStart() {
            this.x = 0;
            this.y = 0;
            this.speed = 3.0;
            this.frame = 0;
            this.stepindex = 0;
            this.directindex = 0;
            this.rigidbody = this.owner.getComponent(Laya.RigidBody);
        }
        doTurnAround() {
            if (Math.abs(this.dirx) > Math.abs(this.diry)) {
                if (this.dirx > 0) {
                    this.directindex = 3;
                }
                else {
                    this.directindex = 2;
                }
            }
            else {
                if (this.diry > 0) {
                    this.directindex = 0;
                }
                else {
                    this.directindex = 1;
                }
            }
            this.owner.value = Character.Values[0][this.directindex];
        }
        doMove() {
            if (!this.rigidbody) {
                return;
            }
            this.rigidbody.setVelocity({ x: this.x * this.speed, y: this.y * this.speed });
            if (this.x == 0 && this.y == 0) {
                return;
            }
            this.dirx = this.x;
            this.diry = this.y;
            this.frame++;
            if (this.frame * this.speed >= 50) {
                this.frame = 0;
                this.stepindex++;
                if (this.stepindex >= 4) {
                    this.stepindex = 0;
                }
            }
            if (Math.abs(this.x) > Math.abs(this.y)) {
                if (this.x > 0) {
                    this.directindex = 3;
                }
                else {
                    this.directindex = 2;
                }
            }
            else {
                if (this.y > 0) {
                    this.directindex = 0;
                }
                else {
                    this.directindex = 1;
                }
            }
            this.owner.value = Character.Values[this.stepindex][this.directindex];
        }
        onStopMove() {
            this.x = 0;
            this.y = 0;
        }
        onSetRandomWalk() {
            this.x = 0.5 - Math.random();
            this.y = 0.5 - Math.random();
            let mod = Math.sqrt(this.x * this.x + this.y * this.y);
            if (mod != 0) {
                this.dirx = this.x /= mod;
                this.diry = this.y /= mod;
            }
        }
        addExp() {
            console.log("AddExp");
        }
        onUpdate() {
            if (this.HP <= 0 && this.hurtFrame == 0) {
                this.addExp();
                this.owner.x = -100;
                this.owner.y = -100;
                this.removeOwner(this.owner);
            }
            if (this.hurtFrame > 0) {
                const ColorFilter = Laya.ColorFilter;
                let redMat;
                if (this.HP > 0) {
                    redMat = [
                        1, 0, 0, 0, 0,
                        0, 1 - this.hurtFrame / 40, 0, 0, 0,
                        0, 0, 1 - this.hurtFrame / 40, 0, 0,
                        0, 0, 0, 1, 0
                    ];
                }
                else {
                    redMat = [
                        1, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                        0, 0, 0, this.hurtFrame / 40, 0
                    ];
                }
                let redFilter = new ColorFilter(redMat);
                this.owner.filters = [redFilter];
                this.hurtFrame--;
                this.invincibleStatus = true;
                let hpbar = this.owner.getChildByName("hpbar");
                if (hpbar) {
                    hpbar.graphics.drawRect(0, 0, 16, 4, "#000000");
                    hpbar.graphics.drawRect(1, 1, 14 * this.HP / this.maxHP, 2, "#ff0000");
                }
            }
            else {
                this.owner.filters = [];
                this.invincibleStatus = false;
            }
        }
        removeOwner(owner) {
            let rg = owner.getComponent(Laya.RigidBody);
            let bc = owner.getComponent(Laya.BoxCollider);
            if (rg) {
                rg.enabled = false;
            }
            if (bc) {
                bc.enabled = false;
            }
            if (bc) {
                owner._destroyComponent(bc);
            }
            if (rg) {
                owner._destroyComponent(rg);
            }
            Laya.Pool.recover('EnemyType', owner);
            BulletFactory.mainsp.removeChild(owner);
        }
    }
    Character.Values = [["一", "八", "匕", "厂"], ["刀", "儿", "二", "几"], ["力", "人", "入", "十"], ["又", "川", "寸", "大"], ["飞", "干", "工", "弓"], ["广", "己", "口", "马"], ["门", "女", "山", "尸"]];

    class GrassEnemy1 extends Character {
        constructor() {
            super(...arguments);
            this.AItick = 0;
            this.maxHP = 2;
            this.damage = 1;
        }
        onStart() {
            this.x = 0;
            this.y = 0;
            this.speed = 2.0;
            this.frame = 0;
            this.AItick = 0;
            this.stepindex = 0;
            this.directindex = 0;
            this.action == CharacterAction.RandomWalk;
            this.rigidbody = this.owner.getComponent(Laya.RigidBody);
        }
        onUpdate() {
            super.onUpdate();
            this.AI();
        }
        addExp() {
            super.addExp();
            Player.exp += 2;
            BattleScene.Lv.text = "lv." + Player.Level + " exp/next:" + Player.exp + "/" + Player.maxExp;
        }
        AI() {
            this.AItick++;
            if (this.action == CharacterAction.Attack) {
                if (this.AItick == 100) {
                    this.AItick = 0;
                    this.action = CharacterAction.RandomWalk;
                }
                return;
            }
            if (this.AItick >= 200) {
                this.onStopMove();
                this.AItick = 0;
                this.action = CharacterAction.Attack;
            }
            else {
                if (Math.random() < 0.05) {
                    this.onSetRandomWalk();
                }
            }
            this.doMove();
        }
        onTriggerEnter(other) {
            if (this.owner && other.owner) {
                let character = other.owner.getComponent(Player);
                if (character && !character.invincibleStatus) {
                    character.hurtFrame = 20;
                    character.HP -= this.damage;
                }
            }
        }
    }
    GrassEnemy1.BattlePoint = 1;
    GrassEnemy1.skinname = "Enemy/3.png";

    class SandEnemy1 extends Character {
        constructor() {
            super(...arguments);
            this.AItick = 0;
            this.maxHP = 2;
            this.damage = 2;
        }
        onStart() {
            this.x = 0;
            this.y = 0;
            this.speed = 1.0;
            this.frame = 0;
            this.AItick = 0;
            this.stepindex = 0;
            this.directindex = 0;
            this.action == CharacterAction.RandomWalk;
            this.rigidbody = this.owner.getComponent(Laya.RigidBody);
        }
        onUpdate() {
            super.onUpdate();
            this.AI();
        }
        addExp() {
            super.addExp();
            Player.exp += 2;
            BattleScene.Lv.text = "lv." + Player.Level + " exp/next:" + Player.exp + "/" + Player.maxExp;
        }
        AI() {
            this.AItick++;
            if (this.action == CharacterAction.Attack) {
                if (this.AItick == 100) {
                    this.AItick = 0;
                    this.action = CharacterAction.RandomWalk;
                }
                return;
            }
            if (this.AItick >= 200) {
                this.onStopMove();
                this.AItick = 0;
                this.action = CharacterAction.Attack;
            }
            else {
                if (Math.random() < 0.05) {
                    this.onSetRandomWalk();
                }
            }
            this.doMove();
        }
        onTriggerEnter(other) {
            if (this.owner && other.owner) {
                let character = other.owner.getComponent(Player);
                if (character && !character.invincibleStatus) {
                    character.hurtFrame = 20;
                    character.HP -= this.damage;
                }
            }
        }
    }
    SandEnemy1.BattlePoint = 1;
    SandEnemy1.skinname = "Enemy/2.png";

    class SnowEnemy1 extends Character {
        constructor() {
            super(...arguments);
            this.AItick = 0;
            this.maxHP = 1;
            this.damage = 1;
        }
        onStart() {
            this.x = 0;
            this.y = 0;
            this.speed = 3.0;
            this.frame = 0;
            this.AItick = 0;
            this.stepindex = 0;
            this.directindex = 0;
            this.action == CharacterAction.RandomWalk;
            this.rigidbody = this.owner.getComponent(Laya.RigidBody);
        }
        onUpdate() {
            super.onUpdate();
            this.AI();
        }
        addExp() {
            super.addExp();
            Player.exp += 2;
            BattleScene.Lv.text = "lv. " + Player.Level + " exp/next:" + Player.exp + "/" + Player.maxExp;
        }
        AI() {
            this.AItick++;
            if (this.action == CharacterAction.Attack) {
                if (this.AItick == 100) {
                    this.AItick = 0;
                    this.action = CharacterAction.RandomWalk;
                }
                return;
            }
            if (this.AItick >= 200) {
                this.onStopMove();
                this.AItick = 0;
                this.action = CharacterAction.Attack;
            }
            else {
                if (Math.random() < 0.05) {
                    this.onSetRandomWalk();
                }
            }
            this.doMove();
        }
        onTriggerEnter(other) {
            if (this.owner && other.owner) {
                let character = other.owner.getComponent(Player);
                if (character && !character.invincibleStatus) {
                    character.hurtFrame = 20;
                    character.HP -= this.damage;
                }
            }
        }
    }
    SnowEnemy1.BattlePoint = 1;
    SnowEnemy1.skinname = "Enemy/7.png";

    class LavaEnemy1 extends Character {
        constructor() {
            super(...arguments);
            this.AItick = 0;
            this.maxHP = 2;
            this.damage = 1;
        }
        onStart() {
            this.x = 0;
            this.y = 0;
            this.speed = 2.0;
            this.frame = 0;
            this.AItick = 0;
            this.stepindex = 0;
            this.directindex = 0;
            this.action == CharacterAction.RandomWalk;
            this.rigidbody = this.owner.getComponent(Laya.RigidBody);
        }
        onUpdate() {
            super.onUpdate();
            this.AI();
        }
        addExp() {
            super.addExp();
            Player.exp += 2;
            BattleScene.Lv.text = "lv." + Player.Level + " exp/next:" + Player.exp + "/" + Player.maxExp;
        }
        AI() {
            this.AItick++;
            if (this.action == CharacterAction.Attack) {
                if (this.AItick == 100) {
                    this.AItick = 0;
                    this.action = CharacterAction.RandomWalk;
                }
                return;
            }
            if (this.AItick >= 200) {
                this.onStopMove();
                this.AItick = 0;
                this.action = CharacterAction.Attack;
            }
            else {
                if (Math.random() < 0.05) {
                    this.onSetRandomWalk();
                }
            }
            this.doMove();
        }
        onTriggerEnter(other) {
            if (this.owner && other.owner) {
                let character = other.owner.getComponent(Player);
                if (character && !character.invincibleStatus) {
                    character.hurtFrame = 20;
                    character.HP -= this.damage;
                }
            }
        }
    }
    LavaEnemy1.BattlePoint = 1;
    LavaEnemy1.skinname = "Enemy/19.png";

    class BeanArrow extends Laya.Script {
        constructor() {
            super(...arguments);
            this.damage = 1;
        }
        onUpdate() {
            let owner = this.owner;
            if (owner.x < 0 || owner.y < 0 || owner.x > 960 || owner.y > 480) {
                this.removeOwner(owner);
            }
        }
        onTriggerEnter(other) {
            if (this.owner && other.owner) {
                let player = other.owner.getComponent(Player);
                if (player) {
                    if (player && !player.invincibleStatus) {
                        player.hurtFrame = 20;
                        player.HP -= this.damage;
                    }
                    let owner = this.owner;
                    this.removeOwner(owner);
                }
                else {
                    let character = other.owner.getComponent(Character);
                    if (character) {
                    }
                    else {
                        let owner = this.owner;
                        this.removeOwner(owner);
                    }
                }
            }
        }
        removeOwner(owner) {
            let rg = owner.getComponent(Laya.RigidBody);
            let bc = owner.getComponent(Laya.BoxCollider);
            if (rg) {
                rg.enabled = false;
            }
            if (bc) {
                bc.enabled = false;
            }
            if (bc) {
                owner._destroyComponent(bc);
            }
            if (rg) {
                owner._destroyComponent(rg);
            }
            owner._destroyAllComponent();
            BulletFactory.mainsp.removeChild(owner);
            Laya.Pool.recover('BulletType', owner);
        }
    }
    BeanArrow.skin = "Bullet/Bean.png";
    BeanArrow.scale = 2;
    BeanArrow.width = 5;
    BeanArrow.height = 5;
    BeanArrow.speed = 5;

    class GrassEnemy2 extends Character {
        constructor() {
            super(...arguments);
            this.AItick = 0;
            this.maxHP = 5;
            this.damage = 1;
        }
        onStart() {
            this.x = 0;
            this.y = 0;
            this.speed = 2.0;
            this.frame = 0;
            this.AItick = 0;
            this.stepindex = 0;
            this.directindex = 0;
            this.action == CharacterAction.RandomWalk;
            this.rigidbody = this.owner.getComponent(Laya.RigidBody);
        }
        onUpdate() {
            super.onUpdate();
            this.AI();
        }
        addExp() {
            super.addExp();
            Player.exp += 2;
            BattleScene.Lv.text = "lv." + Player.Level + " exp/next:" + Player.exp + "/" + Player.maxExp;
        }
        doShoot() {
            let owner = this.owner;
            BulletFactory.initBullet(BeanArrow, owner.x, owner.y, this.dirx, this.diry);
        }
        AI() {
            this.AItick++;
            if (this.action == CharacterAction.Attack) {
                if (this.AItick % 30 == 0) {
                    this.dirx = (BattleScene.player.x - this.owner.x);
                    this.diry = (BattleScene.player.y - this.owner.y);
                    let mod = Math.sqrt(this.dirx * this.dirx + this.diry * this.diry);
                    this.dirx /= mod;
                    this.diry /= mod;
                    this.doShoot();
                }
                if (this.AItick == 100) {
                    this.AItick = 0;
                    this.action = CharacterAction.RandomWalk;
                }
                return;
            }
            if (this.AItick >= 100) {
                this.onStopMove();
                this.AItick = 0;
                this.action = CharacterAction.Attack;
            }
            else {
                if (Math.random() < 0.05) {
                    this.onSetRandomWalk();
                }
            }
            this.doMove();
        }
        onTriggerEnter(other) {
            if (this.owner && other.owner) {
                let character = other.owner.getComponent(Player);
                if (character && !character.invincibleStatus) {
                    character.hurtFrame = 20;
                    character.HP -= this.damage;
                }
            }
        }
    }
    GrassEnemy2.BattlePoint = 3;
    GrassEnemy2.skinname = "Enemy/4.png";

    class EnemyFactory {
        constructor(battlesprite) {
            this.grassEnemies = [GrassEnemy1, GrassEnemy2];
            this.sandEnemies = [SandEnemy1];
            this.snowEnemies = [SnowEnemy1];
            this.lavaEnemies = [LavaEnemy1];
            EnemyFactory.mainsp = battlesprite;
            EnemyFactory.enemylist = [];
        }
        initEnemy(regiontype, enemyforce, battlemap) {
            let Enemies = [];
            if (regiontype == RegionType.Grass) {
                Enemies = this.grassEnemies;
            }
            if (regiontype == RegionType.Desert) {
                Enemies = this.sandEnemies;
            }
            if (regiontype == RegionType.Snow) {
                Enemies = this.snowEnemies;
            }
            if (regiontype == RegionType.Lava) {
                Enemies = this.lavaEnemies;
            }
            while (enemyforce > 0) {
                let Enemy = Enemies[Math.floor(Math.random() * Enemies.length)];
                if (Enemy.BattlePoint > enemyforce) {
                    continue;
                }
                let fc = Laya.Pool.getItemByClass('EnemyType', Laya.FontClip);
                fc.skin = Enemy.skinname;
                fc.sheet = "一八匕厂 刀儿二几 力人入十 又川寸大";
                fc.scaleX = fc.scaleY = 3;
                fc.value = "一";
                let xindex = Math.floor(Math.random() * 8);
                let yindex = Math.floor(Math.random() * 3);
                while (true) {
                    if (battlemap[yindex + 1][xindex + 1] == 0) {
                        break;
                    }
                    else {
                        xindex = Math.floor(Math.random() * 8);
                        yindex = Math.floor(Math.random() * 3);
                    }
                }
                fc.x = 96 * (xindex + 1) + Math.floor(32 + Math.random() * 32);
                fc.y = 96 * (yindex + 1) + Math.floor(32 + Math.random() * 32);
                let rigid = fc.getComponent(Laya.RigidBody);
                if (!rigid) {
                    rigid = fc.addComponent(Laya.RigidBody);
                }
                rigid.type = "dynamic";
                rigid.gravityScale = 0;
                rigid.allowRotation = false;
                let collider = fc.getComponent(Laya.BoxCollider);
                if (!collider) {
                    collider = fc.addComponent(Laya.BoxCollider);
                }
                collider.width = collider.height = 16;
                let enemy = fc.getComponent(Laya.Script);
                if (enemy) {
                    fc._destroyComponent(enemy);
                }
                enemy = fc.addComponent(Enemy);
                enemy.HP = enemy.maxHP;
                let hpbar = fc.getChildByName("hpbar");
                if (!hpbar) {
                    hpbar = new Laya.Image();
                    hpbar.name = "hpbar";
                    hpbar.y = -5;
                    fc.addChild(hpbar);
                }
                hpbar.graphics.drawRect(0, 0, 16, 4, "#000000");
                hpbar.graphics.drawRect(1, 1, 14, 2, "#ff0000");
                EnemyFactory.enemylist.push(fc);
                EnemyFactory.mainsp.addChild(fc);
                enemyforce -= Enemy.BattlePoint;
            }
        }
        static clearEnemey() {
            for (let i = 0; i < EnemyFactory.enemylist.length; i++) {
                Laya.Pool.recover('EnemyType', EnemyFactory.enemylist[i]);
                this.mainsp.removeChild(EnemyFactory.enemylist[i]);
            }
            EnemyFactory.enemylist = [];
        }
    }

    class PlayerArrow extends Laya.Script {
        constructor() {
            super(...arguments);
            this.damage = 1;
        }
        onUpdate() {
            let owner = this.owner;
            if (owner.x < 0 || owner.y < 0 || owner.x > 960 || owner.y > 480) {
                this.removeOwner(owner);
            }
        }
        onTriggerEnter(other) {
            if (this.owner && other.owner) {
                let player = other.owner.getComponent(Player);
                if (player) {
                }
                else {
                    let character = other.owner.getComponent(Character);
                    if (character && !character.invincibleStatus) {
                        character.hurtFrame = 20;
                        character.HP -= this.damage;
                    }
                    let owner = this.owner;
                    this.removeOwner(owner);
                }
            }
        }
        removeOwner(owner) {
            let rg = owner.getComponent(Laya.RigidBody);
            let bc = owner.getComponent(Laya.BoxCollider);
            if (rg) {
                rg.enabled = false;
            }
            if (bc) {
                bc.enabled = false;
            }
            if (bc) {
                owner._destroyComponent(bc);
            }
            if (rg) {
                owner._destroyComponent(rg);
            }
            owner._destroyAllComponent();
            BulletFactory.mainsp.removeChild(owner);
            Laya.Pool.recover('BulletType', owner);
        }
    }
    PlayerArrow.skin = "Bullet/arrow.png";
    PlayerArrow.scale = 2;
    PlayerArrow.width = 13;
    PlayerArrow.height = 5;
    PlayerArrow.speed = 5;

    class Player extends Character {
        constructor() {
            super(...arguments);
            this.attacktick = 0;
            this.attackInterval = 20;
            this.attackPre = 2;
            this.attackAft = 5;
        }
        onUpdate() {
            super.onUpdate();
            for (let i = 0; i < BattleScene.hearts.length; i++) {
                if (this.maxHP / 4.0 <= i) {
                    BattleScene.hearts[i].visible = false;
                }
                else {
                    BattleScene.hearts[i].visible = true;
                    if (this.HP / 4.0 >= i + 1) {
                        BattleScene.hearts[i].index = 0;
                    }
                    else if (this.HP / 4.0 < i) {
                        BattleScene.hearts[i].index = 4;
                    }
                    else {
                        BattleScene.hearts[i].index = Math.round(4 - (this.HP / 4.0 - i) * 4);
                    }
                }
            }
            if (this.x == 0 && this.y == 0) {
                this.attacktick++;
                if (this.action != CharacterAction.Attack) {
                    this.action = CharacterAction.Attack;
                    this.attacktick = 0;
                }
                if (this.attacktick < this.attackInterval) {
                    let res = this.onAttackWait();
                    if (!res) {
                        let tmpregion = BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX];
                        if (tmpregion.node.type == NodeType.k) {
                            Laya.timer.once(500, this, () => {
                                alert("你获得了" + tmpregion.node.keyTo[0] + "号钥匙，" + tmpregion.node.keyTo[0] + "号关卡的守卫已经离开了！");
                            });
                            tmpregion.node.type = NodeType.t;
                            for (let i = 0; i < BattleScene.regionmap.length; i++) {
                                for (let j = 0; j < BattleScene.regionmap[i].length; j++) {
                                    if (BattleScene.regionmap[i][j] && BattleScene.regionmap[i][j].node.index == tmpregion.node.keyTo[0]) {
                                        BattleScene.regionmap[i][j].node.type = NodeType.t;
                                    }
                                }
                            }
                        }
                        this.attacktick--;
                    }
                }
                else if (this.attacktick < this.attackInterval + this.attackPre) {
                    this.onAttackPre();
                }
                else if (this.attacktick == this.attackInterval + this.attackPre) {
                    this.onAttackAft();
                    this.doShoot();
                }
                else if (this.attacktick < this.attackInterval + this.attackPre + this.attackAft) {
                    this.onAttackAft();
                }
                else {
                    this.attacktick = 0;
                }
            }
            else {
                this.action = CharacterAction.Walk;
            }
            this.doMove();
        }
        onAttackWait() {
            let index = -1;
            let enemyx = -1;
            let enemyy = -1;
            let mindist = 999999;
            let owner = this.owner;
            for (let i = 0; i < EnemyFactory.enemylist.length; i++) {
                let enemy = EnemyFactory.enemylist[i];
                let enemyHP = EnemyFactory.enemylist[i].getComponent(Character).HP;
                if (enemyHP > 0) {
                    let delx = enemy.x - owner.x;
                    let dely = enemy.y - owner.y;
                    let newdist = Math.sqrt(delx * delx + dely * dely);
                    if (newdist < mindist) {
                        index = i;
                        enemyx = enemy.x;
                        enemyy = enemy.y;
                        mindist = newdist;
                    }
                }
            }
            if (index == -1) {
                return false;
            }
            let dirx = enemyx - owner.x;
            let diry = enemyy - owner.y;
            let mod = Math.sqrt(dirx * dirx + diry * diry);
            this.dirx = dirx / mod;
            this.diry = diry / mod;
            this.doTurnAround();
            return true;
        }
        onAttackPre() {
            this.owner.value = Character.Values[4][this.directindex];
        }
        onAttackAft() {
            this.owner.value = Character.Values[5][this.directindex];
        }
        doShoot() {
            let owner = this.owner;
            BulletFactory.initBullet(PlayerArrow, owner.x, owner.y, this.dirx, this.diry);
        }
    }
    Player.Level = 1;
    Player.exp = 0;
    Player.maxExp = 10;

    class toDown extends Laya.Script {
        constructor() {
            super(...arguments);
            this.conce = true;
        }
        onTriggerEnter(other) {
            console.log("conce", this.conce);
            if (other.owner.getComponent(Player) && this.conce) {
                if (toDown.keyindex == -1) {
                    BattleScene.tmpMapY += 1;
                    BattleScene.switchMap(0, -400);
                    this.conce = false;
                    Laya.timer.once(500, this, () => { this.conce = true; });
                }
                else {
                    alert("想要通过这里继续前进，你必须想首先办法获得" + toDown.keyindex + "号钥匙证明自己的实力！");
                }
            }
        }
    }
    toDown.keyindex = -1;

    class toUp extends Laya.Script {
        constructor() {
            super(...arguments);
            this.conce = true;
        }
        onTriggerEnter(other) {
            console.log("conce", this.conce);
            if (other.owner.getComponent(Player) && this.conce) {
                if (toUp.keyindex == -1) {
                    BattleScene.tmpMapY -= 1;
                    BattleScene.switchMap(0, 400);
                    this.conce = false;
                    Laya.timer.once(500, this, () => { this.conce = true; });
                }
                else {
                    alert("想要通过这里继续前进，你必须想首先办法获得" + toUp.keyindex + "号钥匙证明自己的实力！");
                }
            }
        }
    }
    toUp.keyindex = -1;

    class toLeft extends Laya.Script {
        constructor() {
            super(...arguments);
            this.conce = true;
        }
        onTriggerEnter(other) {
            console.log("conce", this.conce);
            if (other.owner.getComponent(Player) && this.conce) {
                if (toLeft.keyindex == -1) {
                    BattleScene.tmpMapX -= 1;
                    BattleScene.switchMap(880, 0);
                    this.conce = false;
                    Laya.timer.once(500, this, () => { this.conce = true; });
                }
                else {
                    alert("想要通过这里继续前进，你必须想首先办法获得" + toLeft.keyindex + "号钥匙证明自己的实力！");
                }
            }
        }
    }
    toLeft.keyindex = -1;

    class toRight extends Laya.Script {
        constructor() {
            super(...arguments);
            this.conce = true;
        }
        onTriggerEnter(other) {
            console.log("conce", this.conce);
            if (other.owner.getComponent(Player) && this.conce) {
                if (toRight.keyindex == -1) {
                    BattleScene.tmpMapX += 1;
                    BattleScene.switchMap(-880, 0);
                    this.conce = false;
                    Laya.timer.once(500, this, () => { this.conce = true; });
                }
                else {
                    alert("想要通过这里继续前进，你必须想首先办法获得" + toRight.keyindex + "号钥匙证明自己的实力！");
                }
            }
        }
    }
    toRight.keyindex = -1;

    class BattleImage {
        constructor(battlesprite) {
            this.ifcanMove = true;
            this.mainsp = battlesprite;
            this.tilePool = [];
        }
        initMap(regiontype, battlemap, enemyforce) {
            let tmpregion = BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX];
            this.enemyFactory = new EnemyFactory(this.mainsp);
            this.bulletFactory = new BulletFactory(this.mainsp);
            console.log(this.mainsp.numChildren);
            for (let i = 0; i < this.mainsp.numChildren; i++) {
                let c = this.mainsp.getChildAt(i);
                let d = c.getComponent(toDown);
                let u = c.getComponent(toUp);
                let l = c.getComponent(toLeft);
                let r = c.getComponent(toRight);
                if (d) {
                    toDown.keyindex = -1;
                    c.visible = false;
                    if (tmpregion.downConnect && BattleScene.regionmap[BattleScene.tmpMapY + 1][BattleScene.tmpMapX].node.type == NodeType.l) {
                        toDown.keyindex = BattleScene.regionmap[BattleScene.tmpMapY + 1][BattleScene.tmpMapX].node.index;
                        c.visible = true;
                    }
                }
                if (u) {
                    toUp.keyindex = -1;
                    c.visible = false;
                    if (tmpregion.upConnect && BattleScene.regionmap[BattleScene.tmpMapY - 1][BattleScene.tmpMapX].node.type == NodeType.l) {
                        toUp.keyindex = BattleScene.regionmap[BattleScene.tmpMapY - 1][BattleScene.tmpMapX].node.index;
                        c.visible = true;
                    }
                }
                if (l) {
                    toLeft.keyindex = -1;
                    c.visible = false;
                    if (tmpregion.leftConnect && BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX - 1].node.type == NodeType.l) {
                        toLeft.keyindex = BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX - 1].node.index;
                        c.visible = true;
                    }
                }
                if (r) {
                    toRight.keyindex = -1;
                    c.visible = false;
                    if (tmpregion.rightConnect && BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX + 1].node.type == NodeType.l) {
                        toRight.keyindex = BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX + 1].node.index;
                        c.visible = true;
                    }
                }
                if (d) {
                    d.conce = true;
                }
                if (u) {
                    u.conce = true;
                }
                if (l) {
                    l.conce = true;
                }
                if (r) {
                    r.conce = true;
                }
            }
            for (let j = 0; j < 5; j++) {
                let tmppool = [];
                for (let i = 0; i < 10; i++) {
                    let tmptile = Laya.Pool.getItemByClass('TileType', Laya.FontClip);
                    tmptile.skin = "Battle/map1.png";
                    tmptile.sheet = "一八匕厂刀儿二几力人 入十又川寸大飞干工弓 广己口马门女山尸士巳 土兀夕小子贝比长车歹 斗厄方风父戈户火见斤";
                    let tmprigid = tmptile.getComponent(Laya.RigidBody);
                    if (!tmprigid) {
                        tmprigid = tmptile.addComponent(Laya.RigidBody);
                    }
                    tmprigid.type = "static";
                    tmprigid.gravityScale = 0;
                    let tmpcld = tmptile.getComponent(Laya.BoxCollider);
                    if (!tmpcld) {
                        tmpcld = tmptile.addComponent(Laya.BoxCollider);
                    }
                    tmpcld.width = tmpcld.height = 96;
                    tmptile.x = 96 * i;
                    tmptile.y = 96 * j;
                    tmppool.push(tmptile);
                }
                this.tilePool.push(tmppool);
                this.ifcanMove = true;
            }
            BattleMaps.currentBattleMap = battlemap;
            for (let j = 0; j < 5; j++) {
                for (let i = 0; i < 10; i++) {
                    if (battlemap[j][i] == 0) {
                        this.mainsp.removeChild(this.tilePool[j][i]);
                    }
                    else {
                        if (regiontype == RegionType.Grass) {
                            this.mainsp.loadImage("Battle/GrassLand.png");
                            this.tilePool[j][i].value = BattleImage.grasstilename[battlemap[j][i]];
                            this.mainsp.addChild(this.tilePool[j][i]);
                        }
                        if (regiontype == RegionType.Desert) {
                            this.mainsp.loadImage("Battle/SandLand.png");
                            this.tilePool[j][i].value = BattleImage.deserttilename[battlemap[j][i]];
                            this.mainsp.addChild(this.tilePool[j][i]);
                        }
                        if (regiontype == RegionType.Lava) {
                            this.mainsp.loadImage("Battle/LavaLand.png");
                            this.tilePool[j][i].value = BattleImage.lavatilename[battlemap[j][i]];
                            this.mainsp.addChild(this.tilePool[j][i]);
                        }
                        if (regiontype == RegionType.Snow) {
                            this.mainsp.loadImage("Battle/SnowLand.png");
                            this.tilePool[j][i].value = BattleImage.snowtilename[battlemap[j][i]];
                            this.mainsp.addChild(this.tilePool[j][i]);
                        }
                    }
                }
            }
            this.enemyFactory.initEnemy(regiontype, enemyforce, battlemap);
        }
        clearTiles() {
            for (let j = 0; j < 5; j++) {
                for (let i = 0; i < 10; i++) {
                    this.mainsp.removeChild(this.tilePool[j][i]);
                    let rg = this.tilePool[j][i].getComponent(Laya.RigidBody);
                    let bc = this.tilePool[j][i].getComponent(Laya.BoxCollider);
                    if (rg) {
                        rg.enabled = false;
                    }
                    if (bc) {
                        bc.enabled = false;
                    }
                    if (bc) {
                        this.tilePool[j][i]._destroyComponent(bc);
                    }
                    if (rg) {
                        this.tilePool[j][i]._destroyComponent(rg);
                    }
                    Laya.Pool.recover('TileType', this.tilePool[j][i]);
                }
            }
        }
    }
    BattleImage.grasstilename = ["", "一", "八", "匕", "厂", "刀", "儿", "二"];
    BattleImage.sandtilename = ["", "入", "十", "又", "川", "寸", "大", "飞"];
    BattleImage.deserttilename = ["", "广", "己", "口", "马", "门", "女", "山"];
    BattleImage.snowtilename = ["", "土", "兀", "夕", "小", "子", "贝", "比"];
    BattleImage.lavatilename = ["", "斗", "厄", "方", "风", "父", "戈", "户"];

    class BattleScene extends Laya.Scene {
        constructor(regionmap) {
            super();
            BattleScene.regionmap = regionmap;
            for (let j = 0; j < regionmap.length; j++) {
                for (let i = 0; i < regionmap[0].length; i++) {
                    if (regionmap[j][i] && regionmap[j][i].node.type == NodeType.e) {
                        BattleScene.tmpMapX = i;
                        BattleScene.tmpMapY = j;
                    }
                }
            }
        }
        createChildren() {
            super.createChildren();
            this.loadScene("BattleScene");
        }
        onAwake() {
            BattleScene.Lv = this.lv;
            BattleScene.battleimagedeal = [];
            BattleScene.battleimagedeal.push(new BattleImage(this.battlesprite1));
            BattleScene.battleimagedeal.push(new BattleImage(this.battlesprite2));
            let tmpregion = BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX];
            BattleScene.battleimagedeal[BattleScene.battleindex].initMap(tmpregion.regiontype, tmpregion.tileArray, tmpregion.enmeyForce);
            BattleScene.battleimagedeal[BattleScene.battleindex].mainsp.visible = true;
            BattleScene.battleimagedeal[1 - BattleScene.battleindex].mainsp.visible = false;
            let playercontroller = this.player.getComponent(Player);
            playercontroller.maxHP = 12;
            playercontroller.HP = 12;
            BattleScene.player = this.player;
            BattleScene.MapImage = new Smallthis(BattleScene.regionmap);
            BattleScene.MapImage.visible = false;
            this.addChild(BattleScene.MapImage);
            BattleScene.MapImage.centerX = 0;
            BattleScene.MapImage.centerY = 0;
            this.map_button.on(Laya.Event.CLICK, BattleScene, () => { BattleScene.MapImage.redraw(BattleScene.tmpMapX, BattleScene.tmpMapY); BattleScene.MapImage.visible = !BattleScene.MapImage.visible; console.log("map"); });
            this.controller = new GameControl(playercontroller);
            BattleScene.hearts = [];
            BattleScene.hearts.push(this.heart1);
            BattleScene.hearts.push(this.heart2);
            BattleScene.hearts.push(this.heart3);
            BattleScene.hearts.push(this.heart4);
            BattleScene.hearts.push(this.heart5);
            BattleScene.hearts.push(this.heart6);
            this.addChild(this.controller);
        }
        static switchMap(delx, dely) {
            BattleScene.MapImage.redraw(BattleScene.tmpMapX, BattleScene.tmpMapY);
            console.log(BattleScene.regionmap);
            let tmpregion = BattleScene.regionmap[BattleScene.tmpMapY][BattleScene.tmpMapX];
            let preindex = BattleScene.battleindex;
            let nowindex = BattleScene.battleindex = 1 - BattleScene.battleindex;
            EnemyFactory.clearEnemey();
            BattleScene.battleimagedeal[preindex].clearTiles();
            BattleScene.battleimagedeal[preindex].mainsp.removeChild(BattleScene.player);
            BattleScene.battleimagedeal[preindex].mainsp.x = -2000;
            BattleScene.battleimagedeal[nowindex].mainsp.x = 0;
            BattleScene.battleimagedeal[nowindex].initMap(tmpregion.regiontype, tmpregion.tileArray, tmpregion.enmeyForce);
            BattleScene.player.x += delx;
            BattleScene.player.y += dely;
            console.log(BattleScene.player);
            BattleScene.battleimagedeal[nowindex].mainsp.addChild(BattleScene.player);
            BattleScene.battleimagedeal[BattleScene.battleindex].mainsp.visible = true;
        }
    }
    BattleScene.battleindex = 0;
    BattleScene.hearts = [];
    BattleScene.tmpMapX = 0;
    BattleScene.tmpMapY = 0;

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("scene/BattleScene.ts", BattleScene);
            reg("character/Character.ts", Character);
            reg("character/Player.ts", Player);
            reg("character/GrassEnemy1.ts", GrassEnemy1);
            reg("character/SnowEnemy1.ts", SnowEnemy1);
            reg("character/SandEnemy1.ts", SandEnemy1);
            reg("character/LavaEnemy1.ts", LavaEnemy1);
            reg("events/toUp.ts", toUp);
            reg("events/toDown.ts", toDown);
            reg("events/toLeft.ts", toLeft);
            reg("events/toRight.ts", toRight);
        }
    }
    GameConfig.width = 960;
    GameConfig.height = 640;
    GameConfig.scaleMode = "showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            let map = Map.generateWorld();
            while (map.length == 0) {
                map = Map.generateWorld();
            }
            let bs = new BattleScene(map);
            Laya.stage.addChild(bs);
        }
        onMapLoaded() {
            this.tMap.setViewPortPivotByScale(0, 0);
            this.tMap.scale = 2;
            console.log(this.tMap);
        }
    }
    new Main();

}());
