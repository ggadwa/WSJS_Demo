import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// explosion fire effect class
//

export default class EffectExplosionFireClass extends ProjectEffectClass
{
    initialize()
    {
        let count;
        
        this.FIRE_LIFE_TICK=1200;
        this.FIRE_FADE_TICK=500;
        this.FIRE_LIGHT_INTENSITY=45000;
        this.FIRE_COLOR_PARTICLE_COUNT=75;
        this.FIRE_RED_SPREAD=7500;
        this.FIRE_RED_START_HALF_SIZE=10;
        this.FIRE_RED_ADD_HALF_SIZE=3500;
        this.FIRE_ORANGE_SPREAD=4500;
        this.FIRE_ORANGE_START_HALF_SIZE=10;
        this.FIRE_ORANGE_ADD_HALF_SIZE=1500;
        this.FIRE_YELLOW_SPREAD=800;
        this.FIRE_YELLOW_START_HALF_SIZE=10;
        this.FIRE_YELLOW_ADD_HALF_SIZE=1000;
        this.FIRE_ALPHA=0.5;
        
        super.initialize();
        
            // setup
            
        this.startTimestamp=this.getTimestamp();
        
        this.xBound=new BoundClass(0,0);
        this.yBound=new BoundClass(0,0);
        this.zBound=new BoundClass(0,0);
        
        this.redColor=new ColorClass(1.0,0.0,0.0);
        this.orangeColor=new ColorClass(1.0,0.5,0.0);
        this.yellowColor=new ColorClass(1.0,1.0,0.0);
        this.lightColor=new ColorClass(1.0,1.0,0.0);
        
            // setup the drawing
            // we have FIRE_COLOR_PARTICLE_COUNT red, orange and yellow
            
        count=(this.FIRE_COLOR_PARTICLE_COUNT*3);
        this.drawInitialize((count*4),(count*6));
        
            // random moves
            
        this.redMotions=this.createRandomMotionArray(this.FIRE_COLOR_PARTICLE_COUNT,this.FIRE_RED_SPREAD,this.FIRE_RED_SPREAD,this.FIRE_RED_SPREAD);
        this.orangeMotions=this.createRandomMotionArray(this.FIRE_COLOR_PARTICLE_COUNT,this.FIRE_ORANGE_SPREAD,this.FIRE_ORANGE_SPREAD,this.FIRE_ORANGE_SPREAD);
        this.yellowMotions=this.createRandomMotionArray(this.FIRE_COLOR_PARTICLE_COUNT,this.FIRE_YELLOW_SPREAD,this.FIRE_YELLOW_SPREAD,this.FIRE_YELLOW_SPREAD);

            // some light settings
            
        this.setLightColor(this.lightColor);
        this.setLightExponent(5.0);
        
            // sound effect
            
        this.playSound('explosion',1.0,false);
        
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
        if (tick>this.FIRE_LIFE_TICK) {
            this.startTimestamp=0;
            this.markDelete=true;
            return(false);
        }
        
            // explosion factor
            
        if (tick>(this.FIRE_LIFE_TICK-this.FIRE_FADE_TICK)) {
            factor=1.0-(tick-(this.FIRE_LIFE_TICK-this.FIRE_FADE_TICK))/this.FIRE_FADE_TICK;
        }
        else {
            factor=(tick/(this.FIRE_LIFE_TICK-this.FIRE_FADE_TICK));
        }
        
            // the light
        
        this.setLightIntensity(this.FIRE_LIGHT_INTENSITY*factor);
        
            // current explosion size would be size of red
            // as it's the biggest element

        halfSize=this.FIRE_RED_START_HALF_SIZE+Math.trunc(this.FIRE_RED_ADD_HALF_SIZE*factor);
            
        this.xBound.setFromValues((this.position.x-halfSize),(this.position.x+halfSize));
        this.yBound.setFromValues((this.position.y-halfSize),(this.position.y+halfSize));
        this.zBound.setFromValues((this.position.z-halfSize),(this.position.z+halfSize));

        return(this.boundBoxInFrustum(this.xBound,this.yBound,this.zBound));
    }
    
    draw()
    {
        let tick,sizeFactor,motionFactor,halfSize,alpha;
        
            // the sizing factor
            
        tick=this.getTimestamp()-this.startTimestamp;
        if (tick>(this.FIRE_LIFE_TICK-this.FIRE_FADE_TICK)) {
            sizeFactor=1.0-(tick-(this.FIRE_LIFE_TICK-this.FIRE_FADE_TICK))/this.FIRE_FADE_TICK;
            alpha=0.1+(sizeFactor*(this.FIRE_ALPHA-0.1));
        }
        else {
            alpha=this.FIRE_ALPHA;
            sizeFactor=(tick/(this.FIRE_LIFE_TICK-this.FIRE_FADE_TICK));
        }
        
        motionFactor=tick/this.FIRE_LIFE_TICK;

            // the particles
            
        this.drawStart();
     
        halfSize=this.FIRE_RED_START_HALF_SIZE+Math.trunc(this.FIRE_RED_ADD_HALF_SIZE*sizeFactor);
        this.drawAddBillboardQuadFromMotion('textures/particle_blob.png',this.redMotions,motionFactor,this.position,0,0,0.5,0.5,halfSize,halfSize,0,this.DRAW_MODE_TRANSPARENT,this.redColor,alpha);
        
        halfSize=this.FIRE_ORANGE_START_HALF_SIZE+Math.trunc(this.FIRE_ORANGE_ADD_HALF_SIZE*sizeFactor);
        this.drawAddBillboardQuadFromMotion('textures/particle_blob.png',this.orangeMotions,motionFactor,this.position,0.5,0.5,0.5,0.5,halfSize,halfSize,0,this.DRAW_MODE_TRANSPARENT,this.orangeColor,alpha);

        halfSize=this.FIRE_YELLOW_START_HALF_SIZE+Math.trunc(this.FIRE_YELLOW_ADD_HALF_SIZE*sizeFactor);
        this.drawAddBillboardQuadFromMotion('textures/particle_blob.png',this.yellowMotions,motionFactor,this.position,0,0.5,0.5,0.5,halfSize,halfSize,0,this.DRAW_MODE_TRANSPARENT,this.yellowColor,alpha);
            
        this.drawEnd();
    }
}
