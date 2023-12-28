const Pathing       = require('pathing');

// var   remotesIntel  = require('main.remotes.intel')
var expansionIntel     = require('main.expansion.intel')
var remotesIntel = require('main.remotes.mapper.intel')

var FunctionManualPath2  = require('function.manual_path2')
var FunctionStaticCount  = require('function.static_count')

var roleClaimer = {

    /** @param {Creep} creep **/
    run: function( creep ) {

        Game.map.visual.circle(creep.pos, {fill: '#800080', radius: 2, stroke: '#800080', opacity: 0.9 });

        var rm = creep.memory.birth_target

        if ( !creep.memory.xx ) {
            creep.memory.xx = 24
            creep.memory.yy = 24
        }

        // expansion
        if( Memory.oneTimer.expansion == 1 && Memory.expansion.task.timer > 0 ){
            if( creep.hits < creep.hitsMax && !creep.memory.arrived ){
                Memory.expansion.task.phase = 2 // cancel
                creep.suicide()
            }
            else if( creep.hits < creep.hitsMax && creep.memory.arrived && Memory.expansion.task.phase == 0 ){
                Memory.expansion.task.phase = 2 // cancel
                creep.suicide()
            }
            else if ( creep.ticksToLive <= 15 && !creep.memory.arrived ){
                Memory.expansion.task.phase = 2 // cancel
                creep.suicide()
            }
        }
        //



        // avoid back and forth move on travel
        if( !creep.memory.avoid_temp ){
            creep.memory.avoid_temp = []
        }
        else if( creep.memory.pos_3_rm && creep.memory.pos_3_rm != creep.pos.roomName ){
            creep.memory.avoid_temp = []
            creep.memory.avoid_temp[0] = creep.memory.pos_3_rm
        }

        if( creep.ticksToLive % 150 == 0 ){
            creep.memory.avoid_temp = []
        }
        //

        // block center rooms
        if( creep.ticksToLive % 10 == 0 ){

            var rm_sct = creep.pos.roomName

            if( rm_sct.split("E")[0].length == rm_sct.length ){
                var lon = 'W'
            }
            else{
                var lon = 'E'
            }

            if( rm_sct.split("N")[0].length == rm_sct.length ){
                var lat = 'S'
            }
            else{
                var lat = 'N'
            }

            var split1 = rm_sct.split(lon)[1]
            var split2 = split1.split(lat)

            var lat_coord = split2[1]
            var lon_coord = split2[0]

            for (let y = -6; y <= 6; y++) {
                for (let x = -6; x <= 6; x++) {

                    var lat_coord = parseInt(split2[1]) + x
                    var lon_coord = parseInt(split2[0]) + y

                    if (  ( lat_coord % 10 == 4 || lat_coord % 10 == 5 || lat_coord % 10 == 6 ) &&
                          ( lon_coord % 10 == 4 || lon_coord % 10 == 5 || lon_coord % 10 == 6 ) ){

                        // var rm_type = 'center'
                        var cnt = creep.memory.avoid_temp.length
                        creep.memory.avoid_temp[cnt] = [lon, lon_coord, lat, lat_coord].join('')

                        delete creep.memory._t
                        delete creep.memory._m

                        //console.log( [lon, lon_coord, lat, lat_coord].join('') )
                    }
                }
            }

            // var cnt = creep.memory.avoid_temp.length
            // creep.memory.avoid_temp[cnt] = ['W', 3, 'N', 17].join('')

            // var cnt = creep.memory.avoid_temp.length
            // creep.memory.avoid_temp[cnt] = ['W', 4, 'N', 17].join('')

        }
        //


        if (creep.pos.roomName == rm ) {

            // scout for expasion
            if( !creep.memory.arrived && Memory.oneTimer.expansion == 1 ){
                creep.memory.arrived = 1
                expansionIntel.run(rm)
            }
            //

            // claim
            var control = Game.rooms[ rm ].controller
            if( Memory.oneTimer.expansion == 1 ){
                if( rm == Memory.expansion.task.rm_tgt ){
                    var action = creep.claimController(control)
                }
                else{
                    console.log('claimer not on task list room for expansion, on room', rm)
                }
            }
            else{
                var action = creep.claimController(control)
            }
            creep.say(action)
            if( action == OK) {
                if( Memory.rooms[ rm ].intel ){
                    delete Memory.rooms[ rm ].intel
                }
                // remotesIntel.run( rm, 1)

                Memory.expansion.task.phase = 1
            }
            else if( action == ERR_NOT_IN_RANGE) {
                creep.moveTo( control, {range: 1, ignoreRoads: true, maxRooms: 1, plainCost: 1,swampCost: 1, priority: Math.floor(Math.random() * 5) , visualizePathStyle: {stroke: '#FFFF00', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            }
            else if( action == ERR_INVALID_TARGET) {
                // remotesIntel.run( rm, 1)
            }
            //

            // destroy
            if( Game.rooms[rm].controller && Game.rooms[rm].controller.my ){

                remotesIntel.run(creep.memory.birth, creep.memory.birth_target)

                creep.say('destroy')

                var objs = Game.rooms[rm].find(FIND_HOSTILE_STRUCTURES )

                if( objs && objs.length > 0 ){

                    for (var i = 0 ; i < objs.length ; i++){
                        objs[i].destroy()
                    }
                }
                else{

                    var objs = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_CONTAINER ) } } )

                    if( objs && objs.length > 0 ){
                        for (var i = 0 ; i < objs.length ; i++){
                            objs[i].destroy()
                        }
                    }
                    else{

                        var objs = Game.rooms[rm].find( FIND_HOSTILE_CONSTRUCTION_SITES )

                        if( objs && objs.length > 0 ){
                            for (var i = 0 ; i < objs.length ; i++){
                                objs[i].remove()
                            }
                        }
                        else{
                            creep.suicide()
                        }
                    }
                }
            }
            //
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

                var portal = creep.room.find(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >2 && structure.pos.y >2 && structure.pos.x <48 && structure.pos.y <48 && !structure.destination.shard && structure.destination.roomName==rm_tgt ) } })

                //var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >2 && structure.pos.y >2 && structure.pos.x <48 && structure.pos.y <48 && !structure.destination.shard && structure.destination.roomName==rm_tgt ) } })
                if( portal ){

                    var min = 999
                    var portal_tgt = 999

                    var min_x = _.min(portal, function(portal){ return portal.pos.x; }).pos.x;
                    var max_x = _.max(portal, function(portal){ return portal.pos.x; }).pos.x;
                    var avg_x = Math.round( (max_x + min_x)/2 )

                    var min_y = _.min(portal, function(portal){ return portal.pos.x; }).pos.y;
                    var max_y = _.max(portal, function(portal){ return portal.pos.x; }).pos.y;
                    var avg_y = Math.round( (max_y + min_y)/2 )

                    for (var i = 0 ; i < portal.length ; i++){
                        var min2 = Math.max( Math.abs( portal[i].pos.x - avg_x ) , Math.abs( portal[i].pos.y - avg_y ) )
                        if( min2 < min ){
                            var min = min2
                            var portal_tgt = i
                        }
                    }

                    if( min < 999 ){
                        creep.moveTo(portal[portal_tgt].pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
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
                creep.moveTo(mid_pos, {maxRooms: max_rms, avoidRooms: avoidRooms_mt, maxOps: 12000, findRoute: true, plainCost: 1,swampCost: 1, ignoreRoads: true, range: 23, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            }
        }
	}
};

module.exports = roleClaimer;
