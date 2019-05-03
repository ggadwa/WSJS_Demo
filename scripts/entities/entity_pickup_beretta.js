import PointClass from '../../../code/utility/point.js';
import EntityPickupBaseClass from '../entities/entity_pickup_base.js';

//
// pickup beretta class
//

export default class EntityPickupBerettaClass extends EntityPickupBaseClass
{
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=2000;
        this.height=2000;
        
        this.hideTick=5000;
        this.pickupName=this.data.ammo?'beretta_ammo':'beretta';
                
            // model
                
        this.setModel({"name":"beretta"});
        this.scale.setFromValues(10000,10000,10000);
    }
        
    ready()
    {
        super.ready();
        
        if (this.data.ammo) {
            this.showModelMesh('beretta',false);
            this.showModelMesh('triger',false);
            this.showModelMesh('peen',false);
            this.showModelMesh('beretta_top',false);
            this.showModelMesh('holder',false); 
        }
        else {
            this.showModelMesh('holder02',false);
            this.showModelMesh('bullet_00',false);
            this.showModelMesh('bullet_01',false);
            this.showModelMesh('bullet_02',false);
            this.showModelMesh('bullet_03',false);
            this.showModelMesh('bullet_04',false);
            this.showModelMesh('bullet_05',false);
            this.showModelMesh('bullet_06',false);
        }
    }
    
}
