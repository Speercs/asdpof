var initialFlag0   = require('main.base.initialFlag0')

var expansionIntel= {

    run: function( rm ) {

        // look for room on map
        var scout = 0
        if( Memory.expansion ){
            for ( var i = 0 ; i < Memory.expansion.map.length ; i++){
                if( Memory.expansion.map[i].rm_tgt == rm  ){
                    var scout = 1
                    break;
                }
            }
        }

        // scout
        if( scout == 1 && Memory.expansion.map[i].roomDistance < 999 ){

            Memory.expansion.map[i].scouted = 1

            // sources
            if( Memory.expansion.map[i].sources = -1 ){
                Memory.expansion.map[i].sources   = Game.rooms[rm].find(FIND_SOURCES).length
            }

            if( Memory.expansion.map[i].sources == 2 ){

                // Center and Lab stamps
                if( !Memory.expansion.map[i].distace_base_controller || !Memory.expansion.map[i].distace_base_h1_h2 ){
                    var rm_tgt = Memory.expansion.map[i].rm_tgt

                    var base_xx = 0
                    var base_yy = 0
                    var h1_xx = 0
                    var h1_yy = 0
                    var h2_xx = 0
                    var h2_yy = 0         

                    initialFlag0.run(rm_tgt)

                    // base
                    if( Game.rooms[rm].memory.base_x && Game.rooms[rm].memory.base_y ){
                        var base_xx = Game.rooms[rm].memory.base_x
                        var base_yy = Game.rooms[rm].memory.base_y
                    }
                    // h1
                    if( Game.rooms[rm].memory.h1_x && Game.rooms[rm].memory.h1_y ){
                        var h1_xx = Game.rooms[rm].memory.h1_x
                        var h1_yy = Game.rooms[rm].memory.h1_y
                    }
                    // h2
                    if( Game.rooms[rm].memory.h2_x && Game.rooms[rm].memory.h2_y ){
                        var h2_xx = Game.rooms[rm].memory.h2_x
                        var h2_yy = Game.rooms[rm].memory.h2_y
                    }                  
                    //

                    if( base_xx != 0 && base_yy != 0 && h1_xx != 0 && h1_yy != 0 && h2_xx != 0 && h2_yy != 0 ){

                        var base_pos = new RoomPosition(base_xx, base_yy, rm_tgt)
                        var h1_pos  = new RoomPosition(h1_xx, h1_yy, rm_tgt)
                        var h2_pos  = new RoomPosition(h2_xx, h2_yy, rm_tgt)
                        var cont_pos = Game.rooms[rm_tgt].controller.pos

                        Memory.expansion.map[i].distace_base_controller = PathFinder.search(base_pos, [{pos:cont_pos, range:1}], {maxRooms: 1, plainCost: 49, swampCost: 50} ).path.length
                        
                        var distace_base_h1        = PathFinder.search(base_pos, [{pos:h1_pos , range:1}], {maxRooms: 1, plainCost: 49, swampCost: 50} ).path.length
                        var distace_base_h2        = PathFinder.search(base_pos, [{pos:h2_pos , range:1}], {maxRooms: 1, plainCost: 49, swampCost: 50} ).path.length
                        
                        Memory.expansion.map[i].distace_base_h1_h2 = ( distace_base_h1 + distace_base_h2 ) / 2
                    }
                }
                //

                // minerals
                if( Memory.expansion.map[i].mineral == -1  ){
                    Memory.expansion.map[i].mineral = Game.rooms[rm].find(FIND_MINERALS)[0].mineralType
                }
                //

                // wall
                if( Memory.expansion.map[i].wall_ratio == -1  ){
                    var cnt_wall = 0
                    var cnt_tot = 0

                    var terrain = Game.rooms[rm].getTerrain()

                    for (let y = 2; y <= 47; y++) {
                        for (let x = 2; x <= 47; x++) {
                            if( terrain.get(x,y) == 1 ){

                                var cnt_wall = cnt_wall + 1

                            }
                            var cnt_tot  = cnt_tot  + 1
                        }
                    }

                    Memory.expansion.map[i].wall_ratio= cnt_wall / cnt_tot

                    if( Memory.expansion.map[i].wall_ratio >= 0.64 ){
                        Memory.expansion.map[i].roomDistance = 800
                    }
                }
                //

                // room available
                if( ( !Game.rooms[rm].controller.owner || ( Game.rooms[rm].controller.owner && Game.rooms[rm].controller.owner == 'asdpof' ) ) && 
                    ( !Game.rooms[rm].controller.reservation || ( Game.rooms[rm].controller.reservation && Game.rooms[rm].controller.reservation.username == 'asdpof' ) ) ){
                    Memory.expansion.map[i].available = 1
                }
                else{
                    Memory.expansion.map[i].available = 0
                }

            }
            else{
                // delete if it is not a 2 source room
                Memory.expansion.map.splice(i,1)
            }

            // remove from list if could not set base limits
            if( base_xx == 0 || base_yy == 0 || h1_xx == 0 || h1_yy == 0 || h2_xx == 0 || h2_yy == 0 ){
                // Memory.expansion.map.splice(i,1)
            }

            Memory.expansion.map = _.sortBy( Memory.expansion.map, 'roomDistance')

        }
        //

    }
};

module.exports = expansionIntel;
