import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EntityPlayerClass from '../entities/entity_player.js';

//
// weapon base entity class
//

export default class EntityWeaponBaseClass extends ProjectEntityClass
{
    initialize()
    {
        super.initialize();
        
            // weapon setup
            
        this.ammoCount=0;
        this.ammoAddCount=0;
        this.ammoMaxCount=0;
        this.interfaceIconName=null;
        this.fireWait=0;
        this.lastFireTick=0;
        
            // pre-allocates
            
        this.firePoint=new PointClass(0,0,0);
        this.fireVector=new PointClass(0,0,0);
        this.fireHitPoint=new PointClass(0,0,0);
        
        return(true);
    }
    
    ready()
    {
        super.ready();
        
        this.ammoCount=this.ammoInitialCount;
        this.lastFireTick=0;
    }
    
    
        //
        // add ammo
        //
        
    addAmmo()
    {
        this.ammoCount=Math.min((this.ammoCount+this.ammoAddCount),this.ammoMaxCount);
        if (this.heldBy instanceof EntityPlayerClass) this.pulseInterfaceElement(this.interfaceIconName,500,5);
    }
    
        //
        // fire call
        //
    
    fire(position,angle,eyeOffset)
    {
            // can we fire?
            
        if (this.ammoCount===0) return;
        if (this.getTimestamp()<(this.lastFireTick+this.fireWait)) return(false);
        
            // fire
            
        this.ammoCount--;
        this.lastFireTick=this.getTimestamp();
        
            // move onto internal firing
            
        return(true);
    }
    
    hitScan(position,angle,eyeOffset,maxDistance,hitFilter,damage,hitEffectClass)
    {
            // the hit scan, firing point is the eye
            // and we rotate with the look and then turn
            
        this.firePoint.setFromPoint(position);
        this.firePoint.y+=eyeOffset;
        
        this.fireVector.setFromValues(0,0,maxDistance);
        this.fireVector.rotateX(null,angle.x);
        this.fireVector.rotateY(null,angle.y);
        
        if (this.rayCollision(this.firePoint,this.fireVector,this.fireHitPoint,hitFilter,null)) {
            
                // is this an entity we can hit?
                
            if (this.hitEntity) {
                if (this.hitEntity.damage!==undefined) {
                    this.hitEntity.damage(this.heldBy,damage,this.fireHitPoint);
                }
            }
            
                // hit effect
                // push effect point towards person firing so it shows up better

            if (hitEffectClass!==null) {
                this.fireVector.normalize();
                this.fireVector.scale(-100);
                this.fireHitPoint.addPoint(this.fireVector);
                this.addEffect(hitEffectClass,this.fireHitPoint,null,true);
            }
        }

    }
    
}
