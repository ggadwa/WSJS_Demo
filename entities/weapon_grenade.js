import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import EntityClass from '../../../code/game/entity.js';

export default class WeaponGrenadeClass extends EntityClass
{
    constructor(core,name,json,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,json,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.idleAnimation=null;
        this.idleWalkAnimation=null;
        this.raiseAnimation=null;
        this.lowerAnimation=null;
        this.reloadAnimation=null;
        
        this.interfaceCrosshair=null;
        
        this.initiallyAvailable=false;
        this.available=false;
        
        this.lastFireTimestamp=0;
        
        this.inStandIdle=false;
        
        this.botFireRange=new BoundClass(0,0);
        
        this.parentIdleAnimation=null;
        this.parentRunAnimation=null; 
        this.parentFireIdleAnimation=null;
        this.parentFireRunAnimation=null;
        this.parentFireFreezeMovement=false;
        
        this.ammoCount=0;
        
        this.fireSound={"name":"throw","rate":1.0,"randomRateAdd":0,"distance":10000,"loopStart":0,"loopEnd":0,"loop":false};
        
        this.lastFireTimestamp=0;
            
            // pre-allocates
        
        this.firePoint=new PointClass(0,0,0);
        this.fireAng=new PointClass(0,0,0);
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
        
        this.ammoCount=3;
        
        this.lastFireTimestamp=0;
        
        this.inStandIdle=false
        if (this.model!==null) this.queueIdleAnimation();
    }
    
        //
        // ammo
        //
        
    addClip(count)
    {
    }
    
    addAmmo(count)
    {
        if (this.heldBy===this.core.game.map.entityList.getPlayer()) this.pulseElement('grenade',500,10);
        
        this.ammoCount+=count;
        if (this.ammoCount>5) this.ammoCount=5;
    }
    
    hasAnyAmmo()
    {
        return(this.ammoCount!==0);
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
        // firing
        //
        
    isFirePaused()
    {
        return((this.lastFireTimestamp+1000)>this.core.game.timestamp);
    }
    
    fire(firePosition,fireAngle)
    {
        let projEntity;
        let parentEntity=this.heldBy;
        
        if (this.ammoCount===0) return(false);
            
        if (this.isFirePaused()) return(false);
        this.lastFireTimestamp=this.core.game.timestamp;
        
            // fire
            
        this.ammoCount--;
        
        this.playSoundAtPosition(firePosition,this.fireSound);
           
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
        
            // fire position
            
        this.firePoint.setFromValues(0,-500,3500);
        
        this.fireAng.setFromPoint(fireAngle);
        this.fireAng.x+=5.0;           // up slightly
        this.firePoint.rotateX(null,this.fireAng.x);
        this.firePoint.rotateY(null,this.fireAng.y);
        
        this.firePoint.addPoint(firePosition);
        
            // spawn from whatever is holding this weapon
            // so it counts as the spawnBy for any damage calculations, etc

        projEntity=this.addEntity('projectile_grenade','projectile_grenade',this.firePoint,this.fireAng,null,parentEntity,null,true);
        if (projEntity!==null) projEntity.ready();

        return(true);
    }
    
        //
        // clip changes
        //
     
    needClipChange()
    {
        return(false);
    }
    
    changeClip(position)
    {
    }
    
        //
        // main run
        //
        
    run()
    {
        super.run();
        
            // update any UI if player
            
        if (this.heldBy===this.core.game.map.entityList.getPlayer()) {
            this.updateText('grenade_count',this.ammoCount);
        }
    }
        
    drawSetup()
    {
        return(false);
    }

}
