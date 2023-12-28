const Pathing = require('pathing');

var functionStaticCount  = require('function.static_count')
var functionBoostWork    = require('function.boost.work')

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        creep.say('builder')
        
        var prior  = 10
        var colour = '#00FF00'

        functionStaticCount.run( creep )

        var rm = creep.memory.birth

        // boost WORK
        functionBoostWork.run( creep, rm, 'LH', prior , colour )

        if( creep.memory.boosted == 1 && 1==1 ){

            if ( (!creep.memory.task_id || creep.memory.task_id == null ) &&
                Game.rooms[rm].memory.intel.construction && Game.rooms[rm].memory.intel.construction.length > 0  ) {

                var obj_temp = []

                for ( var j = 0 ; j < Game.rooms[rm].memory.intel.construction.length ; j++){
                    var cnt = obj_temp.length
                    var obj = Game.getObjectById( Game.rooms[rm].memory.intel.construction[j].id )
                    if( obj ){
                        obj_temp[cnt] = obj
                    }
                }

                if( obj_temp.length >= 1 ){

                    var tgt_obj = creep.pos.findClosestByPath( obj_temp , {algorithm: 'dijkstra '} )

                    if( tgt_obj != null ){
                        creep.memory.task_id        = tgt_obj.id
                    }
                }
            }
            //

            if( creep.memory.task_id ){
                var obj = Game.getObjectById( creep.memory.task_id )
            }

            if( obj ){
                var action = creep.build( obj )

                if( action == ERR_NOT_IN_RANGE || action == ERR_NOT_ENOUGH_RESOURCES ){
                    creep.moveTo(obj, {range: 2, maxRooms: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
                else if( action == ERR_INVALID_TARGET ){
                    creep.memory.task_id = null
                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                    Game.rooms[rm].memory.oneTimer.build = 2
                }



                // refil
                if( creep.store.getUsedCapacity() <= creep.getActiveBodyparts(WORK) * 5 ){

                    var obj2 = creep.room.lookForAt(LOOK_RESOURCES, obj.pos.x, obj.pos.y);

                    if( obj2 ){

                        for ( var i = 0 ; i < obj2.length ; i++){
                            if( obj2[i].resourceType == 'energy' ){
                                var action = creep.pickup( obj2[i] )

                                if( action == ERR_NOT_IN_RANGE ){
                                    creep.moveTo(obj2[i], {range: 1, maxRooms: 1,priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                                break;
                            }
                        }                    
                    }
                }
                //
            }
            else{
                creep.memory.task_id = null
                Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                Game.rooms[rm].memory.oneTimer.build = 2
            }
            //
        }

        // random move
        var trigger = 27

        if( creep.memory.static_cnt >= trigger &&
            creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49 &&
            Game.rooms[ creep.pos.roomName ].lookForAtArea(LOOK_CREEPS,creep.pos.y - 1 , creep.pos.x - 1, creep.pos.y + 1, creep.pos.x + 1,true).length > 2
           ){
            var xx = Math.floor(Math.random() * 3 - 1 ) + creep.pos.x
            var yy = Math.floor(Math.random() * 3 - 1 ) + creep.pos.y
            if( xx > 49 ){ var xx = 49 }
            if( xx < 0  ){ var xx = 0  }
            if( yy > 49 ){ var yy = 49 }
            if( yy < 0  ){ var yy = 0  }
            creep.say('shit1')
            creep.moveTo(new RoomPosition(xx, yy, rm), {range: 0 })
            if( creep.memory.static_cnt >= 41 ){
                // creep.suicide()
                creep.say('shit2')
            }
        }

        // change role
        if (  ( creep.room.memory.intel.construction && creep.room.memory.intel.construction.length == 0 ) ||
              ( Game.rooms[rm].storage && Game.rooms[rm].controller.level >= 4 && Game.rooms[rm].controller.ticksToDowngrade < 35000 ) ||
              (!Game.rooms[rm].storage && Game.rooms[rm].controller.level <= 4 && Game.rooms[rm].controller.ticksToDowngrade < 5000 ) ) {
                
            creep.memory.role = 'upgrader'

            if( !creep.memory.role_fallback ){
                creep.memory.role_fallback = 'builder'
            }
        }
    }
}

module.exports = roleBuilder;
