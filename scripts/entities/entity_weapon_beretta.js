import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EntityPlayerClass from '../entities/entity_player.js';
import EntityWeaponBaseClass from '../entities/entity_weapon_base.js';
import EntityJsonClass from '../../../code/project/entity_json.js';

//
// pistol entity class
//

export default class EntityWeaponBerettaClass extends EntityJsonClass
{
    getJsonName()
    {
        return("entity_weapon_pistol");
    }
   
}
