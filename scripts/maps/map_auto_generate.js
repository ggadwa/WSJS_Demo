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
                        "randomSeed":15,
                        "roomCount":15,
                        "roomSize":60000,
                        "roomHeight":20000,
                        "stairFactor":0.5,
                        "wallBitmap":{"color":"textures/medieval_brick_color.png","normals":"textures/medieval_brick_normals.png","specular":"textures/medieval_brick_specular.png","specularFactor":{"red":2,"green":2,"blue":2}},
                        "floorBitmap":{"color":"textures/terracotta_color.png","normals":"textures/terracotta_normals.png","specular":"textures/terracotta_specular.png","specularFactor":{"red":4,"green":4,"blue":4}},
                        "ceilingBitmap":{"color":"textures/corrugated_metal_color.png","normals":"textures/corrugated_metal_normals.png","specular":"textures/corrugated_metal_specular.png","specularFactor":{"red":5,"green":5,"blue":5}}
                    },
                "entities":
                    [
                        {"entity":EntityPlayerClass,"name":"Player","position":{"x":30000,"y":0,"z":30000},"angle":{"x":0,"y":0,"z":0}},
                    ],
            }
        );
    }

}

