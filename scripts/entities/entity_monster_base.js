import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';

//
// monster base class
//

export default class EntityMonsterBaseClass extends ProjectEntityClass
{
    static ANGLE_Y_PROJECTILE_RANGE=5;
    static ANGLE_Y_MELEE_RANGE=15;
    static FALL_ASLEEP_DISTANCE=75000;
    static DAMAGE_FLINCH_WAIT_TICK=500;
    
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
    projectileClass=null;
    projectileData=null;
    projectileRequiresSight=true;
    maxTurnSpeed=0;
    forwardAcceleration=0;
    forwardMaxSpeed=0;
    jumpWaitTick=0;
    nextJumpTick=0;
    jumpHeight=0;
    trapMeshName=null;
    trapMeshShrink=null;
    nextDamageTick=0;
    
    lastInLiquid=false;
    
    idleAnimationFrames=null;
    walkAnimationFrames=null;
    meleeAnimationFrames=null;
    projectileAnimationFrames=null;
    hitAnimationFrames=null;
    deathAnimationFrames=null;
    wakeUpSoundName=null;
    meleeSoundName=null;
    deathSoundName=null;
    fallSoundName=null;
    fallSoundWaitCount=0;
    
    movement=null;
    rotMovement=null;
    firePosition=null;
    fireAngle=null;
    fireVector=null;
    fireHitPoint=null;
    trapMeshXBound=null;
    trapMeshZBound=null;
    
    initialize()
    {
        super.initialize();
        
            // base setup
            
        this.bumpHeight=1400;
        
        this.filter='monster';
        
        this.movement=new PointClass(0,0,0);
        this.rotMovement=new PointClass(0,0,0);
        this.firePosition=new PointClass(0,0,0);
        this.fireAngle=new PointClass(0,0,0);
        this.fireVector=new PointClass(0,0,0);
        this.fireHitPoint=new PointClass(0,0,0);
        
        this.trapMeshXBound=new BoundClass(0,0);
        this.trapMeshZBound=new BoundClass(0,0);
    }
    
    ready()
    {
        let meshList,mesh;
        
        super.ready();
        
            // sleeping with all health
            
        this.health=this.startHealth;
        this.awoke=false;
        this.dead=false;
        
            // if there is a trap mesh, get it's bounds
            
        if (this.trapMeshName!==null) {
            meshList=this.getMeshList();
            mesh=meshList.meshes[meshList.find(this.trapMeshName)];
            this.trapMeshXBound.setFromBound(mesh.xBound);
            this.trapMeshZBound.setFromBound(mesh.zBound);
            
            if (this.trapMeshShrink!==null) {
                this.trapMeshXBound.min+=this.trapMeshShrink.x;
                this.trapMeshXBound.max-=this.trapMeshShrink.x;
                this.trapMeshZBound.min+=this.trapMeshShrink.z;
                this.trapMeshZBound.max-=this.trapMeshShrink.z;
            }
        }
            
            // start idle animation
        
        this.startModelAnimationChunkInFrames(null,30,this.idleAnimationFrames[0],this.idleAnimationFrames[1]);
    }
    
    wakeUp()
    {
        let timestamp=this.getTimestamp();
        
        this.awoke=true;
        this.movement.setFromValues(0,0,0);
        
        this.nextProjectileTick=timestamp;
        this.projectileStartTick=-1;
        
        this.nextMeleeTick=timestamp;
        this.meleeStartTick=-1;
        
        this.nextJumpTick=timestamp+this.jumpWaitTick;
        
        this.nextDamageTick=timestamp;
        
        this.playSound(this.wakeUpSoundName,1.0,false);
        this.startModelAnimationChunkInFrames(null,30,this.walkAnimationFrames[0],this.walkAnimationFrames[1]);
    }
    
    sleep()
    {
        this.awoke=false;
        this.projectileStartTick=-1;
        this.meleeStartTick=-1;
        
        this.startModelAnimationChunkInFrames(null,30,this.idleAnimationFrames[0],this.idleAnimationFrames[1]);
    }
    
