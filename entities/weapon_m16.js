import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import EntityClass from '../../../code/game/entity.js';

export default class WeaponM16Class extends EntityClass
{
    constructor(core,name,json,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,json,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.idleAnimation=null;
        this.idleWalkAnimation=null;
        this.raiseAnimation=null;
        this.lowerAnimation=null;
        this.reloadAnimation=null;
        
        this.available=false;
        this.fireYSlop=0;
        
        this.lastFireTimestamp=0;
        
        this.inStandIdle=false;
        
        this.handOffset=new PointClass(0,0,0);
        this.handAngle=new PointClass(0,0,0);
        this.fireOffsetAdd=new PointClass(0,0,0);
        this.fireAngleAdd=new PointClass(0,0,0);
        this.botFireRange=new BoundClass(0,0);
        
        this.parentIdleAnimation=null;
        this.parentRunAnimation=null; 
        this.parentFireIdleAnimation=null;
        this.parentFireRunAnimation=null;
        this.parentFireFreezeMovement=false;
        
        this.clipCount=0;
        this.ammoInClipCount=0;
        
        this.fireAnimation={"startFrame":128,"endFrame":143,"actionFrame":0,"meshes":null};
        this.fireSound={"name":"m16_fire","rate":1.0,"randomRateAdd":0.4,"distance":25000,"loopStart":0,"loopEnd":0,"loop":false};
        
        this.lastFireTimestamp=0;
            
            // pre-allocates
        
        this.firePoint=new PointClass(0,0,0);
        this.fireAng=new PointClass(0,0,0);
        this.fireVector=new PointClass(0,0,0);
        this.fireHitPoint=new PointClass(0,0,0);
    }

    initialize()
    {
        if (!super.initialize()) return(false);
        
        this.idleAnimation=this.core.game.lookupAnimationValue(this.json.animations.idleAnimation);
        this.idleWalkAnimation=this.core.game.lookupAnimationValue(this.json.animations.idleWalkAnimation);
        this.raiseAnimation=this.core.game.lookupAnimationValue(this.json.animations.raiseAnimation);
        this.lowerAnimation=this.core.game.lookupAnimationValue(this.json.animations.lowerAnimation);
        this.reloadAnimation=this.core.game.lookupAnimationValue(this.json.animations.reloadAnimation);
        
        this.reloadSound=this.core.game.lookupSoundValue(this.json.sounds.reloadSound);
       
            // model setup, skip if no model
            
        if (this.model!==null) {
            this.handOffset=new PointClass(this.json.config.handOffset.x,this.json.config.handOffset.y,this.json.config.handOffset.z);
            this.handAngle=new PointClass(this.json.config.handAngle.x,this.json.config.handAngle.y,this.json.config.handAngle.z);
        }
        
            // fire setup
        
        this.fireOffsetAdd=new PointClass(this.json.config.fireOffsetAdd.x,this.json.config.fireOffsetAdd.y,this.json.config.fireOffsetAdd.z);
        this.fireAngleAdd=new PointClass(this.json.config.fireAngleAdd.x,this.json.config.fireAngleAdd.y,this.json.config.fireAngleAdd.z);
                    
            // misc bot setup
            
        this.botFireRange.setFromValues(this.json.config.botFireRange[0],this.json.config.botFireRange[1]);
        
            // some items added to entity so fire methods
            // can have access to parent animations
            
        this.parentIdleAnimation=null;
        this.parentRunAnimation=null; 
        this.parentFireIdleAnimation=null;
        this.parentFireRunAnimation=null;
        this.parentFireFreezeMovement=false;
        
        return(true);    
    }
    
    ready()
    {
        super.ready();
        
        this.available=this.initiallyAvailable;
        
        this.clipCount=4;
        this.ammoInClipCount=25;
        
        this.lastFireTimestamp=0;
        
        this.inStandIdle=false
        if (this.model!==null) this.queueIdleAnimation();
    }
    
        //
        // ammo
        //
        
    addClip(count)
    {
        if (this.heldBy===this.core.game.map.entityList.getPlayer()) this.pulseElement('m16_bullet',500,10);
        
        this.clipCount+=count;
        if (this.clipCount>12) this.clipCount=12;
    }
    
    addAmmo(count)
    {
        if (this.heldBy===this.core.game.map.entityList.getPlayer()) this.pulseElement('m16_bullet',500,10);
        
        this.ammoInClipCount+=count;
        if (this.ammoInClipCount>25) this.ammoInClipCount=25;
    }
    
    hasAnyAmmo()
    {
        if (this.clipCount===0) return(false);
        return(this.ammoInClipCount!==0);
    }
    
        //
        // animation utilities
        //
        
    queueIdleAnimation()
    {
        if (this.model===null) return;
        
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
        if (this.model===null) return;
        
        this.inStandIdle=true;
        if (this.idleAnimation!==null) this.startAnimation(this.idleAnimation);
    }
    
    setIdleAnimation()
    {
        let nextStandIdle;
        
        if (this.model===null) return;
        
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
        if (this.model===null) return(0);
        
        if (this.lowerAnimation!=null) {
            this.startAnimation(this.lowerAnimation);
            this.queueIdleAnimation();
            return(this.getAnimationTickCount(this.lowerAnimation));
        }
        
        return(0);
    }
    
    runRaiseAnimation()
    {
        if (this.model===null) return;
        
        if (this.raiseAnimation!=null) {
            this.startAnimation(this.raiseAnimation);
            this.queueIdleAnimation();
            return(this.getAnimationTickCount(this.raiseAnimation));
        }
        
        return(0);
    }
    
    runReloadAnimation()
    {
        if (this.model===null) return;
        
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
        let y;
        
            // the hit scan
          
        this.firePoint.setFromPoint(firePosition);
        this.fireAng.setFromAddPoint(fireAngle,this.fireAngleAdd);
        
        this.fireVector.setFromValues(0,0,100000);
        this.fireVector.rotateX(null,this.fireAng.x);
        
        y=this.fireAng.y;
        if (this.fireYSlop!==0) {
            y+=(this.fireYSlop-(Math.random()*(this.fireYSlop*2)));
            if (y<0) y=360+y;
            if (y>360) y-=360;
        }
        this.fireVector.rotateY(null,y);
        
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
        
            // parent animation
            /*
        if (parentEntity.model!==null) {
            if (!parentEntity.isAnimationQueued()) {   // don't do this if we have a queue, which means another fire is still going on
                if ((parentEntity.movement.x!==0) || (parentEntity.movement.z!==0)) {
                    if (this.fireAnimation!==null) {
                        parentEntity.interuptAnimation(this.parentFireRunAnimation);
                        if ((this.parentFireFreezeMovement) && (parentEntity.movementFreezeTick!==undefined)) {
                            parentEntity.movementFreezeTick=this.core.game.timestamp+parentEntity.getAnimationTickCount(this.parentFireRunAnimation);
                        }
                    }
                }
                else {
                    if (this.parentFireIdleAnimation!==null) parentEntity.interuptAnimation(this.parentFireIdleAnimation);
                }
            }
        }
        */
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
        
    run()
    {
        super.run();
        
            // update any UI if player
            
        if (this.heldBy===this.core.game.map.entityList.getPlayer()) {
            this.showElement('m16_crosshair',((this.show)&&(this.cameraIsFirstPerson())));
            this.updateText('m16_clip_count',this.clipCount);
            this.updateText('m16_bullet_count',this.ammoInClipCount);
        }
    }
        
    drawSetup()
    {
        this.setModelDrawAttributes(this.handOffset,this.handAngle,this.scale,true);
        return(this.cameraIsFirstPerson());
    }

}
