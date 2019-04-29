import PointClass from '../../../code/utility/point.js';
import ModelClass from '../../../code/model/model.js';
import ImportModelClass from '../../../code/import/import_model.js';
import EntityPickupBaseClass from '../entities/entity_pickup_base.js';

//
// pickup beretta class
//

export default class EntityPickupBerettaClass extends EntityPickupBaseClass
{
    constructor(core,name,position,angle,data)
    {
        super(core,name,position,angle,data);
        
        this.radius=2000;
        this.height=2000;
        
        this.hideTick=5000;
        this.pickupName=this.data.ammo?'beretta_ammo':'beretta';
                
        Object.seal(this);
    }
    
    initialize()
    {
        super.initialize();
        
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
