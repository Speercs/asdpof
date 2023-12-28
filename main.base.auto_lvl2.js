var base1Auto_lvl2= {

    run: function( kk, rm, rm_tgt ) {
        
        // check if scout is alive
        var scout_check = 1
        if( Game.time % ( Memory.config.freq_manager_spawn[8] * 2 ) == 2 ){
            
            var check = _.filter(Game.creeps, (creep) =>    creep.memory.birth          == rm && 
                                                            creep.memory.role           == 'scout_auto' && 
                                                            creep.memory.birth_target   == rm_tgt ).length
            if( check == 0 ){
                var scout_check = 0
            }
        }
        //
        
        if( ( Game.time - Memory.attack_list[kk].detection_tick > 550 ) || scout_check == 0 ){
        
            Memory.attack_list[kk].fixed_threat = Memory.attack_list[kk].fixed_threat + 1000
            Memory.attack_list[kk].threat_lvl   = Math.abs( Memory.attack_list[kk].threat_lvl - 1000/2 )
            Memory.attack_list[kk].attack_level = 0
            Memory.attack_list[kk].creep_count  = 0 
            Memory.attack_list[kk].claim_count  = 0 
            
            Memory.attack_list = _.sortBy(Memory.attack_list, 'threat_lvl') 
        }
    }
};

module.exports = base1Auto_lvl2;