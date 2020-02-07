import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';
import EffectJsonClass from '../../../code/project/effect_json.js';

//
// web effect class
//

export default class EffectWebClass extends EffectJsonClass
{

    getJson()
    {
        return(
            {
                "light":{"color":{"r":1,"g":0.9,"b":0.9},"intensity":this.data.intensity,"exponent":1.5,"glow":true,"glowPeriod":4000,"glowPercentage":0.1,"glowRandomStart":true},
                "triangles":
                    [
                        {
                            "bitmap":"textures/web.png","mode":"transparent","wave":true,"wavePeriod":10000,"waveSize":80,"waveRandomStart":true,"v0":this.data.v0,"v1":this.data.v1,"v2":this.data.v2,
                            "frames":
                                [
                                    {"tick":0,"width":3000,"height":3000,"rotate":0,"color":{"r":1,"g":1.0,"b":1.0},"alpha":0.5}
                                ]
                        },
                    ]
            }        
        );
    }
/*
    initialize()
    {
        super.initialize();
    
        this.WEB_MIN_FREQUENCY=8000;
        this.WEB_ADDITIONAL_FREQUENCY=5000;
        this.WEB_MAX_MOVE=80;
        
            // setup
            
        this.v0XFrequency=0;
        this.v0ZFrequency=0;
        this.v1XFrequency=0;
        this.v1ZFrequency=0;
        this.v2XFrequency=0;
        this.v2ZFrequency=0;
        
        this.drawV0=new PointClass(0,0,0);
        this.drawV1=new PointClass(0,0,0);
        this.drawV2=new PointClass(0,0,0);
        
        this.webColor=new ColorClass(1,1,1);
        
            // setup the drawing
            
        this.drawInitialize(3,3);
        
            //random moves
            
        this.v0XFrequency=this.WEB_MIN_FREQUENCY+(Math.random()*this.WEB_ADDITIONAL_FREQUENCY);
        this.v0ZFrequency=this.WEB_MIN_FREQUENCY+(Math.random()*this.WEB_ADDITIONAL_FREQUENCY);
        this.v1XFrequency=this.WEB_MIN_FREQUENCY+(Math.random()*this.WEB_ADDITIONAL_FREQUENCY);
        this.v1ZFrequency=this.WEB_MIN_FREQUENCY+(Math.random()*this.WEB_ADDITIONAL_FREQUENCY);
        this.v2XFrequency=this.WEB_MIN_FREQUENCY+(Math.random()*this.WEB_ADDITIONAL_FREQUENCY);
        this.v2ZFrequency=this.WEB_MIN_FREQUENCY+(Math.random()*this.WEB_ADDITIONAL_FREQUENCY);
        
            // get the bounds for elimination
            
        this.xBound=new BoundClass(this.data.v0.x,this.data.v1.x);
        this.xBound.adjust(this.data.v2.x);
        
        this.yBound=new BoundClass(this.data.v0.y,this.data.v1.y);
        this.yBound.adjust(this.data.v2.y);
        
        this.zBound=new BoundClass(this.data.v0.z,this.data.v1.z);
        this.zBound.adjust(this.data.v2.z);
        
        return(true);
    }
    
    release()
    {
        this.drawRelease();
    }
    
    drawSetup()
    {   
        return(this.boundBoxInFrustum(this.xBound,this.yBound,this.zBound));
    }
    
    draw()
    {
            // moving web
            
        this.drawV0.x=this.data.v0.x+this.getPeriodicSin(this.v0XFrequency,this.WEB_MAX_MOVE);
        this.drawV0.y=this.data.v0.y;
        this.drawV0.z=this.data.v0.z+this.getPeriodicCos(this.v0ZFrequency,this.WEB_MAX_MOVE);
        
        this.drawV1.x=this.data.v1.x+this.getPeriodicSin(this.v1XFrequency,this.WEB_MAX_MOVE);
        this.drawV1.y=this.data.v1.y;
        this.drawV1.z=this.data.v1.z+this.getPeriodicCos(this.v1ZFrequency,this.WEB_MAX_MOVE);
        
        this.drawV2.x=this.data.v2.x+this.getPeriodicSin(this.v2XFrequency,this.WEB_MAX_MOVE);
        this.drawV2.y=this.data.v2.y;
        this.drawV2.z=this.data.v2.z+this.getPeriodicCos(this.v2ZFrequency,this.WEB_MAX_MOVE);
            
            // draw web
            
        this.drawStart();
        this.drawAddTriangle('textures/web.png',this.drawV0,this.data.v0.u,this.data.v0.v,this.drawV1,this.data.v1.u,this.data.v1.v,this.drawV2,this.data.v2.u,this.data.v2.v,this.DRAW_MODE_TRANSPARENT,this.webColor,0.5);
        this.drawEnd();
    }
         
*/
}
