var baseBuild           = require('main.base.build')
var BaseBuildRampsWalls = require('main.base.buildRampsWalls')
var baseBuildReset      = require('main.base.buildReset')
var baseManager         = require('main.base.manager')


var mainBase= {

    run: function( rm ) {

        // level
        var lvl = Game.rooms[rm].controller.level
        if( Game.rooms[rm].memory.mode_defend == 1  ){
            var lvl = 9
        }

        // intel
        if( !Game.rooms[rm].memory.intel ){
            var mainIntel = require('main.intel')
            mainIntel.run( rm)
        }
  
        // build
        if( Game.rooms[rm].memory.oneTimer.build > 0 && 
            Game.rooms[rm].memory.flagPlacer >= 6 && Game.cpu.bucket >= 500 ){
            baseBuild.run( rm )
        }

        if( Game.rooms[rm].memory.oneTimer.plannerReset == 1 ){
            baseBuildReset.run(rm , lvl )
        }        

        if( Game.time % Memory.config.freq_base_flags[lvl] == 0 ){
            BaseBuildRampsWalls.run( rm )
        }

        // Manager
        baseManager.run( rm )      

    }
};

module.exports = mainBase;
