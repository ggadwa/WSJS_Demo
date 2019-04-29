import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import ModelClass from '../../../code/model/model.js';
import ImportModelClass from '../../../code/import/import_model.js';
import EffectExplosionFireClass from '../effects/effect_explosion_fire.js';
import EffectExplosionSmokeClass from '../effects/effect_explosion_smoke.js';

//
// grenade projectile entity class
//

export default class EntityProjectileGrenadeClass extends ProjectEntityClass
{
    static LIFE_TICK=3000;
    static SPEED=450;
    static BOUNCE_FACTOR=0.95;
    static DECELERATION_FACTOR=0.95;
    static STOP_SPEED=10;
    static BOUNCE_PAUSE_COUNT=5;
    static DAMAGE=100;
    static DAMAGE_DISTANCE=20000;
    
    constructor(core,name,position,angle,data)
    {
        super(core,name,position,angle,data);
        
        this.radius=500;
        this.height=500;
        
        this.gravityMinValue=10;
        this.gravityMaxValue=320;
        this.gravityAcceleration=15;
        
        this.running=false;
        this.rolling=false;
        this.stopped=false;
        
        this.bouncePause=0;
        this.startTick=0;
        
        this.motion=new PointClass(0,0,0);
        this.savePoint=new PointClass(0,0,0);
        this.drawPosition=new PointClass(0,0,0);
        this.drawAngle=new PointClass(0,0,0);
        
        this.parentEntity=null;
        
        this.explosionFireEffect=null;
        this.explosionSmokeEffect=null;
        
        Object.seal(this);
    }
    
    initialize()
    {
        super.initialize();
        
            // the model
            
        this.setModel({"name":"grenade"});
        this.scale.setFromValues(100,100,100);
        
            // sounds
            
        this.addSound('grenade_bounce',50000);
        
            // explosion effect
        
        this.explosionSmokeEffect=new EffectExplosionSmokeClass(this.core,null);
        this.explosionSmokeEffect.show=false;
        this.core.map.effectList.add(this.explosionSmokeEffect);
            
        this.explosionFireEffect=new EffectExplosionFireClass(this.core,null);
        this.explosionFireEffect.show=false;
        this.core.map.effectList.add(this.explosionFireEffect);
        
            // not shown and not running
            
        this.show=false;
        this.running=false;
        this.rolling=false;
        this.bouncePause=0;
    }
    
        //
        // throw call
        //
        
    throw(senderEntity,throwPosition,throwAngle)
    {
        this.parentEntity=senderEntity;
        
            // show and position
            
        this.show=true;
        this.position.setFromPoint(throwPosition);
        this.angle.setFromPoint(throwAngle);
        
            // setup motion and start running
            
        this.motion.setFromValues(0,0,EntityProjectileGrenadeClass.SPEED);
        this.motion.rotate(this.angle);
        
        this.drawAngle.setFromValues(0,0,0);
        
        this.running=true;
        this.rolling=false;
        this.stopped=false;
        this.startTick=this.getTimestamp();
    }
    
        //
        // run
        //
    
    explode()
    {
        let dist,damage,entity,entityList;
        
        this.running=false;
        this.show=false;
        
            // explosion effects
            
        this.explosionSmokeEffect.restart(this.position,true);
        this.explosionFireEffect.restart(this.position,true);
        
            // damage any entity that has a
            // damage method
            
        entityList=this.getEntityList();
        
        for (entity of entityList.entities) {
            if (entity.damage===undefined) continue;
            
            dist=this.position.distance(entity.position);
            if (dist>EntityProjectileGrenadeClass.DAMAGE_DISTANCE) continue;
            
            damage=Math.trunc((1.0-(dist/EntityProjectileGrenadeClass.DAMAGE_DISTANCE))*EntityProjectileGrenadeClass.DAMAGE);
            entity.damage(this.parentEntity,damage);
        }
    }
    
    run()
    {
        if (!this.running) return;
        
            // time for grenade to end?
            
        if (this.getTimestamp()>(this.startTick+EntityProjectileGrenadeClass.LIFE_TICK)) {
            this.explode();
            return;
        }
        
            // rolling slows down grenade
            
        if ((this.rolling) && (!this.stopped)) {
            this.motion.x*=EntityProjectileGrenadeClass.DECELERATION_FACTOR;
            this.motion.z*=EntityProjectileGrenadeClass.DECELERATION_FACTOR;
            
            if ((Math.abs(this.motion.x)+Math.abs(this.motion.z))<EntityProjectileGrenadeClass.STOP_SPEED) {
                this.motion.x=0;
                this.motion.z=0;
                this.stopped=true;
            }
        }
        
            // move grenade
            
        this.savePoint.setFromPoint(this.position);
        
        if (!this.stopped) this.moveInMapXZ(this.motion,false,false);
        this.moveInMapY(this.motion,false);
       
            // hitting floor

        if ((this.standOnMeshIdx!==-1) && (!this.rolling)) {
            this.playSound('grenade_bounce');
            
            this.position.setFromPoint(this.savePoint);
            this.motion.y=this.floorHitBounceY(this.motion.y,EntityProjectileGrenadeClass.BOUNCE_FACTOR);
            if (this.motion.y===0) this.rolling=true;
            return;
        }

            // hitting wall

        if ((this.collideWallMeshIdx!==-1) && (this.bouncePause===0)) {
            this.playSound('grenade_bounce');
            
            this.position.setFromPoint(this.savePoint);
            this.angle.y=this.wallHitAngleReflect();
            
            this.motion.setFromValues(0,0,this.motion.length());
            this.motion.rotate(this.angle);
            
            this.bouncePause=EntityProjectileGrenadeClass.BOUNCE_PAUSE_COUNT;
            return;
        }
        
        if (this.bouncePause!==0) this.bouncePause--;
    }
    
    drawSetup()
    {
            // spinning

        if (!this.stopped) {
            if (!this.rolling) {
                this.drawAngle.x=this.getPeriodicLinear(4000,360);
            }
            else {
                if (this.drawAngle.x!==90) {
                    if (this.drawAngle.x>90) {
                        this.drawAngle.x-=2;
                        if (this.drawAngle.x<90) this.drawAngle.x=90;
                    }
                    else {
                        this.drawAngle.x+=2;
                        if (this.drawAngle.x>90) this.drawAngle.x=90;
                    }
                }
                this.drawAngle.z=this.getPeriodicLinear(4000,360);
            }
            
            this.drawAngle.y=this.getPeriodicLinear(3000,360);
        }
        
            // model is centered on Y so it needs
            // to be moved up a bit to draw, but we only
            // do this if rolling
                
        this.drawPosition.setFromPoint(this.position);
        if (this.rolling) this.drawPosition.y+=300;
        
        this.setModelDrawPosition(this.drawPosition,this.drawAngle,this.scale,false);
        return(true);
    }
    
}
