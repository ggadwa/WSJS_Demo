import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// explosion fire effect class
//

export default class EffectExplosionFireClass extends ProjectEffectClass
{
    static FIRE_LIFE_TICK=1200;
    static FIRE_FADE_TICK=500;
    
    static FIRE_LIGHT_INTENSITY=45000;
    
    static FIRE_COLOR_PARTICLE_COUNT=75;
    
    static FIRE_RED_SPREAD=7500;
    static FIRE_RED_START_HALF_SIZE=10;
    static FIRE_RED_ADD_HALF_SIZE=3500;
    
    static FIRE_ORANGE_SPREAD=4500;
    static FIRE_ORANGE_START_HALF_SIZE=10;
    static FIRE_ORANGE_ADD_HALF_SIZE=1500;
    
    static FIRE_YELLOW_SPREAD=800;
    static FIRE_YELLOW_START_HALF_SIZE=10;
    static FIRE_YELLOW_ADD_HALF_SIZE=1000;
    
    static FIRE_ALPHA=0.5;
        
    constructor(core,data)
    {
        super(core,data);
        
        this.startTimestamp=0;
        
            // variables (some to stop GC)
            
        this.position=new PointClass(0,0,0);
        this.xBound=new BoundClass(0,0);
        this.yBound=new BoundClass(0,0);
        this.zBound=new BoundClass(0,0);
        
        this.fireBitmap=null;

        this.redColor=new ColorClass(1.0,0.0,0.0);
        this.orangeColor=new ColorClass(1.0,0.5,0.0);
        this.yellowColor=new ColorClass(1.0,1.0,0.0);
        this.lightColor=new ColorClass(1.0,1.0,0.0);
        
        this.redMotions=null;
        this.orangeMotions=null;
        this.yellowMotions=null;

        Object.seal(this);
    }
    
    initialize()
    {
        let count;
        
        super.initialize();
        
            // add a bitmap for this effect
            
        this.fireBitmap=this.addBitmap('textures/particle_blob.png',null,null,null,null);
        
            // sounds
            
        this.addSound('explosion',50000);
        
            // setup the drawing
            // we have FIRE_COLOR_PARTICLE_COUNT red, orange and yellow
            
        count=(EffectExplosionFireClass.FIRE_COLOR_PARTICLE_COUNT*3);
        this.drawInitialize((count*4),(count*6));
        
            // random moves
            
        this.redMotions=this.createRandomMotionArray(EffectExplosionFireClass.FIRE_COLOR_PARTICLE_COUNT,EffectExplosionFireClass.FIRE_RED_SPREAD,EffectExplosionFireClass.FIRE_RED_SPREAD,EffectExplosionFireClass.FIRE_RED_SPREAD);
        this.orangeMotions=this.createRandomMotionArray(EffectExplosionFireClass.FIRE_COLOR_PARTICLE_COUNT,EffectExplosionFireClass.FIRE_ORANGE_SPREAD,EffectExplosionFireClass.FIRE_ORANGE_SPREAD,EffectExplosionFireClass.FIRE_ORANGE_SPREAD);
        this.yellowMotions=this.createRandomMotionArray(EffectExplosionFireClass.FIRE_COLOR_PARTICLE_COUNT,EffectExplosionFireClass.FIRE_YELLOW_SPREAD,EffectExplosionFireClass.FIRE_YELLOW_SPREAD,EffectExplosionFireClass.FIRE_YELLOW_SPREAD);

            // some light settings
            
        this.setLightColor(this.lightColor,5.0);
        
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
        
            // light centered at start point
            
        
        
            // sound effect
            
        this.playSound('explosion');
    }

