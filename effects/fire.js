import PointClass from '../../../code/utility/point.js';
import EffectClass from '../../../code/game/effect.js';

export default class FireClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=-1;
        
        this.light=
            {
                "frames":
                    [
                        {"tick":0,"color":{"r":1,"g":0.9,"b":0.9},"intensity":"@intensity","exponent":1.5},
                        {"tick":1500,"color":{"r":1,"g":0.85,"b":0.8},"intensity":"@intensity","exponent":2},
                        {"tick":3000,"color":{"r":1,"g":0.9,"b":0.9},"intensity":"@intensity","exponent":1.5}
                    ]
            };
        this.billboards=
            [
                {
                    "bitmap":"textures/particle_glow.png","mode":"additive",
                    "frames":
                        [
                            {"tick":0,"width":6000,"height":6000,"rotate":0,"color":{"r":1,"g":1,"b":1},"alpha":0.85},
                            {"tick":10000,"width":6600,"height":6600,"rotate":180,"color":{"r":1,"g":1,"b":1},"alpha":0.8},
                            {"tick":20000,"width":6000,"height":6000,"rotate":360,"color":{"r":1,"g":1,"b":1},"alpha":0.85}
                        ]
                },
                {
                    "bitmap":"textures/particle_blob.png","mode":"transparent","grid":"4","gridPeriod":500,"gridOffset":0,
                    "frames":
                        [
                            {"tick":0,"width":800,"height":840,"rotate":0,"color":{"r":1.0,"g":0.2,"b":0.2},"alpha":1.0},
                            {"tick":1000,"width":640,"height":900,"rotate":0,"color":{"r":1.0,"g":0.2,"b":0.2},"alpha":1.0},
                            {"tick":2000,"width":800,"height":840,"rotate":0,"color":{"r":1.0,"g":0.2,"b":0.2},"alpha":1.0}
                        ]
                },
                {
                    "bitmap":"textures/particle_blob.png","mode":"transparent","grid":"4","gridPeriod":500,"gridOffset":1,
                    "frames":
                        [
                            {"tick":0,"width":800,"height":840,"rotate":0,"color":{"r":1.0,"g":0.2,"b":0.2},"alpha":1.0},
                            {"tick":1000,"width":780,"height":640,"rotate":0,"color":{"r":1.0,"g":0.2,"b":0.2},"alpha":1.0},
                            {"tick":2000,"width":800,"height":840,"rotate":0,"color":{"r":1.0,"g":0.2,"b":0.2},"alpha":1.0}
                        ]
                },
                {
                    "bitmap":"textures/particle_blob.png","mode":"transparent","grid":"4","gridPeriod":500,"gridOffset":0,
                    "frames":
                        [
                            {"tick":0,"width":400,"height":460,"rotate":0,"color":{"r":1.0,"g":0.5,"b":0.0},"alpha":1.0},
                            {"tick":1000,"width":360,"height":400,"rotate":0,"color":{"r":1.0,"g":0.5,"b":0.0},"alpha":1.0},
                            {"tick":2000,"width":400,"height":460,"rotate":0,"color":{"r":1.0,"g":0.5,"b":0.0},"alpha":1.0}
                        ]
                }
            ];
    }

}
