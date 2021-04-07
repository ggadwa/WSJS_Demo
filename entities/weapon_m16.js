import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import EntityClass from '../../../code/game/entity.js';

export default class WeaponM16Class extends EntityClass
{
    constructor(core,name,json,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,null,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
        
        this.modelName='hand_m16';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(5000,5000,5000);
        this.radius=5000;
        this.height=11000;
        this.eyeOffset=0;
        this.weight=0;
        this.modelHideMeshes=['m16_holder_02','m16_bullet','m16_bullet01','m16_bullet02','m16_bullet03'];
        
            // physics
            
        this.maxBumpCount=0;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=8;
        this.collisionHeightSegmentCount=2;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;

            // variables
        
        this.available=false;
        
        this.clipCount=0;
        this.ammoInClipCount=0;
        this.lastFireTimestamp=0;
        
        this.inStandIdle=false;
        
        this.handOffset=new PointClass(0,-8500,-2000);
        this.handAngle=new PointClass(0,-20,0);
        
            // animations
            
        this.idleAnimation={"startFrame":76,"endFrame":126,"actionFrame":0,"meshes":null};
        this.fireAnimation={"startFrame":128,"endFrame":143,"actionFrame":0,"meshes":null};
        this.idleWalkAnimation={"startFrame":300,"endFrame":336,"actionFrame":0,"meshes":null};
        this.raiseAnimation={"startFrame":0,"endFrame":24,"actionFrame":0,"meshes":null};
        this.lowerAnimation={"startFrame":25,"endFrame":49,"actionFrame":0,"meshes":null};
        this.reloadAnimation={
                    "startFrame":149,
                    "endFrame":299,
                    "meshes":
                        [
                            {"name":"m16_holder_01","hide":[[187,225]]},
                            {"name":"m16_holder_02","hide":[[0,187],[225,299]]},
                            {"name":"m16_bullet","hide":[[0,187],[225,299]]},
                            {"name":"m16_bullet01","hide":[[0,187],[225,299]]},
                            {"name":"m16_bullet02","hide":[[0,187],[225,299]]},
                            {"name":"m16_bullet03","hide":[[0,187],[225,299]]}
                        ]
                };
        
            // sounds
            
        this.fireSound={"name":"m16_fire","rate":1.0,"randomRateAdd":0.4,"distance":25000,"loopStart":0,"loopEnd":0,"loop":false};
        this.reloadSound={"name":"m16_reload","rate":1.0,"randomRateAdd":0.0,"distance":7000,"loopStart":0,"loopEnd":0,"loop":false};
            
            // pre-allocates
        
        this.firePoint=new PointClass(0,0,0);
        this.fireVector=new PointClass(0,0,0);
        this.fireHitPoint=new PointClass(0,0,0);
    }

    ready()
    {
        super.ready();
        
        this.clipCount=4;
        this.ammoInClipCount=25;
        
        this.lastFireTimestamp=0;
        
        this.inStandIdle=false
        this.queueIdleAnimation();
    }
    
        //
        // ammo
        //
        
    addClip(count)
    {
        this.clipCount+=count;
        if (this.clipCount>12) this.clipCount=12;
    }
    
    addAmmo(count)
    {
        this.ammoInClipCount+=count;
        if (this.ammoInClipCount>25) this.ammoInClipCount=25;
    }
    
        //
        // animation utilities
        //
        
    queueIdleAnimation()
    {
        if (this.heldBy!==null) {
            this.inStandIdle=(this.heldBy.movement.length()===0)||(this.idleWalkAnimation===null);
        }
        
        if (this.inStandIdle) {
            if (this.idleAnimation!==null) this.queueAnimation(this.idleAnimation);
        }
        else {
            this.queueAnimation(this.idleWalkAnimation);    
        }
    }
    
    startIdleAnimation()
    {
        this.inStandIdle=true;
        if (this.idleAnimation!==null) this.startAnimation(this.idleAnimation);
    }
    
