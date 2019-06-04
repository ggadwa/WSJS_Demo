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
            
        this.radius=5000;
        this.height=10000;
        
        this.gravityMinValue=10;
        this.gravityMaxValue=450;
        this.gravityAcceleration=20;
        
            // model
            
        this.setModel({"name":"beach_ball"});
        this.scale.setFromValues(5000,5000,5000);
    }
    
    
}
