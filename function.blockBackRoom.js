var FunctionBlockBackRoom = {

    run: function(creep) {

        // avoid back and forth move on travel
        if( !creep.memory.avoid_temp ){
            creep.memory.avoid_temp = []
        }
        else if( creep.memory.pos_3_rm && creep.memory.pos_3_rm != creep.pos.roomName ){
            creep.memory.avoid_temp = []
            creep.memory.avoid_temp[0] = creep.memory.pos_3_rm
        }

        // clean
        if( creep.ticksToLive % 200 == 0 ){
            creep.memory.avoid_temp = []
        }
        //

        // safe mode stuff
        if( Game.time % 3 == 0 && Game.rooms[creep.pos.roomName].controller && !Game.rooms[creep.pos.roomName].controller.my ){
            // add room for safe mode avoid list in case
            if( Game.rooms[creep.pos.roomName].controller.safeMode > 0 ){

                if( !Memory.avoidRooms_safemode ){
                    Memory.avoidRooms_safemode = {}
                }

                var listed = 0
                for ( rm in Memory.avoidRooms_safemode.length ){
                    if( rm == creep.pos.roomName ){
                        var listed = 1
                        break;
                    }
                    else if( Game.time > Memory.avoidRooms_safemode[rm].endTick ){
                        delete Memory.avoidRooms_safemode[rm]
                    }
                }

                if( listed == 0 ){
                    Memory.avoidRooms_safemode[creep.pos.roomName] = {}
                    Memory.avoidRooms_safemode[creep.pos.roomName].endTick = Game.rooms[creep.pos.roomName].controller.safeMode + Game.time
                }
            }
            // add room for safe mode cooldown list in case
            else if( !Game.rooms[creep.pos.roomName].controller.safeMode > 0 && Game.rooms[creep.pos.roomName].controller.safeModeCooldown > 0 ){

                if( !Memory.safemode_cooldown ){
                    Memory.safemode_cooldown = {}
                }

                var listed = 0
                for ( rm in Memory.safemode_cooldown.length ){
                    if( rm == creep.pos.roomName ){
                        var listed = 1
                        break;
                    }
                    else if( Game.time > Memory.safemode_cooldown[rm].endTick ){
                        delete Memory.safemode_cooldown[rm]
                    }
                }

                if( listed == 0 ){
                    Memory.safemode_cooldown[creep.pos.roomName] = {}
                    Memory.safemode_cooldown[creep.pos.roomName].endTick = Game.rooms[creep.pos.roomName].controller.safeModeCooldown + Game.time
                }
            }
        }
        //

    }
}

module.exports = FunctionBlockBackRoom;
