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
    static RESET_HEIGHT=25000;
    static EXPLODE_DAMAGE=30;
    static DAMAGE_DISTANCE=20000;
    static SHAKE_DISTANCE=30000;
    static SHAKE_MAX_SHIFT=40;
    static SHAKE_TICK=2000;
    
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=5000;
        this.height=10000;
        
        this.gravityMinValue=10;
        this.gravityMaxValue=450;
        this.gravityAcceleration=20;
        
        this.filter='ball';
        
        this.positionBackup=new PointClass(0,0,0);
        this.movement=new PointClass(0,0,0);
        this.rollMovement=new PointClass(0,0,0);
        
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
        
        if (!this.movement.isZero()) {
            this.movement.y=this.moveInMapY(this.movement,false);
            this.moveInMapXZ(this.movement,true,true);
            
            this.movement.x*=EntityBeachBallClass.DECELERATION_MULTIPLY;
            this.movement.z*=EntityBeachBallClass.DECELERATION_MULTIPLY;
        }
    }
}
