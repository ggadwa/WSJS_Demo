import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import EffectJsonClass from '../../../code/project/effect_json.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// explosion smoke effect class
//

export default class EffectExplosionSmokeClass extends EffectJsonClass
{
    getJson()
    {
        return(
            {
                "lifeTick":3000,
                "particles":
                    [
                        {
                            "bitmap":"textures/particle_smoke.png","mode":"transparent","count":60,"motion":{"x":20000,"y":20000,"z":20000},"grid":"4","gridPeriod":600,"gridOffset":0,
                            "frames":
                                [
                                    {"tick":0,"spread":0.1,"width":500,"height":500,"rotate":0,"color":{"r":1,"g":1,"b":1},"alpha":0.1},
                                    {"tick":2300,"spread":1.0,"width":10000,"height":10000,"rotate":180,"color":{"r":1,"g":1,"b":1},"alpha":1.0},
                                    {"tick":3000,"spread":0.8,"width":8000,"height":8000,"rotate":90,"color":{"r":0.7,"g":0.7,"b":0.7},"alpha":0.1}
                                ]
                        }
                    ]
            }        
        );
    }
}
