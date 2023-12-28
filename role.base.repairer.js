const Pathing = require('pathing');

var functionStaticCount = require('function.static_count')
var functionBoostWork = require('function.boost.work')

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var prior  = 10
        var colour = '#00FF00'

        functionStaticCount.run( creep )

        var rm = creep.memory.birth

        // boost WORK
        functionBoostWork.run( creep, rm, 'LH', prior , colour )

        // boost multiplier
        if( creep.memory.boosted == 1 && !creep.memory.boost_mult ){

            for( var i = 0; i < creep.body.length; i++ ){
                // repair/build
                if( creep.body[i].type == WORK  ){
                    if( creep.body[i].boost == 'XLH2O'  ){
                        creep.memory.boost_mult = 2
                    }
                    else if( creep.body[i].boost == 'LH2O'  ){
                        creep.memory.boost_mult = 1.8
                    }
                    else if( creep.body[i].boost == 'LH'  ){
                        creep.memory.boost_mult = 1.5
                    }
                    else {
                        creep.memory.boost_mult = 1
                    }
                    break;
                }
            }
        }

        if( creep.memory.boosted == 1 ){

            if ( (!creep.memory.task_id || creep.memory.task_id == null ) || 
                 (Game.rooms[rm].memory.mode_defend == 0 && creep.ticksToLive % 300 == 0 ) || 
                 (Game.rooms[rm].memory.mode_defend == 1 && creep.ticksToLive % 150 == 0 ) ) {

                var repair_list = {}

                // similar to manager role (need to sync code)

                /// wall and rampart hits
                // level 8
                if( Game.rooms[rm].memory.energy_cap >= 12900 && Game.rooms[rm].terminal && Game.rooms[rm].storage ){
                    var def_hits = Memory.config.walls_def_hits[8]
                }
                // level 7
                else if( Game.rooms[rm].memory.energy_cap >= 5600 && Game.rooms[rm].terminal && Game.rooms[rm].storage ){
                    var def_hits = Memory.config.walls_def_hits[7]
                }
                // level 6
                else if( Game.rooms[rm].memory.energy_cap >= 2300 && Game.rooms[rm].terminal && Game.rooms[rm].storage ){
                    var def_hits = Memory.config.walls_def_hits[6]
                }
                else if( Game.rooms[rm].controller.level < 6 ){
                    var def_hits = Memory.config.walls_def_hits[Game.rooms[rm].controller.level]
                }
                else {
                    var def_hits = Memory.config.walls_def_hits[0]
                }

                var rep_hits = creep.getActiveBodyparts(WORK) * 100 * creep.memory.boost_mult
                    
                var obj = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.hits <= structure.hitsMax - rep_hits ) } })
            
                var obj = _.sortBy(obj, 'hits');

                var ok    = 0 
        
                for ( var i = 0 ; i < obj.length ; i++){
                    creep.say(obj[i].structureType)
                    if( Game.rooms[rm].memory.mode_defend == 0 &&
                        ( obj[i].structureType == STRUCTURE_ROAD && obj[i].hits <= 1500 ) || 
                        ( obj[i].structureType == STRUCTURE_CONTAINER && obj[i].hits <= 30000 ) ){

                        // check if someone is already on it
                        var obj_cp = _.filter( Game.creeps, (cp) => cp.memory.task_id && cp.memory.task_id == obj[i].id )
                    
                        if( obj_cp && obj_cp.length >= 1 ){

                        }
                        else{
                            repair_list[ obj[i].id ] = {}
                            repair_list[ obj[i].id ].priority = 500000000 + obj[i].hits //one less zero - hegier priority
                            repair_list[ obj[i].id ].id = obj[i].id
                        }
                    }     
                    else if( ( obj[i].structureType == STRUCTURE_ROAD && obj[i].hits <= obj[i].hitsMax - rep_hits ) || 
                        ( obj[i].structureType == STRUCTURE_CONTAINER && obj[i].hits <= 200000 ) ){

                        // check if someone is already on it
                        var obj_cp = _.filter( Game.creeps, (cp) => cp.memory.task_id && cp.memory.task_id == obj[i].id )
                    
                        if( obj_cp && obj_cp.length >= 1 ){

                        }
                        else{
                            repair_list[ obj[i].id ] = {}
                            repair_list[ obj[i].id ].priority = 5000000000 + obj[i].hits
                            repair_list[ obj[i].id ].id = obj[i].id
                        }
                    }
                    else if( obj[i].structureType == STRUCTURE_WALL && obj[i].hits <= Math.min( 1000000, def_hits) ){       
                        repair_list[ obj[i].id ] = {}
                        repair_list[ obj[i].id ].priority = 4000000000 + obj[i].hits
                        repair_list[ obj[i].id ].id = obj[i].id
                    } 
                    else if( obj[i].structureType == STRUCTURE_RAMPART && obj[i].hits <= def_hits *.5 * 1.05 ){    
                        repair_list[ obj[i].id ] = {}
                        repair_list[ obj[i].id ].priority = 3000000000 + obj[i].hits
                        repair_list[ obj[i].id ].id = obj[i].id

                        var obj_ramp = Game.rooms[rm].lookForAt(LOOK_FLAGS, obj[i].pos.x, obj[i].pos.y);
            
                        if( obj_ramp && obj_ramp.length >= 1 ){
                            for ( var j = 0 ; j < obj_ramp.length ; j++){
                                if( obj_ramp[j].color == 5 ){
                                    repair_list[ obj[i].id ] = {}
                                    repair_list[ obj[i].id ].priority = 1000000000 + obj[i].hits
                                    repair_list[ obj[i].id ].id = obj[i].id
                                    break;
                                }
                            }
                        }
                    } 
                    else if( obj[i].structureType == STRUCTURE_RAMPART && obj[i].hits <= def_hits * 1.1 ){        
                        
                        var obj_ramp = Game.rooms[rm].lookForAt(LOOK_FLAGS, obj[i].pos.x, obj[i].pos.y);
            
                        if( obj_ramp && obj_ramp.length >= 1 ){
                            for ( var j = 0 ; j < obj_ramp.length ; j++){
                                if( obj_ramp[j].color == 5 ){
                                    repair_list[ obj[i].id ] = {}
                                    repair_list[ obj[i].id ].priority = 2000000000 + obj[i].hits
                                    repair_list[ obj[i].id ].id = obj[i].id
                                    break;
                                }
                            }
                        }  
                    }
                    else if( obj[i].structureType != STRUCTURE_ROAD && obj[i].structureType != STRUCTURE_CONTAINER ) {       
                        repair_list[ obj[i].id ] = {}
                        repair_list[ obj[i].id ].priority = 6000000000 + obj[i].hits
                        repair_list[ obj[i].id ].id = obj[i].id
                    }    
                }
                
                var repair_list =  _.sortBy( repair_list, 'priority' )

                if( repair_list && repair_list.length > 0 ){
                    creep.memory.task_id = repair_list[0].id
                }

            }
            //

            if( creep.memory.task_id ){
                var obj = Game.getObjectById( creep.memory.task_id )
            }

            if( obj && obj.hits <= obj.hitsMax - creep.getActiveBodyparts(WORK) * 100 * creep.memory.boost_mult ){

                var action = creep.repair( obj )

                if( action == ERR_NOT_IN_RANGE || action == ERR_NOT_ENOUGH_RESOURCES ){
                    creep.moveTo(obj, {range: 3, maxRooms: 1, plainCost: 2,swampCost: 10, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                    if( ( Game.cpu.bucket > 8000 || creep.ticksToLive % 5 == 0 ) && creep.store['energy'] > 0 && action == ERR_NOT_IN_RANGE ){
                        var objs = creep.pos.findInRange(FIND_STRUCTURES, 3, {filter: (struct) =>  struct.hits < struct.hitsMax - creep.getActiveBodyparts(WORK) * 100 * creep.memory.boost_mult } )
                        var objs = _.sortBy( objs, function(o) { return o.hits; }); // crescente

                        if( objs && objs.length > 0 ){
                            creep.repair( objs[0] )
                        }
                    }
                }
                else if( action == ERR_INVALID_TARGET ){
                    creep.memory.task_id = null
                    Game.rooms[rm].memory.oneTimer.repair = 2
                }

                if( creep.ticksToLive % 3 == 0 && creep.store.getFreeCapacity() > creep.store['energy'] ){
                    Game.rooms[rm].memory.oneTimer.repair = 2
                }
            }
            else{
                creep.memory.task_id = null
                Game.rooms[rm].memory.oneTimer.repair = 2
            }
            //
          


            // drop energy around if filled
            if( creep.ticksToLive % 5 == 0 &&
                creep.pos.roomName == creep.memory.birth && 
                Game.cpu.bucket >= 7000 && 
                creep.store.getUsedCapacity() > creep.store.getCapacity() * 0.50 ){

                var obj = creep.pos.findInRange(FIND_MY_CREEPS, 1, {filter: obj =>  ( obj.memory.role =='repairer' &&
                                                                                      obj.store.getUsedCapacity() == 0 ) } );

                if( obj.length >= 1 ){
                    creep.transfer( obj[0], 'energy', creep.store.getUsedCapacity() * 0.50 )
                }
            }
            //

            
            // random move
            var trigger = 27

            if( creep.memory.static_cnt >= trigger &&
                creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49 &&
                Game.rooms[ creep.pos.roomName ].lookForAtArea(LOOK_CREEPS,creep.pos.y - 1 , creep.pos.x - 1, creep.pos.y + 1, creep.pos.x + 1,true).length > 2
            ){
                var xx = Math.floor(Math.random() * 3 - 1 ) + creep.pos.x
                var yy = Math.floor(Math.random() * 3 - 1 ) + creep.pos.y
                if( xx > 49 ){ var xx = 49 }
                if( xx < 0  ){ var xx = 0  }
                if( yy > 49 ){ var yy = 49 }
                if( yy < 0  ){ var yy = 0  }
                creep.say('shit1')
                creep.moveTo(new RoomPosition(xx, yy, rm), {range: 0 })
                if( creep.memory.static_cnt >= 41 ){
                    // creep.suicide()
                    creep.say('shit2')
                }
            }   
        } 
        
        // unboost code
        if( creep.ticksToLive < 100 && 1==11 ){
            if( creep.memory.boosted == 1 ){
                // check if it has boosts

                // check distance to base 
            }
            else if( creep.memory.boosted == -1 ){
                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.lab && Game.rooms[rm].memory.intel.lab[1] && 
                    Game.rooms[rm].memory.intel.lab[1].id && Game.getObjectById( Game.rooms[rm].memory.intel.lab[1].id ) ){
  creep.say('unb')  
                    var lab = Game.getObjectById( Game.rooms[rm].memory.intel.lab[1].id )

                    if( lab ){

                        var action = lab.unboostCreep(creep)

                        if( action == ERR_NOT_IN_RANGE || !creep.pos.isNearTo(lab) ){
                            creep.moveTo(lab, {range: 1, plainCost: 2,swampCost: 10, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                    }
                }
            }
        } 
    }
}

module.exports = roleRepairer;
