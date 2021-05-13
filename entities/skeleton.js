import PointClass from '../../../code/utility/point.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';
import MonsterBaseClass from './monster_base.js';

export default class SkeletonClass extends MonsterBaseClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
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
            
        this.sleepAnimation=new AnimationDefClass(6370,6470,0);
        this.wakeUpAnimation=new AnimationDefClass(0,50,0);
        this.idleAnimation=new AnimationDefClass(6370,6470,0);
        this.walkAnimation=new AnimationDefClass(5683,5719,0);
        this.meleeLeftAnimation=new AnimationDefClass(5299,5334,5314);
        this.meleeRightAnimation=new AnimationDefClass(5335,5370,5350);
        this.projectileAnimation=new AnimationDefClass(4711,4731,0);
        this.hitAnimation=new AnimationDefClass(4974,5009,0);
        this.dieAnimation=new AnimationDefClass(3971,4111,4097);
        
            // sounds
            
        this.wakeUpSound=new SoundDefClass('skeleton_wake_up',1.0,0,30000,0,0,false);
        this.hurtSound=new SoundDefClass('skeleton_wake_up',0.7,0.6,30000,0,0,false);
        this.meleeSound=new SoundDefClass('blade',1.0,0,10000,0,0,false);
        this.deathSound=new SoundDefClass('skeleton_die',1.0,0,30000,0,0,false);
        this.fallSound=new SoundDefClass('thud',1.0,0,30000,0,0,false);
    }
}
