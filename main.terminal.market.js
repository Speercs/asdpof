var terminalMarket= {

    run: function( ) {

        //
        // market test 2
        //
        if ( Game.market.credits > 10000000 ) {

          var SYMBOLS= [
                          //min         buy     buy_freq  open_buy    open_buy_freq   open_buy_amt
                          ['energy',     7,     15,       15,         23,             75000],
                          ['power',     40,     15,       40,         37,             10000],
                          ['ops',      2.5,     47,      2.5,         97,              1000],

                          ['XGHO2',    100,     15,      100,         77,             10000],   // though
                          ['XGH2O',    100,     15,      100,         77,             10000],   // upgrade
                          ['XZHO2',    100,     15,      100,         77,             10000],   // fatigue
                          ['XZH2O',    100,     15,      100,         77,             10000],   // dismantle
                          ['XLHO2',    100,     15,      100,         77,             10000],   // heal
                          ['XLH2O',    100,     15,      100,         77,             10000],   // repair
                          ['XUHO2',    100,     15,      100,         0 ,             10000],   // harvest
                          ['XUH2O',    100,     15,      100,         77,             10000],   // attack
                          ['XKHO2',    100,     15,      100,         77,             10000],   // range attack
                          ['XKH2O',    100,     15,      100,         0 ,             10000],   // capacity

                          ['GHO2',    100,     15,       100,         77,             10000],   // though
                          ['GH2O',     30,     15,        30,         77,             10000],   // upgrade
                          ['ZHO2',    100,     15,       100,         77,             10000],   // fatigue
                          ['ZH2O',    100,     15,       100,         77,             10000],   // dismantle
                          ['LHO2',    100,     15,       100,         77,             10000],   // heal
                          ['LH2O',      5,     15,       100,         77,             10000],   // repair
                          ['UHO2',      3,     15,         3,         0 ,             10000],   // harvest
                          ['UH2O',    100,     15,       100,         77,             10000],   // attack
                          ['KHO2',    100,     15,       100,         77,             10000],   // range attack
                          ['KH2O',      3,     15,         3,         0 ,             10000],   // capacity

                          ['GO',        50,   15,         50,          97,            10000],   // though
                          ['GH',        25,    15,        25,         97,             10000],   // upgrade
                          ['ZO',        2,     15,        2,          97,             10000],   // fatigue
                          ['ZH',        2,     15,        2,          97,             10000],   // dismantle
                          ['LO',        2,     15,        2,          97,             10000],   // heal
                          ['LH',        2,     15,        2,          97,             10000],   // repair
                          ['UO',        1,     15,        1,           0,             10000],   // harvest
                          ['UH',        3,     15,        3,          97,             10000],   // attack
                          ['KO',        3,     15,        3,          97,             10000],   // range attack
                          ['KH',        1,     15,        1,           0,             10000],   // capacity

                          ['OH',      120,      7,      120,           7,             10000],
                          ['G',       120,     15,      120,          17,             10000],
                          ['ZK',       75,     15,       75,          17,             10000],
                          ['UL',       75,     15,       75,          17,             10000],

                          ['X',         9,      1,       18,          12,             10000],
                          ['K',         2,      3,        4,           7,             10000],
                          ['U',         2,      3,        4,           7,             10000],
                          ['L',         2,      3,        4,           7,             10000],
                          ['Z',         2,      3,        4,           7,             10000],
                          ['H',        45,      3,       55,           7,             10000],
                          ['O',        45,      3,       55,           7,             10000]
                      ]

            if ( Game.market.credits < 450000000 ) {
                SYMBOLS[0][3] = 0
            }
            else if ( Game.market.credits > 900000000 ) {
                SYMBOLS[0][3] = 45
            }

            for ( var i = 0 ; i < SYMBOLS.length ; i++){

                // buy from existing orders
                if( SYMBOLS[i][2] != 0 && Game.time % SYMBOLS[i][2] == 0 ){

                    var symb = SYMBOLS[i][0]

                    if ( Memory.stats.minerals[symb] < ( Memory.stats.number_rooms * 12000 ) || symb == 'energy' ) {

                        var price_max = SYMBOLS[i][1]

                        var orders = Game.market.getAllOrders(order => order.resourceType == symb && order.type == ORDER_SELL && order.price <= price_max && order.amount >= 1 );

                        if (orders.length > 0 ) {

                            var orders = orders.sort(function(a,b){return a.price - b.price;});

                            var amt = orders[0].amount
                            if( amt > 4000 ){
                                var amt = 4000
                            }

                            for(var name in Game.rooms) {

                                rm = name;

                                if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my &&
                                     Game.rooms[rm].terminal && Game.rooms[rm].terminal.store.getFreeCapacity() > 50000 && Game.rooms[rm].terminal.cooldown == 0 &&
                                     Game.rooms[rm].storage && ( Game.rooms[rm].storage.store[symb] < 6000 || symb == 'energy' ) ) {

                                    if( Game.market.calcTransactionCost(amt, rm, orders[0].roomName ) <= Game.rooms[rm].terminal.store['energy'] ){

                                        if( Game.market.deal(orders[0].id, amt, rm) == 0 ){
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                //

                // open order to buy
                if( 1 == 1 ){

                    if( SYMBOLS[i][4] != 0 && Game.time % SYMBOLS[i][4] == 0 ){

                        var symb = SYMBOLS[i][0]

                        if ( Memory.stats.minerals[symb] < ( Memory.stats.number_rooms * 10000 ) || symb == 'energy' ) {

                            var obj = _.filter(Game.market.orders, { 'active': true , 'type': "buy", 'resourceType' : symb })

                            // open new order
                            if( obj && ( obj.length < 5 || symb == 'energy' ) ){

                                // max price on market
                                var max_price_obj = Game.market.getAllOrders(order => order.resourceType == symb && order.type == ORDER_BUY && order.price <= SYMBOLS[i][3] && order.amount >= 10000 ).sort(function(a,b){return b.price - a.price;})

                                if( max_price_obj && max_price_obj.length >= 1 ){
                                    var max_price = max_price_obj[0].price
                                }
                                else{
                                    var max_price = SYMBOLS[i][3] - 0.001
                                }
                                //

                                // my max price on market
                                if( obj.length >= 1 ){
                                    var max_price_my = obj.sort(function(a,b){return b.price - a.price;})[0].price
                                }
                                else{
                                    var max_price_my = 0
                                }
                                //

                                if( max_price <= SYMBOLS[i][3] && max_price_my < max_price ){

                                    // map my rooms
                                    var rms = [ ]
                                    if( symb == 'energy' && global.obj_mt_rec && global.obj_mt_rec.length >= 1 ){
                                        for ( var jj = 0 ; jj < global.obj_mt_rec.length ; jj++){
                                            if( global.obj_mt_rec[jj] && global.obj_mt_rec[jj][0] ){
                                                var rm = global.obj_mt_rec[jj][0]
                                                if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].controller.level >= 6 &&
                                                     Game.rooms[rm].terminal && Game.rooms[rm].storage &&
                                                     (Game.rooms[rm].storage.store['energy'] + Game.rooms[rm].terminal.store['energy'] < 500000 ) ) {
                                                    var cnt_rms = rms.length
                                                    rms[ cnt_rms ] = rm
                                                }
                                            }
                                        }
                                    }

                                    if( rms.length == 0 ){
                                        for(var name in Game.rooms) {
                                            rm = name;
                                            if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].controller.level >= 6 && Game.rooms[rm].terminal && Game.rooms[rm].storage ) {
                                                if( symb == 'energy' && (Game.rooms[rm].storage.store['energy'] + Game.rooms[rm].terminal.store['energy'] < 500000 ) ) {
                                                    var cnt_rms = rms.length
                                                    rms[ cnt_rms ] = rm
                                                }
                                                else if( symb != 'energy' ){
                                                    var cnt_rms = rms.length
                                                    rms[ cnt_rms ] = rm
                                                }
                                            }
                                        }
                                    }

                                    var rnd = Math.floor(Math.random() * rms.length)
                                    var rm = rms[rnd]

                                    Game.market.createOrder({
                                        type: ORDER_BUY,
                                        resourceType: symb,
                                        price: max_price + 0.001,
                                        totalAmount: SYMBOLS[i][5],
                                        roomName: rm
                                    });
                                }
                            }
                            // edit existing order
                            // open new order
                            if( obj && ( obj.length >= 5 && symb != 'energy' ) ){

                                // max price on market
                                var max_price_obj = Game.market.getAllOrders(order => order.resourceType == symb && order.type == ORDER_BUY && order.price <= SYMBOLS[i][3] && order.amount >= 2000 ).sort(function(a,b){return b.price - a.price;})

                                
                                if( max_price_obj && max_price_obj.length >= 1 ){
                                    var max_price = max_price_obj[0].price
                                }
                                else{
                                    var max_price = SYMBOLS[i][3] - 0.001
                                }
                                //

                                // my lowest price on market
                                if( obj.length >= 1 ){
                                    var min_price_my_obj = obj.sort(function(a,b){return a.price - b.price;})[0]
                                    var min_price_my = min_price_my_obj.price
                                    
                                    var max_price_my_obj = obj.sort(function(a,b){return b.price - a.price;})[0]
                                    var max_price_my = max_price_my_obj.price
                                }
                                //

                                if( max_price <= SYMBOLS[i][3] && min_price_my < max_price && max_price_my < max_price ){

                                    Game.market.changeOrderPrice(min_price_my_obj.id, max_price + 0.001);
                                    console.log('Changing market order symb: ', symb, min_price_my_obj.id, max_price + 0.001)
                                   
                                }
                            }
                        }
                    }
                }
                //
            }
            // clean filled/inactive orders and small
            if( Game.time % 2500 == 0 ){

                // inactive
                var obj = _.filter(Game.market.orders, { 'active': false })

                if( obj && obj.length > 0 ){
                    for ( var i = 0 ; i < obj.length ; i++){

                        Game.market.cancelOrder(obj[i].id)
                    }
                }

                //small
                var obj = _.filter(Game.market.orders, { 'active': true })

                if( obj && obj.length > 0 ){
                    for ( var i = 0 ; i < obj.length ; i++){
                        if( obj[i].amount < 1000 && obj[i].resourceType != 'accessKey' && obj[i].resourceType != 'cpuUnlock' && obj[i].resourceType != 'pixel' ){
                            Game.market.cancelOrder( obj[i].id )
                        }
                    }
                }
            }
            //
        }
        //


        //
        // market test 2 - COMM ONLY
        //
        if (Game.time % 150 == 0 || 1==1 ) {

            var buf = Game.gcl.level

            var SYMBOLS= [
                            //min               min     sell
                            // ['alloy',           1,     1],
                            ['frame',          buf*2,    500000],
                            ['hydraulics',     buf,     2100000],
                            ['machine',         1,      4000000],

                            // ['cell',            1,     1],
                            ['muscle',         buf*2,    600000],
                            ['organoid',       buf,     1800000],
                            ['organism',        1,      2200000],

                            // ['wire',            1,     1],
                            ['microchip',      buf*2,    300000],
                            ['circuit',        buf,     1000000],
                            ['device',          1,      1500000],

                            // ['condensate',      1,     1],
                            ['spirit',         buf*2,    190000],
                            ['emanation',      buf,      650000],
                            ['essence',         1,      1400000]

                        ]

            for ( var i = 0 ; i < SYMBOLS.length ; i++){

                var symb = SYMBOLS[i][0]

                if( ( ( symb == 'frame' || symb == 'muscle' || symb == 'microchip' || symb == 'spirit' ||
                        symb == 'hydraulics' || symb == 'organoid' || symb == 'circuit' || symb == 'emanation') && 
                        Memory.stats.minerals[symb] >= SYMBOLS[i][1] && Memory.stats.minerals[SYMBOLS[i+1][0]] >= SYMBOLS[i+1][1] + 1 ) ||
                        
                     ( ( symb == 'machine' || symb == 'organism' || symb == 'device' || symb == 'essence' ) && 
                        Memory.stats.minerals[symb] >= SYMBOLS[i][1] ) ) {

                    var price_min = SYMBOLS[i][2]

                    var orders = Game.market.getAllOrders(order => order.resourceType == symb && order.type == ORDER_BUY && order.price >= price_min && order.amount >= 1 );

                    if (orders.length > 0 ) {

                        var orders = orders.sort(function(a,b){return b.price - a.price;}); // descending

                        var amt = orders[0].amount
                        if( amt >= 1 ){
                            var amt = 1
                        }

                        for(var name in Game.rooms) {

                            rm = name;

                            if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my &&
                                 Game.rooms[rm].terminal && Game.rooms[rm].terminal.cooldown == 0 && Game.rooms[rm].terminal.store[symb] >= 1 ) {

                                if( Game.market.calcTransactionCost(amt, rm, orders[0].roomName ) <= Game.rooms[rm].terminal.store['energy'] ){

                                    if( Game.market.deal(orders[0].id, amt, rm) == 0 ){
                                        console.log( 'COMODITIES', symb, 'sold for', Math.round(orders[0].price),'credits' )
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        //


        // // sell terminal surplus
        // if (Game.time % 10 == 0 && 1==2  ) {
        //     mineral_matrix = [
        //                 'H','O','U','L','K','Z','X',
        //                 'OH','ZK','UL',
        //                 'G',

        //                 'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
        //                 'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',

        //                 'power','ops'
        //                 ]

        //     for ( var i = 0 ; i < mineral_matrix.length ; i++){

        //         for(var name in Game.rooms) {
        //             rm = name;
        //             var res = mineral_matrix[i]
        //             var amt = 0
        //             if( Game.rooms[rm].storage ){
        //                 var amt = amt + Game.rooms[rm].storage.store[res]
        //             }
        //             if( Game.rooms[rm].terminal ){
        //                 var amt = amt + Game.rooms[rm].terminal.store[res]
        //             }
        //             if ( amt > 15000 && Game.rooms[rm].memory.intel && res != Game.rooms[rm].memory.intel.minerals[0].mineralType ){
        //                 var amt_sell = amt - 14500
        //                 var orders = Game.market.getAllOrders(order => order.resourceType == res && order.type == ORDER_BUY );

        //                 console.log(rm,res,amt)

        //                 if (orders.length > 0 ) {

        //                     var orders = orders.sort(function(a,b){return b.price - a.price;});

        //                     var amt = orders[0].amount
        //                     if( amt > amt_sell ){
        //                         var amt = amt_sell
        //                     }
        //                     if( amt > 2000 ){
        //                         var amt = 2000
        //                     }

        //                     if ( Game.rooms[rm].terminal.cooldown == 0 ) {

        //                         if( Game.market.calcTransactionCost(amt, rm, orders[0].roomName ) <= Game.rooms[rm].terminal.store['energy'] ){

        //                             Game.market.deal(orders[0].id, amt, rm)

        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        // //



        // market swc
        if( Game.time % 11 == 0 && 
            ( Game.shard.name == 'swc' || Game.shard.name == 'screepsplus0' || Game.shard.name == 'ba' || Game.shard.name == 'botarena' ) ){

            for(var name in Game.rooms) {

                rm = name;

                if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].terminal && Game.rooms[rm].storage ){

                    var buy_needed = 0
                    var sell_needed = 0

                    var mineral_matrix = [
                                            //      buy     sell   amt_to_keep_flat   amt_to_keep_per_room
                                            ['H',   100,    0.01,  15000,             3000,         0],
                                            ['O',   100,    0.01,  15000,             3000,         0],                                            
                                            ['L',   100,    0.01,  15000,             3000,         0],                                            
                                            ['U',   100,    0.01,  15000,             3000,         0],
                                            ['Z',   100,    0.01,  15000,             3000,         0],
                                            ['K',   100,    0.01,  15000,             3000,         0],
                                            ['X',   100,    0.01,  15000,             3000,         0],
                                            ['biomass',0,    1,     0,                0,         99999],
                                            ['silicon',0,    1,     0,                0,         99999],
                                            ['metal'  ,0,    1,     0,                0,         99999],
                                            ['mist'   ,0,    1,     0,                0,         99999]

                                        ]

                    // sort by lower resources
                    for ( var i = 0 ; i < mineral_matrix.length ; i++){
                        
                        var sym = mineral_matrix[i][0]
                        var amt = mineral_matrix[i][4]

                        mineral_matrix[i][5] = Game.rooms[rm].terminal.store[ sym ] + Game.rooms[rm].storage.store[ sym ] 

                        if( mineral_matrix[i][5] < amt ){
                            var buy_needed = 1
                            var sell_needed = 1
                        }                        
                    }
                    var mineral_matrix = _.sortBy( mineral_matrix,  function(o) { return o[5]; });
                    //                    

                    // BUY
                    if( buy_needed == 1 ){

                        for ( var i = 0 ; i < mineral_matrix.length ; i++){

                            var sym = mineral_matrix[i][0]
                            var amt = mineral_matrix[i][4]

                            if( Game.rooms[rm].terminal.store[ sym ] < amt ){                                

                                var orders = Game.market.getAllOrders(order => order.resourceType == sym && order.type == ORDER_SELL && order.price <= mineral_matrix[i][1] );

                                if ( orders.length > 0 ) {

                                    var orders = orders.sort(function(a,b){return a.price - b.price;}); // min

                                    var amt_order = orders[0].amount
                                    if( amt_order > 500 ){                                        
                                        var amt_order = 500
                                    }

                                    // get closer market order
                                    var price = orders[0].price
                                    var order_cost = Game.market.calcTransactionCost(amt_order, rm, orders[0].roomName )
                                    var rm_order = orders[0].roomName
                                    var order_id = orders[0].id

                                    if( Game.market.credits >= amt_order * price  ){                                          
                                        
                                        for ( var j = 0 ; j < orders ; j++){

                                            if( orders[j].amount >= amt_order &&
                                                Game.market.calcTransactionCost(amt_order, rm, orders[j].roomName ) <= order_cost ){
                                                    
                                                var rm_order = orders[j].roomName
                                                var order_cost = Game.market.calcTransactionCost(amt_order, rm, orders[j].roomName )
                                                var order_id = orders[j].id
                                            }

                                            if( orders[j].price >= price * 1.05 ){
                                                break;
                                            }
                                        }                                                                          
                                    }
                                    //                                    

                                    // deal
                                    if( Game.market.calcTransactionCost(amt_order, rm, rm_order ) <= Game.rooms[rm].terminal.store['energy'] ){

                                        if( Game.market.deal(order_id, amt_order, rm) == 0 ){
                                            console.log('GAME MARKET buy:', amt_order , 'of', sym , 'to room: ', rm, 'energy cost of ', Game.market.calcTransactionCost(amt_order, rm, rm_order ))
                                            Memory.config.freq_terminal_send[ sym ] = 1
                                            break;
                                        }
                                    }
                                    //
                                }
                            }
                        }
                    } 
                    //

                    // SELL
                    if( sell_needed == 1 ){

                        var mineral_matrix = _.sortBy( mineral_matrix,  function(o) { return -o[5]; });

                        for ( var i = 0 ; i < mineral_matrix.length ; i++){

                            var sym = mineral_matrix[i][0]
                            var amt = mineral_matrix[i][3]

                            if( Game.rooms[rm].terminal.cooldown == 0 && Game.rooms[rm].storage.store[sym] >= amt ){

                                var amt_sell = Game.rooms[rm].terminal.store[sym]

                                if( amt_sell > 4000 ){
                                    var amt_sell = 4000
                                }

                                if( amt_sell >= 50 ){

                                    var orders = Game.market.getAllOrders(order => order.resourceType == sym && order.type == ORDER_BUY && order.price >= mineral_matrix[i][2] && order.amount >= 100);

                                    if (orders.length > 0 ) {

                                        var orders = orders.sort(function(a,b){return b.price - a.price;}); // max

                                        var amt_order = orders[0].amount
                                        if( amt_order > amt_sell ){
                                            var amt_order = amt_sell
                                        }
                                        var rm_order = orders[0].roomName

                                        if( Game.market.calcTransactionCost(amt_order, rm, rm_order ) <= Game.rooms[rm].terminal.store['energy'] ){

                                            if( Game.market.deal(orders[0].id, amt_order, rm) == 0 ){
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //

                }
            }
        }


    }
};

module.exports = terminalMarket;
