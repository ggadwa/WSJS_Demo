import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import ModelClass from '../../../code/model/model.js';
import ImportModelClass from '../../../code/import/import_model.js';
import EntityMonsterBaseClass from '../entities/entity_monster_base.js';

//
// skeleton captain class
//

export default class EntitySkeletonCaptainClass extends EntityMonsterBaseClass
{
    initialize()
    {
        super.initialize();
        
            // setup
            // captain skeletons are bigger
            
        if (!this.data.captain) {
            this.radius=1500;
            this.height=6200;
        }
        else {
            this.radius=2200;
            this.height=9500;
        }
        
        this.gravityMinValue=10;
        this.gravityMaxValue=450;
        this.gravityAcceleration=20;

            // get model
            
        this.setModel({"name":"skeleton_captain"});
        
            // captain skeletons are bigger
            
        if (!this.data.captain) {
            this.scale.setFromValues(35,35,35);
        }
        else {
            this.scale.setFromValues(55,55,55);
        }
    }
    
    ready()
    {
        super.ready();
        
            // hide the put away sword and shield
            
        this.showModelMesh('SH_Sword_E01',false);
        this.showModelMesh('SH_Shield_E02',false);
        
            // regular skeletons have no armor
            
        if (!this.data.captain) {
            this.showModelMesh('Hair',false);
            this.showModelMesh('SH_Helmet_E',false);
            this.showModelMesh('SH_Shield_E01',false);
            this.showModelMesh('SH_Chest_E',false);
            this.showModelMesh('SH_Shoulders_E',false);
            this.showModelMesh('SH_Gloves_E',false);
            this.showModelMesh('SH_LegsArmor_E',false);
            this.showModelMesh('SH_Boots_E',false);
        }
        
            // skeleton idle
            
        this.startModelAnimationChunkInFrames(null,30,6370,6470);
    }
    
