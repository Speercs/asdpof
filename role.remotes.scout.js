const Pathing = require('pathing');
var   remotesIntel       = require('main.remotes.mapper.intel')
var   expansionIntel     = require('main.expansion.intel')
var MainObserverIntel    = require('main.observer.intel')

var roleOutpostScout = {

    run: function(creep) {

        var prior  = 1
        var colour = '#ffffff'

        if( creep.ticksToLive >= 1499 && creep.spawning == false ){
            creep.notifyWhenAttacked(false)
        }

        Game.map.visual.circle(creep.pos, {fill: colour, radius: 1, stroke: colour, opacity: 0.9 });
        if( creep.memory.target ){
            Game.map.visual.line(creep.pos, new RoomPosition(24, 24, creep.memory.target) ,{color: colour, lineStyle: 'dashed', width: 1 });
        }

        // initialize memory
        if( !creep.memory.target ){
            creep.memory.target         = creep.memory.birth
            creep.memory.target_prev_2  = creep.memory.birth
            creep.memory.target_prev    = creep.memory.birth
        }

        creep.say(creep.memory.phase + ' ' + creep.memory.target)


        // reset if in same position for 90 ticks
        if( creep.memory.target == creep.memory.reset_tgt ){
            creep.memory.reset_cnt = creep.memory.reset_cnt + 1
        }
        else {
            creep.memory.reset_cnt = 0
        }

        creep.memory.reset_tgt = creep.memory.target

        if ( creep.memory.reset_cnt >= 90 ){
            creep.memory.phase     = 0
            creep.memory.reset_cnt = 0
        }
        //



        //
        // get destination
        if( !creep.memory.phase || creep.memory.phase == 0 ){

            // from memory
            var ok = 0
            if (  Memory.scout && Memory.scout.length > 0 ){

                for ( var i = 0 ; i < Memory.scout.length ; i++){
                    Memory.scout[i].distance = Game.map.getRoomLinearDistance( creep.pos.roomName, Memory.scout[i].rm );
                    Memory.scout[i].cnt      = i
                }

                var obj = _.sortBy(Memory.scout, 'distance')

                if( obj[0].distance <= 7 ){

                    creep.memory.target_prev_2  =  creep.memory.target_prev
                    creep.memory.target_prev    =  creep.memory.target
                    creep.memory.target         =  obj[0].rm
                    creep.memory.phase          = 1
                    creep.memory.portal         = 0

                    Memory.scout.splice(obj[0].cnt,1)
                    var ok = 1

                }
            }
            // random
            if( ok == 0 ) {

                var neighboringRooms = _.values(Game.map.describeExits(creep.pos.roomName ))

                var neighboringRooms_temp = neighboringRooms

                for ( var i = 0 ; i < neighboringRooms.length ; i++){

                    if( !Game.map.getRoomStatus() ){
                        // ok
                    }
                    else if( Game.map.getRoomStatus( neighboringRooms[i] ).status == 'normal' ){
                        // ok
                    }
                    else{
                        var neighboringRooms_temp = _.difference(neighboringRooms_temp, [neighboringRooms[i]] )
                    }
                }

                var neighboringRooms = neighboringRooms_temp

                var neighboringRooms = _.difference(neighboringRooms,[creep.memory.target_prev])

                if( Game.time % 5 == 0  ){

                    var obj = Game.rooms[creep.pos.roomName ].find(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && !structure.destination.shard ) } })
                    var rand = Math.round( Math.random() * ( obj.length -1 )  )
                    var obj = obj[rand]

                }

                if( obj && obj.destination && obj.destination.roomName && obj.destination.roomName != creep.memory.target_prev ){
                    creep.memory.target_prev_2  = creep.memory.target_prev
                    creep.memory.target_prev    = creep.memory.target
      			        creep.memory.target         = obj.destination.roomName
      			        creep.memory.phase          = 1
      			        creep.memory.portal         = 1
      			        creep.memory.portal_xx      = obj.pos.x
      			        creep.memory.portal_yy      = obj.pos.y
                }
                else if( neighboringRooms.length >= 1 ) {

                    var rm_tgt = _.sample(neighboringRooms)

                    if( ( Game.map.getRoomStatus() && Game.map.getRoomStatus(rm_tgt).status == 'normal' ) || !Game.map.getRoomStatus()  ){

                        creep.memory.target_prev_2  = creep.memory.target_prev
                        creep.memory.target_prev    = creep.memory.target
          			        creep.memory.target         = rm_tgt
          			        creep.memory.phase          = 1
          			        creep.memory.portal         = 0
                    }
                    else {
                        creep.memory.target_prev_2  = creep.memory.target_prev
                        creep.memory.target_prev    = creep.memory.target
                        creep.memory.target         = creep.memory.target_prev_2
                        creep.memory.phase          = 1
                        creep.memory.portal         = 0
                    }
                }
                else {
                    creep.memory.target_prev_2  = creep.memory.target_prev
                    creep.memory.target_prev    = creep.memory.target
                    creep.memory.target         = creep.memory.target_prev_2
                    creep.memory.phase          = 1
                    creep.memory.portal         = 0
                }
            }
        }
        //
        // move to next room target
        else if( creep.memory.phase == 1 ){

            if( Game.map.getRoomLinearDistance( creep.pos.roomName, creep.memory.target ) > 8 ){
                if( creep.memory.portal == 0 ){

                    var obj = Game.rooms[creep.pos.roomName ].find(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && !structure.destination.shard ) } })
                    if( obj.length >= 1 ){
                        var rand = Math.round( Math.random() * ( obj.length -1 )  )
                        var obj = obj[rand]

                        creep.memory.portal_xx      = obj.pos.x
          			        creep.memory.portal_yy      = obj.pos.y
                    }
                    else{
                        creep.memory.phase = 0
                    }
                }
                creep.memory.portal = 1
            }

            if( creep.memory.portal == 1 ){
                var xx = creep.memory.portal_xx
                var yy = creep.memory.portal_yy
                var rm = creep.pos.roomName
                var rm_tgt = creep.memory.target
                var rng = 0
            }
            else {

                var xx = 24
                var yy = 24
                var rm = creep.memory.target
                var rm_tgt = creep.memory.target
                var rng = 23
            }

            const mid_pos = new RoomPosition(xx, yy, rm)

            creep.moveTo(mid_pos, {range: rng, maxOps: 1500, findRoute: true, plainCost: 1,swampCost: 1, ignoreRoads: true, maxRooms:10, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

            if ( creep.pos.roomName == rm_tgt ) {               

                var rm = creep.memory.birth

                remotesIntel.run(rm, rm_tgt)

                MainObserverIntel.run(rm, rm_tgt)

                // scout for expasion
                if( Memory.oneTimer.expansion == 1 ){
                    expansionIntel.run(rm_tgt)
                }

                const mid_pos = new RoomPosition(24, 24, rm_tgt)

                creep.moveTo(mid_pos, {range: 22, maxOps: 1500, findRoute: true, plainCost: 1,swampCost: 1, ignoreRoads: true, maxRooms:1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                if( Game.rooms[rm_tgt].find(FIND_SOURCES).length == 2 ){
                    if( Game.rooms[rm_tgt].memory.base_x && Game.rooms[rm_tgt].memory.base_y ){
                        creep.memory.phase = 2
                    }
                }
                else{
                    creep.memory.phase = 2
                }                
            }
        }
        //
        // when arrived - scout and sign
        else if( creep.memory.phase == 2 ){

            if( creep.memory.portal == 1 && creep.pos.roomName == creep.memory.target && Game.rooms[ creep.pos.roomName ].controller ) {

                // sign controller
                var sign  = 1
                var reset = 0
                var rand  = 0
            }
            else if( creep.memory.portal == 1 && creep.pos.roomName == creep.memory.target && !Game.rooms[ creep.pos.roomName ].controller ) {

                // random move and reset
                var sign  = 0
                var reset = 0
                var rand  = 1
            }
            else if( creep.memory.portal == 1 && creep.pos.roomName != creep.memory.target ) {

                // wait
                var sign  = 0
                var reset = 0
                var rand  = 0
            }
            else if( creep.pos.roomName == creep.memory.target && Game.rooms[ creep.pos.roomName ].controller ) {

                // sign controller
                var sign  = 1
                var reset = 0
                var rand  = 0
            }
            else if( creep.pos.roomName == creep.memory.target && !Game.rooms[ creep.pos.roomName ].controller ) {

                // reset
                var sign  = 0
                var reset = 1
                var rand  = 0
            }
            if( creep.pos.roomName != creep.memory.target  ) {

                // wait
                var sign  = 0
                var reset = 0
                var rand  = 0
            }


            if( sign == 1 ){

                var const_site =creep.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES)

                if( const_site ){
                    creep.moveTo(const_site, {range: 0, maxRooms: 1, plainCost: 1,swampCost: 1, ignoreRoads: true, priority: prior, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
                else{
                    creep.memory.phase = 3
                }
            }
            else if( reset == 1 ){
                creep.memory.phase = 0
            }
            else if( rand == 1 ){

                var rnd = Math.ceil(Math.random() * 9  );
                creep.move( rnd )

            }
        }
        else if( creep.memory.phase == 3 ){

            if ( Game.rooms[ creep.pos.roomName ].controller && ( ( Game.rooms[ creep.pos.roomName ].controller.sign && Game.rooms[ creep.pos.roomName ].controller.sign.username != 'asdpof')
                                                                        || !Game.rooms[ creep.pos.roomName ].controller.sign ) ){

                var sign_list = [

                                    '🟢'

                                ]

                var rnd = Math.ceil(Math.random() * sign_list.length  );
                var sign_text = sign_list[rnd-1]

                var obj =  Game.rooms[ creep.pos.roomName ].controller
                var action = creep.signController( obj , sign_text)

                creep.say(action)

                if ( action == OK ){
                    creep.memory.phase = 0
                }
                else if ( action == ERR_NOT_IN_RANGE || action == -9 ){

                    if( Game.rooms[ creep.pos.roomName  ] && Game.rooms[ creep.pos.roomName  ].controller  ){
                        var xx = obj.pos.x
                        var yy = obj.pos.y
                        var rm = obj.pos.roomName
                        var rng = 1

                        const mid_pos = new RoomPosition(xx, yy, rm)

                        creep.moveTo(mid_pos, {range: rng, maxRooms: 1, plainCost: 1,swampCost: 1, ignoreRoads: true, priority: prior, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                    }
                    else {
                        console.log( 'error scout line' )
                    }
                }
            }
            else{
                creep.memory.phase = 0
            }
        }
    }
};

module.exports = roleOutpostScout;
