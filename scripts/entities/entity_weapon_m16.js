import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EffectHitClass from '../effects/effect_hit.js';
import EntityPlayerClass from '../entities/entity_player.js';
import EntityWeaponBaseClass from '../entities/entity_weapon_base.js';

//
// m16 rifle entity class
//

export default class EntityWeaponM16Class extends EntityWeaponBaseClass
{
    static DAMAGE=5;
    static HIT_FILTER=['player','bot','monster'];
    
    handOffset=null;
    handAngle=null;
    hitEffect=null;
    
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=5000;
        this.height=11000;      // this model is based on a humanoid skeleton, so it's taller
        
        this.fireWait=200;
        
        this.ammoInitialCount=100;
        this.ammoAddCount=50;
        this.ammoMaxCount=300;
        this.interfaceIconName='m16_bullet';
        
        this.handOffset=new PointClass(100,-8500,-2000);
        this.handAngle=new PointClass(0,0,-10);
            
            // the model
            
        this.setModel({"name":"hand_m16"});
        this.scale.setFromValues(5000,5000,5000);
        
            // sounds
            
        this.addSound('m16_fire',25000);
        
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
        
            // the sound played
            // at whoever is holding weapon
            
        this.playSoundAtEntity(this.heldBy,'m16_fire');
        
            // the animation
            
        this.startModelAnimationChunkInFrames(null,30,128,143);
        this.queueModelAnimationChunkInFrames(null,30,77,127);
        
        
            // run the hitscan
            
        this.hitScan(position,angle,eyeOffset,100000,EntityWeaponM16Class.HIT_FILTER,EntityWeaponM16Class.DAMAGE,this.hitEffect);
        
        return(true);
    }
    
    //
    // this weapon draws in the camera view
    // so we have to set some positions and angles
    //
    
    drawSetup()
    {
            // this weapon draws in the camera view
            // so we have to set some positions and angles
            
        this.setModelDrawPosition(this.handOffset,this.handAngle,this.scale,true);
        return(true);
    }
    
}
