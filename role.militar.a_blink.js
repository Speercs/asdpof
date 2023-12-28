const Pathing            = require('pathing');
var FunctionBoost        = require('function.boost')
var FunctionManualPath2  = require('function.manual_path2')
var FunctionStaticCount  = require('function.static_count')
var FunctionCostMatrix   = require('function.cost_matrix')

var FunctionCreepTarget         = require('function.creep_targeting')
var FunctionCreepTargetInRange  = require('function.creep_targeting_inrange')

var FunctionCostMatrixDamageCreeps  = require('function.cost_matrix_damage_creeps')
var FunctionCostMatrixDamageTower   = require('function.cost_matrix_damage_tower')

var MainObserverIntel = require('main.observer.intel')

var roleA_blink = {

    /** @param {Creep} creep **/
    run: function(creep) {

    
        var rm_tgt  = creep.memory.birth_target
        var rm      = creep.memory.birth

        delete Memory.avoidRooms_observer[ rm_tgt ]

        if( creep.memory.boosted != 1 || !creep.memory.boosted ){
            FunctionBoost.run( creep )
        }

        // teste retarget
        if( creep.pos.roomName != rm_tgt ){

            if( !creep.memory.rm_temp && Game.time % 2 == 0 ){

                var en = Game.rooms[creep.pos.roomName].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  {return ( creep.getActiveBodyparts(ATTACK) > 5 ||
                                                                                                                  creep.getActiveBodyparts(RANGED_ATTACK) > 5  ) &&
                                                                                                                  _.intersection([creep.owner.username], Memory.config.ally_list).length == 0 &&
                                                                                                                  creep.owner.username != 'Source Keeper' } }   );

                  if( en && en.length > 0 ){

                    var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL ) } })

                      if( portal && portal.length > 0 ){

                      }
                      else{
                          creep.memory.rm_temp = creep.pos.roomName
                          creep.memory.route_manual_temp = creep.memory.route_manual
                          creep.memory.avoid_temp = []
                      }
                  }
            }

            if( creep.memory.rm_temp ){

                var rm_tgt = creep.memory.rm_temp

                if( creep.pos.y >= 48 ){
                    var mv = 1
                    creep.move(mv);
                }
                else if( creep.pos.y <= 1 ){
                    var mv = 5
                    creep.move(mv);
                }
                else if( creep.pos.x >= 48 ){
                    var mv = 7
                    creep.move(mv);
                }
                else if( creep.pos.x <= 1 ){
                    var mv = 3
                    creep.move(mv);
                }

                if( Game.time % 11 == 0 ){
                    var en = Game.rooms[creep.pos.roomName].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  {return ( creep.getActiveBodyparts(ATTACK) > 5 ||
                                                                                                                      creep.getActiveBodyparts(RANGED_ATTACK) > 5  ) &&
                                                                                                                      _.intersection([creep.owner.username], Memory.config.ally_list).length == 0 &&
                                                                                                                      creep.owner.username != 'Source Keeper' } }   );
                    if( en && en.length > 0 ){
                        creep.memory.avoid_temp = []
                    }
                    else{
                        delete creep.memory.rm_temp
                        creep.memory.route_manual = creep.memory.route_manual_temp
                        creep.memory.avoid_temp = []
                    }
                }

            }
        }
        //

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


        // heal
        if( creep.getActiveBodyparts(HEAL) >= 1 && creep.getActiveBodyparts(ATTACK) == 0 && creep.getActiveBodyparts(WORK) == 0 ){
            creep.heal(creep)
        }
        else if( creep.getActiveBodyparts(HEAL) >= 1 && creep.hits < creep.hitsMax && (( !creep.memory.target_id || creep.memory.target_id == null ) || creep.getActiveBodyparts(MOVE) == 0 ) ){
            creep.heal(creep)
        }
        //


        // auto-attack update
        if( (creep.ticksToLive % 150 == 0 && creep.pos.roomName == rm_tgt)  ){

            // change attack_level - room reached
            for ( var i = 0 ; i < Memory.attack_list.length ; i++){

                if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt ){

                    // if current path to controller no available, check if changed
                    if( Memory.attack_list[i].attack_level == 5 ){

                        // check path to controller is reacheable
                        var pathcontroller = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_CONTROLLER  ) } })

                        if ( pathcontroller == null ){
                            Memory.attack_list[i].attack_level = 5
                        }
                        else{
                            Memory.attack_list[i].attack_level = 4
                            Memory.attack_list[i].detection_tick  = Game.time //update time when status change
                        }
                        //
                    }

                    // update intel
                    MainObserverIntel.run( rm, rm_tgt )
                    break;
                }
            }
        }
        //

        // auto-attack life and death update
        if( creep.ticksToLive == 1498 ){
            // register birth
            for ( var i = 0 ; i < Memory.attack_list.length ; i++){

                if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt ){

                    if( !Memory.attack_list[i].creep_count ){
                        Memory.attack_list[i].creep_count = 1
                    }
                    else{
                        Memory.attack_list[i].creep_count ++
                    }
                    break;
                }
            }
        }
        else if( creep.ticksToLive == 2 && creep.pos.roomName == rm_tgt ){
            // register death
            for ( var i = 0 ; i < Memory.attack_list.length ; i++){

                if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt ){

                    if( creep.pos.roomName == rm_tgt ){
                        MainObserverIntel.run( rm, rm_tgt )
                    }

                    Memory.attack_list[i].creep_count = Memory.attack_list[i].creep_count - 1
                    break;
                }
            }
        }
        //


        // attack
        if (creep.pos.roomName == rm_tgt && creep.memory.boosted == 1 ){

            var enemies = FunctionCreepTarget.run(creep)

            if ( enemies ) {

                if( enemies.structureType ){
                    var rng = 1
                }
                else {
                    var rng = 0
                }

                FunctionCostMatrixDamageTower.run( rm )
                FunctionCostMatrixDamageCreeps.run( rm )

                if( global.rooms[ rm ].savedMatrixDamageTower && global.rooms[ rm ].savedMatrixDamageCreeps && 1==1 ){
creep.say(1)
                    var terrain = Game.rooms[rm].getTerrain()

                    var cost1 = global.rooms[ rm ].savedMatrixDamageTower
                    var cost2 = global.rooms[ rm ].savedMatrixDamageCreeps

                    var vr = new PathFinder.CostMatrix;

                    var cnt_heal_creep = 0
                    if( creep.getActiveBodyparts(HEAL) > 0 ){
                        for ( var j = 0 ; j < creep.body.length ; j++){
                            // attack
                            if( creep.body[j].type == HEAL && creep.body[j].hits > 0 ){
                                if( creep.body[j].boost && creep.body[j].boost == 'LO' ){
                                    var cnt_heal_creep = cnt_heal_creep + 2/4
                                }
                                else if( creep.body[j].boost && creep.body[j].boost == 'LHO2' ){
                                    var cnt_heal_creep = cnt_heal_creep + 3/4
                                }
                                else if( creep.body[j].boost && creep.body[j].boost == 'XLHO2' ){
                                    var cnt_heal_creep = cnt_heal_creep + 4/4
                                }
                                else {
                                    var cnt_heal_creep = cnt_heal_creep + 1/4
                                }
                            }
                        }
                    }

                    var x_min = Math.max( 0, creep.pos.x - 7 )
                    var x_max = Math.min( 49, creep.pos.x - 7 )
                    var y_min = Math.max( 0, creep.pos.y - 7 )
                    var y_max = Math.min( 49, creep.pos.y - 7 )


                    for( var x = x_min ; x <= x_max ; x++ ) {
                        for( var y = y_min ; y <= y_max ; y++) {
                            if( terrain.get(x, y) == 1 ){
                                // terrain wall
                                vr.set(x,y,255)
                            }
                            else{
                                var cnt_heal = cost1.get(x,y) + cost2.get(x,y) + 1

                                if( cnt_heal >= cnt_heal_creep ){
                                    vr.set(x,y,255)
                                }
                                else{
                                    // TO DO ??
                                }
                            }
                        }
                    }

                    var heal_matrix = vr.get(creep.pos.x,creep.pos.y) + vr.get(creep.pos.x,creep.pos.y)

                    if( heal_matrix > 0 &&  heal_matrix+ 1 >= cnt_heal_creep ){
                        creep.moveTo(enemies,  {maxRooms: 1, range:5, flee: true, visualizePathStyle: {stroke: '#ff0000', opacity: .5, strokeWidth: .1} });
creep.say(cnt_heal_creep)

                    }
                    else{
                        creep.moveTo(enemies,  {maxRooms: 1, range:rng, roomCallback: function(roomName) { return vr; }, visualizePathStyle: {stroke: '#ff0000', opacity: .5, strokeWidth: .1} });
creep.say(3)
                    }
                }

                FunctionCreepTargetInRange.run(enemies, creep)

            }
            else{
                if( creep.fatigue == 0 && creep.ticksToLive % 3 == 0 ){

                    if( Game.rooms[rm_tgt].controller && !creep.pos.inRangeTo(Game.rooms[rm_tgt].controller, 3) ){
                        creep.moveTo(Game.rooms[rm_tgt].controller,  {maxRooms: 1, range:3, visualizePathStyle: {stroke: '#ff0000', opacity: .5, strokeWidth: .1} });
                    }
                    else{
                        var rnd = Math.floor((Math.random() * 7) + 1);
                        creep.move(rnd)
                    }
                }
            }
        }
        else if( creep.memory.boosted == 1 ){

            FunctionStaticCount.run( creep )

            var return0         = []
            var return0         = FunctionManualPath2.run(creep)
            var avoidRooms_mt   = return0[0]
            var rm_tgt          = return0[1]
            var portal          = return0[2]

            var max_rms = 16

            var avoidRooms_tmp = Memory.avoidRooms_tmp

            var avoidRooms_mt = _.union(avoidRooms_mt, avoidRooms_tmp)
            var avoidRooms_mt = _.union(avoidRooms_mt, creep.memory.avoid_temp)

            if( portal == 1 ){
                creep.memory.static_cnt = 0
                var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >2 && structure.pos.y >2 && structure.pos.x <48 && structure.pos.y <48 && !structure.destination.shard && structure.destination.roomName==rm_tgt ) } })

                if( portal ){
                    // do nothing
                }
                else{
                    // reduce rnge
                    var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >1 && structure.pos.y >1 && structure.pos.x <49 && structure.pos.y <49 && !structure.destination.shard && structure.destination.roomName==rm_tgt ) } })
                }

                if( portal ){
                    creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
            }
            else if( creep.memory.static_cnt >= 5 ){
                creep.memory.static_cnt = 0
                var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >2 && structure.pos.y >2 && structure.pos.x <48 && structure.pos.y <48 && !structure.destination.shard  ) } })
                if( portal ){
                    creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }
            }
            else if( !avoidRooms_mt || (avoidRooms_mt && avoidRooms_mt.length >= 1 && creep.pos.roomName != avoidRooms_mt[0]) || (avoidRooms_mt && avoidRooms_mt.length == 0) ){
                const mid_pos = new RoomPosition(24, 24, rm_tgt)
                creep.moveTo(mid_pos, {maxRooms: max_rms, avoidRooms: avoidRooms_mt, maxOps: 12000, findRoute: true, ignoreRoads: true, range: 23, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

            }
        }
        //
    }
};

module.exports = roleA_blink;
