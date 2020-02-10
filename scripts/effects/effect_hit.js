import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import EffectJsonClass from '../../../code/project/effect_json.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';

//
// hit effect class
//

export default class EffectHitClass extends EffectJsonClass
{
    getJson()
    {
        return(
            {
                "lifeTick":150,
                "billboards":
                    [
                        {
                            "bitmap":"textures/particle_hit.png","mode":"additive",
                            "frames":
                                [
                                    {"tick":0,"width":100,"height":100,"rotate":0,"color":{"r":0.9,"g":0.7,"b":0.0},"alpha":0.3},
                                    {"tick":150,"width":1500,"height":1500,"rotate":30,"color":{"r":1.0,"g":0.2,"b":0.0},"alpha":1.0}
                                ]
                        }
                    ]
            }        
        );
    }
}
