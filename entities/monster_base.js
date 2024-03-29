import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import BoundClass from '../../../code/utility/bound.js';
import EntityClass from '../../../code/game/entity.js';

//
// base monster class
//

export default class MonsterBaseClass extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.STATE_HIDDEN=0;
        this.STATE_ASLEEP=1;
        this.STATE_WAKING_UP=2;
        this.STATE_IDLE=3;
        this.STATE_STALKING=4;
        this.STATE_HURT=5;
        this.STATE_MELEE=6;
        this.STATE_PROJECTILE=7;
        this.STATE_DYING=8;
        this.STATE_DEAD=9;
        
        this.state=this.STATE_ASLEEP;
        
        this.health=0;
        this.startHealth=0;
        this.startAsleep=false;
        this.wakeUpDistance=0;
        this.wakeUpOnOtherWakeUpDistance=0;
        this.idleDistance=0;
        this.meleeDistance=0;
        this.meleeWaitTick=0;
        this.nextMeleeTick=0;
        this.meleeDamage=0;
        this.projectileDistance=0;
        this.projectileWaitTick=0;
        this.nextProjectileTick=0;
        this.projectileStartTick=-1;
        this.projectileFirePosition=null;
        this.projectileJson=null;
        this.projectileData=null;
        this.projectileRequiresSight=true;
        this.noSelfDamage=false;
        this.hitAnimationPercentage=1.0;
        this.maxTurnSpeed=0;
        this.forwardAcceleration=0;
        this.forwardDeceleration=0;
        this.forwardMaxSpeed=0;
        this.reverseAcceleration=0;
        this.reverseDeceleration=0;
        this.reverseMaxSpeed=0;
        this.sideAcceleration=0;
        this.sideDeceleration=0;
        this.sideMaxSpeed=0;
        this.damageSpeedFactor=0;
        this.slideMoveTick=0;
        this.canBump=true;
        this.canSlide=true;
        this.canBePushed=false;
        this.angleYProjectileRange=5;
        this.angleYMeleeRange=15;
        this.jumpWaitTick=0;
        this.jumpWaitTickRandomAdd=0;
        this.nextJumpTick=0;
        this.jumpHeight=0;
        this.nextDamageTick=0;        
        
        this.idlePath=null;
        this.stalkByPath=false;
        this.seekNodeDistanceSlop=0;
        this.seekNodeAngleSlop=0;
        this.seekPauseDistance=0;
       
        this.sleepAnimation=null;
        this.wakeUpAnimation=null;
        this.idleAnimation=null;
        this.walkAnimation=null;
        this.meleeLeftAnimation=null;
        this.meleeRightAnimation=null;
        this.projectileAnimation=null;
        this.hitAnimation=null;
        this.dieAnimation=null;
        
        this.wakeUpSound=null;
        this.hurtSound=null;
        this.meleeSound=null;
        this.deathSound=null;
        this.fallSound=null;
        
        this.fallSoundNextTick=0;
        this.meleeHitNextTick=0;
        this.projectileFireNextTick=0;
        
        this.lastInLiquidIdx=-1;
        
        this.slideDirection=0;
        this.slideNextTick=0;
        
        this.movementFreezeNextTick=0;
        
        this.wakeUpSetTriggerName=null;
        this.deathSetTriggerName=null;
        this.showTriggerName=null;
        
        this.animationFinishTick=0;
        this.noiseFinishTick=0;
        
        this.nextNodeIdx=-1;
        this.playerNodeIdx=-1;
        this.idlePathIdx=0;
        this.idleGoalNodeIdx=-1;
        
            // pre-allocations

        this.movement=new PointClass(0,0,0);
        this.sideMovement=new PointClass(0,0,0);
        this.pushMovement=new PointClass(0,0,0);
        this.rotMovement=new PointClass(0,0,0);
        this.origPosition=new PointClass(0,0,0);
        
        this.firePosition=new PointClass(0,0,0);
        this.fireAngle=new PointClass(0,0,0);
        this.fireVector=new PointClass(0,0,0);
        this.fireHitPoint=new PointClass(0,0,0);
    }

    ready()
    {
        super.ready();
        
        this.health=this.startHealth;
        
            // misc
            
        this.lastInLiquidIdx=-1;
        this.slideNextTick=0;
        this.movementFreezeNextTick=0;
        this.animationFinishTick=0;
        this.noiseFinishTick=0;
        
        this.pushMovement.setFromValues(0,0,0);
            
            // start proper state
            
        if (this.showTriggerName!==null) {
            this.goHidden();
        }
        else {
            if (this.startAsleep) {
                this.goAsleep();
            }
            else {
                this.goIdle();
            }
        }
    }
    
        //
        // projectile fire setup
        //
        
    projectileSetupFire(player)
    {
        this.firePosition.setFromPoint(this.projectileFirePosition);
        this.firePosition.rotateY(null,this.angle.y);
        this.firePosition.addPoint(this.position);
        
        this.fireAngle.setFromPoint(this.angle);
        this.fireAngle.x=this.position.getLookAngleTo(player.position);
    }
    
        //
        // state changes
        //
        
    goHidden()
    {
        this.state=this.STATE_HIDDEN;
        
        this.startAnimation(this.idleAnimation);
    }
    
    goAsleep()
    {
        this.state=this.STATE_ASLEEP;
        
        this.startAnimation(this.sleepAnimation);
    }   
        
    goWakeUp(noRecurse)
    {
        let entity;
        let entities;
        
            // wake this monster up
            
        this.state=this.STATE_WAKING_UP;
        
        this.startAnimation(this.wakeUpAnimation);
        this.animationFinishTick=this.getTimestamp()+this.getAnimationTickCount(this.wakeUpAnimation);
        
        this.playSound(this.wakeUpSound);
        if (this.wakeUpSetTriggerName!==null) this.setTrigger(this.wakeUpSetTriggerName);
        
        if (noRecurse) return;
        
            // check any other monster of the same
            // type being alerted
        
        entities=this.getEntityList();
        
        for (entity of entities) {
            if (entity===this) continue;
            if ((!entity.show) || (entity.health<=0)) continue;
            if (entity.constructor.name!==this.constructor.name) continue;
            
            if (this.position.distance(entity.position)<entity.wakeUpOnOtherWakeUpDistance) {
                entity.goWakeUp(true);
            }
        }
    }
    
    goIdle()
    {
        this.state=this.STATE_IDLE;
        
            // if there's a path, walk it, otherwise just idle in place
            
        if (this.idlePath!==null) {
            this.idlePathIdx=0;
            this.idleGoalNodeIdx=this.findKeyNodeIndex(this.idlePath[this.idlePathIdx]);
            this.nextNodeIdx=this.nextNodeInPath(this.findNearestPathNode(-1),this.idleGoalNodeIdx); 
            
            this.startAnimation(this.walkAnimation);
        }
        else {
            this.startAnimation(this.idleAnimation);
        }
    }   
    
    goStalk(resetTimers)
    {
        let timestamp=this.getTimestamp();
        
        this.state=this.STATE_STALKING;
        
        this.movement.setFromValues(0,0,0);
        
        if (resetTimers) {
            this.nextProjectileTick=timestamp+this.projectileWaitTick;
            this.nextMeleeTick=timestamp+this.meleeWaitTick;
            this.nextJumpTick=timestamp+(this.jumpWaitTick+Math.trunc(Math.random()*this.jumpWaitTickRandomAdd));
        }
        
        if (this.stalkByPath) {
            this.playerNodeIdx=this.getPlayer().findNearestPathNode(-1);
            this.nextNodeIdx=this.nextNodeInPath(this.findNearestPathNode(-1),this.playerNodeIdx);  // always assume monster starts on node
        }
        
        this.startAnimation(this.walkAnimation);
    }
    
    goHurt()
    {
        let timestamp=this.getTimestamp();
        
            // we always make a noise if possible
        
        if (this.noiseFinishTick<=timestamp) {
            this.noiseFinishTick=timestamp+this.getSoundMillisecondDuration(this.hurtSound);
            this.playSound(this.hurtSound);
        }
        
            // if waking up or attacking, don't go to hurt state
            
        if ((this.state===this.STATE_WAKING_UP) || (this.state===this.STATE_MELEE) || (this.state===this.STATE_PROJECTILE)) return;
        
            // if still in hurt, that means the animation
            // is complete so skip
            
        if (this.state===this.STATE_HURT) return;
        
            // go into hurt state if percentage
            // is OK
            
        if (Math.random()<this.hitAnimationPercentage) {
            this.state=this.STATE_HURT;

            this.startAnimation(this.hitAnimation);
            this.animationFinishTick=timestamp+this.getAnimationTickCount(this.hitAnimation);
        }
    }
    
    goMelee(distToPlayer)
    {
        let timestamp=this.getTimestamp();
        
        if ((distToPlayer>this.meleeDistance) || (timestamp<this.nextMeleeTick)) return;
        
        this.state=this.STATE_MELEE;
        
        if (Math.random()<0.5) {
            this.startAnimation(this.meleeLeftAnimation);
            this.meleeHitNextTick=this.getAnimationFinishTimestampFromFrame(this.meleeLeftAnimation.actionFrame,this.meleeLeftAnimation);
            this.animationFinishTick=timestamp+this.getAnimationTickCount(this.meleeLeftAnimation);
        }
        else {
            this.startAnimation(this.meleeRightAnimation);
            this.meleeHitNextTick=this.getAnimationFinishTimestampFromFrame(this.meleeRightAnimation.actionFrame,this.meleeRightAnimation);
            this.animationFinishTick=timestamp+this.getAnimationTickCount(this.meleeRightAnimation);
        }
    }
    
    goProjectile(player,distToPlayer)
    {
        let timestamp=this.getTimestamp();
        
            // don't fire if past projectile distance, or less than melee distance
            
        if ((distToPlayer>this.projectileDistance) || (distToPlayer<this.meleeDistance) || (timestamp<this.nextProjectileTick)) return;
        
            // does it sight the player?
            
        if (this.projectileRequiresSight) {
            this.projectileSetupFire(player);

            this.fireVector.setFromValues(0,0,this.projectileDistance);
            this.fireVector.rotateX(null,this.fireAngle.x);
            this.fireVector.rotateY(null,this.fireAngle.y);
            
            if (!this.collision.rayCollision(this,this.firePosition,this.fireVector,this.fireHitPoint)) return;
            if (this.hitEntity!==player) return;
        }
        
            // we can fire
            
        this.state=this.STATE_PROJECTILE;

            // projectile animaton
            
        this.startAnimation(this.projectileAnimation);
        this.projectileFireNextTick=this.getAnimationFinishTimestampFromFrame(this.projectileAnimation.actionFrame,this.projectileAnimation);
        this.animationFinishTick=timestamp+this.getAnimationTickCount(this.projectileAnimation);
    }
    
    goDying()
    {
        this.state=this.STATE_DYING;
        
        this.passThrough=true;

        this.startAnimation(this.dieAnimation);
        this.queueAnimationStop();
        this.animationFinishTick=this.getTimestamp()+this.getAnimationTickCount(this.dieAnimation);

        this.playSound(this.deathSound);

        this.fallSoundNextTick=this.getAnimationFinishTimestampFromFrame(this.dieAnimation.actionFrame,this.dieAnimation);
    }
    
    goDead()
    {
        this.state=this.STATE_DEAD;
        
        this.passThrough=true;
        if (this.deathSetTriggerName!==null) this.setTrigger(this.deathSetTriggerName);
    }
    
        //
        // damage
        //
        
    damage(fromEntity,damage,hitPoint)
    {
        if ((this.state===this.STATE_HIDDEN) || (this.state===this.STATE_DYING) || (this.state===this.STATE_DEAD)) return;
        
            // no self damage
            
        if (this.noSelfDamage) {
            if (fromEntity===this) return;
        }
        
            // the damage and death
            
        this.health-=damage;
        
        if (this.health<=0) {
            this.goDying();
            return;
        }
        
            // check for certain states
            // not going directly to hurt
            
        if (this.state===this.STATE_IDLE) {
            this.goStalk(true);
            return;
        }
        if (this.state===this.STATE_ASLEEP) {
            this.goWakeUp(false);
            return;
        }
        
            // regular damage
            
        this.goHurt();
    }
    
        //
        // pushing
        //
        
    entityPush(entity,movePnt)
    {
        if (!this.canBePushed) return(false);
        if (this.weight>entity.weight) return(false);
        
        this.pushMovement.setFromPoint(movePnt);
        return(true);
    }
    
        //
        // jumping and sliding around
        //
        
    jump()
    {
        this.gravity=this.getMapGravityMinValue();
        this.movement.y=this.jumpHeight;
        
        this.playSound(this.wakeUpSound);
    }
            
    findSlideDirection(player)
    {
        let distNeg,distPos;
        let moveAdd=this.slideMoveTick/16;      // estimation of physics ticks
        
            // find which direction gets you close to player
            
        this.rotMovement.setFromValues((this.sideMaxSpeed*moveAdd),0,-(this.reverseMaxSpeed*moveAdd));
        this.rotMovement.rotateY(null,this.angle.y);
        this.rotMovement.addPoint(this.position);
        distNeg=this.rotMovement.distance(player.position);
        
        this.rotMovement.setFromValues(-(this.sideMaxSpeed*moveAdd),0,-(this.reverseMaxSpeed*moveAdd));
        this.rotMovement.rotateY(null,this.angle.y);
        this.rotMovement.addPoint(this.position);
        distPos=this.rotMovement.distance(player.position);
        
        return((distNeg>distPos)?-1:1);
    }
    
        //
        // monster AI
        //
        
    runHidden()
    {
        if (this.checkTrigger(this.showTriggerName)) {
            this.show=true;
            this.goWakeUp(false);
        }
    }
    
    runAsleep(distToPlayer,gravityFactor)
    {
            // sleeping can only fall
            
        this.rotMovement.setFromValues(0,0,0);
        this.moveInMapY(this.rotMovement,gravityFactor,false);

            // time to wake up?
            
        if (distToPlayer<this.wakeUpDistance) {
            this.goWakeUp(false);
            return;
        }
    }
        
    runWakeUp(player,gravityFactor)
    {
        let speedFactor;
        
            // hurt can only turn and fall
            
        speedFactor=((this.startHealth-this.health)*this.damageSpeedFactor)/this.startHealth;
        
        if (this.stalkByPath) {
            if (this.nextNodeIdx===this.playerNodeIdx) {
                this.turnYTowardsEntity(player,(this.maxTurnSpeed+Math.trunc(this.maxTurnSpeed*speedFactor)));
            }
            else {
                this.turnYTowardsNode(this.nextNodeIdx,(this.maxTurnSpeed+Math.trunc(this.maxTurnSpeed*speedFactor)));
            }
        }
        else {
            this.turnYTowardsEntity(player,(this.maxTurnSpeed+Math.trunc(this.maxTurnSpeed*speedFactor)));
        }
            
        this.rotMovement.setFromValues(0,0,0);
        this.moveInMapY(this.rotMovement,gravityFactor,false);
        
            // is animation over?
            
        if (this.animationFinishTick<=this.getTimestamp()) this.goStalk(true);
    }
    
    runIdle(distToPlayer,gravityFactor)
    {
        let angleDif;
        
            // time to stalk?
   
        if (distToPlayer<this.wakeUpDistance) {
            this.goWakeUp(false);
            return;
        }

            // if no idle path, can only fall
            
        if ((this.idlePath===null) || (this.nextNodeIdx===-1)) {
            this.rotMovement.setFromValues(0,0,0);
            this.moveInMapY(this.rotMovement,gravityFactor,false);
            return;
        }
        
            // run the idle path
                 
        if (this.hitPathNode(this.nextNodeIdx,this.seekNodeDistanceSlop)) {
            if (this.nextNodeIdx===this.idleGoalNodeIdx) {
                this.idlePathIdx++;
                if (this.idlePathIdx>=this.idlePath.length) this.idlePathIdx=0;
                this.idleGoalNodeIdx=this.findKeyNodeIndex(this.idlePath[this.idlePathIdx]);
            }

            this.nextNodeIdx=this.nextNodeInPath(this.nextNodeIdx,this.idleGoalNodeIdx);
        }
            
            // if we have to turn to hard to make a node, then
            // pause movement

        angleDif=this.turnYTowardsNode(this.nextNodeIdx,this.maxTurnSpeed);
        
        if (angleDif<this.seekNodeAngleSlop) {
            this.movement.moveZWithAcceleration(true,false,this.forwardAcceleration,this.forwardDeceleration,this.forwardMaxSpeed,this.forwardAcceleration,this.forwardDeceleration,this.forwardMaxSpeed);        

            this.rotMovement.setFromPoint(this.movement);
            this.rotMovement.rotateY(null,this.angle.y);
            
            this.movement.y=this.moveInMapY(this.rotMovement,gravityFactor,false);
            this.moveInMapXZ(this.rotMovement,this.canBump,this.canSlide);
        }
        else {
            this.rotMovement.setFromValues(0,0,0);
            this.movement.y=this.moveInMapY(this.rotMovement,gravityFactor,false);
        }  
    }
    
    runStalk(player,distToPlayer,gravityFactor)
    {
        let angleDif,pauseMoveForward;
        let speedFactor,maxForwardSpeed,maxReverseSpeed,maxSideSpeed;
        let timestamp=this.getTimestamp();
        
            // if to far away from player,
            // go into idle
        
        if (this.idleDistance!==-1) {    
            if (distToPlayer>this.idleDistance) {
                this.goIdle();
                return;
            }
        }
        
            // damage speed changes
            
        speedFactor=((this.startHealth-this.health)*this.damageSpeedFactor)/this.startHealth;
        
            // path stalking
            
        pauseMoveForward=false;
            
        if (this.stalkByPath) {
            
                // keep pathing towards node closest to player
                // if these nodes are equal, always keep trying to repick
                
            if ((this.hitPathNode(this.nextNodeIdx,this.seekNodeDistanceSlop)) || (this.nextNodeIdx===this.playerNodeIdx)) {
                this.playerNodeIdx=player.findNearestPathNode(-1);
                this.nextNodeIdx=this.nextNodeInPath(this.nextNodeIdx,this.playerNodeIdx);
            }
            
                // if we are stuck on a node, just turn towards player and
                // don't move, otherwise turn towards next node
                // if we have to turn to hard to make a node, then
                // pause movement
                
            if (this.nextNodeIdx===this.playerNodeIdx) {
                angleDif=this.turnYTowardsEntity(player,(this.maxTurnSpeed+Math.trunc(this.maxTurnSpeed*speedFactor)));
            }
            else {
                angleDif=this.turnYTowardsNode(this.nextNodeIdx,(this.maxTurnSpeed+Math.trunc(this.maxTurnSpeed*speedFactor)));
                if (angleDif>this.seekNodeAngleSlop) pauseMoveForward=true;
            }

                // if we are in seek pause distance, don't keep moving
            
            pauseMoveForward=pauseMoveForward||(distToPlayer<=this.seekPauseDistance);
        }

            // regular stalking
            // turn towards player, remember how far we had to turn
            // to see if we are facing within a certain distance so
            // we can attack
         
        else {
            angleDif=this.turnYTowardsEntity(player,(this.maxTurnSpeed+Math.trunc(this.maxTurnSpeed*speedFactor)));
        }
        
            // time to jump?
            
        if (this.jumpHeight!==0) {
            if (timestamp>this.nextJumpTick) {
                this.nextJumpTick=timestamp+(this.jumpWaitTick+Math.trunc(Math.random()*this.jumpWaitTickRandomAdd));
                this.jump();
            }
        }
        
            // chase player (don't move if in flinch)

        if ((timestamp>this.movementFreezeNextTick) && (!pauseMoveForward)) {
            
            maxForwardSpeed=this.forwardMaxSpeed+(this.forwardMaxSpeed*speedFactor);
            maxReverseSpeed=this.reverseMaxSpeed+(this.reverseMaxSpeed*speedFactor);
            maxSideSpeed=this.sideMaxSpeed+(this.sideMaxSpeed*speedFactor);
            
                // not in a back slide
                
            if (this.slideNextTick===0) {
                this.movement.moveZWithAcceleration(true,false,this.forwardAcceleration,this.forwardDeceleration,maxForwardSpeed,this.forwardAcceleration,this.forwardDeceleration,maxForwardSpeed);        

                this.rotMovement.setFromPoint(this.movement);
                this.rotMovement.rotateY(null,this.angle.y);
                this.rotMovement.addPoint(this.pushMovement);

                this.origPosition.setFromPoint(this.position);

                this.movement.y=this.moveInMapY(this.rotMovement,gravityFactor,false);
                this.moveInMapXZ(this.rotMovement,this.canBump,this.canSlide);

                    // if we hit a wall, try a random slide left or right
                    // while backing up a bit

                if (this.collideWallMeshIdx!==-1) {
                    this.position.setFromPoint(this.origPosition);

                    this.slideDirection=this.findSlideDirection(player);
                    this.slideNextTick=timestamp+this.slideMoveTick;
                    this.sideMovement.setFromValues(0,this.movement.y,0);
                }
            }
            
                // in slide
                // stop slide if it slams into a wall immediately
                
            else {
                this.sideMovement.moveZWithAcceleration(false,true,this.forwardAcceleration,this.forwardDeceleration,maxForwardSpeed,this.reverseAcceleration,this.reverseDeceleration,maxReverseSpeed); 
                this.sideMovement.moveXWithAcceleration((this.slideDirection<0),(this.slideDirection>0),this.sideAcceleration,this.sideDeceleration,maxSideSpeed,this.sideAcceleration,this.sideDeceleration,maxSideSpeed);
                this.rotMovement.setFromPoint(this.sideMovement);
                this.rotMovement.rotateY(null,this.angle.y);
                this.rotMovement.addPoint(this.pushMovement);
                
                this.sideMovement.y=this.moveInMapY(this.rotMovement,gravityFactor,false);
                this.moveInMapXZ(this.rotMovement,this.canBump,this.canSlide);
               
                if ((timestamp>this.slideNextTick) || (this.collideWallMeshIdx!==-1)) {
                    this.slideNextTick=0;
                    this.movement.y=this.sideMovement.y;
                }
            }
        }
        else {
            this.rotMovement.setFromValues(0,0,0);
            this.movement.y=this.moveInMapY(this.rotMovement,gravityFactor,false);
        }
        
            // end any push
            
        this.pushMovement.setFromValues(0,0,0);
        
            // animation changes
            
        if (pauseMoveForward) {
            this.continueAnimation(this.idleAnimation);
        }
        else {
            this.continueAnimation(this.walkAnimation);
        }
        
            // projectiles and melee starts
        
        if ((this.projectileJson!=null) && (Math.abs(angleDif)<=this.angleYProjectileRange)) this.goProjectile(player,distToPlayer);
        if (Math.abs(angleDif)<=this.angleYMeleeRange) this.goMelee(distToPlayer);
    }
    
    runHurt(player,gravityFactor)
    {
        let speedFactor;
        
            // hurt can only turn and fall
            
        speedFactor=((this.startHealth-this.health)*this.damageSpeedFactor)/this.startHealth;
        
        if (this.stalkByPath) {
            if (this.nextNodeIdx===this.playerNodeIdx) {
                this.turnYTowardsEntity(player,(this.maxTurnSpeed+Math.trunc(this.maxTurnSpeed*speedFactor)));
            }
            else {
                this.turnYTowardsNode(this.nextNodeIdx,(this.maxTurnSpeed+Math.trunc(this.maxTurnSpeed*speedFactor)));
            }
        }
        else {
            this.turnYTowardsEntity(player,(this.maxTurnSpeed+Math.trunc(this.maxTurnSpeed*speedFactor)));
        }
            
        this.rotMovement.setFromValues(0,0,0);
        this.moveInMapY(this.rotMovement,gravityFactor,false);
        
            // is animation over?
            
        if (this.animationFinishTick<=this.getTimestamp()) this.goStalk(false);
    }
    
    runMelee(player,gravityFactor)
    {
        let timestamp=this.getTimestamp();
        
            // can fall and turn towards player while in melee
            
        this.rotMovement.setFromValues(0,0,0);
        this.moveInMapY(this.rotMovement,gravityFactor,false);
        
        this.turnYTowardsEntity(player,this.maxTurnSpeed);
        
            // the hit itself
            
        if ((this.meleeHitNextTick<=timestamp) && (this.meleeHitNextTick!==0)) {
            this.playSound(this.meleeSound);
            player.damage(this,this.meleeDamage,this.position);
            
            this.meleeHitNextTick=0;
        }
            // is animation over?
            
        if (this.animationFinishTick<=timestamp) this.goStalk(true);
    }
    
    runProjectile(player,gravityFactor)
    {
        let projEntity;
        let timestamp=this.getTimestamp();
        
            // can fall and turns towards player while in projectile
            
        this.rotMovement.setFromValues(0,0,0);
        this.moveInMapY(this.rotMovement,gravityFactor,false);
        
        this.turnYTowardsEntity(player,this.maxTurnSpeed);
        
            // the projectile itself
            
        if ((this.projectileFireNextTick<=timestamp) && (this.projectileFireNextTick!==0)) {
            this.projectileSetupFire(player);

            projEntity=this.addEntity(this.projectileJson,('projectile_'+this.name),this.firePosition,this.fireAngle,this.projectileData,this,null,true);
            if (projEntity!==null) projEntity.ready();
            
            this.projectileFireNextTick=0;
        }
            // is animation over?
            
        if (this.animationFinishTick<=timestamp) this.goStalk(true);
    }
    
    runDying(gravityFactor)
    {
        let timestamp=this.getTimestamp();
        
            // dying can only fall
            
        this.rotMovement.setFromValues(0,0,0);
        this.moveInMapY(this.rotMovement,gravityFactor,false);
        
            // the fall sound
               
        if (this.fallSound!==null) {
            if ((this.fallSoundNextTick<=timestamp) && (this.fallSoundNextTick!==0)) {
                this.playSound(this.fallSound);
                this.fallSoundNextTick=0;
            }
        }
        
            // is animation over?
            
        if (this.animationFinishTick<=timestamp) this.goDead();
    }
    
    runDead(gravityFactor)
    {
            // dead can only fall
            
        this.rotMovement.setFromValues(0,0,0);
        this.moveInMapY(this.rotMovement,gravityFactor,false);
    }
    
    run()
    {
        let player,distToPlayer,liquid,liquidIdx,gravityFactor;
        
        super.run();
        
        if (this.inFreezeAI()) return;
        
            // liquids
            
        liquidIdx=this.getLiquidForPoint(this.position);
        
        if (liquidIdx!==-1) {
            liquid=this.getLiquidForIndex(liquidIdx);
            if (this.lastInLiquidIdx===-1) liquid.playSoundIn(this.position);
            this.lastInLiquidIdx=liquidIdx;
            gravityFactor=liquid.gravityFactor;
        }
        else {
            if (this.lastInLiquidIdx!==-1) this.getLiquidForIndex(this.lastInLiquidIdx).playSoundOut(this.position);
            this.lastInLiquidIdx=-1;
            gravityFactor=1.0;
        }
        
            // distance to player
            
        player=this.getPlayer();
        distToPlayer=this.position.distance(player.position);
        
            // run the state
            
        switch (this.state) {
            case this.STATE_HIDDEN:
                this.runHidden();
                return;
            case this.STATE_ASLEEP:
                this.runAsleep(distToPlayer,gravityFactor);
                return;
            case this.STATE_WAKING_UP:
                this.runWakeUp(player,gravityFactor);
                return;
            case this.STATE_IDLE:
                this.runIdle(distToPlayer,gravityFactor);
                return;
            case this.STATE_STALKING:
                this.runStalk(player,distToPlayer,gravityFactor);
                return;
            case this.STATE_HURT:
                this.runHurt(player,gravityFactor);
                return;
            case this.STATE_MELEE:
                this.runMelee(player,gravityFactor);
                return;
            case this.STATE_PROJECTILE:
                this.runProjectile(player,gravityFactor);
                return;
            case this.STATE_DYING:
                this.runDying(gravityFactor);
                return;
            case this.STATE_DEAD:
                this.runDead(gravityFactor);
                return;
        }
    }
    
        //
        // drawing
        //
    
    drawSetup()
    {
        if (this.state===this.STATE_HIDDEN) return(false);
        
        this.setModelDrawAttributes(this.position,this.angle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}
