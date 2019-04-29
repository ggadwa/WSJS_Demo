import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import ModelClass from '../../../code/model/model.js';
import ImportModelClass from '../../../code/import/import_model.js';

//
// pickup base class
//

export default class EntityPickupBaseClass extends ProjectEntityClass
{
    constructor(core,name,position,angle,data)
    {
        super(core,name,position,angle,data);
        
        this.passThrough=true;           // can pass through
        
        this.originalY=0;
        
        this.hideStartTick=0;
        this.hideTick=5000;
        this.pickupName=null;
    }
    
    initialize()
    {
        super.initialize();
        
        this.addSound('pickup',5000);
    }
        
    ready()
    {
        this.originalY=this.position.y;
    }
    
    run()
    {
            // if hidden, count down to show
            
        if (!this.show) {
            if (this.getTimestamp()<(this.hideStartTick+this.hideTick)) return;
            
            this.touchEntity=null;          // clear any touches
            this.show=true;
        }
        
            // animation
            
        this.position.y=this.originalY+this.getPeriodicCos(5000,200);
        this.angle.y=this.getPeriodicLinear(5000,360);
        
            // check for collisions
            
        if (this.touchEntity===null) return;
        
            // can this entity pickup?
            // we see if the class has defined a pickup call
            
        if (this.touchEntity.pickup===undefined) return;
        
            // try the pickup, if true then it's picked up
            
        if (this.touchEntity.pickup(this.pickupName)) {
            this.show=false;
            this.hideStartTick=this.getTimestamp();
            this.playSound('pickup');
        }
    }
    
}
