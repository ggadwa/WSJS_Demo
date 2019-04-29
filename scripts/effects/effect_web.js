import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// web effect class
//

export default class EffectWebClass extends ProjectEffectClass
{
    static WEB_MIN_FREQUENCY=8000;
    static WEB_ADDITIONAL_FREQUENCY=5000;
    static WEB_MAX_MOVE=80;
        
    constructor(core,data)
    {
        super(core,data);
        
        this.position=new PointClass(0,0,0);
        this.xBound=new BoundClass(0,0);
        this.yBound=new BoundClass(0,0);
        this.zBound=new BoundClass(0,0);
            
        this.v0XFrequency=0;
        this.v0ZFrequency=0;
        this.v1XFrequency=0;
        this.v1ZFrequency=0;
        this.v2XFrequency=0;
        this.v2ZFrequency=0;
        
        this.webBitmap=null;
        this.webColor=new ColorClass(1,1,1);

        this.drawV0=new PointClass(0,0,0);
        this.drawV1=new PointClass(0,0,0);
        this.drawV2=new PointClass(0,0,0);
                
        Object.seal(this);
    }
    
    initialize()
    {
        super.initialize();
        
            // add a bitmap for this effect
            
        this.webBitmap=this.addBitmap('textures/web.png',null,null,null,null);
        
            // setup the drawing
            
        this.drawInitialize(3,3);
        
            //random moves
            
        this.v0XFrequency=EffectWebClass.WEB_MIN_FREQUENCY+(Math.random()*EffectWebClass.WEB_ADDITIONAL_FREQUENCY);
        this.v0ZFrequency=EffectWebClass.WEB_MIN_FREQUENCY+(Math.random()*EffectWebClass.WEB_ADDITIONAL_FREQUENCY);
        this.v1XFrequency=EffectWebClass.WEB_MIN_FREQUENCY+(Math.random()*EffectWebClass.WEB_ADDITIONAL_FREQUENCY);
        this.v1ZFrequency=EffectWebClass.WEB_MIN_FREQUENCY+(Math.random()*EffectWebClass.WEB_ADDITIONAL_FREQUENCY);
        this.v2XFrequency=EffectWebClass.WEB_MIN_FREQUENCY+(Math.random()*EffectWebClass.WEB_ADDITIONAL_FREQUENCY);
        this.v2ZFrequency=EffectWebClass.WEB_MIN_FREQUENCY+(Math.random()*EffectWebClass.WEB_ADDITIONAL_FREQUENCY);
        
            // get the bounds for elimination
            
        this.xBound.setFromValues(this.data.v0.x,this.data.v1.x);
        this.xBound.adjust(this.data.v2.x);
        
        this.yBound.setFromValues(this.data.v0.y,this.data.v1.y);
        this.yBound.adjust(this.data.v2.y);
        
        this.zBound.setFromValues(this.data.v0.z,this.data.v1.z);
        this.zBound.adjust(this.data.v2.z);
        
        return(true);
    }
    
    release()
    {
        this.drawRelease();
    }
    
    drawSetup()
    {   
        return(this.core.boundBoxInFrustum(this.xBound,this.yBound,this.zBound));
    }
    
    draw()
    {
            // moving web
            
        this.drawV0.x=this.data.v0.x+this.getPeriodicSin(this.v0XFrequency,EffectWebClass.WEB_MAX_MOVE);
        this.drawV0.y=this.data.v0.y;
        this.drawV0.z=this.data.v0.z+this.getPeriodicCos(this.v0ZFrequency,EffectWebClass.WEB_MAX_MOVE);
        
        this.drawV1.x=this.data.v1.x+this.getPeriodicSin(this.v1XFrequency,EffectWebClass.WEB_MAX_MOVE);
        this.drawV1.y=this.data.v1.y;
        this.drawV1.z=this.data.v1.z+this.getPeriodicCos(this.v1ZFrequency,EffectWebClass.WEB_MAX_MOVE);
        
        this.drawV2.x=this.data.v2.x+this.getPeriodicSin(this.v2XFrequency,EffectWebClass.WEB_MAX_MOVE);
        this.drawV2.y=this.data.v2.y;
        this.drawV2.z=this.data.v2.z+this.getPeriodicCos(this.v2ZFrequency,EffectWebClass.WEB_MAX_MOVE);
            
            // draw web
            
        this.drawStart();
        this.drawAddTriangle(this.webBitmap,this.drawV0,this.data.v0.u,this.data.v0.v,this.drawV1,this.data.v1.u,this.data.v1.v,this.drawV2,this.data.v2.u,this.data.v2.v,this.core.gl.SRC_ALPHA,this.core.gl.ONE_MINUS_SRC_ALPHA,this.webColor,0.5);
        this.drawEnd();
    }
}
