
var expansionChooser= {

    run: function(  ) {

        // count owned rooms x GCL
        var cnt_rm = 0
        for(var name in Game.rooms) {
            rm = name;
            if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my ) {
                var cnt_rm = cnt_rm + 1
            }
        }

        if( cnt_rm < Game.gcl.level ){

            // map mineral needs
            var mineral_matrix = [  ['X',0,-30],
                                    ['L',0,-24],
                                    ['U',0,-24],
                                    ['Z',0,-24],
                                    ['K',0,-20],
                                    ['O',0,-16],
                                    ['H',0,-16]  ]

            for(var name in Game.rooms) {
                rm = name;
                if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my ) {

                    for ( var i = 0 ; i < mineral_matrix.length ; i++){

                        if( mineral_matrix[i][0] == Game.rooms[rm].memory.intel.minerals[0].mineralType ){
                            mineral_matrix[i][1] = mineral_matrix[i][1] + 15
                        }
                    }
                }
            }

            // filter target rooms
            var targets = _.filter( Memory.expansion.map , (target) => target.roomDistance >= 0 &&
                                                                       target.roomDistance < 10 &&
                                                                       target.available == 1    &&
                                                                       target.distace_base_controller &&
                                                                       target.distace_base_h1_h2 &&
                                                                       (!target.blockTick || ( target.blockTick && Game.time-target.blockTick > 2200 ) ) )
console.log(targets)
            // prioritize by minerals
            for ( var j = 0 ; j < targets.length ; j++){

                targets[j].priority = targets[j].roomDistance

                for ( var i = 0 ; i < mineral_matrix.length ; i++){
                    if( mineral_matrix[i][1] == 0 && mineral_matrix[i][0] == targets[j].mineral ){
                        targets[j].priority = targets[j].roomDistance + mineral_matrix[i][2]
                    }
                }
            }

            // deprioritize close to owned
            for(var name in Game.rooms) {
                rm = name;
                if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my ) {

                    for ( var j = 0 ; j < targets.length ; j++){

                        // clase targets
                        if( Game.map.getRoomLinearDistance(rm, targets[j].rm_tgt) <= 2 ){
                            targets[j].priority = targets[j].priority + 20
                        }

                        // target is my own room
                        if( rm == targets[j].rm_tgt ){
                            targets[j].priority = targets[j].priority + 9999
                        }
                    }
                }
            }
            //

            // deprioritize base far from controller
            for ( var j = 0 ; j < targets.length ; j++){
                if( targets[j].distace_base_controller && targets[j].distace_base_controller <= 7 && targets[j].distace_base_h1_h2 && targets[j].distace_base_h1_h2 <= 7  ){
                    // good
                }
                else if( targets[j].distace_base_controller && targets[j].distace_base_controller <= 7 && targets[j].distace_base_h1_h2 && targets[j].distace_base_h1_h2 <= 11  ){
                    // good - but not terrible
                    targets[j].priority = targets[j].priority + 5
                }
                else if( targets[j].distace_base_controller && targets[j].distace_base_controller <= 7  ){
                    targets[j].priority = targets[j].priority + 20
                }
                else if( targets[j].distace_base_controller && targets[j].distace_base_controller <= 15  ){
                    targets[j].priority = targets[j].priority + 80
                }
                else{
                    targets[j].priority = targets[j].priority + 150
                }
            }
            //

            // decrease priority
            if( Memory.expansion.decrease_priority ){
                for ( var jj = 0 ; jj < Memory.expansion.decrease_priority.length; jj++){
                    for ( var j = 0 ; j < targets.length ; j++){
                        if( Memory.expansion.decrease_priority[jj].rm == targets[j].rm_tgt ){
                            targets[j].priority = targets[j].priority + Memory.expansion.decrease_priority[jj].modifier
                            break;
                        }
                    }
                }
            }
            //

            var targets = _.sortBy( targets, 'priority')
            console.log( targets)

            // best candidates
            var candidate_found = 0
            for ( var j = 0 ; j < targets.length ; j++){          
                if( targets[j].available == 1 && targets[j].sources == 2 && targets[j].priority < 9999 && 
                    Game.rooms[targets[j].rm] && Game.rooms[targets[j].rm].controller && Game.rooms[targets[j].rm].controller.my &&
                    Game.rooms[targets[j].rm].energyCapacityAvailable >= 1300 &&  Game.rooms[targets[j].rm].storage  ){
                    var rm_candidate = targets[j].rm_tgt
                    var rm_source    = targets[j].rm
                    var candidate_found = 1
                    break;
                }
            }
            console.log( 'candidate to expansion: ' , rm_candidate, ' from room: ', rm_source)
            //


            // record candidate on memory to start process
            if( candidate_found == 1 && ( !Memory.expansion.task.timer || Memory.expansion.task.timer <= 0 ) ){

                Memory.expansion.task.timer = 3210
                Memory.expansion.task.rm    = rm_source
                Memory.expansion.task.rm_tgt= rm_candidate
                Memory.expansion.task.phase = 0

                // phase 0 - spawn
                // phase 1 - room claimmed
                // phase 2 - cancel
            }
        }
    }
};

module.exports = expansionChooser;
