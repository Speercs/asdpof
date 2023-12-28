var militarDefend= {

    run: function( rm ) {

        // TOWER - simple  
        
        // level
        var lvl = Game.rooms[rm].controller.level
        if( Game.rooms[rm].memory.mode_defend == 1  ){
            var lvl = 9
        }

        // random shooting
        if( !Game.rooms[rm].memory.tower_rand ){
            Game.rooms[rm].memory.tower_rand = 0
        }
        else{
            Game.rooms[rm].memory.tower_rand = Math.max(0, Game.rooms[rm].memory.tower_rand - 1)
        }

        if ( Game.rooms[rm].memory.intel.tower && Game.rooms[rm].memory.intel.tower.length >= 1 ) {

            var twr_max = Game.rooms[rm].memory.intel.tower.length

            var twr = 0

            // possible targets
            var enemies = Game.rooms[rm].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  {return ( _.intersection([creep.owner.username], Memory.config.ally_list).length == 0  ) } } );

            // rampart guys
            if( enemies.length>=1){

                Game.rooms[rm].memory.mode_defend = 1

                if( Game.time % 1 == 0 ){

                    // rampart position
                    var flag_matrix = []
                    var cnt = 0

                    for ( f1 in Game.flags ) {

                        if ( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 5 && Game.flags[f1].secondaryColor == 5 ) {

                            var xx = Game.flags[f1].pos.x
                            var yy = Game.flags[f1].pos.y

                            var ramp_check = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy);
                            var ramp_check = _.filter(ramp_check, (structure) => structure.structureType == STRUCTURE_RAMPART)

                            flag_matrix[cnt] = {}
                            flag_matrix[cnt].xx = xx
                            flag_matrix[cnt].yy = yy
                            flag_matrix[cnt].priority = 999
                            var cnt = cnt + 1
                        }
                    }


                    // ramparter
                    if( enemies.length >= 1 && Game.time % 1 == 0  ){

                        for( var ii = 0; ii < enemies.length; ii++ ){

                            var xx = enemies[ii].pos.x
                            var yy = enemies[ii].pos.y
                            // 0 - work, 0 - attack, 1 - ranged
                            if ( enemies[ii].getActiveBodyparts(WORK) > 0 ){
                                var type = 0
                            }
                            else if ( enemies[ii].getActiveBodyparts(ATTACK) > 0 ){
                                var type = 0
                            }
                            else if ( enemies[ii].getActiveBodyparts(RANGED_ATTACK) > 0 ){
                                var type = 2
                            }
                            else{
                                var type = 4
                            }

                            for( var i = 0; i < flag_matrix.length; i++ ){

                                var distance = Math.max( Math.abs(flag_matrix[i].xx - xx ), Math.abs(flag_matrix[i].yy - yy ) )
                                var priority = distance + type

                                if( priority < flag_matrix[i].priority  ){
                                    flag_matrix[i].priority = priority
                                }

                                var distance2= Math.min( Math.abs(flag_matrix[i].xx - xx ), Math.abs(flag_matrix[i].yy - yy ) )
                                flag_matrix[i].distance2 = distance2

                            }
                        }
                    }

                    // sort
                    flag_matrix = _.sortBy(flag_matrix, "priority" );


                    flag_matrix = _.chain(flag_matrix).sortBy('distance2').sortBy('priority').value();

                    Memory.teste = flag_matrix

                    // assign
                    var defenders = _.filter( Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.role == 'defenderRampart' )
                    var defenders_length = defenders.length // fixed

                    if( defenders_length >=1  ){

                        // reset defenders
                        for( var i = 0; i < defenders_length; i++ ){

                            defenders[i].memory.xx_ramp = null
                            defenders[i].memory.yy_ramp = null

                        }

                        // assign the closest
                        for( var i = 0; i < defenders_length; i++ ){

                            var xx = flag_matrix[i].xx
                            var yy = flag_matrix[i].yy

                            var pos = new RoomPosition(xx, yy, rm);

                            var def = pos.findClosestByRange( defenders )

                            def.memory.xx_ramp = xx
                            def.memory.yy_ramp = yy

                            var defenders = _.difference(defenders, [def])

                        }
                    }
                }
            }
            else{
                Game.rooms[rm].memory.mode_defend = 0
            }
            //



            // tower shooting crippled targets
            if( enemies.length>=1 ){

                // random shooting
                if( Math.random() * 100 <= 2.5 ){
                    Game.rooms[rm].memory.tower_rand = Math.floor(Math.random()*25)
                }

                if( twr <= twr_max ){

                    for( var ii = 0; ii < enemies.length; ii++ ){

                        var enemy_heal = 0
                        var tough = 0
                        var attack_creep = 0

                        // enemy  creep single
                        if( enemies[ii].getActiveBodyparts( HEAL ) > 0 || enemies[ii].getActiveBodyparts( TOUGH ) > 0 ){
                            for( var iii = 0; iii < enemies[ii].body.length; iii++ ){
                                // heal
                                if( enemies[ii].body[iii].type == HEAL  ){
                                    if( enemies[ii].body[iii].boost == 'XLHO2'  ){
                                        var enemy_heal = enemy_heal + 48
                                    }
                                    else if( enemies[ii].body[iii].boost == 'LHO2'  ){
                                        var enemy_heal = enemy_heal + 36
                                    }
                                    else if( enemies[ii].body[iii].boost == 'LO'  ){
                                        var enemy_heal = enemy_heal + 24
                                    }
                                    else {
                                        var enemy_heal = enemy_heal + 12
                                    }
                                }
                                // tough
                                if( enemies[ii].body[iii].type == TOUGH  ){
                                    if( enemies[ii].body[iii].boost == 'XGHO2'  ){
                                        var tough = tough + 70
                                    }
                                    else if( enemies[ii].body[iii].boost == 'GHO2'  ){
                                        var tough = tough + 50
                                    }
                                    else if( enemies[ii].body[iii].boost == 'GO'  ){
                                        var tough = tough + 30
                                    }
                                    else {
                                        var tough = tough + 0
                                    }
                                }
                            }
                        }
                        //


                        // hostile creeps
                        var inrange = enemies[ii].pos.findInRange(FIND_HOSTILE_CREEPS, 3 )

                        if( inrange.length > 0 ){

                            for( var iii = 0; iii < inrange.length; iii++ ){

                                if( inrange[iii].getActiveBodyparts( HEAL ) > 0 ){
                                     for( var iiii = 0; iiii < inrange[iii].body.length; iiii++ ){

                                        // ranged heal
                                        if( inrange[iii].body[iiii].type == HEAL  ){
                                            if( inrange[iii].body[iiii].boost == 'XLHO2'  ){
                                                var enemy_heal = enemy_heal + 48
                                            }
                                            else if( inrange[iii].body[iiii].boost == 'LHO2'  ){
                                                var enemy_heal = enemy_heal + 36
                                            }
                                            else if( inrange[iii].body[iiii].boost == 'LO'  ){
                                                var enemy_heal = enemy_heal + 24
                                            }
                                            else {
                                                var enemy_heal = enemy_heal + 12
                                            }
                                        }
                                    }
                                }
                            }
                        }



                        // my creeps
                        var inrange = enemies[ii].pos.findInRange(FIND_MY_CREEPS, 1 )

                        if( inrange.length > 0 ){

                            for( var iii = 0; iii < inrange.length; iii++ ){
                                // attack
                                if( enemies[ii].body[iii].type == ATTACK  ){
                                    if( enemies[ii].body[iii].boost == 'XUH2O'  ){
                                        var attack_creep = attack_creep + 120
                                    }
                                    else if( enemies[ii].body[iii].boost == 'UH2O'  ){
                                        var attack_creep = attack_creep + 90
                                    }
                                    else if( enemies[ii].body[iii].boost == 'UH'  ){
                                        var attack_creep = attack_creep + 60
                                    }
                                    else {
                                        var attack_creep = attack_creep + 30
                                    }
                                }

                                // ranged attack - only range 1 distance
                                if( enemies[ii].body[iii].type == RANGED_ATTACK  ){
                                    if( enemies[ii].body[iii].boost == 'XKHO2'  ){
                                        var attack_creep = attack_creep + 40
                                    }
                                    else if( enemies[ii].body[iii].boost == 'KHO2'  ){
                                        var attack_creep = attack_creep + 30
                                    }
                                    else if( enemies[ii].body[iii].boost == 'KO'  ){
                                        var attack_creep = attack_creep + 20
                                    }
                                    else {
                                        var attack_creep = attack_creep + 10
                                    }
                                }
                            }
                        }



                        //towers
                        for( var iiii = 0; iiii < Game.rooms[rm].memory.intel.tower.length ; iiii++ ){

                            if( Game.rooms[rm].memory.intel.tower[iiii] && Game.rooms[rm].memory.intel.tower[iiii].id ){

                                var obj_twr = Game.getObjectById( Game.rooms[rm].memory.intel.tower[iiii].id )

                                if( obj_twr ){
                                    // check tower energy
                                    if( obj_twr.store['energy'] > 0 ){

                                        var xx = enemies[ii].pos.x
                                        var yy = enemies[ii].pos.y

                                        var xxx = obj_twr.pos.x
                                        var yyy = obj_twr.pos.y

                                        var dist = Math.max( Math.abs(xxx-xx), Math.abs(yyy-yy) )

                                        var attack_creep = attack_creep + Math.max( Math.min( 600, 600 - 30 * (dist-5) ), 150 )

                                    }
                                }
                                else{
                                    // apaga da memoria
                                    Game.rooms[rm].memory.intel.tower.splice(iiii,1)
                                    Game.rooms[rm].memory.phase = 1
                                }
                            }
                        }


                        if( attack_creep - Math.floor(Math.random() * 250) + 100 >= enemy_heal || Game.rooms[rm].memory.tower_rand > 0 ){

                            while ( twr <= twr_max ) {

                                for( var jj = 0; jj < twr_max; jj++ ){

                                    if( Game.rooms[rm].memory.intel.tower[jj] && Game.rooms[rm].memory.intel.tower[jj].id ){

                                        var twr_id = Game.rooms[rm].memory.intel.tower[jj].id

                                        var obj = Game.getObjectById( twr_id )

                                        if( obj ){

                                            obj.attack( enemies[ii] )

                                        }
                                    }

                                    var twr = twr + 1
                                }
                            }
                        }
                    }
                }
            }



            // heal defender Rampart
            if( twr <= twr_max && Game.rooms[rm].memory.mode_defend == 1 && 1==1 ){

                var heal = _.filter(Game.creeps, (creep) => creep.pos.roomName == rm && creep.my && creep.hits < creep.hitsMax && (creep.memory.role == 'defenderRampart' )  )

                if ( heal.length >= 1 ){

                    var stop = 0

                    for (var i = 0; i <heal.length; i++) {

                        while ( twr <= 5 && stop == 0) {

                            if( Game.rooms[rm].memory.intel.tower[twr] && Game.rooms[rm].memory.intel.tower[twr].id ){

                                var hits = heal[i].hits

                                // possible heal
                                var distance   = Math.max( Math.abs(heal[i].pos.x - Game.getObjectById( Game.rooms[rm].memory.intel.tower[twr].id ).pos.x ), Math.abs( heal[i].pos.y - Game.getObjectById( Game.rooms[rm].memory.intel.tower[twr].id ).pos.y  ) )

                                if( distance >= 20 ){
                                    var heal_possible   = 100
                                }
                                else if ( distance <= 5 ){
                                    var heal_possible   = 400
                                }
                                else {
                                    var heal_possible   = 500 - 20 * distance
                                }
                                //

                                var hits = hits + heal_possible

                                if( hits >= heal[i].hitsMax ){
                                    var stop = 1
                                }

                                Game.getObjectById( Game.rooms[rm].memory.intel.tower[twr].id ).heal( heal[i] )

                            }
                            else {
                                var stop = 1
                            }

                            var twr = twr + 1

                        }
                    }
                }
            }



            // heal anyone on room
            if( twr <= twr_max && ( Game.rooms[rm].memory.mode_defend == 1 || Game.time % ( Memory.config.freq_tower_scan[lvl] * 3 ) == 0 ) ){
                
                var heal = _.filter(Game.creeps, (creep) => creep.pos.roomName == rm && creep.my && creep.hits < creep.hitsMax  )

                if ( heal.length >= 1 ){

                    var stop = 0

                    for (var i = 0; i <heal.length; i++) {

                        while ( twr <= 5 && stop == 0) {

                            if( Game.rooms[rm].memory.intel.tower[twr] && Game.rooms[rm].memory.intel.tower[twr].id ){

                                var hits = heal[i].hits

                                // possible heal
                                var distance   = Math.max( Math.abs(heal[i].pos.x - Game.getObjectById( Game.rooms[rm].memory.intel.tower[twr].id ).pos.x ), Math.abs( heal[i].pos.y - Game.getObjectById( Game.rooms[rm].memory.intel.tower[twr].id ).pos.y  ) )

                                if( distance >= 20 ){
                                    var heal_possible   = 100
                                }
                                else if ( distance <= 5 ){
                                    var heal_possible   = 400
                                }
                                else {
                                    var heal_possible   = 500 - 20 * distance
                                }
                                //

                                var hits = hits + heal_possible

                                if( hits >= heal[i].hitsMax ){
                                    var stop = 1
                                }

                                Game.getObjectById( Game.rooms[rm].memory.intel.tower[twr].id ).heal( heal[i] )

                            }
                            else {
                                var stop = 1
                            }

                            var twr = twr + 1

                        }
                    }
                }
            }




            // REPAIR
            if( twr <= twr_max  ){

                var repair = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( (structure.structureType == STRUCTURE_ROAD       && structure.hits <=   600    ) ||
                    (structure.structureType == STRUCTURE_CONTAINER  && structure.hits <= 15000    ) ||
                    (structure.structureType == STRUCTURE_WALL       && structure.hits <= 1000 ) ||
                    (structure.structureType == STRUCTURE_RAMPART    && structure.hits <= 1000 )
                    ) } })


                var repair = _.sortBy(repair, 'hits');

                if ( repair.length >= 1 ){

                    var stop = 0

                    for (var i = 0; i <repair.length; i++) {

                        while ( twr <= 5 && stop == 0) {

                            if( Game.rooms[rm].memory.intel.tower[twr] && Game.rooms[rm].memory.intel.tower[twr].id ){

                                var hits = repair[i].hits

                                // possible heal
                                var distance   = Math.max( Math.abs(repair[i].pos.x - Game.getObjectById( Game.rooms[rm].memory.intel.tower[twr].id ).pos.x ), Math.abs( repair[i].pos.y - Game.getObjectById( Game.rooms[rm].memory.intel.tower[twr].id ).pos.y  ) )

                                if( distance >= 20 ){
                                    var repair_possible   = 200
                                }
                                else if ( distance <= 5 ){
                                    var repair_possible   = 800
                                }
                                else {
                                    var repair_possible   = 1000 - 40 * distance
                                }
                                //

                                var hits = hits + repair_possible

                                if( hits >= repair[i].hitsMax ){
                                    var stop = 1
                                }

                                Game.getObjectById( Game.rooms[rm].memory.intel.tower[twr].id ).repair( repair[i] )

                            }
                            else {
                                var stop = 1
                            }

                            var twr = twr + 1

                        }
                    }
                }
            }
            //


            // RAMPART
            if( 1==11 ){
                if( !Game.rooms[rm].memory.rampart_public ){
                    Game.rooms[rm].memory.rampart_public = 0
                }
                if( enemies && enemies.length >= 1 && Game.rooms[rm].memory.rampart_public == 1 ) {

                    Game.rooms[rm].memory.rampart_public = 0

                    var ramp = Game.rooms[rm].find(FIND_MY_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_RAMPART  ) } })

                    for (var i = 0; i < ramp.length; i++) {

                        ramp[i].setPublic(0)

                    }
                }
                else if( enemies && enemies.length >= 1 && Game.rooms[rm].memory.rampart_public == 0 ) {

                    // ok

                }
                else if ( Game.time % 50 == 0 && enemies && enemies.length == 0 && Game.rooms[rm].memory.rampart_public == 0 ){

                    Game.rooms[rm].memory.rampart_public = 1

                    var ramp = Game.rooms[rm].find(FIND_MY_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_RAMPART  ) } })

                    var base_x_min = Game.rooms[rm].memory.base_x - 2
                    var base_x_max = Game.rooms[rm].memory.base_x + 2
                    var base_y_min = Game.rooms[rm].memory.base_y - 2
                    var base_y_max = Game.rooms[rm].memory.base_y

                    var lab_x_min = Game.rooms[rm].memory.lab_x - 2
                    var lab_x_max = Game.rooms[rm].memory.lab_x + 2
                    var lab_y_min = Game.rooms[rm].memory.lab_y - 2
                    var lab_y_max = Game.rooms[rm].memory.lab_y

                    var lvl = Game.rooms[rm].controller.level
                    if( Game.rooms[rm].memory.mode_defend == 1  ){
                        var lvl = 9
                    }
                    var twr_scan_freq = Memory.config.freq_tower_scan[lvl] + 4

                    for (var i = 0; i < ramp.length; i++) {

                        var ramp_x = ramp[i].pos.x
                        var ramp_y = ramp[i].pos.y

                        if( ramp_x >= base_x_min &&
                            ramp_y >= base_y_min &&
                            ramp_x <= base_x_max &&
                            ramp_y <= base_y_max ){

                            ramp[i].setPublic(0)
                        }
                        else if( ramp_x >= lab_x_min &&
                                ramp_y >= lab_y_min &&
                                ramp_x <= lab_x_max &&
                                ramp_y <= lab_y_max ){

                            ramp[i].setPublic(0)
                        }
                        else if( ramp_x < twr_scan_freq ||
                                 ramp_y < twr_scan_freq ||
                                 ramp_x > 49 - twr_scan_freq ||
                                 ramp_y > 49 - twr_scan_freq ){

                            ramp[i].setPublic(0)
                        }
                        else {
                            ramp[i].setPublic(1)
                        }
                    }
                }
            }
            //
        }
        else{
            var enemies = Game.rooms[rm].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  {return ( _.intersection([creep.owner.username], Memory.config.ally_list).length == 0  ) } } );

            // rampart guys
            if( enemies.length>=1){
                Game.rooms[rm].memory.mode_defend = 1
            }    
            else{
                Game.rooms[rm].memory.mode_defend = 0
            }    
        }
    }
};

module.exports = militarDefend;
