const Pathing = require('pathing');

var rolePowerCreep = {

    run: function(pc) {

        var job = 0

        // OPS
        if( pc.powers[PWR_GENERATE_OPS] && !(pc.powers[PWR_GENERATE_OPS].cooldown > 0) && pc.store.getFreeCapacity() > 0 && Game.rooms[pc.pos.roomName].storage && Game.rooms[pc.pos.roomName].storage.store['ops'] < 10000 ){

            pc.say('ops')

            var action = pc.usePower(PWR_GENERATE_OPS);

            if( action == ERR_INVALID_ARGS ){
                var job = 1

                var action = pc.enableRoom( pc.room.controller )

                if( action == ERR_NOT_IN_RANGE ){
                    pc.moveTo(pc.room.controller.pos, {maxRooms: 1, maxOps: 1000, range: 1, plainCost: 1, swampCost: 1, priority: -1 , visualizePathStyle: {stroke: '#fc0303', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
            }
        }
        //

        // renew
        if( job == 0 && pc.ticksToLive < 250  ){

            var job = 1
            pc.say('renew')

            if( !pc.memory.power_spawn || !pc.memory.power_spawn[0] ){
                var obj = pc.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_POWER_SPAWN  ) } } )
                if( obj.id ){
                    pc.memory.power_spawn       = []
                    pc.memory.power_spawn[0]    = {}
                    pc.memory.power_spawn[0].id = obj.id
                }
            }
            else{
                var obj = Game.getObjectById( pc.memory.power_spawn[0].id )
            }

            if( obj ) {
                var action = pc.renew(obj)

                if( action == ERR_NOT_IN_RANGE ){
                    pc.moveTo(obj.pos, {maxRooms: 1, maxOps: 1000, range: 1, plainCost: 1, swampCost: 1, priority: 999999 , visualizePathStyle: {stroke: '#fc0303', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
            }
            else{
                pc.memory.power_spawn.splice(i,1)
            }
        }
        //


        // COLLECT OPS
        if( job == 0 && pc.store.getUsedCapacity() < 200 && Game.rooms[pc.pos.roomName].terminal && Game.rooms[pc.pos.roomName].terminal.store['ops'] > 0 ){

            var job = 1
            pc.say('collect ops')

            var amt = Game.rooms[pc.pos.roomName].terminal.store['ops']
            if( amt > 100 ){ var amt = 100 }

            var action = pc.withdraw(Game.rooms[pc.pos.roomName].terminal,'ops',amt)

            if( action == ERR_NOT_IN_RANGE ){
                pc.moveTo(Game.rooms[pc.pos.roomName].terminal.pos, {maxRooms: 1, maxOps: 1000, range: 1, plainCost: 1, swampCost: 1, priority: -1 , visualizePathStyle: {stroke: '#fc0303', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            }
        }
        //


        // SOURCE
        if( job == 0 && pc.powers[PWR_REGEN_SOURCE] && !(pc.powers[PWR_REGEN_SOURCE].cooldown > 0) ) {

            pc.say('source')

            for ( var i = 0 ; i < Game.rooms[pc.pos.roomName].memory.intel.sources.length ; i++){

                var obj = Game.getObjectById( Game.rooms[pc.pos.roomName].memory.intel.sources[i].id )
                var effected = 0

                if( obj && obj.effects ){
                    for (var j = 0 ; j < obj.effects.length ; j++){

                        if( obj.effects[j].effect == 13 ){

                            if( obj.effects[j].ticksRemaining <= 35 ){
                                // as not affected
                            }
                            else{
                                var effected = 1
                                break
                            }
                        }
                    }
                }

                if( effected == 0 ){ break; }
            }

            if( effected == 0 && obj ){

                var job = 1
                var action = pc.usePower(PWR_REGEN_SOURCE, obj);

                if( action == ERR_NOT_IN_RANGE ){
                    pc.moveTo(obj.pos, {maxRooms: 1, maxOps: 1000, range: 3, plainCost: 1, swampCost: 1, priority: -1 , visualizePathStyle: {stroke: '#fc0303', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
            }
        }
        //


        // factory
        if( job == 0 && Memory.one_timer.factory == 1 && pc.powers[PWR_OPERATE_FACTORY] && !(pc.powers[PWR_OPERATE_FACTORY].cooldown > 0) && pc.store.getUsedCapacity() > 100  && 1 == 1) {

            if( !pc.memory.factory_id || pc.memory.factory_id == null ){

                var obj = Game.rooms[ pc.pos.roomName ].find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_FACTORY }})

                if( obj && obj[0] ){
                    pc.memory.factory_id  = obj[0].id
                }
            }
            else{

                var factory = Game.getObjectById( pc.memory.factory_id )

                if( factory && factory.level && factory.level > 0 && factory.effects && factory.effects.length == 0 ){

                    pc.say('factory')

                    if( factory.level == 1 ){
                        var reactions = [
                                    // level 1
                                    [ 'composite',           1,   'utrium_bar' ,20,   'zynthium_bar',20,  'energy',       20, 'energy',   20  , 'energy',   20,    50  ],  //400
                                    [ 'tube',                1,   'alloy'      ,40,   'zynthium_bar',16,  'energy',       8 , 'energy',    8  , 'energy',    8,    45  ],  //900
                                    [ 'phlegm',              1,   'cell'       ,20,   'oxidant'     ,36,  'lemergium_bar',16, 'energy',    8  , 'energy',    8,    35  ],  //1030
                                    [ 'switch',              1,   'wire'       ,40,   'oxidant'     ,95,  'utrium_bar'   ,35, 'energy',   20  , 'energy',   20,    70  ],  //1360
                                    [ 'concentrate',         1,   'condensate' ,30,   'keanium_bar' ,15,  'reductant',    54, 'energy',   12  , 'energy',   12,    41  ]   //1320

                                ]
                    }
                    else if( factory.level == 2 ){
                        var reactions = [
                                    // level 2
                                    [ 'crystal',             1,   'lemergium_bar',6,  'keanium_bar',6 ,  'purifier',     6 , 'energy',   45  , 'energy',   45,    21   ],  // 2150
                                    [ 'fixtures',            1,   'composite'    ,20, 'alloy'      ,41,  'oxidant',     161, 'energy',    8  , 'energy',    8,    115  ],  // 1400
                                    [ 'tissue',              1,   'phlegm'       ,10, 'cell'       ,10,  'reductant',   110, 'energy',   16  , 'energy',   16,    164  ],  // 670
                                    [ 'transistor',          1,   'switch'       ,4,  'wire'       ,15,  'reductant'   , 85, 'energy',    8  , 'energy',    8,    59   ],  // 1440
                                    [ 'extract',             1,   'concentrate'  ,10, 'condensate' ,30,  'oxidant',      60, 'energy',   16  , 'energy',   16,    128  ]   // 470

                                ]
                    }
                    else if( factory.level == 3 ){
                        var reactions = [
                                    // level 3
                                    [ 'frame',               1,   'fixtures'     ,2 ,'tube'        ,4 ,  'reductant',     330, 'zynthium_bar',31  , 'energy',   16,    125,     1000/125  ],
                                    [ 'muscle',              1,   'tissue'       ,3, 'phlegm'      ,3,   'zynthium_bar',   50, 'reductant',   50  , 'energy',   16,    250,     1000/250  ],
                                    [ 'microchip',           1,   'transistor'   ,2, 'composite'   ,50,  'wire'   ,       117, 'purifier',    25  , 'energy',   16,    250 ,    1000/250  ],
                                    [ 'spirit',              1,   'extract'      ,2, 'concentrate' ,6,   'reductant',      90, 'purifier',    20  , 'energy',   16,    200,     1000/200  ],
                                    [ 'liquid',              1,   'oxidant'      ,12,'reductant'   ,12 , 'ghodium_melt',   12, 'energy',      90  , 'energy',   90,    60 ,     1000/60   ]

                                ]
                    }
                    else if( factory.level == 4 ){
                        var reactions = [
                                    // level 4
                                    [ 'hydraulics',            1,   'liquid'       ,150,'fixtures'   ,3 ,  'tube',           15, 'purifier'    ,208 , 'energy',   32,    800,     1000/800  ],
                                    [ 'organoid',              1,   'muscle'       ,1, 'tissue'      ,5,   'purifier',      208, 'oxidant',     256 , 'energy',   32,    800,     1000/800  ],
                                    [ 'circuit',               1,   'microchip'    ,1, 'transistor'  ,5,   'switch'   ,       4, 'oxidant',     115 , 'energy',   32,    800 ,    1000/800  ],
                                    [ 'emanation',             1,   'spirit'       ,2, 'extract'     ,2,   'concentrate',     3, 'keanium_bar', 112 , 'energy',   32,    800,     1000/800  ]

                                ]
                    }
                    else if( factory.level == 5 ){
                        var reactions = [
                                    // level 5
                                    [ 'machine',               1,   'hydraulics'   ,1, 'frame'       ,2 ,  'fixture',         3, 'tube'   ,      12 , 'energy',   64,    600,     1000/600  ],
                                    [ 'organism',              1,   'organoid'     ,1, 'liquid'      ,150, 'tissue',          6, 'cell',        310 , 'energy',   64,    600,     1000/600  ],
                                    [ 'device',                1,   'circuit'      ,1, 'microchip'   ,3,   'crystal',       110, 'ghodium_melt',150 , 'energy',   64,    600 ,    1000/600  ],
                                    [ 'essence',               1,   'emanation'    ,1, 'spirit'      ,3,   'crystal',       110, 'ghodium_melt',150 , 'energy',   64,    600,     1000/600  ]

                                ]
                    }
                    else{
                        var reactions = []
                    }


                    for (var i = 0 ; i < reactions.length ; i++){

                        var product     = reactions[i][0]
                        var product_amt = reactions[i][1]

                        var buffer = Math.max(20, Game.gcl.level * 3)

                        // reaction
                        if( ( factory.store[product] + Game.rooms[ pc.pos.roomName ].terminal.store[product] ) < ( product_amt + buffer ) ){

                            var multiplier =  Math.ceil ( 1000 / reactions[i][12] * 1 )

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
 pc.say('factory2')
                            if( ( factory.store[react1] + Game.rooms[ pc.pos.roomName ].terminal.store[react1] ) >= react1_amt &&
                                ( factory.store[react2] + Game.rooms[ pc.pos.roomName ].terminal.store[react2] ) >= react2_amt &&
                                ( factory.store[react3] + Game.rooms[ pc.pos.roomName ].terminal.store[react3] ) >= react3_amt &&
                                ( factory.store[react4] + Game.rooms[ pc.pos.roomName ].terminal.store[react4] ) >= react4_amt &&
                                ( factory.store[react5] + Game.rooms[ pc.pos.roomName ].terminal.store[react5] ) >= react5_amt ){
 pc.say('factory3')
                                var job = 1
                                var action = pc.usePower(PWR_OPERATE_FACTORY, factory);

                                if( action == ERR_NOT_IN_RANGE ){
                                    pc.moveTo(factory.pos, {maxRooms: 1, maxOps: 1000, range: 3, plainCost: 1, swampCost: 1, priority: -1 , visualizePathStyle: {stroke: '#fc0303', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                            }
                        }
                    }
                }
                else if( factory && !factory.level ){
                    
                    pc.moveTo(factory)
                    pc.usePower(PWR_OPERATE_FACTORY, factory)
                
                    
                }
                else{
                    // erase from memory
                    pc.memory.factory_id = null
                }
            }
        }
        //





        // LAB
        if( job == 0 && pc.powers[PWR_OPERATE_LAB] && !(pc.powers[PWR_OPERATE_LAB].cooldown > 0) && pc.store.getUsedCapacity() > 200  && 
            Game.rooms[pc.pos.roomName].memory.intel && Game.rooms[pc.pos.roomName].memory.intel.lab && 1 == 1) {

            pc.say('lab')

            for (var i = 0 ; i < Game.rooms[pc.pos.roomName].memory.intel.lab.length ; i++){

                if( Game.rooms[pc.pos.roomName].memory.intel.lab[i].sts == 2 ){

                    var obj = Game.getObjectById( Game.rooms[pc.pos.roomName].memory.intel.lab[i].id )
                    var effected = 0

                    if( obj && obj.effects ){
                        for (var j = 0 ; j < obj.effects.length ; j++){

                            if( obj.effects[j].effect == 5 ){

                                var effected = 1
                                break
                            }
                        }
                    }

                    if( effected == 0 ){ break; }
                }
            }

            if( effected == 0 && obj ){
                var job = 1
                var action = pc.usePower(PWR_OPERATE_LAB, obj);

                if( action == ERR_NOT_IN_RANGE ){
                    pc.moveTo(obj.pos, {maxRooms: 1, maxOps: 1000, range: 3, plainCost: 1, swampCost: 1, priority: -1 , visualizePathStyle: {stroke: '#fc0303', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
            }
        }



        // DROP OPS
        if( job == 0 && pc.store.getUsedCapacity() > 251 && Game.rooms[pc.pos.roomName].storage ){

            var job = 1
            pc.say('drop ops')

            var action = pc.transfer(Game.rooms[pc.pos.roomName].storage,'ops',50)

            if( action == ERR_NOT_IN_RANGE ){
                pc.moveTo(Game.rooms[pc.pos.roomName].storage.pos, {maxRooms: 1, maxOps: 1000, range: 1, plainCost: 1, swampCost: 1, priority: -1 , visualizePathStyle: {stroke: '#fc0303', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            }
        }


        // move blue flag
        if( job == 0 ){

            if( !pc.memory.blue_xx || !pc.memory.blue_yy ){
                for ( f1 in Game.flags ) {

                    if ( Game.flags[f1].pos.roomName == pc.pos.roomName && Game.flags[f1].color == 3 && Game.flags[f1].secondaryColor == 3 ) {

                        pc.memory.blue_xx = Game.flags[f1].pos.x
                        pc.memory.blue_yy = Game.flags[f1].pos.y
                    }
                }
            }
            else{

                var xx = pc.memory.blue_xx
                var yy = pc.memory.blue_yy

                pc.moveTo(new RoomPosition(xx,yy,pc.pos.roomName), {range: 0, plainCost: 1, swampCost: 1, priority: -2 , visualizePathStyle: {stroke: '#fc0303', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            }
        }
    }
};

module.exports = rolePowerCreep;
