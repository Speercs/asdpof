const Pathing            = require('pathing');
var FunctionBoost        = require('function.boost')
var FunctionManualPath2  = require('function.manual_path2')
var FunctionStaticCount  = require('function.static_count')
//var FunctionCostMatrix   = require('function.cost_matrix')

var FunctionCreepTarget         = require('function.creep_targeting')
var FunctionCreepTargetInRange  = require('function.creep_targeting_inrange')

var MainObserverIntel    = require('main.observer.intel')

var role2aCapt = {

    /** @param {Creep} creep **/
    run: function(creep) {

        pos2 = new RoomPosition(25, 25, creep.memory.birth_target);
        creep.say( creep.memory.birth_target )
        Game.map.visual.circle(creep.pos, {fill: '#d18660', radius: 2, stroke: '#d18660', opacity: 0.9 });
        Game.map.visual.line(creep.pos, pos2,{color: '#d18660', lineStyle: 'dashed', width: 1 });

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

        if( creep.memory.birth_info_5 == 'expansion' ){
            // block center rooms
            if( creep.ticksToLive % 50 == 0 ){

                var rm_sct = creep.pos.roomName

                if( rm_sct.split("E")[0].length == rm_sct.length ){
                    var lon = 'W'
                }
                else{
                    var lon = 'E'
                }

                if( rm_sct.split("N")[0].length == rm_sct.length ){
                    var lat = 'S'
                }
                else{
                    var lat = 'N'
                }

                var split1 = rm_sct.split(lon)[1]
                var split2 = split1.split(lat)

                var lat_coord = split2[1]
                var lon_coord = split2[0]

                for (let y = -6; y <= 6; y++) {
                    for (let x = -6; x <= 6; x++) {

                        var lat_coord = parseInt(split2[1]) + x
                        var lon_coord = parseInt(split2[0]) + y

                        if (  ( lat_coord % 10 == 4 || lat_coord % 10 == 5 || lat_coord % 10 == 6 ) &&
                              ( lon_coord % 10 == 4 || lon_coord % 10 == 5 || lon_coord % 10 == 6 ) ){

                            // var rm_type = 'center'
                            var cnt = creep.memory.avoid_temp.length
                            creep.memory.avoid_temp[cnt] = [lon, lon_coord, lat, lat_coord].join('')

                            delete creep.memory._t
                            delete creep.memory._m

                            //console.log( [lon, lon_coord, lat, lat_coord].join('') )
                        }
                    }
                }
            }
        }
        //



        // power bank variation
        // 0.5  creep created
        // 1.0  creep dead - move to next
        // 2.0  spawn collectors
        // 3.0  power bank destroyed - still spawm collector
        // 4.0  remove from list
        if( creep.ticksToLive < 300 && creep.memory.birth_info_5 == 'power_bank' && creep.memory.power_bank_id && creep.pos.roomName == rm_tgt  ){

            var obj_id = _.findWhere(Memory.powerBanks , {rm_tgt: rm_tgt})

            if( obj_id && Memory.powerBanks[ obj_id.id ].id == obj_id.id ){

                if( Memory.powerBanks[ obj_id.id ].pair1 < 1 ){ Memory.powerBanks[ obj_id.id ].pair1 = 1 }
                else if( Memory.powerBanks[ obj_id.id ].pair2 < 1 ){ Memory.powerBanks[ obj_id.id ].pair2 = 1 }
                else if( Memory.powerBanks[ obj_id.id ].pair3 < 1 ){ Memory.powerBanks[ obj_id.id ].pair3 = 1 }
                else if( Memory.powerBanks[ obj_id.id ].pair4 < 1 ){ Memory.powerBanks[ obj_id.id ].pair4 = 1 }

            }
        }

        if( ( creep.memory.birth_info_5 == 'power_bank' || creep.memory.birth_info_5 == 'power_bank_ok' ) && creep.pos.roomName == rm_tgt && Game.time % 5 == 0 ){

            var obj = Game.rooms[ rm_tgt ].find(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_POWER_BANK  ) } })
            if( obj && obj[0] ){
                creep.memory.power_bank_id = obj[0].id
            }
            else{

                var set = 4

                var ruin = creep.pos.findClosestByRange(FIND_RUINS, {filter: (structure) =>  {return ( structure.store['power'] > 0 ) } })

                if( ruin ){
                    var set = 3
                }
                else {
                    var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (reso) =>  {return (  reso.resourceType == 'power' ) } })

                    if( dropped ){
                        var set = 3
                    }
                    else {
                        var set = 4
                    }
                }

                // search for room
                var obj_id = _.findWhere(Memory.powerBanks , {rm_tgt: rm_tgt})

                if( obj_id && Memory.powerBanks[ obj_id.id ].id == obj_id.id ){

                    if( Memory.powerBanks[ obj_id.id ].pair1 < set ){ Memory.powerBanks[ obj_id.id ].pair1 = set }
                    else if( Memory.powerBanks[ obj_id.id ].pair2 < 1 ){ Memory.powerBanks[ obj_id.id ].pair2 = 1 }
                    else if( Memory.powerBanks[ obj_id.id ].pair3 < 1 ){ Memory.powerBanks[ obj_id.id ].pair3 = 1 }
                    else if( Memory.powerBanks[ obj_id.id ].pair4 < 1 ){ Memory.powerBanks[ obj_id.id ].pair4 = 1 }
                    creep.memory.birth_info_5 = 'power_bank_done'

                }
                //
            }


            var obj = Game.getObjectById( creep.memory.power_bank_id )

            if( obj && obj.hits < 1500000 ){

                var obj_id = _.findWhere(Memory.powerBanks , {rm_tgt: rm_tgt})

                if( obj_id && Memory.powerBanks[ obj_id.id ].id == obj_id.id ){

                    if( Memory.powerBanks[ obj_id.id ].pair1 < 2 ){

                            var obj_capt = Game.rooms[ rm_tgt ].find(FIND_CREEPS, {filter: (creep) =>  {return (  creep.my == true && creep.memory.role == '2a_capt' ) } } )
                            var damage = 0
                            var bodyparts = 0

                            for ( var kk = 0 ; kk < obj_capt.length ; kk++){
                                var damage = damage + obj_capt[kk].ticksToLive * obj_capt[kk].getActiveBodyparts(ATTACK)
                                var bodyparts = bodyparts + obj_capt[kk].getActiveBodyparts(ATTACK)
                            }
                            var damage = damage * 30
                            creep.say( obj.hits / bodyparts / 30 )
                            if( damage > obj.hits * 1.1 && ( obj.hits / bodyparts / 30 ) < 500 ){
                                Memory.powerBanks[ obj_id.id ].pair1 = 2
                                if( Memory.powerBanks[ obj_id.id ].pair2 < 1 ){ Memory.powerBanks[ obj_id.id ].pair2 = 1 }
                                if( Memory.powerBanks[ obj_id.id ].pair3 < 1 ){ Memory.powerBanks[ obj_id.id ].pair3 = 1 }
                                if( Memory.powerBanks[ obj_id.id ].pair4 < 1 ){ Memory.powerBanks[ obj_id.id ].pair4 = 1 }
                            }
                        }
                }
                //
            }
        }
        //



        // check heal boost lvl
        if( !creep.memory.boost_heal ){
            var boost_lvl = _.filter(creep.body, (body) => body.type == 'move'  )[0].boost

            if( boost_lvl == 'XLHO2' ){
                creep.memory.boost_heal = 4
            }
            else if( boost_lvl == 'LHO2' ){
                creep.memory.boost_heal = 3
            }
            else if( boost_lvl == 'LO' ){
                creep.memory.boost_heal = 2
            }
            else{
                creep.memory.boost_heal = 1
            }
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



        // squad action
        if ( creep.memory.boosted == 1 && creep.memory.squaded == 1  ){

            var squad1 = Game.creeps[ creep.memory.squad_creep[0] ]

            // change creep
            if( creep.ticksToLive <= 500 ){
                creep.memory.birth_info_4 = Game.time
                if( squad1 ){ squad1.memory.birth_info_4 = Game.time }
            }

            if( squad1 ){

                // check heal boost lvl
                if( !squad1.memory.boost_heal ){
                    var boost_lvl = _.filter(squad1.body, (body) => body.type == 'move'  )[0].boost

                    if( boost_lvl == 'XLHO2' ){
                        squad1.memory.boost_heal = 4
                    }
                    else if( boost_lvl == 'LHO2' ){
                        squad1.memory.boost_heal = 3
                    }
                    else if( boost_lvl == 'LO' ){
                        squad1.memory.boost_heal = 2
                    }
                    else{
                        squad1.memory.boost_heal = 1
                    }
                }
                //

                var rm     = creep.pos.roomName
                var rm_tgt = rm_tgt

                // HEAL
                var heal_matrix_hits =  [
                                 { pos: 1, creep_obj: creep,  heal_needed: Math.ceil( ( creep.hitsMax -  creep.hits) / 12 /  creep.memory.boost_heal ) + Math.ceil( ( creep.hitsMax -  creep.hits) / 12 /  creep.memory.boost_heal )/100, heal_av:  creep.getActiveBodyparts(HEAL), heal_used: 0 },
                                 { pos: 2, creep_obj: squad1, heal_needed: Math.ceil( (squad1.hitsMax - squad1.hits) / 12 / squad1.memory.boost_heal ) + Math.ceil( (squad1.hitsMax - squad1.hits) / 12 / squad1.memory.boost_heal )/100, heal_av: squad1.getActiveBodyparts(HEAL), heal_used: 0 }
                                ]

                var heal_matrix_heal =  heal_matrix_hits

                var cnt = 0

                while ( cnt < 2 ) {

                    var cnt = cnt + 1
                    var max_heal_needed = _.max(heal_matrix_hits, function( row ){ return row.heal_needed; } )
                    var max_heal_av     = _.max(heal_matrix_heal, function( row ){ return row.heal_av;     } )

                    // heal
                    if( max_heal_av.creep_obj.getActiveBodyparts ( HEAL ) >= 1 && max_heal_av.creep_obj.getActiveBodyparts ( ATTACK ) == 0 ){
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

                            heal_matrix_hits[i].heal_needed = total + remainder / 2
                        }
                    }

                    // remove row from heal matrix
                    var heal_matrix_heal = _.filter(heal_matrix_heal, function( row ){ return row.heal_used == 0 ; } )
                }
                //




                // ENEMIES
                if( creep.pos.roomName == rm_tgt ){

                    var enemies = FunctionCreepTarget.run(creep)

                    if ( enemies ) {

                        FunctionStaticCount.run( creep )

                        //move off room entry
                        if( (  ( creep.pos.x == 1  && creep.pos.roomName == squad1.pos.roomName && squad1.pos.x == 0  ) ||
                               ( creep.pos.x == 48 && creep.pos.roomName == squad1.pos.roomName && squad1.pos.x == 49 ) ||
                               ( creep.pos.y == 1  && creep.pos.roomName == squad1.pos.roomName && squad1.pos.y == 0  ) ||
                               ( creep.pos.y == 48 && creep.pos.roomName == squad1.pos.roomName && squad1.pos.y == 49 )  )  &&
                               ( creep.fatigue == 0 && squad1.fatigue == 0 ) ) {

                            if( Game.time % 3 == 0 ){
                                var delta = 1
                            }
                            else {
                                var delta = -1
                            }

                            if( creep.pos.x == 1 || creep.pos.x == 48 ){
                                const mid_pos1 = new RoomPosition(creep.pos.x, creep.pos.y + delta, creep.pos.roomName )
                                creep.moveTo(mid_pos1, {maxRooms: 1, maxOps: 2000, ignoreCreeps: true, range: 0, priority: 20001 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                const mid_pos2 = new RoomPosition(creep.pos.x, creep.pos.y, creep.pos.roomName )
                                squad1.moveTo(mid_pos2, {maxRooms: 1, maxOps: 2000, ignoreCreeps: true, range: 0, priority: 20000 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }
                            else if( creep.pos.y == 1 || creep.pos.y == 48 ){

                                const mid_pos1 = new RoomPosition(creep.pos.x + delta, creep.pos.y, creep.pos.roomName )
                                creep.moveTo(mid_pos1, {maxRooms: 1, maxOps: 2000, ignoreCreeps: true, range: 0, priority: 20001 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                const mid_pos2 = new RoomPosition(creep.pos.x, creep.pos.y, creep.pos.roomName )
                                squad1.moveTo(mid_pos2, {maxRooms: 1, maxOps: 2000, ignoreCreeps: true, range: 0, priority: 20000 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }
                        }
                        else if( creep.pos.findInRange([squad1],1 ).length >= 1 || ( ( creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49 ) && squad1.fatigue == 0 )){

                            if( creep.fatigue == 0 && squad1.fatigue == 0 && creep.getActiveBodyparts(MOVE) >= 1 && squad1.getActiveBodyparts(MOVE) >= 1 ){

                                var max     = 2
                                if( enemies.ticksToLive ){
                                    var rng     = 0
                                }
                                else{
                                    var rng     = 1
                                }
                                var mid_pos = enemies.pos
                                var squad_number = creep.memory.squad_number

                                var path_to_road = PathFinder.search(creep.pos, [{pos:mid_pos, range:rng}], {maxRooms: max,

                                                roomCallback: function() {

                                                    let room = Game.rooms[rm];
                                                    let costs = new PathFinder.CostMatrix;

                                                    const terrain = Game.map.getRoomTerrain( rm );

                                                    for (var xx = 0 ; xx <= 49 ; xx++){
                                                        for (var yy = 0 ; yy <= 49 ; yy++){

                                                            // swamp
                                                            switch(terrain.get(xx,yy)) {
                                                                case TERRAIN_MASK_WALL:
                                                                    costs.set(xx, yy, 255)
                                                                    break;
                                                                case TERRAIN_MASK_SWAMP:
                                                                    costs.set(xx, yy, 5)
                                                                    break;
                                                                case 0:
                                                                    break;
                                                            }
                                                        }
                                                    }


                                                    var buildings =  room.find(FIND_STRUCTURES)

                                                    var max_hits = _.max(buildings, 'hits').hits

                                                    buildings.forEach(function(struct) {
                                                        if ( struct.structureType != STRUCTURE_CONTAINER && struct.structureType != STRUCTURE_ROAD ) {
                                                            // Can't walk through non-walkable buildings
                                                            if( costs.get(struct.pos.x, struct.pos.y) != 255 ){
                                                                costs.set(struct.pos.x, struct.pos.y, (Math.round(struct.hits/2000000) ) + 45  );
                                                            }
                                                        }
                                                    });

                                                    // avoid creeps in the room
                                                    room.find(FIND_CREEPS).forEach(function(creep2) {

                                                        if( creep2.my && creep2.memory.squad_number == squad_number ){
                                                            costs.set(creep2.pos.x, creep2.pos.y, 0);
                                                        }
                                                        else if( !creep2.my ){
                                                            costs.set(creep2.pos.x, creep2.pos.y, 0);
                                                        }
                                                        else {
                                                            costs.set(creep2.pos.x, creep2.pos.y, 255);
                                                        }
                                                    });

                                                    return costs;
                                                  },
                                                }
                                            ).path



                                if( path_to_road[0] ){

                                    creep.say('enemy')

                                    new RoomVisual(rm).poly(_.filter(path_to_road, (pos) => pos.roomName == creep.pos.roomName ), {fill: 'aqua'});

                                    creep.moveTo(path_to_road[0], {maxRooms: 1, maxOps: 1000, range: 0, priority: 200 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                    squad1.moveTo(creep.pos, {maxRooms: 1, maxOps: 2000, range: 0, priority: 1 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                                else{
                                    squad1.moveTo(creep.pos, {maxRooms: 1, maxOps: 2000, range: 1, priority: 1 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }


                            }
                            else{
                                // move healer
                                if( squad1.fatigue == 0 && squad1.getActiveBodyparts(MOVE) >= 1 ){
                                    squad1.moveTo(creep.pos, {maxRooms: 2, maxOps: 2000, range: 1, priority: 1 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }

                                // wait fatigue
                            }
                        }
                        else {

                            squad1.moveTo(creep.pos, {maxRooms: 2, maxOps: 2000, range: 1, priority: 1 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                        }


                        FunctionCreepTargetInRange.run(enemies, creep)
                        FunctionCreepTargetInRange.run(enemies, squad1)


                    }
                    else{
                        // move mid room
                        if( creep.ticksToLive % 3 == 0 ){
                            if( Game.rooms[rm_tgt].controller ){
                                var mid_pos = Game.rooms[rm_tgt].controller.pos
                            }
                            else{
                                var mid_pos = new RoomPosition(24, 24, rm_tgt)
                            }
                             creep.moveTo( mid_pos , {maxRooms: 1, maxOps: 1000, range: 7, priority: 200 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            squad1.moveTo(creep.pos, {maxRooms: 2, maxOps: 2000, range: 0, priority: 1 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }

                    }
                }
                // MOVE TARGET ROOM
                else {

                    if( Game.rooms[ creep.pos.roomName ].controller && !Game.rooms[ creep.pos.roomName ].controller.my ){
                        if( creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4).length > 0 ||  creep.pos.findInRange(FIND_STRUCTURES, 4).length > 0 ) {
                            var enemies
                            FunctionCreepTargetInRange.run(enemies, creep)
                            FunctionCreepTargetInRange.run(enemies, squad1)
                        }
                    }

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

                    if( portal == 1 && 1==1 ){
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
                            if( creep.fatigue == 0 && squad1.fatigue == 0  ){

                                creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                                const mid_pos1 = new RoomPosition(creep.memory.pos_0_xx, creep.memory.pos_0_yy, creep.memory.pos_0_rm)
                                squad1.moveTo(mid_pos1, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 1 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                            }
                            else{
                                // wait fatigue
                            }
                        }
                    }
                    else if ( creep.pos.roomName != squad1.pos.roomName && Game.map.getRoomLinearDistance(creep.pos.roomName, squad1.pos.roomName) > 1 ){
                        squad1.memory.static_cnt = 0
                        var portal = squad1.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >=2 && structure.pos.y >=2 && structure.pos.x <=48 && structure.pos.y <=48 && !structure.destination.shard && structure.destination.roomName==creep.pos.roomName ) } })
                        if( portal ){
                            squad1.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }

                        const mid_pos = new RoomPosition(24, 24, rm_tgt)
                        creep.moveTo(mid_pos, {maxRooms: 20, avoidRooms: avoidRooms_mt, maxOps: 7000, findRoute: true, ignoreRoads: true, range: 23, priority: 100 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                    }
                    else if( !avoidRooms_mt || (avoidRooms_mt && avoidRooms_mt.length >= 1 && creep.pos.roomName != avoidRooms_mt[0]) || (avoidRooms_mt && avoidRooms_mt.length == 0) ){
                        if( (squad1.pos.x == creep.memory.pos_1_xx && squad1.pos.y == creep.memory.pos_1_yy && squad1.pos.roomName == creep.memory.pos_1_rm) || creep.pos.x >= 48 || creep.pos.x <= 1 || creep.pos.y >= 48 || creep.pos.y <= 1 ){

                            if( creep.fatigue == 0 && squad1.fatigue == 0  ){

                                const mid_pos = new RoomPosition(24, 24, rm_tgt)
                                creep.moveTo(mid_pos, {maxRooms: 20, avoidRooms: avoidRooms_mt, maxOps: 7000, findRoute: true, ignoreRoads: true, range: 23, priority: 100 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                                const mid_pos1 = new RoomPosition(creep.memory.pos_0_xx, creep.memory.pos_0_yy, creep.memory.pos_0_rm)
                                squad1.moveTo(mid_pos1, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 1 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                            }
                            else{
                                // wait fatigue
                            }
                        }
                        else{
                            // exception added to move through swamps
                            if( squad1.pos.findInRange( [creep] , 1).length >= 1 ){
                                if( creep.fatigue == 0 && squad1.fatigue == 0  ){

                                    const mid_pos = new RoomPosition(24, 24, rm_tgt)
                                    creep.moveTo(mid_pos, {maxRooms: 20, avoidRooms: avoidRooms_mt, maxOps: 7000, findRoute: true, ignoreRoads: true, range: 23, priority: 100 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
    
                                    const mid_pos1 = new RoomPosition(creep.memory.pos_0_xx, creep.memory.pos_0_yy, creep.memory.pos_0_rm)
                                    squad1.moveTo(mid_pos1, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 1 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
    
                                }
                            }
                            else{
                                const mid_pos1 = new RoomPosition(creep.memory.pos_1_xx, creep.memory.pos_1_yy, creep.memory.pos_1_rm)
                                squad1.moveTo(mid_pos1, {maxRooms: 2, maxOps: 2000, ignoreRoads: true, range: 0, priority: 1 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }

                            
                        }
                    }
                }
            }
            else{

                creep.memory.squaded        = 0
                creep.memory.squad_number   = null
                creep.memory.squad_creep    = []

                creep.memory.role = 'blinker'

            }
        }



        if( !creep.memory.wait ){
            creep.memory.wait = 0
            creep.memory.avoid_temp = []
        }
        else {
            creep.memory.wait = creep.memory.wait - 1
            creep.memory.avoid_temp = []
        }

        // if( creep.memory.wait> 0   ){
        //     var squad1 = Game.creeps[ creep.memory.squad_creep[0] ]

        //     // heal
        //     if( squad1.hits < squad1.hitsMax ){
        //         squad1.heal(squad1)
        //     }
        //     else{
        //         var hl = squad1.heal(creep)

        //         if( hl == ERR_NOT_IN_RANGE ){
        //             squad1.rangedHeal(creep)
        //         }
        //     }

        //     // move
        //     if( squad1.fatigue == 0 && creep.fatigue == 0 && squad1.getActiveBodyparts(MOVE) > 0 && creep.getActiveBodyparts(MOVE) > 0 ){

        //         FunctionStaticCount.run( creep )

        //         if( creep.memory.birth == 'W61N69'){
        //             var rm_escape = 'E2N68'
        //         }
        //         else if( creep.memory.birth == 'W62N39'){
        //             var rm_escape = 'E2N70'
        //         }

        //         var mid_pos = new RoomPosition(24, 24, rm_escape )
        //         creep.moveTo(mid_pos, {maxOps: 12000, findRoute: true, ignoreRoads: true, range: 22, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
        //         squad1.moveTo(mid_pos, {maxOps: 12000, findRoute: true, ignoreRoads: true, range: 22, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

        //         squad1.memory.avoid_temp = []
        //         creep.memory.avoid_temp = []
        //     }
        // }
        // //


    }
};

module.exports = role2aCapt;
