var managerDrop= {

    run: function( creep, rm, role2) {

        // DROP
        // from room manager set target
        if ( (!creep.memory.task_id || creep.memory.task_id == null) && global.rooms[rm].manager_drop && global.rooms[rm].manager_drop.length >= 1 ) {

            for ( var i = 0 ; i < global.rooms[rm].manager_drop.length ; i++){
                
                if ( global.rooms[rm].manager_drop[i].type == 'repairer' && creep.memory.birth_target == 'repair' && creep.store['energy'] > 0 ) {
                
                    creep.memory.task_id        = global.rooms[rm].manager_drop[i].id
                    creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                    creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation

                    break;
                }
                else if ( global.rooms[rm].manager_drop[i].type == 'extension' && global.rooms[rm].manager_drop[i].need_av > 0 && creep.memory.role != 'hauler_out' && creep.store['energy'] > 0 ){

                    var tgt = _.filter( global.rooms[rm].manager_drop, (manager_drop) => manager_drop.need_av > 0 && manager_drop.type == 'extension'  )

                    if( tgt && tgt.length >=1 ){

                        var obj_temp = []

                        for ( var j = 0 ; j < tgt.length ; j++){
                            var cnt = obj_temp.length
                            var obj = Game.getObjectById( tgt[j].id )
                            if( obj ){
                                obj_temp[cnt] = obj
                            }
                        }

                        if( obj_temp.length >= 1 ){

                            var tgt_obj = creep.pos.findClosestByPath( obj_temp , {algorithm: 'dijkstra '} )

                            if( tgt_obj != null ){
                                var tgt2 = _.filter( tgt, (manager_drop) => manager_drop.id == tgt_obj.id  )

                                creep.memory.task_id        = tgt2[0].id
                                creep.memory.task_resource  = tgt2[0].resource
                                creep.memory.task_operation = tgt2[0].operation

                                var cnt = tgt2[0].cnt 
                                if( global.rooms[rm].manager_drop[cnt] ){
                                    global.rooms[rm].manager_drop[cnt].need_av = global.rooms[rm].manager_drop[cnt].need_av - creep.store['energy']

                                    if( global.rooms[rm].manager_drop[cnt].need_av < 0  ){
                                        Game.rooms[rm].memory.manager_spawn.splice(cnt,1)
                                    }
                                }
                            }

                            break;
                        }
                    }
                }
                else if ( global.rooms[rm].manager_drop[i].type == 'spawn' && global.rooms[rm].manager_drop[i].need_av > 0 && creep.memory.role != 'hauler_out' && creep.store['energy'] > 0) {

                    creep.memory.task_id        = global.rooms[rm].manager_drop[i].id
                    creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                    creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                    global.rooms[rm].manager_drop[i].need_av = global.rooms[rm].manager_drop[i].need_av - creep.store['energy']

                    break;
                }
                else if ( global.rooms[rm].manager_drop[i].type == 'storage' && global.rooms[rm].manager_drop[i].need_av > 0 ) {

                    creep.memory.task_id        = global.rooms[rm].manager_drop[i].id
                    if( creep.store['energy'] >0 ){
                        creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                    }
                    else{
                        for(var minerals in creep.store ) {
                            creep.memory.task_resource  = minerals
                            break;
                        }
                    }
                    
                    creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                    global.rooms[rm].manager_drop[i].need_av = global.rooms[rm].manager_drop[i].need_av - creep.store['energy']

                    break;
                }
                else if ( global.rooms[rm].manager_drop[i].type == 'tower' && global.rooms[rm].manager_drop[i].need_av > 0 && creep.store['energy'] > 0 ) {

                    creep.memory.task_id        = global.rooms[rm].manager_drop[i].id
                    creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                    creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                    global.rooms[rm].manager_drop[i].need_av = global.rooms[rm].manager_drop[i].need_av - creep.store['energy']

                    break;
                }
                else if ( global.rooms[rm].manager_drop[i].type == 'repairer' && creep.store['energy'] > 0 &&
                        _.filter(Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.role == 'hauler_rm' && creep.memory.birth_target == 'repair' ).length == 0                        
                        ) {

                    // var repairers_hauler = _.filter(Game.creeps, (creep) => creep.memory.birth == rm && 
                    //                                                         creep.memory.role == 'hauler_rm' &&
                    //                                                         creep.memory.birth_target == 'repair'
                    //                                                         )
                
                    creep.memory.task_id        = global.rooms[rm].manager_drop[i].id
                    creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                    creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                    // global.rooms[rm].manager_drop[i].need_av = global.rooms[rm].manager_drop[i].need_av - creep.store['energy']

                    break;
                }
                else if ( global.rooms[rm].manager_drop[i].type == 'builder' && creep.store['energy'] > 0 ) {

                    var builders = _.sortBy(_.filter(global.rooms[rm].manager_drop, (manager_drop) => manager_drop.type == 'builder' ), 'need_av' )

                    var last_builder = builders[builders.length-1] // less energy

                    creep.memory.task_id        = last_builder.id
                    creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                    creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                    // global.rooms[rm].manager_drop[i].need_av = global.rooms[rm].manager_drop[i].need_av - creep.store['energy']

                    break;
                }
                else if ( global.rooms[rm].manager_drop[i].type == 'container_controller' && global.rooms[rm].manager_drop[i].need_av >= creep.store.getUsedCapacity() && creep.store['energy'] > 0 ) {

                    creep.memory.task_id        = global.rooms[rm].manager_drop[i].id
                    creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                    creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                    global.rooms[rm].manager_drop[i].need_av = global.rooms[rm].manager_drop[i].need_av - creep.store['energy']

                    break;
                }
                else if ( global.rooms[rm].manager_drop[i].type == 'container_half' && global.rooms[rm].manager_drop[i].need_av >= creep.store.getUsedCapacity() && creep.store['energy'] > 0 ) {

                    creep.memory.task_id        = global.rooms[rm].manager_drop[i].id
                    creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                    creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                    global.rooms[rm].manager_drop[i].need_av = global.rooms[rm].manager_drop[i].need_av - creep.store['energy']

                    break;
                }
                else if ( global.rooms[rm].manager_drop[i].type == 'drop_upgrade' && global.rooms[rm].manager_drop[i].need_av > 0 && creep.store['energy'] > 0 ) {

                    creep.memory.task_id        = 'drop_upgrade'
                    creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                    creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                    global.rooms[rm].manager_drop[i].need_av = global.rooms[rm].manager_drop[i].need_av - creep.store['energy']

                    break;
                }

                // drop
                // if ( creep.store.getUsedCapacity() > 0 && creep.store['energy'] == 0 && ( Game.rooms[rm].terminal || Game.rooms[rm].storage ) ) {
                //
                //     var mineral_matrix = [  'energy',
                //
                //                             'H','O','U','L','K','Z','X',
                //                             'OH','ZK','UL',
                //                             'G',
                //
                //                             'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2',
                //                             'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                //                             'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',
                //
                //                             'power','ops',
                //
                //                             'silicon','metal','biomass', 'mist',
                //
                //                             'utrium_bar','lemergium_bar','zynthium_bar','keanium_bar','ghodium_melt','oxidant','reductant','purifier','battery','wire','cell','alloy','condensate',
                //
                //                             'composite','tube','phlegm','switch','concentrate',
                //
                //                             'crystal','fixtures','tissue', 'transistor', 'extract'
                //                         ]
                //
                //     for ( var j = 0 ; j < mineral_matrix.length ; j++){
                //         if ( creep.store[mineral_matrix[j]] > 0 ){
                //             var res = mineral_matrix[j]
                //             break;
                //         }
                //     }
                //
                //     if( Game.rooms[rm].terminal ){
                //         creep.memory.task_id        = Game.rooms[rm].terminal.id
                //     }
                //     else if( Game.rooms[rm].storage ){
                //         creep.memory.task_id        = Game.rooms[rm].storage.id
                //     }
                //
                //     creep.memory.task_resource  = res
                //     creep.memory.task_operation = 'transfer'
                //
                //     break;
                //
                // }
                // else if (
                //            (global.rooms[rm].manager_drop[i].type == 'extension' && global.rooms[rm].manager_drop[i].need_av > 0 ) &&
                //            // ( role2 == 'move' || ( role2 == 'work' && Game.rooms[rm].energyAvailable/Game.rooms[rm].energyCapacityAvailable < 0.3 &&  _.filter(Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.birth_target == 'work' && creep.memory.task_operation == 'transfer'  ).length < 1  )
                //            // ( role2 == 'move' || ( role2 == 'work' && Game.rooms[rm].energyAvailable/Game.rooms[rm].energyCapacityAvailable < 0.3 && _.filter(Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.birth_target == 'move' ).length <= 1 )
                //            ( role2 == 'move' || ( role2 == 'work' && _.filter(Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.birth_target == 'move' ).length == 0  )    ) ) {
                //
                //     var tgt = _.filter( global.rooms[rm].manager_drop, (manager_drop) => manager_drop.need_av > 0 && manager_drop.type == 'extension'  )
                //
                //     if( tgt && tgt.length >=1 ){
                //
                //         var obj_temp = []
                //
                //         for ( var j = 0 ; j < tgt.length ; j++){
                //             var cnt = obj_temp.length
                //             var obj = Game.getObjectById( tgt[j].id )
                //             if( obj ){
                //                 obj_temp[cnt] = obj
                //             }
                //         }
                //
                //         if( obj_temp.length >= 1 ){
                //
                //             var tgt_obj = creep.pos.findClosestByPath( obj_temp , {algorithm: 'dijkstra '} )
                //
                //             if( tgt_obj != null ){
                //                 var tgt2 = _.filter( tgt, (manager_drop) => manager_drop.id == tgt_obj.id  )
                //
                //                 creep.memory.task_id        = tgt2[0].id
                //                 creep.memory.task_resource  = tgt2[0].resource
                //                 creep.memory.task_operation = tgt2[0].operation
                //
                //                 var cnt = tgt2[0].cnt
                //                 global.rooms[rm].manager_drop[cnt].need_av = global.rooms[rm].manager_drop[cnt].need_av - creep.store['energy']
                //
                //                 if( global.rooms[rm].manager_drop[cnt].need_av < 0  ){
                //                     Game.rooms[rm].memory.manager_spawn.splice(cnt,1)
                //                     var i = i - 1
                //                 }
                //             }
                //
                //             break;
                //         }
                //     }
                // }

                // else if ( global.rooms[rm].manager_drop[i].type == 'container_controller' && global.rooms[rm].manager_drop[i].need_av > 0  && role2 == 'move') {
                //
                //     creep.memory.task_id        = global.rooms[rm].manager_drop[i].id
                //     creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                //     creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                //     if( Game.rooms[rm].controller.level >= 6  ){
                //         global.rooms[rm].manager_drop[i].need_av = - 1
                //     }
                //     else {
                //         global.rooms[rm].manager_drop[i].need_av = global.rooms[rm].manager_drop[i].need_av - creep.store['energy']
                //     }
                //
                //     break;
                // }
                // else if ( global.rooms[rm].manager_drop[i].type == 'tower' && global.rooms[rm].manager_drop[i].need_av > 0 && ( ( Game.rooms[rm].controller.level == 8 && role2 == 'move' ) || Game.rooms[rm].controller.level < 8  ) ) {
                //
                //     creep.memory.task_id        = global.rooms[rm].manager_drop[i].id
                //     creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                //     creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                //     global.rooms[rm].manager_drop[i].need_av = global.rooms[rm].manager_drop[i].need_av - creep.store['energy']
                //
                //     break;
                // }
                // else if ( global.rooms[rm].manager_drop[i].type == 'fill creep' && role2 == 'move' && global.rooms[rm].manager_drop[i].need_av >= 50 ) {
                //
                //     creep.memory.task_id        = global.rooms[rm].manager_drop[i].id
                //     creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                //     creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                //
                //     global.rooms[rm].manager_drop[i].need_av = 0
                //
                //      break;
                // }
                // else if ( global.rooms[rm].manager_drop[i].type == 'storage' && global.rooms[rm].manager_drop[i].need_av > 0 && role2 != 'repair' ) {
                //
                //     creep.memory.task_id        = global.rooms[rm].manager_drop[i].id
                //     creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                //     creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                //     global.rooms[rm].manager_drop[i].need_av = global.rooms[rm].manager_drop[i].need_av - creep.store['energy']
                //
                //     break;
                // }
                // else if ( global.rooms[rm].manager_drop[i].type == 'repair' && ( role2 == 'work' || role2 == 'repair' ) ) {
                //
                //     var pp  = global.rooms[rm].manager_drop[i].priority
                //     var tgt = _.filter( global.rooms[rm].manager_drop, (manager_drop) => manager_drop.type == 'repair' && manager_drop.priority == pp )
                //
                //     if ( tgt.length >= 1 ) {
                //
                //         for ( var j = 0 ; j < tgt.length ; j++){
                //             tgt[j].need = -tgt[j].need_av
                //         }
                //
                //         var tgt = _.sortBy( tgt, 'need' )
                //
                //         creep.memory.task_id        = tgt[0].id
                //         creep.memory.task_resource  = tgt[0].resource
                //         creep.memory.task_operation = tgt[0].operation
                //
                //         var cnt = tgt[0].cnt
                //         global.rooms[rm].manager_drop[cnt].need_av = global.rooms[rm].manager_drop[cnt].need_av - ( creep.store['energy'] * 100 )
                //
                //         if( global.rooms[rm].manager_drop[cnt].need_av < 0  ){
                //             Game.rooms[rm].memory.manager_spawn.splice(cnt,1)
                //             var i = i - 1
                //         }
                //
                //         break;
                //     }
                // }
                // else if ( global.rooms[rm].manager_drop[i].type == 'build' && ( role2 == 'work' || role2 == 'repair' ) ) {
                //
                //     var pp = global.rooms[rm].manager_drop[i].priority
                //     var tgt = _.filter( global.rooms[rm].manager_drop, (manager_drop) => manager_drop.type == 'build' && manager_drop.priority == pp  )
                //
                //     if( tgt.length >= 1 ){
                //
                //         var obj_temp = []
                //
                //         for ( var j = 0 ; j < tgt.length ; j++){
                //             var cnt = obj_temp.length
                //             var obj = Game.getObjectById( tgt[j].id )
                //             if( obj ){
                //                 obj_temp[cnt] = obj
                //             }
                //         }
                //
                //         if( obj_temp.length >= 1 ){
                //             var tgt_obj = creep.pos.findClosestByRange( obj_temp , {algorithm: 'dijkstra '} )
                //
                //             var tgt2 = _.filter( tgt, (manager_drop) => manager_drop.id == tgt_obj.id  )
                //
                //             creep.memory.task_id        = tgt2[0].id
                //             creep.memory.task_resource  = tgt2[0].resource
                //             creep.memory.task_operation = tgt2[0].operation
                //
                //             var cnt = tgt2[0].cnt
                //             global.rooms[rm].manager_drop[cnt].need_av = global.rooms[rm].manager_drop[cnt].need_av - creep.store['energy']
                //
                //             if( global.rooms[rm].manager_drop[cnt].need_av < 0  ){
                //                 Game.rooms[rm].memory.manager_spawn.splice(cnt,1)
                //                 var i = i - 1
                //             }
                //
                //             break;
                //
                //         }
                //     }
                // }
                // else if ( global.rooms[rm].manager_drop[i].type == 'upgrade' && role2 == 'work' ) {
                //
                //     // so um upgrader no level 8
                //     if( Game.rooms[rm].controller.level == 8 ) {
                //
                //         var obj = _.filter(Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.task_operation == 'upgradeController' )
                //
                //         if ( obj.length >= 1 ){
                //
                //             global.rooms[rm].manager_drop[i].priority = 1000
                //
                //         }
                //         else {
                //
                //             creep.memory.task_id        = global.rooms[rm].manager_drop[i].id
                //             creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                //             creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                //
                //              break;
                //
                //         }
                //     }
                //     else {
                //
                //         creep.memory.task_id        = global.rooms[rm].manager_drop[i].id
                //         creep.memory.task_resource  = global.rooms[rm].manager_drop[i].resource
                //         creep.memory.task_operation = global.rooms[rm].manager_drop[i].operation
                //
                //         break;
                //     }
                // }

                // console.log(i, rm , creep.name, global.rooms[rm].manager_drop[i].type, global.rooms[rm].manager_drop[i].priority , creep.memory.task_id , Game.cpu.getUsed() )

            }
        }
        //

    }
};

module.exports = managerDrop;
