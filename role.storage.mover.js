const Pathing           = require('pathing');
var FunctionBoost       = require('function.boost')
var FunctionManualPath2  = require('function.manual_path2')
var FunctionStaticCount  = require('function.static_count')

var mover_pillage = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var avoidRooms_tmp = Memory.avoidRooms_tmp

        if( creep.getActiveBodyparts(HEAL) > 0 && creep.hits < creep.hitsMax ){
            creep.heal(creep)
        }

        // avoid back and forth move on travel
        if( !creep.memory.avoid_temp ){
            creep.memory.avoid_temp = []
        }
        else if( creep.memory.pos_3_rm && creep.memory.pos_3_rm != creep.pos.roomName ){
            creep.memory.avoid_temp = []
            creep.memory.avoid_temp[0] = creep.memory.pos_3_rm
        }

        if( creep.ticksToLive % 50 == 0 ){
            creep.memory.avoid_temp = []
        }
        //

        Game.map.visual.circle(creep.pos, {fill: '#1F77B4', radius: 1, stroke: '#1F77B4', opacity: 0.9 });
        pos2 = new RoomPosition(25, 25, creep.memory.birth_target);
        Game.map.visual.line(creep.pos, pos2,{color: '#1F77B4', lineStyle: 'dashed', width: 1 });

        var rm_tgt = creep.memory.birth_target
        var rm     = creep.memory.birth  /// delivery

        if(!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
            creep.memory.harvesting = true;
            creep.memory.route_manual = 0;
            creep.memory.avoid_temp = []

            if( creep.memory.birth_info_4 > 0  ){
                var live = creep.memory.birth_info_4 * 100 + 75
            }
            else{
                var live = 750
            }

            if( creep.ticksToLive < live ){ creep.suicide() }


        }
        if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.memory.route_manual = 0;
            creep.memory.avoid_temp = []
        }

        // boost
        if( creep.memory.boosted != 1 || !creep.memory.boosted ){
            FunctionBoost.run( creep )
        }

        // unload on damage
        if( Game.time % 10 == 0 && creep.memory.birth_info_3 == 0 && creep.getActiveBodyparts(HEAL) == 0  ){

            if( creep.store.getUsedCapacity() > (creep.getActiveBodyparts(MOVE) * 50) ){

                var SYMBOLS= [
                                  'energy',
                                  'H','O','U','L','K','Z','X','G',
                                  'OH','ZK','UL',
                                  'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',
                                  'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                                  'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2',
                                  'power','ops',

                                  'silicon','metal','biomass','mist',

                                  'utrium_bar','lemergium_bar','zynthium_bar','keanium_bar','ghodium_melt','oxidant','reductant','purifier','battery',

                                  'composite','crystal','liquid',

                                  'wire','switch','transistor','microchip','circuit','device',

                                  'cell','phlegm','tissue','muscle','organoid','organism',

                                  'alloy','tube','fixtures','frame','hydraulics','machine',

                                  'condensate','concentrate','extract','spirit','emanation','essence'
                             ]

                for ( var i = 0 ; i < SYMBOLS.length ; i++){

                    var symb = SYMBOLS[i]

                    if( creep.store[symb] >= 50 ){
                        creep.drop(symb, (creep.store.getUsedCapacity() - creep.getActiveBodyparts(MOVE) * 50) )
                        break
                    }
                }
            }
        }
        //


        if( creep.memory.boosted == 1 ){

            if(creep.memory.harvesting) {

                if( creep.pos.roomName == rm_tgt ){

                    var obj = Memory.stats.minerals
                    var obj0 = {}
                    var obj1 = {}
                    var obj2 = {}
                    var obj3 = {}
                    var obj4 = {}

                    Object.keys(obj).forEach(key => {
                          if ( key == "machine" || key == "organism" || key == "device" || key == "essence" || key == "hydraulics" || key == "organoid" || key == "circuit" || key == "emanation" || key == "liquid" || key == "frame" || key == "muscle"|| key == "microchip"|| key == "spirit") {
                                obj0[key] = obj[key]
                          }
                          else if ( key == "XLHO2" || key == "XLH2O" || key == "XKH2O" || key == "XKHO2" || key == "XUHO2" || key == "XUH2O" || key == "XGHO2" || key == "XGH2O" || key == "XZH2O" || key == "XZHO2" ) {
                                obj1[key] = obj[key]
                          }
                          else if( key != "H" && key != "O" && key != "U" && key != "L" && key != "K" && key != "Z" && key != "X" && key != "energy" ){
                                obj2[key] = obj[key]
                          }
                          else if( key != "energy" ){
                                obj3[key] = obj[key]
                          }
                          else{
                                obj4[key] = obj[key]
                          }
                    })

                    var obj0 = Object.keys(obj0).sort(function(a,b){return obj0[a]-obj0[b]})
                    var obj1 = Object.keys(obj1).sort(function(a,b){return obj1[a]-obj1[b]})
                    var obj2 = Object.keys(obj2).sort(function(a,b){return obj2[a]-obj2[b]})
                    var obj3 = Object.keys(obj3).sort(function(a,b){return obj3[a]-obj3[b]})
                    var obj4 = Object.keys(obj4).sort(function(a,b){return obj4[a]-obj4[b]})
                    // console.log( JSON.stringify( obj1.concat(obj2) ) )

                    var SYMBOLS = obj0.concat(obj1);
                    var SYMBOLS = SYMBOLS.concat(obj2);
                    var SYMBOLS = SYMBOLS.concat(obj3);
                    var SYMBOLS = SYMBOLS.concat(obj4);

                    var found = 0

                    // storage and terminal`
                    if( Game.rooms[rm_tgt].terminal || Game.rooms[rm_tgt].storage ){
                        for ( var i = 0 ; i < SYMBOLS.length ; i++){

                            var symb = SYMBOLS[i]

                            if( symb == 'energy' ){
                                var amt_min = Memory.config.storage_lvl[8]
                            }
                            else {
                                var amt_min = 14000
                            }

                            if( eval( "Memory.stats.minerals." + symb ) < Memory.stats.number_rooms * amt_min ) {
                                if( Game.rooms[rm_tgt].terminal && Game.rooms[rm_tgt].terminal.store[symb] > 0 && creep.withdraw(Game.rooms[rm_tgt].terminal, symb) != - 1 ){
                                    var obj = Game.rooms[rm_tgt].terminal
                                    var found = 1
                                    break;
                                }
                                else if( Game.rooms[rm_tgt].storage && Game.rooms[rm_tgt].storage.store[symb] > 0 && creep.withdraw(Game.rooms[rm_tgt].storage, symb) != - 1 ){
                                    var obj = Game.rooms[rm_tgt].storage
                                    var found = 1
                                    break;
                                }
                            }
                        }
                    }
                    //

                    // container
                    if( found == 0 ){
                        var containers = Game.rooms[rm_tgt].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_CONTAINER &&  structure.store.getUsedCapacity() > 0 ) } } )

                        if( containers && containers.length > 0 ){

                            for ( var i = 0 ; i < SYMBOLS.length ; i++){

                                var symb = SYMBOLS[i]

                                if( symb == 'energy' ){
                                    var amt_min = Memory.config.storage_lvl[8]
                                }
                                else {
                                    var amt_min = 14000
                                }

                                if( eval( "Memory.stats.minerals." + symb ) < Memory.stats.number_rooms * amt_min ) {

                                    for ( var j = 0 ; j < containers.length ; j++){

                                        if( containers[j] && containers[j].store[symb] > 0 && creep.withdraw(containers[j], symb) != - 1 ){
                                            var obj = containers[j]
                                            var found = 1
                                            break;
                                        }
                                    }

                                    if( found == 1 ){
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    // ruins
                    if( found == 0 ){
                        var containers = Game.rooms[rm_tgt].find(FIND_RUINS, {filter: (reso) => ( reso.store.getUsedCapacity() > 0 ) } )

                        if( containers && containers.length > 0 ){

                            for ( var i = 0 ; i < SYMBOLS.length ; i++){

                                var symb = SYMBOLS[i]

                                if( symb == 'energy' ){
                                    var amt_min = Memory.config.storage_lvl[8]
                                }
                                else {
                                    var amt_min = 14000
                                }

                                if( eval( "Memory.stats.minerals." + symb ) < Memory.stats.number_rooms * amt_min ) {

                                    for ( var j = 0 ; j < containers.length ; j++){

                                        if( containers[j] && containers[j].store[symb] > 0 && creep.withdraw(containers[j], symb) != - 1 ){
                                            var obj = containers[j]
                                            var found = 1
                                            break;
                                        }
                                    }

                                    if( found == 1 ){
                                        break;
                                    }
                                }
                            }
                        }
                    }


                    // ground
                    if( found == 0 && Game.cpu.bucket > 9000 ){
                        var containers = Game.rooms[rm_tgt].find(FIND_DROPPED_RESOURCES, {filter: (reso) => ( reso.amount > 0 ) } )

                        if( containers && containers.length > 0 ){

                            for ( var i = 0 ; i < SYMBOLS.length ; i++){

                                var symb = SYMBOLS[i]

                                if( symb == 'energy' ){
                                    var amt_min = Memory.config.storage_lvl[8]
                                }
                                else {
                                    var amt_min = 14000
                                }

                                if( eval( "Memory.stats.minerals." + symb ) < Memory.stats.number_rooms * amt_min ) {

                                    for ( var j = 0 ; j < containers.length ; j++){

                                        if( containers[j] && containers[j].resourceType == symb && creep.pickup(containers[j]) != - 1 ){
                                            var obj = containers[j]
                                            var found = 1
                                            break;
                                        }
                                    }

                                    if( found == 1 ){
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    //



                    if( obj ) {
                        var action = creep.withdraw(obj, symb)

            	        if(action == ERR_NOT_IN_RANGE) {

                            creep.moveTo(obj, {maxRooms: 1, range: 1, plainCost: 1, swampCost: 1, ignoreRoads: true, priority: Math.floor(Math.random() * 95) , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

            	        }
            	        else if( action == ERR_INVALID_TARGET ){

            	            var action = creep.pickup(obj)

                	        if(action == ERR_NOT_IN_RANGE) {

                                creep.moveTo(obj, {maxRooms: 1, range: 1, plainCost: 1, swampCost: 1, ignoreRoads: true, priority: Math.floor(Math.random() * 95) , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

                	        }
            	        }
                    }
                }
    	        else {

                    FunctionStaticCount.run( creep )

                    var return0         = []
                    var return0         = FunctionManualPath2.run(creep)
                    var avoidRooms_mt   = return0[0]
                    var rm_tgt          = return0[1]
                    var portal          = return0[2]

                    var max_rms = 16

                    var avoidRooms_tmp = Memory.avoidRooms_tmp

                    var avoidRooms_mt = _.union(avoidRooms_mt, avoidRooms_tmp)
                    var avoidRooms_mt = _.union(avoidRooms_mt, creep.memory.avoid_temp)

                    if( portal == 1 ){
                        creep.memory.static_cnt = 0
                        var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >2 && structure.pos.y >2 && structure.pos.x <48 && structure.pos.y <48 && !structure.destination.shard && structure.destination.roomName==rm_tgt ) } })

                        if( portal ){
                            // do nothing
                        }
                        else{
                            // reduce rnge
                            var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >1 && structure.pos.y >1 && structure.pos.x <49 && structure.pos.y <49 && !structure.destination.shard && structure.destination.roomName==rm_tgt ) } })
                        }

                        if( portal ){
                            creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , plainCost: 1, swampCost: 1, visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                    }
                    else if( creep.memory.static_cnt >= 5 ){
                        creep.memory.static_cnt = 0
                        var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >2 && structure.pos.y >2 && structure.pos.x <48 && structure.pos.y <48 && !structure.destination.shard  ) } })
                        if( portal ){
                            creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , plainCost: 1, swampCost: 1, visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                    }
                    else if( !avoidRooms_mt || (avoidRooms_mt && avoidRooms_mt.length >= 1 && creep.pos.roomName != avoidRooms_mt[0]) || (avoidRooms_mt && avoidRooms_mt.length == 0) ){
                        const mid_pos = new RoomPosition(24, 24, rm_tgt)
                        creep.moveTo(mid_pos, {maxRooms: max_rms, avoidRooms: avoidRooms_mt, maxOps: 8000, findRoute: true, ignoreRoads: true, range: 23, priority: 999 , plainCost: 1, swampCost: 1, visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
    	        }

            }
            else {

                if( creep.pos.roomName == rm ){

                    if( Game.rooms[rm].storage && Game.rooms[rm].storage.store.getFreeCapacity() > 1250 ){
                        var obj = Game.rooms[rm].storage
                    }
                    else if( Game.rooms[rm].terminal && Game.rooms[rm].terminal.store.getFreeCapacity() > 1250 ){
                        var obj = Game.rooms[rm].terminal
                    }

                    var SYMBOLS= [
                                  'energy',
                                  'H','O','U','L','K','Z','X','G',
                                  'OH','ZK','UL',
                                  'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',
                                  'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                                  'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2',
                                  'power','ops',

                                  'silicon','metal','biomass','mist',

                                  'utrium_bar','lemergium_bar','zynthium_bar','keanium_bar','ghodium_melt','oxidant','reductant','purifier','battery',

                                  'composite','crystal','liquid',

                                  'wire','switch','transistor','microchip','circuit','device',

                                  'cell','phlegm','tissue','muscle','organoid','organism',

                                  'alloy','tube','fixtures','frame','hydraulics','machine',

                                  'condensate','concentrate','extract','spirit','emanation','essence'

                                  ]

                    for ( var i = 0 ; i < SYMBOLS.length ; i++){

                        var symb = SYMBOLS[i]

                        if( creep.store[symb] > 0 ){
                            break;
                        }
                    }

                    if( obj && symb ) {

                        var action = creep.transfer(obj, symb)

            	        if(action == ERR_NOT_IN_RANGE) {

                            creep.moveTo(obj, {maxRooms: 1, range: 1, ignoreRoads: true, priority: Math.floor(Math.random() * 95) , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

            	        }
                    }
                }
    	        else {

                    FunctionStaticCount.run( creep )

                    var return0         = []
                    var return0         = FunctionManualPath2.run(creep)
                    var avoidRooms_mt   = return0[0]
                    var rm_tgt          = return0[1]
                    var portal          = return0[2]

                    var max_rms = 16

                    var avoidRooms_mt = _.union(avoidRooms_mt, avoidRooms_tmp)
                    var avoidRooms_mt = _.union(avoidRooms_mt, creep.memory.avoid_temp)

                    if( portal == 1 ){
                        creep.memory.static_cnt = 0
                        var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >2 && structure.pos.y >2 && structure.pos.x <48 && structure.pos.y <48 && !structure.destination.shard && structure.destination.roomName==rm_tgt ) } })
                        if( portal ){
                            creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                        else{
                            var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >1 && structure.pos.y >1 && structure.pos.x <49 && structure.pos.y <49 && !structure.destination.shard && structure.destination.roomName==rm_tgt ) } })
                            if( portal ){
                                creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }
                        }
                    }
                    else if( creep.memory.static_cnt && creep.memory.static_cnt >= 5 ){
                        creep.memory.static_cnt = 0
                        var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >2 && structure.pos.y >2 && structure.pos.x <48 && structure.pos.y <48 && !structure.destination.shard  ) } })
                        if( portal ){
                            creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                    }
                    else if( !avoidRooms_mt || (avoidRooms_mt && avoidRooms_mt.length >= 1 && creep.pos.roomName != avoidRooms_mt[0]) || (avoidRooms_mt && avoidRooms_mt.length == 0) ){
                        creep.say(rm_tgt)
                        const mid_pos = new RoomPosition(24, 24, rm_tgt)
                        //creep.moveTo(mid_pos, {maxRooms: max_rms, avoidRooms: avoidRooms_mt, maxOps: 12000, findRoute: true, ignoreRoads: true, range: 23, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        creep.moveTo(mid_pos, {maxRooms: max_rms, avoidRooms: avoidRooms_mt, maxOps: 12000, findRoute: true, ignoreRoads: true, range: 23, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
    	        }
            }
        }

    }
};

module.exports = mover_pillage;
