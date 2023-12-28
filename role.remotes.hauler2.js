const Pathing            = require('pathing');

var functionManagerDrop  = require('function.manager.drop')
var FunctionStaticCount  = require('function.static_count')

var miliarIntel  = require('main.militar.intel')

var outpostHauler = {

    run: function(creep) {

        // debug
        if( !Memory.stats.cpuDebug || (Game.time - Memory.stats.cpuDebug.tick) >= 1  ){
            Memory.stats.cpuDebug = {}
            Memory.stats.cpuDebug.tick = Game.time
        }
        var cpu_debug = Game.cpu.getUsed() 
        //            
        

        if( creep.memory.harvesting == true ){
            creep.say( creep.memory.birth_target  )
        }

        if( creep.store.getUsedCapacity() >= creep.store.getFreeCapacity() ){
            creep.memory.harvesting = false
        }
        else if( creep.store.getUsedCapacity() > 0 && creep.pos.roomName == creep.memory.birth ){
            creep.memory.harvesting = false
        }

        if( creep.memory.bucket_dontmove == 1 && creep.store.getUsedCapacity() >=50 ){
            creep.memory.bucket_dontmove = Game.time
        }

        // suicide
        if( creep.hits < creep.hitsMax && 
            creep.pos.roomName != creep.memory.birth &&
            creep.getActiveBodyparts(MOVE) == 0 ){
            creep.suicide()
        }//

        
        // debug
        var debug = 'debug01'
        var cpu_creep = Game.cpu.getUsed() - cpu_debug
        var cpu_debug = Game.cpu.getUsed()
        if( !Memory.stats.cpuDebug[debug] ){
            Memory.stats.cpuDebug[debug] = {}
            Memory.stats.cpuDebug[debug].cnt = 0
            Memory.stats.cpuDebug[debug].cpu = 0 
            Memory.stats.cpuDebug[debug].avg = 0 
        }
        Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
        Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
        Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
        //

        // scout for enemies
        if ( Game.time % 6 == 0 && creep.pos.roomName != creep.memory.birth ){
            miliarIntel.run( creep.pos.roomName )
        }
        //

        // debug
        var debug = 'debug02'
        var cpu_creep = Game.cpu.getUsed() - cpu_debug
        var cpu_debug = Game.cpu.getUsed()
        if( !Memory.stats.cpuDebug[debug] ){
            Memory.stats.cpuDebug[debug] = {}
            Memory.stats.cpuDebug[debug].cnt = 0
            Memory.stats.cpuDebug[debug].cpu = 0 
            Memory.stats.cpuDebug[debug].avg = 0 
        }
        Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
        Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
        Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
        //

        if( creep.memory.bucket_dontmove != 1  ){

            var prior  = 15
            var colour = '#00ff00'

            // Game.map.visual.circle(creep.pos, {fill: colour, radius: 1, stroke: colour, opacity: 0.9 });

            if(!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
                creep.memory.harvesting = true;
                creep.memory.container_wait_time = creep.store.getFreeCapacity()

                // clean memory 
                creep.memory.birth_target   = null // rm_tgt
                creep.memory.birth_info     = null // not importante
                creep.memory.birth_info_2   = null // source.id
                creep.memory.birth_info_3   = null // xx
                creep.memory.birth_info_4   = null // yy
                creep.memory.birth_info_5   = null // distance
                creep.memory.container      = null // container

                creep.memory.bucket_cnt = 9
            }

            if( creep.memory.harvesting && creep.store.getUsedCapacity() >=50  ){
                creep.memory.harvesting = false;
            }

            // bucket count to avoid transfering back and forth
            if( !creep.memory.bucket_cnt ){
                creep.memory.bucket_cnt = 0
            }
            else{
                creep.memory.bucket_cnt = creep.memory.bucket_cnt - 1
            }

            // disable bucket if cpu is low
            if( Game.cpu.bucket < 4000 ){
                creep.memory.bucket_cnt = 25
            }

            // check for move parts
            if( creep.ticksToLive % 70 == 0 ){
                if( creep.getActiveBodyparts(MOVE) == 0 && creep.pos.roomName != creep.memory.birth ){
                    creep.suicide()
                }
            }    
            
            // debug
            var debug = 'debug03'
            var cpu_creep = Game.cpu.getUsed() - cpu_debug
            var cpu_debug = Game.cpu.getUsed()
            if( !Memory.stats.cpuDebug[debug] ){
                Memory.stats.cpuDebug[debug] = {}
                Memory.stats.cpuDebug[debug].cnt = 0
                Memory.stats.cpuDebug[debug].cpu = 0 
                Memory.stats.cpuDebug[debug].avg = 0 
            }
            Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
            Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
            Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
            //

            FunctionStaticCount.run( creep )   
            
            // debug
            var debug = 'debug04'
            var cpu_creep = Game.cpu.getUsed() - cpu_debug
            var cpu_debug = Game.cpu.getUsed()
            if( !Memory.stats.cpuDebug[debug] ){
                Memory.stats.cpuDebug[debug] = {}
                Memory.stats.cpuDebug[debug].cnt = 0
                Memory.stats.cpuDebug[debug].cpu = 0 
                Memory.stats.cpuDebug[debug].avg = 0 
            }
            Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
            Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
            Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
            //

            // get a remote job
            if( !creep.memory.birth_target || creep.memory.birth_target == null ){

                var rm = creep.memory.birth
                var lvl = Game.rooms[rm].controller.level

                // check amount of remote harvester working
                var harv_obj = _.filter( Game.creeps , (creep) => creep.memory.role  == 'harvester_out' && 
                                                                  creep.memory.birth == rm && 
                                                                  (creep.memory.phase == 4 || creep.memory.phase == 3) )

                if( harv_obj.length >= 1 ){

                    var priority_matrix = new Object;

                    for ( var i = 0 ; i < harv_obj.length ; i++){

                        var source_id = harv_obj[i].memory.birth_info_2

                        priority_matrix[ source_id ] = {}
                        priority_matrix[ source_id ].birth_target           = harv_obj[i].memory.birth_target   // rm_tgt
                        priority_matrix[ source_id ].birth_info_2           = source_id                         // source id
                        priority_matrix[ source_id ].birth_info_3           = harv_obj[i].memory.birth_info_3   // xx
                        priority_matrix[ source_id ].birth_info_4           = harv_obj[i].memory.birth_info_4   // yy
                        priority_matrix[ source_id ].birth_info_5           = harv_obj[i].memory.birth_info_5   // distance
                        priority_matrix[ source_id ].cap_assigned           = 0
                        priority_matrix[ source_id ].priority               = 0

                        if( !priority_matrix[ source_id ].ammount ){
                            priority_matrix[ source_id ].ammount = 0
                        }

                        if( !priority_matrix[ source_id ].harvester ){
                            priority_matrix[ source_id ].harvester = 0
                        }

                        if( !priority_matrix[ source_id ].harvester_work ){
                            priority_matrix[ source_id ].harvester_work = 0
                        }

                        if( !priority_matrix[ source_id ].harvester_source_amt ){
                            if( Game.getObjectById(source_id) ){
                                priority_matrix[ source_id ].harvester_source_amt = Game.getObjectById(source_id).energyCapacity
                            }
                            else{
                                priority_matrix[ source_id ].harvester_source_amt = 1500
                            }
                        }

                        // container
                        if( harv_obj[i].memory.container ){
                            if( Game.getObjectById( harv_obj[i].memory.container ) ){

                                priority_matrix[ source_id ].ammount = Game.getObjectById( harv_obj[i].memory.container ).store['energy']
                            }
                            else{

                                priority_matrix[ source_id ].ammount = 0
                            }

                            priority_matrix[ source_id ].harvester = Math.max( priority_matrix[ source_id ].harvester , harv_obj[i].ticksToLive * 5 / 6 )
                            priority_matrix[ source_id ].harvester_work = Math.max( priority_matrix[ source_id ].harvester_work  , harv_obj[i].getActiveBodyparts(WORK) )
                        }

                        // ground
                        if( harv_obj[i].memory.resource ){

                            if( Game.getObjectById( harv_obj[i].memory.resource ) ){
                                priority_matrix[ source_id ].ammount = Game.getObjectById( harv_obj[i].memory.resource ).amount
                            }
                            else{
                                priority_matrix[ source_id ].ammount = 0
                            }
                            priority_matrix[ source_id ].harvester = Math.max( priority_matrix[ source_id ].harvester , harv_obj[i].ticksToLive * 5 / 6 )
                            priority_matrix[ source_id ].harvester_work = Math.max( priority_matrix[ source_id ].harvester_work  , harv_obj[i].getActiveBodyparts(WORK) )
                        }
                    }

                    // check for working haulers - capacity assigned
                    var hauler_obj = _.filter( Game.creeps , (creep) => creep.memory.role  == 'hauler_out' && creep.memory.birth == rm &&
                                                                        creep.memory.birth_info_2 && creep.memory.birth_info_2 != null && creep.memory.birth_info_2 != 0
                                                                        // && creep.memory.harvesting == true
                                                                        )
                                                                        
                    if( hauler_obj.length >= 1 ){
                       
                        for ( var i = 0 ; i < hauler_obj.length ; i++){

                            var source_id = hauler_obj[i].memory.birth_info_2

                            if( priority_matrix[ source_id ] && hauler_obj[i].memory.harvesting == true ){

                                priority_matrix[ source_id ].cap_assigned = priority_matrix[ source_id ].cap_assigned + hauler_obj[i].store.getFreeCapacity()
                            }
                        }
                    }

                    for( var source_id in priority_matrix ) {

                        if( Game.rooms[rm].energyCapacityAvailable >= 1300 && 1==1 ){
                            priority_matrix[ source_id ].priority =   priority_matrix[ source_id ].ammount
                                                                    - priority_matrix[ source_id ].cap_assigned
                                                                    // + ( 2 * Math.min( (priority_matrix[ source_id ].harvester_work * Math.min( priority_matrix[ source_id ].birth_info_5 , priority_matrix[ source_id ].harvester) ), priority_matrix[ source_id ].harvester_source_amt ) )
                                                                    + 2 * Math.min( priority_matrix[ source_id ].harvester_work, 4 ) * Math.min( Math.max( priority_matrix[ source_id ].birth_info_5 - 50, 0 ) , priority_matrix[ source_id ].harvester )
                        }
                        else{
                            priority_matrix[ source_id ].priority =  priority_matrix[ source_id ].ammount
                                                                   - priority_matrix[ source_id ].cap_assigned
                        }
                    }


                    priority_matrix = _.sortBy(priority_matrix, 'birth_info_5'); // sortby distance


                    // change role if low ticks
                    var rm = creep.memory.birth
                    if( global.rooms[rm] && 
                        global.rooms[rm].remotes && 
                        global.rooms[rm].remotes.remotes &&
                        global.rooms[rm].remotes.remotes[0] &&
                        global.rooms[rm].remotes.remotes[0].distance &&
                        creep.ticksToLive < global.rooms[rm].remotes.remotes[0].distance * 2 + 30 ){
                        creep.memory.role = 'hauler_rm'
                        creep.memory.birth_target = 'mv'
                    }
                    //                       

                    for( var source_id in priority_matrix ) {

                        if( priority_matrix[ source_id ].priority >= creep.store.getFreeCapacity() &&
                            priority_matrix[ source_id ].birth_info_5 * 2 + 30 <  creep.ticksToLive
                          ){
                            creep.memory.birth_target = priority_matrix[ source_id ].birth_target
                            creep.memory.birth_info_2 = priority_matrix[ source_id ].birth_info_2
                            creep.memory.birth_info_3 = priority_matrix[ source_id ].birth_info_3
                            creep.memory.birth_info_4 = priority_matrix[ source_id ].birth_info_4
                            creep.memory.birth_info_5 = priority_matrix[ source_id ].birth_info_5
                            break
                        }
                    }
                }
            }
            //

            // debug
            var debug = 'debug05'
            var cpu_creep = Game.cpu.getUsed() - cpu_debug
            var cpu_debug = Game.cpu.getUsed()
            if( !Memory.stats.cpuDebug[debug] ){
                Memory.stats.cpuDebug[debug] = {}
                Memory.stats.cpuDebug[debug].cnt = 0
                Memory.stats.cpuDebug[debug].cpu = 0 
                Memory.stats.cpuDebug[debug].avg = 0 
            }
            Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
            Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
            Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
            //

            // check for enemies on the room
            var check_freq = 6
            var rm_tgt  = creep.memory.birth_target
            var rm  = creep.memory.birth
            var ok = 0

            if( creep.ticksToLive > 150 && Game.time % check_freq == 1 && global.rooms[rm] && global.rooms[rm].remotes && global.rooms[rm].remotes.remotes ){

                for ( var i = 0 ; i < global.rooms[rm].remotes.remotes.length ; i++){
                    
                    // found remote on room list
                    if( rm_tgt == Game.rooms[rm].memory.remotes[i].rm ){
                        var ok = 1
                        break;
                        // will keep "i" as the index of the remote
                    }
                }
            } 

            // debug
            var debug = 'debug06'
            var cpu_creep = Game.cpu.getUsed() - cpu_debug
            var cpu_debug = Game.cpu.getUsed()
            if( !Memory.stats.cpuDebug[debug] ){
                Memory.stats.cpuDebug[debug] = {}
                Memory.stats.cpuDebug[debug].cnt = 0
                Memory.stats.cpuDebug[debug].cpu = 0 
                Memory.stats.cpuDebug[debug].avg = 0 
            }
            Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
            Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
            Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
            //
            
            // if hostiles on remote move back to room
            if( ok == 1 && global.rooms[rm] && global.rooms[rm].remotes && global.rooms[rm].remotes.remotes && 
                global.rooms[rm].remotes.remotes[i].status == 'hostiles' ){

                if( creep.pos.roomName != rm ){
                    // find route
                    var dist = Game.map.findRoute(creep.pos.roomName, rm, {
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
                        
                                                                                if( roomName == rm || roomName == rm_tgt ){
                                                                                    return 1;
                                                                                }
                                                                                else if( rm_type == 'center' ) {    // avoid this room
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
                        var rm_tgt = rm

                        if( Game.rooms[rm].storage ){
                            var xx = Game.rooms[rm].storage.pos.x
                            var yy = Game.rooms[rm].storage.pos.y
                            var rng = 5
                        }
                        else{
                            var xx = Game.rooms[rm].memory.base_x
                            var yy = Game.rooms[rm].memory.base_y
                            var rng = 51
                        }                                
                    }            
            
                    var target = new RoomPosition(xx, yy, rm_tgt)
                    //

                    // MOVE
                    creep.moveTo(target, {range: rng, priority: prior ,maxRooms: 1, maxOps: 5500, plainCost: 4,swampCost: 20, containerCost: 8, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
                else {
                    var xx = Game.rooms[rm].memory.base_x
                    var yy = Game.rooms[rm].memory.base_y
                    var rng = 8

                    var target = new RoomPosition(xx, yy, rm)

                    creep.moveTo( target, {range: rng, maxRooms: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                }   

                // debug
                var debug = 'debug07'
                var cpu_creep = Game.cpu.getUsed() - cpu_debug
                var cpu_debug = Game.cpu.getUsed()
                if( !Memory.stats.cpuDebug[debug] ){
                    Memory.stats.cpuDebug[debug] = {}
                    Memory.stats.cpuDebug[debug].cnt = 0
                    Memory.stats.cpuDebug[debug].cpu = 0 
                    Memory.stats.cpuDebug[debug].avg = 0 
                }
                Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
                Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
                Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
                //
            } 
            else if( rm_tgt !== null ){
                //
                //
                // harvesting
                if( creep.memory.harvesting ) {

                    var rm_tgt  = creep.memory.birth_target
                    var rm  = creep.memory.birth

                    var ok = 0                 

                    if( ok == 1 ){
                     // ja rodou
                    }
                    // move to room
                    else if( creep.pos.roomName != rm_tgt && rm_tgt !== null ) {

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
                        creep.moveTo(target, {range: rng, priority: prior ,maxRooms: 1, maxOps: 5500, plainCost: 5,swampCost: 25, containerCost: 8, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                    }
                    else {

                        // container check
                        if ( (!creep.memory.container || creep.memory.container == null) && creep.memory.birth_info_2 ) {

                            // find container
                            var source0 = Game.getObjectById( creep.memory.birth_info_2 )
                            var container = source0.pos.findInRange( FIND_STRUCTURES ,1 , {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER)}} )

                            if( container.length >= 1 ){
                                 creep.memory.container = container[0].id
                            }
                            else{
                                creep.memory.container = 'ground'
                            }
                        }
                        //
                        // collect
                        else {
                            var container = Game.getObjectById( creep.memory.container )

                            creep.say( creep.memory.container_wait_time )
                            if( container ){
                                creep.say(88)
                                if( container && container.store['energy'] >= creep.memory.container_wait_time ){

                                    var action = creep.withdraw(container,'energy')

                                    if ( action == OK ){
                                        // try to grab dropped resources
                                        if( creep.store.getFreeCapacity() > 0 ){
                                            var dropped = creep.pos.findInRange( FIND_DROPPED_RESOURCES, 1 )
                                            if( dropped.length >= 1 ){
                                                creep.pickup(dropped[0] )
                                            }
                                        }
                                        // move away
                                        var xx      = creep.memory.pos_1_xx
                                        var yy      = creep.memory.pos_1_yy
                                        var target = new RoomPosition(xx, yy, creep.memory.pos_1_rm)
                                        creep.moveTo(target, {range: 0, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                                    }
                                    else if ( action == ERR_NOT_IN_RANGE ) {
                                        creep.moveTo(container, {range: 1, maxRooms: 1, priority: prior,  visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                    }
                                    else if ( action == ERR_INVALID_TARGET ){
                                        creep.memory.container = null
                                    }
                                }
                                else{

                                    if( creep.ticksToLive % 2 == 0 ){
                                        var drop = Game.getObjectById(creep.memory.birth_info_2).pos.findInRange(FIND_DROPPED_RESOURCES, 1)

                                        if( drop && drop[0] && drop[0].amount >= creep.memory.container_wait_time ){
                                            var act = creep.pickup(drop[0])

                                            if( act == ERR_NOT_IN_RANGE ){
                                                creep.moveTo(drop[0], {range: 0, maxRooms: 1, priority: prior,  visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                            }
                                        }
                                    }
                                    else if( container && creep.pos.findInRange([container], 5).length >= 1 ){
                                        if( creep.ticksToLive % 10 == 0 ){
                                            creep.memory.bucket_cnt = 10
                                            creep.memory.container_wait_time = creep.memory.container_wait_time - 50
                                            if( creep.memory.container_wait_time < 50 ){ creep.memory.container_wait_time = 50 }
                                        }
                                    }
                                    else{
                                        creep.memory.container_wait_time = creep.store.getFreeCapacity()
                                    }

                                    if( container ){
                                        creep.moveTo(container, {range: 4, maxRooms: 1, priority: prior,  visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                                        var ground = Game.rooms[ container.pos.roomName ].lookForAt(LOOK_RESOURCES, container.pos);
                                        if( ground && ground[0] && ground[0].resourceType == 'energy'  ){
                                            var action = creep.pickup(ground[0])
                                            if( action == OK ){
                                                if( creep.memory.container_wait_time > creep.store.getFreeCapacity() ){
                                                    creep.memory.container_wait_time = creep.store.getFreeCapacity()
                                                }
                                            }
                                            else if( action == ERR_NOT_IN_RANGE ){
                                                creep.moveTo(ground[0], {range: 1, maxRooms: 1, priority: prior,  visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                            }
                                        }
                                    }
                                }
                            }
                            // ground
                            else{
                                creep.say(99)
                                var ground = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (dropped) =>  {return (  dropped.amount >= Math.max( creep.store.getFreeCapacity() * 0.75, 50 ) ) } } ) 
                               
                                if( ground && ground.resourceType == 'energy'  ){

                                    creep.say(999)
                                    var action = creep.pickup(ground)
                                    if( action == OK ){
                                        if( creep.memory.container_wait_time > creep.store.getFreeCapacity() ){
                                            creep.memory.container_wait_time = creep.store.getFreeCapacity()
                                        }
                                    }
                                    else if( action == ERR_NOT_IN_RANGE ){
                                        creep.moveTo(ground, {range: 1, maxRooms: 1, priority: prior,  visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                    }
                                }
                                else{
                                    creep.memory.birth_target   = null // rm_tgt
                                    creep.memory.birth_info     = null // not importante
                                    creep.memory.birth_info_2   = null // source.id
                                    creep.memory.birth_info_3   = null // xx
                                    creep.memory.birth_info_4   = null // yy
                                    creep.memory.birth_info_5   = null // distance
                                    creep.memory.container      = null // container

                                    var target = new RoomPosition(24, 24, creep.memory.birth)

                                    var avoidRooms_tmp = Memory.avoidRooms_tmp

                                    creep.moveTo(target, {range: 24, priority: prior ,maxRooms: 9, avoidRooms: avoidRooms_tmp , maxOps: 3500, findRoute: true, plainCost: 2,swampCost: 4, containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
       
                                }
                            }
                        }
                    }

                    // debug
                    var debug = 'debug08_0'
                    var cpu_creep = Game.cpu.getUsed() - cpu_debug
                    var cpu_debug = Game.cpu.getUsed()
                    if( !Memory.stats.cpuDebug[debug] ){
                        Memory.stats.cpuDebug[debug] = {}
                        Memory.stats.cpuDebug[debug].cnt = 0
                        Memory.stats.cpuDebug[debug].cpu = 0 
                        Memory.stats.cpuDebug[debug].avg = 0 
                    }
                    Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
                    Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
                    Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
                    //

                }
                // dropping back home
                ////////
                else if ( !creep.memory.harvesting )  {

                    // nao roda bucket brigade se a sala está no lvl 8 e bucket menor que 8000
                    if( Game.rooms[ creep.memory.birth ].controller.level == 8 && Game.cpu.bucket < 8000 ){
                        creep.memory.bucket_cnt = 5
                    }

                    // bucket brigade
                    var ok = 0
                    if( creep.memory.bucket_cnt <= 0 ){

                        // var obj_similar_creeps = _.filter(Game.creeps, (cp) => cp.memory.role == 'hauler_out' && cp.memory.birth == creep.memory.birth && cp.memory.birth_info_3 == creep.memory.birth_info_3 && cp.name != creep.name && cp.store.getUsedCapacity() == 0 && cp.memory.harvesting == true )
                        var obj_similar_creeps = _.filter(Game.creeps, (cp) => cp.memory.role == 'hauler_out' && 
                                                                                cp.name != creep.name && 
                                                                                cp.store.getUsedCapacity() == 0 && 
                                                                                cp.store.getCapacity() == creep.store.getCapacity() && 
                                                                                cp.memory.harvesting == true )

                        var inrange = creep.pos.findInRange(obj_similar_creeps, 1)

                        // if( inrange.length == 1 && creep.ticksToLive >= inrange[0].memory.birth_info_5 * 2 ) {
                        if( inrange.length == 1 && creep.ticksToLive > inrange[0].ticksToLive ) {

                            if( inrange[0].pos.x == creep.memory.pos_1_xx && inrange[0].pos.y == creep.memory.pos_1_yy ){

                            }
                            else if( inrange[0].pos.x == creep.memory.pos_2_xx && inrange[0].pos.y == creep.memory.pos_2_yy ){

                            }
                            else if( inrange[0].pos.x == creep.memory.pos_3_xx && inrange[0].pos.y == creep.memory.pos_3_yy ){

                            }
                            else{

                                creep.transfer( inrange[0], 'energy' );

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

                                var memory_bucket_dontmove_1 = creep.bucket_dontmove
                                var memory_bucket_dontmove_2 = inrange[0].bucket_dontmove

                                inrange[0].memory = memory_temp_1
                                creep.memory      = memory_temp_2

                                creep.memory.bucket_dontmove = memory_bucket_dontmove_1
                                inrange[0].memory.bucket_dontmove = memory_bucket_dontmove_2
                                //

                                // timer to be able to transfer again
                                inrange[0].memory.bucket_cnt = 3

                                if( inrange[0].memory.bucket_dontmove == Game.time ){
                                    inrange[0].memory.bucket_dontmove = Game.time
                                }
                                else{
                                    inrange[0].memory.bucket_dontmove = 1
                                }

                                var ok = 1
                            }
                        }
                    }
                    else{
                        var ok = 0
                    }

                    // debug
                    var debug = 'debug08_1b'
                    var cpu_creep = Game.cpu.getUsed() - cpu_debug
                    var cpu_debug = Game.cpu.getUsed()
                    if( !Memory.stats.cpuDebug[debug] ){
                        Memory.stats.cpuDebug[debug] = {}
                        Memory.stats.cpuDebug[debug].cnt = 0
                        Memory.stats.cpuDebug[debug].cpu = 0 
                        Memory.stats.cpuDebug[debug].avg = 0 
                    }
                    Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
                    Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
                    Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
                    //

                    if( ok == 1 ){
                     // ja rodou
                    }
                    else
                    // move back to birth room
                    if( creep.pos.roomName != creep.memory.birth ) {

                        if( creep.getActiveBodyparts(WORK) >= 1 ){

                            if( !creep.memory.timer_repair ){
                                creep.memory.timer_repair = 4
                            }

                            if( !creep.memory.timer_build ){
                                creep.memory.timer_build = 3
                            }

                            // build on the way
                            if ( creep.ticksToLive % creep.memory.timer_build == 0 && creep.pos.roomName != creep.memory.birth ){

                                var targets = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 3 )

                                if ( targets.length >= 1 ){

                                    creep.memory.timer_build = 1
                                    var action_b = creep.build(targets[0])
                                    creep.moveTo(targets[0], {range: 1, plainCost: 2,swampCost: 10, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                                else{
                                    creep.memory.timer_build = creep.memory.timer_build + 2
                                    if( creep.memory.timer_build >= 250 ){ creep.memory.timer_build = 250 }
                                }
                            }
                            // repair on the way out
                            else if ( creep.ticksToLive % creep.memory.timer_repair == 0 ) {

                                var targets = creep.pos.findInRange(FIND_STRUCTURES, 3, {filter: object => object.hits <= object.hitsMax - 100 && object.structureType == STRUCTURE_ROAD});

                                if ( targets.length >= 1 ){

                                    creep.memory.timer_repair = creep.memory.timer_repair - 25
                                    if( creep.memory.timer_repair < 0 ){ creep.memory.timer_repair = 1 }
                                    var targets = _.sortBy(targets, 'hits')
                                    creep.repair(targets[0])
                                }
                                else{
                                    creep.memory.timer_repair = creep.memory.timer_repair + 5
                                    if( creep.memory.timer_repair >= 25 ){ creep.memory.timer_repair = 25 }
                                }
                            }
                        }

                        if( action_b >= 0 ){
                            // do nothing
                        }
                        else{

                            // find route
                            var dist = Game.map.findRoute(creep.pos.roomName, creep.memory.birth, {
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
                                var rm_tgt = creep.memory.birth
                                var xx = Game.rooms[rm_tgt].memory.base_x
                                var yy = Game.rooms[rm_tgt].memory.base_y                               
                            }            
                    
                            var target = new RoomPosition(xx, yy, rm_tgt)
                            //

                            // MOVE
                            creep.moveTo(target, {range: rng, priority: prior ,maxRooms: 1, maxOps: 5500, plainCost: 5,swampCost: 25, containerCost: 8, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            
                        }
                    }


                    // copy drop from harvester min
                    else {

                        var rm = creep.memory.birth
                        var role2 = creep.memory.birth_target

                        functionManagerDrop.run( creep, rm, role2 )

                        if ( !creep.memory.task_id || creep.memory.task_id == null ) {
                            creep.memory.task_operation  = 'drop'
                        }

                        // DROP / BUILD / REPAIR / UPGRADE
                        // transfer
                        if ( creep.memory.task_operation  == 'transfer' ) {
                            var drop = Game.getObjectById( creep.memory.task_id )
                            var action = creep.transfer( drop , creep.memory.task_resource )

                            if( drop && action == ERR_NOT_IN_RANGE) {
                                //creep.moveTo( drop , {reusePath: 15 , visualizePathStyle: {stroke: '#FFFF00', opacity: .5, strokeWidth: .1} });
                                creep.moveTo(drop, {range: 1, maxRooms: 1, plainCost: 2,swampCost: 10, priority: prior ,containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                                var action = creep.transfer( drop , creep.memory.task_resource )
                            }

                            if ( action     == OK || action     == ERR_FULL || action == ERR_INVALID_TARGET || !drop ) {

                                // remove da lista geral
                                var rm = creep.memory.birth
                                for ( var k = 0 ; k < global.rooms[rm].manager_drop.length ; k++){
                                    if( creep.memory.task_id == global.rooms[rm].manager_drop[k].id ){
                                        if( Game.rooms[rm].storage && Game.rooms[rm].storage.id == creep.memory.task_id ){
                                            break;
                                        }
                                        else {
                                            global.rooms[rm].manager_drop.splice(k,1)
                                            break;
                                        }
                                    }
                                }

                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null

                            }
                        }
                        // drop on the groud where storage should be
                        else if ( creep.memory.task_operation  == 'drop' ) {

                            var rm = creep.memory.birth

                            if( !Game.rooms[ rm ].terminal ){
                                var xx = Game.rooms[ rm ].memory.base_x
                                var yy = Game.rooms[ rm ].memory.base_y
                            }
                            else if(  Game.rooms[ rm ].memory.h1_type == 'h' ){
                                var xx = Game.rooms[ rm ].memory.h1_x
                                var yy = Game.rooms[ rm ].memory.h1_y - 2
                            }
                            else{
                                var xx = Game.rooms[ rm ].memory.h1_x - 2
                                var yy = Game.rooms[ rm ].memory.h1_y 
                            }
                            

                            // var xx = 28
                            // var yy = 11

                            if( creep.pos.x == xx && creep.pos.y == yy ){
                                creep.drop('energy');

                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null
                               
                            }
                            else{
                                creep.moveTo(new RoomPosition(xx, yy, rm), {range: 0, plainCost: 2,swampCost: 10, priority: prior ,containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }
                        }
                        else{
                            var rm = creep.memory.birth
                            var xx = Game.rooms[rm].memory.base_x
                            var yy = Game.rooms[rm].memory.base_y

                            const target = new RoomPosition(xx, yy, rm);
                            creep.moveTo(target, {range: 7, plainCost: 2,swampCost: 10, priority: prior ,containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                    }
                }

                // debug
                var debug = 'debug08_1'
                var cpu_creep = Game.cpu.getUsed() - cpu_debug
                var cpu_debug = Game.cpu.getUsed()
                if( !Memory.stats.cpuDebug[debug] ){
                    Memory.stats.cpuDebug[debug] = {}
                    Memory.stats.cpuDebug[debug].cnt = 0
                    Memory.stats.cpuDebug[debug].cpu = 0 
                    Memory.stats.cpuDebug[debug].avg = 0 
                }
                Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
                Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
                Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
                //
            }
            else if( rm_tgt == null ){
                creep.say('flee to do')
                
                var obj_flee = creep.pos.findInRange(FIND_MY_CREEPS, 1,{ filter: cp => cp.name != creep.name } )

                if( obj_flee && obj_flee.length >=1 ){
                    creep.memory.rand_cnt = 99
                }
                else{
                    creep.memory.rand_cnt = 0
                }

                // debug
                var debug = 'debug09'
                var cpu_creep = Game.cpu.getUsed() - cpu_debug
                var cpu_debug = Game.cpu.getUsed()
                if( !Memory.stats.cpuDebug[debug] ){
                    Memory.stats.cpuDebug[debug] = {}
                    Memory.stats.cpuDebug[debug].cnt = 0
                    Memory.stats.cpuDebug[debug].cpu = 0 
                    Memory.stats.cpuDebug[debug].avg = 0 
                }
                Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
                Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
                Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
                //
            }


            // drop energy around if filled
            if( !Game.rooms[creep.memory.birth].storage && creep.pos.roomName == creep.memory.birth && Game.cpu.bucket >= 5000 && creep.store.getUsedCapacity() > 0 && creep.ticksToLive % 2 == 1 ){

                if( Game.cpu.bucket >= 7500 ){
                    var limit = 1
                }
                else{
                    var limit = 0.9
                }

                var obj

                if( Game.rooms[creep.memory.birth].energyAvailable <= Game.rooms[creep.memory.birth].energyCapacityAvailable * limit ){
                    var obj = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: obj =>  obj.structureType == STRUCTURE_EXTENSION && obj.store.getFreeCapacity('energy') > 0 });
                }

                if( obj && obj.length >= 1 ){
                    creep.transfer(obj[0], 'energy')
                }
                else if ( Game.cpu.bucket >= 5500 ) {
                    var obj = creep.pos.findInRange(FIND_MY_CREEPS, 1, {filter: obj =>  ( obj.memory.role =='harvester_min' || 
                                                                                          obj.memory.role =='repairer' || 
                                                                                          obj.memory.role =='upgrader' ||
                                                                                          obj.memory.role =='builder' ) && 
                                                                                          
                                                                                          obj.store.getFreeCapacity() > 0 });

                    if( obj.length >= 1 ){
                        creep.transfer(obj[0], 'energy')
                    }
                }
            }
            //

            // debug
            var debug = 'debug10'
            var cpu_creep = Game.cpu.getUsed() - cpu_debug
            var cpu_debug = Game.cpu.getUsed()
            if( !Memory.stats.cpuDebug[debug] ){
                Memory.stats.cpuDebug[debug] = {}
                Memory.stats.cpuDebug[debug].cnt = 0
                Memory.stats.cpuDebug[debug].cpu = 0 
                Memory.stats.cpuDebug[debug].avg = 0 
            }
            Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
            Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
            Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
            //

            // repair on home
            if( Game.cpu.bucket >= 9950 && creep.pos.roomName == creep.memory.birth && creep.store.getUsedCapacity('energy') > 0  ){

                var wk_parts = creep.getActiveBodyparts(WORK)

                if( wk_parts > 0 ){
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

            // debug
            var debug = 'debug11'
            var cpu_creep = Game.cpu.getUsed() - cpu_debug
            var cpu_debug = Game.cpu.getUsed()
            if( !Memory.stats.cpuDebug[debug] ){
                Memory.stats.cpuDebug[debug] = {}
                Memory.stats.cpuDebug[debug].cnt = 0
                Memory.stats.cpuDebug[debug].cpu = 0 
                Memory.stats.cpuDebug[debug].avg = 0 
            }
            Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
            Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
            Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
            //

            // random move
            if( 1==1 ){
                if( !creep.memory.rand_pos_x ) {
                    creep.memory.rand_pos_x = creep.pos.x
                    creep.memory.rand_pos_y = creep.pos.y
                    creep.memory.rand_cnt = 0
                }
                else if( creep.memory.rand_pos_x == creep.pos.x && creep.memory.rand_pos_y == creep.pos.y ) {
                    creep.memory.rand_cnt = creep.memory.rand_cnt + 1
                }
                else if( creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49 ) {
                    creep.memory.rand_cnt = creep.memory.rand_cnt + 1
                }
                else {
                    creep.memory.rand_cnt = 0
                    creep.memory.rand_pos_x = creep.pos.x
                    creep.memory.rand_pos_y = creep.pos.y
                }

                if( creep.memory.rand_cnt >= 11 ){
                    var xx = Math.floor(Math.random() * 3 - 1 ) + creep.pos.x
                    var yy = Math.floor(Math.random() * 3 - 1 ) + creep.pos.y
                    if( xx > 49 ){ var xx = 49 }
                    if( xx < 0  ){ var xx = 0  }
                    if( yy > 49 ){ var yy = 49 }
                    if( yy < 0  ){ var yy = 0  }
                    creep.moveTo(new RoomPosition(xx, yy, creep.pos.roomName), {range: 0 })
                }
            }

            // debug
            var debug = 'debug12'
            var cpu_creep = Game.cpu.getUsed() - cpu_debug
            var cpu_debug = Game.cpu.getUsed()
            if( !Memory.stats.cpuDebug[debug] ){
                Memory.stats.cpuDebug[debug] = {}
                Memory.stats.cpuDebug[debug].cnt = 0
                Memory.stats.cpuDebug[debug].cpu = 0 
                Memory.stats.cpuDebug[debug].avg = 0 
            }
            Memory.stats.cpuDebug[debug].cnt = Memory.stats.cpuDebug[debug].cnt + 1
            Memory.stats.cpuDebug[debug].cpu = Memory.stats.cpuDebug[debug].cpu + cpu_creep
            Memory.stats.cpuDebug[debug].avg = Memory.stats.cpuDebug[debug].cpu / Memory.stats.cpuDebug[debug].cnt
            //
        }
        creep.memory.bucket_dontmove = Game.time
    }
};

module.exports = outpostHauler;
