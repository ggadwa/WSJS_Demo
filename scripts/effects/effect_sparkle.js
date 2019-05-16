import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// sparkle effect class
//

export default class EffectSparkleClass extends ProjectEffectClass
{
    static SPARKLE_LIFE_TICK=1000;
    static SPARKLE_START_HALF_SIZE=100;
    static SPARKLE_ADD_HALF_SIZE=1500;
    static SPARKLE_ALPHA_START_FACTOR=0.3;
    static SPARKLE_ALPHA_ADD_FACTOR=0.7;
    
    startTimestamp=0;
    halfSize=0;
    alpha=1.0;
    rotateTick=0;
    xBound=null;
    yBound=null;
    zBound=null;
    sparkleBitmap=null;
    sparkleColor=null;
        
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.startTimestamp=0;

        this.xBound=new BoundClass(0,0);
        this.yBound=new BoundClass(0,0);
        this.zBound=new BoundClass(0,0);

        this.sparkleColor=new ColorClass((0.3+(Math.random()*0.7)),(0.2+(Math.random()*0.7)),(0.1+(Math.random()*0.8)));
        
            // add a bitmap for this effect
            
        this.sparkleBitmap=this.addBitmap('textures/particle_hit.png');
        
            // setup the drawing
            
        this.drawInitialize(4,6);

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
        this.rotateTick=1000+Math.trunc(Math.random()*1000);         // add a random rotation to every new effect
    }
    
    drawSetup()
    {
        let tick,factor;
        
            // checking for stop

        tick=this.getTimestamp()-this.startTimestamp;
        if (tick>EffectSparkleClass.SPARKLE_LIFE_TICK) {
            this.startTimestamp=0;
            this.show=false;
            return;
        }
        
            // current fire size
        
        factor=tick/EffectSparkleClass.SPARKLE_LIFE_TICK;

        this.halfSize=EffectSparkleClass.SPARKLE_START_HALF_SIZE+Math.trunc(EffectSparkleClass.SPARKLE_ADD_HALF_SIZE*(1.0-factor));
        this.alpha=EffectSparkleClass.SPARKLE_ALPHA_START_FACTOR+(EffectSparkleClass.SPARKLE_ALPHA_ADD_FACTOR*factor);
        
            // need to rebuild the bounds
            
        this.xBound.setFromValues((this.position.x-this.halfSize),(this.position.x+this.halfSize));
        this.yBound.setFromValues((this.position.y-this.halfSize),(this.position.y+this.halfSize));
        this.zBound.setFromValues((this.position.z-this.halfSize),(this.position.z+this.halfSize));

        return(this.boundBoxInFrustum(this.xBound,this.yBound,this.zBound));
    }
    
    draw()
    {
        this.drawStart();
        this.drawAddBillboardQuad(this.sparkleBitmap,this.position,0,0,1,1,this.halfSize,this.halfSize,this.getPeriodicLinear(this.rotateTick,360),ProjectEffectClass.DRAW_MODE_ADDITIVE,this.sparkleColor,this.alpha);
        this.drawEnd();
    }
}
