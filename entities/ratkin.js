import PointClass from '../../../code/utility/point.js';
import MonsterBaseClass from './monster_base.js';

export default class RatkinClass extends MonsterBaseClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
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
