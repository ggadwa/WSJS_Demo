import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/entity.js';
import EntityWeaponBerettaClass from '../entities/entity_weapon_beretta.js';
import EntityWeaponM16Class from '../entities/entity_weapon_m16.js';
import EntityWeaponGrenadeClass from '../entities/entity_weapon_grenade.js';

export default class EntityRemoteClass extends ProjectEntityClass
{
    initialize()
    {
        super.initialize();

        this.setModel('player');
        this.scale.setFromValues(3000,3000,3000);
        
            // weapons

        this.beretta=this.addEntity(EntityWeaponBerettaClass,'weapon_beretta',new PointClass(0,0,0),new PointClass(0,0,0),null,true,true);
        this.m16=this.addEntity(EntityWeaponM16Class,'weapon_m16',new PointClass(0,0,0),new PointClass(0,0,0),null,false,true);
        this.grenade=this.addEntity(EntityWeaponGrenadeClass,'weapon_grenade',new PointClass(0,0,0),new PointClass(0,0,0),null,false,true);
        
        return(true);
    }
    
    release()
    {
        super.release();
        
        this.removeEntity(this.beretta);
        this.removeEntity(this.m16);
        this.removeEntity(this.grenade);
    }
}
