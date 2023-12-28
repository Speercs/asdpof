const Pathing = require('pathing');

var functionBoostWork    = require('function.boost.work')

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        creep.say('start')

        var prior  = 50
        var colour = '#00FF00'

        var rm = creep.memory.birth

        // boost WORK
        functionBoostWork.run( creep, rm, 'GH', prior , colour )

        if( creep.memory.boosted == 1 ){

            // get static position
            if ( !creep.memory.static_xx && !creep.memory.static_yy ) {
                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container &&
                    Game.rooms[rm].memory.intel.container[4] && Game.rooms[rm].memory.intel.container[4].id &&
                    Game.getObjectById( Game.rooms[rm].memory.intel.container[4].id) ){

                    creep.memory.static_xx = Game.getObjectById(Game.rooms[rm].memory.intel.container[4].id).pos.x
                    creep.memory.static_yy = Game.getObjectById(Game.rooms[rm].memory.intel.container[4].id).pos.y
                    creep.memory.container_id = Game.rooms[rm].memory.intel.container[4].id
                }
                else{
                    if( Game.rooms[rm].memory.planner ){
                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                            if( Game.rooms[rm].memory.planner[k][2] == 'container' &&
                                Game.rooms[rm].memory.planner[k][3] == 4 ){

                                creep.memory.static_xx = Game.rooms[rm].memory.planner[k][0]
                                creep.memory.static_yy = Game.rooms[rm].memory.planner[k][1]
                                creep.memory.container_id = 'ground'
                            }
                        }
                    }
                    else{ 
                        creep.memory.role = 'recycle'
                    }
                }
            }
            else{

                var pos = new RoomPosition(creep.memory.static_xx, creep.memory.static_yy, rm)
            }
            //

            // reset static posotion
            if( creep.ticksToLive % 55 == 0 && creep.memory.container_id == 'ground' ){
                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container &&
                    Game.rooms[rm].memory.intel.container[4] && Game.rooms[rm].memory.intel.container[4].id &&
                    Game.getObjectById( Game.rooms[rm].memory.intel.container[4].id ) ){
                    delete creep.memory.static_xx
                    delete creep.memory.static_yy
                    delete creep.memory.container_id
                    var pos = null
                }
            }
            //

            if( pos  ){

                var action = creep.upgradeController( Game.rooms[rm].controller )
                creep.say('⚡')

                if( ( action == OK && creep.store.getUsedCapacity() <= creep.getActiveBodyparts(WORK) * 1 && creep.memory.container_id != 'ground' ) ||
                    ( action == OK && creep.store.getFreeCapacity() >= creep.getActiveBodyparts(WORK) * 3 && creep.memory.container_id == 'ground' ) ||
                    action == ERR_NOT_ENOUGH_RESOURCES ){

                    if( creep.pos.inRangeTo(pos, 1) ){
                        creep.memory.arrived = 1

                        if( creep.memory.container_id != 'ground' ){
                            var action2 = creep.withdraw( Game.getObjectById( creep.memory.container_id ), 'energy')
                        }
                        else{
                            var ground = creep.room.lookForAt(LOOK_RESOURCES, pos);
                            if( ground ){
                                for ( var i = 0 ; i < ground.length ; i++){
                                    if( ground[i].resourceType == 'energy' ){
                                        creep.pickup( ground[i] )
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    else{
                        creep.moveTo(pos, {range: 1, maxRooms: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                }
                else if( action == ERR_NOT_IN_RANGE ){
                    creep.moveTo(Game.rooms[rm].controller, {range: 3, maxRooms: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
                //
            }
            //          

            // drop on container if it is last tick of live
            if( creep.ticksToLive == 1 ){
                var obj = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: struct => struct.structureType == 'container' });
                if( obj && obj[0] ){
                    creep.transfer( obj[0], 'energy')
                }
            }
            //

             // drop energy around if filled
            if( creep.pos.roomName == creep.memory.birth && Game.cpu.bucket >= 5000 && 
                creep.store.getUsedCapacity() >= creep.getActiveBodyparts(WORK) * 2 && 
                creep.ticksToLive % 2 == 1 ){

                if ( Game.cpu.bucket >= 5500 ) {
                    var obj = creep.pos.findInRange(FIND_MY_CREEPS, 1, {filter: obj =>  obj.memory.role == creep.memory.role &&                                                                                        
                                                                                        obj.store.getFreeCapacity() > 0 &&
                                                                                        creep.store.getUsedCapacity() > obj.store.getUsedCapacity() + 5 });

                    if( obj.length >= 1 ){
                        creep.transfer(obj[0], 'energy', Math.ceil( creep.store.getUsedCapacity() - obj[0].store.getUsedCapacity() - 5 ) )
                    }
                }
            }
            //

            // change role
            if ( ( creep.room.memory.intel && creep.room.memory.intel.construction && creep.room.memory.intel.construction.length > 0 && Game.rooms[rm].controller.level >= 2 ) &&
                   ( ( (!Game.rooms[rm].storage || !Game.rooms[rm].storage.isActive()) && Game.rooms[rm].controller.level <= 4 && Game.rooms[rm].controller.ticksToDowngrade > 7500 ) ||
                     ( Game.rooms[rm].storage && Game.rooms[rm].controller.level >= 4 && Game.rooms[rm].controller.ticksToDowngrade > 39000 ) ) ) {

                if( creep.memory.role_fallback && ( creep.memory.role_fallback == 'builder' || creep.memory.role_fallback == 'upgrader' ) ){ 
                    creep.memory.role = 'builder'
                }
                else if( !creep.memory.role_fallback ){

                    if( Game.rooms[rm].controller.level <= 2 ){
                        creep.memory.role_fallback = 'upgrader'
                    }
                    else if( creep.ticksToLive >= 500 ){
                        var upgrade_creeps = _.filter(Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.role_fallback && creep.memory.role_fallback == 'upgrader' )

                        if( upgrade_creeps.length <= 1 ){
                            creep.memory.role_fallback = 'upgrader'
                        }
                        else{
                            creep.memory.role_fallback = 'upgrader_do_not_turn'
                        }
                    }
                    else{
                        creep.memory.role_fallback = 'upgrader_do_not_turn'
                    }
                }
                else if( creep.ticksToLive % 200 == 0 ){
                    delete creep.memory.role_fallback
                }
            }
            //

        }        
    }
}

module.exports = roleUpgrader;
