const Pathing  = require('pathing');
var FunctionManualPath2 = require('function.manual_path2')
var FunctionStaticCount = require('function.static_count')
var miliarIntel = require('main.militar.intel')

var roleReserver = {

    run: function(creep) {
        
        var prior  = 16
        var colour = '#00ff00'
        
        Game.map.visual.circle(creep.pos, {fill: colour, radius: 1, stroke: colour, opacity: 0.9 });

        // scout for enemies
        if ( Game.time % 6 == 0  ){
            miliarIntel.run( creep.pos.roomName )
        }

        // check for enemies on the room
        var check_freq = 6
        var rm_tgt  = creep.memory.birth_target
        var rm  = creep.memory.birth
        var ok = 0

        if( creep.ticksToLive > 75 && Game.time % check_freq == 1 && global.rooms[rm] && global.rooms[rm].remotes && global.rooms[rm].remotes.remotes ){

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
        else if( !creep.memory.phase || creep.memory.phase == 0 ) {
            
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

            if (creep.pos.roomName == creep.memory.birth_target) {
                creep.memory.phase = 1

                var obj = Game.rooms[creep.pos.roomName].controller

                if( obj ){
                    creep.moveTo( obj, {range: 1, maxRooms: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
            }
        }
        //
        // reserve
        else if ( creep.memory.phase == 1 ) {
            
            if( Game.time % 35 == 0 ){
                if( creep.pos.roomName != creep.memory.birth_target){
                    creep.memory.phase = 0
                }
            }

            var controller_obj = Game.rooms[creep.pos.roomName].controller
            var action = creep.reserveController(controller_obj)
            
            if ( action == ERR_NOT_IN_RANGE ) {
                creep.moveTo(controller_obj, {range: 1, maxRooms:1, plainCost: 1,swampCost: 5, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            }
            if ( action == ERR_INVALID_TARGET ) {
                
                if (  controller_obj && controller_obj.reservation && controller_obj.reservation.username != 'asdpof' ){
                    var action = creep.attackController(controller_obj)
                }
            }
        } 
        
        
        // random move
        if( creep.pos.roomName == creep.memory.birth ){
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
            
            if( creep.memory.rand_cnt >= 4 ){
                var rnd = Math.floor((Math.random() * 8) + 1);
                creep.move(rnd)
            }
        }
        
	}
};

module.exports = roleReserver
