const Pathing           = require('pathing');
var FunctionBoost       = require('function.boost')
var FunctionManualPath2  = require('function.manual_path2')
var FunctionStaticCount  = require('function.static_count')

var MainObserverIntel = require('main.observer.intel')

var controller_att = {

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

        // auto-attack life and death update
        if( creep.ticksToLive == 598 ){
            // register birth
            for ( var i = 0 ; i < Memory.attack_list.length ; i++){

                if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt ){

                    if( !Memory.attack_list[i].claim_cout  ){
                        Memory.attack_list[i].claim_cout  = 1
                    }
                    else{
                        Memory.attack_list[i].claim_cout  ++
                    }
                    break;
                }
            }
        }
        else if( creep.ticksToLive == 2 && creep.pos.roomName == rm_tgt ){
            // register death
            for ( var i = 0 ; i < Memory.attack_list.length ; i++){

                if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt ){

                    if( creep.pos.roomName == rm_tgt ){
                        MainObserverIntel.run( rm, rm_tgt )
                    }

                    Memory.attack_list[i].claim_cout  = Memory.attack_list[i].claim_cout  - 1
                    break;
                }
            }
        }
        //

        if( creep.memory.boosted == 1 ){

            if( creep.pos.roomName == rm_tgt ){

                if( Game.rooms[rm_tgt].controller && !Game.rooms[rm_tgt].controller.upgradeBlocked && Game.rooms[rm_tgt].controller.owner && Game.rooms[rm_tgt].controller.owner.username != 'asdpof' ){

                    var action = creep.attackController( Game.rooms[rm_tgt].controller )

        	        if(action == ERR_NOT_IN_RANGE  ) {

                        creep.moveTo(Game.rooms[rm_tgt].controller, {maxRooms: 1, range: 1,  ignoreRoads: true, ignoreCreeps: false, priority:  1000 , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
        	        }
        	        else if( action == OK ){

        	            // update detection tick
                        for ( var i = 0 ; i < Memory.attack_list.length ; i++){

                            if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt ){

                                Memory.attack_list[i].detection_tick  = Game.time
                                MainObserverIntel.run( rm, rm_tgt )

                                break;
                            }
                        }
                        //

        	            if( creep.ticksToLive >= 300 ){
        	                creep.memory.role = 'recycle'
        	            }
        	            else{
        	                creep.memory.role = 'empty'
        	            }
        	        }
                }
                else if( Game.rooms[rm_tgt].controller && Game.rooms[rm_tgt].controller.reservation && Game.rooms[rm_tgt].controller.reservation.username != 'asdpof'  ){

                    var action = creep.reserveController( Game.rooms[rm_tgt].controller )

        	        if(action == ERR_NOT_IN_RANGE  ) {

                        creep.moveTo(Game.rooms[rm_tgt].controller, {maxRooms: 1, range: 1,  ignoreRoads: true, ignoreCreeps: false, priority:  1000 , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
        	        }
                }
                else if( Game.rooms[rm_tgt].controller && !Game.rooms[rm_tgt].controller.owner ){
                    // sucessfull attack
                    for ( var i = 0 ; i < Memory.attack_list.length ; i++){

                        if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt ){

                            Memory.attack_list[i].attack_level    = 1000
                            break;
                        }
                    }

                    // change role
                    if( creep.ticksToLive >= 7 ){
                        creep.memory.role = 'controller_destroy'
                    }
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

        // random move
        if( 1==11 ){
            if( !creep.memory.rand_pos_x ) {
                creep.memory.rand_pos_x = creep.pos.x
                creep.memory.rand_pos_y = creep.pos.y
                creep.memory.rand_cnt = 0
            }
            else if( creep.memory.rand_pos_x == creep.pos.x && creep.memory.rand_pos_y == creep.pos.y ) {
                creep.memory.rand_cnt = creep.memory.rand_cnt + 1
            }
            else if( creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49 ) {
                creep.memory.rand_cnt = creep.memory.rand_cnt + 1
            }
            else {
                creep.memory.rand_cnt = 0
                creep.memory.rand_pos_x = creep.pos.x
                creep.memory.rand_pos_y = creep.pos.y
            }

            if( creep.memory.rand_cnt >= 7 ){
                var xx = Math.floor(Math.random() * 3 - 1 ) + creep.pos.x
                var yy = Math.floor(Math.random() * 3 - 1 ) + creep.pos.y
                if( xx > 49 ){ var xx = 49 }
                if( xx < 0  ){ var xx = 0  }
                if( yy > 49 ){ var yy = 49 }
                if( yy < 0  ){ var yy = 0  }
                creep.moveTo(new RoomPosition(xx, yy, creep.pos.roomName), {range: 0 })
            }
        }

    }
};

module.exports = controller_att;
