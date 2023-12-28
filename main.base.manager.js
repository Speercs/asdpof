// Base manager
var mainBaseManager = {

    run: function( rm ) {

        // drop priority
        // 0.9  container_half - very high priority
        // 0.99 container_controller - only below 500
        // 1    extension
        // 1.5  container_controller
        // 2    spawn 
        // 2.1  half extension - high priority
        // 3    tower          
        // 3.9  repairer        -
        // 4    build/drop_build        Game.getObjectById( Game.rooms[rm].memory.intel.construction[i].id ).structureType == 'rampart' && Game.rooms[rm].energyCapacityAvailable >= 5300 && Game.rooms[rm].terminal
        // 4    build/drop_build        Game.rooms[rm].memory.mode_defend == 0
        // 7    build/drop_build        -
        // 14   container_half          lower priority if at least half of the energy already filled
        // 15   container_controller    Game.rooms[rm].storage.store['energy'] > (Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.upgrade_prior ) - lower priority is lvl < 8
        // 90   half extension - low priority
        // 100  storage
        // 101  container_controller    -



        // level
        var lvl = Game.rooms[rm].controller.level
        if( Game.rooms[rm].memory.mode_defend == 1  ){
            var lvl = 9
        }

        // DROP

        // zera a memoria
        if ( !global.rooms[rm].manager_drop ){
            global.rooms[rm].manager_drop = []
        }
        else  {
            for ( var i = 0 ; i < global.rooms[rm].manager_drop.length ; i++){

                if( global.rooms[rm].manager_drop[i] ){

                    if( ( global.rooms[rm].manager_drop[i].type == 'spawn' || global.rooms[rm].manager_drop[i].type == 'extension' || global.rooms[rm].manager_drop[i].type == 'container_half' ||
                          global.rooms[rm].manager_drop[i].type == 'container_controller' || global.rooms[rm].manager_drop[i].type == 'upgrader' || global.rooms[rm].manager_drop[i].type == 'drop_upgrade' ) && Game.time % Memory.config.freq_intel_structures_energy[lvl] == 0 ){
                        global.rooms[rm].manager_drop.splice(i,1)
                        if (i >= 0) { i = i - 1 }
                    }
                    else if( global.rooms[rm].manager_drop[i].type == 'tower' && Game.time % Memory.config.freq_intel_towers[lvl] == 0 ){
                        global.rooms[rm].manager_drop.splice(i,1)
                        if (i >= 0) { i = i - 1 }
                    }
                    else if( global.rooms[rm].manager_drop[i].type == 'storage' && Game.time % Memory.config.freq_intel_storage[lvl] == 0 ){
                        global.rooms[rm].manager_drop.splice(i,1)
                        if (i >= 0) { i = i - 1 }
                    }
                    else if( (global.rooms[rm].manager_drop[i].type == 'builder' || global.rooms[rm].manager_drop[i].type == 'drop_build' ) && ( Game.rooms[rm].memory.intel.construction && Game.rooms[rm].memory.intel.construction.length > 0 ) ){
                        global.rooms[rm].manager_drop.splice(i,1)
                        if (i >= 0) { i = i - 1 }
                    }
                    else if( global.rooms[rm].manager_drop[i].type == 'repairer' && Game.rooms[rm].memory.oneTimer.repair == 1 ){
                        global.rooms[rm].manager_drop.splice(i,1)
                        if (i >= 0) { i = i - 1 }
                    }
                    // else if( global.rooms[rm].manager_drop[i].type == 'fill creep' && Game.time % Memory.config.freq_intel_creep_fill[lvl] == 0 ){
                    //     global.rooms[rm].manager_drop.splice(i,1)
                    //     if (i > 0) { i = i - 1 }
                    // }

                }
            }
        }
        //

        // creep filter
        if( Game.time % Memory.config.freq_collect == 0 ||
            Game.time % Memory.config.freq_intel_structures_energy[lvl] == 0 ||
            Game.time % Memory.config.freq_intel_towers[lvl] == 0 ||
            Game.rooms[rm].memory.oneTimer.repair == 1 ||
            ( Game.rooms[rm].memory.intel.construction && Game.rooms[rm].memory.intel.construction.length > 0 ) ||
            Game.time % Memory.config.freq_intel_storage[lvl] == 0 
            // Game.time % Memory.config.freq_intel_creep_fill[lvl] == 0 ||            
          ){
            var rm_creeps = _.filter(Game.creeps, (creep) => creep.memory.birth == rm  )
        }
        //


        // container half
        if ( Game.time % Memory.config.freq_intel_structures_energy[lvl] == 0 || global.reset == 1 ) {

            if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container ){

                for ( var i = 0 ; i < Game.rooms[rm].memory.intel.container.length ; i++){

                    if( ( i == 2 || i == 3 ) && Game.rooms[rm].memory.intel.container[i] && Game.rooms[rm].memory.intel.container[i].id ){

                        var ext = Game.getObjectById( Game.rooms[rm].memory.intel.container[i].id )

                        if( Game.rooms[rm].controller.level == 8 && Game.rooms[rm].memory.mode_defend == 0 ){
                            var energy_limit = 1800
                        }
                        else{
                            var energy_limit = 400
                        }

                        if ( ext && ext.store.getFreeCapacity('energy') >= energy_limit ) {

                            var do_it = 0                      
                            var obj       = _.filter( rm_creeps, (creep) => creep.memory.task_id && creep.memory.task_id == Game.rooms[rm].memory.intel.container[i].id  )
                            var store_sum = _.sum( obj, creep => { return creep.store['energy'] });
                            var store     = ext.store.getUsedCapacity() + store_sum
                            if ( store < ext.store.getCapacity()  ) {
                                var do_it = 1
                            }                      

                            if ( do_it == 1 ) {

                                var cnt = global.rooms[rm].manager_drop.length 

                                global.rooms[rm].manager_drop[cnt]             = {}
                                global.rooms[rm].manager_drop[cnt].type        = 'container_half'
                                global.rooms[rm].manager_drop[cnt].id          = Game.rooms[rm].memory.intel.container[i].id
                                global.rooms[rm].manager_drop[cnt].resource    = 'energy'
                                global.rooms[rm].manager_drop[cnt].operation   = 'transfer'
                                global.rooms[rm].manager_drop[cnt].need_av     = ext.store.getCapacity() - store

                                if( ext.store.getFreeCapacity() >= 1000 ){
                                    global.rooms[rm].manager_drop[cnt].priority    = 0.9
                                }
                                else{
                                    global.rooms[rm].manager_drop[cnt].priority    = 14
                                }                                

                                global.rooms[rm].manager_drop[cnt].cnt         = cnt

                            }
                        }
                    }
                }
            }
        }
        //


        // extension
        if ( Game.time % Memory.config.freq_intel_structures_energy[lvl] == 0 || global.reset == 1 ) {

            var exts = Game.rooms[rm].find(FIND_MY_STRUCTURES, {filter: (structure) =>  {return ( (structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity('energy') > 0    ) ) } })

            for ( var i = 0 ; i < exts.length ; i++){

                var ext = exts[i]

                if( ext ){

                    var priority = 1
                    if( Game.rooms[rm].memory.h1_type == 'h' || Game.rooms[rm].memory.h2_type == 'h' ){
                        if( Math.abs( ext.pos.x - Game.rooms[rm].memory.h1_x ) <= 2 && Math.abs( ext.pos.y - Game.rooms[rm].memory.h1_y ) <= 1 ){
                            var priority = 2.1

                            if( priority == 2.1 &&
                                Game.rooms[rm].memory.intel.container &&
                                Game.rooms[rm].memory.intel.container[2] && 
                                Game.rooms[rm].memory.intel.container[2].id &&
                                Game.getObjectById( Game.rooms[rm].memory.intel.container[2].id ) &&
                                Game.getObjectById( Game.rooms[rm].memory.intel.container[2].id ).store['energy'] >= 200 ){
                                var priority = 90
                            }
                        }
                        else if( Math.abs( ext.pos.x - Game.rooms[rm].memory.h2_x ) <= 2 && Math.abs( ext.pos.y - Game.rooms[rm].memory.h2_y ) <= 1 ){
                            var priority = 2.1

                            if( priority == 2.1 &&
                                Game.rooms[rm].memory.intel.container && 
                                Game.rooms[rm].memory.intel.container[3] && 
                                Game.rooms[rm].memory.intel.container[3].id &&
                                Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id ) &&
                                Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id ).store['energy'] >= 200 ){
                                var priority = 90
                            }
                        }                        
                    }
                    else if( Game.rooms[rm].memory.h1_type == 'v' || Game.rooms[rm].memory.h2_type == 'v' ){
                        if( Math.abs( ext.pos.x - Game.rooms[rm].memory.h1_x ) <= 1 && Math.abs( ext.pos.y - Game.rooms[rm].memory.h1_y ) <= 2 ){
                            var priority = 2.1

                            if( priority == 2.1 &&
                                Game.rooms[rm].memory.intel.container[2] && 
                                Game.rooms[rm].memory.intel.container[2].id &&
                                Game.getObjectById( Game.rooms[rm].memory.intel.container[2].id ) &&
                                Game.getObjectById( Game.rooms[rm].memory.intel.container[2].id ).store['energy'] >= 200 ){
                                var priority = 90
                            }
                        }
                        else if( Math.abs( ext.pos.x - Game.rooms[rm].memory.h2_x ) <= 1 && Math.abs( ext.pos.y - Game.rooms[rm].memory.h2_y ) <= 2 ){
                            var priority = 2.1

                            if( priority == 2.1 &&
                                Game.rooms[rm].memory.intel.container[3] && 
                                Game.rooms[rm].memory.intel.container[3].id &&
                                Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id ) &&
                                Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id ).store['energy'] >= 200 ){
                                var priority = 90
                            }
                        }                        
                    }
                    //

                    var obj       = _.filter( rm_creeps, (creep) => creep.memory.task_id && creep.memory.task_id == ext.id  )
                    var store_sum = _.sum( obj, creep => { return creep.store['energy'] });
                    var store     = ext.store.getUsedCapacity('energy') + store_sum

                    if ( store < ext.store.getCapacity('energy')  ) {

                        var cnt = global.rooms[rm].manager_drop.length

                        global.rooms[rm].manager_drop[cnt]             = {}
                        global.rooms[rm].manager_drop[cnt].type        = 'extension'
                        global.rooms[rm].manager_drop[cnt].id          = ext.id
                        global.rooms[rm].manager_drop[cnt].resource    = 'energy'
                        global.rooms[rm].manager_drop[cnt].operation   = 'transfer'
                        global.rooms[rm].manager_drop[cnt].need_av     = ext.store.getCapacity('energy') - store
                        
                        global.rooms[rm].manager_drop[cnt].priority    = priority

                        global.rooms[rm].manager_drop[cnt].cnt         = cnt

                    }
                }
            }
        }
        //

        // spawn
        if ( ( Game.time % ( Memory.config.freq_intel_structures_energy[lvl] )  == 0  && Game.rooms[rm].memory.intel.spawn ) || global.reset == 1 ) {

            for ( var i = 0 ; i < Game.rooms[rm].memory.intel.spawn.length ; i++){

                var ext = Game.getObjectById( Game.rooms[rm].memory.intel.spawn[i].id )

                if ( ext && ext.store.getFreeCapacity('energy') > 0 ) {

                    var obj             = _.filter( rm_creeps, (creep) => creep.memory.task_id && creep.memory.task_id == Game.rooms[rm].memory.intel.spawn[i].id  )
                    var store_sum       = _.sum( obj, creep => { return creep.store['energy'] });
                    var store           = ext.store.getUsedCapacity('energy') + store_sum

                    if ( store < ext.store.getCapacity('energy') ) {

                        var cnt = global.rooms[rm].manager_drop.length

                        global.rooms[rm].manager_drop[cnt]             = {}
                        global.rooms[rm].manager_drop[cnt].type        = 'spawn'
                        global.rooms[rm].manager_drop[cnt].id          = Game.rooms[rm].memory.intel.spawn[i].id
                        global.rooms[rm].manager_drop[cnt].resource    = 'energy'
                        global.rooms[rm].manager_drop[cnt].operation   = 'transfer'
                        global.rooms[rm].manager_drop[cnt].need_av     = ext.store.getCapacity('energy') - store
                        global.rooms[rm].manager_drop[cnt].priority    = 2
                        global.rooms[rm].manager_drop[cnt].cnt         = cnt

                    }
                }
            }
        }
        //


        // upgrade
        if ( Game.time % Memory.config.freq_intel_structures_energy[lvl] == 0 || global.reset == 1 ) {

            // unified priority
            if( Game.rooms[rm].controller.level < 8 ){
                var priority    = 1.5
            }
            else if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > (Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.upgrade_high ) ){
                var priority    = 15
            }
            else{
                var priority    = 101
            }
            //

            // container_controller
            if( Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[4] && Game.rooms[rm].memory.intel.container[4].id ){

                var ext = Game.getObjectById( Game.rooms[rm].memory.intel.container[4].id )

                if ( ext && ext.store.getFreeCapacity() >= 100 ) {

                    var do_it = 0
                
                    var obj       = _.filter( rm_creeps, (creep) => creep.memory.task_id && creep.memory.task_id == Game.rooms[rm].memory.intel.container[4].id  )
                    var store_sum = _.sum( obj, creep => { return creep.store['energy'] });
                    var store     = ext.store.getUsedCapacity() + store_sum
                      
                    if( ext.store.getUsedCapacity() < 1500 ){
                       var obj_up = ext.pos.findInRange(FIND_MY_CREEPS, 1,{ filter: creep => creep.memory.role == 'upgrader' && creep.store.getFreeCapacity() > 0 } )
                       var up_sum1 = _.sum( obj_up, creep => { return creep.store.getFreeCapacity() });
                       var up_sum2 = _.sum( obj_up, creep => { return creep.getActiveBodyparts(WORK) });

                       var stg_dit = Game.rooms[rm].controller.pos.getRangeTo( Game.rooms[rm].storage )

                       var store  = store - up_sum1 - up_sum2 * stg_dit * 2
                    }

                    if ( store <= ext.store.getCapacity() ) {
                        var do_it = 1
                    }
                    else if( !store ){
                        var store = 0
                        var do_it = 1
                    }

                    if ( do_it == 1 ) {

                        var cnt = global.rooms[rm].manager_drop.length

                        global.rooms[rm].manager_drop[cnt]             = {}
                        global.rooms[rm].manager_drop[cnt].type        = 'container_controller'
                        global.rooms[rm].manager_drop[cnt].id          = Game.rooms[rm].memory.intel.container[4].id
                        global.rooms[rm].manager_drop[cnt].resource    = 'energy'
                        global.rooms[rm].manager_drop[cnt].operation   = 'transfer'
                        global.rooms[rm].manager_drop[cnt].need_av     = ext.store.getCapacity() - store
                        if( priority == 1.5 && ext.store.getUsedCapacity() < 1500 ){
                            var priority = 0.99
                        }
                        global.rooms[rm].manager_drop[cnt].priority    = priority
                        global.rooms[rm].manager_drop[cnt].cnt         = cnt

                    }
                }
            }
            else {

                var obj = _.filter( rm_creeps, (creep) => creep.memory.role == 'upgrader' )

                if( obj && obj.length >= 1 ){

                    // // upgrader
                    // for ( var j = 0 ; j < obj.length ; j++){
                    //
                    //     if( obj[j].store.getFreeCapacity() >= 0 && _.filter( rm_creeps, (creep) => creep.memory.task_id && creep.memory.task_id == obj[j].id ).length == 0 ){
                    //
                    //         var cnt = global.rooms[rm].manager_drop.length
                    //
                    //         global.rooms[rm].manager_drop[cnt]             = {}
                    //         global.rooms[rm].manager_drop[cnt].type        = 'upgrader'
                    //         global.rooms[rm].manager_drop[cnt].id          = obj[j].id
                    //         global.rooms[rm].manager_drop[cnt].resource    = 'energy'
                    //         global.rooms[rm].manager_drop[cnt].operation   = 'transfer'
                    //         global.rooms[rm].manager_drop[cnt].need_av     = obj[j].store.getFreeCapacity()
                    //         global.rooms[rm].manager_drop[cnt].priority    = priority
                    //         global.rooms[rm].manager_drop[cnt].cnt         = cnt
                    //     }
                    // }

                    if( priority == 15 ){

                        // ground
                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                            if( Game.rooms[rm].memory.planner[k][2] == 'container' &&
                                Game.rooms[rm].memory.planner[k][3] == 4 ){

                                var pos = new RoomPosition(Game.rooms[rm].memory.planner[k][0], Game.rooms[rm].memory.planner[k][1], rm)
                                break;
                            }
                        }

                        var ground = Game.rooms[rm].lookForAt(LOOK_RESOURCES, pos);
                        var sum_ground = 0
                        if( ground ){
                            for ( var i = 0 ; i < ground.length ; i++){
                                if( ground[i].resourceType == 'energy' ){
                                    var sum_ground = sum_ground + ground[i].amount
                                }
                            }
                        }

                        var ticksToLive_sum = _.sum( obj, creep => { return creep.ticksToLive });
                        var workParts_sum   = _.sum( obj, creep => { return creep.getActiveBodyparts(WORK) });

                    }
                    else{
                        var sum_ground = 0
                        var ticksToLive_sum = 10000
                        var workParts_sum = 1
                    }

                    if( sum_ground < ticksToLive_sum * ( workParts_sum + 1 ) ){

                        var cnt = global.rooms[rm].manager_drop.length

                        global.rooms[rm].manager_drop[cnt]             = {}
                        global.rooms[rm].manager_drop[cnt].type        = 'drop_upgrade'
                        global.rooms[rm].manager_drop[cnt].id          = 'drop_upgrade'
                        global.rooms[rm].manager_drop[cnt].resource    = 'energy'
                        global.rooms[rm].manager_drop[cnt].operation   = 'drop'
                        global.rooms[rm].manager_drop[cnt].need_av     = ticksToLive_sum * ( workParts_sum + 1 ) - sum_ground
                        global.rooms[rm].manager_drop[cnt].priority    = priority + 0.1
                        global.rooms[rm].manager_drop[cnt].cnt         = cnt

                    }
                    //

                }
            }
        }
        //

        // tower
        if ( Game.time % Memory.config.freq_intel_towers[lvl] == 0 && Game.rooms[rm].memory.intel.tower ) {
        
            for ( var i = 0 ; i < Game.rooms[rm].memory.intel.tower.length ; i++){
        
                if( Game.rooms[rm].memory.intel.tower[i] && Game.rooms[rm].memory.intel.tower[i].id ){
        
                    var ext = Game.getObjectById( Game.rooms[rm].memory.intel.tower[i].id )
        
                    if ( ext && ext.store.getFreeCapacity('energy') >= 500 ) {
        
                        var obj             = _.filter( rm_creeps, (creep) => creep.memory.task_id && creep.memory.task_id == Game.rooms[rm].memory.intel.tower[i].id  )
                        var store_sum       = _.sum( obj, creep => { return creep.store['energy'] });
                        var store           = ext.store.getUsedCapacity('energy') + store_sum
        
                        if ( store <= ext.store.getCapacity('energy') - 50 ) {
        
                            var cnt = global.rooms[rm].manager_drop.length
        
                            global.rooms[rm].manager_drop[cnt]             = {}
                            global.rooms[rm].manager_drop[cnt].type        = 'tower'
                            global.rooms[rm].manager_drop[cnt].id          = Game.rooms[rm].memory.intel.tower[i].id
                            global.rooms[rm].manager_drop[cnt].resource    = 'energy'
                            global.rooms[rm].manager_drop[cnt].operation   = 'transfer'
                            global.rooms[rm].manager_drop[cnt].need_av     = ext.store.getCapacity('energy') - store
                            global.rooms[rm].manager_drop[cnt].priority    = 3
                            global.rooms[rm].manager_drop[cnt].cnt         = cnt
        
                        }
                    }
                    else if( ext ){
                        //
                    }
                    else{
                        delete Game.rooms[rm].memory.intel.tower[i]
                        Game.rooms[rm].memory.oneTimer.plannerReset = 2
                    }
                }
            }
        }
        
        
        // // repair
        // if ( Game.time % Memory.config.freq_intel_repair[lvl] == 0 ) {
        //
        //     /// wall and rampart hits
        //     // level 8
        //     if( Game.rooms[rm].memory.phase > 25 && Game.rooms[rm].memory.energy_cap >= 12900 && Game.rooms[rm].terminal ){
        //         var def_hits        = Memory.config.walls_def_hits[8]
        //         var def_hits_core   = Memory.config.walls_def_hits_core[8]
        //         var def_hits_lab    = Memory.config.walls_def_hits_lab[8]
        //     }
        //     // level 7
        //     else if( Game.rooms[rm].memory.phase > 25 && Game.rooms[rm].memory.energy_cap >= 5600 && Game.rooms[rm].terminal ){
        //         var def_hits        = Memory.config.walls_def_hits[7]
        //         var def_hits_core   = Memory.config.walls_def_hits_core[7]
        //         var def_hits_lab    = Memory.config.walls_def_hits_lab[7]
        //     }
        //     // level 6
        //     else if( Game.rooms[rm].memory.phase > 17 && Game.rooms[rm].memory.energy_cap >= 2300 && Game.rooms[rm].terminal ){
        //         var def_hits        = Memory.config.walls_def_hits[6]
        //         var def_hits_core   = Memory.config.walls_def_hits_core[6]
        //         var def_hits_lab    = Memory.config.walls_def_hits_lab[6]
        //     }
        //     else if( Game.rooms[rm].controller.level < 6 ){
        //         var def_hits        = Memory.config.walls_def_hits[Game.rooms[rm].controller.level]
        //         var def_hits_core   = Memory.config.walls_def_hits_core[Game.rooms[rm].controller.level]
        //         var def_hits_lab    = Memory.config.walls_def_hits_lab[Game.rooms[rm].controller.level]
        //     }
        //     else {
        //         var def_hits        = Memory.config.walls_def_hits[0]
        //         var def_hits_core   = Memory.config.walls_def_hits_core[0]
        //         var def_hits_lab    = Memory.config.walls_def_hits_lab[0]
        //     }
        //
        //
        //
        //     var obj = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( (structure.structureType == STRUCTURE_ROAD       && structure.hits <   2000    ) ||
        //                                                                                       (structure.structureType == STRUCTURE_CONTAINER  && structure.hits < 100000    ) ||
        //                                                                                       (structure.structureType == STRUCTURE_WALL       && structure.hits < 299000000 ) ||
        //                                                                                       (structure.structureType == STRUCTURE_RAMPART    && structure.hits < 299000000   )
        //                                                                                       ) } })
        //
        //     // remove nuke hit
        //     if( Game.rooms[rm].memory.mode_nuke == 1 ){
        //
        //         var obj = JSON.parse(JSON.stringify(obj))
        //
        //         for(var ramp_id in Game.rooms[rm].memory.nuke_repair ) {
        //
        //             for ( var i = 0 ; i < obj.length ; i++){
        //
        //                 if( obj[i].id == ramp_id){
        //                      obj[i].hits = obj[i].hits - Game.rooms[rm].memory.nuke_repair[ramp_id].hit
        //                      break;
        //                 }
        //             }
        //         }
        //     }
        //     //
        //
        //     var obj = _.sortBy(obj, 'hits');
        //
        //     var base_x_min = Game.rooms[rm].memory.base_x - 2
        //     var base_x_max = Game.rooms[rm].memory.base_x + 2
        //     var base_y_min = Game.rooms[rm].memory.base_y - 2
        //     var base_y_max = Game.rooms[rm].memory.base_y
        //
        //     var lab_x_min = Game.rooms[rm].memory.lab_x - 2
        //     var lab_x_max = Game.rooms[rm].memory.lab_x + 1
        //     var lab_y_min = Game.rooms[rm].memory.lab_y - 3
        //     var lab_y_max = Game.rooms[rm].memory.lab_y + 0
        //
        //     for ( var i = 0 ; i < obj.length ; i++){
        //
        //         var ok    = 0
        //         // core                 1
        //         // wall/rampart prior   2
        //         // wall/rampart buffer  2.5
        //         // wall/rampart extra   3
        //         // outros               4
        //
        //         if( obj[i].structureType == STRUCTURE_RAMPART || obj[i].structureType == STRUCTURE_WALL ){
        //
        //             var ramp_x = obj[i].pos.x
        //             var ramp_y = obj[i].pos.y
        //
        //             // CORE
        //             if( ramp_x >= base_x_min &&
        //                 ramp_y >= base_y_min &&
        //                 ramp_x <= base_x_max &&
        //                 ramp_y <= base_y_max ){
        //
        //                 var nuker_extra = 0
        //                 // nuke defender
        //                 if( Game.gcl.level >= 5 && Game.rooms[rm].controller.level >= 7 &&
        //                    ( ramp_x == Game.rooms[rm].memory.base_x && ramp_y == Game.rooms[rm].memory.base_y ) ||
        //                    ( ramp_x == Game.rooms[rm].memory.base_x + 2 && ramp_y == Game.rooms[rm].memory.base_y ) ||
        //                    ( ramp_x == Game.rooms[rm].memory.base_x + 2 && ramp_y == Game.rooms[rm].memory.base_y - 2 ) ){
        //                     var nuker_extra = 15000000 + ( Game.gcl.level - 5 ) * 1000000
        //
        //                     if( Game.rooms[rm].controller.level == 8 && Game.rooms[rm].memory.phase >= 41 ){
        //                         var nuker_extra = nuker_extra + ( Game.gcl.level - 5 ) * 1000000
        //                     }
        //                 }
        //
        //                 if( obj[i].hits <= def_hits_core + nuker_extra ){
        //                     var ok    = 1
        //                 }
        //             }
        //             // LAB
        //             else if( ramp_x >= lab_x_min &&
        //                      ramp_y >= lab_y_min &&
        //                      ramp_x <= lab_x_max &&
        //                      ramp_y <= lab_y_max ){
        //
        //                 if( obj[i].hits <= def_hits_lab ){
        //                     var ok    = 1
        //                 }
        //             }
        //             // RAMPART - priority
        //             else if( obj[i].hits <= def_hits ){
        //
        //                 // grenn or blue flags
        //                 var obj_ramp = Game.rooms[rm].lookForAt(LOOK_FLAGS, obj[i].pos.x, obj[i].pos.y);
        //
        //                 if( obj_ramp && obj_ramp.length >= 1 ){
        //                     // ok
        //                 }
        //                 else{
        //                     var obj_ramp = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, obj[i].pos.x, obj[i].pos.y);
        //                     var obj_ramp =  _.filter(obj_ramp, (structure) => structure.structureType == 'tower' ||
        //                                                                       structure.structureType == 'spawn' ||
        //                                                                       structure.structureType == 'terminal' ||
        //                                                                       structure.structureType == 'storage' ||
        //                                                                       structure.structureType == 'factory' )
        //                 }
        //
        //                 if( obj_ramp && obj_ramp.length >= 1 ){
        //                     for ( var j = 0 ; j < obj_ramp.length ; j++){
        //                         if( obj_ramp[j].color == 5 ){
        //                             var ok    = 2
        //                             break
        //                         }
        //                         else if( obj[i].hits <= def_hits / 4 && ( Game.rooms[rm].controller.safeMode > 0 || Game.rooms[rm].controller.safeModeCooldown > 0 || Game.shard.name == 'swc' || Game.shard.name == 'screepsplus0' || Game.shard.name == 'ba' ) ){
        //                             var ok    = 2
        //                             break
        //                         }
        //                         else {
        //                             var build_strct = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, obj[i].pos.x, obj[i].pos.y);
        //
        //                             for ( var j = 0 ; j < build_strct.length ; j++){
        //                                 if ( build_strct[j].structureType == 'tower'  ) {
        //                                     var ok    = 2
        //                                     break
        //                                 }
        //                             }
        //                         }
        //                         //
        //
        //                         if( ok == 2 ){
        //                             break;
        //                         }
        //                     }
        //                 }
        //                 //
        //             }
        //             // RAMPART - repairir trigger - 1.05 buffer
        //             else if( obj[i].hits <= (def_hits * 1.05) ){
        //
        //                 if( obj[i].hits <= (def_hits / 4 * 1.05) ){
        //                     var ok    = 2.5
        //                 }
        //                 else{
        //                     // grenn or blue flags
        //                     var obj_ramp = Game.rooms[rm].lookForAt(LOOK_FLAGS, obj[i].pos.x, obj[i].pos.y);
        //
        //                     if( obj_ramp && obj_ramp.length >= 1 ){
        //                         for ( var j = 0 ; j < obj_ramp.length ; j++){
        //                             if( obj_ramp[j].color == 5 || obj_ramp[j].color == 9 ){
        //                                 var ok    = 2.5
        //                                 break
        //                             }
        //                             else if( obj[i].hits <= (def_hits / 4 * 1.05) && ( Game.rooms[rm].controller.safeMode > 0 || Game.rooms[rm].controller.safeModeCooldown > 0 || Game.shard.name == 'swc' || Game.shard.name == 'screepsplus0' || Game.shard.name == 'ba' ) ){
        //                                 var ok    = 2.5
        //                                 break
        //                             }
        //                             else {
        //                                 var build_strct = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, obj[i].pos.x, obj[i].pos.y);
        //
        //                                 for ( var j = 0 ; j < build_strct.length ; j++){
        //                                     if ( build_strct[j].structureType == 'tower'  ) {
        //                                         var ok    = 2.5
        //                                         break
        //                                     }
        //                                 }
        //                             }
        //                             //
        //
        //                             if( ok == 2.5 ){
        //                                 break;
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //             // RAMPART - long term
        //             else if( obj[i].hits > (def_hits * 1.05) ){
        //                 var ok    = 3
        //             }
        //         }
        //         // OTHER PLACES
        //         else{
        //             var ok = 4
        //         }
        //
        //         if ( ok >= 1  ){
        //             var store_needed    = ( obj[i].hitsMax - obj[i].hits ) / 100
        //
        //             if ( store_needed > 0 ) {
        //
        //                 var cnt = global.rooms[rm].manager_drop.length
        //
        //                 global.rooms[rm].manager_drop[cnt]             = {}
        //                 global.rooms[rm].manager_drop[cnt].type        = 'repair'
        //                 global.rooms[rm].manager_drop[cnt].id          = obj[i].id
        //                 global.rooms[rm].manager_drop[cnt].resource    = 'energy'
        //                 global.rooms[rm].manager_drop[cnt].operation   = 'repair'
        //                 global.rooms[rm].manager_drop[cnt].need_av     = store_needed
        //                 if( ok == 2  ){
        //
        //                     if( Game.rooms[rm].memory.mode_nuke == 1 && obj[i].hits < -10000000 ){
        //                         global.rooms[rm].manager_drop[cnt].priority    = 4.6
        //                     }
        //                     else if( Game.rooms[rm].memory.mode_nuke == 1 && obj[i].hits < -5000000 ){
        //                         global.rooms[rm].manager_drop[cnt].priority    = 4.7
        //                     }
        //                     else if( Game.rooms[rm].memory.mode_nuke == 1 && obj[i].hits < 0 ){
        //                         global.rooms[rm].manager_drop[cnt].priority    = 4.8
        //                     }
        //                     else if( Game.rooms[rm].memory.mode_nuke == 1 && obj[i].hits < 500000 ){
        //                         global.rooms[rm].manager_drop[cnt].priority    = 4.9
        //                     }
        //                     else{
        //                         global.rooms[rm].manager_drop[cnt].priority    = 5
        //                     }
        //                 }
        //                 else if ( ok == 1 ) {
        //                     global.rooms[rm].manager_drop[cnt].priority    = 6
        //
        //                     if( Game.rooms[rm].memory.mode_nuke == 1 ){
        //                         global.rooms[rm].manager_drop[cnt].priority    = 4.6
        //                     }
        //                 }
        //                 else if ( ok == 4 ) {
        //                     global.rooms[rm].manager_drop[cnt].priority    = 10
        //                 }
        //                 else {
        //                     // se tem muito recurso interfere com o boosting, então é menlhor só acontecer em salar de lvl8, as outras vão usar o recurso para upgrade
        //                     if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > (Game.rooms[rm].memory.storage_lvl * .65 && Game.rooms[rm].controller.level == 8 ) ){
        //                         global.rooms[rm].manager_drop[cnt].priority    = 99
        //                         if ( ok == 2.5 ) {
        //                             global.rooms[rm].manager_drop[cnt].priority = global.rooms[rm].manager_drop[cnt].priority - 0.1
        //                         }
        //                     }
        //                     else{
        //                         global.rooms[rm].manager_drop[cnt].priority    = 102
        //                         if ( ok == 2.5 ) {
        //                             global.rooms[rm].manager_drop[cnt].priority = global.rooms[rm].manager_drop[cnt].priority - 0.1
        //                         }
        //                     }
        //                 }
        //                 global.rooms[rm].manager_drop[cnt].cnt         = cnt
        //
        //                 // core                 1
        //                 // wall/rampart prior   2
        //                 // wall/rampart buffer  2.5
        //                 // wall/rampart extra   3
        //                 // outros               4
        //
        //             }
        //         }
        //     }
        // }
        // //
        //


        // repair
        if ( Game.rooms[rm].memory.oneTimer.repair == 1 || global.reset == 1 ) {

            // similar to repairer role (need to sync code)
     
            /// wall and rampart hits
            // level 8
            if( Game.rooms[rm].memory.energy_cap >= 12900 && Game.rooms[rm].terminal && Game.rooms[rm].storage ){
                var def_hits = Memory.config.walls_def_hits[8]
            }
            // level 7
            else if( Game.rooms[rm].memory.energy_cap >= 5600 && Game.rooms[rm].terminal && Game.rooms[rm].storage ){
                var def_hits = Memory.config.walls_def_hits[7]
            }
            // level 6
            else if( Game.rooms[rm].memory.energy_cap >= 2300 && Game.rooms[rm].terminal && Game.rooms[rm].storage ){
                var def_hits = Memory.config.walls_def_hits[6]
            }
            else if( Game.rooms[rm].controller.level < 6 ){
                var def_hits = Memory.config.walls_def_hits[Game.rooms[rm].controller.level]
            }
            else {
                var def_hits = Memory.config.walls_def_hits[0]
            }
                
            var obj = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( (structure.structureType == STRUCTURE_ROAD       && structure.hits <=    300      && structure.hitsMax ==  5000    ) ||
                                                                                              (structure.structureType == STRUCTURE_ROAD       && structure.hits <=   1500      && structure.hitsMax >= 25000    ) ||
                                                                                              (structure.structureType == STRUCTURE_CONTAINER  && structure.hits <=  30000    ) ||
                                                                                              (structure.structureType == STRUCTURE_WALL       && structure.hits <= 1000000   ) ||
                                                                                              (structure.structureType == STRUCTURE_RAMPART    && structure.hits <= def_hits * 2 )
                                                                                              ) } })
        
        
            var obj = _.sortBy(obj, 'hits');

            var ok    = 0 

            var ramp_repair = 0 
       
            for ( var i = 0 ; i < obj.length ; i++){
        
                if( obj[i].structureType == STRUCTURE_ROAD || obj[i].structureType == STRUCTURE_CONTAINER  ){        
                    var ok = 1 
                    break;
                }
                else if( obj[i].structureType == STRUCTURE_WALL && obj[i].hits <= Math.min( 1000000, def_hits) ){        
                    var ok = 1 
                    var ramp_repair = 1 
                    break;
                } 
                else if( obj[i].structureType == STRUCTURE_RAMPART && obj[i].hits <= def_hits *.5 * 1.05 ){     
                    var ok = 1 
                    var ramp_repair = 1 
                    break;
                } 
                else if( obj[i].structureType == STRUCTURE_RAMPART && obj[i].hits <= def_hits * 1.1 ){     
                    
                    var obj_ramp = Game.rooms[rm].lookForAt(LOOK_FLAGS, obj[i].pos.x, obj[i].pos.y);
        
                    if( obj_ramp && obj_ramp.length >= 1 ){
                        for ( var j = 0 ; j < obj_ramp.length ; j++){
                            if( obj_ramp[j].color == 5 ){
                                var ok = 1 
                                var ramp_repair = 1 
                                break;
                            }
                        }
                    }
                    
                    if( ok == 1 ){
                        break;
                    }
                }    
            }

            // spawn repairer
            if ( ok == 1  ){
                Game.rooms[rm].memory.repairer_need = 1
            }
            else{
                Game.rooms[rm].memory.repairer_need = 0

                if( Game.rooms[rm].controller.safeMode && Game.rooms[rm].controller.safeMode >= 1 ){
                    Game.rooms[rm].memory.repairer_need = 1
                }
                else if( Game.rooms[rm].controller.safeModeCooldown && Game.rooms[rm].controller.safeModeCooldown >= 1 ){
                    Game.rooms[rm].memory.repairer_need = 1
                }
            }

            // ramp repair needed 
            if ( ramp_repair == 1  ){
                Game.rooms[rm].memory.ramp_repairer_need = 1
            }
            else{
                Game.rooms[rm].memory.ramp_repairer_need = 0
            }

            
            var obj = _.filter( rm_creeps, (creep) => creep.memory.role && creep.memory.role == 'repairer' && creep.memory.boosted == 1 &&
                                                                  creep.store.getFreeCapacity() >= creep.store.getUsedCapacity() )
                            
            if( obj && obj.length >= 1 ){

                var priority = 3.9

                // repairer
                for ( var j = 0 ; j < obj.length ; j++){    

                    if( obj[j].store.getFreeCapacity() >= obj[j].store['energy'] ){
                
                        var cnt = global.rooms[rm].manager_drop.length

                        global.rooms[rm].manager_drop[cnt]             = {}
                        global.rooms[rm].manager_drop[cnt].type        = 'repairer'
                        global.rooms[rm].manager_drop[cnt].id          = obj[j].id
                        global.rooms[rm].manager_drop[cnt].resource    = 'energy'
                        global.rooms[rm].manager_drop[cnt].operation   = 'transfer'
                        global.rooms[rm].manager_drop[cnt].need_av     = 2 - _.filter( rm_creeps, (creep) => creep.memory.task_id && creep.memory.task_id == obj[j].id ).length
                        global.rooms[rm].manager_drop[cnt].priority    = priority
                        global.rooms[rm].manager_drop[cnt].cnt         = cnt
                    }
                }
            }  
        }
        //
        


        // building
        if ( Game.rooms[rm].memory.intel.construction && Game.rooms[rm].memory.intel.construction.length > 0 ) {

            for ( var i = 0 ; i < Game.rooms[rm].memory.intel.construction.length ; i++){

                var ext = Game.getObjectById( Game.rooms[rm].memory.intel.construction[i].id )

                if( ext ){

                    var obj             = _.filter( rm_creeps, (creep) => creep.memory.task_id && creep.memory.task_id == Game.rooms[rm].memory.intel.construction[i].id &&
                                                                          creep.memory.role    && creep.memory.role == 'builder' &&
                                                                          creep.store.getFreeCapacity() >= creep.store.getUsedCapacity() )
                    // var store_sum       = _.sum( obj, creep => { return creep.store['energy'] });
                    // var store           = ext.progress + store_sum
                    //
                    // if ( store < ext.progressTotal ) {

                    if( obj && obj.length >= 1 ){

                        // unified priority
                        if( Game.getObjectById( Game.rooms[rm].memory.intel.construction[i].id ).structureType == 'rampart' && Game.rooms[rm].energyCapacityAvailable >= 5300 && Game.rooms[rm].terminal ){
                            var priority    = 4
                        }
                        else {
                            if(  Game.rooms[rm].memory.mode_defend == 0 ){
                                var priority = 4
                            }
                            else {
                                var priority = 7
                            }
                        }

                        // builder
                        for ( var j = 0 ; j < obj.length ; j++){                            

                            var cnt = global.rooms[rm].manager_drop.length

                            global.rooms[rm].manager_drop[cnt]             = {}
                            global.rooms[rm].manager_drop[cnt].type        = 'builder'
                            global.rooms[rm].manager_drop[cnt].id          = obj[j].id
                            global.rooms[rm].manager_drop[cnt].resource    = 'energy'
                            global.rooms[rm].manager_drop[cnt].operation   = 'transfer'
                            global.rooms[rm].manager_drop[cnt].need_av     = 4 - _.filter( rm_creeps, (creep) => creep.memory.task_id && creep.memory.task_id == obj[j].id ).length
                            global.rooms[rm].manager_drop[cnt].priority    = priority
                            global.rooms[rm].manager_drop[cnt].cnt         = cnt
                        }
                    }


                        // // hauler // ground
                        // if( obj && obj.length >= 1 ){
                        //     var cnt = global.rooms[rm].manager_drop.length
                        //
                        //     global.rooms[rm].manager_drop[cnt]             = {}
                        //     global.rooms[rm].manager_drop[cnt].type        = 'drop_build'
                        //     global.rooms[rm].manager_drop[cnt].id          = Game.rooms[rm].memory.intel.construction[i].id
                        //     global.rooms[rm].manager_drop[cnt].resource    = 'energy'
                        //     global.rooms[rm].manager_drop[cnt].operation   = 'drop'
                        //     global.rooms[rm].manager_drop[cnt].need_av     = ext.progressTotal - store
                        //     global.rooms[rm].manager_drop[cnt].priority    = priority + 0.1
                        //     global.rooms[rm].manager_drop[cnt].cnt         = cnt
                        // }
                    // }
                }
            }
        }


        //
        // // upgrade
        // if ( Game.time % Memory.config.freq_intel_controller[lvl] == 0  ) {
        //
        //     var obj = _.filter(global.rooms[rm].manager_drop, (manager_drop) => manager_drop.type == 'upgrade'  )
        //
        //     if ( obj.length >= 1){
        //         // ja esta na lista
        //         for ( var i = 0 ; i < global.rooms[rm].manager_drop.length ; i++){
        //
        //             if( global.rooms[rm].manager_drop[i].type == 'upgrade' ){
        //
        //                 if( Game.rooms[rm].controller.level >= 7 ){
        //                     if( Game.rooms[rm].controller.ticksToDowngrade < 5000 ){
        //                         global.rooms[rm].manager_drop[i].priority = 0
        //                     }
        //                     else if( Game.rooms[rm].controller.ticksToDowngrade < 9500 ){
        //                         global.rooms[rm].manager_drop[i].priority = 3.9
        //                     }
        //                     else if( Game.rooms[rm].controller.ticksToDowngrade < 145000 ){
        //                           if( Game.rooms[rm].memory.mode_defend == 1 ){
        //                               global.rooms[rm].manager_drop[i].priority = 6
        //                           }
        //                           else{
        //                               global.rooms[rm].manager_drop[i].priority = 4
        //                           }
        //                     }
        //                     else {
        //                         global.rooms[rm].manager_drop[i].priority = 98
        //                     }
        //                 }
        //                 else{
        //                     if( Game.rooms[rm].controller.ticksToDowngrade < 5000 ){
        //                         global.rooms[rm].manager_drop[i].priority = 0
        //                     }
        //                     else if( Game.rooms[rm].controller.ticksToDowngrade < 9000 ){
        //                         global.rooms[rm].manager_drop[i].priority = 4
        //                     }
        //                     else {
        //                         if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > (Game.rooms[rm].memory.storage_lvl * .65) ){
        //                             global.rooms[rm].manager_drop[i].priority = 50
        //                         }
        //                         else{
        //                             global.rooms[rm].manager_drop[i].priority = 99
        //                         }
        //                     }
        //                 }
        //                 break;
        //             }
        //         }
        //     }
        //     else {
        //         var cnt = global.rooms[rm].manager_drop.length
        //
        //         global.rooms[rm].manager_drop[cnt]             = {}
        //         global.rooms[rm].manager_drop[cnt].type        = 'upgrade'
        //         global.rooms[rm].manager_drop[cnt].id          = Game.rooms[rm].controller.id
        //         global.rooms[rm].manager_drop[cnt].resource    = 'energy'
        //         global.rooms[rm].manager_drop[cnt].operation   = 'upgradeController'
        //         global.rooms[rm].manager_drop[cnt].need_av     = 99999
        //         global.rooms[rm].manager_drop[cnt].priority    = 1000
        //         global.rooms[rm].manager_drop[cnt].cnt         = cnt
        //
        //     }
        // }
        // //
        //
        //
        // // working creeps fill
        // if ( Game.time % Memory.config.freq_intel_creep_fill[lvl] == 0  ) {
        //
        //     var obj = _.filter( rm_creeps , (creep) => creep.memory.role == 'harvester_min' && (creep.memory.birth_target == 'work' || creep.memory.birth_target == 'repair') && creep.memory.birth == rm && creep.memory.harvesting == false && creep.store.getFreeCapacity() > creep.store.getCapacity() / 2 )
        //
        //     if ( obj.length >= 1){
        //
        //         for ( var i = 0 ; i < obj.length ; i++){
        //
        //             var cnt = global.rooms[rm].manager_drop.length
        //
        //             global.rooms[rm].manager_drop[cnt]             = {}
        //             global.rooms[rm].manager_drop[cnt].type        = 'fill creep'
        //             global.rooms[rm].manager_drop[cnt].id          = obj[i].id
        //             global.rooms[rm].manager_drop[cnt].resource    = 'energy'
        //             global.rooms[rm].manager_drop[cnt].operation   = 'transfer'
        //             global.rooms[rm].manager_drop[cnt].priority    = 50
        //             global.rooms[rm].manager_drop[cnt].need_av     = obj[i].store.getFreeCapacity()
        //             global.rooms[rm].manager_drop[cnt].cnt         = cnt
        //         }
        //     }
        // }
        
        
        // storage
        if ( ( Game.time % Memory.config.freq_intel_storage[lvl] == 0 && Game.rooms[rm].storage ) || global.reset == 1 ) {
        
            if ( Game.rooms[rm].storage ) {
    
                var store = Math.max( Game.rooms[rm].storage.store.getFreeCapacity() - 10000, 0 )
    
                if ( store > 0 ) {
    
                    var cnt = global.rooms[rm].manager_drop.length
    
                    global.rooms[rm].manager_drop[cnt]             = {}
                    global.rooms[rm].manager_drop[cnt].type        = 'storage'
                    global.rooms[rm].manager_drop[cnt].id          = Game.rooms[rm].storage.id
                    global.rooms[rm].manager_drop[cnt].resource    = 'energy'
                    global.rooms[rm].manager_drop[cnt].operation   = 'transfer'
                    global.rooms[rm].manager_drop[cnt].need_av     = store
                    global.rooms[rm].manager_drop[cnt].priority    = 100
                    global.rooms[rm].manager_drop[cnt].cnt         = cnt
    
                }
            }
            else{
                Game.rooms[rm].memory.oneTimer.plannerReset = 2
            }
        }
        //



        //
        //
        //
        // // wall
        //
        // // lab energy
        //
        // // nuke
        // if ( Game.time % Memory.config.freq_intel_repair[lvl] == 0 && Game.rooms[rm].controller.level >= 6 ) {
        //
        //     var obj = Game.rooms[rm].find(FIND_NUKES)
        //     if( obj && obj.length > 0 ){
        //
        //         // main spawn
        //         if( obj[0].pos.x >= Game.rooms[rm].memory.base_x - 2 &&
        //             obj[0].pos.x <= Game.rooms[rm].memory.base_x + 2 &&
        //             obj[0].pos.y >= Game.rooms[rm].memory.base_y - 2 &&
        //             obj[0].pos.y <= Game.rooms[rm].memory.base_y + 2 ){
        //
        //             if( obj[0].pos.x == Game.rooms[rm].memory.base_x && obj[0].pos.y == Game.rooms[rm].memory.base_y ){
        //                 var obj2 = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, Game.rooms[rm].memory.base_x, Game.rooms[rm].memory.base_y, {filter: (structure) =>  {return ( (structure.structureType == STRUCTURE_RAMPART && structure.hits < 5001000  ) ) } } )
        //             }
        //             else{
        //                 var obj2 = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, Game.rooms[rm].memory.base_x, Game.rooms[rm].memory.base_y, {filter: (structure) =>  {return ( (structure.structureType == STRUCTURE_RAMPART && structure.hits < 10001000  ) ) } } )
        //             }
        //
        //             if( obj2 && obj2.length >= 1 ){
        //
        //                 var cnt = global.rooms[rm].manager_drop.length
        //
        //                 global.rooms[rm].manager_drop[cnt]             = {}
        //                 global.rooms[rm].manager_drop[cnt].type        = 'repair'
        //                 global.rooms[rm].manager_drop[cnt].id          = obj2[0].id
        //                 global.rooms[rm].manager_drop[cnt].resource    = 'energy'
        //                 global.rooms[rm].manager_drop[cnt].operation   = 'repair'
        //                 global.rooms[rm].manager_drop[cnt].need_av     = (10001000 - obj2[0].hits)/100
        //                 global.rooms[rm].manager_drop[cnt].priority    = 8
        //
        //                 global.rooms[rm].manager_drop[cnt].cnt         = cnt
        //
        //             }
        //         }
        //
        //         // terminal
        //         if( obj[0].pos.x >= Game.rooms[rm].memory.base_x - 2 + 2 &&
        //             obj[0].pos.x <= Game.rooms[rm].memory.base_x + 2 + 2 &&
        //             obj[0].pos.y >= Game.rooms[rm].memory.base_y - 2 - 2 &&
        //             obj[0].pos.y <= Game.rooms[rm].memory.base_y + 2 - 2 ){
        //
        //             if( obj[0].pos.x == Game.rooms[rm].memory.base_x + 2 && obj[0].pos.y == Game.rooms[rm].memory.base_y - 2 ){
        //                 var obj2 = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, Game.rooms[rm].memory.base_x, Game.rooms[rm].memory.base_y, {filter: (structure) =>  {return ( (structure.structureType == STRUCTURE_RAMPART && structure.hits < 5001000  ) ) } } )
        //             }
        //             else{
        //                 var obj2 = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, Game.rooms[rm].memory.base_x, Game.rooms[rm].memory.base_y, {filter: (structure) =>  {return ( (structure.structureType == STRUCTURE_RAMPART && structure.hits < 10001000  ) ) } } )
        //             }
        //
        //             if( obj2 && obj2.length >= 1 ){
        //
        //                 var cnt = global.rooms[rm].manager_drop.length
        //
        //                 global.rooms[rm].manager_drop[cnt]             = {}
        //                 global.rooms[rm].manager_drop[cnt].type        = 'repair'
        //                 global.rooms[rm].manager_drop[cnt].id          = obj2[0].id
        //                 global.rooms[rm].manager_drop[cnt].resource    = 'energy'
        //                 global.rooms[rm].manager_drop[cnt].operation   = 'repair'
        //                 global.rooms[rm].manager_drop[cnt].need_av     = (10001000 - obj2[0].hits)/100
        //                 global.rooms[rm].manager_drop[cnt].priority    = 8
        //
        //                 global.rooms[rm].manager_drop[cnt].cnt         = cnt
        //
        //             }
        //         }
        //
        //         // storage
        //         if( obj[0].pos.x >= Game.rooms[rm].memory.base_x - 2 + 2 &&
        //             obj[0].pos.x <= Game.rooms[rm].memory.base_x + 2 + 2 &&
        //             obj[0].pos.y >= Game.rooms[rm].memory.base_y - 2  &&
        //             obj[0].pos.y <= Game.rooms[rm].memory.base_y + 2  ){
        //
        //             if( obj[0].pos.x == Game.rooms[rm].memory.base_x + 2 && obj[0].pos.y == Game.rooms[rm].memory.base_y ){
        //                 var obj2 = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, Game.rooms[rm].memory.base_x, Game.rooms[rm].memory.base_y, {filter: (structure) =>  {return ( (structure.structureType == STRUCTURE_RAMPART && structure.hits < 5001000  ) ) } } )
        //             }
        //             else{
        //                 var obj2 = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, Game.rooms[rm].memory.base_x, Game.rooms[rm].memory.base_y, {filter: (structure) =>  {return ( (structure.structureType == STRUCTURE_RAMPART && structure.hits < 10001000  ) ) } } )
        //             }
        //
        //             if( obj2 && obj2.length >= 1 ){
        //
        //                 var cnt = global.rooms[rm].manager_drop.length
        //
        //                 global.rooms[rm].manager_drop[cnt]             = {}
        //                 global.rooms[rm].manager_drop[cnt].type        = 'repair'
        //                 global.rooms[rm].manager_drop[cnt].id          = obj2[0].id
        //                 global.rooms[rm].manager_drop[cnt].resource    = 'energy'
        //                 global.rooms[rm].manager_drop[cnt].operation   = 'repair'
        //                 global.rooms[rm].manager_drop[cnt].need_av     = (10001000 - obj2[0].hits)/100
        //                 global.rooms[rm].manager_drop[cnt].priority    = 8
        //
        //                 global.rooms[rm].manager_drop[cnt].cnt         = cnt
        //
        //             }
        //         }
        //     }
        // }
        //
        //
        // sort
        // creep filter
        if( Game.time % Memory.config.freq_intel_structures_energy[lvl] == 0 ||
            Game.time % Memory.config.freq_intel_towers[lvl] == 0 ||
            Game.rooms[rm].memory.oneTimer.repair == 1 ||
            ( Game.rooms[rm].memory.intel.construction && Game.rooms[rm].memory.intel.construction.length > 0 ) ||
            Game.time % Memory.config.freq_intel_storage[lvl] == 0 
          //   Game.time % Memory.config.freq_intel_creep_fill[lvl] == 0
          ){

            var obj = _.filter(global.rooms[rm].manager_drop, (manager_drop) => manager_drop.need_av > 0  )
            global.rooms[rm].manager_drop = _.sortBy( obj, 'priority')

            for (var i = 0 ; i < global.rooms[rm].manager_drop.length ; i++ ){
                global.rooms[rm].manager_drop[i].cnt = i
            }
        }
        //


        // COLLECT

        if( Game.time % Memory.config.freq_collect == 0 || global.reset == 1 ){

            var mainIntel = require('main.intel') 
            mainIntel.run( rm)

            // zera a memoria
            global.rooms[rm].manager_collect = []
        
            // storage - low fill extesions
            if (  Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] && Game.rooms[rm].energyAvailable/Game.rooms[rm].energyCapacityAvailable < 0.5 ) {
        
                var cnt = global.rooms[rm].manager_collect.length
        
                global.rooms[rm].manager_collect[cnt]             = {}
                global.rooms[rm].manager_collect[cnt].type        = 'storage'
                global.rooms[rm].manager_collect[cnt].id          = Game.rooms[rm].storage.id
                global.rooms[rm].manager_collect[cnt].resource    = 'energy'
                global.rooms[rm].manager_collect[cnt].operation   = 'withdraw'
                global.rooms[rm].manager_collect[cnt].store       = Game.rooms[rm].storage.store['energy']
                global.rooms[rm].manager_collect[cnt].cnt         = cnt
            }
            //
        
        
            // ruins
            if ( Game.rooms[rm].memory.intel.ruins && Game.rooms[rm].memory.intel.ruins.length >= 1 ) {
        
                for ( var i = 0 ; i < Game.rooms[rm].memory.intel.ruins.length ; i++){
        
                    if ( Game.rooms[rm].memory.intel.ruins[i] && Game.rooms[rm].memory.intel.ruins[i].id ) {
        
                        var obj2        = _.filter(rm_creeps, (creep) => creep.memory.birth == rm && creep.memory.task_id == Game.rooms[rm].memory.intel.ruins[i].id )
                        var store_sum   = _.sum( obj2, creep => { return creep.store.getFreeCapacity() });
        
                        var obj = Game.getObjectById( Game.rooms[rm].memory.intel.ruins[i].id )

                        if( obj ){
                            for(var minerals in obj.store ) {
            
                                if ( obj.store[minerals] >= 50 && obj.store.getUsedCapacity() - store_sum >= 25 * Game.rooms[rm].controller.level &&
                                     ( minerals == 'energy' || ( minerals != 'energy' && Game.rooms[rm].storage ) ) ){
                
                                    var cnt = global.rooms[rm].manager_collect.length
                
                                    global.rooms[rm].manager_collect[cnt]             = {}
                                    global.rooms[rm].manager_collect[cnt].type        = 'ruins'
                                    global.rooms[rm].manager_collect[cnt].id          = Game.rooms[rm].memory.intel.ruins[i].id
                                    global.rooms[rm].manager_collect[cnt].resource    = minerals
                                    global.rooms[rm].manager_collect[cnt].operation   = 'withdraw'
                                    global.rooms[rm].manager_collect[cnt].store       = obj.store.getUsedCapacity() - store_sum
                                    global.rooms[rm].manager_collect[cnt].cnt         = cnt
                                }
                            }
                        }
                    }
                }
            }
            //


            // tombstone
            if (  Game.rooms[rm].memory.intel.tombstone && Game.rooms[rm].memory.intel.tombstone.length >= 1 ) {
        
                for ( var i = 0 ; i < Game.rooms[rm].memory.intel.tombstone.length ; i++){
        
                    if ( Game.rooms[rm].memory.intel.tombstone[i] && Game.rooms[rm].memory.intel.tombstone[i].id ) {
        
                        var obj2        = _.filter(rm_creeps, (creep) => creep.memory.birth == rm && creep.memory.task_id == Game.rooms[rm].memory.intel.tombstone[i].id )
                        var store_sum   = _.sum( obj2, creep => { return creep.store.getFreeCapacity() });
        
                        var obj = Game.getObjectById( Game.rooms[rm].memory.intel.tombstone[i].id )

                        if( obj ){
                            for(var minerals in obj.store ) {
            
                                if ( obj.store[minerals] >= 50 && obj.store.getUsedCapacity() - store_sum >= 25 * Game.rooms[rm].controller.level &&
                                     ( minerals == 'energy' || ( minerals != 'energy' && Game.rooms[rm].storage ) ) ){
                
                                    var cnt = global.rooms[rm].manager_collect.length
                
                                    global.rooms[rm].manager_collect[cnt]             = {}
                                    global.rooms[rm].manager_collect[cnt].type        = 'tombstone'
                                    global.rooms[rm].manager_collect[cnt].id          = Game.rooms[rm].memory.intel.tombstone[i].id
                                    global.rooms[rm].manager_collect[cnt].resource    = minerals
                                    global.rooms[rm].manager_collect[cnt].operation   = 'withdraw'
                                    global.rooms[rm].manager_collect[cnt].store       = obj.store.getUsedCapacity() - store_sum
                                    global.rooms[rm].manager_collect[cnt].cnt         = cnt
                                }
                            }
                        }
                    }
                }
            }
            //       
        
           



            // container
            if (  Game.rooms[rm].memory.intel.container ) {

                var rand = Math.floor(Math.random() * 100) + 1;
        
                for ( var i = 0 ; i < Game.rooms[rm].memory.intel.container.length ; i++){

                    // nao a partir do 3 (que eh o container da base)
                    if ( i == 0 || i == 1 ) {

                        if ( Game.rooms[rm].memory.intel.container[i] && Game.rooms[rm].memory.intel.container[i].id ) {

                            var obj = Game.getObjectById( Game.rooms[rm].memory.intel.container[i].id  )

                            if( obj && obj.store['energy'] >= 100 ){

                                var obj2        = _.filter( rm_creeps, (creep) => creep.memory.task_id == Game.rooms[rm].memory.intel.container[i].id )
                                var store_sum   = _.sum( obj2, creep => { return creep.store.getFreeCapacity() });

                                if ( obj && obj.store && obj.store['energy'] - store_sum > 0 ){

                                    var cnt = global.rooms[rm].manager_collect.length

                                    global.rooms[rm].manager_collect[cnt]             = {}
                                    global.rooms[rm].manager_collect[cnt].type        = 'container'
                                    global.rooms[rm].manager_collect[cnt].id          = Game.rooms[rm].memory.intel.container[i].id
                                    global.rooms[rm].manager_collect[cnt].resource    = 'energy'
                                    global.rooms[rm].manager_collect[cnt].operation   = 'withdraw'
                                    global.rooms[rm].manager_collect[cnt].store       = obj.store['energy'] - store_sum
                                    global.rooms[rm].manager_collect[cnt].cnt         = cnt
                                }
                            }
                        }
                    }

                    // remove minerals from containers
                    if( rand == 1 && Game.rooms[rm].memory.intel.container[i] && Game.rooms[rm].memory.intel.container[i].id && Game.rooms[rm].storage ){

                        var obj = Game.getObjectById( Game.rooms[rm].memory.intel.container[i].id  )

                        if( obj && obj.store['energy'] != obj.store.getUsedCapacity() ){

                            for(var minerals in obj.store ) {
            
                                if ( obj.store[minerals] > 0 ){
                
                                    var cnt = global.rooms[rm].manager_collect.length
                
                                    global.rooms[rm].manager_collect[cnt]             = {}
                                    global.rooms[rm].manager_collect[cnt].type        = 'container'
                                    global.rooms[rm].manager_collect[cnt].id          = Game.rooms[rm].memory.intel.container[i].id
                                    global.rooms[rm].manager_collect[cnt].resource    = minerals
                                    global.rooms[rm].manager_collect[cnt].operation   = 'withdraw'
                                    global.rooms[rm].manager_collect[cnt].store       = obj.store[minerals]
                                    global.rooms[rm].manager_collect[cnt].cnt         = cnt
                                }
                            }
                        }
                    }
                }
            }

            // resource ground
            if ( Game.rooms[rm].memory.intel.dropped && Game.rooms[rm].memory.intel.dropped.length >= 1 ) {

                for ( var i = 0 ; i < Game.rooms[rm].memory.intel.dropped.length ; i++){

                    if ( Game.rooms[rm].memory.intel.dropped[i] && Game.rooms[rm].memory.intel.dropped[i].id ) {

                        var obj = Game.getObjectById( Game.rooms[rm].memory.intel.dropped[i].id  )

                        if( obj ) {

                            var av_rm = 0
                            if( Game.rooms[rm].storage  ){ var av_rm = av_rm + obj.resourceType + 1 }
                            if( Game.rooms[rm].terminal ){ var av_rm = av_rm + obj.resourceType }

                            if ( ( av_rm > 0 && av_rm < 14000) || obj.resourceType == 'energy' ) {

                                var obj2        = _.filter(rm_creeps, (creep) => creep.memory.birth == rm && creep.memory.task_id == Game.rooms[rm].memory.intel.dropped[i].id )
                                var store_sum   = _.sum( obj2, creep => { return creep.store.getFreeCapacity() });

                                if ( obj && obj.amount - store_sum >= 1 && ( obj.resourceType == 'energy' || ( obj.resourceType != 'energy' && Game.rooms[rm].storage ) ) ){

                                    var cnt = global.rooms[rm].manager_collect.length

                                    global.rooms[rm].manager_collect[cnt]             = {}
                                    global.rooms[rm].manager_collect[cnt].type        = 'dropped'
                                    global.rooms[rm].manager_collect[cnt].id          = Game.rooms[rm].memory.intel.dropped[i].id
                                    global.rooms[rm].manager_collect[cnt].resource    = obj.resourceType
                                    global.rooms[rm].manager_collect[cnt].operation   = 'pickup'
                                    global.rooms[rm].manager_collect[cnt].store       = obj.amount - store_sum
                                    global.rooms[rm].manager_collect[cnt].cnt         = cnt
                                }
                            }
                        }
                    }
                }
            }
            //


        //     // tower - low fill extesions
        //     if ( global.rooms[rm].manager_collect.length == 0 && Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.tower &&
        //          Game.rooms[rm].energyAvailable < ( Game.rooms[rm].energyCapacityAvailable * 0.8 ) ) {
        //
        //         for ( var i = 0 ; i < Game.rooms[rm].memory.intel.tower.length ; i++){
        //
        //             if( Game.rooms[rm].memory.intel.tower[i] ){
        //
        //                 var obj = Game.getObjectById(Game.rooms[rm].memory.intel.tower[i].id)
        //
        //                 if( obj ){
        //
        //                     var cnt = global.rooms[rm].manager_collect.length
        //
        //                     global.rooms[rm].manager_collect[cnt]             = {}
        //                     global.rooms[rm].manager_collect[cnt].type        = 'tower'
        //                     global.rooms[rm].manager_collect[cnt].id          = Game.rooms[rm].memory.intel.tower[i].id
        //                     global.rooms[rm].manager_collect[cnt].resource    = 'energy'
        //                     global.rooms[rm].manager_collect[cnt].operation   = 'withdraw'
        //                     global.rooms[rm].manager_collect[cnt].store       = obj.store['energy']
        //                     global.rooms[rm].manager_collect[cnt].cnt         = cnt
        //                 }
        //             }
        //         }
        //     }
        //     //
        
        
            // // source
            // if ( Game.rooms[rm].controller.level <= 3 &&
            //      Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources.length >= 1 ) {
        
            //     for ( var i = 0 ; i < Game.rooms[rm].memory.intel.sources.length ; i++){
        
            //         var obj = _.filter( Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.role == 'harvester' && creep.memory.container_target == i  )
        
            //         if ( obj.length >= 1 && Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[i] && Game.rooms[rm].memory.intel.container[i].id ){
            //             // faz nada
            //         }
            //         else if ( Game.getObjectById( Game.rooms[rm].memory.intel.sources[i].id ).energy >= 50 ||
            //                   Game.getObjectById( Game.rooms[rm].memory.intel.sources[i].id ).ticksToRegeneration <= 35 ) {
        
            //             var vicinity     = Game.rooms[rm].memory.intel.sources[i].vicinity
            //             var assigned_obj = _.filter( rm_creeps, (creep) => creep.memory.task_id && creep.memory.task_id == Game.rooms[rm].memory.intel.sources[i].id )
            //             var assigned     = assigned_obj.length
            //             var creep_sum = _.sum( assigned_obj, creep => { return creep.store.getFreeCapacity() } );
        
            //             if ( Game.getObjectById( Game.rooms[rm].memory.intel.sources[i].id ).ticksToRegeneration <= 35 ) {
            //                 var ammount  = 3000
            //             }
            //             else {
            //                 var ammount  = Game.getObjectById( Game.rooms[rm].memory.intel.sources[i].id ).energy
            //             }

            //             if( vicinity >= assigned ){
            //                 var available = 0
            //             }
            //             else{
            //                 var available = ammount - creep_sum
            //             }     
                                                
            //             if ( available > 0 ) {
        
            //                 var cnt = global.rooms[rm].manager_collect.length
        
            //                 global.rooms[rm].manager_collect[cnt]              = {}
            //                 global.rooms[rm].manager_collect[cnt].type         = 'source'
            //                 global.rooms[rm].manager_collect[cnt].id           = Game.rooms[rm].memory.intel.sources[i].id
            //                 global.rooms[rm].manager_collect[cnt].resource     = 'energy'
            //                 global.rooms[rm].manager_collect[cnt].operation    = 'harvest'
            //                 global.rooms[rm].manager_collect[cnt].store         = available
            //                 global.rooms[rm].manager_collect[cnt].cnt             = cnt
            //             }
            //         }
            //     }
            // }
        
        
        //     // terminal
        //     if (  Game.rooms[rm].controller && Game.rooms[rm].controller.level >= 6 &&
        //           Game.rooms[rm].terminal && Game.rooms[rm].terminal.store['energy'] > Memory.config.terminal_en_min + 2000 ) {
        //
        //         var cnt = global.rooms[rm].manager_collect.length
        //
        //         global.rooms[rm].manager_collect[cnt]             = {}
        //         global.rooms[rm].manager_collect[cnt].type        = 'terminal'
        //         global.rooms[rm].manager_collect[cnt].id          = Game.rooms[rm].terminal.id
        //         global.rooms[rm].manager_collect[cnt].resource    = 'energy'
        //         global.rooms[rm].manager_collect[cnt].operation   = 'withdraw'
        //         global.rooms[rm].manager_collect[cnt].store       = Game.rooms[rm].terminal.store['energy'] - Memory.config.terminal_en_min - 2000
        //         global.rooms[rm].manager_collect[cnt].cnt         = cnt
        //     }
        //     //
        
        
        
            // storage
            if (  Game.rooms[rm].controller && Game.rooms[rm].controller.level >= 4 &&
                  Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > Memory.config.terminal_en_min  ) {
        
                var cnt = global.rooms[rm].manager_collect.length
        
                global.rooms[rm].manager_collect[cnt]             = {}
                global.rooms[rm].manager_collect[cnt].type        = 'storage'
                global.rooms[rm].manager_collect[cnt].id          = Game.rooms[rm].storage.id
                global.rooms[rm].manager_collect[cnt].resource    = 'energy'
                global.rooms[rm].manager_collect[cnt].operation   = 'withdraw'
                global.rooms[rm].manager_collect[cnt].store       = Game.rooms[rm].storage.store['energy']
                global.rooms[rm].manager_collect[cnt].cnt         = cnt
            }
            //
        
        
        //     // pre-leve 4 and storage -> collect from creep
        //     if( !Game.rooms[rm].storage ||
        //       ( Game.rooms[rm].storage && Game.rooms[rm].controller && Game.rooms[rm].controller.level >= 4 && Game.rooms[rm].storage.store['energy'] < 5000 ) ||
        //       ( Game.rooms[rm].storage && Game.rooms[rm].controller && Game.rooms[rm].controller.level < 4 ) ){
        //
        //         var obj = _.filter( rm_creeps, (creep) => creep.memory.task_operation && creep.memory.task_operation == 'harvest' && creep.store.getUsedCapacity() >= 50  )
        //
        //         for ( var i = 0 ; i < obj.length ; i++){
        //
        //             var obj2 = _.filter( rm_creeps, (creep) => creep.memory.task_id == obj[i].id )
        //
        //             if( obj2 && obj2.length >=1 ){
        //                 // do nothing
        //             }
        //             else{
        //
        //                 var cnt = global.rooms[rm].manager_collect.length
        //
        //                 global.rooms[rm].manager_collect[cnt]             = {}
        //                 global.rooms[rm].manager_collect[cnt].type        = 'collect creep'
        //                 global.rooms[rm].manager_collect[cnt].id          = obj[i].id
        //                 global.rooms[rm].manager_collect[cnt].resource    = 'energy'
        //                 global.rooms[rm].manager_collect[cnt].operation   = 'reverse transfer'
        //                 global.rooms[rm].manager_collect[cnt].store       = obj[i].store['energy']
        //                 global.rooms[rm].manager_collect[cnt].cnt         = cnt
        //             }
        //         }
        //     }
            //
        }
    }
};

module.exports = mainBaseManager;
