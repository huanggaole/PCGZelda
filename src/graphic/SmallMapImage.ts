import Region,{RegionType} from "../script/Region";
import {NodeType} from "../script/Node"
export default class Smallthis extends Laya.Image{
    constructor(map:Region[][]){
        super();
        let width = map[0].length;
		let height = map.length;
		let gridwidth = 60;
		let gridheight = 30;
		let marginwidth = 10;
		let marginheight = 5;
		this.width = gridwidth * width;
		this.height = 20 * height;
		for(let j = 0; j < height; j++){
			for(let i = 0; i < width; i++){
				if(map[j][i]==null){
					// this.graphics.drawRect(i*gridwidth,j*gridheight,gridwidth,gridheight,"#0000ff","#0000ff");
				}else{
					let tmpmap = map[j][i] as Region;
					let groundcolor = "#00ff00";
					let barriercolor = "#00cc00";
					if(tmpmap.regiontype == RegionType.Snow){
						groundcolor = "#ffffff";
						barriercolor = "#cccccc";
					}else if(tmpmap.regiontype == RegionType.Desert){
						groundcolor = "#ffff00";
						barriercolor = "#cccc00";
					}else if(tmpmap.regiontype == RegionType.Lava){
						groundcolor = "#9f8f8f";
						barriercolor = "#0c0c0c";
					}
					this.graphics.drawRect(i*gridwidth,j*gridheight,gridwidth,gridheight,groundcolor,groundcolor);
					if(tmpmap.upConnect){
						this.graphics.drawRect(i*gridwidth,j*gridheight,marginwidth,marginheight,barriercolor,barriercolor);
						this.graphics.drawRect(i*gridwidth + (gridwidth - marginwidth),j*gridheight,marginwidth,marginheight,barriercolor,barriercolor);						
					}else{
						this.graphics.drawRect(i*gridwidth,j*gridheight,gridwidth,marginheight,barriercolor,barriercolor);
					}

					if(tmpmap.downConnect){
						this.graphics.drawRect(i*gridwidth,j*gridheight + (gridheight - marginheight),marginwidth,marginheight,barriercolor,barriercolor);
						this.graphics.drawRect(i*gridwidth + (gridwidth - marginwidth),j*gridheight + (gridheight - marginheight),marginwidth,marginheight,barriercolor,barriercolor);						
					}else{
						this.graphics.drawRect(i*gridwidth,j*gridheight + (gridheight - marginheight), gridwidth,marginheight,barriercolor,barriercolor);
					}

					if(tmpmap.leftConnect){
						this.graphics.drawRect(i*gridwidth,j*gridheight,marginheight,marginheight,barriercolor,barriercolor);
						this.graphics.drawRect(i*gridwidth,j*gridheight + (gridheight - marginheight),marginheight,marginheight,barriercolor,barriercolor);						
					}else{
						this.graphics.drawRect(i*gridwidth,j*gridheight,marginheight,gridheight,barriercolor,barriercolor);
					}

					if(tmpmap.rightConnect){
						this.graphics.drawRect(i*gridwidth + (gridwidth - marginheight),j * gridheight,marginheight,marginheight,barriercolor,barriercolor);
						this.graphics.drawRect(i*gridwidth + (gridwidth - marginheight),j * gridheight + (gridheight - marginheight),marginheight,marginheight,barriercolor,barriercolor);							
					}else{
						this.graphics.drawRect(i*gridwidth + (gridwidth - marginheight),j * gridheight,marginheight,gridheight,barriercolor,barriercolor);
					}

					if(tmpmap.node.type == NodeType.e){
						this.graphics.fillText("🦸",i*gridwidth + gridwidth / 2.0,j * gridheight + gridheight * 0.3,"20px Arial","#000000","center")
					}

					if(tmpmap.node.type == NodeType.b){
						this.graphics.fillText("👹",i*gridwidth + gridwidth / 2.0,j * gridheight + gridheight * 0.3,"20px Arial","#000000","center")
					}

					if(tmpmap.node.type == NodeType.g){
						this.graphics.fillText("👸",i*gridwidth + gridwidth / 2.0,j * gridheight + gridheight * 0.3,"20px Arial","#000000","center")
					}

					if(tmpmap.node.type == NodeType.k){
						this.graphics.fillText("🔑" + tmpmap.node.keyTo[0],i*gridwidth + gridwidth / 2.0,j * gridheight + gridheight * 0.3,"20px Arial","#000000","center")
					}
					if(tmpmap.node.type == NodeType.l){
						this.graphics.fillText("🔒" + tmpmap.node.index,i*gridwidth + gridwidth / 2.0,j * gridheight + gridheight * 0.3,"20px Arial","#000000","center")
					}
				}
			}
		}
    }
}