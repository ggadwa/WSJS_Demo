import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ProjectEntityDeveloperClass from '../../../code/project/project_entity_developer.js';
import ModelClass from '../../../code/model/model.js';
import ImportModelClass from '../../../code/import/import_model.js';
import MapPathNodeClass from '../../../code/map/map_path_node.js';
import EntityWeaponBerettaClass from '../entities/entity_weapon_beretta.js';
import EntityWeaponM16Class from '../entities/entity_weapon_m16.js';
import EntityWeaponGrenadeClass from '../entities/entity_weapon_grenade.js';

export default class EntityPlayerClass extends ProjectEntityDeveloperClass
{
    static MOUSE_TURN_SENSITIVITY=0.8;
    static MOUSE_LOOK_SENSITIVITY=0.2;
    static MAX_LOOK_ANGLE=80.0;
    static MAX_TURN_SPEED=8;
    static MAX_LOOK_SPEED=8;
    static FORWARD_ACCELERATION=15;
    static FORWARD_DECELERATION=30;
    static FORWARD_MAX_SPEED=200;
    static SIDE_ACCELERATION=25;
    static SIDE_DECELERATION=50;
    static SIDE_MAX_SPEED=150;
    static JUMP_HEIGHT=400;
    static JUMP_WATER_HEIGHT=400;
    static FLY_SWIM_Y_REDUCE=0.5;
    static RANDOM_NODE_FAIL_COUNT=20;
    static MAX_DEATH_COUNT=500;
    static WEAPON_BERETTA=0;
    static WEAPON_M16=1;
    
    constructor(core,name,position,angle,data)
    {
        super(core,name,position,angle,data);
        
        this.radius=1500;
        this.height=4500;
        
        this.eyeOffset=4400;
        this.bumpHeight=1400;
        
        this.gravityMinValue=10;
        this.gravityMaxValue=450;
        this.gravityAcceleration=20;
        
        this.filter='player';          // filters are used when searching for entities
        
        this.health=100;
        this.deadCount=-1;
        
            // movement
            
        this.movement=new PointClass(0,0,0);
        this.rotMovement=new PointClass(0,0,0);
        
            // local variables

        this.lastUnderLiquid=false;
        
        this.currentWeapon=0;
        this.beretta=null;
        this.m16=null;
        this.grenade=null;
        
        this.hasM16=false;
        
        Object.seal(this);
    }
    
        //
        // initialize and release
        //
        
    initialize()
    {
        super.initialize();
        
            // add sounds
            
        this.addSound('player_die',30000);
        
            // weapons
            
        this.beretta=new EntityWeaponBerettaClass(this.core,'weapon_beretta',new PointClass(0,0,0),new PointClass(0,0,0),null);
        this.addEntity(this.beretta,true,true);        
        
        this.m16=new EntityWeaponM16Class(this.core,'weapon_m16',new PointClass(0,0,0),new PointClass(0,0,0),null);
        this.addEntity(this.m16,false,true);
        
        this.grenade=new EntityWeaponGrenadeClass(this.core,('weapon_grenade'),new PointClass(0,0,0),new PointClass(0,0,0),null);
        this.addEntity(this.grenade,false,true);
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
        
        liquid=this.core.map.liquidList.liquids[liquidIdx];
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
        
            // move to random node
            // if multiplayer
            
        if (this.data.multiplayer) this.moveToRandomNode(EntityPlayerClass.RANDOM_NODE_FAIL_COUNT);
    }
    
        //
        // called when somebody damages this entity
        //
    
    damage(fromEntity,damage)
    {
            // already dead, can't take damage
            
        if (this.deadCount!==-1) return;
        
            // pulse and take the damage
            
        this.pulseInterfaceElement('health',500,5);
        this.health-=damage;
        if (this.health<=0) {
            this.deadCount=EntityPlayerClass.MAX_DEATH_COUNT;
            this.passThrough=true;
            this.beretta.show=false;
            this.m16.show=false;
            this.playSound('player_die');
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
            if (!this.hasM16) return(false);
            
            this.m16.addAmmo();
            return(true);
        }
        
            // grenades
            
        if (name==='grenade') {
            this.grenade.addAmmo();
            return(true);
        }
        
            // health
            
        if (name==='health') {
            this.pulseInterfaceElement('health',500,5);
            this.health=Math.min((this.health+25),100);
            return(true);
        }
        
        return(false);
    }
    
