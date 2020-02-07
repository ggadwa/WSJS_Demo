import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import EffectJsonClass from '../../../code/project/effect_json.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// fire effect class
//

export default class EffectFireClass extends EffectJsonClass
{
    getJson()
    {
        return(
            {
                "light":{"color":{"r":1,"g":0.9,"b":0.9},"intensity":this.data.intensity,"exponent":1.5,"glow":true,"glowPeriod":8000,"glowPercentage":0.1,"glowRandomStart":true},
                "billboards":
                    [
                        {
                            "bitmap":"textures/particle_glow.png","mode":"additive","uv":"whole",
                            "frames":
                                [
                                    {"tick":0,"width":3000,"height":3000,"rotate":0,"color":{"r":1,"g":1.0,"b":1.0},"alpha":0.85},
                                    {"tick":10000,"width":3300,"height":3300,"rotate":180,"color":{"r":1,"g":1.0,"b":1.0},"alpha":0.8},
                                    {"tick":20000,"width":3000,"height":3000,"rotate":360,"color":{"r":1,"g":1.0,"b":1.0},"alpha":0.85}
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
        
        this.FIRE_WIDTH=400;
        this.FIRE_HEIGHT=420;
        this.FIRE_EXTRA_SIZE=100;
        
        this.GLOW_WIDTH=3000;
        this.GLOW_HEIGHT=3000;
        
            // setup
            
        this.redColor=new ColorClass(1.0,0.2,0.2);
        this.orangeColor=new ColorClass(1.0,0.5,0.0);
        this.glowColor=new ColorClass(1,1,1);
        this.lightColor=new ColorClass(1.0,0.9,0.9);
            
        this.drawPoint=new PointClass(0,0,0);
        
            // setup the drawing
            
        this.drawInitialize(16,96);
        
        this.json=this.getJson();
        console.log(this.json.light.intensity+'>'+this.data.intensity);
        
            // some light precalcs
            
        this.lightIntensity=this.data.intensity;
        this.lightIntensityDrop=Math.trunc(this.lightIntensity*0.1);
        
        this.lightPeriodicTick=8000+Math.trunc(Math.random()*2000);
        
            // fire doesn't move, precalc the view culling
            // bounds in the constructor
            
        this.xBound=new BoundClass((this.position.x-this.GLOW_WIDTH),(this.position.x+this.GLOW_WIDTH));
        this.yBound=new BoundClass((this.position.y-this.GLOW_HEIGHT),(this.position.y+this.GLOW_HEIGHT));
        this.zBound=new BoundClass((this.position.z-this.GLOW_WIDTH),(this.position.z+this.GLOW_WIDTH));
        
            // some light settings
            
        this.setLightColor(this.lightColor);
        this.setLightExponent(1.5);
        
        return(true);
    }
    
    release()
    {
        this.drawRelease();
    }
    
    drawSetup()
    {
            // change the lighting intensity for a slow wave type effect
            
        this.setLightIntensity(this.lightIntensity-Math.trunc(Math.abs(this.getPeriodicSin(this.lightPeriodicTick,this.lightIntensityDrop))));
            
            // now determine if we can draw this
            
        return(this.boundBoxInFrustum(this.xBound,this.yBound,this.zBound,null));
    }
    
    draw()
    {
        let u,v,u2,v2,ts,squeeze,halfWid,halfHigh;
        
            // get uv based on timestamp
          
        ts=Math.trunc(this.getPeriodicLinear(500,4));
        u=Math.trunc(ts/2)*0.5;
        v=(ts&0x1)*0.5;
        
        ts=(ts+1)&0x3;
        u2=Math.trunc(ts/2)*0.5;
        v2=(ts&0x1)*0.5;
        
            // the flame size
         
        squeeze=Math.trunc(Math.abs(this.getPeriodicSin(2000,this.FIRE_EXTRA_SIZE)));
        halfWid=this.FIRE_WIDTH-squeeze;
        
            // draw the quads
            
        this.drawStart();
        
            // the glow
            
        this.drawAddBillboardQuad('textures/particle_glow.png',this.position,0.0,0.0,1.0,1.0,this.GLOW_WIDTH,this.GLOW_HEIGHT,this.getPeriodicLinear(35000,360),this.DRAW_MODE_ADDITIVE,this.glowColor,0.8);

            // the red and orange part

        this.drawAddBillboardQuad('textures/particle_blob.png',this.position,u,v,0.5,0.5,halfWid,this.FIRE_HEIGHT,0,this.DRAW_MODE_TRANSPARENT,this.redColor,1.0);
        this.drawAddBillboardQuad('textures/particle_blob.png',this.position,u2,v2,0.5,0.5,halfWid,this.FIRE_HEIGHT,0,this.DRAW_MODE_TRANSPARENT,this.redColor,1.0);
        
        halfWid=Math.trunc(halfWid*0.5);
        halfHigh=Math.trunc(this.FIRE_HEIGHT*0.6);
        this.drawPoint.setFromValues(this.position.x,(this.position.y+halfHigh),this.position.z);
        this.drawAddBillboardQuad('textures/particle_blob.png',this.drawPoint,u,v,0.5,0.5,halfWid,halfHigh,0,this.DRAW_MODE_TRANSPARENT,this.orangeColor,0.9);

        this.drawEnd();
    }
         * 
 */
}
