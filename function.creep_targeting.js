
var creep_targeting = {

    run: function(creep) {

        // var rm_tgt = creep.memory.birth_target
        var rm_tgt = creep.pos.roomName
        var rm = creep.memory.birth

        // create phase memory
        if( !creep.memory.target_phase || creep.ticksToLive % 300 == 0 ){
            creep.memory.target_phase = 1
            creep.memory.target_id = null
        }
        //

        // get target id
        if( creep.memory.target_id ){
            var enemies = Game.getObjectById( creep.memory.target_id )
            if( !enemies || enemies == null ){
                creep.memory.target_id = null
            }
        }
        //

        // manual targets
        if( ( !creep.memory.target_id || creep.memory.target_id == null ) && Memory.tgt_list ){

            var tgt_list = Memory.tgt_list

            for (var i = 0 ; i < tgt_list.length ; i++){

                var obj_id = tgt_list[i]
                var obj = Game.getObjectById(obj_id)

                if( obj && obj.pos.roomName == rm_tgt ){

                    var enemies= creep.pos.findClosestByPath([obj]);
                    if (enemies != null ){
                        var enemies = obj
                        break
                    }
                }
            }

            if( enemies ){
                creep.memory.target_id = enemies.id
            }
            else{
                creep.memory.target_phase = 1
            }
        }
        //



        // extension, spawn, tower  without ramparts
        if( creep.memory.target_phase == 1 && ( !creep.memory.target_id || creep.memory.target_id == null ) ){            

            var objs = Game.rooms[rm_tgt].find(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return (      ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                                ( structure.structureType == STRUCTURE_SPAWN ||
                                                                                                                structure.structureType == STRUCTURE_TOWER ||
                                                                                                                structure.structureType == STRUCTURE_STORAGE ||
                                                                                                                structure.structureType == STRUCTURE_TERMINAL ||
                                                                                                                structure.structureType == STRUCTURE_EXTENSION  ) ) } } )
           
            for ( var i = 0 ; i < objs.length ; i++){
                var obj_loop = Game.rooms[rm_tgt].lookForAt(LOOK_STRUCTURES, objs[i] )
                if( obj_loop.length > 1 ){
                    for ( var j = 0 ; j < obj_loop.length ; j++){
                        if( obj_loop[j].structureType == 'rampart' ){
                            objs.splice(i,1)
                            if (i >= 0) { i = i - 1 }
                            break;
                        }
                    }
                }
            }

            if( objs.length > 0 ){
                var enemies = creep.pos.findClosestByPath(objs)
                if( enemies ){
                    creep.memory.target_id = enemies.id
                }
                else{
                    creep.memory.target_phase = 2
                }
            }
            else{

                // strnghold rooms
                if( !Game.rooms[rm_tgt].controller ){
                    var objs = Game.rooms[rm_tgt].find(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return (      ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                            ( structure.structureType == STRUCTURE_INVADER_CORE ||
                                                                                                              structure.structureType == STRUCTURE_TOWER ) ) } } )

                    if( objs.length > 0 ){
                        var enemies = creep.pos.findClosestByPath(objs)
                        if( enemies ){
                            creep.memory.target_id = enemies.id
                        }
                    }
                    else{
                        var objs = Game.rooms[rm_tgt].find(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return (      ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                            ( structure.structureType == STRUCTURE_RAMPART ) ) } } )

                        if( objs.length > 0 ){
                            var enemies = creep.pos.findClosestByPath(objs)
                            if( enemies ){
                                creep.memory.target_id = enemies.id
                            }
                        }
                        else{
                            creep.memory.target_phase = 2
                        }
                    }   
                }
                else{
                    creep.memory.target_phase = 2
                }
            }
        }
        //



        // hostiles creeps without ramparts
        if( creep.memory.target_phase == 2 && ( creep.getActiveBodyparts(ATTACK)>0 || creep.getActiveBodyparts(RANGED_ATTACK)>0 )  && ( !creep.memory.target_id || creep.memory.target_id == null ) ){

            //var objs = Game.rooms[rm_tgt].find(FIND_HOSTILE_CREEPS)

            var objs = Game.rooms[rm_tgt].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  {return (     _.intersection([creep.owner.username], Memory.config.ally_list).length == 0  &&
                                                                                                        creep.pos.x != 0 && creep.pos.x != 49 &&
                                                                                                        creep.pos.y != 0 && creep.pos.y != 49   ) } }   );


            // var objs = Game.rooms[rm_tgt].find(FIND_HOSTILE_CREEPS )

            for ( var i = 0 ; i < objs.length ; i++){
                var obj_loop = Game.rooms[rm_tgt].lookForAt(LOOK_STRUCTURES, objs[i] )
                if( obj_loop.length >= 1 ){
                    for ( var j = 0 ; j < obj_loop.length ; j++){
                        if( obj_loop[j].structureType == 'rampart' ){
                            objs.splice(i,1)
                            if (i >= 0) { i = i - 1 }
                            break;
                        }
                    }
                }
            }

            if( objs.length > 0 ){
                var enemies = creep.pos.findClosestByPath(objs)
                if( enemies ){
                    creep.memory.target_id = enemies.id
                }
                else{
                    creep.memory.target_phase ++
                }
            }
            else{
                creep.memory.target_phase ++
            }
        }
        else if( creep.memory.target_phase == 2 && !( creep.getActiveBodyparts(ATTACK)>0 || creep.getActiveBodyparts(RANGED_ATTACK)>0 ) ){
            creep.memory.target_phase ++
            creep.memory.target_id = null
        }
        //


        // manual targets
        if( creep.memory.target_phase == 3 && ( !creep.memory.target_id || creep.memory.target_id == null ) ){

            var tgt_list = Memory.tgt_list

            for (var i = 0 ; i < tgt_list.length ; i++){

                var obj_id = tgt_list[i]
                var obj = Game.getObjectById(obj_id)

                if( obj && obj.pos.roomName == rm_tgt ){

                    var enemies= creep.pos.findClosestByPath([obj]);
                    if (enemies != null ){
                        var enemies = obj
                        break
                    }
                }
            }

            if( enemies ){
                creep.memory.target_id = enemies.id
            }
            else{
                creep.memory.target_phase ++
            }
        }        
        //








        // clean path to controller
        if( 1 == 11 ){

            var mid_pos = Game.rooms[rm_tgt].controller.pos
            var rng = 1
            var max = 1

            var path_to_road = PathFinder.search(creep.pos, [{pos:mid_pos, range:rng}], {maxRooms: max,

                                    roomCallback: function() {

                                        let room = Game.rooms[rm];
                                        if (!room) return;

                                        if( !room.memory.savedMatrix  ){
                                            FunctionCostMatrix.run( rm )
                                            var cost = PathFinder.CostMatrix.deserialize( room.memory.savedMatrix )
                                        }
                                        else{
                                            var cost = PathFinder.CostMatrix.deserialize( room.memory.savedMatrix )
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

                                        return costs;
                                      },
                                    }

                                ).path

        }









        // spawn with ramparts
        if( creep.memory.target_phase == 4 && ( !creep.memory.target_id || creep.memory.target_id == null ) ){

            var enemies = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return (   ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                                    structure.structureType == STRUCTURE_SPAWN  ) } })

            if( enemies ){
                creep.memory.target_id = enemies.id
            }
            else{
                creep.memory.target_phase ++
            }
        }
        //


        // tower with ramparts
        if( creep.memory.target_phase == 5 && ( !creep.memory.target_id || creep.memory.target_id == null ) ){

            var enemies = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return (   ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                                    structure.structureType == STRUCTURE_TOWER  ) } })

            if( enemies ){
                creep.memory.target_id = enemies.id
            }
            else{
                creep.memory.target_phase ++
            }
        }
        //


        // anything but ramparts and walls and roads without ramparts
        if( creep.memory.target_phase == 6 && ( !creep.memory.target_id || creep.memory.target_id == null ) ){

            if( creep.memory.birth_info_5 == 'power_bank' ){

              var objs = Game.rooms[rm_tgt].find(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return (  ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                              structure.structureType != STRUCTURE_CONTROLLER && structure.structureType != STRUCTURE_WALL  &&
                                                                                                              structure.structureType != STRUCTURE_KEEPER_LAIR  &&
                                                                                                              structure.structureType != STRUCTURE_RAMPART    && structure.structureType != STRUCTURE_ROAD     && structure.structureType != STRUCTURE_CONTAINER  ) } })

            }
            else{

                var objs = Game.rooms[rm_tgt].find(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return (  ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                                structure.structureType != STRUCTURE_CONTROLLER && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_POWER_BANK &&
                                                                                                                structure.structureType != STRUCTURE_KEEPER_LAIR  &&
                                                                                                                structure.structureType != STRUCTURE_RAMPART    && structure.structureType != STRUCTURE_ROAD     && structure.structureType != STRUCTURE_CONTAINER  ) } })
            }

            for ( var i = 0 ; i < objs.length ; i++){
                var obj_loop = Game.rooms[rm_tgt].lookForAt(LOOK_STRUCTURES, objs[i] )
                if( obj_loop.length > 1 ){
                    for ( var j = 0 ; j < obj_loop.length ; j++){
                        if( obj_loop[j].structureType == 'rampart' ){
                            objs.splice(i,1)
                            if (i >= 0) { i = i - 1 }
                            break;
                        }
                    }
                }
            }

            if( objs.length > 0 ){
                var enemies = creep.pos.findClosestByPath(objs)
                if( enemies ){
                    creep.memory.target_id = enemies.id
                }
                else{
                    creep.memory.target_phase ++
                }
            }
            else{
                creep.memory.target_phase ++
            }
        }
        //


        // anything but ramparts and walls
        if( creep.memory.target_phase == 7 && ( !creep.memory.target_id || creep.memory.target_id == null ) ){

            var enemies = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return (   ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                                    structure.structureType != STRUCTURE_CONTROLLER && structure.structureType != STRUCTURE_TERMINAL && structure.structureType != STRUCTURE_STORAGE   && structure.structureType != STRUCTURE_WALL &&
                                                                                                                    structure.structureType != STRUCTURE_KEEPER_LAIR  &&
                                                                                                                    structure.structureType != STRUCTURE_RAMPART    && structure.structureType != STRUCTURE_POWER_BANK && structure.structureType != STRUCTURE_ROAD     && structure.structureType != STRUCTURE_CONTAINER  ) } })
            if( enemies ){
                creep.memory.target_id = enemies.id
            }
            else{
                creep.memory.target_phase ++
            }
        }
        //



        // anything
        if( creep.memory.target_phase == 8 && ( !creep.memory.target_id || creep.memory.target_id == null ) ){

            if( !Game.rooms[rm_tgt].controller ||
               ( Game.rooms[rm_tgt].controller && ( (Game.rooms[rm_tgt].controller.owner       && _.intersection([Game.rooms[rm_tgt].controller.owner.username],       Memory.config.ally_list).length == 0  && Game.rooms[rm_tgt].controller.level > 0 ) ||
                                                    (Game.rooms[rm_tgt].controller.reservation && _.intersection([Game.rooms[rm_tgt].controller.reservation.username], Memory.config.ally_list).length == 0 )  ) ) ){

                var enemies = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                                structure.structureType != STRUCTURE_CONTROLLER &&
                                                                                                                structure.structureType != STRUCTURE_TERMINAL &&
                                                                                                                structure.structureType != STRUCTURE_STORAGE &&
                                                                                                                structure.structureType != STRUCTURE_PORTAL &&
                                                                                                                structure.structureType != STRUCTURE_POWER_BANK &&
                                                                                                                structure.structureType != STRUCTURE_KEEPER_LAIR  &&
                                                                                                                structure.structureType != STRUCTURE_EXTRACTOR  &&
                                                                                                                structure.structureType != STRUCTURE_ROAD ) } })
                if( enemies ){
                    creep.memory.target_id = enemies.id
                }
                else{
                    creep.memory.target_phase ++
                }
            }
            else{
                creep.memory.target_phase ++
            }
        }
        //


        // reset
        if( ( creep.memory.target_phase == 8 || creep.memory.target_phase == 9 ) ){
            if( Game.time % 35 == 0 ){
                creep.memory.target_phase = 0
                creep.memory.target_id = null
            }
        }
        //


        // reset target if it is creep under rampart
        if( creep.ticksToLive % 10 == 0 && creep.memory.target_id && 1==1){

            var obj = Game.getObjectById( creep.memory.target_id )

            if( obj.ticksToLive ){

                var obj_loop = Game.rooms[rm_tgt].lookForAt(LOOK_STRUCTURES, obj )
                if( obj_loop.length > 1 ){
                    for ( var j = 0 ; j < obj_loop.length ; j++){
                        if( obj_loop[j].structureType == 'rampart' ){
                            creep.memory.target_id = null
                            break;
                        }
                    }
                }
            }
        }
        //


        // INRANGE hostiles creeps without ramparts
        if( Game.time % 6 == 1 && creep.memory.target_phase >= 3 &&
            (creep.getActiveBodyparts(ATTACK) > 0 || creep.getActiveBodyparts(RANGED_ATTACK) > 0 ) ){

            // var objs = creep.pos.findInRange(FIND_HOSTILE_CREEPS,8)

            var objs = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 8 , {filter: (creep) =>  {return (  _.intersection( [creep.owner.username], Memory.config.ally_list).length == 0   ) } } );

            for ( var i = 0 ; i < objs.length ; i++){
                var obj_loop = Game.rooms[rm_tgt].lookForAt(LOOK_STRUCTURES, objs[i] )
                if( obj_loop.length >= 1 ){
                    for ( var j = 0 ; j < obj_loop.length ; j++){
                        if( obj_loop[j].structureType == 'rampart' ){
                            objs.splice(i,1)
                            if (i >= 0) { i = i - 1 }
                            break;
                        }
                    }
                }
            }

            if( objs.length > 0 ){
                var enemies2 = creep.pos.findClosestByPath(objs)
                if( enemies2 ){
                    creep.memory.target_id = enemies2.id
                    creep.memory.target_phase = 3
                    var enemies = enemies2
                }
            }
        }
        //


        return enemies;

    }
}

module.exports = creep_targeting;
