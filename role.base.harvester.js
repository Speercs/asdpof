const Pathing = require('pathing');

var roleBaseHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var prior  = 111
        var colour = '#00FF00'

        var rm = creep.memory.birth

        creep.memory.harvesting = true;

        if( creep.pos.roomName == rm ){
        
            // setting target container
            if( !creep.spawning && !(creep.memory.container_target >= 0) ){

                if( creep.memory.birth_target == 's0_300_1' ||
                    creep.memory.birth_target == 's0_350_1' ||
                    creep.memory.birth_target == 's0_450_1' ||
                    creep.memory.birth_target == 's0_550_1' ||

                    creep.memory.birth_target == 's0_300_2' ||
                    creep.memory.birth_target == 's0_350_2' ||
                    creep.memory.birth_target == 's0_450_2' ||

                    creep.memory.birth_target == 's0_300_3' ){
                    creep.memory.container_target = 0
                }
                else
                if( creep.memory.birth_target == 's1_300_1' ||
                    creep.memory.birth_target == 's1_350_1' ||
                    creep.memory.birth_target == 's1_450_1' ||
                    creep.memory.birth_target == 's1_550_1' ||

                    creep.memory.birth_target == 's1_300_2' ||
                    creep.memory.birth_target == 's1_350_2' ||
                    creep.memory.birth_target == 's1_450_2' ||

                    creep.memory.birth_target == 's1_300_3' ){
                    creep.memory.container_target = 1
                }
                else{
                    // fallback
                    creep.memory.container_target = 0
                }
            }
            //

            // move into position
            var i = creep.memory.container_target
    creep.say(i)
            // search for similar creep close and kill the ones with shortest ticks to live
            if( !creep.memory.arrived && creep.memory.container_target >= 0 ){

                if ( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.sources &&
                    Game.rooms[rm].memory.intel.sources[i] && Game.rooms[rm].memory.intel.sources[i].id ) {

                    var xx = Game.getObjectById(Game.rooms[rm].memory.intel.sources[i].id).pos.x
                    var yy = Game.getObjectById(Game.rooms[rm].memory.intel.sources[i].id).pos.y

                    if ( Math.max( Math.abs( creep.pos.x - xx ), Math.abs( creep.pos.y - yy ) ) <= 1 ) {

                        var obj = creep.pos.findInRange(FIND_MY_CREEPS, 4, {filter: obj =>  obj.memory.birth == rm &&
                                                                                            obj.memory.role == 'harvester' &&
                                                                                            obj.name != creep.name &&
                                                                                            obj.memory.arrived });
                        if( obj && obj.length >= 1 ){
                            for ( var j = 0 ; j < obj.length ; j++){
                                if( obj[j].memory.birth_target == creep.memory.birth_target ){
                                        obj[j].say('killed')                                  
                                        var container = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: obj =>  obj.structureType == STRUCTURE_CONTAINER });
                                        if( container && container[0] ){
                                            creep.transfer(container[0], 'energy')
                                        }
                                        obj[j].suicide()
                                }
                                else if( creep.memory.birth_target == 's0_350_1' &&
                                        ( obj[j].memory.birth_target == 's0_300_1' || obj[j].memory.birth_target == 's0_300_3' ) ){
                                        obj[j].say('killed')                                  
                                        var container = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: obj =>  obj.structureType == STRUCTURE_CONTAINER });
                                        if( container && container[0] ){
                                            creep.transfer(container[0], 'energy')
                                        }
                                        obj[j].suicide()
                                }
                                else if( creep.memory.birth_target == 's1_350_1' &&
                                        ( obj[j].memory.birth_target == 's1_300_1' || obj[j].memory.birth_target == 's1_300_3' ) ){
                                        obj[j].say('killed')                                  
                                        var container = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: obj =>  obj.structureType == STRUCTURE_CONTAINER });
                                        if( container && container[0] ){
                                            creep.transfer(container[0], 'energy')
                                        }
                                        obj[j].suicide()
                                }
                                else if( creep.memory.birth_target == 's0_450_1' &&
                                        ( obj[j].memory.birth_target == 's0_350_1' || obj[j].memory.birth_target == 's0_300_1' || obj[j].memory.birth_target == 's0_300_3' ) ){
                                        obj[j].say('killed')                                  
                                        var container = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: obj =>  obj.structureType == STRUCTURE_CONTAINER });
                                        if( container && container[0] ){
                                            creep.transfer(container[0], 'energy')
                                        }
                                        obj[j].suicide()
                                }
                                else if( creep.memory.birth_target == 's1_450_1' &&
                                        ( obj[j].memory.birth_target == 's1_350_1' || obj[j].memory.birth_target == 's1_300_1' || obj[j].memory.birth_target == 's1_300_3' ) ){
                                        obj[j].say('killed')                                  
                                        var container = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: obj =>  obj.structureType == STRUCTURE_CONTAINER });
                                        if( container && container[0] ){
                                            creep.transfer(container[0], 'energy')
                                        }
                                        obj[j].suicide()
                                }
                                else if( creep.memory.birth_target == 's0_550_1' &&
                                        ( obj[j].memory.birth_target == 's0_450_1' || obj[j].memory.birth_target == 's0_350_1' || obj[j].memory.birth_target == 's0_300_1' || obj[j].memory.birth_target == 's0_300_2' || obj[j].memory.birth_target == 's0_300_3' ) ){
                                        obj[j].say('killed')                                  
                                        var container = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: obj =>  obj.structureType == STRUCTURE_CONTAINER });
                                        if( container && container[0] ){
                                            creep.transfer(container[0], 'energy')
                                        }
                                        obj[j].suicide()
                                }
                                else if( creep.memory.birth_target == 's1_550_1' &&
                                        ( obj[j].memory.birth_target == 's1_450_1' || obj[j].memory.birth_target == 's1_350_1' || obj[j].memory.birth_target == 's1_300_1' || obj[j].memory.birth_target == 's1_300_2' || obj[j].memory.birth_target == 's1_300_3' ) ){
                                        obj[j].say('killed')                                  
                                        var container = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: obj =>  obj.structureType == STRUCTURE_CONTAINER });
                                        if( container && container[0] ){
                                            creep.transfer(container[0], 'energy')
                                        }
                                        obj[j].suicide()
                                }
                            }
                        }

                        creep.memory.arrived = 1
                    }
                }
            }
            //




            // mineral harvester
            if( creep.memory.birth_target == 'mineral' && Game.rooms[rm].memory.intel.minerals[0].vicinity > 1 ){

            }
            // other harvesters
            else{

                var i = creep.memory.container_target

                if ( (creep.memory.birth_target == 's0_300_1' || 
                    creep.memory.birth_target == 's0_300_2' || 
                    creep.memory.birth_target == 's0_300_3' || 
                    creep.memory.birth_target == 's0_350_1' || 
                    creep.memory.birth_target == 's0_450_1' || 
                    creep.memory.birth_target == 's0_550_1' ||

                    creep.memory.birth_target == 's1_300_1' || 
                    creep.memory.birth_target == 's1_300_2' ||
                    creep.memory.birth_target == 's1_300_3' ||  
                    creep.memory.birth_target == 's1_350_1' || 
                    creep.memory.birth_target == 's1_450_1' || 
                    creep.memory.birth_target == 's1_550_1' ) &&
                    
                    Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[i] && Game.rooms[rm].memory.intel.container[i].id ) {

                    var xx = Game.rooms[rm].memory.intel.container[i].pos_x
                    var yy = Game.rooms[rm].memory.intel.container[i].pos_y

                    if ( creep.pos.x == xx && creep.pos.y == yy) {
                        var ready = 1
                    }
                    else {
                        // move to container
                        var collect_pos = Game.getObjectById( Game.rooms[rm].memory.intel.container[i].id )
                        if ( collect_pos ){
                            creep.moveTo(collect_pos, {range: 0, priority: prior, maxRooms: 1  , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                        else{
                            if( creep.ticksToLive % 50 == 0 ){
                                creep.say('no container')
                                Game.rooms[rm].memory.oneTimer.plannerReset = 2
                            }
                        }
                    }
                }
                else{
                    // no container - harvest to the ground
                    var ready = 2

                    // if( creep.store.getUsedCapacity() >= ( creep.getActiveBodyparts(CARRY)*50 - creep.getActiveBodyparts(WORK)*2 ) ) {
                    //     var drop = 1
                    // }
                    if( creep.store.getFreeCapacity() < creep.getActiveBodyparts(WORK)*2 ) {
                        var drop = 1
                    }
                }
            }
            //

            // harvesting - container
            if(creep.memory.harvesting && ready == 1 ) {
    creep.say('c'+i)
                // harvest source
                var collect = Game.getObjectById( Game.rooms[rm].memory.intel.sources[i].id )

                if ( collect ){
                    var harv = creep.harvest( collect )
                }

                if ( harv == OK ){
                    // if( creep.store.getUsedCapacity() >= ( creep.getActiveBodyparts(CARRY)*50 - creep.getActiveBodyparts(WORK)*2 ) ) {
                    //     var drop = 1
                    // }
                    if( creep.store.getFreeCapacity() < creep.getActiveBodyparts(WORK)*2 ) {
                        var drop = 1
                    }
                }
                else if ( harv == ERR_INVALID_TARGET || harv == ERR_NOT_IN_RANGE ){
                    Game.rooms[rm].memory.oneTimer.plannerReset = 2
                    Game.rooms[rm].memory.phase = 1
                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                    Game.rooms[rm].memory.oneTimer.build = 2

                    delete Game.rooms[rm].memory.intel.container[i]
                }
            }
            // harvest - ground
            else if(creep.memory.harvesting && ready == 2 ) {
    creep.say('g'+i)
                var obj = Game.getObjectById( Game.rooms[rm].memory.intel.sources[i].id )

                var range = creep.pos.getRangeTo(obj);

                if ( range > 1 ) {
                    creep.moveTo(obj, {range: 1, priority: prior, maxRooms: 1 , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
                else{
                    var ready = 1
                }

                // harvesting
                if( ready == 1 ) {

                    // harvest source
                    var harv = creep.harvest( obj )
                }
            }
            //
            //
            if ( (!creep.memory.harvesting && ready == 1) || ( drop && drop == 1 ) ) {

                if ( i == 1 ) { var link = 2 } else { var link = 0 }

                var waht = 'drop'

                if ( Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link[link] && Game.rooms[rm].memory.intel.link[link].id  ) {

                    var obj = Game.getObjectById( Game.rooms[rm].memory.intel.link[link].id )

                    if( obj ){
                        if( creep.pos.isNearTo(obj) ){
                            if ( obj.store['energy'] < 800 ) {
                                var waht = 'link'
                            }                        
                        }
                        else{
                            delete Game.rooms[rm].memory.intel.link[link]
                            Game.rooms[rm].memory.oneTimer.plannerReset = 2
                            creep.say('reset')
                        }
                    }
                    else{                    
                        Game.rooms[rm].memory.phase = 1
                    }
                }

                if ( waht == 'link' ){
                    var action = creep.transfer( obj , 'energy' )
                    creep.say('l')

                    if( action == ERR_NOT_IN_RANGE ){
                        creep.moveTo(obj, {range: 1, priority: prior, maxRooms: 1  , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                }
                // else if ( waht == 'drop' ){
                //     creep.drop( 'energy' )
                //     creep.say('c')
                // }
            }
            //
        }
        else{

            var rm_tgt = rm


            // find route
            var dist = Game.map.findRoute(creep.pos.roomName, rm_tgt, {
                                                                    routeCallback(roomName ) {

                                                                        var rm_sct = roomName

                                                                        if( rm_sct.split("E")[0].length == rm_sct.length ){
                                                                            var lon = 'W'
                                                                        }
                                                                        else{
                                                                            var lon = 'E'
                                                                        }
                
                                                                        if( rm_sct.split("N")[0].length == rm_sct.length ){
                                                                            var lat = 'S'
                                                                        }
                                                                        else{
                                                                            var lat = 'N'
                                                                        }
                
                                                                        var split1 = rm_sct.split(lon)[1]
                                                                        var split2 = split1.split(lat)
                
                                                                        var lat_coord = split2[1]
                                                                        var lon_coord = split2[0]
                
                                                                        if (  ( lat_coord % 10 == 4 || lat_coord % 10 == 5 || lat_coord % 10 == 6 ) &&
                                                                            ( lon_coord % 10 == 4 || lon_coord % 10 == 5 || lon_coord % 10 == 6 ) ){
                                                                            var rm_type = 'center'
                                                                        }
                                                                        else{
                                                                            var rm_type = 'not center'
                                                                        }
                
                
                                                                        if( rm_type == 'center' ) {    // avoid this room
                                                                            return Infinity;
                                                                        }
                                                                        else if( _.intersection( [ roomName ], Object.keys(Memory.hostile)).length >= 1 ) {    // avoid this room
                                                                            return Infinity;
                                                                        }
                                                                        else{
                                                                            return 1;
                                                                        }                                                                                        
                                                                    }});
         
            // position
            if( dist.length >= 1 ){
                var rm_tgt = dist[0].room
                var xx = 24
                var yy = 24
                var rng = 51
            }
            else{
                var rm_tgt = creep.memory.birth_target

                var obj = Game.getObjectById( creep.memory.birth_info_2 )

                if( obj ){
                    var xx = obj.pos.x
                    var yy = obj.pos.y
                    var rng = 5
                }
                else{
                    var xx = 24
                    var yy = 24
                    var rng = 51
                }                                
            }            
    
            var target = new RoomPosition(xx, yy, rm_tgt)
            //

            // MOVE
            creep.moveTo(target, {range: rng, priority: prior ,maxRooms: 1, maxOps: 5500, plainCost: 1,swampCost: 5, containerCost: 8, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

        }
    }
};

module.exports = roleBaseHarvester;
