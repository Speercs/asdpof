var MainObserverIntel    = require('main.observer.intel')

var FunctionAutoAttackUpdate = {

    run: function(creep) {

        var rm_tgt  = creep.memory.birth_target
        var rm      = creep.memory.birth

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

        // controller path update
        var rm_tgt  = creep.memory.birth_target

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

    }
}

module.exports = FunctionAutoAttackUpdate;
