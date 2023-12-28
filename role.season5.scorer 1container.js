const Pathing            = require('pathing');
var FunctionStaticCount  = require('function.static_count')

var season5Scorer_1container = {

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

        // move to room
        if( creep.pos.roomName == rm_tgt ){

            if(!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
                creep.memory.harvesting = true;
            }
            if( creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
                creep.memory.harvesting = false;
            }

            // repair the container
            if( creep.memory.harvesting ){

                var target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);

                if(target) {
                    if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
            else{

                // set pos
                if( !creep.memory.phase || creep.memory.phase == 0){

                    for ( f1 in Game.flags ) {
                        if( Game.flags[f1].pos.roomName == rm_tgt && Game.flags[f1].color == 1 ){

                            creep.memory.pos_x = Game.flags[f1].pos.x
                            creep.memory.pos_y = Game.flags[f1].pos.y

                            creep.memory.phase = 1
                        }
                    }
                }
                // build
                else if( creep.memory.phase == 1 ){

                    var structure = Game.rooms[rm_tgt].lookForAt('structure', creep.memory.pos_x, creep.memory.pos_y)

                    if( structure && structure[0] ){
                        creep.memory.container = structure[0].id
                        creep.memory.phase = 2
                    }
                    else{

                        var const_site = Game.rooms[rm_tgt].lookForAt(LOOK_CONSTRUCTION_SITES, creep.memory.pos_x, creep.memory.pos_y)

                        if( const_site && const_site[0] ){
                            if(creep.build(const_site[0]) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(const_site[0]);
                            }
                        }
                        else{
                            Game.rooms[rm_tgt].createConstructionSite(creep.memory.pos_x, creep.memory.pos_y, STRUCTURE_CONTAINER );
                        }
                    }                    
                }
                // repair
                else if( creep.memory.phase == 2 ){

                    var obj = Game.getObjectById(creep.memory.container)

                    if( obj ){
                        if( obj.hits <= obj.hitsMax - 100 * creep.getActiveBodyparts(WORK) * 2 ){
                            if(creep.repair(obj) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(obj);
                            }
                        }
                    }
                    else{
                        delete creep.memory.container
                        creep.memory.phase = 0
                    }
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

            creep.moveTo(mid_pos, {range: rng, ignoreRoads: true, priority: 99, avoidRooms: avoidRooms_mt, visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1},
                                          roomCallback: function() {
                                              let room = Game.rooms[creep.pos.roomName];
                                              let costs = new PathFinder.CostMatrix;

                                              // avoid creeps in the room
                                              room.find(FIND_HOSTILE_CREEPS).forEach(function(creep2) {
                                                  creep.say('cost2')
                                                  costs.set(creep2.pos.x, creep2.pos.y, 255);

                                                  for ( var xx = -4 ; xx <= 4 ; xx++){
                                                      for ( var yy = -4 ; yy <= 4 ; yy++){
                                                          if( xx != 0 && yy != 0 ){
                                                              if( Math.abs(xx) <= 3 || Math.abs(yy) <= 3 ){ var block_lvl = 200 } else { var block_lvl = 100 }
                                                              if( costs.get( creep2.pos.x+xx, creep2.pos.y+yy ) < block_lvl ){ costs.set(creep2.pos.x+xx, creep2.pos.y+yy, block_lvl) }
                                                          }
                                                      }
                                                  }
                                              });

                                              return costs;
                                            },
                                  })

        }
        //
    }
};

module.exports = season5Scorer_1container;
