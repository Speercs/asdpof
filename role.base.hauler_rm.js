const Pathing = require('pathing');

var functionStaticCount  = require('function.static_count')
var functionManagerCollect = require('function.manager.collect')
var functionManagerDrop    = require('function.manager.drop')

var roleBasicsHarvester_min = {

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

        // reset
        // if( ( creep.ticksToLive % 150 == 0 ) ){
        //   // || Memory.one_timer.intelConstruction > 0 || Memory.one_timer.build > 0 || creep.memory.task_operation == 'upgradeController' || creep.memory.task_operation == 'repair' ) ){
        //     creep.memory.task_id        = null
        //     creep.memory.task_resource  = null
        //     creep.memory.task_operation = null
        // }

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

                        var obj_similar_creeps = _.filter(Game.creeps, (cp) => cp.memory.role == 'hauler_rm' && cp.memory.birth == creep.memory.birth && cp.name != creep.name &&
                                                                               cp.store.getFreeCapacity() == 0 && cp.store.getCapacity() == creep.store.getCapacity() &&
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
                            else if( inrange[0].store.getUsedCapacity() >= creep.store.getFreeCapacity() ){

                                inrange[0].transfer( creep, 'energy' );

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

                    if( ok == 0 ){

                        functionManagerCollect.run( creep, rm, role2)

                        // COLLECT
                        // harvest
                        if ( creep.memory.task_operation  == 'harvest' ) {

                            var collect = Game.getObjectById( creep.memory.task_id )
                            var harv = creep.harvest( collect )

                            if( harv        == ERR_NOT_IN_RANGE) {
                                creep.moveTo(collect, {range: 1, maxRooms: 1, priority: prior, containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }
                            else if ( harv == ERR_NOT_ENOUGH_RESOURCES || action  == ERR_INVALID_TARGET ) {
                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null
                            }

                        }
                        else if ( creep.memory.task_operation  == 'withdraw' ) {

                            var collect = Game.getObjectById( creep.memory.task_id )
                            var action = creep.withdraw( collect , creep.memory.task_resource )

                            if( action        == ERR_NOT_IN_RANGE) {
                                creep.moveTo(collect, {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }
                            else if ( action  == ERR_NOT_ENOUGH_RESOURCES || action  == ERR_INVALID_TARGET ) {
                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null
                            }
                            else if( action == OK ){
                                var pos_back = new RoomPosition(creep.memory.pos_1_xx, creep.memory.pos_1_yy, creep.memory.pos_1_rm)
                                creep.moveTo(pos_back, {range: 0, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }

                        }
                        else if ( creep.memory.task_operation  == 'pickup' ) {

                            var collect = Game.getObjectById( creep.memory.task_id )
                            var action = creep.pickup( collect )

                            if( action        == ERR_NOT_IN_RANGE) {
                                creep.moveTo(collect, {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }
                            else if ( action  == ERR_INVALID_TARGET  ) {
                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null
                            }
                            else if( action == OK ){

                                var wait = 0
                                // look for extra energy around
                                if( creep.store.getFreeCapacity() > 0 && collect.amount < creep.store.getFreeCapacity() * .75 ){
                                    var objs = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);

                                    if( objs ){
                                        for ( var i = 0 ; i < objs.length ; i++){
                                            if( creep.store.getFreeCapacity() > 0 ){
                                                if( objs[i].resourceType == 'energy' && objs[i].id != collect.id && objs[i].amount >= 20 ){
                                                    var wait = 1
                                                    creep.pickup( objs[i] )
                                                    creep.say('extra pickup')
                                                }
                                            }
                                            else{
                                                break;
                                            }
                                        }
                                    }
                                }
                                //

                                if( wait == 0 || creep.store.getFreeCapacity() == 0 ){
                                    creep.memory.harvesting     = false;
                                    creep.memory.task_id        = null
                                    creep.memory.task_resource  = null
                                    creep.memory.task_operation = null

                                    functionManagerDrop.run( creep, rm, role2 )

                                    if( creep.memory.task_id != null ){
                                        if( creep.memory.task_id == 'drop_upgrade' ){
                                            for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                                                if( Game.rooms[rm].memory.planner[k][2] == 'container' &&
                                                    Game.rooms[rm].memory.planner[k][3] == 4 ){

                                                    var move_pos = new RoomPosition(Game.rooms[rm].memory.planner[k][0], Game.rooms[rm].memory.planner[k][1], rm)
                                                    break;
                                                }
                                            }
                                        }
                                        else{
                                            var move_pos = Game.getObjectById( creep.memory.task_id ).pos
                                        }
                                        creep.moveTo( move_pos , {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                    }
                                }


                            }
                        }
                        else if ( creep.memory.task_operation  == 'reverse transfer' ) {

                            var drop = Game.getObjectById( creep.memory.task_id )

                            if( drop ){
                                if( creep.pos.inRangeTo(drop.pos, 1) == true ){
                                    var action = drop.transfer( creep , creep.memory.task_resource )
                                }
                                else {
                                    creep.moveTo(drop, {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                            }
                            else{
                                var action = ERR_INVALID_TARGET
                            }

                            // clean memory
                            if ( action     == OK || action     == ERR_FULL || action == ERR_INVALID_TARGET || !drop ) {
                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null

                                if( action     == OK ){
                                    creep.moveTo( Game.getObjectById( Game.rooms[rm].memory.intel.spawn[0].id ).pos , {range: 1, maxRooms: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                            }
                        }
                        //
                    }
                }
                else {

                    if( !global.creeps[ creep.name ] || !global.creeps[ creep.name ].bucket_dontmove || global.creeps[ creep.name ].bucket_dontmove != Game.time ){

                        // fallback reset job
                        if( Game.time % 1 == 0  && ( ( creep.memory.task_id && !Game.getObjectById(creep.memory.task_id) ) || creep.memory.task_resource  == null ) ){
                            creep.memory.task_id        = null
                            creep.memory.task_resource  = null
                            creep.memory.task_operation = null
                        }
                        

                        functionManagerDrop.run( creep, rm, role2 )

                        // DROP / BUILD / REPAIR / UPGRADE
                        // transfer
                        if ( creep.memory.task_operation  == 'transfer' ) {

                            var drop = Game.getObjectById( creep.memory.task_id )

                            // check if extension is already filled
                            if( Game.time % 2 == 0 &&  drop && ( drop.structureType == 'extension' || drop.structureType == 'spawn' ) && 
                                drop.store.getFreeCapacity('energy') == 0 ){

                                creep.say('ext')
                                var drop = null
                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null

                                // get new task
                                functionManagerDrop.run( creep, rm, role2 )
                                var drop = Game.getObjectById( creep.memory.task_id )
                            }

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

                                if( ( action == OK || action     == ERR_FULL ) && creep.store.getUsedCapacity() > 0 &&
                                    creep.memory.task_id && Game.getObjectById( creep.memory.task_id ) && Game.getObjectById( creep.memory.task_id ).memory &&
                                    Game.getObjectById( creep.memory.task_id ).memory.role && 
                                    ( Game.getObjectById( creep.memory.task_id ).memory.role == 'builder' || Game.getObjectById( creep.memory.task_id ).memory.role == 'repairer') ){

                                    // waiter 
                                    
                                    // var obj = creep.pos.findInRange(FIND_MY_CREEPS, 5, {filter: obj =>  obj.memory.role == 'builder' && obj.store.getFreeCapacity('energy') > 0 });

                                    // if( obj && obj[0] ){
                                    //     creep.memory.task_id        = obj[0].id
                                    //     creep.moveTo(obj[0], {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                    // }
                                }
                                else if( creep.store.getUsedCapacity() > 0 ){
                                    // get new task
                                    functionManagerDrop.run( creep, rm, role2 )
                                    var drop = Game.getObjectById( creep.memory.task_id )
                                    if( drop ){
                                        creep.moveTo( drop , {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                    }
                                }
                                else{
                                    creep.memory.harvesting     = true;
                                    creep.memory.task_id        = null
                                    creep.memory.task_resource  = null
                                    creep.memory.task_operation = null

                                    functionManagerCollect.run( creep, rm, role2)

                                    if( creep.memory.task_id != null ){
                                        if( creep.memory.task_id == 'drop_upgrade' ){
                                            for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                                                if( Game.rooms[rm].memory.planner[k][2] == 'container' &&
                                                    Game.rooms[rm].memory.planner[k][3] == 4 ){

                                                    var move_pos = new RoomPosition(Game.rooms[rm].memory.planner[k][0], Game.rooms[rm].memory.planner[k][1], rm)
                                                    break;
                                                }
                                            }
                                        }
                                        else{
                                            var move_pos = Game.getObjectById( creep.memory.task_id ).pos
                                        }
                                        creep.moveTo( move_pos , {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                    }
                                }
                            }
                        }
                        else if ( creep.memory.task_operation  == 'upgradeController' ){
                            var drop = Game.getObjectById( creep.memory.task_id )
                            var action = creep.upgradeController( drop )

                            if( drop && action == ERR_NOT_IN_RANGE) {
                                creep.moveTo(drop, {range: 2, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                // repair if bucket is high
                                if( Game.cpu.bucket >= 9500 ){
                                    var wk_parts = creep.getActiveBodyparts(WORK)
                                    var obj = creep.pos.findInRange(FIND_STRUCTURES, 3, {filter: (structure) =>  {return ( (structure.structureType != STRUCTURE_WALL &&
                                                                                                                            structure.structureType != STRUCTURE_RAMPART &&
                                                                                                                            structure.hits <= ( structure.hitsMax - wk_parts * 100 ) ) ) } } )
                                    if( obj && obj.length > 0 ){
                                        var obj = _.sortBy(obj, 'hits');
                                        creep.repair( obj[0] )
                                        creep.say('r')
                                    }
                                }
                            }
                            else if ( action     == ERR_INVALID_TARGET || action == ERR_NOT_ENOUGH_RESOURCES || action == ERR_NOT_OWNER || !drop ) {
                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null
                            }
                            else if( action == OK ){
                                // move closer
                                if( creep.ticksToLive % 5 == 0 && creep.pos.getRangeTo(drop) > 2 ){
                                    creep.moveTo(drop, {range: 2, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                            }
                        }
                        else if ( creep.memory.task_operation  == 'build' ){
                            var drop = Game.getObjectById( creep.memory.task_id )
                            var action = creep.build( drop )

                            if( drop && action == ERR_NOT_IN_RANGE) {
                                creep.moveTo(drop, {range: 2, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                // repair if bucket is high
                                if( Game.cpu.bucket >= 9500 ){
                                    var wk_parts = creep.getActiveBodyparts(WORK)
                                    var obj = creep.pos.findInRange(FIND_STRUCTURES, 3, {filter: (structure) =>  {return ( (structure.structureType != STRUCTURE_WALL &&
                                                                                                                            structure.structureType != STRUCTURE_RAMPART &&
                                                                                                                            structure.hits <= ( structure.hitsMax - wk_parts * 100 ) ) ) } } )
                                    if( obj && obj.length > 0 ){
                                        var obj = _.sortBy(obj, 'hits');
                                        creep.repair( obj[0] )
                                        creep.say('r')
                                    }
                                }
                            }
                            else if ( action     == ERR_INVALID_TARGET || action == ERR_NOT_ENOUGH_RESOURCES || action == ERR_NOT_OWNER || !drop ) {
                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null
                            }
                            else if( action == OK ){
                                // move closer
                                if( creep.ticksToLive % 5 == 0 && creep.pos.getRangeTo(drop) > 2 ){
                                    creep.moveTo(drop, {range: 2, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                            }
                        }
                        else if ( creep.memory.task_operation  == 'repair' ){
                            var drop = Game.getObjectById( creep.memory.task_id )

                            if ( drop && drop.hits < drop.hitsMax ){

                                var action = creep.repair( drop )

                                if( drop && action == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(drop, {range: 2, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                    // repair if bucket is high
                                    if( Game.cpu.bucket >= 9500 ){
                                        var wk_parts = creep.getActiveBodyparts(WORK)
                                        var obj = creep.pos.findInRange(FIND_STRUCTURES, 3, {filter: (structure) =>  {return ( (structure.structureType != STRUCTURE_WALL &&
                                                                                                                                structure.structureType != STRUCTURE_RAMPART &&
                                                                                                                                structure.hits <= ( structure.hitsMax - wk_parts * 100 ) ) ) } } )
                                        if( obj && obj.length > 0 ){
                                            var obj = _.sortBy(obj, 'hits');
                                            creep.repair( obj[0] )
                                            creep.say('r')
                                        }
                                    }
                                }
                                else if ( action     == ERR_INVALID_TARGET || action == ERR_NOT_ENOUGH_RESOURCES || action == ERR_NOT_OWNER || !drop ) {
                                    creep.memory.task_id        = null
                                    creep.memory.task_resource  = null
                                    creep.memory.task_operation = null
                                }
                                else if( action == OK ){
                                    // move closer
                                    if( creep.ticksToLive % 5 == 0 && creep.pos.getRangeTo(drop) > 2 ){
                                        creep.moveTo(drop, {range: 2, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                    }
                                }
                            }
                            else {
                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null
                            }
                        }
                        else if ( creep.memory.task_operation  == 'drop' ){

                            if( creep.memory.task_id == 'drop_upgrade' ){
                                for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                                    if( Game.rooms[rm].memory.planner[k][2] == 'container' &&
                                        Game.rooms[rm].memory.planner[k][3] == 4 ){

                                        var drop = new RoomPosition(Game.rooms[rm].memory.planner[k][0], Game.rooms[rm].memory.planner[k][1], rm)
                                        break;
                                    }
                                }
                            }
                            else{
                                var drop = Game.getObjectById( creep.memory.task_id ).pos
                            }



                            if( drop && creep.pos.x == drop.x && creep.pos.y == drop.y ){
                                var action = creep.drop( 'energy' )
                            }
                            else if ( drop ){
                                creep.moveTo(drop, {range: 0, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }


                            if ( action == OK || action == ERR_INVALID_TARGET || action == ERR_NOT_ENOUGH_RESOURCES || action == ERR_NOT_OWNER || !drop ){

                                creep.memory.harvesting     = true;
                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null

                                functionManagerCollect.run( creep, rm, role2)

                                if( creep.memory.task_id != null ){
                                    if( creep.memory.task_id == 'drop_upgrade' ){
                                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                                            if( Game.rooms[rm].memory.planner[k][2] == 'container' &&
                                                Game.rooms[rm].memory.planner[k][3] == 4 ){

                                                var move_pos = new RoomPosition(Game.rooms[rm].memory.planner[k][0], Game.rooms[rm].memory.planner[k][1], rm)
                                                break;
                                            }
                                        }
                                    }
                                    else{
                                        var move_pos = Game.getObjectById( creep.memory.task_id ).pos
                                    }
                                    creep.moveTo( move_pos , {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                            }
                        }
                    }
                }
            }


            // drop energy around if filled
            if( Game.cpu.bucket >= 3000 && 
                Game.rooms[rm].energyAvailable <= Game.rooms[rm].energyCapacityAvailable && 
                creep.store.getUsedCapacity() >= 50 &&
                creep.memory.task_operation && creep.memory.task_operation == 'transfer' &&
                creep.memory.task_id && Game.getObjectById(creep.memory.task_id) &&
                ( Game.getObjectById(creep.memory.task_id).structureType == 'extension' || Game.getObjectById(creep.memory.task_id).structureType == 'spawn' ) ){

                var obj = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: obj => (obj.structureType == STRUCTURE_EXTENSION || 
                                                                                        obj.structureType == STRUCTURE_SPAWN ) && 
                                                                                        obj.store.getFreeCapacity('energy') > 0 });

                if( obj.length >= 1 ){
                    var action = creep.transfer(obj[0], 'energy')

                    if( action == OK && obj[0].store.getFreeCapacity('energy') >= creep.store.getUsedCapacity() ){

                        creep.memory.harvesting     = true;
                        creep.memory.task_id        = null
                        creep.memory.task_resource  = null
                        creep.memory.task_operation = null

                        functionManagerCollect.run( creep, rm, role2)

                        if( creep.memory.task_id != null ){
                            if( creep.memory.task_id == 'drop_upgrade' ){
                                for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                                    if( Game.rooms[rm].memory.planner[k][2] == 'container' &&
                                        Game.rooms[rm].memory.planner[k][3] == 4 ){

                                        var move_pos = new RoomPosition(Game.rooms[rm].memory.planner[k][0], Game.rooms[rm].memory.planner[k][1], rm)
                                        break;
                                    }
                                }
                            }
                            else{
                                var move_pos = Game.getObjectById( creep.memory.task_id ).pos
                                creep.say('back')
                            }
                            creep.moveTo( move_pos , {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                    }
                }
                else{
                    if ( Game.rooms[creep.memory.birth].energyCapacityAvailable == Game.rooms[creep.memory.birth].energyAvailable &&
                         ( ( Game.rooms[rm].memory.intel.construction && Game.rooms[rm].memory.intel.construction.length > 0 ) ||
                           Game.rooms[rm].memory.repairer_need == 1 ) ) {

                        var obj = creep.pos.findInRange(FIND_MY_CREEPS, 1, {filter: obj => ( obj.memory.role == 'builder' || 
                                                                                             obj.memory.role == 'repairer' ) && 
                                                                                             obj.store.getFreeCapacity('energy') > 0 });

                        if( obj.length >= 1 ){
                            var action = creep.transfer(obj[0], 'energy')

                            if( action == OK && obj[0].store.getFreeCapacity() >= creep.store.getUsedCapacity() ){

                                creep.memory.harvesting     = true;
                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null

                                functionManagerCollect.run( creep, rm, role2)

                                if( creep.memory.task_id != null ){
                                    if( creep.memory.task_id == 'drop_upgrade' ){
                                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                                            if( Game.rooms[rm].memory.planner[k][2] == 'container' &&
                                                Game.rooms[rm].memory.planner[k][3] == 4 ){

                                                var move_pos = new RoomPosition(Game.rooms[rm].memory.planner[k][0], Game.rooms[rm].memory.planner[k][1], rm)
                                                break;
                                            }
                                        }
                                    }
                                    else{
                                        var move_pos = Game.getObjectById( creep.memory.task_id ).pos
                                    }
                                    creep.moveTo( move_pos , {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                            }
                        }
                    }
                }
            }
            //



            // random move
            if( !Game.rooms[rm].storage ){
                var trigger = Math.max( Game.rooms[rm].controller.level * 4 + 1, 9 )
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
            creep.moveTo(mid_pos, {range: 23, maxRooms: 2,priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

        }

        // /// run from enemies
        // if( Game.rooms[rm].memory.mode_defend == 1 && creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1).length > 0 ){
        //     creep.say('haaa')
        //     var xx = Game.rooms[rm].memory.base_x
        //     var yy = Game.rooms[rm].memory.base_y
        //     const mid_pos = new RoomPosition(xx, yy, rm)
        //     creep.moveTo(mid_pos, {range: 2, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
        // }

        // if no task and some source move somewhere
        if( creep.memory.task_id == null && creep.store.getUsedCapacity() > 0 ){

            const h1_pos = new RoomPosition(Game.rooms[rm].memory.h1_x, Game.rooms[rm].memory.h1_y, rm)
            creep.moveTo(h1_pos, {range: 2, maxRooms: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
        }


        // if filling repairer try to move energy to single hauller
        if( Game.time % 5 == 0 ){
            if( creep.store.getUsedCapacity('energy') > 0 && creep.memory.task_id != null && creep.memory.task_operation == 'transfer' ){

                var obj = Game.getObjectById( creep.memory.task_id )

                if( obj && obj.memory && obj.memory.role && obj.memory.role == 'repairer' ){

                    var obj = _.filter( Game.creeps, (cp) => cp.memory.task_id && cp.memory.task_id == creep.memory.task_id && cp.name != creep.name )
                    
                    if( obj && obj[0] && creep.pos.inRangeTo(obj[0], 2) && 
                        creep.store.getFreeCapacity() > obj[0].store.getFreeCapacity() && obj[0].store.getFreeCapacity() > 0 ){

                        creep.say('rep mv')
                        
                        var action = creep.transfer(obj[0], 'energy')

                        if( action == ERR_NOT_IN_RANGE ){
                            creep.moveTo(obj[0], {range: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                    }
                }
            }
        }
        //


        // drop energy around if filled
        if( rm == creep.pos.roomName && !Game.rooms[creep.memory.birth].storage && Game.rooms[creep.memory.birth].energyCapacityAvailable == Game.rooms[creep.memory.birth].energyAvailable &&
             creep.pos.roomName == creep.memory.birth && Game.cpu.bucket >= 5000 && creep.store.getUsedCapacity() > 0 && creep.ticksToLive % 2 == 1 ){

            if ( Game.cpu.bucket >= 5500 ) {
                var obj = creep.pos.findInRange(FIND_MY_CREEPS, 1, {filter: obj =>  ( obj.memory.role =='repairer' || 
                                                                                      obj.memory.role =='upgrader' ||
                                                                                      obj.memory.role =='builder' ) && 
                                                                                      
                                                                                      obj.store.getFreeCapacity() > 0 });

                if( obj.length >= 1 ){
                    creep.transfer(obj[0], 'energy')
                }
            }
        }
        //


    }
};

module.exports = roleBasicsHarvester_min;
