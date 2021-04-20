import PointClass from '../../../code/utility/point.js';
import MonsterBaseClass from './monster_base.js';

export default class SpiderClass extends MonsterBaseClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
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
        
        
        
            // animations
            
        this.sleepAnimation={"startFrame":284,"endFrame":385,"actionFrame":0,"meshes":null};
        this.wakeUpAnimation={"startFrame":165,"endFrame":195,"actionFrame":0,"meshes":null};
        this.idleAnimation={"startFrame":284,"endFrame":385,"actionFrame":0,"meshes":null};
        this.walkAnimation={"startFrame":0,"endFrame":40,"actionFrame":0,"meshes":null};
        this.meleeLeftAnimation={"startFrame":83,"endFrame":111,"actionFrame":93,"meshes":null};
        this.meleeRightAnimation={"startFrame":112,"endFrame":139,"actionFrame":122,"meshes":null};
        this.projectileAnimation={"startFrame":0,"endFrame":0,"actionFrame":0,"meshes":null};
        this.hitAnimation={"startFrame":140,"endFrame":164,"actionFrame":0,"meshes":null};
        this.dieAnimation={"startFrame":245,"endFrame":280,"actionFrame":0,"meshes":null};
    
            // sounds
            
        this.wakeUpSound={"name":"spider_wake_up","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.hurtSound={"name":"spider_wake_up","rate":0.7,"randomRateAdd":0.6,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.meleeSound={"name":"spider_wake_up","rate":1.2,"randomRateAdd":0.2,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.deathSound={"name":"spider_die","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.fallSound=null;

    }
}
