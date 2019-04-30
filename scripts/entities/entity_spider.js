import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import ModelClass from '../../../code/model/model.js';
import ImportModelClass from '../../../code/import/import_model.js';
import EntityMonsterBaseClass from '../entities/entity_monster_base.js';

//
// spider class
//

export default class EntitySpiderClass extends EntityMonsterBaseClass
{
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=2500;
        this.height=2800;
        
        this.gravityMinValue=10;
        this.gravityMaxValue=450;
        this.gravityAcceleration=20;

            // model
        
        this.setModel({"name":"spider"});
        this.scale.setFromValues(1000,1000,1000);
    }
    
    ready()
    {
        super.ready();
        
        this.startModelAnimationChunkInFrames(null,30,284,385);
    }
    
    run()
    {
        super.run();
    }
    
}
/*
1) Spider_walk: 0 – 40 fr.,
2) Spider_run: 41 – 56 fr.,
3) Spider_turm_left45%: 57 – 69 fr.,
4) Spider_turm_right45%: 70 – 82 fr.,
5) Spider_attack_A: 83 – 111 fr.,
6) Spider_attack_B: 112 – 139 fr.,
7) Spider_defend_A: 140 – 164 fr.,
8) Spider_defend_B: 165 – 195 fr.,
9) Spider_daying_A: 196 – 244 fr.,
10) Spider_daying_B: 245 – 284 fr.,
11) Spider_idle: 284 - 385 fr..
 */