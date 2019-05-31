import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EntityMonsterBaseClass from '../entities/entity_monster_base.js';

//
// beach ball class
//

export default class BeachBallClass extends ProjectEntityClass
{
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=1500;
        this.height=4500;
        
        this.gravityMinValue=10;
        this.gravityMaxValue=450;
        this.gravityAcceleration=20;
        
            // model
            
        this.setModel({"name":"crystal_ball"});
        this.scale.setFromValues(500,500,500);
    }
    
    
}
