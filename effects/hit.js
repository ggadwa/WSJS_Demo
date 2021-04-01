import PointClass from '../../../code/utility/point.js';
import EffectClass from '../../../code/game/effect.js';

export default class HitClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=150;
    
        this.billboards=
            [
                {
                    "bitmap":"textures/particle_hit.png","mode":"additive",
                    "frames":
                        [
                            {"tick":0,"width":100,"height":100,"rotate":0,"color":{"r":0.9,"g":0.7,"b":0.0},"alpha":0.3},
                            {"tick":150,"width":1500,"height":1500,"rotate":30,"color":{"r":1.0,"g":0.2,"b":0.0},"alpha":1.0}
                        ]
                }
            ];
    }

}
