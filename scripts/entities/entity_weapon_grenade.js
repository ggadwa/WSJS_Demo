import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EntityProjectileGrenadeClass from '../entities/entity_projectile_grenade.js';
import EntityPlayerClass from '../entities/entity_player.js';
import EntityWeaponBaseClass from '../entities/entity_weapon_base.js';
import EntityJsonClass from '../../../code/project/entity_json.js';

//
// grenade weapon entity class
//

export default class EntityWeaponGrenadeClass extends EntityJsonClass
{
    getJsonName()
    {
        return("entity_weapon_grenade");
    }

    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=0;
        this.height=0;      // nothing ever draws, this is your collection of grenades to throw
        
        this.fireWait=1000;
        
        this.ammoInitialCount=3;
        this.ammoAddCount=1;
        this.ammoMaxCount=5;
        this.interfaceIconName='grenade';
        
        this.firePosition=new PointClass(0,0,0);
        
        return(true);
    }
    
    release()
    {
    }
    
        //
        // fire call
        //
        
    fire(position,angle,eyeOffset)
    {
            // the super does the ammo calc
            // and tells if we can fire
            
        if (!super.fire(position,angle,eyeOffset)) return(false);
        
            // throw sound
            
        this.playSoundAtEntity(this.heldBy,'throw',1.0,false);

            // fire position
            
        this.firePosition.setFromValues(0,0,1800);
        this.firePosition.rotate(angle);
        this.firePosition.addPoint(position);
        this.firePosition.y+=4000;
        
            // spawn from whatever is holding this weapon
            // so it counts as the spawnBy for any damage calculations, etc

        this.addEntityFromEntity(this.heldBy,EntityProjectileGrenadeClass,('projectile_grenade'),this.firePosition,angle,null,false,false);
        
        return(true);
    }

}
