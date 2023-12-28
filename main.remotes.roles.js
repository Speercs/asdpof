// remotes screeps
var roleRemotesScout            = require('role.remotes.scout');
var roleRemotesHarvester_out    = require('role.remotes.harvester_out');
// var roleOutpostHauler           = require('role.outpost.hauler');
var roleRemotesReserver         = require('role.remotes.reserver');

var roleRemotesHauler2           = require('role.remotes.hauler2'); 

var remotesRoles= {

    run: function( creep ) {
        
        var result = 0

        // roles outpost
        if(creep.memory.role == 'scout' ) {
            if( Game.cpu.bucket  > 2000 ){
                roleRemotesScout.run(creep);
                var result = 1
            }
        }
        else if(creep.memory.role == 'harvester_out' ) {
            roleRemotesHarvester_out.run(creep);
            var result = 1
        }
        else if(creep.memory.role == 'hauler_out' ) {
            if( Game.cpu.getUsed() < 450 && Game.cpu.bucket > 2500 ){
                roleRemotesHauler2.run(creep);
                var result = 1
            }  
            else{
                console.log('too MUCH CPU !!!!!!!!!!!!')
            }          
        }
        else if(creep.memory.role == 'reserver' ) {
            roleRemotesReserver.run(creep);
            var result = 1
        }
        // else if(creep.memory.role == 'defender' ) {
        //     roleOutpostDefender.run(creep);
        //     var result = 1
        // }
        
        return result;
    }
};

module.exports = remotesRoles;
