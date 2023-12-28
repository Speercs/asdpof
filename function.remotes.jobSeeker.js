var functionRemotesJobSeeker = {

    run: function( creep, rm ) {

        // get an outpost job
        if( !global.rooms[rm].remotesJobs || global.rooms[rm].remotesJobs_tick != Game.time ){

            global.rooms[rm].remotesJobs = []
            global.rooms[rm].remotesJobs_tick = Game.time

            // check amount of remote harvester working
            var harv_obj = _.filter( Game.creeps , (creep) => creep.memory.role  == 'harvester_out' && 
                                                              creep.memory.birth == rm &&
                                                            ( creep.memory.phase == 3 || creep.memory.phase == 4 ) )

            if( harv_obj.length >= 1 ){

                for ( var i = 0 ; i < harv_obj.length ; i++){

                    var source_id = harv_obj[i].memory.birth_info_2

                    global.rooms[rm].remotesJobs[ source_id ] = {}
                    global.rooms[rm].remotesJobs[ source_id ].rm_tgt                 = harv_obj[i].memory.birth_target   // rm_tgt
                    global.rooms[rm].remotesJobs[ source_id ].source_id              = source_id                         // source id
                    global.rooms[rm].remotesJobs[ source_id ].distance               = harv_obj[i].memory.birth_info_5   // distance                    

                    if( !global.rooms[rm].remotesJobs[ source_id ].harvester_work ){
                        global.rooms[rm].remotesJobs[ source_id ].harvester_work = 0
                    }

                    var harv_cur = Math.min( 5 , harv_obj[i].getActiveBodyparts(WORK) ) * Math.min( harv_obj[i].memory.birth_info_5, harv_obj[i].ticksToLive )
                    global.rooms[rm].remotesJobs[ source_id ].harvester_work = Math.max( global.rooms[rm].remotesJobs[ source_id ].harvester_work , harv_cur )

                    if( !global.rooms[rm].remotesJobs[ source_id ].energyCapacity ){
                        if( Game.getObjectById(source_id) ){
                            global.rooms[rm].remotesJobs[ source_id ].energyCapacity = Game.getObjectById(source_id).energyCapacity
                        }
                        else{
                            global.rooms[rm].remotesJobs[ source_id ].energyCapacity = 1500
                        }
                    }

                    if( !global.rooms[rm].remotesJobs[ source_id ].ammount ){
                        global.rooms[rm].remotesJobs[ source_id ].ammount = 0
                    }

                    if( harv_obj[i].memory.container ){
                        if( Game.getObjectById( harv_obj[i].memory.container ) ){

                            global.rooms[rm].remotesJobs[ source_id ].ammount = Game.getObjectById( harv_obj[i].memory.container ).store['energy']

                            // look for sourcer on the ground and add to priority matrix
                            var ground = Game.rooms[ Game.getObjectById( harv_obj[i].memory.container ).pos.roomName ].lookForAt(LOOK_RESOURCES, Game.getObjectById( harv_obj[i].memory.container ).pos);
                            if( ground && ground[0] && ground[0].resourceType == 'energy'  ){
                                global.rooms[rm].remotesJobs[ source_id ].ammount = global.rooms[rm].remotesJobs[ source_id ].ammount + ground[0].amount
                            }
                        }
                        else{
                            global.rooms[rm].remotesJobs[ source_id ].ammount        = 0
                        }
                    }
   
                    if( harv_obj[i].memory.resource ){   
                        if( Game.getObjectById( harv_obj[i].memory.resource ) ){
                            global.rooms[rm].remotesJobs[ source_id ].ammount        = global.rooms[rm].remotesJobs[ source_id ].ammount + Game.getObjectById( harv_obj[i].memory.resource ).amount
                        }
                        else{
                            global.rooms[rm].remotesJobs[ source_id ].ammount        = 0
                        }                        
                    }   
                }

                // check for working haulers
                var hauler_obj = _.filter( Game.creeps , (creep) => creep.memory.role  == 'hauler_out' && 
                                                                    creep.memory.birth == rm &&
                                                                    creep.memory.harvesting == false &&
                                                                    creep.memory.birth_info_2 && creep.memory.birth_info_2 != null && creep.memory.birth_info_2 != 0
                                                                    )

                if( hauler_obj.length >= 1 ){
                
                    for ( var i = 0 ; i < hauler_obj.length ; i++){

                        var source_id = hauler_obj[i].memory.birth_info_2

                        if( !global.rooms[rm].remotesJobs[ source_id ].haulers ){
                            global.rooms[rm].remotesJobs[ source_id ].haulers = 0
                        }

                        global.rooms[rm].remotesJobs[ source_id ].haulers = global.rooms[rm].remotesJobs[ source_id ].haulers + hauler_obj[i].store.getFreeCapacity()

                    }
                }
   
                for( var source_id in global.rooms[rm].remotesJobs ) {

                    global.rooms[rm].remotesJobs[ source_id ].priority = + global.rooms[rm].remotesJobs[ source_id ].ammount
                                                                         + global.rooms[rm].remotesJobs[ source_id ].harvester_work
                                                                         - global.rooms[rm].remotesJobs[ source_id ].haulers                              
               
                }


                global.rooms[rm].remotesJobs = _.sortBy(global.rooms[rm].remotesJobs, priority );

            }
        }
        //

        // assing to memory
        if( global.rooms[rm].remotesJobs_tick && global.rooms[rm].remotesJobs_tick == Game.time ){

            for( var source_id in global.rooms[rm].remotesJobs ) {

                if( global.rooms[rm].remotesJobs[ source_id ].priority >= creep.getActiveBodyparts(CARRY) * 50 ){
                    
                    creep.memory.birth_target = global.rooms[rm].remotesJobs[ source_id ].birth_target
                    creep.memory.birth_info_2 = global.rooms[rm].remotesJobs[ source_id ].source_id
                    creep.memory.birth_info_3 = null
                    creep.memory.birth_info_4 = null
                    creep.memory.birth_info_5 = global.rooms[rm].remotesJobs[ source_id ].distance

                }       
            }
        }
        //

    }
}

module.exports = functionRemotesJobSeeker;


