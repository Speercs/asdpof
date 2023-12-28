var functionBoostWork = {

    run: function(creep, rm, boost_type , prior , colour) {

       // boost WORK - always on lab 2
        if( !creep.memory.boosted ){

            if( !global.creeps[ creep.name ] ){
                global.creeps[ creep.name ] = {}
            }

            if( !global.creeps[ creep.name ].wait_boost ){
                global.creeps[ creep.name ].wait_boost = 0
            }

            // checa se lab2 existe
            if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.lab && Game.rooms[rm].memory.intel.lab[2] && 
                Game.rooms[rm].memory.intel.lab[2].id && Game.getObjectById( Game.rooms[rm].memory.intel.lab[2].id ) ){
                    
                // chekc if lab is active
                if( creep.ticksToLive % 55 == 0 && Game.getObjectById( Game.rooms[rm].memory.intel.lab[2].id ).isActive() == false ){
                    creep.memory.boosted = 1
                }

                var lab = Game.getObjectById( Game.rooms[rm].memory.intel.lab[2].id )
                var boost = boost_type
creep.say(1)
                // checa se o lab2 já está setado corretamente
                if( Game.rooms[rm].memory.intel.lab[2].min == boost && Game.rooms[rm].memory.intel.lab[2].sts == 3 ){

                    // checa se o lab2 está pronto para dar o boost
                    if( ( lab.store[boost] >= 30 * creep.getActiveBodyparts( WORK ) ) ||
                        // ( Game.rooms[rm].terminal && Game.rooms[rm].terminal.store[boost] + lab.store[ boost] >= 30 * creep.getActiveBodyparts( WORK ) ) ||
                        ( lab.store[boost] >=  90 && Game.rooms[rm].terminal.store[boost] < 30 ) ){

                        var action = lab.boostCreep(creep)
                  
                        if( action == OK ){
                            creep.memory.boosted = 1
                            Memory.oneTimer.lab = 1
                        }
                        else if( action == ERR_NOT_IN_RANGE ){
                            creep.moveTo(lab, {range: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                    }
                    else if( lab.store[boost] + Game.rooms[rm].terminal.store[boost] + creep.store[boost] < 90 ){
                        creep.memory.boosted = 1
                        Memory.oneTimer.lab = 1
                    }
                    else if( global.creeps[ creep.name ].wait_boost >= 50 ){
                        var action = lab.boostCreep(creep)
                        creep.memory.boosted = 1
                        Memory.oneTimer.lab = 1
                    }

                    global.creeps[ creep.name ].wait_boost = global.creeps[ creep.name ].wait_boost + 1
                    creep.moveTo(lab, {range: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
                // está com outro boost no lab2 e tem recurso
                else if( Game.rooms[rm].terminal && ( Game.rooms[rm].terminal.store[boost] + lab.store[ boost] >= 90 ) ){
 creep.say(2)            
                    if( !global.creeps[ creep.name ].wait_boost ){
                        global.creeps[ creep.name ].wait_boost = 0
                    }
                    
                    if( Game.rooms[rm].memory.intel.lab[2].min != boost && Game.rooms[rm].memory.intel.lab[2].sts != 3 ){
                        Game.rooms[rm].memory.intel.lab[2].min = boost 
                        Game.rooms[rm].memory.intel.lab[2].sts = 3                          
                    }                    
                    else{
                        if( global.creeps[ creep.name ].wait_boost >= 25 ){
                            var action = lab.boostCreep(creep)
                            creep.memory.boosted = 1
                            Memory.oneTimer.lab = 1
                        }
                        global.creeps[ creep.name ].wait_boost = global.creeps[ creep.name ].wait_boost + 1
                        creep.moveTo(lab, {range: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }   
                }
                else{
                    creep.memory.boosted = 1
                    Memory.oneTimer.lab = 1
                }
            }
            else{
                creep.memory.boosted = 1
            }
        }
        //
    }
}

module.exports = functionBoostWork;
