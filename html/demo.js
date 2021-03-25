import ProjectClass from '../../../code/main/project.js';
import KillClass from '../cubes/kill.js';
import CaptainChestClass from '../entities/captain_chest.js';

export default class DemoClass extends ProjectClass
{
    mapCube(name)
    {
        switch (name) {
            case 'kill':
                return(KillClass);
        }
        
        return(null);
    }
    
    mapEffect(name)
    {
        return(null);
    }

    mapEntity(name)
    {
        if (name==='captain_chest') return(CaptainChestClass);
        return(null);
    }
}