    setIdleAnimation()
    {
        let nextStandIdle;
        
        nextStandIdle=true;
        
        if (this.heldBy!==null) {
            nextStandIdle=(this.heldBy.movement.length()===0)||(this.idleWalkAnimation===null);
        }
        
        if (nextStandIdle===this.inStandIdle) return;
        
        this.inStandIdle=nextStandIdle;
        
        if (this.inStandIdle) {
            if (this.idleAnimation!==null) this.startAnimation(this.idleAnimation);
        }
        else {
            this.startAnimation(this.idleWalkAnimation);    
        }
    }
    
    runLowerAnimation()
    {
        if (this.lowerAnimation!=null) {
            this.startAnimation(this.lowerAnimation);
            this.queueIdleAnimation();
            return(this.getAnimationTickCount(this.lowerAnimation));
        }
        
        return(0);
    }
    
    runRaiseAnimation()
    {
        if (this.raiseAnimation!=null) {
            this.startAnimation(this.raiseAnimation);
            this.queueIdleAnimation();
            return(this.getAnimationTickCount(this.raiseAnimation));
        }
        
        return(0);
    }
    
    runReloadAnimation()
    {
        if (this.reloadAnimation!=null) {
            this.startAnimation(this.reloadAnimation);
            this.queueIdleAnimation();
            return(this.getAnimationTickCount(this.reloadAnimation));
        }
        
        return(0);
    }
    
        //
        // hit scans
        //
        
    hitScan(parentEntity,firePosition,fireAngle)
    {
            // the hit scan
          
        this.firePoint.setFromPoint(firePosition);
        
        this.fireVector.setFromValues(0,0,100000);
        this.fireVector.rotateX(null,fireAngle.x);
        this.fireVector.rotateY(null,fireAngle.y);
        
        if (parentEntity.rayCollision(this.firePoint,this.fireVector,this.fireHitPoint)) {
            
                // is this an entity we can hit?
                
            if (parentEntity.hitEntity) {
                if (parentEntity.hitEntity.damage!==undefined) {
                    parentEntity.hitEntity.damage(parentEntity,5,this.fireHitPoint);
                }
            }
            
                // hit effect
                // push effect point towards entity firing so it shows up better

            this.fireVector.normalize();
            this.fireVector.scale(-100);
            this.fireHitPoint.addPoint(this.fireVector);
            this.addEffect(this,'hit',this.fireHitPoint,null,true);
        }
    }
    
        //
        // firing
        //
        
    isFirePaused()
    {
        return((this.lastFireTimestamp+200)>this.core.game.timestamp);
    }
    
    fire(firePosition,fireAngle)
    {
        let parentEntity=this.heldBy;
        
        if (this.ammoInClipCount===0) return(false);
            
        if (this.isFirePaused()) return(false);
        this.lastFireTimestamp=this.core.game.timestamp;
        
            // fire
            
        this.ammoInClipCount--;
        
        this.playSoundAtPosition(firePosition,this.fireSound);
           
           // weapon animation
           
        this.startAnimation(this.fireAnimation);
        this.queueIdleAnimation();

            // and the fire method
            
        this.hitScan(parentEntity,firePosition,fireAngle);

        return(true);
    }
    
        //
        // clip changes
        //
     
    needClipChange()
    {
        if (this.clipCount===0) return(false);
        return(this.ammoInClipCount===0);
    }
    
    changeClip(position)
    {
            // update the clip
            
        this.clipCount--;
        this.ammoInClipCount=25;
        
            // play sound and animation
            
        this.playSoundAtPosition(position,this.reloadSound);
        return(this.runReloadAnimation());
    }
    
        //
        // main run
        //
        
    drawSetup()
    {
        this.setModelDrawAttributes(this.handOffset,this.handAngle,this.scale,true);
        return(this.cameraIsFirstPerson());
    }

}