    drawSetup()
    {
        let tick,factor,halfSize;
        
            // checking for stop

        tick=this.getTimestamp()-this.startTimestamp;
        if (tick>EffectExplosionFireClass.FIRE_LIFE_TICK) {
            this.startTimestamp=0;
            this.show=false;
            return;
        }
        
            // explosion factor
            
        if (tick>(EffectExplosionFireClass.FIRE_LIFE_TICK-EffectExplosionFireClass.FIRE_FADE_TICK)) {
            factor=1.0-(tick-(EffectExplosionFireClass.FIRE_LIFE_TICK-EffectExplosionFireClass.FIRE_FADE_TICK))/EffectExplosionFireClass.FIRE_FADE_TICK;
        }
        else {
            factor=(tick/(EffectExplosionFireClass.FIRE_LIFE_TICK-EffectExplosionFireClass.FIRE_FADE_TICK));
        }
        
            // the light
        
        this.setLightIntensity( EffectExplosionFireClass.FIRE_LIGHT_INTENSITY*factor);
        
            // current explosion size would be size of red
            // as it's the biggest element

        halfSize=EffectExplosionFireClass.FIRE_RED_START_HALF_SIZE+Math.trunc(EffectExplosionFireClass.FIRE_RED_ADD_HALF_SIZE*factor);
            
        this.xBound=new BoundClass((this.position.x-halfSize),(this.position.x+halfSize));
        this.yBound=new BoundClass((this.position.y-halfSize),(this.position.y+halfSize));
        this.zBound=new BoundClass((this.position.z-halfSize),(this.position.z+halfSize));

        return(this.core.boundBoxInFrustum(this.xBound,this.yBound,this.zBound));
    }
    
    draw()
    {
        let tick,sizeFactor,motionFactor,halfSize,alpha;
        
            // the sizing factor
            
        tick=this.getTimestamp()-this.startTimestamp;
        if (tick>(EffectExplosionFireClass.FIRE_LIFE_TICK-EffectExplosionFireClass.FIRE_FADE_TICK)) {
            sizeFactor=1.0-(tick-(EffectExplosionFireClass.FIRE_LIFE_TICK-EffectExplosionFireClass.FIRE_FADE_TICK))/EffectExplosionFireClass.FIRE_FADE_TICK;
            alpha=0.1+(sizeFactor*(EffectExplosionFireClass.FIRE_ALPHA-0.1));
        }
        else {
            alpha=EffectExplosionFireClass.FIRE_ALPHA;
            sizeFactor=(tick/(EffectExplosionFireClass.FIRE_LIFE_TICK-EffectExplosionFireClass.FIRE_FADE_TICK));
        }
        
        motionFactor=tick/EffectExplosionFireClass.FIRE_LIFE_TICK;

            // the particles
            
        this.drawStart();
     
        halfSize=EffectExplosionFireClass.FIRE_RED_START_HALF_SIZE+Math.trunc(EffectExplosionFireClass.FIRE_RED_ADD_HALF_SIZE*sizeFactor);
        this.drawAddBillboardQuadFromMotion(this.fireBitmap,this.redMotions,motionFactor,this.position,0,0,0.5,0.5,halfSize,halfSize,0,ProjectEffectClass.DRAW_MODE_TRANSPARENT,this.redColor,alpha);
        
        halfSize=EffectExplosionFireClass.FIRE_ORANGE_START_HALF_SIZE+Math.trunc(EffectExplosionFireClass.FIRE_ORANGE_ADD_HALF_SIZE*sizeFactor);
        this.drawAddBillboardQuadFromMotion(this.fireBitmap,this.orangeMotions,motionFactor,this.position,0.5,0.5,0.5,0.5,halfSize,halfSize,0,ProjectEffectClass.DRAW_MODE_TRANSPARENT,this.orangeColor,alpha);

        halfSize=EffectExplosionFireClass.FIRE_YELLOW_START_HALF_SIZE+Math.trunc(EffectExplosionFireClass.FIRE_YELLOW_ADD_HALF_SIZE*sizeFactor);
        this.drawAddBillboardQuadFromMotion(this.fireBitmap,this.yellowMotions,motionFactor,this.position,0,0.5,0.5,0.5,halfSize,halfSize,0,ProjectEffectClass.DRAW_MODE_TRANSPARENT,this.yellowColor,alpha);
            
        this.drawEnd();
    }
}
