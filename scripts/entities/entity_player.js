import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import ProjectEntityDeveloperClass from '../../../code/project/project_entity_developer.js';
import EntityWeaponBerettaClass from '../entities/entity_weapon_beretta.js';
import EntityWeaponM16Class from '../entities/entity_weapon_m16.js';
import EntityWeaponGrenadeClass from '../entities/entity_weapon_grenade.js';

export default class EntityPlayerClass extends ProjectEntityDeveloperClass
{
        //
        // initialize and release
        //
        
    initialize()
    {
        super.initialize();
        
        this.MAX_TURN_SPEED=8;
        this.MOUSE_MAX_LOOK_SPEED=8;
        this.MAX_LOOK_ANGLE=80.0;
        this.FORWARD_ACCELERATION=15;
        this.FORWARD_DECELERATION=30;
        this.FORWARD_MAX_SPEED=200;
        this.SIDE_ACCELERATION=25;
        this.SIDE_DECELERATION=50;
        this.SIDE_MAX_SPEED=120;
        this.JUMP_HEIGHT=400;
        this.JUMP_WATER_HEIGHT=400;
        this.FLY_SWIM_Y_REDUCE=0.5;
        this.DAMAGE_FLINCH_WAIT_TICK=500;
        this.RANDOM_NODE_FAIL_COUNT=20;
        this.MAX_DEATH_COUNT=500;
        this.WEAPON_BERETTA=0;
        this.WEAPON_M16=1;
        this.MAX_SCORES=5;

            // settings
            
        this.radius=1500;
        this.height=4500;
        
        this.eyeOffset=4400;
        this.bumpHeight=1400;
        
        this.gravityMinValue=10;
        this.gravityMaxValue=450;
        this.gravityAcceleration=20;
        
        this.nextDamageTick=0;
        
        this.filter='player';          // filters are used when searching for entities
        
            // this is the player, replace
            // the name with setup name
            
        this.name=this.getSetup().name;
        
            // player setup
            
        this.health=100;
        this.armor=0;
        this.deadCount=-1;
        this.lastUnderLiquid=false;
        this.lastInLiquid=false;
        this.currentWeapon=0;
        this.hasM16=false;
        this.nextDamageTick=0;
        this.scores=null;
        this.scoreColor=null;
        this.lastScoreCount=0;
    
        this.cameraKeyDown=false;
        this.cameraFPP=true;
    
        this.inStandingAnimation=true;
        
            // some touch control flags
            
        this.touchForwardMove=false;
        this.touchBackwardMove=false;
        this.touchLeftMove=false;
        this.touchRightMove=false;

            // some pre-allocations
            
        this.movement=new PointClass(0,0,0);
        this.rotMovement=new PointClass(0,0,0);
        
            // the model
         
        this.setModel('player');
        this.scale.setFromValues(3000,3000,3000);
        
        this.drawAngle=new PointClass(0,0,0);
        
            // weapons

        this.beretta=this.addEntity(EntityWeaponBerettaClass,'weapon_beretta',new PointClass(0,0,0),new PointClass(0,0,0),null,true,true);
        this.m16=this.addEntity(EntityWeaponM16Class,'weapon_m16',new PointClass(0,0,0),new PointClass(0,0,0),null,false,true);
        this.grenade=this.addEntity(EntityWeaponGrenadeClass,('weapon_grenade'),new PointClass(0,0,0),new PointClass(0,0,0),null,false,true);
    }
    
    release()
    {
        super.release();
        
        this.removeEntity(this.beretta);
        this.removeEntity(this.m16);
        this.removeEntity(this.grenade);
    }
    
        //
        // screen tinting
        //
        
    getScreenTint(tintColor)
    {
        let deadFactor,liquidIdx,liquid;
        
            // all red if dead
            
        if (this.deadCount!==-1) {
            deadFactor=0.2+((this.deadCount/this.MAX_DEATH_COUNT)*0.5);
            tintColor.setFromValues((1.0-deadFactor),0.2,0.2);
            return(true);
        }
        
            // otherwise only liquid tints
            
        liquidIdx=this.getUnderLiquidIndex();
        if (liquidIdx===-1) return(false);
        
        liquid=this.getLiquidList().liquids[liquidIdx];
        tintColor.setFromColor(liquid.tint);
        
        return(true);
    }
    
        //
        // ready
        //
        
