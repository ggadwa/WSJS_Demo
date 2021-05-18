import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';
import PlayerClass from './player.js';
import MonsterBaseClass from './monster_base.js';

export default class BotClass extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.isBot=true;
        
            // model
        
        this.modelName=data.model;
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(3000,3000,3000);
        this.radius=1500;
        this.height=4500;
        this.eyeOffset=4400;
        this.weight=180;
        this.modelHideMeshes=['Captain_jetpack','Captain_body'];
        
            // physics
            
        this.maxBumpCount=2;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=48;
        this.collisionHeightSegmentCount=2;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;
        
            // settings
            
        this.healthMaxCount=data.healthMaxCount;
        this.armorMaxCount=data.armorMaxCount;
        
        this.maxTurnSpeed=data.maxTurnSpeed;
        this.forwardAcceleration=15;
        this.forwardDeceleration=30;
        this.forwardMaxSpeed=data.forwardMaxSpeed;
        this.backwardAcceleration=10;
        this.backwardDeceleration=25;
        this.backwardMaxSpeed=Math.trunc(this.forwardMaxSpeed*0.9);
        this.sideAcceleration=25;
        this.sideDeceleration=50;
        this.sideMaxSpeed=Math.trunc(this.forwardMaxSpeed*0.6);
        this.swimAcceleration=10;
        this.swimDeceleration=70;
        this.swimMaxSpeed=Math.trunc(this.forwardMaxSpeed*0.5);
        this.flyAcceleration=30;
        this.flyDeceleration=50;
        this.flyMaxSpeed=Math.trunc(this.forwardMaxSpeed*0.75);
            
        this.jumpHeight=data.jumpHeight;
        this.jumpWaterHeight=Math.trunc(this.jumpHeight*1.25);
        this.damageFlinchWaitTick=500;
        this.fallDamageMinDistance=10000;
        this.fallDamagePercentage=0.05;
        this.seekNodeDistanceSlop=1000;
        this.seekNodeAngleSlop=35;

        this.targetScanYRange=data.targetScanYRange;
        this.targetForgetDistance=100000;
        this.targetFireYRange=data.targetFireYRange;
        this.targetFireSlop=data.targetFireSlop;
 
            // variables
        
        this.health=0;
        this.armor=0;
        
        this.inStandingAnimation=true;
        
        this.movementFreezeTick=0;
        
        this.falling=false;
        this.fallStartY=0;
        this.lastInLiquidIdx=-1;
        this.lastUnderLiquid=false;
        
        this.lastWheelClick=0;
        
        this.pistolWeapon=null;
        this.m16Weapon=null;
        this.grenadeWeapon=null;
        
        this.currentWeapon=null;
        this.grenadeNextThrowTick=0;
        this.weaponClipFinishTick=0;
        this.animationFinishTick=0;
        
        this.forceAnimationUpdate=false;
        
        this.goalNodeIdx=-1;
        this.nextNodeIdx=-1;

        this.pausedTriggerName=null;
        this.targetEntity=null;
        this.lastTargetAngleDif=360;
        this.currentTargetYScan=0;
        
        this.flying=false;

        this.respawnTick=0;
        this.stuckCount=0;
        this.telefragTriggerEntity=null;
        
            // animations
            
        this.idleAnimationPistol=new AnimationDefClass(0,50,0);
        this.runAnimationPistol=new AnimationDefClass(492,518,0);
        this.fireIdleAnimationPistol=new AnimationDefClass(364,401,0);
        this.fireRunAnimationPistol=new AnimationDefClass(523,549,0);
        this.idleAnimationM16=new AnimationDefClass(710,760,0);
        this.runAnimationM16=new AnimationDefClass(933,955,0);
        this.fireIdleAnimationM16=new AnimationDefClass(775,815,0);
        this.fireRunAnimationM16=new AnimationDefClass(865,887,0);
        this.throwGrenadeAnimation=new AnimationDefClass(51,91,0);
        this.dieAnimation=new AnimationDefClass(209,247,0);
        
            // sounds
            
        this.hurtSound=new SoundDefClass('hurt',0.5,1.0,5000,0,0,false);
        this.dieSound=new SoundDefClass('player_die',0.8,0,30000,0,0,false);
        
            // pre-allocates
            
        this.movement=new PointClass(0,0,0);
        this.rotMovement=new PointClass(0,0,0);
        
        this.stuckPoint=new PointClass(0,0,0);
        this.lookPoint=new PointClass(0,0,0);
        this.lookVector=new PointClass(0,0,0);
        this.lookHitPoint=new PointClass(0,0,0);
        
        this.firePosition=new PointClass(0,0,0);
        this.drawAngle=new PointClass(0,0,0);
        
        Object.seal(this);
    }
    
    initialize()
    {
        if (!super.initialize()) return(false);
        
            // setup the weapons
        
        this.pistolWeapon=this.addEntity('weapon_pistol','pistol',new PointClass(0,0,0),new PointClass(0,0,0),null,this,this,true);
        this.m16Weapon=this.addEntity('weapon_m16','m16',new PointClass(0,0,0),new PointClass(0,0,0),null,this,this,true);
        this.grenadeWeapon=this.addEntity('weapon_grenade','grenade',new PointClass(0,0,0),new PointClass(0,0,0),null,this,this,true);
        
        return(true);
    }
    
    release()
    {
        super.release();
        
        this.pistolWeapon.release();
        this.m16Weapon.release();
        this.grenadeWeapon.release();
    }
    
    ready()
    {
        super.ready();
        
            // full health
            
        this.health=this.data.healthMaxCount;
        this.armor=0;
        this.stuckCount=0;
        this.passThrough=false;         // reset if this is being called after bot died
        
        this.falling=false;
        this.fallStartY=0;
        
        this.respawnTick=0;
        this.telefragTriggerEntity=null;
        
        this.movementFreezeTick=0;
        
        this.lastInLiquidIdx=-1;
        this.lastUnderLiquid=false;
        
        this.grenadeNextThrowTick=0;
        this.weaponClipFinishTick=0;
        this.animationFinishTick=0;
        
            // weapons
            
        this.pistolWeapon.available=true;
        this.m16Weapon.available=true; //false;
        this.grenadeWeapon.available=true;

        this.currentWeapon=this.pistolWeapon;
        
        this.adjustMeshesForCurrentWeapon();
        
            // start scanning in middle
            
        this.currentTargetYScan=Math.trunc(this.targetScanYRange*0.5);
        
            // move to random spawn node
            
        if (this.hasSpawnNodes()) this.moveToRandomSpawnNode(false);

            // get seek node
            
        if (this.hasKeyNodes()) {
            this.goalNodeIdx=this.getRandomKeyNodeIndex();      // path to some random key node
            this.nextNodeIdx=this.nextNodeInPath(this.findNearestPathNode(-1),this.goalNodeIdx);    // we always spawn on a node, so next node is node in path to goal node
        }
        else {
            this.nextNodeIdx=-1;
        }
        
        this.pausedTriggerName=null;
        this.targetEntity=null;
        this.lastTargetAngleDif=360;
        
            // the draw angle is used to face a
            // different way then we are walking
            
        this.drawAngle.setFromPoint(this.angle);
        
            // turn the bot directly towards the node
            // they are heading to when starting
            
        if (this.nextNodeIdx!==-1) this.turnYTowardsNode(this.nextNodeIdx,360);

            // start animation
            
        this.startAnimation(this.runAnimationPistol);
    }
    
        //
        // health
        //
        
    die(fromEntity,isTelefrag)
    {
        this.respawnTick=this.getTimestamp()+this.getMultiplayerRespawnWaitTick();
        this.passThrough=true;
        
        this.playSound(this.dieSound);
        this.startAnimation(this.dieAnimation);
        this.queueAnimationStop();

        this.multiplayerAddScore(fromEntity,this,isTelefrag);
    }
    
    damage(fromEntity,damage,hitPoint)
    {
        if (this.health<=0) return;
        
        this.armor-=damage;
        if (this.armor<0) {
            this.health+=this.armor;
            this.armor=0;
        }

        if (this.health<=0) {
            this.die(fromEntity,false);
            return;
        }
        
        if ((fromEntity!==null) && (fromEntity!==this)) this.targetEntity=fromEntity;
    }
    
    telefrag(fromEntity)
    {
        this.telefragTriggerEntity=fromEntity;
    }
    
        //
        // weapons, health, armor updates
        //
        
    addM16Weapon()
    {
        this.m16Weapon.available=true;
    }
    
    addPistolClip(count)
    {
        this.pistolWeapon.addClip(count);
    }
    
    addM16Clip(count)
    {
        this.m16Weapon.addClip(count);
    }
    
    addGrenadeAmmo(count)
    {
        this.grenadeWeapon.addAmmo(count);
    }
    
    addHealth(count)
    {
        this.health+=count;
        if (this.health>this.healthMaxCount) this.health=this.healthMaxCount;
    }
    
    addArmor(count)
    {
        this.armor+=count;
        if (this.armor>this.armorMaxCount) this.armor=this.armorMaxCount;
    }
    
        //
        // determine if we are at a node that is a pause node.  This is not
        // built in but we specify data that says at this node wait for a certain
        // trigger before going on to another node
        //
    
    isNodeATriggerPauseNode(nodeIdx,nextNodeIdx)
    {
        let n,data;
        
        data=this.getNodeData(nodeIdx);
        if (data===null) return(null);
        
        for (n=0;n!=data.length;n++) {
            if (data[n].link===nextNodeIdx) return(data[n].trigger);
        }
        
        return(null); 
    }
    
        //
        // fighting
        //
        
    pickBestWeapon()
    {
        let weapon;
        
            // find best weapon
            
        weapon=this.pistolWeapon;
        if ((this.m16Weapon.available) && ((this.m16Weapon.ammoInClipCount!==0) || (this.m16Weapon.clipCount!==0))) weapon=this.m16Weapon;

        if (this.currentWeapon===weapon) return;
        
            // switch weapon
            
        this.currentWeapon=weapon;
        this.adjustMeshesForCurrentWeapon();
    }

    findEntityToFight()
    {
            // special check for no ammo
            // if so, don't fight
        
        if ((this.currentWeapon.ammoInClipCount===0) && (this.currentWeapon.clipCount===0)) {
            this.targetEntity=null;
            return;
        }
        
            // already fighting?
            // if so, see if we are past the forget
            // distance or the target has no health
            
        if (this.targetEntity!=null) {
            if (this.targetEntity.health<=0) {
                this.targetEntity=null;
                return;
            }
            if (this.position.distance(this.targetEntity.position)>this.targetForgetDistance) {
                this.targetEntity=null;
                return;
            }
            
            return;
        }
        
            // ray trace for entities
            // we do one look angle per tick
            
        this.lookPoint.setFromPoint(this.position);
        this.lookPoint.y+=Math.trunc(this.height*0.5);      // use middle instead of eye position in case other stuff is smaller
        
        this.lookVector.setFromValues(0,0,this.targetForgetDistance);
        this.lookVector.rotateY(null,(this.angle.y+(this.currentTargetYScan-Math.trunc(this.targetScanYRange*0.5))));
        
        this.currentTargetYScan++;
        if (this.currentTargetYScan>=this.targetScanYRange) this.currentTargetYScan=0;
        
        if (this.collision.rayCollision(this,this.lookPoint,this.lookVector,this.lookHitPoint)) {
            if (this.hitEntity!==null) {
                if ((this.hitEntity instanceof PlayerClass) ||
                   (this.hitEntity instanceof BotClass) ||
                   (this.hitEntity instanceof MonsterBaseClass)) this.targetEntity=this.hitEntity;
            }
        }
    }
    
        //
        // weapons
        //
        
    adjustMeshesForCurrentWeapon()
    {
        let show=(this.currentWeapon===this.pistolWeapon);
        
        this.showMesh('beretta',show);
        this.showMesh('peen',show);
        this.showMesh('beretta_top',show);
        this.showMesh('triger',show);
        this.showMesh('holder',show);

        this.showMesh('m16_rifle',!show);
        this.showMesh('m16_holder_01',!show);
        this.showMesh('shutter',!show);
        this.showMesh('trigger',!show);
    }

    fireWeapon()
    {
        let dist,timestamp;
        
            // are we changing clips?
            
        timestamp=this.getTimestamp();
            
        if (this.weaponClipFinishTick!==0) {
            if (this.weaponClipFinishTick>timestamp) return;
            this.weaponClipFinishTick=0;
        }
        
            // are we turned enough towards player?
            
        if (Math.abs(this.lastTargetAngleDif)>this.targetFireYRange) return;
            
            // fire position
            
        this.firePosition.setFromPoint(this.position);
        this.firePosition.y+=this.eyeOffset;
            
           // see if any extra weapons can be fired
           
        dist=this.position.distance(this.targetEntity.position);
        
        if (this.grenadeWeapon.ammoCount!==0) {
            if ((dist>15000) && (dist<60000)) {
                if (this.grenadeNextThrowTick<timestamp) {
                    this.grenadeNextThrowTick=timestamp+10000;
                    if (this.grenadeWeapon.fire(this.firePosition,this.drawAngle)) {
                        this.startAnimation(this.throwGrenadeAnimation);
                        this.animationFinishTick=timestamp+this.getAnimationTickCount(this.throwGrenadeAnimation);
                        return;
                    }
                }
            }
        }
        
            // need clip change?
            
        if (this.currentWeapon.needClipChange()) {
            this.weaponClipFinishTick=timestamp+this.currentWeapon.changeClip(this.position);
            return;
        }
           
            // otherwise shot the held weapon
            
        this.currentWeapon.fire(this.firePosition,this.drawAngle);
        
            // animations
            
        if (this.currentWeapon===this.pistolWeapon) {
            if (this.inStandingAnimation) {
                this.continueAnimation(this.fireIdleAnimationPistol);
                this.animationFinishTick=timestamp+this.getAnimationTickCount(this.fireIdleAnimationPistol);
            }
            else {
                this.continueAnimation(this.fireRunAnimationPistol);
                this.animationFinishTick=timestamp+this.getAnimationTickCount(this.fireRunAnimationPistol);
            }
        }
        else {
            if (this.currentWeapon===this.m16Weapon) {
                if (this.inStandingAnimation) {
                    this.continueAnimation(this.fireIdleAnimationM16);
                    this.animationFinishTick=timestamp+this.getAnimationTickCount(this.fireIdleAnimationM16);
                }
                else {
                    this.continueAnimation(this.fireRunAnimationM16);
                    this.animationFinishTick=timestamp+this.getAnimationTickCount(this.fireRunAnimationM16);
                }
            }
        }
    }
    
        //
        // mainline bot run
        //
        
    run()
    {
        let nodeIdx,prevNodeIdx,moveForward;
        let turnDiff,slideLeft,liquid,liquidIdx,gravityFactor,fallDist;
        let timestamp=this.getTimestamp();
        
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
       
            // dead
            
        if (this.respawnTick!==0) {
            
                // keep falling
                
            this.rotMovement.setFromValues(0,0,0);
            this.moveInMapY(this.rotMovement,gravityFactor,false);
            
                // bots always recover
                
            if (timestamp>this.respawnTick)  this.ready();
            
            return;
        }
        
            // the telefrag trigger
            // we defer this because it can happen during a spawn
            
        if (this.telefragTriggerEntity!==null) {
            this.die(this.telefragTriggerEntity,true);
            this.telefragTriggerEntity=null;
            return;
        }
        
            // falling
            
        if ((this.standOnMeshIdx!==-1) && (liquidIdx===-1)) {
            if (this.falling) {
                this.falling=false;
                fallDist=(this.fallStartY-this.position.y)-this.fallDamageMinDistance;
                if (fallDist>0) this.damage(this,Math.trunc(fallDist*this.fallDamagePercentage),this.position);
            }
        }
        else {
            if (this.movement.y>0) {
                this.falling=false;
            }
            else {
                if (!this.falling) {
                    this.falling=true;
                    this.fallStartY=this.position.y;
                }
            }
        }
        
            // if no node, just skip out
            
        if (this.nextNodeIdx===-1) return;
        
            // pick best weapon
            
        this.pickBestWeapon();
        
            // look for things to shoot
            
        this.findEntityToFight();
        
        if (this.targetEntity!==null) this.fireWeapon();
        
            // run the nodes, we do this before
            // freezing for trigger waits because we might
            // be standing upon something that auto moves us to
            // the next node
        
            // have we hit goal node?
            // we only chase goals if we aren't targetting another entity

        if (this.targetEntity===null) {
            if (this.hitPathNode(this.goalNodeIdx,this.seekNodeDistanceSlop)) {
                nodeIdx=this.goalNodeIdx;
                this.goalNodeIdx=this.getRandomKeyNodeIndex();
                this.nextNodeIdx=this.nextNodeInPath(nodeIdx,this.goalNodeIdx);
            }
        }

            // have we hit the next node?
            // if we are targetting an entity, go to the next nearest
            // linked node closest to the entity, otherwise path to the goal

        if (this.hitPathNode(this.nextNodeIdx,this.seekNodeDistanceSlop)) {
            prevNodeIdx=this.nextNodeIdx;

            if (this.targetEntity===null) {
                this.nextNodeIdx=this.nextNodeInPath(this.nextNodeIdx,this.goalNodeIdx);
            }
            else {
                this.nextNodeIdx=this.nextNodeTowardsEntity(this.nextNodeIdx,this.targetEntity);
            }

                // is this a node we should pause at?

            this.pausedTriggerName=this.isNodeATriggerPauseNode(prevNodeIdx,this.nextNodeIdx);
        }
        
            // always start by moving
            
        moveForward=true;
       
            // if we are waiting for a trigger,
            // then do nothing until trigger
            
        if (this.pausedTriggerName!==null) {
            if (!this.checkTrigger(this.pausedTriggerName)) {
                moveForward=false;
            }
            else {
                this.pausedTriggerName=null;
            }
        }
        
            // select proper animation
            
        this.inStandingAnimation=!moveForward;
        
        if ((this.animationFinishTick===0) || (this.animationFinishTick<timestamp)) {
            this.animationFinishTick=0;
            if (!moveForward) {
                this.continueAnimation((this.currentWeapon===this.pistolWeapon)?this.idleAnimationPistol:this.idleAnimationM16);
            }
            else {
                this.continueAnimation((this.currentWeapon===this.pistolWeapon)?this.runAnimationPistol:this.runAnimationM16);
            }
        }
        
            // if we are touching an entity, try to slide out
            // of the way
            
        slideLeft=false;
        
        if ((this.touchEntity!==null) && (moveForward)) {
            slideLeft=true;
        }
        
            // turn off all movement if in a freeze
            // mostly happens from certain weapon fires
            
        if (this.movementFreezeTick!==0) {
            if (this.movementFreezeTick>timestamp) {
                moveForward=false;
                slideLeft=false;
            }
            else {
                this.movementFreezeTick=0;
            }
        }
        
            // turn towards the node
            // if we aren't paused
        
        if (this.pausedTriggerName===null) {
            turnDiff=this.turnYTowardsNode(this.nextNodeIdx,this.maxTurnSpeed);
            if (turnDiff>this.seekNodeAngleSlop) moveForward=false;
        }
        
            // changing angles based on if we are
            // walking nodes or targetting
            
        if (this.targetEntity===null) {
            this.drawAngle.turnYTowards(this.angle.y,this.maxTurnSpeed);
        }
        else {
            this.lastTargetAngleDif=this.drawAngle.turnYTowards(this.position.angleYTo(this.targetEntity.position),this.maxTurnSpeed);
        }
        
            // move
            
        if (this.flying) {
            this.movement.moveZWithAcceleration(moveForward,false,this.flyAcceleration,this.flyDeceleration,this.flyMaxSpeed,this.flyAcceleration,this.flyDeceleration,this.flyMaxSpeed);
        }
        else {
            if (this.lastUnderLiquid) {
                this.movement.moveZWithAcceleration(moveForward,false,this.swimAcceleration,this.swimDeceleration,this.swimMaxSpeed,this.swimAcceleration,this.swimDeceleration,this.swimMaxSpeed);
            }
            else {
                this.movement.moveZWithAcceleration(moveForward,false,this.forwardAcceleration,this.forwardDeceleration,this.forwardMaxSpeed,this.backwardAcceleration,this.backwardDeceleration,this.backwardMaxSpeed);
            }
        }
        this.movement.moveXWithAcceleration(slideLeft,false,this.sideAcceleration,this.sideDeceleration,this.sideMaxSpeed,this.sideAcceleration,this.sideDeceleration,this.sideMaxSpeed);
        
        this.rotMovement.setFromPoint(this.movement);
        if ((this.flying) || (this.lastUnderLiquid)) {
            this.rotMovement.y=0;       // only Y movement comes from X angle rotation
            this.rotMovement.rotateX(null,this.angle.x);     // if flying or swimming, add in the X rotation
        }
        this.rotMovement.rotateY(null,this.angle.y);
                    
        this.movement.y=this.moveInMapY(this.rotMovement,gravityFactor,false);
        this.moveInMapXZ(this.rotMovement,true,true);
        
            // detect stuck
            // if we get stuck, then head towards the nearest node and
            // then onto a new random goal
            
        if ((this.position.equals(this.stuckPoint)) && (this.pausedTriggerName===null)) {
            this.stuckCount++;
            if (this.stuckCount>=this.MAX_STUCK_COUNT) {
                this.stuckCount=0;
                this.goalNodeIdx=this.getRandomKeyNodeIndex();
                this.nextNodeIdx=this.findNearestPathNode(-1);
            }
        }
        
        this.stuckPoint.setFromPoint(this.position);
    }
    
    drawSetup()
    {
        if (this.model===null) return(false);
        
        this.setModelDrawAttributes(this.position,this.drawAngle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}

