import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';

export default class ProjectileVampireClass extends EntityClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.lifeTimestamp=0;
        this.nextTrailTick=0;
        
        this.spawnSound={"name":"laser","rate":1.0,"randomRateAdd":0.0,"distance":50000,"loopStart":0,"loopEnd":0,"loop":false};
        
            // pre-allocations

        this.motion=new PointClass(0,0,0);
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
            
        this.addEffect(this.spawnedBy,'hit',this.position,null,true);
    }
        
    run()
    {
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

