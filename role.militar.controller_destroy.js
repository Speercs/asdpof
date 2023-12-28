const Pathing            = require('pathing');
var FunctionBoost        = require('function.boost')
var FunctionManualPath2  = require('function.manual_path2')
var FunctionStaticCount  = require('function.static_count')

var MainObserverIntel    = require('main.observer.intel')

var controller_destroy = {

    /** @param {Creep} creep **/
    run: function(creep) {

        Game.map.visual.circle(creep.pos, {fill: '#ffffff', radius: 1, stroke: '#ffffff', opacity: 0.9 });
        pos2 = new RoomPosition(25, 25, creep.memory.birth_target);
        Game.map.visual.line(creep.pos, pos2,{color: '#ffffff', lineStyle: 'dashed', width: 1 });

        var rm_tgt = creep.memory.birth_target
        var rm     = creep.memory.birth  

        // boost
        if( creep.memory.boosted != 1 || !creep.memory.boosted ){
            FunctionBoost.run( creep )
        }
        
        // avoid back and forth move on travel
        if( !creep.memory.avoid_temp ){
            creep.memory.avoid_temp = []
        }
        else if( creep.memory.pos_3_rm && creep.memory.pos_3_rm != creep.pos.roomName ){
            creep.memory.avoid_temp = []
            creep.memory.avoid_temp[0] = creep.memory.pos_3_rm
        }
        //
        
        // auto-attack - remove from list after spawn
        if( creep.ticksToLive == 598 ){
       
            for ( var i = 0 ; i < Memory.attack_list.length ; i++){
                
                if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt ){
                    
                    Memory.attack_list.splice(i,1)
                    Memory.attack_list = _.sortBy(Memory.attack_list, 'threat_lvl') 
                    break;
                }
            }
        }
        //
        
 
        if( creep.memory.boosted == 1 ){

            if( creep.pos.roomName == rm_tgt ){
                
                if( Game.rooms[rm_tgt].controller && !Game.rooms[rm_tgt].controller.my && creep.ticksToLive >= 4 ){ 
                    
                    var enemies = Game.rooms[rm_tgt].find(FIND_HOSTILE_CREEPS  ); 
                    
                    if( enemies && enemies.length == 0  ){
                    
                        var action = creep.claimController( Game.rooms[rm_tgt].controller )
                    
            	        if(action == ERR_NOT_IN_RANGE  ) {
            	            
                            creep.moveTo(Game.rooms[rm_tgt].controller, {maxRooms: 1, range: 1,  ignoreRoads: true, ignoreCreeps: false, priority:  1000 , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            
            	        }
            	        else if( action == OK ){
            	            creep.say('cool')
            	        }
                    }
                }
                else if( Game.rooms[rm_tgt].controller && Game.rooms[rm_tgt].controller.my ){
                   
                    creep.say('destroy')
                   
                    var objs = Game.rooms[rm_tgt].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType != STRUCTURE_STORAGE && structure.structureType != STRUCTURE_TERMINAL && structure.structureType != STRUCTURE_ROAD && structure.structureType != STRUCTURE_CONTAINER ) } } )
                   
                    for (var i = 0 ; i < objs.length ; i++){
                        objs[i].destroy()
                    }
                    
                    Game.rooms[rm_tgt].controller.unclaim()
                    
                    creep.memory.role = 'empty'
                    
                }
                else if( Game.rooms[rm_tgt].controller ){
                    creep.moveTo(Game.rooms[rm_tgt].controller, {maxRooms: 1, range: 1,  ignoreRoads: true, ignoreCreeps: false, priority:  1000 , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
            }
	        else {

                FunctionStaticCount.run( creep )
            
                var return0         = []
                var return0         = FunctionManualPath2.run(creep)
                var avoidRooms_mt   = return0[0]
                var rm_tgt          = return0[1]
                var portal          = return0[2]
    
                var max_rms = 16
                
                var avoidRooms_tmp = Memory.avoidRooms_tmp
                
                var avoidRooms_mt = _.union(avoidRooms_mt, avoidRooms_tmp)
                var avoidRooms_mt = _.union(avoidRooms_mt, creep.memory.avoid_temp)
                
                if( portal == 1 ){
                    creep.memory.static_cnt = 0 
                    var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >2 && structure.pos.y >2 && structure.pos.x <48 && structure.pos.y <48 && !structure.destination.shard && structure.destination.roomName==rm_tgt ) } })
                    
                    if( portal ){
                        // do nothing
                    }
                    else{
                        // reduce rnge
                        var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >1 && structure.pos.y >1 && structure.pos.x <49 && structure.pos.y <49 && !structure.destination.shard && structure.destination.roomName==rm_tgt ) } })
                    }
                    
                    if( portal ){    
                        creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                }
                else if( creep.memory.static_cnt >= 5 ){
                    creep.memory.static_cnt = 0 
                    var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >2 && structure.pos.y >2 && structure.pos.x <48 && structure.pos.y <48 && !structure.destination.shard  ) } })
                    if( portal ){    
                        creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                }
                else if( !avoidRooms_mt || (avoidRooms_mt && avoidRooms_mt.length >= 1 && creep.pos.roomName != avoidRooms_mt[0]) || (avoidRooms_mt && avoidRooms_mt.length == 0) ){
                    const mid_pos = new RoomPosition(24, 24, rm_tgt)
                    creep.moveTo(mid_pos, {maxRooms: max_rms, avoidRooms: avoidRooms_mt, maxOps: 12000, findRoute: true, ignoreRoads: true, range: 23, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
	        }
        }
    }
};

module.exports = controller_destroy;