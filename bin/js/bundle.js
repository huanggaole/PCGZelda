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

    var Direction;
    (function (Direction) {
        Direction[Direction["None"] = 0] = "None";
        Direction[Direction["UP"] = 1] = "UP";
        Direction[Direction["Down"] = 2] = "Down";
        Direction[Direction["Left"] = 3] = "Left";
        Direction[Direction["Right"] = 4] = "Right";
    })(Direction || (Direction = {}));
    class Region {
        constructor(_index) {
            this.index = _index;
            this.upConnect = false;
            this.downConnect = false;
            this.leftConnect = false;
            this.rightConnect = false;
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
            for (let i = 0; i < 6; i++) {
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
            for (let i = 0; i < 5; i++) {
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
                for (let i = 0; i < oriG.nodes[index].pointTo.length; i++) {
                    let randomUindex = Math.floor(Math.random() * unoccupied.length);
                    let newGridindex = unoccupied[randomUindex];
                    unoccupied = unoccupied.filter(item => item != newGridindex);
                    res = res && this.setGrid(oriG, oriG.nodes[index].pointTo[i], map, size, newGridindex, [], rect);
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
            while (true) {
                let initindex = Math.floor(size / 2) * size + Math.floor(size / 2);
                let minx = initindex % size;
                let maxx = initindex % size;
                let miny = (initindex - minx) / size;
                let maxy = (initindex - maxx) / size;
                let rect = { minx, maxx, miny, maxy };
                let res = this.setGrid(oriG, 0, map, size, initindex, [], rect);
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
                                if (j > 0) {
                                    let tmpmap = map[(j - 1)][i];
                                    if (tmpmap != null) {
                                        let tmpindex = tmpmap.index;
                                        if (pointto.indexOf(tmpindex) > -1) {
                                            curmap.upConnect = true;
                                            tmpmap.downConnect = true;
                                        }
                                    }
                                }
                                if (j < height - 1) {
                                    let tmpmap = map[(j + 1)][i];
                                    if (tmpmap != null) {
                                        let tmpindex = tmpmap.index;
                                        if (pointto.indexOf(tmpindex) > -1) {
                                            curmap.downConnect = true;
                                            tmpmap.upConnect = true;
                                        }
                                    }
                                }
                                if (i > 0) {
                                    let tmpmap = map[j][i - 1];
                                    if (tmpmap != null) {
                                        let tmpindex = tmpmap.index;
                                        if (pointto.indexOf(tmpindex) > -1) {
                                            curmap.leftConnect = true;
                                            tmpmap.rightConnect = true;
                                        }
                                    }
                                }
                                if (i < width - 1) {
                                    let tmpmap = map[j][i + 1];
                                    if (tmpmap != null) {
                                        let tmpindex = tmpmap.index;
                                        if (pointto.indexOf(tmpindex) > -1) {
                                            curmap.rightConnect = true;
                                            tmpmap.leftConnect = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
            }
            return map;
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
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
            console.log(map);
        }
    }
    new Main();

}());
