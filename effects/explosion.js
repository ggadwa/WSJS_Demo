import PointClass from '../../../code/utility/point.js';
import EffectClass from '../../../code/game/effect.js';

export default class ExplosionClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=3000;
    
        this.light=
            {
                "frames":
                    [
                        {"tick":0,"color":{"r":1,"g":0,"b":0},"intensity":1,"exponent":1},
                        {"tick":400,"color":{"r":1,"g":0.8,"b":0},"intensity":45000,"exponent":5},
                        {"tick":1100,"color":{"r":1,"g":1,"b":0.7},"intensity":45000,"exponent":5},
                        {"tick":1200,"color":{"r":1,"g":1,"b":0.7},"intensity":1,"exponent":10},
                        {"tick":3000,"color":{"r":0,"g":0,"b":0},"intensity":1,"exponent":1}
                    ]
            };
        this.particles=
            [
                {
                    "bitmap":"textures/particle_smoke.png","mode":"transparent","count":60,"motion":{"x":25000,"y":25000,"z":25000},"grid":"4","gridPeriod":600,"gridOffset":0,
                    "frames":
                        [
                            {"tick":0,"spread":0.1,"width":500,"height":500,"rotate":0,"color":{"r":1,"g":1,"b":1},"alpha":0.1},
                            {"tick":2300,"spread":0.8,"width":15000,"height":15000,"rotate":180,"color":{"r":1,"g":1,"b":1},"alpha":1.0},
                            {"tick":3000,"spread":1.0,"width":25000,"height":25000,"rotate":220,"color":{"r":0.7,"g":0.7,"b":0.7},"alpha":0.1}
                        ]
                },
                {
                    "bitmap":"textures/particle_blob.png","mode":"transparent","count":50,"motion":{"x":11000,"y":11000,"z":11000},"grid":"4","gridPeriod":500,"gridOffset":0,
                    "frames":
                        [
                            {"tick":0,"spread":0.1,"width":20,"height":20,"rotate":0,"color":{"r":1,"g":0,"b":0},"alpha":0.4},
                            {"tick":400,"spread":0.5,"width":7000,"height":7000,"rotate":30,"color":{"r":1,"g":0,"b":0},"alpha":0.4},
                            {"tick":900,"spread":1.0,"width":7000,"height":7000,"rotate":60,"color":{"r":1,"g":0,"b":0},"alpha":0.4},
                            {"tick":1200,"spread":0.9,"width":6500,"height":6500,"rotate":70,"color":{"r":1,"g":0.2,"b":0.2},"alpha":0.2},
                            {"tick":1201,"spread":0.9,"width":6000,"height":6000,"rotate":70,"color":{"r":1,"g":0.2,"b":0.2},"alpha":0.05},
                            {"tick":3000,"spread":0.9,"width":5500,"height":5500,"rotate":70,"color":{"r":1,"g":0.2,"b":0.2},"alpha":0.0}
                        ]
                },
                {
                    "bitmap":"textures/particle_blob.png","mode":"transparent","count":35,"motion":{"x":5300,"y":5300,"z":5300},"grid":"4","gridPeriod":500,"gridOffset":0,
                    "frames":
                        [
                            {"tick":0,"spread":0.1,"width":20,"height":20,"rotate":180,"color":{"r":1,"g":0,"b":0},"alpha":0.4},
                            {"tick":400,"spread":0.5,"width":6000,"height":6000,"rotate":160,"color":{"r":1,"g":0.5,"b":0},"alpha":0.4},
                            {"tick":1000,"spread":1.0,"width":6000,"height":6000,"rotate":140,"color":{"r":1,"g":0.5,"b":0},"alpha":0.4},
                            {"tick":1150,"spread":0.9,"width":5500,"height":5500,"rotate":130,"color":{"r":1,"g":0.7,"b":0.2},"alpha":0.2},
                            {"tick":1151,"spread":0.9,"width":5000,"height":5000,"rotate":130,"color":{"r":1,"g":0.7,"b":0.2},"alpha":0.05},
                            {"tick":3000,"spread":0.9,"width":4500,"height":4500,"rotate":130,"color":{"r":1,"g":0.7,"b":0.2},"alpha":0.0}
                        ]
                },
                {
                    "bitmap":"textures/particle_blob.png","mode":"transparent","count":25,"motion":{"x":2500,"y":2500,"z":2500},"grid":"4","gridPeriod":500,"gridOffset":0,
                    "frames":
                        [
                            {"tick":0,"spread":0.1,"width":10,"height":10,"rotate":0,"color":{"r":1,"g":1,"b":0},"alpha":0.4},
                            {"tick":400,"spread":0.5,"width":1500,"height":1500,"rotate":10,"color":{"r":1,"g":1,"b":0},"alpha":0.4},
                            {"tick":1100,"spread":1.0,"width":1500,"height":1500,"rotate":20,"color":{"r":1,"g":1,"b":0},"alpha":0.4},
                            {"tick":1100,"spread":0.9,"width":1000,"height":1000,"rotate":30,"color":{"r":1,"g":1,"b":0.2},"alpha":0.2},
                            {"tick":1101,"spread":0.9,"width":500,"height":500,"rotate":30,"color":{"r":1,"g":1,"b":0.2},"alpha":0.05},
                            {"tick":3000,"spread":0.9,"width":100,"height":100,"rotate":30,"color":{"r":1,"g":1,"b":0.2},"alpha":0.0}
                        ]
                }
            ];
        
        this.startSound={"name":"explosion","rate":1.0,"randomRateAdd":-0.4,"distance":50000,"loopStart":0,"loopEnd":0,"loop":false};
    }
    
    initialize()
    {
        if (!super.initialize()) return(false);
        
        this.playSound(this.startSound);
        this.shakeCamera(30000,40,2000);
        this.damageForRadius(20000,50);
        
        return(true);
    }

}
