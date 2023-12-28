const Pathing            = require('pathing');
var FunctionStaticCount  = require('function.static_count')


var mineralSK = {

    /** @param {Creep} creep **/
    run: function(creep) {

        pos2 = new RoomPosition(25, 25, creep.memory.birth_target);

        Game.map.visual.circle(creep.pos, {fill: '#ff0000', radius: 2, stroke: '#ff0000', opacity: 0.9 });
        Game.map.visual.line(creep.pos, pos2,{color: '#ff0000', lineStyle: 'dashed', width: 1 });

        if(!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
            creep.memory.harvesting = true;
            if( creep.ticksToLive < 750 ){
                creep.suicide()
            }
        }
        if( creep.memory.harvesting && creep.store.getFreeCapacity() == 0 || 
            creep.ticksToLive < 250 ) {
            creep.memory.harvesting = false;
            // change memory to trigger new spawn
            creep.memory.birth_info_2 = Game.time
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

        // harvest
        if (creep.pos.roomName == rm_tgt && creep.memory.harvesting == true  ){

            var collect = Game.rooms[rm_tgt].find(FIND_MINERALS)[0]

            if ( collect ){
                var harv = creep.harvest( collect )

                if( collect.ticksToRegeneration > 0 || collect.mineralAmount < 500 ){
                    console.log( 'NO MINERAL ON SK ROOM: ', rm_tgt)

                    // delete from Memory
                    if( Game.time % 15 == 6 ){
                        for( id in Memory.mineralsBank ){
                            if( Memory.mineralsBank[id].rm_tgt == rm_tgt  ){
                                delete Memory.mineralsBank[id]
                            }
                        }
                    }
                    //
                }
            }

            if ( harv == OK ){

            }
            else if( harv == ERR_NOT_IN_RANGE ){
                if( creep.pos.findInRange([collect] ,2).length > 0 ){
                    creep.moveTo(collect);
                }
                else{
                    var path_to_road = PathFinder.search(creep.pos, [{pos:collect.pos, range:1}], {maxOps: 8000, maxRooms: 1 , plainCost: 1, swampCost: 1,

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
            else if( harv == ERR_NOT_ENOUGH_RESOURCES ){
                creep.memory.harvesting = false;
            }
        }
        else if (creep.pos.roomName == rm && creep.memory.harvesting == false  ){

            var drop_term = Game.rooms[rm].terminal

            if ( drop_term ){

                var mineral_matrix = [  'power','ops',
                                        'H','O','U','L','K','Z','X','G',
                                        'OH','ZK','UL',
                                        'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',
                                        'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                                        'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2']

                for ( var j = 0 ; j < mineral_matrix.length ; j++){
                    if ( creep.store[mineral_matrix[j]] > 0 ){
                        var res = mineral_matrix[j]
                        break;
                    }
                }

                var transf = creep.transfer(drop_term, res)

            }

            if ( transf == OK ){

            }
            else if( transf == ERR_NOT_IN_RANGE ){
                creep.moveTo(drop_term);
            }


        }
        else if ( creep.memory.harvesting == true  ){


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
        else if ( creep.memory.harvesting == false  ){

            if( Game.time % 25 == 0 ){

                if( creep.getActiveBodyparts(MOVE) < creep.getActiveBodyparts(WORK) + creep.getActiveBodyparts(CARRY) ){

                    var amt = creep.store.getUsedCapacity()

                    var amt_possible = ( creep.getActiveBodyparts(MOVE) - creep.getActiveBodyparts(WORK) ) * 50

                    if( amt > amt_possible ){

                        var SYMBOLS= [
                                  'energy',
                                  'H','O','U','L','K','Z','X','G',
                                  'OH','ZK','UL',
                                  'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',
                                  'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                                  'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2',
                                  'power','ops',

                                  'silicon','metal','biomass','mist',

                                  'utrium_bar','lemergium_bar','zynthium_bar','keanium_bar','ghodium_melt','oxidant','reductant','purifier','battery',

                                  'composite','crystal','liquid',

                                  'wire','switch','transistor','microchip','circuit','device',

                                  'cell','phlegm','tissue','muscle','organoid','organism',

                                  'alloy','tube','fixtures','frame','hydraulics','machine',

                                  'condensate','concentrate','extract','spirit','emanation','essence'

                                  ]

                        for ( var i = 0 ; i < SYMBOLS.length ; i++){

                            var symb = SYMBOLS[i]

                            if( creep.store[symb] > 0 ){
                                break;
                            }
                        }

                        creep.drop(symb,amt - amt_possible  )
                    }
                }
            }

            FunctionStaticCount.run( creep )

            var avoidRooms_tmp = Memory.avoidRooms_tmp

            var avoidRooms_mt = _.union(avoidRooms_tmp, creep.memory.avoid_temp)

            var xx = 24
            var yy = 24
            var rng = 23

            const mid_pos = new RoomPosition(xx, yy, rm)

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
};

module.exports = mineralSK;
