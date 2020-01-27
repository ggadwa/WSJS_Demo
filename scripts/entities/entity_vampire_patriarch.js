import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EntityProjectileSparkleClass from '../entities/entity_projectile_sparkle.js';
import EntityMonsterBaseClass from '../entities/entity_monster_base.js';

//
// vampire patriarch class
//

export default class EntityVampirePatriarchClass extends EntityMonsterBaseClass
{
    initialize()
    {
        super.initialize();
        
            // setup
            
        this.radius=2000;
        this.height=8200;
        
        this.gravityMinValue=10;
        this.gravityMaxValue=450;
        this.gravityAcceleration=20;
        
        this.startHealth=240;
        
        this.wakeUpDistance=50000;
        this.meleeDistance=6000;
        this.meleeWaitTick=2500;
        this.meleeDamageTick=500;
        this.meleeDamage=20;
        this.projectileDistance=12000;
        this.projectileWaitTick=5000;
        this.projectileFireTick=500;
        this.projectileClass=EntityProjectileSparkleClass;
        this.projectileData={"explode":false};
        
        this.maxTurnSpeed=5;
        this.forwardAcceleration=4;
        this.forwardMaxSpeed=80;
        
        this.idleAnimationFrames=[2,100];
        this.walkAnimationFrames=[2045,2081];
        this.meleeAnimationFrames=[[706,741],[598,633]];
        this.projectileAnimationFrames=[547,597];
        this.hitAnimationFrames=[982,1017];
        this.deathAnimationFrames=[1886,1951];
        this.wakeUpSoundName='vampire_wake_up';
        this.meleeSoundName='vampire_wake_up';
        this.deathSoundName='vampire_die';
        this.fallSoundName='thud';
        this.fallSoundWaitCount=100;
        
            // model
            
        this.setModel('vampire_patriarch');
        this.scale.setFromValues(5000,5000,5000);
    }
    
}
/*
 0. T-Pose: 0 - 0fr.
1. VP_IDLE - 2 - 100 fr.,
 2. VP_Pick_object - 101 - 141  fr.,
 3. VP_pointing_A - 142 - 202 fr.,
 4. VP_Shrugs - 203 - 248 fr.,
 5. VP_Talking_A - 249 - 289 fr.,
 6. VP_Talking_B - 290 - 440 fr.,
 7. VP_COMBAT_mode - 445 - 495 fr.,
 8. VP_2_Blows - 496 - 546 fr.,
 9. VP_anger - 547 - 597 fr.,
 10. VP_Blow_left_hand_A - 598 - 633 fr.,
 11. VP_Blow_left_hand_B - 635 - 670 fr.,
 12. VP_Blow_right_hand_A - 670 - 705 fr.,
 13. VP_Blow_right_hand_B - 706 - 741 fr.,
 14. VP_Cray - 742 - 822 fr.,
 15. M_VP_Knocked_backward - 823 - 863 fr.,
 16. VP_Down_back - 865 - 905 fr.,
 17. VP_Recover_from_knocked_backward - 906 - 946 fr.,
 18. VP_Hit_from_back - 946 - 981 fr.,
 19. VP_Hit_from_front - 982 - 1017 fr.,
 20. VP_Hit_from_left - 1018 - 1053 fr.,
 21. VP_hit_from_righ - 1054 - 1089 fr.,
 22. VP_Looking_around - 1090 - 1266 fr.,
 23. VP_Tracking - 1267 - 1442 fr.,
 24. M_VP_2_Blows_moving - 1443 - 1493 fr.,
 25. M_VP_Blow_left_hand_A_Moving - 1494 - 1529 fr.,
 26. M_VP_Blow_left_hand_B_Moving - 1530 - 1565 fr.,
 27. M_VP_Blow_right_hand_A_Moving - 1566 - 1601 fr.,
 28. M_VP_Blow_right_hand_B_Moving - 1602 - 1637 fr.,
 29. M_VP_Dodge_Jump_Backward - 1638 - 1663 fr.,
 30. M_VP_Dodge_JumpLeft - 1664 - 1689 fr.,
 31. M_VP_Dodge_JumpRight - 1690 - 1715 fr.,
 32. M_VP_Jump_standing - 1716 - 1791 fr.,
 33. M_VP_Moving_left - 1792 - 1812 fr.,
 34. M_VP_Moving_right - 1813 - 1833 fr.,
 35. M_VP_Turn_Left_90t - 1834 - 1859 fr.,
 36. M_VP_Turn_Right_90t - 1860 - 1885 fr.,
 37. VP_Dying_A - 1886 - 1951 fr.,
 38. VP_Dying_B - 1956 - 1996 fr.,
 39. M_VP_Die_knocked_backward - 2001 - 2018 fr.,
 40. M_VP_Die_knocked_forward - 2023 - 2040 fr.,
 41. M_VP_Casual_walk - 2045 - 2081 fr.,
 42. M_VP_Cautious_walk - 2086 - 2126 fr.,
 43. M_VP_Climbing_wall - 2131 - 2161 fr.,
 44. M_VP_combat_run - 2166 - 2188 fr.,
 45. M_VP_Jump_runing - 2193 - 2233 fr.,
 46. M_VP_run - 2238 - 2260 fr.,
 47. M_VP_Walking_back_A - 2265 - 2300 fr.,
 48. M_VP_falling_down - 2305 - 2345 fr.,
 49. RM_VP_2_Blows_moving - 2350 - 2400 fr.,
 50. RM_VP_Blow_left_hand_A_Moving - 2405 - 2440 fr.,
 51. RM_VP_Blow_left_hand_B_Moving - 2445 - 2480 fr.,
 52. RM_VP_Blow_right_hand_A_Moving - 2485 - 2520 fr.,
 53. RM_VP_Blow_right_hand_B_Moving - 2525 - 2560 fr.,
 54. RM_VP_Casual_walk - 2565 - 2601 fr.,
 55. RM_VP_Cautious_walk - 2606 - 2646 fr.,
 56. RM_VP_Climbing_wall - 2651 - 2681 fr.,
 57. RM_VP_combat_run - 2686 - 2708 fr.,
 58. RM_VP_Die_knocked_backward - 2713 - 2730 fr.,
 59. RM_VP_Die_knocked_forward - 2735 - 2752 fr.,
 60. RM_VP_Dodge_Jump_Backward - 2757 - 2782 fr.,
 61. RM_VP_Dodge_JumpLeft - 2787 - 2812 fr.,
 62. RM_VP_Dodge_JumpRight - 2817 - 2842 fr.,
 63. RM_VP_falling_down - 2847 - 2887 fr.,
 64. RM_VP_Jump_runing - 2892 - 2932 fr.,
 65. RM_VP_Jump_standing - 2937 - 3012 fr.,
 66. RM_VP_Knocked_backward - 3017 - 3057 fr.,
 67. RM_VP_Moving_left - 3062 - 3082 fr.,
 68. RM_VP_Moving_right - 3087 - 3107 fr.,
 69. RM_VP_run - 3112 - 3134 fr.,
 70. RM_VP_Turn_Left_90t - 3139 - 3164 fr.,
 71. RM_VP_Turn_Right_90t - 3169 - 3194 fr.,
 72. RM_VP_Walking_back_A - 3199 - 3234 fr.,
 */