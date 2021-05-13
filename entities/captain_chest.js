import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';

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
            
        this.openAnimation=new AnimationDefClass(65,66,0);
        this.openingAnimation=new AnimationDefClass(1,65,0);
        this.closedAnimation=new AnimationDefClass(0,1,0);
        
        this.openSound=new SoundDefClass('chime',1.0,0.0,7000,0,0,false);
        
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

