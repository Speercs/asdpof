// militar
var militarDefend  = require('main.militar.defend')

var mainMilitar= {

    run: function( rm ) {
        
        // level
        var lvl = Game.rooms[rm].controller.level
        if( Game.rooms[rm].memory.mode_defend == 1  ){
            var lvl = 9
        }
    
        // Defend
        if( Game.time % Memory.config.freq_tower_scan[lvl] == 0 || Game.rooms[rm].memory.mode_defend == 1 ){
            militarDefend.run( rm )
        }
        //
        
        
        
    }
};

module.exports = mainMilitar;
