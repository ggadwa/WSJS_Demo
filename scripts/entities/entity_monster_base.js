import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import MeshClass from '../../../code/mesh/mesh.js';
import ModelClass from '../../../code/model/model.js';

//
// monster base class
//

export default class EntityMonsterBaseClass extends ProjectEntityClass
{
    static ANGLE_Y_FIRE_RANGE=5;
    
    health=0;
    startHealth=0;
    awoke=false;
    dead=false;
    wakeUpDistance=0;
    meleeDistance=0;
    meleeWaitTick=0;
    meleeDamageTick=0;
    nextMeleeTick=0;
    meleeDamage=0;
    meleeStartTick=-1;
    projectileDistance=0;
    projectileWaitTick=0;
    projectileFireTick=0;
    nextProjectileTick=0;
    projectileStartTick=-1;
    projectile=null;
    maxTurnSpeed=0;
    forwardAcceleration=0;
    forwardMaxSpeed=0;
    
    idleAnimationFrames=null;
    walkAnimationFrames=null;
    meleeAnimationFrames=null;
    projectileAnimationFrames=null;
    hitAnimationFrames=null;
    deathAnimationFrames=null;
    wakeUpSoundName=null;
    meleeSoundName=null;
    deathSoundName=null;
    
    movement=null;
    rotMovement=null;
    firePosition=null;
    
    initialize()
    {
        super.initialize();
        
            // base setup
            
        this.bumpHeight=1400;
        
        this.filter='monster';
        
        this.movement=new PointClass(0,0,0);
        this.rotMovement=new PointClass(0,0,0);
        this.firePosition=new PointClass(0,0,0);
    }
    
    ready()
    {
        super.ready();
        
        this.health=this.startHealth;
        this.awoke=false;
        this.dead=false;
        
        this.startModelAnimationChunkInFrames(null,30,this.idleAnimationFrames[0],this.idleAnimationFrames[1]);
    }
    
    wakeUp()
    {
        this.awoke=true;
        this.movement.setFromValues(0,0,0);
        
        this.nextProjectileTick=this.getTimestamp();
        this.projectileStartTick=-1;
        
        this.nextMeleeTick=this.getTimestamp();
        this.meleeStartTick=-1;
        
        this.playSound(this.wakeUpSoundName);
        this.startModelAnimationChunkInFrames(null,30,this.walkAnimationFrames[0],this.walkAnimationFrames[1]);
    }
    
    damage(fromEntity,damage)
    {
        if (this.dead) return;
        
        this.health-=damage;
        if (!this.awoke) this.wakeUp();
        
            // just damage
            
        if (this.health>0) {
            this.playSound(this.wakeUpSoundName);
            this.startModelAnimationChunkInFrames(null,30,this.hitAnimationFrames[0],this.hitAnimationFrames[1]);
            this.queueModelAnimationChunkInFrames(null,30,this.walkAnimationFrames[0],this.walkAnimationFrames[1]);
            return;
        }
        
            // monster is dead
            
        this.dead=true;
        this.passThrough=true;
        this.startModelAnimationChunkInFrames(null,30,this.deathAnimationFrames[0],this.deathAnimationFrames[1]);
        this.queueAnimationStop();
        
        this.playSound(this.deathSoundName);
    }
    
    meleeStart()
    {
        let meleeIdx=Math.random()&0x1;
        
        this.startModelAnimationChunkInFrames(null,30,this.meleeAnimationFrames[meleeIdx][0],this.meleeAnimationFrames[meleeIdx][1]);
        this.queueModelAnimationChunkInFrames(null,30,this.walkAnimationFrames[0],this.walkAnimationFrames[1]);
        
        this.meleeStartTick=this.getTimestamp()+this.meleeDamageTick;
    }
    
    meleeHit(player)
    {
        this.playSound(this.meleeSoundName);
        player.damage(this,this.meleeDamage);
    }
    
    projectileStart()
    {
        this.startModelAnimationChunkInFrames(null,30,this.projectileAnimationFrames[0],this.projectileAnimationFrames[1]);
        this.queueModelAnimationChunkInFrames(null,30,this.walkAnimationFrames[0],this.walkAnimationFrames[1]);
        
        this.projectileStartTick=this.getTimestamp()+this.projectileFireTick;
    }
    
    projectileFire()
    {
            // get fire position outside of radius
            // and in middle of monster height
            
        this.firePosition.setFromValues(0,0,(this.radius*1.5));
        this.firePosition.rotateY(null,this.angle.y);
        this.firePosition.addPoint(this.position);
        this.firePosition.y+=Math.trunc(this.height*0.5);
        
        this.projectile.fire(this,this.firePosition,this.angle);
    }
    
    run()
    {
        let timestamp,angleDif,attackOK;
        let player,distToPlayer;
        
        if (this.dead) return;
        
            // get player and timestamp
            
        timestamp=this.getTimestamp();
        
        player=this.getPlayerEntity();
        distToPlayer=this.position.distance(player.position);
        
            // if we are in a projectile animation,
            // wait to fire
            
        if (this.projectileStartTick!==-1) {
            if (timestamp>this.projectileStartTick) {
                this.projectileStartTick=-1;
                this.projectileFire();
            }
        }
        
            // if we are in a melee animation,
            // wait for damage
            
        if (this.meleeStartTick!==-1) {
            if (timestamp>this.meleeStartTick) {
                this.meleeStartTick=-1;
                if (distToPlayer<this.meleeDistance) this.meleeHit(player);
            }
        }
        
            // always turn towards player, even when idling
            // check how far we had to turn to see if we are
            // facing within a certain distance so we can attack
         
        angleDif=this.turnYTowardsEntity(player,this.maxTurnSpeed);
        
        attackOK=(Math.abs(angleDif)<=EntityMonsterBaseClass.ANGLE_Y_FIRE_RANGE);
        
            // time to wake up?
            
        if (!this.awoke) {
            if (distToPlayer<this.wakeUpDistance) {
                this.wakeUp();
            }
            return;
        }
        
            // do we need to fire a projectile?
        
        if ((this.projectile!=null) && (attackOK)) {
            if ((distToPlayer>=this.projectileDistance) && (timestamp>this.nextProjectileTick)) {
                this.nextProjectileTick=this.getTimestamp()+this.projectileWaitTick;
                this.projectileStart();
            }
        }
        
            // do we need melee
            
        if ((distToPlayer<=this.meleeDistance) && (timestamp>this.nextMeleeTick)) {    
            this.nextMeleeTick=this.getTimestamp()+this.meleeWaitTick;
            this.meleeStart();
        }
        
            // chase player

        this.movement.moveZWithAcceleration(true,false,this.forwardAcceleration,0,this.forwardMaxSpeed);        
        this.rotMovement.setFromPoint(this.movement);
        this.rotMovement.rotateY(null,this.angle.y);
        
        this.movement.y=this.moveInMapY(this.rotMovement,false);
        this.moveInMapXZ(this.rotMovement,true,true);
    }
}