    run()
    {
        super.run();
    }
    
}
/*
1. SH_anger: 0 - 50., 
 2. SH_arm_kick_right: 51 - 76., 
 3. SH_Drinking: 77 - 177., 
 4. SH_Eating: 178 - 298., 
 5. SH_Ecstatic: 299 - 374., 
 6. SH_Hurray: 375 - 420., 
 7. SH_Idle: 421 - 521., 
 8. SH_Jump_standing: 522 - 597., 
 9. SH_Looking_around: 598 - 774., 
 10. SH_Pick_object: 775 - 815., 
 11. SH_pointing_A: 816 - 876., 
 12. SH_salute: 877 - 937., 
 13. SH_Say_No: 938 - 988., 
 14. SH_Talking: 989 - 1034., 
 15. SH_Talking_B: 1035 - 1185., 
 16. SH_thinking: 1186 - 1261., 
 17. SH_Throwing: 1262 - 1367., 
 18. SH_Tracking: 1368 - 1543., 
 19. SH_waving: 1544 - 1589., 
 20. SH_Climbing_ladder_down: 1594 - 1634., 
 21. SH_Climbing_ladder_up: 1639 - 1679., 
 22. SH_Digging_A: 1684 - 1719., 
 23. SH_Digging_B: 1724 - 1769., 
 24. SH_falling_down: 1774 - 1814., 
 25. SH_Jump_runing: 1819 - 1859., 
 26. SH_Run: 1864 - 1886., 
 27. SH_strafe_run_left: 1891 - 1917., 
 28. SH_strafe_run_right: 1922 - 1948., 
 29. SH_Strife_leftt: 1953 - 1988., 
 30. SH_Strife_right: 1993 - 2028., 
 31. SH_Swimming: 2033 - 2063., 
 32. SH_walking_back: 2068 - 2103., 
 33. SH_RM_Climbing_ladder_down: 2108 - 2148., 
 34. SH_RM_Climbing_ladder_up: 2153 - 2193., 
 35. SH_RM_falling_down: 2198 - 2238., 
 36. SH_RM_Jump_runing: 2243 - 2283., 
 37. SH_RM_Jump_standing: 2288 - 2363., 
 38. SH_RM_Run: 2368 - 2390., 
 39. SH_RM_strafe_run_left: 2395 - 2421., 
 40. SH_RM_strafe_run_right: 2426 - 2452., 
 41. SH_RM_Strife_leftt: 2457 - 2492., 
 42. SH_RM_Strife_right: 2497 - 2532., 
 43. SH_RM_Swimming: 2537 - 2567., 
 44. SH_RM_Walking_back: 2572 - 2607., 
 
2 handed weapon animations:
 
 45. SH_2H_PutWeapon_Back: 2612 - 2652., 
 46. SH_2H_TookWeaponOut: 2653 - 2693., 
 47. SH_2H_combat_mode: 2694 - 2744., 
 48. SH_2H_Dodge_Jump_Backward: 2745 - 2770., 
 49. SH_2H_Dodge_Jump_Left: 2771 - 2796., 
 50. SH_2H_Dodge_Jump_Right: 2797 - 2822., 
 51. SH_2H_duck_below_high_swing: 2824 - 2859., 
 52. SH_2H_Heavy Smash: 2860 - 2901., 
 53. SH_2H_Hit_from_back: 2902 - 2937., 
 54. SH_2H_Hit_from_front: 2938 - 2973., 
 55. SH_2H_Jump 360 smash: 2974 - 3084., 
 56. SH_2H_parry_high_front: 3085 - 3120., 
 57. SH_2H_parry_high_right: 3121 - 3156., 
 58. SH_2H_parry_low_front: 3157 - 3192., 
 59. SH_2H_parry_low_left: 3193 - 3228., 
 60. SH_2H_Power_Down_Blow: 3229 - 3264., 
 61. SH_2H_Power_Trust: 3265 - 3300., 
 62. SH_2H_swing_high_straight_down: 3301 - 3336., 
 63. SH_2H_swing_mid_left: 3337 - 3372., 
 64. SH_2H_swing_mid_right: 3373 - 3408., 
 65. SH_2H_thrust_mid: 3409 - 3444., 
 66. SH_2H_moveTOblock: 3445 - 3451., 
 67. SH_2H_block: 3452 - 3482., 
 68. SH_2H_moveFROMblock: 3483 - 3489., 
 69. SH_2H_Knocked_backward: 3490 - 3530., 
 70. SH_2H_Down_back: 3531 - 3571., 
 71. SH_2H_Recover_from_knocked_backward: 3572 - 3612., 
 72. SH_2H_Knocked_forward: 3613 - 3641., 
 73. SH_2H_Down_forward: 3642 - 3682., 
 74. SH_2H_Recover_from_knocked_forward: 3683 - 3715., 
 75. SH_2H_Casual_walk: 3720 - 3756., 
 76. SH_2H_Cautious_walk: 3761 - 3801., 
 77. SH_2H_combat_run: 3806 - 3828., 
 78. SH_2H_Die_fall_backward: 3833 - 3966., 
 79. SH_2H_Die_fall_forward: 3971 - 4111., 
 80. SH_2H_Die_knocked_backward: 4116 - 4133., 
 81. SH_2H_Die_knocked_forward: 4138 - 4155., 
 82. SH_RM_2H_Casual_walk: 4160 - 4196., 
 83. SH_RM_2H_Cautious_walk: 4201 - 4241., 
 84. SH_RM_2H_combat_run: 4246 - 4268., 
 85. SH_RM_2H_Die_knocked_backward: 4273 - 4290., 
 86. SH_RM_2H_Die_knocked_forward: 4295 - 4312., 
 87. SH_RM_2H_Dodge_Jump_Backward: 4317 - 4342., 
 88. SH_RM_2H_Dodge_Jump_Left: 4347 - 4372., 
 89. SH_RM_2H_Dodge_Jump_Right: 4377 - 4402., 
 90. SH_2H_IDLE: 4407 - 4507., 
 
1 handed weapon animations:
 
 91. SH_1H_PutWeapon_Back: 4512 - 4552., 
 92. SH_1H_TookWeaponOut: 4553 - 4593., 
 93. SH_1H_360_Jump_swing: 4594 - 4639., 
 94. SH_1H_360_Right_Jump_Smash: 4640 - 4710., 
 95. SH_1H_banging_shield: 4711 - 4731., 
 96. SH_1H_COMBAT_mode: 4732 - 4782., 
 97. SH_1H_Dodge_Jump_Backward: 4783 - 4808., 
 98. SH_1H_Dodge_Jump_Left: 4809 - 4834., 
 99. SH_1H_Dodge_Jump_Right: 4835 - 4860., 
 100. SH_1H_duck_below_high_swing: 4861 - 4896., 
 101. SH_1H_Heavy Smash: 4897 - 4937., 
 102. SH_1H_Hit_from_back: 4938 - 4973., 
 103. SH_1H_Hit_from_front: 4974 - 5009., 
 104. SH_1H_shield_block_high_left: 5010 - 5045., 
 105. SH_1H_shield_block_high_right: 5046 - 5081., 
 106. SH_1H_sword_parry_from_stright_down: 5083 - 5118., 
 107. SH_1H_sword_parry_high_left: 5119 - 5154., 
 108. SH_1H_sword_parry_high_right: 5155 - 5190., 
 109. SH_1H_sword_parry_low_front: 5191 - 5226., 
 110. SH_1H_sword_shield_blow: 5227 - 5262., 
 111. SH_1H_sword_swing_high_left: 5263 - 5298., 
 112. SH_1H_sword_swing_high_right: 5299 - 5334., 
 113. SH_1H_sword_swing_high_straight_down: 5335 - 5370., 
 114. SH_1H_sword_thrust_mid: 5371 - 5406., 
 115. SH_1H_moveTOblock: 5407 - 5413., 
 116. SH_1H_shield_block_keeping: 5414 - 5444., 
 117. SH_1H_moveFROMblock: 5445 - 5451., 
 118. SH_1H_Knocked_backward: 5452 - 5493., 
 119. SH_1H_Down_back: 5494 - 5534., 
 120. SH_1H_Recover_from_knocked_backward: 5535 - 5575., 
 121. SH_1H_Knocked_forward: 5576 - 5604., 
 122. SH_1H_Down_forward: 5605 - 5645., 
 123. SH_1H_Recover_from_knocked_forward: 5646 - 5678., 
 124. SH_1H_Casual_walk: 5683 - 5719., 
 125. SH_1H_Cautious_walk: 5724 - 5764., 
 126. SH_1H_combat_run: 5769 - 5791., 
 127. SH_1H_Die_fall_backward: 5796 - 5929., 
 128. SH_1H_Die_fall_forward: 5934 - 6074., 
 129. SH_1H_Die_knocked_backward: 6079 - 6096., 
 130. SH_1H_Die_knocked_forward: 6101 - 6118., 
 131. SH_RM_1H_Casual_walk: 6123 - 6159., 
 132. SH_RM_1H_Cautious_walk: 6164 - 6204., 
 133. SH_RM_1H_combat_run: 6209 - 6231., 
 134. SH_RM_1H_Die_knocked_backward: 6236 - 6253., 
 135. SH_RM_1H_Die_knocked_forward: 6258 - 6275., 
 136. SH_RM_1H_Dodge_Jump_Backward: 6280 - 6305., 
 137. SH_RM_1H_Dodge_Jump_Left: 6310 - 6335., 
 138. SH_RM_1H_Dodge_Jump_Right: 6340 - 6365., 
 139. SH_1H_IDLE: 6370 - 6470., 
 */