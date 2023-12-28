const Pathing            = require('pathing');
var FunctionStaticCount  = require('function.static_count')
var FunctionCostMatrix_avoid = require('function.cost_matrix avoid') 

var season5Scorer_2static = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if( Game.time % 10000 < 5000 ){
            creep.say(5000-Game.time % 10000,1)
        }
        else if( Game.time % 10000 == 5000 || Game.time % 10000 == 0 ){
            creep.say('💥')
        }
        else{
            creep.say(10000 - Game.time % 10000,1)
        }

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

        // move to room
        if( creep.pos.roomName == rm_tgt ){

            if( !creep.memory.reactor ){

                var reactor = Game.rooms[rm_tgt].find( FIND_REACTORS )[0]

                if( reactor ){
                    creep.memory.reactor = reactor.id
                }
            }
            else{
                var reactor = Game.getObjectById(creep.memory.reactor)

                if( reactor ){
                    if( creep.pos.inRangeTo(reactor, 7) ){
                        // ok
                    }
                    else{
                        creep.moveTo(reactor, {range: 7, ignoreRoads: true, priority: 99, avoidRooms: avoidRooms_mt, visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} } )
                    }
                }
                else{
                    delete creep.memory.reactor
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
};

module.exports = season5Scorer_2static;
