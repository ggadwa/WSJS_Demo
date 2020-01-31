import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// explosion smoke effect class
//

export default class EffectExplosionSmokeClass extends ProjectEffectClass
{
    
    initialize()
    {
        super.initialize();
        
        this.SMOKE_LIFE_TICK=3000;
        this.SMOKE_FADE_TICK=700;
    
        this.SMOKE_PARTICLE_COUNT=60;
    
        this.SMOKE_SPREAD=20000;
        this.SMOKE_START_HALF_SIZE=100;
        this.SMOKE_ADD_HALF_SIZE=10000;
        
            // setup
            
        this.startTimestamp=this.getTimestamp();

        this.xBound=new BoundClass(0,0);
        this.yBound=new BoundClass(0,0);
        this.zBound=new BoundClass(0,0);
        
        this.whiteColor=new ColorClass(1.0,1.0,1.0);
        
            // setup the drawing
            
        this.drawInitialize((this.SMOKE_PARTICLE_COUNT*4),(this.SMOKE_PARTICLE_COUNT*6));
        
            // random moves
            
        this.smokeMotions=this.createRandomMotionArray(this.SMOKE_PARTICLE_COUNT,this.SMOKE_SPREAD,this.SMOKE_SPREAD,this.SMOKE_SPREAD);
        
        return(true);
    }
    
    release()
    {
        this.drawRelease();
    }

    drawSetup()
    {
        let tick,factor,halfSize;
        
            // checking for stop

        tick=this.getTimestamp()-this.startTimestamp;
        if (tick>this.SMOKE_LIFE_TICK) {
            this.markDelete=true;
            return(false);
        }
        
            // explosion factor
            
        factor=tick/this.SMOKE_LIFE_TICK;
        
            // explosion size

        halfSize=this.SMOKE_START_HALF_SIZE+Math.trunc(this.SMOKE_ADD_HALF_SIZE*factor);
            
        this.xBound.setFromValues((this.position.x-halfSize),(this.position.x+halfSize));
        this.yBound.setFromValues((this.position.y-halfSize),(this.position.y+halfSize));
        this.zBound.setFromValues((this.position.z-halfSize),(this.position.z+halfSize));

        return(this.boundBoxInFrustum(this.xBound,this.yBound,this.zBound));
    }
    
    draw()
    {
        let tick,factor,halfSize,alpha;
        let k,u,v;
       
            // smoke setup
            
        tick=this.getTimestamp()-this.startTimestamp;
        factor=tick/this.SMOKE_LIFE_TICK;
        
        halfSize=this.SMOKE_START_HALF_SIZE+Math.trunc(this.SMOKE_ADD_HALF_SIZE*factor);
        
        alpha=1.0;
        if (tick>(this.SMOKE_LIFE_TICK-this.SMOKE_FADE_TICK)) alpha=1.0-((tick-(this.SMOKE_LIFE_TICK-this.SMOKE_FADE_TICK))/this.SMOKE_FADE_TICK);

            // the particles
            
        k=this.getPeriodicLinear(600,4);
        u=((k&0x2)===0)?0:0.5;
        v=(k&0x1)*0.5;
            
        this.drawStart();
        this.drawAddBillboardQuadFromMotion('textures/particle_smoke.png',this.smokeMotions,factor,this.position,u,v,0.5,0.5,halfSize,halfSize,0,this.DRAW_MODE_TRANSPARENT,this.whiteColor,alpha);
        this.drawEnd();
    }
}
