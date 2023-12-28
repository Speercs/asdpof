const Pathing = require('pathing');

var roleBaseHalfFiller = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var prior  = 101
        var colour = '#00FF00'

        var rm = creep.memory.birth

        // setting target container
        if( !creep.spawning && !(creep.memory.pos_xx >= 0) ){

              if( creep.memory.birth_target == 'h1_1' ){
                  if( Game.rooms[rm].memory.h1_type == 'h' ){
                      creep.memory.pos_xx = Game.rooms[rm].memory.h1_x - 1
                      creep.memory.pos_yy = Game.rooms[rm].memory.h1_y + 0
                  }
                  else{
                      creep.memory.pos_xx = Game.rooms[rm].memory.h1_x - 0
                      creep.memory.pos_yy = Game.rooms[rm].memory.h1_y - 1
                  }
              }
              else if( creep.memory.birth_target == 'h1_2' ){
                  if( Game.rooms[rm].memory.h1_type == 'h' ){
                      creep.memory.pos_xx = Game.rooms[rm].memory.h1_x + 1
                      creep.memory.pos_yy = Game.rooms[rm].memory.h1_y + 0
                  }
                  else{
                      creep.memory.pos_xx = Game.rooms[rm].memory.h1_x - 0
                      creep.memory.pos_yy = Game.rooms[rm].memory.h1_y + 1
                  }
              }
              else if( creep.memory.birth_target == 'h2_1' ){
                  if( Game.rooms[rm].memory.h2_type == 'h' ){
                      creep.memory.pos_xx = Game.rooms[rm].memory.h2_x - 1
                      creep.memory.pos_yy = Game.rooms[rm].memory.h2_y + 0
                  }
                  else{
                      creep.memory.pos_xx = Game.rooms[rm].memory.h2_x - 0
                      creep.memory.pos_yy = Game.rooms[rm].memory.h2_y - 1
                  }
              }
              else if( creep.memory.birth_target == 'h2_2' ){
                  if( Game.rooms[rm].memory.h2_type == 'h' ){
                      creep.memory.pos_xx = Game.rooms[rm].memory.h2_x + 1
                      creep.memory.pos_yy = Game.rooms[rm].memory.h2_y + 0
                  }
                  else{
                      creep.memory.pos_xx = Game.rooms[rm].memory.h2_x - 0
                      creep.memory.pos_yy = Game.rooms[rm].memory.h2_y + 1
                  }
              }
        }
        //

        // search for similar creep close and kill the ones with shortest ticks to live
        if( !creep.memory.arrived && creep.memory.pos_xx > 0 ){

            var xx = creep.memory.pos_xx
            var yy = creep.memory.pos_yy

            if ( Math.max( Math.abs( creep.pos.x - xx ), Math.abs( creep.pos.y - yy ) ) <= 1 ) {

                var obj = creep.pos.findInRange(FIND_MY_CREEPS, 1, {filter: obj =>  obj.memory.birth == rm &&
                                                                                    obj.memory.role == 'half_filler' &&
                                                                                    obj.name != creep.name &&
                                                                                    obj.memory.arrived });
                if( obj && obj.length >= 1 ){
                    for ( var j = 0 ; j < obj.length ; j++){
                        if( obj[j].memory.birth_target == creep.memory.birth_target ){
                            obj[j].say('killed')
                            obj[j].transfer(creep,'energy')
                            obj[j].suicide()
                        }
                    }
                }

                creep.memory.arrived = 1
            }
        }
        //

        // move to position
        if ( creep.memory.pos_xx > 0 && creep.memory.pos_yy > 0 ) {

            var xx = creep.memory.pos_xx
            var yy = creep.memory.pos_yy

            if ( creep.pos.x == xx && creep.pos.y == yy) {
                var ready = 1
            }
            else {
                // move to container
                var static_pos = new RoomPosition(xx, yy, rm)
                if ( static_pos ){
                    creep.moveTo(static_pos, {range: 0, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
                else{
                    creep.say('error1')
                }
            }
        }
        else{
            creep.say('on move')

            // random movement if out of position of too long
            var functionStaticCount  = require('function.static_count')
            functionStaticCount.run( creep )

            // random move
            var trigger = 11            

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
        //

        // fill around
        if( ready == 1 ) {

            // drop
            var drop_obj = 0
            if( creep.store.getUsedCapacity() > 0 ){

                if( Game.rooms[rm].energyAvailable < Game.rooms[rm].energyCapacityAvailable ){
                    // drop on extension                
                    if( drop_obj == 0 ){ 

                        // map nearby extensions
                        if( !global.rooms[rm].half_filler ){
                            global.rooms[rm].half_filler = {}
                        }

                        if( !global.rooms[rm].half_filler[ creep.memory.birth_target ] || creep.ticksToLive % 75 == 0 ){

                            global.rooms[rm].half_filler[ creep.memory.birth_target ] = []
                            
                            var obj = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: struct => struct.structureType == 'extension' });

                            if( obj && obj.length >= 1 ){
                                global.rooms[rm].half_filler[ creep.memory.birth_target ] = obj
                            }
                        }
                        //

                        // if( creep.memory.birth_target == 'h1_1' || creep.memory.birth_target == 'h1_2')
                        // if( creep.memory.birth_target == 'h2_1' || creep.memory.birth_target == 'h2_2')
                      
                        if( global.rooms[rm].half_filler[ creep.memory.birth_target ] ){
                            for ( var i = 0 ; i < global.rooms[rm].half_filler[ creep.memory.birth_target ].length ; i++){
                                if( global.rooms[rm].half_filler[ creep.memory.birth_target ][i] ){
                                    var obj = Game.getObjectById( global.rooms[rm].half_filler[ creep.memory.birth_target ][i].id ) 

                                    if( obj && obj.store.getFreeCapacity('energy') > 0 ){
                                        var drop_obj = 1
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    //

                    // drop on spawn
                    if( drop_obj == 0 && Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.spawn  ){
                    
                        if(creep.memory.birth_target == 'h1_1' || creep.memory.birth_target == 'h1_2'){
                            var sp = 0
                        }
                        else if(creep.memory.birth_target == 'h2_1' || creep.memory.birth_target == 'h2_2'){
                            var sp = 1
                        }
                        else{
                            creep.say('error_sp')
                        }

                        if( Game.rooms[rm].memory.intel.spawn[sp] && Game.rooms[rm].memory.intel.spawn[sp].id ){
                            var obj = Game.getObjectById( Game.rooms[rm].memory.intel.spawn[sp].id )

                            if( obj && obj.store.getFreeCapacity('energy') > 0 ){
                                var drop_obj = 1
                            }
                        }
                    }
                    // 
                }  
                            
                // drop on container
                if( drop_obj == 0 && Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container &&
                    ( ((creep.memory.birth_target == 'h1_1' || creep.memory.birth_target == 'h1_2') && Game.rooms[rm].memory.intel.container[2] && Game.rooms[rm].memory.intel.container[2].id ) ||
                    ((creep.memory.birth_target == 'h2_1' || creep.memory.birth_target == 'h2_2') && Game.rooms[rm].memory.intel.container[3] && Game.rooms[rm].memory.intel.container[3].id ) ) ){

                    if( creep.memory.birth_target == 'h1_1' || creep.memory.birth_target == 'h1_2' ){
                        var cntt = 2
                    }
                    else {
                        var cntt = 3
                    }

                    var obj = Game.getObjectById( Game.rooms[rm].memory.intel.container[cntt].id )

                    if( obj && obj.store.getFreeCapacity('energy') >= creep.store['energy'] * 4 ){

                        // only drop if link exists
                        if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link &&
                            ( ((creep.memory.birth_target == 'h1_1' || creep.memory.birth_target == 'h1_2') && Game.rooms[rm].memory.intel.link[3] && Game.rooms[rm].memory.intel.link[3].id ) ||
                              ((creep.memory.birth_target == 'h2_1' || creep.memory.birth_target == 'h2_2') && Game.rooms[rm].memory.intel.link[4] && Game.rooms[rm].memory.intel.link[4].id ) ) ){
        
                            if( creep.memory.birth_target == 'h1_1' || creep.memory.birth_target == 'h1_2' ){
                                var lnk = 3
                            }
                            else {
                                var lnk = 4
                            }
        
                            var link = Game.getObjectById( Game.rooms[rm].memory.intel.link[lnk].id )

                        }

                        if( link && link.store['energy'] >= creep.store.getCapacity() ){
                            var drop_obj = 1
                        }
                    }
                }   
                //

                // drop on obj
                if( drop_obj == 1 ){    
                    var action = creep.transfer(obj,'energy')
                }
            }
            //

            // collect
            var done = 0
            if( creep.store.getFreeCapacity('energy') > 0 ){

                // collect from link if exist
                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link &&
                    ( ((creep.memory.birth_target == 'h1_1' || creep.memory.birth_target == 'h1_2') && Game.rooms[rm].memory.intel.link[3] && Game.rooms[rm].memory.intel.link[3].id ) ||
                     ((creep.memory.birth_target == 'h2_1' || creep.memory.birth_target == 'h2_2') && Game.rooms[rm].memory.intel.link[4] && Game.rooms[rm].memory.intel.link[4].id ) ) ){

                    if( creep.memory.birth_target == 'h1_1' || creep.memory.birth_target == 'h1_2' ){
                        var lnk = 3
                    }
                    else {
                        var lnk = 4
                    }

                    var link = Game.getObjectById( Game.rooms[rm].memory.intel.link[lnk].id )

                    if( link ){
                        if( creep.pos.inRangeTo(link, 1) && link.store.getUsedCapacity('energy') >= creep.store.getFreeCapacity() ){
                            var done = 1
                            var action = creep.withdraw( link, 'energy' )
                        }
                    }
                    else{
                        Game.rooms[rm].memory.oneTimer.plannerReset = 2
                    }
                }

                // collect from container if exist
                if( done == 0 && Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container &&
                    ( ((creep.memory.birth_target == 'h1_1' || creep.memory.birth_target == 'h1_2') && Game.rooms[rm].memory.intel.container[2] && Game.rooms[rm].memory.intel.container[2].id ) ||
                      ((creep.memory.birth_target == 'h2_1' || creep.memory.birth_target == 'h2_2') && Game.rooms[rm].memory.intel.container[3] && Game.rooms[rm].memory.intel.container[3].id ) ) ){

                    if( creep.memory.birth_target == 'h1_1' || creep.memory.birth_target == 'h1_2' ){
                        var cntt = 2
                    }
                    else {
                        var cntt = 3
                    }

                    var container = Game.getObjectById( Game.rooms[rm].memory.intel.container[cntt].id )

                    if( container ){
                        if( creep.pos.inRangeTo(container, 1) && container.store.getUsedCapacity() >= creep.store.getFreeCapacity() ){
                            var done = 1
                            var action = creep.withdraw( container, 'energy' )
                        }
                    }
                    else{
                        Game.rooms[rm].memory.oneTimer.plannerReset = 2
                    }
                }
            }
            //

            
        }
        //

           

        // try to renew if full bucket
        if( Game.cpu.bucket > 2000 && creep.ticksToLive <= (1500 - Math.floor( 600/creep.hitsMax*100 )) && creep.ticksToLive >= 50 ){

            // drop on spawn
            if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.spawn ){
            
                if(creep.memory.birth_target == 'h1_1' || creep.memory.birth_target == 'h1_2'){
                    var sp = 0
                    var live = 0
                    if( Game.rooms[rm].memory.intel.container &&
                        Game.rooms[rm].memory.intel.container[2] &&
                        Game.rooms[rm].memory.intel.container[2].id && 
                        Game.getObjectById( Game.rooms[rm].memory.intel.container[2].id ) ){
                        var live = 1
                    }
                    else if( Game.rooms[rm].memory.intel.link &&
                        Game.rooms[rm].memory.intel.link[3] &&
                        Game.rooms[rm].memory.intel.link[3].id && 
                        Game.getObjectById( Game.rooms[rm].memory.intel.link[3].id ) ){
                        var live = 1
                    }

                    if( live == 0 ){
                        creep.suicide()
                    }
                }
                else if(creep.memory.birth_target == 'h2_1' || creep.memory.birth_target == 'h2_2'){
                    var sp = 1
                    var live = 0
                    if( Game.rooms[rm].memory.intel.container &&
                        Game.rooms[rm].memory.intel.container[3] &&
                        Game.rooms[rm].memory.intel.container[3].id && 
                        Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id ) ){
                        var live = 1
                    }
                    else if( Game.rooms[rm].memory.intel.link &&
                        Game.rooms[rm].memory.intel.link[4] &&
                        Game.rooms[rm].memory.intel.link[4].id && 
                        Game.getObjectById( Game.rooms[rm].memory.intel.link[4].id ) ){
                        var live = 1
                    }

                    if( live == 0 ){
                        creep.suicide()
                    }
                }
                else{
                    creep.say('error_sp')
                }

                if( Game.rooms[rm].memory.intel.spawn[sp] && Game.rooms[rm].memory.intel.spawn[sp].id ){
                    var obj = Game.getObjectById( Game.rooms[rm].memory.intel.spawn[sp].id )

                    if( obj && obj.spawning && obj.spawning != null ){
                        // do nothing
                    }
                    else if( obj  ) {
                        obj.renewCreep(creep)
                    }
                }
            }
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
    }
};

module.exports = roleBaseHalfFiller;
