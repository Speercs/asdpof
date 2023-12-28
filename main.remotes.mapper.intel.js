var mainRemotesMapperIntel= {

    run: function( rm, rm_tgt) {

        if( Game.rooms[rm] && Game.rooms[rm].memory.remotes && Game.rooms[rm_tgt] ) {

            // search for room
            if( Game.map.getRoomLinearDistance( rm, rm_tgt ) <= 3 ){

                for ( var j = 0 ; j < Game.rooms[rm].memory.remotes.length ; j++){
                    var go = 0
                    if( Game.rooms[rm].memory.remotes[j].rm == rm_tgt ){
                        var go = 1
                        break
                    }
                }
            }
            else{
                // delete room - if it is not on the map
                for ( var j = 0 ; j < Game.rooms[rm].memory.remotes.length ; j++){
                    if( Game.rooms[rm].memory.remotes[j].rm == rm_tgt ){
                        Game.rooms[rm].memory.remotes.splice(j,1)
                        break;
                    }
                }
            }

            if( go == 1 ){

                var obj = _.sortBy( Game.rooms[rm_tgt].find(FIND_SOURCES) ,  function(o) { return  o.id; });
                var obj = _.sortBy(obj, 'id')

                if( obj && obj.length > 0 && obj.length <= 2 ){
                  
                    // for each source
                    for ( var i = 0 ; i < obj.length ; i++){

                        var found = 0

                        for ( var j = 0 ; j < Game.rooms[rm].memory.remotes.length ; j++){

                            if( Game.rooms[rm].memory.remotes[j].rm == rm_tgt &&
                                Game.rooms[rm].memory.remotes[j].source == i ){
                                var found = 1
                                break;
                            }
                        }

                        // found source
                        if( found == 1 && obj && obj[i] ){

                            // not mapped yet
                            if ( Game.rooms[rm].memory.remotes[j].distance == 1000 &&
                                Game.rooms[rm].memory.intel &&
                                Game.rooms[rm].memory.intel.spawn &&
                                Game.rooms[rm].memory.intel.spawn[0] &&
                                Game.rooms[rm].memory.intel.spawn[0].id ){

                                // source ID
                                Game.rooms[rm].memory.remotes[j].sources_id                   = obj[i].id
                                //

                                // source reacheable vicinity
                                const terrain = Game.rooms[rm_tgt].getTerrain();
                                var cnt_vic = 0
                                var xx = obj[i].pos.x
                                var yy = obj[i].pos.y
                                switch(terrain.get(xx-1,yy-1)) { case 0: var cnt_vic = cnt_vic + 1; case 1: break; case 2: var cnt_vic = cnt_vic + 1}
                                switch(terrain.get(xx-1,yy+0)) { case 0: var cnt_vic = cnt_vic + 1; case 1: break; case 2: var cnt_vic = cnt_vic + 1}
                                switch(terrain.get(xx-1,yy+1)) { case 0: var cnt_vic = cnt_vic + 1; case 1: break; case 2: var cnt_vic = cnt_vic + 1}
                                switch(terrain.get(xx+1,yy-1)) { case 0: var cnt_vic = cnt_vic + 1; case 1: break; case 2: var cnt_vic = cnt_vic + 1}
                                switch(terrain.get(xx+1,yy+0)) { case 0: var cnt_vic = cnt_vic + 1; case 1: break; case 2: var cnt_vic = cnt_vic + 1}
                                switch(terrain.get(xx+1,yy+1)) { case 0: var cnt_vic = cnt_vic + 1; case 1: break; case 2: var cnt_vic = cnt_vic + 1}
                                switch(terrain.get(xx+0,yy-1)) { case 0: var cnt_vic = cnt_vic + 1; case 1: break; case 2: var cnt_vic = cnt_vic + 1}
                                switch(terrain.get(xx+0,yy+1)) { case 0: var cnt_vic = cnt_vic + 1; case 1: break; case 2: var cnt_vic = cnt_vic + 1}

                                Game.rooms[rm].memory.remotes[j].sources_vic = cnt_vic
                                //                                

                                // source route 
                                //var route = Game.map.findRoute(rm, rm_tgt)
                                var route = Game.map.findRoute(rm, rm_tgt, {
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
                                                        else{
                                                            return 1;
                                                        }                                                                                        
                                                    }});

                                if( route && route.length >= 1 ){

                                    Game.rooms[rm].memory.remotes[j].route = [] 

                                    for ( var rj = 0 ; rj < route.length ; rj++){
                                        if( route[rj].room != rm &&  route[rj].room != rm_tgt ){
                                            var cnt = Game.rooms[rm].memory.remotes[j].route.length

                                            Game.rooms[rm].memory.remotes[j].route[cnt] = route[rj].room
                                        }
                                    }
                                }
                                //

                                // source distance
                                var rm_tgt_x = obj[i].pos.x
                                var rm_tgt_y = obj[i].pos.y
                                var goal     = new RoomPosition(rm_tgt_x, rm_tgt_y, rm_tgt )

                                var origin   = Game.getObjectById( Game.rooms[rm].memory.intel.spawn[0].id ).pos

                                var path    = PathFinder.search(origin, goal, { 
                                                                                maxOps: 10000, 
                                                                                maxCost: 10000, 
                                                                                maxRooms: 6, 
                                                                                range: 1, 
                                                                                plainCost: 9, 
                                                                                swampCost: 10,
                                                                                roomCallback(roomName) {                                                                                    
                                                                                    if( roomName == rm || roomName == rm_tgt ||
                                                                                        _.intersection( Game.rooms[rm].memory.remotes[j].route, [roomName] ).length >= 1 ){
                                                                                        // ok
                                                                                    }
                                                                                    else{
                                                                                        return false;
                                                                                    }
                                                                                } 
                                                                              })
                                var path_src = path.path
                                var path_length = path_src.length

                                if( path.incomplete ){
                                    Game.rooms[rm].memory.remotes[j].distance = ( route.length + 1 ) * 50 - 25
                                }
                                else {
                                    Game.rooms[rm].memory.remotes[j].distance = path_length                                    
                                }
                                //

                                Game.rooms[rm].memory.remotes = _.sortBy( Game.rooms[rm].memory.remotes, 'distance')
                            }
                            //

                            // intel update
                            if( Game.rooms[rm].memory.remotes[j].distance <= 150 ){  

                                if( Game.rooms[ rm_tgt ].controller ){

                                    // owner
                                    if( Game.rooms[ rm_tgt ].controller.owner ){
                                        Game.rooms[rm].memory.remotes[j].owner = Game.rooms[ rm_tgt ].controller.owner.username
                                    }
                                    else{
                                        Game.rooms[rm].memory.remotes[j].owner = null
                                    }

                                    // reservation
                                    if( Game.rooms[ rm_tgt ].controller.reservation ){
                                        Game.rooms[rm].memory.remotes[j].reservation_user = Game.rooms[ rm_tgt ].controller.reservation.username
                                        Game.rooms[rm].memory.remotes[j].reservation_ticks = Game.rooms[ rm_tgt ].controller.reservation.ticksToEnd

                                        if( Game.rooms[ rm_tgt ].controller.reservation.username == 'Invader' ){
                                            var obj = Game.rooms[ rm_tgt ].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_INVADER_CORE ) } })

                                            if( obj && obj[0] ){
                                                Game.rooms[rm].memory.remotes[j].reservation_core = true
                                            }
                                            else{
                                                Game.rooms[rm].memory.remotes[j].reservation_core = false
                                            }
                                        }
                                        else{
                                            Game.rooms[rm].memory.remotes[j].reservation_core = false
                                        }
                                    }
                                    else{
                                        Game.rooms[rm].memory.remotes[j].reservation_user = null
                                        Game.rooms[rm].memory.remotes[j].reservation_ticks = null  
                                        Game.rooms[rm].memory.remotes[j].reservation_core = false                                      
                                    }
                                }
                                else{
                                    Game.rooms[rm].memory.remotes[j].owner = null
                                    Game.rooms[rm].memory.remotes[j].reservation_user = null
                                    Game.rooms[rm].memory.remotes[j].reservation_ticks = null
                                    Game.rooms[rm].memory.remotes[j].reservation_core = false
                                }
                            }
                            else if( Game.rooms[rm].memory.remotes[j].distance < 1000 ){  
                                Game.rooms[rm].memory.remotes.splice(j,1)
                            }
                        }
                        else if( found == 1 ){
                            Game.rooms[rm].memory.remotes.splice(j,1)
                        }
                        //
                    }
                }
                else{
                    // delete room - if does not has sources
                    for ( var j = 0 ; j < Game.rooms[rm].memory.remotes.length ; j++){
                        if( Game.rooms[rm].memory.remotes[j].rm == rm_tgt ){
                            Game.rooms[rm].memory.remotes.splice(j,1)
                            break;
                        }
                    }
                }
            }
        }
        //
    }
};

module.exports = mainRemotesMapperIntel;