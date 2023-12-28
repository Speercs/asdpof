var terminalBalance= {

    run: function( ) {

        mineral_matrix = [
                        //'energy',

                        'H','O','U','L','K','Z','X',
                        'OH','ZK','UL',
                        'G',

                        'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2',
                        'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                        'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',

                        'power','ops',

                        'silicon','metal','biomass', 'mist',

                        'utrium_bar','lemergium_bar','zynthium_bar','keanium_bar','ghodium_melt','oxidant','reductant','purifier','battery','wire','cell','alloy','condensate',

                        'composite','tube','phlegm','switch','concentrate',

                        'crystal','fixtures','tissue', 'transistor', 'extract',

                        'liquid','frame','muscle','microchip','spirit',

                        'hydraulics','organoid','circuit','emanation',

                        'machine','organism','device','essence'

                        ]

        for ( var i = 0 ; i < mineral_matrix.length ; i++){

            var res = mineral_matrix[i]

            if( !eval('Memory.config.freq_terminal_send.' + res ) ){
                eval('Memory.config.freq_terminal_send.' + res + '= 4' )
            }

            if ( ( Game.time + i ) % Memory.config.freq_terminal_send[res] == 0 && 1==1 ){

                var ok = 1

                var max_transf = 3500

                if( Memory.stats.minerals[ res ] > Memory.stats.number_rooms * 2000 ){
                    var min_transf = 500
                }
                else if( Memory.stats.minerals[ res ] > Memory.stats.number_rooms * 1000 ){
                    var min_transf = 250
                }
                else if( Memory.stats.minerals[ res ] > Memory.stats.number_rooms * 500 ){
                    var min_transf = 125
                }
                else if( Memory.stats.minerals[ res ] > Memory.stats.number_rooms * 250 ){
                    var min_transf = 60
                }
                else if( Memory.stats.minerals[ res ] > Memory.stats.number_rooms * 125 ){
                    var min_transf = 30
                }
                else if( Memory.stats.minerals[ res ] > Memory.stats.number_rooms * 62 ){
                    var min_transf = 15
                }
                else if( Memory.stats.minerals[ res ] > Memory.stats.number_rooms * 31 ){
                    var min_transf = 7
                }
                else{
                    var min_transf = 2
                }

                var obj_mt_send = []
                var obj_mt_rec  = []

                // set minimum threshhold to send and receive energy
                var en_send_war_min_threshold       = 0.375

                // define who sends and who receives
                for(var name in Game.rooms) {

                    if ( Game.rooms[name].controller && Game.rooms[name].controller.my && Game.rooms[name].controller.level >= 6 && Game.rooms[name].terminal && Game.rooms[name].storage ) {

                        var lvl = Game.rooms[name].controller.level

                        var obj = Game.rooms[name].terminal
                        var amt = Game.rooms[name].terminal.store[res] + Game.rooms[name].storage.store[res]

                        if(     ( res != 'energy' && Game.rooms[name].terminal.store.getFreeCapacity() >= 35000 && amt < 14000 ) &&
                                ( lvl == 8 || lvl == 7 || ( lvl == 6 && ( res == 'XGH2O' ||  res == 'GH2O' ||  res == 'GH' ||  res == 'H' ||  res == 'O'  ) ) ) &&
                                name != 'E21N5111' ){
                            var cnt = obj_mt_rec.length
                            obj_mt_rec[cnt] = []
                            obj_mt_rec[cnt][0] = obj
                            obj_mt_rec[cnt][1] = amt
                        }

                        if( Game.rooms[name].terminal.cooldown == 0 && Game.rooms[name].terminal.store[res] >= min_transf &&
                            Game.rooms[name].storage.store['energy'] >= Game.rooms[name].memory.storage_lvl * en_send_war_min_threshold ) {
                            var cnt = obj_mt_send.length
                            obj_mt_send[cnt] = []
                            obj_mt_send[cnt][0] = obj
                            obj_mt_send[cnt][1] = amt
                        }
                    }
                }

                if( obj_mt_rec.length >= 1 && obj_mt_send.length >= 1 ){

                    var obj_mt_rec  = _.sortBy( obj_mt_rec,  function(o) { return  o[1]; }); // crescente
                    var obj_mt_send = _.sortBy( obj_mt_send, function(o) { return -o[1]; }); // decrescente

                    for ( var j = 0 ; j < obj_mt_send.length ; j++){

                        var amt = Math.round( ( obj_mt_send[j][1] - obj_mt_rec[0][1] ) / 2 )

                        if( obj_mt_send[j][0].pos.roomName != obj_mt_rec[0][0].pos.roomName ){

                            if( amt >= min_transf ){

                                if( amt > obj_mt_send[j][0].store[res] ){
                                    var amt = obj_mt_send[j][0].store[res]
                                }
                                if( amt > max_transf ){
                                    var amt = max_transf
                                }
                                if( ( obj_mt_rec[0][1] + amt ) > 14000 ){
                                    var amt = 14000 - obj_mt_rec[0][1]
                                }

                                const cost = Game.market.calcTransactionCost(amt, obj_mt_send[j][0].pos.roomName, obj_mt_rec[0][0].pos.roomName);

                                if( obj_mt_send[j][0].store['energy']  >= cost ){

                                    var action = obj_mt_send[j][0].send(res, amt, obj_mt_rec[0][0].pos.roomName)

                                    if( action == OK ){
                                        console.log('room: ', obj_mt_send[j][0].pos.roomName, 'send:', amt, res,' to ', obj_mt_rec[0][0].pos.roomName, 'action: ', action  )
                                        var ok = 0
                                        break;
                                    }
                                }
                                else{
                                    var ok = 2
                                    console.log('terminal break 2', res)
                                }
                            }
                            else{
                                console.log('terminal break 1', res, amt , min_transf , obj_mt_send[j][0].pos.roomName ,obj_mt_send[j][1], obj_mt_rec[0][0].pos.roomName , obj_mt_rec[0][1] )
                                break;
                            }
                        }
                    }
                }

                if( ok == 0 && Memory.config.freq_terminal_send[res] > 1  ) {
                    Memory.config.freq_terminal_send[res] = Math.round( Memory.config.freq_terminal_send[res] / 5 )
                    if( Memory.config.freq_terminal_send[res] < 1 ){
                        Memory.config.freq_terminal_send[res] = 1
                    }
                }
                else if( ok == 1 && Memory.config.freq_terminal_send[res] < 500 ) {
                    Memory.config.freq_terminal_send[res] = Math.round( Memory.config.freq_terminal_send[res] * 2 )
                    if( Memory.config.freq_terminal_send[res] > 500 ){
                        Memory.config.freq_terminal_send[res] = 500
                    }
                }
            }
        }
    }
};

module.exports = terminalBalance;
