import PointClass from '../../../code/utility/point.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';
import MonsterBaseClass from './monster_base.js';

export default class VampireClass extends MonsterBaseClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
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
            
        this.sleepAnimation=new AnimationDefClass(2,100,0);
        this.wakeUpAnimation=new AnimationDefClass(496,546,0);
        this.idleAnimation=new AnimationDefClass(2,100,0);
        this.walkAnimation=new AnimationDefClass(2045,2081,0);
        this.meleeLeftAnimation=new AnimationDefClass(706,741,721);
        this.meleeRightAnimation=new AnimationDefClass(598,633,613);
        this.projectileAnimation=new AnimationDefClass(547,597,562);
        this.hitAnimation=new AnimationDefClass(982,1017,0);
        this.dieAnimation=new AnimationDefClass(1886,1951,1934);
        
            // sounds
            
        this.wakeUpSound=new SoundDefClass('vampire_wake_up',1.0,0,30000,0,0,false);
        this.hurtSound=new SoundDefClass('vampire_wake_up',0.7,0.6,30000,0,0,false);
        this.meleeSound=new SoundDefClass('vampire_wake_up',1.2,0.4,30000,0,0,false);
        this.deathSound=new SoundDefClass('vampire_die',1.0,0,30000,0,0,false);
        this.fallSound=new SoundDefClass('thud',1.0,0,30000,0,0,false);
    }
}
