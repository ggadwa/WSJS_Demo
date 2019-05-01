import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import MeshClass from '../../../code/mesh/mesh.js';
import ModelClass from '../../../code/model/model.js';
import ImportModelClass from '../../../code/import/import_model.js';

//
// monster base class
//

export default class EntityMonsterBaseClass extends ProjectEntityClass
{
    static MAX_TURN_SPEED=5;
    static FORWARD_ACCELERATION=10;
    static FORWARD_DECELERATION=20;
    static FORWARD_MAX_SPEED=150;
    static SIDE_ACCELERATION=25;
    static SIDE_DECELERATION=50;
    static SIDE_MAX_SPEED=150;
    
    health=0;
    startHealth=0;
    dead=false;
    deathAnimationFrameStart=0;
    deathAnimationFrameEnd=0;
    deathSoundName=null;
    
    initialize()
    {
        super.initialize();
        
            // base setup
            
        this.filter='monster';
    }
    
    ready()
    {
        super.ready();
        
        this.health=this.startHealth;
        this.dead=false;
    }
    
    damage(fromEntity,damage)
    {
        if (this.dead) return;
        
        this.health-=damage;
        console.info(this.health);
        if (this.health>0) return;
        
        this.dead=true;
        this.passThrough=true;
        this.startModelAnimationChunkInFrames(null,30,this.deathAnimationFrameStart,this.deathAnimationFrameEnd);
        this.queueAnimationStop();
        
        //this.playSound(this.deathSoundName);
    }
    
    run()
    {
        if (this.dead) return;
        
        this.turnYTowardsEntity(this.getPlayerEntity(),EntityMonsterBaseClass.MAX_TURN_SPEED);
    }
    
    /*
        let moveMode,moveForward,slideLeft;
        
        if (this.nextNodeIdx===-1) return;
        
            // have we hit goal node?
            
        moveMode=this.getStandingOnFloorMoveMode();
            
        if (this.hitPathNode(this.goalNodeIdx,3000)) {
            this.lastGoalNodeIdx=this.goalNodeIdx;
            this.lastNextNodeIdx=this.goalNodeIdx;
            this.goalNodeIdx=this.getRandomKeyNodeIndex();
            this.nextNodeIdx=this.nextNodeInPath(this.lastGoalNodeIdx,this.goalNodeIdx);
            
            this.platformPause=(moveMode!==MeshClass.MOVE_NONE);
        }
        
            // have we hit the next node?
            
        if (this.hitPathNode(this.nextNodeIdx,3000)) {
            this.lastNextNodeIdx=this.nextNodeIdx;
            this.nextNodeIdx=this.nextNodeInPath(this.nextNodeIdx,this.goalNodeIdx);
            
            this.platformPause=(moveMode!==MeshClass.MOVE_NONE);
        }
        
            // if we are touching an entity, try to slide out
            // of the way
            
        slideLeft=false;
        
        if (this.touchEntity!==null) {
            slideLeft=true;
        }
        
            // pausing for platforms

        moveForward=true;
        
        
            // turn towards the node
        
        this.turnTowardsNode(this.nextNodeIdx,EntityMonsterBaseClass.MAX_TURN_SPEED);
        
            // move
            
        this.movement.moveZWithAcceleration(moveForward,false,EntityMonsterBaseClass.FORWARD_ACCELERATION,EntityMonsterBaseClass.FORWARD_DECELERATION,EntityMonsterBaseClass.FORWARD_MAX_SPEED);        
        this.movement.moveXWithAcceleration(slideLeft,false,EntityMonsterBaseClass.SIDE_ACCELERATION,EntityMonsterBaseClass.SIDE_DECELERATION,EntityMonsterBaseClass.SIDE_MAX_SPEED);

        this.rotMovement.setFromPoint(this.movement);
        this.rotMovement.rotateY(null,this.angle.y);
        
        this.movement.y=this.moveInMapY(this.rotMovement,false);
        this.moveInMapXZ(this.rotMovement,true,true);
    }
    */
}