        //
        // run player
        //
    
    run()
    {
        let turnAdd,lookAdd,liquidIdx;
        let input=this.core.input;
        let mouseWheelClick,bump;
        
        super.run();
        
            // update the UI
            
        this.updateInterfaceText('beretta_bullet_count',this.beretta.ammoCount);
        this.updateInterfaceText('m16_bullet_count',this.m16.ammoCount);
        this.updateInterfaceText('grenade_count',this.grenade.ammoCount);
        this.updateInterfaceText('health_count',this.health);
        
            // dead
            
        if (this.deadCount!==-1) {
            this.deadCount--;
            
            if ((!this.data.multiplayer) && (this.deadCount===0)) this.deadCount=1;       //  never recover if not multiplayer
            if (this.deadCount>1) {
                if (this.angle.x>-80.0) {
                    this.position.y-=20;        // sink to ground
                    this.angle.x-=1.5;
                }
            }      
            
            if (this.deadCount<=0) this.ready();
            return;
        }            
        
            // fire weapon
            
        if (input.mouseButtonFlags[0]) {
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
        
        if (input.mouseButtonFlags[2]) this.grenade.fire(this.position,this.angle,this.eyeOffset);

            // change weapons
            // for this demo, we just have two weapons so we do it the simple way
        
        mouseWheelClick=input.mouseWheelRead();

        if ((mouseWheelClick<0) || (input.keyFlags[49])) {
            this.currentWeapon=EntityPlayerClass.WEAPON_BERETTA;
            this.beretta.show=true;
            this.m16.show=false;
        }
        
        if (((mouseWheelClick>0) || (input.keyFlags[50])) && (this.hasM16)) {
            this.currentWeapon=EntityPlayerClass.WEAPON_M16;
            this.beretta.show=false;
            this.m16.show=true;
        }
        
            // turning
            
        if (input.mouseChangeX!==0) {    
            turnAdd=-(input.mouseChangeX*EntityPlayerClass.MOUSE_TURN_SENSITIVITY);
            if (Math.abs(turnAdd)>EntityPlayerClass.MAX_TURN_SPEED) turnAdd=EntityPlayerClass.MAX_TURN_SPEED*Math.sign(turnAdd);
            input.mouseChangeX=0;
        
            this.angle.y+=turnAdd;
            if (this.angle.y<0.0) this.angle.y+=360.0;
            if (this.angle.y>=360.00) this.angle.y-=360.0;
        }
        
            // looking
            
        if (input.mouseChangeY!==0) {
            lookAdd=input.mouseChangeY*EntityPlayerClass.MOUSE_LOOK_SENSITIVITY;
            if (Math.abs(lookAdd)>EntityPlayerClass.MAX_LOOK_SPEED) lookAdd=EntityPlayerClass.MAX_LOOK_SPEED*Math.sign(lookAdd);
            input.mouseChangeY=0;
        
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
           
        if (input.keyFlags[32]) {
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
         
        this.movement.moveZWithAcceleration(((input.keyFlags[38]) || (input.keyFlags[87])),((input.keyFlags[40]) || (input.keyFlags[83])),EntityPlayerClass.FORWARD_ACCELERATION,EntityPlayerClass.FORWARD_DECELERATION,EntityPlayerClass.FORWARD_MAX_SPEED);
        this.movement.moveXWithAcceleration(input.keyFlags[65],input.keyFlags[68],EntityPlayerClass.SIDE_ACCELERATION,EntityPlayerClass.SIDE_DECELERATION,EntityPlayerClass.SIDE_MAX_SPEED);
        
        this.rotMovement.setFromPoint(this.movement);
        if ((this.debugPlayerFly) || (this.lastUnderLiquid)) {
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
}
