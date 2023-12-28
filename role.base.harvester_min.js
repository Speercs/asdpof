const Pathing = require('pathing');
var FunctionStaticCount  = require('function.static_count')

var roleBasicsHarvester_min = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var prior  = 20
        var colour = '#FFFF00'

        Game.map.visual.circle(creep.pos, {fill: colour, radius: 1, stroke: colour, opacity: 0.9 });

        if(!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
            creep.memory.harvesting = true;
            creep.memory.task_id        = null
            creep.memory.task_resource  = null
            creep.memory.task_operation = null
        }
        if( creep.memory.harvesting && ( creep.store.getFreeCapacity() == 0 || ( creep.store.getUsedCapacity() > 0 && ( creep.memory.task_operation != 'harvest' &&  creep.memory.task_operation  != 'pickup' ) ) ) ) {
            creep.memory.harvesting     = false;
            creep.memory.task_id        = null
            creep.memory.task_resource  = null
            creep.memory.task_operation = null
        }

        // reset
        if( ( creep.ticksToLive % 150 == 0 ) ){
          // || Memory.one_timer.intelConstruction > 0 || Memory.one_timer.build > 0 || creep.memory.task_operation == 'upgradeController' || creep.memory.task_operation == 'repair' ) ){
            creep.memory.task_id        = null
            creep.memory.task_resource  = null
            creep.memory.task_operation = null
        }

        FunctionStaticCount.run( creep )

        var rm = creep.memory.birth
        var role2 = creep.memory.birth_target
        if( role2 == 'move' ){ var prior  = 30 }




        // give up upgrade task for build task
        if( creep.ticksToLive % 11 == 0 && creep.memory.task_operation == 'upgradeController' &&
            ( ( Game.rooms[rm].controller.level < 8 && _.filter(Game.rooms[rm].memory.manager_drop, (manager_drop) => manager_drop.type == 'build' ).length > 0 ) ||
              ( Game.rooms[rm].memory.mode_defend == 1 && _.filter(Game.rooms[rm].memory.manager_drop, (manager_drop) => manager_drop.type == 'repair' && manager_drop.priority <= 5 ).length > 0 ) ) ){
            creep.memory.task_id        = null
            creep.memory.task_resource  = null
            creep.memory.task_operation = null
        }
        //


        if( creep.pos.roomName == rm ){

            creep.memory.boosted = 1

            if(  creep.memory.boosted == 1 ){
                // harvesting
                if(creep.memory.harvesting) {

                    // from room manager set target
                    if ( (!creep.memory.task_id || creep.memory.task_id == null) && (Game.rooms[rm] && Game.rooms[rm].memory.manager_collect && Game.rooms[rm].memory.manager_collect.length >= 1) ) {

                        for ( var i = 0 ; i < Game.rooms[rm].memory.manager_collect.length ; i++){

                            // tombstone
                            if (( Game.rooms[rm].memory.manager_collect[i].type == 'tombstone'                  ||
                                 (Game.rooms[rm].memory.manager_collect[i].type == 'tower' && ( Game.rooms[rm].memory.defend == 0 || Game.rooms[rm].controller.safeMode > 0 ) && Game.rooms[rm].energyAvailable <= Game.rooms[rm].energyCapacityAvailable * 0.5 ) ||
                                  Game.rooms[rm].memory.manager_collect[i].type == 'dropped'                    ||
                                  Game.rooms[rm].memory.manager_collect[i].type == 'ruins' ) &&  Game.rooms[rm].memory.manager_collect[i].store >= 25 ){

                                var dist_min = 999
                                var pos = i
                                for ( var ii = 0 ; ii < Game.rooms[rm].memory.manager_collect.length ; ii++){
                                      if ((Game.rooms[rm].memory.manager_collect[ii].type == 'tombstone' ||
                                           (Game.rooms[rm].memory.manager_collect[ii].type == 'tower' && ( Game.rooms[rm].memory.defend == 0 || Game.rooms[rm].controller.safeMode > 0 ) && Game.rooms[rm].energyAvailable <= Game.rooms[rm].energyCapacityAvailable * 0.5 )  ||
                                           Game.rooms[rm].memory.manager_collect[ii].type == 'dropped'   ||
                                           Game.rooms[rm].memory.manager_collect[ii].type == 'ruins'  ||
                                           Game.rooms[rm].memory.manager_collect[ii].type == 'container' ) &&  Game.rooms[rm].memory.manager_collect[ii].store >= 25 ){

                                             var obj  = Game.getObjectById( Game.rooms[rm].memory.manager_collect[ii].id )
                                             var dist = Math.max( Math.abs(creep.pos.x-obj.pos.x), Math.abs(creep.pos.y-obj.pos.y))

                                             if( dist < dist_min ){
                                                var dist_min = dist
                                                var pos = ii
                                             }
                                       }
                                 }

                                creep.memory.task_id        = Game.rooms[rm].memory.manager_collect[pos].id
                                creep.memory.task_resource  = Game.rooms[rm].memory.manager_collect[pos].resource
                                creep.memory.task_operation = Game.rooms[rm].memory.manager_collect[pos].operation

                                Game.rooms[rm].memory.manager_collect[pos].store = Game.rooms[rm].memory.manager_collect[pos].store - creep.store.getFreeCapacity()

                                break;

                            }
                            else if ( Game.rooms[rm].memory.manager_collect[i].type == 'container'

                                    && ( ( role2 == 'move' && ( Game.rooms[rm].memory.manager_collect[i].store >= creep.store.getFreeCapacity() || Game.rooms[rm].memory.manager_collect[i].store >= 800  ) ) ||
                                         ( role2 == 'work' && !Game.rooms[rm].storage ) )
                                    && ( Game.rooms[rm].memory.manager_collect[i].resource == 'energy' || ( Game.rooms[rm].memory.manager_collect[i].resource != 'energy' && ( Game.rooms[rm].energyAvailable / Game.rooms[rm].energyCapacityAvailable > 0.95  ) ) ) ) {

                                creep.memory.task_id        = Game.rooms[rm].memory.manager_collect[i].id
                                creep.memory.task_resource  = Game.rooms[rm].memory.manager_collect[i].resource
                                creep.memory.task_operation = Game.rooms[rm].memory.manager_collect[i].operation

                                Game.rooms[rm].memory.manager_collect[i].store = Game.rooms[rm].memory.manager_collect[i].store - creep.store.getFreeCapacity()
                                break;

                            }
                            else if ( Game.rooms[rm].memory.manager_collect[i].type == 'terminal'  ) {

                                var energy_limit = 0

                                if ( Game.rooms[rm].memory.manager_collect[i].store > energy_limit) {

                                    creep.memory.task_id        = Game.rooms[rm].memory.manager_collect[i].id
                                    creep.memory.task_resource  = Game.rooms[rm].memory.manager_collect[i].resource
                                    creep.memory.task_operation = Game.rooms[rm].memory.manager_collect[i].operation

                                    break;
                                }
                            }
                            else if ( Game.rooms[rm].memory.manager_collect[i].type == 'storage' &&
                                      ( role2 == 'work' || role2 == 'repair' || ( role2 == 'move' && _.filter(Game.rooms[rm].memory.manager_drop, (drop) => drop.type != 'repair' && drop.type != 'upgrade' && drop.type != 'storage'  ).length > 0 ) )
                                    ) {

                                     if ( role2 == 'work' || role2 == 'repair' ){ var energy_limit = 6000 }
                                else if ( role2 == 'move') { var energy_limit = 0 }

                                if ( Game.rooms[rm].memory.manager_collect[i].store > energy_limit) {

                                    // container
                                    if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[3] && Game.rooms[rm].memory.intel.container[3].id ){
                                        var cont3 = Game.getObjectById( Game.rooms[rm].memory.intel.container[3].id )
                                    }

                                    if( cont3 && cont3.store['energy'] >= creep.store.getFreeCapacity() ){
                                        var obj = creep.pos.findClosestByPath([cont3, Game.rooms[rm].storage ] )
                                    }

                                    if( obj){
                                        //
                                    }
                                    else{
                                        var obj = Game.rooms[rm].storage
                                    }

                                    creep.memory.task_id        = obj.id
                                    creep.memory.task_resource  = Game.rooms[rm].memory.manager_collect[i].resource
                                    creep.memory.task_operation = Game.rooms[rm].memory.manager_collect[i].operation

                                    break;

                                }
                            }
                            // source
                            else if ( Game.rooms[rm].memory.manager_collect[i].type == 'source' && Game.rooms[rm].memory.manager_collect[i].available >= 1 && role2 == 'work') {

                                if (  Game.rooms[rm].memory.manager_collect[i+1] && Game.rooms[rm].memory.manager_collect[i+1].available >= 1 && Game.rooms[rm].memory.manager_collect[i+1].type == 'source' ){

                                    var dist1 = Math.max( Math.abs(Game.rooms[rm].memory.manager_collect[i+0].x - creep.pos.x ), Math.abs(Game.rooms[rm].memory.manager_collect[i+0].y - creep.pos.y ) )
                                    var dist2 = Math.max( Math.abs(Game.rooms[rm].memory.manager_collect[i+1].x - creep.pos.x ), Math.abs(Game.rooms[rm].memory.manager_collect[i+1].y - creep.pos.y ) )

                                    if( dist1 < dist2 ){
                                        var cnt = i
                                    }
                                    else {
                                        var cnt = i+1
                                    }
                                }
                                else{
                                    var cnt = i
                                }

                                // grava na memoria do creep
                                creep.memory.task_id        = Game.rooms[rm].memory.manager_collect[cnt].id
                                creep.memory.task_resource  = Game.rooms[rm].memory.manager_collect[cnt].resource
                                creep.memory.task_operation = Game.rooms[rm].memory.manager_collect[cnt].operation
                                Game.rooms[rm].memory.manager_collect[cnt].available = Game.rooms[rm].memory.manager_collect[cnt].available - 1
                                break;

                            }
                            else if ( Game.rooms[rm].memory.manager_collect[i].type == 'collect creep' && Game.rooms[rm].memory.manager_collect[i].store > 0  ) {

                                creep.memory.task_id        = Game.rooms[rm].memory.manager_collect[i].id
                                creep.memory.task_resource  = Game.rooms[rm].memory.manager_collect[i].resource
                                creep.memory.task_operation = Game.rooms[rm].memory.manager_collect[i].operation

                                Game.rooms[rm].memory.manager_collect[i].store = -1
                                break;

                            }
                        }
                    }





                    // COLLECT
                    // harvest
                    if ( creep.memory.task_operation  == 'harvest' ) {

                        var collect = Game.getObjectById( creep.memory.task_id )
                        var harv = creep.harvest( collect )

                        if( harv        == ERR_NOT_IN_RANGE) {
                            creep.moveTo(collect, {range: 1, maxRooms: 1, priority: prior, containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                        else if ( harv == ERR_NOT_ENOUGH_RESOURCES || action  == ERR_INVALID_TARGET ) {
                            creep.memory.task_id        = null
                            creep.memory.task_resource  = null
                            creep.memory.task_operation = null
                        }

                    }
                    else if ( creep.memory.task_operation  == 'withdraw' ) {

                        var collect = Game.getObjectById( creep.memory.task_id )
                        var action = creep.withdraw( collect , creep.memory.task_resource )

                        if( action        == ERR_NOT_IN_RANGE) {
                            creep.moveTo(collect, {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                        else if ( action  == ERR_NOT_ENOUGH_RESOURCES || action  == ERR_INVALID_TARGET ) {
                            creep.memory.task_id        = null
                            creep.memory.task_resource  = null
                            creep.memory.task_operation = null
                        }
                        else if( action == OK ){
                            var pos_back = new RoomPosition(creep.memory.pos_1_xx, creep.memory.pos_1_yy, creep.memory.pos_1_rm)
                            creep.moveTo(pos_back, {range: 0, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }

                    }
                    else if ( creep.memory.task_operation  == 'pickup' ) {

                        var collect = Game.getObjectById( creep.memory.task_id )
                        var action = creep.pickup( collect )

                        if( action        == ERR_NOT_IN_RANGE) {
                            creep.moveTo(collect, {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                        else if ( action  == ERR_INVALID_TARGET  ) {
                            creep.memory.task_id        = null
                            creep.memory.task_resource  = null
                            creep.memory.task_operation = null
                        }
                        else if( action == OK ){
                            var pos_back = new RoomPosition(creep.memory.pos_1_xx, creep.memory.pos_1_yy, creep.memory.pos_1_rm)
                            creep.moveTo(pos_back, {range: 0, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                    }
                    else if ( creep.memory.task_operation  == 'reverse transfer' ) {

                        var drop = Game.getObjectById( creep.memory.task_id )

                        if( drop ){
                            if( creep.pos.inRangeTo(drop.pos, 1) == true ){
                                var action = drop.transfer( creep , creep.memory.task_resource )
                            }
                            else {
                                creep.moveTo(drop, {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }
                        }
                        else{
                            var action = ERR_INVALID_TARGET
                        }

                        // clean memory
                        if ( action     == OK || action     == ERR_FULL || action == ERR_INVALID_TARGET || !drop ) {
                            creep.memory.task_id        = null
                            creep.memory.task_resource  = null
                            creep.memory.task_operation = null
                            if( action     == OK ){
                                creep.moveTo( Game.getObjectById( Game.rooms[rm].memory.intel.spawn[0].id ).pos , {range: 1, maxRooms: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }
                        }



                    }



                }
                else {

                    // from room manager set target
                    if ( (!creep.memory.task_id || creep.memory.task_id == null) && Game.rooms[rm].memory.manager_drop && Game.rooms[rm].memory.manager_drop.length >= 1 ) {

                        for ( var i = 0 ; i < Game.rooms[rm].memory.manager_drop.length ; i++){

                            // drop
                            if ( creep.store.getUsedCapacity() > 0 && creep.store['energy'] == 0 && ( Game.rooms[rm].terminal || Game.rooms[rm].storage ) ) {

                                var mineral_matrix = [  'energy',

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

                                                        'crystal','fixtures','tissue', 'transistor', 'extract'
                                                    ]

                                for ( var j = 0 ; j < mineral_matrix.length ; j++){
                                    if ( creep.store[mineral_matrix[j]] > 0 ){
                                        var res = mineral_matrix[j]
                                        break;
                                    }
                                }

                                if( Game.rooms[rm].terminal ){
                                    creep.memory.task_id        = Game.rooms[rm].terminal.id
                                }
                                else if( Game.rooms[rm].storage ){
                                    creep.memory.task_id        = Game.rooms[rm].storage.id
                                }

                                creep.memory.task_resource  = res
                                creep.memory.task_operation = 'transfer'

                                break;

                            }
                            else if (
                                       (Game.rooms[rm].memory.manager_drop[i].type == 'extension' && Game.rooms[rm].memory.manager_drop[i].need_av > 0 ) &&
                                       // ( role2 == 'move' || ( role2 == 'work' && Game.rooms[rm].energyAvailable/Game.rooms[rm].energyCapacityAvailable < 0.3 &&  _.filter(Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.birth_target == 'work' && creep.memory.task_operation == 'transfer'  ).length < 1  )
                                       // ( role2 == 'move' || ( role2 == 'work' && Game.rooms[rm].energyAvailable/Game.rooms[rm].energyCapacityAvailable < 0.3 && _.filter(Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.birth_target == 'move' ).length <= 1 )
                                       ( role2 == 'move' || ( role2 == 'work' && _.filter(Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.birth_target == 'move' ).length == 0  )    ) ) {

                                var tgt = _.filter( Game.rooms[rm].memory.manager_drop, (manager_drop) => manager_drop.need_av > 0 && manager_drop.type == 'extension'  )

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
                                            Game.rooms[rm].memory.manager_drop[cnt].need_av = Game.rooms[rm].memory.manager_drop[cnt].need_av - creep.store['energy']

                                            if( Game.rooms[rm].memory.manager_drop[cnt].need_av < 0  ){
                                                Game.rooms[rm].memory.manager_spawn.splice(cnt,1)
                                                var i = i - 1
                                            }
                                        }

                                        break;
                                    }
                                }
                            }
                            else if ( Game.rooms[rm].memory.manager_drop[i].type == 'spawn' && Game.rooms[rm].memory.manager_drop[i].need_av > 0 ) {

                                creep.memory.task_id        = Game.rooms[rm].memory.manager_drop[i].id
                                creep.memory.task_resource  = Game.rooms[rm].memory.manager_drop[i].resource
                                creep.memory.task_operation = Game.rooms[rm].memory.manager_drop[i].operation
                                Game.rooms[rm].memory.manager_drop[i].need_av = Game.rooms[rm].memory.manager_drop[i].need_av - creep.store['energy']

                                break;
                            }
                            else if ( Game.rooms[rm].memory.manager_drop[i].type == 'container_controller' && Game.rooms[rm].memory.manager_drop[i].need_av > 0  && role2 == 'move') {

                                creep.memory.task_id        = Game.rooms[rm].memory.manager_drop[i].id
                                creep.memory.task_resource  = Game.rooms[rm].memory.manager_drop[i].resource
                                creep.memory.task_operation = Game.rooms[rm].memory.manager_drop[i].operation
                                if( Game.rooms[rm].controller.level >= 6  ){
                                    Game.rooms[rm].memory.manager_drop[i].need_av = - 1
                                }
                                else {
                                    Game.rooms[rm].memory.manager_drop[i].need_av = Game.rooms[rm].memory.manager_drop[i].need_av - creep.store['energy']
                                }

                                break;
                            }
                            else if ( Game.rooms[rm].memory.manager_drop[i].type == 'tower' && Game.rooms[rm].memory.manager_drop[i].need_av > 0 && ( ( Game.rooms[rm].controller.level == 8 && role2 == 'move' ) || Game.rooms[rm].controller.level < 8  ) ) {

                                creep.memory.task_id        = Game.rooms[rm].memory.manager_drop[i].id
                                creep.memory.task_resource  = Game.rooms[rm].memory.manager_drop[i].resource
                                creep.memory.task_operation = Game.rooms[rm].memory.manager_drop[i].operation
                                Game.rooms[rm].memory.manager_drop[i].need_av = Game.rooms[rm].memory.manager_drop[i].need_av - creep.store['energy']

                                break;
                            }
                            else if ( Game.rooms[rm].memory.manager_drop[i].type == 'fill creep' && role2 == 'move' && Game.rooms[rm].memory.manager_drop[i].need_av >= 50 ) {

                                creep.memory.task_id        = Game.rooms[rm].memory.manager_drop[i].id
                                creep.memory.task_resource  = Game.rooms[rm].memory.manager_drop[i].resource
                                creep.memory.task_operation = Game.rooms[rm].memory.manager_drop[i].operation

                                Game.rooms[rm].memory.manager_drop[i].need_av = 0

                                 break;
                            }
                            else if ( Game.rooms[rm].memory.manager_drop[i].type == 'storage' && Game.rooms[rm].memory.manager_drop[i].need_av > 0 && role2 != 'repair' ) {

                                creep.memory.task_id        = Game.rooms[rm].memory.manager_drop[i].id
                                creep.memory.task_resource  = Game.rooms[rm].memory.manager_drop[i].resource
                                creep.memory.task_operation = Game.rooms[rm].memory.manager_drop[i].operation
                                Game.rooms[rm].memory.manager_drop[i].need_av = Game.rooms[rm].memory.manager_drop[i].need_av - creep.store['energy']

                                break;
                            }
                            else if ( Game.rooms[rm].memory.manager_drop[i].type == 'repair' && ( role2 == 'work' || role2 == 'repair' ) ) {

                                var pp  = Game.rooms[rm].memory.manager_drop[i].priority
                                var tgt = _.filter( Game.rooms[rm].memory.manager_drop, (manager_drop) => manager_drop.type == 'repair' && manager_drop.priority == pp )

                                if ( tgt.length >= 1 ) {

                                    for ( var j = 0 ; j < tgt.length ; j++){
                                        tgt[j].need = -tgt[j].need_av
                                    }

                                    var tgt = _.sortBy( tgt, 'need' )

                                    creep.memory.task_id        = tgt[0].id
                                    creep.memory.task_resource  = tgt[0].resource
                                    creep.memory.task_operation = tgt[0].operation

                                    var cnt = tgt[0].cnt
                                    Game.rooms[rm].memory.manager_drop[cnt].need_av = Game.rooms[rm].memory.manager_drop[cnt].need_av - ( creep.store['energy'] * 100 )

                                    if( Game.rooms[rm].memory.manager_drop[cnt].need_av < 0  ){
                                        Game.rooms[rm].memory.manager_spawn.splice(cnt,1)
                                        var i = i - 1
                                    }

                                    break;
                                }
                            }
                            else if ( Game.rooms[rm].memory.manager_drop[i].type == 'build' && ( role2 == 'work' || role2 == 'repair' ) ) {

                                var pp = Game.rooms[rm].memory.manager_drop[i].priority
                                var tgt = _.filter( Game.rooms[rm].memory.manager_drop, (manager_drop) => manager_drop.type == 'build' && manager_drop.priority == pp  )

                                if( tgt.length >= 1 ){

                                    var obj_temp = []

                                    for ( var j = 0 ; j < tgt.length ; j++){
                                        var cnt = obj_temp.length
                                        var obj = Game.getObjectById( tgt[j].id )
                                        if( obj ){
                                            obj_temp[cnt] = obj
                                        }
                                    }

                                    if( obj_temp.length >= 1 ){
                                        var tgt_obj = creep.pos.findClosestByRange( obj_temp , {algorithm: 'dijkstra '} )

                                        var tgt2 = _.filter( tgt, (manager_drop) => manager_drop.id == tgt_obj.id  )

                                        creep.memory.task_id        = tgt2[0].id
                                        creep.memory.task_resource  = tgt2[0].resource
                                        creep.memory.task_operation = tgt2[0].operation

                                        var cnt = tgt2[0].cnt
                                        Game.rooms[rm].memory.manager_drop[cnt].need_av = Game.rooms[rm].memory.manager_drop[cnt].need_av - creep.store['energy']

                                        if( Game.rooms[rm].memory.manager_drop[cnt].need_av < 0  ){
                                            Game.rooms[rm].memory.manager_spawn.splice(cnt,1)
                                            var i = i - 1
                                        }

                                        break;

                                    }
                                }
                            }
                            else if ( Game.rooms[rm].memory.manager_drop[i].type == 'upgrade' && role2 == 'work' ) {

                                // so um upgrader no level 8
                                if( Game.rooms[rm].controller.level == 8 ) {

                                    var obj = _.filter(Game.creeps, (creep) => creep.memory.birth == rm && creep.memory.task_operation == 'upgradeController' )

                                    if ( obj.length >= 1 ){

                                        Game.rooms[rm].memory.manager_drop[i].priority = 1000

                                    }
                                    else {

                                        creep.memory.task_id        = Game.rooms[rm].memory.manager_drop[i].id
                                        creep.memory.task_resource  = Game.rooms[rm].memory.manager_drop[i].resource
                                        creep.memory.task_operation = Game.rooms[rm].memory.manager_drop[i].operation

                                         break;

                                    }
                                }
                                else {

                                    creep.memory.task_id        = Game.rooms[rm].memory.manager_drop[i].id
                                    creep.memory.task_resource  = Game.rooms[rm].memory.manager_drop[i].resource
                                    creep.memory.task_operation = Game.rooms[rm].memory.manager_drop[i].operation

                                    break;
                                }
                            }

                            // console.log(i, rm , creep.name, Game.rooms[rm].memory.manager_drop[i].type, Game.rooms[rm].memory.manager_drop[i].priority , creep.memory.task_id , Game.cpu.getUsed() )

                        }
                    }

                    // DROP / BUILD / REPAIR / UPGRADE
                    // transfer
                    if ( creep.memory.task_operation  == 'transfer' ) {

                        var drop = Game.getObjectById( creep.memory.task_id )

                        // check if extension is already filled
                        if( Game.time % 2 == 0 &&  drop && drop.structureType == 'extension' && drop.store.getFreeCapacity('energy') == 0 ){

                            creep.say('ext')
                            var drop = null
                            creep.memory.task_id        = null
                            creep.memory.task_resource  = null
                            creep.memory.task_operation = null
                        }

                        // do action
                        if( drop ){
                            if( creep.pos.inRangeTo(drop.pos, 1) == true ){
                                var action = creep.transfer( drop , creep.memory.task_resource )
                            }
                            else {
                                creep.moveTo(drop, {range: 1, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                // var action = creep.transfer( drop , creep.memory.task_resource )
                            }
                        }
                        else{
                            var action = ERR_INVALID_TARGET
                        }

                        // clean memory
                        if ( action     == OK || action     == ERR_FULL || action == ERR_INVALID_TARGET || !drop ) {
                            creep.memory.task_id        = null
                            creep.memory.task_resource  = null
                            creep.memory.task_operation = null
                        }
                    }
                    else if ( creep.memory.task_operation  == 'upgradeController' ){
                        var drop = Game.getObjectById( creep.memory.task_id )
                        var action = creep.upgradeController( drop )

                        if( drop && action == ERR_NOT_IN_RANGE) {
                            creep.moveTo(drop, {range: 2, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            // repair if bucket is high
                            if( Game.cpu.bucket >= 9500 ){
                                var wk_parts = creep.getActiveBodyparts(WORK)
                                var obj = creep.pos.findInRange(FIND_STRUCTURES, 3, {filter: (structure) =>  {return ( (structure.structureType != STRUCTURE_WALL &&
                                                                                                                        structure.structureType != STRUCTURE_RAMPART &&
                                                                                                                        structure.hits <= ( structure.hitsMax - wk_parts * 100 ) ) ) } } )
                                if( obj && obj.length > 0 ){
                                    var obj = _.sortBy(obj, 'hits');
                                    creep.repair( obj[0] )
                                    creep.say('r')
                                }
                            }
                        }
                        else if ( action     == ERR_INVALID_TARGET || action == ERR_NOT_ENOUGH_RESOURCES || action == ERR_NOT_OWNER || !drop ) {
                            creep.memory.task_id        = null
                            creep.memory.task_resource  = null
                            creep.memory.task_operation = null
                        }
                        else if( action == OK ){
                            // move closer
                            if( creep.ticksToLive % 5 == 0 && creep.pos.getRangeTo(drop) > 2 ){
                                creep.moveTo(drop, {range: 2, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }
                        }
                    }
                    else if ( creep.memory.task_operation  == 'build' ){
                        var drop = Game.getObjectById( creep.memory.task_id )
                        var action = creep.build( drop )

                        if( drop && action == ERR_NOT_IN_RANGE) {
                            creep.moveTo(drop, {range: 2, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            // repair if bucket is high
                            if( Game.cpu.bucket >= 9500 ){
                                var wk_parts = creep.getActiveBodyparts(WORK)
                                var obj = creep.pos.findInRange(FIND_STRUCTURES, 3, {filter: (structure) =>  {return ( (structure.structureType != STRUCTURE_WALL &&
                                                                                                                        structure.structureType != STRUCTURE_RAMPART &&
                                                                                                                        structure.hits <= ( structure.hitsMax - wk_parts * 100 ) ) ) } } )
                                if( obj && obj.length > 0 ){
                                    var obj = _.sortBy(obj, 'hits');
                                    creep.repair( obj[0] )
                                    creep.say('r')
                                }
                            }
                        }
                        else if ( action     == ERR_INVALID_TARGET || action == ERR_NOT_ENOUGH_RESOURCES || action == ERR_NOT_OWNER || !drop ) {
                            creep.memory.task_id        = null
                            creep.memory.task_resource  = null
                            creep.memory.task_operation = null
                        }
                        else if( action == OK ){
                            // move closer
                            if( creep.ticksToLive % 5 == 0 && creep.pos.getRangeTo(drop) > 2 ){
                                creep.moveTo(drop, {range: 2, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }
                        }
                    }
                    else if ( creep.memory.task_operation  == 'repair' ){
                        var drop = Game.getObjectById( creep.memory.task_id )

                        if ( drop && drop.hits < drop.hitsMax ){

                            var action = creep.repair( drop )

                            if( drop && action == ERR_NOT_IN_RANGE) {
                                creep.moveTo(drop, {range: 2, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                // repair if bucket is high
                                if( Game.cpu.bucket >= 9500 ){
                                    var wk_parts = creep.getActiveBodyparts(WORK)
                                    var obj = creep.pos.findInRange(FIND_STRUCTURES, 3, {filter: (structure) =>  {return ( (structure.structureType != STRUCTURE_WALL &&
                                                                                                                            structure.structureType != STRUCTURE_RAMPART &&
                                                                                                                            structure.hits <= ( structure.hitsMax - wk_parts * 100 ) ) ) } } )
                                    if( obj && obj.length > 0 ){
                                        var obj = _.sortBy(obj, 'hits');
                                        creep.repair( obj[0] )
                                        creep.say('r')
                                    }
                                }
                            }
                            else if ( action     == ERR_INVALID_TARGET || action == ERR_NOT_ENOUGH_RESOURCES || action == ERR_NOT_OWNER || !drop ) {
                                creep.memory.task_id        = null
                                creep.memory.task_resource  = null
                                creep.memory.task_operation = null
                            }
                            else if( action == OK ){
                                // move closer
                                if( creep.ticksToLive % 5 == 0 && creep.pos.getRangeTo(drop) > 2 ){
                                    creep.moveTo(drop, {range: 2, maxRooms: 1, priority: prior , containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                                }
                            }
                        }
                        else {
                            creep.memory.task_id        = null
                            creep.memory.task_resource  = null
                            creep.memory.task_operation = null
                        }
                    }
                }
            }


            // try to get job from close creep
            if( Game.cpu.bucket == 10000 && Game.rooms[rm].storage && Game.rooms[rm].controller.level < 6 && creep.memory.birth_target == 'work' && creep.memory.harvesting && !creep.memory.task_id && creep.ticksToLive % 3 == 0 ){

                // // worker
                if( creep.store.getUsedCapacity() == 0 ){

                    var obj = creep.pos.findInRange(FIND_MY_CREEPS, 1, {filter: obj =>  obj.memory.role =='harvester_min' && obj.memory.birth_target == 'work' } );

                    for ( var i = 0 ; i < obj.length ; i++){
                        if( !obj[i].memory.harvesting && ( obj[i].memory.task_operation == 'upgradeController' || obj[i].memory.task_operation == 'build' || obj[i].memory.task_operation == 'repair' ) ){
                            if( obj[i].transfer(creep, 'energy', obj[0].store.getUsedCapacity()/2 ) == 0 ){
                                creep.memory.task_id        = obj[i].memory.task_id
                                creep.memory.task_resource  = obj[i].memory.task_resource
                                creep.memory.task_operation = obj[i].memory.task_operation
                                creep.memory.harvesting     = false
                                break
                            }
                        }
                    }
                }
            }
            //


            // drop energy around if filled
            if( creep.memory.birth_target == 'move' && Game.cpu.bucket >= 5000 && Game.rooms[rm].energyAvailable <= Game.rooms[rm].energyCapacityAvailable * 0.9 && creep.store.getUsedCapacity() >= 50  ){

                var obj = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: obj =>  obj.structureType == STRUCTURE_EXTENSION && obj.store.getFreeCapacity('energy') > 0 });

                if( obj.length >= 1 ){
                    creep.transfer(obj[0], 'energy')
                }
                else if( Game.cpu.bucket >= 8500 ) {
                    var obj = creep.pos.findInRange(FIND_MY_CREEPS, 1, {filter: obj =>  obj.memory.role =='harvester_min' && obj.memory.birth_target == 'work' && obj.store.getFreeCapacity() >= 50 });

                    if( obj.length >= 1 ){
                        creep.transfer(obj[0], 'energy')
                    }
                }
            }
            //


            // mover move back to spawn if nothing to do
            if( creep.memory.birth_target == 'move' && ( !creep.memory.task_id || creep.memory.task_id == null ) && 1==11 ){

                var xx = Game.rooms[rm].memory.base_x
                var yy = Game.rooms[rm].memory.base_y
                creep.moveTo(new RoomPosition(xx, yy, rm), {range: 3 ,maxRooms: 1})

            }
            //


            // random move
            if( !creep.memory.rand_pos_x ) {
                creep.memory.rand_pos_x = creep.pos.x
                creep.memory.rand_pos_y = creep.pos.y
                creep.memory.rand_cnt = 0
            }
            else if( creep.fatigue == 0 && creep.memory.rand_pos_x == creep.pos.x && creep.memory.rand_pos_y == creep.pos.y ) {
                creep.memory.rand_cnt = creep.memory.rand_cnt + 1
            }
            else if( creep.fatigue == 0 && ( creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49)  ) {
                creep.memory.rand_cnt = creep.memory.rand_cnt + 1
            }
            else {
                creep.memory.rand_cnt = 0
                creep.memory.rand_pos_x = creep.pos.x
                creep.memory.rand_pos_y = creep.pos.y
            }

            if( !Game.rooms[rm].storage ){
                var trigger = Math.max( Game.rooms[rm].controller.level * 2 + 1, 5 )
                if( creep.memory.task_operation == 'upgradeController' && creep.store.getFreeCapacity() > 0 ){
                    var trigger = 27
                }
            }
            else{
                var trigger = 27
            }

            if( creep.memory.rand_cnt >= trigger &&
                ( role2 == 'move' || creep.memory.harvesting == false || !creep.memory.task_operation || creep.memory.task_operation == null ) &&
                creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49 &&
                Game.rooms[ creep.pos.roomName ].lookForAtArea(LOOK_CREEPS,creep.pos.y - 1 , creep.pos.x - 1, creep.pos.y + 1, creep.pos.x + 1,true).length > 2
               ){
                var xx = Math.floor(Math.random() * 3 - 1 ) + creep.pos.x
                var yy = Math.floor(Math.random() * 3 - 1 ) + creep.pos.y
                if( xx > 49 ){ var xx = 49 }
                if( xx < 0  ){ var xx = 0  }
                if( yy > 49 ){ var yy = 49 }
                if( yy < 0  ){ var yy = 0  }
                creep.say('shit1')
                creep.moveTo(new RoomPosition(xx, yy, rm), {range: 0 })
                if( creep.memory.rand_cnt >= 41 ){
                    // creep.suicide()
                    creep.say('shit2')
                }
            }
        }
        else{

            const mid_pos = new RoomPosition(24, 24, rm)
            creep.moveTo(mid_pos, {range: 23, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

        }


    
        /// run from enemies
        if( Game.rooms[rm].memory.mode_defend == 1 && creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1).length > 0 ){
            creep.say('haaa')
            var xx = Game.rooms[rm].memory.base_x
            var yy = Game.rooms[rm].memory.base_y
            const mid_pos = new RoomPosition(xx, yy, rm)
            creep.moveTo(mid_pos, {range: 2, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
        }
    }
};

module.exports = roleBasicsHarvester_min;
