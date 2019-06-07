import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import InterfaceTextClass from '../../../code/interface/interface_text.js';
import ProjectEntityDeveloperClass from '../../../code/project/project_entity_developer.js';
import EntityWeaponBerettaClass from '../entities/entity_weapon_beretta.js';
import EntityWeaponM16Class from '../entities/entity_weapon_m16.js';
import EntityWeaponGrenadeClass from '../entities/entity_weapon_grenade.js';

export default class EntityPlayerClass extends ProjectEntityDeveloperClass
{
    static MAX_TURN_SPEED=8;
    static MOUSE_MAX_LOOK_SPEED=8;
    static MAX_LOOK_ANGLE=80.0;
    static FORWARD_ACCELERATION=15;
    static FORWARD_DECELERATION=30;
    static FORWARD_MAX_SPEED=200;
    static SIDE_ACCELERATION=25;
    static SIDE_DECELERATION=50;
    static SIDE_MAX_SPEED=120;
    static JUMP_HEIGHT=400;
    static JUMP_WATER_HEIGHT=400;
    static FLY_SWIM_Y_REDUCE=0.5;
    static RANDOM_NODE_FAIL_COUNT=20;
    static MAX_DEATH_COUNT=500;
    static WEAPON_BERETTA=0;
    static WEAPON_M16=1;
    static MAX_SCORES=5;
    
    health=100;
    armor=0;
    deadCount=-1;
    lastUnderLiquid=false;
    movement=null;
    rotMovement=null;
    currentWeapon=0;
    beretta=null;
    m16=null;
    grenade=null;
    hasM16=false;
    scores=null;
    scoreColor=null;
    lastScoreCount=0;
    
        //
        // initialize and release
        //
        
