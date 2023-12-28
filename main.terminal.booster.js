var terminalBooster= {

    run: function( ) {

        // send energy surpplus
        if(  Game.time % 3 == 0 && 1==1){

            var avoid_room = 'W76N49'
            
            var boost_room = 'W2S100008'            
            var boost_room2 = 'W6N1663'
            
            // if( Game.rooms['W18N52'].controller.level < 8 ){
            //     var boost_room = 'W18N52' 
            // }
       
            var obj_mt_rec = []
            var obj_mt_send = []

            for(var name in Game.rooms) {
                rm = name;

                if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].controller.level >= 6 && Game.rooms[rm].terminal && Game.rooms[rm].storage && rm != avoid_room ){

                    var lvl = Game.rooms[rm].controller.level

                    // rooms to receive boost

                    // 0 - room to receive
                    // 1 - priority

                    // room defending
                    if ( ( Game.rooms[rm].memory.mode_defend && Game.rooms[rm].memory.mode_defend == 1 || rm == boost_room || rm == boost_room2 ) &&
                          Game.rooms[rm].terminal.store.getFreeCapacity() >= 35000 && Game.rooms[rm].terminal.store['energy'] < 50000 &&
                          Game.rooms[rm].storage.store['energy'] + Game.rooms[rm].terminal.store['energy'] < ( Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.terminal_rec_defend ) && 
                          Game.rooms[rm].storage.store.getFreeCapacity() >= 100000 ){

                        var cnt = obj_mt_rec.length
                        obj_mt_rec[cnt] = []
                        obj_mt_rec[cnt][0] = rm
                        obj_mt_rec[cnt][1] = 9000 + Game.rooms[rm].storage.store['energy'] / Game.rooms[rm].memory.storage_lvl * 100
                        obj_mt_rec[cnt][2] = 'def1'

                    }
                    else if ( ( ( Game.rooms[rm].memory.mode_nuke && Game.rooms[rm].memory.mode_nuke == 1 ) ||
                           ( Game.rooms[rm].memory.ramp_repairer_need && Game.rooms[rm].memory.ramp_repairer_need == 1 ) ) &&
                          Game.rooms[rm].terminal.store.getFreeCapacity() >= 35000 && Game.rooms[rm].terminal.store['energy'] < 50000 &&
                          Game.rooms[rm].storage.store['energy'] + Game.rooms[rm].terminal.store['energy'] < ( Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.terminal_rec_nuke ) && Game.rooms[rm].storage.store.getFreeCapacity() >= 100000 ){

                        var cnt = obj_mt_rec.length
                        obj_mt_rec[cnt] = []
                        obj_mt_rec[cnt][0] = rm
                        obj_mt_rec[cnt][1] = 10000 + Game.rooms[rm].storage.store['energy'] / Game.rooms[rm].memory.storage_lvl * 100
                        obj_mt_rec[cnt][2] = 'def2'
                    }
                    // room building
                    else if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.construction && Game.rooms[rm].memory.intel.construction.length > 0 &&
                          Game.rooms[rm].terminal.store.getFreeCapacity() >= 35000 && Game.rooms[rm].terminal.store['energy'] < 50000 &&
                          Game.rooms[rm].storage.store['energy'] + Game.rooms[rm].terminal.store['energy'] < ( Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.terminal_rec_build ) && Game.rooms[rm].storage.store.getFreeCapacity() >= 100000 ){

                        var cnt = obj_mt_rec.length
                        obj_mt_rec[cnt] = []
                        obj_mt_rec[cnt][0] = rm
                        obj_mt_rec[cnt][1] = 20000 + Math.round( Game.rooms[rm].storage.store['energy'] / Game.rooms[rm].memory.storage_lvl * 100 )
                        obj_mt_rec[cnt][2] = 'build'
                    }
                    // room auto attacking
                    else if ( Game.rooms[rm].memory.mode_attack && Game.rooms[rm].memory.mode_attack == 1 &&
                          Game.rooms[rm].terminal.store.getFreeCapacity() >= 35000 && Game.rooms[rm].terminal.store['energy'] < 50000 &&
                          Game.rooms[rm].storage.store['energy'] + Game.rooms[rm].terminal.store['energy'] < ( Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.terminal_rec_attack ) && Game.rooms[rm].storage.store.getFreeCapacity() >= 100000 ){

                        var cnt = obj_mt_rec.length
                        obj_mt_rec[cnt] = []
                        obj_mt_rec[cnt][0] = rm
                        obj_mt_rec[cnt][1] = 30000 + Math.round( Game.rooms[rm].storage.store['energy'] / Game.rooms[rm].memory.storage_lvl * 100 )
                        obj_mt_rec[cnt][2] = 'attack'
                    }
                    // any room low on resources
                    else if( ( Game.rooms[rm].storage.store['energy'] + Game.rooms[rm].terminal.store['energy'] ) < Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.terminal_rec_low_res && Game.rooms[rm].storage.store.getFreeCapacity() >= 100000 ){

                        var cnt = obj_mt_rec.length
                        obj_mt_rec[cnt] = []
                        obj_mt_rec[cnt][0] = rm
                        obj_mt_rec[cnt][1] = 40000 + Math.round( Game.rooms[rm].storage.store['energy'] / Game.rooms[rm].memory.storage_lvl * 100 )
                        obj_mt_rec[cnt][2] = 'low res'
                    }
                    // utility running
                    else if( Game.rooms[rm].memory.mode_util == 1 && ( Game.rooms[rm].storage.store['energy'] + Game.rooms[rm].terminal.store['energy'] ) < Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.terminal_rec_util && Game.rooms[rm].storage.store.getFreeCapacity() >= 100000 ){

                        var cnt = obj_mt_rec.length
                        obj_mt_rec[cnt] = []
                        obj_mt_rec[cnt][0] = rm
                        obj_mt_rec[cnt][1] = 50000 + Math.round( Game.rooms[rm].storage.store['energy'] / Game.rooms[rm].memory.storage_lvl * 100 )
                        obj_mt_rec[cnt][2] = 'util'
                    }
                    // low level boost to leveling
                    else if( Game.rooms[rm].controller.level < 8 &&
                          Game.rooms[rm].terminal.store.getFreeCapacity() >= 35000 && Game.rooms[rm].terminal.store['energy'] < 50000 &&
                          Game.rooms[rm].storage.store['energy'] + Game.rooms[rm].terminal.store['energy'] < 600000 && Game.rooms[rm].storage.store.getFreeCapacity() >= 100000 ){

                        var cnt = obj_mt_rec.length
                        obj_mt_rec[cnt] = []
                        obj_mt_rec[cnt][0] = rm
                        obj_mt_rec[cnt][1] = Game.rooms[rm].controller.level * 10000 + Math.round( ( Game.rooms[rm].controller.progressTotal - Game.rooms[rm].controller.progress ) / Game.rooms[rm].controller.progressTotal * 100 )
                        obj_mt_rec[cnt][1] = 60000 + Math.round( ( Game.rooms[rm].controller.progressTotal - Game.rooms[rm].controller.progress ) / 1000 )
                        obj_mt_rec[cnt][2] = 'leveling'
                    }
                }

                var obj_mt_rec  = obj_mt_rec.sort(function(a,b) { return a[1]-b[1] });
            }


            // se tiver algum alem dos low-level - low-level tambem esta apto a enviar
            var no_low_lvl = 0
            for ( var k = 0; k < obj_mt_rec.length ; k++){
                if ( obj_mt_rec[k][1] < 60000 ){
                    var no_low_lvl = 1
                }
            }

            // // apagar todos low lvl com excecao do primeiro
            var fsrt = 0
            var rm_low_lvl = 0
            for ( var k = 0; k < obj_mt_rec.length ; k++){
                if( fsrt == 1 ){
                    delete obj_mt_rec[k]
                }
                else if ( obj_mt_rec[k][1] >= 60000 ){
                    if( no_low_lvl == 1 ){
                        delete obj_mt_rec[k]
                        var rm_low_lvl = 0
                    }
                    else{
                        var fsrt = 1
                        var rm_low_lvl = obj_mt_rec[k][0]
                    }
                }
            }


            for(var name in Game.rooms) {
                rm = name;

                if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].terminal && Game.rooms[rm].storage && rm != avoid_room ){

                    if( Game.rooms[rm].memory.mode_defend == 1 ){
                        var boost_tgt = Memory.config.min_energy_lvl.terminal_send_prior0
                    }
                    else if( 
                        Game.rooms[rm].memory.mode_util == 1 || 
                        Game.rooms[rm].memory.mode_attack == 1 ||
                        Game.rooms[rm].memory.mode_nuke == 1   ||
                        Game.rooms[rm].memory.ramp_repairer_need == 1 ||
                        (Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.construction && Game.rooms[rm].memory.intel.construction.length > 0) ){
                        var boost_tgt = Memory.config.min_energy_lvl.terminal_send_prior1
                    }
                    else{
                        var boost_tgt = Memory.config.min_energy_lvl.terminal_send_prior2
                    }


                    // room to send boost
                    if( Game.rooms[rm].controller.level >= 6 && Game.rooms[name].terminal.cooldown == 0 && Game.rooms[name].terminal.store['energy'] >= 9000 && rm != boost_room && rm != boost_room2 &&
                        ( Game.rooms[rm].storage.store['energy'] + Game.rooms[rm].terminal.store['energy'] )  > ( Game.rooms[rm].memory.storage_lvl * boost_tgt ) &&
                        ( rm_low_lvl == 0 || ( rm_low_lvl != 0 && rm != rm_low_lvl ) ) ){

                        var cnt = obj_mt_send.length
                        obj_mt_send[cnt] = []
                        obj_mt_send[cnt][0] = rm
                        obj_mt_send[cnt][1] = 1500000 - ( Game.rooms[rm].terminal.store['energy'] + Game.rooms[rm].storage.store['energy'] )

                    }
                }

                var obj_mt_send = _.sortBy( obj_mt_send, function(o) { return o[1]; }) // crescente
            }

            console.log('terminal send:' , obj_mt_send)
            console.log('terminal rec :' , obj_mt_rec)

            global.obj_mt_send = obj_mt_send
            global.obj_mt_rec = obj_mt_rec

            // send
            if( obj_mt_rec.length >=1 && obj_mt_send.length >=1 && 1==1){

                var breakv = 0

                for ( var k = 0; k < obj_mt_rec.length ; k++){

                    for ( var j = obj_mt_send.length - 1; j >= 0 ; j--){

                        if( obj_mt_send[j] && obj_mt_rec[k] ){

                            var rm = obj_mt_send[j][0]
                            var rm_tgt = obj_mt_rec[k][0]

                            if( rm != rm_tgt ){

                                var fee   = Game.market.calcTransactionCost(9000, rm, rm_tgt);

                                if( obj_mt_rec[k][1] < 40000 ){
                                    var fee_limit = 7000
                                }
                                else if( obj_mt_rec[k][1] < 60000 ){
                                    var fee_limit = 5500
                                }
                                else{
                                    var fee_limit = 4500
                                }

                                // fee limit
                                if( fee <= fee_limit ){

                                    var action = Game.rooms[rm].terminal.send('energy', 9000-fee, rm_tgt)

                                    if( action == OK ){
                                        console.log('ENERGY BOOSTING from', rm , 'to', rm_tgt , 'total of', 9000-fee,'energy, fee of', fee,'energy' )
                                        // var breakv = 1
                                        obj_mt_send.splice(j,1)
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    // if( breakv == 1 ){
                    //     break;
                    // }
                }
            }
        }


        // send energy surpplus boost ally
        if( Game.time % 17 == 0 && 1==11  ){

            var obj_mt_rec = []
            var obj_mt_send = []

            for(var name in Game.rooms) {
                rm = name;

                if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].terminal && Game.rooms[rm].storage ){

                    var lvl = Game.rooms[rm].controller.level

                    // rooms to receve boost
                    obj_mt_rec[0] = []
                    obj_mt_rec[0][0] = 'W59N18'
                    obj_mt_rec[0][1] = 6
                    obj_mt_rec[0][2] = 6
                    obj_mt_rec[0][3] = 6


                    // room to send boost
                    if( Game.rooms[rm].controller.level > 6 && Game.rooms[name].terminal.cooldown == 0 && Game.rooms[name].terminal.store['energy'] >= 9000 && Game.rooms[rm].storage.store['energy'] > ( Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.terminal_send_prior2 ) ){   // swc
                        var cnt = obj_mt_send.length
                        obj_mt_send[cnt] = []
                        obj_mt_send[cnt][0] = rm
                        obj_mt_send[cnt][1] = Game.rooms[rm].terminal.store['energy'] + Game.rooms[rm].storage.store['energy']
                        obj_mt_send[cnt][2] = Game.rooms[rm].controller.level
                        obj_mt_send[cnt][3] = Game.rooms[rm].controller.progress
                    }
                }
            }


            if( obj_mt_rec.length >=1 && obj_mt_send.length >=1 ){

                var obj_mt_rec  = _.sortBy( obj_mt_rec,  function(o) { return o[1]; }); // crescente -- pegar primeiro
                var obj_mt_send = _.sortBy( obj_mt_send, function(o) { return o[1]; }); // crescente -- pegar ultimo

                for ( var j = 0 ; j < obj_mt_send.length ; j++){

                    if( ( obj_mt_send[j][2] > obj_mt_rec[0][2] ) ||
                        ( obj_mt_send[j][2] == obj_mt_rec[0][2] && obj_mt_send[j][3] < obj_mt_rec[0][3]  ) ){

                        var rm = obj_mt_send[j][0]
                        var rm_tgt = obj_mt_rec[0][0]

                        var action = Game.rooms[rm].terminal.send('energy', 5000, rm_tgt)

                        if( action == OK ){
                            console.log('ENERGY BOOSTING', rm , 'to', rm_tgt  )
                            break;
                        }
                    }
                }
            }
        }


    }
};

module.exports = terminalBooster;
