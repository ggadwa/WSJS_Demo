import ColorClass from '../../../code/utility/color.js';
import RectClass from '../../../code/utility/rect.js';
import CameraClass from '../../../code/main/camera.js';
import InterfaceTextClass from '../../../code/interface/interface_text.js';
import ProjectGameDeveloperClass from '../../../code/project/project_game_developer.js';
import MapDualCastlesClass from '../maps/map_dual_castles.js';
import MapDungeonClass from '../maps/map_dungeon.js';

export default class GameClass extends ProjectGameDeveloperClass
{
    initialize()
    {
        let x,y;
        let wid=this.getInterfaceWidth();
        let high=this.getInterfaceHeight();
        
        super.initialize();
        
            // interface elements
            
        this.addBitmap('textures/crosshair_dot.png');
        x=Math.trunc(wid*0.5);
        y=Math.trunc(high*0.5);
        this.addInterfaceElement('crosshair','crosshair_dot',null,null,new RectClass((x-4),(y-4),(x+4),(y+4)),null,1);
        
        this.addBitmap('textures/icon_beretta_bullet.png');
        this.addInterfaceElement('beretta_bullet','icon_beretta_bullet',null,null,new RectClass(8,(high-165),28,(high-115)),null,1);
        this.addInterfaceText('beretta_bullet_count','',35,(high-125),20,InterfaceTextClass.TEXT_ALIGN_LEFT,new ColorClass(1,1,0),1);
        
        this.addBitmap('textures/icon_m16_bullet.png');
        this.addInterfaceElement('m16_bullet','icon_m16_bullet',null,null,new RectClass(12,(high-110),22,(high-60)),null,1);
        this.addInterfaceText('m16_bullet_count','',35,(high-70),20,InterfaceTextClass.TEXT_ALIGN_LEFT,new ColorClass(1,1,0),1);
        
        this.addBitmap('textures/icon_grenade.png');
        this.addInterfaceElement('grenade','icon_grenade',null,null,new RectClass(5,(high-55),30,(high-5)),null,1);
        this.addInterfaceText('grenade_count','',35,(high-15),20,InterfaceTextClass.TEXT_ALIGN_LEFT,new ColorClass(1,1,0),1);
        
        this.addBitmap('textures/icon_armor.png');
        this.addInterfaceElement('armor','icon_armor',null,null,new RectClass((wid-55),(high-110),(wid-5),(high-60)),null,1);
        this.addInterfaceText('armor_count','',(wid-60),(high-70),20,InterfaceTextClass.TEXT_ALIGN_RIGHT,new ColorClass(1,1,0),1);
        
        this.addBitmap('textures/icon_health.png');
        this.addInterfaceElement('health','icon_health',null,null,new RectClass((wid-55),(high-55),(wid-5),(high-5)),null,1);
        this.addInterfaceText('health_count','',(wid-60),(high-15),20,InterfaceTextClass.TEXT_ALIGN_RIGHT,new ColorClass(1,1,0),1);
    }
    
    getName()
    {
        return('wsjs_demo');            // uniquely identifies this project so we can have separate persistent data
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
}
