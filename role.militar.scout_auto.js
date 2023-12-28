const Pathing           = require('pathing');
var FunctionBoost       = require('function.boost')
var FunctionManualPath2  = require('function.manual_path2')
var FunctionStaticCount  = require('function.static_count')

var MainObserverIntel = require('main.observer.intel')

var scout_auto = {

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

        // change attack_level - auto attack
        if( creep.ticksToLive == 1498 ){

            for ( var i = 0 ; i < Memory.attack_list.length ; i++){

                if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt ){

                    Memory.attack_list[i].attack_level    = 2
                    Memory.attack_list[i].detection_tick  = Game.time
                    break;
                }
            }
        }
        //

        //
        if( creep.memory.boosted == 1 ){

            if( creep.pos.roomName == rm_tgt ){

                // change attack_level - room reached
                for ( var i = 0 ; i < Memory.attack_list.length ; i++){

                    if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt ){

                        Memory.attack_list[i].attack_level    = 3
                        Memory.attack_list[i].detection_tick  = Game.time //update time when room is reached

                        // check path to controller is reacheable
                        var pathcontroller = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_CONTROLLER  ) } })

                        if ( pathcontroller == null ){
                            Memory.attack_list[i].attack_level = 5
                        }
                        else{
                            Memory.attack_list[i].attack_level = 4
                        }
                        //

                        MainObserverIntel.run( rm, rm_tgt )

                        creep.suicide()
                        break;
                    }
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

                // var avoidRooms_mt = _.union(avoidRooms_mt, avoidRooms_tmp) should move on blocked rooms
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

module.exports = scout_auto;
