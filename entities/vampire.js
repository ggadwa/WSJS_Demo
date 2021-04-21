import PointClass from '../../../code/utility/point.js';
import MonsterBaseClass from './monster_base.js';

export default class VampireClass extends MonsterBaseClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,null,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
        
        this.modelName='vampire_patriarch';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(5000,5000,5000);
        this.radius=2000;
        this.height=8200;
        this.eyeOffset=8000;
        this.weight=250;
        this.modelHideMeshes=[];
        
            // physics
            
        this.maxBumpCount=2;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=48;
        this.collisionHeightSegmentCount=4;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;
        
            // monster base settings
        
        this.startHealth=240;
        this.startAsleep=false;
        this.wakeUpDistance=25000;
        this.wakeUpOnOtherWakeUpDistance=0;
        this.idleDistance=75000;
            
        this.meleeDistance=6000;
        this.meleeWaitTick=2500;
        this.meleeDamage=20;
            
        this.projectileDistance=40000;
        this.projectileWaitTick=5000;
        this.projectileFirePosition=new PointClass(0,4100,3500);
        this.projectileJson='projectile_vampire';
        this.projectileData=null;
        this.projectileRequiresSight=true;
        this.noSelfDamage=false;
        this.hitAnimationPercentage=0.8;
            
        this.maxTurnSpeed=5;
        this.forwardAcceleration=4;
        this.forwardDeceleration=2;
        this.forwardMaxSpeed=80;
        this.reverseAcceleration=4;
        this.reverseDeceleration=2;
        this.reverseMaxSpeed=20;
        this.sideAcceleration=4;
        this.sideDeceleration=2;
        this.sideMaxSpeed=60;
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
            
        this.idlePath=data.idlePath;
        this.stalkByPath=false;
        this.seekNodeDistanceSlop=2000;
        this.seekNodeAngleSlop=35;
        this.seekPauseDistance=4000;
    
        this.wakeUpSetTriggerName=null;
        this.deathSetTriggerName=null;
        this.showTriggerName=null;
        
            // animations
            
        this.sleepAnimation={"startFrame":2,"endFrame":100,"actionFrame":0,"meshes":null};
        this.wakeUpAnimation={"startFrame":496,"endFrame":546,"actionFrame":0,"meshes":null};
        this.idleAnimation={"startFrame":2,"endFrame":100,"actionFrame":0,"meshes":null};
        this.walkAnimation={"startFrame":2045,"endFrame":2081,"actionFrame":0,"meshes":null};
        this.meleeLeftAnimation={"startFrame":706,"endFrame":741,"actionFrame":721,"meshes":null};
        this.meleeRightAnimation={"startFrame":598,"endFrame":633,"actionFrame":613,"meshes":null};
        this.projectileAnimation={"startFrame":547,"endFrame":597,"actionFrame":562,"meshes":null};
        this.hitAnimation={"startFrame":982,"endFrame":1017,"actionFrame":0,"meshes":null};
        this.dieAnimation={"startFrame":1886,"endFrame":1951,"actionFrame":1934,"meshes":null};
        
            // sounds
            
        this.wakeUpSound={"name":"vampire_wake_up","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.hurtSound={"name":"vampire_wake_up","rate":0.7,"randomRateAdd":0.6,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.meleeSound={"name":"vampire_wake_up","rate":1.2,"randomRateAdd":0.4,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.deathSound={"name":"vampire_die","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.fallSound={"name":"thud","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
    }
}
