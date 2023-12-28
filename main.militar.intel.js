var mainMilitarIntel= {

    run: function( rm) {

        if( !global.rooms[rm] ){
            global.rooms[rm] = {}
        }

        // checa se já rodou nesse tick
        if( !global.rooms[rm].militarIntel_tick || global.rooms[rm].militarIntel_tick != Game.time ){
            
            // check for hostile creeps
            var enemies = Game.rooms[ rm ].find(FIND_HOSTILE_CREEPS, {filter: (creep) =>  {return ( _.intersection([creep.owner.username], Memory.config.ally_list).length == 0 ) } } );

            var towers = 0
            if( Game.rooms[rm].controller && !Game.rooms[rm].controller.my && Game.rooms[rm].controller.level >= 3 ){
                var towers = 1
            }
                
            if( enemies && enemies.length > 0 || towers == 1 ){

                global.rooms[rm].militarIntel_tick = Game.time

                if( !Memory.hostile ){
                    Memory.hostile = {}
                }

                var enemy_heal = 0
                var tough = 0
                var attack_creep = 0
                var ranged = 0
                var tower = 0
                var hits = 0

                // map body parts
                if( enemies.length > 0 ){
                                        
                    for ( var ii = 0 ; ii < enemies.length ; ii++){ 

                        // enemy  creep single
                        if( enemies[ii].getActiveBodyparts( HEAL ) > 0 || 
                            enemies[ii].getActiveBodyparts( TOUGH ) > 0 || 
                            enemies[ii].getActiveBodyparts( ATTACK ) > 0 || 
                            enemies[ii].getActiveBodyparts( RANGED_ATTACK ) > 0){

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
                                        var ranged = ranged + 40
                                    }
                                    else if( enemies[ii].body[iii].boost == 'KHO2'  ){
                                        var ranged = ranged + 30
                                    }
                                    else if( enemies[ii].body[iii].boost == 'KO'  ){
                                        var ranged = ranged + 20
                                    }
                                    else {
                                        var ranged = ranged + 10
                                    }
                                }
                            }
                        }
                        //

                        var hits = hits + enemies[ii].hits
                    }
                }
                //

                // tower
                if( towers == 1 ){
                    var objs = Game.rooms[rm].find(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_TOWER && structure.store['energy'] > 0 ) } } )

                    if( objs && objs.length > 0 ){                        
                        var tower = objs.length

                        if( Game.rooms[rm].controller && Game.rooms[rm].controller.level >= 8 ){
                            // ok
                        }
                        else if( Game.rooms[rm].controller && Game.rooms[rm].controller.level >= 7 ){
                            var tower = Math.max(tower, 3)
                        }
                        else if( Game.rooms[rm].controller && Game.rooms[rm].controller.level >= 5 ){
                            var tower = Math.max(tower, 2)
                        }
                        else if( Game.rooms[rm].controller && Game.rooms[rm].controller.level >= 3 ){
                            var tower = Math.max(tower, 1)
                        }
                        else{
                            var tower = 0
                        }
                    }
                }
                //

                Memory.hostile[ rm ]              = {}
                Memory.hostile[ rm ].rm           = rm

                Memory.hostile[ rm ].hostiles     = enemies.length
                Memory.hostile[ rm ].hits         = hits
                Memory.hostile[ rm ].heal         = enemy_heal
                Memory.hostile[ rm ].tough        = tough
                Memory.hostile[ rm ].attack       = attack_creep
                Memory.hostile[ rm ].ranged       = ranged
                Memory.hostile[ rm ].tower        = tower 

                Memory.hostile[ rm ].tick         = Game.time

            }     
            else{
                if( Memory.hostile[rm] ){
                    delete Memory.hostile[rm]
                }
            } 
        }
        //

   

        // temp remove from list
        if( Memory.hostile ){
            for(var rm in Memory.hostile ) {
                if( ( Game.time - Memory.hostile[rm].tick ) > 750 ){
                    delete Memory.hostile[rm]
                }
            }
        }
    }
};

module.exports = mainMilitarIntel;