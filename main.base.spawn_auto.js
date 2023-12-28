// auto garden spawn
var base1Auto_lvl0              = require('main.base.auto_lvl0')
var base1Auto_lvl1              = require('main.base.auto_lvl1')
var base1Auto_lvl2              = require('main.base.auto_lvl2')
var base1Auto_lvl4Controller0   = require('main.base.auto_lvl4.controller0')

var mainBase1ManagerSpawnAuto= {

    run: function(rm) {
      
        // prioritization
        if( Game.time % 25 == 0 ){

            Memory.attack_list = _.filter( Memory.attack_list , (target) => Game.time - target.detection_tick < 3100 && target.controller_lvl >= 1 )

            if( Memory.attack_list && Memory.attack_list.length > 0 ){
                
                var attack_list_active = _.filter( Memory.attack_list , (target) => Memory.attack_list[i].threat_lvl < 0 ).length

                for ( var i = 0 ; i < Memory.attack_list.length ; i++){
                    
                    // if( Memory.attack_list[i].rm == 'W8N48' ){
                    //     Memory.attack_list.splice(i,1)
                    //     if (i > 0) { i = i - 1 }
                    // }

                    if( Game.shard.name == 'swc' || Game.shard.name == 'screepsplus0' || Game.shard.name == 'ba' || Game.shard.name == 'botarena' ){
                        if( attack_list_active < 3 ){
                            if( Memory.attack_list[i].controller_lvl == 4 ){
                                Memory.attack_list[i].threat_lvl = Math.min( Memory.attack_list[i].threat_lvl , -8000 )
                            }
                            else if( Memory.attack_list[i].controller_lvl == 5 ){
                                Memory.attack_list[i].threat_lvl = Math.min( Memory.attack_list[i].threat_lvl , -7500 )
                            }
                            else if( Memory.attack_list[i].controller_lvl == 6 ){
                                Memory.attack_list[i].threat_lvl = Math.min( Memory.attack_list[i].threat_lvl , -7000 )
                            }
                            else if( Memory.attack_list[i].controller_lvl == 7 ){
                                Memory.attack_list[i].threat_lvl = Math.min( Memory.attack_list[i].threat_lvl , -6500 )
                            }
                            
                            var attack_list_active = _.filter( Memory.attack_list , (target) => Memory.attack_list[i].threat_lvl < 0 ).length
                        }
                    }
                    else{
                        if( Memory.attack_list[i].owner == 'Reyals' ){
                            Memory.attack_list[i].threat_lvl = Math.min( Memory.attack_list[i].threat_lvl , -10000 )
                        }
                        else if( Memory.attack_list[i].owner == 'DroidFreak' ){
                            Memory.attack_list[i].threat_lvl = Math.min( Memory.attack_list[i].threat_lvl , -8000 )
                        }
                        else if( Memory.attack_list[i].rm_sct == 'W8N49' ){
                            Memory.attack_list[i].threat_lvl = Math.min( Memory.attack_list[i].threat_lvl , -9000 )
                        }
                        else if( attack_list_active < 3 ){
                            if( Memory.attack_list[i].controller_lvl == 4 ){
                                Memory.attack_list[i].threat_lvl = Math.min( Memory.attack_list[i].threat_lvl , -8000 )
                            }
                            else if( Memory.attack_list[i].controller_lvl == 5 ){
                                Memory.attack_list[i].threat_lvl = Math.min( Memory.attack_list[i].threat_lvl , -7500 )
                            }
                            else if( Memory.attack_list[i].controller_lvl == 6 ){
                                Memory.attack_list[i].threat_lvl = Math.min( Memory.attack_list[i].threat_lvl , -7000 )
                            }
                            else if( Memory.attack_list[i].controller_lvl == 7 ){
                                Memory.attack_list[i].threat_lvl = Math.min( Memory.attack_list[i].threat_lvl , -6500 )
                            }
                            
                            var attack_list_active = _.filter( Memory.attack_list , (target) => Memory.attack_list[i].threat_lvl < 0 ).length
                        }
                    }
                }
            }
        }
        //


        // main attack loop
        if( Memory.attack_list && Memory.attack_list.length > 0 ){

            // check global boosts
            var boost_per_room = 14000
            var max = Memory.stats.number_rooms * boost_per_room
            
            // T3 boosts
            if( Memory.stats.minerals['XUH2O'] > boost_per_room * 3 &&
                Memory.stats.minerals['XKHO2'] > boost_per_room * 3 &&
                Memory.stats.minerals['XLHO2'] > boost_per_room * 3 &&
                Memory.stats.minerals['XZHO2'] > boost_per_room * 3 &&
                Memory.stats.minerals['XZH2O'] > boost_per_room * 3 &&
                Memory.stats.minerals['XGHO2'] > boost_per_room * 3
            ){
                var run = 1
                var runs_simultaneous = 3
            }
            else if( Memory.stats.minerals['XUH2O'] > boost_per_room * 2 &&
                Memory.stats.minerals['XKHO2'] > boost_per_room * 2 &&
                Memory.stats.minerals['XLHO2'] > boost_per_room * 2 &&
                Memory.stats.minerals['XZHO2'] > boost_per_room * 2 &&
                Memory.stats.minerals['XZH2O'] > boost_per_room * 2 &&
                Memory.stats.minerals['XGHO2'] > boost_per_room * 2
            ){
                var run = 1
                var runs_simultaneous = 2
            }
            else if( Memory.stats.minerals['XUH2O'] > boost_per_room * .6 &&
                Memory.stats.minerals['XKHO2'] >= boost_per_room * .6 &&
                Memory.stats.minerals['XLHO2'] >= boost_per_room * .6 &&
                Memory.stats.minerals['XZHO2'] >= boost_per_room * .6 &&
                Memory.stats.minerals['XZH2O'] >= boost_per_room * .6 &&
                Memory.stats.minerals['XGHO2'] >= boost_per_room * .6
            ){
                var run = 1
                var runs_simultaneous = 1
            }
            else{
                var run = 0
                var runs_simultaneous = 0
            }

            if( Memory.attack_list && Memory.attack_list.length < runs_simultaneous ){
                var runs_simultaneous = Memory.attack_list.length
            }
            //

            // T1 boost
            if( run == 0 ){
                if( Memory.stats.minerals['UH'] > boost_per_room * .6 &&
                    Memory.stats.minerals['KO'] >= boost_per_room * .6 &&
                    Memory.stats.minerals['LO'] >= boost_per_room * .6 &&
                    Memory.stats.minerals['ZO'] >= boost_per_room * .6 
                ){
                    var run_t1 = 1
                    var runs_simultaneous_t1 = 1
                }
                else{
                    var run_t1 = 0
                    var runs_simultaneous_t1 = 0
                }

                if( Memory.attack_list && Memory.attack_list.length < runs_simultaneous_t1 ){
                    var runs_simultaneous_t1 = Memory.attack_list.length
                }
            }
            //            


            // decide to attack or not
            // t3 boosts
            if( run == 1 && runs_simultaneous > 0 && _.filter( Memory.attack_list , (target) => target.threat_lvl < 0 ).length < runs_simultaneous ){
                
                console.log( _.filter( Memory.attack_list , (target) => target.threat_lvl < 0 && target.count_tower > 3 ).length, _.filter( Memory.attack_list , (target) => target.threat_lvl < 0 && target.rm == rm ).length  )
                
                // checa se tem algum ataque em andamento em sala com muitas torres
                if( _.filter( Memory.attack_list , (target) => target.threat_lvl < 0 && target.count_tower > 3 ).length > 0 ){
                    // do nothing
                }
                // checa se já está na lista para até 2 attaques concorrentes (nesse caso não faz nada)
                else if( _.filter( Memory.attack_list , (target) => target.threat_lvl < 0 && target.rm == rm ).length >= 2 ){
                    // do nothing
                }
                // adiciona à lista de ataque
                else{

                    for ( var iii = 0 ; iii < Memory.attack_list.length ; iii++){

                        if( Memory.attack_list[iii].rm == rm && Memory.attack_list[iii].threat_lvl > 0 && 
                            ( ( Game.rooms[rm] && Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].controller.level == 7 &&  Memory.attack_list[iii].controller_lvl <= 7 ) ||
                              ( Game.rooms[rm] && Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].controller.level == 8 &&  Memory.attack_list[iii].controller_lvl <= 8 ) )
                            ){

                            Memory.attack_list[iii].threat_lvl = - Math.abs( Memory.attack_list[iii].threat_lvl )
                            Memory.attack_list = _.sortBy(Memory.attack_list, 'threat_lvl')
                            break;

                        }
                    }
                }
            }
            else if( run == 0 && run_t1 == 1 && runs_simultaneous_t1 > 0 && _.filter( Memory.attack_list , (target) => target.threat_lvl < 0 ).length < runs_simultaneous ){
                
                console.log( _.filter( Memory.attack_list , (target) => target.threat_lvl < 0 && target.count_tower > 3 ).length, _.filter( Memory.attack_list , (target) => target.threat_lvl < 0 && target.rm == rm ).length  )
                
                // checa se tem algum ataque em andamento em sala com muitas torres
                if( _.filter( Memory.attack_list , (target) => target.threat_lvl < 0 && target.count_tower > 3 ).length > 0 ){
                    // do nothing
                }
                // checa se já está na lista para até 2 attaques concorrentes (nesse caso não faz nada)
                else if( _.filter( Memory.attack_list , (target) => target.threat_lvl < 0 && target.rm == rm ).length >= 2 ){
                    // do nothing
                }
                // adiciona à lista de ataque
                else{



                    for ( var iii = 0 ; iii < Memory.attack_list.length ; iii++){

                        if( Memory.attack_list[iii].rm == rm && Memory.attack_list[iii].threat_lvl > 0 && 
                             ( ( Game.rooms[rm] && Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].controller.level == 7 &&  Memory.attack_list[iii].controller_lvl <= 6 ) ||
                               ( Game.rooms[rm] && Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].controller.level == 6 &&  Memory.attack_list[iii].controller_lvl <= 4 ) )
                             ){

                            Memory.attack_list[iii].threat_lvl = - Math.abs( Memory.attack_list[iii].threat_lvl )
                            Memory.attack_list = _.sortBy(Memory.attack_list, 'threat_lvl')

                            // bypass
                            var run = 1
                            var runs_simultaneous = 1

                            break;

                        }
                    }
                }
            }
            //


            // remove from attack if same room has more than one target
            if( Game.time % 11 == 0  ){

                var rm_mix = []

                for ( var iii = 0 ; iii < Memory.attack_list.length ; iii++){

                    if( Memory.attack_list[iii].threat_lvl < 0 ){

                        if( rm_mix.length > 0 ){
                            for ( var iiii = 0 ; iiii < rm_mix.length ; iiii++){
                                var new_rm = 1
                                if( Memory.attack_list[iii].rm == rm_mix[iiii] ){
                                    var new_rm = 0
                                    Memory.attack_list.splice(iii,1)
                                    if (iii > 0) { iii = iii - 1 }
                                    Memory.attack_list = _.sortBy(Memory.attack_list, 'threat_lvl')
                                    break
                                }

                            }
                            if( new_rm == 1 ){
                                rm_mix[rm_mix.length] = Memory.attack_list[iii].rm
                            }
                        }
                        else{
                            rm_mix[0] = Memory.attack_list[iii].rm
                        }
                    }
                    else{
                        break
                    }
                }
            }
            //

            // remove if beign nuker and low energy
            if( ( Game.rooms[rm].memory.mode_nuke == 1 || 
                ( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] < Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.auto_attack ) ) ){
                for ( var iii = 0 ; iii < Memory.attack_list.length ; iii++){
                    if( Memory.attack_list[iii] && Memory.attack_list[iii].rm && Memory.attack_list[iii].rm == rm ){
                        console.log('Removing from attack list due to nuke or low energy: ', rm, Game.rooms[rm].memory.mode_nuke)
                        Memory.attack_list.splice(iii,1)
                        break;
                    }
                }
            }
            //


            // check room lab
            if( Memory.attack_list &&
                ( ( Memory.attack_list[0] && runs_simultaneous >= 1 && !Memory.autoAttackBoostLabs[ Memory.attack_list[0].rm ] ) ||
                  ( Memory.attack_list[1] && runs_simultaneous >= 2 && !Memory.autoAttackBoostLabs[ Memory.attack_list[1].rm ] ) ||
                  ( Memory.attack_list[2] && runs_simultaneous >= 3 && !Memory.autoAttackBoostLabs[ Memory.attack_list[2].rm ] ) ||
                  ( Memory.attack_list[3] && runs_simultaneous >= 4 && !Memory.autoAttackBoostLabs[ Memory.attack_list[3].rm ] ) ||
                  ( Memory.attack_list[4] && runs_simultaneous >= 5 && !Memory.autoAttackBoostLabs[ Memory.attack_list[4].rm ] ) ) ){
          
                Memory.autoAttackBoostLabs = {}

                if( Memory.attack_list.length < runs_simultaneous ){
                    var runs_simultaneous = Memory.attack_list.length
                }

                for ( var kk = 0 ; kk < runs_simultaneous ; kk++){

                    var rm = Memory.attack_list[kk].rm

                    if( Game.rooms[rm] && Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].controller.level >= 6 ){

                        if(  run_t1 >= 1 &&
                           ( ( Game.rooms[rm].controller.level == 7 &&  Memory.attack_list[kk].controller_lvl <= 6 ) ||
                             ( Game.rooms[rm].controller.level == 6 &&  Memory.attack_list[kk].controller_lvl <= 4 ) ) ){
                        
                            Game.rooms[rm].memory.lab_boost_1 = 'boost1'
                            Game.rooms[rm].memory.lab_boost_2 = 'boost1'
    
                            Memory.autoAttackBoostLabs[ rm ] = {}
                            Memory.autoAttackBoostLabs[ rm ].tick  = Game.time
                            Memory.autoAttackBoostLabs[ rm ].boost = 'boost1'

                            if( !global.labtypes ){
                                Memory.oneTimer.lab  = 1
                            }
                            else{
                                // set boost for the room
                                for( var kkk = 0; kkk < global.labtypes.length ; kkk++ ){
                                    if( global.labtypes[kkk][0] == 'boost1' ){
                                        // set lab
                                        for( var jj = 0; jj <  Game.rooms[rm].memory.intel.lab.length ; jj++ ){
    
                                            Game.rooms[rm].memory.intel.lab[jj].min = global.labtypes[kkk][ jj * 2 + 1 ]
                                            Game.rooms[rm].memory.intel.lab[jj].sts = global.labtypes[kkk][ jj * 2 + 2 ]
                                        }
                
                                        break;
                                    }
                                }
                            }
                        }                        
                        else if( ( Game.rooms[rm].controller.level == 7 &&  Memory.attack_list[kk].controller_lvl <= 7 ) ||
                                 ( Game.rooms[rm].controller.level == 8 &&  Memory.attack_list[kk].controller_lvl <= 8 ) ){

                            Game.rooms[rm].memory.lab_boost_1 = 'boost3'
                            Game.rooms[rm].memory.lab_boost_2 = 'boost3'
    
                            Memory.autoAttackBoostLabs[ rm ] = {}
                            Memory.autoAttackBoostLabs[ rm ].tick  = Game.time
                            Memory.autoAttackBoostLabs[ rm ].boost = 'boost3'

                            if( !global.labtypes ){
                                Memory.oneTimer.lab  = 1
                            }
                            else{
                                // set boost for the room
                                for( var kkk = 0; kkk < global.labtypes.length ; kkk++ ){
                                    if( global.labtypes[kkk][0] == 'boost3' ){
                                        // set lab
                                        for( var jj = 0; jj <  Game.rooms[rm].memory.intel.lab.length ; jj++ ){
    
                                            Game.rooms[rm].memory.intel.lab[jj].min = global.labtypes[kkk][ jj * 2 + 1 ]
                                            Game.rooms[rm].memory.intel.lab[jj].sts = global.labtypes[kkk][ jj * 2 + 2 ]
                                        }
                
                                        break;
                                    }
                                }
                            }
                        }
                        else{
                            Memory.attack_list.splice(kk,1)
                        }
                    } 
                    else{
                        Memory.attack_list.splice(kk,1)
                    }                   
                }
            }
            //

            if( runs_simultaneous > 0 ){

                for ( var kk = 0 ; kk < runs_simultaneous ; kk++){
                   
                    // main loop
                    if( Memory.attack_list && Memory.attack_list[kk] && Memory.attack_list[kk].rm == rm &&
                        Memory.autoAttackBoostLabs[ rm ]  ){

                        // 0 - check if attackable
                        // 1 - spawn scout
                        // 2 - scout spawned - not reach room yet
                        // 3 - room was reached
                        // 4 - controller was reached
                        // 5 - controller was not reached

                        // 100 - controller reserving ongoing

                        // 1000 - sucessful attack

                        var change_in_matrix = 0
                        var rm_tgt = Memory.attack_list[kk].rm_sct

                        // remove from avoid rooms list
                        delete Memory.avoidRooms_observer[ rm_tgt ]

                        // level 0 - check if room is attackable -- run==1 to only get new rooms if boost are high level
                        if( Memory.attack_list[kk].attack_level == 0 && run == 1 ){

                            if( Game.rooms[rm].controller < 6 || !Game.rooms[rm].controller.my ){
                                Memory.attack_list.splice(kk,1)
                            }
                            else{
                                base1Auto_lvl0.run( kk )
                            }
                        }
                        //

                        // level 1 - scout to know if can reach the room
                        if( Memory.attack_list[kk].attack_level == 1 ){

                            var return0 = base1Auto_lvl1.run( kk, rm_tgt )

                            var change_in_matrix    = return0[0]
                            var roles               = return0[1]
                        }
                        //

                        // level 2 - if on this for too long scout was unable to reach room
                        if( Memory.attack_list[kk].attack_level == 2 ){

                            base1Auto_lvl2.run( kk, rm, rm_tgt )
                        }
                        //

                        // level 3 - scout reached room ready to send attack, decide which type
                        if( Memory.attack_list[kk].attack_level == 3 ){
                            // why does it exists?
                        }

                        // level 4 - scout reached room and controller is reachable || OR || level 5 - controller was not reached
                        if( Memory.attack_list[kk].attack_level == 4 || Memory.attack_list[kk].attack_level == 5 ){

                            // controler_my
                            //  1 - my room
                            //  0 - my reservation
                            // -1 - no owner, no reservation
                            // -2 - other reservation
                            // -3 - other owner

                            // controller level 0
                            if( Memory.attack_list[kk].controller_lvl == 0 ){

                                var return0 = base1Auto_lvl4Controller0.run( kk, rm_tgt, rm )

                                var change_in_matrix    = return0[0]
                                var roles               = return0[1]
                            }
                            // increase threat if safe mode is on
                            else if( Memory.attack_list[kk].controller_safe > 0 ){

                                Memory.attack_list.splice(kk,1)

                            }
                            // controller > 0 , no spawn , no towers
                            else if( Memory.attack_list[kk].controller_lvl > 0 && Memory.attack_list[kk].controller_my == -3 && Memory.attack_list[kk].count_spawn == 0 && Memory.attack_list[kk].count_tower == 0 && Memory.attack_list[kk].controller_safe == 0 ){

                                if( Game.time - Memory.attack_list[kk].detection_tick > 2000 ||
                                  ( Memory.attack_list[kk].claim_count && Memory.attack_list[kk].claim_count > (1 + 1) ) ||
                                  ( Memory.attack_list[kk].creep_count && Memory.attack_list[kk].creep_count > (4 + 4) ) ||
                                  ( Memory.attack_list[kk].fixed_threat > 3000 ) ){

                                    Memory.attack_list[kk].fixed_threat = Memory.attack_list[kk].fixed_threat + 1000
                                    Memory.attack_list[kk].threat_lvl   = Math.abs( Memory.attack_list[kk].threat_lvl - 1000/2 )
                                    Memory.attack_list[kk].attack_level = 0
                                    Memory.attack_list[kk].creep_count  = 0
                                    Memory.attack_list[kk].claim_count  = 0

                                    Memory.attack_list = _.sortBy(Memory.attack_list, 'threat_lvl')
                                }
                                else{
                                    var change_in_matrix = 1

                                    // controller 8 boost 3
                                    if( Game.rooms[rm].controller.level == 8 && Memory.autoAttackBoostLabs[ rm ].boost == 'boost3' ){
                                        if( !Memory.attack_list[kk].fixed_threat || Memory.attack_list[kk].fixed_threat < 10000 ){
                                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                            var roles = [
                                                ['controller_att',     0,  0,     0,    28,      0,       0,       0,      0,     0,      18,     '',       0,      rm_tgt, 149,       '0',            '0',            '40',        '0'    ],

                                                ['2a_healer',          0,  1,     0,    25,      0,       0,       0,      0,    25,       0,     '',       0,      rm_tgt, 145,       '0',            '0',            '40',        '0'    ],
                                                ['2a_capt',            0,  1,     0,    30,      0,       0,      10,     10,     0,       0,     '',       0,      rm_tgt, 145,       '1',            '0',            '40',        '0'    ],

                                                ['blinker',            0,  1,     0,    30,      0,       0,       0,     15,     5,       0,     '',     300,      rm_tgt, 146,       '0',            '0',            '40',        '0'    ],
                                                ['blinker',            0,  1,     0,    25,      0,       0,      20,      0,     5,       0,     '',     300,      rm_tgt, 147,       '0',            '0',            '41',        '0'    ]
                                                ]
                                        }
                                        else{
                                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                            var roles = [
                                                ['controller_att',     0,  0,     0,    28,      0,       0,       0,      0,     0,      18,     '',       0,      rm_tgt, 149,       '0',            '0',            '40',        '0'    ],

                                                ['2a_healer',          0,  1,    10,    10,      0,       0,       0,      0,    30,       0,     '',       0,      rm_tgt, 140,       '0',            '1',            '40',        '0'    ],
                                                ['2a_capt',            0,  1,    10,    10,      0,       0,      20,     10,     0,       0,     '',       0,      rm_tgt, 140,       '1',            '1',            '40',        '0'    ],

                                                ['blinker',            0,  1,    11,    10,      0,       0,       0,      6,    23,       0,     '',       0,      rm_tgt, 141,       '0',            '1',            '42',        '0'    ]  // 6 towers
                                                ]
                                        }
                                    }
                                    // controller 7 boost 3 or boost 1
                                    else if( Game.rooms[rm].controller.level == 7 && ( Memory.autoAttackBoostLabs[ rm ].boost == 'boost3' || Memory.autoAttackBoostLabs[ rm ].boost == 'boost1') ){
                                        if( !Memory.attack_list[kk].fixed_threat || Memory.attack_list[kk].fixed_threat < 10000 ){
                                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                            var roles = [
                                                ['controller_att',     0,  0,     0,    28,      0,       0,       0,      0,     0,      18,     '',       0,      rm_tgt, 149,       '0',            '0',            '40',        '0'    ],

                                                ['2a_healer',          0,  1,     0,    17,      0,       0,       0,      0,    17,       0,     '',       0,      rm_tgt, 147,       '0',            '0',            '40',        '0'    ],
                                                ['2a_capt',            0,  1,     0,    25,      0,       0,       0,     25,     0,       0,     '',       0,      rm_tgt, 147,       '1',            '0',            '40',        '0'    ],

                                                ['2a_healer',          0,  1,     0,    17,      0,       0,       0,      0,    17,       0,     '',       0,      rm_tgt, 148,       '0',            '0',            '41',        '0'    ],
                                                ['2a_capt',            0,  1,     0,    25,      0,       0,      25,      0,     0,       0,     '',       0,      rm_tgt, 148,       '1',            '0',            '41',        '0'    ]

                                                ]
                                        }
                                        else{
                                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                            var roles = [
                                                ['controller_att',     0,  0,     0,    28,      0,       0,       0,      0,     0,      18,     '',       0,      rm_tgt, 149,       '0',            '0',            '40',        '0'    ],

                                                ['2a_healer',          0,  1,     0,     9,      0,       0,       0,      0,    18,       0,     '',       0,      rm_tgt, 147,       '0',            '1',            '40',        '0'    ],
                                                ['2a_capt',            0,  1,     0,    13,      0,       0,       0,     26,     0,       0,     '',       0,      rm_tgt, 147,       '1',            '1',            '40',        '0'    ],

                                                ['2a_healer',          0,  1,     0,     9,      0,       0,       0,      0,    18,       0,     '',       0,      rm_tgt, 148,       '0',            '1',            '41',        '0'    ],
                                                ['2a_capt',            0,  1,     0,    13,      0,       0,      26,      0,     0,       0,     '',       0,      rm_tgt, 148,       '1',            '1',            '41',        '0'    ]
                                                ]
                                        }
                                    }
                                    // controller 6 boost 1
                                    else if( Game.rooms[rm].controller.level == 6 && Memory.autoAttackBoostLabs[ rm ].boost == 'boost1' ){
                                        if( !Memory.attack_list[kk].fixed_threat || Memory.attack_list[kk].fixed_threat < 10000 ){
                                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                            var roles = [
                                                ['controller_att',     0,  0,     0,    28,      0,       0,       0,      0,     0,      18,     '',       0,      rm_tgt, 149,       '0',            '0',            '40',        '0'    ],

                                                ['2a_healer',          0,  1,     0,     7,      0,       0,       0,      0,     7,       0,     '',       0,      rm_tgt, 147,       '0',            '0',            '40',        '0'    ],
                                                ['2a_capt',            0,  1,     0,    11,      0,       0,       0,     11,     0,       0,     '',       0,      rm_tgt, 147,       '1',            '0',            '40',        '0'    ],

                                                ['2a_healer',          0,  1,     0,     7,      0,       0,       0,      0,     7,       0,     '',       0,      rm_tgt, 148,       '0',            '0',            '41',        '0'    ],
                                                ['2a_capt',            0,  1,     0,    17,      0,       0,      17,      0,     0,       0,     '',       0,      rm_tgt, 148,       '1',            '0',            '41',        '0'    ]

                                                ]
                                        }
                                        else{
                                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                            var roles = [
                                                ['controller_att',     0,  0,     0,    28,      0,       0,       0,      0,     0,      18,     '',       0,      rm_tgt, 149,       '0',            '0',            '40',        '0'    ],

                                                ['2a_healer',          0,  1,     0,     4,      0,       0,       0,      0,     8,       0,     '',       0,      rm_tgt, 147,       '0',            '1',            '40',        '0'    ],
                                                ['2a_capt',            0,  1,     0,     6,      0,       0,       0,     12,     0,       0,     '',       0,      rm_tgt, 147,       '1',            '1',            '40',        '0'    ],

                                                ['2a_healer',          0,  1,     0,     4,      0,       0,       0,      0,     8,       0,     '',       0,      rm_tgt, 148,       '0',            '1',            '41',        '0'    ],
                                                ['2a_capt',            0,  1,     0,    10,      0,       0,      20,      0,     0,       0,     '',       0,      rm_tgt, 148,       '1',            '1',            '41',        '0'    ]
                                                ]
                                        }
                                    }

                                    var rm_tmp = roles[0][13]
                                    if( Memory.attack_list[kk].attack_level == 4 && Game.rooms[rm_tgt] && !Game.rooms[rm_tgt].controller.my && ( !Game.rooms[rm_tgt].controller.upgradeBlocked || Game.rooms[rm_tgt].controller.upgradeBlocked < 650) && 1 == 1 ){
                                        roles[0][2] = Math.min(3, Memory.attack_list[kk].controller_vic )
                                    }
                                }
                            }
                            // controller > 0 , HAS spawn , towers up to 2
                            else if( Memory.attack_list[kk].controller_lvl > 0 && Memory.attack_list[kk].controller_my == -3 && Memory.attack_list[kk].count_spawn > 0 && ( Memory.attack_list[kk].count_tower <= 2 || Memory.attack_list[kk].controller_lvl <= 6 ) && Memory.attack_list[kk].controller_safe == 0 ){

                                if( Game.time - Memory.attack_list[kk].detection_tick > 2000 ||
                                  ( Memory.attack_list[kk].claim_count && Memory.attack_list[kk].claim_count > (1 + 1) ) ||
                                  ( Memory.attack_list[kk].creep_count && Memory.attack_list[kk].creep_count > (5 + 4) ) ||
                                  ( Memory.attack_list[kk].fixed_threat > 3000 ) ){

                                    Memory.attack_list[kk].fixed_threat = Memory.attack_list[kk].fixed_threat + 1000
                                    Memory.attack_list[kk].threat_lvl   = Math.abs( Memory.attack_list[kk].threat_lvl - 1000/2 )
                                    Memory.attack_list[kk].attack_level = 0
                                    Memory.attack_list[kk].creep_count  = 0
                                    Memory.attack_list[kk].claim_count  = 0

                                    Memory.attack_list = _.sortBy(Memory.attack_list, 'threat_lvl')
                                }
                                else{
                                    var change_in_matrix = 1

                                    // controller 8 boost 3
                                    if( Game.rooms[rm].controller.level == 8 && Memory.autoAttackBoostLabs[ rm ].boost == 'boost3' ){
                                        if( !Memory.attack_list[kk].fixed_threat || Memory.attack_list[kk].fixed_threat < 10000 ){

                                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                            var roles = [
                                                ['controller_att',     0,  0,     0,    28,      0,       0,       0,      0,     0,      18,     '',       0,      rm_tgt, 151,       '0',            '0',            '40',        '0'    ],

                                                ['2a_healer',          0,  1,     5,    10,      0,       0,       0,      5,    30,       0,     '',       0,      rm_tgt, 148,       '0',            '1',            '40',        '0'    ],
                                                ['2a_capt',            0,  1,     5,    10,      0,       0,      25,     10,     0,       0,     '',       0,      rm_tgt, 148,       '1',            '1',            '40',        '0'    ],

                                                ['2a_healer',          0,  1,     5,    10,      0,       0,       0,      5,    30,       0,     '',       0,      rm_tgt, 149,       '0',            '1',            '41',        '0'    ],
                                                ['2a_capt',            0,  1,     5,    10,     25,       0,       0,     10,     0,       0,     '',       0,      rm_tgt, 149,       '1',            '1',            '41',        '0'    ],

                                                ['blinker',            0,  1,     6,    10,      0,       0,       0,     21,    13,       0,     '',       0,      rm_tgt, 147,       '0',            '1',            '40',        '0'    ]

                                                ]

                                            var rm_tmp = roles[0][13]
                                            if( Memory.attack_list[kk].attack_level == 4 && Game.rooms[rm_tgt] && !Game.rooms[rm_tgt].controller.my && ( !Game.rooms[rm_tgt].controller.upgradeBlocked || Game.rooms[rm_tgt].controller.upgradeBlocked < 650 ) && 1 == 1 ){
                                                roles[0][2] = Math.min(3, Memory.attack_list[kk].controller_vic )
                                            }
                                        }
                                        else{

                                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                            var roles = [
                                                ['controller_att',     0,  0,     0,    28,      0,       0,       0,      0,     0,      18,     '',       0,      rm_tgt, 151,       '0',            '0',            '40',        '0'    ],

                                                ['2a_healer',          0,  1,     5,    10,      0,       0,       0,      5,    30,       0,     '',       0,      rm_tgt, 148,       '0',            '1',            '40',        '0'    ],
                                                ['2a_capt',            0,  1,     5,    10,      0,       0,      25,     10,     0,       0,     '',       0,      rm_tgt, 148,       '1',            '1',            '40',        '0'    ],

                                                ['blinker',            0,  1,     6,    10,      0,       0,       0,     21,    13,       0,     '',       0,      rm_tgt, 147,       '0',            '1',            '40',        '0'    ]
                                                ]

                                            var rm_tmp = roles[0][13]
                                            if( Memory.attack_list[kk].attack_level == 4 && Game.rooms[rm_tgt] && !Game.rooms[rm_tgt].controller.my && ( !Game.rooms[rm_tgt].controller.upgradeBlocked || Game.rooms[rm_tgt].controller.upgradeBlocked < 650 ) && 1 == 1 ){
                                                roles[0][2] = Math.min(3, Memory.attack_list[kk].controller_vic )
                                            }
                                        }
                                    }
                                    // controller 7 boost 3 
                                    else if( Game.rooms[rm].controller.level == 7 && Memory.autoAttackBoostLabs[ rm ].boost == 'boost3' ){                                

                                        // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                        var roles = [
                                            ['controller_att',     0,  0,     0,    28,      0,       0,       0,      0,     0,      18,     '',       0,      rm_tgt, 151,       '0',            '0',            '40',        '0'    ],

                                            // SQUAD
                                            ['squad',              0,  1,     0,    10,      0,       0,      40,      0,     0,       0,     '',       0,      rm_tgt, 145,       '1',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     0,     5,      0,       0,       0,      0,    20,       0,     '',       0,      rm_tgt, 145,       '2',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     0,     5,      0,       0,       0,      0,    20,       0,     '',       0,      rm_tgt, 145,       '3',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     0,     6,      0,       0,       0,     10,    14,       0,     '',       0,      rm_tgt, 145,       '4',            '1',            '40',        '0'    ]

                                            ]

                                        var rm_tmp = roles[0][13]
                                        if( Memory.attack_list[kk].attack_level == 4 && Game.rooms[rm_tgt] && !Game.rooms[rm_tgt].controller.my && ( !Game.rooms[rm_tgt].controller.upgradeBlocked || Game.rooms[rm_tgt].controller.upgradeBlocked < 650 ) && 1 == 1 ){
                                            roles[0][2] = Math.min(3, Memory.attack_list[kk].controller_vic )
                                        }  
                                    }
                                    // controller 7 boost 1
                                    else if( Game.rooms[rm].controller.level == 7 && Memory.autoAttackBoostLabs[ rm ].boost == 'boost1' ){                                   

                                        // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                        var roles = [
                                            ['controller_att',     0,  0,     0,    28,      0,       0,       0,      0,     0,      18,     '',       0,      rm_tgt, 151,       '0',            '0',            '40',        '0'    ],

                                            // SQUAD
                                            ['squad',              0,  1,     0,    15,      0,       0,      25,      5,     0,       0,     '',       0,      rm_tgt, 145,       '1',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     0,    10,      0,       0,       0,      0,    20,       0,     '',       0,      rm_tgt, 145,       '2',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     0,    10,      0,       0,       0,      0,    20,       0,     '',       0,      rm_tgt, 145,       '3',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     0,    10,      0,       0,       0,      0,    20,       0,     '',       0,      rm_tgt, 145,       '4',            '1',            '40',        '0'    ]

                                            ]

                                        var rm_tmp = roles[0][13]
                                        if( Memory.attack_list[kk].attack_level == 4 && Game.rooms[rm_tgt] && !Game.rooms[rm_tgt].controller.my && ( !Game.rooms[rm_tgt].controller.upgradeBlocked || Game.rooms[rm_tgt].controller.upgradeBlocked < 650 ) && 1 == 1 ){
                                            roles[0][2] = Math.min(3, Memory.attack_list[kk].controller_vic )
                                        }                                       
                                    }
                                    // controller 6 boost 1
                                    else if( Game.rooms[rm].controller.level == 6 && Memory.autoAttackBoostLabs[ rm ].boost == 'boost1' ){
                       
                                        // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                        var roles = [
                                            ['controller_att',     0,  0,     0,    28,      0,       0,       0,      0,     0,      18,     '',       0,      rm_tgt, 151,       '0',            '0',            '40',        '0'    ],

                                            // SQUAD
                                            ['squad',              0,  1,     0,     8,      0,       0,      11,      5,     0,       0,     '',       0,      rm_tgt, 145,       '1',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     0,     4,      0,       0,       0,      0,     8,       0,     '',       0,      rm_tgt, 145,       '2',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     0,     4,      0,       0,       0,      0,     8,       0,     '',       0,      rm_tgt, 145,       '3',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     0,     4,      0,       0,       0,      0,     8,       0,     '',       0,      rm_tgt, 145,       '4',            '1',            '40',        '0'    ]

                                            ]

                                        var rm_tmp = roles[0][13]
                                        if( Memory.attack_list[kk].attack_level == 4 && Game.rooms[rm_tgt] && !Game.rooms[rm_tgt].controller.my && ( !Game.rooms[rm_tgt].controller.upgradeBlocked || Game.rooms[rm_tgt].controller.upgradeBlocked < 650 ) && 1 == 1 ){
                                            roles[0][2] = Math.min(3, Memory.attack_list[kk].controller_vic )
                                        }                                       
                                    }
                                }
                            }
                            // controller > 0 , HAS spawn , towers up to 3
                            else if( Memory.attack_list[kk].controller_lvl > 0 && Memory.attack_list[kk].controller_my == -3 && Memory.attack_list[kk].count_spawn > 0 && ( Memory.attack_list[kk].count_tower <= 3 || Memory.attack_list[kk].controller_lvl <= 7 ) && Memory.attack_list[kk].controller_safe == 0 ){

                                if( Game.time - Memory.attack_list[kk].detection_tick > 2000 ||
                                  ( Memory.attack_list[kk].claim_count && Memory.attack_list[kk].claim_count > (1 + 1) ) ||
                                  ( Memory.attack_list[kk].creep_count && Memory.attack_list[kk].creep_count > (12 + 4) ) ||
                                  ( Memory.attack_list[kk].fixed_threat > 3000 ) ){

                                    Memory.attack_list[kk].fixed_threat = Memory.attack_list[kk].fixed_threat + 1000
                                    Memory.attack_list[kk].threat_lvl   = Math.abs( Memory.attack_list[kk].threat_lvl - 1000/2 )
                                    Memory.attack_list[kk].attack_level = 0
                                    Memory.attack_list[kk].creep_count  = 0
                                    Memory.attack_list[kk].claim_count  = 0

                                    Memory.attack_list = _.sortBy(Memory.attack_list, 'threat_lvl')
                                }
                                else{
                                    var change_in_matrix = 1

                                    // controller 8 boost 3
                                    if( Game.rooms[rm].controller.level == 8 && Memory.autoAttackBoostLabs[ rm ].boost == 'boost3' ){
                                        // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                        var roles = [
                                            ['controller_att',     0,  0,     0,    21,      0,       0,       0,      0,     0,      19,     '',       0,      rm_tgt, 151,       '0',            '0',            '40',        '0'    ],

                                            // SQUAD
                                            ['squad',              0,  1,     5,    10,     35,       0,       0,      0,     0,       0,     '',       0,      rm_tgt, 145,       '1',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     5,    10,      0,       0,       0,     15,    20,       0,     '',       0,      rm_tgt, 145,       '2',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     5,    10,      0,       0,       0,     15,    20,       0,     '',       0,      rm_tgt, 145,       '3',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     0,    10,      0,       0,       0,      0,    40,       0,     '',       0,      rm_tgt, 145,       '4',            '1',            '40',        '0'    ],

                                            ['2a_healer',          0,  1,     7,    10,      0,       0,       0,      8,    25,       0,     '',       0,      rm_tgt, 148,       '0',            '1',            '40',        '0'    ],
                                            ['2a_capt',            0,  1,     7,    10,      0,       0,      25,      8,     0,       0,     '',       0,      rm_tgt, 148,       '1',            '1',            '40',        '0'    ]
                                            ]
                                    }
                                    // controller 7 boost 3 
                                    else if( Game.rooms[rm].controller.level == 7 && Memory.autoAttackBoostLabs[ rm ].boost == 'boost3' ){
                                        // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                        var roles = [
                                            ['controller_att',     0,  0,     0,    21,      0,       0,       0,      0,     0,      19,     '',       0,      rm_tgt, 151,       '0',            '0',            '40',        '0'    ],

                                           // SQUAD
                                           ['squad',              0,  1,     0,    10,      0,       0,      40,      0,     0,       0,     '',       0,      rm_tgt, 145,       '1',            '1',            '40',        '0'    ],
                                           ['squad',              0,  1,     0,     5,      0,       0,       0,      0,    20,       0,     '',       0,      rm_tgt, 145,       '2',            '1',            '40',        '0'    ],
                                           ['squad',              0,  1,     0,     5,      0,       0,       0,      0,    20,       0,     '',       0,      rm_tgt, 145,       '3',            '1',            '40',        '0'    ],
                                           ['squad',              0,  1,     0,     6,      0,       0,       0,     10,    14,       0,     '',       0,      rm_tgt, 145,       '4',            '1',            '40',        '0'    ]
                                             ]
                                    }
                                    // controller 7 boost 1
                                    else if( Game.rooms[rm].controller.level == 7 && Memory.autoAttackBoostLabs[ rm ].boost == 'boost1' ){
                                        // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                        var roles = [
                                            ['controller_att',     0,  0,     0,    21,      0,       0,       0,      0,     0,      19,     '',       0,      rm_tgt, 151,       '0',            '0',            '40',        '0'    ],

                                            // SQUAD
                                            ['squad',              0,  1,     0,    15,      0,       0,      25,      5,     0,       0,     '',       0,      rm_tgt, 145,       '1',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     0,    10,      0,       0,       0,      0,    20,       0,     '',       0,      rm_tgt, 145,       '2',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     0,    10,      0,       0,       0,      0,    20,       0,     '',       0,      rm_tgt, 145,       '3',            '1',            '40',        '0'    ],
                                            ['squad',              0,  1,     0,    10,      0,       0,       0,      0,    20,       0,     '',       0,      rm_tgt, 145,       '4',            '1',            '40',        '0'    ]

                                            ]
                                    }

                                    var rm_tmp = roles[0][13]
                                    if( Memory.attack_list[kk].attack_level == 4 && Game.rooms[rm_tgt] && !Game.rooms[rm_tgt].controller.my && ( !Game.rooms[rm_tgt].controller.upgradeBlocked || Game.rooms[rm_tgt].controller.upgradeBlocked < 650 ) && 1 == 1 ){
                                        roles[0][2] = Math.min(3, Memory.attack_list[kk].controller_vic )
                                    }
                                }
                            }
                            // controller > 0 , HAS spawn , more than 3 towers
                            else{

                                if( Game.time - Memory.attack_list[kk].detection_tick > 2000 ||
                                  ( Memory.attack_list[kk].claim_count && Memory.attack_list[kk].claim_count > (1 + 1) ) ||
                                  ( Memory.attack_list[kk].creep_count && Memory.attack_list[kk].creep_count > (9 + 4) ) ||
                                  ( Memory.attack_list[kk].fixed_threat > 3000 ) ){

                                    Memory.attack_list[kk].fixed_threat = Memory.attack_list[kk].fixed_threat + 1000
                                    Memory.attack_list[kk].threat_lvl   = Math.abs( Memory.attack_list[kk].threat_lvl - 1000/2 )
                                    Memory.attack_list[kk].attack_level = 0
                                    Memory.attack_list[kk].creep_count  = 0
                                    Memory.attack_list[kk].claim_count  = 0

                                    Memory.attack_list = _.sortBy(Memory.attack_list, 'threat_lvl')
                                }
                                else{
                                    var change_in_matrix = 1

                                     // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                    var roles = [
                                        ['controller_att',     0,  0,     0,    21,      0,       0,       0,      0,     0,      19,     '',       0,      rm_tgt, 151,       '0',            '0',            '40',        '0'    ],

                                        // SQUAD
                                        ['squad',              0,  1,    10,    10,     30,       0,       0,      0,     0,       0,     '',       0,      rm_tgt, 145,       '1',            '1',            '40',        '0'    ],
                                        ['squad',              0,  1,    10,    10,      0,       0,       0,     10,    20,       0,     '',       0,      rm_tgt, 145,       '2',            '1',            '40',        '0'    ],
                                        ['squad',              0,  1,    10,    10,      0,       0,       0,     10,    20,       0,     '',       0,      rm_tgt, 145,       '3',            '1',            '40',        '0'    ],
                                        ['squad',              0,  1,    10,    10,      0,       0,       0,      0,    30,       0,     '',       0,      rm_tgt, 145,       '4',            '1',            '40',        '0'    ],

                                        ['blinker',            0,  1,    11,    10,      0,       0,       0,      6,    23,       0,     '',     400,      rm_tgt, 144,       '0',            '1',            '41',        '0'    ],  // 6 towers

                                        ['2a_healer',          0,  1,    15,    10,      0,       0,       0,      0,    25,       0,     '',       0,      rm_tgt, 147,       '0',            '1',            '42',        '0'    ],
                                        ['2a_capt',            0,  1,    15,    10,      0,       0,      20,      5,     0,       0,     '',       0,      rm_tgt, 147,       '1',            '1',            '42',        '0'    ],

                                        ['blinker',            0,  0,     6,    10,      0,       0,       0,     21,    13,       0,     '',       0,      rm_tgt, 147,       '0',            '1',            '40',        '0'    ]
                                        ]

                                    var rm_tmp = roles[0][13]
                                    if( Memory.attack_list[kk].attack_level == 4 && Game.rooms[rm_tgt] && !Game.rooms[rm_tgt].controller.my && ( !Game.rooms[rm_tgt].controller.upgradeBlocked || Game.rooms[rm_tgt].controller.upgradeBlocked < 650 ) && 1 == 1 ){
                                        roles[0][2] = Math.min(3, Memory.attack_list[kk].controller_vic )
                                    }
                                }
                            }
                        }
                        //



                        // level 100 - if on this for too long, destroyer was unable to reach room
                        if( Memory.attack_list[kk].attack_level == 100 ){

                            if( Game.time - Memory.attack_list[kk].detection_tick > 600 ){

                                Memory.attack_list[kk].fixed_threat = Memory.attack_list[kk].fixed_threat + 10000
                                Memory.attack_list[kk].threat_lvl   = Math.abs( Memory.attack_list[kk].threat_lvl - 10000 )
                                Memory.attack_list[kk].attack_level = 0

                                Memory.attack_list = _.sortBy(Memory.attack_list, 'threat_lvl')
                            }
                        }
                        //

                        // level 1000 - sucess! - remove from list
                        if( Memory.attack_list[kk].attack_level == 1000 ){
                            Memory.attack_list.splice(kk,1)
                        }
                        //



                         // ADD to spawn list
                        if( change_in_matrix == 1 ){
                            
                            Game.rooms[rm].memory.mode_fill = 1

                            for ( var i = 0 ; i < roles.length ; i++){

                                if( roles[i][2] >= 1 ){

                                    var check = _.filter(Game.creeps, (creep) =>    creep.memory.birth == rm &&
                                                                                    creep.memory.role == roles[i][0] &&
                                                                                    creep.memory.birth_target == roles[i][13] &&
                                                                                    creep.memory.birth_info   == roles[i][14] &&
                                                                                    creep.memory.birth_info_2 == roles[i][15] &&
                                                                                    creep.memory.birth_info_3 == roles[i][16] &&
                                                                                    creep.memory.birth_info_4 == roles[i][17] &&
                                                                                    creep.memory.birth_info_5 == roles[i][18] &&
                                                                                    ( creep.ticksToLive > roles[i][12] - 3 || creep.spawning == true || !creep.ticksToLive ) ).length

                                    if( check < roles[i][2] ){
                                        for ( var j = 0 ; j < ( roles[i][2] - check ) ; j++){

                                            var cnt = Game.rooms[rm].memory.manager_spawn.length

                                            Game.rooms[rm].memory.manager_spawn[cnt] = []
                                            Game.rooms[rm].memory.manager_spawn[cnt] = roles[i]

                                        }
                                    }
                                }
                            }

                            // sort
                            Game.rooms[rm].memory.manager_spawn = _.sortBy( Game.rooms[rm].memory.manager_spawn,  function(o) { return o[14]; });

                            for (var i = 0 ; i < Game.rooms[rm].memory.manager_spawn.length ; i++ ){

                                Game.rooms[rm].memory.manager_spawn[i][11] = i
                            }
                            //

                        }
                    }
                }
            }
        }
    }
};

module.exports = mainBase1ManagerSpawnAuto;
