import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// hit effect class
//

export default class EffectHitClass extends ProjectEffectClass
{
    static HIT_LIFE_TICK=150;
    static HIT_START_HALF_SIZE=50;
    static HIT_ADD_HALF_SIZE=900;
    static HIT_ALPHA_START_FACTOR=0.3;
    static HIT_ALPHA_ADD_FACTOR=0.7;
    
    startTimestamp=0;
    halfSize=0;
    alpha=1.0;
    xBound=null;
    yBound=null;
    zBound=null;
    hitColor=null;
        
    initialize()
    {
        let col;
        
        super.initialize();
        
            // setup
            
        this.startTimestamp=this.getTimestamp();

        this.xBound=new BoundClass(0,0);
        this.yBound=new BoundClass(0,0);
        this.zBound=new BoundClass(0,0);

        col=0.7+(Math.random()*0.2);
        this.hitColor=new ColorClass((col+0.1),col,0.0);
        
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
        if (tick>EffectHitClass.HIT_LIFE_TICK) {
            this.markDelete=true;
            return(false);
        }
        
            // current fire size
        
        factor=tick/EffectHitClass.HIT_LIFE_TICK;

        this.halfSize=EffectHitClass.HIT_START_HALF_SIZE+Math.trunc(EffectHitClass.HIT_ADD_HALF_SIZE*factor);
        this.alpha=EffectHitClass.HIT_ALPHA_START_FACTOR+(EffectHitClass.HIT_ALPHA_ADD_FACTOR*factor);
        
            // need to rebuild the bounds
            
        this.xBound.setFromValues((this.position.x-this.halfSize),(this.position.x+this.halfSize));
        this.yBound.setFromValues((this.position.y-this.halfSize),(this.position.y+this.halfSize));
        this.zBound.setFromValues((this.position.z-this.halfSize),(this.position.z+this.halfSize));

        return(this.boundBoxInFrustum(this.xBound,this.yBound,this.zBound));
    }
    
    draw()
    {
        this.drawStart();
        this.drawAddBillboardQuad('textures/particle_hit.png',this.position,0,0,1,1,this.halfSize,this.halfSize,this.getPeriodicLinear(1000,360),ProjectEffectClass.DRAW_MODE_ADDITIVE,this.hitColor,this.alpha);
        this.drawEnd();
    }
}
