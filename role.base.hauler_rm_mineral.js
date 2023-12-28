const Pathing = require('pathing');

var functionStaticCount  = require('function.static_count')
// var functionManagerCollect = require('function.manager.collect')
// var functionManagerDrop    = require('function.manager.drop')

var roleBasicsHauler_mineral = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var prior  = 110
        var colour = '#00FF00'

        if(!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
            creep.memory.harvesting = true;
            creep.memory.task_id        = null
            creep.memory.task_resource  = null
            creep.memory.task_operation = null
        }
        if( creep.memory.harvesting && ( creep.store.getFreeCapacity() == 0 || ( creep.store.getUsedCapacity() > 0 && creep.memory.task_operation  != 'pickup' ) ) ) {
            creep.memory.harvesting     = false;
            creep.memory.task_id        = null
            creep.memory.task_resource  = null
            creep.memory.task_operation = null
        }        

        // bucket count to avoid transfering back and forth
        if( !creep.memory.bucket_cnt ){
            creep.memory.bucket_cnt = 0
        }
        else{
            creep.memory.bucket_cnt = Math.max( creep.memory.bucket_cnt - 1, 0)
        }
        //

        functionStaticCount.run( creep )

        var rm = creep.memory.birth
        var role2 = creep.memory.birth_target

        if( creep.pos.roomName == rm ){

            if(  creep.memory.boosted == 1 || 1==1 ){
                // harvesting
                if( creep.memory.harvesting )  {

                    // bucket brigade
                    var ok = 0
                    if( creep.memory.bucket_cnt <= 0 ){

                        var mineral_type = Game.rooms[rm].memory.intel.minerals[0].mineralType

                        var obj_similar_creeps = _.filter(Game.creeps, (cp) => cp.memory.role == 'hauler_rm_mineral' && cp.memory.birth == creep.memory.birth && cp.name != creep.name &&
                                                                               cp.memory.harvesting == false &&
                                                                               ( !cp.memory.bucket_cnt || cp.memory.bucket_cnt == 0 ) )

                        var inrange = creep.pos.findInRange(obj_similar_creeps, 1)

                        if( inrange.length == 1 ) {

                            if( inrange[0].pos.x == creep.memory.pos_1_xx && inrange[0].pos.y == creep.memory.pos_1_yy ){
                                // do nothing
                            }
                            else if( inrange[0].pos.x == creep.memory.pos_2_xx && inrange[0].pos.y == creep.memory.pos_2_yy ){
                                // do nothing
                            }
                            else if( inrange[0].pos.x == creep.memory.pos_3_xx && inrange[0].pos.y == creep.memory.pos_3_yy ){
                                // do nothing
                            }
                            else if( inrange[0].store.getFreeCapacity() < creep.store.getFreeCapacity() ){

                                inrange[0].transfer( creep, mineral_type );

                                var xx      = creep.memory.pos_1_xx
                                var yy      = creep.memory.pos_1_yy
                                var target = new RoomPosition(xx, yy, creep.memory.pos_1_rm)
                                creep.moveTo(target, {range: 0, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                                var xx      = inrange[0].memory.pos_1_xx
                                var yy      = inrange[0].memory.pos_1_yy
                                var target = new RoomPosition(xx, yy, inrange[0].memory.pos_1_rm)
                                inrange[0].moveTo(target, {range: 0, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                                // exchanging memory
                                var memory_temp_1 = creep.memory
                                var memory_temp_2 = inrange[0].memory

                                inrange[0].memory = memory_temp_1
                                creep.memory      = memory_temp_2
                                //

                                // timer to be able to transfer again
                                inrange[0].memory.bucket_cnt = 3
                                creep.memory.bucket_cnt = 1

                                // 1
                                if( !global.creeps[ creep.name ] ){
                                    global.creeps[ creep.name ] = {}
                                    global.creeps[ creep.name ].bucket_dontmove = Game.time
                                }
                                else{
                                    global.creeps[ creep.name ].bucket_dontmove = Game.time
                                }

                                // 2
                                if( !global.creeps[ inrange[0].name ] ){
                                    global.creeps[ inrange[0].name ] = {}
                                    global.creeps[ inrange[0].name ].bucket_dontmove = Game.time
                                }
                                else{
                                    global.creeps[ inrange[0].name ].bucket_dontmove = Game.time
                                }

                                var ok = 1
                            }
                        }
                    }
                    //

                    if( ok == 0 && 
                        Game.rooms[rm].memory.intel.extractor && 
                        Game.rooms[rm].memory.intel.extractor[0] &&
                        Game.rooms[rm].memory.intel.extractor[0].id ){

                        var pos_ext = Game.getObjectById( Game.rooms[rm].memory.intel.extractor[0].id ).pos

                        if( pos_ext && creep.pos.inRangeTo(pos_ext, 3) && creep.memory.task_id == null ){

                            var mineral_type = Game.rooms[rm].memory.intel.minerals[0].mineralType
   
                            var obj_similar_creeps = _.filter(Game.creeps, (cp) => cp.memory.role == 'mineral' && 
                                                                                   cp.memory.birth == creep.memory.birth && 
                                                                                   ( cp.store[ mineral_type ] >= cp.store.getFreeCapacity() ||
                                                                                     cp.store[ mineral_type ] >= creep.store.getFreeCapacity() ) )

                            var inrange = creep.pos.findInRange(obj_similar_creeps, 6)

                            if( inrange.length >= 1 ) {                                

                                // functionManagerCollect.run( creep, rm, role2)
                                var sort = _.sortBy(inrange, 'store.getUsedCapacity()' );
                                creep.memory.task_id        = sort[sort.length-1].id
                                creep.memory.task_resource  = Game.rooms[rm].memory.intel.minerals[0].mineralType
                                creep.memory.task_operation = 'reverse_transfer'
                            }
                        }
                        else{
                            creep.moveTo(pos_ext, {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                               
                        // COLLECT
                        // harvest
                        if ( creep.memory.task_operation  == 'reverse_transfer' ) {

                            var collect = Game.getObjectById( creep.memory.task_id )

                            if( collect ){

                                if( collect.store[ mineral_type ] < collect.store.getFreeCapacity() && collect.ticksToLive > 10 ){
                                    creep.memory.task_id        = null
                                    creep.memory.task_resource  = null
                                    creep.memory.task_operation = null
                                }
                                else{
                                    var action = collect.transfer( creep , creep.memory.task_resource )

                                    if( action        == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(collect, {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                    }
                                    else if ( action  == ERR_NOT_ENOUGH_RESOURCES || action  == ERR_INVALID_TARGET ) {
                                        creep.memory.task_id        = null
                                        creep.memory.task_resource  = null
                                        creep.memory.task_operation = null
                                    }
                                    else if( action == OK ){
                                        var pos_back = Game.rooms[rm].storage.pos
                                        creep.moveTo(pos_back, {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                    }
                                }
                            }
                            else{
                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null
                            }

                        }                    
                        //
                    }
                }
                else {

                    if( !global.creeps[ creep.name ] || !global.creeps[ creep.name ].bucket_dontmove || global.creeps[ creep.name ].bucket_dontmove != Game.time ){

                        //functionManagerDrop.run( creep, rm, role2 )
                        creep.memory.task_id        = Game.rooms[rm].storage.id
                        creep.memory.task_resource  = Game.rooms[rm].memory.intel.minerals[0].mineralType
                        creep.memory.task_operation = 'transfer'

                        // DROP / BUILD / REPAIR / UPGRADE
                        // transfer
                        if ( creep.memory.task_operation  == 'transfer' ) {

                            var drop = Game.getObjectById( creep.memory.task_id )

                            // do action
                            if( drop ){
                                if( creep.pos.inRangeTo(drop.pos, 1) == true ){
                                    var action = creep.transfer( drop , creep.memory.task_resource )
                                }
                                else {
                                    creep.moveTo(drop, {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                    // var action = creep.transfer( drop , creep.memory.task_resource )
                                }
                            }
                            else{
                                var action = ERR_INVALID_TARGET
                            }

                            // clean memory
                            if ( action     == OK || action     == ERR_FULL || action == ERR_INVALID_TARGET || !drop ) {

                                var pos_back = Game.getObjectById( Game.rooms[rm].memory.intel.extractor[0].id ).pos
                                creep.moveTo(pos_back, {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null
                            }
                        }
                        //                     
                    }
                }
            }

            // random move
            if( !Game.rooms[rm].storage ){
                var trigger = Math.max( Game.rooms[rm].controller.level * 2 + 1, 5 )
            }
            else{
                var trigger = 27
            }

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
        }
        else{

            const mid_pos = new RoomPosition(24, 24, rm)
            creep.moveTo(mid_pos, {range: 23, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

        }
        //

    }
};

module.exports = roleBasicsHauler_mineral;