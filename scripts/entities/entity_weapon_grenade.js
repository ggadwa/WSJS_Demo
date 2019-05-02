import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EntityProjectileGrenadeClass from '../entities/entity_projectile_grenade.js';
import EntityPlayerClass from '../entities/entity_player.js';
import EntityWeaponBaseClass from '../entities/entity_weapon_base.js';

//
// grenade weapon entity class
//

export default class EntityWeaponGrenadeClass extends EntityWeaponBaseClass
{
    static MAX_PROJECTILE_COUNT=4;
    
    grenades=[];
    grenadeLastIndex=0;
    grenadeOffset=null;
    
    initialize()
    {
        let n;
        
        super.initialize();
        
            // setup
            
        this.radius=0;
        this.height=0;      // nothing ever draws, this is your collection of grenades to throw
        
        this.fireWait=1000;
        
        this.ammoInitialCount=3;
        this.ammoAddCount=1;
        this.ammoMaxCount=5;
        this.interfaceIconName='grenade';
        
        this.grenadeOffset=new PointClass(0,0,0);
        
            // sounds
            
        this.addSound('throw',10000);
        
            // projectiles
            
        this.grenades=[];
            
        for (n=0;n!=EntityWeaponGrenadeClass.MAX_PROJECTILE_COUNT;n++) {
            this.grenades.push(this.addEntity(EntityProjectileGrenadeClass,('projectile_grenade_'+n),new PointClass(0,0,0),new PointClass(0,0,0),null,false,false));
        }
        
        this.grenadeLastIndex=0;
    }
    
    release()
    {
        let n;
        
        super.release();
        
        for (n=0;n!=EntityWeaponGrenadeClass.MAX_PROJECTILE_COUNT;n++) {
            this.grenades[n].release();
        }
    }
    
        //
        // fire call
        //
        
    fire(position,angle,eyeOffset)
    {
        let parentEntity=this.heldBy;
        
            // the super does the ammo calc
            // and tells if we can fire
            
        if (!super.fire(position,angle,eyeOffset)) return(false);
        
            // throw sound
            
        this.playSoundAtEntity(this.heldBy,'throw');

            // fire position
            
        this.grenadeOffset.setFromValues(0,0,1800);
        this.grenadeOffset.rotate(angle);
        this.grenadeOffset.addPoint(position);
        this.grenadeOffset.y+=4000;
        
        this.grenades[this.grenadeLastIndex].fire(parentEntity,this.grenadeOffset,angle);
        
        this.grenadeLastIndex++;
        if (this.grenadeLastIndex>=EntityWeaponGrenadeClass.MAX_PROJECTILE_COUNT) this.grenadeLastIndex=0;
        
        return(true);
    }

}
