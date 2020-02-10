import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import EffectJsonClass from '../../../code/project/effect_json.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// explosion fire effect class
//

export default class EffectExplosionFireClass extends EffectJsonClass
{
    getJson()
    {
        return(
            {
                "lifeTick":1200,
                "sound":{"name":"explosion","rate":1.0,"loop":false},
                "light":
                    {
                        "frames":
                            [
                                {"tick":0,"color":{"r":1,"g":0,"b":0},"intensity":1,"exponent":1},
                                {"tick":400,"color":{"r":1,"g":0.8,"b":0},"intensity":45000,"exponent":5},
                                {"tick":1100,"color":{"r":1,"g":1,"b":0.7},"intensity":45000,"exponent":5},
                                {"tick":1200,"color":{"r":1,"g":1,"b":0.7},"intensity":1,"exponent":10},
                            ]
                    },
                "particles":
                    [
                        {
                            "bitmap":"textures/particle_blob.png","mode":"transparent","count":40,"motion":{"x":7500,"y":7500,"z":7500},"grid":"4","gridPeriod":500,"gridOffset":0,
                            "frames":
                                [
                                    {"tick":0,"spread":0.1,"width":20,"height":20,"rotate":0,"color":{"r":1,"g":0,"b":0},"alpha":0.4},
                                    {"tick":400,"spread":0.5,"width":7000,"height":7000,"rotate":90,"color":{"r":1,"g":0,"b":0},"alpha":0.4},
                                    {"tick":900,"spread":1.0,"width":7000,"height":7000,"rotate":180,"color":{"r":1,"g":0,"b":0},"alpha":0.4},
                                    {"tick":1200,"spread":0.8,"width":20,"height":20,"rotate":200,"color":{"r":1,"g":0.2,"b":0.2},"alpha":0.3}
                                ]
                        },
                        {
                            "bitmap":"textures/particle_blob.png","mode":"transparent","count":35,"motion":{"x":3300,"y":3300,"z":3300},"grid":"4","gridPeriod":500,"gridOffset":0,
                            "frames":
                                [
                                    {"tick":0,"spread":0.1,"width":20,"height":20,"rotate":180,"color":{"r":1,"g":0,"b":0},"alpha":0.4},
                                    {"tick":400,"spread":0.5,"width":7000,"height":7000,"rotate":160,"color":{"r":1,"g":0.5,"b":0},"alpha":0.4},
                                    {"tick":1000,"spread":1.0,"width":7000,"height":7000,"rotate":160,"color":{"r":1,"g":0.5,"b":0},"alpha":0.4},
                                    {"tick":1200,"spread":0.8,"width":20,"height":20,"rotate":140,"color":{"r":1,"g":0.7,"b":0.2},"alpha":0.3}
                                ]
                        },
                        {
                            "bitmap":"textures/particle_blob.png","mode":"transparent","count":25,"motion":{"x":1500,"y":1500,"z":1500},"grid":"4","gridPeriod":500,"gridOffset":0,
                            "frames":
                                [
                                    {"tick":0,"spread":0.1,"width":10,"height":10,"rotate":0,"color":{"r":1,"g":1,"b":0},"alpha":0.4},
                                    {"tick":400,"spread":0.5,"width":1500,"height":1000,"rotate":20,"color":{"r":1,"g":1,"b":0},"alpha":0.4},
                                    {"tick":1100,"spread":1.0,"width":1500,"height":1000,"rotate":20,"color":{"r":1,"g":1,"b":0},"alpha":0.4},
                                    {"tick":1200,"spread":0.8,"width":10,"height":10,"rotate":40,"color":{"r":1,"g":1,"b":0.2},"alpha":0.3}
                                ]
                        }
                    ]
            }        
        );
    }
}
