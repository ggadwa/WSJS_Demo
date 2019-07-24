import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';

//
// pickup base class
//

export default class EntityPickupBaseClass extends ProjectEntityClass
{
    originalY=0;
    hideStartTick=0;
    hideTick=5000;
    pickupName=null;
    
    initialize()
    {
        super.initialize();
        
            // base setup
            
        this.passThrough=true;           // can pass through
        
            // sounds
            
        this.addSound('pickup',5000,0,0);
    }
    
    ready()
    {
        this.hideStartTick=0;
        
        this.originalY=this.position.y;
    }
    
    run()
    {
            // if hidden, count down to show
            
        if (!this.show) {
            if (this.data!==null) {
                if (this.data.pickupOnce!==undefined) return;
            }
            
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
            this.playSound('pickup',1.0,false);
        }
    }
    
}
