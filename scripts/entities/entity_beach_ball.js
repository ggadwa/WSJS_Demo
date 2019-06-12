import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EffectExplosionFireClass from '../effects/effect_explosion_fire.js';
import EffectExplosionSmokeClass from '../effects/effect_explosion_smoke.js';

//
// beach ball class
//

export default class EntityBeachBallClass extends ProjectEntityClass
{
    static TOUCH_SPEED=100;
    static ROLL_SPEED=100;
    static DECELERATION_MULTIPLY=0.99;
    static BOUNCE_FACTOR=0.8;
    static BOUNCE_CUT=150;
    static ROLL_ANGLE_ADD=1;
    static RESET_HEIGHT=100000;
    static EXPLODE_DAMAGE=30;
    static DAMAGE_DISTANCE=20000;
    static SHAKE_DISTANCE=30000;
    static SHAKE_MAX_SHIFT=40;
    static SHAKE_TICK=2000;
    
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=4500;
        this.height=10000;
        
        this.gravityMinValue=10;
        this.gravityMaxValue=900;
        this.gravityAcceleration=20;
        
        this.filter='ball';
        
        this.positionBackup=new PointClass(0,0,0);
        this.movement=new PointClass(0,0,0);
        this.rollMovement=new PointClass(0,0,0);
        this.savePoint=new PointClass(0,0,0);
        
        this.drawPosition=new PointClass(0,0,0);
        this.drawAngle=new PointClass(0,0,0);
        
            // model
            
        this.setModel({"name":"beach_ball"});
        this.scale.setFromValues(5000,5000,5000);
        
            // explosion effect
        
        this.explosionSmokeEffect=this.addEffect(EffectExplosionSmokeClass,null,false);
        this.explosionFireEffect=this.addEffect(EffectExplosionFireClass,null,false);
    }
    
    ready()
    {
        this.positionBackup.setFromPoint(this.position);
        this.movement.setFromValues(0,0,0);
    }
    
    damage(fromEntity,damage,hitPoint)
    {
            // explosion effects
            
        this.explosionSmokeEffect.restart(this.position,true);
        this.explosionFireEffect.restart(this.position,true);
        
            // damage entities in a radius
            // we hide this before calling it since damage
            // ends up re-exploding this and overflowing the stack
         
        this.show=false;
        this.damageEntityForRadius(this.parentEntity,this.position,EntityBeachBallClass.DAMAGE_DISTANCE,EntityBeachBallClass.DAMAGE);
        
            // shake the screen
            
        this.shakeCamera(this.position,EntityBeachBallClass.SHAKE_DISTANCE,EntityBeachBallClass.SHAKE_TICK,EntityBeachBallClass.SHAKE_MAX_SHIFT);
        
            // reset ball
         
        this.show=true;
        
        this.position.setFromPoint(this.positionBackup);
        this.position.y+=EntityBeachBallClass.RESET_HEIGHT;
        
        this.movement.setFromValues(0,0,0);
    }
    
    run()
    {
        let mesh,trig,lowVertex;
        
            // movement by touch
            
        if (this.touchEntity!==null) {
            this.movement.setFromSubPoint(this.position,this.touchEntity.position);
            this.movement.normalize();
            this.movement.scale(EntityBeachBallClass.TOUCH_SPEED);
        }
        
            // movement by land
        /*    
        if (this.standOnMeshIdx!==-1) {
            mesh=this.core.map.meshList.meshes[this.standOnMeshIdx];
            trig=mesh.collisionFloorTrigs[this.standOnTrigIdx];
            
            if ((trig.v0.y<trig.v1.y) && (trig.v0.y<trig.v2.y)) {
                lowVertex=trig.v0;
            }
            else {
                lowVertex=(trig.v1.y<trig.v2.y)?trig.v1:trig.v2;
            }
            
            if ((lowVertex.y-this.position.y)<=-50) {
                this.rollMovement.setFromSubPoint(lowVertex,this.position);
                this.rollMovement.normalize();
                this.rollMovement.scale(EntityBeachBallClass.ROLL_SPEED);
                this.movement.addPoint(this.rollMovement);
            }
        }
        */
            // moving
            
        this.savePoint.setFromPoint(this.position);
        
        this.moveInMapXZ(this.movement,false,false);
        this.movement.y=this.moveInMapY(this.movement,false);
        
        if (this.standOnMeshIdx!==-1) {
            this.movement.x*=EntityBeachBallClass.DECELERATION_MULTIPLY;
            this.movement.z*=EntityBeachBallClass.DECELERATION_MULTIPLY;
        }
        
            // hitting floor

        if ((this.standOnMeshIdx!==-1) && (this.position.y<this.savePoint.y)) {
            //this.playSound('grenade_bounce');
            
            this.position.setFromPoint(this.savePoint);
            this.movement.y=this.floorHitBounceY(this.movement.y,EntityBeachBallClass.BOUNCE_FACTOR,EntityBeachBallClass.BOUNCE_CUT);
            
            if (this.movement.y!==0) this.movement.y=this.moveInMapY(this.movement,false);
            
            //if (this.movement.y===0) this.rolling=true;
            return;
        }

            // hitting wall
/*
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
   
 */

    }
    
    drawSetup()
    {
            // rolling
            
        if ((this.movement.x!==0) || (this.movement.z!==0)) {
            this.rollMovement.setFromValues(this.movement.x,0,this.movement.z);
            this.rollMovement.normalize();
            this.rollMovement.scale(EntityBeachBallClass.ROLL_ANGLE_ADD);
            
            this.drawAngle.addPoint(this.rollMovement);
            if (this.drawAngle.x<0) this.drawAngle.x=360-this.drawAngle.x;
            if (this.drawAngle.x>=360) this.drawAngle.x-=360;
            if (this.drawAngle.z<0) this.drawAngle.z=360-this.drawAngle.z;
            if (this.drawAngle.z>=360) this.drawAngle.z-=360;
        }
        
            // model has root in center (so we can rotate to roll)
            
        this.drawPosition.setFromPoint(this.position);
        this.drawPosition.y+=Math.trunc(this.height*0.5);

        this.setModelDrawPosition(this.drawPosition,this.drawAngle,this.scale,false);
        return(true);
    }
}