    damage(fromEntity,damage,hitPoint)
    {
        let timestamp;
        
        if (this.dead) return;
        
        this.health-=damage;
        if (!this.awoke) this.wakeUp();
        
            // just damage
            
        if (this.health>0) {
            timestamp=this.getTimestamp();
            if (timestamp>this.nextDamageTick) {
                this.nextDamageTick=timestamp+EntityMonsterBaseClass.DAMAGE_FLINCH_WAIT_TICK;

                this.playSound(this.wakeUpSoundName,(1.0+(0.5-Math.random())),false);
                this.startModelAnimationChunkInFrames(null,30,this.hitAnimationFrames[0],this.hitAnimationFrames[1]);
                this.queueModelAnimationChunkInFrames(null,30,this.walkAnimationFrames[0],this.walkAnimationFrames[1]);
            }
            return;
        }
        
            // monster is dead
            
        this.dead=true;
        this.passThrough=true;
        this.startModelAnimationChunkInFrames(null,30,this.deathAnimationFrames[0],this.deathAnimationFrames[1]);
        this.queueAnimationStop();
        
        this.playSound(this.deathSoundName,1.0,false);
    }
    
    jump()
    {
        this.gravity=this.gravityMinValue;
        this.movement.y=this.jumpHeight;
        
        this.playSound(this.wakeUpSoundName,1.0,false);
    }
    
    meleeStart(distToPlayer,timestamp)
    {
        let meleeIdx;
        
        if ((distToPlayer>this.meleeDistance) || (timestamp<this.nextMeleeTick)) return;
        
        this.nextMeleeTick=this.getTimestamp()+this.meleeWaitTick;
        
            // melee animation
            
        meleeIdx=Math.random()&0x1;
        this.startModelAnimationChunkInFrames(null,30,this.meleeAnimationFrames[meleeIdx][0],this.meleeAnimationFrames[meleeIdx][1]);
        this.queueModelAnimationChunkInFrames(null,30,this.walkAnimationFrames[0],this.walkAnimationFrames[1]);
        
            // pause to start actual melee
            
        this.meleeStartTick=this.getTimestamp()+this.meleeDamageTick;
    }
    
    meleeHit(player)
    {
        this.playSound(this.meleeSoundName,1.0,false);
        player.damage(this,this.meleeDamage,null);
    }
    
    projectileSetupFire(player)
    {
            // get fire position outside of radius
            // and in middle of monster height
            
        this.firePosition.setFromValues(0,0,(this.radius*2));
        this.firePosition.rotateY(null,this.angle.y);
        this.firePosition.addPoint(this.position);
        this.firePosition.y+=Math.trunc(this.height*0.5);
        
        this.fireAngle.setFromPoint(this.angle);
        this.fireAngle.x=this.position.getLookAngleTo(player.position);
    }
    
    projectileStart(player,distToPlayer,timestamp)
    {
        if ((distToPlayer<this.projectileDistance) || (timestamp<this.nextProjectileTick)) return;
        
            // does it sight the player?
            
        if (this.projectileRequiresSight) {
            this.projectileSetupFire(player);

            this.fireVector.setFromValues(0,0,this.projectileDistance);
            this.fireVector.rotateX(null,this.fireAngle.x);
            this.fireVector.rotateY(null,this.fireAngle.y);

            if (!this.rayCollision(this.firePosition,this.fireVector,this.fireHitPoint,null,null)) return;
            if (this.hitEntity!==player) return;
        }
        
            // we can fire
            
        this.nextProjectileTick=this.getTimestamp()+this.projectileWaitTick;

            // fire animaton
            
        this.startModelAnimationChunkInFrames(null,30,this.projectileAnimationFrames[0],this.projectileAnimationFrames[1]);
        this.queueModelAnimationChunkInFrames(null,30,this.walkAnimationFrames[0],this.walkAnimationFrames[1]);
        
            // pause for fire animation
            
        this.projectileStartTick=this.getTimestamp()+this.projectileFireTick;
    }
    
