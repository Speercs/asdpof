var labtypes= {

    run: function() {

        if( !Memory.autoAttackBoostLabs ){
            Memory.autoAttackBoostLabs = {}
        }

        if( !Memory.manualLabs ){
            Memory.manualLabs = {}
        }

        var updatefreq = Memory.config.freq_lab

        // 0 empty
        // 1 reagent
        // 2 reactor
        // 3 booster

        var labtypes      = [
                                ['OH',       'O',1        ,'H',1      ,'OH',2     ,'O',1        ,'H',1       ,'OH',2     ,'OH',2       ,'OH',2       ,'OH',2       ,'OH',2],
                                ['ZK',       'Z',1        ,'K',1      ,'ZK',2     ,'Z',1        ,'K',1       ,'ZK',2     ,'ZK',2       ,'ZK',2       ,'ZK',2       ,'ZK',2],
                                ['UL',       'U',1        ,'L',1      ,'UL',2     ,'U',1        ,'L',1       ,'UL',2     ,'UL',2       ,'UL',2       ,'UL',2       ,'UL',2],
                                ['G',        'ZK',1       ,'UL',1     ,'G',2      ,'ZK',1       ,'UL',1      ,'G',2      ,'G',2        ,'G',2        ,'G',2        ,'G',2],

                                ['UH',       'U',1        ,'H',1      ,'UH',2     ,'U',1        ,'H',1       ,'UH',2     ,'UH',2       ,'UH',2       ,'UH',2       ,'UH',2],
                                ['UO',       'U',1        ,'O',1      ,'UO',2     ,'U',1        ,'O',1       ,'UO',2     ,'UO',2       ,'UO',2       ,'UO',2       ,'UO',2],
                                ['KH',       'K',1        ,'H',1      ,'KH',2     ,'K',1        ,'H',1       ,'KH',2     ,'KH',2       ,'KH',2       ,'KH',2       ,'KH',2],
                                ['KO',       'K',1        ,'O',1      ,'KO',2     ,'K',1        ,'O',1       ,'KO',2     ,'KO',2       ,'KO',2       ,'KO',2       ,'KO',2],
                                ['LH',       'L',1        ,'H',1      ,'LH',2     ,'L',1        ,'H',1       ,'LH',2     ,'LH',2       ,'LH',2       ,'LH',2       ,'LH',2],
                                ['LO',       'L',1        ,'O',1      ,'LO',2     ,'L',1        ,'O',1       ,'LO',2     ,'LO',2       ,'LO',2       ,'LO',2       ,'LO',2],
                                ['ZH',       'Z',1        ,'H',1      ,'ZH',2     ,'Z',1        ,'H',1       ,'ZH',2     ,'ZH',2       ,'ZH',2       ,'ZH',2       ,'ZH',2],
                                ['ZO',       'Z',1        ,'O',1      ,'ZO',2     ,'Z',1        ,'O',1       ,'ZO',2     ,'ZO',2       ,'ZO',2       ,'ZO',2       ,'ZO',2],
                                ['GH',       'G',1        ,'H',1      ,'GH',2     ,'G',1        ,'H',1       ,'GH',2     ,'GH',2       ,'GH',2       ,'GH',2       ,'GH',2],
                                ['GO',       'G',1        ,'O',1      ,'GO',2     ,'G',1        ,'O',1       ,'GO',2     ,'GO',2       ,'GO',2       ,'GO',2       ,'GO',2],

                                ['UH2O',       'UH',1        ,'OH',1      ,'UH2O',2     ,'UH',1        ,'OH',1       ,'UH2O',2     ,'UH2O',2       ,'UH2O',2       ,'UH2O',2       ,'UH2O',2],
                                ['UHO2',       'UO',1        ,'OH',1      ,'UHO2',2     ,'UO',1        ,'OH',1       ,'UHO2',2     ,'UHO2',2       ,'UHO2',2       ,'UHO2',2       ,'UHO2',2],
                                ['KH2O',       'KH',1        ,'OH',1      ,'KH2O',2     ,'KH',1        ,'OH',1       ,'KH2O',2     ,'KH2O',2       ,'KH2O',2       ,'KH2O',2       ,'KH2O',2],
                                ['KHO2',       'KO',1        ,'OH',1      ,'KHO2',2     ,'KO',1        ,'OH',1       ,'KHO2',2     ,'KHO2',2       ,'KHO2',2       ,'KHO2',2       ,'KHO2',2],
                                ['LH2O',       'LH',1        ,'OH',1      ,'LH2O',2     ,'LH',1        ,'OH',1       ,'LH2O',2     ,'LH2O',2       ,'LH2O',2       ,'LH2O',2       ,'LH2O',2],
                                ['LHO2',       'LO',1        ,'OH',1      ,'LHO2',2     ,'LO',1        ,'OH',1       ,'LHO2',2     ,'LHO2',2       ,'LHO2',2       ,'LHO2',2       ,'LHO2',2],
                                ['ZH2O',       'ZH',1        ,'OH',1      ,'ZH2O',2     ,'ZH',1        ,'OH',1       ,'ZH2O',2     ,'ZH2O',2       ,'ZH2O',2       ,'ZH2O',2       ,'ZH2O',2],
                                ['ZHO2',       'ZO',1        ,'OH',1      ,'ZHO2',2     ,'ZO',1        ,'OH',1       ,'ZHO2',2     ,'ZHO2',2       ,'ZHO2',2       ,'ZHO2',2       ,'ZHO2',2],
                                ['GH2O',       'GH',1        ,'OH',1      ,'GH2O',2     ,'GH',1        ,'OH',1       ,'GH2O',2     ,'GH2O',2       ,'GH2O',2       ,'GH2O',2       ,'GH2O',2],
                                ['GHO2',       'GO',1        ,'OH',1      ,'GHO2',2     ,'GO',1        ,'OH',1       ,'GHO2',2     ,'GHO2',2       ,'GHO2',2       ,'GHO2',2       ,'GHO2',2],

                                ['XUH2O',       'UH2O',1        ,'X',1      ,'XUH2O',2     ,'UH2O',1        ,'X',1       ,'XUH2O',2     ,'XUH2O',2       ,'XUH2O',2       ,'XUH2O',2       ,'XUH2O',2],
                                ['XUHO2',       'UHO2',1        ,'X',1      ,'XUHO2',2     ,'UHO2',1        ,'X',1       ,'XUHO2',2     ,'XUHO2',2       ,'XUHO2',2       ,'XUHO2',2       ,'XUHO2',2],
                                ['XKH2O',       'KH2O',1        ,'X',1      ,'XKH2O',2     ,'KH2O',1        ,'X',1       ,'XKH2O',2     ,'XKH2O',2       ,'XKH2O',2       ,'XKH2O',2       ,'XKH2O',2],
                                ['XKHO2',       'KHO2',1        ,'X',1      ,'XKHO2',2     ,'KHO2',1        ,'X',1       ,'XKHO2',2     ,'XKHO2',2       ,'XKHO2',2       ,'XKHO2',2       ,'XKHO2',2],
                                ['XLH2O',       'LH2O',1        ,'X',1      ,'XLH2O',2     ,'LH2O',1        ,'X',1       ,'XLH2O',2     ,'XLH2O',2       ,'XLH2O',2       ,'XLH2O',2       ,'XLH2O',2],
                                ['XLHO2',       'LHO2',1        ,'X',1      ,'XLHO2',2     ,'LHO2',1        ,'X',1       ,'XLHO2',2     ,'XLHO2',2       ,'XLHO2',2       ,'XLHO2',2       ,'XLHO2',2],
                                ['XZH2O',       'ZH2O',1        ,'X',1      ,'XZH2O',2     ,'ZH2O',1        ,'X',1       ,'XZH2O',2     ,'XZH2O',2       ,'XZH2O',2       ,'XZH2O',2       ,'XZH2O',2],
                                ['XZHO2',       'ZHO2',1        ,'X',1      ,'XZHO2',2     ,'ZHO2',1        ,'X',1       ,'XZHO2',2     ,'XZHO2',2       ,'XZHO2',2       ,'XZHO2',2       ,'XZHO2',2],
                                ['XGH2O',       'GH2O',1        ,'X',1      ,'XGH2O',2     ,'GH2O',1        ,'X',1       ,'XGH2O',2     ,'XGH2O',2       ,'XGH2O',2       ,'XGH2O',2       ,'XGH2O',2],
                                ['XGHO2',       'GHO2',1        ,'X',1      ,'XGHO2',2     ,'GHO2',1        ,'X',1       ,'XGHO2',2     ,'XGHO2',2       ,'XGHO2',2       ,'XGHO2',2       ,'XGHO2',2],

                                // labs 
                                //    8 9 - -
                                //    4 - 5 -
                                //    0 3 T -
                                //    2 - 1 -
                                //    6 7 - -
                                
                                // have to check boosts order
                                ['boost1',      'LO',3          ,'ZO',3      ,'',0         ,'',0           ,'UH',3          ,'KO',3        ,'',0          ,'GO',3         ,'ZO',3     ,'',0],
                                ['boost2',      'LHO2',3        ,'ZHO2',3    ,'',0         ,'',0           ,'UH2O',3        ,'KHO2',3      ,'',0          ,'GHO2',3       ,'ZH2O',3   ,'',0],
                                ['boost3',      'XLHO2',3       ,'XZHO2',3   ,'',0         ,'',0           ,'XUH2O',3       ,'XKHO2',3     ,'',0          ,'XGHO2',3      ,'XZH2O',3  ,'',0],
                              
                                ['temple6',     'XGH2O',3       ,'GH2O',3    ,'GH',3     ,'',0            ,'',0        ,'',0       ,'',0        ,'',0         ,'',0         ,'',0  ],
                                ['temple7',     'O',1           ,'H',1       ,'XGH2O',3  ,'GH2O',3        ,'GH',3      ,'OH',2     ,'',0        ,'',0         ,'',0         ,'',0  ],
                                ['temple8',     'O',1           ,'H',1       ,'XGH2O',3  ,'GH2O',3        ,'GH',3      ,'OH',2     ,'OH',2      ,'OH',2       ,'OH',2       ,'OH',2],

                                ['free',       '',0        ,'',0      ,'',0     ,'',0     ,'',0       ,'',0     ,'',0       ,'',0       ,'',0       ,'',0],
                                ['empty',      '',0        ,'',0      ,'',0     ,'',0     ,'',0       ,'',0     ,'',0       ,'',0       ,'',0       ,'',0]

                            ]

        var labtypes_original = labtypes

        var boost_per_room = 14000

                                //boost  colldown  rea1   rea2   rooms_available  priority    min_to_change_to_next
        var labvars_base      = [
                                ['OH',       20,    'O',    'H',     0         ,-2             ,0.50], // basic    0

                                ['LO',       10,    'L',    'O',     0         ,-2             ,0.50], // heal 1 *
                                ['LHO2',     5,     'OH',   'LO',    0         ,-2.5           ,0.25],
                                ['XLHO2',    60,    'X',    'LHO2',  0         ,-1             ,0.95],

                                ['ZO',       10,    'Z',    'O',     0         ,-2             ,0.50], // move 4 *
                                ['ZHO2',     5,     'OH',   'ZO',    0         ,-2.5           ,0.25],
                                ['XZHO2',    60,    'X',    'ZHO2',  0         ,-1             ,0.95],

                                ['UH',       10,    'U',    'H',     0         ,-1             ,0.50], // attack  7 *
                                ['UH2O',     5,     'OH',   'UH',    0         ,-2.5           ,0.25],
                                ['XUH2O',    60,    'X',    'UH2O',  0         ,-1             ,0.95],

                                ['KO',       10,    'K',    'O',     0         ,-2             ,0.50], // ranged 10 *
                                ['KHO2',     5,     'OH',   'KO',    0         ,-2.5           ,0.25],
                                ['XKHO2',    60,    'X',    'KHO2',  0         ,-1             ,0.95],

                                ['ZH',       20,    'Z',    'H',     0         ,-2             ,0.50], // dismantle   13 *
                                ['ZH2O',     40,    'OH',   'ZH',    0         ,-2.5           ,0.25],
                                ['XZH2O',   160,    'X',    'ZH2O',  0         ,-1             ,0.95],

                                ['ZK',       5,    'Z',    'K',      0         ,-2             ,0.50], // G 16 *
                                ['UL',       5,    'U',    'L',      0         ,-2             ,0.50],
                                ['G',        5,    'ZK',   'UL',     0         ,-2             ,0.50],

                                ['GO',       10,    'G',    'O',     0         ,-2             ,0.50], // though 19 *
                                ['GHO2',     30,    'OH',   'GO',    0         ,-2.5           ,0.25],
                                ['XGHO2',   150,    'X',    'GHO2',  0         ,-1             ,0.95],

                                ['GH',       10,    'G',    'H',     0         ,-3             ,0.10], // upgrade 22
                                ['GH2O',     15,    'OH',   'GH',    0         ,-3             ,0.10],
                                ['XGH2O',    80,    'X',    'GH2O',  0         ,-3             ,0.10],

                                ['LH',       15,    'L',    'H',     0         ,-1             ,0.95], // repair 25
                                ['LH2O',     10,    'OH',   'LH',    0         ,-3             ,0.10],
                                ['XLH2O',    65,    'X',    'LH2O',  0         ,-3             ,0.10],

                                ['KH',       10,    'K',    'H',     0         ,1000            ,0.00], // carry 28
                                ['KH2O',     5,     'OH',   'KH',    0         ,1000            ,0.00],
                                ['XKH2O',    60,    'X',    'KH2O',  0         ,1000            ,0.00],

                                ['UO',       10,    'U',    'O',     0         ,-1             ,0.95], // harvest 31
                                ['UHO2',     5 ,    'OH',   'UO',    0         ,-3             ,0.10],
                                ['XUHO2',    60,    'X',    'UHO2',  0         ,-3             ,0.10]
                                
                            ]
                            
        // calibrate priority
        // first pass
        var target_reached = 1
        for( var kk = 0; kk < labvars_base.length ; kk++ ){
            
            var symb0 = labvars_base[kk][0]
            
            if( labvars_base[kk][5] == -1 ){
                labvars_base[kk][5] = Memory.stats.minerals[symb0] / boost_per_room + Math.round( Math.random() * 100 ) / 100
                
                if( Memory.stats.minerals[symb0] > Memory.stats.number_rooms * 0.85 ){
                    labvars_base[kk][5] = labvars_base[kk][5] + Memory.stats.number_rooms * 2
                }
                else if( Memory.stats.minerals[symb0] > 5 ){
                    labvars_base[kk][5] = labvars_base[kk][5] + Memory.stats.number_rooms
                }
            }
            else if( labvars_base[kk][5] == -2 ){
                labvars_base[kk][5] = Memory.stats.minerals[symb0] / boost_per_room + Math.round( Math.random() * 100 ) / 100
                
                if( Memory.stats.minerals[symb0] > Memory.stats.number_rooms * 0.5 ){
                    labvars_base[kk][5] = labvars_base[kk][5] + Memory.stats.number_rooms * 2
                }
                else{
                    var target_reached = 0
                }
            }
            else if( labvars_base[kk][5] == -2.5 ){
                labvars_base[kk][5] = Memory.stats.minerals[symb0] / boost_per_room + Math.round( Math.random() * 100 ) / 100
                
                if( Memory.stats.minerals[symb0] > Memory.stats.number_rooms * 0.25 ){
                    labvars_base[kk][5] = labvars_base[kk][5] + Memory.stats.number_rooms * 2
                }
                else{
                    var target_reached = 0
                }
            }
        }
        
        // second pass
        for( var kk = 0; kk < labvars_base.length ; kk++ ){
            
            if( labvars_base[kk][5] == -3 ){
                
                var symb0 = labvars_base[kk][0]
                
                if( target_reached == 1 ){
                    labvars_base[kk][5] = Memory.stats.minerals[symb0] / boost_per_room + Math.round( Math.random() * 100 ) / 100
                
                    if( Memory.stats.minerals[symb0] > Memory.stats.number_rooms * 0.1 ){
                        labvars_base[kk][5] = 999
                    }
                    else{
                        var target_reached = 0
                    }
                }
                else{
                    labvars_base[kk][5] = 999
                }
            }
            else if( labvars_base[kk][5] <= 0 ){
                labvars_base[kk][5] = 998
                console.log('BUG ON LAB CODE DISTRIBUTION')
            }
        }
        //
        

        // // calibrate priority
        // for( var kk = 0; kk < labvars_base.length ; kk++ ){

        //     var symb0 = labvars_base[kk][0]

        //     if( Memory.stats.minerals[symb0] >= Memory.stats.number_rooms * 14000 * labvars_base[kk][6] ){

        //         if( Memory.stats.minerals[symb0] >= Memory.stats.number_rooms * 14000 ){
        //             // do not add
        //         }
        //         else{
        //             labvars_base[kk][5] = labvars_base[kk][5] + 500
        //             labvars_base[kk][5] = labvars_base[kk][5] + Math.round( Math.random() / 10 * 100 ) / 100
        //         }
        //     }
        //     else{
        //         // no need to calibrate
        //         labvars_base[kk][5] = labvars_base[kk][5] + Math.round( Math.random() / 10 * 100 ) / 100
        //     }
        // }
        // //

        var labvars = []

        // check if there is reagents for reactions and add to list 
        for( var kk = 0; kk < labvars_base.length ; kk++ ){

            var symb0     = labvars_base[kk][0]
            var symb1     = labvars_base[kk][2]
            var symb2     = labvars_base[kk][3]
            var symb_min  = updatefreq / labvars_base[kk][1] * 5 * 5 // split labs as 5x5
            var symb_max  = labvars_base[kk][6]

            if( Memory.stats.minerals[ symb1 ] > 0 && Memory.stats.minerals[ symb2 ] > 0 && labvars_base[kk][6] > 0 ){

                // Memory.config.freq_terminal_send[symb1] = 2
                // Memory.config.freq_terminal_send[symb2] = 3

                if( ( Memory.stats.minerals[ symb0 ] + symb_min ) > Memory.stats.number_rooms * 14000 ){
                    // already have enough
                }
                else{
                    var cnt = labvars.length

                    labvars[ cnt ] = labvars_base[kk]

                    labvars[ cnt ][4] = Math.min( Memory.stats.minerals[ symb1 ] / symb_min , 
                                                  Memory.stats.minerals[ symb2 ] / symb_min ,
                                                 (Memory.stats.number_rooms * symb_max * 14000 - Memory.stats.minerals[ symb0 ] ) / symb_min )                           
                                                 
                    if( labvars[ cnt ][4] < 0.75 && labvars[ cnt ][4] > 0 ){
                        labvars_base[kk][5] = labvars_base[kk][5] + 1000 - labvars[ cnt ][4] * 100
                    }
                }
            }
        }
        //

        
        //
        console.log(labvars)
    
        // Assign room task
        for(var name in Game.rooms) {

            var rm = name;

            if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].terminal && Game.rooms[rm].storage && Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.lab ) {
                
                // sort
                var labvars  = _.sortBy( labvars,  function(o) { return  o[5]; }); // crescente

                var labtypes = labtypes_original

                var boost_1 = 'free'
                var boost_2 = 'free'
                var boost_freq = 15

                if( Memory.autoAttackBoostLabs[ rm ] ){
                    var boost_1 = Memory.autoAttackBoostLabs[ rm ].boost
                    var boost_2 = Memory.autoAttackBoostLabs[ rm ].boost
                    var boost_freq = 5
                }
                else if( Memory.manualLabs[ rm ] ){
                    var boost_1 = Memory.manualLabs[ rm ].boost
                    var boost_2 = Memory.manualLabs[ rm ].boost
                    var boost_freq = 5
                }
                // else if( Game.rooms[rm].controller.level == 6 ){
                //     var boost = 'temple6'
                //     var boost_freq = 5
                // }
                else{

                    var single_boost = 0

                    // boost1
                    for( var kk = 0; kk < labvars.length ; kk++ ){
                        if( labvars[kk][4] > 0 ){
                            
                            //console.log(labvars[kk])
                            
                            // reduce needed
                            labvars[kk][4] = Math.max(labvars[kk][4] - 1, 0)      
                            // reduce priority
                            labvars[kk][5] = labvars[kk][5] + 0.15

                            var boost_1 = labvars[kk][0]
                            var boost_freq = Math.min(Math.max(Math.ceil(labvars[kk][1]/5),1),5,boost_freq)

                            if( labvars[ kk ][4] < 0.75 && labvars[ kk ][4] > 0 ){
                                labvars_base[kk][5] = labvars_base[kk][5] + 1000 - labvars[ kk ][4] * 100
                                var labvars  = _.sortBy( labvars,  function(o) { return  o[5]; }); // crescente
                            }

                            if( Game.rooms[rm].controller.level >= 7 ){
                                if( boost_1 == 'ZK' || boost_1 == 'UL' || boost_1 == 'G' || 
                                    boost_1 == 'UH2O' || boost_1 == 'UHO2' || boost_1 == 'KH2O' || boost_1 == 'KHO2' || 
                                    boost_1 == 'KHO2' || boost_1 == 'ZHO2' ){

                                    var single_boost = 1
                                    var boost_2 = boost_1

                                    for( var i = 0; i < labtypes.length; i++ ){

                                        if( labtypes[i][0] == boost_1 ){

                                            labtypes[i][3] = labtypes[i][5]
                                            labtypes[i][4] = labtypes[i][6]

                                            labtypes[i][7] = labtypes[i][9]
                                            labtypes[i][8] = labtypes[i][10]

                                            labtypes[i][9] = labtypes[i][11]
                                            labtypes[i][10] = labtypes[i][12]

                                            break;
                                        }
                                    }
                                }
                            }
                            
                            break;
                        }
                    }

                    // boost2
                    if( single_boost == 0 ){
                        for( var kk = 0; kk < labvars.length ; kk++ ){
                            if( labvars[kk][4] > 0 ){
                                labvars[kk][4] = Math.max(labvars[kk][4] - 1, 0)                            

                                var boost_2 = labvars[kk][0]
                                var boost_freq = Math.min(Math.max(Math.ceil(labvars[kk][1]/5),1),5,boost_freq)

                                if( labvars[ kk ][4] < 0.75 && labvars[ kk ][4] > 0 ){
                                    labvars_base[kk][5] = labvars_base[kk][5] + 1000 - labvars[ kk ][4] * 100
                                    var labvars  = _.sortBy( labvars,  function(o) { return  o[5]; }); // crescente
                                }

                                break
                            }
                        }
                    }
                }

                // set boost
                for( var i = 0; i < labtypes.length; i++ ){

                    if( labtypes[i][0] == boost_1 ){

                        // set lab
                        for( var j = 0; j <  Game.rooms[rm].memory.intel.lab.length ; j++ ){

                            if( j == 0 || j == 1 || j == 2 || j == 6 || j == 7 ){
                                Game.rooms[rm].memory.intel.lab[j].min = labtypes[i][ j * 2 + 1 ]
                                Game.rooms[rm].memory.intel.lab[j].sts = labtypes[i][ j * 2 + 2 ]
                            }
                        }
                    }
                    
                    if( labtypes[i][0] == boost_2 ){

                        // set lab
                        for( var j = 0; j <  Game.rooms[rm].memory.intel.lab.length ; j++ ){

                            if( j == 3 || j == 4 || j == 5 || j == 8 || j == 9 ){
                                Game.rooms[rm].memory.intel.lab[j].min = labtypes[i][ j * 2 + 1 ]
                                Game.rooms[rm].memory.intel.lab[j].sts = labtypes[i][ j * 2 + 2 ]
                            }
                        }
                    }
                }

                // set boost
                Game.rooms[rm].memory.lab_boost_1 = boost_1
                Game.rooms[rm].memory.lab_boost_2 = boost_2
                Game.rooms[rm].memory.lab_boost_freq = boost_freq
                //

                console.log('Lab production assign to: ',rm, 'level: ',Game.rooms[rm].controller.level, boost_1, boost_2, boost_freq )

                // attack mode ON/OFF
                if( Game.rooms[rm].memory.lab_boost_1 == 'boost3' || Game.rooms[rm].memory.lab_boost_1 == 'boost2' || Game.rooms[rm].memory.lab_boost_1 == 'boost1' ||
                    Game.rooms[rm].memory.lab_boost_2 == 'boost3' || Game.rooms[rm].memory.lab_boost_2 == 'boost2' || Game.rooms[rm].memory.lab_boost_2 == 'boost1' ){
                    Game.rooms[rm].memory.mode_attack = 1
                }
                else{
                    Game.rooms[rm].memory.mode_attack = 0
                }
                //

            }
        }
    }
};

module.exports = labtypes;