import ProjectEntityRemoteClass from '../../../code/project/project_entity_remote.js';

export default class EntityRemoteClass extends ProjectEntityRemoteClass
{
    initialize()
    {
        super.initialize();

        this.setModel('player');
        this.scale.setFromValues(3000,3000,3000);
    }
}
