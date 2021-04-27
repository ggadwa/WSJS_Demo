import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';

export default class ProjectileQueenClass extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
        
        this.modelName='crystal_ball';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(20,20,20);
        this.radius=500;
        this.height=500;
        this.eyeOffset=0;
        this.weight=30;
        this.modelHideMeshes=[];
        
            // physics
            
        this.maxBumpCount=0;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=24;
        this.collisionHeightSegmentCount=4;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;

            // variables
            
        this.lifeTimestamp=0;
        this.nextTrailTick=0;
        
        this.spawnSound={"name":"laser","rate":1.0,"randomRateAdd":0.0,"distance":50000,"loopStart":0,"loopEnd":0,"loop":false};
        
            // pre-allocations

        this.motion=new PointClass(0,0,0);
        this.trackMotion=new PointClass(0,0,0);
        this.drawAngle=new PointClass(0,0,0);
        
        Object.seal(this);
    }
    
    ready()
    {
        super.ready();
        
        this.lifeTimestamp=this.core.game.timestamp+4000;
        this.nextTrailTick=this.core.game.timestamp;
        
        this.motion.setFromValues(0,0,300);
        this.motion.rotate(this.angle);
        
        this.playSound(this.spawnSound);
    }
    
    finish()
    {
            // remove it
            
        this.markDelete=true;
        
            // contact damage
            
        if (this.touchEntity!==null) {
            this.touchEntity.damage(this.spawnedBy,20,this.position);
        }
        
            // any effect
            
        this.addEffect(this.spawnedBy,'explosion',this.position,null,true);
    }
        
    run()
    {
        let player;
        
        super.run();
        
            // are we over our life time
 
        if (this.core.game.timestamp>this.lifeTimestamp) {
            this.finish();
            return;
        }
        
            // trails

        if (this.core.game.timestamp>=this.nextTrailTick) {
            this.nextTrailTick+=40;
            this.addEffect(this,'sparkle',this.position,null,true);
        }
        
            // track player
            
        player=this.getPlayer();
        this.trackMotion.x=player.position.x-this.position.x;
        this.trackMotion.y=(player.position.y+(player.height*0.5))-this.position.y;
        this.trackMotion.z=player.position.z-this.position.z;
        this.trackMotion.normalize();
        this.trackMotion.scale(15.0);
        
        this.motion.addPoint(this.trackMotion);
        
            // move sparkle
            
        this.moveInMapXZ(this.motion,false,false);
        this.moveInMapY(this.motion,1.0,true);
        
            // any collisions stop sparkle

        if ((this.standOnMeshIdx!==-1) || (this.collideCeilingMeshIdx!==-1) || (this.collideWallMeshIdx!==-1)) {
            this.finish();
            return;
        }
        
            // touching object
            
        if (this.touchEntity!==null) {
            if (!this.touchEntity.passThrough) this.finish();
        }
    }
    
    drawSetup()
    {
        this.drawAngle.setFromValues(this.angle.x,this.core.game.getPeriodicLinear(1000,360),this.angle.z);
        
        this.setModelDrawAttributes(this.position,this.drawAngle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}

