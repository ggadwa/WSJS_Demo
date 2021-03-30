import ProjectClass from '../../../code/main/project.js';
import KillClass from '../cubes/kill.js';
import CaptainChestClass from '../entities/captain_chest.js';
import PickupM16Class from '../entities/pickup_m16.js';
import WeaponPistolClass from '../entities/weapon_pistol.js';
import WeaponM16Class from '../entities/weapon_m16.js';
import WeaponGrenadeClass from '../entities/weapon_grenade.js';
import ProjectileGrenadeClass from '../entities/projectile_grenade.js';
import ProjectileVampireClass from '../entities/projectile_vampire.js';
import ProjectileQueenClass from '../entities/projectile_queen.js';

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
            case 'pickup_m16':
                return(PickupM16Class);
            case 'weapon_pistol':
                return(WeaponPistolClass);
            case 'weapon_m16':
                return(WeaponM16Class);
            case 'weapon_grenade':
                return(WeaponGrenadeClass);
            case 'projectile_grenade':
                return(ProjectileGrenadeClass);
            case 'projectile_vampire':
                return(ProjectileVampireClass);
            case 'projectile_queen':
                return(ProjectileQueenClass);
        }

        return(null);
    }
}
