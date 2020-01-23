import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';

//
// captain chest class
//

export default class EntityCaptainChestClass extends ProjectEntityClass
{
    static OPEN_MAX_DISTANCE=8000;
    
    opened=false;
    
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=2800;
        this.height=2200;
        
        this.opened=false;
        
            // chest model
            
        this.setModel('captain_chest');
        this.scale.setFromValues(50,50,50);
    }
        
    ready()
    {
        this.opened=false;
        this.startModelAnimationChunkInFrames(null,30,0,1);
    }
    
    run()
    {
        let player;
        
            // nothing to do if opened
            
        if (this.opened) return;
        
            // is the E key down
            // and player close enough to open?
        
        if (!this.isKeyDown(69)) return;
        if (!this.isEntityInRange(this.getPlayerEntity(),EntityCaptainChestClass.OPEN_MAX_DISTANCE)) return;
        
            // open it
            
        this.opened=true;
        this.playSound('chime',1.0,false);
        this.startModelAnimationChunkInFrames(null,30,1,65);
        this.queueModelAnimationChunkInFrames(null,30,65,66);
        
            // chests refill ammo
        
        player=this.getPlayerEntity();
        
        player.pickup('beretta_ammo');
        player.pickup('m16_ammo');
        player.pickup('grenade');
        player.pickup('health');

            // and run any trigger

        if (this.data!==null) {
            if (this.data.trigger!==undefined) this.setTrigger(this.data.trigger);
        }
    }
}
