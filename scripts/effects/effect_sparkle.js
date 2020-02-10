import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import EffectJsonClass from '../../../code/project/effect_json.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// sparkle effect class
//

export default class EffectSparkleClass extends EffectJsonClass
{
    getJson()
    {
        return(
            {
                "lifeTick":1000,
                "billboards":
                    [
                        {
                            "bitmap":"textures/particle_hit.png","mode":"additive",
                            "frames":
                                [
                                    {"tick":0,"width":100,"height":100,"rotate":0,"color":{"r":1,"g":1,"b":0},"alpha":0.3},
                                    {"tick":250,"width":400,"height":400,"rotate":90,"color":{"r":0.3,"g":0.3,"b":1},"alpha":0.6},
                                    {"tick":500,"width":1500,"height":1500,"rotate":180,"color":{"r":0.3,"g":1,"b":0.3},"alpha":0.7},
                                    {"tick":750,"width":400,"height":400,"rotate":270,"color":{"r":1,"g":0.3,"b":1},"alpha":0.6},
                                    {"tick":1000,"width":100,"height":100,"rotate":360,"color":{"r":1.0,"g":0.3,"b":0.3},"alpha":0.3}
                                ]
                        }
                    ]
            }        
        );
    }
}
