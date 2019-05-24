import PointClass from '../../../code/utility/point.js';
import ProjectMapClass from '../../../code/project/project_map.js';
import EntityPlayerClass from '../entities/entity_player.js';
import EntityMultiplayerBotClass from '../entities/entity_multiplayer_bot.js';
import EntityPickupBerettaClass from '../entities/entity_pickup_beretta.js';
import EntityPickupM16Class from '../entities/entity_pickup_m16.js';
import EntityPickupGrenadeClass from '../entities/entity_pickup_grenade.js';
import EntityPickupChickenLegClass from '../entities/entity_pickup_chicken_leg.js';
import EntityPickupArmorClass from '../entities/entity_pickup_armor.js';
import EffectFireClass from '../effects/effect_fire.js';

export default class MapDualCastlesClass extends ProjectMapClass
{
    getImportSettings()
    {
        return(
            {
                "name":"dual_castles",
                "scale":700,
                "skyBox":{"size":50000,"bitmap":"textures/skybox.png"},
                "lights":
                    [
                        {"position":{"x":0,"y":100000,"z":0},"color":{"r":0.2,"g":0.2,"b":0.2},"intensity":300000,"exponent":0.0},
                        
                        {"mesh":"blue_crystal_87","color":{"r":0.3,"g":0.3,"b":0.8},"intensity":80000,"exponent":1.0},
                        {"mesh":"blue_crystal_69","color":{"r":0.3,"g":0.3,"b":0.8},"intensity":90000,"exponent":1.0},
                        {"mesh":"blue_crystal_39","color":{"r":0.3,"g":0.3,"b":0.8},"intensity":80000,"exponent":1.0},
                        {"mesh":"blue_crystal_09","color":{"r":0.3,"g":0.3,"b":0.8},"intensity":90000,"exponent":1.0},
                        {"position":{"x":-342,"y":21545,"z":201566},"color":{"r":0.4,"g":0.4,"b":0.8},"intensity":150000,"exponent":1.5},
                        {"position":{"x":127552,"y":22390,"z":125862},"color":{"r":0.4,"g":0.4,"b":0.8},"intensity":170000,"exponent":1.5},
                        
                        {"mesh":"red_crystal_33","color":{"r":0.8,"g":0.3,"b":0.3},"intensity":80000,"exponent":1.0},
                        {"mesh":"red_crystal_82","color":{"r":0.8,"g":0.3,"b":0.3},"intensity":90000,"exponent":1.0},
                        {"mesh":"red_crystal_49","color":{"r":0.8,"g":0.3,"b":0.3},"intensity":80000,"exponent":1.0},
                        {"mesh":"red_crystal_73","color":{"r":0.8,"g":0.3,"b":0.3},"intensity":90000,"exponent":1.0},
                        {"position":{"x":-2819,"y":25306,"z":-222607},"color":{"r":0.8,"g":0.4,"b":0.4},"intensity":150000,"exponent":1.5},
                        {"position":{"x":-126357,"y":21545,"z":-116208},"color":{"r":0.8,"g":0.4,"b":0.4},"intensity":170000,"exponent":1.5}
                    ],
                "glows":
                    [
                        {"bitmap":"crystal_blue_color","url":"textures/blue_crystal_glow.png","frequency":800,"min":0.2,"max":0.7},
                        {"bitmap":"crystal_red_color","url":"textures/red_crystal_glow.png","frequency":800,"min":0.2,"max":0.7}
                    ],
                "liquids":
                    [
                        {
                            "bitmap":"textures/water.png","waveSize":5000,"wavePeriod":4000,"waveHeight":400,"waveUVStamp":0.1,
                            "uShift":0.00005,"vShift":0.0,"tint":{"r":0.2,"g":0.2,"b":0.5},
                            "xBound":{"min":-215000,"max":215000},"yBound":{"min":-28000,"max":-11500},"zBound":{"min":-40000,"max":75000}
                        }
                    ],
                "noCollideBitmaps":["birch_tree_branch_color","bush_color","crystal_blue_color","crystal_red_color"],
                "simpleCollideMeshes":["border_brick_","rock_","lantern_","latern_","wood_plank_","pass_woods_","window_"],
                "meshNoBumpMeshes":["tower_pilars_"],
                "effects":
                    [
                        {"effect":EffectFireClass,"data":{"mesh":"latern_lamp01","offset":{"x":0,"y":-550,"z":0},"intensity":40000}},
                        {"effect":EffectFireClass,"data":{"mesh":"latern_lamp02","offset":{"x":0,"y":-550,"z":0},"intensity":40000}},
                        {"effect":EffectFireClass,"data":{"mesh":"latern_lamp003","offset":{"x":0,"y":-550,"z":0},"intensity":40000}},
                        {"effect":EffectFireClass,"data":{"mesh":"latern_lamp004","offset":{"x":0,"y":-550,"z":0},"intensity":40000}},
                        {"effect":EffectFireClass,"data":{"mesh":"latern_lamp005","offset":{"x":0,"y":-550,"z":0},"intensity":40000}},
                        {"effect":EffectFireClass,"data":{"mesh":"latern_lamp006","offset":{"x":0,"y":-550,"z":0},"intensity":40000}},
                        {"effect":EffectFireClass,"data":{"mesh":"LAMP14","offset":{"x":-800,"y":-750,"z":0},"intensity":14000}},
                        {"effect":EffectFireClass,"data":{"mesh":"LAMP16","offset":{"x":0,"y":-750,"z":-900},"intensity":12000}},
                        {"effect":EffectFireClass,"data":{"mesh":"LAMP08","offset":{"x":0,"y":-750,"z":900},"intensity":12000}},
                        {"effect":EffectFireClass,"data":{"mesh":"LAMP10","offset":{"x":800,"y":-750,"z":0},"intensity":14000}}
                    ],
                "movements":
                    [
                        {
                            "meshes":["RedPlatform_01"],
                            "moves":
                                [
                                    {"tick":5000,"move":{"x":0,"y":0,"z":0},"sound":"stone_platform","soundMaxDistance":50000},
                                    {"tick":2000,"move":{"x":0,"y":0,"z":0},"trigger":"platform_top"},
                                    {"tick":5000,"move":{"x":0,"y":-12600,"z":0},"sound":"stone_platform","soundMaxDistance":50000},
                                    {"tick":2000,"move":{"x":0,"y":-12600,"z":0},"trigger":"platform_bottom"}
                                ]
                        },
                        {
                            "meshes":["RedPlatform_02"],
                            "moves":
                                [
                                    {"tick":4000,"move":{"x":0,"y":0,"z":0},"sound":"stone_platform","soundMaxDistance":50000},
                                    {"tick":2000,"move":{"x":0,"y":0,"z":0}},
                                    {"tick":4000,"move":{"x":0,"y":-12600,"z":0},"sound":"stone_platform","soundMaxDistance":50000},
                                    {"tick":2000,"move":{"x":0,"y":-12600,"z":0}}
                                ]
                        },
                        {
                            "meshes":["RedPlatform_03"],
                            "moves":
                                [
                                    {"tick":6000,"move":{"x":0,"y":0,"z":0},"sound":"stone_platform","soundMaxDistance":50000},
                                    {"tick":2000,"move":{"x":0,"y":0,"z":0}},
                                    {"tick":6000,"move":{"x":0,"y":-12600,"z":0},"sound":"stone_platform","soundMaxDistance":50000},
                                    {"tick":2000,"move":{"x":0,"y":-12600,"z":0}}
                                ]
                        },
                        {
                            "meshes":["BluePlatform_01"],
                            "moves":
                                [
                                    {"tick":5000,"move":{"x":0,"y":0,"z":0},"sound":"stone_platform","soundMaxDistance":50000},
                                    {"tick":2000,"move":{"x":0,"y":0,"z":0},"trigger":"platform_top"},
                                    {"tick":5000,"move":{"x":0,"y":-12600,"z":0},"sound":"stone_platform","soundMaxDistance":50000},
                                    {"tick":2000,"move":{"x":0,"y":-12600,"z":0},"trigger":"platform_bottom"}
                                ]
                        },
                        {
                            "meshes":["BluePlatform_02"],
                            "moves":
                                [
                                    {"tick":4000,"move":{"x":0,"y":0,"z":0},"sound":"stone_platform","soundMaxDistance":50000},
                                    {"tick":2000,"move":{"x":0,"y":0,"z":0}},
                                    {"tick":4000,"move":{"x":0,"y":-12600,"z":0},"sound":"stone_platform","soundMaxDistance":50000},
                                    {"tick":2000,"move":{"x":0,"y":-12600,"z":0}}
                                ]
                        },
                        {
                            "meshes":["BluePlatform_03"],
                            "moves":
                                [
                                    {"tick":6000,"move":{"x":0,"y":0,"z":0},"sound":"stone_platform","soundMaxDistance":50000},
                                    {"tick":2000,"move":{"x":0,"y":0,"z":0}},
                                    {"tick":6000,"move":{"x":0,"y":-12600,"z":0},"sound":"stone_platform","soundMaxDistance":50000},
                                    {"tick":2000,"move":{"x":0,"y":-12600,"z":0}}
                                ]
                        }
                    ],
                "paths":
                    [
                        {"position":{"x":-27379,"y":22839,"z":-28405},"links":[63,64],"key":"ammo_beretta"},
                        {"position":{"x":-27648,"y":22839,"z":28674},"links":[63,66,44],"key":"ammo_beretta"},
                        {"position":{"x":28337,"y":22839,"z":28558},"links":[66,65],"key":"ammo_beretta"},
                        {"position":{"x":27596,"y":22839,"z":-29058},"links":[65,64,4],"key":"ammo_beretta"},
                        {"position":{"x":66908,"y":22839,"z":-28681},"links":[3,78]},
                        {"position":{"x":66685,"y":22839,"z":-110014},"links":[78,80],"key":"ammo_m16"},
                        {"position":{"x":15920,"y":27845,"z":-109427},"links":[79,7]},
                        {"position":{"x":16215,"y":27845,"z":-96868},"links":[6,8]},
                        {"position":{"x":-29289,"y":27845,"z":-96811},"links":[7,9]},
                        {"position":{"x":-29545,"y":27845,"z":-110488},"links":[8,10]},
                        {"position":{"x":-16822,"y":27851,"z":-110104},"links":[9,11,111]},
                        {"position":{"x":-16989,"y":27851,"z":-115999},"links":[10,12,110],"data":[{"link":12,"trigger":"platform_top"}]},
                        {"position":{"x":-2451,"y":15263,"z":-116302},"altPosition":{"x":-2451,"y":27863,"z":-116302},"links":[11,113],"data":[{"link":113,"trigger":"platform_bottom"},{"link":11,"trigger":"platform_top"}]},
                        {"position":{"x":-4186,"y":14581,"z":-98397},"links":[113,14]},
                        {"position":{"x":-18157,"y":14581,"z":-99757},"links":[13,106,116]},
                        {"position":{"x":-18733,"y":12620,"z":-80480},"links":[106,16]},
                        {"position":{"x":-19632,"y":3451,"z":-58515},"links":[15,100,45],"key":"ammo_m16_Y"},
                        {"position":{"x":-41619,"y":2430,"z":-47973},"links":[100,18,45]},
                        {"position":{"x":-62810,"y":1223,"z":-41450},"links":[17,19]},
                        {"position":{"x":-77485,"y":1190,"z":-41372},"links":[18,20]},
                        {"position":{"x":-92250,"y":1912,"z":-45628},"links":[19,21,105]},
                        {"position":{"x":-96998,"y":1830,"z":-42725},"links":[20,22]},
                        {"position":{"x":-100090,"y":4297,"z":-24868},"links":[21,86]},
                        {"position":{"x":-99736,"y":2950,"z":46264},"links":[86,85]},
                        {"position":{"x":-89169,"y":3565,"z":87971},"links":[85,25]},
                        {"position":{"x":-63688,"y":3828,"z":89212},"links":[24,26]},
                        {"position":{"x":-49883,"y":3828,"z":83824},"links":[25,81]},
                        {"position":{"x":-49767,"y":1838,"z":50574},"links":[81,28,82]},
                        {"position":{"x":-36457,"y":1941,"z":51185},"links":[27,29]},
                        {"position":{"x":-23490,"y":1619,"z":48843},"links":[28,30]},
                        {"position":{"x":-4792,"y":1645,"z":46896},"links":[29,31,99]},
                        {"position":{"x":9009,"y":2611,"z":54057},"links":[30,32]},
                        {"position":{"x":16599,"y":3381,"z":61587},"links":[31,33,62],"key":"ammo_m16"},
                        {"position":{"x":18631,"y":12620,"z":81244},"links":[32,107]},
                        {"position":{"x":18191,"y":14581,"z":98674},"links":[107,35,114]},
                        {"position":{"x":4537,"y":14581,"z":99814},"links":[34,112]},
                        {"position":{"x":2451,"y":15263,"z":116525},"altPosition":{"x":2451,"y":27863,"z":116525},"links":[112,37],"data":[{"link":37,"trigger":"platform_top"},{"link":112,"trigger":"platform_bottom"}]},
                        {"position":{"x":15944,"y":27851,"z":116948},"links":[38,109,36],"data":[{"link":36,"trigger":"platform_top"}]},
                        {"position":{"x":16166,"y":27851,"z":110469},"links":[37,39,108]},
                        {"position":{"x":29053,"y":27845,"z":110783},"links":[38,40]},
                        {"position":{"x":29001,"y":27845,"z":95929},"links":[39,41]},
                        {"position":{"x":-16410,"y":27845,"z":96916},"links":[40,42]},
                        {"position":{"x":-16887,"y":27845,"z":109412},"links":[41,68]},
                        {"position":{"x":-67238,"y":22839,"z":109370},"links":[67,69],"key":"ammo_m16"},
                        {"position":{"x":-66641,"y":22839,"z":28396},"links":[69,1]},
                        {"position":{"x":-4833,"y":2692,"z":-46941},"links":[16,46,17]},
                        {"position":{"x":10785,"y":2728,"z":-46132},"links":[45,47]},
                        {"position":{"x":25733,"y":3538,"z":-49294},"links":[46,48]},
                        {"position":{"x":41564,"y":4557,"z":-50012},"links":[47,49,87]},
                        {"position":{"x":50217,"y":6536,"z":-57284},"links":[48,50]},
                        {"position":{"x":49162,"y":8157,"z":-70377},"links":[49,51]},
                        {"position":{"x":49340,"y":6362,"z":-87351},"links":[50,52]},
                        {"position":{"x":63929,"y":6715,"z":-89034},"links":[51,53]},
                        {"position":{"x":88624,"y":2457,"z":-88755},"links":[52,54]},
                        {"position":{"x":97777,"y":1044,"z":-70751},"links":[53,55]},
                        {"position":{"x":99778,"y":1965,"z":-48445},"links":[54,92,91]},
                        {"position":{"x":100802,"y":5854,"z":21364},"links":[92,57]},
                        {"position":{"x":97716,"y":-22,"z":35772},"links":[56,58]},
                        {"position":{"x":91058,"y":568,"z":42258},"links":[57,59,98]},
                        {"position":{"x":77753,"y":692,"z":40529},"links":[58,60]},
                        {"position":{"x":62966,"y":928,"z":40717},"links":[59,61]},
                        {"position":{"x":46877,"y":1923,"z":47767},"links":[60,62]},
                        {"position":{"x":29869,"y":2502,"z":52077},"links":[61,32,93,99]},
                        {"position":{"x":-27197,"y":24118,"z":-528},"links":[0,1,70]},
                        {"position":{"x":-918,"y":24118,"z":-27828},"links":[0,3,72]},
                        {"position":{"x":28220,"y":24121,"z":-64},"links":[3,2,74]},
                        {"position":{"x":645,"y":24118,"z":28438},"links":[2,1,76]},
                        {"position":{"x":-53317,"y":23422,"z":108962},"links":[68,43]},
                        {"position":{"x":-30224,"y":28193,"z":109615},"links":[67,42]},
                        {"position":{"x":-66707,"y":22839,"z":68657},"links":[43,44]},
                        {"position":{"x":-7899,"y":19222,"z":-832},"links":[63,71,77]},
                        {"position":{"x":-7073,"y":19222,"z":-8458},"links":[70,72]},
                        {"position":{"x":-219,"y":19222,"z":-9511},"links":[71,73,64]},
                        {"position":{"x":7355,"y":19222,"z":-7391},"links":[72,74]},
                        {"position":{"x":8798,"y":19222,"z":-148},"links":[73,75,65]},
                        {"position":{"x":6995,"y":19222,"z":8087},"links":[74,76]},
                        {"position":{"x":568,"y":19222,"z":9963},"links":[75,77,66]},
                        {"position":{"x":-5751,"y":19222,"z":6758},"links":[76,70]},
                        {"position":{"x":67140,"y":22839,"z":-67882},"links":[4,5]},
                        {"position":{"x":30157,"y":28193,"z":-109714},"links":[80,6]},
                        {"position":{"x":51315,"y":23501,"z":-109784},"links":[79,5]},
                        {"position":{"x":-52474,"y":3203,"z":65648},"links":[27,26]},
                        {"position":{"x":-59880,"y":1652,"z":49221},"links":[27,83]},
                        {"position":{"x":-77722,"y":1249,"z":48928},"links":[82,84]},
                        {"position":{"x":-86597,"y":1795,"z":57138},"links":[83,85]},
                        {"position":{"x":-97504,"y":1504,"z":58471},"links":[23,24,84]},
                        {"position":{"x":-99799,"y":11021,"z":13577},"links":[23,22],"key":"weapon_m16"},
                        {"position":{"x":51378,"y":4907,"z":-49968},"links":[48,88]},
                        {"position":{"x":66486,"y":4361,"z":-49192},"links":[87,89]},
                        {"position":{"x":79778,"y":1551,"z":-49836},"links":[88,90]},
                        {"position":{"x":86351,"y":1402,"z":-56973},"links":[89,91]},
                        {"position":{"x":95334,"y":516,"z":-58767},"links":[90,55]},
                        {"position":{"x":99459,"y":11069,"z":-11611},"links":[55,56],"key":"weapon_m16"},
                        {"position":{"x":33656,"y":2988,"z":57367},"links":[62,94]},
                        {"position":{"x":43333,"y":3412,"z":66152},"links":[93,95]},
                        {"position":{"x":54102,"y":3541,"z":75278},"links":[94,96]},
                        {"position":{"x":69959,"y":3414,"z":83673},"links":[95,97]},
                        {"position":{"x":82679,"y":2668,"z":74060},"links":[96,98]},
                        {"position":{"x":89785,"y":1905,"z":60894},"links":[97,58]},
                        {"position":{"x":13902,"y":2040,"z":47740},"links":[62,30]},
                        {"position":{"x":-32701,"y":3311,"z":-54823},"links":[16,17,101]},
                        {"position":{"x":-41629,"y":3573,"z":-65197},"links":[100,102]},
                        {"position":{"x":-57509,"y":3576,"z":-75315},"links":[101,103]},
                        {"position":{"x":-70228,"y":3528,"z":-77512},"links":[102,104]},
                        {"position":{"x":-81592,"y":3096,"z":-68790},"links":[103,105]},
                        {"position":{"x":-88730,"y":2664,"z":-56181},"links":[104,20]},
                        {"position":{"x":-19200,"y":14603,"z":-91400},"links":[14,15]},
                        {"position":{"x":18812,"y":14603,"z":91379},"links":[33,34]},
                        {"position":{"x":195,"y":27851,"z":109182},"links":[38],"key":"health"},
                        {"position":{"x":17192,"y":27851,"z":137058},"links":[37],"key":"weapon_grenade"},
                        {"position":{"x":-17561,"y":27851,"z":-136488},"links":[11],"key":"weapon_grenade"},
                        {"position":{"x":-934,"y":27851,"z":-109705},"links":[10],"key":"health"},
                        {"position":{"x":2530,"y":14581,"z":109444},"links":[36,35],"data":[{"link":36,"trigger":"platform_bottom"}]},
                        {"position":{"x":-2766,"y":14581,"z":-109302},"links":[13,12],"data":[{"link":12,"trigger":"platform_bottom"}]},
                        {"position":{"x":14586,"y":14581,"z":106023},"links":[34,115]},
                        {"position":{"x":15596,"y":14581,"z":118012},"links":[114]},
                        {"position":{"x":-14188,"y":14581,"z":-106166},"links":[14,117]},
                        {"position":{"x":-16042,"y":14581,"z":-117774},"links":[116]}
                    ],
                "entities":
                    [
                        {"entity":EntityPlayerClass,"name":"Player","position":{"x":-28000,"y":24124,"z":0},"angle":{"x":0,"y":90,"z":0}},
                        {"entity":EntityMultiplayerBotClass,"name":"Caesar","botCountIndex":0},
                        {"entity":EntityMultiplayerBotClass,"name":"Vespasian","botCountIndex":1},
                        {"entity":EntityMultiplayerBotClass,"name":"Hadrian","botCountIndex":2},
                        {"entity":EntityMultiplayerBotClass,"name":"Augustus","botCountIndex":3},
                        {"entity":EntityMultiplayerBotClass,"name":"Trajan","botCountIndex":4},
                        {"entity":EntityMultiplayerBotClass,"name":"Tiberius","botCountIndex":5},
                        {"entity":EntityMultiplayerBotClass,"name":"Caligula","botCountIndex":6},
                        {"entity":EntityMultiplayerBotClass,"name":"Claudius","botCountIndex":7},
                        {"entity":EntityMultiplayerBotClass,"name":"Nero","botCountIndex":8},
                        {"entity":EntityMultiplayerBotClass,"name":"Commodus","botCountIndex":9},
                        {"entity":EntityPickupBerettaClass,"name":"beretta_ammo_01","position":{"x":-28242,"y":24839,"z":-28541},"data":{"ammo":true}},
                        {"entity":EntityPickupBerettaClass,"name":"beretta_ammo_02","position":{"x":28074,"y":24839,"z":28166},"data":{"ammo":true}},
                        {"entity":EntityPickupBerettaClass,"name":"beretta_ammo_03","position":{"x":-28105,"y":24839,"z":28435},"data":{"ammo":true}},
                        {"entity":EntityPickupBerettaClass,"name":"beretta_ammo_04","position":{"x":27567,"y":24839,"z":-28819},"data":{"ammo":true}},
                        {"entity":EntityPickupM16Class,"name":"m16_01","position":{"x":100288,"y":13071,"z":-11516},"data":{"ammo":false}},
                        {"entity":EntityPickupM16Class,"name":"m16_02","position":{"x":-100348,"y":13008,"z":14111},"data":{"ammo":false}},
                        {"entity":EntityPickupM16Class,"name":"m16_ammo_01","position":{"x":-66877,"y":24839,"z":108129},"data":{"ammo":true}},
                        {"entity":EntityPickupM16Class,"name":"m16_ammo_02","position":{"x":66855,"y":24839,"z":-109492},"data":{"ammo":true}},
                        {"entity":EntityPickupM16Class,"name":"m16_ammo_03","position":{"x":17324,"y":5348,"z":60563},"data":{"ammo":true}},
                        {"entity":EntityPickupM16Class,"name":"m16_ammo_04","position":{"x":-18407,"y":5454,"z":-58658},"data":{"ammo":true}},
                        {"entity":EntityPickupGrenadeClass,"name":"grenade_01","position":{"x":16640,"y":29851,"z":136013}},
                        {"entity":EntityPickupGrenadeClass,"name":"grenade_02","position":{"x":-17541,"y":29851,"z":-136473}},
                        {"entity":EntityPickupChickenLegClass,"name":"health_01","position":{"x":1468,"y":29851,"z":109299}},
                        {"entity":EntityPickupChickenLegClass,"name":"health_02","position":{"x":-1789,"y":29851,"z":-108954}},
                        {"entity":EntityPickupArmorClass,"name":"armor_01","position":{"x":-342,"y":6000,"z":201566}},
                        {"entity":EntityPickupArmorClass,"name":"armor_02","position":{"x":-2819,"y":12000,"z":-222607}}
                    ]
            }
        );
    }
}

