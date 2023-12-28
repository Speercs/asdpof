const Pathing = require('pathing');

var roleBaseBalancer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var prior  = 101
        var colour = '#00FF00'

        var rm = creep.memory.birth;

        if(!creep.memory.harvesting && creep.store.getUsedCapacity() == 0 && creep.ticksToLive > 3) {
            creep.memory.harvesting = true;
            creep.memory.task_id        = null
            creep.memory.task_resource  = null
            creep.memory.task_operation = null
        }
        if( creep.memory.harvesting && creep.store.getUsedCapacity() > 0) {
            creep.memory.harvesting = false;
            creep.memory.task_id        = null
            creep.memory.task_resource  = null
            creep.memory.task_operation = null
        }

        // fallback
        if( creep.memory.harvesting && creep.store.getUsedCapacity() == 0 ){
            creep.memory.task = 'free'
        }
        //    

        // suicide
        if( !Game.rooms[rm].storage ){
            creep.suicide()
        }
        //

        // task
        if( !creep.memory.task ){
            creep.memory.task = 'free'
        }
        //

         // operate link
         var base_link_withdraw = 0
         if ( Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link.length >= 2 ) {

            // source
            if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link[0] ){
                var link_s0 = Game.getObjectById( Game.rooms[rm].memory.intel.link[0].id )
            }
            if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link[2] ){
                var link_s1 = Game.getObjectById( Game.rooms[rm].memory.intel.link[2].id )
            }
            //

            // base
            if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link[1] ){
                var link_b = Game.getObjectById( Game.rooms[rm].memory.intel.link[1].id )
            }
            //
            
            if( ( link_s0 && link_s0.store['energy'] >= 751 ) ||
                ( link_s1 && link_s1.store['energy'] >= 751 ) ||
                ( link_b && link_b.store['energy'] >= 1 ) ){

                //half 1
                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link[3] ){
                    var link_h1 = Game.getObjectById( Game.rooms[rm].memory.intel.link[3].id )
                }
                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[2] ){
                    var cont_h1 = Game.getObjectById( Game.rooms[rm].memory.intel.container[2].id )
                }
                //

                // half2
                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link[4] ){
                    var link_h2 = Game.getObjectById( Game.rooms[rm].memory.intel.link[4].id )
                }
                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[3] ){
                    var cont_h2 = Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id )
                }
                //

                // controller
                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link[5] ){
                    var link_c = Game.getObjectById( Game.rooms[rm].memory.intel.link[5].id )
                }
                //

                if( Game.rooms[rm].controller.level == 8  ){
                    var link_low_limit = 200
                }
                else if( Game.rooms[rm].controller.level == 8  ){
                    var link_low_limit = 100
                }
                else {
                    var link_low_limit = 50
                }
          
                var link_target = 0
               
                // send to half1
                if( cont_h1 && cont_h2 && cont_h1.store['energy'] <= cont_h2.store['energy'] &&
                    link_h1 && link_h1.store['energy'] < link_low_limit ){

                    var link_target = link_h1     
                    var amt_send = 800                     
                }
                // send to half2
                else if( cont_h1 && cont_h2 && cont_h1.store['energy'] > cont_h2.store['energy'] &&
                         link_h2 && link_h2.store['energy'] < link_low_limit ){

                    var link_target = link_h2  
                    var amt_send = 800                           
                }
                // send to controller
                else if( link_c && link_c.store['energy'] <= 250 ){

                    var link_target = link_c  
                    var amt_send = 800 - link_c.store['energy']                          
                }
                // below 8 - send to half1
                else if( cont_h1 && !cont_h2 &&
                    link_h1 && link_h1.store['energy'] < link_low_limit ){

                    var link_target = link_h1     
                    var amt_send = 800                     
                }
                // send to half1 - fallback
                if( link_h1 && link_h1.store['energy'] < link_low_limit ){

                    var link_target = link_h1     
                    var amt_send = 800                     
                }
                // send to half2 - fallback
                else if( link_h2 && link_h2.store['energy'] < link_low_limit ){

                    var link_target = link_h2  
                    var amt_send = 800                           
                }
                // send to base
                else if( link_b && link_b.store['energy'] == 0 ){
                    
                    var link_target = link_b
                    var amt_send = 800
                }
                //
    
                if( link_target != 0 ){
                    // source 0 SEND                        
                    if( link_s0 && link_s0.cooldown == 0 && link_s0.store['energy'] >= 751 ){

                        var obj     = link_s0
                        var obj2    = link_target
                        var result  = obj.transferEnergy( obj2 ,Math.min(amt_send,obj.store['energy'], 800-obj2.store['energy']))

                    }
                    // source 1 SEND
                    else if( link_s1 && link_s1.cooldown == 0 && link_s1.store['energy'] >= 751 ){

                        var obj     = link_s1
                        var obj2    = link_target
                        var result  = obj.transferEnergy( obj2 ,Math.min(amt_send,obj.store['energy'], 800-obj2.store['energy']))

                    }
                    // send FROM base
                    else if( link_b && link_b.cooldown == 0 && link_b.store['energy'] >= 1 &&
                             link_b.id != link_target.id ){

                        var obj     = link_b
                        var obj2    = link_target
                        var result  = obj.transferEnergy( obj2 ,Math.min(amt_send,obj.store['energy'], 800-obj2.store['energy']))

                    } 
                }
                //

                var base_link_withdraw = 0
                if( link_h1 && link_h2 && link_s0 && link_s1 ){
                    if(( (link_h1.store['energy'] > 0 && cont_h1 && cont_h1.store['energy'] >= 1200 && 
                          link_h2.store['energy'] > 0 && cont_h2 && cont_h2.store['energy'] >= 1200 &&
                          link_c && link_c.store['energy'] > 0 ) 
                        ||
                        (link_h1.store['energy'] > 0 && cont_h1 && cont_h1.store['energy'] >= 1200 && 
                         link_h2.store['energy'] > 0 && cont_h2 && cont_h2.store['energy'] >= 1200 &&
                         !link_c ) ) 
                        &&
                        ( ( link_s0.cooldown == 0 && link_s0.store['energy'] >= 751 ) ||
                          ( link_s1.cooldown == 0 && link_s1.store['energy'] >= 751 ) ) 
                        ){

                        var base_link_withdraw = 1
                    }
                }
                else if( link_h1 && !link_h2 && link_s0 && link_s1 ){
                    if(( (link_h1.store['energy'] > 0 && cont_h1 && cont_h1.store['energy'] >= 1200 && 
                          link_c && link_c.store['energy'] > 0 ) 
                        ||
                        (link_h1.store['energy'] > 0 && cont_h1 && cont_h1.store['energy'] >= 1200 && 
                         !link_c ) ) 
                        &&
                        ( ( link_s0.cooldown == 0 && link_s0.store['energy'] >= 751 ) ||
                          ( link_s1.cooldown == 0 && link_s1.store['energy'] >= 751 ) ) 
                        ){

                        var base_link_withdraw = 1
                    }
                }
                else if( !link_h1 && !link_h2 && link_s0 && link_s1 ){
                    var base_link_withdraw = 1
                }
                else{
                    var base_link_withdraw = 1
                    creep.say('link fallback')
                }
                //
            }
        }
        //

        // process power
        if( Memory.oneTimer.power_banks == 1 && Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.powerSpawn && Game.rooms[rm].memory.intel.powerSpawn[0] && Game.rooms[rm].memory.intel.powerSpawn[0].id &&
            Game.rooms[rm].memory.mode_defend == 0 && 
            Game.rooms[rm].memory.mode_nuke == 0 &&
            Game.rooms[rm].memory.ramp_repairer_need == 0 ){

            var ps = Game.getObjectById( Game.rooms[rm].memory.intel.powerSpawn[0].id );

            if( ps ){
                if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] >= Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.process_pwr &&
                    ps.store['power'] >= 1 && ps.store['energy'] >= 50  ){
                    ps.processPower()
                }
            }
        }
        //

        // move into position
        if ( Game.rooms[rm].memory.base_x ) {

            var xx = Game.rooms[rm].memory.base_x + 1
            var yy = Game.rooms[rm].memory.base_y + 1

            if ( creep.pos.x == xx && creep.pos.y == yy) {

                var ready = 1
               
                // renew
                if( creep.ticksToLive <= (1500 - Math.floor( 600/creep.hitsMax*100 )) && creep.ticksToLive >= 50){ // need to match spawn priority

                    if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.spawn && Game.rooms[rm].memory.intel.spawn[2]){
                        var spawn2 = Game.getObjectById( Game.rooms[rm].memory.intel.spawn[2].id )
                        if( spawn2 && spawn2.spawning == null){
                            var action = spawn2.renewCreep( creep )
                        }
                    }
                }
            }
            else if ( creep.getActiveBodyparts(MOVE) >= 1 ) {
                const stationary_pos = new RoomPosition(xx, yy, rm);
                creep.moveTo(stationary_pos, {range: 0, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            }
            else{
                creep.suicide()
                console.log('SOMETHING WRONG ON BALANCER', rm)
            }
        }
     
        // harvesting
        if(creep.memory.harvesting && ready == 1 ) {

            var amt_carry = creep.getActiveBodyparts( CARRY ) * 50
            var task = 0

            // FACTORY limit for comms 
            if( Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.factory ){
                // FACTORY
                if( task == 0 && Memory.oneTimer.factory == 1 && Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.factory && Game.rooms[rm].memory.intel.factory[0] && Game.rooms[rm].memory.intel.factory[0].id ){
                    var factory = Game.getObjectById( Game.rooms[rm].memory.intel.factory[0].id );
                }

                if( task == 0 && factory ){

                                        // product, min_factory, react1, needed1, react2, needed2
                    var reactions = [
                                        [ 'wire',               200,   'utrium_bar',20,    'silicon',  100,    'energy',    40,    'energy',    40,    'energy',    40,     8,     1  ],
                                        [ 'cell',               200,   'lemergium_bar',20, 'biomass',  100,    'energy',    40,    'energy',    40,    'energy',    40,     8,     1  ],
                                        [ 'alloy',              200,   'zynthium_bar',20,  'metal',    100,    'energy',    40,    'energy',    40,    'energy',    40,     8,     1  ],
                                        [ 'condensate',         200,   'keanium_bar',20,   'mist',     100,    'energy',    40,    'energy',    40,    'energy',    40,     8,     1  ],

                                        [ 'utrium_bar',         200,   'U',        500,    'energy',   200,    'energy',   200,    'energy',   200,    'energy',   200,    20,     1  ],
                                        [ 'lemergium_bar',      200,   'L',        500,    'energy',   200,    'energy',   200,    'energy',   200,    'energy',   200,    20,     1  ],
                                        [ 'zynthium_bar',       200,   'Z',        500,    'energy',   200,    'energy',   200,    'energy',   200,    'energy',   200,    20,     1  ],
                                        [ 'keanium_bar',        200,   'K',        500,    'energy',   200,    'energy',   200,    'energy',   200,    'energy',   200,    20,     1  ],
                                        [ 'ghodium_melt',       200,   'G',        500,    'energy',   200,    'energy',   200,    'energy',   200,    'energy',   200,    20,     1  ],
                                        [ 'oxidant',            200,   'O',        500,    'energy',   200,    'energy',   200,    'energy',   200,    'energy',   200,    20,     1  ],
                                        [ 'reductant',          200,   'H',        500,    'energy',   200,    'energy',   200,    'energy',   200,    'energy',   200,    20,     1  ],
                                        [ 'purifier',           200,   'X',        500,    'energy',   200,    'energy',   200,    'energy',   200,    'energy',   200,    20,     1  ],
                                        [ 'battery',            200,   'energy',   600,    'energy',   600,    'energy',   600,    'energy',   600,    'energy',   600,    10,     1  ]
                                    ]


                    if( factory.level == 1 ){

                        // alloy
                        reactions[2][1] = Math.max(reactions[2][1], 40 * Math.ceil( 1000/45 * 1 ))
                        // zynthium_bar
                        reactions[6][1] = Math.max(reactions[6][1], 16 * Math.ceil( 1000/45 * 1 ), 20 * Math.ceil( 1000/50 * 1 ))
                        //
                        // cell
                        reactions[1][1] = Math.max(reactions[1][1], 20 * Math.ceil( 1000/35 * 1 ))
                        // oxidant
                        reactions[9][1] = Math.max(reactions[9][1], 36 * Math.ceil( 1000/35 * 1 ), 95 * Math.ceil( 1000/70 * 1 ))
                        // lemergium_bar
                        reactions[5][1] = Math.max(reactions[5][1], 16 * Math.ceil( 1000/35 * 1 ))
                        //
                        // wire
                        reactions[0][1] = Math.max(reactions[0][1], 40 * Math.ceil( 1000/70 * 1 ))
                        // utrium_bar
                        reactions[4][1] = Math.max(reactions[4][1], 35 * Math.ceil( 1000/70 * 1 ), 20 * Math.ceil( 1000/50 * 1 ))
                        //
                        // condensate
                        reactions[3][1] = Math.max(reactions[3][1], 30 * Math.ceil( 1000/41 * 1 ))
                        // keanium_bar
                        reactions[7][1] = Math.max(reactions[7][1], 15 * Math.ceil( 1000/41 * 1 ))
                        // reductant
                        reactions[10][1] = Math.max(reactions[10][1], 54 * Math.ceil( 1000/41 * 1 ))
                        //

                        var reactions_lvl = [
                                    // level 1
                                    [ 'tube',                  1,   'alloy'      ,40,   'zynthium_bar',16,  'energy',       8 , 'energy',    8  , 'energy',    8,    45,     1000/45  ],
                                    [ 'phlegm',                1,   'cell'       ,20,   'oxidant'     ,36,  'lemergium_bar',16, 'energy',    8  , 'energy',    8,    35,     1000/35  ],
                                    [ 'switch',                1,   'wire'       ,40,   'oxidant'     ,95,  'utrium_bar'   ,35, 'energy',   20  , 'energy',   20,    70,     1000/70  ],
                                    [ 'concentrate',           1,   'condensate' ,30,   'keanium_bar' ,15,  'reductant',    54, 'energy',   12  , 'energy',   12,    41,     1000/41  ],
                                    [ 'composite',             1,   'utrium_bar' ,20,   'zynthium_bar',20,  'energy',       20, 'energy',   20  , 'energy',   20,    50,     1000/50  ]

                                ]
                        var reactions_lvl = _.shuffle(reactions_lvl)
                        var reactions = reactions_lvl.concat(reactions);
                    }
                    else if( factory.level == 2 ){

                        // alloy
                        reactions[2][1] = Math.max(reactions[2][1], 41 * Math.ceil( 1000/115 * 1 ))
                        // oxidant
                        reactions[9][1] = Math.max(reactions[9][1], 161 * Math.ceil( 1000/115 * 1 ), 60 * Math.ceil( 1000/128 * 1 ))
                        //
                        // cell
                        reactions[1][1] = Math.max(reactions[1][1], 10 * Math.ceil( 1000/164 * 1 ))
                        // reductant
                        reactions[10][1] = Math.max(reactions[10][1], 15 * Math.ceil( 1000/164 * 1 ), 85 * Math.ceil( 1000/59 * 1 ))
                        //
                        // wire
                        reactions[0][1] = Math.max(reactions[0][1], 15 * Math.ceil( 1000/59 * 1 ))
                        //
                        // condensate
                        reactions[3][1] = Math.max(reactions[3][1], 30 * Math.ceil( 1000/128 * 1 ))
                        //
                        // lemergium_bar
                        reactions[5][1] = Math.max(reactions[5][1], 6 * Math.ceil( 1000/21 * 1 ))
                        // keanium_bar
                        reactions[7][1] = Math.max(reactions[7][1], 6 * Math.ceil( 1000/21 * 1 ))
                        // purifier
                        reactions[11][1] = Math.max(reactions[11][1], 6 * Math.ceil( 1000/21 * 1 ))
                        //

                        var reactions_lvl = [
                                    // level 2
                                    [ 'fixtures',              1,   'composite'    ,20, 'alloy'      ,41,  'oxidant',     161, 'energy',    8  , 'energy',    8,    115,     1000/115  ], // oxidant
                                    [ 'tissue',                1,   'phlegm'       ,10, 'cell'       ,10,  'reductant',   110, 'energy',   16  , 'energy',   16,    164,     1000/164  ],
                                    [ 'transistor',            1,   'switch'       ,4,  'wire'       ,15,  'reductant'   , 85, 'energy',    8  , 'energy',    8,    59 ,     1000/59   ], // reductant
                                    [ 'extract',               1,   'concentrate'  ,10, 'condensate' ,30,  'oxidant',      60, 'energy',   16  , 'energy',   16,    128,     1000/128  ],
                                    [ 'crystal',               1,   'lemergium_bar',6,  'keanium_bar',6 ,  'purifier',     6 , 'energy',   45  , 'energy',   45,    21 ,     1000/21   ]

                                ]
                        var reactions_lvl = _.shuffle(reactions_lvl)
                        var reactions = reactions_lvl.concat(reactions);
                    }
                    else if( factory.level == 3 ){

                        // reductant
                        reactions[10][1] = Math.max(reactions[10][1], 330 * Math.ceil( 1000/125 * 1 ), 50 * Math.ceil( 1000/250 * 1 ), 90 * Math.ceil( 1000/200 * 1 ), 12 * Math.ceil( 1000/60 * 1 ))
                        // zynthium_bar
                        reactions[6][1] = Math.max(reactions[6][1], 31 * Math.ceil( 1000/125 * 1 ), 50 * Math.ceil( 1000/250 * 1 ))
                        //
                        // wire
                        reactions[0][1] = Math.max(reactions[0][1], 117 * Math.ceil( 1000/250 * 1 ))
                        // purifier
                        reactions[11][1] = Math.max(reactions[11][1], 25 * Math.ceil( 1000/250 * 1 ), 20 * Math.ceil( 1000/200 * 1 ))
                        //
                        // oxidant
                        reactions[9][1] = Math.max(reactions[9][1], 12 * Math.ceil( 1000/60 * 1 ))
                        // ghodium_melt
                        reactions[8][1] = Math.max(reactions[8][1], 12 * Math.ceil( 1000/60 * 1 ))
                        //

                        var reactions_lvl = [
                                    // level 3
                                    [ 'frame',                 1,   'fixtures'     ,2 ,'tube'        ,4 ,  'reductant',     330, 'zynthium_bar',31  , 'energy',   16,    125,     1000/125  ],
                                    [ 'muscle',                1,   'tissue'       ,3, 'phlegm'      ,3,   'zynthium_bar',   50, 'reductant',   50  , 'energy',   16,    250,     1000/250  ],
                                    [ 'microchip',             1,   'transistor'   ,2, 'composite'   ,50,  'wire'   ,       117, 'purifier',    25  , 'energy',   16,    250 ,    1000/250  ],
                                    [ 'spirit',                1,   'extract'      ,2, 'concentrate' ,6,   'reductant',      90, 'purifier',    20  , 'energy',   16,    200,     1000/200  ],
                                    [ 'liquid',                1,   'oxidant'      ,12,'reductant'   ,12 , 'ghodium_melt',   12, 'energy',      90  , 'energy',   90,    60 ,     1000/60   ]

                                ]
                        var reactions_lvl = _.shuffle(reactions_lvl)
                        var reactions = reactions_lvl.concat(reactions);
                    }
                    else if( factory.level == 4 ){

                        // purifier
                        reactions[11][1] = Math.max(reactions[11][1], 208 * Math.ceil( 1000/800 * 1 ))
                        // oxidant
                        reactions[9][1] = Math.max(reactions[9][1], 256 * Math.ceil( 1000/800 * 1 ))
                        // keanium_bar
                        reactions[7][1] = Math.max(reactions[7][1], 112 * Math.ceil( 1000/800 * 1 ))


                        var reactions_lvl = [
                                    // level 4
                                    [ 'hydraulics',            1,   'liquid'       ,150,'fixtures'   ,3 ,  'tube',           15, 'purifier'    ,208 , 'energy',   32,    800,     1000/800  ],
                                    [ 'organoid',              1,   'muscle'       ,1, 'tissue'      ,5,   'purifier',      208, 'oxidant',     256 , 'energy',   32,    800,     1000/800  ],
                                    [ 'circuit',               1,   'microchip'    ,1, 'transistor'  ,5,   'switch'   ,       4, 'oxidant',     115 , 'energy',   32,    800 ,    1000/800  ],
                                    [ 'emanation',             1,   'spirit'       ,2, 'extract'     ,2,   'concentrate',     3, 'keanium_bar', 112 , 'energy',   32,    800,     1000/800  ]

                                ]

                        var reactions_lvl = _.shuffle(reactions_lvl)
                        var reactions = reactions_lvl.concat(reactions);
                    }
                    else if( factory.level == 5 ){

                        // ghodium_melt
                        reactions[8][1] = Math.max(reactions[8][1], 150 * Math.ceil( 1000/600 * 1 ))
                        // cell
                        reactions[1][1] = Math.max(reactions[1][1], 310 * Math.ceil( 1000/600 * 1 ))


                        var reactions_lvl = [
                                    // level 5
                                    [ 'machine',               1,   'hydraulics'   ,1, 'frame'       ,2 ,  'fixture',         3, 'tube'   ,      12 , 'energy',   64,    600,     1000/600  ],
                                    [ 'organism',              1,   'organoid'     ,1, 'liquid'      ,150, 'tissue',          6, 'cell',        310 , 'energy',   64,    600,     1000/600  ],
                                    [ 'device',                1,   'circuit'      ,1, 'microchip'   ,3,   'crystal',       110, 'ghodium_melt',150 , 'energy',   64,    600 ,    1000/600  ],
                                    [ 'essence',               1,   'emanation'    ,1, 'spirit'      ,3,   'crystal',       110, 'ghodium_melt',150 , 'energy',   64,    600,     1000/600  ]

                                ]

                        var reactions_lvl = _.shuffle(reactions_lvl)
                        var reactions = reactions_lvl.concat(reactions);
                    }

                    for (var i = 0 ; i < reactions.length ; i++){

                        var multiplier = Math.ceil ( reactions[i][13] )

                        var product     = reactions[i][0]
                        var product_amt = reactions[i][1]
                        var react1      = reactions[i][2]
                        var react1_amt  = reactions[i][3] * multiplier
                        var react2      = reactions[i][4]
                        var react2_amt  = reactions[i][5] * multiplier
                        var react3      = reactions[i][6]
                        var react3_amt  = reactions[i][7] * multiplier
                        var react4      = reactions[i][8]
                        var react4_amt  = reactions[i][9] * multiplier
                        var react5      = reactions[i][10]
                        var react5_amt  = reactions[i][11] * multiplier

                        var buffer = Math.max(20, Game.gcl.level * 3)

                        // reaction
                        if( Game.rooms[rm].terminal && factory.store[product] < product_amt && Game.rooms[rm].terminal.store[product] > 0 ) {
                            var obj = Game.rooms[rm].terminal
                            var symb = product
                            break;
                        }
                        else if(   Game.rooms[rm].terminal &&
                                factory.store[product] <= product_amt &&
                              ( factory.store[product] + Game.rooms[rm].terminal.store[product] < product_amt + buffer ) ) {

                            if( factory.store[react1] < react1_amt && Game.rooms[rm].terminal.store[react1] > 0 ){
                                var obj = Game.rooms[rm].terminal
                                var symb = react1
                             //   creep.say(11)
                                break;
                            }
                            else if( factory.store[react2] < react2_amt && Game.rooms[rm].terminal.store[react2] > 0 ){
                                var obj = Game.rooms[rm].terminal
                                var symb = react2
                             //   creep.say(22)
                                break;
                            }
                            else if( factory.store[react3] < react3_amt && Game.rooms[rm].terminal.store[react3] > 0 ){
                                var obj = Game.rooms[rm].terminal
                                var symb = react3
                            //    creep.say(33)
                                break;
                            }
                            else if( factory.store[react4] < react4_amt && Game.rooms[rm].terminal.store[react4] > 0 ){
                                var obj = Game.rooms[rm].terminal
                                var symb = react4
                             //   creep.say(44)
                                break;
                            }
                            else if( factory.store[react5] < react5_amt && Game.rooms[rm].terminal.store[react5] > 0 ){
                                var obj = Game.rooms[rm].terminal
                                var symb = react5
                             //   creep.say(55)
                                break;
                            }
                            else if( factory.store[react1] >= react1_amt &&
                                     factory.store[react2] >= react2_amt &&
                                     factory.store[react3] >= react3_amt &&
                                     factory.store[react4] >= react4_amt &&
                                     factory.store[react5] >= react5_amt

                            ) {
                                // creep.say(66)
                                if( factory.cooldown == 0 &&
                                    ( i >= ( reactions.length - 12 ) || ( i < ( reactions.length - 12 ) && factory.effects && factory.effects.length != 0 ) ) ){

                                    var action = factory.produce(product)
                                    if( action == OK ){
                                        // creep.say(product)
                                        break;
                                    }
                                    else{
                                        creep.say('!!')
                                    }
                                }
                            }
                        }
                        else if( factory.store[product] > product_amt ) {
                            var obj = factory
                            var symb = product
                            var amt  = factory.store[product] - product_amt
                            if( amt > amt_carry ){ var amt  = amt_carry }
                            break;
                        }
                        //
                    }
                    //

                    // extra energy for the factory
                    if( !obj && factory.store['energy'] < 2500 && Game.rooms[rm].terminal && Game.rooms[rm].terminal.store['energy'] > 0 ){
                        var obj = Game.rooms[rm].terminal
                        var symb = 'energy'
                    }
                    //


                    // collect task
                    if( obj ) {
                        var action = creep.withdraw(obj, symb, amt)
                        if( action == OK ){
                            creep.say('fact')
                            creep.memory.task = 'factory'
                            var task = 1
                        }
                        else if (action == ERR_NOT_IN_RANGE) {
                              if ( creep.getActiveBodyparts(MOVE) >= 1 ) {
                                  creep.moveTo(obj, {range: 1, ignoreRoads: true, priority: -1 , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                              }
                        }
                    }
                    //
                }
                //


                // POWER SPAWN
                if( task == 0 && Memory.oneTimer.power_banks == 1 && Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.powerSpawn && Game.rooms[rm].memory.intel.powerSpawn[0] && Game.rooms[rm].memory.intel.powerSpawn[0].id ){
                    var ps = Game.getObjectById( Game.rooms[rm].memory.intel.powerSpawn[0].id );
                }

                if( task == 0 && ps ){
                    if( ps.store['power'] <= 5 && Game.rooms[rm].terminal && Game.rooms[rm].terminal.store['power'] >= 95 ){
                        var obj = Game.rooms[rm].terminal
                        var symb = 'power'
                        var amt  = 95
                    }
                    else if( ps.store['energy'] <= 4700 && Game.rooms[rm].terminal && Game.rooms[rm].terminal.store['energy'] >= 1000 ){
                        var obj = Game.rooms[rm].terminal
                        var symb = 'energy'
                        var amt  = 300
                    }
                    else if( ps.store['power'] <= 5 && Game.rooms[rm].storage && Game.rooms[rm].storage.store['power'] >= 95 ){
                        var obj = Game.rooms[rm].storage
                        var symb = 'power'
                        var amt  = 95
                    }
                    else if( ps.store['energy'] <= 4700 && Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] >= 1000 ){
                        var obj = Game.rooms[rm].storage
                        var symb = 'energy'
                        var amt  = 300
                    }

                    if( amt && amt > amt_carry ){ var amt  = amt_carry }

                    if( obj ) {
                        var action = creep.withdraw(obj, symb, amt)
                        if( action == OK ){
                            creep.say('power')
                            creep.memory.task = 'power'
                            var task = 1
                        }
                        else if(action == ERR_NOT_IN_RANGE) {
                            if ( creep.getActiveBodyparts(MOVE) >= 1 ) {
                                creep.moveTo(obj, {range: 1, ignoreRoads: true, priority: -1 , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }
                        }
                    }
                }
                //
            }
            //

            // BALANCER
            if( task == 0 ){

                creep.memory.task = 'balancer'
                //creep.say('bal')

                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link[1] ){
                    var link1 = Game.getObjectById( Game.rooms[rm].memory.intel.link[1].id )
                }

                // container on the main hub
                // if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[3] ){
                //     var cont3 = Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id )
                // }
                
                // collect from storage to fill spawn
                if(  Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.spawn && Game.rooms[rm].memory.intel.spawn[2] && Game.rooms[rm].memory.intel.spawn[2].id &&
                     Game.getObjectById(Game.rooms[rm].memory.intel.spawn[2].id) && Game.getObjectById(Game.rooms[rm].memory.intel.spawn[2].id).store['energy'] < 300 &&
                     Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > 1000 ){

                    creep.memory.task_id        = Game.rooms[rm].storage.id
                    creep.memory.task_resource  = 'energy'
                    creep.memory.task_operation = 'withdraw'

                }
                // collect from link
                else if( link1 && link1.store['energy'] > 0 && base_link_withdraw == 1 ){

                    creep.memory.task_id        = link1.id
                    creep.memory.task_resource  = 'energy'
                    creep.memory.task_operation = 'withdraw'
                }
                // // collect from storage to fill container
                // else if( cont3 && cont3.store.getUsedCapacity() <= 1800 && Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] > 5000 ){

                //     creep.memory.task_id        = Game.rooms[rm].storage.id
                //     creep.memory.task_resource  = 'energy'
                //     creep.memory.task_operation = 'withdraw'

                // }                
                // collect from terminal to fill storage
                else if( Game.rooms[rm].terminal && Game.rooms[rm].terminal.store['energy'] >= 5300 && Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] <= Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.balance_stg_term ){

                    creep.memory.task_id        = Game.rooms[rm].terminal.id
                    creep.memory.task_resource  = 'energy'
                    creep.memory.task_operation = 'withdraw'

                }
                // collect from storage to fill terminal
                else if( Game.rooms[rm].terminal && Game.rooms[rm].terminal.store['energy'] < 9700 && Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] >  Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.balance_stg_term && Game.rooms[rm].terminal.store.getFreeCapacity() >= 1000 ){

                    creep.memory.task_id        = Game.rooms[rm].storage.id
                    creep.memory.task_resource  = 'energy'
                    creep.memory.task_operation = 'withdraw'

                }
                // collect from storage to fill terminal
                else if( Game.rooms[rm].terminal && Game.rooms[rm].terminal.store['energy'] < 4700 && Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] >  10000 && Game.rooms[rm].terminal.store.getFreeCapacity() >= 1000 ){

                    creep.memory.task_id        = Game.rooms[rm].storage.id
                    creep.memory.task_resource  = 'energy'
                    creep.memory.task_operation = 'withdraw'

                }
                // collect from terminal to fill storage if terminal has surplus
                else if( Game.rooms[rm].terminal && Game.rooms[rm].terminal.store['energy'] > 10300 && Game.rooms[rm].storage ){

                    creep.memory.task_id        = Game.rooms[rm].terminal.id
                    creep.memory.task_resource  = 'energy'
                    creep.memory.task_operation = 'withdraw'

                }
                // check for minerals on the container - container on the main hub
                // else if( Game.time % 17 == 0 && Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[3] && Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id ) &&
                //     Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id ).store.getUsedCapacity() != Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id ).store['energy'] ){
                    
                //     var cont3 = Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id )

                //     var mineral_matrix = [      'power','ops',
                //                                 'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2',
                //                                 'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                //                                 'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',
                //                                 'OH','ZK','UL',
                //                                 'H','O','U','L','K','Z','X','G',
                //                                 'silicon','metal','biomass','mist',

                //                                 'utrium_bar','lemergium_bar','zynthium_bar','keanium_bar','ghodium_melt','oxidant','reductant','purifier','battery',
                //                                 'composite','crystal','liquid',

                //                                 'wire','switch','transistor','microchip','circuit','device',

                //                                 'cell','phlegm','tissue','muscle','organoid','organism',

                //                                 'alloy','tube','fixtures','frame','hydraulics','machine',

                //                                 'condensate','concentrate','extract','spirit','emanation','essence'
                //                                  ]

                //     for ( var j = 0 ; j < mineral_matrix.length ; j++){

                //         var res = mineral_matrix[j]

                //         // terminal to storage
                //         if( cont3 && cont3.store[ res ] > 0 ){

                //             creep.memory.task_id        = Game.rooms[rm].memory.intel.container[3].id
                //             creep.memory.task_resource  = res
                //             creep.memory.task_operation = 'withdraw'
                //             break;
                //         }
                //     }
                // }
                // MINERALS
                else {



                    var mineral_matrix = [
                                                'T',
                                                'silicon','metal','biomass','mist',

                                                'OH','ZK','UL',
                                                'H','O','U','L','K','Z','X','G',
                                                'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',
                                                'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                                                'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2',
                                                'power','ops',

                                                'utrium_bar','lemergium_bar','zynthium_bar','keanium_bar','ghodium_melt','oxidant','reductant','purifier','battery',
                                                'composite','crystal','liquid',

                                                'wire','switch','transistor','microchip','circuit','device',

                                                'cell','phlegm','tissue','muscle','organoid','organism',

                                                'alloy','tube','fixtures','frame','hydraulics','machine',

                                                'condensate','concentrate','extract','spirit','emanation','essence'
                                                 ]

                    for ( var j = 0 ; j < mineral_matrix.length ; j++){

                        var res = mineral_matrix[j]

                        if( res ==  Game.rooms[rm].memory.intel.minerals[0].mineralType  ){
                            var limit = 100000
                        }
                        else {
                            var limit = 10000
                        }

                        // terminal to storage
                        if( Game.rooms[rm].terminal && Game.rooms[rm].terminal.store[ res ] >= 4300 && Game.rooms[rm].storage && Game.rooms[rm].storage.store[ res ] <= limit ){

                            creep.memory.task_id        = Game.rooms[rm].terminal.id
                            creep.memory.task_resource  = res
                            creep.memory.task_operation = 'withdraw'
                            break;

                        }
                        // terminal overflow
                        else if( Game.rooms[rm].terminal && Game.rooms[rm].terminal.store[ res ] >= 4300 && Game.rooms[rm].terminal.store.getFreeCapacity() < 25000 ){

                            creep.memory.task_id        = Game.rooms[rm].terminal.id
                            creep.memory.task_resource  = res
                            creep.memory.task_operation = 'withdraw'
                            break;

                        }
                        // storage to terminal
                        else if( Game.rooms[rm].terminal && Game.rooms[rm].terminal.store[ res ] < 4000 && Game.rooms[rm].storage && Game.rooms[rm].storage.store[ res ] > 0 && Game.rooms[rm].terminal.store.getFreeCapacity() >= 15000 ){

                            creep.memory.task_id        = Game.rooms[rm].storage.id
                            creep.memory.task_resource  = res
                            creep.memory.task_operation = 'withdraw'
                            break;

                        }
                    }
                }

                // home resource terminal to storage

                // COLLECT
                if ( creep.memory.task_operation  == 'withdraw' ) {

                    var collect = Game.getObjectById( creep.memory.task_id )
                    var action = creep.withdraw( collect , creep.memory.task_resource )

                    if( action        == ERR_NOT_IN_RANGE) {
                        if ( creep.getActiveBodyparts(MOVE) >= 1 ) {
                            creep.moveTo(collect, {range: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                    }
                    else if ( action  == ERR_NOT_ENOUGH_RESOURCES || action  == ERR_INVALID_TARGET ) {
                        creep.memory.task_id        = null
                        creep.memory.task_resource  = null
                        creep.memory.task_operation = null
                    }
                }
            }
            //

        }
        else if ( ready == 1 ){

            // factory loop
            if( creep.memory.task == 'factory' && Game.rooms[rm].memory.intel.factory && Game.rooms[rm].memory.intel.factory[0] && Game.rooms[rm].memory.intel.factory[0].id ){
creep.say('fac2')
                var obj = Game.getObjectById( Game.rooms[rm].memory.intel.factory[0].id );

                if( obj ) {

                    var SYMBOLS= [
                                  ['energy',    'factory',          2500,       0],
                                  ['U',         'factory',           500,       0],
                                  ['L',         'factory',           500,       0],
                                  ['Z',         'factory',           500,       0],
                                  ['K',         'factory',           500,       0],
                                  ['G',         'factory',           500,       0],
                                  ['O',         'factory',           500,       0],
                                  ['H',         'factory',           500,       0],
                                  ['X',         'factory',           500,       0],
                                  ['silicon',   'factory',           500,       0],
                                  ['metal',     'factory',           500,       0],
                                  ['biomass',   'factory',           500,       0],
                                  ['mist',      'factory',           500,       0],

                                  ['utrium_bar',    'terminal',      200,       0],//13
                                  ['lemergium_bar', 'terminal',      200,       0],
                                  ['zynthium_bar',  'terminal',      200,       0],
                                  ['keanium_bar',   'terminal',      200,       0],
                                  ['ghodium_melt',  'terminal',      200,       0],
                                  ['oxidant',       'terminal',      200,       0],//18
                                  ['reductant',     'terminal',      200,       0],
                                  ['purifier',      'terminal',      200,       0],
                                  ['battery',       'terminal',      200,       0],

                                  ['wire',          'terminal',      200,       0], //22
                                  ['cell',          'terminal',      200,       0],
                                  ['alloy',         'terminal',      200,       0],
                                  ['condensate',    'terminal',      200,       0],

                                  ['composite',     'terminal',        1,       1],
                                  ['tube',          'terminal',        1,       1],
                                  ['phlegm',        'terminal',        1,       1],
                                  ['switch',        'terminal',        1,       1],
                                  ['concentrate',   'terminal',        1,       1],

                                  ['crystal',       'terminal',        1,       2],
                                  ['fixtures',      'terminal',        1,       2],
                                  ['tissue',        'terminal',        1,       2],
                                  ['transistor',    'terminal',        1,       2],
                                  ['extract',       'terminal',        1,       2],

                                  ['liquid',        'terminal',        1,       3],
                                  ['frame',         'terminal',        1,       3],
                                  ['muscle',        'terminal',        1,       3],
                                  ['microchip',     'terminal',        1,       3],
                                  ['spirit',        'terminal',        1,       3],

                                  ['hydraulics',    'terminal',        1,       4],
                                  ['organoid',      'terminal',        1,       4],
                                  ['circuit',       'terminal',        1,       4],
                                  ['emanation',     'terminal',        1,       4],

                                  ['machine',       'terminal',        1,       5],
                                  ['organism',      'terminal',        1,       5],
                                  ['device',        'terminal',        1,       5],
                                  ['essence',       'terminal',        1,       5]

                                 ]


                    if( obj.level == 1 ){
                        // alloy
                        SYMBOLS[24][2] = Math.max(SYMBOLS[24][2], 40 * Math.ceil( 1000/45 * 1 ))
                        // zynthium_bar
                        SYMBOLS[15][2] = Math.max(SYMBOLS[15][2], 16 * Math.ceil( 1000/45 * 1 ), 20 * Math.ceil( 1000/50 * 1 ))

                        // cell
                        SYMBOLS[23][2] = Math.max(SYMBOLS[23][2], 20 * Math.ceil( 1000/35 * 1 ))
                        // oxidant
                        SYMBOLS[18][2] = Math.max(SYMBOLS[18][2], 36 * Math.ceil( 1000/35 * 1 ), 95 * Math.ceil( 1000/70 * 1 ))
                        // lemergium_bar
                        SYMBOLS[14][2] = Math.max(SYMBOLS[14][2], 16 * Math.ceil( 1000/35 * 1 ))

                         // wire
                        SYMBOLS[22][2] = Math.max(SYMBOLS[22][2], 40 * Math.ceil( 1000/70 * 1 ))
                        // utrium_bar
                        SYMBOLS[13][2] = Math.max(SYMBOLS[13][2], 35 * Math.ceil( 1000/70 * 1 ), 20 * Math.ceil( 1000/50 * 1 ))

                        // condensate
                        SYMBOLS[25][2] = Math.max(SYMBOLS[25][2], 30 * Math.ceil( 1000/41 * 1 ))
                        // keanium_bar
                        SYMBOLS[16][2] = Math.max(SYMBOLS[16][2], 15 * Math.ceil( 1000/41 * 1 ))
                        // reductant
                        SYMBOLS[19][2] = Math.max(SYMBOLS[19][2], 54 * Math.ceil( 1000/41 * 1 ))
                        //
                    }
                    else if( obj.level == 2 ){
                        // alloy
                        SYMBOLS[24][2] = Math.max(SYMBOLS[24][2], 41 * Math.ceil( 1000/115 * 1 ))
                        // oxidant
                        SYMBOLS[18][2] = Math.max(SYMBOLS[18][2], 161 * Math.ceil( 1000/115 * 1 ), 60 * Math.ceil( 1000/128 * 1 ))
                        //
                        // cell
                        SYMBOLS[23][2] = Math.max(SYMBOLS[23][2], 10 * Math.ceil( 1000/164 * 1 ))
                        // reductant
                        SYMBOLS[19][2] = Math.max(SYMBOLS[19][2], 110 * Math.ceil( 1000/164 * 1 ), 85 * Math.ceil( 1000/59 * 1 ))
                        //
                        // wire
                        SYMBOLS[22][2] = Math.max(SYMBOLS[22][2], 15 * Math.ceil( 1000/59 * 1 ))
                        //
                        // condensate
                        SYMBOLS[25][2] = Math.max(SYMBOLS[25][2], 30 * Math.ceil( 1000/128 * 1 ))
                        //
                        // lemergium_bar
                        SYMBOLS[14][2] = Math.max(SYMBOLS[14][2], 6 * Math.ceil( 1000/21 * 1 ))
                        // keanium_bar
                        SYMBOLS[16][2] = Math.max(SYMBOLS[16][2], 6 * Math.ceil( 1000/21 * 1 ))
                        // purifier
                        SYMBOLS[20][2] = Math.max(SYMBOLS[20][2], 6 * Math.ceil( 1000/21 * 1 ))
                        //
                    }
                    else if( obj.level == 3 ){
                        // reductant
                        SYMBOLS[19][2] = Math.max(SYMBOLS[19][2], 330 * Math.ceil( 1000/125 * 1 ), 50 * Math.ceil( 1000/250 * 1 ), 90 * Math.ceil( 1000/200 * 1 ), 12 * Math.ceil( 1000/60 * 1 ))
                        // zynthium_bar
                        SYMBOLS[15][2] = Math.max(SYMBOLS[15][2], 31 * Math.ceil( 1000/125 * 1 ), 50 * Math.ceil( 1000/250 * 1 ))
                        //
                        // wire
                        SYMBOLS[22][2] = Math.max(SYMBOLS[22][2], 117 * Math.ceil( 1000/250 * 1 ))
                        // purifier
                        SYMBOLS[20][2] = Math.max(SYMBOLS[20][2], 25 * Math.ceil( 1000/250 * 1 ), 20 * Math.ceil( 1000/200 * 1 ))
                        //
                        // oxidant
                        SYMBOLS[18][2] = Math.max(SYMBOLS[18][2], 12 * Math.ceil( 1000/60 * 1 ))
                        // ghodium_melt
                        SYMBOLS[17][2] = Math.max(SYMBOLS[17][2], 12 * Math.ceil( 1000/60 * 1 ))
                        //
                    }
                    else if( obj.level == 4 ){
                        // purifier
                        SYMBOLS[20][2] = Math.max(SYMBOLS[20][2], 208 * Math.ceil( 1000/800 * 1 ))
                        // oxidant
                        SYMBOLS[18][2] = Math.max(SYMBOLS[18][2], 256 * Math.ceil( 1000/800 * 1 ))
                        // keanium_bar
                        SYMBOLS[16][2] = Math.max(SYMBOLS[16][2], 112 * Math.ceil( 1000/800 * 1 ))
                        //
                    }
                    else if( obj.level == 5 ){
                        // cell
                        SYMBOLS[23][2] = Math.max(SYMBOLS[23][2], 310 * Math.ceil( 1000/600 * 1 ))
                        // ghodium_melt
                        SYMBOLS[17][2] = Math.max(SYMBOLS[17][2], 150 * Math.ceil( 1000/600 * 1 ))
                        //
                    }



                    for (var i = 0 ; i < SYMBOLS.length ; i++){
                        symb = SYMBOLS[i][0]
                        if( creep.store[ symb] > 0 ){
                            break;
                        }
                    }


                    if( SYMBOLS[i][1] == 'terminal' &&
                       ( obj.store[symb] >= SYMBOLS[i][2] && obj.level == SYMBOLS[i][3] ) ||
                       ( obj.store[symb] >= SYMBOLS[i][2] && SYMBOLS[i][3] == 0 )
                       ){
                        var obj = Game.rooms[rm].terminal
                    }

                    var action = creep.transfer(obj, symb)

                    if( action == OK ){
                        creep.memory.task = 'free'
                    }
                    else if(action == ERR_NOT_IN_RANGE) {
                          if ( creep.getActiveBodyparts(MOVE) >= 1 ) {
                              creep.moveTo(obj, {range: 1, ignoreRoads: true, priority: -1 , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                          }
                    }
                }
            }
            //
            // power spawn loop
            else if( creep.memory.task == 'power' && Game.rooms[rm].memory.intel.powerSpawn && Game.rooms[rm].memory.intel.powerSpawn[0] && Game.rooms[rm].memory.intel.powerSpawn[0].id ){
creep.say('pwr2')
                var obj = Game.getObjectById( Game.rooms[rm].memory.intel.powerSpawn[0].id );

                if( obj ) {

                    var SYMBOLS= [
                                  'power',
                                  'energy'
                                 ]

                    for (var i = 0 ; i < SYMBOLS.length ; i++){
                        symb = SYMBOLS[i]
                        if( creep.store[ symb] > 0 ){
                            break;
                        }
                    }

                    var action = creep.transfer(obj, symb)

                    if( action == OK ){
                        creep.memory.task = 'free'
                    }
                    else if(action == ERR_NOT_IN_RANGE) {
                          if ( creep.getActiveBodyparts(MOVE) >= 1 ) {
                              creep.moveTo(obj, {range: 1, ignoreRoads: true, priority: -1 , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                          }
                    }
                }
            }
            //
            // balancer
            else if( creep.memory.task == 'balancer' ){
creep.say('bal2')
                // container on the main hub
                // if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[3] ){
                //     var cont3 = Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id )
                // }

                // drop
                if ( creep.store.getUsedCapacity() > 0 && creep.store['energy'] == 0 ){

                    var mineral_matrix = [      
                                            'T',
                                            'power','ops',
                                            'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2',
                                            'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                                            'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',
                                            'OH','ZK','UL',
                                            'H','O','U','L','K','Z','X','G',
                                            'silicon','metal','biomass','mist',

                                            'utrium_bar','lemergium_bar','zynthium_bar','keanium_bar','ghodium_melt','oxidant','reductant','purifier','battery',
                                            'composite','crystal','liquid',

                                            'wire','switch','transistor','microchip','circuit','device',

                                            'cell','phlegm','tissue','muscle','organoid','organism',

                                            'alloy','tube','fixtures','frame','hydraulics','machine',

                                            'condensate','concentrate','extract','spirit','emanation','essence'
                                             ]

                    for ( var j = 0 ; j < mineral_matrix.length ; j++){
                        if ( creep.store[mineral_matrix[j]] > 0 ){
                            var res = mineral_matrix[j]
                            break;
                        }
                    }

                    if ( Game.rooms[rm].terminal.store[ res ] < 4000 ){
creep.say('min tr')
                        creep.memory.task_id        = Game.rooms[rm].terminal.id
                        creep.memory.task_resource  = res
                        creep.memory.task_operation = 'transfer'
                    }
                    else if( Game.rooms[rm].terminal.store[ res ] >= 4000 && Game.rooms[rm].terminal.store.getFreeCapacity() < 25000 + 300 ){
creep.say('min grd')
                        creep.memory.task_id        = 'ground'
                        creep.memory.task_resource  = res
                        creep.memory.task_operation = 'drop'
                    }
                    else {
creep.say('min st')
                        creep.memory.task_id        = Game.rooms[rm].storage.id
                        creep.memory.task_resource  = res
                        creep.memory.task_operation = 'transfer'
                    }
                }
                // else if ( cont3 && cont3.store.getUsedCapacity() <= 1800 ) {

                //     creep.memory.task_id        = cont3.id
                //     creep.memory.task_resource  = 'energy'
                //     creep.memory.task_operation = 'transfer'
                // }
                else if (
                    Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.spawn && Game.rooms[rm].memory.intel.spawn[2] && Game.rooms[rm].memory.intel.spawn[2].id &&
                    Game.getObjectById( Game.rooms[rm].memory.intel.spawn[2].id ) && Game.getObjectById( Game.rooms[rm].memory.intel.spawn[2].id ).store.getFreeCapacity(RESOURCE_ENERGY) > 0 ) {
creep.say('sp3')
                    creep.memory.task_id        = Game.rooms[rm].memory.intel.spawn[2].id
                    creep.memory.task_resource  = 'energy'
                    creep.memory.task_operation = 'transfer'
                }
                else if ( Game.rooms[rm].terminal && Game.rooms[rm].terminal.store['energy'] < 10000 && Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] >=  Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.balance_stg_term && Game.rooms[rm].terminal.store.getFreeCapacity() >= 300  ) {
creep.say('tr')
                    creep.memory.task_id        = Game.rooms[rm].terminal.id
                    creep.memory.task_resource  = 'energy'
                    creep.memory.task_operation = 'transfer'
                }
                else if ( Game.rooms[rm].terminal && Game.rooms[rm].terminal.store['energy'] < 5000 && Game.rooms[rm].storage && Game.rooms[rm].storage.store['energy'] >=  10000 && Game.rooms[rm].terminal.store.getFreeCapacity() >= 300 ) {
creep.say('tr')
                    creep.memory.task_id        = Game.rooms[rm].terminal.id
                    creep.memory.task_resource  = 'energy'
                    creep.memory.task_operation = 'transfer'
                }
//                 else if (
//                           Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.spawn && Game.rooms[rm].memory.intel.spawn[0] && Game.rooms[rm].memory.intel.spawn[0].id &&
//                           Game.getObjectById( Game.rooms[rm].memory.intel.spawn[0].id ) && Game.getObjectById( Game.rooms[rm].memory.intel.spawn[0].id ).store.getFreeCapacity(RESOURCE_ENERGY) > 0 ) {
// creep.say('sp1')
//                     creep.memory.task_id        = Game.rooms[rm].memory.intel.spawn[0].id
//                     creep.memory.task_resource  = 'energy'
//                     creep.memory.task_operation = 'transfer'
//                 }
//                 else if (
//                           Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.spawn && Game.rooms[rm].memory.intel.spawn[1] && Game.rooms[rm].memory.intel.spawn[1].id &&
//                           Game.getObjectById( Game.rooms[rm].memory.intel.spawn[1].id ) && Game.getObjectById( Game.rooms[rm].memory.intel.spawn[1].id ).store.getFreeCapacity(RESOURCE_ENERGY) > 0 ) {
// creep.say('sp2')
//                     creep.memory.task_id        = Game.rooms[rm].memory.intel.spawn[1].id
//                     creep.memory.task_resource  = 'energy'
//                     creep.memory.task_operation = 'transfer'
//                 }                
                else if ( Game.rooms[rm].storage && Game.rooms[rm].storage.store.getFreeCapacity() >= 300 ) {
creep.say('st')
                    creep.memory.task_id        = Game.rooms[rm].storage.id
                    creep.memory.task_resource  = 'energy'
                    creep.memory.task_operation = 'transfer'
                }


                // DROP
                // transfer
                if ( creep.memory.task_operation  == 'transfer' ) {
                    var drop = Game.getObjectById( creep.memory.task_id )
                    var action = creep.transfer( drop , creep.memory.task_resource )

                    if( drop && action == ERR_NOT_IN_RANGE) {
                        if ( creep.getActiveBodyparts(MOVE) >= 1 ) {
                            creep.moveTo(drop, {range: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                    }
                    else if ( action     == OK || action     == ERR_FULL || action == ERR_INVALID_TARGET || !drop) {
                        creep.memory.task_id        = null
                        creep.memory.task_resource  = null
                        creep.memory.task_operation = null
                        if( action == OK ){
                            creep.memory.task = 'free'
                        }
                    }
                }
                else if ( creep.memory.task_operation  == 'drop' ) {

                    var action = creep.drop( creep.memory.task_resource )

                    if ( action     == OK || action     == ERR_NOT_ENOUGH_RESOURCES || action == ERR_INVALID_ARGS ) {
                        creep.memory.task_id        = null
                        creep.memory.task_resource  = null
                        creep.memory.task_operation = null
                        if( action == OK ){
                            creep.memory.task = 'free'
                        }
                    }
                }
            }
            //
            //

            // fallback
            // if( creep.store.getUsedCapacity() > 0 && !done ){
            else if( creep.memory.task == 'free'  ){

                creep.say('fallback')

                var mineral_matrix = [      'T',
                                            'energy','power','ops',
                                            'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2',
                                            'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                                            'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',
                                            'OH','ZK','UL',
                                            'H','O','U','L','K','Z','X','G',
                                            'silicon','metal','biomass','mist',

                                            'utrium_bar','lemergium_bar','zynthium_bar','keanium_bar','ghodium_melt','oxidant','reductant','purifier','battery',
                                            'composite','crystal','liquid',

                                            'wire','switch','transistor','microchip','circuit','device',

                                            'cell','phlegm','tissue','muscle','organoid','organism',

                                            'alloy','tube','fixtures','frame','hydraulics','machine',

                                            'condensate','concentrate','extract','spirit','emanation','essence'
                                             ]

                for ( var j = 0 ; j < mineral_matrix.length ; j++){

                    var res = mineral_matrix[j]

                    if( creep.store[ res ] > 0 ){

                        if( Game.rooms[rm].terminal ){
                            var action = creep.transfer(Game.rooms[rm].terminal, res)
                        }
                        else{
                            var action = creep.transfer(Game.rooms[rm].storage, res)
                        }

                        if( action == OK ){
                            //ok
                            creep.memory.task = 'free'
                        }
                        else{
                            creep.say('!!!')
                        }
                        break;
                    }
                }
            }
            //

        }


        // drop on container if it is last tick of live
        if( creep.ticksToLive == 1 ){
            if( Game.rooms[rm].storage ){
                creep.transfer( Game.rooms[rm].storage, 'energy')
            }
        }
        //

    }
};

module.exports = roleBaseBalancer;
