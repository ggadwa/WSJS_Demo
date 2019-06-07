import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EntityWeaponBerettaClass from '../entities/entity_weapon_beretta.js';
import EntityWeaponM16Class from '../entities/entity_weapon_m16.js';
import EntityWeaponGrenadeClass from '../entities/entity_weapon_grenade.js';

//
// remote bot class
//

export default class EntityRemoteClass extends ProjectEntityClass
{
    static MAX_TURN_SPEED=8;
    static FORWARD_ACCELERATION=15;
    static FORWARD_DECELERATION=30;
    static FORWARD_MAX_SPEED=200;
    static SIDE_ACCELERATION=25;
    static SIDE_DECELERATION=50;
    static SIDE_MAX_SPEED=150;
    static MAX_TURN_SLOW_DOWN=35;       // if a turn is over this speed, then stop moving forward until closer to correct angle
    static MAX_TARGET_TURN_SPEED=3;     // how fast bot can turn towards player from actual motion direction
    static NODE_SLOP=1000;              // how close to a node before we consider it hit
    static RANDOM_NODE_FAIL_COUNT=20;   // how many times it'll try to find a spawn node that is open
    static MAX_DEATH_COUNT=500;         // how many physics ticks to stay dead
    static MAX_STUCK_COUNT=50;          // how many physics tick we can be stuck until we restart pathing
    static FORGET_DISTANCE=60000;       // distance bot gives up on targetting somebody
    static TARGET_SCAN_Y_ANGLES=[-60,-45,-25,-15,-10,-5,0,5,10,15,25,45,60];     // angles we scan (one angle a tick) for targets
    static TARGET_HIT_FILTER=['player','bot'];              // filters for things we can find with ray trace scan
    static BERETTA_FIRE_SLOP=5;         // angle of slop on fire so bot doesn't always hit you
    static M16_FIRE_SLOP=15;            // angle of slop on fire so bot doesn't always hit you
    static ANGLE_Y_FIRE_RANGE=10;       // if angle to target is within this range, then you can fire
    static MIN_GRENADE_DISTANCE=30000;  // if we are greater than this distance, we can throw grenades
    static GRENADE_PAUSE_TICK=5000;     // how long until we can throw another grenade
    static WEAPON_BERETTA=0;
    static WEAPON_M16=1;
    
    health=100;
    armor=0;
    deadCount=-1;
    stuckCount=0;
    nextNodeIdx=-1;
    goalNodeIdx=-1;
    pausedTriggerName=null;
    targetEntity=null;
    drawAngle=null;
    fireAngle=null;
    lastTargetAngleDif=360;
    currentLookIdx=0;
    lookPoint=null;
    lookVector=null;
    lookHitPoint=null; 
    movement=null;
    rotMovement=null;
    stuckPoint=null;
    beretta=null;
    m16=null;
    grenade=null;   
    currentWeapon=0;
    hasM16=false;
    grenadePauseTick=0;
    
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=1500;
        this.height=4500;
        
        this.eyeOffset=4400;
        this.bumpHeight=1400;
        
        this.gravityMinValue=10;
        this.gravityMaxValue=450;
        this.gravityAcceleration=20;
        
        this.filter='bot';          // filters are used when searching for entities
        
        this.drawAngle=new PointClass(0,0,0);       // some pre-allocates
        this.fireAngle=new PointClass(0,0,0);
        this.lookPoint=new PointClass(0,0,0);
        this.lookVector=new PointClass(0,0,0);
        this.lookHitPoint=new PointClass(0,0,0);
        this.movement=new PointClass(0,0,0);
        this.rotMovement=new PointClass(0,0,0);
        this.stuckPoint=new PointClass(0,0,0);
        
            // set model
            
        this.setModel({"name":"player"});
        this.scale.setFromValues(3000,3000,3000);
        
            // add sounds
            
        this.addSound('player_die',30000);
        
            // add weapons
            
        this.currentWeapon=0;
        this.hasM16=false;
        this.grenadePauseTick=0;
            
