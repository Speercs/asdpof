// militar
var defenderRampart = require('role.militar.defender_rampart');
var roleDefender    = require('role.militar.defender');

var scoutAuto = require('role.militar.scout_auto');
var controllerDestroy = require('role.militar.controller_destroy');
var controllerReserver  = require('role.militar.controller_reserver');
var controllerAttack = require('role.militar.controller_attack');

var blinker = require('role.militar.a_blinker');

var role2a_capt = require('role.militar.2a_capt');
var role2a_healer = require('role.militar.2a_healer');

var squad = require('role.militar.squad');
var squad_capt = require('role.militar.squad_capt');

var militarRoles= {

    run: function( creep ) {
        
        var result = 0

        // roles outpost
        if( creep.memory.role == 'defender' ) {
            roleDefender.run(creep);
            var result = 1
        }
        else if( creep.memory.role == 'defenderRampart' ) {
            defenderRampart.run(creep);
            var result = 1
        }
        
        // militar
        else if( creep.memory.role == 'scout_auto' ) {
            scoutAuto.run(creep);
            var result = 1
        }
        else if( creep.memory.role == 'controller_destroy' ) {
            controllerDestroy.run(creep);
            var result = 1
        }
        else if( creep.memory.role == 'controller_reserver' ) {
            controllerReserver.run(creep);
            var result = 1
        }
        else if( creep.memory.role == 'controller_att' ) {
            controllerAttack.run(creep);
            var result = 1
        }
        else if( creep.memory.role == 'blinker' ) {
            blinker.run(creep);
            var result = 1
        }
        else if( creep.memory.role == '2a_healer' ) {
            role2a_healer.run(creep);
            var result = 1
        }
        else if( creep.memory.role == '2a_capt' ) {
            role2a_capt.run(creep);
            var result = 1
        }
        else if( creep.memory.role == 'squad' ) {
            if( creep.memory.role2 && creep.memory.role2 == 'squad_cpt' ){
                squad_capt.run(creep);
            }
            else{
                squad.run(creep);
            }            
            var result = 1
        }
        
        return result;
    }
};

module.exports = militarRoles;
