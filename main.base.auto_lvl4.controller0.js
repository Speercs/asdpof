var base1Auto_lvl4Controller0= {

    run: function( kk, rm_tgt, rm ) {
        
        // controler_my
        //  1 - my room
        //  0 - my reservation
        // -1 - no owner, no reservation
        // -2 - other reservation
        // -3 - other owner
        
        // controller level 0 
        // controller 8 boost 3
        if( Game.rooms[rm].controller.level == 8 && Memory.autoAttackBoostLabs[ rm ].boost == 'boost3' ){
            if( ( Memory.attack_list[kk].controller_my == 0 || Memory.attack_list[kk].controller_my == -1) && Memory.attack_list[kk].wall_cnt > 0 ){
                if( Game.time - Memory.attack_list[kk].detection_tick > 2000 || 
                ( Memory.attack_list[kk].claim_count && Memory.attack_list[kk].claim_count > (1 + 1) ) || 
                ( Memory.attack_list[kk].creep_count && Memory.attack_list[kk].creep_count > (6 + 2) ) ||
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
                    
                    if( !Memory.attack_list[kk].fixed_threat || Memory.attack_list[kk].fixed_threat < 10000 ){
                        if( Memory.attack_list[kk].attack_level == 4 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [ 
                                ['controller_destroy', 0,  1,     0,   10,      0,       0,       0,      0,     0,       1,     '',       0,      rm_tgt , 49,       '0',            '0',            '50',        '0'    ],
                                
                                ['2a_healer',          0,  1,     5,    10,      0,       0,       0,      5,    30,       0,     '',       0,      rm_tgt, 40,       '0',            '1',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     5,    10,      0,       0,      30,      5,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '1',            '50',        '0'    ],
            
                                ['blinker',            0,  1,     0,    25,      0,       0,       0,     20,     5,       0,     '',     500,      rm_tgt, 42,       '0',            '0',            '50',        '0'    ],
                                ['blinker',            0,  1,     0,    25,      0,       0,      20,      0,     5,       0,     '',     500,      rm_tgt, 41,       '0',            '0',            '51',        '0'    ]
                                ] 
                        }
                        else if( Memory.attack_list[kk].attack_level == 5 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [
                                ['2a_healer',          0,  1,     5,    10,      0,       0,       0,      5,    30,       0,     '',       0,      rm_tgt, 40,       '0',            '1',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     5,    10,      0,       0,      30,      5,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '1',            '50',        '0'    ],
            
                                ['blinker',            0,  1,     0,    25,      0,       0,       0,     20,     5,       0,     '',     500,      rm_tgt, 42,       '0',            '0',            '50',        '0'    ],
                                ['blinker',            0,  1,     0,    25,      0,       0,      20,      0,     5,       0,     '',     500,      rm_tgt, 41,       '0',            '0',            '51',        '0'    ]
                                ]  
                        }
                    }
                    else{
                        if( Memory.attack_list[kk].attack_level == 4 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [ 
                                ['controller_destroy', 0,  1,     0,    10,      0,       0,       0,      0,     0,       1,     '',       0,      rm_tgt, 49,       '0',            '0',            '50',        '0'    ],
                                
                                ['2a_healer',          0,  1,    10,    10,      0,       0,       0,      0,    30,       0,     '',       0,      rm_tgt, 40,       '0',            '1',            '50',        '0'    ],
                                ['2a_capt',            0,  1,    10,    10,      0,       0,      20,     10,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '1',            '50',        '0'    ],
            
                                ['blinker',            0,  1,    11,    10,      0,       0,       0,      6,    23,       0,     '',       0,      rm_tgt, 41,       '0',            '1',            '52',        '0'    ]  // 6 towers 
                                ] 
                        }
                        else if( Memory.attack_list[kk].attack_level == 5 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [
                                ['2a_healer',          0,  1,    10,    10,      0,       0,       0,      0,    30,       0,     '',       0,      rm_tgt, 40,       '0',            '1',            '50',        '0'    ],
                                ['2a_capt',            0,  1,    10,    10,      0,       0,      20,     10,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '1',            '50',        '0'    ],
            
                                ['blinker',            0,  1,    11,    10,      0,       0,       0,      6,    23,       0,     '',       0,      rm_tgt, 41,       '0',            '1',            '52',        '0'    ]  // 6 towers 
                                ]  
                        }
                    }
                }
            }
            else if( Memory.attack_list[kk].controller_my == -2 && Memory.attack_list[kk].wall_cnt > 0 ){
                
                if( Game.time - Memory.attack_list[kk].detection_tick > 2000 || 
                ( Memory.attack_list[kk].claim_count && Memory.attack_list[kk].claim_count > (1 + 1) ) || 
                ( Memory.attack_list[kk].creep_count && Memory.attack_list[kk].creep_count > (6 + 2) ) ||
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
                    
                    if( !Memory.attack_list[kk].fixed_threat || Memory.attack_list[kk].fixed_threat < 10000 ){
                        if( Memory.attack_list[kk].attack_level == 4 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [ 
                                ['controller_reserver',0,  1,     0,    20,      0,       0,       0,      0,     0,      10,     '',       0,      rm_tgt, 49,       '0',            '0',            '50',        '0'    ],
                                
                                ['2a_healer',          0,  1,     5,    10,      0,       0,       0,      5,    30,       0,     '',       0,      rm_tgt, 40,       '0',            '1',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     5,    10,      0,       0,      30,      5,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '1',            '50',        '0'    ],
            
                                ['blinker',            0,  1,     0,    25,      0,       0,       0,     20,     5,       0,     '',     500,      rm_tgt, 42,       '0',            '0',            '50',        '0'    ],
                                ['blinker',            0,  1,     0,    25,      0,       0,      20,      0,     5,       0,     '',     500,      rm_tgt, 41,       '0',            '0',            '51',        '0'    ]
                                ] 
                        }
                        else if( Memory.attack_list[kk].attack_level == 5 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [
                                ['2a_healer',          0,  1,     5,    10,      0,       0,       0,      5,    30,       0,     '',       0,      rm_tgt, 40,       '0',            '1',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     5,    10,      0,       0,      30,      5,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '1',            '50',        '0'    ],
            
                                ['blinker',            0,  1,     0,    25,      0,       0,       0,     20,     5,       0,     '',     500,      rm_tgt, 42,       '0',            '0',            '50',        '0'    ],
                                ['blinker',            0,  1,     0,    25,      0,       0,      20,      0,     5,       0,     '',     500,      rm_tgt, 41,       '0',            '0',            '51',        '0'    ]
                                ]  
                        }
                    }
                    else{
                        if( Memory.attack_list[kk].attack_level == 4 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [ 
                                ['controller_reserver',0,  1,     0,    20,      0,       0,       0,      0,     0,      10,     '',       0,      rm_tgt, 49,       '0',            '0',            '50',        '0'    ],
                                
                                ['2a_healer',          0,  1,    10,    10,      0,       0,       0,      0,    30,       0,     '',       0,      rm_tgt, 40,       '0',            '1',            '50',        '0'    ],
                                ['2a_capt',            0,  1,    10,    10,      0,       0,      20,     10,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '1',            '50',        '0'    ],
            
                                ['blinker',            0,  1,    11,    10,      0,       0,       0,      6,    23,       0,     '',       0,      rm_tgt, 41,       '0',            '1',            '52',        '0'    ]  // 6 towers 
                                ] 
                        }
                        else if( Memory.attack_list[kk].attack_level == 5 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [
                                ['2a_healer',          0,  1,    10,    10,      0,       0,       0,      0,    30,       0,     '',       0,      rm_tgt, 40,       '0',            '1',            '50',        '0'    ],
                                ['2a_capt',            0,  1,    10,    10,      0,       0,      20,     10,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '1',            '50',        '0'    ],
            
                                ['blinker',            0,  1,    11,    10,      0,       0,       0,      6,    23,       0,     '',       0,      rm_tgt, 41,       '0',            '1',            '52',        '0'    ]  // 6 towers 
                                ]  
                        }
                    }
                }
            }
            else{
                Memory.attack_list.splice(kk,1)   
            }
        }         
        // controller 7 boost 3 or boost 1
        else if( Game.rooms[rm].controller.level == 7 && ( Memory.autoAttackBoostLabs[ rm ].boost == 'boost3' || Memory.autoAttackBoostLabs[ rm ].boost == 'boost1') ){
            if( ( Memory.attack_list[kk].controller_my == 0 || Memory.attack_list[kk].controller_my == -1) && Memory.attack_list[kk].wall_cnt > 0 ){
                if( Game.time - Memory.attack_list[kk].detection_tick > 2000 || 
                ( Memory.attack_list[kk].claim_count && Memory.attack_list[kk].claim_count > (1 + 1) ) || 
                ( Memory.attack_list[kk].creep_count && Memory.attack_list[kk].creep_count > (6 + 2) ) ||
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
                    
                    if( !Memory.attack_list[kk].fixed_threat || Memory.attack_list[kk].fixed_threat < 10000 ){
                        if( Memory.attack_list[kk].attack_level == 4 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [ 
                                ['controller_destroy', 0,  1,     0,   10,      0,       0,       0,      0,     0,       1,     '',       0,      rm_tgt , 49,       '0',            '0',            '50',        '0'    ],
                                
                                ['2a_healer',          0,  1,     0,    15,      0,       0,       0,      0,    15,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    25,      0,       0,      15,     10,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]

                                ] 
                        }
                        else if( Memory.attack_list[kk].attack_level == 5 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [
                                ['2a_healer',          0,  1,     0,    15,      0,       0,       0,      0,    15,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    25,      0,       0,      15,     10,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]

                                ]  
                        }
                    }
                    else{
                        if( Memory.attack_list[kk].attack_level == 4 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [ 
                                ['controller_destroy', 0,  1,     0,    10,      0,       0,       0,      0,     0,       1,     '',       0,      rm_tgt, 49,       '0',            '0',            '50',        '0'    ],
                                
                                ['2a_healer',          0,  1,     0,    15,      0,       0,       0,      0,    15,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    25,      0,       0,      15,     10,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]

                                ] 
                        }
                        else if( Memory.attack_list[kk].attack_level == 5 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [
                                ['2a_healer',          0,  1,     0,    15,      0,       0,       0,      0,    15,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    25,      0,       0,      15,     10,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]

                                ]  
                        }
                    }
                }
            }
            else if( Memory.attack_list[kk].controller_my == -2 && Memory.attack_list[kk].wall_cnt > 0 ){
                
                if( Game.time - Memory.attack_list[kk].detection_tick > 2000 || 
                ( Memory.attack_list[kk].claim_count && Memory.attack_list[kk].claim_count > (1 + 1) ) || 
                ( Memory.attack_list[kk].creep_count && Memory.attack_list[kk].creep_count > (6 + 2) ) ||
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
                    
                    if( !Memory.attack_list[kk].fixed_threat || Memory.attack_list[kk].fixed_threat < 10000 ){
                        if( Memory.attack_list[kk].attack_level == 4 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [ 
                                ['controller_reserver',0,  1,     0,    20,      0,       0,       0,      0,     0,      10,     '',       0,      rm_tgt, 49,       '0',            '0',            '50',        '0'    ],
                                
                                ['2a_healer',          0,  1,     0,    15,      0,       0,       0,      0,    15,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    25,      0,       0,      15,     10,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]

                                ] 
                        }
                        else if( Memory.attack_list[kk].attack_level == 5 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [
                                ['2a_healer',          0,  1,     0,    15,      0,       0,       0,      0,    15,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    25,      0,       0,      15,     10,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]

                                ]  
                        }
                    }
                    else{
                        if( Memory.attack_list[kk].attack_level == 4 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [ 
                                ['controller_reserver',0,  1,     0,    20,      0,       0,       0,      0,     0,      10,     '',       0,      rm_tgt, 49,       '0',            '0',            '50',        '0'    ],
                                
                                ['2a_healer',          0,  1,     0,    15,      0,       0,       0,      0,    15,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    25,      0,       0,      15,     10,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]
                                ] 
                        }
                        else if( Memory.attack_list[kk].attack_level == 5 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [
                                ['2a_healer',          0,  1,     0,    15,      0,       0,       0,      0,    15,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    25,      0,       0,      15,     10,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]
                                ]  
                        }
                    }
                }
            }
            else{
                Memory.attack_list.splice(kk,1)   
            }
        }
        // controller 6 boost 1
        else if( Game.rooms[rm].controller.level == 6 && Memory.autoAttackBoostLabs[ rm ].boost == 'boost1' ){
            if( ( Memory.attack_list[kk].controller_my == 0 || Memory.attack_list[kk].controller_my == -1) && Memory.attack_list[kk].wall_cnt > 0 ){
                if( Game.time - Memory.attack_list[kk].detection_tick > 2000 || 
                ( Memory.attack_list[kk].claim_count && Memory.attack_list[kk].claim_count > (1 + 1) ) || 
                ( Memory.attack_list[kk].creep_count && Memory.attack_list[kk].creep_count > (6 + 2) ) ||
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
                    
                    if( !Memory.attack_list[kk].fixed_threat || Memory.attack_list[kk].fixed_threat < 10000 ){
                        if( Memory.attack_list[kk].attack_level == 4 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [ 
                                ['controller_destroy', 0,  1,     0,   10,      0,       0,       0,      0,     0,       1,     '',       0,      rm_tgt , 49,       '0',            '0',            '50',        '0'    ],
                                
                                ['2a_healer',          0,  1,     0,     7,      0,       0,       0,      0,     7,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    15,      0,       0,      10,      5,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]

                                ] 
                        }
                        else if( Memory.attack_list[kk].attack_level == 5 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [
                                ['2a_healer',          0,  1,     0,     7,      0,       0,       0,      0,     7,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    15,      0,       0,      10,      5,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]

                                ]  
                        }
                    }
                    else{
                        if( Memory.attack_list[kk].attack_level == 4 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [ 
                                ['controller_destroy', 0,  1,     0,    10,      0,       0,       0,      0,     0,       1,     '',       0,      rm_tgt, 49,       '0',            '0',            '50',        '0'    ],
                                
                                ['2a_healer',          0,  1,     0,     7,      0,       0,       0,      0,     7,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    15,      0,       0,      10,      5,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]

                                ] 
                        }
                        else if( Memory.attack_list[kk].attack_level == 5 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [
                                ['2a_healer',          0,  1,     0,     7,      0,       0,       0,      0,     7,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    15,      0,       0,      10,      5,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]

                                ]  
                        }
                    }
                }
            }
            else if( Memory.attack_list[kk].controller_my == -2 && Memory.attack_list[kk].wall_cnt > 0 ){
                
                if( Game.time - Memory.attack_list[kk].detection_tick > 2000 || 
                ( Memory.attack_list[kk].claim_count && Memory.attack_list[kk].claim_count > (1 + 1) ) || 
                ( Memory.attack_list[kk].creep_count && Memory.attack_list[kk].creep_count > (6 + 2) ) ||
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
                    
                    if( !Memory.attack_list[kk].fixed_threat || Memory.attack_list[kk].fixed_threat < 10000 ){
                        if( Memory.attack_list[kk].attack_level == 4 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [ 
                                ['controller_reserver',0,  1,     0,    20,      0,       0,       0,      0,     0,      10,     '',       0,      rm_tgt, 49,       '0',            '0',            '50',        '0'    ],
                                
                                ['2a_healer',          0,  1,     0,     7,      0,       0,       0,      0,     7,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    15,      0,       0,      10,      5,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]

                                ] 
                        }
                        else if( Memory.attack_list[kk].attack_level == 5 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [
                                ['2a_healer',          0,  1,     0,     7,      0,       0,       0,      0,     7,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    15,      0,       0,      10,      5,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]

                                ]  
                        }
                    }
                    else{
                        if( Memory.attack_list[kk].attack_level == 4 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [ 
                                ['controller_reserver',0,  1,     0,    20,      0,       0,       0,      0,     0,      10,     '',       0,      rm_tgt, 49,       '0',            '0',            '50',        '0'    ],
                                
                                ['2a_healer',          0,  1,     0,     7,      0,       0,       0,      0,     7,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    15,      0,       0,      10,      5,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]
                                ] 
                        }
                        else if( Memory.attack_list[kk].attack_level == 5 ){
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
                            var roles = [
                                ['2a_healer',          0,  1,     0,     7,      0,       0,       0,      0,     7,       0,     '',       0,      rm_tgt, 40,       '0',            '0',            '50',        '0'    ],
                                ['2a_capt',            0,  1,     0,    15,      0,       0,      10,      5,     0,       0,     '',       0,      rm_tgt, 40,       '1',            '0',            '50',        '0'    ]
                                ]  
                        }
                    }
                }
            }
            else{
                Memory.attack_list.splice(kk,1)   
            }
        }
        
        
        
        return [ change_in_matrix, roles ];
        
    }
};

module.exports = base1Auto_lvl4Controller0