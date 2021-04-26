import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import BoundClass from '../../../code/utility/bound.js';
import EntityClass from '../../../code/game/entity.js';

export default class EntityFPSPlayerClass extends EntityClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,null,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.isPlayer=true;
        
            // model
        
        this.modelName=this.isMultiplayerGame()?data.model:'player';
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
        this.collisionHeightSegmentCount=4;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;
        
            // settings
            
        this.healthMaxCount=this.isMultiplayerGame()?data.healthMaxCount:100;
        this.armorMaxCount=this.isMultiplayerGame()?data.armorMaxCount:100;
        
        this.maxTurnSpeed=this.isMultiplayerGame()?data.maxTurnSpeed:8;
        this.maxLookSpeed=8;
        this.maxLookAngle=80;
        this.forwardAcceleration=15;
        this.forwardDeceleration=30;
        this.forwardMaxSpeed=this.isMultiplayerGame()?data.forwardMaxSpeed:200;
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
        
        this.jumpHeight=this.isMultiplayerGame()?data.jumpHeight:400;
        this.jumpWaterHeight=Math.trunc(this.jumpHeight*1.25);
        this.damageFlinchWaitTick=500;
        this.fallDamageMinDistance=10000;
        this.fallDamagePercentage=0.002;
        
            // variables
        
        this.health=0;
        this.armor=0;
        
        this.inStandingAnimation=true;
        
        this.nextDamageTick=0;
        this.falling=false;
        this.fallStartY=0;
        this.lastInLiquidIdx=-1;
        this.lastUnderLiquid=false;
        
        this.pistolWeapon=null;
        this.m16Weapon=null;
        this.grenadeWeapon=null;
        
        this.currentWeapon=null;
        this.gotoWeapon=null;
        this.weaponLowerFinishTick=-1;
        this.weaponRaiseFinishTick=-1;
        this.weaponClipFinishTick=-1;
        
        this.animationFinishTick=0;
        
        this.respawnTick=0;
        this.telefragTriggerEntity=null;

            // animations
            
        this.idleAnimationPistol={"startFrame":0,"endFrame":50, "actionFrame":0,"meshes":null};
        this.runAnimationPistol={"startFrame":492,"endFrame":518,"actionFrame":0,"meshes":null};
        this.fireIdleAnimationPistol={"startFrame":364,"endFrame":401,"actionFrame":0,"meshes":null};
        this.fireRunAnimationPistol={"startFrame":523,"endFrame":549,"actionFrame":0,"meshes":null};

        this.idleAnimationM16={"startFrame":710,"endFrame":760,"actionFrame":0,"meshes":null};
        this.runAnimationM16={"startFrame":933,"endFrame":955,"actionFrame":0,"meshes":null};
        this.fireIdleAnimationM16={"startFrame":775,"endFrame":815,"actionFrame":0,"meshes":null};
        this.fireRunAnimationM16={"startFrame":865,"endFrame":887,"actionFrame":0,"meshes":null};
        this.dieAnimation={"startFrame":209,"endFrame":247,"actionFrame":0,"meshes":null};
        
        this.throwGrenadeAnimation={"startFrame":51,"endFrame":91,"actionFrame":0,"meshes":null};
        
            // sounds
            
        this.hurtSound={"name":"hurt","rate":0.5,"randomRateAdd":1.0,"distance":5000,"loopStart":0,"loopEnd":0,"loop":false};
        this.dieSound={"name":"player_die","rate":0.8,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};

            // pre-allocates
            
        this.movement=new PointClass(0,0,0);
        this.rotMovement=new PointClass(0,0,0);
        this.firePosition=new PointClass(0,0,0);
        this.drawAngle=new PointClass(0,0,0);
        
        this.thirdPersonRegularCameraAngle=new PointClass(-20,180,0);
        
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
    
        //
        // player ready
        //
        
    ready()
    {
        super.ready();
        
            // default camera is first person
            
        this.cameraGotoFirstPerson();
        
            // health
            
        this.health=this.healthMaxCount;
        this.armor=0;
        
        this.passThrough=false;
        
        this.respawnTick=0;
        
        this.falling=false;
        this.fallStartY=0;
        
        this.nextDamageTick=0;
        this.lastInLiquidIdx=-1;
        this.lastUnderLiquid=false;
        
            // ready all the weapons
            
        this.pistolWeapon.ready();
        this.m16Weapon.ready();
        this.grenadeWeapon.ready();
        
        this.pistolWeapon.available=true;
        this.pistolWeapon.show=true;
        this.m16Weapon.available=false;
        this.m16Weapon.show=false;
        this.grenadeWeapon.available=true;          // don't need a show here, weapon has no model
        
        this.currentWeapon=this.pistolWeapon;
        
        this.adjustMeshesForCurrentWeapon();
        
        this.animationFinishTick=0;

            // start with the idle animation
            
        this.inStandingAnimation=true;
        this.setCurrentAnimation();
        
            // move to random spawn node
            // if multiplayer, if no nodes
            // yet, just leave spawned at 0,0,0
            
        this.telefragTriggerEntity=null;
        if ((this.core.game.multiplayerMode!==this.core.game.MULTIPLAYER_MODE_NONE) && (this.core.game.map.path.spawnNodes.length!==0)) this.moveToRandomSpawnNode(false);
        
            // turn off any score display
            
        this.multiplayerShowScores(false);
    }
    
        //
        // weapons, health, armor updates
        //
        
    addM16Weapon()
    {
        if (this.m16Weapon.available) return;
        
        this.m16Weapon.available=true;
        this.startWeaponSwitch(this.m16Weapon);
        
        this.pulseElement('m16_bullet',500,10);
    }
    
    addPistolClip(count)
    {
        this.pistolWeapon.addClip(count);
        this.pulseElement('pistol_bullet',500,10);
    }
    
    addM16Clip(count)
    {
        this.m16Weapon.addClip(count);
        this.pulseElement('m16_bullet',500,10);
    }
    
    addGrenadeAmmo(count)
    {
        this.grenadeWeapon.addAmmo(count);
        this.pulseElement('grenade',500,10);
    }
    
    addHealth(count)
    {
        this.health+=count;
        if (this.health>this.healthMaxCount) this.health=this.healthMaxCount;
        
        this.pulseElement('health',500,10);
    }
    
    addArmor(count)
    {
        this.armor+=count;
        if (this.armor>this.armorMaxCount) this.armor=this.armorMaxCount;
        
        this.pulseElement('armor',500,10);
    }
    
        //
        // health
        //
        
    die(fromEntity,isTelefrag)
    {
        this.respawnTick=this.core.game.timestamp+this.getMultiplayerRespawnWaitTick();
        this.passThrough=true;
        
        this.cameraGotoTopDown(10000);

        this.playSound(this.dieSound);
        this.startAnimation(this.dieAnimation);
        this.queueAnimationStop();
        
        this.multiplayerAddScore(fromEntity,this,isTelefrag);
        this.multiplayerShowScores(true);
        
        if (this.core.game.multiplayerMode===this.core.game.MULTIPLAYER_MODE_NONE) this.core.game.lost(this);
    }
    
    damage(fromEntity,damage,hitPoint)
    {
        let y,addway,subway;

            // already dead, can't take damage
            
        if ((this.health<=0) || (damage<=0)) return;
        
            // apply the hit indicator
            // or if no hit point, then on all sides
            
        if (hitPoint!==null) {
            
                // get position of hit from view direction
                
            y=this.position.angleYTo(hitPoint);
            
            if (this.angle.y>y) {
                addway=360.0-(this.angle.y-y);
                subway=this.angle.y-y;
            }
            else {
                addway=y-this.angle.y;
                subway=360.0-(y-this.angle.y);
            }
            
            y=(addway<subway)?addway:-subway;

                // get hit spot

            if ((y<=-45) && (y>=-135)) {
                this.hitFlashRight(500);
            }
            else {
                if ((y>=45) && (y<=135)) {
                    this.hitFlashLeft(500);
                }
                else {
                    if ((y>-45) && (y<45)) {
                        this.hitFlashTop(500);
                    }
                    else {
                        this.hitFlashBottom(500);
                    }
                }
            }
        }
        else {
            this.hitFlashAll(500);
        }
        
            // apply the damage
            
        this.armor-=damage;
        if (this.armor<0) {
            this.pulseElement('health',500,5);
            this.health+=this.armor;
            this.armor=0;
        }
        else {
            this.pulseElement('armor',500,5);
        }
        
            // dead?
        
        if (this.health<=0) {
            this.die(fromEntity,false);
            return;
        }
        
            // hurt sound
            
        if (this.core.game.timestamp>this.nextDamageTick) {
            this.nextDamageTick=this.core.game.timestamp+this.damageFlinchWaitTick;
            this.playSound(this.hurtSound);
        }
    }
    
    telefrag(fromEntity)
    {
        this.telefragTriggerEntity=fromEntity;
    }
    
        //
        // animation utilities
        //
        
    setCurrentAnimation()
    {
            // are we stalled in another animation?
            
        if (this.animationFinishTick!==0) {
            if (this.animationFinishTick<this.getTimestamp()) this.animationFinishTick=0;
        }
        
            // setup the running animation
            
        if ((this.movement.x!==0) || (this.movement.z!==0)) {
            if (this.animationFinishTick===0) this.continueAnimation((this.currentWeapon===this.pistolWeapon)?this.runAnimationPistol:this.runAnimationM16);
            this.inStandingAnimation=false;
        }
        else {
            if (this.animationFinishTick===0) this.continueAnimation((this.currentWeapon===this.pistolWeapon)?this.idleAnimationPistol:this.idleAnimationM16);
            this.inStandingAnimation=true;
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
               
    startWeaponSwitch(weapon)
    {
        if (weapon===this.currentWeapon) return;
        
        this.gotoWeapon=weapon;
        
            // lower current weapon
        
        if (this.currentWeapon!==null) {
            this.weaponLowerFinishTick=this.core.game.timestamp+this.currentWeapon.runLowerAnimation();
        }
        else {
            swapWeaponSwitch();
        }
    }
    
    swapWeaponSwitch()
    {
            // hide the current weapon
        
        if (this.currentWeapon!==null) this.currentWeapon.show=false;
        
        this.weaponLowerFinishTick=-1;
        
            // start the raise
            
        this.currentWeapon=this.gotoWeapon;
                
        this.currentWeapon.show=true;

        this.adjustMeshesForCurrentWeapon();

        this.weaponRaiseFinishTick=this.core.game.timestamp+this.currentWeapon.runRaiseAnimation();
    }
    
    endWeaponSwitch()
    {
        this.weaponRaiseFinishTick=-1;
    }
    
    runWeaponAnimations()
    {
        let weaponSwitchFreeze=false;
        
        if (this.weaponLowerFinishTick!==-1) {
            if (this.weaponLowerFinishTick<=this.core.game.timestamp) {
                this.swapWeaponSwitch();
            }
            weaponSwitchFreeze=true;
        }
        
        if (this.weaponRaiseFinishTick!==-1) {
            if (this.weaponRaiseFinishTick<=this.core.game.timestamp) {
                this.endWeaponSwitch();
            }
            else {
                weaponSwitchFreeze=true;
            }
        }

        if (this.weaponClipFinishTick!==-1) {
            if (this.weaponClipFinishTick<=this.core.game.timestamp) {
                this.weaponClipFinishTick=-1;
            }
            else {
                weaponSwitchFreeze=true;
            }
        }

        return(weaponSwitchFreeze);
    }
    
    runSwitchWeaponInput()
    {
        let switchWeapon,weapChangeDir;
        
        switchWeapon=this.currentWeapon;
        weapChangeDir=this.mouseWheelRead()+this.getTouchSwipeLeftX();

        if (weapChangeDir!==0) {
            if (this.currentWeapon===this.pistolWeapon) {
                if (this.m16Weapon.available) switchWeapon=this.m16Weapon;
            }
            else {
                switchWeapon=this.pistolWeapon;
            }
        }
        
        if (this.isKeyDown('1')) switchWeapon=this.pistolWeapon;
        if ((this.isKeyDown('2')) && (this.m16Weapon.available)) switchWeapon=this.m16Weapon;
    
        if (this.currentWeapon!==switchWeapon) {
            this.startWeaponSwitch(switchWeapon);
        }
    }
    
    runWeaponFiring()
    {
        let weapon;
        let timestamp=this.getTimestamp();
        
        weapon=null;
        
        if (this.isMouseButtonDown(0)||this.isTouchStickRightClick()) weapon=this.currentWeapon;
        if (this.isMouseButtonDown(2)||(this.getTouchSwipeRightY()<0)) weapon=this.grenadeWeapon;

        if (weapon===null) return;
        
        this.firePosition.setFromPoint(this.position);
        this.firePosition.y+=this.eyeOffset;
        
            // fire wait

        if (weapon.isFirePaused()) return;

            // check for clip reload

        if (weapon.needClipChange()) {
            this.weaponClipFinishTick=this.core.game.timestamp+weapon.changeClip(this.position);
            return;
        }

            // fire

        weapon.fire(this.firePosition,this.angle);
        
            // animations
            
        if (weapon===this.pistolWeapon) {
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
            if (weapon===this.m16Weapon) {
                if (this.inStandingAnimation) {
                    this.continueAnimation(this.fireIdleAnimationM16);
                    this.animationFinishTick=timestamp+this.getAnimationTickCount(this.fireIdleAnimationM16);
                }
                else {
                    this.continueAnimation(this.fireRunAnimationM16);
                    this.animationFinishTick=timestamp+this.getAnimationTickCount(this.fireRunAnimationM16);
                }
            }
            else {
                if (weapon===this.grenadeWeapon) {
                    this.startAnimation(this.throwGrenadeAnimation);
                    this.animationFinishTick=timestamp+this.getAnimationTickCount(this.throwGrenadeAnimation);
                }
            }
        }
    }
    
        //
        // run
        //
    
    run()
    {
        let x,y;
        let moveForward,moveBackward,moveLeft,moveRight;
        let liquid,liquidIdx,bump,gravityFactor,fallDist;
        let turnAdd,lookAdd;
        let setup=this.core.setup;
        
        super.run();
        
        if (this.core.game.freezePlayer) return;
        
            // liquid changes
            
        liquidIdx=this.core.game.map.liquidList.getLiquidForEyePoint(this.position,this.eyeOffset);
        
        if (liquidIdx!==-1) {
            this.lastUnderLiquid=true;
        }
        else {
            if ((this.lastUnderLiquid) && (this.angle.x<0)) {
                this.gravity=this.core.game.map.gravityMinValue;
                this.movement.y=this.jumpWaterHeight;
                if (this.lastInLiquidIdx!==-1) this.core.game.map.liquidList.liquids[this.lastInLiquidIdx].playSoundOut(this.position);
            }
            
            this.lastUnderLiquid=false;
        }
        
        liquidIdx=this.core.game.map.liquidList.getLiquidForPoint(this.position);
        
        if (liquidIdx!==-1) {
            liquid=this.core.game.map.liquidList.liquids[liquidIdx];
            if (this.lastInLiquidIdx===-1) liquid.playSoundIn(this.position);
            this.lastInLiquidIdx=liquidIdx;
            gravityFactor=liquid.gravityFactor;
        }
        else {
            if (this.lastInLiquidIdx!==-1) this.core.game.map.liquidList.liquids[this.lastInLiquidIdx].playSoundOut(this.position);
            this.lastInLiquidIdx=-1;
            gravityFactor=1.0;
        }
        
            // update any UI
            
        this.updateText('pistol_clip_count',this.pistolWeapon.clipCount);
        this.updateText('pistol_bullet_count',this.pistolWeapon.ammoInClipCount);
        this.updateText('m16_clip_count',this.m16Weapon.clipCount);
        this.updateText('m16_bullet_count',this.m16Weapon.ammoInClipCount);
        this.updateText('grenade_count',this.grenadeWeapon.ammoCount);
        this.updateText('health_count',this.health);
        this.updateText('armor_count',this.armor);
        
        if (!this.cameraIsFirstPerson()) {
            this.showElement('pistol_crosshair',false);
            this.showElement('m16_crosshair',false);
        }
        else {
            if (this.currentWeapon===this.pistolWeapon) {
                this.showElement('pistol_crosshair',true);
                this.showElement('m16_crosshair',false);
            }
            else {
                this.showElement('pistol_crosshair',false);
                this.showElement('m16_crosshair',true);
            }
        }
        
            // dead
            
        if (this.respawnTick!==0) {
            
                // keep falling
                
            this.rotMovement.setFromValues(0,0,0);
            this.moveInMapY(this.rotMovement,gravityFactor,false);
            
                // only recover in multiplayer
                
            if (this.core.game.multiplayerMode!==this.core.game.MULTIPLAYER_MODE_NONE) {
                if (this.core.game.timestamp>this.respawnTick)  this.ready();
            }
            
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
                if (fallDist>0) this.damage(this,Math.trunc(fallDist*this.fallDamagePercentage),null);
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
        
            // weapons
            
        if (!this.runWeaponAnimations()) {
            this.runSwitchWeaponInput();
            this.runWeaponFiring();
        }
        
            // forward and shift controls
            
        x=this.getTouchStickLeftX();
        y=this.getTouchStickLeftY();
            
        moveForward=(this.isKeyDown('w')) || (this.isKeyDown('ArrowUp')) || (y<0);
        moveBackward=(this.isKeyDown('s')) || (this.isKeyDown('ArrowDown')) || (y>0);
        moveLeft=this.isKeyDown('a') || (x<0);
        moveRight=this.isKeyDown('d') || (x>0);
        
            // turning
            
        turnAdd=0;
            
        x=this.getMouseMoveX();
        if (x!==0) {
            turnAdd=-(x*setup.mouseXSensitivity);
            turnAdd+=(turnAdd*setup.mouseXAcceleration);
            if (setup.mouseXInvert) turnAdd=-turnAdd;
            if (Math.abs(turnAdd)>this.maxTurnSpeed) turnAdd=this.maxTurnSpeed*Math.sign(turnAdd);
        }
        
        x=this.getTouchStickRightX();
        turnAdd-=x;
        
        if (turnAdd!==0) {
            this.angle.y+=turnAdd;
            if (this.angle.y<0.0) this.angle.y+=360.0;
            if (this.angle.y>=360.00) this.angle.y-=360.0;
        }
        
            // looking
            
        lookAdd=0;
            
        if (this.cameraIsFirstPerson()) {
            y=this.getMouseMoveY();
            if (y!==0) {
                lookAdd=y*setup.mouseYSensitivity;
                lookAdd+=(lookAdd*setup.mouseYAcceleration);
                if (setup.mouseYInvert) lookAdd=-lookAdd;
                if (Math.abs(lookAdd)>this.maxLookSpeed) lookAdd=this.maxLookSpeed*Math.sign(lookAdd);
            }

            y=this.getTouchStickRightY();
            lookAdd+=y;

            if ((setup.snapLook) && (moveForward || moveBackward || moveLeft || moveRight)) {
                if (lookAdd===0) {
                    this.angle.x=this.angle.x*0.95;
                    if (Math.abs(this.angle.x)<0.05) this.angle.x=0;
                }
            }
        
            if (lookAdd!==0) {
                this.angle.x+=lookAdd;
                if (this.angle.x<-this.maxLookAngle) this.angle.x=-this.maxLookAngle;
                if (this.angle.x>=this.maxLookAngle) this.angle.x=this.maxLookAngle;
            }
        }
        else {
            this.angle.x=0;
        }
        
            // jumping
           
        if (this.isKeyDown(' ')) {
            if ((this.standOnMeshIdx!==-1) && (!this.lastUnderLiquid)) {
                this.gravity=this.core.game.map.gravityMinValue;
                this.movement.y=this.jumpHeight;
            }
        }
        
            // can only bump if we aren't falling
            // as otherwise ledges can catch you and
            // bump you back up, the only exception is
            // swimming, which always bumps over small obstacles
            
        bump=(this.standOnMeshIdx!==-1)||(this.lastUnderLiquid);
        
            // move
         
        if (this.lastUnderLiquid) {
            this.movement.moveZWithAcceleration(moveForward,moveBackward,this.swimAcceleration,this.swimDeceleration,this.swimMaxSpeed,this.swimAcceleration,this.swimDeceleration,this.swimMaxSpeed);
        }
        else {
            this.movement.moveZWithAcceleration(moveForward,moveBackward,this.forwardAcceleration,this.forwardDeceleration,this.forwardMaxSpeed,this.backwardAcceleration,this.backwardDeceleration,this.backwardMaxSpeed);
        }

        this.movement.moveXWithAcceleration(moveLeft,moveRight,this.sideAcceleration,this.sideDeceleration,this.sideMaxSpeed,this.sideAcceleration,this.sideDeceleration,this.sideMaxSpeed);
        
        this.rotMovement.setFromPoint(this.movement);
        if (this.lastUnderLiquid) {
            this.rotMovement.y=0;       // only Y movement comes from X angle rotation
            this.rotMovement.rotateX(null,this.angle.x);     // if flying or swimming, add in the X rotation
        }
        this.rotMovement.rotateY(null,this.angle.y);

        this.movement.y=this.moveInMapY(this.rotMovement,gravityFactor,false);
        this.moveInMapXZ(this.rotMovement,bump,true);
        
            // current animation
            
        this.setCurrentAnimation();
        
        if (this.currentWeapon!==null) {
            if ((this.weaponLowerFinishTick===-1) && (this.weaponRaiseFinishTick===-1) && (this.weaponClipFinishTick===-1)) {
                this.currentWeapon.setIdleAnimation();
            }
        }
        
            // camera switching
            
        if (this.isKeyDownAndClear('/')) {
            if (this.cameraIsFirstPerson()) {
                this.cameraGotoThirdPerson(10000,this.thirdPersonRegularCameraAngle);
            }
            else {
                this.cameraGotoFirstPerson();
            }
        }
    }
    
    drawSetup()
    {
        if (this.model===null) return(false);
        
        this.drawAngle.setFromValues(0,this.angle.y,0);
        this.setModelDrawAttributes(this.position,this.drawAngle,this.scale,false);

        if (this.cameraIsFirstPerson()) return(false);
        return(this.boundBoxInFrustum());
    }
}

