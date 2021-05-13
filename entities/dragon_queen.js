import PointClass from '../../../code/utility/point.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';
import MonsterBaseClass from './monster_base.js';

export default class DragonQueenClass extends MonsterBaseClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
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
            
        this.sleepAnimation=new AnimationDefClass(1154,1274,0);
        this.wakeUpAnimation=new AnimationDefClass(1275,1345,0);
        this.idleAnimation=new AnimationDefClass(248,398,0);
        this.walkAnimation=new AnimationDefClass(2010,2060,0);
        this.meleeLeftAnimation=new AnimationDefClass(2445,2480,2460);
        this.meleeRightAnimation=new AnimationDefClass(2589,2624,2604);
        this.projectileAnimation=new AnimationDefClass(399,484,435);
        this.hitAnimation=new AnimationDefClass(2895,2925,0);
        this.dieAnimation=new AnimationDefClass(3849,3980,3975);

            // sounds
            
        this.wakeUpSound=new SoundDefClass('queen_scream',1.0,0,30000,0,0,false);
        this.hurtSound=new SoundDefClass('queen_hurt',1.0,0.6,30000,0,0,false);
        this.meleeSound=new SoundDefClass('queen_hurt',0.7,0.2,10000,0,0,false);
        this.deathSound=new SoundDefClass('queen_scream',0.5,0,30000,0,0,false);
        this.fallSound=new SoundDefClass('thud',1.0,0,30000,0,0,false);
    }
}
