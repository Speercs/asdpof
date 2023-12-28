const Pathing            = require('pathing');
var FunctionManualPath2  = require('function.manual_path2')
var FunctionStaticCount  = require('function.static_count')

var helper = {

    /** @param {Creep} creep **/
    run: function(creep,tickfreq) {
        
        var symb   = creep.memory.birth_info
        var rm_tgt = creep.memory.birth_target
        var rm     = creep.memory.birth

        if( symb >= 0 ){
            var symb = 'energy'
        }
                
        if(!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
            creep.memory.harvesting = true;
            creep.memory.route_manual = 0

            var dist = Game.map.findRoute(rm, rm_tgt).length
            if( creep.ticksToLive < dist * 2 * 50 + 50 ){ creep.suicide() }
        }
        if(creep.memory.harvesting && creep.store.getUsedCapacity() > 0) {
            creep.memory.harvesting = false;
            creep.memory.route_manual = 0
        }
        
     
            
        if(creep.memory.harvesting) {
            
            if( creep.pos.roomName == rm ){
                
                if( Game.rooms[rm].terminal && Game.rooms[rm].terminal.store[symb] >= 10000 ){
                    var obj = Game.rooms[rm].terminal
                }
                else if( Game.rooms[rm].storage && Game.rooms[rm].storage.store[symb] > 30000 ){
                    var obj = Game.rooms[rm].storage 
                }
           
                if( obj ) {
                    var action = creep.withdraw(obj, symb)
                    
        	        if(action == ERR_NOT_IN_RANGE) {
        	            
                        creep.moveTo(obj, {maxRooms: 1, range: 1,  ignoreRoads: true, priority: Math.floor(Math.random() * 95) , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
	     
        	        }
                }
            }
	        else {
	            var xx = 24
                var yy = 24
                var rm = rm
                var rng = 23
                    
                const mid_pos = new RoomPosition(xx, yy, rm)
                    
                creep.moveTo(mid_pos, {range: rng, findRoute: true, maxRooms:10, maxOps: 16000, ignoreRoads: true, priority: Math.floor(Math.random() * 95) , visualizePathStyle: {stroke: '#e342f5', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
	        }
	        
        }
        else {
            if( creep.pos.roomName == rm_tgt ){
                
                if( Game.rooms[rm_tgt].storage  ){
                    var obj = Game.rooms[rm_tgt].storage
                }

                if( obj ) {
                    var action = creep.transfer(obj, symb)
                    
        	        if(action == ERR_NOT_IN_RANGE) {
        	            
                        creep.moveTo(obj, {maxRooms: 1, range: 1, ignoreRoads: true, priority: Math.floor(Math.random() * 95) , visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
	     
        	        }
                }
            }
	        else {
	          
	            FunctionStaticCount.run( creep )

                var avoidRooms_tmp = Memory.avoidRooms_tmp

                var avoidRooms_mt = _.union(avoidRooms_tmp, creep.memory.avoid_temp)

                var xx = 24
                var yy = 24
                var rng = 23

                const mid_pos = new RoomPosition(xx, yy, rm_tgt)

                creep.moveTo(mid_pos, {range: rng, findRoute: true, maxRooms:12, maxOps: 16000, ignoreRoads: true, priority: 99, avoidRooms: avoidRooms_mt, visualizePathStyle: {stroke: '#FEB3FF', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} } )
          
	        }
        }  
        
       
    }
};

module.exports = helper;