    initialize()
    {
        super.initialize();

            // settings
            
        this.radius=1500;
        this.height=4500;
        
        this.eyeOffset=4400;
        this.bumpHeight=1400;
        
        this.gravityMinValue=10;
        this.gravityMaxValue=450;
        this.gravityAcceleration=20;
        
        this.filter='player';          // filters are used when searching for entities
        
            // this is the player, replace
            // the name with setup name
            
        this.name=this.getSetup().name;

            // some pre-allocations
            
        this.movement=new PointClass(0,0,0);
        this.rotMovement=new PointClass(0,0,0);
        
            // the model
            
        this.setModel({"name":"player"});
        this.scale.setFromValues(3000,3000,3000);
        
            // add sounds
            
        this.addSound('player_die',30000);
        
            // weapons

        this.beretta=this.addEntity(EntityWeaponBerettaClass,'weapon_beretta',new PointClass(0,0,0),new PointClass(0,0,0),null,true,true);
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
    
        //
        // screen tinting
        //
        
    getScreenTint(tintColor)
    {
        let deadFactor,liquidIdx,liquid;
        
            // all red if dead
            
        if (this.deadCount!==-1) {
            deadFactor=0.2+((this.deadCount/EntityPlayerClass.MAX_DEATH_COUNT)*0.5);
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
        
            // start with beretta
            // and reset the weapons
            
        this.currentWeapon=EntityPlayerClass.WEAPON_BERETTA;
        
        this.beretta.ready();
        this.m16.ready();
        this.grenade.ready();
        
        this.beretta.show=true;
        this.m16.show=false;
        this.hasM16=false;
        
            // turn off any score display
            
        this.startScore();
        this.displayScore(false);
        
            // move to random node
            // if multiplayer
            
        if (this.isMultiplayer()) this.moveToRandomNode(EntityPlayerClass.RANDOM_NODE_FAIL_COUNT);
    }
    
        //
        // called when somebody damages this entity
        //
    
    damage(fromEntity,damage,hitPoint)
    {
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
            this.deadCount=EntityPlayerClass.MAX_DEATH_COUNT;
            this.passThrough=true;
            this.beretta.show=false;
            this.m16.show=false;
            this.playSound('player_die');
            
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
            
            return;
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
                this.currentWeapon=EntityPlayerClass.WEAPON_M16;
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
            if (entity.active) {
                if ((entity.filter==='bot') || (entity.filter==='remote') || (entity.filter==='player')) this.scores.set(entity.name,0);
            }
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
            this.addInterfaceText(('score_name_'+n),sortedNames[n],x,y,30,InterfaceTextClass.TEXT_ALIGN_RIGHT,this.scoreColor,1);
            this.addInterfaceText(('score_point_'+n),this.scores.get(sortedNames[n]),(x+10),y,30,InterfaceTextClass.TEXT_ALIGN_LEFT,this.scoreColor,1);
            
            y+=35;
        }
        
        this.lastScoreCount=sortedNames.length;
    }
    
        //
        // run player
        //
    
    run()
    {
        let x,y,turnAdd,lookAdd,liquidIdx;
        let mouseWheelClick,bump;
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
        
            // fire weapon
            
        if (this.isMouseButtonDown(0)) {
            switch (this.currentWeapon) {
                case EntityPlayerClass.WEAPON_BERETTA:
                    this.beretta.fire(this.position,this.angle,this.eyeOffset);
                    break;
                case EntityPlayerClass.WEAPON_M16:
                    this.m16.fire(this.position,this.angle,this.eyeOffset);
                    break;
            }
        }
        
            // grenade throw
        
        if (this.isMouseButtonDown(2)) this.grenade.fire(this.position,this.angle,this.eyeOffset);

            // change weapons
            // for this demo, we just have two weapons so we do it the simple way
        
        mouseWheelClick=this.getMouseWheelClick();

        if ((mouseWheelClick<0) || (this.isKeyDown(49))) {
            this.currentWeapon=EntityPlayerClass.WEAPON_BERETTA;
            this.beretta.show=true;
            this.m16.show=false;
        }
        
        if (((mouseWheelClick>0) || (this.isKeyDown(50))) && (this.hasM16)) {
            this.currentWeapon=EntityPlayerClass.WEAPON_M16;
            this.beretta.show=false;
            this.m16.show=true;
        }
        
            // turning
        
        x=this.getMouseMoveX();
        if (x!==0) {
            turnAdd=-(x*setup.mouseXSensitivity);
            turnAdd+=(turnAdd*setup.mouseXAcceleration);
            if (setup.mouseXInvert) turnAdd=-turnAdd;
            if (Math.abs(turnAdd)>EntityPlayerClass.MOUSE_MAX_TURN_SPEED) turnAdd=EntityPlayerClass.MOUSE_MAX_TURN_SPEED*Math.sign(turnAdd);
        
            this.angle.y+=turnAdd;
            if (this.angle.y<0.0) this.angle.y+=360.0;
            if (this.angle.y>=360.00) this.angle.y-=360.0;
        }
        
            // looking
           
        y=this.getMouseMoveY();
        if (y!==0) {
            lookAdd=y*setup.mouseYSensitivity;
            lookAdd+=(lookAdd*setup.mouseYAcceleration);
            if (setup.mouseYInvert) lookAdd=-lookAdd;
            if (Math.abs(lookAdd)>EntityPlayerClass.MOUSE_MAX_LOOK_SPEED) lookAdd=EntityPlayerClass.MOUSE_MAX_LOOK_SPEED*Math.sign(lookAdd);
        
            this.angle.x+=lookAdd;
            if (this.angle.x<-EntityPlayerClass.MAX_LOOK_ANGLE) this.angle.x=-EntityPlayerClass.MAX_LOOK_ANGLE;
            if (this.angle.x>=EntityPlayerClass.MAX_LOOK_ANGLE) this.angle.x=EntityPlayerClass.MAX_LOOK_ANGLE;
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
                this.movement.y-=EntityPlayerClass.JUMP_WATER_HEIGHT;
            }
            
            this.lastUnderLiquid=false;
        }
        
            // jumping
           
        if (this.isKeyDown(32)) {
            if ((this.isStandingOnFloor()) && (liquidIdx===-1) && (!this.debugPlayerFly)) {
                this.gravity=this.gravityMinValue;
                this.movement.y=EntityPlayerClass.JUMP_HEIGHT;
            }
        }
        
            // can only bump if we aren't falling
            // as otherwise ledges can catch you and
            // bump you back up
            
            // the only exception is swimming, which always
            // bumps over small obstacles
            
        bump=(this.isStandingOnFloor())||(this.lastUnderLiquid);
        
            // figure out the movement
         
        this.movement.moveZWithAcceleration(((this.isKeyDown(38)) || (this.isKeyDown(87))),((this.isKeyDown(40)) || (this.isKeyDown(83))),EntityPlayerClass.FORWARD_ACCELERATION,EntityPlayerClass.FORWARD_DECELERATION,EntityPlayerClass.FORWARD_MAX_SPEED,EntityPlayerClass.FORWARD_ACCELERATION,EntityPlayerClass.FORWARD_DECELERATION,EntityPlayerClass.FORWARD_MAX_SPEED);
        this.movement.moveXWithAcceleration(this.isKeyDown(65),this.isKeyDown(68),EntityPlayerClass.SIDE_ACCELERATION,EntityPlayerClass.SIDE_DECELERATION,EntityPlayerClass.SIDE_MAX_SPEED,EntityPlayerClass.SIDE_ACCELERATION,EntityPlayerClass.SIDE_DECELERATION,EntityPlayerClass.SIDE_MAX_SPEED);
        
        this.rotMovement.setFromPoint(this.movement);
        if ((this.debugPlayerFly) || (this.lastUnderLiquid)) {
            this.rotMovement.y=0;       // only Y movement comes from X angle rotation
            this.rotMovement.rotateX(null,this.angle.x);     // if flying or swimming, add in the X rotation
            this.rotMovement.y*=EntityPlayerClass.FLY_SWIM_Y_REDUCE;
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
    }
    
        //
        // player is never drawn, so always skip out
        //
        
    drawSetup()
    {
        return(false);
    }
}
