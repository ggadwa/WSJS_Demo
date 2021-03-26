import ProjectClass from '../../../code/main/project.js';
import KillClass from '../cubes/kill.js';
import CaptainChestClass from '../entities/captain_chest.js';
import WeaponPistolClass from '../entities/weapon_pistol.js';
import WeaponM16Class from '../entities/weapon_m16.js';
import WeaponGrenadeClass from '../entities/weapon_grenade.js';

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
        switch (name) {
            case 'captain_chest':
                return(CaptainChestClass);
            case 'weapon_pistol':
                return(WeaponPistolClass);
            case 'weapon_m16':
                return(WeaponM16Class);
            case 'weapon_grenade':
                return(WeaponGrenadeClass);
        }

        return(null);
    }
}
