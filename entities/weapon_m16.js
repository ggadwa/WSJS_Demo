import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import EntityClass from '../../../code/game/entity.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';

export default class WeaponM16Class extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
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
            
        this.idleAnimation=new AnimationDefClass(76,126,0);
        this.fireAnimation=new AnimationDefClass(128,143,0);
        this.idleWalkAnimation=new AnimationDefClass(300,336,0);
        this.raiseAnimation=new AnimationDefClass(0,24,0);
        this.lowerAnimation=new AnimationDefClass(25,49,0);
        this.reloadAnimation=new AnimationDefClass(149,299,0)
                    .addMeshHide('m16_holder_01',[[187,225]])
                    .addMeshHide('m16_holder_02',[[0,187],[225,299]])
                    .addMeshHide('m16_bullet',[[0,187],[225,299]])
                    .addMeshHide('m16_bullet01',[[0,187],[225,299]])
                    .addMeshHide('m16_bullet02',[[0,187],[225,299]])
                    .addMeshHide('m16_bullet03',[[0,187],[225,299]]);
        
            // sounds
            
        this.fireSound=new SoundDefClass('m16_fire',1.0,0.4,25000,0,0,false);
        this.reloadSound=new SoundDefClass('m16_reload',1.0,0.0,7000,0,0,false);
            
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
        return((this.lastFireTimestamp+200)>this.getTimestamp());
    }
    
    fire(firePosition,fireAngle)
    {
        let parentEntity=this.heldBy;
        
        if (this.ammoInClipCount===0) return(false);
            
        if (this.isFirePaused()) return(false);
        this.lastFireTimestamp=this.getTimestamp();
        
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
