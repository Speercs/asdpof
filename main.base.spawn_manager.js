// Base Spawn manager

var baseSpawnManager = {

    run: function( rm ) {

        //
        Game.rooms[rm].memory.manager_spawn = []
        Game.rooms[rm].memory.mode_util = 0
        //

        // creep filter
        var rm_creeps = _.filter(Game.creeps, (creep) => creep.memory.birth == rm  )
        //

        // BASICS economics
        if( Game.rooms[rm].energyCapacityAvailable ){

            if ( Game.rooms[rm].energyCapacityAvailable < 350 ) { // max 300 - lvl 01 - filler 300

              // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
              var roles = [
                  ['harvester',        0,  0,      0,      1,      2,       0,      0,      0,      0,      0,      '',      9,      's0_300_1',      101],
                  ['harvester',        0,  0,      0,      1,      2,       0,      0,      0,      0,      0,      '',      9,      's0_300_2',      102],
                  ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_3',      105],

                  ['harvester',        0,  0,      0,      1,      2,       0,      0,      0,      0,      0,      '',      9,      's1_300_1',      103],
                  ['harvester',        0,  0,      0,      1,      2,       0,      0,      0,      0,      0,      '',      9,      's1_300_2',      104],
                  ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_3',      106],

                  ['hauler_rm',        0,  0,      0,      1,      0,       1,      0,      0,      0,      0,      '',      6,      'mv',        125],

                  ['balancer' ,        0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',     42,      'bal',       108],

                  ['creep_mover' ,     0,  0,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      'mv',        109],

                  ['half_filler' ,     0,  0,      0,      1,      0,       1,      0,      0,      0,      0,      '',      3,      'h1_1',      110],
                  ['half_filler' ,     0,  0,      0,      1,      0,       1,      0,      0,      0,      0,      '',      3,      'h1_2',      111],
                  ['half_filler' ,     0,  0,      0,      1,      0,       1,      0,      0,      0,      0,      '',      3,      'h2_1',      112],
                  ['half_filler' ,     0,  0,      0,      1,      0,       1,      0,      0,      0,      0,      '',      3,      'h2_2',      113],

                  ['lab_filler' ,      0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',      3,      'lab1',      114],
                  ['lab_filler' ,      0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',      3,      'lab2',      115],

                  ['scout' ,           0,  2,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      0,           116],

                  ['repairer' ,        0,  0,      0,      1,      2,       1,      0,      0,      0,      0,      '',     12,      0,           117],
                  ['hauler_rm',        0,  0,      0,      1,      0,       1,      0,      0,      0,      0,      '',     12,      'repair',    117],
                  ['builder' ,         0,  0,      0,      1,      1,       2,      0,      0,      0,      0,      '',     12,      0,           118],
                  
                  ['mineral' ,         0,  0,      0,      1,      2,       1,      0,      0,      0,      0,      '',     12,      0,           119],
                  ['hauler_rm_mineral',0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      0,           119],

                  ['upgrader' ,        0,  0,      0,      1,      2,       1,      0,      0,      0,      0,      '',     12,      0,           120],

                  ['defenderRampart',  0,  0,      0,      2,      0,       0,      0,      0,      0,      0,      '',     12,      0,           121]
                         ]

                // pre-spawn
                if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[0] ){
                    var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[0].db,
                                             Game.rooms[rm].memory.intel.sources[0].dh1,
                                             Game.rooms[rm].memory.intel.sources[0].dh2 )

                    roles[0][12] = roles[0][12] + maxdist * roles[0][5]
                    roles[1][12] = roles[1][12] + maxdist * roles[1][5]
                    roles[2][12] = roles[2][12] + maxdist * roles[2][5]
                }
                if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[1] ){
                    var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[1].db,
                                             Game.rooms[rm].memory.intel.sources[1].dh1,
                                             Game.rooms[rm].memory.intel.sources[1].dh2 )

                    roles[3][12] = roles[3][12] + maxdist * roles[3][5]
                    roles[4][12] = roles[4][12] + maxdist * roles[4][5]
                    roles[5][12] = roles[5][12] + maxdist * roles[5][5]
                }
            }
            else if ( Game.rooms[rm].energyCapacityAvailable < 450 ) { // max 350 - lvl 02 - filler 350

              // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
              var roles = [
                  ['harvester',        0,  0,      0,      1,      3,       0,      0,      0,      0,      0,      '',     12,      's0_350_1',      101],
                  ['harvester',        0,  0,      0,      1,      2,       0,      0,      0,      0,      0,      '',      9,      's0_300_2',      103],
                  ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_3',      105],

                  ['harvester',        0,  0,      0,      1,      3,       0,      0,      0,      0,      0,      '',     12,      's1_350_1',      102],
                  ['harvester',        0,  0,      0,      1,      2,       0,      0,      0,      0,      0,      '',      9,      's1_300_2',      104],
                  ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_3',      106],

                  ['hauler_rm',        0,  0,      0,      1,      0,       1,      0,      0,      0,      0,      '',      6,      'mv',        125],

                  ['balancer' ,        0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',     42,      'bal',       108],

                  ['creep_mover' ,     0,  0,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      'mv',        109],

                  ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',      3,      'h1_1',      110],
                  ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',      3,      'h1_2',      111],
                  ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',      3,      'h2_1',      112],
                  ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',      3,      'h2_2',      113],

                  ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab1',      114],
                  ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab2',      115],

                  ['scout' ,           0,  2,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      0,           116],

                  ['repairer' ,        0,  0,      0,      1,      2,       2,      0,      0,      0,      0,      '',     12,      0,           117],
                  ['hauler_rm',        0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      'repair',    117],
                  ['builder' ,         0,  0,      0,      2,      1,       3,      0,      0,      0,      0,      '',     12,      0,           118],
                  
                  ['mineral' ,         0,  0,      0,      1,      2,       1,      0,      0,      0,      0,      '',     12,      0,           119],
                  ['hauler_rm_mineral',0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      0,           119],

                  ['upgrader' ,        0,  0,      0,      2,      2,       1,      0,      0,      0,      0,      '',     12,      0,           120],

                  ['defenderRampart' , 0,  0,      0,      2,      0,       0,      0,      0,      0,      0,      '',     12,      0,           121]
                         ]

                 // pre-spawn
                 if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[0] ){
                     var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[0].db,
                                              Game.rooms[rm].memory.intel.sources[0].dh1,
                                              Game.rooms[rm].memory.intel.sources[0].dh2 )

                     roles[0][12] = roles[0][12] + maxdist * roles[0][5]
                     roles[1][12] = roles[1][12] + maxdist * roles[1][5]
                 }
                 if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[1] ){
                     var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[1].db,
                                              Game.rooms[rm].memory.intel.sources[1].dh1,
                                              Game.rooms[rm].memory.intel.sources[1].dh2 )

                     roles[3][12] = roles[3][12] + maxdist * roles[3][5]
                     roles[4][12] = roles[4][12] + maxdist * roles[4][5]
                 }
            }
            else if ( Game.rooms[rm].energyCapacityAvailable < 550 ) { // max 450 - lvl 02 - filler 450

              // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
              var roles = [
                  ['harvester',        0,  0,      0,      1,      4,       0,      0,      0,      0,      0,      '',     15,      's0_450_1',      101],
                  ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_2',      103],
                  ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_3',      105],

                  ['harvester',        0,  0,      0,      1,      4,       0,      0,      0,      0,      0,      '',     15,      's1_450_1',      102],
                  ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_2',      104],
                  ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_3',      106],

                  ['hauler_rm',        0,  0,      0,      2,      0,       2,      0,      0,      0,      0,      '',     12,      'mv',        125],

                  ['balancer' ,        0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',     42,      'bal',       108],

                  ['creep_mover' ,     0,  0,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      'mv',        109],

                  ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',      3,      'h1_1',      110],
                  ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',      3,      'h1_2',      111],
                  ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',      3,      'h2_1',      112],
                  ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',      3,      'h2_2',      113],

                  ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab1',      114],
                  ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab2',      115],

                  ['scout' ,           0,  2,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      0,           116],

                  ['repairer' ,        0,  0,      0,      2,      2,       2,      0,      0,      0,      0,      '',     12,      0,           117],
                  ['hauler_rm',        0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      'repair',    117],
                  ['builder' ,         0,  0,      0,      2,      2,       3,      0,      0,      0,      0,      '',     12,      0,           118],
                  
                  ['mineral' ,         0,  0,      0,      1,      2,       1,      0,      0,      0,      0,      '',     12,      0,           119],
                  ['hauler_rm_mineral',0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      0,           119],

                  ['upgrader' ,        0,  0,      0,      2,      3,       1,      0,      0,      0,      0,      '',     12,      0,           120],

                  ['defenderRampart' , 0,  0,      0,      2,      0,       0,      0,      0,      0,      0,      '',     12,      0,           121]
                         ]

                 // pre-spawn
                 if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[0] ){
                     var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[0].db,
                                              Game.rooms[rm].memory.intel.sources[0].dh1,
                                              Game.rooms[rm].memory.intel.sources[0].dh2 )

                     roles[0][12] = roles[0][12] + maxdist * roles[0][5]
                     roles[1][12] = roles[1][12] + maxdist * roles[1][5]
                 }
                 if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[1] ){
                     var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[1].db,
                                              Game.rooms[rm].memory.intel.sources[1].dh1,
                                              Game.rooms[rm].memory.intel.sources[1].dh2 )

                     roles[3][12] = roles[3][12] + maxdist * roles[3][5]
                     roles[4][12] = roles[4][12] + maxdist * roles[4][5]
                 }
            }
            else if ( Game.rooms[rm].energyCapacityAvailable < 600 ) { // max 550 - lvl 02 - filler 550

              // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
              var roles = [
                  ['harvester',        0,  0,      0,      1,      5,       0,      0,      0,      0,      0,      '',     18,      's0_550_1',      101],
                  ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_2',      103],
                  ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_3',      105],

                  ['harvester',        0,  0,      0,      1,      5,       0,      0,      0,      0,      0,      '',     18,      's1_550_1',      102],
                  ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_2',      104],
                  ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_3',      106],

                  ['hauler_rm',        0,  0,      0,      2,      0,       4,      0,      0,      0,      0,      '',     12,      'mv',        125],

                  ['balancer' ,        0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',     42,      'bal',       108],

                  ['creep_mover' ,     0,  0,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      'mv',        109],

                  ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_1',      110],
                  ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_2',      111],
                  ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_1',      112],
                  ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_2',      113],

                  ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab1',      114],
                  ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab2',      115],

                  ['scout' ,           0,  2,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      0,           116],

                  ['repairer' ,        0,  0,      0,      2,      2,       2,      0,      0,      0,      0,      '',     12,      0,           117],
                  ['hauler_rm',        0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      'repair',    117],                  
                  ['builder' ,         0,  0,      0,      3,      2,       4,      0,      0,      0,      0,      '',     12,      0,           118],
                  
                  ['mineral' ,         0,  0,      0,      1,      2,       1,      0,      0,      0,      0,      '',     12,      0,           119],
                  ['hauler_rm_mineral',0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      0,           119],

                  ['upgrader' ,        0,  0,      0,      2,      4,       1,      0,      0,      0,      0,      '',     12,      0,           120],

                  ['defenderRampart' , 0,  0,      0,      2,      0,       0,      0,      0,      0,      0,      '',     12,      0,           121]
                         ]

                 // pre-spawn
                 if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[0] ){
                     var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[0].db,
                                              Game.rooms[rm].memory.intel.sources[0].dh1,
                                              Game.rooms[rm].memory.intel.sources[0].dh2 )

                     roles[0][12] = roles[0][12] + maxdist * roles[0][5] / 2
                 }
                 if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[1] ){
                     var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[1].db,
                                              Game.rooms[rm].memory.intel.sources[1].dh1,
                                              Game.rooms[rm].memory.intel.sources[1].dh2 )

                     roles[3][12] = roles[3][12] + maxdist * roles[3][5] / 2
                 }
            }
            else if ( Game.rooms[rm].energyCapacityAvailable < 800 ) { // max 600 - lvl 03 - filler 600

                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles = [
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's0_550_1',      101],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_2',      103],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_3',      105],
  
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's1_550_1',      102],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_2',      104],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_3',      106],
  
                    ['hauler_rm',        0,  0,      0,      2,      0,       4,      0,      0,      0,      0,      '',     12,      'mv',        125],
  
                    ['balancer' ,        0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',     42,      'bal',       108],
  
                    ['creep_mover' ,     0,  0,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      'mv',        109],
  
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_1',      110],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_2',      111],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_1',      112],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_2',      113],
  
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab1',      114],
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab2',      115],
  
                    ['scout' ,           0,  1,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      0,           116],
  
                    ['repairer' ,        0,  0,      0,      3,      3,       3,      0,      0,      0,      0,      '',     12,      0,           117], 
                    ['hauler_rm',        0,  0,      0,      2,      0,       3,      0,      0,      0,      0,      '',     12,      'repair',    116],                   
                    ['builder' ,         0,  0,      0,      3,      2,       4,      0,      0,      0,      0,      '',     12,      0,           118],

                    ['mineral' ,         0,  0,      0,      1,      1,       1,      0,      0,      0,      0,      '',     12,      0,           120],
                    ['hauler_rm_mineral',0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      0,           119],

                    ['upgrader' ,        0,  0,      0,      2,      4,       1,      0,      0,      0,      0,      '',     12,      0,           121],
  
                    ['defenderRampart' , 0,  0,      0,      2,      0,       0,      4,      0,      0,      0,      '',     12,      0,           122]
                           ]
  
                   // pre-spawn
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[0] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[0].db,
                                                Game.rooms[rm].memory.intel.sources[0].dh1,
                                                Game.rooms[rm].memory.intel.sources[0].dh2 )
  
                       roles[0][12] = roles[0][12] + maxdist * roles[0][5] / 2
                   }
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[1] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[1].db,
                                                Game.rooms[rm].memory.intel.sources[1].dh1,
                                                Game.rooms[rm].memory.intel.sources[1].dh2 )
  
                       roles[3][12] = roles[3][12] + maxdist * roles[3][5] / 2
                   }
            }
            else if ( Game.rooms[rm].energyCapacityAvailable < 1300 ) { // max 800 - lvl 02 - filler 800

                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles = [
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's0_550_1',      101],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_2',      103],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_3',      105],
  
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's1_550_1',      102],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_2',      104],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_3',      106],
  
                    ['hauler_rm',        0,  0,      0,      2,      0,       4,      0,      0,      0,      0,      '',     12,      'mv',        125],
  
                    ['balancer' ,        0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',     42,      'bal',       108],
  
                    ['creep_mover' ,     0,  0,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      'mv',        109],
  
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_1',      110],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_2',      111],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_1',      112],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_2',      113],
  
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab1',      114],
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab2',      115],
  
                    ['scout' ,           0,  1,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      0,           116],
  
                    ['repairer' ,        0,  0,      0,      4,      4,       4,      0,      0,      0,      0,      '',     30,      0,           117], 
                    ['hauler_rm',        0,  0,      0,      2,      0,       4,      0,      0,      0,      0,      '',     20,      'repair',    116],                   
                    ['builder' ,         0,  0,      0,      4,      2,       6,      0,      0,      0,      0,      '',     30,      0,           118],

                    ['mineral' ,         0,  0,      0,      1,      1,       1,      0,      0,      0,      0,      '',     12,      0,           120],
                    ['hauler_rm_mineral',0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      0,           119],

                    ['upgrader' ,        0,  0,      0,      3,      5,       1,      0,      0,      0,      0,      '',     12,      0,           121],
  
                    ['defenderRampart' , 0,  0,      0,      3,      0,       0,      6,      0,      0,      0,      '',     30,      0,           122]
                           ]
  
                   // pre-spawn
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[0] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[0].db,
                                                Game.rooms[rm].memory.intel.sources[0].dh1,
                                                Game.rooms[rm].memory.intel.sources[0].dh2 )
  
                       roles[0][12] = roles[0][12] + maxdist * roles[0][5] / 2
                   }
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[1] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[1].db,
                                                Game.rooms[rm].memory.intel.sources[1].dh1,
                                                Game.rooms[rm].memory.intel.sources[1].dh2 )
  
                       roles[3][12] = roles[3][12] + maxdist * roles[3][5] / 2
                   }
            }
            else if ( Game.rooms[rm].energyCapacityAvailable < 1800 ) { // max 1300 - lvl 03 - filler 1300

                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles = [
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's0_550_1',      101],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_2',      103],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_3',      105],
  
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's1_550_1',      102],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_2',      104],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_3',      106],
  
                    ['hauler_rm',        0,  0,      0,      3,      0,       6,      0,      0,      0,      0,      '',     12,      'mv',        125],
  
                    ['balancer' ,        0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',     42,      'bal',       108],
  
                    ['creep_mover' ,     0,  0,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      'mv',        109],
  
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_1',      110],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_2',      111],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_1',      112],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_2',      113],
  
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab1',      114],
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab2',      115],
  
                    ['scout' ,           0,  1,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      0,           116],
  
                    ['repairer' ,        0,  0,      0,      6,      6,       6,      0,      0,      0,      0,      '',     60,      0,           117], 
                    ['hauler_rm',        0,  0,      0,      3,      0,       6,      0,      0,      0,      0,      '',     30,      'repair',    116],                   
                    ['builder' ,         0,  0,      0,      5,      5,      10,      0,      0,      0,      0,      '',     60,      0,           118],

                    ['mineral' ,         0,  0,      0,      1,      1,       1,      0,      0,      0,      0,      '',     12,      0,           120],
                    ['hauler_rm_mineral',0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      0,           119],

                    ['upgrader' ,        0,  0,      0,      5,      8,       2,      0,      0,      0,      0,      '',     12,      0,           121],
  
                    ['defenderRampart' , 0,  0,      0,      6,      0,      12,      0,      0,      0,      0,      '',     60,      0,           122]
                           ]
  
                   // pre-spawn
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[0] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[0].db,
                                                Game.rooms[rm].memory.intel.sources[0].dh1,
                                                Game.rooms[rm].memory.intel.sources[0].dh2 )
  
                       roles[0][12] = roles[0][12] + maxdist * roles[0][5] / 2
                   }
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[1] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[1].db,
                                                Game.rooms[rm].memory.intel.sources[1].dh1,
                                                Game.rooms[rm].memory.intel.sources[1].dh2 )
  
                       roles[3][12] = roles[3][12] + maxdist * roles[3][5] / 2
                   }
            }
            else if ( Game.rooms[rm].energyCapacityAvailable < 2300 ) { // max 1800 - lvl 04 - filler 1300

                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles = [
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's0_550_1',      101],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_2',      103],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_3',      105],
  
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's1_550_1',      102],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_2',      104],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_3',      106],
  
                    ['hauler_rm',        0,  0,      0,      4,      0,       8,      0,      0,      0,      0,      '',     12,      'mv',        125],
  
                    ['balancer' ,        0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',     42,      'bal',       108],
  
                    ['creep_mover' ,     0,  0,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      'mv',        109],
  
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_1',      110],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_2',      111],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_1',      112],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_2',      113],
  
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab1',      114],
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab2',      115],
  
                    ['scout' ,           0,  1,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      0,           116],
  
                    ['repairer' ,        0,  0,      0,      8,      8,       8,      0,      0,      0,      0,      '',     90,      0,           117], 
                    ['hauler_rm',        0,  0,      0,      4,      0,       8,      0,      0,      0,      0,      '',     40,      'repair',    116],                   
                    ['builder' ,         0,  0,      0,      9,      6,      12,      0,      0,      0,      0,      '',     90,      0,           118],

                    ['mineral' ,         0,  0,      0,      1,      1,       1,      0,      0,      0,      0,      '',     12,      0,           120],
                    ['hauler_rm_mineral',0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      0,           119],

                    ['upgrader' ,        0,  0,      0,      3,     15,       2,      0,      0,      0,      0,      '',     12,      0,           121],
  
                    ['defenderRampart' , 0,  0,      0,      8,      0,       0,     16,      0,      0,      0,      '',     90,      0,           122]
                           ]
  
                   // pre-spawn
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[0] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[0].db,
                                                Game.rooms[rm].memory.intel.sources[0].dh1,
                                                Game.rooms[rm].memory.intel.sources[0].dh2 )
  
                       roles[0][12] = roles[0][12] + maxdist * roles[0][5] / 2
                   }
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[1] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[1].db,
                                                Game.rooms[rm].memory.intel.sources[1].dh1,
                                                Game.rooms[rm].memory.intel.sources[1].dh2 )
  
                       roles[3][12] = roles[3][12] + maxdist * roles[3][5] / 2
                   }
            }
            else if ( Game.rooms[rm].energyCapacityAvailable < 5600 ) { // max 2300 - lvl 04 - filler 1300

                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles = [
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's0_550_1',      101],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_2',      103],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_3',      105],
  
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's1_550_1',      102],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_2',      104],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_3',      106],
  
                    ['hauler_rm',        0,  0,      0,      5,      0,      10,      0,      0,      0,      0,      '',     12,      'mv',        125],
  
                    ['balancer' ,        0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',     42,      'bal',       108],
  
                    ['creep_mover' ,     0,  0,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      'mv',        109],
  
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_1',      110],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_2',      111],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_1',      112],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_2',      113],
  
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab1',      114],
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab2',      115],
  
                    ['scout' ,           0,  1,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      0,           116],
  
                    ['repairer' ,        0,  0,      0,     10,     10,      10,      0,      0,      0,      0,      '',     90,      0,           117], 
                    ['hauler_rm',        0,  0,      0,      5,      0,      10,      0,      0,      0,      0,      '',     45,      'repair',    116],                   
                    ['builder' ,         0,  0,      0,     12,      9,      15,      0,      0,      0,      0,      '',     90,      0,           118],

                    ['mineral' ,         0,  0,      0,      1,      1,       1,      0,      0,      0,      0,      '',     12,      0,           120],
                    ['hauler_rm_mineral',0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      0,           119],

                    ['upgrader' ,        0,  0,      0,      4,     18,       2,      0,      0,      0,      0,      '',     12,      0,           121],
  
                    ['defenderRampart' , 0,  0,      0,     10,      0,       0,     20,      0,      0,      0,      '',     90,      0,           122]
                           ]
  
                   // pre-spawn
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[0] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[0].db,
                                                Game.rooms[rm].memory.intel.sources[0].dh1,
                                                Game.rooms[rm].memory.intel.sources[0].dh2 )
  
                       roles[0][12] = roles[0][12] + maxdist * roles[0][5] / 2
                   }
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[1] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[1].db,
                                                Game.rooms[rm].memory.intel.sources[1].dh1,
                                                Game.rooms[rm].memory.intel.sources[1].dh2 )
  
                       roles[3][12] = roles[3][12] + maxdist * roles[3][5] / 2
                   }
            }
            else if ( Game.rooms[rm].energyCapacityAvailable <= 12900 && 
                      Game.rooms[rm].controller.level ==7  ) { // max 5600 - lvl 07 - filler 2600

                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles = [
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's0_550_1',      101],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_2',      103],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_3',      105],
  
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's1_550_1',      102],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_2',      104],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_3',      106],
  
                    ['hauler_rm',        0,  0,      0,      9,      0,      18,      0,      0,      0,      0,      '',     12,      'mv',        125],
  
                    ['balancer' ,        0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',     42,      'bal',       108],
  
                    ['creep_mover' ,     0,  0,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      'mv',        109],
  
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_1',      110],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_2',      111],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_1',      112],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_2',      113],
  
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab1',      114],
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab2',      115],
  
                    ['scout' ,           0,  1,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      0,           116],
  
                    ['repairer' ,        0,  0,      0,     14,     10,      18,      0,      0,      0,      0,      '',    150,      0,           117], 
                    ['hauler_rm',        0,  0,      0,      9,      0,      18,      0,      0,      0,      0,      '',     90,      'repair',    116],                   
                    ['builder' ,         0,  0,      0,     16,      8,      24,      0,      0,      0,      0,      '',    150,      0,           118],

                    ['mineral' ,         0,  0,      0,      1,      1,       1,      0,      0,      0,      0,      '',     12,      0,           120],
                    ['hauler_rm_mineral',0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      0,           119],

                    ['upgrader' ,        0,  0,      0,     10,     38,       2,      0,      0,      0,      0,      '',     12,      0,           121],
  
                    ['defenderRampart' , 0,  0,      0,     16,      0,       0,     32,      0,      0,      0,      '',    150,      0,           122]
                           ]
  
                   // pre-spawn
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[0] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[0].db,
                                                Game.rooms[rm].memory.intel.sources[0].dh1,
                                                Game.rooms[rm].memory.intel.sources[0].dh2 )
  
                       roles[0][12] = roles[0][12] + maxdist * roles[0][5] / 2
                   }
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[1] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[1].db,
                                                Game.rooms[rm].memory.intel.sources[1].dh1,
                                                Game.rooms[rm].memory.intel.sources[1].dh2 )
  
                       roles[3][12] = roles[3][12] + maxdist * roles[3][5] / 2
                   }
            }
            else if ( Game.rooms[rm].energyCapacityAvailable <= 12900 && 
                      Game.rooms[rm].controller.level == 8 ) { // max 12900 - lvl 08 - filler 4900

                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles = [
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's0_550_1',      101],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_2',      103],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's0_300_3',      105],
  
                    ['harvester',        0,  0,      0,      1,      5,       1,      0,      0,      0,      0,      '',     18,      's1_550_1',      102],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_2',      104],
                    ['harvester',        0,  0,      0,      1,      1,       0,      0,      0,      0,      0,      '',      6,      's1_300_3',      106],
  
                    ['hauler_rm',        0,  0,      0,     10,      0,      20,      0,      0,      0,      0,      '',     12,      'mv',        125],
  
                    ['balancer' ,        0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',     42,      'bal',       108],
  
                    ['creep_mover' ,     0,  0,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      'mv',        109],
  
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_1',      110],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h1_2',      111],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_1',      112],
                    ['half_filler' ,     0,  1,      0,      1,      0,       1,      0,      0,      0,      0,      '',     16,      'h2_2',      113],
  
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab1',      114],
                    ['lab_filler' ,      0,  0,      0,      1,      0,       6,      0,      0,      0,      0,      '',      3,      'lab2',      115],
  
                    ['scout' ,           0,  1,      0,      1,      0,       0,      0,      0,      0,      0,      '',      3,      0,           116],
  
                    ['repairer' ,        0,  0,      0,     10,     20,      20,      0,      0,      0,      0,      '',    150,      0,           117], 
                    ['hauler_rm',        0,  0,      0,     10,      0,      20,      0,      0,      0,      0,      '',     90,      'repair',    116],
                   
                    ['builder' ,         0,  0,      0,     16,      8,      24,      0,      0,      0,      0,      '',    150,      0,           118],

                    ['mineral' ,         0,  0,      0,      1,      1,       1,      0,      0,      0,      0,      '',     12,      0,           120],
                    ['hauler_rm_mineral',0,  0,      0,      1,      0,       2,      0,      0,      0,      0,      '',     12,      0,           119],

                    ['upgrader' ,        0,  0,      0,      3,     15,       2,      0,      0,      0,      0,      '',     12,      0,           121],
  
                    ['defenderRampart' , 0,  0,      0,     16,      0,       0,     32,      0,      0,      0,      '',    150,      0,           122]
                           ]
  
                   // pre-spawn
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[0] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[0].db,
                                                Game.rooms[rm].memory.intel.sources[0].dh1,
                                                Game.rooms[rm].memory.intel.sources[0].dh2 )
  
                       roles[0][12] = roles[0][12] + maxdist * roles[0][5] / 2
                   }
                   if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[1] ){
                       var maxdist =  Math.max( Game.rooms[rm].memory.intel.sources[1].db,
                                                Game.rooms[rm].memory.intel.sources[1].dh1,
                                                Game.rooms[rm].memory.intel.sources[1].dh2 )
  
                       roles[3][12] = roles[3][12] + maxdist * roles[3][5] / 2
                   }
            }




            // fill actual column
            for ( var i = 0 ; i < roles.length ; i++){
                roles[i][1] = _.filter( rm_creeps , (creep) => creep.memory.role == roles[i][0] && 
                                                               creep.memory.birth_target == roles[i][13] && 
                                                               ( creep.ticksToLive > roles[i][12] - 3 || creep.spawning == true || !creep.ticksToLive ) ).length
            }
            //

            // HARVESTER
            //
            if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[0] ){
                roles[0][2] = 1
                if( Game.rooms[rm].memory.intel.sources[0].vicinity >= 3 && Game.rooms[rm].energyCapacityAvailable < 350 ){
                    roles[1][2] = 1
                    roles[2][2] = 1
                }
                else if( Game.rooms[rm].memory.intel.sources[0].vicinity >= 2 && Game.rooms[rm].energyCapacityAvailable < 550 ){
                    roles[1][2] = 1
                }

                // only one harvester if container is up
                if( ( roles[1][2] == 1 || roles[2][2] == 1 ) &&
                    Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[0] && 
                    Game.rooms[rm].memory.intel.container[0].id && Game.getObjectById( Game.rooms[rm].memory.intel.container[0].id ) ){
                    roles[1][2] = 0
                    roles[2][2] = 0
                }
            }

            if( Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[1] ){
                roles[3][2] = 1
                if( Game.rooms[rm].memory.intel.sources[1].vicinity >= 3 && Game.rooms[rm].energyCapacityAvailable < 350 ){                    
                    roles[4][2] = 1
                    roles[5][2] = 1
                
                }
                else if( Game.rooms[rm].memory.intel.sources[1].vicinity >= 2 && Game.rooms[rm].energyCapacityAvailable < 550 ){
                    roles[4][2] = 1
                }

                // only one harvester if container is up
                if( ( roles[4][2] == 1 || roles[5][2] == 1 ) &&
                    Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[1] && 
                    Game.rooms[rm].memory.intel.container[1].id && Game.getObjectById( Game.rooms[rm].memory.intel.container[1].id ) ){
                    roles[4][2] = 0
                    roles[5][2] = 0
                }
            }

            // do not spawn smaller harvester if it is an EXPANSION
            if( Game.rooms[rm].controller.level <= 3 ){
                if( _.filter(rm_creeps, (creep) => creep.memory.birth_target == 's0_550_1' ).length >= 1 ){
                    roles[0][2] = 0
                    roles[1][2] = 0
                    roles[2][2] = 0
                }
                if( _.filter(rm_creeps, (creep) => creep.memory.birth_target == 's1_550_1' ).length >= 1 ){
                    roles[3][2] = 0
                    roles[4][2] = 0
                    roles[5][2] = 0
                }
            }
            //

            // reduce size if no more harvester on the room
            if( roles[0][1] == 0 && roles[1][1] == 0 && roles[2][1] == 0 &&
                roles[3][1] == 0 && roles[4][1] == 0 && roles[5][1] == 0 ){
                    
                roles[0][5] = Math.min(roles[0][5], 2 )
                roles[1][5] = Math.min(roles[1][5], 2 )
                roles[2][5] = Math.min(roles[2][5], 2 )
                roles[3][5] = Math.min(roles[3][5], 2 )
                roles[4][5] = Math.min(roles[4][5], 2 )
                roles[5][5] = Math.min(roles[5][5], 2 )
            }
            //

            // BALANCER
            if( roles[7][1] == 0 &&
                Game.rooms[rm].storage && Game.rooms[rm].controller.level >= 4 &&
                Game.rooms[rm].energyAvailable >= 350 &&
                Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link[1] && Game.rooms[rm].memory.intel.link[1].id &&
                Game.getObjectById( Game.rooms[rm].memory.intel.link[1].id ) ){
                
                roles[7][2] = 1
                
            }
            
            if ( Game.rooms[rm].energyCapacityAvailable >= 350 ){
                roles[7][14] = 1
            }
            


            // HAULER
            // hauler amount
            if( roles[0][1] + roles[1][1] + roles[2][1] + roles[3][1] + roles[4][1] + roles[5][1] == 0  ){
                var amt_haul = 0
            }
            else{

                var links = 0

                // base link
                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link[1] && Game.getObjectById( Game.rooms[rm].memory.intel.link[1].id ) ){
                    var links = 1
                    // source 0
                    if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link[0] && Game.getObjectById( Game.rooms[rm].memory.intel.link[0].id ) ){
                        var links = links + 1
                    }
                    // source 1
                    if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link[2] && Game.getObjectById( Game.rooms[rm].memory.intel.link[2].id ) ){
                        var links = links + 1
                    }                    
                }

                if( links == 3 ){
                    var amt_haul = 0.00
                }
                else if( links == 2 ){
                    var amt_haul = Math.max(1, Math.ceil( (
                        ( ( roles[0][1] * ( roles[0][5] * 2 - 1 ) + roles[1][1] * ( roles[1][5] * 2 - 1 ) + roles[2][1] * ( roles[2][5] * 2 - 1 ) ) ) * ( Game.rooms[rm].memory.intel.sources[0].dh1 * 2 + 2 ) +
                        ( ( roles[3][1] * ( roles[3][5] * 2 - 1 ) + roles[4][1] * ( roles[4][5] * 2 - 1 ) + roles[5][1] * ( roles[5][5] * 2 - 1 ) ) ) * ( Game.rooms[rm].memory.intel.sources[1].dh1 * 2 + 2 ) ) / 50 / roles[6][6] ) )
                    var amt_haul = amt_haul / 2
                }
                else {
                    var amt_haul = Math.max(1, Math.ceil( (
                                ( ( roles[0][1] * ( roles[0][5] * 2 - 1 ) + roles[1][1] * ( roles[1][5] * 2 - 1 ) + roles[2][1] * ( roles[2][5] * 2 - 1 ) ) ) * ( Game.rooms[rm].memory.intel.sources[0].dh1 * 2 + 2 ) +
                                ( ( roles[3][1] * ( roles[3][5] * 2 - 1 ) + roles[4][1] * ( roles[4][5] * 2 - 1 ) + roles[5][1] * ( roles[5][5] * 2 - 1 ) ) ) * ( Game.rooms[rm].memory.intel.sources[1].dh1 * 2 + 2 ) ) / 50 / roles[6][6] ) )
                    var amt_haul = amt_haul
                }                 
            }

            var amt_haul_dyn = Game.rooms[rm].memory.dyn_rm_hauler
            
            if( Game.rooms[rm].memory.mode_fill ){
                var amt_haul_dyn = Math.max( amt_haul_dyn + Game.rooms[rm].memory.mode_fill, Game.rooms[rm].memory.mode_fill )
            }

            roles[6][2] = Math.ceil( Math.max( amt_haul + amt_haul_dyn, 0 ) )

            if( roles[6][1] < roles[6][2] && roles[6][1] < 2 ){
                roles[6][14] = 100
            }   

            // reduce size if no more harvester on the room
            if( roles[6][1] == 0 && roles[6][2] > 0 && Game.rooms[rm].energyAvailable >= 300 ){
                    
                roles[6][4] = Math.min(roles[6][4], 2 )
                roles[6][6] = Math.min(roles[6][6], 4 )
            }
            else if( ( roles[6][1] == 0 && roles[6][2] > 0 ) || ( amt_haul_dyn > 10 && roles[6][1] < 3 ) ){

                var bd_cnt = Math.floor( Game.rooms[rm].energyAvailable / 150 )
                    
                roles[6][4] = Math.min(roles[6][4], bd_cnt )
                roles[6][6] = Math.min(roles[6][6], bd_cnt * 2 )
            }

            // do not spwn if idle workers
            if( roles[6][1] >= 1 && _.filter( rm_creeps , (creep) => creep.memory.role == 'hauler_rm' && ( !creep.memory.task_id || creep.memory.task_id == null ) ).length >= 1 ){
                roles[6][2] = 0
            }
            //
            //


            
            // half filler - 9 10 11 12
            if( Game.rooms[rm].memory.intel.container ){
                if( ( roles[9][2] == 1  && roles[9][1] == 0 ) ||
                    ( roles[10][2] == 1 && roles[10][1] == 0 ) ||
                    ( roles[11][2] == 1 && roles[11][1] == 0 ) ||
                    ( roles[12][2] == 1 && roles[12][1] == 0 ) ){

                    // change body size
                    if( Game.rooms[rm].controller.level == 8 ){
                        roles[9][6] = 4
                        roles[10][6] = 4
                        roles[11][6] = 4
                        roles[12][6] = 4
                    }
                    else if( Game.rooms[rm].controller.level == 7 ){
                        roles[9][6] = 2
                        roles[10][6] = 2
                        roles[11][6] = 2
                        roles[12][6] = 2
                    }

                    // half1
                    var okh1 = 0
                    if( Game.rooms[rm].memory.intel.container[2] && 
                        Game.rooms[rm].memory.intel.container[2].id &&
                        Game.getObjectById( Game.rooms[rm].memory.intel.container[2].id ) ){
                        var okh1 = 1
                    }
                    if( okh1 == 0 ){
                        roles[9][2] = 0 
                        roles[10][2] = 0

                        //delete Game.rooms[rm].memory.intel.container[2]
                    }

                    // half2
                    var okh2 = 0
                    if( Game.rooms[rm].memory.intel.container[3] && 
                        Game.rooms[rm].memory.intel.container[3].id &&
                        Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id ) ){
                        var okh2 = 1
                    }
                    if( okh2 == 0 ){
                        roles[11][2] = 0 
                        roles[12][2] = 0

                        //delete Game.rooms[rm].memory.intel.container[3]
                    }

                    if( ( okh1 == 1 && ( roles[9][1]  == 0 || roles[10][1] == 0 ) ) || 
                        ( okh2 == 1 && ( roles[11][1] == 0 || roles[12][1] == 0 ) ) ){  

                        // only one mover if fillers are not spawned
                        roles[6][2] = Math.min( roles[6][2], 1 )

                        if( roles[0][1] + roles[1][1] + roles[2][1] + roles[3][1] + roles[4][1] + roles[5][1] >= 1 ){
                            roles[0][2] = 0
                            roles[1][2] = 0
                            roles[2][2] = 0
                            roles[3][2] = 0
                            roles[4][2] = 0
                            roles[5][2] = 0
                        }
                    }
                }
            }
            else{
                roles[9][2] = 0 
                roles[10][2] = 0
                roles[11][2] = 0 
                roles[12][2] = 0
            }
            //

            // LAB
            if( Game.rooms[rm].terminal && ( roles[13][1] == 0 || roles[14][1] == 0 ) ){

                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.lab && Game.rooms[rm].memory.intel.lab[2] && 
                    Game.rooms[rm].memory.intel.lab[2].id && Game.getObjectById( Game.rooms[rm].memory.intel.lab[2].id ) ){
                
                    roles[13][2] = 1
                }

                if( Game.rooms[rm].memory.lab_boost_2 && Game.rooms[rm].memory.lab_boost_2 != 'free' && Game.rooms[rm].controller.level >= 7 ){
                    roles[14][2] = 1
                }
            }
            //
            
            // SCOUT
            if( Game.rooms[rm].controller.level >= 8 && 1==11 ){
                if( !Game.rooms[rm].memory.scout_tick ){
                    Game.rooms[rm].memory.scout_tick = Game.time
                }
                else if( Game.time - Game.rooms[rm].memory.scout_tick < 500 * Game.rooms[rm].controller.level + 1500 ){
                    roles[15][2] = 0
                }
                else{
                    Game.rooms[rm].memory.scout_tick = Game.time
                }
            }
            //
            if( Game.rooms[rm].controller.level <= 6) {
                roles[15][2] = 2
            }
            else{
                roles[15][2] = 1
            }

            // REPAIRER
            if ( ( Game.rooms[rm].memory.repairer_need == 1 || Game.rooms[rm].memory.ramp_repairer_need == 1 ) && 1==1 ) {

                if( Game.rooms[rm].memory.ramp_repairer_need == 1 ){
                    if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] >= Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.repair_high ){
                        roles[16][2] = 3
                    }
                    else if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] >= Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.repair_med ){
                        roles[16][2] = 2
                    }
                    else if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] >= Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.repair_low ){
                        roles[16][2] = 1
                    }
                }
                else if( Game.rooms[rm].memory.repairer_need == 1 ){
                    if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] >= Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.repair_low ){
                        roles[16][2] = 1

                        // reduce repairer sizer
                        roles[16][4] = Math.ceil( (roles[16][5]/2 + roles[16][6]/2 ) / 2 )
                        roles[16][5] = Math.ceil( roles[16][5]/2 )
                        roles[16][6] = Math.ceil( roles[16][6]/2 )

                        // reduce hauler size
                        roles[17][4] = Math.ceil( roles[16][6] / 2 )
                        roles[17][5] = 0
                        roles[17][6] = roles[16][6]
                    }
                }

            }
            //

            // REPAIRER HAULER
            if( roles[16][1] >= 1 ){
                roles[17][2] = Math.max(2, Math.ceil( roles[16][1] * 2 ) )
            }
            //
            
            // BUILDER
            if ( Game.rooms[rm].memory.intel.construction && Game.rooms[rm].memory.intel.construction.length > 0 &&
                ( !Game.rooms[rm].storage || ( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] >= Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.build ) ) ) {

                if( !Game.rooms[rm].storage ){

                    // both container
                    if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container &&
                        Game.rooms[rm].memory.intel.container[0] && Game.rooms[rm].memory.intel.container[0].id && Game.getObjectById(Game.rooms[rm].memory.intel.container[0].id) &&
                        Game.rooms[rm].memory.intel.container[1] && Game.rooms[rm].memory.intel.container[1].id && Game.getObjectById(Game.rooms[rm].memory.intel.container[1].id) ){
                        var amt_build = Math.ceil( Math.min( ( roles[0][2] * ( roles[0][5] * 2 ) + roles[1][2] * ( roles[1][5] * 2 ) + roles[2][2] * ( roles[2][5] * 2 ) ) +
                                                             ( roles[3][2] * ( roles[3][5] * 2 ) + roles[4][2] * ( roles[4][5] * 2 ) + roles[5][2] * ( roles[5][5] * 2 ) ) , 20 ) / roles[18][5] / 5 )

                    }
                    // only first container
                    else if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container &&
                        Game.rooms[rm].memory.intel.container[0] && Game.rooms[rm].memory.intel.container[0].id && Game.getObjectById(Game.rooms[rm].memory.intel.container[0].id) &&
                        Game.rooms[rm].memory.intel.container[1] && Game.rooms[rm].memory.intel.container[1].id && Game.getObjectById(Game.rooms[rm].memory.intel.container[1].id) ){
                        
                        var amt_build = Math.ceil( Math.min( ( roles[0][2] * ( roles[0][5] * 2 ) + roles[1][2] * ( roles[1][5] * 2 ) + roles[2][2] * ( roles[2][5] * 2 ) ) +
                                                            ( roles[3][2] * ( roles[3][5] * 2 - 1 ) + roles[4][2] * ( roles[4][5] * 2 - 1 ) + roles[5][2] * ( roles[5][5] * 2 - 1 ) ) , 20 ) / roles[18][5] / 5 )

                    } 
                    // no container
                    else {
            
                        var amt_build = Math.ceil( Math.min( ( roles[0][2] * ( roles[0][5] * 2 - 1 ) + roles[1][2] * ( roles[1][5] * 2 - 1 ) + roles[2][2] * ( roles[2][5] * 2 - 1 ) ) +
                                                            ( roles[3][2] * ( roles[3][5] * 2 - 1 ) + roles[4][2] * ( roles[4][5] * 2 - 1 ) + roles[5][2] * ( roles[5][5] * 2 - 1 ) ) , 20 ) / roles[18][5] / 5 )

                    }    

                    // harvester out additional
                    var harvester_out    = _.filter(rm_creeps, (creep) => creep.memory.role == 'harvester_out')

                    if( harvester_out && harvester_out.length > 0 ){
                        var amt_build = amt_build + Math.ceil ( harvester_out.length * ( harvester_out[0].getActiveBodyparts(WORK) * 2 - 1 ) / roles[18][5] / 5 )
                    }    
                    
                    roles[18][2] = amt_build 

                    // upgraders não vão mudar de role - então só spawna builder se todo mundo estiver ocupado
                    var build_creeps_all = _.filter(rm_creeps, (creep) => creep.memory.role == 'builder' || creep.memory.role == 'upgrader' )
                    var build_creeps_filled = _.filter(build_creeps_all, (creep) => creep.store.getUsedCapacity() > 0 )

                    if( build_creeps_all == 0 || build_creeps_filled.length > build_creeps_all.length *.85 ){
                        //
                    }
                    else{
                        roles[18][2] = 0
                    }

                }
                else{
           
                    var build_creeps_all = _.filter(rm_creeps, (creep) => creep.memory.role == 'builder' || creep.memory.role == 'upgrader' )
                    var build_creeps_filled = _.filter(build_creeps_all, (creep) => creep.store.getUsedCapacity() > 0 )

                    if( build_creeps_all == 0 || build_creeps_filled.length > build_creeps_all.length *.85 ){
                        roles[18][2] = roles[18][1] + 1
                    }
                }

                // extra haulers
                if( roles[18][1] > 1 ){
                    roles[6][2] = Math.max( roles[6][2], roles[6][2] + Math.ceil( roles[18][1] * 2 / 3 ) )
                }

                // do not spwn if idle workers
                if( roles[18][1] >= 1 && _.filter( rm_creeps , (creep) => creep.memory.role == 'builder' && 
                                                                       ( !creep.memory.task_id || creep.memory.task_id == null ) ).length >= 1 ){
                    roles[18][2] = 0
                }

                // limit maximun builders
                roles[18][2] = Math.min( roles[18][2], 8 )
            }
            //

            // MINERAL
            if( Game.rooms[rm].storage && 
                Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.minerals &&
                Game.rooms[rm].memory.intel.minerals[0] && Game.rooms[rm].memory.intel.minerals[0].mineralType &&
                Game.rooms[rm].memory.intel.minerals[0].mineralAmount > 0 &&
                ( Game.rooms[rm].storage.store[ Game.rooms[rm].memory.intel.minerals[0].mineralType ] < 95000 ||
                  Game.rooms[rm].memory.intel.minerals[0].mineralAmount < 9000 ) &&
                Game.rooms[rm].memory.intel.extractor && Game.rooms[rm].memory.intel.extractor[0] &&
                Game.rooms[rm].memory.intel.extractor[0].id && 
                Game.getObjectById( Game.rooms[rm].memory.intel.extractor[0].id ) ){

                var size = Math.floor( Game.rooms[rm].energyCapacityAvailable / 500 )

                if( size >= 1 ){

                    if( size >= 8.4 ){
                        var mod = 1 
                    }
                    else{
                        var mod = 0
                    }

                    var size = Math.min( size, 8 )                    
                    
                    // HARVESTER MINERAL
                    roles[19][2] = Game.rooms[rm].memory.intel.minerals[0].vicinity

                    roles[19][4] = size     + mod
                    roles[19][5] = size * 4 + mod * 2
                    roles[19][6] = size     - mod
                    //  
                    
                    // season temp stuff
                    if( Game.rooms[rm].memory.intel && 
                        Game.rooms[rm].memory.intel.minerals && 
                        Game.rooms[rm].memory.intel.minerals[0] &&
                        Game.rooms[rm].memory.intel.minerals[0].mineralType &&
                        Game.rooms[rm].memory.intel.minerals[0].mineralType == 'T' ){
                        roles[19][6] = 2

                        if( rm == 'W6N13' && Game.rooms[rm].memory.intel.minerals[0].mineralAmount <= 9000 ){
                            roles[19][2] = 0
                        }
                    }
                    //

                }
            }
            //

            // MINERAL HAULER
            if( roles[19][1] >= 1 ){                

                var extra_distance = 2.5
                var carry = Math.ceil( ( Game.rooms[rm].memory.intel.minerals[0].db + extra_distance ) * 2 / 5 * roles[19][5] / 50 )
                var carry_mult = Math.ceil( carry / Math.min( 32, roles[19][6] ) )
                var carry = Math.min( 32, roles[19][6],  Math.ceil( carry / carry_mult ) )
                var move  = Math.min( 16, Math.ceil( carry / 2) )         

                roles[20][2] = roles[19][1] * carry_mult

                roles[20][4] = move
                roles[20][5] = 0
                roles[20][6] = carry

                // season temp stuff
                if( Game.rooms[rm].memory.intel && 
                    Game.rooms[rm].memory.intel.minerals && 
                    Game.rooms[rm].memory.intel.minerals[0] &&
                    Game.rooms[rm].memory.intel.minerals[0].mineralType &&
                    Game.rooms[rm].memory.intel.minerals[0].mineralType == 'T' ){
                    roles[20][6] = 1
                }
                //
            }
            //


            // UPGRADER
            if ( !Game.rooms[rm].memory.intel.construction || 
                 ( Game.rooms[rm].memory.intel.construction && Game.rooms[rm].memory.intel.construction.length == 0 ) ||
                 ( Game.rooms[rm].storage && Game.rooms[rm].controller.level == 8 && Game.rooms[rm].controller.ticksToDowngrade < 155000 ) ||
                 ( Game.rooms[rm].storage && Game.rooms[rm].controller.level >= 4 && Game.rooms[rm].controller.ticksToDowngrade < 35000 ) ) {

                if( Game.rooms[rm].storage && Game.rooms[rm].controller.level >= 4 ){

                    if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container &&
                        Game.rooms[rm].memory.intel.container[4] && Game.rooms[rm].memory.intel.container[4].id &&
                        Game.getObjectById( Game.rooms[rm].memory.intel.container[4].id ) &&
                        Game.getObjectById( Game.rooms[rm].memory.intel.container[4].id ).store['energy'] < 1000 ){
                        // do not spawn
                        roles[21][2] = 0
                        
                        if( Game.rooms[rm].controller.ticksToDowngrade < 15000 ){
                            roles[21][2] = 1
                            Game.rooms[rm].memory.mode_fill = 1
                        }
                        else if( Game.rooms[rm].controller.level == 8 && Game.rooms[rm].controller.ticksToDowngrade < 100000 ){
                            roles[21][2] = 1
                            Game.rooms[rm].memory.mode_fill = 1
                        }
                    }
                    else{

                        if( Game.rooms[rm].storage.store['energy'] >= Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.upgrade_low  ){

                            roles[21][2] = 1
                            Game.rooms[rm].memory.mode_fill = 1

                            if( Game.rooms[rm].controller.level != 8 ){
                                
                                var up_creeps_all = _.filter(rm_creeps, (creep) => creep.memory.role == 'upgrader' )
                                var work_energy = Math.max(_.sum( up_creeps_all, creep => { return creep.getActiveBodyparts( WORK ) * creep.ticksToLive } ),0)
                                
                                if( Game.rooms[rm].storage.store['energy'] >= Game.rooms[rm].memory.storage_lvl + work_energy ){
                                    var extra_up = Math.ceil( ( Game.rooms[rm].storage.store['energy'] - Game.rooms[rm].memory.storage_lvl - work_energy ) / 1450 / roles[21][5] )
                                    roles[21][2] = Math.max( roles[21][1] + extra_up - roles[16][1], 1 )
                                }
                            }
                        }
                    }                    
                }
                else{

                    if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container &&
                        Game.rooms[rm].memory.intel.container[4] && Game.rooms[rm].memory.intel.container[4].id &&
                        Game.getObjectById( Game.rooms[rm].memory.intel.container[4].id ) ){
                        
                        if( Game.getObjectById( Game.rooms[rm].memory.intel.container[4].id ).store['energy'] >= 1000 ){

                            var up_creeps_all    = _.filter(rm_creeps, (creep) => creep.memory.role == 'upgrader' )
                            var up_creeps_filled = _.filter(up_creeps_all, (creep) => creep.store.getUsedCapacity() > 0 )

                            if( up_creeps_all.length == up_creeps_filled.length || up_creeps_all.length == 0 ){
                                roles[21][2] = roles[21][1] + 1
                            }
                        }
                    }
                    else{

                        var upgrader_amt = Math.ceil( (15 + Game.rooms[rm].memory.dyn_upgrader) / roles[21][5] )

                        if( roles[21][1] < upgrader_amt ){

                            var up_creeps_all    = _.filter(rm_creeps, (creep) => creep.memory.role == 'upgrader' )
                            var up_creeps_filled = _.filter(up_creeps_all, (creep) => creep.store.getUsedCapacity() > 0 )

                            if( up_creeps_all.length == up_creeps_filled.length ){

                                
                                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container &&
                                    Game.rooms[rm].memory.intel.container[4] && Game.rooms[rm].memory.intel.container[4].id &&
                                    Game.getObjectById( Game.rooms[rm].memory.intel.container[4].id ) &&
                                    Game.getObjectById( Game.rooms[rm].memory.intel.container[4].id ).store['energy'] < 1000 ){
                                    // do not spawn
                                    roles[21][2] = 0 
                                }
                                else{
                                    roles[21][2] = upgrader_amt
                                }
                            }
                        }
                        else{

                            if( !Game.rooms[ rm ].terminal ){
                                var xx = Game.rooms[ rm ].memory.base_x
                                var yy = Game.rooms[ rm ].memory.base_y
                            }
                            else if(  Game.rooms[ rm ].memory.h1_type == 'h' ){
                                var xx = Game.rooms[ rm ].memory.h1_x
                                var yy = Game.rooms[ rm ].memory.h1_y - 2
                            }
                            else{
                                var xx = Game.rooms[ rm ].memory.h1_x - 2
                                var yy = Game.rooms[ rm ].memory.h1_y 
                            }


                            var drop = Game.rooms[ rm ].lookForAt(LOOK_RESOURCES, xx, yy);

                            if( drop && drop.length >= 1 && drop[0].resourceType == 'energy' && drop[0].amount >= 500  ){

                                var up_creeps_all    = _.filter(rm_creeps, (creep) => creep.memory.role == 'upgrader' )
                                var up_creeps_filled = _.filter(up_creeps_all, (creep) => creep.store.getUsedCapacity() > 0 )

                                if( up_creeps_all.length == up_creeps_filled.length ){

                                    var up_creeps_all = _.filter(rm_creeps, (creep) => creep.memory.role == 'upgrader' )
                                    var work_energy = _.sum( up_creeps_all, creep => { return creep.getActiveBodyparts( WORK ) * creep.ticksToLive } );

                                    roles[21][2] = roles[21][1] + Math.max( Math.ceil ( ( work_energy - 15 * 1500 ) / roles[21][5] / 1500 ), 1)
                                }
                            }

                        }
                    }
                }

                if( Game.rooms[rm].energyCapacityAvailable == 12900 && Game.rooms[rm].controller.level == 8 ){
                    roles[21][2] = Math.min( roles[21][2], 1)
                }

                // ticks to downgrade
                if( roles[21][2] == 0 && roles[21][1] == 0 && 
                    Game.rooms[rm].storage && Game.rooms[rm].controller.level >= 4 && Game.rooms[rm].controller.ticksToDowngrade < 15000 ){
                    roles[21][2] = 1

                    roles[21][4] = 1
                    roles[21][5] = 2
                    roles[21][6] = 1
                }
                //

                // adicional haulers to move energy to upgrader container
                if( roles[6][1] >= roles[6][2] && Game.rooms[rm].storage && roles[21][1] >= 1 ){
                
                    var stg_dit = Game.rooms[rm].controller.pos.getRangeTo( Game.rooms[rm].storage )

                    roles[6][2] = roles[6][2] + Math.ceil( roles[21][1] * roles[21][5] * stg_dit * 2 / roles[6][6] / 50 )

                }
                //


                // limit maximun upgraders
                if( Game.rooms[rm].controller.level == 8 ){
                    roles[21][2] = Math.min( roles[21][2], 1 )
                }
                else if( Game.rooms[rm].controller.level == 7 ){
                    roles[21][2] = Math.min( roles[21][2], 4 )
                }
                else if( Game.rooms[rm].controller.level < 3 ){
                    roles[21][2] = Math.min( roles[21][2], 12 )
                }
                else{
                    roles[21][2] = Math.min( roles[21][2], 8 )
                }
                //
            }
            //


            // RAMPART DEFENDERS
            if( Game.rooms[rm].memory.mode_defend ==  1 && Game.rooms[rm].storage ){

                var enemies = Game.rooms[rm].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  { return ( creep.getActiveBodyparts(WORK) > 0 || 
                                                                                                        creep.getActiveBodyparts(ATTACK) > 0 || 
                                                                                                        creep.getActiveBodyparts(RANGED_ATTACK) > 0 || 
                                                                                                        creep.getActiveBodyparts(HEAL) > 0 ) &&
                                                                                                        creep.owner.username != 'Invader' } } );

                var amt = enemies.length
                var amt_orginial = enemies.length

                // rampart guys
                if( amt >= 1 ){

                    var lvl = Game.rooms[rm].controller.level
                    
                    if( lvl == 8 ){
                        var amt = Math.max(amt-3,0)
                    }
                    else if( lvl == 7 ){
                        var amt = Math.max(amt-2,0)
                    }
                    else if( lvl == 6 ){
                        var amt = Math.max(amt-1,0)
                    }
                    else{
                        var amt = amt
                    }

                    // boost to lab
                    if( amt >= 1 && Game.rooms[ rm ].terminal && 
                        Game.rooms[ rm ].memory.intel && Game.rooms[ rm ].memory.intel.lab[3] && Game.rooms[rm].memory.intel.lab[3].id && 
                        Game.getObjectById( Game.rooms[rm].memory.intel.lab[3].id ) ){
                        
                        var lab = Game.getObjectById( Game.rooms[rm].memory.intel.lab[3].id ) 
                                                 
                        if( Game.rooms[ rm ].terminal.store['XUH2O'] >= 600 && amt_orginial >= 4 ){
                            Game.rooms[ rm ].memory.intel.lab[ 3 ].min = 'XUH2O'
                            Game.rooms[ rm ].memory.intel.lab[ 3 ].sts = 3
                            var amt = Math.ceil( amt_orginial / 4 * 2 )
                        }
                        else if( Game.rooms[ rm ].terminal.store['UH2O'] >= 600 && amt_orginial >= 2 ){
                            Game.rooms[ rm ].memory.intel.lab[ 3 ].min = 'UH2O'
                            Game.rooms[ rm ].memory.intel.lab[ 3 ].sts = 3
                            var amt = Math.ceil( amt_orginial / 4 * 2 )
                        }
                        else if( Game.rooms[ rm ].terminal.store['UH'] >= 600 && amt_orginial >= 1 ){
                            Game.rooms[ rm ].memory.intel.lab[ 3 ].min = 'UH'
                            Game.rooms[ rm ].memory.intel.lab[ 3 ].sts = 3
                            var amt = amt
                        }                                     
                    }    
                    
                    roles[22][2] = amt  
                }  
            }
            //
            
            
            // POWER FIXES
            if( Game.rooms[rm].controller.isPowerEnabled ){
                for(var name in Game.powerCreeps ) {
                    var pc = Game.powerCreeps[ name ]
                    if( pc && pc.pos && pc.pos.roomName == rm ){
                        // PWR_REGEN_SOURCE
                        if( pc.powers[PWR_REGEN_SOURCE] && pc.powers[PWR_REGEN_SOURCE].level > 0 ){

                            var pwr_lvl = pc.powers[PWR_REGEN_SOURCE].level

                            if( pwr_lvl == 5 && Game.rooms[rm].energyCapacityAvailable >= 1900 ){
                                roles[0][4]  = 7  // move
                                roles[0][5]  = 14 // work
                                roles[0][6]  = 3  // carry
                                roles[0][12] = 72 // ticks
                                
                                roles[3][4]  = 7  // move
                                roles[3][5]  = 14 // work
                                roles[3][6]  = 3  // carry
                                roles[3][12] = 72 // ticks
                                
                                Game.rooms[rm].memory.mode_fill = 1
                            }
                            else if( pwr_lvl >= 4 && Game.rooms[rm].energyCapacityAvailable >= 1600 ){
                                roles[0][4]  = 6  // move
                                roles[0][5]  = 12 // work
                                roles[0][6]  = 2  // carry
                                roles[0][12] = 60 // ticks
                                
                                roles[3][4]  = 6  // move
                                roles[3][5]  = 12 // work
                                roles[3][6]  = 2  // carry
                                roles[3][12] = 60 // ticks
                                
                                Game.rooms[rm].memory.mode_fill = 1
                            }
                            else if( ( pwr_lvl == 3 || pwr_lvl >= 2) && Game.rooms[rm].energyCapacityAvailable >= 1350 ){
                                roles[0][4]  = 5  // move
                                roles[0][5]  = 10 // work
                                roles[0][6]  = 2  // carry
                                roles[0][12] = 51 // ticks
                                
                                roles[3][4]  = 5  // move
                                roles[3][5]  = 10 // work
                                roles[3][6]  = 2  // carry
                                roles[3][12] = 51 // ticks
                            }
                            else if( pwr_lvl >= 1 && Game.rooms[rm].energyCapacityAvailable >= 950 ){
                                roles[0][4]  = 4  // move
                                roles[0][5]  = 7  // work
                                roles[0][6]  = 1  // carry
                                roles[0][12] = 36 // ticks
                                
                                roles[3][4]  = 4  // move
                                roles[3][5]  = 7  // work
                                roles[3][6]  = 1  // carry
                                roles[3][12] = 36 // ticks
                            }
                        }
                        break;
                    }
                }
            }

            // fallback in case of low energy and no creeps
            if( roles[6][1] == 0 &&
                Game.rooms[rm].energyAvailable < 550 && Game.rooms[rm].energyCapacityAvailable >= 550 ){

                if( roles[0][1] == 0 && roles[1][1] == 0 && roles[2][1] == 0 && roles[3][1] == 0 && roles[4][1] == 0 && roles[5][1] == 0 ){

                    roles[0][2] = 0
                    roles[1][2] = 1
                    roles[2][2] = 0
                    roles[3][2] = 0
                    roles[4][2] = 0
                    roles[5][2] = 0
                }
                else if ( !Game.rooms[rm].memory.intel.link ||
                          !Game.rooms[rm].memory.intel.link[0] || !Game.rooms[rm].memory.intel.link[0].id ||
                          !Game.rooms[rm].memory.intel.link[1] || !Game.rooms[rm].memory.intel.link[1].id ){
                    roles[0][2] = 0
                    roles[1][2] = 0
                    roles[2][2] = 0
                    roles[3][2] = 0
                    roles[4][2] = 0
                    roles[5][2] = 0

                    roles[6][4] = 1
                    roles[6][6] = 1
                }
            }
            //

            // hauler
            // dont spawn extra if there is someone idle
            if( roles[6][2] > roles[6][1] ){

                var hau_creeps_all    = _.filter(rm_creeps, (creep) => creep.memory.role == 'hauler_rm' )
                var hau_creeps_filled = _.filter(hau_creeps_all, (creep) => creep.memory.task_id && creep.memory.task_id != null )

                if( hau_creeps_filled.length + 1 >= hau_creeps_all.length ){
                    // ok
                }
                else{
                    roles[6][2] = roles[6][1]
                }
            }
            //


            // ADD to spawn list
            for ( var i = 0 ; i < roles.length ; i++){
                if( roles[i][1] < roles[i][2] ){
                    for ( var j = 0 ; j < ( roles[i][2] - roles[i][1] ) ; j++){

                        var cnt = Game.rooms[rm].memory.manager_spawn.length

                        Game.rooms[rm].memory.manager_spawn[cnt] = []
                        Game.rooms[rm].memory.manager_spawn[cnt] = roles[i]

                    }
                }
            }
        }
        //


        
        // DEFENDERS 
        if( 1==1 && Game.rooms[rm].energyCapacityAvailable >= 300 && Game.rooms[rm].memory.mode_defend ==  0 &&
            ( !Game.rooms[rm].storage || 
            ( Game.rooms[rm].storage && Game.rooms[rm].terminal && Game.rooms[rm].storage.store['energy'] >= Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.defender_high ) || // energy limit a bit higher than remotes
            ( Game.rooms[rm].storage && !Game.rooms[rm].terminal && Game.rooms[rm].storage.store['energy'] >= Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.defender_low ) ) ){
        
        
            if ( Game.rooms[rm].energyCapacityAvailable >= 300 && Game.rooms[rm].energyCapacityAvailable < 400  ) { // max 300 - lvl 01 - filler 300
        
                 // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_def = [
                    ['defender',    0,  0,      0,      2,      0,       0,      0,      0,      1,      0,      '',    300,      null,        117.2,   ''],
                    ['defender',    0,  0,      0,      1,      0,       0,      0,      1,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender',    0,  0,      0,      2,      0,       0,      0,      2,      0,      0,      '',    300,      null,        117.2,   '']]
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 400 && Game.rooms[rm].energyCapacityAvailable < 550  ) { // max 400 - lvl 02 - filler 400
        
                 // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_def = [
                    ['defender'     ,    0,  0,      0,      2,      0,       0,      0,      1,      0,      0,      '',    300,      null,        117.2,   ''],                    
                    ['defender'     ,    0,  0,      0,      2,      0,       0,      1,      1,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,      3,      0,       0,      3,      0,      0,      0,      '',    300,      null,        117.2,   '']]
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 550 && Game.rooms[rm].energyCapacityAvailable < 800 ) { // max 550 - lvl 02 - filler 550
        
                 // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_def = [
                    ['defender'     ,    0,  0,      0,      2,      0,       0,      0,      2,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,      2,      0,       0,      1,      1,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,      2,      0,       0,      2,      0,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,      4,      0,       0,      4,      0,      0,      0,      '',    300,      null,        117.2,   '']]
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 800 && Game.rooms[rm].energyCapacityAvailable < 1300 ) { // max 800 - lvl 02 - filler 800
        
                 // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_def = [
                    ['defender'     ,    0,  0,      0,      5,      0,       0,      0,      3,      0,      0,      '',    300,      null,        117.2,   ''],                    
                    ['defender'     ,    0,  0,      0,      3,      0,       0,      1,      2,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,      3,      0,       0,      2,      1,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,      6,      0,       0,      6,      0,      0,      0,      '',    300,      null,        117.2,   '']]
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 1300 && Game.rooms[rm].energyCapacityAvailable < 1800 ) { // max 1300 - lvl 03 - filler 1300
        
                 // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_def = [
                    ['defender'     ,    0,  0,      0,      8,      0,       0,      0,      5,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,      4,      0,       0,      2,      2,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,      7,      0,       0,      6,      1,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defenderRampart',  0,  0,      0,     10,      0,       0,     10,      0,      0,      0,      '',    300,      null,        117.2,   '']]
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 1800 && Game.rooms[rm].energyCapacityAvailable < 2300 ) { // max 1800 - lvl 04 - filler 1300
        
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_def = [
                    ['defender'     ,    0,  0,      0,      5,      0,       0,      0,      4,      1,      0,      '',    300,      null,        117.2,   ''],                    
                    ['defender'     ,    0,  0,      0,      5,      0,       0,      3,      2,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,      7,      0,       0,      6,      1,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,     10,      0,       0,     10,      0,      0,      0,      '',    300,      null,        117.2,   '']]
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 2300 && Game.rooms[rm].energyCapacityAvailable < 3400 ) { // max 2300 - lvl 04 - filler 1300
        
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_def = [
                    ['defender'     ,    0,  0,      0,      6,      0,       0,      0,      5,      1,      0,      '',    300,      null,        117.2,   ''],                    
                    ['defender'     ,    0,  0,      0,      6,      0,       0,      3,      3,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,      8,      0,       0,      7,      1,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,     11,      0,       0,     11,      0,      0,      0,      '',    300,      null,        117.2,   '']]
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 3400 && Game.rooms[rm].energyCapacityAvailable < 5600 ) { // max 3400 - lvl 05 - filler 1300
        
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_def = [
                    ['defender'     ,    0,  0,      0,      7,      0,       0,      0,      6,      1,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,      6,      0,       0,      3,      3,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,      9,      0,       0,      8,      1,      0,      0,      '',    300,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,     12,      0,       0,     12,      0,      0,      0,      '',    300,      null,        117.2,   '']]
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 5600  ) { // max 5600 - lvl 07 - filler 2600
        
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_def = [
                    ['defender'     ,    0,  0,      0,     12,      0,       0,      0,     11,      1,      0,      '',    200,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,     14,      0,       0,      7,      7,      0,      0,      '',    200,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,     20,      0,       0,     19,      1,      0,      0,      '',    200,      null,        117.2,   ''],
                    ['defender'     ,    0,  0,      0,     23,      0,       0,     23,      0,      0,      0,      '',    200,      null,        117.2,   '']]
        
            }

            var iii = Math.floor(Math.random()*roles_def.length)

            // fill actual column
            // for ( var i = 0 ; i < roles_def.length ; i++){
                roles_def[iii][1] = _.filter( rm_creeps , (creep) => creep.memory.role == roles_def[iii][0] && 
                                                                   ( creep.ticksToLive > roles[iii][12] - 3 || creep.spawning == true || !creep.ticksToLive ) ).length
            // }
            //
            
            
                   
            // defender
            for ( var i = 0 ; i < global.rooms[rm].remotes.remotes.length ; i++){                
                
                if( global.rooms[rm].remotes.remotes[i].status == 'hostiles' ){

                    // check if remotes on a higher priority are already filled
                    for ( var j = 0 ; j < global.rooms[rm].remotes.remotes.length ; j++){

                        if( global.rooms[rm].remotes.remotes[i].status == 'available' &&
                            global.rooms[rm].remotes.remotes[j].harvester > 0 &&
                            global.rooms[rm].remotes.remotes[j].carry > 0 ){

                            break;

                        }
                    }

                    if( i <= j ){

                        var rm_tgt = Game.rooms[rm].memory.remotes[i].rm
                                   
                        // var def_obj = _.filter( rm_creeps , (creep) => creep.memory.role         == 'defender' &&
                        //                                              ( creep.memory.birth_target == rm_tgt || creep.memory.birth_target == null ) &&
                        //                                              ( creep.ticksToLive > 250 || creep.spawning == true || !creep.ticksToLive ) )

                        // var at = _.sum( def_obj, creep => { return creep.getActiveBodyparts(ATTACK) }) * 30;
                        // var ra = _.sum( def_obj, creep => { return creep.getActiveBodyparts(RANGED_ATTACK) }) * 10;
                        // var hl = _.sum( def_obj, creep => { return creep.getActiveBodyparts(HEAL) });

                        // spawn defenders
                        if( Memory.hostile && 
                            Memory.hostile[ rm_tgt ] && 
                            ( Memory.hostile[ rm_tgt ].attack + Memory.hostile[ rm_tgt ].ranged ) * 1.10 < ( roles_def[iii][7] * 30 + roles_def[iii][8] * 10 ) * 3 ){
                            
                            roles_def[iii][2] = 3
                            break;
                        }
                        else if( Memory.hostile && 
                            Memory.hostile[ rm_tgt ] && 
                            ( Memory.hostile[ rm_tgt ].attack + Memory.hostile[ rm_tgt ].ranged ) * 1.10 < ( roles_def[iii][7] * 30 + roles_def[iii][8] * 10 ) * 5 ){
                            
                            roles_def[iii][2] = 5
                            break;
                        }
                    }
                }
                else if( global.rooms[rm].remotes.remotes[i].status == 'invader' ){

                    roles_def[iii][7] = roles_def[iii][7] + roles_def[iii][8]
                    roles_def[iii][8] = 0
                    roles_def[iii][2] = 2
                }
            }
            //
          
            // adiciona para a lista
            if( roles_def.length >= 1 ){
                
                Game.rooms[rm].memory.mode_fill = 2
                
                //for ( var j = 0 ; j < roles_def.length ; j++){
                    if( roles_def[iii][1] < roles_def[iii][2] ){
        
                        var cnt = Game.rooms[rm].memory.manager_spawn.length
        
                        Game.rooms[rm].memory.manager_spawn[cnt] = []
                        Game.rooms[rm].memory.manager_spawn[cnt] = roles_def[iii]
        
                    }
                //}
            }
            //

        }
        //


        
        // AUTO EXPANSION
        if( Game.rooms[rm].memory.mode_util == 0 && Memory.oneTimer.expansion == 1 && Memory.expansion && Memory.expansion.task.timer > 0 && Game.rooms[rm].memory.mode_defend ==  0 ){
        
        // manual expansion
        // var go = 1
        // var rm_exp_tgt = 'W2N15'
        // var rm_exp_src = 'W3N13'
        
        // if( go == 1 && Game.rooms[rm_exp_tgt] && Game.rooms[rm_exp_tgt].controller && Game.rooms[rm_exp_tgt].controller.level >= 3 ){
        //     var go = 0

        //     if( Game.rooms[rm_exp_tgt] && Game.rooms[rm_exp_tgt].memory && Game.rooms[rm_exp_tgt].memory.intel &&
        //         Game.rooms[rm_exp_tgt].memory.intel.spawn && Game.rooms[rm_exp_tgt].memory.intel.spawn.length == 0 ){
        //         var go = 1
        //     }
        // }

        // Memory.expansion.task.phase = 0
        // if( Game.rooms[rm_exp_tgt] && Game.rooms[rm_exp_tgt].controller && Game.rooms[rm_exp_tgt].controller.my ){
        //     Memory.expansion.task.phase = 1
        // }

        // if( Game.gcl.level >= 7 && go == 1 ){        
        // Memory.expansion.task.rm = rm_exp_src
        // Memory.expansion.task.rm_tgt = rm_exp_tgt

            // spawn colonizers
            if( Memory.expansion.task.rm == rm && Game.rooms[rm].energyCapacityAvailable >= 1200 && 
                Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.colonizer ){
     
                var change_in_matrix = 1
                // role,        actual,   total,  tough,  move,  work,  carry,  attack, ranged,  heal,   claim,  ,body   ,ticks  ,target-info,            priority ,info2 (pos)  ,info3 (boost)  ,info4      ,info5
                var roles_colonizer = [
        
                ['claimer',            0,   0,     0,     5,      0,       0,       0,      0,     0,       1,     '',     0,Memory.expansion.task.rm_tgt,116.62,       '0',            '0',            '1',        '0'    ],
                ['colonizer',          0,   1,     0,     5,      5,       0,       0,      0,     0,       0,     '',     0,Memory.expansion.task.rm_tgt,118.63,       '0',            '0',            '2',        '0'    ],
                ['colonizer',          0,   1,     0,     6,      0,       6,       0,      0,     0,       0,     '',     0,Memory.expansion.task.rm_tgt,118.64,       '0',            '0',            '3',        '0'    ],
                ['colonizer',          0,   1,     0,     6,      6,       6,       0,      0,     0,       0,     '',     0,Memory.expansion.task.rm_tgt,118.65,       '0',            '0',            '4',        '0'    ],
                ['colonizer',          0,   1,     0,     5,      5,       0,       0,      0,     0,       0,     '',     0,Memory.expansion.task.rm_tgt,118.66,       '0',            '0',            '5',        '0'    ],
        
                ['2a_healer',          0,   2,     0,     2,      0,       0,       0,      0,     2,       0,     '',     0,Memory.expansion.task.rm_tgt,118.61,       '0',            '0',            '1',        'expansion'    ],
                ['2a_capt',            0,   2,     0,     8,      0,       0,       5,      1,     0,       0,     '',       0,Memory.expansion.task.rm_tgt,118.61,       '1',            '0',            '1',        'expansion'    ],
        
                ]
                //

                var rm_tgt_creeps = _.filter(Game.creeps, (creep) => creep.memory.birth == Memory.expansion.task.rm_tgt  )

                // check if they already exist
                // fill actual column
                for ( var ii = 0 ; ii < roles_colonizer.length ; ii++){
                    roles_colonizer[ii][1] = _.filter( rm_creeps , (creep) => creep.memory.role == roles_colonizer[ii][0] && creep.memory.birth_target == roles_colonizer[ii][13] && creep.memory.birth_info_4 == roles_colonizer[ii][17] && ( creep.ticksToLive > 0 || creep.spawning == true || !creep.ticksToLive ) ).length
                }
                //

                var distance = Game.map.getRoomLinearDistance(Memory.expansion.task.rm, Memory.expansion.task.rm_tgt)

                var h0 = _.filter( rm_tgt_creeps , (creep) => creep.memory.birth_target == 's0_550_1' && ( creep.ticksToLive > distance * 50 + 100 || creep.spawning == true || !creep.ticksToLive ) ).length
                var h1 = _.filter( rm_tgt_creeps , (creep) => creep.memory.birth_target == 's1_550_1' && ( creep.ticksToLive > distance * 50 + 100 || creep.spawning == true || !creep.ticksToLive ) ).length
                
                var wk = _.filter( rm_tgt_creeps , (creep) => ( creep.memory.role == 'upgrader' || creep.memory.role == 'builder' ) && ( creep.ticksToLive > distance * 50 + 100 || creep.spawning == true || !creep.ticksToLive ) ).length
                var mv = _.filter( rm_tgt_creeps , (creep) => creep.memory.role == 'hauler_rm' && ( creep.ticksToLive > distance * 50 + 100 || creep.spawning == true || !creep.ticksToLive ) ).length
        
                if( ( wk + roles_colonizer[3][1] ) >= 1 && ( mv + roles_colonizer[2][1] ) >= 1 && ( h1 + roles_colonizer[4][1] ) >= 1 ){
                    roles_colonizer[2][2] = Math.min( 6 - mv - roles_colonizer[2][1], ( wk + roles_colonizer[3][1] ) * 2 + 1 )
                    roles_colonizer[3][2] = 4 - wk - roles_colonizer[3][1]
                }

                if( Memory.expansion.task.phase == 0 ){
                    roles_colonizer[0][2] = 1
                    roles_colonizer[1][2] = 1
                    roles_colonizer[2][2] = 1
                    roles_colonizer[3][2] = 1
                    roles_colonizer[4][2] = 1
                }
                else{
                    roles_colonizer[0][2] = 0
                    roles_colonizer[1][2] = 1
                    roles_colonizer[2][2] = 1
                    roles_colonizer[3][2] = 1
                    roles_colonizer[4][2] = 1
                } 
                
                // change priority
                if( roles_colonizer[2][1] > roles_colonizer[3][1]  ){
                    roles_colonizer[2][14] = 105
                    roles_colonizer[2][13] = 104
                }
 
                // no more harvester 
                if( h0 >= 1 ){
                    roles_colonizer[1][2] = 0
                }

                if( h1 >= 1 ){
                    roles_colonizer[4][2] = 0
                } 
                           
        
                // adiciona para a lista
                if( roles_colonizer.length >= 1 ){
                    
                    Game.rooms[rm].memory.mode_fill = 1
                    Game.rooms[rm].memory.mode_util = 1
                
                    for ( var j = 0 ; j < roles_colonizer.length ; j++){
                        if( roles_colonizer[j][1] < roles_colonizer[j][2] ){
            
                            var cnt = Game.rooms[rm].memory.manager_spawn.length
            
                            Game.rooms[rm].memory.manager_spawn[cnt] = []
                            Game.rooms[rm].memory.manager_spawn[cnt] = roles_colonizer[j]
            
                        }
                    }
                }
                //
            }
        }


        // STRONGHOLD 118.6
        if( Game.rooms[rm].memory.mode_util == 0 && Memory.oneTimer.stronghold == 1 ){
   
            if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.strongholds && Memory.strongholds ){
        
                var obj = _.findWhere(Memory.strongholds , {rm: rm})
        
                if( obj != undefined ){
                      
                    //                           0           1      2               3                   4           5           6           7       8       9      10
                    // Memory.power_banks[cnt] = [obj[0].id, rm, observer_tgt, obj[0].ticksToDecay, obj[0].power, Game.time, 'vicinity' ]  pair1    pair2   pair3   pair4
        
                    // spawn
                    if( ( obj.ticksToDecay + obj.tick ) - Game.time > 6000 ){
                           
                        if( obj.level == 1 && Game.rooms[rm].energyCapacityAvailable >= 18 * 300  ){
                     
                            var rm_tgt = obj.rm_tgt
            
                            if( rm_tgt ){
                                var change_in_matrix = 1
                                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                var roles_stg = [
            
                                    // no boost
                                    ['squad',              0,  1,     0,    25,      0,       0,      24,      1,     0,       0,     '',     450,      rm_tgt,  188.6,       '1',            '0',            '0',        '0'    ],
                                    ['squad',              0,  1,     0,    18,      0,       0,       0,      0,    18,       0,     '',     450,      rm_tgt,  188.6,       '2',            '0',            '0',        '0'    ],
                                    ['squad',              0,  1,     0,    18,      0,       0,       0,      0,    18,       0,     '',     450,      rm_tgt,  188.6,       '3',            '0',            '0',        '0'    ],
                                    ['squad',              0,  1,     0,    18,      0,       0,       0,      0,    18,       0,     '',     450,      rm_tgt,  188.6,       '4',            '0',            '0',        '0'    ],
            
                                    ['collector_pwr',      0,   0,     0,    10,      0,      10,       0,      0,     0,       0,     '',       0,      rm_tgt, 188.59,       '1',            '0',            '10',       'power_bank'    ]
            
                                    ]

                            }
                        }

                        if( roles_stg && roles_stg.length > 0 ){            
            
                            // check if they already exist
                            // fill actual column
                            for ( var ii = 0 ; ii < roles_stg.length ; ii++){
                                roles_stg[ii][1] = _.filter( rm_creeps , (creep) => creep.memory.role == roles_stg[ii][0] && creep.memory.birth_target == roles_stg[ii][13] && creep.memory.birth_info_2 == roles_stg[ii][15] && creep.memory.birth_info_4 == roles_stg[ii][17] && ( creep.ticksToLive > 0 || creep.spawning == true || !creep.ticksToLive ) ).length
                            }
                            //
              
                            // adiciona para a lista
                            if( roles_stg.length >= 1 ){
                                
                                Game.rooms[rm].memory.mode_fill = 2
                                Game.rooms[rm].memory.mode_util = 1
                            
                                for ( var j = 0 ; j < roles_stg.length ; j++){
                                    if( roles_stg[j][1] < roles_stg[j][2] ){
        
                                        var cnt = Game.rooms[rm].memory.manager_spawn.length
        
                                        Game.rooms[rm].memory.manager_spawn[cnt] = []
                                        Game.rooms[rm].memory.manager_spawn[cnt] = roles_stg[j]
        
                                    }
                                }
                            }
                        }
                    }
                    // apaga entradas antigas
                    else {
                        delete Memory.strongholds[ obj.id ];
                    }
                }               
            }
        }
        //

        
        // POWER BANKS 118.7
        if( Game.rooms[rm].memory.mode_util == 0 && Memory.oneTimer.power_banks == 1 ){
        
            if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.powerBanks && Memory.powerBanks ){
        
                var obj = _.findWhere(Memory.powerBanks , {rm: rm})
        
                if( obj != undefined ){
        
                    //                           0           1      2               3                   4           5           6           7       8       9      10
                    // Memory.power_banks[cnt] = [obj[0].id, rm, observer_tgt, obj[0].ticksToDecay, obj[0].power, Game.time, 'vicinity' ]  pair1    pair2   pair3   pair4
        
                    // spawn
                    if( ( obj.ticksToDecay - (Game.time - obj.tick ) ) >  0   ){
        
                        var rm_tgt = obj.rm_tgt
        
                        if( rm_tgt ){
                            var change_in_matrix = 1
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                            var roles_pwr = [
        
                                ['2a_healer',          0,   1,     0,    25,      0,       0,       0,      0,    25,       0,     '',       0,      rm_tgt, 118.70,       '0',            '0',            '7',        'power_bank'    ],
                                ['2a_capt',            0,   1,     0,    20,      0,       0,      20,      0,     0,       0,     '',       0,      rm_tgt, 118.70,       '1',            '0',            '7',        'power_bank'    ],
        
                                ['2a_healer',          0,   1,     0,    25,      0,       0,       0,      0,    25,       0,     '',       0,      rm_tgt, 118.71,       '0',            '0',            '8',        'power_bank'    ],
                                ['2a_capt',            0,   1,     0,    20,      0,       0,      20,      0,     0,       0,     '',       0,      rm_tgt, 118.71,       '1',            '0',            '8',        'power_bank'    ],
        
                                ['2a_healer',          0,   1,     0,    25,      0,       0,       0,      0,    25,       0,     '',       0,      rm_tgt, 118.72,       '0',            '0',            '9',        'power_bank'    ],
                                ['2a_capt',            0,   1,     0,    20,      0,       0,      20,      0,     0,       0,     '',       0,      rm_tgt, 118.72,       '1',            '0',            '9',        'power_bank'    ],
        
                                ['2a_healer',          0,   1,     0,    25,      0,       0,       0,      0,    25,       0,     '',       0,      rm_tgt, 118.73,       '0',            '0',            '10',       'power_bank'    ],
                                ['2a_capt',            0,   1,     0,    20,      0,       0,      20,      0,     0,       0,     '',       0,      rm_tgt, 118.73,       '1',            '0',            '10',       'power_bank'    ],
        
                                ['collector_pwr',      0,   0,     0,    10,      0,      10,       0,      0,     0,       0,     '',       0,      rm_tgt, 118.69,       '1',            '0',            '10',       'power_bank'    ]
        
                                ]
        
        
                            // check if they already exist
                            // fill actual column
                            for ( var ii = 0 ; ii < roles_pwr.length ; ii++){
                                roles_pwr[ii][1] = _.filter( rm_creeps , (creep) => creep.memory.role == roles_pwr[ii][0] && creep.memory.birth_target == roles_pwr[ii][13] && creep.memory.birth_info_4 == roles_pwr[ii][17] && ( creep.ticksToLive > 0 || creep.spawning == true || !creep.ticksToLive ) ).length
                            }
                            //
        
        
                            // vicinity
                            if( obj.cnt_vic == 2 ){
        
                                roles_pwr[4][2] = 0
                                roles_pwr[5][2] = 0
                                roles_pwr[6][2] = 0
                                roles_pwr[7][2] = 0
        
                                if( obj.pair1 >= 1 ){
                                    roles_pwr[4][2] = 1
                                    roles_pwr[5][2] = 1
                                }
        
                                if( obj.pair2 >= 1 ){
                                    roles_pwr[6][2] = 1
                                    roles_pwr[7][2] = 1
                                }
                            }
                            else if( obj.cnt_vic == 3 ){
        
                                roles_pwr[6][2] = 0
                                roles_pwr[7][2] = 0
        
                                if( obj.pair1 >= 1 || obj.pair2 >= 1 || obj.pair3 >= 1 ){
                                    roles_pwr[6][2] = 1
                                    roles_pwr[7][2] = 1
                                }
                            }
                            //
        
        
                            // pair1
                            if( (roles_pwr[0][1] + roles_pwr[1][1] == 2) || obj.pair1 > 0 ){
                                if( obj.pair1 == 0 ){ obj.pair1 = 0.5 }
                                roles_pwr[0][2] = 0
                                roles_pwr[1][2] = 0
                            }
                            // pair2
                            if( (roles_pwr[2][1] + roles_pwr[3][1] == 2) || obj.pair2 > 0 ){
                                if( obj.pair2 == 0 ){ obj.pair2 = 0.5 }
                                roles_pwr[2][2] = 0
                                roles_pwr[3][2] = 0
                            }
                            // pair3
                            if( (roles_pwr[4][1] + roles_pwr[5][1] == 2) || obj.pair3 > 0 ){
                                if( obj.pair3 == 0 ){ obj.pair3 = 0.5 }
                                roles_pwr[4][2] = 0
                                roles_pwr[5][2] = 0
                            }
                            // pair4
                            if( (roles_pwr[6][1] + roles_pwr[7][1] == 2) || obj.pair4 > 0 ){
                                if( obj.pair4 == 0 ){ obj.pair4 = 0.5 }
                                roles_pwr[6][2] = 0
                                roles_pwr[7][2] = 0
                            }
                            //
        
        
                            // spawn collectors
                            if( obj.pair1 >= 2 ){
        
                                roles_pwr[8][2] = Math.round( obj.power / ( roles_pwr[8][6] * 50 ) )
        
                                if( roles_pwr[8][1] >= roles_pwr[8][2] ){
                                    obj.pair1 = 4
                                }
                            }
        
        
                            // power bank destroyed
                            if( obj.pair1 >= 3 ){
                                roles_pwr[0][2] = 0
                                roles_pwr[1][2] = 0
                                roles_pwr[2][2] = 0
                                roles_pwr[3][2] = 0
                                roles_pwr[4][2] = 0
                                roles_pwr[5][2] = 0
                                roles_pwr[6][2] = 0
                                roles_pwr[7][2] = 0
                            }
        
        
        
        
                            if( obj.pair1 == 4  ){
                                delete Memory.powerBanks[ obj.id ];
                            }
                            else {
                                // adiciona para a lista
                                if( roles_pwr.length >= 1 ){
                                    
                                    Game.rooms[rm].memory.mode_fill = 2
                                    Game.rooms[rm].memory.mode_util = 1
                                
                                    for ( var j = 0 ; j < roles_pwr.length ; j++){
                                        if( roles_pwr[j][1] < roles_pwr[j][2] ){
            
                                            var cnt = Game.rooms[rm].memory.manager_spawn.length
            
                                            Game.rooms[rm].memory.manager_spawn[cnt] = []
                                            Game.rooms[rm].memory.manager_spawn[cnt] = roles_pwr[j]
            
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // apaga entradas antigas
                    else {
                        delete Memory.powerBanks[ obj.id ];
                    }
                }
            }
        }
        //
        
        
        // DEPOSITS
        if( Game.rooms[rm].memory.mode_util == 0 && Memory.oneTimer.deposits == 1 && Game.rooms[rm].memory.mode_defend == 0 && ( Memory.stats.number_creeps_2 < Memory.cpuPredictor.creepsLimit && Game.cpu.bucket >= Memory.cpuPredictor.target - ( 10000 - Memory.cpuPredictor.target ) ) ){
      
            if( Game.rooms[rm].energyCapacityAvailable >= 2300 && Game.rooms[rm].terminal && 
                Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.depositsBank && 
                Memory.depositsBank ){
           
                var obj = _.findWhere(Memory.depositsBank , {rm: rm})
        
                if( obj != undefined ){
        
                    //                           0         1       2                3                    4                5                   6       7        8  9  10
                    // Memory.deposits[cnt] = [obj[0].id, rm, observer_tgt, obj[0].lastCooldown, obj[0].depositType, obj[0].ticksToDecay , cnt_vic ,Game.time ,0 ,0 ,0 ]
        
                    // spawn
                    if( obj.lastCooldown < 50 && ( obj.ticksToDecay - ( Game.time - obj.tick ) ) >  1000   ){
        
                        var rm_tgt = obj.rm_tgt
        
                        if( rm_tgt ){
        
                            if ( Game.rooms[rm].energyCapacityAvailable >= 2300 && 
                                 Game.rooms[rm].energyCapacityAvailable <= 5600  ) { // max 2300 - lvl 04 - filler 1300
                                var change_in_matrix = 1
                                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                var roles_deposits = [
        
                                    ['depo_harvest',       0,   1,     0,    12,     10,       2,       0,      0,     0,       0,     '',     200,      rm_tgt, 118.82,       '0',            '0',            obj.id,        'deposits'    ],
                                    ['depo_collector',     0,   1,     0,     8,      0,       8,       0,      0,     0,       0,     '',     650,      rm_tgt, 118.82,       '1',            '0',            obj.id,        'deposits'    ],
        
                                    ['2a_healer',          0,   0,     0,    25,      0,       0,       0,      0,    25,       0,     '',       0,      rm_tgt, 118.81,       '0',            '0',            obj.id,        '0'    ] ,
                                    ['2a_capt',            0,   0,     0,    27,      0,       0,      13,     10,     0,       0,     '',       0,      rm_tgt, 118.81,       '1',            '0',            obj.id,        '0'    ],
        
                                    ['2a_healer',          0,   0,     0,    25,      0,       0,       0,      0,    25,       0,     '',       0,      rm_tgt, 118.83,       '0',            '0',            obj.id,        '0'    ] ,
                                    ['2a_capt',            0,   0,     0,    27,      0,       0,      13,     10,     0,       0,     '',       0,      rm_tgt, 118.83,       '1',            '0',            obj.id,        '0'    ]
        
        
                                    ]
                            }
                            else{ // max 5600 - lvl 07 - filler 2600
        
                                var change_in_matrix = 1
                                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                var roles_deposits = [
        
                                    ['depo_harvest',       0,   1,     0,    23,     23,       4,       0,      0,     0,       0,     '',     200,      rm_tgt, 118.82,       '0',            '0',            obj.id,        'deposits'    ],
                                    ['depo_collector',     0,   1,     0,    20,      0,      20,       0,      0,     0,       0,     '',     650,      rm_tgt, 118.82,       '1',            '0',            obj.id,        'deposits'    ],
        
                                    ['2a_healer',          0,   1,     0,    25,      0,       0,       0,      0,    25,       0,     '',       0,      rm_tgt, 118.81,       '0',            '0',            obj.id,        '0'    ] ,
                                    ['2a_capt',            0,   1,     0,    27,      0,       0,      13,     10,     0,       0,     '',       0,      rm_tgt, 118.81,       '1',            '0',            obj.id,        '0'    ],
        
                                    ['2a_healer',          0,   0,     0,    25,      0,       0,       0,      0,    25,       0,     '',       0,      rm_tgt, 118.83,       '0',            '0',            obj.id,        '0'    ] ,
                                    ['2a_capt',            0,   0,     0,    27,      0,       0,      13,     10,     0,       0,     '',       0,      rm_tgt, 118.83,       '1',            '0',            obj.id,        '0'    ]
                
                                    ]
        
                            }
        
                            // check if they already exist
                            // fill actual column
                            for ( var ii = 0 ; ii < roles_deposits.length ; ii++){
                                roles_deposits[ii][1] = _.filter( rm_creeps , (creep) => creep.memory.role == roles_deposits[ii][0] &&
                                                                                         creep.memory.birth_target == roles_deposits[ii][13] &&
                                                                                         creep.memory.birth_info_4 == roles_deposits[ii][17] &&
                                                                                         ( creep.ticksToLive > roles_deposits[ii][12] || creep.spawning == true || !creep.ticksToLive ) ).length
                            }
                            //
        
        
                            // change priority
                            if( roles_deposits[0][1] > roles_deposits[1][1] ){
                                roles_deposits[0][14] = roles_deposits[0][14] + 1
                            }
                            //
        
        
                            // vicinity
                            if( obj.cnt_vic > 1 ){
        
                                roles_deposits[0][2] = obj.cnt_vic
        
                                if( obj.lastCooldown < 20 ){
                                    roles_deposits[1][2] = obj.cnt_vic
                                }
                                else if( obj.lastCooldown < 35 ){
                                    roles_deposits[1][2] = Math.ceil( obj.cnt_vic / 2 )
                                }
                                else{
                                    roles_deposits[1][2] = Math.ceil( obj.cnt_vic / 3 )
                                }
                            }
                            //
        
        
        
                            if( obj.lastCooldown > 50  ){
                                delete Memory.depositsBank[ obj.id ];
                            }
                            else {
                                // adiciona para a lista
                                if( roles_deposits.length >= 1 ){
                                    
                                    Game.rooms[rm].memory.mode_fill = 1
                                    Game.rooms[rm].memory.mode_util = 1
                                    
                                    for ( var j = 0 ; j < roles_deposits.length ; j++){
                                        if( roles_deposits[j][1] < roles_deposits[j][2] ){
            
                                            var cnt = Game.rooms[rm].memory.manager_spawn.length
            
                                            Game.rooms[rm].memory.manager_spawn[cnt] = []
                                            Game.rooms[rm].memory.manager_spawn[cnt] = roles_deposits[j]
            
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // apaga entradas antigas
                    else {
                        delete Memory.depositsBank[ obj.id ];
                    }
                }
            }
        }
        //
        
        
        // Storage list 118.9
        if( Game.rooms[rm].memory.mode_util == 0 && Memory.oneTimer.storage_loot == 1 && ( Memory.stats.number_creeps_2 < Memory.cpuPredictor.creepsLimit && Game.cpu.bucket >= Memory.cpuPredictor.target - ( 10000 - Memory.cpuPredictor.target ) ) ){
        
            if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.storage_list && Memory.storage_list ){
        
                if( Memory.storage_list[0] && (Game.time - Memory.storage_list[0].detection_tick ) > 3000 ){
                    // apaga entradas antigas
                    Memory.storage_list.splice(0,1)
                }
                else if( Memory.storage_list[0] && Memory.storage_list[0].rm == rm  ){
        
                    var rm_tgt = Memory.storage_list[0].rm_sct
                    var distance = Memory.storage_list[0].distance
        
                    if( rm_tgt ){
        
        
                        if ( Game.rooms[rm].energyCapacityAvailable >= 2000  ) {
                            var change_in_matrix = 1
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                            var roles_storage = [
        
                                ['mover',              0,   1,     0,    20,      0,      20,       0,      0,     0,       0,     '',       0,      rm_tgt, 151,       '0',            '0',            distance,        '0'    ]
        
        
                                ]
                        }
                        else if ( Game.rooms[rm].energyCapacityAvailable >= 1000  ) {
                            var change_in_matrix = 1
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                            var roles_storage = [
        
                                ['mover',              0,   1,     0,    10,      0,      10,       0,      0,     0,       0,     '',       0,      rm_tgt, 151,       '0',            '0',            distance,        '0'    ]
        
                                ]
                        }
                        else {
                            var change_in_matrix = 1
                            // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                            var roles_storage = [
        
                                ['mover',              0,   1,     0,    3,      0,      3,       0,      0,     0,       0,     '',       0,      rm_tgt, 151,       '0',            '0',            distance,        '0'    ]
        
                                ]
                        }
        
                        // check if they already exist
                        // fill actual column
                        for ( var ii = 0 ; ii < roles_storage.length ; ii++){
                            roles_storage[ii][1] = _.filter( rm_creeps , (creep) =>  creep.memory.role == roles_storage[ii][0] &&
                                                                                     creep.memory.birth_target == roles_storage[ii][13] &&
                                                                                     ( creep.ticksToLive > roles_storage[ii][12] || creep.spawning == true || !creep.ticksToLive ) ).length
                        }
                        //
        
        
                        // adiciona para a lista
                        if( roles_storage.length >= 1 ){
                                    
                            Game.rooms[rm].memory.mode_fill = 1
                            Game.rooms[rm].memory.mode_util = 1
                                    
                            for ( var j = 0 ; j < roles_storage.length ; j++){
                                if( roles_storage[j][1] < roles_storage[j][2] ){
            
                                    var cnt = Game.rooms[rm].memory.manager_spawn.length
            
                                    Game.rooms[rm].memory.manager_spawn[cnt] = []
                                    Game.rooms[rm].memory.manager_spawn[cnt] = roles_storage[j]
            
                                }
                                else{
                                    Memory.storage_list.splice(0,1)
                                }
                            }
                        }
                    }
                }
            }
        }
        //
        
        
        // Mineral SK
        if( Game.rooms[rm].memory.mode_util == 0 && Memory.oneTimer.sk_mining == 1 ){
        
            if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.mineralsBank && Memory.mineralsBank ){
        
                for( id in Memory.mineralsBank ){
        
                    if( ( Game.time - Memory.mineralsBank[id].tick ) > 4500  ){
                        delete Memory.mineralsBank[id]
        
                    }
                    else if( Memory.mineralsBank[id].rm == rm &&
                             ( Memory.stats.minerals[Memory.mineralsBank[id].mineralType] < Memory.stats.number_rooms * 4000 ||  Memory.mineralsBank[id].mineralAmount < 10000 ) ){
        
                        var rm_tgt = Memory.mineralsBank[id].rm_tgt
        
                        // check if there is no stronghold on the room
                        var stronghold = 0
                        for( id_st in Memory.strongholds ){
                            if( Memory.strongholds[id_st].rm_tgt == rm_tgt ){
                                var stronghold = 1
                                delete Memory.mineralsBank[id]
                                break;
                            }
                        }
        
                        if( stronghold == 0 ){
        
                            var miners = Memory.mineralsBank[id].cnt_vic
                            var distan = Game.map.getRoomLinearDistance(rm, rm_tgt)
        
                            if ( Game.rooms[rm].energyCapacityAvailable >= 5000  ) {
                                var change_in_matrix = 1
                                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5
                                var roles_mineralSK = [
        
                                      // H
                                      ['mineralSK',          0,miners,   0,    26,      7,      17,       0,      0,     0,       0,     '',     500 + distan*50,      rm_tgt, 151,       '0',            '0',            '0',        '0'   ],
                                      ['mineralSK_help',     0,   1,     0,    25,      0,       0,      18,      1,     6,       0,     '',     499 + distan*50,      rm_tgt,  30,       '1',            '0',            '10',       '0'   ]
        
                                    ]
                            }
        
                            // check if they already exist
                            // fill actual column
                            for ( var ii = 0 ; ii < roles_mineralSK.length ; ii++){
                                roles_mineralSK[ii][1] = _.filter( rm_creeps , (creep) =>  creep.memory.role == roles_mineralSK[ii][0] &&
                                                                                           creep.memory.birth_target == roles_mineralSK[ii][13] &&
                                                                                         ( creep.ticksToLive > roles_mineralSK[ii][12] || creep.spawning == true || !creep.ticksToLive ) ).length
                            }
                            //
        
                            // adiciona para a lista
                            if( roles_mineralSK.length >= 1 ){
                                    
                                Game.rooms[rm].memory.mode_fill = 1
                                Game.rooms[rm].memory.mode_util = 1
                                
                                for ( var j = 0 ; j < roles_mineralSK.length ; j++){
                                    if( roles_mineralSK[j][1] < roles_mineralSK[j][2] ){
            
                                        var cnt = Game.rooms[rm].memory.manager_spawn.length
            
                                        Game.rooms[rm].memory.manager_spawn[cnt] = []
                                        Game.rooms[rm].memory.manager_spawn[cnt] = roles_mineralSK[j]
            
                                    }
                                }                                
                            }
                            //
                        }
                    }
                }
            }
        }
        //


        // REMOTES
        if( Game.rooms[rm].energyCapacityAvailable >= 300 && ( Memory.stats.number_creeps_2 < Memory.cpuPredictor.creepsLimit && Game.cpu.bucket >= Memory.cpuPredictor.target - ( 10000 - Memory.cpuPredictor.target ) ) &&
            Game.rooms[rm].memory.manager_spawn.length == 0 && 
            ( !Game.rooms[rm].storage || 
              ( Game.rooms[rm].storage && Game.rooms[rm].terminal && Game.rooms[rm].storage.store['energy'] >= Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.remotes_high ) ||
              ( Game.rooms[rm].storage && !Game.rooms[rm].terminal && Game.rooms[rm].storage.store['energy'] >= Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.remotes_low ) ) ){
        
            if ( Game.rooms[rm].energyCapacityAvailable >= 300 && Game.rooms[rm].energyCapacityAvailable < 400  ) { // max 300 - lvl 01 - filler 300
        
                 // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_out = [
                    ['harvester_out',    0,  0,      0,      2,      2,       0,      0,      0,      0,      0,      '',      0,      'rm',        300,   ''],
                    ['hauler_out'   ,    0,  0,      0,      2,      0,       2,      0,      0,      0,      0,      '',      0,      null,        300,   ''],
                    ['reserver'     ,    0,  0,      0,      1,      0,       0,      0,      0,      0,      1,      '',      0,      'rm',        300,   '']] // no
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 400 && Game.rooms[rm].energyCapacityAvailable < 550  ) { // max 400 - lvl 02 - filler 400
        
                 // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_out = [
                    ['harvester_out',    0,  0,      0,      2,      2,       0,      0,      0,      0,      0,      '',      0,      'rm',        300,   ''],
                    ['hauler_out'   ,    0,  0,      0,      3,      0,       3,      0,      0,      0,      0,      '',      0,      null,        300,   ''],
                    ['reserver'     ,    0,  0,      0,      1,      0,       0,      0,      0,      0,      1,      '',      0,      'rm',        300,   '']] // no
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 550 && Game.rooms[rm].energyCapacityAvailable < 800 ) { // max 550 - lvl 02 - filler 550
        
                 // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_out = [
                    ['harvester_out',    0,  0,      0,      3,      3,       0,      0,      0,      0,      0,      '',      0,      'rm',        300,   ''],
                    ['hauler_out'   ,    0,  0,      0,      4,      0,       4,      0,      0,      0,      0,      '',      0,      null,        300,   ''],
                    ['reserver'     ,    0,  0,      0,      1,      0,       0,      0,      0,      0,      1,      '',      0,      'rm',        300,   '']] // no
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 800 && Game.rooms[rm].energyCapacityAvailable < 1300 ) { // max 800 - lvl 02 - filler 800
        
                 // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_out = [
                    ['harvester_out',    0,  0,      0,      5,      5,       0,      0,      0,      0,      0,      '',      0,      'rm',        300,   ''],
                    ['hauler_out'   ,    0,  0,      0,      6,      0,       6,      0,      0,      0,      0,      '',      0,      null,        300,   ''],
                    ['reserver'     ,    0,  0,      0,      1,      0,       0,      0,      0,      0,      1,      '',      0,      'rm',        300,   '']] 
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 1300 && Game.rooms[rm].energyCapacityAvailable < 1800 ) { // max 1300 - lvl 03 - filler 1300
        
                 // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_out = [
                    ['harvester_out',    0,  0,      0,      3,      6,       1,      0,      0,      0,      0,      '',      0,      'rm',        300,   ''],
                    ['hauler_out'   ,    0,  0,      0,      5,      0,      10,      0,      0,      0,      0,      '',      0,      null,        300,   ''],
                    ['reserver'     ,    0,  0,      0,      1,      0,       0,      0,      0,      0,      1,      '',      0,      'rm',        300,   '']]
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 1800 && Game.rooms[rm].energyCapacityAvailable < 2300 ) { // max 1800 - lvl 04 - filler 1300
        
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_out = [
                    ['harvester_out',    0,  0,      0,      3,      6,       1,      0,      0,      0,      0,      '',      0,      'rm',        300,   ''],
                    ['hauler_out'   ,    0,  0,      0,      6,      0,      12,      0,      0,      0,      0,      '',      0,      null,        300,   ''],
                    ['reserver'     ,    0,  0,      0,      2,      0,       0,      0,      0,      0,      2,      '',      0,      'rm',        300,   '']]
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 2300 && Game.rooms[rm].energyCapacityAvailable < 5600 ) { // max 2300 - lvl 04 - filler 1300
        
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_out = [
                    ['harvester_out',    0,  0,      0,      3,      6,       1,      0,      0,      0,      0,      '',      0,      'rm',        300,   ''],
                    ['hauler_out'   ,    0,  0,      0,      7,      0,      14,      0,      0,      0,      0,      '',      0,      null,        300,   ''],
                    ['reserver'     ,    0,  0,      0,      2,      0,       0,      0,      0,      0,      2,      '',      0,      'rm',        300,   '']]
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 5600 && Game.rooms[rm].controller.level == 7 ) { // max 5600 - lvl 07 - filler 2600
        
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_out = [
                    ['harvester_out',    0,  0,      0,      3,      6,       1,      0,      0,      0,      0,      '',      0,      'rm',        300,   ''],
                    ['hauler_out'   ,    0,  0,      0,     14,      0,      28,      0,      0,      0,      0,      '',      0,      null,        300,   ''],
                    ['reserver'     ,    0,  0,      0,      3,      0,       0,      0,      0,      0,      3,      '',      0,      'rm',        300,   '']]
        
            }
            else if ( Game.rooms[rm].energyCapacityAvailable >= 5600 && Game.rooms[rm].controller.level == 8 ) { // max 5600 - lvl 08 - filler 4900
        
                // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority
                var roles_out = [
                    ['harvester_out',    0,  0,      0,      3,      6,       1,      0,      0,      0,      0,      '',      0,      'rm',        300,   ''],
                    ['hauler_out'   ,    0,  0,      0,     16,      0,      32,      0,      0,      0,      0,      '',      0,      null,        300,   ''],
                    ['reserver'     ,    0,  0,      0,      6,      0,       0,      0,      0,      0,      6,      '',      0,      'rm',        300,   '']]
        
            }

            // extra dist for low lvl rooms
            if( Game.rooms[rm].controller.level <= 6 ){
                var dist_extra = 50
            }
            else{
                var dist_extra = 0
            }

            for ( var i = 0 ; i < global.rooms[rm].remotes.remotes.length ; i++){

                var rm_tgt = Game.rooms[rm].memory.remotes[i].rm

                // STATUS FROM MAIN.REMOTES.JS
                            
                // my room
                if( global.rooms[rm].remotes.remotes[i].status == 'my room' ){
                    
                    // do nothing
                   
                }
                // hostile claim
                else if( global.rooms[rm].remotes.remotes[i].status == 'claimed' ){
                    
                    // do nothing
                    
                }
                // reserved from hostile
                else if( global.rooms[rm].remotes.remotes[i].status == 'reserved' ){
                    
                    // do nothing
                    
                }
                // room on block list
                else if( global.rooms[rm].remotes.remotes[i].status == 'manual' ){

                    // do nothing

                }
                // hostiles on remote 
                // hostiles on path to remote          
                // invader core on remote
                else if( global.rooms[rm].remotes.remotes[i].status == 'my room'  ||
                         global.rooms[rm].remotes.remotes[i].status == 'claimed'  ||
                         global.rooms[rm].remotes.remotes[i].status == 'reserved' ||
                         global.rooms[rm].remotes.remotes[i].status == 'manual'   ||
                         global.rooms[rm].remotes.remotes[i].status == 'hostiles' ||
                         global.rooms[rm].remotes.remotes[i].status == 'blocked'  ||
                         global.rooms[rm].remotes.remotes[i].status == 'invader' ){

                    // do not spawn new creeps and try to relocate existent
                    var realocate = _.filter( rm_creeps , (creep) => creep.memory.birth_target == rm_tgt )

                    if( realocate && realocate.length > 0 ){

                        for ( var ii = 0 ; ii < realocate.length ; ii++){  

                            if( realocate[ii].memory.role == 'harvester_out' ){
                                var relocate_harvester = realocate[ii]                                    
                            }
                            else if( realocate[ii].memory.role == 'reserver' ){
                                var relocate_reserver = realocate[ii]                                 
                            }
                            else if( realocate[ii].memory.role == 'hauler_out' ){

                                realocate[ii].memory.birth_target   = null // rm_tgt
                                realocate[ii].memory.birth_info     = null // not importante
                                realocate[ii].memory.birth_info_2   = null // source.id
                                realocate[ii].memory.birth_info_5   = null // distance
                                realocate[ii].memory.container      = null // container

                                realocate[ii].memory.task_id        = null
                                realocate[ii].memory.task_resource  = null
                                realocate[ii].memory.task_operation = null                                    
                            }
                        }
                    } 
                }
                // shared remotes
                else if( global.rooms[rm].remotes.remotes[i].status == 'shared' ){

                    // do nothing

                }
                // spawn remotes
                else if( global.rooms[rm].remotes.remotes[i].status == 'available' ){

                    var distance = global.rooms[rm].remotes.remotes[i].distance
                    var source = global.rooms[rm].remotes.remotes[i].source

                    // HARVESTER
                    var harv_cnt = global.rooms[rm].remotes.remotes[i].harvester
                
                    if( harv_cnt == 0 && 
                       (( global.rooms[rm].remotes.remotes[i].distance <= Memory.config.outpost_max_dist + dist_extra && Game.cpu.bucket > 4000 ) ||
                        ( global.rooms[rm].remotes.remotes[i].distance <= ( Memory.config.outpost_max_dist + dist_extra ) * .7 ) ) ){

                        // reocate from another remote
                        if( relocate_harvester ){
                            relocate_harvester.memory.birth_target   = rm_tgt // rm_tgt
                            relocate_harvester.memory.birth_info     = 300 + distance // not importante
                            relocate_harvester.memory.birth_info_2   = source // source.id
                            relocate_harvester.memory.birth_info_5   = distance // distance
                            if( relocate_harvester.memory.container ){
                                delete relocate_harvester.memory.container
                            }
                            if( relocate_harvester.memory.phase ){
                                delete relocate_harvester.memory.phase
                            }   

                            global.rooms[rm].remotes.remotes[i].harvester = 1
                        }
                        // spawn harvester
                        else{
                            roles_out[0][13] = rm_tgt
                            roles_out[0][14] = roles_out[0][14] + distance
                            roles_out[0][15] = source
                            roles_out[0][18] = distance

                            // add to spawn list
                            var cnt = Game.rooms[rm].memory.manager_spawn.length   

                            Game.rooms[rm].memory.manager_spawn[cnt] = []
                            Game.rooms[rm].memory.manager_spawn[cnt] = roles_out[0]

                            delete global.rooms[rm].remotes
                            break;                        
                        }
                    }

                    // HAULER
                    var carry_sum = global.rooms[rm].remotes.carry_sum
                    var carry_need = global.rooms[rm].remotes.remotes[i].carry_need
                    
                    if( carry_sum < Math.ceil( carry_need ) && Game.cpu.bucket > 3000 ){

                        var hauler_iddle = _.filter( rm_creeps , (creep) => creep.memory.role == 'hauler_out' && 
                                                                            creep.pos.roomName == creep.memory.birth &&
                                                                            creep.ticksToLive > 250 &&
                                                                            creep.store.getUsedCapacity() == 0 &&
                                                                            ( !creep.memory.birth_target || creep.memory.birth_target == null ) )

                        if( hauler_iddle && hauler_iddle.length <= 1 ){

                            // add work part
                            if( Game.rooms[rm].energyCapacityAvailable >= 1300 ){

                                var harv_out  = _.filter( rm_creeps , (creep) => creep.memory.role == 'harvester_out' && 
                                                                                 creep.pos.roomName == creep.memory.birth ).length

                                var hauler_out= _.filter( rm_creeps , (creep) => creep.memory.role == 'hauler_out' && 
                                                                                 creep.getActiveBodyparts(WORK) >= 1 &&
                                                                                 creep.pos.roomName == creep.memory.birth ).length

                                if( hauler_out < harv_out || 1==1 ){
                                    roles_out[1][4] = roles_out[1][4] + 1
                                    roles_out[1][5] = roles_out[1][5] + 1
                                }
                            }
                            //


                            // add to spawn list
                            var cnt = Game.rooms[rm].memory.manager_spawn.length   

                            Game.rooms[rm].memory.manager_spawn[cnt] = []
                            Game.rooms[rm].memory.manager_spawn[cnt] = roles_out[1]

                            delete global.rooms[rm].remotes
                            break; 
                        }
                    }

                    // RESERVER
                    if( Game.rooms[rm].energyCapacityAvailable >= 650 && Game.cpu.bucket > 4000 ){ 

                        var resv_cnt = global.rooms[rm].remotes.remotes[i].reserver 

                        if( Game.rooms[rm].energyCapacityAvailable < 1300 ){
                            var multiplier = Math.min( 2, Game.rooms[rm].memory.remotes[i].sources_vic )
                        }
                        else{
                            var multiplier = 1
                        }

                        if( resv_cnt < multiplier && 
                            global.rooms[rm].remotes.remotes[i].distance <= Memory.config.outpost_max_dist + dist_extra && 
                            ( ( multiplier > 1 && Game.rooms[rm].energyCapacityAvailable >= 650  ) || 
                              ( multiplier ==1 && Game.rooms[rm].energyCapacityAvailable >= 1300 ) ) ) {

                            if( Game.rooms[rm].memory.remotes[i].reservation_ticks + multiplier * ( 600 - global.rooms[rm].remotes.remotes[i].distance ) * roles_out[2][10] - 600 <= 5000 ){

                                // relocate
                                if( relocate_reserver ){
                                    relocate_reserver.memory.birth_target   = rm_tgt // rm_tgt
                                    relocate_reserver.memory.birth_info     = 300 + distance // not importante

                                    global.rooms[rm].remotes.remotes[i].reserver = global.rooms[rm].remotes.remotes[i].reserver + 1
                                }
                                // spawn
                                else{
                                    roles_out[2][2]  = multiplier
                                    roles_out[2][13] = rm_tgt
                                    roles_out[2][14] = roles_out[2][14] + distance

                                    // add to spawn list
                                    var cnt = Game.rooms[rm].memory.manager_spawn.length

                                    Game.rooms[rm].memory.manager_spawn[cnt] = []
                                    Game.rooms[rm].memory.manager_spawn[cnt] = roles_out[2]

                                    delete global.rooms[rm].remotes
                                    break;
                                }
                            }
                        }
                    }
                    //                    
                }
                //
            }
            //
        }
        //

  


        // sort
        Game.rooms[rm].memory.manager_spawn = _.sortBy( Game.rooms[rm].memory.manager_spawn,  function(o) { return o[14]; });

        for (var i = 0 ; i < Game.rooms[rm].memory.manager_spawn.length ; i++ ){
            Game.rooms[rm].memory.manager_spawn[i][11] = i
        }
        //

    }
};

module.exports = baseSpawnManager;
