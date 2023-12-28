const Pathing            = require('pathing');
var FunctionStaticCount  = require('function.static_count')
var FunctionCostMatrix_avoid = require('function.cost_matrix avoid') 

var season5ReactorClaim = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var rm_tgt  = creep.memory.birth_target
        var rm      = creep.memory.birth

        // heal
        if( creep.getActiveBodyparts(HEAL) >= 1 && creep.getActiveBodyparts(ATTACK) == 0 && creep.getActiveBodyparts(WORK) == 0 ){
            creep.heal(creep)
        }
        else if( creep.getActiveBodyparts(HEAL) >= 1 && creep.hits < creep.hitsMax && (( !creep.memory.target_id || creep.memory.target_id == null ) || creep.getActiveBodyparts(MOVE) == 0 ) ){
            creep.heal(creep)
        }
        //

        // harvest
        if( creep.pos.roomName == rm_tgt ){

            var reactor = Game.rooms[rm_tgt].find( FIND_REACTORS )[0]

            if ( reactor ){

                if( creep.pos.isNearTo(reactor)  ){
                    if( !reactor.my ){
                        creep.claimReactor(reactor)
                    }
                }
                else{
                    var path_to_road = PathFinder.search(creep.pos, [{pos:reactor.pos, range:1}], {maxOps: 8000, maxRooms: 1 , plainCost: 1, swampCost: 2,

                        roomCallback: function() {

                            let room = Game.rooms[creep.pos.roomName];
                            let costs = new PathFinder.CostMatrix;

                            // avoid creeps in the room
                            room.find(FIND_HOSTILE_CREEPS).forEach(function(creep2) {
                                creep.say('cost2')
                                costs.set(creep2.pos.x, creep2.pos.y, 255);

                                for ( var xx = -3 ; xx <= 3 ; xx++){
                                    for ( var yy = -3 ; yy <= 3 ; yy++){
                                        if( xx != 0 && yy != 0 ){
                                            if( Math.abs(xx) <= 3 || Math.abs(yy) <= 3 ){ var block_lvl = 255 } else { var block_lvl = 50 }
                                            if( costs.get( creep2.pos.x+xx, creep2.pos.y+yy ) < block_lvl ){ costs.set(creep2.pos.x+xx, creep2.pos.y+yy, block_lvl) }
                                        }
                                    }
                                }
                            });

                            for ( var xx = 0 ; xx <= 49 ; xx++){
                                for ( var yy = 0 ; yy <= 49 ; yy++){
                                    if( xx == 0 || xx == 49 || yy == 0 || yy == 49  ){
                                        if( costs.get( xx, yy ) < 50 ){ costs.set(xx, yy, 50) }
                                    }
                                }
                            }

                            room.find(FIND_MY_CREEPS).forEach(function(creep2) {
                                costs.set(creep2.pos.x, creep2.pos.y, 255);
                            });

                            return costs;
                        },
                        }
                    ).path

                    creep.moveByPath( path_to_road )
                }
            }   
        }        
        else{

            FunctionStaticCount.run( creep )

            var avoidRooms_tmp = Memory.avoidRooms_tmp

            var avoidRooms_mt = _.union(avoidRooms_tmp, creep.memory.avoid_temp)

            var xx = 24
            var yy = 24
            var rng = 23

            const mid_pos = new RoomPosition(xx, yy, rm_tgt)

            var hostiles = Game.rooms[creep.pos.roomName].find(FIND_HOSTILE_CREEPS, {filter: function(cp) {return cp.getActiveBodyparts(ATTACK) >= 1 ||
                                                                                                                      cp.getActiveBodyparts(RANGED_ATTACK) >= 1 } } )

                if( hostiles && hostiles.length >= 1 ){
                    // run cost matrix
                    FunctionCostMatrix_avoid.run( creep.pos.roomName, hostiles)
                }

                creep.moveTo(mid_pos, {range: rng, ignoreRoads: true, priority: 99, avoidRooms: avoidRooms_mt, visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1},
                                            costCallback: function(roomName, costMatrix) {
                                                  let rm = Game.rooms[creep.pos.roomName];

                                                  if( global.rooms[rm] &&
                                                      global.rooms[rm].costMatrix_avoid_tick &&
                                                      global.rooms[rm].costMatrix_avoid_tick == Game.time ){

                                                      var costMatrix = PathFinder.CostMatrix.deserialize(global.rooms[rm].costMatrix_avoid)
                                                  }  
                                                  else{
                                                      var costMatrix = new PathFinder.CostMatrix;
                                                  }                                                 
    
                                                  return costMatrix;
                                                },
                                      })

        }
        //
    }
};

module.exports = season5ReactorClaim;
