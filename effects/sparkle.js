import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import EffectClass from '../../../code/game/effect.js';

export default class SparkleClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=1000;
        
        this.addBillboard('textures/particle_hit.png',this.DRAW_MODE_ADDITIVE)
                .addBillboardFrame(0,2000,2000,0,new ColorClass(1.0,1.0,0.0),0.3)
                .addBillboardFrame(250,1500,1500,90,new ColorClass(0.3,0.3,1.0),0.6)
                .addBillboardFrame(500,1000,1000,180,new ColorClass(0.3,1.0,0.3),0.7)
                .addBillboardFrame(750,500,500,270,new ColorClass(1.0,0.3,1.0),0.6)
                .addBillboardFrame(1000,100,100,360,new ColorClass(1.0,0.3,0.3),0.3);
    }

}
