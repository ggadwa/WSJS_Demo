import ProjectClass from '../../../code/main/project.js';
import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
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
    initialize()
    {
        super.initialize();
        
            // project effects
        
        this.addEffectClass('explosion',ExplosionClass);
        this.addEffectClass('fire',FireClass);
        this.addEffectClass('fountain',FountainClass);
        this.addEffectClass('hit',HitClass);
        this.addEffectClass('sparkle',SparkleClass);
        
            // project entities
            
        this.addEntityClass('player',PlayerClass);
        this.addEntityClass('bot',BotClass);
        this.addEntityClass('captain_chest',CaptainChestClass);
        this.addEntityClass('pickup_m16',PickupM16Class);
        this.addEntityClass('pickup_pistol_ammo',PickupPistolAmmoClass);
        this.addEntityClass('pickup_m16_ammo',PickupM16AmmoClass);
        this.addEntityClass('pickup_grenade',PickupGrenadeClass);
        this.addEntityClass('pickup_health',PickupHealthClass);
        this.addEntityClass('pickup_armor',PickupArmorClass);
        this.addEntityClass('weapon_pistol',WeaponPistolClass);
        this.addEntityClass('weapon_m16',WeaponM16Class);
        this.addEntityClass('weapon_grenade',WeaponGrenadeClass);
        this.addEntityClass('projectile_grenade',ProjectileGrenadeClass);
        this.addEntityClass('projectile_vampire',ProjectileVampireClass);
        this.addEntityClass('projectile_queen',ProjectileQueenClass);
        this.addEntityClass('dragon_queen',DragonQueenClass);
        this.addEntityClass('ratkin',RatkinClass);
        this.addEntityClass('skeleton',SkeletonClass);
        this.addEntityClass('spider',SpiderClass);
        this.addEntityClass('vampire',VampireClass);
        
            // cube classes
            
        this.addCubeClass('kill',KillClass);
            
            // models
            
        this.addCommonModel('grenade');
        this.addCommonModel('hand_beretta');
        this.addCommonModel('hand_m16');
        this.addCommonModel('m16');
        this.addCommonModel('shield');
        
        this.addSingleplayerModel('player');
        this.addSingleplayerModel('captain_chest');
        this.addSingleplayerModel('crystal_ball');
        this.addSingleplayerModel('dragon_queen');
        this.addSingleplayerModel('ratkin_skeleton');
        this.addSingleplayerModel('skeleton_captain');
        this.addSingleplayerModel('spider');
        this.addSingleplayerModel('vampire_patriarch');
        
        this.addMultiplayerModel('beretta');
        this.addMultiplayerModel('chicken_leg');
        this.addMultiplayerModel('player_al');
        this.addMultiplayerModel('player_bob');
        this.addMultiplayerModel('player_dan');
        this.addMultiplayerModel('player_greg');
        this.addMultiplayerModel('player_jack');
        this.addMultiplayerModel('player_larry');
        this.addMultiplayerModel('player_mike');
        
            // bitmaps
            
        this.addCommonBitmap('textures/particle_smoke.png');
        this.addCommonBitmap('textures/particle_blob.png');
        this.addCommonBitmap('textures/particle_hit.png');
        this.addCommonBitmap('textures/particle_glow.png');
        
           // sounds
           
        this.addCommonSound('chime');
        this.addCommonSound('door');
        this.addCommonSound('explosion');
        this.addCommonSound('grenade_bounce');
        this.addCommonSound('hurt');
        this.addCommonSound('m16_fire');
        this.addCommonSound('m16_reload');
        this.addCommonSound('pickup');
        this.addCommonSound('pistol_fire');
        this.addCommonSound('pistol_reload');
        this.addCommonSound('player_die');
        this.addCommonSound('splash');
        this.addCommonSound('stone_platform');
        this.addCommonSound('throw');
        this.addCommonSound('thud');
        this.addCommonSound('fire');
        
        this.addSingleplayerSound('blade');
        this.addSingleplayerSound('gate');
        this.addSingleplayerSound('laser');
        this.addSingleplayerSound('queen_hurt');
        this.addSingleplayerSound('queen_scream');
        this.addSingleplayerSound('rat_die');
        this.addSingleplayerSound('rat_wake_up');
        this.addSingleplayerSound('skeleton_die');
        this.addSingleplayerSound('skeleton_wake_up');
        this.addSingleplayerSound('spider_die');
        this.addSingleplayerSound('spider_wake_up',);
        this.addSingleplayerSound('vampire_die');
        this.addSingleplayerSound('vampire_wake_up');
        this.addSingleplayerSound('dungeon');
        
        this.addMultiplayerSound('wind');
        this.addMultiplayerSound('liquid');
        
            // sequences
        
        this.addSequence('lost');
        
            // characters
            
        this.addCharacter('Al','player','bot','textures/character_al.png',{"model":"player_al","forwardMaxSpeed":100,"maxTurnSpeed":5,"healthMaxCount":50,"armorMaxCount":50,"jumpHeight":400,"targetScanYRange":80,"targetFireYRange":15,"targetFireSlop":15});
        this.addCharacter('Bob','player','bot','textures/character_bob.png',{"model":"player_bob","forwardMaxSpeed":220,"maxTurnSpeed":8,"healthMaxCount":100,"armorMaxCount":75,"jumpHeight":400,"targetScanYRange":120,"targetFireYRange":10,"targetFireSlop":10});
        this.addCharacter('Dan','player','bot','textures/character_dan.png',{"model":"player_dan","forwardMaxSpeed":220,"maxTurnSpeed":8,"healthMaxCount":100,"armorMaxCount":100,"jumpHeight":400,"targetScanYRange":100,"targetFireYRange":15,"targetFireSlop":15});
        this.addCharacter('Greg','player','bot','textures/character_greg.png',{"model":"player_greg","forwardMaxSpeed":160,"maxTurnSpeed":7,"healthMaxCount":150,"armorMaxCount":100,"jumpHeight":400,"targetScanYRange":120,"targetFireYRange":10,"targetFireSlop":10});
        this.addCharacter('Jack','player','bot','textures/character_jack.png',{"model":"player_jack","forwardMaxSpeed":200,"maxTurnSpeed":8,"healthMaxCount":150,"armorMaxCount":150,"jumpHeight":400,"targetScanYRange":120,"targetFireYRange":15,"targetFireSlop":10});
        this.addCharacter('Larry','player','bot','textures/character_larry.png',{"model":"player_larry","forwardMaxSpeed":200,"maxTurnSpeed":8,"healthMaxCount":100,"armorMaxCount":100,"jumpHeight":400,"targetScanYRange":120,"targetFireYRange":5,"targetFireSlop":0});
        this.addCharacter('Mike','player','bot','textures/character_mike.png',{"model":"player_mike","forwardMaxSpeed":180,"maxTurnSpeed":7,"healthMaxCount":75,"armorMaxCount":100,"jumpHeight":400,"targetScanYRange":160,"targetFireYRange":5,"targetFireSlop":0});

            // interfaces

        this.addInterfaceText('multiplayer_message','',this.POSITION_TOP_LEFT,new PointClass(5,25),20,this.TEXT_ALIGN_LEFT,new ColorClass(1.0,0.7,1.0),1.0,true);
        this.addInterfaceText('armor_count','',this.POSITION_BOTTOM_RIGHT,new PointClass(-50,-50),20,this.TEXT_ALIGN_RIGHT,new ColorClass(0.3,0.3,1.0),1.0,true);
        this.addInterfaceText('health_count','',this.POSITION_BOTTOM_RIGHT,new PointClass(-50,-12),20,this.TEXT_ALIGN_RIGHT,new ColorClass(1.0,0.3,0.3),1.0,true);
        this.addInterfaceText('pistol_clip_count','',this.POSITION_BOTTOM_LEFT,new PointClass(35,-135),20,this.TEXT_ALIGN_LEFT,new ColorClass(1.0,1.0,0.0),1.0,true);
        this.addInterfaceText('pistol_bullet_count','',this.POSITION_BOTTOM_LEFT,new PointClass(35,-115),20,this.TEXT_ALIGN_LEFT,new ColorClass(1.0,1.0,0.0),1.0,true);
        this.addInterfaceText('m16_clip_count','',this.POSITION_BOTTOM_LEFT,new PointClass(35,-80),20,this.TEXT_ALIGN_LEFT,new ColorClass(1.0,1.0,0.0),1.0,true);
        this.addInterfaceText('m16_bullet_count','',this.POSITION_BOTTOM_LEFT,new PointClass(35,-60),20,this.TEXT_ALIGN_LEFT,new ColorClass(1.0,1.0,0.0),1.0,true);
        this.addInterfaceText('grenade_count','',this.POSITION_BOTTOM_LEFT,new PointClass(35,-15),20,this.TEXT_ALIGN_LEFT,new ColorClass(1.0,1.0,0.0),1.0,true);
        
        this.addInterfaceElement('armor','textures/icon_armor.png',35,35,this.POSITION_BOTTOM_RIGHT,new PointClass(-40,-80),new ColorClass(1.0,1.0,1.0),1.0,true);
        this.addInterfaceElement('health','textures/icon_health.png',35,35,this.POSITION_BOTTOM_RIGHT,new PointClass(-40,-40),new ColorClass(1.0,1.0,1.0),1.0,true);
        this.addInterfaceElement('pistol_crosshair','textures/crosshair_dot.png',8,8,this.POSITION_MIDDLE,new PointClass(-4,-4),new ColorClass(1.0,1.0,1.0),1.0,false);
        this.addInterfaceElement('pistol_bullet','textures/icon_beretta_bullet.png',25,50,this.POSITION_BOTTOM_LEFT,new PointClass(5,-165),new ColorClass(1.0,1.0,1.0),1.0,true);
        this.addInterfaceElement('m16_crosshair','textures/crosshair_x.png',8,8,this.POSITION_MIDDLE,new PointClass(-4,-4),new ColorClass(1.0,1.0,1.0),1.0,false);
        this.addInterfaceElement('m16_bullet','textures/icon_m16_bullet.png',25,50,this.POSITION_BOTTOM_LEFT,new PointClass(5,-110),new ColorClass(1.0,1.0,1.0),1.0,true);
        this.addInterfaceElement('grenade','textures/icon_grenade.png',25,50,this.POSITION_BOTTOM_LEFT,new PointClass(5,-55),new ColorClass(1.0,1.0,1.0),1.0,true);
    }
    
        //
        // overrides
        //
        
    mapStartup(mapName)
    {
    }
}