    ready()
    {
            // full health
            
        this.health=100;
        this.armor=0;
        this.deadCount=-1;
        this.passThrough=false;         // reset if this is being called after bot died
        this.angle.x=0;
        
        this.touchForwardMove=false;
        this.touchBackwardMove=false;
        this.touchLeftMove=false;
        this.touchRightMove=false;
        
            // get rid of jetpack from model
            
        this.showModelMesh('Captain_jetpack',false);
        
            // start with beretta
            // and reset the weapons
            
        this.currentWeapon=this.WEAPON_BERETTA;
        
        this.beretta.ready();
        this.m16.ready();
        this.grenade.ready();
        
        this.beretta.show=true;
        this.m16.show=false;
        this.hasM16=false;
        
            // turn off any score display
            
        this.startScore();
        this.displayScore(false);
        
            // start with standing animation
            
        this.inStandingAnimation=true;
        this.startModelAnimationChunkInFrames(null,30,0,50);
        
            // move to random node
            // if multiplayer
            
        if (this.isMultiplayer()) this.moveToRandomNode(this.RANDOM_NODE_FAIL_COUNT);
    }
    
        //
        // called when somebody damages this entity
        //
    
    damage(fromEntity,damage,hitPoint)
    {
        let timestamp;
        
            // already dead, can't take damage
            
        if (this.deadCount!==-1) return;
        
            // pulse and take the damage
            
        if (!this.debugNoDamage) {
            this.armor-=damage;
            if (this.armor<0) {
                this.pulseInterfaceElement('health',500,5);
                this.health+=this.armor;
                this.armor=0;
            }
            else {
                this.pulseInterfaceElement('armor',500,5);
            }
        }
        else {
            this.pulseInterfaceElement('health',500,5);
        }
        
            // dead?
        
        if (this.health<=0) {
            this.deadCount=this.MAX_DEATH_COUNT;
            this.passThrough=true;
            this.beretta.show=false;
            this.m16.show=false;
            this.playSound('player_die',1.0,false);
            
            if (this.isMultiplayer()) {
                if (fromEntity!==null) {
                    if (fromEntity!==this) {
                        this.addScore(fromEntity.name,1);
                        this.updateInterfaceTemporaryText('multiplayer_message',(fromEntity.name+' killed '+this.name),5000);
                    }
                    else {
                        this.addScore(fromEntity.name,-1);
                        this.updateInterfaceTemporaryText('multiplayer_message',(this.name+' committed suicide'),5000);
                    }
                }
                this.displayScore(true);
            }
            
            this.startModelAnimationChunkInFrames(null,30,209,247);
            
            return;
        }
        
            // hurt sound
            
        timestamp=this.getTimestamp();
        if (timestamp>this.nextDamageTick) {
            this.nextDamageTick=timestamp+this.DAMAGE_FLINCH_WAIT_TICK;
            this.playSound('hurt',(1.0+(0.5-Math.random())),false);
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
                this.currentWeapon=this.WEAPON_M16;
                this.beretta.show=false;
                this.m16.show=true;
                return(true);
            }
            return(false);
        }
        
        if (name==='m16_ammo') {
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
            this.pulseInterfaceElement('health',500,5);
            this.health=Math.min((this.health+25),100);
            return(true);
        }
        
        if (name==='armor') {
            this.pulseInterfaceElement('armor',500,5);
            this.armor=Math.min((this.armor+100),100);
            return(true);
        }
        
