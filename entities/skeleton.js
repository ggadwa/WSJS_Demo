import PointClass from '../../../code/utility/point.js';
import MonsterBaseClass from './monster_base.js';

export default class SkeletonClass extends MonsterBaseClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,null,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
        
        this.modelName='skeleton_captain';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(35,35,35);
        this.radius=1500;
        this.height=6200;
        this.eyeOffset=6000;
        this.weight=250;
        this.modelHideMeshes=['SH_Sword_E01','SH_Shield_E02','Hair','SH_Shield_E01','SH_Chest_E'];
        
            // physics
            
        this.maxBumpCount=2;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=48;
        this.collisionHeightSegmentCount=4;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;
        
            // monster base settings
        
        this.startHealth=160;
        this.startAsleep=false;
        this.wakeUpDistance=25000;
        this.wakeUpOnOtherWakeUpDistance=25000;
        this.idleDistance=75000;
            
        this.meleeDistance=5000;
        this.meleeWaitTick=3000;
        this.meleeDamage=20;
            
        this.projectileDistance=0;
        this.projectileWaitTick=0;
        this.projectileFirePosition=new PointClass(0,0,0);
        this.projectileJson=null;
        this.projectileData=null;
        this.projectileRequiresSight=false;
        this.noSelfDamage=false;
        this.hitAnimationPercentage=0.8;
            
        this.maxTurnSpeed=8;
        this.forwardAcceleration=4;
        this.forwardDeceleration=2;
        this.forwardMaxSpeed=100;
        this.reverseAcceleration=4;
        this.reverseDeceleration=2;
        this.reverseMaxSpeed=20;
        this.sideAcceleration=4;
        this.sideDeceleration=2;
        this.sideMaxSpeed=80;
        this.damageSpeedFactor=0;
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
        this.stalkByPath=false;
        this.seekNodeDistanceSlop=1000;
        this.seekNodeAngleSlop=35;
        this.seekPauseDistance=4000;
    
        this.wakeUpSetTriggerName=null;
        this.deathSetTriggerName=null;
        this.showTriggerName=null;
        
            // animations
            
        this.sleepAnimation={"startFrame":6370,"endFrame":6470,"actionFrame":0,"meshes":null};
        this.wakeUpAnimation={"startFrame":0,"endFrame":50,"actionFrame":0,"meshes":null};
        this.idleAnimation={"startFrame":6370,"endFrame":6470,"actionFrame":0,"meshes":null};
        this.walkAnimation={"startFrame":5683,"endFrame":5719,"actionFrame":0,"meshes":null};
        this.meleeLeftAnimation={"startFrame":5299,"endFrame":5334,"actionFrame":5314,"meshes":null};
        this.meleeRightAnimation={"startFrame":5335,"endFrame":5370,"actionFrame":5350,"meshes":null};
        this.projectileAnimation={"startFrame":4711,"endFrame":4731,"actionFrame":0,"meshes":null};
        this.hitAnimation={"startFrame":4974,"endFrame":5009,"actionFrame":0,"meshes":null};
        this.dieAnimation={"startFrame":3971,"endFrame":4111,"actionFrame":4097,"meshes":null};
        
            // sounds
            
        this.wakeUpSound={"name":"skeleton_wake_up","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.hurtSound={"name":"skeleton_wake_up","rate":0.7,"randomRateAdd":0.6,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.meleeSound={"name":"blade","rate":1.0,"randomRateAdd":0,"distance":10000,"loopStart":0,"loopEnd":0,"loop":false};
        this.deathSound={"name":"skeleton_die","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.fallSound={"name":"thud","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};

    }
}