        this.beretta=this.addEntity(EntityWeaponBerettaClass,'weapon_beretta',new PointClass(0,0,0),new PointClass(0,0,0),null,false,true);
        this.m16=this.addEntity(EntityWeaponM16Class,'weapon_m16',new PointClass(0,0,0),new PointClass(0,0,0),null,false,true);
        this.grenade=this.addEntity(EntityWeaponGrenadeClass,('weapon_grenade'),new PointClass(0,0,0),new PointClass(0,0,0),null,false,true);
    }
    
    release()
    {
        super.release();
        
        this.beretta.release();
        this.m16.release();
        this.grenade.release();
    }
    
    switchWeapon(whichWeapon)
    {
        if (whichWeapon===this.currentWeapon) return;
        
        if (whichWeapon===EntityRemoteClass.WEAPON_BERETTA) {
            this.showModelMesh('beretta',true);
            this.showModelMesh('peen',true);
            this.showModelMesh('beretta_top',true);
            this.showModelMesh('triger',true);
            this.showModelMesh('holder',true);
            
            this.showModelMesh('m16_rifle',false);
            this.showModelMesh('m16_holder_01',false);
            this.showModelMesh('shutter',false);
            this.showModelMesh('trigger',false);

            this.startModelAnimationChunkInFrames(null,30,406,442);
        }
        else {
            this.showModelMesh('beretta',false);
            this.showModelMesh('peen',false);
            this.showModelMesh('beretta_top',false);
            this.showModelMesh('triger',false);
            this.showModelMesh('holder',false);
            
            this.showModelMesh('m16_rifle',true);
            this.showModelMesh('m16_holder_01',true);
            this.showModelMesh('shutter',true);
            this.showModelMesh('trigger',true);

            this.startModelAnimationChunkInFrames(null,30,960,996);
        }
        
        this.currentWeapon=whichWeapon;
    }
    
    ready()
    {
            // always hide jetpack
            
        this.showModelMesh('Captain_jetpack',false);
        
            // full health
            
        this.health=100;
        this.armor=0;
        this.deadCount=-1;
        this.stuckCount=0;
        this.passThrough=false;         // reset if this is being called after bot died
        
            // start with beretta
            
        this.currentWeapon=-1;
        this.switchWeapon(EntityRemoteClass.WEAPON_BERETTA);
        
        this.hasM16=false;
        this.grenadePauseTick=this.getTimestamp()+EntityRemoteClass.GRENADE_PAUSE_TICK;
        
        this.beretta.ready();
        this.m16.ready();
        this.grenade.ready();
        
            // move to random node
            
        this.moveToRandomNode(EntityRemoteClass.RANDOM_NODE_FAIL_COUNT);

            // get seek node
            
        this.goalNodeIdx=this.getRandomKeyNodeIndex();      // path to some random key node
        this.nextNodeIdx=this.nextNodeInPath(this.findNearestPathNode(-1),this.goalNodeIdx);    // we always spawn on a node, so next node is node in path to goal node

        this.pausedTriggerName=null;
        this.targetEntity=null;
        this.lastTargetAngleDif=360;
        
            // the draw angle is used to face a
            // different way then we are walking
            
        this.drawAngle.setFromPoint(this.angle);
        
            // turn the bot directly towards the node
            // they are heading to when starting
            
        this.turnYTowardsNode(this.nextNodeIdx,360);

            // start animation
            
        this.startModelAnimationChunkInFrames(null,30,960,996);
    }
        
        //
        // fire weapons
        //
        
    fireWeapon()
    {
            // are we turned enough towards player?
            
        if (Math.abs(this.lastTargetAngleDif)>EntityRemoteClass.ANGLE_Y_FIRE_RANGE) return;
            
           // are we outside of grenade distance?
           // if so, then we can throw a grenade
           // we also have a pause so bots don't unload
           // at one helpless player
           
        if (this.grenade.ammoCount>0) {
            if (this.getTimestamp()>this.grenadePauseTick) {
                if (this.position.distance(this.targetEntity.position)>EntityRemoteClass.MIN_GRENADE_DISTANCE) {
                    this.fireAngle.setFromPoint(this.drawAngle);
                    this.fireAngle.x=this.position.getLookAngleTo(this.targetEntity.position);
                    this.grenade.fire(this.position,this.fireAngle,this.eyeOffset);
                    this.grenadePauseTick=this.getTimestamp()+EntityRemoteClass.GRENADE_PAUSE_TICK;

                    if (this.currentWeapon===EntityRemoteClass.WEAPON_BERETTA) {
                        this.startModelAnimationChunkInFrames(null,30,51,91);
                        this.queueModelAnimationChunkInFrames(null,30,406,442);
                    }
                    else {
                        this.startModelAnimationChunkInFrames(null,30,820,860);
                        this.queueModelAnimationChunkInFrames(null,30,960,996);
                    }
                    return;
                }
            }
        }
        
            // otherwise shot the held weapon
            
        if (this.currentWeapon===EntityRemoteClass.WEAPON_BERETTA) {
            this.fireAngle.setFromPoint(this.drawAngle);
            this.fireAngle.x=this.position.getLookAngleTo(this.targetEntity.position);
            this.fireAngle.y+=(EntityRemoteClass.BERETTA_FIRE_SLOP-(Math.random()*(EntityRemoteClass.BERETTA_FIRE_SLOP*2)));
            if (this.beretta.fire(this.position,this.fireAngle,this.eyeOffset)) {
                this.startModelAnimationChunkInFrames(null,30,554,594);
                this.queueModelAnimationChunkInFrames(null,30,406,442);
            }
        }
        else {
            this.fireAngle.setFromPoint(this.drawAngle);
            this.fireAngle.x=this.position.getLookAngleTo(this.targetEntity.position);
            this.fireAngle.y+=(EntityRemoteClass.M16_FIRE_SLOP-(Math.random()*(EntityRemoteClass.M16_FIRE_SLOP*2)));
            if (this.m16.fire(this.position,this.fireAngle,this.eyeOffset)) {
                this.startModelAnimationChunkInFrames(null,30,892,928);
                this.queueModelAnimationChunkInFrames(null,30,960,996);
            }
        }
    }
    
        //
        // for item pickups
        //
        
    pickup(name)
    {
            // always have the beretta
            
        if ((name==='beretta') || (name==='beretta_ammo')) {
            this.beretta.addAmmo();
            return(true);
        }
        
            // either pickup m16 or add ammo
            
        if (name==='m16') {
            if (!this.hasM16) {
                this.hasM16=true;
                return(true);
            }
            return(false);
        }
        
        if (name==='m16_ammo') {
            if (!this.hasM16) return(false);
            
            this.m16.addAmmo();
            return(true);
        }
        
            // grenades
            
        if (name==='grenade') {
            this.grenade.addAmmo();
            return(true);
        }
        
            // health and armor
            
        if (name==='health') {
            this.health=Math.min((this.health+25),100);
            return(true);
        }
        
        if (name==='armor') {
            this.armor=Math.min((this.armor+100),100);
            return(true);
        }
        
        return(false);
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
    // find an entity to fight by casting rays
    //
    
    findEntityToFight()
    {
            // already fighting?
            // if so, see if we are past the forget
            // distance or the target has no health
            
        if (this.targetEntity!=null) {
            if (this.targetEntity.health<=0) {
                this.targetEntity=null;
                return;
            }
            if (this.position.distance(this.targetEntity.position)>EntityRemoteClass.FORGET_DISTANCE) {
                this.targetEntity=null;
                return;
            }
            
            return;
        }
        
            // ray trace for entities
            // we do one look angle per tick
            
        this.lookPoint.setFromPoint(this.position);
        this.lookPoint.y+=Math.trunc(this.height*0.5);      // use middle instead of eye position in case other stuff is smaller
        
        this.lookVector.setFromValues(0,0,EntityRemoteClass.FORGET_DISTANCE);
        this.lookVector.rotateY(null,EntityRemoteClass.TARGET_SCAN_Y_ANGLES[this.currentLookIdx]);
        
        this.currentLookIdx++;
        if (this.currentLookIdx>=EntityRemoteClass.TARGET_SCAN_Y_ANGLES.length) this.currentLookIdx=0;
        
        if (this.rayCollision(this.lookPoint,this.lookVector,this.lookHitPoint,EntityRemoteClass.TARGET_HIT_FILTER,null)) {
            if (this.hitEntity!==null) this.targetEntity=this.hitEntity;
        }
    }
    
    //
    // called when somebody damages this entity
    //
    
    damage(fromEntity,damage,hitPoint)
    {
        if (this.deadCount!==-1) return;
        
        this.armor-=damage;
        if (this.armor<0) {
            this.health+=this.armor;
            this.armor=0;
        }

        if (this.health<=0) {
            this.deadCount=EntityRemoteClass.MAX_DEATH_COUNT;
            this.passThrough=true;
            this.startModelAnimationChunkInFrames(null,30,209,247);
            this.queueAnimationStop();
            this.playSound('player_die');
            
            if (this.isMultiplayer()) {
                if (fromEntity!==null) {
                    if (fromEntity!==this) {
                        this.getPlayerEntity().addScore(fromEntity.name,1);
                        this.updateInterfaceTemporaryText('multiplayer_message',(fromEntity.name+' killed '+this.name),5000);
                    }
                    else {
                        this.getPlayerEntity().addScore(fromEntity.name,-1);
                        this.updateInterfaceTemporaryText('multiplayer_message',(this.name+' committed suicide'),5000);
                    }
                }
            }
            
            return;
        }
        
        if (fromEntity!==null) this.targetEntity=fromEntity;
    }
    
    //
    // regular running of a multiplayer bot
    //
/*    
    run()
    {
        let nodeIdx,prevNodeIdx,moveForward;
        let turnDiff,slideLeft;
        
            // are we dead?
            
        if (this.deadCount!==-1) {
            this.rotMovement.setFromValues(0,0,0);      // can still fall
            this.moveInMapY(this.rotMovement,false);
            
            this.deadCount--;
            if (this.deadCount<=0) this.ready();
            return;
        }
        
            // if no node, just skip out
            
        if (this.nextNodeIdx===-1) return;
        
            // pick best weapon
            
        if ((this.hasM16) && (this.m16.ammoCount>0)) {
            this.switchWeapon(EntityRemoteClass.WEAPON_M16);
        }
        else {
            this.switchWeapon(EntityRemoteClass.WEAPON_BERETTA);
        }
        
            // look for things to shoot
            
        this.findEntityToFight();
        
        if (this.targetEntity!==null) this.fireWeapon();
        
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
                this.startModelAnimationChunkInFrames(null,30,960,996);
            }
        }
        
            // if we aren't paused, see if we hit
            // next node or goal
            
        else {

                // have we hit goal node?
                // we only chase goals if we aren't targetting another entity

            if (this.targetEntity===null) {
                if (this.hitPathNode(this.goalNodeIdx,EntityRemoteClass.NODE_SLOP)) {
                    nodeIdx=this.goalNodeIdx;
                    this.goalNodeIdx=this.getRandomKeyNodeIndex();
                    this.nextNodeIdx=this.nextNodeInPath(nodeIdx,this.goalNodeIdx);
                }
            }
            
                // have we hit the next node?
                // if we are targetting an entity, go to the next nearest
                // linked node closest to the entity, otherwise path to the goal

            if (this.hitPathNode(this.nextNodeIdx,EntityRemoteClass.NODE_SLOP)) {
                prevNodeIdx=this.nextNodeIdx;
                
                if (this.targetEntity===null) {
                    this.nextNodeIdx=this.nextNodeInPath(this.nextNodeIdx,this.goalNodeIdx);
                }
                else {
                    this.nextNodeIdx=this.nextNodeTowardsEntity(this.nextNodeIdx,this.targetEntity);
                }
                
                    // is this a node we should pause at?

                this.pausedTriggerName=this.isNodeATriggerPauseNode(prevNodeIdx,this.nextNodeIdx);
                if (this.pausedTriggerName!==null) {
                    this.startModelAnimationChunkInFrames(null,30,92,177);
                    return;
                }
            }
        }
        
            // if we are touching an entity, try to slide out
            // of the way
            
        slideLeft=false;
        
        if ((this.touchEntity!==null) && (moveForward)) {
            slideLeft=true;
        }
        
            // turn towards the node
            // if we aren't paused
        
        if (this.pausedTriggerName===null) {
            turnDiff=this.turnYTowardsNode(this.nextNodeIdx,EntityRemoteClass.MAX_TURN_SPEED);
            if (turnDiff>EntityRemoteClass.MAX_TURN_SLOW_DOWN) moveForward=false;
        }
        
            // changing angles based on if we are
            // walking nodes or targetting
            
        if (this.targetEntity===null) {
            this.drawAngle.turnYTowards(this.angle.y,EntityRemoteClass.MAX_TURN_SPEED);
        }
        else {
            this.lastTargetAngleDif=this.drawAngle.turnYTowards(this.position.angleYTo(this.targetEntity.position),EntityRemoteClass.MAX_TARGET_TURN_SPEED);
        }
        
            // move
            
        this.movement.moveZWithAcceleration(moveForward,false,EntityRemoteClass.FORWARD_ACCELERATION,EntityRemoteClass.FORWARD_DECELERATION,EntityRemoteClass.FORWARD_MAX_SPEED,EntityRemoteClass.FORWARD_ACCELERATION,EntityRemoteClass.FORWARD_DECELERATION,EntityRemoteClass.FORWARD_MAX_SPEED);        
        this.movement.moveXWithAcceleration(slideLeft,false,EntityRemoteClass.SIDE_ACCELERATION,EntityRemoteClass.SIDE_DECELERATION,EntityRemoteClass.SIDE_MAX_SPEED,EntityRemoteClass.SIDE_ACCELERATION,EntityRemoteClass.SIDE_DECELERATION,EntityRemoteClass.SIDE_MAX_SPEED);

        this.rotMovement.setFromPoint(this.movement);
        this.rotMovement.rotateY(null,this.angle.y);
        
        this.movement.y=this.moveInMapY(this.rotMovement,false);
        this.moveInMapXZ(this.rotMovement,true,true);
        
            // detect stuck
            // if we get stuck, then head towards the nearest node and
            // then onto a new random goal
            
        if ((this.position.equals(this.stuckPoint)) && (this.pausedTriggerName===null)) {
            this.stuckCount++;
            if (this.stuckCount>=EntityRemoteClass.MAX_STUCK_COUNT) {
                this.stuckCount=0;
                this.goalNodeIdx=this.getRandomKeyNodeIndex();
                this.nextNodeIdx=this.findNearestPathNode(-1);
            }
        }
        
        this.stuckPoint.setFromPoint(this.position);
    }
    
    drawSetup()
    {
            // we can face and run in different directions, so
            // we need to use the draw angle here
            
        this.setModelDrawPosition(this.position,this.drawAngle,this.scale,false);
        return(true);
    }
    */
}

/*
Berreta_COMBAT_mode 0-50
Berreta_Grenade_throw 51-91
Berreta_Looking_around 92-177
Berreta_RightFoot_kick 178-208
Berreta_Die_on_back 209-247
Berreta_Die_on_belt 252-359
Berreta_fire_staying 364-401
Berreta_Casual_walk 406-442
Berreta_Cautious_walk 447-487
Berreta_Combat_run 492-518
Berreta_Fire_run 523-549
Berreta_Fire_walk 554-594
Berreta_Fire_walking_back 599-634
Berreta_run 639-665
Berreta_Walking_back 670-705
M16_Combat_Mode 710-760
M16_Fire_Belt 765-770
M16_Fire_standing 775-815
M16_Grenade_throw 820-860
M16_Fire_Runing 865-887
M16_Fire_walking 892-928
M16_Run 933-955
M16_Walking 960-996
M16_Walking_back 1001-1036
 */