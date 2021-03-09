import Player from "../character/Player";

// import Util from "../config/util";
// import { Player } from "../GameObject/Character/Player";

export class GameControl extends Laya.Image{
    dirR:Laya.Sprite;
    proR:Laya.Sprite;
    player:Player;
    // constructor(_player,_btn_attack){
    constructor(_player:Player){
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

    public onMouseDown() {
        this.dirR.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        this.dirR.alpha = 0.6;
        this.dirR.graphics.drawCircle(0, -80, 25, "#A9AAAB");
        this.proR.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        this.proR.alpha = 0.5;
        this.dirR.visible = true;
        this.proR.visible = true;
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
    }
    private onMouseUp() {
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        this.player.setDirection(0,0);
        this.dirR.visible = false;
        this.proR.visible = false;
    }
    private dis(ax: number, ay: number, bx: number, by: number): number {
        let dx = ax - bx;
        let dy = ay - by;
        return Math.sqrt(dx * dx + dy * dy);
    }
    private onMouseMove(e: MouseEvent) {
        let dis = this.dis(this.proR.x, this.proR.y, Laya.stage.mouseX, Laya.stage.mouseY);
        let ang = Math.atan2(Laya.stage.mouseY - this.proR.y, Laya.stage.mouseX - this.proR.x);
        // ang = Math.round(ang / (Math.PI / 6)) * (Math.PI / 6);
        if (dis < 200){
            if (dis > 50) {
                this.dirR.pos(this.proR.x + Math.cos(ang) * 50, this.proR.y + Math.sin(ang) * 50);
                this.player.setDirection(Math.cos(ang),(Math.sin(ang)));
            } else {
                this.dirR.pos(Laya.stage.mouseX, Laya.stage.mouseY);
                this.player.setDirection(Math.cos(ang) * dis / 50 ,(Math.sin(ang) * dis / 50));
            }
        }
    }
}