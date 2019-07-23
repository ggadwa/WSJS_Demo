import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EffectHitClass from '../effects/effect_hit.js';
import EntityPlayerClass from '../entities/entity_player.js';
import EntityWeaponBaseClass from '../entities/entity_weapon_base.js';

//
// m16 rifle entity class
//

export default class EntityWeaponBerettaClass extends EntityWeaponBaseClass
{
    static DAMAGE=20;
    static HIT_FILTER=['player','bot','monster','ball'];
    
    handOffset=null;
    handAngle=null;
    hitEffect=null;
    
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=5000;
        this.height=11000;      // this model is based on a humanoid skeleton, so it's taller
        
        this.fireWait=900;
        
        this.ammoInitialCount=15;
        this.ammoAddCount=10;
        this.ammoMaxCount=25;
        this.interfaceIconName='beretta_bullet';
        
        this.handOffset=new PointClass(-1300,-12500,-2700);
        this.handAngle=new PointClass(0,0,0);

            // the model
            
        this.setModel({"name":"hand_beretta"});
        this.scale.setFromValues(7000,7000,7000);
        
            // sounds
            
        this.addSound('beretta_fire',25000);
        
            // hit effect
            
        this.hitEffect=this.addEffect(EffectHitClass,null,false);
    }
    
    ready()
    {
        super.ready();
        
        this.startModelAnimationChunkInFrames(null,30,77,127);
    }
    
        //
        // fire call
        //
    
    fire(position,angle,eyeOffset)
    {
            // the super does the ammo calc
            // and tells if we can fire
            
        if (!super.fire(position,angle,eyeOffset)) return(false);
        
            // the sound
            // played at holder of weapon
            
        this.playSoundAtEntity(this.heldBy,'beretta_fire',1.0,false);
        
            // the animation
            
        this.startModelAnimationChunkInFrames(null,30,128,143);
        this.queueModelAnimationChunkInFrames(null,30,77,127);
        
            // run the hitscan
            
        this.hitScan(position,angle,eyeOffset,100000,EntityWeaponBerettaClass.HIT_FILTER,EntityWeaponBerettaClass.DAMAGE,this.hitEffect);
        
        return(true);
    }
    
    //
    // this weapon draws in the camera view
    // so we have to set some positions and angles
    //
            
    drawSetup()
    {
        this.setModelDrawPosition(this.handOffset,this.handAngle,this.scale,true);
        return(true);
    }
    
}
