import ColorClass from '../../../code/utility/color.js';
import RectClass from '../../../code/utility/rect.js';
import ProjectGameDeveloperClass from '../../../code/project/project_game_developer.js';
import MapDualCastlesClass from '../maps/map_dual_castles.js';
import MapDungeonClass from '../maps/map_dungeon.js';
import EntityMultiplayerBotClass from '../entities/entity_multiplayer_bot.js';
import EntityRemoteClass from '../entities/entity_remote.js';

export default class GameClass extends ProjectGameDeveloperClass
{
    static BOT_NAMES=['Caesar','Vespasian','Hadrian','Augustus','Trajan','Tiberius','Caligula','Claudius','Nero','Commodus'];
    
    getName()
    {
        return('wsjs_demo');            // uniquely identifies this project so we can have separate persistent data
    }
    
    getBotClass()
    {
        return(EntityMultiplayerBotClass);
    }
                            
    getBotName(idx)
    {
        return(GameClass.BOT_NAMES[idx]);
    }
    
    getRemoteClass()
    {
        return(EntityRemoteClass);
    }
    
    remoteEntering(name)
    {
        this.updateInterfaceTemporaryText('multiplayer_message',(name+' has joined'),5000);
    }
    
    remoteLeaving(name)
    {
        this.updateInterfaceTemporaryText('multiplayer_message',(name+' has left'),5000);
    }

    getStartProjectMap()
    {
            // for this demonstration project, we just pick a map
            // based on what the html set when starting the game
            
        switch (this.data.startMap) {
            case "Dual Castles":
                return(this.createMap(MapDualCastlesClass));
            case "Dungeon":
                return(this.createMap(MapDungeonClass));
        }
        
        console.log('Unknown Map: '+this.data.startMap);
        return(null);
    }
    
    createInterface()
    {
        let x,y;
        let wid=this.getInterfaceWidth();
        let high=this.getInterfaceHeight();
        
        super.createInterface();
        
            // interface elements
            
        x=Math.trunc(wid*0.5);
        y=Math.trunc(high*0.5);
        this.addInterfaceElement('crosshair','textures/crosshair_dot.png',null,null,new RectClass((x-4),(y-4),(x+4),(y+4)),null,1);
        
        this.addInterfaceElement('beretta_bullet','textures/icon_beretta_bullet.png',null,null,new RectClass(5,(high-165),30,(high-115)),null,1);
        this.addInterfaceText('beretta_bullet_count','',35,(high-125),20,this.TEXT_ALIGN_LEFT,new ColorClass(1,1,0),1);
        
        this.addInterfaceElement('m16_bullet','textures/icon_m16_bullet.png',null,null,new RectClass(5,(high-110),30,(high-60)),null,1);
        this.addInterfaceText('m16_bullet_count','',35,(high-70),20,this.TEXT_ALIGN_LEFT,new ColorClass(1,1,0),1);
        
        this.addInterfaceElement('grenade','textures/icon_grenade.png',null,null,new RectClass(5,(high-55),30,(high-5)),null,1);
        this.addInterfaceText('grenade_count','',35,(high-15),20,this.TEXT_ALIGN_LEFT,new ColorClass(1,1,0),1);
        
        this.addInterfaceElement('armor','textures/icon_armor.png',null,null,new RectClass((wid-40),(high-80),(wid-5),(high-45)),null,1);
        this.addInterfaceText('armor_count','',(wid-50),(high-50),20,this.TEXT_ALIGN_RIGHT,new ColorClass(1,1,0),1);
        
        this.addInterfaceElement('health','textures/icon_health.png',null,null,new RectClass((wid-40),(high-40),(wid-5),(high-5)),null,1);
        this.addInterfaceText('health_count','',(wid-50),(high-12),20,this.TEXT_ALIGN_RIGHT,new ColorClass(1,1,0),1);
        
        if (this.isMultiplayer) this.addInterfaceText('multiplayer_message','',5,25,20,this.TEXT_ALIGN_LEFT,new ColorClass(1,1,0),1);
    }
}
