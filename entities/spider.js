import PointClass from '../../../code/utility/point.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';
import MonsterBaseClass from './monster_base.js';

export default class SpiderClass extends MonsterBaseClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
        
        this.modelName='spider';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(800,800,800);
        this.radius=2500;
        this.height=2800;
        this.eyeOffset=2700;
        this.weight=120;
        this.modelHideMeshes=[];
        
            // physics
            
        this.maxBumpCount=2;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=48;
        this.collisionHeightSegmentCount=4;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;
        
            // monster base settings
        
        this.startHealth=40;
        this.startAsleep=false;
        this.wakeUpDistance=35000;
        this.wakeUpOnOtherWakeUpDistance=30000;
        this.idleDistance=75000;
            
        this.meleeDistance=5000;
        this.meleeWaitTick=800;
        this.meleeDamage=5;
            
        this.projectileDistance=0;
        this.projectileWaitTick=0;
        this.projectileFirePosition=new PointClass(0,0,0);
        this.projectileJson=null;
        this.projectileData=null;
        this.projectileRequiresSight=false;
        this.noSelfDamage=false;
        this.hitAnimationPercentage=1.0;
            
        this.maxTurnSpeed=8;
        this.forwardAcceleration=10;
        this.forwardDeceleration=8;
        this.forwardMaxSpeed=150;
        this.reverseAcceleration=4;
        this.reverseDeceleration=2;
        this.reverseMaxSpeed=20;
        this.sideAcceleration=8;
        this.sideDeceleration=6;
        this.sideMaxSpeed=100;
        this.damageSpeedFactor=0;
        this.slideMoveTick=2000;
        this.jumpWaitTick=2000;
        this.jumpWaitTickRandomAdd=500;
        this.jumpHeight=250;
        this.canBump=false;
        this.canSlide=true;
        this.canBePushed=true;
        this.angleYProjectileRange=5;
        this.angleYMeleeRange=15;
            
        this.idlePath=null;
        this.stalkByPath=false;
        this.seekNodeDistanceSlop=1000;
        this.seekNodeAngleSlop=35;
        this.seekPauseDistance=4000;
    
        this.wakeUpSetTriggerName=null;
        this.deathSetTriggerName=null;
        this.showTriggerName=data.showTrigger;
        
            // animations
            
        this.sleepAnimation=new AnimationDefClass(284,385,0);
        this.wakeUpAnimation=new AnimationDefClass(165,195,0);
        this.idleAnimation=new AnimationDefClass(284,385,0);
        this.walkAnimation=new AnimationDefClass(0,40,0);
        this.meleeLeftAnimation=new AnimationDefClass(83,111,93);
        this.meleeRightAnimation=new AnimationDefClass(112,139,122);
        this.projectileAnimation=new AnimationDefClass(0,0,0);
        this.hitAnimation=new AnimationDefClass(140,164,0);
        this.dieAnimation=new AnimationDefClass(245,280,0);
    
            // sounds
            
        this.wakeUpSound=new SoundDefClass('spider_wake_up',1.0,0,30000,0,0,false);
        this.hurtSound=new SoundDefClass('spider_wake_up',0.7,0.6,30000,0,0,false);
        this.meleeSound=new SoundDefClass('spider_wake_up',1.2,0.2,30000,0,0,false);
        this.deathSound=new SoundDefClass('spider_die',1.0,0,30000,0,0,false);
        this.fallSound=null;
    }
}
