import PointClass from '../../../code/utility/point.js';
import EntityPickupBaseClass from '../entities/entity_pickup_base.js';

//
// pickup armor class
//

export default class EntityPickupArmorClass extends EntityPickupBaseClass
{
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=800;
        this.height=800;
        
        this.hideTick=10000;
        this.pickupName='armor';
        
            // model
            
        this.setModel('shield');
        this.scale.setFromValues(80,80,80);
    }
    
    ready()
    {
        super.ready();
        
        this.angle.x=90;
    }
    
}
