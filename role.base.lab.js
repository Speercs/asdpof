const Pathing = require('pathing');

var roleBaseLab = {

    /** @param {Creep} creep **/
    run: function(creep) {        

        var prior  = 15
        var colour = '#FFFF00'

        var rm = creep.memory.birth

        var creep_store_size = 300

        if( !global.rooms[rm].intel ){
            global.rooms[rm].intel = {}
        }
        if( !global.rooms[rm].intel.lab ){
            global.rooms[rm].intel.lab = Game.rooms[rm].memory.intel.lab
        }            

        // suicide
        if( !Game.rooms[rm].storage || !Game.rooms[rm].terminal ){
            creep.suicide()
        }
        //

        // static position
        if( !creep.memory.static_xx ){
            if( Game.rooms[rm].memory.base_x && Game.rooms[rm].memory.base_y ){
                if( creep.memory.birth_target == 'lab1' ){
                    creep.memory.static_xx = Game.rooms[rm].memory.base_x - 1
                    creep.memory.static_yy = Game.rooms[rm].memory.base_y + 1
                }
                else if( creep.memory.birth_target == 'lab2'  ){
                    creep.memory.static_xx = Game.rooms[rm].memory.base_x - 1
                    creep.memory.static_yy = Game.rooms[rm].memory.base_y - 1
                }
            }
        }
        else{
        
            // Move into position
            if( creep.pos.x != creep.memory.static_xx || creep.pos.y != creep.memory.static_yy ){

                var static_pos = new RoomPosition(creep.memory.static_xx, creep.memory.static_yy, rm) 

                creep.moveTo( static_pos , {range: 0, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                creep.say('moving')

            }
            // IN POSITION - READY TO REACT
            else{

                // drop all resource before old age
                if( creep.ticksToLive <= 5 ){
                    if( creep.store.getUsedCapacity() > 0 ){

                        var mineral_matrix = [  'energy',
                                                'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2',
                                                'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                                                'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',
                                                'OH','ZK','UL',
                                                'H','O','U','L','K','Z','X','G'
                                                ]

                        for ( var j = 0 ; j < mineral_matrix.length ; j++) {

                            var min = mineral_matrix[j]

                            if( creep.store[ min ] > 0 ){
                                var obj = Game.rooms[ rm ].terminal
                                var action = creep.transfer( obj, min )                               
                            }                              
                        }
                    }
                }
                else{

                    // RUNS that are lab code dependent
                    if( global.rooms[rm].intel.lab ) {

                        // STS - legend
                        // 0 empty
                        // 1 reagent
                        // 2 reactor
                        // 3 booster

                        // ATTACK BOOST to Lab
                        if( !creep.memory.task_type || !creep.memory.task_type == null){

                            // attack boost
                            if ( 1==1 ){
                                var reagent = []
                                for ( var j = 0 ; j < global.rooms[rm].intel.lab.length ; j++) {
                                    if( ( creep.memory.birth_target == 'lab1' && ( j == 0 || j == 1 || j == 2 || j == 6 || j == 7 ) ) ||
                                        ( creep.memory.birth_target == 'lab2' && ( j == 3 || j == 4 || j == 5 || j == 8 || j == 9 ) ) ) {

                                        if( global.rooms[rm].intel.lab[j].sts == 3 ){
                                            reagent[reagent.length] = [ global.rooms[rm].intel.lab[j].id, global.rooms[rm].intel.lab[j].min ]
                                        }
                                    }
                                }

                                if( reagent.length > 0 ){

                                    creep.say('boost')

                                    var fill = []
                                    var unfill = []

                                    for ( var j = 0 ; j < reagent.length ; j++) {

                                        var lab = Game.getObjectById( reagent[j][0] )

                                        // lab está com o mineral correto
                                        if( lab && ( ( lab.mineralType && lab.mineralType == reagent[j][1] ) || !lab.mineralType ) ){

                                            if( Game.rooms[rm].memory.mode_attack == 1 ){
                                                var fill_amt = 3000
                                            }
                                            else{
                                                var fill_amt = 1800
                                            }

                                            // checar se tem o suficiente ou precisa de mais
                                            if( !lab.mineralType ){
                                                fill[ fill.length ] = [ reagent[j][0], reagent[j][1], fill_amt ]
                                            }
                                            else if( lab.store[ lab.mineralType ] <= fill_amt - creep_store_size ){
                                                // precisa de mais
                                                fill[ fill.length ] = [ reagent[j][0], reagent[j][1], fill_amt - lab.store[ lab.mineralType ] ]
                                            }
                                        }
                                        else if( lab && lab.mineralType && lab.mineralType != reagent[j][1] ){
                                            unfill[ unfill.length ] = [ reagent[j][0], lab.mineralType, lab.store[ lab.mineralType ]  ]
                                        }

                                        // energy for lab
                                        if( lab && lab.store[ 'energy' ] <= ( 2000 - creep_store_size ) ){
                                            fill[ fill.length ] = [ reagent[j][0], 'energy', 2000 - lab.store[ 'energy' ] ]
                                        }
                                    }

                                    if( unfill.length > 0 ){

                                        var unfill = _.sortBy( unfill,  function(o) { return o[2]; }); // menor primeiro

                                        creep.memory.task_type = 'unfill reactor'
                                        creep.memory.task      = unfill
                                    }
                                    else if( fill.length > 0 ){

                                        var fill = _.sortBy( fill,  function(o) { return -o[2]; }); // maior primeiro

                                        creep.memory.task_type = 'fill reagent terminal'
                                        creep.memory.task      = fill
                                    }
                                }
                            }
                        }
                        //

                        // STS - legend
                        // 0 empty
                        // 1 reagent
                        // 2 reactor
                        // 3 booster

                        // load labs for reactions
                        if( !Game.rooms[rm].memory.mode_attack || Game.rooms[rm].memory.mode_attack == 0 ){

                            var jungle_bucket = 3500

                            /// run reaction
                            if( 1 == 1 ){
                                var reaction_run = 0
                                var boost_1 = Game.rooms[rm].memory.lab_boost_1 

                                for ( var j = 0 ; j < global.rooms[rm].intel.lab.length ; j++) {

                                    if( ( Game.rooms[rm].controller.level >= 7 && creep.memory.birth_target == 'lab1' &&
                                        ( boost_1 == 'ZK'   || boost_1 == 'UL'   || boost_1 == 'G'    || 
                                            boost_1 == 'UH2O' || boost_1 == 'UHO2' || boost_1 == 'KH2O' || boost_1 == 'KHO2' || 
                                            boost_1 == 'KHO2' || boost_1 == 'ZHO2' ) )  ||
                                
                                        ( creep.memory.birth_target == 'lab1' &&  ( j == 0 || j == 1 || j == 2 || j == 6 || j == 7 ) ) ||
                                        ( creep.memory.birth_target == 'lab2' &&  ( j == 3 || j == 4 || j == 5 || j == 8 || j == 9 ) ) ) {

                                        var lab_sts = global.rooms[rm].intel.lab[j].sts

                                        if( lab_sts == 2 ) {

                                            lab_id  = global.rooms[rm].intel.lab[j].id
                                            lab_min = global.rooms[rm].intel.lab[j].min
                                            lab = Game.getObjectById( lab_id );

                                            if ( lab && lab.cooldown == 0 && (!lab.mineralType || lab.mineralType == lab_min ) && Memory.stats.minerals[lab_min] < (Memory.stats.number_rooms * 14000 ) && Game.rooms[rm].terminal.store.getFreeCapacity() > 25000 ) {

                                                var reagent_cnt = 0

                                                for ( var k = 0 ; k < global.rooms[rm].intel.lab.length ; k++ ){

                                                    if( ( Game.rooms[rm].controller.level >= 7 && creep.memory.birth_target == 'lab1' &&
                                                            ( boost_1 == 'ZK'   || boost_1 == 'UL'   || boost_1 == 'G'    || 
                                                            boost_1 == 'UH2O' || boost_1 == 'UHO2' || boost_1 == 'KH2O' || boost_1 == 'KHO2' || 
                                                            boost_1 == 'KHO2' || boost_1 == 'ZHO2' ) )  ||                                                    
                                                        
                                                        ( creep.memory.birth_target == 'lab1' && ( k == 0 || k == 1 || k == 2 || k == 6 || k == 7 ) ) ||
                                                        ( creep.memory.birth_target == 'lab2' && ( k == 3 || k == 4 || k == 5 || k == 8 || k == 9 ) ) ) {

                                                        var lab_sts = global.rooms[rm].intel.lab[k].sts

                                                        if( lab_sts == 1 ) {

                                                            if( reagent_cnt == 0 ){

                                                                var reagent_cnt = 1
                                                                var lab0 = Game.getObjectById( global.rooms[rm].intel.lab[k].id  )
                                                                var lab0_min = global.rooms[rm].intel.lab[k].min
                                                            }
                                                            else if( reagent_cnt == 1 ){

                                                                var lab1 = Game.getObjectById( global.rooms[rm].intel.lab[k].id  )
                                                                var lab1_min = global.rooms[rm].intel.lab[k].min
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }                                       

                                                if ( lab0 && lab1 && lab0.store[ lab0_min ] >= 5 && lab1.store[ lab1_min ] >= 5 ){
                                                    var action = lab.runReaction( lab0 , lab1 )
                                                    if( reaction_run == 0 && action == OK ){
                                                        var reaction_run = 1
                                                    }
                                                    creep.say('run')      
                                                }
                                            }
                                            else if ( lab && lab.cooldown == 0 && (!lab.mineralType || lab.mineralType == lab_min ) && Memory.stats.minerals[lab_min] >= (Memory.stats.number_rooms * 14000 ) ) {
                                                Memory.oneTimer.lab = 1
                                                break;
                                            }
                                        }
                                    }
                                }
                                //
    var jungle = 0
                                // lab juggler
                                var extra_reagent = -1 // lab number for extra fill
                                if( Game.cpu.bucket > jungle_bucket &&
                                    ( !creep.memory.juggler_timer ||  (Game.time - creep.memory.juggler_timer ) >= 3 ) &&
                                    ( Game.rooms[rm].controller.level == 6 || ( Game.rooms[rm].memory.lab_boost_1 != 'ZK' || Game.rooms[rm].memory.lab_boost_1 != 'UL' || Game.rooms[rm].memory.lab_boost_1 != 'G' || 
                                                                                Game.rooms[rm].memory.lab_boost_1 != 'UH2O' || Game.rooms[rm].memory.lab_boost_1 != 'UHO2' || Game.rooms[rm].memory.lab_boost_1 != 'KH2O' || Game.rooms[rm].memory.lab_boost_1 != 'KHO2' || 
                                                                                Game.rooms[rm].memory.lab_boost_1 != 'KHO2' || Game.rooms[rm].memory.lab_boost_1 != 'ZHO2' ) ) ){

                                    // STS - legend
                                    // 0 empty
                                    // 1 reagent
                                    // 2 reactor
                                    // 3 booster

                                    var reagent_cnt = 0
                                    var reagent0 = -1
                                    var reagent1 = -1
                                    var reactor_cnt = 0 

                                    for ( var j = 0 ; j < global.rooms[rm].intel.lab.length ; j++) {                

                                        if( ( creep.memory.birth_target == 'lab1' && ( j == 0 || j == 1 || j == 2 || j == 6 || j == 7 ) ) ||
                                            ( creep.memory.birth_target == 'lab2' && ( j == 3 || j == 4 || j == 5 || j == 8 || j == 9 ) ) ) {

                                            if( global.rooms[rm].intel.lab[j].sts == 1 ){

                                                if( reagent_cnt == 0 ){
                                                    var reagent0 = j
                                                }
                                                else if( reagent_cnt == 1 ){
                                                    var reagent1 = j
                                                }

                                                var reagent_cnt = reagent_cnt + 1
                                            }
                                            else if( global.rooms[rm].intel.lab[j].sts == 2 ){

                                                var reactor_cnt = reactor_cnt + 1
                                            }
                                        }
                                    }

                                    // jungle
                                    if( reagent_cnt == 2 ){

                                        if( reactor_cnt >= 1 ){

                                            for ( var j = 0 ; j < global.rooms[rm].intel.lab.length ; j++) {
                                    
                                                if( ( creep.memory.birth_target == 'lab1' && ( j == 0 || j == 1 || j == 2 || j == 6 || j == 7 ) ) ||
                                                    ( creep.memory.birth_target == 'lab2' && ( j == 3 || j == 4 || j == 5 || j == 8 || j == 9 ) ) ) {

                                                    if( global.rooms[rm].intel.lab[j].sts == 2 && reagent0 >= 0 && reagent1 >= 0 ){

                                                        if( global.rooms[rm].intel.lab[j].id && 
                                                            Game.getObjectById( global.rooms[rm].intel.lab[j].id ) &&

                                                            global.rooms[rm].intel.lab[reagent0].id && 
                                                            Game.getObjectById( global.rooms[rm].intel.lab[reagent1].id ) &&

                                                            global.rooms[rm].intel.lab[reagent0].id && 
                                                            Game.getObjectById( global.rooms[rm].intel.lab[reagent1].id ) &&

                                                            Game.getObjectById( global.rooms[rm].intel.lab[reagent0].id ).cooldown <= Game.getObjectById( global.rooms[rm].intel.lab[reagent1].id ).cooldown &&

                                                        (( Game.getObjectById( global.rooms[rm].intel.lab[reagent0].id ).cooldown < Game.getObjectById( global.rooms[rm].intel.lab[j].id ).cooldown ) ||
                                                            ( Game.getObjectById( global.rooms[rm].intel.lab[j].id ).cooldown == 0 && reaction_run == 1 )) 

                                                            ){

                                                            var a = global.rooms[rm].intel.lab[reagent0].min // 1 - reagent
                                                            var b = global.rooms[rm].intel.lab[j].min // 2 - reactor

                                                            global.rooms[rm].intel.lab[reagent0].min = b
                                                            global.rooms[rm].intel.lab[reagent0].sts = 2  

                                                            global.rooms[rm].intel.lab[j].min = a
                                                            global.rooms[rm].intel.lab[j].sts = 1

                                                            var reagent0 = -1    
                                                            
                                                            creep.memory.task_type = null
                                                            creep.memory.task = null

                                                            creep.memory.juggler_timer = Game.time
                                                            var jungle = 1
                                                            var extra_reagent = reagent1
                                                            creep.say('jug1')
                                                            break;
                                                        }
                                                        else if(    global.rooms[rm].intel.lab[j].id && 
                                                                    Game.getObjectById( global.rooms[rm].intel.lab[j].id ) &&

                                                                    global.rooms[rm].intel.lab[reagent0].id && 
                                                                    Game.getObjectById( global.rooms[rm].intel.lab[reagent1].id ) &&

                                                                    global.rooms[rm].intel.lab[reagent0].id && 
                                                                    Game.getObjectById( global.rooms[rm].intel.lab[reagent1].id ) &&

                                                                    Game.getObjectById( global.rooms[rm].intel.lab[reagent1].id ).cooldown <= Game.getObjectById( global.rooms[rm].intel.lab[reagent0].id ).cooldown &&

                                                                (( Game.getObjectById( global.rooms[rm].intel.lab[reagent0].id ).cooldown < Game.getObjectById( global.rooms[rm].intel.lab[j].id ).cooldown ) ||
                                                                    ( Game.getObjectById( global.rooms[rm].intel.lab[j].id ).cooldown == 0 && reaction_run == 1 )) 

                                                                ){

                                                            var a = global.rooms[rm].intel.lab[reagent1].min // 1 - reagent
                                                            var b = global.rooms[rm].intel.lab[j].min // 2 - reactor

                                                            global.rooms[rm].intel.lab[reagent1].min = b
                                                            global.rooms[rm].intel.lab[reagent1].sts = 2  

                                                            global.rooms[rm].intel.lab[j].min = a
                                                            global.rooms[rm].intel.lab[j].sts = 1

                                                            creep.memory.task_type = null
                                                            creep.memory.task = null

                                                            creep.memory.juggler_timer = Game.time
                                                            var jungle = 1
                                                            var extra_reagent = reagent0
                                                            creep.say('jug2')
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

                            // STS - legend
                            // 0 empty
                            // 1 reagent
                            // 2 reactor
                            // 3 booster

                            // REAGENT FILLer - for reaction
                            if( !creep.memory.task_type || !creep.memory.task_type == null ){

                                var unfill = []
                                var fill   = []

                                for ( var j = 0 ; j < global.rooms[rm].intel.lab.length ; j++) {

                                    if( ( creep.memory.birth_target == 'lab1' && ( j == 0 || j == 1 || j == 2 || j == 6 || j == 7 ) ) ||
                                        ( creep.memory.birth_target == 'lab2' && ( j == 3 || j == 4 || j == 5 || j == 8 || j == 9 ) ) ) {

                                        // empty
                                        if( global.rooms[rm].intel.lab[j].sts == 0 ){

                                            var lab = Game.getObjectById( global.rooms[rm].intel.lab[j].id )

                                            if( !lab.mineralType ){
                                                // ok - already empty
                                            }
                                            else{
                                                unfill[unfill.length] = [ global.rooms[rm].intel.lab[j].id, lab.mineralType, lab.store[lab.mineralType] ]
                                            }                                        
                                        }
                                        
                                        // reagent
                                        if( global.rooms[rm].intel.lab[j].sts == 1  ){

                                            var lab = Game.getObjectById( global.rooms[rm].intel.lab[j].id )

                                            if( Game.rooms[rm].controller.level == 6 ){
                                                if( Game.cpu.bucket < jungle_bucket * .9 ){
                                                    var amt = 80
                                                }
                                                else{
                                                    var amt = 5
                                                }
                                            }
                                            else if( Game.rooms[rm].controller.level == 7 ){
                                               
                                                if( Game.cpu.bucket < jungle_bucket * .9 ){
                                                    var amt = 80
                                                }
                                                else{
                                                    var amt = 5
                                                }

                                                var boost_1 = Game.rooms[rm].memory.lab_boost_1 

                                                if ( amt != 80 && 
                                                    (boost_1 == 'ZK'   || boost_1 == 'UL'   || boost_1 == 'G'    || 
                                                     boost_1 == 'UH2O' || boost_1 == 'UHO2' || boost_1 == 'KH2O' || boost_1 == 'KHO2' || 
                                                     boost_1 == 'KHO2' || boost_1 == 'ZHO2' ) ){
                                                    var amt = 80
                                                }
                                            }
                                            else{
                                                if( Game.cpu.bucket < jungle_bucket * .9 ){
                                                    var amt = 80
                                                }
                                                else{
                                                    var amt = 15
                                                }                                                
                                            }

                                            if( j == extra_reagent ){
                                                var amt = amt + 5
                                            }

                                            if( lab &&
                                                ( !lab.mineralType  || 
                                                 ( global.rooms[rm].intel && global.rooms[rm].intel.lab && global.rooms[rm].intel.lab[j].min == lab.mineralType && lab.store[lab.mineralType] < 5 ) ) ){
                                                if( !lab.mineralType ){
                                                    var amt = amt
                                                }
                                                else{
                                                    var amt = amt - lab.store[lab.mineralType]
                                                }
                                                fill[fill.length] = [ global.rooms[rm].intel.lab[j].id, global.rooms[rm].intel.lab[j].min , amt ]
                                            }
                                            else if( lab && lab.mineralType && lab.mineralType != global.rooms[rm].intel.lab[j].min ){
                                                unfill[unfill.length] = [ global.rooms[rm].intel.lab[j].id, lab.mineralType, lab.store[lab.mineralType] ]
                                            }                                        
                                        }
                                        
                                        // reactor
                                        if( global.rooms[rm].intel.lab[j].sts == 2 ){

                                            var lab = Game.getObjectById( global.rooms[rm].intel.lab[j].id )

                                            if( lab && lab.mineralType && lab.mineralType != global.rooms[rm].intel.lab[j].min ){
                                                unfill[unfill.length] = [ global.rooms[rm].intel.lab[j].id, lab.mineralType, lab.store[lab.mineralType] ]
                                            }   
                                            else if( lab && lab.mineralType && lab.mineralType == global.rooms[rm].intel.lab[j].min && 
                                                lab.store[lab.mineralType] >= 85 ){
                                                unfill[unfill.length] = [ global.rooms[rm].intel.lab[j].id, lab.mineralType, lab.store[lab.mineralType] ]
                                            }                                    
                                        }
                                    }
                                }

                                
                                if( unfill.length > 0 && jungle == 0 ){

                                    var unfill = _.sortBy( unfill,  function(o) { return o[2]; }); // menor primeiro 


                                    creep.memory.task_type = 'unfill reactor'
                                    creep.memory.task      = unfill
                                }
                                else if( fill.length > 0 ){

                                    var fill = _.sortBy( fill,  function(o) { return -o[2]; }); // maior primeiro


                                    creep.memory.task_type = 'fill reagent terminal'
                                    creep.memory.task      = fill
                                }
                         

                            }
                        }

                                


                        // empty lab
                        if( 1 == 1 ){

                            // EMPTY Lab
                            if( !creep.memory.task_type || !creep.memory.task_type == null){

                                var unfill = []

                                for ( var j = 0 ; j < global.rooms[rm].intel.lab.length ; j++) {

                                    if( ( creep.memory.birth_target == 'lab1' && ( j == 0 || j == 1 || j == 2 || j == 6 || j == 7 ) ) ||
                                        ( creep.memory.birth_target == 'lab2' && ( j == 3 || j == 4 || j == 5 || j == 8 || j == 9 ) ) ) {

                                        if( global.rooms[rm].intel.lab[j].sts == 0 ){

                                            lab_id  = global.rooms[rm].intel.lab[j].id
                                            lab     = Game.getObjectById( lab_id );

                                            if( lab ){
                                                lab_min = lab.mineralType

                                                if( lab_min && lab.store[ lab_min ] > 0 ){
                                                    unfill[ unfill.length ] = [ global.rooms[rm].intel.lab[j].id, lab_min, lab.store[ lab_min ] ]
                                                }
                                            }
                                        }
                                    }
                                }

                                if( unfill.length > 0 ){
                                    var unfill = _.sortBy( unfill,  function(o) { return o[2]; }); // menor primeiro 

                                    creep.memory.task_type = 'unfill reactor'
                                    creep.memory.task      = unfill
                                }
                            }
                            //                        


                        }
                        //

// console.log( creep.memory.birth_target )
// console.log( creep.memory.task_type , creep.memory.task)
// console.log( reaction_run )
// console.log( jungle )
// console.log( global.rooms[rm].intel.lab[0].min )

                        // ACTIONS
                        if( 1==1 ){
                            if( creep.memory.task_type == 'fill reagent terminal' && 1==1 ){

                                var obj = Game.rooms[ rm ].terminal
                                var ok = 0

                                if( creep.store.getFreeCapacity() > 26 ){
                                    for ( var j = 0 ; j < creep.memory.task.length ; j++) {
                                        if( creep.memory.task[j][2] > 0 && creep.store[ creep.memory.task[j][1] ] < creep.memory.task[j][2] && obj.store[ creep.memory.task[j][1] ] > 0 &&
                                            creep.store[ creep.memory.task[j][1] ] < 100 ){

                                            var ok = 1
creep.say('rf')
                                            var free_store = creep.store.getFreeCapacity()
                                            if( creep.memory.task[j][1] == 'energy' ){
                                                var with_store = Math.min( creep.memory.task[j][2], creep.store.getFreeCapacity() - 26, obj.store[ creep.memory.task[j][1] ] )
                                            }
                                            else{
                                                var with_store = Math.min( creep.memory.task[j][2], creep.store.getFreeCapacity(), obj.store[ creep.memory.task[j][1] ] , 100)
                                            }

                                            if( with_store && with_store > 0 ){

                                                var action = creep.withdraw(obj, creep.memory.task[j][1], with_store )
                                        
                                                if( action == OK ){
creep.say('rf_ok')    
                                                }
                                                else if( action == ERR_NOT_IN_RANGE ){
                                                    creep.say('error3')
                                                }
                                            }

                                            break;
                                        }
                                        else if( obj.store[ creep.memory.task[j][1] ] == 0 ){
                                            creep.memory.task[j][2] = 0
                                            creep.say('no mineral')
                                        }
                                    }
                                }

                                if( ok == 0 ){
                                    //creep.memory.task_type = 'fill reagent lab'

                                    if( 1==1){
                                    //if( creep.memory.task_type == 'fill reagent lab' && 1==1){

                                        var ok = 0
                                        if( creep.store.getUsedCapacity() > 0 ){
                                            for ( var j = 0 ; j < creep.memory.task.length ; j++) {
                
                                                if( creep.store[ creep.memory.task[j][1] ] > 0 ){

                                                    var ok = 1
                                                    var used_store = creep.store.getUsedCapacity()
                                                    var trans_store = creep.store[ creep.memory.task[j][1] ]
                                                    var lab = Game.getObjectById( creep.memory.task[j][0] )
                                                    var action = creep.transfer(lab, creep.memory.task[j][1], Math.min( creep.memory.task[j][2], creep.store[ creep.memory.task[j][1] ]) )
                
                                                    if( action == OK ){
                                                        creep.memory.task_type = null
                                                        creep.memory.task = null
                                                    }
                                                    else if( action == ERR_NOT_IN_RANGE ){
                                                        creep.say('error4')
                                                    }
                                                    else if( action == ERR_INVALID_TARGET ){
                                                        creep.memory.task_type = null
                                                        creep.memory.task = null
                                                    }
                                                    else if( action ==  ERR_FULL){
                                                        // add fallback
                                                    }
                
                                                    break;
                                                }
                                            }
                                        }
                
                                        // mudar de task
                                        if( ok == 0 ){
                                            creep.memory.task_type = null
                                            creep.memory.task = null
                                        }
                                    }
                                }
                            }
                            //
                            
                            
                            //
                            else if( creep.memory.task_type == 'unfill reactor' && 1==1 ){

                                var ok = 0
                                if( creep.store.getFreeCapacity() > 0 ){
                                    for ( var j = 0 ; j < creep.memory.task.length ; j++) {

                                        if( creep.memory.task[j][2] > 0 ){
                                            var ok = 1
                                            var free_store = creep.store.getFreeCapacity()
                                            var lab = Game.getObjectById( creep.memory.task[j][0] )
                                            var with_store = lab.store[ creep.memory.task[j][1] ]
                                            var action = creep.withdraw(lab, creep.memory.task[j][1] )

                                            if( action == OK ){
                                                creep.memory.task_type = null
                                                creep.memory.task = null
                                            }
                                            else if( action == ERR_NOT_IN_RANGE ){
                                                creep.say('error1')
                                            }
                                            else if( action == ERR_NOT_ENOUGH_RESOURCES ){
                                                creep.memory.task_type = null
                                                creep.memory.task = null
                                            }
                                            else if( action ==  ERR_FULL){
                                                // add fallback
                                            }
                                            break;
                                        }
                                    }
                                }
                            }


                            // dropp excess
                            if( creep.store.getFreeCapacity() <= 25 ){
creep.say('drop_exc')
                                var keep_min = []

                                for ( var j = 0 ; j < global.rooms[rm].intel.lab.length ; j++) {

                                    if( ( creep.memory.birth_target == 'lab1' && ( j == 0 || j == 1 || j == 2 || j == 6 || j == 7 ) ) ||
                                        ( creep.memory.birth_target == 'lab2' && ( j == 3 || j == 4 || j == 5 || j == 8 || j == 9 ) ) ) {

                                        if( global.rooms[rm].intel.lab[j].sts == 1 ){

                                            keep_min[ keep_min.length ]  = global.rooms[rm].intel.lab[j].min

                                        }
                                    }
                                }

                                var drop_min = []

                                var mineral_matrix = [      'energy',
                                                            'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2',
                                                            'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                                                            'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',
                                                            'OH','ZK','UL',
                                                            'H','O','U','L','K','Z','X','G'
                                                            ]

                                for ( var j = 0 ; j < mineral_matrix.length ; j++) {
creep.say('drop_exc1.5')
                                    var min = mineral_matrix[j]

                                    if( creep.store[ min ] > 0 && 
                                           ( 
                                             ( creep.memory.task && !creep.memory.task.length >= 1 ) || 
                                             ( creep.memory.task == null ) ||
                                             ( creep.memory.task && creep.memory.task[0] && min != creep.memory.task[0][1] ) || ( creep.memory.task && creep.memory.task[0] && min == creep.memory.task[0][1] && creep.store[min] > creep.memory.task[0][2] ) ||
                                             ( creep.memory.task && creep.memory.task[1] && min != creep.memory.task[1][1] ) ||
                                             ( creep.memory.task && creep.memory.task[2] && min != creep.memory.task[2][1] ) ||
                                             ( creep.memory.task && creep.memory.task[3] && min != creep.memory.task[3][1] ) ||
                                             ( creep.memory.task && creep.memory.task[4] && min != creep.memory.task[4][1] ) ||
                                             ( creep.memory.task && creep.memory.task[5] && min != creep.memory.task[5][1] ) ||
                                             ( creep.memory.task && creep.memory.task[6] && min != creep.memory.task[6][1] ) ) ) {
creep.say('drop_exc2')                                       
                                        var ok = 0

                                        for ( var k = 0 ; k < keep_min.length ; k++) {
                                            if( keep_min[k] == min && creep.store[min] <= 100 ){
                                                var ok = 1
                                                break;
                                            }
                                        }    
                                        
                                        if( ok == 0 ){
                                            drop_min[drop_min.length] = min
                                            break;
                                        }
                                    } 
                                }


                                if( drop_min.length > 0 ){
                                    
                                    var obj = Game.rooms[rm].terminal
                                    
                                    // try to find lab around with same boost
                                    for ( var j = 0 ; j < global.rooms[rm].intel.lab.length ; j++) {
                                        if( ( creep.memory.birth_target == 'lab1' && ( j == 0 || j == 1 || j == 2 || j == 6 || j == 7 ) ) ||
                                            ( creep.memory.birth_target == 'lab2' && ( j == 3 || j == 4 || j == 5 || j == 8 || j == 9 ) ) ) {
    
                                            if( global.rooms[rm].intel.lab[j].sts == 3 && global.rooms[rm].intel.lab[j].min == drop_min[0]  ){
                                                var obj = Game.getObjectById( global.rooms[rm].intel.lab[j].id )
                                                break;
                                            }
                                        }
                                    }
creep.say('drop_exc3')
                                    
                                    var action = creep.transfer( obj, drop_min[0] )

                                    if( action == OK ){
                                        creep.memory.task_type = null
                                        creep.memory.task = null
                                    }
                                    else if( action == ERR_NOT_IN_RANGE ){
                                        creep.say('error2')
                                    }
                                }
                                else if( creep.store.getUsedCapacity() > 0 ){
                                    
                                    var store_length = Object.keys( creep.store ).length
                                    var rand = Math.floor(Math.random() * store_length)
                                    drop_min[0] = Object.keys( creep.store )[rand]
                                    
                                    var obj = Game.rooms[rm].terminal
                                    
                                    // try to find lab around with same boost
                                    for ( var j = 0 ; j < global.rooms[rm].intel.lab.length ; j++) {
                                        if( ( creep.memory.birth_target == 'lab1' && ( j == 0 || j == 1 || j == 2 || j == 6 || j == 7 ) ) ||
                                            ( creep.memory.birth_target == 'lab2' && ( j == 3 || j == 4 || j == 5 || j == 8 || j == 9 ) ) ) {
    
                                            if( global.rooms[rm].intel.lab[j].sts == 3 && global.rooms[rm].intel.lab[j].min == drop_min[0]  ){
                                                var obj = Game.getObjectById( global.rooms[rm].intel.lab[j].id )
                                                break;
                                            }
                                        }
                                    }
creep.say('drop_exc4')
                                    
                                    var action = creep.transfer( obj, drop_min[0] )

                                    if( action == OK ){
                                        creep.memory.task_type = null
                                        creep.memory.task = null
                                    }
                                    else if( action == ERR_NOT_IN_RANGE ){
                                        creep.say('error2')
                                    }
                                }
                            }    
                            //
                        }
                    }
                }
            }
        }
        //


        
  
    }
}
module.exports = roleBaseLab;