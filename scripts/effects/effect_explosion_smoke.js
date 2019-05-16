import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// explosion smoke effect class
//

export default class EffectExplosionSmokeClass extends ProjectEffectClass
{
    static SMOKE_LIFE_TICK=3000;
    static SMOKE_FADE_TICK=700;
    
    static SMOKE_PARTICLE_COUNT=60;
    
    static SMOKE_SPREAD=20000;
    static SMOKE_START_HALF_SIZE=100;
    static SMOKE_ADD_HALF_SIZE=10000;
    
    startTimestamp=0;
    xBound=null;
    yBound=null;
    zBound=null;
    smokeBitmap=null;
    whiteColor=null;
    smokeMotions=null;
            
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.startTimestamp=0;

        this.xBound=new BoundClass(0,0);
        this.yBound=new BoundClass(0,0);
        this.zBound=new BoundClass(0,0);
        
        this.whiteColor=new ColorClass(1.0,1.0,1.0);
        
            // add a bitmap for this effect
            
        this.smokeBitmap=this.addBitmap('textures/particle_smoke.png');
        
            // setup the drawing
            
        this.drawInitialize((EffectExplosionSmokeClass.SMOKE_PARTICLE_COUNT*4),(EffectExplosionSmokeClass.SMOKE_PARTICLE_COUNT*6));
        
            // random moves
            
        this.smokeMotions=this.createRandomMotionArray(EffectExplosionSmokeClass.SMOKE_PARTICLE_COUNT,EffectExplosionSmokeClass.SMOKE_SPREAD,EffectExplosionSmokeClass.SMOKE_SPREAD,EffectExplosionSmokeClass.SMOKE_SPREAD);
        
        return(true);
    }
    
    release()
    {
        this.drawRelease();
    }
    
    restart(position,show)
    {
        super.restart(position,show);
        
        this.startTimestamp=this.getTimestamp();
    }

    drawSetup()
    {
        let tick,factor,halfSize;
        
            // checking for stop

        tick=this.getTimestamp()-this.startTimestamp;
        if (tick>EffectExplosionSmokeClass.SMOKE_LIFE_TICK) {
            this.startTimestamp=0;
            this.show=false;
            return;
        }
        
            // explosion factor
            
        factor=tick/EffectExplosionSmokeClass.SMOKE_LIFE_TICK;
        
            // explosion size

        halfSize=EffectExplosionSmokeClass.SMOKE_START_HALF_SIZE+Math.trunc(EffectExplosionSmokeClass.SMOKE_ADD_HALF_SIZE*factor);
            
        this.xBound.setFromValues((this.position.x-halfSize),(this.position.x+halfSize));
        this.yBound.setFromValues((this.position.y-halfSize),(this.position.y+halfSize));
        this.zBound.setFromValues((this.position.z-halfSize),(this.position.z+halfSize));

        return(this.boundBoxInFrustum(this.xBound,this.yBound,this.zBound));
    }
    
    draw()
    {
        let tick,factor,halfSize,alpha;
       
            // smoke setup
            
        tick=this.getTimestamp()-this.startTimestamp;
        factor=tick/EffectExplosionSmokeClass.SMOKE_LIFE_TICK;
        
        halfSize=EffectExplosionSmokeClass.SMOKE_START_HALF_SIZE+Math.trunc(EffectExplosionSmokeClass.SMOKE_ADD_HALF_SIZE*factor);
        
        alpha=1.0;
        if (tick>(EffectExplosionSmokeClass.SMOKE_LIFE_TICK-EffectExplosionSmokeClass.SMOKE_FADE_TICK)) alpha=1.0-((tick-(EffectExplosionSmokeClass.SMOKE_LIFE_TICK-EffectExplosionSmokeClass.SMOKE_FADE_TICK))/EffectExplosionSmokeClass.SMOKE_FADE_TICK);

            // the particles
            
        this.drawStart();
        this.drawAddBillboardQuadFromMotion(this.smokeBitmap,this.smokeMotions,factor,this.position,0,0,0.5,0.5,halfSize,halfSize,0,ProjectEffectClass.DRAW_MODE_TRANSPARENT,this.whiteColor,alpha);
        this.drawEnd();
    }
}