    projectileFire(player)
    {
        this.projectileSetupFire(player);
        this.addEntityFromEntity(this,this.projectileClass,'monster_projectile',this.firePosition,this.fireAngle,this.projectileData,true,false);
    }
    
    run()
    {
        let timestamp,angleDif;
        let player,distToPlayer,liquidIdx;
        
            // if dead, only fall and play
            // and fall sound
            
        if (this.dead) {
            
            if (this.fallSoundName!==null) {
                if (this.fallSoundWaitCount>0) {
                    this.fallSoundWaitCount--;
                    if (this.fallSoundWaitCount===0) this.playSound(this.fallSoundName,1.0,false);
                }
            }
            
            this.rotMovement.setFromValues(0,0,0);
            this.moveInMapY(this.rotMovement,false);
            return;
        }
        
            // get player and timestamp
            
        timestamp=this.getTimestamp();
        
        player=this.getPlayerEntity();
        distToPlayer=this.position.distance(player.position);
        
            // if we are in a projectile animation,
            // wait to fire
            
        if (this.projectileStartTick!==-1) {
            if (timestamp>this.projectileStartTick) {
                this.projectileStartTick=-1;
                this.projectileFire(player);
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
            // remember how far we had to turn to see if we are
            // facing within a certain distance so we can attack
         
        angleDif=this.turnYTowardsEntity(player,this.maxTurnSpeed);
        
            // time to wake up?
            
        if (!this.awoke) {
            if (distToPlayer<this.wakeUpDistance) {
                this.wakeUp();
            }
            return;
        }
        
            // if we get to far away, go back to sleep
            
        if (distToPlayer>EntityMonsterBaseClass.FALL_ASLEEP_DISTANCE) {
            this.sleep();
            return;
        }
        
            // liquids
            
        liquidIdx=this.getInLiquidIndex();
        
        if (liquidIdx!==-1) {
            if (!this.lastInLiquid) this.playSound('splash',1.0,false);
            this.lastInLiquid=true;
        }
        else {
            if (this.lastInLiquid) this.playSound('splash',0.8,false);
            this.lastInLiquid=false;
        }
        
            // projectiles and melee starts
        
        if ((this.projectileClass!=null) && (Math.abs(angleDif)<=EntityMonsterBaseClass.ANGLE_Y_PROJECTILE_RANGE)) this.projectileStart(player,distToPlayer,timestamp);
        if (Math.abs(angleDif)<=EntityMonsterBaseClass.ANGLE_Y_MELEE_RANGE) this.meleeStart(distToPlayer,timestamp);
        
            // time to jump?
            
        if (this.jumpHeight!==0) {
            if (timestamp>this.nextJumpTick) {
                this.nextJumpTick=timestamp+this.jumpWaitTick;
                this.jump();
            }
        }
        
            // chase player

        this.movement.moveZWithAcceleration(true,false,this.forwardAcceleration,0,this.forwardMaxSpeed,this.forwardAcceleration,0,this.forwardMaxSpeed);        
        this.rotMovement.setFromPoint(this.movement);
        this.rotMovement.rotateY(null,this.angle.y);
        
        this.movement.y=this.moveInMapY(this.rotMovement,false);
        this.moveInMapXZ(this.rotMovement,true,true);
        
            // any bounding?
            
        if (this.trapMeshName!==null) {
            if (this.position.x<this.trapMeshXBound.min) this.position.x=this.trapMeshXBound.min;
            if (this.position.x>this.trapMeshXBound.max) this.position.x=this.trapMeshXBound.max;
            if (this.position.z<this.trapMeshZBound.min) this.position.z=this.trapMeshZBound.min;
            if (this.position.z>this.trapMeshZBound.max) this.position.z=this.trapMeshZBound.max;
        }
    }
}
