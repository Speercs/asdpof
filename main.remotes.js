// remotes
var remotesMapper     = require('main.remotes.mapper')

var mainRemotes= {

    run: function( rm ) {

        // update remotes heap
        // heap data for visuals
        if( !global.rooms[rm].remotes || Game.time % 15 == 7 ){
            global.rooms[rm].remotes = {}
            global.rooms[rm].remotes.remotes = []

            if( !global.remotes_cpu ){
                global.remotes_cpu = {}
            }

            var rm_creeps = _.filter(Game.creeps, (creep) => creep.memory.birth == rm  )

            var lvl = Game.rooms[rm].controller.level
            
            var hauler_cnt = _.filter( rm_creeps , (creep) => creep.memory.role == 'hauler_out' &&
                                                            ( creep.ticksToLive > 150 || creep.spawning == true || !creep.ticksToLive ) )    
            var carry_sum = _.sum( hauler_cnt, creep => { return creep.getActiveBodyparts(CARRY) });  

            var carry_need = 0
            var loop_count = 0 // there is a break at the end of this loop at 20 count
        
            for ( var i = 0 ; i < Game.rooms[rm].memory.remotes.length ; i++){
                
                var rm_tgt = Game.rooms[rm].memory.remotes[i].rm
                var source   = Game.rooms[rm].memory.remotes[i].sources_id
                var distance = Game.rooms[rm].memory.remotes[i].distance
                
                global.rooms[rm].remotes.remotes[i] = {}
                global.rooms[rm].remotes.remotes[i].harvester = 0
                global.rooms[rm].remotes.remotes[i].carry = 0
                global.rooms[rm].remotes.remotes[i].reserver = 0
                
                global.rooms[rm].remotes.remotes[i].rm_tgt = rm_tgt
                global.rooms[rm].remotes.remotes[i].distance = Game.rooms[rm].memory.remotes[i].distance
                global.rooms[rm].remotes.remotes[i].source = Game.rooms[rm].memory.remotes[i].sources_id
                
                            
                // my room
                if( Game.rooms[rm].memory.remotes[i].owner != null && 
                    Game.rooms[rm].memory.remotes[i].owner == 'asdpof' ){

                    global.rooms[rm].remotes.remotes[i].status = 'my room'
                }
                // hostiles on path to remote
                else if( Game.rooms[rm].memory.remotes[i].route && 
                        Game.rooms[rm].memory.remotes[i].route.length >= 1 && 
                        _.intersection( _.map(_.filter( Memory.hostile, (rm_tgt) => ( rm_tgt.hostiles > 0 && ( rm_tgt.attack > 0 || rm_tgt.ranged > 0 ) ) || rm_tgt.tower > 0 ), 'rm' ) , Game.rooms[rm].memory.remotes[i].route ).length > 0 ){
           
                    global.rooms[rm].remotes.remotes[i].status = 'blocked'                    
                }
                // hostile claim
                else if( Game.rooms[rm].memory.remotes[i].owner != null && 
                        Game.rooms[rm].memory.remotes[i].owner != 'asdpof' ){

                    global.rooms[rm].remotes.remotes[i].status = 'claimed'
                }
                // reserved from from hostile
                else if( Game.rooms[rm].memory.remotes[i].reservation_user != null && 
                        Game.rooms[rm].memory.remotes[i].reservation_user != 'asdpof'  ){

                    
                    // invader core on remote
                    if( Game.rooms[rm].memory.remotes[i].reservation_user == 'Invader' &&
                        Game.rooms[rm].memory.remotes[i].reservation_core == true ){

                        global.rooms[rm].remotes.remotes[i].status = 'invader'                        
                    }
                    else{
                        global.rooms[rm].remotes.remotes[i].status = 'reserved'
                    }
                }
                // room on manual block list
                else if( 1 == 11 ){

                    global.rooms[rm].remotes.remotes[i].status = 'manual'

                }
                else{
                    // hostiles on the remote
                    if( Memory.hostile && Memory.hostile[rm_tgt] && Memory.hostile[ rm_tgt ].hostiles > 0 &&
                        ( Memory.hostile[ rm_tgt ].attack > 0 || Memory.hostile[ rm_tgt ].ranged > 0 ) ){

                        global.rooms[rm].remotes.remotes[i].status = 'hostiles'
                    }                    
                    // spawn remotes
                    else{

                        global.rooms[rm].remotes.remotes[i].status = 'available'
                        var loop_count = loop_count + 1

                        var ticklive = distance + 50

                        // HARVESTER
                        var harv_obj = _.filter( Game.creeps , (creep) => creep.memory.role   == 'harvester_out' &&
                                                                    creep.memory.birth_target == rm_tgt &&
                                                                    creep.memory.birth_info_2 == source &&                                                                    
                                                                    ( creep.ticksToLive > ticklive || creep.spawning == true || !creep.ticksToLive ) )

                        if( harv_obj && harv_obj.length >= 1 ){
                            if( harv_obj[0].memory.birth == rm ){
                                global.rooms[rm].remotes.remotes[i].harvester = 1
                            }
                            else{
                                global.rooms[rm].remotes.remotes[i].status = 'shared'
                                global.rooms[rm].remotes.remotes[i].harvester = 0
                            }
                        }
                        else{
                            global.rooms[rm].remotes.remotes[i].harvester = 0
                        }

                        if( global.rooms[rm].remotes.remotes[i].status == 'available' ){

                            // CARRY
                            // var hauler_obj = _.filter( hauler_cnt , (creep) => creep.memory.birth_target == rm_tgt &&
                            //                                                    creep.memory.birth_info_2 == source  )

                            if( harv_obj && harv_obj.length >= 1 ){
                                
                                // var carry_sum = carry_sum + _.sum( hauler_obj, creep => { return creep.getActiveBodyparts(CARRY) });     
                                if ( Game.rooms[rm].energyCapacityAvailable >= 1300 ){
                                    var carry_need = carry_need + distance * 2 * Math.min(5, harv_obj[0].getActiveBodyparts(WORK) ) * 2 / 50   
                                }
                                else{
                                    var carry_need = carry_need + distance * 3 * ( Math.min(5, harv_obj[0].getActiveBodyparts(WORK) ) * 2 - 1 ) / 50  // temporary - no roads
                                }
           
                                global.rooms[rm].remotes.remotes[i].carry = carry_sum                             
                                global.rooms[rm].remotes.remotes[i].carry_need = carry_need
                            }
                            else{
                                // var carry_sum = carry_sum + 0
                                var carry_need = carry_need + 0

                                global.rooms[rm].remotes.remotes[i].carry = 0                             
                                global.rooms[rm].remotes.remotes[i].carry_need = 0
                            }
                            

                            // RESERVER                            
                            var resv = _.filter( rm_creeps , (creep) => creep.memory.role == 'reserver' &&
                                                                        creep.memory.birth_target == rm_tgt &&
                                                                        ( creep.ticksToLive > distance || creep.spawning == true || !creep.ticksToLive ) )

                            global.rooms[rm].remotes.remotes[i].reserver = resv.length

                        }
                        else{
                            global.rooms[rm].remotes.remotes[i].carry = 0
                            global.rooms[rm].remotes.remotes[i].reserver = 0
                        }
                    }
                }

                if( loop_count >= 20 ){
                    break
                }

                global.remotes_cpu[Game.rooms[rm].memory.remotes[i].sources_id] = {}
                global.remotes_cpu[Game.rooms[rm].memory.remotes[i].sources_id].rm = rm
                global.remotes_cpu[Game.rooms[rm].memory.remotes[i].sources_id].dist = Game.rooms[rm].memory.remotes[i].distance
                global.remotes_cpu[Game.rooms[rm].memory.remotes[i].sources_id].harv = global.rooms[rm].remotes.remotes[i].harvester
            }
            global.rooms[rm].remotes.carry_sum = carry_sum
            global.rooms[rm].remotes.carry_need = carry_need  

        }         

        // dynamic calibration initialization
        if( 1 == 11 ){
            if( Game.rooms[rm].memory.hauler_calibration ){

                var row = Game.time % 100

                if( row == 0 ){

                    // avg
                    var avg = 0

                    for ( var ii = 0 ; ii < Game.rooms[ rm ].memory.hauler_calibration.length ; ii++){
                        var avg = avg + Game.rooms[ rm ].memory.hauler_calibration[ii]
                    }

                    var max = Math.round( avg/row )
                    Game.rooms[rm].memory.hauler_calibration_dyn = Math.max( max, 0 )
                }

                Game.rooms[rm].memory.hauler_calibration[row] = Game.rooms[rm].memory.hauler_calibration_dyn
            }
            else{
                Game.rooms[rm].memory.hauler_calibration = []
                Game.rooms[rm].memory.hauler_calibration_dyn = 0
            }
        }
        //

        // Remotes mapper
        if( 1==1 ){
            remotesMapper.run(rm)
        }

        // delete far remotes
        if( Game.time % Math.max( Memory.config.freq_outpost_order[ Game.rooms[rm].controller.level ], 2500 ) == 0 ){
            for ( var j = 0 ; j < Game.rooms[rm].memory.remotes.length ; j++){
                if( Game.rooms[rm].memory.remotes[j].distance > 150 && Game.rooms[rm].memory.remotes[j].distance != 1000 ){
                    Game.rooms[rm].memory.remotes.splice(j,1)
                    if (j > 0) { j = j - 1 }
                }
            }
        }
        //

        // send scouts
        if( 1 == 11 ){
            if( ( Game.rooms[rm].controller.level == 8 && Game.rooms[rm].memory.outpost && Game.time % 1500 == 0 ) ||
                ( Game.rooms[rm].controller.level <  8 && Game.rooms[rm].memory.outpost && Game.time %  500 == 0 ) ){

                if( !Memory.scout ){
                    Memory.scout = []
                }

                for ( var i = 0 ; i < Game.rooms[rm].memory.outpostOrder.length ; i++ ){

                    var rm_tgt = Game.rooms[rm].memory.outpostOrder[i].rm

                    if( Game.rooms[rm].memory.outpostOrder[i].distance == 1000 ){

                        if( _.filter( Memory.scout , (scout) => scout.rm == rm_tgt ).length == 0 ){
                            var cnt = Memory.scout.length
                            Memory.scout[cnt]         = {}
                            Memory.scout[cnt].rm      = rm_tgt
                            Memory.scout[cnt].request = rm
                            Memory.scout[cnt].scouted = Game.time
                        }
                    }
                }
            }
        }
        //


    }
};

module.exports = mainRemotes;