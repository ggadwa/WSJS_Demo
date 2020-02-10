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
                "ready":
                    {
                        "actions":
                            [
                                {"type":"calc","set":"open","code":false},
                                {"type":"animationStart","startFrame":0,"endFrame":1}
                            ]
                    },
                "events":
                    [
                        {
                            "conditions":
                                [
                                    {"type":"calc","code":"open!=true"},
                                    {"type":"key","key":"e"},
                                    {"type":"nearEntity","entity":"@player","distance":7000}
                                ],
                            "actions":
                                [
                                    {"type":"calc","set":"open","code":true},
                                    {"type":"animationStart","startFrame":1,"endFrame":65},
                                    {"type":"animationQueue","startFrame":65,"endFrame":66},
                                    //{"type":"send","entity":"@player","name":"addHealth","content":25},
                                    {"type":"send","entity":"@player","name":"addPistolAmmo","content":10},
                                    //{"type":"send","entity":"@player","name":"addM16Ammo","content":50},
                                    //{"type":"send","entity":"@player","name":"addGrenadeAmmo","content":1},
                                    {"type":"playSound","name":"chime","rate":1.0,"loop":false},
                                    {"type":"trigger","name":"@data.trigger"}
                                ]
                        }
                    ]
            }
                    
        );
    }
}
