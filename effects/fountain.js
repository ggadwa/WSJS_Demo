import PointClass from '../../../code/utility/point.js';
import EffectClass from '../../../code/game/effect.js';

export default class FountainClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=-1;
    
        this.billboards=
            [
                {
                    "bitmap":"textures/particle_smoke.png","mode":"transparent","grid":"4","gridPeriod":500,"gridOffset":0,
                    "frames":
                        [
                            {"tick":0,"width":2200,"height":8500,"rotate":354,"color":{"r":0.2,"g":0.2,"b":1},"alpha":0.7},
                            {"tick":1000,"width":2200,"height":9000,"rotate":359,"color":{"r":0.2,"g":0.2,"b":1},"alpha":0.7},
                            {"tick":1500,"width":2200,"height":8500,"rotate":354,"color":{"r":0.2,"g":0.2,"b":1},"alpha":0.7},
                            {"tick":2000,"width":2200,"height":9500,"rotate":359,"color":{"r":0.2,"g":0.2,"b":1},"alpha":0.7},
                            {"tick":2300,"width":2200,"height":8500,"rotate":354,"color":{"r":0.2,"g":0.2,"b":1},"alpha":0.7}
                        ]
                },
                {
                    "bitmap":"textures/particle_smoke.png","mode":"transparent","grid":"4","gridPeriod":400,"gridOffset":0,
                    "frames":
                        [
                            {"tick":0,"width":1900,"height":7500,"rotate":1,"color":{"r":0.5,"g":0.5,"b":1},"alpha":0.7},
                            {"tick":1000,"width":1900,"height":8000,"rotate":5,"color":{"r":0.5,"g":0.5,"b":1},"alpha":0.7},
                            {"tick":1500,"width":1900,"height":7500,"rotate":1,"color":{"r":0.5,"g":0.5,"b":1},"alpha":0.7},
                            {"tick":2000,"width":1900,"height":8500,"rotate":5,"color":{"r":0.5,"g":0.5,"b":1},"alpha":0.7},
                            {"tick":2300,"width":1900,"height":7500,"rotate":1,"color":{"r":0.5,"g":0.5,"b":1},"alpha":0.7}
                        ]
                },
                {
                    "bitmap":"textures/particle_smoke.png","mode":"transparent","grid":"4","gridPeriod":400,"gridOffset":0,
                    "frames":
                        [
                            {"tick":0,"width":3000,"height":9500,"rotate":0,"color":{"r":0.2,"g":0.2,"b":1},"alpha":0.5},
                            {"tick":1000,"width":3000,"height":9000,"rotate":0,"color":{"r":0.2,"g":0.2,"b":1},"alpha":0.5},
                            {"tick":1500,"width":3000,"height":8500,"rotate":0,"color":{"r":0.2,"g":0.2,"b":1},"alpha":0.5},
                            {"tick":2000,"width":3000,"height":9500,"rotate":0,"color":{"r":0.2,"g":0.2,"b":1},"alpha":0.5},
                            {"tick":2300,"width":3000,"height":8500,"rotate":0,"color":{"r":0.2,"g":0.2,"b":1},"alpha":0.5}
                        ]
                }
            ];
    }

}
