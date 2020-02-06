import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';
import EffectHitClass from '../effects/effect_hit.js';
import EntityPlayerClass from '../entities/entity_player.js';
import EntityWeaponBaseClass from '../entities/entity_weapon_base.js';
import EntityJsonClass from '../../../code/project/entity_json.js';

//
// pistol entity class
//

export default class EntityWeaponBerettaClass extends EntityJsonClass
{
    getJson()
    {
        return(
            {
                "model": {"name":"hand_beretta","scale":{"x":7000,"y":7000,"z":7000}},
                "setup": {"radius":5000,"height":11000},
                "draw": {"type":"inHand","handPosition":{"x":-800,"y":-12500,"z":-2700},"handAngle":{"x":0,"y":-10,"z":0}},
                "variables":
                    [
                        {"name":"ammoCount","value":15},
                        {"name":"lastFireTimestamp","value":0},
                    ],
                "readyActions":
                    [
                        {"type":"animationStart","startFrame":77,"endFrame":127}
                    ],
                "messages":
                    [
                        {
                            "message":"addAmmo",
                            "actions":
                                [
                                    {"type":"calc","set":"ammoCount","code":"ammoCount+@content","minClamp":0,"maxClamp":25},
                                    {"type":"pulseInterface","element":"pistol_bullet","tick":500,"expand":5},
                                    {"type":"updateInterfaceText","element":"pistol_bullet_count","variable":"ammoCount"}
                                ]
                        },
                        {
                            "message":"fire",
                            "conditions":
                                [
                                    {"type":"calc","code":"ammoCount>0"},
                                    {"type":"calc","code":"(@timestamp-lastFireTimestamp)>900"}
                                ],
                            "actions":
                                [
                                    {"type":"calc","set":"ammoCount","code":"ammoCount-1"},
                                    {"type":"calc","set":"lastFireTimestamp","code":"@timestamp"},
                                    {"type":"playSound","entity":"@parent","name":"beretta_fire","rate":1.0,"loop":false},
                                    {"type":"animationStart","startFrame":128,"endFrame":143},
                                    {"type":"animationQueue","startFrame":77,"endFrame":127},
                                    {"type":"updateInterfaceText","element":"pistol_bullet_count","variable":"ammoCount"}
                                ]
                        }
                    ]
            }
                    
        );
    }

/*

    initialize()
    {
        super.initialize();
        
        this.DAMAGE=20;
        this.HIT_FILTER=['player','remote','bot','monster'];
        
            // setup
            
        this.radius=5000;
        this.height=11000;      // this model is based on a humanoid skeleton, so it's taller
        
        this.fireWait=900;
        
        this.ammoInitialCount=15;
        this.ammoAddCount=10;
        this.ammoMaxCount=25;
        this.interfaceIconName='pistol_bullet';
        
        this.handOffset=new PointClass(-800,-12500,-2700);
        this.handAngle=new PointClass(0,-10,0);

            // the model
            
        this.setModel('hand_beretta');
        this.scale.setFromValues(7000,7000,7000);
    }
    
    ready()
    {
        super.ready();
        
        this.startModelAnimationChunkInFrames(null,30,77,127);
    }
    
        //
        // fire call
        //
    
    fire(position,angle,eyeOffset)
    {
            // the super does the ammo calc
            // and tells if we can fire
            
        if (!super.fire(position,angle,eyeOffset)) return(false);
        
            // the sound
            // played at holder of weapon
            
        this.playSoundAtEntity(this.heldBy,'beretta_fire',1.0,false);
        
            // the animation
            
        this.startModelAnimationChunkInFrames(null,30,128,143);
        this.queueModelAnimationChunkInFrames(null,30,77,127);
        
            // run the hitscan
            
        this.hitScan(position,angle,eyeOffset,100000,this.HIT_FILTER,this.DAMAGE,EffectHitClass);
        
        return(true);
    }
    
    //
    // this weapon draws in the camera view
    // so we have to set some positions and angles
    //

    drawSetup()
    {
        this.heldBy=this.getPlayerEntity();
        if (!this.getCamera().isFirstPerson()) return(false);
        
        this.handOffset=new PointClass(-800,-12500,-2700);
        this.handAngle=new PointClass(0,-10,0);
        
        this.setModelDrawPosition(this.handOffset,this.handAngle,this.scale,true);
        return(true);
    }
*/
   
}
