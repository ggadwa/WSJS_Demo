import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// fire effect class
//

export default class EffectFireClass extends ProjectEffectClass
{
    static FIRE_WIDTH=400;
    static FIRE_HEIGHT=420;
    static FIRE_EXTRA_SIZE=100;
        
    static GLOW_WIDTH=2000;
    static GLOW_HEIGHT=2000;
        
    constructor(core,data)
    {
        super(core,data);
        
        this.position=new PointClass(0,0,0);
        this.xBound=new BoundClass(0,0);
        this.yBound=new BoundClass(0,0);
        this.zBound=new BoundClass(0,0);
        
        this.lightIntensity=0;
        this.lightIntensityDrop=0;
        this.lightPeriodicTick=0;

        this.fireBitmap=null;
        this.glowBitmap=null;
        
        this.redColor=new ColorClass(1.0,0.2,0.2);
        this.orangeColor=new ColorClass(1.0,0.5,0.0);
        this.glowColor=new ColorClass(1,1,1);
        this.lightColor=new ColorClass(1.0,0.9,0.9);
        
            // to avoid GC
            
        this.drawPoint=new PointClass(0,0,0);
                
        Object.seal(this);
    }
    
    initialize()
    {
        super.initialize();
        
        let meshIdx;
        
            // add a bitmap for this effect
            
        this.fireBitmap=this.addBitmap('textures/particle_blob.png',null,null,null,null);
        this.glowBitmap=this.addBitmap('textures/particle_glow.png',null,null,null,null);
        
            // setup the drawing
            
        this.drawInitialize(16,96);
        
            // find the position from an offset
            // to a mesh
            
        meshIdx=this.core.map.meshList.find(this.data.mesh);
        if (meshIdx!==-1) {
            this.position.setFromPoint(this.core.map.meshList.meshes[meshIdx].center);
            this.position.addValues(this.data.offset.x,this.data.offset.y,this.data.offset.z);
        }
        else {
            console.log('warning: unknown mesh to attach effect to: '+this.data.mesh);
            return(false);
        }

            // some light precalcs
            
        this.lightIntensity=this.data.intensity;
        this.lightIntensityDrop=Math.trunc(this.lightIntensity*0.1);
        
        this.lightPeriodicTick=8000+Math.trunc(Math.random()*2000);
        
            // fire doesn't move, precalc the view culling
            // bounds in the constructor
            
        this.xBound.setFromValues((this.position.x-EffectFireClass.GLOW_WIDTH),(this.position.x+EffectFireClass.GLOW_WIDTH));
        this.yBound.setFromValues((this.position.y-EffectFireClass.GLOW_HEIGHT),(this.position.y+EffectFireClass.GLOW_HEIGHT));
        this.zBound.setFromValues((this.position.z-EffectFireClass.GLOW_WIDTH),(this.position.z+EffectFireClass.GLOW_WIDTH));
        
            // some light settings
            
        this.setLightColor(this.lightColor,1.5);
        
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
            
        return(this.core.boundBoxInFrustum(this.xBound,this.yBound,this.zBound,null));
    }
    
    draw()
    {
        let u,v,u2,v2,ts,squeeze,halfWid,halfHigh;
        
            // get uv based on timestamp
          
        ts=Math.trunc(this.getTimestamp()*0.01)&0x3;
        u=Math.trunc(ts/2)*0.5;
        v=(ts&0x1)*0.5;
        
        ts=(ts+1)&0x3;
        u2=Math.trunc(ts/2)*0.5;
        v2=(ts&0x1)*0.5;
        
            // the flame size
         
        squeeze=Math.trunc(Math.abs(this.getPeriodicSin(2000,EffectFireClass.FIRE_EXTRA_SIZE)));
        halfWid=EffectFireClass.FIRE_WIDTH-squeeze;
        
            // draw the quads
            
        this.drawStart();
        
            // the glow
            
        this.drawAddBillboardQuad(this.glowBitmap,this.position,0.0,0.0,1.0,1.0,EffectFireClass.GLOW_WIDTH,EffectFireClass.GLOW_HEIGHT,this.getPeriodicLinear(35000,360),this.core.gl.SRC_ALPHA,this.core.gl.ONE,this.glowColor,0.8);

            // the red and orange part

        this.drawAddBillboardQuad(this.fireBitmap,this.position,u,v,0.5,0.5,halfWid,EffectFireClass.FIRE_HEIGHT,0,this.core.gl.SRC_ALPHA,this.core.gl.ONE_MINUS_SRC_ALPHA,this.redColor,1.0);
        this.drawAddBillboardQuad(this.fireBitmap,this.position,u2,v2,0.5,0.5,halfWid,EffectFireClass.FIRE_HEIGHT,0,this.core.gl.SRC_ALPHA,this.core.gl.ONE_MINUS_SRC_ALPHA,this.redColor,1.0);
        
        halfWid=Math.trunc(halfWid*0.5);
        halfHigh=Math.trunc(EffectFireClass.FIRE_HEIGHT*0.6);
        this.drawPoint.setFromValues(this.position.x,(this.position.y+halfHigh),this.position.z);
        this.drawAddBillboardQuad(this.fireBitmap,this.drawPoint,u,v,0.5,0.5,halfWid,halfHigh,0,this.core.gl.SRC_ALPHA,this.core.gl.ONE_MINUS_SRC_ALPHA,this.orangeColor,0.9);

        this.drawEnd();
    }
}
