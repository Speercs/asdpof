var creep_targeting_inrange = {

    run: function(enemies, creep) {

        var attack_structures = 1
        if( Game.rooms[creep.pos.roomName].controller && ((Game.rooms[creep.pos.roomName].controller.owner       && _.intersection([Game.rooms[creep.pos.roomName].controller.owner.username],       Memory.config.ally_list).length > 0  && Game.rooms[creep.pos.roomName].controller.level > 0 ) ||
                                                          (Game.rooms[creep.pos.roomName].controller.reservation && _.intersection([Game.rooms[creep.pos.roomName].controller.reservation.username], Memory.config.ally_list).length > 0 )  ) ){
            var attack_structures = 0
        }

        // heal
        if( creep.getActiveBodyparts( ATTACK ) == 0 && creep.getActiveBodyparts( HEAL ) > 0 && creep.hits < creep.hitsMax ){
            creep.heal(creep)
        }  

        if( 1 == 1 ){
            // RANGED ATTACK
            if( creep.getActiveBodyparts(RANGED_ATTACK) >= 1 ){

                var inrange3 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3 , {filter: (creep) =>  {return ( _.intersection([creep.owner.username], Memory.config.ally_list).length == 0   ) } } );
                var inrange3_noramp = []
                var inrange3_ramp   = []

                // check for ramparts
                if( inrange3.length >= 1 ){

                    if( creep.getActiveBodyparts( ATTACK ) == 0 && creep.getActiveBodyparts( HEAL ) > 0 ){
                        creep.heal(creep)
                    }

                    for ( var i = 0 ; i < inrange3.length ; i++){
                        var ramp = 0
                        var obj_loop = creep.room.lookForAt(LOOK_STRUCTURES, inrange3[i] )
                        if( obj_loop.length >= 1 ){
                            for ( var j = 0 ; j < obj_loop.length ; j++){
                                if( obj_loop[j].structureType == 'rampart' ){
                                    var ramp = 1
                                    break;
                                }
                            }
                        }
                        //
                        if( ramp == 0 ){
                            inrange3_noramp[inrange3_noramp.length] = inrange3[i]
                        }
                        else{
                            inrange3_ramp[inrange3_ramp.length] = inrange3[i]
                        }
                    }
                }
                //

                // ATTACK
                // ATTACK creeps without ramps
                if( inrange3_noramp.length >= 1 ){

                    // check for MassRA
                    var mass = 0
                    for ( var j = 0 ; j < inrange3_noramp.length ; j++){
                        var rng = Math.max(Math.abs(creep.pos.x-inrange3_noramp[j].pos.x), Math.abs(creep.pos.y-inrange3_noramp[j].pos.y) )
                        if( rng == 1 ){
                            var mass = mass + 10
                        }
                        else if( rng == 2 ){
                            var mass = mass + 4
                        }
                        else if( rng == 3 ){
                            var mass = mass + 1
                        }
                    }
                    //

                    // check for friends on range
                    if( mass >= 10 ){
                        var inrange3_friends = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3, {filter: (creep) =>  {return ( _.intersection([creep.owner.username], Memory.config.ally_list).length > 0 &&
                                                                                                                              ( creep.getActiveBodyparts( ATTACK ) > 0 ||
                                                                                                                                creep.getActiveBodyparts( RANGED_ATTACK ) > 0 ||
                                                                                                                                creep.getActiveBodyparts( HEAL ) > 0  ) ) } } );

                        var mass_friends = 0
                        if( inrange3_friends.length >= 1 ){

                            for ( var j = 0 ; j < inrange3_friends.length ; j++){
                                var rng = Math.max(Math.abs(creep.pos.x-inrange3_friends[j].pos.x), Math.abs(creep.pos.y-inrange3_friends[j].pos.y) )
                                if( rng == 1 ){
                                    var mass_friends = mass_friends + 10
                                }
                                else if( rng == 2 ){
                                    var mass_friends = mass_friends + 4
                                }
                                else if( rng == 3 ){
                                    var mass_friends = mass_friends + 1
                                }
                            }
                        }
                    }
                    //

                    // MassRA
                    if( ( mass >= 10 && mass_friends == 0 ) || ( mass - mass_friends >= 20 ) ){
                        creep.rangedMassAttack();
                    }
                    else{
                        var rnd = Math.floor(Math.random() * inrange3_noramp.length )
                        creep.rangedAttack(inrange3_noramp[rnd])
                    }
                }
                // Ranged ATTACK enemies
                else if( enemies && creep.pos.findInRange([enemies], 1).length >= 1 ){

                    if( enemies.structureType && ( enemies.structureType == 'road' || enemies.structureType == 'container' || enemies.structureType == 'constructedWall' ) ){
                        creep.rangedAttack(enemies)
                    }
                    else{
                        var inrange3_friends = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3, {filter: (creep) =>  {return ( _.intersection([creep.owner.username], Memory.config.ally_list).length > 0 &&
                                                                                                                              ( creep.getActiveBodyparts( ATTACK ) > 0 ||
                                                                                                                                creep.getActiveBodyparts( RANGED_ATTACK ) > 0 ||
                                                                                                                                creep.getActiveBodyparts( HEAL ) > 0  ) ) } } );

                        if( inrange3_friends.length >= 1 ){
                            creep.rangedAttack(enemies)
                        }
                        else{
                            creep.rangedMassAttack()
                        }
                    }
                }
                // Ranged ATTACK enemies
                else if( enemies && creep.pos.findInRange([enemies], 3).length >= 1 ){

                    creep.rangedAttack(enemies)

                }
                // structures
                else{
                    if( attack_structures == 1 ){
                        if( !creep.room.controller || ( creep.room.controller && ( (creep.room.controller.level >= 1 && !creep.room.controller.my ) || ( creep.room.controller.reservation && creep.room.controller.reservation.username != 'asdpof' ) ) ) ){
                            var inrange3_all = creep.pos.findInRange(FIND_STRUCTURES, 3, {filter: (structure) =>  {return (  ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                                          structure.structureType != STRUCTURE_CONTROLLER &&
                                                                                                                          structure.structureType != STRUCTURE_PORTAL
                                                                                                                          ) } })
                          }
                        else{
                            var inrange3_all = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3, {filter: (structure) =>  {return (  ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                                          structure.structureType != STRUCTURE_CONTROLLER &&
                                                                                                                          structure.structureType != STRUCTURE_PORTAL
                                                                                                                          ) } })
                        }

                        var inrange3 = _.filter(inrange3_all, (structure) => structure.structureType != STRUCTURE_RAMPART ) //no ramps

                        var inrange3_noramp = []
                        var inrange3_ramp   = []

                        // check for ramparts
                        if( inrange3.length >= 1 ){

                            for ( var i = 0 ; i < inrange3.length ; i++){
                                var ramp = 0
                                var obj_loop = creep.room.lookForAt(LOOK_STRUCTURES, inrange3[i] )
                                if( obj_loop.length >= 1 ){
                                    for ( var j = 0 ; j < obj_loop.length ; j++){
                                        if( obj_loop[j].structureType == 'rampart' ){
                                            var ramp = 1
                                            break;
                                        }
                                    }
                                }
                                //
                                if( ramp == 0 ){
                                    inrange3_noramp[inrange3_noramp.length] = inrange3[i]
                                }
                                else{
                                    inrange3_ramp[inrange3_ramp.length] = inrange3[i]
                                }
                            }
                        }
                        //

                        // ATTACK structures without ramps
                        if( inrange3_noramp.length >= 1 ){
                            var low = 9999999999
                            // lowest hits
                            for ( var k = 0 ; k < inrange3_noramp.length ; k++){
                                if( inrange3_noramp[k].hits < low ){
                                    var target = inrange3_noramp[k]
                                    var low = inrange3_noramp[k].hits
                                }
                            }
                            creep.rangedAttack(target)
                        }
                        else{
                            var inrange3_ramp = _.filter(inrange3_all, (structure) => structure.structureType -= STRUCTURE_RAMPART )

                            if( inrange3_ramp.length >= 1 ){
                                var low = 9999999999
                                // lowest hits
                                for ( var k = 0 ; k < inrange3_ramp.length ; k++){
                                    if( inrange3_ramp[k].hits < low ){
                                        var target = inrange3_ramp[k]
                                        var low = inrange3_ramp[k].hits
                                    }
                                }
                                creep.rangedAttack(target)
                            }
                        }
                    }
                }
            }
            //


            // ATTACK
            if( creep.getActiveBodyparts(ATTACK) >= 1 ){

                // in RANGE 1
                var inrange1 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1 , {filter: (creep) =>  {return ( _.intersection([creep.owner.username], Memory.config.ally_list).length == 0  ) } } );
                var inrange1_noramp = []
                var inrange1_ramp   = []

                // check for ramparts
                if( inrange1.length >= 1 ){
                    
                    for ( var i = 0 ; i < inrange1.length ; i++){
                        var ramp = 0
                        var obj_loop = creep.room.lookForAt(LOOK_STRUCTURES, inrange1[i] )
                        if( obj_loop.length >= 1 ){
                            for ( var j = 0 ; j < obj_loop.length ; j++){
                                if( obj_loop[j].structureType == 'rampart' ){
                                    var ramp = 1
                                    break;
                                }
                            }
                        }
                        //
                        if( ramp == 0 ){
                            inrange1_noramp[inrange1_noramp.length] = inrange1[i]
                        }
                        else{
                            inrange1_ramp[inrange1_ramp.length] = inrange1[i]
                        }
                    }
                }
                //

                // ATTACK
                // ATTACK creeps without ramps
                if( inrange1_noramp.length >= 1 ){
                  
                    // ATTACK, RA, HEAL
                    var inrange1_noramp_RA_H = _.filter(inrange1_noramp, (creep) => creep.getActiveBodyparts(ATTACK) == 0 &&
                                                                                    (creep.getActiveBodyparts(RANGED_ATTACK) > 0 ||
                                                                                    creep.getActiveBodyparts(HEAL) > 0 ) )

                    if( inrange1_noramp_RA_H.length >= 0 ){  
                        var inrange1_noramp_RA_H = _.filter(inrange1_noramp, (creep) => creep.getActiveBodyparts(ATTACK) == 0 )   
                    }

                    if( inrange1_noramp_RA_H.length >= 1 ){
                        var rnd = Math.floor( Math.random() * inrange1_noramp_RA_H.length )
                        creep.attack(inrange1_noramp_RA_H[rnd])

                        creep.say(inrange1_noramp_RA_H[rnd].name)
                    }
                    else{
                        var inrange1_noramp_A = _.filter(inrange1_noramp, (creep) => creep.getActiveBodyparts(ATTACK) > 0 )

                        if( inrange1_noramp_A.length >= 1 ){
                            if( creep.hits == creep.hitsMax ){
                                
                                var rnd = Math.floor( Math.random() * inrange1_noramp_A.length )
                                creep.attack(inrange1_noramp_A[rnd])
                            }
                            else{
                                // do not attack - backfire
                                creep.heal(creep)
                            }
                        }
                        else{
                            var rnd = Math.floor( Math.random() * inrange1_noramp.length )
                            creep.attack(inrange1_noramp[rnd])
                        }
                    }
                }
                // ATTACK enemies
                else if( enemies && creep.pos.findInRange([enemies], 1).length >= 1 ){  

                    if( creep.hits == creep.hitsMax ){                                
                        creep.attack(enemies)
                    }
                    else{
                        // do not attack - backfire
                        creep.heal(creep)
                    }
                }
                //  Structures
                else{
                    if( attack_structures == 1 ){
                        var inrange1_all = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: (structure) =>  {return (  ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                                      structure.structureType != STRUCTURE_CONTROLLER &&
                                                                                                                      structure.structureType != STRUCTURE_PORTAL
                                                                                                                      ) } })

                        var inrange1 = _.filter(inrange1_all, (structure) => structure.structureType != STRUCTURE_RAMPART ) //no ramps

                        var inrange1_noramp = []
                        var inrange1_ramp   = []

                        // check for ramparts
                        if( inrange1.length >= 1 ){

                            for ( var i = 0 ; i < inrange1.length ; i++){
                                var ramp = 0
                                var obj_loop = creep.room.lookForAt(LOOK_STRUCTURES, inrange1[i] )
                                if( obj_loop.length >= 1 ){
                                    for ( var j = 0 ; j < obj_loop.length ; j++){
                                        if( obj_loop[j].structureType == 'rampart' ){
                                            var ramp = 1
                                            break;
                                        }
                                    }
                                }
                                //
                                if( ramp == 0 ){
                                    inrange1_noramp[inrange1_noramp.length] = inrange1[i]
                                }
                                else{
                                    inrange1_ramp[inrange1_ramp.length] = inrange1[i]
                                }
                            }
                        }
                        //

                        // ATTACK creeps without ramps
                        if( inrange1_noramp.length >= 1 ){
                            var low = 9999999999
                            // lowest hits
                            for ( var k = 0 ; k < inrange1_noramp.length ; k++){
                                if( inrange1_noramp[k].hits < low ){
                                    var target = inrange1_noramp[k]
                                    var low = inrange1_noramp[k].hits
                                }
                            }
                            creep.attack(target)
                        }
                        else{
                            var inrange1_ramp = _.filter(inrange1_all, (structure) => structure.structureType -= STRUCTURE_RAMPART )

                            if( inrange1_ramp.length >= 1 ){
                                var low = 9999999999
                                // lowest hits
                                for ( var k = 0 ; k < inrange1_ramp.length ; k++){
                                    if( inrange1_ramp[k].hits < low ){
                                        var target = inrange1_ramp[k]
                                        var low = inrange1_ramp[k].hits
                                    }
                                }
                                creep.attack(target)
                            }
                        }
                    }
                }
            }
            //


            // WORK
            if( creep.getActiveBodyparts(WORK) >= 1 && attack_structures == 1 ){

                if( enemies && enemies.structureType && creep.pos.findInRange([enemies], 1).length >= 1 ){
                    creep.dismantle(enemies)
                }
                else{

                    var inrange1_all = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: (structure) =>  {return (  ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                                  structure.structureType != STRUCTURE_CONTROLLER &&
                                                                                                                  structure.structureType != STRUCTURE_PORTAL
                                                                                                                  ) } })

                    var inrange1 = _.filter(inrange1_all, (structure) => structure.structureType != STRUCTURE_RAMPART ) //no ramps

                    var inrange1_noramp = []
                    var inrange1_ramp   = []

                    // check for ramparts
                    if( inrange1.length >= 1 ){

                        for ( var i = 0 ; i < inrange1.length ; i++){
                            var ramp = 0
                            var obj_loop = creep.room.lookForAt(LOOK_STRUCTURES, inrange1[i] )
                            if( obj_loop.length >= 1 ){
                                for ( var j = 0 ; j < obj_loop.length ; j++){
                                    if( obj_loop[j].structureType == 'rampart' ){
                                        var ramp = 1
                                        break;
                                    }
                                }
                            }
                            //
                            if( ramp == 0 ){
                                inrange1_noramp[inrange1_noramp.length] = inrange1[i]
                            }
                            else{
                                inrange1_ramp[inrange1_ramp.length] = inrange1[i]
                            }
                        }
                    }
                    //

                    // ATTACK creeps without ramps
                    if( inrange1_noramp.length >= 1 ){
                        var low = 9999999999
                        // lowest hits
                        for ( var k = 0 ; k < inrange1_noramp.length ; k++){
                            if( inrange1_noramp[k].hits < low ){
                                var target = inrange1_noramp[k]
                                var low = inrange1_noramp[k].hits
                            }
                        }
                        creep.dismantle(target)
                    }
                    else{
                        var inrange1_ramp = _.filter(inrange1_all, (structure) => structure.structureType -= STRUCTURE_RAMPART )

                        if( inrange1_ramp.length >= 1 ){
                            var low = 9999999999
                            // lowest hits
                            for ( var k = 0 ; k < inrange1_ramp.length ; k++){
                                if( inrange1_ramp[k].hits < low ){
                                    var target = inrange1_ramp[k]
                                    var low = inrange1_ramp[k].hits
                                }
                            }
                            creep.dismantle(target)
                        }
                    }
                }
            }
            //
        }
    }
}

module.exports = creep_targeting_inrange;
