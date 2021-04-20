import PointClass from '../../../code/utility/point.js';
import MonsterBaseClass from './monster_base.js';

export default class SkeletonClass extends MonsterBaseClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
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
