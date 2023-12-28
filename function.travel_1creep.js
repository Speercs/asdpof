var FunctionManualPath2  = require('function.manual_path2')

var FunctionTravel_1creep = {

    run: function(creep) {

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
        //
    }
}

module.exports = FunctionTravel_1creep;
