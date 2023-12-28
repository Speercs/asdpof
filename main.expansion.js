// expansion
var expansionChooser    = require('main.expansion.chooser')
var expansionMapper     = require('main.expansion.mapper')
var expansionUnclaim    = require('main.expansion.unclaim')

var expansion= {

    run: function(  ) {

        // main.expansion.unclaim
        if( Game.time % 249 == 0 ){
            expansionUnclaim.run()
        }
        //

        // create room map
        if( Game.time % 1500 == 0 && Game.cpu.getUsed()  < 400 ){
            // if( Game.time % 15000 == 0 ){
            //     delete Memory.expansion
            // }
            expansionMapper.run()
        }
        //

        // chooser
        if( Game.time % 35 == 0 && Memory.expansion && Memory.expansion.task.timer == 0  || 1==1){
            expansionChooser.run()
        }
        //
        expansionChooser.run()
        // reduce timer
        if( Memory.expansion && Memory.expansion.task.timer > 0 ){

            if( Memory.expansion.task.phase == 0 ){
                var desc = 'trying to claim'
            }
            else if( Memory.expansion.task.phase == 1 ){
                var desc = 'trying to build spawn'
            }
            else if( Memory.expansion.task.phase == 2 ){
                var desc = 'abandon'
            }

            console.log('Expansion task: ', Memory.expansion.task.timer, 'from: ',Memory.expansion.task.rm, 'to: ', Memory.expansion.task.rm_tgt, 'phase: ', Memory.expansion.task.phase, desc )

            Memory.expansion.task.timer = Memory.expansion.task.timer - 1

            // chekc if room is mine
            if( Game.rooms[ Memory.expansion.task.rm_tgt ] && Game.rooms[ Memory.expansion.task.rm_tgt ].controller.my ){
                Memory.expansion.task.phase = 1
            }

            // check for time extension
            if( Memory.expansion.task.timer % 75 == 0 && Memory.expansion.task.phase == 1 ){

                // check if target room is still mine
                if( Game.rooms[ Memory.expansion.task.rm_tgt ].controller.my ){
                    // ok
                }
                else{
                    Memory.expansion.task.phase = 2
                }
                //

                // check if source room is still mine
                if( Game.rooms[ Memory.expansion.task.rm ].controller.my ){
                    // ok
                }
                else{
                    Memory.expansion.task.phase = 2
                }
                //

                // check if first tower is finished
                if( Game.rooms[ Memory.expansion.task.rm_tgt ].controller.level >= 3 &&
                    Game.rooms[ Memory.expansion.task.rm_tgt ].memory.intel.tower &&
                    Game.rooms[ Memory.expansion.task.rm_tgt ].memory.intel.tower[0] &&
                    Game.rooms[ Memory.expansion.task.rm_tgt ].memory.intel.tower[0].id &&
                    Game.getObjectById( Game.rooms[ Memory.expansion.task.rm_tgt ].memory.intel.tower[0].id ) ){

                    Memory.expansion.task.phase = 2
                }
                //

                // check if spawn is under construction and under progress increase timer
                var contruction_sites = Game.rooms[ Memory.expansion.task.rm_tgt ].find( FIND_CONSTRUCTION_SITES )

                for ( var i = 0 ; i < contruction_sites.length ; i++){
                    if( contruction_sites[i].my && contruction_sites[i].structureType == 'spawn' ){
                        if( !Memory.expansion.task.progress ){
                            Memory.expansion.task.progress = contruction_sites[i].progress
                        }
                        else if( contruction_sites[i].progress > Memory.expansion.task.progress ){
                            Memory.expansion.task.progress = contruction_sites[i].progress
                            Memory.expansion.task.timer = Memory.expansion.task.timer + 100
                        }
                        else{
                            Memory.expansion.task.progress = contruction_sites[i].progress
                        }
                    }
                }
                //

            }

            // check for cancelation
            if( Memory.expansion.task.phase == 2 ){
                Memory.expansion.task.timer = 0

                for ( var i = 0 ; i < Memory.expansion.map.length ; i++){
                    if( Memory.expansion.map[i].rm_tgt == Memory.expansion.task.rm_tgt ){
                        Memory.expansion.map[i].blockTick = Game.time
                    }
                }
            }

            // remove current room from list
            if( Memory.expansion.task.phase == 1 && Memory.expansion.task.timer == 0 ){

                for ( var i = 0 ; i < Memory.expansion.map.length ; i++){
                    if( Memory.expansion.map[i].rm_tgt == Memory.expansion.task.rm_tgt ){
                        Memory.expansion.map[i].blockTick = Game.time
                    }
                }
            }

            // depriorityze
            if( Memory.expansion.task.timer == 0 ){

                var rm = Memory.expansion.task.rm_tgt

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
        }
        //

        // priority reducer
        if( Game.time % 17500 == 0 && Memory.expansion.decrease_priority){
            for ( var j = 0 ; j < Memory.expansion.decrease_priority.length; j++){
                Memory.expansion.decrease_priority[j].modifier = Math.max( Memory.expansion.decrease_priority[j].modifier - 1, 0 )
            }
        }
        //


        // clean old entries and highway rooms
        if( Game.time % 3000 == 111 && Memory.expansion && Memory.expansion.map ){

            for ( var j = 0 ; j < Memory.expansion.map.length; j++){

                var rm = Memory.expansion.map[j].rm
                var remove = 0

                if( Game.rooms[rm] && Game.rooms[rm].controller && Game.rooms[rm].controller.my ){
                    // ok
                }
                else{
                    //var remove = 1
                }

                // highway and center
                if( remove == 0 ){

                    var rm_sct = Memory.expansion.map[j].rm_tgt

                    // check if room is highway or not
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

                    if( lat_coord % 10 == 0 || lon_coord % 10 == 0 ){
                        var rm_type = 'highway'
                        var remove = 1
                    }
                    else if (  ( lat_coord % 10 == 4 || lat_coord % 10 == 5 || lat_coord % 10 == 6 ) &&
                               ( lon_coord % 10 == 4 || lon_coord % 10 == 5 || lon_coord % 10 == 6 ) ){
                        // already checked for no controller
                        var rm_type = 'center'
                        var remove = 1
                    }
                }

                // unavailable
                if( remove == 0 && Memory.expansion.map[j].sources == -1 && ( Game.shard.name == 'swc' || Game.shard.name == 'screepsplus0' || Game.shard.name == 'ba' || Game.shard.name == 'botarena' ) ){
                    if( Game.map.getRoomStatus(Memory.expansion.map[j].rm_tgt) != 'normal' ){
                        var remove = 1
                    }
                }
                //

                if( remove == 1 ){
                  Memory.expansion.map.splice(j,1)
                  if ( j > 0 ) { j = j - 1 }
                }
            }
        }        

    }
};

module.exports = expansion;
