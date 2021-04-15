import PointClass from '../../../code/utility/point.js';
import MonsterBaseClass from './monster_base.js';

export default class SkeletonClass extends MonsterBaseClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
    }
}
