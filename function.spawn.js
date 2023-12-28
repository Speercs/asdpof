var functionSpawn = {

    run: function(sp, rm, role) {

        if ( Game.spawns[sp] ) {

            var body_ar = []
            var newName = Math.random().toString(36).slice(6)

            // CARRY ON FRONT - MOVE ON THE BACK
            if( role[0] == 'harvester_out' || 
                role[0] == 'reserver' || 
                role[0] == 'defender' || 

                role[0] == 'mineralSK' ||

                role[0] == 'harvester' ||
                role[0] == 'builder' ||
                role[0] == 'upgrader' 

               ){                 

                var tough_max = role[3]
                var move_max = role[4]
                var work_max = role[5]
                var carry_max = role[6]
                var attack_max = role[7]
                var ranged_attack_max = role[8]
                var heal_max = role[9]
                var claim_max = role[10]

                var move_ratio = Math.ceil( (tough_max + work_max + carry_max + attack_max + ranged_attack_max + heal_max + claim_max ) / move_max )

                // loop to set body
                for (var j = 1; j <= 50; j++) {

                    if( carry_max > 0 ){
                        var carry_max = carry_max - 1
                        body_ar.push(CARRY)
                    }
                    else if( tough_max > 0 ){
                        var tough_max = tough_max - 1
                        body_ar.push(TOUGH)
                    }
                    else if( work_max > 0 ){
                        var work_max = work_max - 1
                        body_ar.push(WORK)
                    }
                    else if( attack_max > 0 ){
                        var attack_max = attack_max - 1
                        body_ar.push(ATTACK)
                    }
                    else if( ranged_attack_max > 0 ){
                        var ranged_attack_max = ranged_attack_max - 1
                        body_ar.push(RANGED_ATTACK)
                    }
                    else if( heal_max > 0 ){
                        var heal_max = heal_max - 1
                        body_ar.push(HEAL)
                    }
                    else if( claim_max > 0 ){
                        var claim_max = claim_max - 1
                        body_ar.push(CLAIM)
                    }
                    else if( move_max > 0 ){
                        var move_max = move_max - 1
                        body_ar.push(MOVE)
                    } 
                 
                    if( tough_max + move_max + work_max + carry_max +
                        attack_max + ranged_attack_max + heal_max + claim_max <= 0 ){
                        break;
                    }
                }
                //  
            }
            // SMALL PARTS OF CARRY MOVE
            else if( role[0] == 'hauler_rm' || 
                     role[0] == 'hauler_rm_mineral' || 
                     role[0] == 'depo_collector' ||
                     role[0] == 'hauler_out' 
                   ){                 

                var tough_max = role[3]
                var move_max = role[4]
                var work_max = role[5]
                var carry_max = role[6]
                var attack_max = role[7]
                var ranged_attack_max = role[8]
                var heal_max = role[9]
                var claim_max = role[10]

                var move_ratio = Math.ceil( (tough_max + work_max + carry_max + attack_max + ranged_attack_max + heal_max + claim_max ) / move_max )

                // loop to set body
                for (var j = 1; j <= 50; j++) {

                    var n = 1
                    while (n <= move_ratio) {

                        if( carry_max > 0 ){
                            var carry_max = carry_max - 1
                            body_ar.push(CARRY)
                        }
                        else if( tough_max > 0 ){
                            var tough_max = tough_max - 1
                            body_ar.push(TOUGH)
                        }
                        else if( work_max > 0 ){
                            var work_max = work_max - 1
                            body_ar.push(WORK)
                        }
                        else if( attack_max > 0 ){
                            var attack_max = attack_max - 1
                            body_ar.push(ATTACK)
                        }
                        else if( ranged_attack_max > 0 ){
                            var ranged_attack_max = ranged_attack_max - 1
                            body_ar.push(RANGED_ATTACK)
                        }
                        else if( heal_max > 0 ){
                            var heal_max = heal_max - 1
                            body_ar.push(HEAL)
                        }
                        else if( claim_max > 0 ){
                            var claim_max = claim_max - 1
                            body_ar.push(CLAIM)
                        }

                        n++;                  
                    }

                    if( move_max > 0 ){
                        var move_max = move_max - 1
                        body_ar.push(MOVE)
                    }

                    if( tough_max + move_max + work_max + carry_max +
                        attack_max + ranged_attack_max + heal_max + claim_max <= 0 ){
                        break;
                    }
                }
                //  
            }
            // standart body builder
            else{                
                for (var j = 0; j <= 7; j++) {
                    for (var k = 1; k <= role[3+j]; k++) {
                        if ( j == 0 ) {
                            body_ar.push(TOUGH)
                        } else if ( j == 1 ) {
                            body_ar.push(MOVE)
                        } else if ( j == 2 ) {
                            body_ar.push(WORK)
                        } else if ( j == 3 ) {
                            body_ar.push(CARRY)
                        } else if ( j == 4 ) {
                            body_ar.push(ATTACK)
                        } else if ( j == 5 ) {
                            body_ar.push(RANGED_ATTACK)
                        } else if ( j == 6 ) {
                            body_ar.push(HEAL)
                        } else if ( j == 7 ) {
                            body_ar.push(CLAIM)
                        }
                    }
                }

            }



            if( !role[14] ){ role[14] = 0 }
            if( !role[15] ){ role[15] = 0 }
            if( !role[16] ){ role[16] = 0 }
            if( !role[17] ){ role[17] = 0 }
            if( !role[18] ){ role[18] = 0 }


            if( Game.rooms[rm].memory.intel.spawn[0] && Game.rooms[rm].memory.intel.spawn[0].id && sp == Game.getObjectById( Game.rooms[rm].memory.intel.spawn[0].id ).name ){
                if( Game.rooms[rm].memory.h1_type == 'v' ){
                    var dir = [RIGHT,TOP_RIGHT,BOTTOM_RIGHT]
                }
                else{
                    var dir = [BOTTOM,BOTTOM_RIGHT,BOTTOM_LEFT]
                }
            }
            else if( Game.rooms[rm].memory.intel.spawn[1] && Game.rooms[rm].memory.intel.spawn[1].id && sp == Game.getObjectById( Game.rooms[rm].memory.intel.spawn[1].id ).name ){
                if( Game.rooms[rm].memory.h2_type == 'v' ){
                    var dir = [RIGHT,TOP_RIGHT,BOTTOM_RIGHT]
                }
                else{
                    var dir = [BOTTOM,BOTTOM_RIGHT,BOTTOM_LEFT]
                }
            }
            else if( Game.rooms[rm].memory.intel.spawn[2] && Game.rooms[rm].memory.intel.spawn[2].id && sp == Game.getObjectById( Game.rooms[rm].memory.intel.spawn[2].id ).name ){
                var dir = [TOP_RIGHT,RIGHT,BOTTOM_RIGHT]
            }            

            if( !global.rooms[rm].energyStructures ){

                global.rooms[rm].energyStructures = []
                
                // spawn
                var spw_obj = Game.rooms[rm].find(FIND_MY_SPAWNS)
                if( spw_obj ){
                    for ( var i = 0; i < spw_obj.length ; i++) {
                        var cnt = global.rooms[rm].energyStructures.length
                        global.rooms[rm].energyStructures[cnt] = spw_obj[i]
                    }
                }
                
                // extension
                var ext_obj = Game.rooms[rm].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION }});
                
                if( ext_obj ){
                    // priorities
                    for ( var i = 0; i < ext_obj.length ; i++) {
                        
                        var xx = ext_obj[i].pos.x
                        var yy = ext_obj[i].pos.y
                        var prior = 0
                        
                        if( Game.rooms[rm].memory.h1_type == 'h' ){
                            if( xx >= Game.rooms[rm].memory.h1_x - 2 && xx <= Game.rooms[rm].memory.h1_x + 2 &&
                                yy >= Game.rooms[rm].memory.h1_y - 1 && yy <= Game.rooms[rm].memory.h1_y + 1 ){
                                var prior = 1   
                            }
                        }
                        else if( Game.rooms[rm].memory.h1_type == 'v' ){
                            if( xx >= Game.rooms[rm].memory.h1_x - 1 && xx <= Game.rooms[rm].memory.h1_x + 1 &&
                                yy >= Game.rooms[rm].memory.h1_y - 2 && yy <= Game.rooms[rm].memory.h1_y + 2 ){
                                var prior = 1     
                            }
                        }
                        
                        if( Game.rooms[rm].memory.h2_type == 'h' ){
                            if( xx >= Game.rooms[rm].memory.h2_x - 2 && xx <= Game.rooms[rm].memory.h2_x + 2 &&
                                yy >= Game.rooms[rm].memory.h2_y - 1 && yy <= Game.rooms[rm].memory.h2_y + 1 ){
                                var prior = 1      
                            }
                        }
                        else if( Game.rooms[rm].memory.h2_type == 'v' ){
                            if( xx >= Game.rooms[rm].memory.h2_x - 1 && xx <= Game.rooms[rm].memory.h2_x + 1 &&
                                yy >= Game.rooms[rm].memory.h2_y - 2 && yy <= Game.rooms[rm].memory.h2_y + 2 ){
                                var prior = 1     
                            }
                        }
                        
                        if( prior == 1 ){
                            var cnt = global.rooms[rm].energyStructures.length
                            global.rooms[rm].energyStructures[cnt] = ext_obj[i] 
                        }
                    }
                    
                    // low prior
                    for ( var i = 0; i < ext_obj.length ; i++) {
                        
                        var xx = ext_obj[i].pos.x
                        var yy = ext_obj[i].pos.y
                        var prior = 0
                        
                        if( Game.rooms[rm].memory.h1_type == 'h' ){
                            if( xx >= Game.rooms[rm].memory.h1_x - 2 && xx <= Game.rooms[rm].memory.h1_x + 2 &&
                                yy >= Game.rooms[rm].memory.h1_y - 1 && yy <= Game.rooms[rm].memory.h1_y + 1 ){
                                var prior = 1   
                            }
                        }
                        else if( Game.rooms[rm].memory.h1_type == 'v' ){
                            if( xx >= Game.rooms[rm].memory.h1_x - 1 && xx <= Game.rooms[rm].memory.h1_x + 1 &&
                                yy >= Game.rooms[rm].memory.h1_y - 2 && yy <= Game.rooms[rm].memory.h1_y + 2 ){
                                var prior = 1     
                            }
                        }
                        
                        if( Game.rooms[rm].memory.h2_type == 'h' ){
                            if( xx >= Game.rooms[rm].memory.h2_x - 2 && xx <= Game.rooms[rm].memory.h2_x + 2 &&
                                yy >= Game.rooms[rm].memory.h2_y - 1 && yy <= Game.rooms[rm].memory.h2_y + 1 ){
                                var prior = 1      
                            }
                        }
                        else if( Game.rooms[rm].memory.h2_type == 'v' ){
                            if( xx >= Game.rooms[rm].memory.h2_x - 1 && xx <= Game.rooms[rm].memory.h2_x + 1 &&
                                yy >= Game.rooms[rm].memory.h2_y - 2 && yy <= Game.rooms[rm].memory.h2_y + 2 ){
                                var prior = 1     
                            }
                        }
                        
                        if( prior == 0 ){
                            var cnt = global.rooms[rm].energyStructures.length
                            global.rooms[rm].energyStructures[cnt] = ext_obj[i] 
                        }
                    }
                }
            }

            var spawn_result = Game.spawns[sp].spawnCreep( body_ar, newName, {memory: { role         : role[0] ,
                                                                                        birth        : rm ,
                                                                                        birth_target : role[13] ,
                                                                                        birth_info   : role[14] ,
                                                                                        birth_info_2 : role[15] ,
                                                                                        birth_info_3 : role[16] ,
                                                                                        birth_info_4 : role[17] ,
                                                                                        birth_info_5 : role[18] },
                                                                                directions: dir,
                                                                                energyStructures: global.rooms[rm].energyStructures } )
   
                // var spawn_result = Game.spawns[sp].spawnCreep( body_ar, newName, {memory: { role         : role[0] ,
                //                                                                         birth        : rm ,
                //                                                                         birth_target : role[13] ,
                //                                                                         birth_info   : role[14] ,
                //                                                                         birth_info_2 : role[15] ,
                //                                                                         birth_info_3 : role[16] ,
                //                                                                         birth_info_4 : role[17] ,
                //                                                                         birth_info_5 : role[18] },
                //                                                                         directions: dir } )

                if( spawn_result != 0 ){
                    console.log("<font color=\"#FF0000\">Error on spawn: " + sp + " on room: " + rm + " error code: " + spawn_result + "</font>")
                    if( spawn_result == -6 ){
                        console.log("<font color=\"#FF0000\">Creep body: " + body_ar + "</font>") 
                        console.log("<font color=\"#FF0000\">Energy structures: " + global.rooms[rm].energyStructures + "</font>") 
                        console.log("<font color=\"#FF0000\">Energy available: " + Game.rooms[rm].energyAvailable + "</font>")    
                    }
                }

        }
        else {
            console.log('No spawn on room ' + rm)
        }        

        if( !spawn_result <= 0 ){
            var spawn_result =  2
        }

        return spawn_result;

    }
}

module.exports = functionSpawn;
