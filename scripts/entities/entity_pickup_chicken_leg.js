import PointClass from '../../../code/utility/point.js';
import ModelClass from '../../../code/model/model.js';
import ImportModelClass from '../../../code/import/import_model.js';
import EntityPickupBaseClass from '../entities/entity_pickup_base.js';

//
// pickup chicken leg class
//

export default class EntityPickupChickenLegClass extends EntityPickupBaseClass
{
    constructor(core,name,position,angle,data)
    {
        super(core,name,position,angle,data);
        
        this.radius=800;
        this.height=800;
        
        this.hideTick=10000;
        this.pickupName='health';
                
        Object.seal(this);
    }
    
    initialize()
    {
        super.initialize();
        
        this.setModel({"name":"chicken_leg"});
        this.scale.setFromValues(100,100,100);
    }
        
    
}
