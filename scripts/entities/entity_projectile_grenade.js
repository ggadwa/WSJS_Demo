import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EffectExplosionFireClass from '../effects/effect_explosion_fire.js';
import EffectExplosionSmokeClass from '../effects/effect_explosion_smoke.js';

//
// grenade projectile entity class
//

export default class EntityProjectileGrenadeClass extends ProjectEntityClass
{
    initialize()
    {
        super.initialize();
        
        this.LIFE_TICK=3000;
        this.SPEED=450;
        this.BOUNCE_FACTOR=0.95;
        this.BOUNCE_CUT=50;
        this.DECELERATION_FACTOR=0.95;
        this.STOP_SPEED=10;
        this.BOUNCE_PAUSE_COUNT=5;
        this.DAMAGE=100;
        this.DAMAGE_DISTANCE=20000;
        this.SHAKE_DISTANCE=30000;
        this.SHAKE_MAX_SHIFT=40;
        this.SHAKE_TICK=2000;
        
            // setup
            
        this.startTick=this.getTimestamp();
            
        this.radius=500;
        this.height=500;
        
        this.gravityMinValue=10;
        this.gravityMaxValue=320;
        this.gravityAcceleration=15;
            
        this.motion=new PointClass(0,0,0);      // some pre-allocates
        this.savePoint=new PointClass(0,0,0);
        this.drawPosition=new PointClass(0,0,0);
        this.drawAngle=new PointClass(0,0,0);
        
            // setup motion
            
        this.show=true;
        this.rolling=false;
        this.stopped=false;
        this.bouncePause=0;
            
        this.motion.setFromValues(0,0,this.SPEED);
        this.motion.rotate(this.angle);
        
            // the model
            
        this.setModel('grenade');
        this.scale.setFromValues(100,100,100);
    }
    
        //
        // run
        //
    
    explode()
    {
            // remove it
            
        this.markDelete=true;
        
            // explosion effects
            
        this.addEffect(EffectExplosionSmokeClass,this.position,null,true);
        this.addEffect(EffectExplosionFireClass,this.position,null,true);
        
            // damage entities in a radius
            
        this.damageEntityForRadius(this.spawnedBy,this.position,this.DAMAGE_DISTANCE,this.DAMAGE);
        
            // shake the screen
            
        this.shakeCamera(this.position,this.SHAKE_DISTANCE,this.SHAKE_TICK,this.SHAKE_MAX_SHIFT);
    }
    
    run()
    {
            // time for grenade to end?
            
        if (this.getTimestamp()>(this.startTick+this.LIFE_TICK)) {
            this.explode();
            return;
        }
        
            // rolling slows down grenade
            
        if ((this.rolling) && (!this.stopped)) {
            this.motion.x*=this.DECELERATION_FACTOR;
            this.motion.z*=this.DECELERATION_FACTOR;
            
            if ((Math.abs(this.motion.x)+Math.abs(this.motion.z))<this.STOP_SPEED) {
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
            this.playSound('grenade_bounce',1.0,false);
            
            this.position.setFromPoint(this.savePoint);
            this.motion.y=this.floorHitBounceY(this.motion.y,this.BOUNCE_FACTOR,this.BOUNCE_CUT);
            
            if (this.motion.y===0) {
                this.rolling=true;
            }
            else {
                this.motion.y=this.moveInMapY(this.motion,false);
            }
            
            return;
        }

            // hitting wall

        if ((this.collideWallMeshIdx!==-1) && (this.bouncePause===0)) {
            this.playSound('grenade_bounce',1.0,false);
            
            this.position.setFromPoint(this.savePoint);
            this.angle.y=this.wallHitAngleReflect();
            
            this.motion.setFromValues(0,0,this.motion.length());
            this.motion.rotate(this.angle);
            
            this.bouncePause=this.BOUNCE_PAUSE_COUNT;
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
            // to be moved up to draw (when need to rotate from
            // center to roll)
                
        this.drawPosition.setFromPoint(this.position);
        this.drawPosition.y+=300;
        
        this.setModelDrawPosition(this.drawPosition,this.drawAngle,this.scale,false);
        return(true);
    }
    
}
