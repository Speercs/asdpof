// base1
var baseSpawnManager = require('main.base.spawn_manager')
var baseSpawnManual  = require('main.base.spawn_manual')
var baseManagerAuto  = require('main.base.spawn_auto')
var baseSpawn        = require('main.base.spawn')

var mainBaseSpawn= {

    run: function( rm ) {

        // dyn calibration for room haulers
        if( !( Game.rooms[rm].memory.dyn_rm_hauler >= -0.10 ) ){
            
            Game.rooms[rm].memory.dyn_rm_hauler = -0.10
            
        }
        else if( Game.rooms[rm].memory.intel && 
                 Game.rooms[rm].memory.intel.spawn && 
                 Game.rooms[rm].memory.intel.spawn[0] && 
                 Game.rooms[rm].memory.intel.spawn[0].id ){
                    
            var update_freq = 9

            if( Game.time % update_freq == 0 ){

                var speed_weight = 2
                var dropped_amt = 0

                if( global.rooms[rm].manager_drop && global.rooms[rm].manager_drop[0] && global.rooms[rm].manager_drop[0].type == 'storage' ){
                    var dropped_amt = -1
                } 
                else{
                    // container
                    if( global.rooms[rm].manager_drop ){
                        var dropped_amt = Math.min( _.filter( global.rooms[rm].manager_drop, (drop) => drop && ( drop.type == 'container_controller' || drop.type == 'container_half' ) && drop.need_av >= 1000 ).length , 2)
                    }

                    // controller low
                    if( Game.rooms[rm].controller.level >=4 && Game.rooms[rm].controller.level <=7 &&
                        Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > Game.rooms[rm].memory.storage_lvl &&
                        Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[4] && Game.rooms[rm].memory.intel.container[4].id ){

                        var ext = Game.getObjectById( Game.rooms[rm].memory.intel.container[4].id )

                        if( ext && ext.store['energy'] < 1000 ){
                            var dropped_amt = dropped_amt + 5
                        }
                    }

                    if( Game.rooms[rm].controller.level >=4 && 
                        Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > Game.rooms[rm].memory.storage_lvl &&
                        _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && 
                                                         creep.memory.birth == rm && 
                                                         creep.store.getUsedCapacity() == 0 ).length > 1 ){

                        var dropped_amt = dropped_amt + 3
                    }
                    
                    // tower
                    if( global.rooms[rm].manager_drop ){
                        var dropped_amt = dropped_amt + Math.min( _.filter( global.rooms[rm].manager_drop, (drop) => drop && ( drop.type == 'tower' ) && drop.need_av >= 1000 ).length , 2 )
                    }
                }
                
                // dropped
                var dropped_amt = dropped_amt + Math.min( _.filter(Game.rooms[rm].memory.intel.dropped, (dropped) => dropped && Game.getObjectById( dropped.id ) && Game.getObjectById( dropped.id ).amount >= 200 ).length, 2)
                var dropped_amt = dropped_amt + Math.min( _.filter(Game.rooms[rm].memory.intel.dropped, (dropped) => dropped && Game.getObjectById( dropped.id ) && Game.getObjectById( dropped.id ).amount >= 1000).length, 4)
                var dropped_amt = dropped_amt + Math.min( _.filter(Game.rooms[rm].memory.intel.dropped, (dropped) => dropped && Game.getObjectById( dropped.id ) && Game.getObjectById( dropped.id ).amount >= 2000).length, 6)
                var dropped_amt = dropped_amt + Math.min( _.filter(Game.rooms[rm].memory.intel.dropped, (dropped) => dropped && Game.getObjectById( dropped.id ) && Game.getObjectById( dropped.id ).amount >= 4000).length, 6)


                if( dropped_amt == 0 ){
                    var dropped_amt = -6
                }
                else if( dropped_amt > 0 ) {
                    var lazy_creeps = _.filter(Game.creeps, (creep) => creep.memory.birth == rm && 
                                                                       creep.memory.role == 'hauler_rm' && 
                                                                        ( !creep.memory.task_id || creep.memory.task_id == null ) )

                    if( lazy_creeps.length >= 1 ){
                        var dropped_amt = 0
                    }
                }
            
                // dyn
                Game.rooms[rm].memory.dyn_rm_hauler = Math.max( Math.min( 100,( 249 * Game.rooms[rm].memory.dyn_rm_hauler + dropped_amt * speed_weight * update_freq ) / 250 ), -0.25)
            }

            //console.log('dyn hauler', Game.rooms[rm].memory.dyn_rm_hauler)
        }
        //

        // dyn calibration for room upgraders
        if( !Game.rooms[rm].storage ){
            if( !( Game.rooms[rm].memory.dyn_upgrader >= 0 ) ){
                Game.rooms[rm].memory.dyn_upgrader = 5
                Game.rooms[rm].memory.dyn_upgrader_prog = Game.rooms[rm].controller.progress
            }
            else{
                var update_freq = 7
                if( Game.time % update_freq == 0 ){
                    var tick_rate = ( Game.rooms[rm].controller.progress - Game.rooms[rm].memory.dyn_upgrader_prog ) / update_freq
                    Game.rooms[rm].memory.dyn_upgrader_prog = Game.rooms[rm].controller.progress

                    var rm_creeps = _.filter(Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.role == 'upgrader' )
                    var work_sum = _.sum( rm_creeps, creep => { return creep.getActiveBodyparts(WORK) });

                    if( rm_creeps.length >= 1 ){
                        if( tick_rate >= work_sum - 1 &&
                            Game.rooms[rm].memory.intel.container && 
                            Game.rooms[rm].memory.intel.container[4] && 
                            Game.rooms[rm].memory.intel.container[4].id &&
                            Game.getObjectById( Game.rooms[rm].memory.intel.container[4].id ) &&
                            Game.getObjectById( Game.rooms[rm].memory.intel.container[4].id ).store['energy'] > 1000
                        ){
                            Game.rooms[rm].memory.dyn_upgrader = Game.rooms[rm].memory.dyn_upgrader + 4 / 150 * update_freq
                        }
                        else{
                            Game.rooms[rm].memory.dyn_upgrader = Game.rooms[rm].memory.dyn_upgrader - 1 / 150 * update_freq
                        }

                        Game.rooms[rm].memory.dyn_upgrader = Math.max( 0, Math.min( 60, Game.rooms[rm].memory.dyn_upgrader ) )
                    }
                }
            }

            //console.log('dyn upgrad', Game.rooms[rm].memory.dyn_upgrader, tick_rate)
        }
        else{
            if( Game.time % 20000 == 0 ){
                delete Game.rooms[rm].memory.dyn_upgrader
                delete Game.rooms[rm].dyn_upgrader_prog
            }
        }
        //

             
        

        // storage level (antes de alterar valor de controle )
        if( Game.time % 150 == 7 || !Game.rooms[rm].memory.storage_lvl ){
            var lvl = Game.rooms[rm].controller.level
            if( lvl == 8 && Game.rooms[rm].controller.progress == 0 ){
                var per = 1
            }
            else{
                if( Game.rooms[rm].controller.progressTotal == 0 ){
                    var per = 0
                }
                else{
                    var per = Game.rooms[rm].controller.progress / Game.rooms[rm].controller.progressTotal
                }
            }
            Game.rooms[rm].memory.storage_lvl = Memory.config.storage_lvl[ lvl ] + ( Memory.config.storage_lvl[ Math.min(lvl+1,8) ] - Memory.config.storage_lvl[ lvl ] ) * per
        }
        //

        // level
        var lvl = Game.rooms[rm].controller.level
        if( Game.rooms[rm].memory.mode_defend == 1  ){
            var lvl = 9
        }

    
        // Manager Spawn && Manual
        if( Game.time % Memory.config.freq_manager_spawn[lvl] == 0 && Game.rooms[rm].memory.manager_spawn && Game.rooms[rm].memory.manager_spawn.length == 0 ){

            // global.rooms[rm].energyStructures update
            if( !Game.rooms[rm].controller.progressTotal && Game.rooms[rm].energyCapacityAvailable == 12900 ){
                var freq = 50
            }
            else if( Game.rooms[rm].controller.progress / Game.rooms[rm].controller.progressTotal < 0.2 ){
                var freq = 5
            }
            else{
                var freq = 35
            }
           
            if( global.rooms[rm].energyStructures && Game.time % ( freq * Memory.config.freq_manager_spawn[lvl] )== 0 ){
                delete global.rooms[rm].energyStructures
            }

            var sp_available = 0

            for ( var i = 0; i < Game.rooms[rm].memory.intel.spawn.length ; i++) {
                var obj = Game.getObjectById( Game.rooms[rm].memory.intel.spawn[i].id )
                // check if spawn is busy
                if( obj && obj.spawning && obj.spawning != null ){
                    // do nothing
                }
                else if( obj  ) {
                    var sp_available = 1
                    break;
                }
            }

            if( sp_available == 1 ){
                
                if( Game.time % ( Memory.config.freq_manager_spawn[lvl] * 5 ) == 0 ){
                    Game.rooms[rm].memory.mode_fill = 0
                }
                
                baseSpawnManager.run( rm )
                baseSpawnManual.run( rm )

                if( Memory.oneTimer.auto_attack == 1 ){
                    baseManagerAuto.run( rm )
                }
            }
        }
        else if( Game.time % ( Memory.config.freq_manager_spawn[lvl] * Game.gcl.level ) == 0 ){
            Game.rooms[rm].memory.manager_spawn = []
        }

        // Spawn
        baseSpawn.run(rm )

    }
};

module.exports = mainBaseSpawn;
