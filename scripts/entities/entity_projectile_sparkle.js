import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EffectSparkleClass from '../effects/effect_sparkle.js';
import EffectExplosionFireClass from '../effects/effect_explosion_fire.js';
import EffectExplosionSmokeClass from '../effects/effect_explosion_smoke.js';

//
// sparkle projectile entity class
//

export default class EntityProjectileSparkleClass extends ProjectEntityClass
{
    initialize()
    {
        super.initialize();
        
        this.SPARKLE_EFFECT_COUNT=15;
        this.SPARKLE_TICK_COUNT=40;
        this.SPEED=300;
        this.Y_SPEED=1;
        this.DAMAGE=5;
        this.EXPLODE_DAMAGE=30;
        this.DAMAGE_DISTANCE=20000;
        this.SHAKE_DISTANCE=30000;
        this.SHAKE_MAX_SHIFT=40;
        this.SHAKE_TICK=2000;
        
            // setup
            
        this.radius=500;
        this.height=500;
        
        this.nextSparkleTick=this.getTimestamp();
            
            // the motion
            
        this.motion=new PointClass(0,0,this.SPEED);
        this.motion.rotateX(null,this.angle.x);
        this.motion.rotateY(null,this.angle.y);
        
            // the model
            
        this.setModel('crystal_ball');
        this.scale.setFromValues(20,20,20);
        
            // sound effect
            
        this.playSound('laser',1.0,false);
    }
        
        //
        // exploding
        //
        
        
    explode()
    {
            // explosion effects
            
        this.addEffect(EffectExplosionSmokeClass,this.position,null,true);
        this.addEffect(EffectExplosionFireClass,this.position,null,true);
        
            // damage entities in a radius
            
        this.damageEntityForRadius(this.spawnedBy,this.position,this.DAMAGE_DISTANCE,this.DAMAGE);
        
            // shake the screen
            
        this.shakeCamera(this.position,this.SHAKE_DISTANCE,this.SHAKE_TICK,this.SHAKE_MAX_SHIFT);
    }

        //
        // run
        //
    
    run()
    {
            // time for an effect

        if (this.getTimestamp()>=this.nextSparkleTick) {
            this.nextSparkleTick+=this.SPARKLE_TICK_COUNT;

            this.addEffect(EffectSparkleClass,this.position,null,true);
        }
        
            // move sparkle
            
        if (!this.simpleMoveEntityInMap(this.motion)) return;
       
            // hitting anything stops it
        
        this.markDelete=true;

        if (this.touchEntity!==null) this.touchEntity.damage(this.spawnedBy,this.DAMAGE,this.position);
        
            // some can explode
            
        if (this.data.explode) this.explode(); 
    }
    
}
