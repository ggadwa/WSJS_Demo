import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EntityMonsterBaseClass from '../entities/entity_monster_base.js';

//
// ratkin skeleton class
//

export default class EntityRatkinClass extends EntityMonsterBaseClass
{
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=1500;
        this.height=4500;
        
        this.gravityMinValue=10;
        this.gravityMaxValue=450;
        this.gravityAcceleration=20;
        
        this.startHealth=80;
        
        this.wakeUpDistance=25000;
        this.meleeDistance=5000;
        this.meleeWaitTick=1500;
        this.meleeDamageTick=500;
        this.meleeDamage=20;
        
        this.maxTurnSpeed=3;
        this.forwardAcceleration=4;
        this.forwardMaxSpeed=50;
        
        this.idleAnimationFrames=[1694,1729];
        this.walkAnimationFrames=[1465,1501];
        this.meleeAnimationFrames=[[440,475],[560,595]];
        this.hitAnimationFrames=[1186,1221];
        this.deathAnimationFrames=[1306,1371];
        this.wakeUpSoundName='rat_wake_up';
        this.meleeSoundName='blade';
        this.deathSoundName='rat_die';
        this.fallSoundName='thud';
        this.fallSoundWaitCount=100;

            // model
            
        this.setModel('ratkin_skeleton');
        this.scale.setFromValues(3000,3000,3000);
        
        return(true);
    }
    
    ready()
    {
        super.ready();
        
        this.showModelMesh('Slave_Pick01',false);
    }
    
}
/*
 1. Ratkin_1H_COMBAT_mode: 1 - 50 fr.
 2. Ratkin_1H_Dodge_Jump_Backward: 55f - 80 fr.
 3. Ratkin_1H_Dodge_Jump_Left: 85f - 110 fr.
 4. Ratkin_1H_Dodge_Jump_Right: 115f - 140 fr.
 5. Ratkin_1H_Heavy Smash: 145f - 185 fr.
 6. Ratkin_1H_Jump_Swing: 190f - 235 fr.
 7. Ratkin_1H_sword_parry_from_stright_down: 240f - 275 fr.
 8. Ratkin_1H_sword_parry_high_left: 280f - 315 fr.
 9. Ratkin_1H_sword_parry_high_right: 320f - 355 fr.
 10. Ratkin_1H_sword_parry_low_front: 360f - 395 fr.
 11. Ratkin_1H_sword_swing_high_left: 400f - 435 fr.
 12. Ratkin_1H_sword_swing_high_right: 440f - 475 fr.
 13. Ratkin_1H_sword_swing_high_straight_down: 480f - 515 fr.
 14. Ratkin_1H_sword_swing_low_left: 520f - 555 fr.
 15. Ratkin_1H_sword_swing_low_right: 560f - 595 fr.
 16. Ratkin_1H_Knocked_backward: 600f - 641 fr.
 17. Ratkin_1H_Down_back: 646f - 686 fr.
 18. Ratkin_1H_Recover_from_knocked_backward: 691f - 731 fr.
 19. Ratkin_1H_Knocked_forward: 736f - 764 fr.
 20. Ratkin_1H_Down_forward: 769f - 809 fr.
 21. Ratkin_1H_Recover_from_knocked_forward: 814f - 846 fr.
 22. Ratkin_1H_Moving_left: 851f - 871 fr.
 23. Ratkin_1H_Moving_right: 876f - 896 fr.
 24. Ratkin_1H_Tracking: 901f - 1076 fr.
 25. Ratkin_1H_warning: 1081f - 1141 fr.
 26. Ratkin_1H_Hit_from_back: 1146f - 1181 fr.
 27. Ratkin_1H_Hit_from_front: 1186f - 1221 fr.
 28. Ratkin_1H_Hit_from_left: 1226f - 1261 fr.
 29. Ratkin_1H_Hit_from_righ: 1266f - 1301 fr.
 30. Ratkin_1H_Dying_A: 1306f - 1371 fr.
 31. Ratkin_1H_Dying_B: 1376f - 1416 fr.
 32. Ratkin_1H_Die_knocked_backward: 1421f - 1438 fr.
 33. Ratkin_1H_Die_knocked_forward: 1443f - 1460 fr.
 34. Ratkin_1H_Casual_walk: 1465f - 1501 fr.
 35. Ratkin_1H_Cautious_walk: 1506f - 1546 fr.
 36. Ratkin_1H_combat_run: 1551f - 1573 fr.
 37. Ratkin_1H_run: 1578f - 1604 fr.
 38. Ratkin_1H_Jump_runing: 1609f - 1649 fr.
 39. Ratkin_Walking_back_A: 1654f - 1689 fr.
 40. Ratkin_Digging_A: 1694f - 1729 fr.
 41. Ratkin_IDLE: 1734f - 1834 fr.
 42. Ratkin_anger: 1839f - 1889 fr.
 43. Ratkin_Eating: 1894f - 2014 fr.
 44. Ratkin_Looking_around: 2019f - 2195 fr.
 45. Ratkin_Pick_object: 2200f - 2240 fr.
 46. Ratkin_pointing_A: 2245f - 2305 fr.
 47. Ratkin_Shrugs: 2310f - 2355 fr.
 48. Ratkin_Stretching: 2360f - 2460 fr.
 49. Ratkin_Talking_A: 2465f - 2505 fr.
 50. Ratkin_Talking_B: 2510f - 2660 fr.
 51. Ratkin_Climbing_wall: 2665f - 2695 fr.
 52. Ratkin_Crawling: 2700f - 2730 fr.
 53. Ratkin_falling_down: 2735f - 2775 fr.
 54. Ratkin_Jump_standing: 2780f - 2855 fr.
 */