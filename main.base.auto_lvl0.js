var base1Auto_lvl0= {

    run: function( kk ) {
        
        // attack if safe mode not active
        if( Memory.attack_list[kk].controller_safe == 0 ){
            
            // attack if scan is not too old
            if( (Game.time - Memory.attack_list[kk].detection_tick) < 40000 && (  !Memory.attack_list[kk].fixed_threat || Memory.attack_list[kk].fixed_threat <= 15000 ) ){
                Memory.attack_list[kk].attack_level = 1
                Memory.attack_list[kk].threat_lvl = - Math.abs( Memory.attack_list[kk].threat_lvl )
            }
            else{
                Memory.attack_list.splice(kk,1)  
            }
        }
        // move safe moded rooms further from the list
        else if( Memory.attack_list[kk].controller_safe > 0 ){
            Memory.attack_list.splice(kk,1)  
        }
        
        Memory.attack_list = _.sortBy(Memory.attack_list, 'threat_lvl')
        
    }
};

module.exports = base1Auto_lvl0;