import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EffectExplosionFireClass from '../effects/effect_explosion_fire.js';
import EffectExplosionSmokeClass from '../effects/effect_explosion_smoke.js';

//
// beach ball class
//

export default class EntityBeachBallClass extends ProjectEntityClass
{
    static TOUCH_ADD_SPEED=10;
    static ROLL_ADD_SPEED=5;
    static MAX_SPEED=2000;
    static DECELERATION_MULTIPLY=0.99;
    static BOUNCE_FACTOR=0.8;
    static BOUNCE_CUT=150;
    static BOUNCE_PAUSE_COUNT=5;
    static ROLL_ANGLE_ADD=2;
    static MAX_ROLL_Y_CHANGE=250;
    static RESET_HEIGHT=100000;
    static EXPLODE_DAMAGE=30;
    static DAMAGE_DISTANCE=20000;
    static SHAKE_DISTANCE=30000;
    static SHAKE_MAX_SHIFT=40;
    static SHAKE_TICK=2000;
    
    positionBackup=null;
    motion=null;
    rollMotion=null;
    pushMotion=null;
    tempPoint=null;
    savePoint=null;
    drawPosition=null;
    drawAngle=null;
    bouncePause=0;
    
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
        this.motion=new PointClass(0,0,0);
        this.rollMotion=new PointClass(0,0,0);
        this.pushMotion=new PointClass(0,0,0);
        this.tempPoint=new PointClass(0,0,0);
        this.savePoint=new PointClass(0,0,0);
        
        this.drawPosition=new PointClass(0,0,0);
        this.drawAngle=new PointClass(0,0,0);
        
        this.bouncePause=0;
        
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
        
        this.motion.setFromValues(0,0,0);
        this.rollMotion.setFromValues(0,0,0);
        
        this.bouncePause=0;
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
        this.damageEntityForRadius(this.parentEntity,this.position,EntityBeachBallClass.DAMAGE_DISTANCE,EntityBeachBallClass.EXPLODE_DAMAGE);
        
            // shake the screen
            
        this.shakeCamera(this.position,EntityBeachBallClass.SHAKE_DISTANCE,EntityBeachBallClass.SHAKE_TICK,EntityBeachBallClass.SHAKE_MAX_SHIFT);
        
            // reset ball
         
        this.show=true;
        
        this.position.setFromPoint(this.positionBackup);
        this.position.y+=EntityBeachBallClass.RESET_HEIGHT;
        
        this.motion.setFromValues(0,0,0);
    }
    
    entityPush(entity,movePnt)
    {
        let passThrough;
        
            // get the movement to the center point of this
            // pushed entity
            
        this.pushMotion.setFromSubPoint(this.position,this.touchEntity.position);
        this.pushMotion.normalize();
        this.pushMotion.scale(movePnt.length());
        
            // average it with the push
            
        this.pushMotion.average(movePnt);
        
            // move this, but hide the pushing entity first
            // so we don't doubly collide with it
            
        passThrough=entity.passThrough;
        
        entity.passThrough=true;
        this.moveInMapXZ(this.pushMotion,false,false);
        
        entity.passThrough=passThrough;
        
        this.rollMotion.addPoint(this.pushMotion);
            
        return(true);
    }
    
    run()
    {
        let mesh,trig,lowVertex;
        
            // add to movement if rolling across
            // a triangle

        if (this.standOnMeshIdx!==-1) {
            mesh=this.core.map.meshList.meshes[this.standOnMeshIdx];
            trig=mesh.collisionFloorTrigs[this.standOnTrigIdx];
            
            if ((trig.v0.y<trig.v1.y) && (trig.v0.y<trig.v2.y)) {
                lowVertex=trig.v0;
            }
            else {
                lowVertex=(trig.v1.y<trig.v2.y)?trig.v1:trig.v2;
            }
            
            if ((lowVertex.y-this.position.y)<=-EntityBeachBallClass.MAX_ROLL_Y_CHANGE) {
                this.tempPoint.setFromSubPoint(lowVertex,this.position);
                this.tempPoint.normalize();
                this.tempPoint.scale(EntityBeachBallClass.ROLL_ADD_SPEED);
                
                this.motion.addPoint(this.tempPoint);
            }
        }

            // clamp speed
            
        this.tempPoint.setFromValues(this.motion.x,0,this.motion.z);
        
        if (this.tempPoint.length()>EntityBeachBallClass.MAX_SPEED) {
            this.tempPoint.normalize();
            this.tempPoint.scale(EntityBeachBallClass.MAX_SPEED);
            
            this.motion.x=this.tempPoint.x;
            this.motion.z=this.tempPoint.z;
        }

            // moving
            
        this.savePoint.setFromPoint(this.position);
        
        this.moveInMapXZ(this.motion,false,false);
        this.motion.y=this.moveInMapY(this.motion,false);
        
            // add any change into roll motion
            
        this.tempPoint.setFromSubPoint(this.position,this.savePoint);
        this.rollMotion.addPoint(this.tempPoint);
        
            // slow down
            
        if (this.standOnMeshIdx!==-1) {
            this.motion.x*=EntityBeachBallClass.DECELERATION_MULTIPLY;
            this.motion.z*=EntityBeachBallClass.DECELERATION_MULTIPLY;
        }
        
            // hitting floor

        if ((this.standOnMeshIdx!==-1) && (this.position.y<this.savePoint.y)) {
            //this.playSound('grenade_bounce',1.0,false);
            
            this.position.y=this.savePoint.y;
            this.motion.y=this.floorHitBounceY(this.motion.y,EntityBeachBallClass.BOUNCE_FACTOR,EntityBeachBallClass.BOUNCE_CUT);
            
            if (this.motion.y!==0) this.motion.y=this.moveInMapY(this.motion,false);
            return;
        }

            // hitting wall

        if ((this.collideWallMeshIdx!==-1) && (this.bouncePause===0)) {
            this.playSound('grenade_bounce',1.0,false);
            
            this.position.setFromPoint(this.savePoint);
            this.angle.y=this.wallHitAngleReflect();
            
            this.motion.setFromValues(0,0,this.motion.length());
            this.motion.rotate(this.angle);
            
            this.bouncePause=EntityBeachBallClass.BOUNCE_PAUSE_COUNT;
            return;
        }
        
        if (this.bouncePause!==0) this.bouncePause--;
   
    }
    
    drawSetup()
    {
            // rolling
            
        if ((this.rollMotion.x!==0) || (this.rollMotion.z!==0)) {
            this.tempPoint.setFromValues(this.rollMotion.z,0,this.rollMotion.x);     // turn on opposite axis
            this.tempPoint.normalize();
            this.tempPoint.scale(EntityBeachBallClass.ROLL_ANGLE_ADD);
            
            this.drawAngle.subPoint(this.tempPoint);
            if (this.drawAngle.x<0) this.drawAngle.x=360-this.drawAngle.x;
            if (this.drawAngle.x>=360) this.drawAngle.x-=360;
            if (this.drawAngle.z<0) this.drawAngle.z=360-this.drawAngle.z;
            if (this.drawAngle.z>=360) this.drawAngle.z-=360;
            
            this.rollMotion.setFromValues(0,0,0);
        }
        
            // model has root in center (so we can rotate to roll)
            
        this.drawPosition.setFromPoint(this.position);
        this.drawPosition.y+=Math.trunc(this.height*0.5);

        this.setModelDrawPosition(this.drawPosition,this.drawAngle,this.scale,false);
        return(true);
    }
}
