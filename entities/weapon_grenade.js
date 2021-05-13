import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import EntityClass from '../../../code/game/entity.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';

export default class WeaponGrenadeClass extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
        
        this.modelName=null;
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(0,0,0);
        this.radius=0;
        this.height=0;
        this.eyeOffset=0;
        this.weight=0;
        this.modelHideMeshes=[];
        
            // physics
            
        this.maxBumpCount=0;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=8;
        this.collisionHeightSegmentCount=2;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;

            // variables
            
        this.available=false;
        
        this.ammoCount=0;
        this.lastFireTimestamp=0;
        
            // sounds
            
        this.fireSound=new SoundDefClass('throw',1.0,0,10000,0,0,false);
            
            // pre-allocates
        
        this.firePoint=new PointClass(0,0,0);
        this.fireAng=new PointClass(0,0,0);
    }
    
    ready()
    {
        super.ready();
        
        this.ammoCount=3;
        this.lastFireTimestamp=0;
    }
    
        //
        // ammo
        //
        
    addAmmo(count)
    {
        this.ammoCount+=count;
        if (this.ammoCount>5) this.ammoCount=5;
    }
            
        //
        // firing
        //
        
    isFirePaused()
    {
        return((this.lastFireTimestamp+1000)>this.getTimestamp());
    }
    
    fire(firePosition,fireAngle)
    {
        let projEntity;
        let parentEntity=this.heldBy;
        
        if (this.ammoCount===0) return(false);
            
        if (this.isFirePaused()) return(false);
        this.lastFireTimestamp=this.getTimestamp();
        
            // fire
            
        this.ammoCount--;
        
        this.playSoundAtPosition(firePosition,this.fireSound);
        
            // fire position
            
        this.firePoint.setFromValues(0,-500,3500);
        
        this.fireAng.setFromPoint(fireAngle);
        this.fireAng.x+=5.0;           // up slightly
        this.firePoint.rotateX(null,this.fireAng.x);
        this.firePoint.rotateY(null,this.fireAng.y);
        
        this.firePoint.addPoint(firePosition);
        
            // spawn from whatever is holding this weapon
            // so it counts as the spawnBy for any damage calculations, etc

        projEntity=this.addEntity('projectile_grenade','projectile_grenade',this.firePoint,this.fireAng,null,parentEntity,null,true);
        if (projEntity!==null) projEntity.ready();

        return(true);
    }
    
        //
        // grenade has no clips
        //
     
    needClipChange()
    {
        return(false);
    }
    
        //
        // grenade has no weapon model
        //
        
    drawSetup()
    {
        return(false);
    }

}
