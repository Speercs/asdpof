var managerCollect= {

    run: function( creep, rm, role2) {

        // GET TASK ROUTINNE
        // from room manager set target
        if ( (!creep.memory.task_id || creep.memory.task_id == null ) && (Game.rooms[rm] && global.rooms[rm].manager_collect && global.rooms[rm].manager_collect.length >= 1) ) {

            for ( var i = 0 ; i < global.rooms[rm].manager_collect.length ; i++){

                // dropped
                if ( global.rooms[rm].manager_collect[i].type == 'dropped' &&
                     Math.ceil( global.rooms[rm].manager_collect[i].store / 50 ) >= creep.getActiveBodyparts(CARRY)/3 ){

                    var obj = _.filter(global.rooms[rm].manager_collect, (coll) => coll.type == 'dropped' &&
                                                                                        Math.ceil( coll.store / 50 ) >= creep.getActiveBodyparts(CARRY)/3 )

                    var objf = _.filter(obj, (coll) => coll.store >= creep.getActiveBodyparts(CARRY) * 50 )

                    if( objf && objf.length >= 1 ){
                        var obj = objf
                    }

                    if( obj && obj.length >= 1 ){
                        var dist_min = 999
                        var pos = i
                        for ( var ii = 0 ; ii < obj.length ; ii++){
                            var obj2  = Game.getObjectById( obj[ii].id )
                            var dist = Math.max( Math.abs(creep.pos.x-obj2.pos.x), Math.abs(creep.pos.y-obj2.pos.y))

                            if( dist < dist_min ){
                                var dist_min = dist
                                var pos = ii
                            }
                        }

                        creep.memory.task_id        = obj[pos].id
                        creep.memory.task_resource  = obj[pos].resource
                        creep.memory.task_operation = obj[pos].operation

                        global.rooms[rm].manager_collect[pos].store = global.rooms[rm].manager_collect[pos].store - creep.store.getFreeCapacity()

                        if( global.rooms[rm].manager_collect[pos].store <= 0 ){
                            global.rooms[rm].manager_drop.splice(pos,1)
                        }

                        break;
                    }
                }
                else if ( global.rooms[rm].manager_collect[i].type == 'container' && 
                          global.rooms[rm].manager_collect[i].resource == 'energy' &&
                          global.rooms[rm].manager_collect[i].store >= 500 &&
                         ( global.rooms[rm].manager_collect[i].store >= creep.store.getFreeCapacity() || global.rooms[rm].manager_collect[i].store >= 800  ) ) {

                    creep.memory.task_id        = global.rooms[rm].manager_collect[i].id
                    creep.memory.task_resource  = global.rooms[rm].manager_collect[i].resource
                    creep.memory.task_operation = global.rooms[rm].manager_collect[i].operation

                    global.rooms[rm].manager_collect[i].store = global.rooms[rm].manager_collect[i].store - creep.store.getFreeCapacity()

                    if( global.rooms[rm].manager_collect[i].store <= 0 ){
                        global.rooms[rm].manager_drop.splice(i,1)
                    }

                    break;
                }
                else if ( global.rooms[rm].manager_collect[i].type == 'container' && 
                          global.rooms[rm].manager_collect[i].resource != 'energy' &&
                          global.rooms[rm].manager_collect[i].store > 0  ) {

                    creep.memory.task_id        = global.rooms[rm].manager_collect[i].id
                    creep.memory.task_resource  = global.rooms[rm].manager_collect[i].resource
                    creep.memory.task_operation = global.rooms[rm].manager_collect[i].operation

                    global.rooms[rm].manager_collect[i].store = global.rooms[rm].manager_collect[i].store - creep.store.getFreeCapacity()

                    if( global.rooms[rm].manager_collect[i].store <= 0 ){
                        global.rooms[rm].manager_drop.splice(i,1)
                    }

                    break;
                }
                // tombstone
                if ( Game.rooms[rm].memory.mode_defend == 0 &&
                    ( global.rooms[rm].manager_collect[i].type == 'tombstone'                  ||
                     //(global.rooms[rm].manager_collect[i].type == 'tower' && ( Game.rooms[rm].memory.defend == 0 || Game.rooms[rm].controller.safeMode > 0 ) && Game.rooms[rm].energyAvailable <= Game.rooms[rm].energyCapacityAvailable * 0.5 ) ||
                     // global.rooms[rm].manager_collect[i].type == 'dropped'                    ||
                      global.rooms[rm].manager_collect[i].type == 'ruins' ) &&  
                      global.rooms[rm].manager_collect[i].store >= 25 * Game.rooms[rm].controller.level ){
                
                    var dist_min = 999
                    var pos = i
                    for ( var ii = 0 ; ii < global.rooms[rm].manager_collect.length ; ii++){
                          if ((global.rooms[rm].manager_collect[ii].type == 'tombstone' ||
                               //(global.rooms[rm].manager_collect[ii].type == 'tower' && ( Game.rooms[rm].memory.defend == 0 || Game.rooms[rm].controller.safeMode > 0 ) && Game.rooms[rm].energyAvailable <= Game.rooms[rm].energyCapacityAvailable * 0.5 )  ||
                               //global.rooms[rm].manager_collect[ii].type == 'dropped'   ||
                               global.rooms[rm].manager_collect[ii].type == 'ruins'  ) &&  global.rooms[rm].manager_collect[ii].store >= 25 * Game.rooms[rm].controller.level ){
                
                                 var obj  = Game.getObjectById( global.rooms[rm].manager_collect[ii].id )
                                 var dist = Math.max( Math.abs(creep.pos.x-obj.pos.x), Math.abs(creep.pos.y-obj.pos.y))
                
                                 if( dist < dist_min ){
                                    var dist_min = dist
                                    var pos = ii
                                 }
                           }
                     }
                
                    creep.memory.task_id        = global.rooms[rm].manager_collect[pos].id
                    creep.memory.task_resource  = global.rooms[rm].manager_collect[pos].resource
                    creep.memory.task_operation = global.rooms[rm].manager_collect[pos].operation
                
                    global.rooms[rm].manager_collect[pos].store = global.rooms[rm].manager_collect[pos].store - creep.store.getFreeCapacity()
                
                    break;
                
                }
                else if ( global.rooms[rm].manager_collect[i].type == 'terminal'  ) {
                
                    var energy_limit = 0
                
                    if ( global.rooms[rm].manager_collect[i].store > energy_limit) {
                
                        creep.memory.task_id        = global.rooms[rm].manager_collect[i].id
                        creep.memory.task_resource  = global.rooms[rm].manager_collect[i].resource
                        creep.memory.task_operation = global.rooms[rm].manager_collect[i].operation
                
                        break;
                    }
                }
                else if ( global.rooms[rm].manager_collect[i].type == 'storage' ) { 
                    
                    if( global.rooms[rm].manager_drop[0] && global.rooms[rm].manager_drop[0].type != 'storage' ){
                
                        if ( creep.memory.role == 'hauler_rm' ){ 
                            var energy_limit = 6000 
                        }
                        else{ 
                            var energy_limit = 0 
                        }
                    
                        if ( global.rooms[rm].manager_collect[i].store > energy_limit) {
                    
                            var obj = Game.rooms[rm].storage             
                    
                            creep.memory.task_id        = obj.id
                            creep.memory.task_resource  = global.rooms[rm].manager_collect[i].resource
                            creep.memory.task_operation = global.rooms[rm].manager_collect[i].operation
                    
                            break;
                    
                        }
                    }
                    else{
                        if( creep.pos.inRangeTo( Game.rooms[rm].storage, 1) ){
                            // do nothing
                        }
                        else{
                            var prior  = 110
                            var colour = '#00FF00'

                            creep.moveTo( Game.rooms[rm].storage, {range: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }                        
                    }
                }
                // // source
                // else if ( global.rooms[rm].manager_collect[i].type == 'source' && global.rooms[rm].manager_collect[i].available >= 1 && creep.getActiveBodyparts(WORK) > 0 ) {
                
                //     if (  global.rooms[rm].manager_collect[i+1] && global.rooms[rm].manager_collect[i+1].available >= 1 && global.rooms[rm].manager_collect[i+1].type == 'source' ){
                
                //         var dist1 = Math.max( Math.abs(global.rooms[rm].manager_collect[i+0].x - creep.pos.x ), Math.abs(global.rooms[rm].manager_collect[i+0].y - creep.pos.y ) )
                //         var dist2 = Math.max( Math.abs(global.rooms[rm].manager_collect[i+1].x - creep.pos.x ), Math.abs(global.rooms[rm].manager_collect[i+1].y - creep.pos.y ) )
                
                //         if( dist1 < dist2 ){
                //             var cnt = i
                //         }
                //         else {
                //             var cnt = i+1
                //         }
                //     }
                //     else{
                //         var cnt = i
                //     }
                
                //     // grava na memoria do creep
                //     creep.memory.task_id        = global.rooms[rm].manager_collect[cnt].id
                //     creep.memory.task_resource  = global.rooms[rm].manager_collect[cnt].resource
                //     creep.memory.task_operation = global.rooms[rm].manager_collect[cnt].operation
                //     global.rooms[rm].manager_collect[cnt].available = global.rooms[rm].manager_collect[cnt].available - 1
                //     break;
                
                // }
                // else if ( global.rooms[rm].manager_collect[i].type == 'collect creep' && global.rooms[rm].manager_collect[i].store > 0  ) {
                //
                //     creep.memory.task_id        = global.rooms[rm].manager_collect[i].id
                //     creep.memory.task_resource  = global.rooms[rm].manager_collect[i].resource
                //     creep.memory.task_operation = global.rooms[rm].manager_collect[i].operation
                //
                //     global.rooms[rm].manager_collect[i].store = -1
                //     break;
                //
                // }
            }
        }
        //

    }
};

module.exports = managerCollect;
