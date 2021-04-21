import PointClass from '../../../code/utility/point.js';
import MonsterBaseClass from './monster_base.js';

export default class DragonQueenClass extends MonsterBaseClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,null,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
        
        this.modelName='dragon_queen';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(3300,3300,3300);
        this.radius=1500;
        this.height=6200;
        this.eyeOffset=6000;
        this.weight=250;
        this.modelHideMeshes=['EDQ_shield01','EDQ_shield02','EDQ_sword01','EDQ_sword02'];
        
            // physics
            
        this.maxBumpCount=2;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=48;
        this.collisionHeightSegmentCount=4;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;
        
            // monster base settings
            
        this.startHealth=500;
        this.startAsleep=true;
        this.wakeUpDistance=6000;
        this.wakeUpOnOtherWakeUpDistance=6000;
        this.idleDistance=-1;
            
        this.meleeDistance=6000;
        this.meleeWaitTick=3000;
        this.meleeDamage=20;
            
        this.projectileDistance=60000;
        this.projectileWaitTick=6000;
        this.projectileFirePosition=new PointClass(0,5800,2500);
        this.projectileJson='projectile_queen';
        this.projectileData=null;
        this.projectileRequiresSight=false;
        this.noSelfDamage=true;
        this.hitAnimationPercentage=0.4;
            
        this.maxTurnSpeed=4;
        this.forwardAcceleration=4;
        this.forwardDeceleration=2;
        this.forwardMaxSpeed=100;
        this.reverseAcceleration=4;
        this.reverseDeceleration=2;
        this.reverseMaxSpeed=20;
        this.sideAcceleration=4;
        this.sideDeceleration=2;
        this.sideMaxSpeed=80;
        this.damageSpeedFactor=1.0;
        this.slideMoveTick=2000;
        this.jumpWaitTick=0;
        this.jumpWaitTickRandomAdd=0;
        this.jumpHeight=0;
        this.canBump=true;
        this.canSlide=true;
        this.canBePushed=false;
        this.angleYProjectileRange=5;
        this.angleYMeleeRange=15;
            
        this.idlePath=null;
        this.stalkByPath=true;
        this.seekNodeDistanceSlop=1000;
        this.seekNodeAngleSlop=35;
        this.seekPauseDistance=4000;

        this.wakeUpSetTriggerName='queen_wake';
        this.deathSetTriggerName='queen_dead';
        this.showTriggerName=null;
        
            // animations
            
        this.sleepAnimation={"startFrame":1154,"endFrame":1274,"actionFrame":0,"meshes":null};
        this.wakeUpAnimation={"startFrame":1275,"endFrame":1345,"actionFrame":0,"meshes":null};
        this.idleAnimation={"startFrame":248,"endFrame":398,"actionFrame":0,"meshes":null};
        this.walkAnimation={"startFrame":2010,"endFrame":2060,"actionFrame":0,"meshes":null};
        this.meleeLeftAnimation={"startFrame":2445,"endFrame":2480,"actionFrame":2460,"meshes":null};
        this.meleeRightAnimation={"startFrame":2589,"endFrame":2624,"actionFrame":2604,"meshes":null};
        this.projectileAnimation={"startFrame":399,"endFrame":484,"actionFrame":435,"meshes":null};
        this.hitAnimation={"startFrame":2895,"endFrame":2925,"actionFrame":0,"meshes":null};
        this.dieAnimation={"startFrame":3849,"endFrame":3980,"actionFrame":3975,"meshes":null};

            // sounds
            
        this.wakeUpSound={"name":"queen_scream","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.hurtSound={"name":"queen_hurt","rate":1.0,"randomRateAdd":0.6,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.meleeSound={"name":"queen_hurt","rate":0.7,"randomRateAdd":0.2,"distance":10000,"loopStart":0,"loopEnd":0,"loop":false};
        this.deathSound={"name":"queen_scream","rate":0.5,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.fallSound={"name":"thud","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};


    }
}
