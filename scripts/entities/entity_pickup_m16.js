import PointClass from '../../../code/utility/point.js';
import EntityPickupBaseClass from '../entities/entity_pickup_base.js';

//
// pickup m16 class
//

export default class EntityPickupM16Class extends EntityPickupBaseClass
{
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=2000;
        this.height=2000;
        
        this.hideTick=5000;
        this.pickupName=this.data.ammo?'m16_ammo':'m16';
                
            // model
                
        this.cacheModel('m16',null);
        this.setModel('m16');
        this.scale.setFromValues(8000,8000,8000);
    }
        
    ready()
    {
        super.ready();
        
        if (this.data.ammo) {
            this.showModelMesh('m16_rifle',false);
            this.showModelMesh('shutter',false);
            this.showModelMesh('trigger',false);
            this.showModelMesh('m16_holder_01',false);
        }
        else {
            this.showModelMesh('m16_holder_02',false);
            this.showModelMesh('m16_bullet',false);
            this.showModelMesh('m16_bullet01',false);
            this.showModelMesh('m16_bullet02',false);
            this.showModelMesh('m16_bullet04',false);
            this.showModelMesh('m16_bullet05',false);
            this.showModelMesh('m16_bullet06',false);
            this.showModelMesh('m16_bullet07',false);
            this.showModelMesh('m16_bullet08',false);
        }
    }
    
}
