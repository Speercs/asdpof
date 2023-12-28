const Pathing       = require('pathing');
var FunctionManualPath2  = require('function.manual_path2')
var FunctionStaticCount  = require('function.static_count')
var FunctionCostMatrix   = require('function.cost_matrix')
var FunctionCreepTarget  = require('function.creep_targeting')
var FunctionCreepTargetInRange  = require('function.creep_targeting_inrange')

var roleSquad_cpt = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var cpu_check_test = Game.cpu.getUsed()

        pos2 = new RoomPosition(25, 25, creep.memory.birth_target);

        Game.map.visual.circle(creep.pos, {fill: '#0313fc', radius: 2, stroke: '#0313fc', opacity: 0.9 });
        Game.map.visual.line(creep.pos, pos2,{color: '#0313fc', lineStyle: 'dashed', width: 1 });

        var rm     = creep.pos.roomName
        var rm_tgt = creep.memory.birth_target

        var squad2 = Game.creeps[ creep.memory.squad2 ]
        var squad3 = Game.creeps[ creep.memory.squad3 ]
        var squad4 = Game.creeps[ creep.memory.squad4 ]

        // teste retarget
        if( rm != rm_tgt ){

            if( !creep.memory.rm_temp && Game.time % 2 == 0 ){

                var en = Game.rooms[rm].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  {return ( creep.getActiveBodyparts(ATTACK) > 5 ||
                                                                                                  creep.getActiveBodyparts(RANGED_ATTACK) > 5  ) &&
                                                                                                  _.intersection([creep.owner.username], Memory.config.ally_list).length == 0 &&
                                                                                                  creep.owner.username != 'Source Keeper' } }   );

                if( en && ( en.length >= 2 && ( !Game.rooms[rm].controller || ( Game.rooms[rm].controller && !Game.rooms[rm].controller.safeMode > 0 ) ) ) ||
                          ( en.length >= 1 && _.contains(Game.map.describeExits(rm),rm_tgt) ) ){

                  var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL ) } })

                    if( portal && portal.length > 1 ){

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
                    creep.move(mv); squad2.move(mv); squad3.move(mv); squad4.move(mv);
                }
                else if( creep.pos.y <= 1 ){
                    var mv = 5
                    creep.move(mv); squad2.move(mv); squad3.move(mv); squad4.move(mv);
                }
                else if( creep.pos.x >= 48 ){
                    var mv = 7
                    creep.move(mv); squad2.move(mv); squad3.move(mv); squad4.move(mv);
                }
                else if( creep.pos.x <= 1 ){
                    var mv = 3
                    creep.move(mv); squad2.move(mv); squad3.move(mv); squad4.move(mv);
                }

                if( squad2.pos.findInRange(creep,1).length == 0 ){
                    squad2.moveTo( creep )
                }
                if( squad3.pos.findInRange(creep,1).length == 0 ){
                    squad3.moveTo( creep )
                }
                if( squad4.pos.findInRange(creep,1).length == 0 ){
                    squad4.moveTo( creep )
                }


                if( Game.time % 11 == 0 ){
                    var en = Game.rooms[rm].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  {return ( creep.getActiveBodyparts(ATTACK) > 5 ||
                                                                                                      creep.getActiveBodyparts(RANGED_ATTACK) > 5  ) &&
                                                                                                      _.intersection([creep.owner.username], Memory.config.ally_list).length == 0 &&
                                                                                                      creep.owner.username != 'Source Keeper' } }   );
                    if( en && en.length >= 2 ){
                        creep.memory.avoid_temp = []
                    }
                    else{
                        delete creep.memory.rm_temp
                        delete creep.memory.formation
                        creep.memory.route_manual = creep.memory.route_manual_temp
                        creep.memory.avoid_temp = []
                    }
                }

            }
        }
        //

        // unsquad if someone is missing (passar isso para o role squad)
        if( !squad2 ){
             creep.memory.role = 'blinker'
            squad3.memory.role = 'blinker'
            squad4.memory.role = 'blinker'
        }
        else if( !squad3 ){
             creep.memory.role = 'blinker'
            squad2.memory.role = 'blinker'
            squad4.memory.role = 'blinker'
        }
        else if( !squad4 ){
             creep.memory.role = 'blinker'
            squad2.memory.role = 'blinker'
            squad3.memory.role = 'blinker'
        }
        //

        // change creep
        if( creep.ticksToLive <= 550 ){
            creep.memory.birth_info_4 = Game.time
            squad2.memory.birth_info_4 = Game.time
            squad3.memory.birth_info_4 = Game.time
            squad4.memory.birth_info_4 = Game.time
        }
        //




        // avoid back and forth move on travel
        if( !creep.memory.avoid_temp ){
            creep.memory.avoid_temp = []
        }
        else if( creep.memory.pos_3_rm && creep.memory.pos_3_rm != creep.pos.roomName ){
            creep.memory.avoid_temp = []
            creep.memory.avoid_temp[0] = creep.memory.pos_3_rm
        }

        if( creep.ticksToLive % 200 == 0 ){
            creep.memory.avoid_temp = []
        }
        //


        // reset path
        if( creep.memory.pos_0_rm != creep.memory.pos_1_rm ){
            creep.memory.path_to_room = null
        }
        else if( creep.memory.static_cnt >= 5 && !creep.memory.formation ){
            creep.memory.static_cnt = 0
            creep.memory.path_to_room = null
        }


        // heal
        var heal_matrix_hits =  [
                                 { pos: 1, creep_obj: creep,  heal_needed: Math.ceil( ( creep.hitsMax -  creep.hits) / 12 / 4 )/100, heal_av:  creep.getActiveBodyparts(HEAL), heal_used: 0 },
                                 { pos: 2, creep_obj: squad2, heal_needed: Math.ceil( (squad2.hitsMax - squad2.hits) / 12 / 4 )/100, heal_av: squad2.getActiveBodyparts(HEAL), heal_used: 0 },
                                 { pos: 3, creep_obj: squad3, heal_needed: Math.ceil( (squad3.hitsMax - squad3.hits) / 12 / 4 )/100, heal_av: squad3.getActiveBodyparts(HEAL), heal_used: 0 },
                                 { pos: 4, creep_obj: squad4, heal_needed: Math.ceil( (squad4.hitsMax - squad4.hits) / 12 / 4 )/100, heal_av: squad4.getActiveBodyparts(HEAL), heal_used: 0 }
                                ]

        var heal_matrix_heal =  heal_matrix_hits

        var cnt = 0

        while ( cnt < 4 ) {

            var cnt = cnt + 1
            var max_heal_needed = _.max(heal_matrix_hits, function( row ){ return row.heal_needed; } )
            var max_heal_av     = _.max(heal_matrix_heal, function( row ){ return row.heal_av;     } )

            // console.log('healing round, squad ',max_heal_av.pos,' heals for ',max_heal_av.heal_av, ' at squad ', max_heal_needed.pos , 'heal_needed at ' , max_heal_needed.heal_needed )

            // heal
            if( max_heal_av.creep_obj.getActiveBodyparts ( HEAL ) >= 1  ){
                var action = max_heal_av.creep_obj.heal( max_heal_needed.creep_obj )

                if( action != OK ){
                    max_heal_av.creep_obj.heal( max_heal_av.creep_obj )
                }
            }

            // update heal matrix
            for (var i = 0 ; i < heal_matrix_heal.length ; i++){

                if( heal_matrix_heal[i].pos == max_heal_av.pos  ){
                    var heal_av = max_heal_av.heal_av
                    heal_matrix_heal[i].heal_used = 1
                }
            }

            // update hits matrix
            for (var i = 0 ; i < heal_matrix_hits.length ; i++){

                if( heal_matrix_hits[i].pos == max_heal_needed.pos  ){

                    var remainder = heal_matrix_hits[i].heal_needed % 1
                    var total     = Math.floor( heal_matrix_hits[i].heal_needed )  - heal_av

                    if( total < 0 ){ var total = 0 }

                    heal_matrix_hits[i].heal_needed = total + remainder / 100
                }
            }

            // remove row from heal matrix
            var heal_matrix_heal = _.filter(heal_matrix_heal, function( row ){ return row.heal_used == 0 ; } )
        }



        if( rm == rm_tgt ){

            creep.say('rm_tgt')
            FunctionCreepTargetInRange.run(enemies, creep)
            FunctionCreepTargetInRange.run(enemies, squad2)
            FunctionCreepTargetInRange.run(enemies, squad3)
            FunctionCreepTargetInRange.run(enemies, squad4)
            
            if( !creep.memory.formation ){
                creep.memory.formation = 1
            }

        }
        else{

            if( ( Game.rooms[rm].controller && ( !Game.rooms[rm].controller.my || ( Game.rooms[rm].controller.reservation && !(Game.rooms[rm].controller.reservation.username == 'asdpof') ) ) ) ||
                  !Game.rooms[rm].controller ){
                if( creep.pos.findInRange(FIND_HOSTILE_CREEPS, 7).length > 0 ||  creep.pos.findInRange(FIND_STRUCTURES, 7).length > 0 ) {
                    var enemies
                    FunctionCreepTargetInRange.run(enemies, creep)
                    FunctionCreepTargetInRange.run(enemies, squad2)
                    FunctionCreepTargetInRange.run(enemies, squad3)
                    FunctionCreepTargetInRange.run(enemies, squad4)
                }
            }

            FunctionStaticCount.run( creep )

            var return0         = []
            var return0         = FunctionManualPath2.run(creep)
            var avoidRooms_mt   = return0[0]
            var rm_tgt          = return0[1]
            var portal          = return0[2]

            var max_rms = 16
            var squad = 0

            var avoidRooms_tmp = Memory.avoidRooms_tmp

            var avoidRooms_mt = _.union(avoidRooms_mt, avoidRooms_tmp)
            var avoidRooms_mt = _.union(avoidRooms_mt, creep.memory.avoid_temp)

            if( portal == 1  && 1==1 ){
                if( creep.pos.roomName == squad4.pos.roomName ){
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
                        if( creep.fatigue == 0 && squad2.fatigue == 0 && squad3.fatigue == 0  && squad4.fatigue == 0   ){

                            if( Game.time % 10 == 0 ){
                                var squad_cnt = creep.pos.findInRange(FIND_MY_CREEPS, 2);
                                if( squad_cnt.length == 3 ){
                                    creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                            }
                            else {
                                creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }

                            squad2.moveTo(creep.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 101 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            squad3.moveTo(squad2.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 102 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            squad4.moveTo(squad3.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 103 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        }
                        else{
                            // wait fatigue - capt dont move
                            squad2.moveTo(creep.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 101 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            squad3.moveTo(squad2.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 102 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            squad4.moveTo(squad3.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 103 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                    }
                }
                else {
                    const mid_pos = new RoomPosition(24, 24, creep.pos.roomName)
                     creep.moveTo(mid_pos, {maxRooms: 1, maxOps: 2000, ignoreRoads: true, range: 1, priority: 100 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    squad2.moveTo(creep.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 1, priority: 101 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    squad3.moveTo(squad2.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 1, priority: 102 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    squad4.moveTo(squad3.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 1, priority: 103 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                }
            }
            else if ( ( creep.pos.roomName != squad2.pos.roomName && Game.map.getRoomLinearDistance(creep.pos.roomName, squad2.pos.roomName) > 1 ) ||
                      ( creep.pos.roomName != squad3.pos.roomName && Game.map.getRoomLinearDistance(creep.pos.roomName, squad3.pos.roomName) > 1 ) ||
                      ( creep.pos.roomName != squad4.pos.roomName && Game.map.getRoomLinearDistance(creep.pos.roomName, squad4.pos.roomName) > 1 )   ){

                // squad 2
                if( creep.pos.roomName != squad2.pos.roomName ){
                    squad2.memory.static_cnt = 0
                    var portal = squad2.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >=2 && structure.pos.y >=2 && structure.pos.x <=48 && structure.pos.y <=48 && !structure.destination.shard && structure.destination.roomName==creep.pos.roomName ) } })
                    if( portal ){
                        squad2.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                }
                else{
                    squad2.moveTo(creep.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 1 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }

                // squad 3
                if( creep.pos.roomName != squad3.pos.roomName ){
                    squad3.memory.static_cnt = 0
                    var portal = squad3.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >=2 && structure.pos.y >=2 && structure.pos.x <=48 && structure.pos.y <=48 && !structure.destination.shard && structure.destination.roomName==creep.pos.roomName ) } })
                    if( portal ){
                        squad3.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                }
                else{
                    squad3.moveTo(creep.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 1, priority: 1 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }

                // squad 4
                if( creep.pos.roomName != squad4.pos.roomName ){
                    squad4.memory.static_cnt = 0
                    var portal = squad4.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >=2 && structure.pos.y >=2 && structure.pos.x <=48 && structure.pos.y <=48 && !structure.destination.shard && structure.destination.roomName==creep.pos.roomName ) } })
                    if( portal ){
                        squad4.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                }
                else{
                    squad4.moveTo(creep.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 2, priority: 1 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                }

                const mid_pos = new RoomPosition(24, 24, rm_tgt)
                creep.moveTo(mid_pos, {maxRooms: 20, avoidRooms: avoidRooms_mt, maxOps: 7000, findRoute: true, ignoreRoads: true, range: 23, priority: 100 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

            }
            else if( !avoidRooms_mt || (avoidRooms_mt && avoidRooms_mt.length >= 1 && creep.pos.roomName != avoidRooms_mt[0]) || (avoidRooms_mt && avoidRooms_mt.length == 0) ){

                // formation for close to target rooms
                // else if( Game.map.getRoomLinearDistance(creep.pos.roomName, creep.memory.birth_target) == 1 && !creep.memory.formation ) {
                if( Game.map.getRoomLinearDistance(creep.pos.roomName, creep.memory.birth_target) == 1 && Game.map.findRoute(creep.pos.roomName, creep.memory.birth_target).length == 1 && !creep.memory.formation ) {

                    // squad enter room

                    // check terrain for formation
                    const terrain = Game.rooms[rm].getTerrain();

                    if( creep.pos.x == 49 || creep.pos.x == 48 ){
                        if( terrain.get(49,creep.pos.y+1) != TERRAIN_MASK_WALL ){
                            var x = -1
                            var y =  1
                        }
                        else if( terrain.get(49,creep.pos.y-1) != TERRAIN_MASK_WALL ){
                            var x = -1
                            var y = -1
                        }

                        // move
                        if( creep.pos.x == 49 ){
                            creep.memory.x_rm_enter = creep.pos.x
                            creep.memory.y_rm_enter = creep.pos.y
                        }

                        var x_capt = creep.memory.x_rm_enter
                        var y_capt = creep.memory.y_rm_enter

                        var mid_pos2 = new RoomPosition(x_capt+x, y_capt, rm)
                         creep.moveTo(mid_pos2, {maxRooms: 2, maxOps: 1000, ignoreRoads: true, range: 0, priority: 99103 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var mid_pos2 = new RoomPosition(x_capt+x, y_capt+y, rm)
                        squad2.moveTo(mid_pos2, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 99102 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var mid_pos2 = new RoomPosition(x_capt, y_capt, rm)
                        squad3.moveTo(mid_pos2, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 99101 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var mid_pos2 = new RoomPosition(x_capt, y_capt+y, rm)
                        squad4.moveTo(mid_pos2, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 99100 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        // formation type
                        if( creep.pos.x == 48 && creep.pos.roomName == squad4.pos.roomName) {
                            if( y == 1 ){
                                creep.memory.formation = 4
                            }
                            else if ( y == -1 ){
                                creep.memory.formation = 3
                            }
                        }

                    }
                    else if( creep.pos.x == 0 || creep.pos.x == 1 ){
                        if( terrain.get(0,creep.pos.y+1) != TERRAIN_MASK_WALL ){
                            var x =  1
                            var y =  1
                        }
                        else if( terrain.get(0,creep.pos.y-1) != TERRAIN_MASK_WALL ){
                            var x =  1
                            var y = -1
                        }

                        // move
                        if( creep.pos.x == 0 ){
                            creep.memory.x_rm_enter = creep.pos.x
                            creep.memory.y_rm_enter = creep.pos.y
                        }

                        var x_capt = creep.memory.x_rm_enter
                        var y_capt = creep.memory.y_rm_enter

                        var mid_pos2 = new RoomPosition(x_capt+x, y_capt, rm)
                         creep.moveTo(mid_pos2, {maxRooms: 2, maxOps: 1000, ignoreRoads: true, range: 0, priority: 99103 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var mid_pos2 = new RoomPosition(x_capt+x, y_capt+y, rm)
                        squad2.moveTo(mid_pos2, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 99102 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var mid_pos2 = new RoomPosition(x_capt, y_capt, rm)
                        squad3.moveTo(mid_pos2, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 99101 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var mid_pos2 = new RoomPosition(x_capt, y_capt+y, rm)
                        squad4.moveTo(mid_pos2, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 99100 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        // formation type
                        if( creep.pos.x == 1 && creep.pos.roomName == squad4.pos.roomName) {
                            if( y == 1 ){
                                creep.memory.formation = 1
                            }
                            else if ( y == -1 ){
                                creep.memory.formation = 2
                            }
                        }
                    }
                    else if( creep.pos.y == 49 || creep.pos.y == 48 ){
                        if( terrain.get(creep.pos.x+1,49) != TERRAIN_MASK_WALL ){
                            var x =  1
                            var y = -1
                        }
                        else if( terrain.get(creep.pos.x-1,49) != TERRAIN_MASK_WALL ){
                            var x = -1
                            var y = -1
                        }

                        // move
                        if( creep.pos.y == 49 ){
                            creep.memory.x_rm_enter = creep.pos.x
                            creep.memory.y_rm_enter = creep.pos.y
                        }

                        var x_capt = creep.memory.x_rm_enter
                        var y_capt = creep.memory.y_rm_enter

                        var mid_pos2 = new RoomPosition(x_capt, y_capt+y, rm)
                         creep.moveTo(mid_pos2, {maxRooms: 2, maxOps: 1000, ignoreRoads: true, range: 0, priority: 99103 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var mid_pos2 = new RoomPosition(x_capt+x, y_capt+y, rm)
                        squad2.moveTo(mid_pos2, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 99102 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var mid_pos2 = new RoomPosition(x_capt, y_capt, rm)
                        squad3.moveTo(mid_pos2, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 99101 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var mid_pos2 = new RoomPosition(x_capt+x, y_capt, rm)
                        squad4.moveTo(mid_pos2, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 99100 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        // formation type
                        if( creep.pos.y == 48 && creep.pos.roomName == squad4.pos.roomName) {
                            if( x == 1 ){
                                creep.memory.formation = 4
                            }
                            else if ( x == -1 ){
                                creep.memory.formation = 1
                            }
                        }

                    }
                    else if( creep.pos.y == 0 ||creep.pos.y == 1 ){
                        if( terrain.get(creep.pos.x+1,0) != TERRAIN_MASK_WALL ){
                            var x =  1
                            var y =  1
                        }
                        else if( terrain.get(creep.pos.x-1,0) != TERRAIN_MASK_WALL ){
                            var x = -1
                            var y =  1
                        }

                        // move
                        if( creep.pos.y == 0 ){
                            creep.memory.x_rm_enter = creep.pos.x
                            creep.memory.y_rm_enter = creep.pos.y
                        }

                        var x_capt = creep.memory.x_rm_enter
                        var y_capt = creep.memory.y_rm_enter

                        var mid_pos2 = new RoomPosition(x_capt, y_capt+y, rm)
                         creep.moveTo(mid_pos2, {maxRooms: 2, maxOps: 1000, ignoreRoads: true, range: 0, priority: 99103 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var mid_pos2 = new RoomPosition(x_capt+x, y_capt+y, rm)
                        squad2.moveTo(mid_pos2, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 99102 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var mid_pos2 = new RoomPosition(x_capt, y_capt, rm)
                        squad3.moveTo(mid_pos2, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 99101 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var mid_pos2 = new RoomPosition(x_capt+x, y_capt, rm)
                        squad4.moveTo(mid_pos2, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 99100 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        // formation type
                        if( creep.pos.y == 1 && creep.pos.roomName == squad4.pos.roomName) {
                            if( x == 1 ){
                                creep.memory.formation = 3
                            }
                            else if ( x == -1 ){
                                creep.memory.formation = 2
                            }
                        }
                    }
                    else{
                        creep.memory.formation = 1
                        creep.say('o1')
                        console.log('exeption on forming quads')
                    }



                }
                // move in line for further rooms
                else if( !creep.memory.formation ){
                //if( Game.map.getRoomLinearDistance(creep.pos.roomName, creep.memory.birth_target) > 1 ){
                // if( Game.map.findRoute(creep.pos.roomName, creep.memory.birth_target).length  > 1 ){

                    // if( creep.fatigue == 0 && squad2.fatigue == 0 && squad3.fatigue == 0  && squad4.fatigue == 0   ){
                    if( creep.fatigue == 0  ){

                        if( Game.time % 7 == 0 ){
                            var squad_cnt = creep.pos.findInRange(FIND_MY_CREEPS, 3);
                            var rng = 1
                            if( squad_cnt.length == 4 ){
                                var rng = 0
                                const mid_pos = new RoomPosition(24, 24, rm_tgt)
                                creep.moveTo(mid_pos, {maxRooms: 20, avoidRooms: avoidRooms_mt, maxOps: 7000, findRoute: true, ignoreRoads: true, range: 23, priority: 100 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }
                        }
                        else {
                            var rng = 0
                            const mid_pos = new RoomPosition(24, 24, rm_tgt)
                            creep.moveTo(mid_pos, {maxRooms: 20, avoidRooms: avoidRooms_mt, maxOps: 7000, findRoute: true, ignoreRoads: true, range: 23, priority: 100 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }

                        squad2.moveTo(creep.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: rng, priority: 101 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        squad3.moveTo(squad2.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: rng, priority: 102 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        squad4.moveTo(squad3.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: rng, priority: 103 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                    }
                    else{
                        // wait fatigue - capt dont move
                        squad2.moveTo(creep.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 1, priority: 101 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        squad3.moveTo(squad2.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 1, priority: 102 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        squad4.moveTo(squad3.pos, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 1, priority: 103 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                }
            }
        }

        if( creep.memory.formation && 1 == 1 ){

            // plot +20 CPU
            if( 1 == 11 ){
                if( !Game.rooms[ rm ].memory.savedMatrix  ){
                    FunctionCostMatrix.run( creep.pos.roomName )
                }
                else{
                    var cost = PathFinder.CostMatrix.deserialize( Game.rooms[ creep.pos.roomName ].memory.savedMatrix )
                }

                if( Game.time%2 == 0 || 1 == 1){
                    for( var x = 0 ; x <= 49 ; x++ ) {
                        for( var y = 0 ; y <= 49 ; y++) {
                            function rgbToHex(r, g, b) {return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }
                            var colour = rgbToHex(cost.get(x,y),cost.get(x,y),255)
                            Game.rooms[rm].visual.circle(x,y, {fill: colour, radius: 0.55, opacity: 0.1 } );
                            Game.rooms[rm].visual.text(cost.get(x,y), x, y, {color: 'black', font: 0.2});
                        }
                    }
                }
            }


            // define target
            if( rm != rm_tgt ){
                var mid_pos = new RoomPosition(24, 24, rm_tgt )
            }
            else {

                var enemies = FunctionCreepTarget.run(creep)

                if( enemies ){
                    var mid_pos =enemies.pos
                }
                else{
                    if( Game.rooms[ rm ].controller ){
                        var mid_pos = Game.rooms[ rm ].controller.pos
                    }
                    else{
                        var mid_pos = new RoomPosition(24, 24, rm )
                    }
                }
            }


            // search path
            if( creep.pos.roomName == rm_tgt ){
                var max     = 1
                var rng     = 1
            }
            else {
                var max     = 5
                var rng     = 24
            }

            if( !mid_pos ){ var mid_pos = creep.pos }

            var path_to_road = PathFinder.search(creep.pos, [{pos:mid_pos, range:rng}], {maxRooms: max,

                                        roomCallback: function() {

                                            let room = Game.rooms[rm];
                                            if (!room) return;

                                            if( !Game.rooms[ rm ].memory.savedMatrix  ){
                                                FunctionCostMatrix.run( rm )
                                                var cost = PathFinder.CostMatrix.deserialize( Game.rooms[ rm ].memory.savedMatrix )
                                            }
                                            else{
                                                var cost = PathFinder.CostMatrix.deserialize( Game.rooms[ rm ].memory.savedMatrix )
                                            }

                                            let costs = cost

                                            var buildings =  room.find(FIND_STRUCTURES)

                                            var max_hits = 300000000

                                            buildings.forEach(function(struct) {
                                                if ( ( struct.structureType === STRUCTURE_RAMPART && !struct.my ) || struct.structureType === STRUCTURE_WALL ) {

                                                    var cur_cost = costs.get(struct.pos.x, struct.pos.y)

                                                    if( cur_cost == 255 ){
                                                        // do nothing
                                                    }
                                                    else if( cur_cost <= 17 ){
                                                        costs.set(struct.pos.x, struct.pos.y, (Math.ceil( struct.hits/max_hits ) * 200) + 20 );

                                                        var xx = struct.pos.x
                                                        var yy = struct.pos.y

                                                        if( costs.get(xx-1, yy+0) == 17 ){ costs.set(xx-1, yy+0, 255) } else if( costs.get(xx-1, yy+0) < 17 ) { costs.set(xx-1, yy+0, 5) }
                                                        if( costs.get(xx+1, yy+0) == 17 ){ costs.set(xx+1, yy+0, 255) } else if( costs.get(xx+1, yy+0) < 17 ) { costs.set(xx+1, yy+0, 5) }
                                                        if( costs.get(xx+0, yy-1) == 17 ){ costs.set(xx+0, yy-1, 255) } else if( costs.get(xx+0, yy-1) < 17 ) { costs.set(xx+0, yy-1, 5) }
                                                        if( costs.get(xx+0, yy+1) == 17 ){ costs.set(xx+0, yy+1, 255) } else if( costs.get(xx+0, yy+1) < 17 ) { costs.set(xx+0, yy+1, 5) }
                                                    }
                                                    else if( cur_cost >= 20 ){

                                                        var cur_cost = cur_cost + (Math.ceil( struct.hits/max_hits ) * 200)

                                                        if( cur_cost > 220 ){
                                                            var cur_cost = 220
                                                        }

                                                        costs.set(struct.pos.x, struct.pos.y, cur_cost );
                                                    }
                                                }
                                            });


                                            // avoid creeps in the room
                                            room.find(FIND_CREEPS).forEach(function(creep2) {
                                                if( creep2.my && creep2.memory.squad_number && creep2.memory.squad_number == creep.memory.squad_number ){
                                                    // ok
                                                }
                                                else if( !creep2.my ){
                                                    // ok - bump and kill
                                                }
                                                else {
                                                    var xx = creep2.pos.x
                                                    var yy = creep2.pos.y

                                                    costs.set(xx, yy, 255);

                                                    if( xx > 0 && xx < 49 && yy > 0 && yy < 49 ){
                                                        if( costs.get(xx-1, yy+0) == 17 ){ costs.set(xx-1, yy+0, 255) } else if( costs.get(xx-1, yy+0) < 17 ) { costs.set(xx-1, yy+0, 17) }
                                                        if( costs.get(xx+1, yy+0) == 17 ){ costs.set(xx+1, yy+0, 255) } else if( costs.get(xx+1, yy+0) < 17 ) { costs.set(xx+1, yy+0, 17) }
                                                        if( costs.get(xx+0, yy-1) == 17 ){ costs.set(xx+0, yy-1, 255) } else if( costs.get(xx+0, yy-1) < 17 ) { costs.set(xx+0, yy-1, 17) }
                                                        if( costs.get(xx+0, yy+1) == 17 ){ costs.set(xx+0, yy+1, 255) } else if( costs.get(xx+0, yy+1) < 17 ) { costs.set(xx+0, yy+1, 17) }
                                                    }
                                                }
                                            });

                                            //pos avoid
                                            if( creep.memory.next_x >= 0 && creep.memory.next_y >= 0 ){
                                                if( creep.memory.next_x <= 48 ){ costs.set(creep.memory.next_x+1, creep.memory.next_y, 255) }
                                                if( creep.memory.next_x >=  1 ){ costs.set(creep.memory.next_x-1, creep.memory.next_y, 255) }
                                                if( creep.memory.next_y <= 48 ){ costs.set(creep.memory.next_x, creep.memory.next_y+1, 255) }
                                                if( creep.memory.next_y >=  1 ){ costs.set(creep.memory.next_x, creep.memory.next_y-1, 255) }
                                            }


                                            // avoid previous positions so it doesnt move back and forth
                                            if( costs.get(creep.memory.pos_1_xx, creep.memory.pos_1_yy) < 200 ){ costs.set(creep.memory.pos_1_xx, creep.memory.pos_1_yy, 200) }
                                            if( costs.get(creep.memory.pos_2_xx, creep.memory.pos_2_yy) < 200 ){ costs.set(creep.memory.pos_2_xx, creep.memory.pos_1_yy, 200) }
                                            if( costs.get(creep.memory.pos_3_xx, creep.memory.pos_3_yy) < 200 ){ costs.set(creep.memory.pos_3_xx, creep.memory.pos_1_yy, 200) }

                                            return costs;
                                          },
                                        }

                                    ).path



            // check if rotation is needed
            if( creep.fatigue == 0 && squad2.fatigue == 0 && squad3.fatigue == 0 && squad4.fatigue == 0 &&
                creep.getActiveBodyparts(MOVE)>=1 && squad2.getActiveBodyparts(MOVE)>=1 && squad3.getActiveBodyparts(MOVE)>=1 && squad4.getActiveBodyparts(MOVE)>=1 ){


                 var direction = creep.pos.getDirectionTo(path_to_road[0])
                var ok = 1

                if( creep.memory.formation == 1 ){
                    if(  direction == 1 || direction == 2 || direction == 3  ||
                       ( ( creep.pos.y == 1 || creep.pos.y == 0  || creep.pos.y == 49 ) && ( direction == 8 || direction == 1 || direction == 2  ) ) ||
                       ( ( creep.pos.x == 48|| creep.pos.x == 49 || creep.pos.x == 0  ) && ( direction == 2 || direction == 3 || direction == 4  ) )  ){
                        var ok = 1
                        if( creep.pos.y == 1 || creep.pos.y == 0 || creep.pos.y == 49 ){
                            var ok = 0
                             creep.move( 1 )
                            squad2.move( 1 )
                            squad3.move( 1 )
                            squad4.move( 1 )
                        }
                        else if( creep.pos.x == 48 || creep.pos.x == 49 || creep.pos.x == 0 ){
                            var ok = 0
                             creep.move( 3 )
                            squad2.move( 3 )
                            squad3.move( 3 )
                            squad4.move( 3 )
                        }
                    }
                    else if( direction == 3 || direction == 4 || direction == 5 ){
                        var ok = 0
                        creep.memory.formation = 2
                         creep.move( 5 )
                        squad2.move( 3 )
                        squad3.move( 7 )
                        squad4.move( 1 )
                    }
                    else if( direction == 5 || direction == 6 || direction == 7 ){
                        var ok = 0
                        creep.memory.formation = 3
                         creep.move( 6 )
                        squad2.move( 4 )
                        squad3.move( 8 )
                        squad4.move( 2 )
                    }
                    else if( direction == 7 || direction == 8 || direction == 1 ){
                        var ok = 0
                        creep.memory.formation = 4
                         creep.move( 7 )
                        squad2.move( 5 )
                        squad3.move( 1 )
                        squad4.move( 3 )
                    }
                }
                else if( creep.memory.formation == 2 ){
                    if( direction == 3 || direction == 4 || direction == 5 ||
                      ( ( creep.pos.x == 48 || creep.pos.x == 49 || creep.pos.x == 0 ) && ( direction == 2 || direction == 3 || direction == 4  ) ) ||
                      ( ( creep.pos.y == 48 || creep.pos.y == 49 || creep.pos.y == 0 ) && ( direction == 4 || direction == 5 || direction == 6  ) ) ){
                        var ok = 1
                        if( creep.pos.x == 48 || creep.pos.x == 49 || creep.pos.x == 0  ){
                            var ok = 0
                             creep.move( 3 )
                            squad2.move( 3 )
                            squad3.move( 3 )
                            squad4.move( 3 )
                        }
                        else if( creep.pos.y == 48 || creep.pos.y == 49 || creep.pos.y == 0 ){
                            var ok = 0
                             creep.move( 5 )
                            squad2.move( 5 )
                            squad3.move( 5 )
                            squad4.move( 5 )
                        }
                    }
                    else if( direction == 1 || direction == 2 || direction == 3 ){
                        var ok = 0
                        creep.memory.formation = 1
                         creep.move( 1 )
                        squad2.move( 7 )
                        squad3.move( 3 )
                        squad4.move( 5 )
                    }
                    else if( direction == 5 || direction == 6 || direction == 7 ){
                        var ok = 0
                        creep.memory.formation = 3
                         creep.move( 7 )
                        squad2.move( 5 )
                        squad3.move( 1 )
                        squad4.move( 3 )
                    }
                    else if( direction == 7 || direction == 8 || direction == 1 ){
                        var ok = 0
                        creep.memory.formation = 4
                         creep.move( 8 )
                        squad2.move( 6 )
                        squad3.move( 2 )
                        squad4.move( 4 )
                    }
                }
                else if( creep.memory.formation == 3 ){
                    if( direction == 5 || direction == 6 || direction == 7 ||
                      ( ( creep.pos.y == 48 || creep.pos.y == 49 || creep.pos.y == 0  ) && ( direction == 4 || direction == 5 || direction == 6  ) ) ||
                      ( ( creep.pos.x == 0  || creep.pos.x == 1  || creep.pos.x == 49 ) && ( direction == 6 || direction == 7 || direction == 8  ) ) ){
                        var ok = 1
                        if( creep.pos.y == 48 || creep.pos.y == 49 || creep.pos.y == 0 ){
                            var ok = 0
                             creep.move( 5 )
                            squad2.move( 5 )
                            squad3.move( 5 )
                            squad4.move( 5 )
                        }
                        else if( creep.pos.x == 0  || creep.pos.x == 1 || creep.pos.x == 49 ){
                            var ok = 0
                             creep.move( 7 )
                            squad2.move( 7 )
                            squad3.move( 7 )
                            squad4.move( 7 )
                        }
                    }
                    else if( direction == 1 || direction == 2 || direction == 3 ){
                        var ok = 0
                        creep.memory.formation = 1
                         creep.move( 2 )
                        squad2.move( 8 )
                        squad3.move( 4 )
                        squad4.move( 6 )
                    }
                    else if( direction == 3 || direction == 4 || direction == 5 ){
                        var ok = 0
                        creep.memory.formation = 2
                         creep.move( 3 )
                        squad2.move( 1 )
                        squad3.move( 5 )
                        squad4.move( 7 )
                    }
                    else if( direction == 7 || direction == 8 || direction == 1 ){
                        var ok = 0
                        creep.memory.formation = 4
                         creep.move( 1 )
                        squad2.move( 7 )
                        squad3.move( 3 )
                        squad4.move( 5 )
                    }
                }
                else if( creep.memory.formation == 4 ){
                    if( direction == 7 || direction == 8 || direction == 1 ||
                      ( ( creep.pos.x == 0 || creep.pos.x == 1 || creep.pos.x == 49 ) && ( direction == 6 || direction == 7 || direction == 8 ) ) ||
                      ( ( creep.pos.y == 0 || creep.pos.y == 1 || creep.pos.y == 49 ) && ( direction == 8 || direction == 1 || direction == 2 ) ) ){
                        var ok = 1
                        if( creep.pos.x == 0 || creep.pos.x == 1 || creep.pos.x == 49 ){
                            var ok = 0
                             creep.move( 7 )
                            squad2.move( 7 )
                            squad3.move( 7 )
                            squad4.move( 7 )
                        }
                        else if( creep.pos.y == 0 || creep.pos.y == 1 || creep.pos.y == 49 ){
                            var ok = 0
                             creep.move( 1 )
                            squad2.move( 1 )
                            squad3.move( 1 )
                            squad4.move( 1 )
                        }
                    }
                    else if( direction == 1 || direction == 2 || direction == 3 ){
                        var ok = 0
                        creep.memory.formation = 1
                         creep.move( 3 )
                        squad2.move( 1 )
                        squad3.move( 5 )
                        squad4.move( 7 )
                    }
                    else if( direction == 3 || direction == 4 || direction == 5 ){
                        var ok = 0
                        creep.memory.formation = 2
                         creep.move( 4 )
                        squad2.move( 2 )
                        squad3.move( 6 )
                        squad4.move( 8 )
                    }
                    else if( direction == 5 || direction == 6 || direction == 7 ){
                        var ok = 0
                        creep.memory.formation = 3
                         creep.move( 5 )
                        squad2.move( 3 )
                        squad3.move( 7 )
                        squad4.move( 1 )
                    }
                }

                // add position to restrion list to avoid rotaing back and forth
                if( ok == 0 ){
                    creep.memory.next_x = path_to_road[0].x
                    creep.memory.next_y = path_to_road[0].y
                }
                else {
                    creep.memory.next_x = null
                    creep.memory.next_y = null
                }

                // block diagonal movement on room change
                if( rm != rm_tgt && path_to_road[0] && path_to_road[1] ){
                    if( path_to_road[0].roomName != path_to_road[1].roomName ){
                        var dd = creep.pos.getDirectionTo( path_to_road[0].x, path_to_road[0].y )
                        if( dd == 2 || dd == 4 || dd == 6 || dd == 8 ){
                            creep.memory.next_x = path_to_road[0].x
                            creep.memory.next_y = path_to_road[0].y
                            var ok = 0
                        }
                    }
                }


            }
            else{
                var ok = -1
            }



            // move
            if( ok == 1 && 1 == 1 ){

                // formation definition
                if( creep.memory.formation == 1 ){
                    var formationmatrix = [
                                            [ 0, 0],
                                            [-1, 0],
                                            [ 0, 1],
                                            [-1, 1]
                                          ]
                }
                else if( creep.memory.formation == 2 ){
                    var formationmatrix = [
                                            [ 0, 0],
                                            [ 0,-1],
                                            [-1, 0],
                                            [-1,-1]
                                          ]
                }
                else if( creep.memory.formation == 3 ){
                    var formationmatrix = [
                                            [ 0, 0],
                                            [ 1, 0],
                                            [ 0,-1],
                                            [ 1,-1]
                                          ]
                }
                else if( creep.memory.formation == 4 ){
                    var formationmatrix = [
                                            [ 0, 0],
                                            [ 0, 1],
                                            [ 1, 0],
                                            [ 1, 1]
                                          ]
                }

                for (var i = 0 ; i < formationmatrix.length ; i++){

                    // formation current pos
                    formationmatrix[i][0+2] = formationmatrix[i][0] + creep.pos.x
                    formationmatrix[i][1+2] = formationmatrix[i][1] + creep.pos.y

                    // formation next pos
                    if( path_to_road[0] && path_to_road[0].x && path_to_road[0].y  ){
                        formationmatrix[i][0] = formationmatrix[i][0] + path_to_road[0].x
                        formationmatrix[i][1] = formationmatrix[i][1] + path_to_road[0].y
                    }
                    else{
                        formationmatrix[i][0] = formationmatrix[i][0+2]
                        formationmatrix[i][1] = formationmatrix[i][1+2]
                    }

                    // console.log(i, formationmatrix[i][0], formationmatrix[i][1],formationmatrix[i][2],formationmatrix[i][3] )
                }


                // check next position availability
                var pos_clean = 1
                for (var i = 0 ; i < formationmatrix.length ; i++){

                    if( 1 == 1 ){

                        // creeps
                        var found
                        if( formationmatrix[i][0] >= 0 && formationmatrix[i][0] <= 49 && formationmatrix[i][1] >= 0 && formationmatrix[i][1] <= 49  ){
                            var found = creep.room.lookForAt(LOOK_CREEPS, formationmatrix[i][0], formationmatrix[i][1] );
                        }

                        if( found[0] && found[0].my && found[0].memory.squad_number && found[0].memory.squad_number == creep.memory.squad_number ){
                            // ok
                        }
                        else if( found[0] && !found[0].my ){
                            var pos_clean = 0
                            var pos_block = found[0]
                            var pos_clean2 = 'creep'
                            break
                        }
                        else if( found[0] && found[0].my ){
                            var pos_clean = 0
                            break
                        }

                        // sctructures
                        var found = creep.room.lookForAt(LOOK_STRUCTURES, formationmatrix[i][0], formationmatrix[i][1] );

                        for (var j = 0 ; j < found.length ; j++){
                            if( found[j] && found[j].structureType && ( found[j].structureType == STRUCTURE_ROAD || 
                                                                        found[j].structureType == STRUCTURE_CONTAINER ||
                                                                       (found[j].structureType == STRUCTURE_RAMPART && found[j].my ) ) ){
                                // ok
                            }
                            else if( found[j] ){
                                var pos_clean = 0
                                var pos_block = found[j]
                                var pos_clean2 = 'structure'
                                break
                            }
                        }

                        //break
                        if( pos_clean == 0 ){ break }
                    }
                }


                // check if squad is formed
                var squaded = 1
                if(  creep.pos.x == formationmatrix[0][0+2] &&  creep.pos.y == formationmatrix[0][1+2] &&
                    squad2.pos.x == formationmatrix[1][0+2] && squad2.pos.y == formationmatrix[1][1+2] &&
                    squad3.pos.x == formationmatrix[2][0+2] && squad3.pos.y == formationmatrix[2][1+2] &&
                    squad4.pos.x == formationmatrix[3][0+2] && squad4.pos.y == formationmatrix[3][1+2] ){

                    var squaded = 1
                }
                else{
                    if( Game.time % 7 == 0 ){
                        var squaded = 1
                    }
                    else {
                        var squaded = 0
                    }
                }



                // move
                if( 1 == 1 ){

                    if( creep.fatigue == 0 && squad2.fatigue == 0 && squad3.fatigue == 0 && squad4.fatigue == 0 && squaded == 1 &&
                        creep.getActiveBodyparts(MOVE)>=1 && squad2.getActiveBodyparts(MOVE)>=1 && squad3.getActiveBodyparts(MOVE)>=1 && squad4.getActiveBodyparts(MOVE)>=1 ){

                        if( pos_clean == 1 ){
                            var modifier = 0
                            var next_pos = new RoomPosition(formationmatrix[0][0+modifier], formationmatrix[0][1+modifier], creep.pos.roomName )
                             creep.moveTo(next_pos, {maxRooms: 1, maxOps: 4000, ignoreRoads: true, range: 0, priority: 99100 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                        else{
                            var modifier = 2
                        }

                        if( squad2.pos.roomName == creep.pos.roomName ){
                            var next_pos = new RoomPosition(formationmatrix[1][0+modifier], formationmatrix[1][1+modifier], creep.pos.roomName )
                            squad2.moveTo(next_pos, {maxRooms: 2, maxOps: 1000, ignoreRoads: true, range: 0, priority: 99101 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }

                        if( squad3.pos.roomName == creep.pos.roomName ){
                            var next_pos = new RoomPosition(formationmatrix[2][0+modifier], formationmatrix[2][1+modifier], creep.pos.roomName )
                            squad3.moveTo(next_pos, {maxRooms: 2, maxOps: 1000, ignoreRoads: true, range: 0, priority: 99102 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }

                        if( squad3.pos.roomName == creep.pos.roomName ){
                            var next_pos = new RoomPosition(formationmatrix[3][0+modifier], formationmatrix[3][1+modifier], creep.pos.roomName )
                            squad4.moveTo(next_pos, {maxRooms: 2, maxOps: 1000, ignoreRoads: true, range: 0, priority: 99103 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }

                    }
                    else if( squaded == 0 && creep.pos.x > 0 && creep.pos.x < 49 && creep.pos.y > 0 && creep.pos.y < 49 ){
                        var modifier = 2

                        var next_pos = new RoomPosition(formationmatrix[1][0+modifier], formationmatrix[1][1+modifier], creep.pos.roomName )
                        squad2.moveTo(next_pos, {maxRooms: 2, maxOps: 1000, ignoreRoads: true, range: 0, priority: 99101 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var next_pos = new RoomPosition(formationmatrix[2][0+modifier], formationmatrix[2][1+modifier], creep.pos.roomName )
                        squad3.moveTo(next_pos, {maxRooms: 2, maxOps: 1000, ignoreRoads: true, range: 0, priority: 99102 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        var next_pos = new RoomPosition(formationmatrix[3][0+modifier], formationmatrix[3][1+modifier], creep.pos.roomName )
                        squad4.moveTo(next_pos, {maxRooms: 2, maxOps: 1000, ignoreRoads: true, range: 0, priority: 99103 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                }
            }


            // attack routine
            if( pos_clean == 0 || enemies != null || 1 == 1 ){

                // move diagonal for better possition
                if( creep.memory.static_cnt < 5 && 1 == 1 ){
                    var block_dir = creep.pos.getDirectionTo( pos_block )

                    if( block_dir == 2 || block_dir == 4 || block_dir == 6 || block_dir == 8 ){

                        var block_matrix = [ [8, 0,-1, 1,-1, 1],
                                             [8,-1, 0,-1, 1, 7],
                                             [4, 1, 0, 1, 1, 3],
                                             [4, 0, 1,-1, 1, 5],
                                             [2, 1, 0, 1, 1, 3],
                                             [2, 0,-1,-1,-1, 1],
                                             [6, 0, 1, 1, 1, 5],
                                             [6,-1, 0,-1,-1, 7]
                                           ]

                        for (var i = 0 ; i < block_matrix.length ; i++){

                            var diag = 0

                            if( block_dir == block_matrix[i][0] ){

                                var diag = 1

                                // check structure and creeps
                                var found1 = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos.x+block_matrix[i][1], creep.pos.y+block_matrix[i][2] );
                                var found2 = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos.x+block_matrix[i][3], creep.pos.y+block_matrix[i][4] );
                                var found3 = creep.room.lookForAt(LOOK_CREEPS, creep.pos.x+block_matrix[i][1], creep.pos.y+block_matrix[i][2] );
                                var found4 = creep.room.lookForAt(LOOK_CREEPS, creep.pos.x+block_matrix[i][3], creep.pos.y+block_matrix[i][4] );
                                var found  = _.union(found1, found2, found3, found4 )

                                for (var j = 0 ; j < found.length ; j++){
                                    if( found[j] && found[j].structureType && found[j].structureType == STRUCTURE_ROAD ){
                                        // ok
                                    }
                                    if( found[0] && found[0].my && found[0].memory.squad_number && found[0].memory.squad_number == creep.memory.squad_number ){
                                        // ok
                                    }
                                    else if( found[j] ){
                                        var diag = 0
                                        break
                                    }
                                }

                                // check terrain
                                if( diag == 1 ){

                                    var cost = PathFinder.CostMatrix.deserialize( Game.rooms[ rm ].memory.savedMatrix )

                                    if( cost.get( creep.pos.x+block_matrix[i][1], creep.pos.y+block_matrix[i][2] ) != 255 && cost.get( creep.pos.x+block_matrix[i][3], creep.pos.y+block_matrix[i][4] ) != 255 ){
                                        var diag = 0
                                    }
                                }

                                // results
                                if( diag == 1 ){
                                     creep.move( block_matrix[i][5]  )
                                    squad2.move( block_matrix[i][5]  )
                                    squad3.move( block_matrix[i][5]  )
                                    squad4.move( block_matrix[i][5]  )
                                }
                            }
                        }
                    }
                }

                var squad_list = [ creep, squad2, squad3, squad4 ]

                if( Game.rooms[creep.pos.roomName].controller && Game.rooms[creep.pos.roomName].controller.my ){
                    var obj_creep = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4)
                    var obj_struc
                    var attack_structure = 0 
                }
                else{
                    var obj_creep = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4)
                    var obj_struc = creep.pos.findInRange(FIND_STRUCTURES, 4)
                    var attack_structure = 1
                }
                

                for (var i = 0 ; i < squad_list.length ; i++){

                    //
                    if( squad_list[i].getActiveBodyparts(ATTACK) >= 1 ){
                        if( enemies && squad_list[i].pos.inRangeTo(enemies, 1) ){
                            squad_list[i].attack( enemies )
                        }
                        else if( pos_block && squad_list[i].pos.inRangeTo(pos_block, 1) && attack_structure == 1 ){
                            squad_list[i].attack( pos_block )
                        }
                        else{
                            var obj = squad_list[i].pos.findInRange(obj_creep, 1 )
                            if( obj && obj[0] ){
                                squad_list[i].attack( obj[0] )
                            }
                            else {
                                var obj = squad_list[i].pos.findInRange(obj_struc, 1 )
                                if( obj && obj[0] ){
                                    squad_list[i].attack( obj[0] )
                                }
                            }
                        }
                    }

                    //
                    if( squad_list[i].getActiveBodyparts(RANGED_ATTACK) >= 1 ){

                        var obj = squad_list[i].pos.findInRange(obj_creep, 3 )

                        if( obj && obj[0] && obj.length == 1 ){
                            squad_list[i].rangedAttack( obj[0] )
                        }
                        else if( obj && obj[0] && obj.length >= 1 ){
                            squad_list[i].rangedMassAttack( )
                        }
                        else if( enemies && squad_list[i].pos.inRangeTo(enemies, 1) ){
                            if( enemies.structureType && ( enemies.structureType == 'road' || enemies.structureType == STRUCTURE_WALL || enemies.structureType == 'container' ) ){
                                squad_list[i].rangedAttack( enemies )
                            }
                            else {
                                squad_list[i].rangedMassAttack()
                            }
                        }
                        else if( enemies && squad_list[i].pos.inRangeTo(enemies, 3) ){
                            squad_list[i].rangedAttack( enemies )
                        }
                        else if( pos_block && squad_list[i].pos.inRangeTo(pos_block, 1) && attack_structure == 1 ){
                            if( pos_block.structureType && ( pos_block.structureType == 'road' || pos_block.structureType == STRUCTURE_WALL || pos_block.structureType == 'container' ) ){
                                squad_list[i].rangedAttack( pos_block )
                            }
                            else {
                                squad_list[i].rangedMassAttack()
                            }
                        }
                        else if( pos_block && squad_list[i].pos.inRangeTo(pos_block, 3) && attack_structure == 1 ){
                            squad_list[i].rangedAttack( pos_block )
                        }
                        else{
                            var obj = squad_list[i].pos.findInRange(obj_struc, 3 )
                            if( obj && obj[0] ){
                                if( obj[0].structureType && ( obj[0].structureType == 'road' || obj[0].structureType == STRUCTURE_WALL || obj[0].structureType == 'container' ) ){
                                    squad_list[i].rangedAttack( obj[0] )
                                }
                                else {
                                    if( obj.length == 1 ){
                                        squad_list[i].rangedAttack( obj[0] )
                                    }
                                    else{
                                        squad_list[i].rangedMassAttack()
                                    }
                                }
                            }
                        }
                    }

                    //
                    if( squad_list[i].getActiveBodyparts(WORK) >= 1 ){
                        if( enemies && enemies.structureType && squad_list[i].pos.inRangeTo(enemies, 1) ){
                            squad_list[i].dismantle( enemies )
                        }
                        else if( pos_block && pos_block.structureType && squad_list[i].pos.inRangeTo(pos_block, 1) && attack_structure == 1 ){
                            squad_list[i].dismantle( pos_block )
                        }
                        else{
                            var obj = squad_list[i].pos.findInRange(obj_struc, 1 )
                            if( obj && obj[0] ){
                                squad_list[i].dismantle( obj[0] )
                            }
                        }
                    }
                }
            }



            creep.say(creep.memory.formation)


            if( path_to_road[0] ){
                new RoomVisual(rm).poly(path_to_road, {fill: 'aqua'});

                var cpu_check_test = Game.cpu.getUsed() - cpu_check_test
                // console.log('cpu:',cpu_check_test, 'next dir:',direction,'next x:',path_to_road[0].x,'next y:',path_to_road[0].y,'rotaion ok:',ok,'pos_clean:',pos_clean, 'squaded:', squaded )
                // console.log('stringfy' , JSON.stringify(  path_to_road[0] ))
            }


        }











    }
};

module.exports = roleSquad_cpt;
