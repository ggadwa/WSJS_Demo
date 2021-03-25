import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';

export default class CaptainChestClass extends EntityClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
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
        super.run();
        
            // nothing to do if opened
            
        if (this.opened) return;
        
            // opens on action key
            // if close enough to player
            
        if ((!this.isKeyDown('e')) && (!this.isTouchStickLeftClick())) return;
        if (this.position.distance(this.getPlayer().position)>this.openDistance) return;
        
            // opening

        this.opened=true;
            
        this.playSound(this.openSound);
        this.startAnimation(this.openingAnimation);
        this.queueAnimation(this.openAnimation);
        
            // the actions
            
        this.setTrigger(this.data.trigger);
        this.addClip('pistol','primary',2);
        this.addClip('m16','primary',2);
        this.addAmmo('grenade','tertiary',1);
        this.addHealth(25);
    }
    
    drawSetup()
    {
        if (this.model===null) return(false);
        
        this.modelEntityAlter.position.setFromPoint(this.position);
        this.modelEntityAlter.angle.setFromPoint(this.angle);
        this.modelEntityAlter.scale.setFromPoint(this.scale);
        this.modelEntityAlter.inCameraSpace=false;

        return(this.modelEntityAlter.boundBoxInFrustum());
    }
}

