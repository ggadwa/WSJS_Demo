import ProjectClass from '../../../code/main/project.js';
import KillClass from '../cubes/kill.js';
import ExplosionClass from '../effects/explosion.js';
import FireClass from '../effects/fire.js';
import FountainClass from '../effects/fountain.js';
import HitClass from '../effects/hit.js';
import SparkleClass from '../effects/sparkle.js';
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
    mapModels(mapName,singlePlayer)
    {
        if (singlePlayer) {
            return(['captain_chest','crystal_ball','dragon_queen','grenade',
                    'hand_beretta','hand_m16','m16','player','ratkin_skeleton',
                    'shield','skeleton_captain','spider','vampire_patriarch']);
        }
        else {
            return(['beretta','chicken_leg','grenade','hand_beretta','hand_m16','m16',
                    'player_al','player_bob','player_dan','player_greg','player_jack',
                    'player_larry','player_mike','shield']);
        }
    }
    
    mapBitmaps(mapName,singlePlayer)
    {
        return(['textures/particle_smoke.png','textures/particle_blob.png','textures/particle_hit.png','textures/particle_glow.png']);
    }
    
    mapSounds(mapName,singlePlayer)
    {
        if (singlePlayer) {
            return(['blade','chime','door','explosion','gate','grenade_bounce','hurt','laser','m16_fire',
                    'm16_reload','pickup','pistol_fire','pistol_reload','player_die','queen_hurt','queen_scream',
                    'rat_die','rat_wake_up','skeleton_die','skeleton_wake_up','spider_die','spider_wake_up',
                    'splash','stone_platform','throw','thud','vampire_die','vampire_wake_up']);
        }
        else {
            return(['chime','door','explosion','grenade_bounce','hurt','m16_fire',
                    'm16_reload','pickup','pistol_fire','pistol_reload','player_die','splash',
                    'stone_platform','throw','thud']);
        }
    }
    
    mapCube(mapName,cubeName)
    {
        switch (cubeName) {
            case 'kill':
                return(KillClass);
        }
        
        return(null);
    }
    
    mapEffect(mapName,effectName)
    {
        switch (effectName) {
            case 'explosion':
                return(ExplosionClass);
            case 'fire':
                return(FireClass);
            case 'fountain':
                return(FountainClass);
            case 'hit':
                return(HitClass);
            case 'sparkle':
                return(SparkleClass);
        }
        
        return(null);
    }

    mapEntity(mapName,entityName)
    {
        switch (entityName) {
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
