const Pathing = require('pathing');

var functionBoostWork    = require('function.boost.work')

var roleBaseHarvesterMineral = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var prior  = 100
        var colour = '#00FF00'

        var rm = creep.memory.birth

        if( !global.rooms[rm] ){
            global.rooms[rm] = {}
        }

        if( !global.rooms[rm].path_to_avoid ){
            global.rooms[rm].path_to_avoid = {}
        }

        if( !global.rooms[rm].path_to_avoid[creep.name] ){
            global.rooms[rm].path_to_avoid[creep.name] = []
        }

        global.rooms[rm].path_to_avoid[creep.name] = [creep.pos.x, creep.pos.y]

        // boost WORK
        functionBoostWork.run( creep, rm, 'UO', prior , colour)   
        
        if( creep.memory.boosted == 1 ){
            // harvest - ground
            if( creep.store.getFreeCapacity() >= creep.getActiveBodyparts( WORK ) &&
                Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.minerals &&
                Game.rooms[rm].memory.intel.minerals[0] && Game.rooms[rm].memory.intel.minerals[0].id ) {

                var obj = Game.getObjectById( Game.rooms[rm].memory.intel.minerals[0].id )

                if( obj && (!obj.ticksToRegeneration || obj.ticksToRegeneration == 0) ){

                    var range = creep.pos.getRangeTo(obj);

                    if ( range > 1 ) {
                        creep.moveTo(obj, {range: 1, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                    else{
                        var ready = 1
                    }

                    // harvesting
                    if( ready == 1 ) {

                        // harvest source
                        var harv = creep.harvest( obj )
                    }
                }
            }
            //
        }
        //
    }
};

module.exports = roleBaseHarvesterMineral;
