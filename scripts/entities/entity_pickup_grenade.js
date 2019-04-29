import PointClass from '../../../code/utility/point.js';
import ModelClass from '../../../code/model/model.js';
import ImportModelClass from '../../../code/import/import_model.js';
import EntityPickupBaseClass from '../entities/entity_pickup_base.js';

//
// pickup grenade class
//

export default class EntityPickupGrenadeClass extends EntityPickupBaseClass
{
    constructor(core,name,position,angle,data)
    {
        super(core,name,position,angle,data);
        
        this.radius=800;
        this.height=800;
        
        this.hideTick=10000;
        this.pickupName='grenade';
                
        Object.seal(this);
    }
    
    initialize()
    {
        super.initialize();
        
        this.setModel({"name":"grenade"});
        this.scale.setFromValues(250,250,250);
    }
    
}
