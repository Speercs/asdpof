const Pathing            = require('pathing');
var FunctionStaticCount  = require('function.static_count')
var FunctionCostMatrix_avoid = require('function.cost_matrix avoid') 

var season5Scorer_3mover = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var rm_tgt  = creep.memory.birth_target
        var rm      = creep.memory.birth

        if(!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
            creep.memory.harvesting = true;
        }
        if( creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
        }

        // harvesting
        if( creep.memory.harvesting ){

            // collect
            if( creep.pos.roomName == rm ){

                if( Game.rooms[rm_tgt] ){

                    // memory
                    if( !creep.memory.reactor ){

                        var reactor = Game.rooms[rm_tgt].find( FIND_REACTORS )[0]

                        if( reactor ){
                            creep.memory.reactor = reactor.id
                        }
                    }
                    else{                        

                        var obj = _.filter( Game.creeps, (cp) => cp.memory.role == 's5_scorer_3mover' )
                        var store_sum = _.sum( obj, creep => { return creep.store['T'] });

                        var obj = Game.getObjectById(creep.memory.reactor)

                        var amt = obj.store['T'] + store_sum

                        if( obj ){
                            if( amt < 1050 ){
                                
                                var target = Game.rooms[rm].terminal

                                if( target && target.store['T'] >= 50 ) {
                                    if( creep.ticksToLive < 300 ){
                                        creep.suicide()
                                    }

                                    if(creep.withdraw(target, 'T') == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(target);
                                    }
                                }
                            }  
                            else{
                                creep.moveTo(Game.rooms[rm].terminal, {range: 5})
                            }                 
                        }
                        else{
                            delete creep.memory.reactor
                        }
                    }
                }
            }
            // move to room
            else{

                if( creep.ticksToLive < 375 ){
                    creep.suicide()
                }

                FunctionStaticCount.run( creep )

                var strong_list = []
                for( id_st in Memory.strongholds ){
                    strong_list[strong_list.length] = Memory.strongholds[id_st].rm_tgt
                }

                var avoidRooms_tmp = Memory.avoidRooms_tmp

                var avoidRooms_mt = _.union(avoidRooms_tmp, creep.memory.avoid_temp, strong_list)

                var xx = 24
                var yy = 24
                var rng = 23

                const mid_pos = new RoomPosition(xx, yy, rm)

                var hostiles = Game.rooms[creep.pos.roomName].find(FIND_HOSTILE_CREEPS, {filter: function(cp) {return cp.getActiveBodyparts(ATTACK) >= 1 ||
                                                                                                                      cp.getActiveBodyparts(RANGED_ATTACK) >= 1 } } )

                if( hostiles && hostiles.length >= 1 ){

                    // run cost matrix
                    FunctionCostMatrix_avoid.run( creep.pos.roomName, hostiles)

                    var path_to_road = PathFinder.search(creep.pos, [{pos:mid_pos, range:rng}], {maxRooms: 5, avoidRooms: avoidRooms_mt,

                                                roomCallback: function() {

                                                    let rm = creep.pos.roomName   

                                                  if( global.rooms[rm].costMatrix_avoid_tick == Game.time ){
                                                      var costs = PathFinder.CostMatrix.deserialize(global.rooms[rm].costMatrix_avoid)
                                                  }  
                                                  else{
                                                      var costs = new PathFinder.CostMatrix;
                                                  }                                                      

                                                    return costs;
                                                  },
                                                }
                                            ).path

                                if( path_to_road[0] ){

                                    //creep.say('enemy')

                                    new RoomVisual(creep.pos.roomName).poly(_.filter(path_to_road, (pos) => pos.roomName == creep.pos.roomName ), {fill: 'aqua'});

                                    creep.moveTo(path_to_road[0], {maxRooms: 1, maxOps: 1000, range: 0, priority: 200 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                }
                else{
                    creep.moveTo(mid_pos, {range: rng, ignoreRoads: true, priority: 99, avoidRooms: avoidRooms_mt, visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} } )
                }  
            }
            //
        }
        // dropping
        else{

            if( creep.pos.roomName == rm_tgt ){

                if( !creep.memory.reactor ){
    
                    var reactor = Game.rooms[rm_tgt].find( FIND_REACTORS )[0]

                    if( reactor ){
                        creep.memory.reactor = reactor.id
                    }
                }
                else{
    
                    var obj = Game.getObjectById(creep.memory.reactor)
    
                    if( obj ){
                        if(creep.transfer(obj, 'T') == ERR_NOT_IN_RANGE) {
                            creep.moveTo(obj);
                        }                  
                    }
                    else{
                        delete creep.memory.reactor
                    }
                }
            }        
            else{
    
                FunctionStaticCount.run( creep )

                var strong_list = []
                for( id_st in Memory.strongholds ){
                    strong_list[strong_list.length] = Memory.strongholds[id_st].rm_tgt
                }

                var avoidRooms_tmp = Memory.avoidRooms_tmp

                var avoidRooms_mt = _.union(avoidRooms_tmp, creep.memory.avoid_temp, strong_list)

                var xx = 24
                var yy = 24
                var rng = 23

                const mid_pos = new RoomPosition(xx, yy, rm_tgt)

                var hostiles = Game.rooms[creep.pos.roomName].find(FIND_HOSTILE_CREEPS, {filter: function(cp) {return cp.getActiveBodyparts(ATTACK) >= 1 ||
                                                                                                                      cp.getActiveBodyparts(RANGED_ATTACK) >= 1 } } )

                if( hostiles && hostiles.length >= 1 ){

                    // run cost matrix
                    FunctionCostMatrix_avoid.run( creep.pos.roomName, hostiles)

                    var path_to_road = PathFinder.search(creep.pos, [{pos:mid_pos, range:rng}], {maxRooms: 5, avoidRooms: avoidRooms_mt,

                                                roomCallback: function() {

                                                    let rm = creep.pos.roomName   

                                                  if( global.rooms[rm].costMatrix_avoid_tick == Game.time ){
                                                      var costs = PathFinder.CostMatrix.deserialize(global.rooms[rm].costMatrix_avoid)
                                                  }  
                                                  else{
                                                      var costs = new PathFinder.CostMatrix;
                                                  }                                                      

                                                    return costs;
                                                  },
                                                }
                                            ).path

                                if( path_to_road[0] ){

                                    //creep.say('enemy')                                    

                                    new RoomVisual(creep.pos.roomName).poly(_.filter(path_to_road, (pos) => pos.roomName == creep.pos.roomName ), {fill: 'aqua'});

                                    creep.moveTo(path_to_road[0], {maxRooms: 1, maxOps: 1000, range: 0, priority: 200 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                }
                else{
                    creep.say(2)
                    creep.moveTo(mid_pos, {range: rng, ignoreRoads: true, maxOps: 4500, priority: 99, avoidRooms: avoidRooms_mt, visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} } )
                }    
            }
            //
        }
        //        
    }
};

module.exports = season5Scorer_3mover;
