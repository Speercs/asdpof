var mainBaseInitialFlag0     = require('main.base.initialFlag0')

var mainBaseBuildPlanner     = require('main.base.buildPlanner')
var baseBuildPlannerRamparts = require('main.base.buildPlannerRamparts')
var baseBuildPlannerRampartsClean  = require('main.base.buildPlannerRampartsClean')
var baseBuildPlannerRampartsLvl2   = require('main.base.buildPlannerRampartsLvl2')
var baseBuildPlannerRampartsCheck  = require('main.base.buildPlannerRampartsCheck')
var baseBuildPlannerRampartsBorder = require('main.base.buildPlannerRampartsBorder')
var baseBuildPlannerRampartsTowers = require('main.base.buildPlannerRampartsTowers')
var baseBuildPlannerRampartsRoads  = require('main.base.buildPlannerRampartsRoads')
//

var mainIntel = require('main.intel')

var MainBasePlanner0 = {

    run: function(rm ) {

        if( !Game.rooms[rm].memory.flagPlacer || Game.rooms[rm].memory.flagPlacer <= 16 ){

            // place initial flags
            if( Game.rooms[rm].memory.flagPlacer == 0 || !Game.rooms[rm].memory.flagPlacer ){
                mainIntel.run( rm)
                mainBaseInitialFlag0.run(rm)
            }

            // Planner step RUN!!
            if( Game.rooms[rm].memory.flagPlacer <= 16 && Game.rooms[rm].memory.flagPlacer >= 1 &&  Game.cpu.bucket >= 500 ){

                // plan room
                if( Game.rooms[rm].memory.flagPlacer == 1 ){
                    mainIntel.run( rm)
                    mainBaseBuildPlanner.run(rm)
                }
                // plan room
                else if( Game.rooms[rm].memory.flagPlacer == 2 ){
                    mainIntel.run( rm)
                    mainBaseBuildPlanner.run(rm)

                    // change source order based on distance
                    if( Game.rooms[rm].memory.intel.sources &&
                        Game.rooms[rm].memory.intel.sources[0] &&
                        Game.rooms[rm].memory.intel.sources[1] ){
                        if( Game.rooms[rm].memory.intel.sources[0].dh1 <= Game.rooms[rm].memory.intel.sources[1].dh1 ){
                            // ok
                        }
                        else{
                            var source_temp = Game.rooms[rm].memory.intel.sources[0]
                            Game.rooms[rm].memory.intel.sources[0] = Game.rooms[rm].memory.intel.sources[1]
                            Game.rooms[rm].memory.intel.sources[1] = source_temp
                        }
                    }
                }
                // plan room
                else if( Game.rooms[rm].memory.flagPlacer == 3 ){
                    mainIntel.run( rm)
                    mainBaseBuildPlanner.run(rm)
                }
                // plan room
                else if( Game.rooms[rm].memory.flagPlacer == 4 ){
                    mainIntel.run( rm)
                    mainBaseBuildPlanner.run(rm)
                }
                // plan room
                else if( Game.rooms[rm].memory.flagPlacer == 5 ){
                    mainIntel.run( rm)
                    mainBaseBuildPlanner.run(rm)
                }
                // prepare for rampart
                else if( Game.rooms[rm].memory.flagPlacer == 6 ){
                    // remove flags
                    for ( f1 in Game.flags ) {
                        if( Game.flags[f1].pos.roomName == rm && ( Game.flags[f1].color == 4 || Game.flags[f1].color == 5 || Game.flags[f1].color == 9 || Game.flags[f1].color == 10 ) ){
                            Game.flags[f1].remove()
                        }
                    }
                }
                // place rampart
                else if( Game.rooms[rm].memory.flagPlacer == 7 ){
                    baseBuildPlannerRamparts.run(rm)
                }
                // remove disconected ramparts
                else if( Game.rooms[rm].memory.flagPlacer == 8 ){
                    baseBuildPlannerRampartsClean.run(rm)
                }
                // prepare for 2nd and 3rd rampart/wall layer
                else if( Game.rooms[rm].memory.flagPlacer == 9 ){
                    // remove flags
                    for ( f1 in Game.flags ) {
                        if( Game.flags[f1].pos.roomName == rm && ( Game.flags[f1].color == 4 || Game.flags[f1].color == 9 ) ){
                            Game.flags[f1].remove()
                        }
                    }
                }
                // 2nd and 3rd rampart/wall layer
                else if( Game.rooms[rm].memory.flagPlacer == 10 ){
                    baseBuildPlannerRampartsLvl2.run(rm)
                }
                // check if base is secured
                else if( Game.rooms[rm].memory.flagPlacer == 11 ){
                    baseBuildPlannerRampartsCheck.run(rm)
                }
                // fallback in case of no ramps
                // check if base is secured
                else if( Game.rooms[rm].memory.flagPlacer == 12 ){
                    var flag_cnt = 0
                    for ( f1 in Game.flags ) {
                        if( Game.flags[f1].pos.roomName == rm && ( Game.flags[f1].color == 4 || Game.flags[f1].color == 5 || Game.flags[f1].color == 9 ) ){
                            var flag_cnt = 1
                            break
                        }
                    }

                    if( flag_cnt == 1 ){
                        // all fine
                        console.log('all fine on the ramps front', rm)
                    }
                    else{
                        baseBuildPlannerRampartsBorder.run(rm)
                    }

                }
                // fall back check for 2nd layer ramps
                else if( Game.rooms[rm].memory.flagPlacer == 13 ){
                    var flag_cnt = 0
                    for ( f1 in Game.flags ) {
                        if( Game.flags[f1].pos.roomName == rm && ( Game.flags[f1].color == 4 || Game.flags[f1].color == 9 ) ){
                            var flag_cnt = 1
                            break
                        }
                    }

                    if( flag_cnt == 1 ){
                        // all fine
                        console.log('all fine on the ramps front', rm)
                    }
                    else{
                        baseBuildPlannerRampartsClean.run(rm)
                    }
                }
                else if( Game.rooms[rm].memory.flagPlacer == 14 ){
                    var flag_cnt = 0
                    for ( f1 in Game.flags ) {
                        if( Game.flags[f1].pos.roomName == rm && ( Game.flags[f1].color == 4 || Game.flags[f1].color == 9 ) ){
                            var flag_cnt = 1
                            break
                        }
                    }

                    if( flag_cnt == 1 ){
                        // all fine
                        console.log('all fine on the ramps front', rm)
                    }
                    else{
                        baseBuildPlannerRampartsLvl2.run(rm)
                    }
                }
                // try to move towers to the walls if ramoarts are close
                else if( Game.rooms[rm].memory.flagPlacer == 15 ){

                    var mix_xx =  999
                    var max_xx = -999
                    var min_yy =  999
                    var max_yy = -999

                    for ( f1 in Game.flags ) {
                        if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 5 ){
                            var mix_xx =  Math.min(mix_xx, Game.flags[f1].pos.x)
                            var max_xx =  Math.max(max_xx, Game.flags[f1].pos.x)
                            var min_yy =  Math.min(min_yy, Game.flags[f1].pos.y)
                            var max_yy =  Math.max(max_yy, Game.flags[f1].pos.y)
                        }
                    }

                    if( Math.abs( mix_xx - max_xx ) <= 28 &&  Math.abs( min_yy - max_yy ) <= 28 ){
                        baseBuildPlannerRampartsTowers.run(rm)
                    }
                }
                // create roads to all ramparts
                else if( Game.rooms[rm].memory.flagPlacer == 16 ){
                    baseBuildPlannerRampartsRoads.run(rm)
                }

                Game.rooms[rm].memory.flagPlacer = Game.rooms[rm].memory.flagPlacer + 1

            }
            //
        }
    }
};

module.exports = MainBasePlanner0;
