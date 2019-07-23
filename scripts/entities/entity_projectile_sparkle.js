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
    
    running=false;
    motion=null;
    parentEntity=null;
    nextSparkleTick=0;
    currentSparkleIndex=0;
    sparkleEffects=null;
    explosionSmokeEffect=null;
    explosionFireEffect=null;

    
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
        
            // explosion effects
            
        this.explosionSmokeEffect=this.addEffect(EffectExplosionSmokeClass,null,false);
        this.explosionFireEffect=this.addEffect(EffectExplosionFireClass,null,false);
        
            // the model
            
        this.setModel({"name":"crystal_ball"});
        this.scale.setFromValues(20,20,20);
       
            // sounds
            
        this.addSound('laser',50000);
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
        this.motion.rotateX(null,fireAngle.x);
        this.motion.rotateY(null,fireAngle.y);
        
            // setup next sparkle
          
        this.currentSparkleIndex=0;
        this.nextSparkleTick=this.getTimestamp();
        
        this.playSoundAtEntity(parentEntity,'laser',1.0,false);
        
        this.running=true;
    }
    
        //
        // exploding
        //
        
        
    explode()
    {
            // explosion effects
            
        this.explosionSmokeEffect.restart(this.position,true);
        this.explosionFireEffect.restart(this.position,true);
        
            // damage entities in a radius
            
        this.damageEntityForRadius(this.parentEntity,this.position,EntityProjectileSparkleClass.DAMAGE_DISTANCE,EntityProjectileSparkleClass.DAMAGE);
        
            // shake the screen
            
        this.shakeCamera(this.position,EntityProjectileSparkleClass.SHAKE_DISTANCE,EntityProjectileSparkleClass.SHAKE_TICK,EntityProjectileSparkleClass.SHAKE_MAX_SHIFT);
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
            
        if (!this.simpleMoveEntityInMap(this.motion)) return;
       
            // hitting anything stops it
        
        this.running=false;
        this.show=false;

        if (this.touchEntity!==null) this.touchEntity.damage(this.parentEntity,EntityProjectileSparkleClass.DAMAGE,this.position);
        
            // some can explode
            
        if (this.data.explode) this.explode(); 
    }
    
}
