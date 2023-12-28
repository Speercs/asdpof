const Pathing   = require('pathing');
var FunctionManualPath2  = require('function.manual_path2')
var FunctionStaticCount  = require('function.static_count')

var roleColonizer = {

    /** @param {Creep} creep **/
    run: function( creep ) {

        Game.map.visual.circle(creep.pos, {fill: '#800080', radius: 2, stroke: '#800080', opacity: 0.9 });

        var rm = creep.memory.birth_target

        if ( !creep.memory.xx ) {
            creep.memory.xx = 24
            creep.memory.yy = 24
        }

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

        FunctionStaticCount.run( creep )

        if (creep.pos.roomName == rm ) {
            if( creep.getActiveBodyparts(CARRY) == 0 ){
                creep.memory.foreign        = true
                creep.memory.birth          = rm
                creep.memory.role           = 'harvester'

                var rm_tgt_creeps = _.filter(Game.creeps, (creep) => creep.memory.birth == Memory.expansion.task.rm_tgt  )

                var h0 = _.filter( rm_tgt_creeps , (creep) => creep.memory.birth_target == 's0_550_1' && ( creep.ticksToLive > 200 || creep.spawning == true || !creep.ticksToLive ) ).length
                var h1 = _.filter( rm_tgt_creeps , (creep) => creep.memory.birth_target == 's1_550_1' && ( creep.ticksToLive > 200 || creep.spawning == true || !creep.ticksToLive ) ).length
        
                if( h0 == 0 ){
                    creep.memory.birth_target   = 's0_550_1'
                }
                if( h1 == 0 ){
                    creep.memory.birth_target   = 's1_550_1'
                }                
            }
            else if( creep.getActiveBodyparts(WORK) == 0 ){
                creep.memory.foreign        = true
                creep.memory.birth          = rm
                creep.memory.role           = 'hauler_rm'
                creep.memory.birth_target   = 'mv'
            }
            else{
                creep.memory.foreign        = true
                creep.memory.birth          = rm
                creep.memory.role           = 'upgrader'
                creep.memory.birth_target   = ''
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
};

module.exports = roleColonizer;
