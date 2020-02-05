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
                                    {"type":"send","entity":"@player","message":"addHealth","value":25},
                                    {"type":"sendToHold","entity":"@player","holdEntity":"weapon_pistol","message":"addAmmo","content":10},
                                    {"type":"sendToHold","entity":"@player","holdEntity":"weapon_m16","message":"addAmmo","content":50},
                                    {"type":"sendToHold","entity":"@player","holdEntity":"weapon_grenade","message":"addAmmo","content":1},
                                    {"type":"pulseInterface","element":"health","tick":500,"expand":5},
                                    {"type":"pulseInterface","element":"pistol_bullet","tick":500,"expand":5},
                                    {"type":"pulseInterface","element":"m16_bullet","tick":500,"expand":5},
                                    {"type":"pulseInterface","element":"grenade","tick":500,"expand":5},
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
