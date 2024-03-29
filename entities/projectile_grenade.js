import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';

export default class EntityGrenadeClass extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
        
        this.modelName='grenade';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(100,100,100);
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
        this.canBeClimbed=true;

            // variables
        
        this.lifeTimestamp=0;
        this.rolling=false;
        this.stopped=false;
        
        this.bounceSound=new SoundDefClass('grenade_bounce',1.0,0.1,50000,0,0,false);
        this.reflectSound=new SoundDefClass('grenade_bounce',1.2,0.1,50000,0,0,false);
        
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
        
        this.lifeTimestamp=this.getTimestamp()+4000;
        
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
 
        if (this.getTimestamp()>this.lifeTimestamp) {
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
            this.floorBounce(this.motion,0.8);
            
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
        this.drawPosition.y+=Math.trunc(this.height*0.5);
        
        this.setModelDrawAttributes(this.drawPosition,this.drawAngle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}

