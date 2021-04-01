import PointClass from '../../../code/utility/point.js';
import EffectClass from '../../../code/game/effect.js';

export default class SparkleClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=1000;
    
        this.billboards=
            [
                {
                    "bitmap":"textures/particle_hit.png","mode":"additive",
                    "frames":
                        [
                            {"tick":0,"width":2000,"height":2000,"rotate":0,"color":{"r":1,"g":1,"b":0},"alpha":0.3},
                            {"tick":250,"width":1500,"height":1500,"rotate":90,"color":{"r":0.3,"g":0.3,"b":1},"alpha":0.6},
                            {"tick":500,"width":1000,"height":1000,"rotate":180,"color":{"r":0.3,"g":1,"b":0.3},"alpha":0.7},
                            {"tick":750,"width":500,"height":500,"rotate":270,"color":{"r":1,"g":0.3,"b":1},"alpha":0.6},
                            {"tick":1000,"width":100,"height":100,"rotate":360,"color":{"r":1.0,"g":0.3,"b":0.3},"alpha":0.3}
                        ]
                }
            ];
    }

}
