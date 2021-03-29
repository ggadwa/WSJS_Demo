import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';

export default class EntityProjectileClass extends EntityClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.lifeTimestamp=0;
        this.canBeClimbed=true;
        this.rolling=false;
        this.stopped=false;
        
        this.bounceSound={"name":"grenade_bounce","rate":1.0,"randomRateAdd":0.1,"distance":50000,"loopStart":0,"loopEnd":0,"loop":false};
        this.reflectSound={"name":"grenade_bounce","rate":1.2,"randomRateAdd":0.1,"distance":50000,"loopStart":0,"loopEnd":0,"loop":false};
        
            // pre-allocations

        this.motion=new PointClass(0,0,0);
        this.savePoint=new PointClass(0,0,0);
        this.drawPosition=new PointClass(0,0,0);
        this.drawAngle=new PointClass(0,0,0);
        
        Object.seal(this);
    }
    
    ready()
    {
        super.ready();
        
        this.lifeTimestamp=this.core.game.timestamp+4000;
        
        this.rolling=false;
        this.stopped=false;
        
        this.motion.setFromValues(0,0,450);
        this.motion.rotate(this.angle);
    }
    
    finish()
    {
            // remove it
            
        this.markDelete=true;
        
            // explosion
            
        this.addEffect(this.spawnedBy,'explosion',this.position,null,true);
    }
        
    run()
    {
        super.run();
        
            // are we over our life time
 
        if (this.core.game.timestamp>this.lifeTimestamp) {
            this.finish();
            return;
        }
        
            // rolling slows down grenade
            
        if ((this.rolling) && (!this.stopped)) {
            this.motion.x*=0.95;
            this.motion.z*=0.95;
            
            if ((Math.abs(this.motion.x)+Math.abs(this.motion.z))<1) {
                this.motion.x=0;
                this.motion.z=0;
                this.stopped=true;
            }
        }
        
            // move grenade
            
        this.savePoint.setFromPoint(this.position);
        
        if (!this.stopped) this.moveInMapXZ(this.motion,false,false);
        this.motion.y=this.moveInMapY(this.motion,1.0,false);
        
            // hitting floor
            // we can either start rolling, stop, or finish

        if ((this.standOnMeshIdx!==-1) && (!this.rolling)) {
            if ((!this.stopped) && (this.bounceSound!==null)) this.playSound(this.bounceSound);
            
            this.position.setFromPoint(this.savePoint);
            this.floorBounce(this.motion);
            
            if (this.motion.y===0) this.rolling=true;
            
            return;
        }
        
            // hitting ceiling
            
        if (this.collideCeilingMeshIdx!==-1) {
            this.playSound(this.bounceSound);

            this.position.setFromPoint(this.savePoint);
            this.motion.y=0;
        }

            // hitting wall

        if (this.collideWallMeshIdx!==-1) {
            if (this.stopped) return;
            
            this.playSound(this.reflectSound);
            
            this.position.setFromPoint(this.savePoint);
            
            this.wallReflect(this.motion);
            this.motion.scaleXZ(0.8);
            this.motion.trunc();

            if ((Math.abs(this.motion.x)+Math.abs(this.motion.z))<1) {
                this.motion.x=0;
                this.motion.z=0;
                this.stopped=true;
            }
            
            return;
        }
        
            // touching object
            
        if (this.touchEntity!==null) {
            if (this.touchEntity.passThrough) return;            
            if (this.stopped) return;
            
            this.playSound(this.reflectSound);

            this.position.setFromPoint(this.savePoint);

            this.motion.scaleXZ(-0.8);   // always go directly back
            this.motion.trunc();

            if ((Math.abs(this.motion.x)+Math.abs(this.motion.z))<1) {
                this.motion.x=0;
                this.motion.z=0;
                this.stopped=true;
            }

            return;
        }
    }
    
    drawSetup()
    {
            // tumble spin

        if (!this.stopped) {
            if (!this.rolling) {
                this.drawAngle.x=this.core.game.getPeriodicLinear(4000,360);
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
                this.drawAngle.z=this.core.game.getPeriodicLinear(4000,360);
            }

            this.drawAngle.y=this.core.game.getPeriodicLinear(3000,360);
        }

            // model is centered on Y so it needs
            // to be moved up to draw (when need to rotate from
            // center to roll)

        this.drawPosition.setFromPoint(this.position);
        this.drawPosition.y+=Math.trunc(this.height*0.5);
        
        this.setModelDrawAttributes(this.drawPosition,this.drawAngle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}

