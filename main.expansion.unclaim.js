
var expansionUnclaim= {

    run: function(  ) {

        for(var name in Game.rooms) {
            rm = name;

            if( Game.rooms[rm].controller && Game.rooms[rm].controller.my ) {

                var unclaim = 0
             
                if ( Memory.expansion.task.timer == 0 ) {

                    var my_spawns = Game.rooms[rm].find( FIND_MY_SPAWNS, { filter: object => object.isActive() == true } );

                    // unclaim
                    if( my_spawns.length == 0  ){
                        if( _.filter(Game.creeps, (creep) => creep.pos.roomName == rm  ).length == 0 ){
                            var unclaim = 1
                        }
                    }
                }
                //
            }

            // unclaim trick
            if( unclaim == 1 ){
                Game.rooms[rm].controller.unclaim();

                if( Memory.expansion && !Memory.expansion.decrease_priority ){
                    Memory.expansion.decrease_priority = []
                }

                if( Memory.expansion.decrease_priority ){
                    var found = 0
                    for ( var j = 0 ; j < Memory.expansion.decrease_priority.length; j++){
                        if( Memory.expansion.decrease_priority[j].rm == rm ){
                            var found = 1
                            Memory.expansion.decrease_priority[j].modifier = Memory.expansion.decrease_priority[j].modifier + 30
                            break;
                        }
                    }

                    if( found == 0 ){
                        var cnt = Memory.expansion.decrease_priority.length
                        Memory.expansion.decrease_priority[cnt] = {}
                        Memory.expansion.decrease_priority[cnt].rm = rm
                        Memory.expansion.decrease_priority[cnt].modifier = 35
                    }
                }
            }
            //
            
        }
    }
};

module.exports = expansionUnclaim;
