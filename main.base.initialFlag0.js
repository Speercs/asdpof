var mainBaseInitialFlag1 = require('main.base.initialFlag1')

var MainBaseInitialFlag0 = {

    run: function(rm ) {

        // check if stamp exists
        var check = 0
        // half filer 1
        if( Game.rooms[rm].memory.base_x && Game.rooms[rm].memory.base_y ){
            var check = check + 1
        }

        // half filer 1
        if( Game.rooms[rm].memory.h1_x && Game.rooms[rm].memory.h1_y ){
            var check = check + 1
        }

        // half filer 2
        if( Game.rooms[rm].memory.h2_x && Game.rooms[rm].memory.h2_y ){
            var check = check + 1
        }

        if( check == 3 ){
            Game.rooms[rm].memory.flagPlacer = 1
            console.log("<font color=\"#66d44a\">Initial stamp placed on room: " + rm + "!!!!</font>")
        }
        else{
            console.log("<font color=\"#FF0000\">Initial stamp missing on room: " + rm + "!!!!</font>")

            // find if there is a spawn
            var ok = 1
            if( Game.rooms[rm].controller && Game.rooms[rm].controller.level == 1 && Game.rooms[rm].controller.progress == 0 && ( Game.rooms[rm].find(FIND_MY_SPAWNS).length == 1 ) ){
            // if( rm == 'W6N13' ){
                var ok = 0
                // sempre vai ser horizontal
                Game.rooms[rm].memory.h1_x = Game.rooms[rm].find(FIND_MY_SPAWNS)[0].pos.x
                Game.rooms[rm].memory.h1_y = Game.rooms[rm].find(FIND_MY_SPAWNS)[0].pos.y - 1
                Game.rooms[rm].memory.h1_type = 'h'

                // if( rm == 'W6N13' ){
                //     Game.rooms[rm].memory.h1_x = 28
                //     Game.rooms[rm].memory.h1_y = 38 - 1
                //     Game.rooms[rm].memory.h1_type = 'h'
                // }

                // yellow flag for main stamp
                for ( f1 in Game.flags ) {
                    if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 6 ){
                        Game.rooms[rm].memory.base_x = Game.flags[f1].pos.x
                        Game.rooms[rm].memory.base_y = Game.flags[f1].pos.y
                        var ok = 1
                        break
                    }
                }
            }
            else if( Game.rooms[rm].terminal && 1==1 ){
                Game.rooms[rm].memory.base_x = Game.rooms[rm].terminal.pos.x
                Game.rooms[rm].memory.base_y = Game.rooms[rm].terminal.pos.y
                var ok = 1
            }

            // place flags
            if ( Game.cpu.bucket >= 500 && ok == 1 ){
                mainBaseInitialFlag1.run(rm)
            }
        }
    }
};

module.exports = MainBaseInitialFlag0;
