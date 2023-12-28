// manual spawn

var TesteSpawn= {

    run: function(rm) {

        if( !Game.rooms[rm].storage || ( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] >= (Memory.config.storage_lvl[ 8 ]) * .15) || 1==1  ){

            // ONE TIMER
            // TO DO

            // CONSTANT SPAWN
            var change_in_matrix = 0

            // 1st room
            if ( rm == 'W13N1' && 1==11  ) {

                var change_in_matrix = 1
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                var roles = [

                    ['claimer',            0,   0,     0,     5,      0,       0,       0,      0,     0,       1,     '',      0,      'W8S1',  1,        '0',            '0',            '0',        '0'    ],
                    
                    ['colonizer',          0,   0,     0,     5,      5,       0,       0,      0,     0,       0,     '',     0,       'W8S1',118.63,       '0',            '0',            '2',        '0'    ],
                    ['colonizer',          0,   0,     0,     6,      0,       6,       0,      0,     0,       0,     '',     0,       'W8S1',118.64,       '0',            '0',            '3',        '0'    ],
                    ['colonizer',          0,   0,     0,     6,      6,       6,       0,      0,     0,       0,     '',     0,       'W8S1',118.65,       '0',            '0',            '4',        '0'    ],
                    ['colonizer',          0,   0,     0,     5,      5,       0,       0,      0,     0,       0,     '',     0,       'W8S1',118.66,       '0',            '0',            '5',        '0'    ],

                    ['controller_att',     0,   0,     0,    12,      0,       0,       0,      0,     0,       8,     '',       0,      'E19N2', 5,       '0',            '0',           '40',        '0'    ],
                    ['controller_att',     0,   0,     0,    12,      0,       0,       0,      0,     0,       8,     '',       0,      'W76N43',155,       '0',            '0',           '40',        '0'    ],
                    
                    ['reserver',           0,   0,     0,    12,      0,       0,       0,      0,     0,       8,     '',     200,      'E1N4', 308,       '1',            '0',            '5',        '0'    ],
                    ['2a_healer',          0,   0,     0,     5,      0,       0,       0,      2,     3,       0,     '',     550,      'E1N4', 40,       '0',            '0',            '1',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,     8,      0,       0,       8,      0,     0,       0,     '',     550,      'E1N4', 40,       '1',            '0',            '1',        '0'    ],

                    //unbooste
                    ['2a_healer',          0,   0,     3,     9,      0,       0,       0,      0,     6,       0,     '',     600,      'E3N61', 151,       '0',            '0',            '1',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    26,      0,       0,      24,      0,     0,       0,     '',     600,      'E3N61', 151,       '1',            '0',            '1',        '0'    ],

                    //unbooste
                    ['2a_healer',          0,   0,     3,     9,      0,       0,       0,      0,     6,       0,     '',     750,      'E3N61', 153,       '0',            '0',            '3',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    26,      0,       0,      12,     12,     0,       0,     '',     750,      'E3N61', 153,       '1',            '0',            '3',        '0'    ],

                    // boost3
                    ['squad',              0,  0,     0,    10,      0,       0,      40,      0,     0,       0,     '',     600,      'E16N1',  5,       '1',            '1',            '4',        '0'    ],
                    ['squad',              0,  0,     0,     7,      0,       0,       0,     18,    10,       0,     '',     600,      'E16N1',  5,       '2',            '1',            '4',        '0'    ],
                    ['squad',              0,  0,     4,     6,      0,       0,       0,      0,    20,       0,     '',     600,      'E16N1',  5,       '3',            '1',            '4',        '0'    ],
                    ['squad',              0,  0,     4,     6,      0,       0,       0,      0,    20,       0,     '',     600,      'E16N1',  5,       '4',            '1',            '4',        '0'    ],

                    // boost3
                    ['2a_healer',          0,   0,     4,     6,      0,       0,       0,      0,    20,       0,     '',      0,      'E3N61', 30,       '0',            '1',            '2',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    10,      0,       0,      40,      0,     0,       0,     '',      0,      'E3N61', 30,       '1',            '1',            '2',        '0'    ],


                    // ['2a_healer',          0,   1,     0,     5,      0,       0,       0,      0,     4,       0,     '',     700,      'E16N11', 40,       '0',            '0',            '2',        '0'    ] ,
                    // ['2a_capt',            0,   1,     0,     8,      0,       0,       0,      7,     0,       0,     '',     700,      'E16N11', 40,       '1',            '0',            '2',        '0'    ],

                    // ['controller_destroy', 0,   1,     0,     1,      0,       0,       0,      0,     0,       1,     '',       0,      'W77N36', 1,       '0',            '0',            '40',        '0'    ],
                    // ['controller_destroy', 0,   1,     0,     1,      0,       0,       0,      0,     0,       1,     '',       0,      'W76N43', 1,       '0',            '0',            '40',        '0'    ],

                    // ['2a_healer',          0,   1,     0,    10,      0,       0,       0,      0,    40,       0,     '',     000,      'E45N58', 15,       '0',            '1',            '1',        '0'    ] ,
                    // ['2a_capt',            0,   1,     0,    10,     40,       0,       0,      0,     0,       0,     '',     000,      'E45N58', 15,       '1',            '1',            '1',        '0'    ] ,

                    ['move_cm1',           0,   0,     0,     1,      0,       2,       0,      0,     0,       0,     '',       0,      'E22N1', 10,       '0',            '0',            '0',        '0'   ],

                    // ['move_cm2',          0,    1,     0,     2,      0,       1,       0,      0,     0,       0,     '',       0,      'E25N0', 10,       'frame',            '0',            '0',        '0'   ],
                    // ['move_cm2',          0,    1,     0,     2,      0,       1,       0,      0,     0,       0,     '',       0,      'E25N0', 10,       'hydraulics',       '0',            '0',        '0'   ],

                    ['move_caravan',       0,   0,     0,     1,      0,       0,       0,      0,     0,       0,     '',       0,      'E13N0', 10,       '0',            '0',            '0',        '0'   ],

                    ['collector_sk',       0,   0,     0,   10,      0,      10,       0,      0,     0,       0,     '',       0,      'E25N4', 151,       '1',            '0',            '10',       '0'    ],

                    ['mineralSK',          0,   0,     0,    15,      5,      10,       0,      0,     0,       0,     '',     700,      'E15N15', 10,       '0',            '0',            '0',        '0'   ],

                    // H
                    ['mineralSK',          0,   0,     0,    26,      7,      17,       0,      0,     0,       0,     '',     700,      'E24N4', 33,       '0',            '0',            '0',        '0'   ],
                    ['mineralSK_help',     0,   0,     0,    25,      0,       0,      18,      1,     6,       0,     '',     550,      'E24N4', 30,       '1',            '0',            '10',       '0'    ],
                    // H
                    // ['mineralSK',          0,   1,     0,    26,      7,      17,       0,      0,     0,       0,     '',     700,      'E25N4', 33,       '0',            '0',            '0',        '0'   ],
                    // ['mineralSK_help',     0,   1,     0,    25,      0,       0,      18,      1,     6,       0,     '',     600,      'E25N4', 30,       '1',            '0',            '10',       '0'    ],

                    ['caravan',              0,  0,     1,    2,      0,       0,       0,      1,     0,       0,     '',       0,      'W0N0',  30,       '1',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    1,      0,       0,       0,      1,     0,       0,     '',       0,      'W0N0',  30,       '2',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    2,      0,       1,       0,      1,     0,       0,     '',       0,      'W0N0',  30,       '3',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    1,      0,       0,       0,      1,     0,       0,     '',       0,      'W0N0',  30,       '4',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    1,      0,       0,       0,      1,     0,       0,     '',       0,      'W0N0',  30,       '5',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    1,      0,       0,       0,      1,     0,       0,     '',       0,      'W0N0',  30,       '6',            '0',            '2',        '0'    ],

                    // ['caravan',              0,  1,     0,    1,      0,       0,       0,      0,     0,       0,     '',       0,      'E20S2',  35,       '1',            '0',            '2',        '0'    ],
                    // ['caravan',              0,  1,     0,    1,      0,       0,       0,      0,     0,       0,     '',       0,      'E20S2',  35,       '2',            '0',            '2',        '0'    ],
                    // ['caravan',              0,  1,     0,    1,      0,       0,       0,      0,     0,       0,     '',       0,      'E20S2',  35,       '3',            '0',            '2',        '0'    ],


                    // SQUAD lvl1 stronghold
                    // ['squad',              0,  1,     0,    25,      0,       0,      25,      0,     0,       0,     '',       0,      'E25N6',  30,       '1',            '0',            '1',        '0'    ],
                    // ['squad',              0,  1,     0,    25,      0,       0,       0,      0,    25,       0,     '',       0,      'E25N6',  30,       '2',            '0',            '1',        '0'    ],
                    // ['squad',              0,  1,     0,    25,      0,       0,       0,      0,    25,       0,     '',       0,      'E25N6',  30,       '3',            '0',            '1',        '0'    ],
                    // ['squad',              0,  1,     0,    25,      0,       0,       0,      0,    25,       0,     '',       0,      'E25N6',  30,       '4',            '0',            '1',        '0'    ],

                    // SQUAD lvl3 stronghold
                    // ['squad',              0,  1,     0,    10,      0,       0,      40,      0,     0,       0,     '',       0,      'E25N4',  30,       '1',            '1',            '3',        '0'    ],
                    // ['squad',              0,  1,     0,    10,      0,       0,       0,     10,    30,       0,     '',       0,      'E25N4',  30,       '2',            '1',            '3',        '0'    ],
                    // ['squad',              0,  1,     0,    10,      0,       0,       0,     10,    30,       0,     '',       0,      'E25N4',  30,       '3',            '1',            '3',        '0'    ],
                    // ['squad',              0,  1,     0,    10,      0,       0,       0,     10,    30,       0,     '',       0,      'E25N4',  30,       '4',            '1',            '3',        '0'    ],

                    // SQUAD lvl4 stronghold
                    // ['squad',              0,  1,     0,    10,      0,       0,      40,      0,     0,       0,     '',       0,      'E25N4',  30,       '1',            '1',            '3',        '0'    ],
                    // ['squad',              0,  1,     0,    10,      0,       0,       0,      0,    40,       0,     '',       0,      'E25N4',  30,       '2',            '1',            '3',        '0'    ],
                    // ['squad',              0,  1,     0,    10,      0,       0,       0,      0,    40,       0,     '',       0,      'E25N4',  30,       '3',            '1',            '3',        '0'    ],
                    // ['squad',              0,  1,     0,    10,      0,       0,       0,      0,    40,       0,     '',       0,      'E25N4',  30,       '4',            '1',            '3',        '0'    ],

                    // // SQUAD lvl 7 boosts 1
                    ['squad',              0,  0,     6,    16,      0,       0,      26,      0,     0,       0,     '',       0,      'E22N11',  30,       '1',            '1',            '3',        '0'    ],
                    ['squad',              0,  0,     6,    13,      0,       0,       0,      6,    14,       0,     '',       0,      'E22N11',  30,       '2',            '1',            '3',        '0'    ],
                    ['squad',              0,  0,     8,    13,      0,       0,       0,      0,    18,       0,     '',       0,      'E22N11',  30,       '3',            '1',            '3',        '0'    ],
                    ['squad',              0,  0,     8,    13,      0,       0,       0,      0,    18,       0,     '',       0,      'E22N11',  30,       '4',            '1',            '3',        '0'    ],

                    ['squad',              0,  0,     6,    16,      0,       0,      20,      6,     0,       0,     '',       0,      'E22N11',  151,       '1',            '1',            '4',        '0'    ],
                    ['squad',              0,  0,     6,    13,      0,       0,       0,      6,    14,       0,     '',       0,      'E22N11',  151,       '2',            '1',            '4',        '0'    ],
                    ['squad',              0,  0,     8,    13,      0,       0,       0,      0,    18,       0,     '',       0,      'E22N11',  151,       '3',            '1',            '4',        '0'    ],
                    ['squad',              0,  0,     8,    13,      0,       0,       0,      0,    18,       0,     '',       0,      'E22N11',  151,       '4',            '1',            '4',        '0'    ],

                    ['2a_healer',          0,   0,     0,    25,      0,       0,       0,     12,     8,       0,     '',     500,      'E22N11', 41,       '0',            '0',            '1',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    25,      0,       0,       0,     25,     0,       0,     '',     500,      'E22N11', 41,       '1',            '0',            '1',        '0'    ],

                    ['2a_healer',          0,   0,     0,    25,      0,       0,       0,     12,     8,       0,     '',     500,      'E22N11', 151,       '0',            '0',            '2',        '0'    ] ,
                    ['2a_capt',            0,   0,     3,    25,      0,       0,      22,      0,     0,       0,     '',     500,      'E22N11', 151,       '1',            '0',            '2',        '0'    ],


                    // SQUAD
                    // ['squad',              0,  1,     0,    12,     36,       0,       0,      0,     0,       0,     '',       0,      'E19S3',  30,       '1',            '1',            '2',        '0'    ],
                    // ['squad',              0,  1,     0,    12,      0,       0,       0,      0,    36,       0,     '',       0,      'E19S3',  30,       '2',            '1',            '2',        '0'    ],
                    // ['squad',              0,  1,     0,    12,      0,       0,       0,      0,    36,       0,     '',       0,      'E19S3',  30,       '3',            '1',            '2',        '0'    ],
                    // ['squad',              0,  1,     0,    12,      0,       0,       0,      5,    31,       0,     '',       0,      'E19S3',  30,       '4',            '1',            '2',        '0'    ],

                    // ['2a_healer',          0,   1,     0,    12,      0,       0,      16,     20,     0,       0,     '',     000,      'E19S3', 40,       '0',            '1',            '1',        '0'    ] ,
                    // ['2a_capt',            0,   1,     0,    12,      0,       0,       0,      0,    36,       0,     '',       0,      'E19S3', 40,       '1',            '1',            '1',        '0'    ],

                    // ['2a_healer',          0,   1,     8,    10,      0,       0,       0,      0,    32,       0,     '',     500,      'W51N23', 47,       '0',            '1',            '1',        '0'    ] ,
                    // ['2a_capt',            0,   1,    12,    10,      0,       0,      28,      0,     0,       0,     '',     500,      'W51N23', 47,       '1',            '1',            '1',        '0'    ] ,

                    // ['2a_healer',          0,   1,     0,    10,      0,       0,       0,     30,    10,       0,     '',     500,      'W60N21', 47,       '0',            '1',            '1',        '0'    ] ,
                    // ['2a_capt',            0,   1,     5,    10,      0,       0,      35,      0,     0,       0,     '',     500,      'W60N21', 47,       '1',            '1',            '1',        '0'    ] ,

                    ['blinker',            0,   0,     4,    10,      0,       0,       0,     28,     8,       0,     '',       0,      'E48N40', 46,       '0',            '1',            '0',        '0'    ],  // 2 towers
                    ['blinker',            0,   0,     6,    10,      0,       0,       0,     21,    13,       0,     '',       0,      'W71S2',  50,       '0',            '1',            '0',        '0'    ],  // 3 towers
                    ['blinker',            0,   0,    10,    10,      0,       0,       0,     10,    20,       0,     '',       0,      'W4N41',  50,       '0',            '1',            '0',        '0'    ],  // 5 towers
                    ['blinker',            0,   0,    10,    10,      0,       0,       0,     10,    20,       0,     '',       0,      'E48N40', 50,       '0',            '1',            '0',        '0'    ],  // 5 towers
                    ['blinker',            0,   0,    11,    10,      0,       0,       0,      6,    23,       0,     '',     300,      'W71S2',  45,       '0',            '1',            '0',        '0'    ],  // 6 towers

                    ['blinker',            0,   0,     0,   25,      0,       0,      18,      1,     6,       0,     '',     250,      'W4N5', 151,       '0',            '0',            '16',        '0'    ],

                    // ['blinker',            0,   3,     0,    27,      0,       0,       18,      5,     0,       0,     '',     550,      'W77N36', 150,       '0',            '0',            '1',        '0'    ],
                    // ['blinker',            0,   3,     0,    27,      0,       0,       18,      5,     0,       0,     '',     550,      'W76N43', 151,       '0',            '0',            '1',        '0'    ],

                    // ['2a_healer',          0,   1,     0,    10,      0,       0,       0,     25,    15,       0,     '',     500,      'W50N22', 47,       '0',            '1',            '2',        '0'    ] ,
                    // ['2a_capt',            0,   1,     5,    10,      0,       0,      35,      0,     0,       0,     '',     500,      'W50N22', 47,       '1',            '1',            '2',        '0'    ] ,

                    // ['2a_healer',          0,   1,     5,    10,      0,       0,       0,     20,    15,       0,     '',     500,      'W50N23', 48,       '0',            '1',            '2',        '0'    ] ,
                    // ['2a_capt',            0,   1,     5,    10,      0,       0,      35,      0,     0,       0,     '',     500,      'W50N23', 48,       '1',            '1',            '2',        '0'    ] ,

                    // ['2a_healer',          0,   1,     5,    10,      0,       0,       0,     20,    15,       0,     '',     500,      'W50N23', 48,       '0',            '1',            '3',        '0'    ] ,
                    // ['2a_capt',            0,   1,     5,    10,      0,       0,      35,      0,     0,       0,     '',     500,      'W50N23', 48,       '1',            '1',            '3',        '0'    ] ,


                    ['mover',              0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',      60,      'E15N61', 51,       '0',            '0',            '0',        '0'    ],
                    ['mover',              0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',      60,      'E13N61', 51,       '0',            '0',            '0',        '0'    ],
                    ['mover',              0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',      60,      'E21N61', 52,       '0',            '0',            '0',        '0'    ]

                      ]



                    var rm_tmp = roles[2][13]
                    if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] >= Game.rooms[rm].memory.storage_lvl * .45 &&
                        Game.rooms[rm_tmp] && Game.rooms[rm_tmp].controller.owner && Game.rooms[rm_tmp].controller.owner.username && !Game.rooms[rm_tmp].controller.my &&
                      ( !Game.rooms[rm_tmp].controller.upgradeBlocked || Game.rooms[rm_tmp].controller.upgradeBlocked < 650 ) &&
                        !Game.rooms[rm_tmp].controller.safeMode > 0 && 1 == 11 ){

                        var enemies = Game.rooms[rm].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  {return (
                                                                                                        ( creep.getActiveBodyparts(ATTACK) > 0 || creep.getActiveBodyparts(RANGED_ATTACK) > 0 ) &&
                                                                                                        creep.owner.username != 'Mitsuyoshi' &&
                                                                                                        creep.owner.username != 'slowmotionghost' &&
                                                                                                        creep.owner.username != 'Silten' &&
                                                                                                        creep.owner.username != 'Raggy'  ) } }   );

                        if( enemies.length>=1){
                            //
                        }
                        else{
                            if( Game.rooms[rm_tmp].controller.upgradeBlocked > 550 ){
                                roles[2][2] = 2
                            }
                            else{
                                roles[2][2] = 1
                            }
                        }
                    }


            }

            // 2nd room
            if ( rm == 'W13N1' && 1==11 ) {

                var change_in_matrix = 1
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                var roles = [

                    ['claimer',            0,   1,     0,     5,      0,       0,       0,      0,     0,       1,     '',       0,      'W3S1',  5,       '0',            '0',            '0',        '0'    ],
                    ['colonizer',          0,   0,     0,    14,      7,       7,       0,      0,     0,       0,     '',       0,      'E29N19', 35,       '0',            '0',            '0',        '0'    ],

                    ['s5_reactor_claim',   0,   0,     0,     2,      0,       0,       0,      0,     0,       1,     '',       0,      'W5N15', 35,       '0',            '0',            '0',        '0'    ],
                    
                    ['s5_scorer_1container',0,  0,     0,     5,      5,       5,       0,      0,     0,       0,     '',     300,      'W5N15',  6,       '0',            '0',            '0',        '0'    ],
                    ['s5_scorer_2static',  0,   0,     0,     1,      0,       1,       0,      0,     0,       0,     '',     450,      'W5N15',  5,       '0',            '0',            '0',        '0'    ],
                    ['s5_scorer_3mover',   0,   0,     0,     1,      0,       1,       0,      0,     0,       0,     '',     300,      'W5N15',  7,       '0',            '0',            '0',        '0'    ],
                    
                    ['2a_healer',          0,   0,     0,    12,      0,       0,       0,      0,    38,       0,     '',     300,      'W8N9', 31,       '0',            '1',            '2',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    12,      0,       0,      30,      8,     0,       0,     '',     300,      'W8N9', 30,       '1',            '1',            '2',        '0'    ],
                    
                    ['2a_healer',          0,   0,     4,     4,      0,       0,       0,      4,     8,       0,     '',     300,      'W14N15', 303,       '0',            '1',            '1',        '0'    ] ,
                    ['2a_capt',            0,   0,     4,     4,      0,       0,      12,      0,     0,       0,     '',     300,      'W14N15', 302,       '1',            '1',            '1',        '0'    ],
                   
                    ['2a_healer',          0,   0,     4,     4,      0,       0,       0,      4,     8,       0,     '',     300,      'W15N15', 305,       '0',            '1',            '1',        '0'    ] ,
                    ['2a_capt',            0,   0,     4,     4,      0,       0,      12,      0,     0,       0,     '',     300,      'W15N15', 304,       '1',            '1',            '1',        '0'    ],
                   
                    ['2a_healer',          0,   0,     4,     4,      0,       0,       0,      4,     8,       0,     '',     300,      'W15N15', 307,       '0',            '1',            '2',        '0'    ] ,
                    ['2a_capt',            0,   0,     4,     4,      0,       0,      12,      0,     0,       0,     '',     300,      'W15N15', 306,       '1',            '1',            '2',        '0'    ],
                   
                    ['2a_healer',          0,   0,     4,     4,      0,       0,       0,      4,     8,       0,     '',     300,      'W15N15', 309,       '0',            '1',            '3',        '0'    ] ,
                    ['2a_capt',            0,   0,     4,     4,      0,       0,      12,      0,     0,       0,     '',     300,      'W15N15', 308,       '1',            '1',            '3',        '0'    ]
                   
                    
                 
                      ]

                if( Game.rooms['W5N15'] && 1==11 ){

                    var reactor = Game.rooms['W5N15'].find( FIND_REACTORS )[0]                    

                    if( reactor && reactor.my ){

                        var hostiles = Game.rooms['W5N15'].find(FIND_HOSTILE_CREEPS, {filter: function(cp) {return cp.getActiveBodyparts(ATTACK) >= 1 ||
                            cp.getActiveBodyparts(RANGED_ATTACK) >= 1 } } )

                        if( hostiles && hostiles.length > 0 ){

                        }
                        else{
                            roles[3][2] = 1
                            roles[4][2] = 1
                            roles[5][2] = 5
                            console.log(111111111111111111111111111111111111111)
                        }
                    }
                    else{
                        roles[3][2] = 0
                        roles[4][2] = 0
                        roles[5][2] = 0
                    }
                }


                // var rm_tmp = 'W9N12'
                // if( Game.rooms[rm_tmp] ){

                //     var hostiles = Game.rooms[rm_tmp].find(FIND_HOSTILE_CREEPS) 

                //     if( hostiles && hostiles.length >= 1 ){
                //         var spawn = 1 
                //         for ( var i = 0 ; i < hostiles.length ; i++){
                //             if( hostiles[i].getActiveBodyparts(RANGED_ATTACK) >= 3 ||
                //                 hostiles[i].getActiveBodyparts(ATTACK) >= 3 ){
                //                 var spawn = 0
                //                 break;
                //             }
                //         }

                //         if( spawn == 1  ){

                //             roles[6][2] = 1
                //             roles[7][2] = 1

                //             if( hostiles.length >= 4 ){
                //                 roles[6][2] = 2
                //                 roles[7][2] = 2
                //             }
                //         }
                //     }               
                // }
            }


            // 2nd room
            if ( rm == 'W6N13' && 1==11 ) {

                var change_in_matrix = 1
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                var roles = [

                    ['claimer',            0,   0,     0,     5,      0,       0,       0,      0,     0,       1,     '',       0,      'E29N19',  5,       '0',            '0',            '0',        '0'    ],
                    ['colonizer',          0,   0,     0,    14,      7,       7,       0,      0,     0,       0,     '',       0,      'E29N19', 35,       '0',            '0',            '0',        '0'    ],

                    ['s5_reactor_claim',   0,   0,     0,    15,      0,       0,       0,      0,     1,       1,     '',       0,      'W5N15', 35,       '0',            '0',            '0',        '0'    ],
                    
                    ['s5_scorer_1container',0,  0,     0,     5,      5,       5,       0,      0,     0,       0,     '',     300,      'W5N15',  6,       '0',            '0',            '0',        '0'    ],
                    ['s5_scorer_2static',  0,   1,     0,     1,      0,       0,       0,      0,     0,       0,     '',     750,      'W5N15',  5,       '0',            '0',            '0',        '0'    ],
                    ['s5_scorer_3mover',   0,   0,     0,     1,      0,       1,       0,      0,     0,       0,     '',     300,      'W5N15',  7,       '0',            '0',            '0',        '0'    ],

                    
                    ['helper',             0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',     300,      'W7N13',  200,       '0',            '0',            '0',        '0'    ]
               
                      ]

                var rm_temp = 'W5N15'
                if( Game.rooms[rm_temp] && Game.rooms['W6N13'].terminal.store['T'] >= 50 ){
                   
                    var reactor = Game.rooms[rm_temp].find( FIND_REACTORS )[0]

                    if( reactor.store['T'] < 500 ){ 
                        roles[5][2] = 16
                    }
                    else if( reactor.store['T'] < 700 ){ 
                        roles[5][2] = 12
                    }
                    else if( reactor.store['T'] < 900 ){ 
                        roles[5][2] = 9
                    }
                    else{
                        roles[5][2] = 6 
                    }
                    
                  
                    if( reactor && !reactor.my && Game.time % 10000 <= 5000 ){
                        roles[2][2] = 1
                    }
                   
                }
            }


            if ( rm == 'W3N13' && 1==11 ) {

                var change_in_matrix = 1
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                var roles = [

                    ['claimer',            0,   0,     0,     5,      0,       0,       0,      0,     0,       1,     '',       0,      'E29N19',  5,       '0',            '0',            '0',        '0'    ],
                    ['colonizer',          0,   0,     0,    14,      7,       7,       0,      0,     0,       0,     '',       0,      'E29N19', 35,       '0',            '0',            '0',        '0'    ],

                    ['s5_reactor_claim',   0,   0,     0,    15,      0,       0,       0,      0,     1,       1,     '',       0,      'W5N15', 35,       '0',            '0',            '0',        '0'    ],
                    
                    ['s5_scorer_1container',0,  0,     0,     5,      5,       5,       0,      0,     0,       0,     '',     300,      'W5N15',  6,       '0',            '0',            '0',        '0'    ],
                    ['s5_scorer_2static',  0,   1,     0,     1,      0,       0,       0,      0,     0,       0,     '',     750,      'W5N15',  5,       '0',            '0',            '0',        '0'    ],
                    ['s5_scorer_3mover',   0,   0,     0,     1,      0,       1,       0,      0,     0,       0,     '',     300,      'W5N15',  7,       '0',            '0',            '0',        '0'    ],

                    
                    ['helper',             0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',     300,      'W7N13',  200,       '0',            '0',            '0',        '0'    ]
               
                      ]
           
            }

            



           



            // 2nd room
            if ( rm == 'W6N18' && 1==11 ) {

                var change_in_matrix = 1
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                var roles = [

                    ['helper',             0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',     300,      'W2N14',  200,       '0',            '0',            '0',        '0'    ],
                    ['helper',             0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',     300,      'W4N12',  200,       '0',            '0',            '0',        '0'    ],
               
                    ['2a_healer',          0,   0,     0,    12,      0,       0,       0,      0,    10,       0,     '',     500,      'W7N23', 309,       '0',            '0',            '5',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    25,      0,       0,      25,      0,     0,       0,     '',     500,      'W7N23', 308,       '1',            '0',            '5',        '0'    ],
                   
                    ['reserver',           0,   0,     0,    12,      0,       0,       0,      0,     0,       8,     '',     200,      'W7N23', 308,       '1',            '0',            '5',        '0'    ],
                   
                    ['2a_healer',          0,   0,     0,    12,      0,       0,       0,      0,    10,       0,     '',     300,      'W9N16', 311,       '0',            '0',            '6',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    25,      0,       0,       5,     15,     0,       0,     '',     300,      'W9N16', 310,       '1',            '0',            '6',        '0'    ],
                   
                    ['2a_healer',          0,   0,     0,    21,      0,       0,       0,     10,    10,       0,     '',     300,      'W9N16', 313,       '0',            '0',            '7',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    30,      0,       0,      20,      0,     0,       0,     '',     300,      'W9N16', 312,       '1',            '0',            '7',        '0'    ]
                   
                      ]

                      if( Game.rooms[rm].memory.mode_defend == 0 ){

                        var rm_temp = 'W4N22'
                        if( Game.rooms[rm_temp] && Game.rooms[rm_temp].controller.my &&
                            Game.rooms[rm_temp].storage && !Game.rooms[rm_temp].terminal &&
                            Game.rooms[rm_temp].memory.mode_defend == 0 &&
                            (  Game.rooms[rm_temp].controller.level == 5 || Game.rooms[rm_temp].controller.level == 4 ) ){
                            roles[0][2] = 8
                            roles[0][13] = rm_temp
                        }  

                        var rm_temp = 'W5N17'
                        if( Game.rooms[rm_temp] && Game.rooms[rm_temp].controller.my &&
                            Game.rooms[rm_temp].storage && !Game.rooms[rm_temp].terminal &&
                            Game.rooms[rm_temp].memory.mode_defend == 0 && 
                            (  Game.rooms[rm_temp].controller.level == 5 || Game.rooms[rm_temp].controller.level == 4 ) ){
                            roles[1][2] = 7
                            roles[1][13] = rm_temp
                        } 
                    }

            }


            // 2nd room 2d??
            if ( rm == 'W6N13' && 1==11 ) {

                var change_in_matrix = 1
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                var roles = [

                    ['helper',             0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',     300,      'W2N14',  200,       '0',            '0',            '0',        '0'    ],
                    ['helper',             0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',     300,      'W4N12',  200,       '0',            '0',            '0',        '0'    ],
               
                    ['2a_healer',          0,   0,     0,    12,      0,       0,       0,      0,    10,       0,     '',     500,      'W7N23', 309,       '0',            '0',            '5',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    25,      0,       0,      25,      0,     0,       0,     '',     500,      'W7N23', 308,       '1',            '0',            '5',        '0'    ],
                   
                    ['reserver',           0,   0,     0,    12,      0,       0,       0,      0,     0,       8,     '',     200,      'W7N23', 308,       '1',            '0',            '5',        '0'    ],
                   
                    ['2a_healer',          0,   0,     0,    12,      0,       0,       0,      0,    10,       0,     '',     300,      'W9N16', 311,       '0',            '0',            '6',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    25,      0,       0,       5,     15,     0,       0,     '',     300,      'W9N16', 310,       '1',            '0',            '6',        '0'    ],
                   
                    ['2a_healer',          0,   0,     0,    21,      0,       0,       0,     10,    10,       0,     '',     300,      'W9N16', 313,       '0',            '0',            '7',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    30,      0,       0,      20,      0,     0,       0,     '',     300,      'W9N16', 312,       '1',            '0',            '7',        '0'    ]
                   
                      ]

                      if( Game.rooms[rm].memory.mode_defend == 0 ){

                        var rm_temp = 'W8N14'
                        if( Game.rooms[rm_temp] && Game.rooms[rm_temp].controller.my &&
                            Game.rooms[rm_temp].storage && !Game.rooms[rm_temp].terminal &&
                            Game.rooms[rm_temp].memory.mode_defend == 0 &&
                            (  Game.rooms[rm_temp].controller.level == 5 || Game.rooms[rm_temp].controller.level == 4 ) ){
                            roles[0][2] = 8
                            roles[0][13] = rm_temp
                        }  

                        var rm_temp = 'W7N11'
                        if( Game.rooms[rm_temp] && Game.rooms[rm_temp].controller.my &&
                            Game.rooms[rm_temp].storage && !Game.rooms[rm_temp].terminal &&
                            Game.rooms[rm_temp].memory.mode_defend == 0 && 
                            (  Game.rooms[rm_temp].controller.level == 5 || Game.rooms[rm_temp].controller.level == 4 ) ){
                            roles[1][2] = 4
                            roles[1][13] = rm_temp
                        } 
                    }

            }




            // 3nd room!!!!!!!!
            if ( rm == 'E29N19' && 1 == 11  ) {

                var change_in_matrix = 1
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                var roles = [

                    ['claimer',            0,   0,     0,     5,      0,       0,       0,      0,     0,       1,     '',       0,      'E29N19',  5,       '0',            '0',            '0',        '0'    ],
                    ['colonizer',          0,   0,     0,    14,      7,       7,       0,      0,     0,       0,     '',       0,      'E29N19', 35,       '0',            '0',            '0',        '0'    ],

                    ['controller_att',     0,   0,     0,    21,      0,       0,       0,      0,     0,      19,     '',       0,      'W51N23',155,       '0',            '0',           '40',        '0'    ], // low priority
                    ['controller_att',     0,   0,     0,    21,      0,       0,       0,      0,     0,      19,     '',       0,      'W51N24',155,       '0',            '0',           '40',        '0'    ], // low priority

                    //boost1
                    ['squad',              0,  0,     6,    16,      0,       0,      16,     10,     0,       0,     '',       0,      'E19N11',  30,       '1',            '1',            '4',        '0'    ],
                    ['squad',              0,  0,     6,    13,      0,       0,       0,      6,    14,       0,     '',       0,      'E19N11',  30,       '2',            '1',            '4',        '0'    ],
                    ['squad',              0,  0,     8,    13,      0,       0,       0,      0,    18,       0,     '',       0,      'E19N11',  30,       '3',            '1',            '4',        '0'    ],
                    ['squad',              0,  0,     8,    13,      0,       0,       0,      0,    18,       0,     '',       0,      'E19N11',  30,       '4',            '1',            '4',        '0'    ],

                    ['2a_healer',          0,   0,     8,    13,      0,       0,       0,      0,    18,       0,     '',     500,      'E22N11', 151,       '0',            '1',            '1',        '0'    ] ,
                    ['2a_capt',            0,   0,     6,    16,      0,       0,       0,     26,     0,       0,     '',     500,      'E22N11', 151,       '1',            '1',            '1',        '0'    ],

                    ['2a_healer',          0,   0,     8,    13,      0,       0,       0,      0,    18,       0,     '',     500,      'E22N11', 152,       '0',            '1',            '1',        '0'    ] ,
                    ['2a_capt',            0,   0,     6,    16,      0,       0,      26,      0,     0,       0,     '',     500,      'E22N11', 152,       '1',            '1',            '1',        '0'    ],

                    //boost3
                    // boost3
                    ['squad',              0,  1,     0,    10,      0,       0,      30,     10,     0,       0,     '',       0,      'E16N28',  5,       '1',            '1',            '4',        '0'    ],
                    ['squad',              0,  1,     0,     7,      0,       0,       0,     18,    10,       0,     '',       0,      'E16N28',  5,       '2',            '1',            '4',        '0'    ],
                    ['squad',              0,  1,     4,     6,      0,       0,       0,      0,    20,       0,     '',       0,      'E16N28',  5,       '3',            '1',            '4',        '0'    ],
                    ['squad',              0,  1,     4,     6,      0,       0,       0,      0,    20,       0,     '',       0,      'E16N28',  5,       '4',            '1',            '4',        '0'    ],


                    //unbooste
                    ['2a_healer',          0,   0,     8,     8,      0,       0,       0,      0,     6,       0,     '',     500,      'E19N18', 152,       '0',            '0',            '2',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    26,      0,       0,      24,      0,     0,       0,     '',     500,      'E19N18', 152,       '1',            '0',            '2',        '0'    ],

                    //unbooste
                    ['2a_healer',          0,   0,     8,     8,      0,       0,       0,      0,     6,       0,     '',     500,      'E19N18', 153,       '0',            '0',            '3',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    26,      0,       0,       0,     24,     0,       0,     '',     500,      'E19N18', 153,       '1',            '0',            '3',        '0'    ],

                    //unbooste
                    ['2a_healer',          0,   0,     8,     8,      0,       0,       0,      0,     6,       0,     '',     500,      'E19N18', 154,       '0',            '0',            '4',        '0'    ] ,
                    ['2a_capt',            0,   0,     0,    26,      0,       0,      24,      0,     0,       0,     '',     500,      'E19N18', 154,       '1',            '0',            '4',        '0'    ],



                    ['controller_destroy', 0,   0,     0,     1,      0,       0,       0,      0,     0,       1,     '',       0,      'W78N31', 1,       '0',            '0',            '40',        '0'    ],


                    ['mover',              0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',      60,      'E15N61', 51,       '0',            '0',            '0',        '0'    ],
                    ['mover',              0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',      60,      'E13N61', 51,       '0',            '0',            '0',        '0'    ],
                    ['mover',              0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',      60,      'E21N61', 52,       '0',            '0',            '0',        '0'    ]

                      ]

                var rm_tmp = roles[2][13]
                if( Game.rooms[rm_tmp] && Game.rooms[rm_tmp].controller.owner && Game.rooms[rm_tmp].controller.owner.username && !Game.rooms[rm_tmp].controller.my &&
                  ( !Game.rooms[rm_tmp].controller.upgradeBlocked || Game.rooms[rm_tmp].controller.upgradeBlocked < 700 ) &&
                    !Game.rooms[rm_tmp].controller.safeMode > 0 && 1 == 11 ){

                      var enemies = Game.rooms[rm].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  {return (
                                                                                                      ( creep.getActiveBodyparts(ATTACK) > 0 || creep.getActiveBodyparts(RANGED_ATTACK) > 0 ) &&
                                                                                                      creep.owner.username != 'Mitsuyoshi' &&
                                                                                                      creep.owner.username != 'slowmotionghost' &&
                                                                                                      creep.owner.username != 'Silten' &&
                                                                                                      creep.owner.username != 'Raggy'  ) } }   );

                    if( enemies.length>=1){
                        //
                    }
                    else{
                        if( Game.rooms[rm_tmp].controller.upgradeBlocked > 420 ){
                            roles[2][2] = 2 // multiple claimers
                        }
                        else{
                            roles[2][2] = 1
                        }
                    }
                }

                var rm_tmp = roles[3][13]
                if( Game.rooms[rm_tmp] && Game.rooms[rm_tmp].controller.owner && Game.rooms[rm_tmp].controller.owner.username && !Game.rooms[rm_tmp].controller.my &&
                  ( !Game.rooms[rm_tmp].controller.upgradeBlocked || Game.rooms[rm_tmp].controller.upgradeBlocked < 700 ) &&
                    !Game.rooms[rm_tmp].controller.safeMode > 0 && 1 == 11 ){

                      var enemies = Game.rooms[rm].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  {return (
                                                                                                      ( creep.getActiveBodyparts(ATTACK) > 0 || creep.getActiveBodyparts(RANGED_ATTACK) > 0 ) &&
                                                                                                      creep.owner.username != 'Mitsuyoshi' &&
                                                                                                      creep.owner.username != 'slowmotionghost' &&
                                                                                                      creep.owner.username != 'Silten' &&
                                                                                                      creep.owner.username != 'Raggy'  ) } }   );

                    if( enemies.length>=1){
                        //
                    }
                    else{
                        if( Game.rooms[rm_tmp].controller.upgradeBlocked > 420 ){
                            roles[3][2] = 4 // multiple claimers
                        }
                        else{
                            roles[3][2] = 1
                        }
                    }
                }

            }


            // front
            if ( rm == 'E22N16' && 1 == 11 ) {

                var change_in_matrix = 1
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                var roles = [

                    ['claimer',            0,   0,     0,     5,      0,       0,       0,      0,     0,       1,     '',       0,      'W12N9',  5,       '0',            '0',            '0',        '0'    ],
                    ['colonizer',          0,   0,     0,    10,      5,       5,       0,      0,     0,       0,     '',       0,      'W12N9', 35,       '0',            '0',            '0',        '0'    ],

                    ['controller_att',     0,   0,     0,    30,      0,       0,       0,      0,     0,      15,     '',       0,      'W11N9',155,       '0',            '0',           '40',        '0'    ],

                    ['controller_destroy', 0,   0,     0,     5,      0,       0,       0,      0,     0,       1,     '',       0,      'W69N29', 10,       '0',            '0',            '40',        '0'    ],

                    ['blinker',            0,   0,     4,    10,      0,       0,       0,     28,     8,       0,     '',       0,      'W34N51', 50,       '0',            '1',            '0',        '0'    ],  // 2 towers
                    ['blinker',            0,   0,     6,    10,      0,       0,       0,     21,    13,       0,     '',       0,      'W11N9',   5,       '0',            '1',            '0',        '0'    ],  // 3 towers
                    ['blinker',            0,   0,    10,    10,      0,       0,       0,     10,    20,       0,     '',       0,      'W4N41',  50,       '0',            '1',            '0',        '0'    ],  // 5 towers
                    ['blinker',            0,   0,    11,    10,      0,       0,       0,      6,    23,       0,     '',     610,      'E19N58', 45,       '0',            '1',            '0',        '0'    ],  // 6 towers

                    //boost3
                    // boost3
                    ['squad',              0,  0,     0,    10,      0,       0,      30,     10,     0,       0,     '',       0,      'E19N22',  5,       '1',            '1',            '4',        '0'    ],
                    ['squad',              0,  0,     0,     7,      0,       0,       0,     18,    10,       0,     '',       0,      'E19N22',  5,       '2',            '1',            '4',        '0'    ],
                    ['squad',              0,  0,     4,     6,      0,       0,       0,      0,    20,       0,     '',       0,      'E19N22',  5,       '3',            '1',            '4',        '0'    ],
                    ['squad',              0,  0,     4,     6,      0,       0,       0,      0,    20,       0,     '',       0,      'E19N22',  5,       '4',            '1',            '4',        '0'    ],


                    // ['blinker',            0,   3,     0,    25,     25,       0,       0,       0,    0,       0,     '',     450,      'W16N7', 151,       '0',            '0',            '0',        '0'    ],  // 6 towers


                    // ['2a_healer',          0,   1,     0,    20,      0,       0,       0,      0,    20,       0,     '',     750,      'W11N9', 153,       '0',            '0',            '1',        '0'    ] ,
                    // ['2a_capt',            0,   1,     0,    22,      0,       0,      10,     10,     0,       0,     '',     750,      'W11N9', 153,       '1',            '0',            '1',        '0'    ] ,

                    // ['2a_healer',          0,   1,     0,    20,      0,       0,       0,      0,    20,       0,     '',     750,      'W11N9', 152,       '0',            '0',            '2',        '0'    ] ,
                    // ['2a_capt',            0,   1,     0,    22,      0,       0,      15,      5,     0,       0,     '',     750,      'W11N9', 152,       '1',            '0',            '2',        '0'    ] ,

                    ['mover',              0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',      60,      'E15N61', 51,       '0',            '0',            '0',        '0'    ],
                    ['mover',              0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',      60,      'E13N61', 51,       '0',            '0',            '0',        '0'    ],
                    ['mover',              0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',      60,      'E21N61', 52,       '0',            '0',            '0',        '0'    ]

                      ]




            }



            // 4 room
            if ( rm == 'W12N9' && 1 == 11 ) {

                var change_in_matrix = 1
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                var roles = [

                    ['claimer',            0,   0,     0,     2,      0,       0,       0,      0,     0,       1,     '',       0,      'W13N2',  5,       '0',            '0',            '0',        '0'    ],
                    ['colonizer',          0,   0,     0,     8,      4,       4,       0,      0,     0,       0,     '',       0,      'W13N2', 10,       '0',            '0',            '0',        '0'    ],

                    ['move_caravan',       0,    0,     0,     1,      0,       0,       0,      0,     0,       0,     '',       0,      'E20N8', 10,       '0',            '0',            '0',        '0'   ],

                    ['mineralSK',          0,    0,     0,    15,      5,      10,       0,      0,     0,       0,     '',     700,      'E15N15', 10,       '0',            '0',            '0',        '0'   ],

                    ['move_cm1',           0,    0,     0,     1,      0,       2,       0,      0,     0,       0,     '',       0,      'E19N8', 10,       '0',            '0',            '0',        '0'   ],

                    ['blinker',            0,   1,     0,     7,      0,       0,       7,       0,    0,       0,     '',     450,      'W11N9',   51,       '0',            '0',            '0',        '0'    ],

                    ['caravan',              0,  0,     1,    2,      0,       0,       0,      1,     0,       0,     '',       0,      'E20N30',  35,       '1',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    1,      0,       0,       0,      1,     0,       0,     '',       0,      'E20N30',  35,       '2',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    2,      0,       1,       0,      1,     0,       0,     '',       0,      'E20N30',  35,       '3',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    1,      0,       0,       0,      1,     0,       0,     '',       0,      'E20N30',  35,       '4',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    1,      0,       0,       0,      1,     0,       0,     '',       0,      'E20N30',  35,       '5',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    1,      0,       0,       0,      1,     0,       0,     '',       0,      'E20N30',  35,       '6',            '0',            '2',        '0'    ],

                    ['caravan',              0,  0,     1,    2,      0,       0,       0,      1,     0,       0,     '',       0,      'W0N10',  35,       '1',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    1,      0,       0,       0,      1,     0,       0,     '',       0,      'W0N10',  35,       '2',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    2,      0,       1,       0,      1,     0,       0,     '',       0,      'W0N10',  35,       '3',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    1,      0,       0,       0,      1,     0,       0,     '',       0,      'W0N10',  35,       '4',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    1,      0,       0,       0,      1,     0,       0,     '',       0,      'W0N10',  35,       '5',            '0',            '2',        '0'    ],
                    ['caravan',              0,  0,     0,    1,      0,       0,       0,      1,     0,       0,     '',       0,      'W0N10',  35,       '6',            '0',            '2',        '0'    ],

                    ['mover',              0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',      60,      'E22N11', 51,       '0',            '0',            '0',        '0'    ],
                    ['mover',              0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',      60,      'E13N61', 51,       '0',            '0',            '0',        '0'    ],
                    ['mover',              0,   0,     0,    20,      0,      20,       0,      0,     0,       0,     '',      60,      'E21N61', 52,       '0',            '0',            '0',        '0'    ]

                      ]


            }





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
};

module.exports = TesteSpawn;