        return(false);
    }
    
        //
        // scoring
        //
        
    startScore()
    {
        let entity;
        let entityList=this.getEntityList();
        
            // if we already started score, then ignore this
            
        if (this.scores!==null) return; 
        
            // create the scores
            
        this.scores=new Map();
        
        for (entity of entityList.entities) {
            if ((entity.filter==='bot') || (entity.filter==='remote') || (entity.filter==='player')) this.scores.set(entity.name,0);
        }
        
        this.scoreColor=new ColorClass(0,1,0.2);
    }
    
    addScore(name,points)
    {
        let score=this.scores.get(name);
        if (score===undefined) score=0;
        
        this.scores.set(name,(score+points));
    }
    
    displayScore(show)
    {
        let n,x,y;
        let iter,rtn,name,points,insertIdx;
        let wid=this.getInterfaceWidth();
        let high=this.getInterfaceHeight();
        let sortedNames=[];
        
            // if no show, remove all items
            // if they exist
            
        if (!show) {
            for (n=0;n!==this.lastScoreCount;n++) {
                this.removeInterfaceText('score_name_'+n);
                this.removeInterfaceText('score_point_'+n);
            }
            
            this.lastScoreCount=0;
            return;
        }
        
            // sort the scores
             
        iter=this.scores.keys();
        
        while (true) {
            rtn=iter.next();
            if (rtn.done) break;
            
            name=rtn.value;
            points=this.scores.get(name);
            
            if (sortedNames.length===0) {
                sortedNames.push(name);
            }
            else {
                insertIdx=0;

                for (n=(sortedNames.length-1);n>=0;n--) {
                    if (points<this.scores.get(sortedNames[n])) {
                        insertIdx=n+1;
                        break;
                    }
                }

                sortedNames.splice(insertIdx,0,name);
            }
        }
        
            // add the items
            
        x=Math.trunc(wid*0.5)-5;
        y=Math.trunc(high*0.5)-Math.trunc((35*sortedNames.length)*0.5);
        
        for (n=0;n!=sortedNames.length;n++) {
            this.addInterfaceText(('score_name_'+n),sortedNames[n],x,y,30,this.TEXT_ALIGN_RIGHT,this.scoreColor,1);
            this.addInterfaceText(('score_point_'+n),this.scores.get(sortedNames[n]),(x+10),y,30,this.TEXT_ALIGN_LEFT,this.scoreColor,1);
            
            y+=35;
        }
        
        this.lastScoreCount=sortedNames.length;
    }
    
        //
        // run player
        //
    
    run()
    {
        let n,x,y,touch,liquidIdx;
        let moveForward,moveBackward,moveLeft,moveRight,turnAdd,lookAdd;
        let mouseWheelClick,bump;
        let fireWeapon,fireGrenade;
        let setup=this.getSetup();
        
        super.run();
        
            // update the UI
            
        this.updateInterfaceText('beretta_bullet_count',this.beretta.ammoCount);
        this.updateInterfaceText('m16_bullet_count',this.m16.ammoCount);
        this.updateInterfaceText('grenade_count',this.grenade.ammoCount);
        this.updateInterfaceText('armor_count',this.armor);
        this.updateInterfaceText('health_count',this.health);
        
            // dead
            
        if (this.deadCount!==-1) {
            this.deadCount--;
            
                // keep falling
                
            this.rotMovement.setFromValues(0,0,0);
            this.moveInMapY(this.rotMovement,false);
            
                // dying twist
                
            if ((!this.isMultiplayer()) && (this.deadCount===0)) this.deadCount=1;       //  never recover if not multiplayer
            if (this.deadCount>1) {
                if (this.angle.x>-80.0) {
                    this.position.y-=20;        // sink to ground
                    this.angle.x-=1.5;
                }
            }      
            
                // respawn
                
            if (this.deadCount<=0) this.ready();
            return;
        }
        
            // deal with controls
          
        turnAdd=0;
        lookAdd=0;
        
            // keyboard
            
        moveForward=(this.isKeyDown('w')) || (this.isKeyDown('ArrowUp')) || this.touchForwardMove;
        moveBackward=(this.isKeyDown('s')) || (this.isKeyDown('ArrowDown')) || this.touchBackwardMove;
        moveLeft=this.isKeyDown('a') || this.touchLeftMove;
        moveRight=this.isKeyDown('d') || this.touchRightMove;
        
            // mouse
            
        x=this.getMouseMoveX();
        if (x!==0) {
            turnAdd=-(x*setup.mouseXSensitivity);
            turnAdd+=(turnAdd*setup.mouseXAcceleration);
            if (setup.mouseXInvert) turnAdd=-turnAdd;
            if (Math.abs(turnAdd)>this.MOUSE_MAX_TURN_SPEED) turnAdd=this.MOUSE_MAX_TURN_SPEED*Math.sign(turnAdd);
        }
        
        y=this.getMouseMoveY();
        if (y!==0) {
            lookAdd=y*setup.mouseYSensitivity;
            lookAdd+=(lookAdd*setup.mouseYAcceleration);
            if (setup.mouseYInvert) lookAdd=-lookAdd;
            if (Math.abs(lookAdd)>this.MOUSE_MAX_LOOK_SPEED) lookAdd=this.MOUSE_MAX_LOOK_SPEED*Math.sign(lookAdd);
        }
        
        fireWeapon=this.isMouseButtonDown(0);
        fireGrenade=this.isMouseButtonDown(2);
        
            // touch
            
        for (n=0;n!==this.getTouchTrackCount();n++) {
            touch=this.getTouchClick(n);
            if (touch!==null) {
                if (touch.quadrant===this.TOUCH_QUADRANT_BOTTOMRIGHT) fireWeapon=true;
                continue;
            }
            
            touch=this.getTouchSwipe(n);
            if (touch===null) continue;
            
            switch (touch.quadrant) {
                
                case this.TOUCH_QUADRANT_BOTTOMLEFT:
                    if (touch.y<0) {
                        if (this.touchBackwardMove) {
                            this.touchBackwardMove=false;
                        }
                        else {
                            this.touchForwardMove=true;
                        }
                    }
                    if (touch.y>0) {
                        if (this.touchForwardMove) {
                            this.touchForwardMove=false;
                        }
                        else {
                            this.touchBackwardMove=true;
                        }
                    }
                    break;
                    
                case this.TOUCH_QUADRANT_BOTTOMRIGHT:
                    turnAdd=touch.x*1;
                    lookAdd=touch.y*1;
                    break;
                    
                case this.TOUCH_QUADRANT_TOPRIGHT:
                    if (touch.y<0) fireGrenade=true;     // swipe up in top right
                    break;
            }
        }
        
            // fire weapon
            
        if (fireWeapon) {
            switch (this.currentWeapon) {
                case this.WEAPON_BERETTA:
                    this.beretta.fire(this.position,this.angle,this.eyeOffset);
                    break;
                case this.WEAPON_M16:
                    this.m16.fire(this.position,this.angle,this.eyeOffset);
                    break;
            }
        }
        
            // grenade throw
        
        if (fireGrenade) this.grenade.fire(this.position,this.angle,this.eyeOffset);

            // change weapons
            // for this demo, we just have two weapons so we do it the simple way
        
        mouseWheelClick=this.getMouseWheelClick();

        if ((mouseWheelClick<0) || (this.isKeyDown('1'))) {
            this.currentWeapon=this.WEAPON_BERETTA;
            this.beretta.show=true;
            this.m16.show=false;
        }
        
        if (((mouseWheelClick>0) || (this.isKeyDown('2'))) && (this.hasM16)) {
            this.currentWeapon=this.WEAPON_M16;
            this.beretta.show=false;
            this.m16.show=true;
        }
        
            // turning
        
        if (turnAdd!==0) {
            this.angle.y+=turnAdd;
            if (this.angle.y<0.0) this.angle.y+=360.0;
            if (this.angle.y>=360.00) this.angle.y-=360.0;
        }
        
            // looking
           
        if (this.getCamera().isFirstPerson()) {
            if (lookAdd!==0) {
                this.angle.x+=lookAdd;
                if (this.angle.x<-this.MAX_LOOK_ANGLE) this.angle.x=-this.MAX_LOOK_ANGLE;
                if (this.angle.x>=this.MAX_LOOK_ANGLE) this.angle.x=this.MAX_LOOK_ANGLE;
            }
        }
        else {
            this.angle.x=0;
        }
        
            // determine if we've passed out of a liquid
            // if we are, auto-jump to get out of liquid
        
        liquidIdx=this.getUnderLiquidIndex();
        
        if (liquidIdx!==-1) {
            this.lastUnderLiquid=true;
        }
        else {
            if ((this.lastUnderLiquid) && (this.angle.x>0)) {
                this.gravity=0;
                this.movement.y-=this.JUMP_WATER_HEIGHT;
            }
            
            this.lastUnderLiquid=false;
        }
        
        liquidIdx=this.getInLiquidIndex();
        
        if (liquidIdx!==-1) {
            if (!this.lastInLiquid) this.playSound('splash',1.0,false);
            this.lastInLiquid=true;
        }
        else {
            if (this.lastInLiquid) this.playSound('splash',0.8,false);
            this.lastInLiquid=false;
        }
        
            // jumping
           
        if (this.isKeyDown(' ')) {
            if ((this.isStandingOnFloor()) && (liquidIdx===-1) && (!this.debugPlayerFly)) {
                this.gravity=this.gravityMinValue;
                this.movement.y=this.JUMP_HEIGHT;
            }
        }
        
            // can only bump if we aren't falling
            // as otherwise ledges can catch you and
            // bump you back up
            
            // the only exception is swimming, which always
            // bumps over small obstacles
            
        bump=(this.isStandingOnFloor())||(this.lastUnderLiquid);
        
            // figure out the movement
         
        this.movement.moveZWithAcceleration(moveForward,moveBackward,this.FORWARD_ACCELERATION,this.FORWARD_DECELERATION,this.FORWARD_MAX_SPEED,this.FORWARD_ACCELERATION,this.FORWARD_DECELERATION,this.FORWARD_MAX_SPEED);
        this.movement.moveXWithAcceleration(moveLeft,moveRight,this.SIDE_ACCELERATION,this.SIDE_DECELERATION,this.SIDE_MAX_SPEED,this.SIDE_ACCELERATION,this.SIDE_DECELERATION,this.SIDE_MAX_SPEED);
        
        this.rotMovement.setFromPoint(this.movement);
        if ((this.debugPlayerFly) || (this.lastUnderLiquid)) {
            this.rotMovement.y=0;       // only Y movement comes from X angle rotation
            this.rotMovement.rotateX(null,this.angle.x);     // if flying or swimming, add in the X rotation
            this.rotMovement.y*=this.FLY_SWIM_Y_REDUCE;
        }
        this.rotMovement.rotateY(null,this.angle.y);

            // if no clipping is on then
            // just move directly through map
            
        if (this.debugPlayerNoClip) {
            this.position.addPoint(this.rotMovement);
        }

            // move around the map
        
        else {
            this.movement.y=this.moveInMapY(this.rotMovement,this.debugPlayerFly);
            this.moveInMapXZ(this.rotMovement,bump,true);
        }
        
            // camera swaps
            
        if (this.isKeyDown('`')) {
            if (!this.cameraKeyDown) {
                this.cameraKeyDown=true;
                if (this.cameraFPP) {
                    this.cameraFPP=false;
                    this.getCamera().gotoThirdPersonBehind(10000,-10);
                    this.showInterfaceElement('crosshair',false);
                }
                else {
                    this.cameraFPP=true;
                    this.getCamera().gotoFirstPerson();
                    this.showInterfaceElement('crosshair',true);
                }
            }
        }
        else {
            this.cameraKeyDown=false;
        }
        
            // current animation
            
        if ((this.movement.x!==0) || (this.movement.z!==0)) {
            if (this.currentWeapon===this.WEAPON_BERETTA) {
                if (fireWeapon) {
                    this.startModelAnimationChunkInFrames(null,30,523,549);
                    this.queueModelAnimationChunkInFrames(null,30,492,518);
                }
                else {
                    if (this.inStandingAnimation) this.startModelAnimationChunkInFrames(null,30,492,518);
                }
            }
            else {
                if (fireWeapon) {
                    this.startModelAnimationChunkInFrames(null,30,865,887);
                    this.queueModelAnimationChunkInFrames(null,30,933,955);
                }
                else {
                    if (this.inStandingAnimation) this.startModelAnimationChunkInFrames(null,30,933,955);
                }
            }
            
            this.inStandingAnimation=false;
        }
        else {
            if (this.currentWeapon===this.WEAPON_BERETTA) {
                if (fireWeapon) {
                    this.startModelAnimationChunkInFrames(null,30,364,401);
                    this.queueModelAnimationChunkInFrames(null,30,0,50);
                }
                else {
                    if (!this.inStandingAnimation) this.startModelAnimationChunkInFrames(null,30,0,50);
                }
            }
            else {
                if (fireWeapon) {
                    this.startModelAnimationChunkInFrames(null,30,775,815);
                    this.queueModelAnimationChunkInFrames(null,30,710,760);
                }
                else {
                    if (!this.inStandingAnimation) this.startModelAnimationChunkInFrames(null,30,710,760);
                }
            }
            
            this.inStandingAnimation=true;
        }
    }
    
        //
        // we need to remove the look angle from the player model
        // player is only drawn in third person
        //
        
    drawSetup()
    {
        this.drawAngle.setFromValues(0,this.angle.y,0);
        this.setModelDrawPosition(this.position,this.drawAngle,this.scale,false);
        
        return(this.getCamera().isThirdPersonBehind()) ;
    }
}
