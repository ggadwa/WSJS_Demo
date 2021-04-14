import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import EffectClass from '../../../code/game/effect.js';

export default class ExplosionClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=3000;
        
        this.addLight()
                .addLightFrame(0,new ColorClass(1.0,0.0,0.0),1,1)
                .addLightFrame(400,new ColorClass(1.0,0.8,0.0),45000,5)
                .addLightFrame(1100,new ColorClass(1.0,1.0,0.7),45000,5)
                .addLightFrame(1200,new ColorClass(1.0,1.0,0.7),1,10)
                .addLightFrame(3000,new ColorClass(0.0,0.0,0.0),1,1);
        
                // smoke
    
        this.addParticle('textures/particle_smoke.png',this.DRAW_MODE_TRANSPARENT,60,new PointClass(25000,25000,25000))
                .setGrid(4,600,0)
                .addParticleFrame(0,0.1,500,500,0,new ColorClass(1.0,1.0,1.0),0.1)
                .addParticleFrame(2300,0.8,15000,15000,180,new ColorClass(1.0,1.0,1.0),1.0)
                .addParticleFrame(3000,1.0,25000,25000,220,new ColorClass(0.7,0.7,0.7),0.1);
        
                // red part
        
        this.addParticle('textures/particle_blob.png',this.DRAW_MODE_TRANSPARENT,100,new PointClass(8500,8500,8500))
                .setGrid(4,500,0)
                .addParticleFrame(0,0.1,20,20,0,new ColorClass(1.0,0.0,0.0),0.4)
                .addParticleFrame(400,0.5,7000,7000,30,new ColorClass(1.0,0.0,0.0),0.4)
                .addParticleFrame(900,1.0,7000,7000,60,new ColorClass(1.0,0.0,0.0),0.4)
                .addParticleFrame(1200,0.9,6500,6500,70,new ColorClass(1.0,0.2,0.2),0.2)
                .addParticleFrame(1201,0.9,6000,6000,70,new ColorClass(1.0,0.2,0.2),0.05)
                .addParticleFrame(3000,0.9,5500,5500,80,new ColorClass(1.0,0.2,0.2),0.0);
        
                // orange part
                
        this.addParticle('textures/particle_blob.png',this.DRAW_MODE_TRANSPARENT,35,new PointClass(5300,5300,5300))
                .setGrid(4,450,0)
                .addParticleFrame(0,0.1,20,20,180,new ColorClass(1.0,0.0,0.0),0.4)
                .addParticleFrame(400,0.5,6000,6000,160,new ColorClass(1.0,0.5,0.0),0.4)
                .addParticleFrame(1000,1.0,6000,6000,140,new ColorClass(1.0,0.5,0.0),0.4)
                .addParticleFrame(1150,0.9,5500,5500,130,new ColorClass(1.0,0.7,0.2),0.2)
                .addParticleFrame(1151,0.9,5000,5000,130,new ColorClass(1.0,0.7,0.2),0.05)
                .addParticleFrame(3000,0.9,4500,4500,140,new ColorClass(1.0,0.7,0.2),0.0);
        
                // yellow part
                
        this.addParticle('textures/particle_blob.png',this.DRAW_MODE_TRANSPARENT,25,new PointClass(2500,2500,2500))
                .setGrid(4,400,0)
                .addParticleFrame(0,0.1,10,10,0,new ColorClass(1.0,1.0,0.0),0.4)
                .addParticleFrame(400,0.5,1500,1500,10,new ColorClass(1.0,1.0,0.0),0.4)
                .addParticleFrame(1100,1.0,1500,1500,20,new ColorClass(1.0,1.0,0.0),0.4)
                .addParticleFrame(1100,0.9,1000,1000,30,new ColorClass(1.0,1.0,0.2),0.2)
                .addParticleFrame(1101,0.9,500,500,30,new ColorClass(1.0,1.0,0.2),0.05)
                .addParticleFrame(3000,0.9,100,100,40,new ColorClass(1.0,1.0,0.2),0.0);
        
        this.startSound={"name":"explosion","rate":1.0,"randomRateAdd":-0.4,"distance":50000,"loopStart":0,"loopEnd":0,"loop":false};
    }
    
    ready()
    {
        super.ready();
        
        this.playSound(this.startSound);
        this.shakeCamera(30000,40,2000);
        this.damageForRadius(20000,50);
    }

}
