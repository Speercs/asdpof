var remotesMapper= {

    run: function( rm ) {

        // check for 1st, 2nd, 3rd and 4th level rooms
        if( !Game.rooms[rm].memory.remotes  ) {

            var candidates  = [  ]
            var candidates1 = [ rm ]

            for ( var j = 0 ; j <= 4 ; j++){

                var candidates2 = _.difference( candidates1, candidates )
                var candidates  = _.union( candidates1, candidates )

                var candidates1 = []

                for ( var i = 0 ; i < candidates2.length ; i++){

                    var candidates3 = _.values( Game.map.describeExits( candidates2[i] ) )

                    // remove from the list if it is a sk or center room
                    for ( var ii = 0 ; ii < candidates3.length ; ii++){

                        var rm_sct = candidates3[ii]

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
                            candidates3.splice(ii,1)
                            if (ii > 0) { ii = ii - 1 }
                        }
                        // else if (  ( lat_coord % 10 == 0 ) &&
                        //            ( lon_coord % 10 == 0 ) ){
                        //     var rm_type = 'highway'
                        //     candidates3.splice(ii,1)
                        //     if (ii > 0) { ii = ii - 1 }
                        // }

                    }
                    //

                    var candidates1 = _.union( candidates1, candidates3 )

                }
            }

            Game.rooms[rm].memory.remotes = []

            for ( var i = 0 ; i < candidates.length ; i++){

                if( candidates[i] != rm ){

                    var cnt = Game.rooms[rm].memory.remotes.length

                    Game.rooms[rm].memory.remotes[cnt]           = {}
                    Game.rooms[rm].memory.remotes[cnt].rm        = candidates[i]
                    Game.rooms[rm].memory.remotes[cnt].source    = 0
                    Game.rooms[rm].memory.remotes[cnt].distance  = 1000
                    
                    Game.rooms[rm].memory.remotes[cnt+1]           = {}
                    Game.rooms[rm].memory.remotes[cnt+1].rm        = candidates[i]
                    Game.rooms[rm].memory.remotes[cnt+1].source    = 1
                    Game.rooms[rm].memory.remotes[cnt+1].distance  = 1000
                }
            }

            Game.rooms[rm].memory.remotes = _.sortBy( Game.rooms[rm].memory.remotes, 'distance')
        }
        //

    }
};

module.exports = remotesMapper;