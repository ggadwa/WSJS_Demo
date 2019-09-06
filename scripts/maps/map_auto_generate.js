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
                "scale":700,
                "skyBox":{"size":50000,"bitmap":"textures/skybox_test.png"},
                "autoGenerate":
                    {
                        "temp":"temp"
                    },
                "entities":
                    [
                        {"entity":EntityPlayerClass,"name":"Player","position":{"x":0,"y":0,"z":0},"angle":{"x":0,"y":0,"z":0}},
                    ],
            }
        );
    }

}

