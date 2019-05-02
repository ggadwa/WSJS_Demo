import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import ModelClass from '../../../code/model/model.js';
import EffectSparkleClass from '../effects/effect_sparkle.js';

//
// sparkle projectile entity class
//

export default class EntityProjectileSparkleClass extends ProjectEntityClass
{
    static SPARKLE_EFFECT_COUNT=10;
    static SPARKLE_TICK_COUNT=70;
    static SPEED=300;
    static DAMAGE=10;
    
    running=false;
    motion=null;
    parentEntity=null;
    nextSparkleTick=0;
    currentSparkleIndex=0;
    sparkleEffects=null;
    
    initialize()
    {
        let n;
        
        super.initialize();
        
            // setup
            
        this.radius=500;
        this.height=500;
            
        this.motion=new PointClass(0,0,0);
        
            // not shown and not running
            
        this.show=false;
        this.running=false;
        
            // sparkle effects
            // this projectile has no model, it's all effects
            
        this.sparkleEffects=[];
        
        for (n=0;n!=EntityProjectileSparkleClass.SPARKLE_EFFECT_COUNT;n++) {
            this.sparkleEffects.push(this.addEffect(EffectSparkleClass,null,false));
        }
    }
    
        //
        // throw call
        //
        
    fire(parentEntity,firePosition,fireAngle)
    {
        this.parentEntity=parentEntity;
        
            // show and position
            
        this.show=true;
        this.position.setFromPoint(firePosition);
        this.angle.setFromPoint(fireAngle);
        
            // setup motion and start running
            
        this.motion.setFromValues(0,0,EntityProjectileSparkleClass.SPEED);
        this.motion.rotate(this.angle);
        
            // setup next sparkle
          
        this.currentSparkleIndex=0;
        this.nextSparkleTick=this.getTimestamp();
        
        this.running=true;
    }
    
        //
        // run
        //
    
    run()
    {
        if (!this.running) return;
        
            // time for an effect

        if (this.getTimestamp()>=this.nextSparkleTick) {
            this.nextSparkleTick+=EntityProjectileSparkleClass.SPARKLE_TICK_COUNT;

            this.sparkleEffects[this.currentSparkleIndex++].restart(this.position,true);
            if (this.currentSparkleIndex>=EntityProjectileSparkleClass.SPARKLE_EFFECT_COUNT) this.currentSparkleIndex=0;
        }
        
            // move sparkle
            
        this.moveInMapXZ(this.motion,false,false);
        this.moveInMapY(this.motion,true);
       
            // hitting anything stops it
            
        if (this.touchEntity!==null) {
            this.touchEntity.damage(this.parentEntity,EntityProjectileSparkleClass.DAMAGE);
            this.running=false;
            this.show=false;
        }
        
            // hitting anything else stops it
            
        if ((this.collideWallMeshIdx!==-1) || (this.collideCeilingMeshIdx!==-1)) {
            this.running=false;
            this.show=false;
        }
    }
    
}
