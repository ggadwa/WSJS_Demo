import PointClass from '../../../code/utility/point.js';
import ProjectMapClass from '../../../code/project/project_map.js';
import EntityPlayerClass from '../entities/entity_player.js';

export default class MapAutoGenerateClass extends ProjectMapClass
{
    getImportSettings()
    {
        return(
            {
                "name":"auto_generate_test",
                "skyBox":{"size":50000,"bitmap":"textures/skybox_test.png"},
                "autoGenerate":
                    {
                        //"randomSeed":25,
                        "roomCount":15,
                        "segmentSize":8000,
                        "stairFactor":0.5,
                        "pathTurnFactor":0.5,
                        "sideRoomFactor":0.8
                    },
                "entities":
                    [
                        {"entity":EntityPlayerClass,"name":"Player","position":{"x":30000,"y":0,"z":30000},"angle":{"x":0,"y":0,"z":0}},
                    ],
            }
        );
    }

}

