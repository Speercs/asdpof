var roleRemotesReserver = require('role.remotes.reserver');
var MainObserverIntel   = require('main.observer.intel')

var roleAutoReserver = {

    run: function(creep) {
        
        var rm_tgt = creep.memory.birth_target
        var rm     = creep.memory.birth 
        
        // auto-attack life and death update
        if( creep.ticksToLive == 598 ){
            // register birth
            for ( var i = 0 ; i < Memory.attack_list.length ; i++){
                
                if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt ){
                    
                    if( !Memory.attack_list[i].claim_count ){
                        Memory.attack_list[i].claim_count = 1
                    }
                    else{
                        Memory.attack_list[i].claim_count ++
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
                    
                    Memory.attack_list[i].claim_count = Memory.attack_list[i].claim_count - 1
                    break;
                }
            }
        }
        //
        
        roleRemotesReserver.run(creep); 

        //
        if( creep.pos.roomName == rm_tgt && ( !Game.rooms[ rm_tgt ].controller.reservation || ( Game.rooms[ rm_tgt ].controller.reservation && Game.rooms[ rm_tgt ].controller.reservation.username  == 'asdpof' ) ) ){
            
            // sucessfull attack
            for ( var i = 0 ; i < Memory.attack_list.length ; i++){
        
                if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt  ){
                    
                    Memory.attack_list[i].detection_tick  = Game.time
                    MainObserverIntel.run( rm, rm_tgt )
                    break;
                }
            }
            
            // change role
            if( Game.rooms[ rm_tgt ].controller.reservation && Game.rooms[ rm_tgt ].controller.reservation.username  == 'asdpof' && Game.rooms[ rm_tgt ].controller.reservation.ticksToEnd >= 5 ) {
                creep.memory.role = 'controller_destroy'
            }
        }
        //
	}
};

module.exports = roleAutoReserver
