import PointClass from '../../../code/utility/point.js';
import MonsterBaseClass from './monster_base.js';

export default class RatkinClass extends MonsterBaseClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,null,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
        
        this.modelName='ratkin_skeleton';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(3000,3000,3000);
        this.radius=1500;
        this.height=4500;
        this.eyeOffset=4400;
        this.weight=180;
        this.modelHideMeshes=['Slave_Pick01'];
        
            // physics
            
        this.maxBumpCount=2;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=48;
        this.collisionHeightSegmentCount=4;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;
        
            // monster base settings
        
        this.startHealth=80;
        this.startAsleep=false;
        this.wakeUpDistance=30000;
        this.wakeUpOnOtherWakeUpDistance=30000;
        this.idleDistance=75000;
            
        this.meleeDistance=5000;
        this.meleeWaitTick=1500;
        this.meleeDamage=20;
        this.projectileDistance=0;
        this.projectileWaitTick=0;
        this.projectileFirePosition=new PointClass(0,0,0);
        this.projectileJson=null;
        this.projectileData=null;
        this.projectileRequiresSight=false;
        this.noSelfDamage=false;
        this.hitAnimationPercentage=1.0;
            
        this.maxTurnSpeed=3;
        this.forwardAcceleration=4;
        this.forwardDeceleration=2;
        this.forwardMaxSpeed=50;
        this.reverseAcceleration=4;
        this.reverseDeceleration=2;
        this.reverseMaxSpeed=20;
        this.sideAcceleration=4;
        this.sideDeceleration=2;
        this.sideMaxSpeed=40;
        this.damageSpeedFactor=0.25;
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
        
            // animation
            
        this.sleepAnimation={"startFrame":1694,"endFrame":1729,"actionFrame":0,"meshes":null};
        this.wakeUpAnimation={"startFrame":1839,"endFrame":1889,"actionFrame":0,"meshes":null};
        this.idleAnimation={"startFrame":1694,"endFrame":1729,"actionFrame":0,"meshes":null};
        this.walkAnimation={"startFrame":1465,"endFrame":1501,"actionFrame":0,"meshes":null};
        this.meleeLeftAnimation={"startFrame":440,"endFrame":475,"actionFrame":455,"meshes":null};
        this.meleeRightAnimation={"startFrame":560,"endFrame":595,"actionFrame":575,"meshes":null};
        this.projectileAnimation={"startFrame":0,"endFrame":0,"actionFrame":0,"meshes":null};
        this.hitAnimation={"startFrame":1186,"endFrame":1221,"actionFrame":0,"meshes":null};
        this.dieAnimation={"startFrame":1306,"endFrame":1371,"actionFrame":1354,"meshes":null};

            // sounds

        this.wakeUpSound={"name":"rat_wake_up","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.hurtSound={"name":"rat_wake_up","rate":0.7,"randomRateAdd":0.6,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.meleeSound={"name":"blade","rate":1.0,"randomRateAdd":0,"distance":10000,"loopStart":0,"loopEnd":0,"loop":false};
        this.deathSound={"name":"rat_die","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.fallSound={"name":"thud","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};

    }
}
