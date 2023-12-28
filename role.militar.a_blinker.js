// intro
const Pathing            = require('pathing');

var FunctionBoost        = require('function.boost')
var FunctionRetarget     = require('function.retarget')
var FunctionStaticCount  = require('function.static_count')
var FunctionBlockBackRoom= require('function.blockBackRoom')

var FunctionAutoAttackUpdate = require('function.autoAttackUpdate')
var MainObserverIntel    = require('main.observer.intel')

// attack // move intra-room
var FunctionCreepTarget         = require('function.creep_targeting')
var FunctionCreepTargetInRange  = require('function.creep_targeting_inrange')

var FunctionCostMatrixDamageCreeps  = require('function.cost_matrix_damage_creeps')
var FunctionCostMatrixDamageTower   = require('function.cost_matrix_damage_tower')

// move inter-room
var FunctionTravel_1creep= require('function.travel_1creep')


var roleA_blink = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var rm_tgt  = creep.memory.birth_target
        var rm      = creep.memory.birth

        delete Memory.avoidRooms_observer[ rm_tgt ]

        // Boost
        if( creep.memory.boosted != 1 || !creep.memory.boosted ){
            FunctionBoost.run( creep )
        }
        //

        // Re-target
        FunctionRetarget.run( creep )
        //

        // black back room (for no back and forth movement) and safemode checks
        FunctionStaticCount.run( creep )
        FunctionBlockBackRoom.run( creep )
        //

        // auto attack update
        FunctionAutoAttackUpdate.run( creep )
        //

        // update intel
        if( creep.ticksToLive % 151 == 0 ){
            MainObserverIntel.run( rm, rm_tgt )
        }
        //


        // basic-heal
        if( creep.getActiveBodyparts(HEAL) >= 1 ){

            // find if there is tower in the room to pre-heal
            if( !global.rooms[ rm ].towers_tick || global.rooms[ rm ].towers_tick != Game.time ){
                global.rooms[ rm ].towers_tick = Game.time
                global.rooms[ rm ].towers = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return (  ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                              structure.structureType == STRUCTURE_TOWER &&
                                                                                                              structure.store['energy'] > 0
                                                                                                              ) } })
            }
            // pre-heal
            if( global.rooms[ rm ].towers_tick == Game.time && global.rooms[ rm ].towers.length >= 1 && creep.getActiveBodyparts(ATTACK) == 0 && creep.getActiveBodyparts(WORK) == 0 ){
                creep.heal(creep)
            }
            // post-heal
            else if( creep.hits < creep.hitsMax && creep.getActiveBodyparts(ATTACK) == 0 && creep.getActiveBodyparts(WORK) == 0 ) {
                creep.heal(creep)
            }
            else if( ( global.rooms[ rm ].towers_tick == Game.time && global.rooms[ rm ].towers.length >= 1 ) || ( creep.hits < creep.hitsMax ) ) {
                var inrange1 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1 , {filter: (creep) =>  {return ( _.intersection([creep.owner.username], Memory.config.ally_list).length == 0 &&
                                                                                                           ( creep.getActiveBodyparts(ATTACK) > 0 ||
                                                                                                             creep.getActiveBodyparts(RANGED_ATTACK) > 0 ||
                                                                                                             creep.getActiveBodyparts(HEAL) > 0 ) ) } } );
                if( inrange1.length == 0 ){
                    creep.heal(creep)
                }
            }
        }
        //

        // attack
        if (creep.pos.roomName == rm_tgt && creep.memory.boosted == 1 ){

            var enemies = FunctionCreepTarget.run(creep)

            if ( enemies ){

                if( enemies.structureType ){
                    var rng = 1
                }
                else {
                    var rng = 0
                }

                FunctionCostMatrixDamageTower.run( creep.pos.roomName )
                FunctionCostMatrixDamageCreeps.run( creep.pos.roomName )

                if( global.rooms[ creep.pos.roomName ].savedMatrixDamageTower && global.rooms[ creep.pos.roomName ].savedMatrixDamageCreeps && 1==1 ){

                    var terrain = Game.rooms[creep.pos.roomName].getTerrain()

                    var cost1 = global.rooms[ creep.pos.roomName ].savedMatrixDamageTower
                    var cost2 = global.rooms[ creep.pos.roomName ].savedMatrixDamageCreeps

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

                    var scan_rng = 9
                    var x_min = Math.max( 0,  creep.pos.x - scan_rng )
                    var x_max = Math.min( 49, creep.pos.x + scan_rng )
                    var y_min = Math.max( 0,  creep.pos.y - scan_rng )
                    var y_max = Math.min( 49, creep.pos.y + scan_rng )

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
                                    vr.set(x,y, cnt_heal)
                                }
                            }
                        }
                    }

                    var heal_pos = vr.get(creep.pos.x,creep.pos.y)

                    creep.say(heal_pos + ' ' + cnt_heal_creep)

                    if( heal_pos > 0 &&  heal_pos >= cnt_heal_creep && 1==11){
                        creep.moveTo(enemies,  {maxRooms: 1, range:5,   roomCallback: function(roomName) { return vr; }, flee: true, visualizePathStyle: {stroke: '#ff0000', opacity: .5, strokeWidth: .1} });
                    }
                    else{
                        creep.moveTo(enemies,  {maxRooms: 1, range:rng, roomCallback: function(roomName) { return vr; }, visualizePathStyle: {stroke: '#ff0000', opacity: .5, strokeWidth: .1} });

                    }
                }

                FunctionCreepTargetInRange.run(enemies, creep)

            }
            else{
                if( creep.fatigue == 0 && creep.ticksToLive % 5 == 0 ){

                    if( Game.rooms[rm_tgt].controller && !creep.pos.inRangeTo(Game.rooms[rm_tgt].controller, 3) ){
                        creep.moveTo(Game.rooms[rm_tgt].controller,  {maxRooms: 1, range:3, visualizePathStyle: {stroke: '#ff0000', opacity: .5, strokeWidth: .1} });
                    }
                    else if( Game.time % 25 == 0 ){
                        var rnd = Math.floor((Math.random() * 7) + 1);
                        creep.move(rnd)
                    }
                }
            }
        }
        else if( creep.memory.boosted == 1 ){

            FunctionTravel_1creep.run(creep)

        }
        //
    }
};

module.exports = roleA_blink;
