import PointClass from '../../../code/utility/point.js';
import ProjectEntityClass from '../../../code/project/project_entity.js';

//
// captain chest class
//

export default class EntityCaptainChestClass extends ProjectEntityClass
{
    initialize()
    {
        let event;
        
        super.initialize();
        
        this.json={
            "model": {"name":"captain_chest","scale":{"x":50,"y":50,"z":50}},
            "setup": {"radius":2800,"height":2200},
            "readyActions":
                [
                    {"type":"animationStart","startFrame":0,"endFrame":1}
                ],
            "events":
                [
                    {
                        "conditions":
                            [
                                {"type":"key","key":"e"},
                                {"type":"nearEntity","entity":"@player","distance":7000}
                            ],
                        "actions":
                            [
                                {"type":"animationStart","startFrame":1,"endFrame":65},
                                {"type":"animationQueue","startFrame":65,"endFrame":66},
                            //    {"type":"health","entity":"@player","value":25},
                            //    {"type":"ammo","entity":"@player","weapon":"weapon_pistol","count":10},
                            //    {"type":"ammo","entity":"@player","weapon":"weapon_m16","count":50},
                            //    {"type":"ammo","entity":"@player","weapon":"weapon_grenade","count":1},
                                {"type":"pulseInterface","element":"health","tick":500,"expand":5},
                                {"type":"pulseInterface","element":"pistol_bullet","tick":500,"expand":5},
                                {"type":"pulseInterface","element":"m16_bullet","tick":500,"expand":5},
                                {"type":"pulseInterface","element":"grenade","tick":500,"expand":5},
                                {"type":"playSound","name":"chime","rate":1.0,"loop":false},
                                {"type":"trigger","name":"@data.trigger"}
                            ],
                        "fireOnce":true
                    }
                ]
        };
        
            // run through all the actions and force
            // a fired property so we can track fire once actions
            
        if (this.json.events!==undefined) {
            for (event of this.json.events) {
                event.fired=false;
            }
        }

        
        this.OPEN_MAX_DISTANCE=8000;
        
            // setup
            
        this.radius=this.json.setup.radius;
        this.height=this.json.setup.height;
        
        this.opened=false;
        
            // chest model
            
        this.setModel(this.json.model.name);
        this.scale.setFromValues(this.json.model.scale.x,this.json.model.scale.y,this.json.model.scale.z);
    }
    
    jsonNameTranslate(name)
    {
        if (name.length<1) return(name);
        if (name.charAt(0)!=='@') return(name);
        
            // data lookups
            
        if (name.startsWith("@data.")) return(this.data[name.substring(6)]);
        
            // otherwise an error
            
        console.log('Unknown special name: '+name);
        return(name);
    }
    
    runActions(actions)
    {
        let action,name;
        
        if (actions===undefined) return;
        
        for (action of actions) {
            
            switch(action.type) {
                
                case 'animationStart':
                    this.startModelAnimationChunkInFrames(null,30,action.startFrame,action.endFrame);
                    break;
                    
                case 'animationQueue':
                    this.queueModelAnimationChunkInFrames(null,30,action.startFrame,action.endFrame);
                    break;
                    
                case 'playSound':
                    this.playSound(this.jsonNameTranslate(action.name),action.rate,action.loop);
                    break;
                    
                case 'pulseInterface':
                    this.pulseInterfaceElement(action.element,action.tick,action.expand);
                    break;
                    
                case 'trigger':
                    name=this.jsonNameTranslate(action.name);
                    if (name!==undefined) this.setTrigger(name);
                    break;
                    
                default:
                    console.log('Unknown action type: '+action.type);
                    return(false);
            }
        }
    }
    
    getEntityFromJSON(name)
    {
        let entity;
        
            // special lookups
            
        if (name==='@player') return(this.getPlayerEntity());
        if (name==='@self') return(this);
        
            // by name
            
        entity=this.getEntityList().find(name);
        if (entity==null) {
            console.log('Unknown entity: '+name);
            return(null);
        }
        
        return(entity);
    }
    
    areConditionsMet(conditions)
    {
        let condition,entity;
        
        if (conditions===undefined) return(false);
        
        for (condition of conditions) {
            
            switch(condition.type) {
                
                case "key":
                    if (!this.isKeyDown(condition.key)) return(false);
                    break;
                    
                case "nearEntity":
                    entity=this.getEntityFromJSON(condition.entity);
                    if (entity===null) return(false);
                    
                    if (!this.isEntityInRange(entity,condition.distance)) return(false);
                    break;
                    
                default:
                    console.log('Unknown condition type: '+condition.type);
                    return(false);
            }
        }
        
        return(true);
    }
    
    runEvents(events)
    {
        let event;
        
        if (events===undefined) return;
        
        for (event of events) {
            
                // are the conditions met?
                
            if ((event.fireOnce) && (event.fired)) continue;
            if (!this.areConditionsMet(event.conditions)) continue;
            
                // run the actions
            
            this.runActions(event.actions);
            event.fired=true;
        }
    }
        
    ready()
    {
        this.runActions(this.json.readyActions);
        
        //this.opened=false;
        //this.startModelAnimationChunkInFrames(null,30,0,1);
    }
    
    run()
    {
        let player;
        
        this.runEvents(this.json.events);
        return;
        
            // nothing to do if opened
            
        if (this.opened) return;
        
            // is the E key down
            // and player close enough to open?
        
        if (!this.isKeyDown('e')) return;
        if (!this.isEntityInRange(this.getPlayerEntity(),this.OPEN_MAX_DISTANCE)) return;
        
            // open it
            
        this.opened=true;
        this.playSound('chime',1.0,false);
        this.startModelAnimationChunkInFrames(null,30,1,65);
        this.queueModelAnimationChunkInFrames(null,30,65,66);
        
            // chests refill ammo
        
        player=this.getPlayerEntity();
        
        player.pickup('beretta_ammo');
        player.pickup('m16_ammo');
        player.pickup('grenade');
        player.pickup('health');

            // and run any trigger

        if (this.data!==null) {
            if (this.data.trigger!==undefined) this.setTrigger(this.data.trigger);
        }
    }
}
