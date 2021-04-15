import ProjectClass from '../../../code/main/project.js';
import KillClass from '../cubes/kill.js';
import ExplosionClass from '../effects/explosion.js';
import FireClass from '../effects/fire.js';
import FountainClass from '../effects/fountain.js';
import HitClass from '../effects/hit.js';
import SparkleClass from '../effects/sparkle.js';
import PlayerClass from '../entities/player.js';
import BotClass from '../entities/bot.js';
import CaptainChestClass from '../entities/captain_chest.js';
import PickupM16Class from '../entities/pickup_m16.js';
import PickupPistolAmmoClass from '../entities/pickup_pistol_ammo.js';
import PickupM16AmmoClass from '../entities/pickup_m16_ammo.js';
import PickupGrenadeClass from '../entities/pickup_grenade.js';
import PickupArmorClass from '../entities/pickup_armor.js';
import PickupHealthClass from '../entities/pickup_health.js';
import WeaponPistolClass from '../entities/weapon_pistol.js';
import WeaponM16Class from '../entities/weapon_m16.js';
import WeaponGrenadeClass from '../entities/weapon_grenade.js';
import ProjectileGrenadeClass from '../entities/projectile_grenade.js';
import ProjectileVampireClass from '../entities/projectile_vampire.js';
import ProjectileQueenClass from '../entities/projectile_queen.js';
import DragonQueenClass from '../entities/dragon_queen.js';
import RatkinClass from '../entities/ratkin.js';
import SkeletonClass from '../entities/skeleton.js';
import SpiderClass from '../entities/spider.js';
import VampireClass from '../entities/vampire.js';

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
                    'splash','stone_platform','throw','thud','vampire_die','vampire_wake_up','dungeon','fire']);
        }
        else {
            return(['chime','door','explosion','grenade_bounce','hurt','m16_fire',
                    'm16_reload','pickup','pistol_fire','pistol_reload','player_die','splash',
                    'stone_platform','throw','thud','wind','fire','liquid']);
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
            case 'player':
                return(PlayerClass);
            case 'bot':
                return(BotClass);
            case 'captain_chest':
                return(CaptainChestClass);
            case 'pickup_m16':
                return(PickupM16Class);
            case 'pickup_pistol_ammo':
                return(PickupPistolAmmoClass);
            case 'pickup_m16_ammo':
                return(PickupM16AmmoClass);
            case 'pickup_grenade':
                return(PickupGrenadeClass);
            case 'pickup_health':
                return(PickupHealthClass);
            case 'pickup_armor':
                return(PickupArmorClass);
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
            case 'dragon_queen':
                return(DragonQueenClass);
            case 'ratkin':
                return(RatkinClass);
            case 'skeleton':
                return(SkeletonClass);
            case 'spider':
                return(SpiderClass);
            case 'vampire':
                return(VampireClass);
        }

        return(null);
    }
    
    mapStartup(mapName)
    {
    }
}
