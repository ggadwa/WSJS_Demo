import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';

export default class PickupM16Class extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
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
        this.modelHideMeshes=['m16_holder_02','m16_bullet','m16_bullet01','m16_bullet02','m16_bullet04','m16_bullet05','m16_bullet06','m16_bullet07','m16_bullet08'];
        
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
        
        this.pickupSound=new SoundDefClass('pickup',1.0,0.0,50000,0,0,false);
        
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
        let timestamp=this.getTimestamp();
        
        super.run();
        
            // if hidden, count down to show
            // unless pickupOnce is on
            
        if (!this.show) {
            if (this.data.pickupOnce) return;
            if (timestamp<this.reappearTick) return;

            this.touchEntity=null;          // clear any touches
            this.show=true;
        }
        
            // animation

        this.position.y=this.originalY+this.getPeriodicCos(5000,200);
        this.angle.y=this.getPeriodicLinear(5000,360);
        
            // check for collisions from
            // entities that has weapon
            
        if (this.touchEntity===null) return;
        if (this.touchEntity.m16Weapon===undefined) return;
        
            // pickup and add weapon or clip
        
        if (this.touchEntity.m16Weapon.available) {
            this.touchEntity.addM16Clip(1);
        }
        else {
            this.touchEntity.addM16Weapon();
        }
        
        this.show=false;
        this.reappearTick=timestamp+10000;
        
        this.touchEntity.playSound(this.pickupSound);
    }
    
    drawSetup()
    {
        this.setModelDrawAttributes(this.position,this.angle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}

