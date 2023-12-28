
var expansionMapper= {

    run: function(  ) {

        if( !Memory.expansion ){
            Memory.expansion            = {}
            Memory.expansion.map        = []
            Memory.expansion.task       = {}
            Memory.expansion.task.timer = 0
        }

        for(var name in Game.rooms) {
            rm = name;
            if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my ) {

                // check if room is already on the map
                var ok = 0
                for ( var i = 0 ; i < Memory.expansion.map.length ; i++){
                    if( Memory.expansion.map[i].rm == rm ){
                        var ok = 1
                        break;
                    }
                }


                // not on the map, mapping
                if( ok == 0 ){

                    // check for 1st, 2nd, 3rd ... 10th level rooms

                    var candidates  = [  ]
                    var candidates1 = [ rm ]

                    for ( var j = 0 ; j <= 10 ; j++){

                        var candidates2 = _.difference( candidates1, candidates )
                        var candidates  = _.union( candidates1, candidates )

                        var candidates1 = []

                        for ( var i = 0 ; i < candidates2.length ; i++){

                            var is_center = 0

                            // check if it is center room
                            var rm_sct = candidates2[i]

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

                            var lat_coord = parseInt(split2[1])
                            var lon_coord = parseInt(split2[0])

                            if (  ( lat_coord % 10 == 4 || lat_coord % 10 == 5 || lat_coord % 10 == 6 ) &&
                                  ( lon_coord % 10 == 4 || lon_coord % 10 == 5 || lon_coord % 10 == 6 ) ){

                                var is_center = 1
                            }

                            if( is_center == 0  ){
                                var candidates3 = _.values( Game.map.describeExits( candidates2[i] ) )
                                var candidates1 = _.union( candidates1, candidates3 )
                            }
                        }

                        // add to memory
                        if( j >=3 ){
                            for ( var i = 0 ; i < candidates2.length ; i++){

                                var dist = j
                                for(var name2 in Game.rooms) {
                                    var rm2 = name2;
                                    if ( Game.rooms[rm2].controller && Game.rooms[rm2].controller.my ) {
                                        var dist = Math.min( dist, Game.map.getRoomLinearDistance( candidates2[i], rm2 ) )
                                    }
                                }

                                if( dist >= 3){

                                    var cnt = Memory.expansion.map.length

                                    Memory.expansion.map[cnt]               = {}
                                    Memory.expansion.map[cnt].rm            = rm
                                    Memory.expansion.map[cnt].rm_tgt        = candidates2[i]
                                    Memory.expansion.map[cnt].roomDistance  = Math.abs(dist - 6 ) // optimun range 6
                                    Memory.expansion.map[cnt].sources       = -1
                                    Memory.expansion.map[cnt].mineral       = -1
                                    Memory.expansion.map[cnt].wall_ratio    = -1

                                }
                            }
                        }
                    }
                }
            }
        }

        Memory.expansion.map = _.sortBy( Memory.expansion.map, 'roomDistance')
        //

        // clean room map
        for ( var i = 0 ; i < Memory.expansion.map.length ; i++){

            var rm = Memory.expansion.map[i].rm

            if( Game.rooms[rm] && Game.rooms[rm].controller && Game.rooms[rm].controller.my ){
                // ok
            }
            else{
                Memory.expansion.map.splice(i,1)
                if (i > 0) { i = i - 1 }
            }
        }
        //

    }
};

module.exports = expansionMapper;
