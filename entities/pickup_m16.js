import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';

export default class PickupM16Class extends EntityClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.passThrough=true;           // can pass through
        
        this.originalY=0;
        this.reappearTick=0;
        
        this.pickupSound={"name":"pickup","rate":1.0,"randomRateAdd":0.0,"distance":50000,"loopStart":0,"loopEnd":0,"loop":false};
        
        Object.seal(this);
    }
    
    ready()
    {
        super.ready();
        
        this.reappearTick=0;
        this.originalY=this.position.y;
    }
    
    run()
    {
        super.run();
        
            // if hidden, count down to show
            // unless pickupOnce is on
            
        if (!this.show) {
            if (this.data.pickupOnce) return;
            if (this.core.game.timestamp<this.reappearTick) return;

            this.touchEntity=null;          // clear any touches
            this.show=true;
        }
        
            // animation

        this.position.y=this.originalY+this.core.game.getPeriodicCos(5000,200);
        this.angle.y=this.core.game.getPeriodicLinear(5000,360);
        
            // check for collisions from
            // entities that can add ammo
            
        if (this.touchEntity===null) return;
        if (this.touchEntity.addWeapon===undefined) return;
        
            // pickup and add ammo
            
        this.touchEntity.addWeapon('m16');
            
        this.show=false;
        this.reappearTick=this.core.game.timestamp+5000;
        
        this.touchEntity.playSound(this.pickupSound);
    }
    
    drawSetup()
    {
        this.setModelDrawAttributes(this.position,this.angle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}
