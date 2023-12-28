var Config= {

    run: function() {


        // remote calibration extras
        if( Game.time % 50 == 1 && Memory.config ){

            // CPU balancer
            //if( Object.keys(Game.creeps).length < Memory.cpuPredictor.creepsLimit && Game.cpu.bucket > 9500 ){
            //    Memory.config.outpost_max_dist = Memory.config.outpost_max_dist + 1 
            //}
            //else if( Object.keys(Game.creeps).length > Memory.cpuPredictor.creepsLimit && Game.cpu.bucket < 7000 ){
            //    Memory.config.outpost_max_dist = Memory.config.outpost_max_dist - 2
            //}  
            
            // CPU balance
            if( Memory.stats.number_creeps_2 >= Memory.stats.number_creeps && Memory.stats.number_creeps_2 >= Memory.cpuPredictor.creepsLimit ){
                Memory.config.outpost_max_dist = Memory.config.outpost_max_dist - 0.1
            }
            else {
                Memory.config.outpost_max_dist = Memory.config.outpost_max_dist + 0.1
            } 
      
            if( Memory.config.outpost_max_dist > 150 ){ Memory.config.outpost_max_dist = 150 }
            if( Memory.config.outpost_max_dist < 30  ){ Memory.config.outpost_max_dist = 30  }

            // ally list
            Memory.config.ally_list                     = [
                                                          'asdpof'
                                                          ]
        }
        //


        // remote calibration extras
        // if( Game.time % 750 == 1 && Memory.config ){

        //     // CPU balancer

        //     if(      Game.cpu.bucket >  9000 ){ Memory.config.outpost_max_dist = Memory.config.outpost_max_dist + 3  }
        //     else if( Game.cpu.bucket >  8000 ){ Memory.config.outpost_max_dist = Memory.config.outpost_max_dist + 1.5   }
        //     else if( Game.cpu.bucket >  6000 ){ Memory.config.outpost_max_dist = Memory.config.outpost_max_dist - 1.5     }
        //     else if( Game.cpu.bucket >  5000 ){ Memory.config.outpost_max_dist = Memory.config.outpost_max_dist - 4   }
        //     else if( Game.cpu.bucket >  4000 ){ Memory.config.outpost_max_dist = Memory.config.outpost_max_dist - 5  }
        //     else if( Game.cpu.bucket <= 4000 ){ Memory.config.outpost_max_dist = Memory.config.outpost_max_dist - 7.5  }

        //     if( Memory.config.outpost_max_dist > 150 ){ Memory.config.outpost_max_dist = 150 }
        //     if( Memory.config.outpost_max_dist < 30  ){ Memory.config.outpost_max_dist = 30  }


        //     // ally list
        //     Memory.config.ally_list                     = [
        //                                                   'asdpof'
        //                                                   ]
        // }
        //
      

        // auto-attack
        if( Game.time % 37 == 0 ){
        //
        //     // manual targets
            Memory.tgt_list = [
                                '61b93d9d2c02567a3c0d47d1',
                                '61b93dd2f7bc6166c1db0af6',
                                '61b152725e0a7105fcd1189a',
                                '64b4d581a75a9903cad93ded',
                                '64b503ba4979612d537ce41c',
                                '64b54e5b8fd6ec7b6a4fc8e1',
                                '64b4a906937bbe20a7ab9981',
                                '64b4d81b9ce4206a1f0dc077'
                                ]
        
        
            // block rooms for movement
            if( 1 == 1 ){
        
                // manual
                Memory.avoidRooms_tmp = [
                                        //'E24N12', 'E16N12','E24N14','E25N14','E26N14','E27N14','E28N14','E17N28','E13N8','E19N1'
                                        //'W13N15','W12N13','W15N14','W12N15'
                                        ]
        
                // observer blocks
                if( !Memory.avoidRooms_observer ){
                    Memory.avoidRooms_observer = {}
                }

                /// need to add SAFE MODE ROOMS UPDATE
                // // observer blocks
                // if( !Memory.avoidRooms_safemode ){
                //     Memory.avoidRooms_safemode = {}
                // }
        
                Memory.avoidRooms_tmp = _.union(Memory.avoidRooms_tmp, 
                                                Object.keys( Memory.avoidRooms_observer ) )
        
         
            }
        
            // block rooms for auto attack
            if( 1 == 1 ){
        
                // by username
                if( Game.shard.name == 'swc' || Game.shard.name == 'screepsplus0' || Game.shard.name == 'ba' || Game.shard.name == 'botarena' ){
                    Memory.autoAttackBlockListUserName = [ ] 
                    Memory.autoAttackBlockListRoomName = [ ]
                }
                else{
                    Memory.autoAttackBlockListUserName = [
                                                        ['asdpof',      1],
                                                        ['Modus',       1],
                                                        ['Mototroller', 1], // peace treaty
                                                        ['Harabi',      1], // até 2023-10-01
                                                        //['Raykazi',     1], // até 2022-12-25
                                                        //['DroidFreak',  1], // até 2023-10-13
                                                        ['AzuraStar',   1], 
                                                        ['_aeixovu_',   6],    //temp
                                                        ['Robinlub_UG_NL', 6], //temp
                                                        ['PandaFlower',   6], // temp
                                                        ['initiaI',     7],
                                                        ['dragoonreas', 8],
                                                        ['AzuraStar',   8],
                                                        ['ReubenT',     8],
                                                        ['liaohuo',     8],
                                                        ['Revrick',     8],
                                                        ['TuN9aN0',     8],
                                                        ['ManVsRice',   8]
                                                        ]


                    Memory.autoAttackBlockListRoomName = [
                                                        'W15N53', 'W13N51','W12N53', //droid

                                                        // block1
                                                        'W59N39','W59N35','W59N34','W57N36','W57N34','W55N33','W55N31','W51N33',
                                                        'W54N39','W51N39','W52N36','W53N34','W45N41',
                                                        
                                                        // block2
                                                        'W42N48','W42N47','W42N45','W43N48','W45N48','W45N47','W47N47',
                                                        'W49N41','W48N42','W47N42','W46N41','W46N43','W47N44','W49N44','W49N45','W47N45'

                                                        ]
                }  
            }
        }
        //


        // manual lab
        if( Game.time % 27 == 0 ){
        
              Memory.manualLabs = {}
        
              Memory.manualLabs['W3N1111'] = {}
              Memory.manualLabs['W3N1111'].boost = 'boost3'
        
        }
        //

        // auto-balance
        if( !Memory.config || Game.time % 20000 == 0 || 1==1){

            if( !Memory.config ){
                Memory.config = {}
            }

            // min energy level
            Memory.config.min_energy_lvl = {}
            Memory.config.min_energy_lvl.terminal_rec_defend = 1.200
            Memory.config.min_energy_lvl.terminal_rec_nuke = 1.000
            Memory.config.min_energy_lvl.terminal_rec_build = 0.650
            Memory.config.min_energy_lvl.terminal_rec_attack = 0.800
            Memory.config.min_energy_lvl.terminal_rec_low_res = 0.450
            Memory.config.min_energy_lvl.terminal_rec_util = 0.750
            
            Memory.config.min_energy_lvl.terminal_send_prior0 = 1.200       // defend
            Memory.config.min_energy_lvl.terminal_send_prior1 = 1.000       // other rec modes
            Memory.config.min_energy_lvl.terminal_send_prior2 = 0.800       // else

            Memory.config.min_energy_lvl.process_pwr = 0.950    
            Memory.config.min_energy_lvl.factory = 0.420   
            Memory.config.min_energy_lvl.balance_stg_term = 0.400

            Memory.config.min_energy_lvl.upgrade_high = 0.850
            Memory.config.min_energy_lvl.upgrade_low = 0.800

            Memory.config.min_energy_lvl.repair_high = 0.950
            Memory.config.min_energy_lvl.repair_med = 0.550
            Memory.config.min_energy_lvl.repair_low = 0.300

            Memory.config.min_energy_lvl.build = Memory.config.min_energy_lvl.terminal_rec_build - 0.050 // 0.600

            Memory.config.min_energy_lvl.defender_high = 0.550
            Memory.config.min_energy_lvl.defender_low = 0.400

            Memory.config.min_energy_lvl.colonizer = 0.480
            Memory.config.min_energy_lvl.strongholds = 0.900
            Memory.config.min_energy_lvl.powerBanks = 0.900
            Memory.config.min_energy_lvl.depositsBank = 0.900 
            Memory.config.min_energy_lvl.storage_list = 0.900
            Memory.config.min_energy_lvl.mineralsBank = 0.900

            Memory.config.min_energy_lvl.remotes_high = 0.500
            Memory.config.min_energy_lvl.remotes_low = 0.300

            Memory.config.min_energy_lvl.auto_attack = Memory.config.min_energy_lvl.terminal_rec_attack - 0.150 // 0.650

              
            if( !Memory.config.outpost_max_dist )           { Memory.config.outpost_max_dist = 130 }
        
            // if( !Memory.config.outpost_ignore_list )        { Memory.config.outpost_ignore_list = [] }
            // if( !Memory.config.ally_list )                  { Memory.config.ally_list = [] }
            //
            // // one-timer
            // Memory.config.one_timer_productionLab           = 0
      
            // // militar
            //                                              0    1      2      3      4      5      6      7      8      defend
            Memory.config.freq_tower_scan               = [ 1   ,7     ,7     ,7     ,3     ,2     ,2     ,3     ,1     ,1      ]
           
            // // Memory.config.whitelist                     = []
            //
            // // frequencies
            // // intel
            // //                                              0   1       2       3       4       5       6       7       8       defend
            Memory.config.freq_intel_structures_energy  = [ 1   ,1      ,3      ,4      ,7      ,7       ,5     , 5     , 9     ,11     ]
            Memory.config.freq_intel_ruins              = [ 1   ,5      ,100    ,100    ,100000 ,100000 ,100000 ,100000 ,100000 ,3      ]
            Memory.config.freq_intel_towers             = [ 1   ,55     ,55     ,55     ,55     ,55     ,55     ,55     ,55     ,20     ]
            Memory.config.freq_intel_construction       = [ 1   ,2     ,2      ,10     ,25     ,50      ,200    ,200    ,200    ,5     ]
            Memory.config.freq_intel_tombstone          = [ 1   ,5      ,5      ,5      ,15     ,25     ,25     ,35     ,35     ,99999  ]
            Memory.config.freq_intel_dropped            = [ 1   ,5      ,5      ,5      ,25     ,80     ,100    ,100    ,100    ,99999  ]
            Memory.config.freq_intel_minerals           = [ 1   ,500  ,500  ,500  ,500  ,500  ,150    ,150    ,150    ,150    ]
            //
            // Memory.config.freq_intel_creep_fill         = [ 1   ,5      ,5      ,5      ,15     ,15     ,15     ,15     ,15     ,15     ]
            Memory.config.freq_intel_storage            = [ 1   ,1000   ,1000   ,1000   ,17     ,100    ,100    ,100    ,150    ,17     ]
            // Memory.config.freq_intel_controller         = [ 1   ,5      ,10     ,25     ,25     ,25     ,125    ,125    ,125    ,125    ]
            Memory.config.freq_intel_repair             = [ 1   ,300    ,300    ,300    ,300    ,300    ,300    ,300    ,300    ,10     ]
            // Memory.config.freq_intel_enemies            = [ 1   ,7      ,7      ,7      ,7      ,7      ,7      ,7      ,7      ,1      ]
            //
            Memory.config.freq_collect                  = 1
            //
            // spawn
            Memory.config.freq_manager_spawn            = [ 1   ,1      ,1      ,1      ,1      ,1      ,1      ,2      ,3      ,3     ]

            // base
            Memory.config.freq_base_build              = [ 1   ,15     ,15     ,15     ,15     ,15     ,15     ,15     ,15     ,15     ]
            Memory.config.freq_base_reset              = [ 1   ,250    ,250    ,250    ,250    ,500    ,1000   ,1800   ,1800   ,50     ]
            Memory.config.freq_base_flags              = [ 1   ,253    ,253    ,153    ,53     ,53     ,53     ,153    ,153    ,3      ]
            //
            // // outpost (nao pode ser maior do que a metade da frequencia do observer para o observer atualizar)
            Memory.config.freq_outpost_order            = [ 1   ,50     ,100    ,100    ,100    ,500    ,3000   ,3000    ,3000  ,1500   ]
            // Memory.config.freq_remotes_order            = [ 1   ,50     ,100    ,100    ,100    ,500    ,3000   ,3000    ,3000  ,1500   ]
            
            // terminal minumium level
            Memory.config.terminal_en_min               = 10000
            if( !Memory.config.freq_terminal_send ){
                Memory.config.freq_terminal_send = {}
            }
            
            // lab freq
            Memory.config.freq_lab = 500
            //

            // storage minimum level per level
            Memory.config.storage_lvl                   = []
            Memory.config.storage_lvl[0]                = 0
            Memory.config.storage_lvl[1]                = 0
            Memory.config.storage_lvl[2]                = 0
            Memory.config.storage_lvl[3]                = 0
            Memory.config.storage_lvl[4]                = 0
            Memory.config.storage_lvl[5]                = 50000
            Memory.config.storage_lvl[6]                = 100000
            Memory.config.storage_lvl[7]                = 250000
            Memory.config.storage_lvl[8]                = 500000



            // Walls and ramparts                           0        1       2       3       4       5                                  6                               7                               8                               9
            var mult = 1
            if( Memory.stats && Memory.stats.number_rooms ){
                var mult = Math.max( Memory.stats.number_rooms * 1.2, 1 );
            }
            
            Memory.config.walls_def_hits                = [ 20000,  20000,  20000,  100000, 100000, Math.min(100000*mult,500000),    Math.min(150000*mult,1000000),  Math.min(200000*mult,5000000),   Math.min(600000*mult,10000000),    0   ]
            
            // Memory.config.walls_def_hits_core           = [ 10000,  10000,  10000,  20000,  50000 , 50000 ,                           Math.min(100000*mult,1000000),  Math.min(100000*mult,5000000),   Math.min(100000*mult, 7500000),    0   ]
            // Memory.config.walls_def_hits_lab            = [ 10000,  10000,  10000,  10000,  50000 , 50000 ,                           100000,                         100000,                          500000,                           0   ]
            //
            // var limit = 1
            //
            // //                                               ]
            // // harv 2 1 1 - no reserver - no work
            // Memory.config.hauler_size                   = []
            //
            //
            // // desc                                      carry , move ,sp_time,   #
            // Memory.config.hauler_size[1]                = []
            // Memory.config.hauler_size[1][5] = [2,2,32,1,0.55,1.1,1.12]
            // Memory.config.hauler_size[1][10] = [2,2,34,1,0.7,1.1,1.13]
            // Memory.config.hauler_size[1][15] = [2,2,36,1,0.85,1,1.15]
            // Memory.config.hauler_size[1][20] = [2,2,38,2,1.01,1,1.16]
            // Memory.config.hauler_size[1][25] = [2,2,40,2,1.15,1,1.17]
            // Memory.config.hauler_size[1][30] = [2,2,42,2,1.3,1,1.19]
            // Memory.config.hauler_size[1][35] = [2,2,45,2,1.47,0.9,1.2]
            // Memory.config.hauler_size[1][40] = [2,2,47,2,1.65,0.9,1.22]
            // Memory.config.hauler_size[1][45] = [2,2,49,2,1.81,0.9,1.24]
            // Memory.config.hauler_size[1][50] = [2,2,51,2,1.9,0.8,1.25]
            // Memory.config.hauler_size[1][55] = [2,2,54,3,2.13,0.8,1.27]
            // Memory.config.hauler_size[1][60] = [2,2,56,3,2.28,0.8,1.28]
            // Memory.config.hauler_size[1][65] = [2,2,59,3,2.45,0.7,1.3]
            // Memory.config.hauler_size[1][70] = [2,2,62,3,2.65,0.7,1.32]
            // Memory.config.hauler_size[1][75] = [2,2,62,3,2.65,0.7,1.32]
            // Memory.config.hauler_size[1][80] = [2,2,66,3,2.9,0.6,1.35]
            // Memory.config.hauler_size[1][85] = [2,2,71,4,3.21,0.6,1.38]
            // Memory.config.hauler_size[1][90] = [2,2,71,4,3.21,0.6,1.38]
            // Memory.config.hauler_size[1][95] = [2,2,77,4,3.61,0.5,1.42]
            // Memory.config.hauler_size[1][100] = [2,2,77,4,3.61,0.5,1.42]
            // Memory.config.hauler_size[1][105] = [2,2,78,4,3.61,0.5,1.43]
            // Memory.config.hauler_size[1][110] = [2,2,86,5,4.15,0.4,1.48]
            // Memory.config.hauler_size[1][115] = [2,2,87,5,4.15,0.4,1.48]
            // Memory.config.hauler_size[1][120] = [2,2,87,5,4.15,0.4,1.49]
            // Memory.config.hauler_size[1][125] = [2,2,88,5,4.15,0.3,1.49]
            // Memory.config.hauler_size[1][130] = [2,2,99,5,4.9,0.2,1.56]
            // Memory.config.hauler_size[1][135] = [2,2,100,5,4.9,0.2,1.57]
            // Memory.config.hauler_size[1][140] = [2,2,101,5,4.9,0.2,1.58]
            // Memory.config.hauler_size[1][145] = [2,2,102,5,4.9,0.2,1.58]
            // Memory.config.hauler_size[1][150] = [2,2,102,5,4.9,0.2,1.59]
            //
            // // desc                                      carry , move ,sp_time,   #
            // Memory.config.hauler_size[2]                = []
            // Memory.config.hauler_size[2][5] = [2,2,49,1,0.85,3.9,0.49]
            // Memory.config.hauler_size[2][10] = [2,2,55,2,1.3,3.8,0.51]
            // Memory.config.hauler_size[2][15] = [2,2,60,2,1.75,3.7,0.52]
            // Memory.config.hauler_size[2][20] = [2,2,66,3,2.22,3.7,0.53]
            // Memory.config.hauler_size[2][25] = [2,2,72,3,2.65,3.6,0.55]
            // Memory.config.hauler_size[2][30] = [2,2,78,4,3.1,3.5,0.56]
            // Memory.config.hauler_size[2][35] = [2,2,85,4,3.61,3.4,0.58]
            // Memory.config.hauler_size[2][40] = [2,2,92,5,4.15,3.4,0.6]
            // Memory.config.hauler_size[2][45] = [2,2,99,5,4.62,3.3,0.61]
            // Memory.config.hauler_size[2][50] = [2,2,103,5,4.9,3.2,0.62]
            // Memory.config.hauler_size[2][55] = [2,2,112,6,5.59,3.1,0.64]
            // Memory.config.hauler_size[2][60] = [2,2,119,7,6.03,3,0.66]
            // Memory.config.hauler_size[2][65] = [2,2,126,7,6.54,3,0.68]
            // Memory.config.hauler_size[2][70] = [2,2,135,8,7.15,2.8,0.7]
            // Memory.config.hauler_size[2][75] = [2,2,136,8,7.15,2.8,0.7]
            // Memory.config.hauler_size[2][80] = [2,2,146,8,7.9,2.7,0.73]
            // Memory.config.hauler_size[2][85] = [2,2,160,9,8.84,2.5,0.76]
            // Memory.config.hauler_size[2][90] = [2,2,161,9,8.84,2.5,0.76]
            // Memory.config.hauler_size[2][95] = [2,2,179,11,10.04,2.3,0.8]
            // Memory.config.hauler_size[2][100] = [2,2,180,11,10.04,2.3,0.8]
            // Memory.config.hauler_size[2][105] = [2,2,181,11,10.04,2.3,0.81]
            // Memory.config.hauler_size[2][110] = [2,2,205,12,11.65,2,0.86]
            // Memory.config.hauler_size[2][115] = [2,2,206,12,11.65,2,0.87]
            // Memory.config.hauler_size[2][120] = [2,2,208,12,11.65,2,0.87]
            // Memory.config.hauler_size[2][125] = [2,2,209,12,11.65,2,0.88]
            // Memory.config.hauler_size[2][130] = [2,2,243,14,13.9,1.6,0.95]
            // Memory.config.hauler_size[2][135] = [2,2,245,14,13.9,1.5,0.96]
            // Memory.config.hauler_size[2][140] = [2,2,247,14,13.9,1.5,0.96]
            // Memory.config.hauler_size[2][145] = [2,2,249,14,13.9,1.5,0.97]
            // Memory.config.hauler_size[2][150] = [2,2,251,14,13.9,1.5,0.97]
            //
            //
            // // harv 5 5 1 - no reserver - no work
            // // desc                                      carry , move ,sp_time,   #
            // Memory.config.hauler_size[3]                = []
            // Memory.config.hauler_size[3][5] = [2,2,65,2,1.35,7.5,0.38]
            // Memory.config.hauler_size[3][10] = [2,2,77,3,2.3,7.4,0.4]
            // Memory.config.hauler_size[3][15] = [2,2,89,4,3.25,7.2,0.41]
            // Memory.config.hauler_size[3][20] = [2,2,101,5,4.25,7.1,0.43]
            // Memory.config.hauler_size[3][25] = [2,2,113,6,5.15,6.9,0.44]
            // Memory.config.hauler_size[3][30] = [2,2,126,7,6.1,6.8,0.46]
            // Memory.config.hauler_size[3][35] = [2,2,140,8,7.19,6.6,0.47]
            // Memory.config.hauler_size[3][40] = [2,2,155,9,8.32,6.4,0.49]
            // Memory.config.hauler_size[3][45] = [2,2,168,10,9.31,6.3,0.51]
            // Memory.config.hauler_size[3][50] = [2,2,177,10,9.9,6.1,0.52]
            // Memory.config.hauler_size[3][55] = [2,2,197,12,11.36,5.9,0.54]
            // Memory.config.hauler_size[3][60] = [2,2,210,13,12.28,5.7,0.56]
            // Memory.config.hauler_size[3][65] = [2,2,225,14,13.35,5.6,0.58]
            // Memory.config.hauler_size[3][70] = [2,2,244,15,14.65,5.3,0.6]
            // Memory.config.hauler_size[3][75] = [2,2,246,15,14.65,5.3,0.6]
            // Memory.config.hauler_size[3][80] = [2,2,268,17,16.23,5,0.63]
            // Memory.config.hauler_size[3][85] = [2,2,297,19,18.21,4.7,0.66]
            // Memory.config.hauler_size[3][90] = [2,2,299,19,18.21,4.7,0.67]
            // Memory.config.hauler_size[3][95] = [2,2,336,21,20.76,4.2,0.71]
            // Memory.config.hauler_size[3][100] = [2,2,338,21,20.76,4.2,0.72]
            // Memory.config.hauler_size[3][105] = [2,2,341,21,20.76,4.1,0.72]
            // Memory.config.hauler_size[3][110] = [2,2,391,25,24.15,3.6,0.78]
            // Memory.config.hauler_size[3][115] = [2,2,393,25,24.15,3.5,0.78]
            // Memory.config.hauler_size[3][120] = [2,2,396,25,24.15,3.5,0.79]
            // Memory.config.hauler_size[3][125] = [2,2,399,25,24.15,3.4,0.79]
            // Memory.config.hauler_size[3][130] = [2,2,471,29,28.9,2.6,0.88]
            // Memory.config.hauler_size[3][135] = [2,2,475,29,28.9,2.5,0.88]
            // Memory.config.hauler_size[3][140] = [2,2,479,29,28.9,2.5,0.89]
            // Memory.config.hauler_size[3][145] = [2,2,483,29,28.9,2.4,0.89]
            // Memory.config.hauler_size[3][150] = [2,2,487,29,28.9,2.3,0.9]
            //
            // if( Game.gcl.level <= limit ){
            //     // harv 6 6 2 - reserver 2 2 - work
            //     // desc                                      carry , move ,sp_time,   #
            //     Memory.config.hauler_size[4]                = []
            //     Memory.config.hauler_size[4][5] = [2,2,62,2,1.35,7.5,0.38]
            //     Memory.config.hauler_size[4][10] = [2,2,74,3,2.3,7.4,0.4]
            //     Memory.config.hauler_size[4][15] = [2,2,85,4,3.25,7.2,0.41]
            //     Memory.config.hauler_size[4][20] = [2,2,98,5,4.25,7.1,0.43]
            //     Memory.config.hauler_size[4][25] = [2,2,110,6,5.15,6.9,0.44]
            //     Memory.config.hauler_size[4][30] = [2,2,122,7,6.1,6.8,0.46]
            //     Memory.config.hauler_size[4][35] = [2,2,137,8,7.19,6.6,0.47]
            //     Memory.config.hauler_size[4][40] = [2,2,152,9,8.32,6.4,0.49]
            //     Memory.config.hauler_size[4][45] = [2,2,165,10,9.31,6.3,0.51]
            //     Memory.config.hauler_size[4][50] = [2,2,174,10,9.9,6.1,0.52]
            //     Memory.config.hauler_size[4][55] = [2,2,194,12,11.36,5.9,0.54]
            //     Memory.config.hauler_size[4][60] = [2,2,207,13,12.28,5.7,0.56]
            //     Memory.config.hauler_size[4][65] = [2,2,222,14,13.35,5.6,0.58]
            //     Memory.config.hauler_size[4][70] = [2,2,241,15,14.65,5.3,0.6]
            //     Memory.config.hauler_size[4][75] = [2,2,242,15,14.65,5.3,0.6]
            //     Memory.config.hauler_size[4][80] = [2,2,265,17,16.23,5,0.63]
            //     Memory.config.hauler_size[4][85] = [2,2,294,19,18.21,4.7,0.66]
            //     Memory.config.hauler_size[4][90] = [2,2,296,19,18.21,4.7,0.67]
            //     Memory.config.hauler_size[4][95] = [2,2,333,21,20.76,4.2,0.71]
            //     Memory.config.hauler_size[4][100] = [2,2,335,21,20.76,4.2,0.72]
            //     Memory.config.hauler_size[4][105] = [2,2,337,21,20.76,4.1,0.72]
            //     Memory.config.hauler_size[4][110] = [2,2,387,25,24.15,3.6,0.78]
            //     Memory.config.hauler_size[4][115] = [2,2,390,25,24.15,3.5,0.78]
            //     Memory.config.hauler_size[4][120] = [2,2,393,25,24.15,3.5,0.79]
            //     Memory.config.hauler_size[4][125] = [2,2,396,25,24.15,3.4,0.79]
            //     Memory.config.hauler_size[4][130] = [2,2,468,29,28.9,2.6,0.88]
            //     Memory.config.hauler_size[4][135] = [2,2,472,29,28.9,2.5,0.88]
            //     Memory.config.hauler_size[4][140] = [2,2,475,29,28.9,2.5,0.89]
            //     Memory.config.hauler_size[4][145] = [2,2,479,29,28.9,2.4,0.89]
            //     Memory.config.hauler_size[4][150] = [2,2,483,29,28.9,2.3,0.9]
            // }
            // else{
            //     // harv 6 6 2 - reserver 2 2 - work
            //     // desc                                      carry , move ,sp_time,   #
            //     Memory.config.hauler_size[4]                = []
            //     Memory.config.hauler_size[4][5] = [4,2,61,1,0.88,7.5,0.38]
            //     Memory.config.hauler_size[4][10] = [4,2,70,2,1.35,7.4,0.39]
            //     Memory.config.hauler_size[4][15] = [4,2,79,2,1.83,7.3,0.4]
            //     Memory.config.hauler_size[4][20] = [4,2,89,3,2.33,7.2,0.42]
            //     Memory.config.hauler_size[4][25] = [4,2,98,3,2.78,7.1,0.43]
            //     Memory.config.hauler_size[4][30] = [4,2,107,4,3.25,6.9,0.44]
            //     Memory.config.hauler_size[4][35] = [4,2,118,4,3.79,6.8,0.45]
            //     Memory.config.hauler_size[4][40] = [4,2,129,5,4.36,6.7,0.47]
            //     Memory.config.hauler_size[4][45] = [4,2,139,5,4.85,6.5,0.48]
            //     Memory.config.hauler_size[4][50] = [4,2,146,6,5.15,6.5,0.49]
            //     Memory.config.hauler_size[4][55] = [4,2,161,6,5.88,6.3,0.51]
            //     Memory.config.hauler_size[4][60] = [4,2,171,7,6.34,6.1,0.52]
            //     Memory.config.hauler_size[4][65] = [4,2,182,7,6.88,6,0.53]
            //     Memory.config.hauler_size[4][70] = [4,2,196,8,7.53,5.8,0.55]
            //     Memory.config.hauler_size[4][75] = [4,2,197,8,7.53,5.8,0.55]
            //     Memory.config.hauler_size[4][80] = [4,2,215,9,8.32,5.6,0.57]
            //     Memory.config.hauler_size[4][85] = [4,2,236,10,9.31,5.3,0.6]
            //     Memory.config.hauler_size[4][90] = [4,2,238,10,9.31,5.3,0.6]
            //     Memory.config.hauler_size[4][95] = [4,2,265,11,10.58,5,0.64]
            //     Memory.config.hauler_size[4][100] = [4,2,267,11,10.58,4.9,0.64]
            //     Memory.config.hauler_size[4][105] = [4,2,269,11,10.58,4.9,0.64]
            //     Memory.config.hauler_size[4][110] = [4,2,307,13,12.28,4.5,0.69]
            //     Memory.config.hauler_size[4][115] = [4,2,309,13,12.28,4.4,0.69]
            //     Memory.config.hauler_size[4][120] = [4,2,311,13,12.28,4.4,0.7]
            //     Memory.config.hauler_size[4][125] = [4,2,313,13,12.28,4.3,0.7]
            //     Memory.config.hauler_size[4][130] = [4,2,367,15,14.65,3.7,0.76]
            //     Memory.config.hauler_size[4][135] = [4,2,370,15,14.65,3.6,0.77]
            //     Memory.config.hauler_size[4][140] = [4,2,373,15,14.65,3.6,0.77]
            //     Memory.config.hauler_size[4][145] = [4,2,376,15,14.65,3.5,0.78]
            //     Memory.config.hauler_size[4][150] = [4,2,379,15,14.65,3.5,0.79]
            // }
            //
            // // desc                                      carry , move ,sp_time,   #
            // Memory.config.hauler_size[5]                = []
            // Memory.config.hauler_size[5][5] = [4,2,61,1,0.88,7.5,0.38]
            // Memory.config.hauler_size[5][10] = [4,2,70,2,1.35,7.4,0.39]
            // Memory.config.hauler_size[5][15] = [4,2,79,2,1.83,7.3,0.4]
            // Memory.config.hauler_size[5][20] = [4,2,89,3,2.33,7.2,0.42]
            // Memory.config.hauler_size[5][25] = [4,2,98,3,2.78,7.1,0.43]
            // Memory.config.hauler_size[5][30] = [4,2,107,4,3.25,6.9,0.44]
            // Memory.config.hauler_size[5][35] = [4,2,118,4,3.79,6.8,0.45]
            // Memory.config.hauler_size[5][40] = [4,2,129,5,4.36,6.7,0.47]
            // Memory.config.hauler_size[5][45] = [4,2,139,5,4.85,6.5,0.48]
            // Memory.config.hauler_size[5][50] = [4,2,146,6,5.15,6.5,0.49]
            // Memory.config.hauler_size[5][55] = [4,2,161,6,5.88,6.3,0.51]
            // Memory.config.hauler_size[5][60] = [4,2,171,7,6.34,6.1,0.52]
            // Memory.config.hauler_size[5][65] = [4,2,182,7,6.88,6,0.53]
            // Memory.config.hauler_size[5][70] = [4,2,196,8,7.53,5.8,0.55]
            // Memory.config.hauler_size[5][75] = [4,2,197,8,7.53,5.8,0.55]
            // Memory.config.hauler_size[5][80] = [4,2,215,9,8.32,5.6,0.57]
            // Memory.config.hauler_size[5][85] = [4,2,236,10,9.31,5.3,0.6]
            // Memory.config.hauler_size[5][90] = [4,2,238,10,9.31,5.3,0.6]
            // Memory.config.hauler_size[5][95] = [4,2,265,11,10.58,5,0.64]
            // Memory.config.hauler_size[5][100] = [4,2,267,11,10.58,4.9,0.64]
            // Memory.config.hauler_size[5][105] = [4,2,269,11,10.58,4.9,0.64]
            // Memory.config.hauler_size[5][110] = [4,2,307,13,12.28,4.5,0.69]
            // Memory.config.hauler_size[5][115] = [4,2,309,13,12.28,4.4,0.69]
            // Memory.config.hauler_size[5][120] = [4,2,311,13,12.28,4.4,0.7]
            // Memory.config.hauler_size[5][125] = [4,2,313,13,12.28,4.3,0.7]
            // Memory.config.hauler_size[5][130] = [4,2,367,15,14.65,3.7,0.76]
            // Memory.config.hauler_size[5][135] = [4,2,370,15,14.65,3.6,0.77]
            // Memory.config.hauler_size[5][140] = [4,2,373,15,14.65,3.6,0.77]
            // Memory.config.hauler_size[5][145] = [4,2,376,15,14.65,3.5,0.78]
            // Memory.config.hauler_size[5][150] = [4,2,379,15,14.65,3.5,0.79]
            //
            // // desc                                      carry , move ,sp_time,   #
            // Memory.config.hauler_size[6]                = []
            // Memory.config.hauler_size[6][5] = [6,3,65,1,0.72,7.5,0.38]
            // Memory.config.hauler_size[6][10] = [6,3,74,2,1.03,7.4,0.4]
            // Memory.config.hauler_size[6][15] = [6,3,83,2,1.35,7.3,0.41]
            // Memory.config.hauler_size[6][20] = [6,3,92,2,1.68,7.1,0.42]
            // Memory.config.hauler_size[6][25] = [6,3,101,2,1.98,7,0.43]
            // Memory.config.hauler_size[6][30] = [6,3,111,3,2.3,6.9,0.44]
            // Memory.config.hauler_size[6][35] = [6,3,121,3,2.66,6.8,0.46]
            // Memory.config.hauler_size[6][40] = [6,3,133,4,3.04,6.6,0.47]
            // Memory.config.hauler_size[6][45] = [6,3,143,4,3.37,6.5,0.48]
            // Memory.config.hauler_size[6][50] = [6,3,150,4,3.57,6.4,0.49]
            // Memory.config.hauler_size[6][55] = [6,3,164,5,4.05,6.2,0.51]
            // Memory.config.hauler_size[6][60] = [6,3,175,5,4.36,6.1,0.52]
            // Memory.config.hauler_size[6][65] = [6,3,186,5,4.72,6,0.54]
            // Memory.config.hauler_size[6][70] = [6,3,200,6,5.15,5.8,0.56]
            // Memory.config.hauler_size[6][75] = [6,3,201,6,5.15,5.8,0.56]
            // Memory.config.hauler_size[6][80] = [6,3,219,6,5.68,5.5,0.58]
            // Memory.config.hauler_size[6][85] = [6,3,240,7,6.34,5.3,0.6]
            // Memory.config.hauler_size[6][90] = [6,3,242,7,6.34,5.2,0.61]
            // Memory.config.hauler_size[6][95] = [6,3,270,8,7.19,4.9,0.64]
            // Memory.config.hauler_size[6][100] = [6,3,271,8,7.19,4.9,0.65]
            // Memory.config.hauler_size[6][105] = [6,3,273,8,7.19,4.8,0.65]
            // Memory.config.hauler_size[6][110] = [6,3,311,9,8.32,4.4,0.69]
            // Memory.config.hauler_size[6][115] = [6,3,313,9,8.32,4.4,0.7]
            // Memory.config.hauler_size[6][120] = [6,3,315,9,8.32,4.3,0.7]
            // Memory.config.hauler_size[6][125] = [6,3,318,9,8.32,4.3,0.71]
            // Memory.config.hauler_size[6][130] = [6,3,372,10,9.9,3.7,0.77]
            // Memory.config.hauler_size[6][135] = [6,3,375,10,9.9,3.6,0.77]
            // Memory.config.hauler_size[6][140] = [6,3,378,10,9.9,3.5,0.78]
            // Memory.config.hauler_size[6][145] = [6,3,381,10,9.9,3.5,0.78]
            // Memory.config.hauler_size[6][150] = [6,3,384,10,9.9,3.4,0.79]
            //
            // // desc                                      carry , move ,sp_time,   #
            // Memory.config.hauler_size[7]                = []
            // Memory.config.hauler_size[7][5] = [10,5,72,1,0.59,7.4,0.39]
            // Memory.config.hauler_size[7][10] = [10,5,81,1,0.78,7.3,0.4]
            // Memory.config.hauler_size[7][15] = [10,5,90,1,0.97,7.2,0.42]
            // Memory.config.hauler_size[7][20] = [10,5,100,2,1.17,7.1,0.43]
            // Memory.config.hauler_size[7][25] = [10,5,109,2,1.35,6.9,0.44]
            // Memory.config.hauler_size[7][30] = [10,5,118,2,1.54,6.8,0.45]
            // Memory.config.hauler_size[7][35] = [10,5,129,2,1.76,6.7,0.46]
            // Memory.config.hauler_size[7][40] = [10,5,140,2,1.98,6.5,0.48]
            // Memory.config.hauler_size[7][45] = [10,5,151,3,2.18,6.4,0.49]
            // Memory.config.hauler_size[7][50] = [10,5,157,3,2.3,6.3,0.5]
            // Memory.config.hauler_size[7][55] = [10,5,172,3,2.59,6.1,0.52]
            // Memory.config.hauler_size[7][60] = [10,5,183,3,2.78,6,0.53]
            // Memory.config.hauler_size[7][65] = [10,5,194,3,2.99,5.9,0.55]
            // Memory.config.hauler_size[7][70] = [10,5,208,4,3.25,5.7,0.56]
            // Memory.config.hauler_size[7][75] = [10,5,209,4,3.25,5.7,0.57]
            // Memory.config.hauler_size[7][80] = [10,5,227,4,3.57,5.5,0.59]
            // Memory.config.hauler_size[7][85] = [10,5,248,4,3.96,5.2,0.61]
            // Memory.config.hauler_size[7][90] = [10,5,250,4,3.96,5.2,0.62]
            // Memory.config.hauler_size[7][95] = [10,5,278,5,4.47,4.8,0.65]
            // Memory.config.hauler_size[7][100] = [10,5,280,5,4.47,4.8,0.65]
            // Memory.config.hauler_size[7][105] = [10,5,282,5,4.47,4.8,0.66]
            // Memory.config.hauler_size[7][110] = [10,5,319,6,5.15,4.3,0.7]
            // Memory.config.hauler_size[7][115] = [10,5,322,6,5.15,4.3,0.71]
            // Memory.config.hauler_size[7][120] = [10,5,324,6,5.15,4.2,0.71]
            // Memory.config.hauler_size[7][125] = [10,5,326,6,5.15,4.2,0.72]
            // Memory.config.hauler_size[7][130] = [10,5,381,7,6.1,3.6,0.78]
            // Memory.config.hauler_size[7][135] = [10,5,384,7,6.1,3.5,0.78]
            // Memory.config.hauler_size[7][140] = [10,5,387,7,6.1,3.4,0.79]
            // Memory.config.hauler_size[7][145] = [10,5,390,7,6.1,3.4,0.79]
            // Memory.config.hauler_size[7][150] = [10,5,393,7,6.1,3.3,0.8]
            //
            //
            // // desc                                      carry , move ,sp_time,   #
            // Memory.config.hauler_size[8]                = []
            // Memory.config.hauler_size[8][5] = [20,10,91,1,0.5,7.2,0.41]
            // Memory.config.hauler_size[8][10] = [20,10,99,1,0.59,7.1,0.42]
            // Memory.config.hauler_size[8][15] = [20,10,109,1,0.69,7,0.44]
            // Memory.config.hauler_size[8][20] = [20,10,119,1,0.79,6.8,0.45]
            // Memory.config.hauler_size[8][25] = [20,10,128,1,0.88,6.7,0.46]
            // Memory.config.hauler_size[8][30] = [20,10,137,1,0.97,6.6,0.47]
            // Memory.config.hauler_size[8][35] = [20,10,148,2,1.08,6.5,0.49]
            // Memory.config.hauler_size[8][40] = [20,10,159,2,1.19,6.3,0.5]
            // Memory.config.hauler_size[8][45] = [20,10,170,2,1.29,6.2,0.51]
            // Memory.config.hauler_size[8][50] = [20,10,177,2,1.35,6.1,0.52]
            // Memory.config.hauler_size[8][55] = [20,10,192,2,1.5,5.9,0.54]
            // Memory.config.hauler_size[8][60] = [20,10,202,2,1.59,5.8,0.55]
            // Memory.config.hauler_size[8][65] = [20,10,214,2,1.7,5.6,0.57]
            // Memory.config.hauler_size[8][70] = [20,10,228,2,1.83,5.5,0.59]
            // Memory.config.hauler_size[8][75] = [20,10,230,2,1.83,5.4,0.59]
            // Memory.config.hauler_size[8][80] = [20,10,246,2,1.98,5.2,0.61]
            // Memory.config.hauler_size[8][85] = [20,10,268,3,2.18,5,0.64]
            // Memory.config.hauler_size[8][90] = [20,10,270,3,2.18,4.9,0.64]
            // Memory.config.hauler_size[8][95] = [20,10,299,3,2.44,4.6,0.67]
            // Memory.config.hauler_size[8][100] = [20,10,301,3,2.44,4.6,0.68]
            // Memory.config.hauler_size[8][105] = [20,10,303,3,2.44,4.5,0.68]
            // Memory.config.hauler_size[8][110] = [20,10,341,3,2.78,4.1,0.73]
            // Memory.config.hauler_size[8][115] = [20,10,343,3,2.78,4,0.73]
            // Memory.config.hauler_size[8][120] = [20,10,346,3,2.78,4,0.74]
            // Memory.config.hauler_size[8][125] = [20,10,348,3,2.78,3.9,0.74]
            // Memory.config.hauler_size[8][130] = [20,10,402,4,3.25,3.3,0.8]
            // Memory.config.hauler_size[8][135] = [20,10,405,4,3.25,3.3,0.81]
            // Memory.config.hauler_size[8][140] = [20,10,409,4,3.25,3.2,0.81]
            // Memory.config.hauler_size[8][145] = [20,10,412,4,3.25,3.1,0.82]
            // Memory.config.hauler_size[8][150] = [20,10,415,4,3.25,3.1,0.83]

        }
    }
};

module.exports = Config;
