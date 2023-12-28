var MainIntel= {

    run: function( rm ) {
        
        // first run
        if ( !Game.rooms[rm].memory.intel ){
              Game.rooms[rm].memory.intel = {}
              // Game.rooms[rm].memory.intel.spawn = []
              // Game.rooms[rm].memory.intel.extension = []
              // Game.rooms[rm].memory.intel.tower = []
              // Game.rooms[rm].memory.intel.container = []
              // Game.rooms[rm].memory.intel.link = []
              // Game.rooms[rm].memory.intel.lab = []
              // Game.rooms[rm].memory.intel.extractor = []
              // Game.rooms[rm].memory.intel.nuker = []
              // Game.rooms[rm].memory.intel.factory = []
              // Game.rooms[rm].memory.intel.observer = []
              // Game.rooms[rm].memory.intel.powerSpawn = []
        }
        //

        // level
        var lvl = Game.rooms[rm].controller.level
        if( Game.rooms[rm].memory.mode_defend == 1  ){
            var lvl = 9
        }

        // sources
        if ( !Game.rooms[rm].memory.intel.sources ) {

            if( Game.rooms[ rm ].memory.base_x && Game.rooms[ rm ].memory.base_y &&
                Game.rooms[ rm ].memory.h1_x && Game.rooms[ rm ].memory.h1_y &&
                Game.rooms[ rm ].memory.h2_x && Game.rooms[ rm ].memory.h2_y ){

                Game.rooms[rm].memory.intel.sources = []
                var obj = _.sortBy( Game.rooms[rm].find(FIND_SOURCES) ,  function(o) { return  o.id; });

                for ( var i = 0; i < obj.length ; i++) {
                    Game.rooms[rm].memory.intel.sources[i]    = {}
                    Game.rooms[rm].memory.intel.sources[i].id = obj[i].id

                    // source reacheable vicinity
                    const terrain = Game.rooms[rm].getTerrain();
                    var cnt_vic = 0
                    var xx = obj[i].pos.x
                    var yy = obj[i].pos.y
                    switch(terrain.get(xx-1,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                    switch(terrain.get(xx-1,yy+0)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                    switch(terrain.get(xx-1,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                    switch(terrain.get(xx+1,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                    switch(terrain.get(xx+1,yy+0)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                    switch(terrain.get(xx+1,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                    switch(terrain.get(xx+0,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                    switch(terrain.get(xx+0,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}

                    Game.rooms[rm].memory.intel.sources[i].vicinity = cnt_vic

                    var start = new RoomPosition(xx, yy, rm)

                    // base center
                    var end = new RoomPosition(Game.rooms[ rm ].memory.base_x+2, Game.rooms[ rm ].memory.base_y+1, rm)
                    var build_path = PathFinder.search(start, end, {plainCost: 19,swampCost: 20, range:2 } ).path
                    Game.rooms[rm].memory.intel.sources[i].db = Math.max( build_path.length + 1 , 2)

                    // half1
                    var end = new RoomPosition(Game.rooms[ rm ].memory.h1_x, Game.rooms[ rm ].memory.h1_y, rm)
                    var build_path = PathFinder.search(start, end, {plainCost: 19,swampCost: 20, range:2 } ).path
                    Game.rooms[rm].memory.intel.sources[i].dh1 = Math.max( build_path.length + 1 , 2)

                    // half2
                    var end = new RoomPosition(Game.rooms[ rm ].memory.h2_x, Game.rooms[ rm ].memory.h2_y, rm)
                    var build_path = PathFinder.search(start, end, {plainCost: 19,swampCost: 20, range:2 } ).path
                    Game.rooms[rm].memory.intel.sources[i].dh2 = Math.max( build_path.length + 1 , 2)
                }
            }
        }
        //


        // minerals
        if ( ( Game.time % Memory.config.freq_intel_minerals[lvl] == 0 ) || !Game.rooms[rm].memory.intel.minerals ) {

            if( !Game.rooms[rm].memory.intel.minerals ){
                Game.rooms[rm].memory.intel.minerals = []
            }
            var obj = Game.rooms[rm].find(FIND_MINERALS)
            
            var cnt = 0

            for ( var i = 0; i < obj.length ; i++) {

                if( obj[i].mineralType == 'H' || 
                    obj[i].mineralType == 'O' ||
                    obj[i].mineralType == 'U' ||
                    obj[i].mineralType == 'L' ||
                    obj[i].mineralType == 'Z' ||
                    obj[i].mineralType == 'K' ||
                    obj[i].mineralType == 'X' ){

                    if( Game.rooms[rm].memory.intel.minerals[cnt] && Game.rooms[rm].memory.intel.minerals[cnt].id == obj[i].id &&
                        Game.rooms[rm].memory.intel.minerals[cnt].db ){
                        Game.rooms[rm].memory.intel.minerals[cnt].mineralAmount = Math.round( obj[i].mineralAmount ) 
                    }
                    else{
                        Game.rooms[rm].memory.intel.minerals[cnt]    = {}
                        Game.rooms[rm].memory.intel.minerals[cnt].id            = obj[i].id
                        Game.rooms[rm].memory.intel.minerals[cnt].mineralAmount = Math.round(obj[i].mineralAmount)
                        Game.rooms[rm].memory.intel.minerals[cnt].mineralType   = obj[i].mineralType

                        // source reacheable vicinity
                        const terrain = Game.rooms[rm].getTerrain();
                        var cnt_vic = 0
                        var xx = obj[i].pos.x
                        var yy = obj[i].pos.y
                        switch(terrain.get(xx-1,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                        switch(terrain.get(xx-1,yy+0)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                        switch(terrain.get(xx-1,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                        switch(terrain.get(xx+1,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                        switch(terrain.get(xx+1,yy+0)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                        switch(terrain.get(xx+1,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                        switch(terrain.get(xx+0,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}
                        switch(terrain.get(xx+0,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 2: cnt_vic = cnt_vic + 1}

                        Game.rooms[rm].memory.intel.minerals[cnt].vicinity = cnt_vic

                        // base center
                        var end = new RoomPosition(Game.rooms[ rm ].memory.base_x+2, Game.rooms[ rm ].memory.base_y+2, rm)
                        var start = obj[i].pos
                        var build_path = PathFinder.search(start, end, {plainCost: 19,swampCost: 20, range:1 } ).path
                        Game.rooms[rm].memory.intel.minerals[cnt].db = Math.max( build_path.length + 1 , 2)
                        
                        var cnt = cnt + 1
                    }
                }
            }
        }
        //

        // // check for hostiles
        // if( Game.time % Memory.config.freq_intel_enemies[lvl] == 0 || Game.rooms[rm].memory.mode_defend == 1 ){
        //
        //     Game.rooms[rm].memory.intel_hostile         = {}
        //     Game.rooms[rm].memory.intel_hostile.creeps  = []
        //
        //     var obj = Game.rooms[rm].find( FIND_HOSTILE_CREEPS )
        //
        //     if( obj.length >= 1 ){
        //
        //         var cnt = 0
        //
        //         for ( var i = 0; i < obj.length ; i++) {
        //
        //             // if( obj[i].getActiveBodyparts(ATTACK) >= 1 || obj[i].getActiveBodyparts(RANGED_ATTACK) >= 1 || obj[i].getActiveBodyparts(WORK) >= 1 || obj[i].getActiveBodyparts(CLAIM) >= 1 ){
        //
        //                 var ok = 1
        //
        //                 // check ally list
        //                 for ( var j = 0; j < Memory.config.ally_list.length ; j++) {
        //                     if( obj[i].owner.username == Memory.config.ally_list[j] ){
        //                       var ok = 0
        //                       break;
        //                     }
        //                 }
        //
        //                 if( ok == 1 ){
        //                     Game.rooms[rm].memory.intel_hostile.creeps[cnt] = {}
        //                     Game.rooms[rm].memory.intel_hostile.creeps[cnt].id       = obj[i].id
        //                     Game.rooms[rm].memory.intel_hostile.creeps[cnt].owner    = obj[i].owner.username
        //                     Game.rooms[rm].memory.intel_hostile.creeps[cnt].hits     = obj[i].hits
        //                     Game.rooms[rm].memory.intel_hostile.creeps[cnt].hitsMax  = obj[i].hitsMax
        //                     Game.rooms[rm].memory.intel_hostile.creeps[cnt].body     = obj[i].body
        //
        //                     var cnt = cnt + 1
        //                 }
        //             // }
        //         }
        //
        //         if( cnt > 0 ){
        //             if( Game.rooms[rm].controller.safeMode > 0 ){
        //                 Game.rooms[rm].memory.mode_defend = 0
        //             }
        //             else{
        //                 Game.rooms[rm].memory.mode_defend = 1
        //             }
        //         }
        //         else{
        //             Game.rooms[rm].memory.mode_defend = 0
        //         }
        //     }
        //     else{
        //         Game.rooms[rm].memory.mode_defend = 0
        //     }
        // }
        // //

        // check for ruins
        if( Game.time % Memory.config.freq_intel_ruins[lvl] == 0 ){
        
            var scan  = 0
            var ruins = Game.rooms[rm].find(FIND_RUINS)
        
            Game.rooms[rm].memory.intel.ruins = []
        
            if( ruins && ruins.length >= 1 ){
                var scan = 1
                var cnt = 0
                for ( var i = 0 ; i < ruins.length ; i++){
                    if( ruins[i].store.getUsedCapacity() >= 25 * Game.rooms[rm].controller.level  ){
                        Game.rooms[rm].memory.intel.ruins[cnt]     = {}
                        Game.rooms[rm].memory.intel.ruins[cnt].id  = ruins[i].id
                        var cnt = cnt + 1
                    }
                }
            }
        }
        //


        // safe mode
        var safe_mode_ruin = 0
        if( scan == 1 && ruins ){
            if( lvl >= 6 ){
                for ( var i = 0 ; i < ruins.length ; i++){
                    if( ruins[i].structure &&
                        ruins[i].structure.structureType &&
                       (ruins[i].structure.structureType == 'rampart' ) && ruins[i].structure.owner.username == 'asdpof' ){
        
                         var obj_ramp = Game.rooms[rm].lookForAt(LOOK_FLAGS, ruins[i].pos.x, ruins[i].pos.y);
        
                         if( obj_ramp && obj_ramp.length >= 1 ){
                             for ( var j = 0 ; j < obj_ramp.length ; j++){
                                 if( obj_ramp[j].color == 5 ){
                                     var safe_mode_ruin = 1
                                     break
                                 }
                             }
                         }
                    }
                }
            }
        
            if( lvl <= 6 ){
                for ( var i = 0 ; i < ruins.length ; i++){
                    if( ruins[i].structure &&
                        ruins[i].structure.structureType &&
                       (ruins[i].structure.structureType == 'extension' || ruins[i].structure.structureType == 'tower' ) && ruins[i].structure.owner.username == 'asdpof' ){
        
                        var safe_mode_ruin = 1
                    }
                }
            }
        }
        //

        // safe mode
        if( Game.rooms[rm].memory.mode_defend == 1 && 1==1 ){
        
          var obj = Game.rooms[rm].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  {return (     _.intersection([creep.owner.username], Memory.config.ally_list).length == 0  &&
                                                                                            creep.owner != 'Invader' &&
                                                                                            ( creep.getActiveBodyparts(ATTACK) > 5 ||
                                                                                              creep.getActiveBodyparts(RANGED_ATTACK) > 5 ||
                                                                                              creep.getActiveBodyparts(WORK) > 5 ||
                                                                                              creep.getActiveBodyparts(CLAIM) > 1 ||
                                                                                              creep.getActiveBodyparts(HEAL) > 5 ) ) } } )
        
            if( obj && obj.length > 0  ){
        
                if( safe_mode_ruin == 1 ){
                    Game.rooms[rm].controller.activateSafeMode();
                }
        
                if( obj.length >= 2 && Game.rooms[rm].controller.level <= 4 ){
                    Game.rooms[rm].controller.activateSafeMode();
                }
            }
        
            // damage on spawn
            if( Game.rooms[rm].memory.intel.spawn && Game.rooms[rm].memory.intel.spawn[0] && Game.rooms[rm].memory.intel.spawn[0].id ){
                var obj = Game.getObjectById(Game.rooms[rm].memory.intel.spawn[0].id)
                if( obj && obj.hits < obj.hitsMax * .9 ){
                    Game.rooms[rm].controller.activateSafeMode();
                }
            }
            else{
                if( Game.rooms[rm].controller.level < 3 ){
                    var base_pos = new RoomPosition(Game.rooms[rm].memory.base_x, Game.rooms[rm].memory.base_y, rm)
                    if( base_pos.findInRange(FIND_HOSTILE_CREEPS, 2, {filter: (creep) =>  {return (creep.owner != 'Invader').length > 0 } } ) ){
                        Game.rooms[rm].controller.activateSafeMode();
                    }
                }
            }
        }
        //




        // // spawn usage
        // if( Game.rooms[rm].memory.intel.spawn && Game.rooms[rm].memory.intel.spawn[0] ){
        //
        //     // update main memory
        //     if( !global.rooms[rm].spawn_usage ){
        //         global.rooms[rm].spawn_usage = []
        //
        //         if( !Game.rooms[rm].memory.spawn_usage_t || !Game.rooms[rm].memory.spawn_usage_s ){
        //             Game.rooms[rm].memory.spawn_usage_s = 1
        //             Game.rooms[rm].memory.spawn_usage_t = 1
        //         }
        //     }
        //     else if( global.rooms[rm].spawn_usage.length >= ( Game.rooms[rm].memory.intel.spawn.length * 1500 ) ){
        //         global.rooms[rm].spawn_usage = []
        //     }
        //
        //     for ( var i = 0; i < Game.rooms[rm].memory.intel.spawn.length ; i++) {
        //
        //         var obj = Game.getObjectById( Game.rooms[rm].memory.intel.spawn[i].id )
        //
        //         if( obj ){
        //
        //             if( obj.spawning && obj.spawning != null ){
        //                 var spw = 1
        //             }
        //             else {
        //                 var spw = 0
        //             }
        //
        //             global.rooms[rm].spawn_usage[ global.rooms[rm].spawn_usage.length ] = spw
        //         }
        //     }
        //
        //     // extrapolate usage
        //     if( Game.time % 50 == 0 ){
        //
        //         var current_s = Game.rooms[rm].memory.spawn_usage_s
        //         var new_s     = global.rooms[rm].spawn_usage.reduce(function(a, b) { return a + b; }, 0) / Game.rooms[rm].memory.intel.spawn.length
        //         var size      = global.rooms[rm].spawn_usage.length / Game.rooms[rm].memory.intel.spawn.length
        //
        //         Game.rooms[rm].memory.spawn_usage_s = current_s / 1500 * ( 1500 - size ) + new_s
        //         Game.rooms[rm].memory.spawn_usage_t = Game.rooms[rm].memory.spawn_usage_s * 3
        //
        //     }
        // }
        // //

        // construction sites
        if( 1 == 1 ){
            var phase   = Game.rooms[rm].memory.phase      

            if( Game.rooms[rm].memory.oneTimer.intelConstruction > 0 ) {

                Game.rooms[rm].memory.intel.construction = []

                var obj = Game.rooms[rm].find(FIND_MY_CONSTRUCTION_SITES)

                for ( var i = 0 ; i < obj.length ; i++){

                    Game.rooms[rm].memory.intel.construction[i] = {}
                    Game.rooms[rm].memory.intel.construction[i].id              = obj[i].id
                }
            }
        }



        // // check energy capacity deviance
        // if( !Game.rooms[rm].memory.energyCapacityAvailable ){
        //     Game.rooms[rm].memory.energyCapacityAvailable = Game.rooms[rm].energyCapacityAvailable
        //
        //     if( !Game.rooms[rm].energyCapacityAvailable || Game.rooms[rm].energyCapacityAvailable == 0 ){
        //         Game.rooms[rm].memory.energyCapacityAvailable = Game.rooms[rm].energyAvailable
        //     }
        // }
        // else{
        //     if( Game.rooms[rm].memory.energyCapacityAvailable != Game.rooms[rm].energyCapacityAvailable  ){
        //         var scan = 1
        //     }
        //     Game.rooms[rm].memory.energyCapacityAvailable = Game.rooms[rm].energyCapacityAvailable
        //
        //     if( !Game.rooms[rm].energyCapacityAvailable || Game.rooms[rm].energyCapacityAvailable == 0 ){
        //         Game.rooms[rm].memory.energyCapacityAvailable = Game.rooms[rm].energyAvailable
        //     }
        // }
        // //


        // scan structures
        if( !Game.rooms[rm].memory.intel.spawn ){ //scan == 1 ||

            // spawn
            // vem do codigo de construcao
            if( !Game.rooms[rm].memory.intel.spawn ){
                Game.rooms[rm].memory.intel.spawn = []
            }

            // extension
            // vem do codigo de construcao
            if( !Game.rooms[rm].memory.intel.extension ){
                Game.rooms[rm].memory.intel.extension = []
            }

            // tower
            // vem do codigo de construcao
            if( !Game.rooms[rm].memory.intel.tower ){
                Game.rooms[rm].memory.intel.tower = []
            }

            // container
            // vem do codigo de construcao

            // link
            // vem do codigo de construcao

            // lab
            // vem do codigo de construcao

            // extractor
            // vem do codigo de construcao


            // // nuker
            // Game.rooms[rm].memory.intel.nuker = []
            // var obj = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_NUKER  ) } })
            //
            // for ( var i = 0; i < obj.length ; i++) {
            //     Game.rooms[rm].memory.intel.nuker[i]    = {}
            //     Game.rooms[rm].memory.intel.nuker[i].id = obj[i].id
            // }
            //
            // // factory
            // Game.rooms[rm].memory.intel.factory = []
            // var obj = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_FACTORY  ) } })
            //
            // for ( var i = 0; i < obj.length ; i++) {
            //     Game.rooms[rm].memory.intel.factory[i]    = {}
            //     Game.rooms[rm].memory.intel.factory[i].id = obj[i].id
            // }
            //
            // // observer
            // Game.rooms[rm].memory.intel.observer = []
            // var obj = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_OBSERVER  ) } })
            //
            // for ( var i = 0; i < obj.length ; i++) {
            //     Game.rooms[rm].memory.intel.observer[i]    = {}
            //     Game.rooms[rm].memory.intel.observer[i].id = obj[i].id
            // }
            //
            // // power spawn
            // Game.rooms[rm].memory.intel.powerSpawn = []
            // var obj = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_POWER_SPAWN  ) } })
            //
            // for ( var i = 0; i < obj.length ; i++) {
            //     Game.rooms[rm].memory.intel.powerSpawn[i]    = {}
            //     Game.rooms[rm].memory.intel.powerSpawn[i].id = obj[i].id
            // }

            // controller  -  storage  -  terminal
            // tem chamada especifica no api

        }
        //




        // tombstone - energy
        if (Game.time % Memory.config.freq_intel_tombstone[lvl] == 0) {
        
            Game.rooms[rm].memory.intel.tombstone = []
            var obj = Game.rooms[rm].find(FIND_TOMBSTONES, {filter: object => object.store.getUsedCapacity() >= 50 })
        
            for ( var i = 0; i < obj.length ; i++) {
                Game.rooms[rm].memory.intel.tombstone[i]    = {}
                Game.rooms[rm].memory.intel.tombstone[i].id = obj[i].id        
            }
        }
        //


        // dropped - energy
        if (Game.time % Memory.config.freq_intel_dropped[lvl] == 0) {

            Game.rooms[rm].memory.intel.dropped = []
            var obj = Game.rooms[rm].find(FIND_DROPPED_RESOURCES, {filter: object => object.amount >= 1 })

            for ( var i = 0; i < obj.length ; i++) {

                var ok = 1

                if ( 1==11 && Game.rooms[rm].memory.intel.construction && Game.rooms[rm].memory.intel.construction.length > 0  ) {

                    if( _.filter(Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.role == 'builder' ).length >= 1 ){

                        for ( var j = 0; j < Game.rooms[rm].memory.intel.construction.length ; j++) {
                            if( Game.rooms[rm].memory.intel.construction[j] && Game.rooms[rm].memory.intel.construction[j].id ){
                                var objc = Game.getObjectById( Game.rooms[rm].memory.intel.construction[j].id )
                                if( objc && obj[i].pos.x == objc.pos.x && obj[i].pos.y == objc.pos.y ){
                                    var ok = 0
                                    break
                                }
                            }
                        }
                    }
                }

                if( Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[4] && Game.rooms[rm].memory.intel.container[4].id &&
                    Game.getObjectById( Game.rooms[rm].memory.intel.container[4].id ) ){
                    // ok
                }
                else{
                    if( Game.rooms[rm].memory.intel.construction && Game.rooms[rm].memory.intel.construction.length > 0  ) {

                        var xx = -1
                        var yy = -1                        
                    }
                    else{
                        // ground
                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                            if( Game.rooms[rm].memory.planner[k][2] == 'container' &&
                                Game.rooms[rm].memory.planner[k][3] == 4 ){

                                var xx = Game.rooms[rm].memory.planner[k][0]
                                var yy = Game.rooms[rm].memory.planner[k][1]
                                break;
                            }
                        }
                    }

                    if( obj[i].pos.x == xx && obj[i].pos.y == yy ){
                        var ok = 0
                    }
                }

                if( ok == 1 ){
                    Game.rooms[rm].memory.intel.dropped[i]    = {}
                    Game.rooms[rm].memory.intel.dropped[i].id = obj[i].id
                }
            }
        }
        //

    }
};

module.exports = MainIntel;
