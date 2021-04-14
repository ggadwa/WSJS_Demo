import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import EffectClass from '../../../code/game/effect.js';

export default class FireClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=-1;
        
        this.addLight()
                .addLightFrame(0,new ColorClass(1.0,0.9,0.9),data.intensity,1.5)
                .addLightFrame(1500,new ColorClass(1.0,0.85,0.8),data.intensity,2)
                .addLightFrame(3000,new ColorClass(1.0,0.9,0.9),data.intensity,1.5);
        
            // the glow
                
        this.addBillboard('textures/particle_glow.png',this.DRAW_MODE_ADDITIVE)
                .addBillboardFrame(0,6000,6000,0,new ColorClass(1.0,1.0,1.0),0.65)
                .addBillboardFrame(10000,6600,6600,180,new ColorClass(1.0,1.0,1.0),0.6)
                .addBillboardFrame(20000,6000,6000,360,new ColorClass(1.0,1.0,1.0),0.65);
        
            // red flame
                
        this.addBillboard('textures/particle_blob.png',this.DRAW_MODE_TRANSPARENT)
                .setGrid(4,500,0)
                .addBillboardFrame(0,800,840,0,new ColorClass(1.0,0.2,0.2),1.0)
                .addBillboardFrame(1000,640,900,0,new ColorClass(1.0,0.2,0.2),1.0)
                .addBillboardFrame(2000,800,840,0,new ColorClass(1.0,0.2,0.2),1.0);
        
            // red 2 flame
                
        this.addBillboard('textures/particle_blob.png',this.DRAW_MODE_TRANSPARENT)
                .setGrid(4,500,1)
                .addBillboardFrame(0,800,840,0,new ColorClass(1.0,0.2,0.2),1.0)
                .addBillboardFrame(1000,780,640,0,new ColorClass(1.0,0.2,0.2),1.0)
                .addBillboardFrame(2000,800,840,0,new ColorClass(1.0,0.2,0.2),1.0);
        
            // orange flame
                
        this.addBillboard('textures/particle_blob.png',this.DRAW_MODE_TRANSPARENT)
                .setGrid(4,500,2)
                .addBillboardFrame(0,400,460,0,new ColorClass(1.0,0.5,0.0),1.0)
                .addBillboardFrame(1000,360,400,0,new ColorClass(1.0,0.5,0.0),1.0)
                .addBillboardFrame(2000,400,460,0,new ColorClass(1.0,0.5,0.0),1.0);
        
            // ambient sound
                
        this.addAmbientSound('fire',1.0,0.0,12000,0.0,1.807,true);
    }

}
