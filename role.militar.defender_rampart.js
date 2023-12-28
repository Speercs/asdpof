const Pathing = require('pathing');

var roleDefenderRampart = {

    /** @param {Creep} creep **/
    run: function(creep) {

        Game.map.visual.circle(creep.pos, {fill: '#ff0000', radius: 2, stroke: '#ff0000', opacity: 0.9 });

        if( creep.getActiveBodyparts(HEAL) > 0 && creep.hits<creep.hitsMax){
            creep.heal(creep)
        }

        if( creep.pos.roomName == creep.memory.birth ){
            
            if( (!creep.memory.boosted || creep.memory.boosted != 1) && creep.spawning == false ){
                
                var rm = creep.memory.birth
                
                if( Game.rooms[ rm ].memory.intel && 
                    Game.rooms[ rm ].memory.intel.lab && 
                    Game.rooms[rm].memory.intel.lab[3] &&
                    Game.rooms[rm].memory.intel.lab[3].id && 
                    Game.getObjectById( Game.rooms[rm].memory.intel.lab[3].id ) &&
                    ( Game.rooms[ rm ].memory.intel.lab[ 3 ].min == 'UH' || Game.rooms[ rm ].memory.intel.lab[ 3 ].min == 'UH2O' || Game.rooms[ rm ].memory.intel.lab[ 3 ].min == 'XUH2O' ) ){

                    var obj = Game.getObjectById( Game.rooms[rm].memory.intel.lab[3].id )
                    var action = obj.boostCreep(creep)

                    if( action == ERR_NOT_IN_RANGE ){
                        creep.moveTo(obj, {range: 1, priority: 10 , visualizePathStyle: {stroke: '#ff0000', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                    else {
                        creep.memory.boosted = 1
                    }
                }
                else {
                    creep.memory.boosted = 1
                }
            }
            
            
            if( creep.memory.boosted && creep.memory.boosted == 1 ){
                if( creep.memory.xx_ramp != null ){
    
                    var xx = creep.memory.xx_ramp
                    var yy = creep.memory.yy_ramp
                    var rm = creep.memory.birth
    
                    creep.moveTo(new RoomPosition(xx, yy, rm), {range: 0, swampCost: 15, plainCost:15, maxRooms: 1, visualizePathStyle: {stroke: '#ff0000', opacity: .5, strokeWidth: .1} });
    
                    var enemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
    
                    if ( enemies.length >= 1){
                        if( creep.getActiveBodyparts(ATTACK) > 0 ){
                            creep.attack( enemies[0] )
                        }
                        else if( creep.getActiveBodyparts(RANGED_ATTACK) > 0 ){
                            if( enemies.length >= 2 ){
                                creep.rangedMassAttack( )
                            }
                            else {
                                creep.rangedAttack( enemies[0] )
                            }
                        }
                    }
                    else if ( Game.time % 117 == 0 || creep.ticksToLive < 15 ){
                        var enemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 2);
                        if ( enemies.length >= 1 ){
                            var mel = 0
                            for ( var j = 0 ; j < enemies.length ; j++){
                                var mel = mel + enemies[j].getActiveBodyparts(ATTACK)
                            }
    
                            if(creep.getActiveBodyparts(ATTACK)/7 > mel){
                                creep.moveTo(enemies[0].pos, {range: 1, swampCost: 15, plainCost:15, maxRooms: 1, visualizePathStyle: {stroke: '#ff0000', opacity: .5, strokeWidth: .1} });
                                creep.attack( enemies[0] )
                                creep.rangedAttack( enemies[0] )
                            }
                        }
                    }
                }
                else{
    
                    // random move
                    if( !creep.memory.rand_pos_x ) {
                        creep.memory.rand_pos_x = creep.pos.x
                        creep.memory.rand_pos_y = creep.pos.y
                        creep.memory.rand_cnt = 0
                    }
                    else if( creep.memory.rand_pos_x == creep.pos.x && creep.memory.rand_pos_y == creep.pos.y ) {
                        creep.memory.rand_cnt = creep.memory.rand_cnt + 1
                    }
                    else if( creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49 ) {
                        creep.memory.rand_cnt = creep.memory.rand_cnt + 1
                    }
                    else {
                        creep.memory.rand_cnt = 0
                        creep.memory.rand_pos_x = creep.pos.x
                        creep.memory.rand_pos_y = creep.pos.y
                    }
    
                    if( creep.memory.rand_cnt >= 25 ){
                        var rnd = Math.floor((Math.random() * 8) + 1);
                        creep.move(rnd)
                    }
                }
            }
        }
        else{

            // move back to room
            var xx = 23
            var yy = 23
            var rm = creep.memory.birth

            creep.moveTo(new RoomPosition(xx, yy, rm), {range: 23, visualizePathStyle: {stroke: '#ff0000', opacity: .5, strokeWidth: .1} });

        }
    }
};

module.exports = roleDefenderRampart;