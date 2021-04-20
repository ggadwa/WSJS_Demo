import PointClass from '../../../code/utility/point.js';
import MonsterBaseClass from './monster_base.js';

export default class DragonQueenClass extends MonsterBaseClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
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
        
        
        
        
            // animations
            
        this.sleepAnimation={"startFrame":1154,"endFrame":1274,"actionFrame":0,"meshes":null};
        this.wakeUpAnimation={"startFrame":1275,"endFrame":1345,"actionFrame":0,"meshes":null};
        this.idleAnimation={"startFrame":248,"endFrame":398,"actionFrame":0,"meshes":null};
        this.walkAnimation={"startFrame":2010,"endFrame":2060,"actionFrame":0,"meshes":null};
        this.meleeLeftAnimation={"startFrame":2445,"endFrame":2480,"actionFrame":2460,"meshes":null};
        this.meleeRightAnimation={"startFrame":2589,"endFrame":2624,"actionFrame":2604,"meshes":null};
        this.projectileAnimation={"startFrame":399,"endFrame":484,"actionFrame":435,"meshes":null};
        this.hitAnimation={"startFrame":2895,"endFrame":2925,"actionFrame":0,"meshes":null};
        this.dieAnimation={"startFrame":3849,"endFrame":3980,"actionFrame":3975,"meshes":null};

            // sounds
            
        this.wakeUpSound={"name":"queen_scream","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.hurtSound={"name":"queen_hurt","rate":1.0,"randomRateAdd":0.6,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.meleeSound={"name":"queen_hurt","rate":0.7,"randomRateAdd":0.2,"distance":10000,"loopStart":0,"loopEnd":0,"loop":false};
        this.deathSound={"name":"queen_scream","rate":0.5,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.fallSound={"name":"thud","rate":1.0,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};


    }
}
