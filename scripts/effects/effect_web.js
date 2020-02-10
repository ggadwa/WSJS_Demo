import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import ColorClass from '../../../code/utility/color.js';
import ProjectEffectClass from '../../../code/project/project_effect.js';
import EffectJsonClass from '../../../code/project/effect_json.js';

//
// web effect class
//

export default class EffectWebClass extends EffectJsonClass
{
    getJson()
    {
        return(
            {
                "triangles":
                    [
                        {
                            "bitmap":"textures/web.png","mode":"transparent","wave":true,"wavePeriod":10000,"waveSize":80,"waveRandomStart":true,"v0":this.data.v0,"v1":this.data.v1,"v2":this.data.v2,
                            "frames":
                                [
                                    {"tick":0,"width":3000,"height":3000,"rotate":0,"color":{"r":1,"g":1.0,"b":1.0},"alpha":0.5}
                                ]
                        },
                    ]
            }        
        );
    }
}
