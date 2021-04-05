export default class BulletFactory{
    static mainsp:Laya.Sprite;
    static bulletlist = [];
    constructor(battlesprite:Laya.Sprite){
        BulletFactory.mainsp = battlesprite;
    }

    static initBullet(BulletScript,x:number,y:number,dirx:number,diry:number){

        let bl = Laya.Pool.getItemByClass('BulletType',Laya.Image) as Laya.Image;
        
        bl.skin = BulletScript.skin;
        
        let rot = 0;
        if(dirx == 0){
            if(diry > 0){
                rot = 90;
            }else{
                rot = 270;
            }
        }else{
            rot = Math.atan2(diry,dirx) * 180 / 3.1415926;
        }
        bl.rotation = rot;
        
        bl.x = x + 24 - BulletScript.width / 2;
        bl.y = y + 24 - BulletScript.height / 2;

        BulletFactory.mainsp.addChild(bl);
        
        bl.scale(BulletScript.scale,BulletScript.scale);
        let rigid = bl.getComponent(Laya.RigidBody) as Laya.RigidBody;
        if(!rigid){
            rigid = bl.addComponent(Laya.RigidBody) as Laya.RigidBody;
        }
        rigid.type = "dynamic";
        rigid.gravityScale = 0;
        rigid.setVelocity({x:dirx * BulletScript.speed,y:diry * BulletScript.speed});
        let collider = bl.getComponent(Laya.BoxCollider) as Laya.BoxCollider;
        if(!collider){
            collider = bl.addComponent(Laya.BoxCollider) as Laya.BoxCollider;
        }
        collider.width = BulletScript.width;
        collider.height = BulletScript.height;
        collider.isSensor = true;
        let bs = bl.getComponent(Laya.Script);
        if(!bs){
            bs = bl.addComponent(BulletScript);    
        }
        bs = new BulletScript();
        BulletFactory.bulletlist.push(bl);
    }

    static clearBullet(){
        for(let i = 0; i < BulletFactory.bulletlist.length; i++){
            Laya.Pool.recover('BulletType',BulletFactory.bulletlist[i]);
            this.mainsp.removeChild(BulletFactory.bulletlist[i]);
        }
        BulletFactory.bulletlist = [];
    }
}