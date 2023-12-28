var FunctionRetarget = {

    run: function(creep,creep2,creep3,creep4,creep5,creep6,creep7,creep8,creep9) {

        if( creep.pos.roomName != rm_tgt ){

            if( !creep.memory.rm_temp && Game.time % 2 == 0 ){

                var bd_at = creep.getActiveBodyparts(ATTACK)
                var bd_ra = creep.getActiveBodyparts(RANGED_ATTACK)

                var en = Game.rooms[creep.pos.roomName].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  {return ( ( creep.getActiveBodyparts(ATTACK) + creep.getActiveBodyparts(RANGED_ATTACK) ) >= Math.floor( (bd_at+bd_ra) / 2 ) ) &&
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

                    var bd_at = creep.getActiveBodyparts(ATTACK)
                    var bd_ra = creep.getActiveBodyparts(RANGED_ATTACK)

                    var en = Game.rooms[creep.pos.roomName].find(FIND_HOSTILE_CREEPS , {filter: (creep) =>  {return ( ( creep.getActiveBodyparts(ATTACK) + creep.getActiveBodyparts(RANGED_ATTACK) ) >= Math.floor( (bd_at+bd_ra) / 2 ) ) &&
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

    }
}

module.exports = FunctionRetarget;
