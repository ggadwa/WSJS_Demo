import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import EffectClass from '../../../code/game/effect.js';

export default class HitClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=150;
        
        this.addBillboard('textures/particle_hit.png',this.DRAW_MODE_ADDITIVE)
                .addBillboardFrame(0,100,100,0,new ColorClass(0.9,0.7,0.0),0.3)
                .addBillboardFrame(150,1500,1500,30,new ColorClass(1.0,0.2,0.0),1.0);
    }

}
