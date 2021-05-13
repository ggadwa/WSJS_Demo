import PointClass from '../../../code/utility/point.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';
import MonsterBaseClass from './monster_base.js';

export default class RatkinClass extends MonsterBaseClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
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
            
        this.sleepAnimation=new AnimationDefClass(1694,1729,0);
        this.wakeUpAnimation=new AnimationDefClass(1839,1889,0);
        this.idleAnimation=new AnimationDefClass(1694,1729,0);
        this.walkAnimation=new AnimationDefClass(1465,1501,0);
        this.meleeLeftAnimation=new AnimationDefClass(440,475,455);
        this.meleeRightAnimation=new AnimationDefClass(560,595,575);
        this.projectileAnimation=new AnimationDefClass(0,0,0);
        this.hitAnimation=new AnimationDefClass(1186,1221,0);
        this.dieAnimation=new AnimationDefClass(1306,1371,1354);

            // sounds

        this.wakeUpSound=new SoundDefClass('rat_wake_up',1.0,0,30000,0,0,false);
        this.hurtSound=new SoundDefClass('rat_wake_up',0.7,0.6,30000,0,0,false);
        this.meleeSound=new SoundDefClass('blade',1.0,0,10000,0,0,false);
        this.deathSound=new SoundDefClass('rat_die',1.0,0,30000,0,0,false);
        this.fallSound=new SoundDefClass('thud',1.0,0,30000,0,0,false);
    }
}
