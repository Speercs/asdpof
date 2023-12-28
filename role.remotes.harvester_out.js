const Pathing      = require('pathing');
var remotesIntel = require('main.remotes.mapper.intel')
var miliarIntel  = require('main.militar.intel')

var roleRemoteHarvester_out = {

    run: function(creep) {

        var prior  = 5
        var colour = '#00ff00'
     
        // suicide
        if( creep.hits < creep.hitsMax && 
            creep.pos.roomName != creep.memory.birth &&
            creep.hits < creep.hitsMax * 0.5 ){
            creep.suicide()
        }

        // reclaculate time to move to source
        if( !creep.memory.arrived ){
            if( !creep.memory.arrived_temp ){
                creep.memory.arrived_temp = 0
            }
            if( creep.fatigue == 0 ){
                creep.memory.arrived_temp = creep.memory.arrived_temp + 1
            }
        }

        // scout
        // force intel half live and near dead
        if ( (creep.ticksToLive == 1   ||  creep.ticksToLive % 250 == 0 ) && creep.pos.roomName == creep.memory.birth_target ){
            remotesIntel.run(creep.memory.birth, creep.memory.birth_target)
        }

        // scout for enemies
        if ( Game.time % 3 == 0  ){
            miliarIntel.run( creep.pos.roomName )
        }

        // check for enemies on the room
        var check_freq = 3
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
        }        
        // move to target room
        else if( !creep.memory.phase || creep.memory.phase == 0) {            
            
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
            creep.moveTo(target, {range: rng, priority: prior ,maxRooms: 1, maxOps: 5500, plainCost: 4,swampCost: 20, containerCost: 8, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

            if ( creep.pos.roomName == rm_tgt ) {

                if( creep.getActiveBodyparts(WORK) >= 6 ){
                    creep.memory.phase = 1 
                }
                else{
                    creep.memory.phase = 4 
                }    
                
                creep.moveTo( obj, {range: 1, maxRooms: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            }
        }
        //
        //
        // building container
        else if ( creep.memory.phase == 1 ) {

            if(!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
                creep.memory.harvesting = true;
            }
            if( creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
                creep.memory.harvesting = false;
            }


            // find container
            if ( !creep.memory.container || creep.memory.container == null ){

                var source0 = Game.getObjectById( creep.memory.birth_info_2 )

                if( source0 ){
                    var container = source0.pos.findInRange( FIND_STRUCTURES ,1 , {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER)}} )
                }
                else {
                    creep.memory.phase = 0
                }

                if( container && container.length >= 1 ){
                     creep.memory.container = container[0].id
                }
            }

            // harvest to ground if it is a small creep
            if ( ( !creep.memory.container || creep.memory.container == null ) && creep.getActiveBodyparts(WORK) <= 5 ){

                creep.memory.container = 'ground'

            }

            //
            // place build spots for container 
            if( ( !creep.memory.container || creep.memory.container == null ) &&
                ( !creep.memory.build_id  || creep.memory.build_id == null ) ) {

                // place container
                if ( Game.getObjectById( creep.memory.birth_info_2 ) ) {

                    var start = Game.getObjectById( creep.memory.birth_info_2 ).pos
                    var rm = start.roomName

                    if ( Game.rooms[creep.memory.birth].storage ){
                        var end   = Game.rooms[creep.memory.birth].storage.pos
                    }
                    else {
                        var end   = Game.getObjectById( Game.rooms[creep.memory.birth].memory.intel.spawn[0].id ).pos
                    }
                  
                    // find route
                    var dist = Game.map.findRoute(start.roomName, end.roomName, {
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
                                    // else if( _.intersection( [ roomName ], Object.keys(Memory.hostile)).length >= 1 ) {    // avoid this room
                                    //     return Infinity;
                                    // }
                                    else{
                                        return 1;
                                    }                                                                                        
                                }});


                    var allowedRooms = _.union(_.map(dist,'room'),[creep.pos.roomName,start.roomName, end.roomName])
                    var allowedRooms_obj = {}

                    allowedRooms.forEach(value => {allowedRooms_obj[value] = true ;});
                     
                    var path_to_road = PathFinder.search(start, [{pos: end , range:1}], {plainCost: 3,swampCost: 4,

                                    roomCallback: function(roomName) {
                                    
                                        if (allowedRooms_obj[roomName] === undefined) {
                                            return false;
                                        }
                                        else{                                    

                                            let room = Game.rooms[roomName];
                                            // In this example `room` will always exist, but since
                                            // PathFinder supports searches which span multiple rooms
                                            // you should be careful!
                                            if (!room) return;
                                            let costs = new PathFinder.CostMatrix;

                                            room.find(FIND_STRUCTURES).forEach(function(struct) {
                                            if (struct.structureType === STRUCTURE_ROAD || struct.structureType == STRUCTURE_CONTAINER ) {
                                                // Favor roads over plain tiles
                                                costs.set(struct.pos.x, struct.pos.y, 1);

                                            } else if ( struct.structureType !== STRUCTURE_CONTAINER &&
                                                            (struct.structureType !== STRUCTURE_RAMPART ||
                                                            !struct.my)) {
                                                // Can't walk through non-walkable buildings
                                                costs.set(struct.pos.x, struct.pos.y, 0xff);
                                            }
                                            });

                                            return costs;
                                        }
                                      },
                                    }
                                ).path

                    if( Game.rooms[rm] && path_to_road && path_to_road.length >= 1  ){

                        var xx = path_to_road[0].x
                        var yy = path_to_road[0].y

                        Game.rooms[rm].createConstructionSite(xx, yy, STRUCTURE_CONTAINER)

                    }
                }
            }          

            //bypass road building
            if( Game.rooms[creep.memory.birth].controller.level < 4 ){
                creep.memory.road_done = 1
            }

            // place roads
            if( creep.memory.container && 
                ( !creep.memory.road_done || creep.memory.road_done == 0 ) ){   
                    
                creep.memory.road_done = 0

                var rm = creep.memory.birth_target
                var start = Game.getObjectById( creep.memory.container )

                if( start ){
                    var start = start.pos
                }
                else{
                    delete creep.memory.container
                }

                if ( Game.rooms[creep.memory.birth].storage ){
                    var end   = Game.rooms[creep.memory.birth].storage.pos
                }
                else {
                    var end   = Game.getObjectById( Game.rooms[creep.memory.birth].memory.intel.spawn[0].id ).pos
                }

                // find route
                var dist = Game.map.findRoute(start.roomName, end.roomName, {
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
                                // else if( _.intersection( [ roomName ], Object.keys(Memory.hostile)).length >= 1 ) {    // avoid this room
                                //     return Infinity;
                                // }
                                else{
                                    return 1;
                                }                                                                                        
                            }});


                var allowedRooms = _.union(_.map(dist,'room'),[creep.pos.roomName,start.roomName, end.roomName])
                var allowedRooms_obj = {}

                allowedRooms.forEach(value => {allowedRooms_obj[value] = true ;});

                var path_to_road = PathFinder.search(start, [{pos: end , range:5}], {plainCost: 2,swampCost: 3,

                                roomCallback: function(roomName) {

                                    if (allowedRooms_obj[roomName] === undefined) {
                                        return false;
                                    }
                                    else{ 

                                        let room = Game.rooms[roomName];
                                        // In this example `room` will always exist, but since
                                        // PathFinder supports searches which span multiple rooms
                                        // you should be careful!
                                        if (!room) return;
                                        let costs = new PathFinder.CostMatrix;

                                        room.find(FIND_STRUCTURES).forEach(function(struct) {
                                        if (struct.structureType === STRUCTURE_CONTAINER  ) {
                                            costs.set(struct.pos.x, struct.pos.y, 10);

                                        }
                                        else if (struct.structureType === STRUCTURE_ROAD || (struct.structureType === STRUCTURE_RAMPART && struct.my)  ) {
                                            costs.set(struct.pos.x, struct.pos.y, 1);

                                        }
                                        else if ( (struct.structureType !== STRUCTURE_RAMPART || !struct.my) ) {
                                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                                        }
                                        });

                                        if( room.controller ){
                                            var controller_pos = room.controller.pos
                                            for ( var xxx = -1 ; xxx < 1 ; xxx++){
                                                for ( var yyy = -1 ; yyy < 1 ; yyy++){
                                                    if( costs.get(controller_pos+xxx, controller_pos+yyy) >= 255 ){
                                                        //
                                                    }
                                                    else{
                                                        costs.set(controller_pos+xxx, controller_pos+yyy, 7)
                                                    }
                                                }
                                            }
                                        }

                                        return costs;
                                    }
                                  },
                                }

                            ).path

                for ( var k = 0 ; k < path_to_road.length ; k++){

                    var build_cnt = 0;

                    var xx = path_to_road[k].x
                    var yy = path_to_road[k].y
                    var rr = path_to_road[k].roomName

                    if( Game.rooms[rr] ){

                        if( Game.rooms[rr].lookForAt(LOOK_CONSTRUCTION_SITES,xx,yy).length >= 1 ){
                            var build_cnt = build_cnt + 1
                        }
                        else{
                            var action = Game.rooms[rr].createConstructionSite(xx, yy, STRUCTURE_ROAD)

                            if( action == 0 ){
                                var build_cnt = build_cnt + 1
                            }
                        } 
                    }

                    if( build_cnt >= 7 ){
                        break;
                    }

                    if( k == path_to_road.length - 1 ){
                        creep.memory.road_done = 1
                    }
                }
            }
            //

            // builder role
            if( !creep.memory.build_id || creep.memory.build_id == null ){

                var source = Game.getObjectById( creep.memory.birth_info_2 )

                if( source && creep.pos.findInRange([source],5).length >= 1 ){
                    var const_site = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3)[0]
                }
                
                creep.moveTo( source, {range: 1, maxRooms: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
              
            }
            else{
                var const_flag = 1
            }

            if ( const_site || const_flag == 1  ){

                // one harvest -- one build
                if( ( creep.memory.harvesting && creep.store.getUsedCapacity() >= creep.getActiveBodyparts(WORK) * 5  ) || creep.store.getFreeCapacity() == 0 ){
                    creep.memory.harvesting = false;
                    creep.say(2)
                }
                else{
                    creep.memory.harvesting = true;
                    creep.say(3)
                }

                // harvest
                if( creep.memory.harvesting ){

                    var source0 = Game.getObjectById( creep.memory.birth_info_2  )
                    var action = creep.harvest(source0)

                    if( action == OK) {
                        // do nothing
                        var dropped = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {filter: (reso) =>  {return (  reso.resourceType == 'energy' ) } })
                        if( dropped && dropped[0] ){
                            if( creep.pickup(dropped[0]) == OK ){
                                creep.memory.harvesting = false;
                            }
                        }
                    }
                    else if( action == ERR_NOT_IN_RANGE) {
                        creep.moveTo( source0, {range: 1, maxRooms: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                }
                // build
                else {

                    if( !creep.memory.build_id || creep.memory.build_id == null ){

                        var construction_obj =creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)

                        if( construction_obj ){
                            creep.memory.build_id = construction_obj.id
                            creep.memory.build_xx = construction_obj.pos.x
                            creep.memory.build_yy = construction_obj.pos.y
                        }

                    }
                    else {

                        var construction_obj = Game.getObjectById( creep.memory.build_id  )
                        var action = creep.build(construction_obj)

                        if( action == OK) {
                            // do nothing
                        }
                        else if( action == ERR_NOT_IN_RANGE) {
                            creep.moveTo(construction_obj, {range: 3, maxRooms: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                        else {
                            creep.memory.build_id = null
                            creep.memory.build_xx = null
                            creep.memory.build_yy = null
                        }
                    }
                }
            }


            //
            // change fase
            if ( ( !creep.memory.build_id || creep.memory.build_id == null ) && creep.memory.container  ){
                creep.memory.phase = 3
            }


        }
        // go back to main room for heal
        else if ( creep.memory.phase == 2 ){
   
        }
        // static harvester - container
        else if ( creep.memory.phase == 3 ){

            if( creep.pos.roomName != rm_tgt ){ creep.memory.phase = 0 }

            // store container coordinates
            if( !creep.memory.container_x  ){

                var container_obj = Game.getObjectById( creep.memory.container )

                if( container_obj ){
                    creep.memory.container_x = container_obj.pos.x
                    creep.memory.container_y = container_obj.pos.y
                }
                else {

                    creep.memory.phase = 4

                    creep.memory.container = null
                    creep.memory.container_x = null
                    creep.memory.container_y = null
                    creep.memory.phase = null
                }
            }
            // move to container
            else {

                var xx = creep.memory.container_x
                var yy = creep.memory.container_y

                if ( creep.pos.x == xx && creep.pos.y == yy ) {
                    var ready = 1

                    if( !creep.memory.arrived ){

                        var dist_update = Math.min( creep.memory.arrived_temp, 150 ) 
                        
                        creep.memory.arrived = dist_update 

                        delete creep.memory.arrived_temp       

                        var rm = creep.memory.birth
                        var rm_tgt = creep.memory.birth_target   
                        var source =  creep.memory.birth_info_2   
  
                        for ( var i = 0 ; i < Game.rooms[rm].memory.remotes.length ; i++){

                            if( Game.rooms[rm].memory.remotes[i].rm == rm_tgt &&
                                Game.rooms[rm].memory.remotes[i].sources_id == source ){

                                Game.rooms[rm].memory.remotes[i].distance = Math.round( ( Game.rooms[rm].memory.remotes[i].distance * 0.95 + dist_update * 0.05 ) * 10 ) / 10
                             
                                break;
                            }
                        }

                        Game.rooms[rm].memory.remotes = _.sortBy( Game.rooms[rm].memory.remotes, 'distance')
                    }
                }
                else {
                    var container_obj = Game.getObjectById( creep.memory.container )
                    if( container_obj ){
                        creep.moveTo(container_obj, {range: 0, maxRooms: 1, ignoreContainers: true, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                    else{
                        creep.memory.phase = 0
                    }
                }
            }

            // static harvester
            // harvest
            if( ready == 1 ){

                //get droppped sources
                var drop = 0

                if( !creep.memory.drop_check ){
                    creep.memory.drop_check = 1
                }
                else if( creep.memory.drop_check >= 25) {                    

                    var drop_source = creep.pos.findInRange( FIND_DROPPED_RESOURCES , 1 )

                    if ( drop_source[0] && 
                        drop_source[0].resourceType == 'energy' && 
                        Game.getObjectById( creep.memory.container ) &&
                        Game.getObjectById( creep.memory.container ).store.getFreeCapacity() >= 50 ) {

                        var drop = 1

                        if( creep.store.getUsedCapacity() > creep.store.getFreeCapacity() ){
                            creep.drop('energy')
                        }
                        else{
                            creep.pickup( drop_source[0] )
                        }
                    }
                    else{
                        creep.memory.drop_check = 1
                    }
                }
                //

                if( drop == 0 ){

                    creep.memory.drop_check = creep.memory.drop_check + 1
                
                    // harvesting routine
                    if( creep.ticksToLive % 6 == 0 &&
                        creep.getActiveBodyparts(WORK) >= 6 && creep.store.getUsedCapacity() >= creep.getActiveBodyparts(WORK) &&
                        Game.getObjectById( creep.memory.container ) && Game.getObjectById( creep.memory.container ).hits < 250000 - creep.getActiveBodyparts(WORK) * 100 ){

                        // repair container
                        var container_obj = Game.getObjectById( creep.memory.container )
                        creep.repair( container_obj )
                    }
                    else{
                        if( Game.cpu.bucket > 7000 || 
                            ( creep.store.getFreeCapacity() >= creep.getActiveBodyparts(WORK) * 2 ) ||
                            ( Game.getObjectById( creep.memory.container ) && Game.getObjectById( creep.memory.container ).store.getFreeCapacity() >= creep.getActiveBodyparts(WORK) * 2 ) ){
                            // static harvest
                            var source0 = Game.getObjectById( creep.memory.birth_info_2  )
                            var action = creep.harvest(source0)

                            if( action == OK) {
                                // if( creep.store.getUsedCapacity() >= creep.store.getCapacity() - creep.getActiveBodyparts(WORK) * 2 ) {
                                //     creep.drop('energy')
                                // }
                            }
                            else if( action == ERR_NOT_IN_RANGE) {
                                creep.say('?????')
                            }
                            else if( action == ERR_NOT_ENOUGH_RESOURCES) {
                                
                            }
                        }
                    }
                    //
                }
                //
            }
            // drop
            else {
                if ( creep.pos.x == xx && creep.pos.y == yy ) {
                    creep.drop('energy')
                }
            }
        }
        // static harvester - ground
        else if ( creep.memory.phase == 4 ){

            if( creep.pos.roomName != rm_tgt ){ creep.memory.phase = 0 }

            var obj = Game.getObjectById( creep.memory.birth_info_2 )

            // move to position
            if( obj ) {

                var range = creep.pos.getRangeTo(obj);

                if ( range > 1 ) {
                    creep.moveTo(obj, {range: 1, priority: prior, maxRooms: 1 , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
                else{
                    var ready = 1

                    if( !creep.memory.arrived ){

                        var dist_update = Math.min( creep.memory.arrived_temp, 150 ) 
                        
                        creep.memory.arrived = dist_update 

                        delete creep.memory.arrived_temp       

                        var rm = creep.memory.birth
                        var rm_tgt = creep.memory.birth_target   
                        var source =  creep.memory.birth_info_2   
  
                        for ( var i = 0 ; i < Game.rooms[rm].memory.remotes.length ; i++){

                            if( Game.rooms[rm].memory.remotes[i].rm == rm_tgt &&
                                Game.rooms[rm].memory.remotes[i].sources_id == source ){

                                Game.rooms[rm].memory.remotes[i].distance = Math.round( ( Game.rooms[rm].memory.remotes[i].distance * 0.95 + dist_update * 0.05 ) * 10 ) / 10
                             
                                break;
                            }
                        }

                        Game.rooms[rm].memory.remotes = _.sortBy( Game.rooms[rm].memory.remotes, 'distance')
                    }
                }

                // harvesting
                if( ready == 1 ) {

                    // harvest source
                    var harv = creep.harvest( obj )

                    if( creep.ticksToLive % 15 == 0 ){
                        var resource = creep.pos.lookFor(LOOK_RESOURCES);

                        if( resource && resource[0] && resource[0].resourceType == 'energy' ){
                            creep.memory.resource = resource[0].id
                        }
                    }
                }
            }            
        }
        // 

    }
};

module.exports = roleRemoteHarvester_out;
