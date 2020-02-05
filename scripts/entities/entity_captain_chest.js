import PointClass from '../../../code/utility/point.js';
import EntityJsonClass from '../../../code/project/entity_json.js';

//
// captain chest class
//

export default class EntityCaptainChestClass extends EntityJsonClass
{
    getJson()
    {
        return(
            {
                "model": {"name":"captain_chest","scale":{"x":50,"y":50,"z":50}},
                "setup": {"radius":2800,"height":2200},
                "draw": {"type":"normal"},
                "readyActions":
                    [
                        {"type":"animationStart","startFrame":0,"endFrame":1}
                    ],
                "events":
                    [
                        {
                            "conditions":
                                [
                                    {"type":"key","key":"e"},
                                    {"type":"nearEntity","entity":"@player","distance":7000}
                                ],
                            "actions":
                                [
                                    {"type":"animationStart","startFrame":1,"endFrame":65},
                                    {"type":"animationQueue","startFrame":65,"endFrame":66},
                                    //{"type":"send","entity":"@player","message":"addHealth","content":25},
                                    {"type":"send","entity":"@player","message":"addPistolAmmo","content":10},
                                    //{"type":"send","entity":"@player","message":"addM16Ammo","content":50},
                                    //{"type":"send","entity":"@player","message":"addGrenadeAmmo","content":1},
                                    {"type":"playSound","name":"chime","rate":1.0,"loop":false},
                                    {"type":"trigger","name":"@data.trigger"}
                                ],
                            "fireOnce":true
                        }
                    ]
            }
                    
        );
    }
}
