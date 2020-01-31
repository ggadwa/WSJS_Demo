import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// sparkle effect class
//

export default class EffectSparkleClass extends ProjectEffectClass
{
    initialize()
    {
        super.initialize();
    
        this.SPARKLE_LIFE_TICK=1000;
        this.SPARKLE_START_HALF_SIZE=100;
        this.SPARKLE_ADD_HALF_SIZE=1500;
        this.SPARKLE_ALPHA_START_FACTOR=0.3;
        this.SPARKLE_ALPHA_ADD_FACTOR=0.7;
        
            // setup
            
        this.startTimestamp=this.getTimestamp();
        this.rotateTick=1000+Math.trunc(Math.random()*1000);         // add a random rotation to every new effect

        this.xBound=new BoundClass(0,0);
        this.yBound=new BoundClass(0,0);
        this.zBound=new BoundClass(0,0);
        
        this.halfSize=0;
        this.alpha=1.0;

        this.sparkleColor=new ColorClass((0.3+(Math.random()*0.7)),(0.2+(Math.random()*0.7)),(0.1+(Math.random()*0.8)));
        
            // setup the drawing
            
        this.drawInitialize(4,6);

        return(true);
    }
    
    release()
    {
        this.drawRelease();
    }
    
    drawSetup()
    {
        let tick,factor;
        
            // checking for stop

        tick=this.getTimestamp()-this.startTimestamp;
        if (tick>this.SPARKLE_LIFE_TICK) {
            this.markDelete=true;
            return(false);
        }
        
            // current sparkle size
        
        factor=tick/this.SPARKLE_LIFE_TICK;

        this.halfSize=this.SPARKLE_START_HALF_SIZE+Math.trunc(this.SPARKLE_ADD_HALF_SIZE*(1.0-factor));
        this.alpha=this.SPARKLE_ALPHA_START_FACTOR+(this.SPARKLE_ALPHA_ADD_FACTOR*factor);
        
            // need to rebuild the bounds
            
        this.xBound.setFromValues((this.position.x-this.halfSize),(this.position.x+this.halfSize));
        this.yBound.setFromValues((this.position.y-this.halfSize),(this.position.y+this.halfSize));
        this.zBound.setFromValues((this.position.z-this.halfSize),(this.position.z+this.halfSize));

        return(this.boundBoxInFrustum(this.xBound,this.yBound,this.zBound));
    }
    
    draw()
    {
        this.drawStart();
        this.drawAddBillboardQuad('textures/particle_hit.png',this.position,0,0,1,1,this.halfSize,this.halfSize,this.getPeriodicLinear(this.rotateTick,360),this.DRAW_MODE_ADDITIVE,this.sparkleColor,this.alpha);
        this.drawEnd();
    }
}
