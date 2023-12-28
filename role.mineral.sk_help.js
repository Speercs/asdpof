const Pathing            = require('pathing');
var FunctionStaticCount  = require('function.static_count')

var MainObserverIntel = require('main.observer.intel')

var mineralSK_help = {

    /** @param {Creep} creep **/
    run: function(creep) {

        pos2 = new RoomPosition(25, 25, creep.memory.birth_target);

        Game.map.visual.circle(creep.pos, {fill: '#ff0000', radius: 2, stroke: '#ff0000', opacity: 0.9 });
        Game.map.visual.line(creep.pos, pos2,{color: '#ff0000', lineStyle: 'dashed', width: 1 });

        var rm_tgt  = creep.memory.birth_target
        var rm      = creep.memory.birth


        // avoid back and forth move on travel
        if( !creep.memory.avoid_temp ){
            creep.memory.avoid_temp = []
        }
        else if( creep.memory.pos_3_rm && creep.memory.pos_3_rm != creep.pos.roomName ){
            creep.memory.avoid_temp = []
            creep.memory.avoid_temp[0] = creep.memory.pos_3_rm

            if( Memory.avoidRooms_safemode ){
                var safe = 0
                for ( var ii = 0 ; ii < Memory.avoidRooms_safemode.length ; ii++){
                    if( Memory.avoidRooms_safemode[ii][0] == creep.pos.roomName ){
                        var safe = 1
                        break;
                    }
                }

                if( safe == 0 ){
                    if( Game.rooms[creep.pos.roomName].controller && Game.rooms[creep.pos.roomName].controller.safeMode > 0 ){
                        var cnt = Memory.avoidRooms_safemode.length
                        Memory.avoidRooms_safemode[cnt] = []
                        Memory.avoidRooms_safemode[cnt][0] = creep.pos.roomName
                        Memory.avoidRooms_safemode[cnt][1] = Game.rooms[creep.pos.roomName].controller.safeMode + Game.time
                    }
                }
            }
            else{
                Memory.avoidRooms_safemode = []
            }
        }

        if( creep.ticksToLive % 200 == 0 ){
            creep.memory.avoid_temp = []
        }
        //


        // harvest
        if ( creep.pos.roomName == rm_tgt  ){

            if( !creep.memory.mineral ){
                var obj = Game.rooms[rm_tgt].find(FIND_MINERALS)[0]
                if ( obj ){
                    creep.memory.mineral = obj.id

                    // scout only once
                    MainObserverIntel.run( rm, rm_tgt )
                }
            }
            else if( !creep.memory.mineral_sk ){

                var obj  = Game.getObjectById( creep.memory.mineral )
                var obj2 = obj.pos.findInRange(FIND_STRUCTURES, 7, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_KEEPER_LAIR  ) } })
                if ( obj2 && obj2[0] ){
                    creep.memory.mineral_sk = obj2[0].id
                }
            }

            if( creep.memory.mineral_sk ){

                var hostile = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 7)

                if( hostile && hostile[0] ){

                    creep.moveTo(hostile[0].pos, {range: 1, maxRooms: 1, ignoreRoads: true, priority: 99 , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                    if( creep.getActiveBodyparts(ATTACK) > 0 ){ creep.attack (hostile[0]) }
                    if( creep.getActiveBodyparts(RANGED_ATTACK) > 0 ){ creep.rangedAttack (hostile[0]) }
                }
                else{

                    var obj = Game.getObjectById( creep.memory.mineral_sk )

                    creep.moveTo(obj.pos, {range: 1, maxRooms: 1, ignoreRoads: true, priority: 99 , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                    if( creep.getActiveBodyparts(HEAL) > 0 ){
                        if( creep.hits < creep.hitsMax ){
                            creep.heal(creep)
                        }
                        else{
                            var heal_cr = creep.pos.findInRange(FIND_MY_CREEPS, 7)

                            if( heal_cr.length >0 ){
                                for ( var i = 0 ; i < heal_cr.length ; i++){
                                    if( heal_cr[i].hits < heal_cr[i].hitsMax ){
                                        creep.rangedHeal(heal_cr[i])
                                        if( creep.pos.inRangeTo(heal_cr[i],1) == false ){
                                            creep.moveTo(heal_cr[i].pos, {range: 1, maxRooms: 1, ignoreRoads: true, priority: 99 , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else {

          var hostile = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5)

          if( hostile && hostile[0] ){

              creep.moveTo(hostile[0].pos, {range: 1, maxRooms: 1, ignoreRoads: true, priority: 99 , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

              if( creep.getActiveBodyparts(ATTACK) > 0 ){ creep.attack (hostile[0]) }
              if( creep.getActiveBodyparts(RANGED_ATTACK) > 0 ){ creep.rangedAttack (hostile[0]) }

          }
          else{
                if( creep.getActiveBodyparts(HEAL) > 0 ){
                    if( creep.hits < creep.hitsMax ){
                        creep.heal(creep)
                    }
                }


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
        }
    }
};

module.exports = mineralSK_help;
