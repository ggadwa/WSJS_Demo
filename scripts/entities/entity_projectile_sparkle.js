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
    static SPARKLE_EFFECT_COUNT=15;
    static SPARKLE_TICK_COUNT=40;
    static SPEED=300;
    static Y_SPEED=1;
    static DAMAGE=5;
    static EXPLODE_DAMAGE=30;
    static DAMAGE_DISTANCE=20000;
    static SHAKE_DISTANCE=30000;
    static SHAKE_MAX_SHIFT=40;
    static SHAKE_TICK=2000;
    
    motion=null;
    nextSparkleTick=0;
    
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=500;
        this.height=500;
        
        this.nextSparkleTick=this.getTimestamp();
            
            // the motion
            
        this.motion=new PointClass(0,0,EntityProjectileSparkleClass.SPEED);
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
            
        this.damageEntityForRadius(this.spawnedBy,this.position,EntityProjectileSparkleClass.DAMAGE_DISTANCE,EntityProjectileSparkleClass.DAMAGE);
        
            // shake the screen
            
        this.shakeCamera(this.position,EntityProjectileSparkleClass.SHAKE_DISTANCE,EntityProjectileSparkleClass.SHAKE_TICK,EntityProjectileSparkleClass.SHAKE_MAX_SHIFT);
    }

        //
        // run
        //
    
    run()
    {
            // time for an effect

        if (this.getTimestamp()>=this.nextSparkleTick) {
            this.nextSparkleTick+=EntityProjectileSparkleClass.SPARKLE_TICK_COUNT;

            this.addEffect(EffectSparkleClass,this.position,null,true);
        }
        
            // move sparkle
            
        if (!this.simpleMoveEntityInMap(this.motion)) return;
       
            // hitting anything stops it
        
        this.markDelete=true;

        if (this.touchEntity!==null) this.touchEntity.damage(this.spawnedBy,EntityProjectileSparkleClass.DAMAGE,this.position);
        
            // some can explode
            
        if (this.data.explode) this.explode(); 
    }
    
}
