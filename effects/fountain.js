import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import EffectClass from '../../../code/game/effect.js';

export default class FountainClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=-1;
        
        this.addBillboard('textures/particle_smoke.png',this.DRAW_MODE_TRANSPARENT)
                .setGrid(4,500,0)
                .addBillboardFrame(0,2400,8500,-6,new ColorClass(0.2,0.2,1.0),0.6)
                .addBillboardFrame(1000,2400,9000,-1,new ColorClass(0.2,0.2,1.0),0.6)
                .addBillboardFrame(1500,2400,8500,-4,new ColorClass(0.2,0.2,1.0),0.6)
                .addBillboardFrame(2000,2400,9500,-1,new ColorClass(0.2,0.2,1.0),0.6)
                .addBillboardFrame(2300,2400,8500,-6,new ColorClass(0.2,0.2,1.0),0.6);
        
        this.addBillboard('textures/particle_smoke.png',this.DRAW_MODE_TRANSPARENT)
                .setGrid(4,500,0)
                .addBillboardFrame(0,2400,8500,6,new ColorClass(0.2,0.2,1.0),0.6)
                .addBillboardFrame(1000,2400,9000,1,new ColorClass(0.2,0.2,1.0),0.6)
                .addBillboardFrame(1500,2400,8500,4,new ColorClass(0.2,0.2,1.0),0.6)
                .addBillboardFrame(2000,2400,9500,1,new ColorClass(0.2,0.2,1.0),0.6)
                .addBillboardFrame(2300,2400,8500,6,new ColorClass(0.2,0.2,1.0),0.6);
        
        this.addBillboard('textures/particle_smoke.png',this.DRAW_MODE_TRANSPARENT)
                .setGrid(4,450,0)
                .addBillboardFrame(0,1900,7500,2,new ColorClass(0.5,0.5,1.0),0.7)
                .addBillboardFrame(800,1900,8000,0,new ColorClass(0.5,0.5,1.0),0.7)
                .addBillboardFrame(1300,1900,7500,-2,new ColorClass(0.5,0.5,1.0),0.7)
                .addBillboardFrame(1800,1900,8500,0,new ColorClass(0.5,0.5,1.0),0.7)
                .addBillboardFrame(2300,1900,7500,2,new ColorClass(0.5,0.5,1.0),0.7);
        
        this.addBillboard('textures/particle_smoke.png',this.DRAW_MODE_TRANSPARENT)
                .setGrid(4,400,0)
                .addBillboardFrame(0,3000,9500,0,new ColorClass(0.2,0.2,1.0),0.5)
                .addBillboardFrame(1100,3000,9000,1,new ColorClass(0.2,0.2,1.0),0.5)
                .addBillboardFrame(1600,3000,8500,0,new ColorClass(0.2,0.2,1.0),0.5)
                .addBillboardFrame(1900,3000,9500,-1,new ColorClass(0.2,0.2,1.0),0.5)
                .addBillboardFrame(2300,3000,8500,0,new ColorClass(0.2,0.2,1.0),0.5);
        
            // ambient sound
                
        this.addAmbientSound('liquid',1.0,0.0,40000,0.0,1.242,true);
    }

}
