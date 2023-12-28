// observer

var MainObserverIntel = require('main.observer.intel')
var remotesIntel      = require('main.remotes.mapper.intel')
var expansionIntel    = require('main.expansion.intel')

var mainObserver= {

    run: function( rm ) {

        // map connected rooms
        if( 1 == 1  ){

            // check for 10th level rooms
            if( !global.rooms[rm].connectedRooms && Game.cpu.bucket > 2500 ) {

                global.rooms[rm].connectedRooms = {}

                var candidates  = [  ]
                var candidates1 = [ rm ]

                for ( var j = 0 ; j <= 11 ; j++){

                    var candidates2 = _.difference( candidates1, candidates )
                    var candidates  = _.union( candidates1, candidates )

                    var candidates1 = []

                    for ( var i = 0 ; i < candidates2.length ; i++){

                        var candidates3 = _.values( Game.map.describeExits( candidates2[i] ) )
                        var candidates1 = _.union( candidates1, candidates3 )

                    }

                    // add to memory
                    for ( var i = 0 ; i < candidates2.length ; i++){

                        global.rooms[rm].connectedRooms[ candidates2[i] ]               = {}
                        global.rooms[rm].connectedRooms[ candidates2[i] ].roomDistance  = j
                    }

                }
            }
        }
        //

        // scout rooms on the list
        if( global.rooms[rm].connectedRooms ){

            if( !Game.rooms[rm].memory.scouting_tick ){
                Game.rooms[rm].memory.scouting_tick = Game.time
                Game.rooms[rm].memory.scouting      = 0
            } 

            if( ( ( Game.time - Game.rooms[rm].memory.scouting_tick ) > 1500 || Game.rooms[rm].memory.scouting > 0 ) && global.rooms[rm].connectedRooms && Game.cpu.bucket > 2500 ){

                // log the starting of the process
                if( Game.rooms[rm].memory.scouting == 0 ){
                    Game.rooms[rm].memory.scouting_tick = Game.time
                    Game.rooms[rm].memory.scouting      = 1
                }

                // scouting
                if( Game.rooms[rm].memory.scouting >= 1 ){
 
                    // 1st room is the actual room, so it is skipped here (by not subtracting 1)
                    var cnt = Game.rooms[rm].memory.scouting

                    // room to gather intel (next round)
                    if( Object.keys( global.rooms[rm].connectedRooms )[cnt-1] ){

                        var rm_tgt = Object.keys( global.rooms[rm].connectedRooms )[cnt-1]

                        // validate vision
                        if( Game.rooms[rm_tgt] ){

                            var roomDistance = global.rooms[rm].connectedRooms[rm_tgt].roomDistance

                            MainObserverIntel.run( rm, rm_tgt, roomDistance )

                            remotesIntel.run(rm, rm_tgt)

                            // scout for expasion
                            if( Memory.oneTimer.expansion == 1 ){
                                expansionIntel.run(rm_tgt)
                            }

                        }
                    }

                    // round for observer to look (this turn)
                    if( Object.keys( global.rooms[rm].connectedRooms )[cnt] ){

                        var rm_tgt = Object.keys( global.rooms[rm].connectedRooms )[cnt]
                        var rm_sts = Game.map.getRoomStatus(rm_tgt).status

                        if( rm_sts == 'normal' ){
                            Game.map.visual.rect(new RoomPosition(0, 0, rm_tgt), 49, 49,{ fill: '#FFFF00', stroke: '#FFFF00', opacity:0.1 });

                            // need to add oberver to the room intel list
                            var obj = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_OBSERVER  ) } } )[0]

                            if( obj ){
                                delete Memory.avoidRooms_observer[ rm_tgt ]
                                var act = obj.observeRoom(rm_tgt)
                            }
                            else{
                                console.log('No observer on room: ', rm )
                            }
                        }
                        // need to add rooms with different status to the avoid_matrix
                        else{
                            // remove from memory to stop outpost spawning
                            delete Memory.rooms[ rm_tgt ]

                            // add to avoid movement list
                            Memory.avoidRooms_observer[ rm_tgt ] = {}
                        }


                        Game.rooms[rm].memory.scouting ++
                    }


                    // stop the process
                    if( cnt >= Object.keys( global.rooms[rm].connectedRooms ).length  ){
                        Game.rooms[rm].memory.scouting = 0
                    }
                }
            }
        }
    }
};

module.exports = mainObserver;
