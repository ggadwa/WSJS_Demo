import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';

export default class CaptainChestClass extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
        
        this.modelName='captain_chest';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(50,50,50);
        this.radius=2200;
        this.height=2200;
        this.eyeOffset=0;
        this.weight=250;
        this.modelHideMeshes=[];
        
            // physics
            
        this.maxBumpCount=0;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=8;
        this.collisionHeightSegmentCount=2;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;

            // animations
            
        this.openAnimation={"startFrame":65,"endFrame":66,"actionFrame":0,"meshes":null};
        this.openingAnimation={"startFrame":1,"endFrame":65,"actionFrame":0,"meshes":null};
        this.closedAnimation={"startFrame":0,"endFrame":1,"actionFrame":0,"meshes":null};
        
        this.openSound={"name":"chime","rate":1.0,"randomRateAdd":0.0,"distance":7000,"loopStart":0,"loopEnd":0,"loop":false};
        
        this.opened=false;
        this.openDistance=8000;
        
        Object.seal(this);
    }
    
    initialize()
    {
        return(super.initialize());
    }
    
    ready()
    {
        super.ready();
        this.startAnimation(this.closedAnimation);
    }
        
    run()
    {
        let player;
        
        super.run();
        
            // nothing to do if opened
            
        if (this.opened) return;
        
            // opens on action key
            // if close enough to player
            
        if ((!this.isKeyDown('e')) && (!this.isTouchStickLeftClick())) return;
        
        player=this.getPlayer();
        if (this.position.distance(player.position)>this.openDistance) return;
        
            // opening

        this.opened=true;
            
        this.playSound(this.openSound);
        this.startAnimation(this.openingAnimation);
        this.queueAnimation(this.openAnimation);
        
            // the actions
            
        this.setTrigger(this.data.trigger);
        
        player.addPistolClip(2);
        player.addM16Clip(2);
        player.addGrenadeAmmo(1);
        player.addHealth(25);
    }
    
    drawSetup()
    {
        this.setModelDrawAttributes(this.position,this.angle,this.scale,false);
        return(this.modelEntityAlter.boundBoxInFrustum());
    }
}

