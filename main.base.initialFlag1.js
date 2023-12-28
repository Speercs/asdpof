var mainBaseInitialFlag1_hh1_hh2  = require('main.base.initialFlag1_hh1_hh2')
var mainBaseInitialFlag1_hh1_hv1  = require('main.base.initialFlag1_hh1_hv1')
var mainBaseInitialFlag1_hv1_hv2  = require('main.base.initialFlag1_hv1_hv2')

var MainBaseInitialFlag1= {

    run: function( rm ) {

        if( !global.rooms[rm] ){
            global.rooms[rm] = {}
        }

        if( !global.rooms[rm].initialFlag0 ){
            global.rooms[rm].initialFlag0 = []
        }

        // RUNS!!
        if( Game.cpu.getUsed() < 250 && !global.rooms[rm].initialFlag0[0] ){
            global.rooms[rm].initialFlag0[0] = mainBaseInitialFlag1_hh1_hh2.run(rm)
            console.log("<font color=\"#66d44a\">Initial stamp run 0 on room: " + rm + "!!!!</font>")
        }
        else if( Game.cpu.getUsed() < 250 && !global.rooms[rm].initialFlag0[1] ){
            global.rooms[rm].initialFlag0[1] = mainBaseInitialFlag1_hh1_hv1.run(rm)
            console.log("<font color=\"#66d44a\">Initial stamp run 1 on room: " + rm + "!!!!</font>")
        }
        else if( Game.cpu.getUsed() < 250 && !global.rooms[rm].initialFlag0[2] ){
            global.rooms[rm].initialFlag0[2] = mainBaseInitialFlag1_hv1_hv2.run(rm)
            console.log("<font color=\"#66d44a\">Initial stamp run 2 on room: " + rm + "!!!!</font>")
        }

        console.log(global.rooms[rm].initialFlag0[0], global.rooms[rm].initialFlag0[1], global.rooms[rm].initialFlag0[2])

        // SELECTOR
        if( global.rooms[rm].initialFlag0[0] && global.rooms[rm].initialFlag0[1] && global.rooms[rm].initialFlag0[2] ){

            global.rooms[rm].initialFlag0 = global.rooms[rm].initialFlag0.sort((a, b) => a[7] - b[7]) // ascending

            for ( var i = 0 ; i < global.rooms[rm].initialFlag0.length ; i++){
                if( global.rooms[rm].initialFlag0[i][0] > 0 && global.rooms[rm].initialFlag0[i][1] > 0 &&
                    global.rooms[rm].initialFlag0[i][2] > 0 && global.rooms[rm].initialFlag0[i][3] > 0 &&
                    global.rooms[rm].initialFlag0[i][4] > 0 && global.rooms[rm].initialFlag0[i][5] > 0 &&
                    ( !Game.rooms[rm].memory.h1_type || Game.rooms[rm].memory.h1_type == global.rooms[rm].initialFlag0[i][8] ) &&
                    ( !Game.rooms[rm].memory.h2_type || Game.rooms[rm].memory.h2_type == global.rooms[rm].initialFlag0[i][9] ) ){

                    Game.rooms[rm].memory.h1_x = global.rooms[rm].initialFlag0[i][2]
                    Game.rooms[rm].memory.h1_y = global.rooms[rm].initialFlag0[i][3]
                    Game.rooms[rm].memory.h1_type = global.rooms[rm].initialFlag0[i][8]

                    Game.rooms[rm].memory.h2_x = global.rooms[rm].initialFlag0[i][4]
                    Game.rooms[rm].memory.h2_y = global.rooms[rm].initialFlag0[i][5]
                    Game.rooms[rm].memory.h2_type = global.rooms[rm].initialFlag0[i][9]

                    if( !Game.rooms[rm].memory.base_x || !Game.rooms[rm].memory.base_y ){
                        Game.rooms[rm].memory.base_x = global.rooms[rm].initialFlag0[i][0]
                        Game.rooms[rm].memory.base_y = global.rooms[rm].initialFlag0[i][1]
                    }
                }
            }

        }

    }

}

module.exports = MainBaseInitialFlag1
