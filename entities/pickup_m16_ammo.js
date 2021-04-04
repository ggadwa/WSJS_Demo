import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';

export default class PickupM16Class extends EntityClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,null,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.passThrough=true;           // can pass through
        
            // model
        
        this.modelName='m16';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(8000,8000,8000);
        this.radius=2000;
        this.height=2000;
        this.eyeOffset=0;
        this.weight=250;
        this.modelHideMeshes=['m16_rifle','shutter','trigger','m16_holder_01'];
        
            // physics
            
        this.maxBumpCount=0;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=8;
        this.collisionHeightSegmentCount=2;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;

            // variables
        
        this.originalY=0;
        this.reappearTick=0;
        
        this.pickupSound={"name":"pickup","rate":1.25,"randomRateAdd":0.0,"distance":50000,"loopStart":0,"loopEnd":0,"loop":false};
        
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
        if (this.touchEntity.addClip===undefined) return;
        
            // pickup and add ammo
            
        this.touchEntity.addClip('m16',1);
            
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

