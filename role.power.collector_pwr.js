const Pathing           = require('pathing');
var FunctionStaticCount = require('function.static_count')

var roleCollectorPwr = {

    run: function(creep) {
        
        Game.map.visual.circle(creep.pos, {fill: '#fcba03', radius: 1, stroke: '#fcba03', opacity: 0.9 });
        if( creep.memory.birth_target ){
            Game.map.visual.line(creep.pos, new RoomPosition(24, 24, creep.memory.birth_target) ,{color: '#fcba03', lineStyle: 'dashed', width: 1 });
        }
       
        if(!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
            creep.memory.harvesting = true;
            creep.memory.route_manual = 0
            creep.memory.avoid_temp = []
            
            if( Game.map.getRoomLinearDistance(creep.memory.birth, creep.memory.birth_target) <= 1  ){
                var div = 300
            }
            else if( Game.map.getRoomLinearDistance(creep.memory.birth, creep.memory.birth_target) <= 2  ){
                var div = 400
            }
            else if( Game.map.getRoomLinearDistance(creep.memory.birth, creep.memory.birth_target) <= 3  ){
                var div = 500
            }
            else if( Game.map.getRoomLinearDistance(creep.memory.birth, creep.memory.birth_target) <= 4  ){
                var div = 600
            }
            else{
                var div = 750
            }
            
            if(creep.ticksToLive <= div ){
                creep.suicide()
            }
            else if ( creep.ticksToLive < 1400 &&  Game.rooms[creep.memory.birth_target] && Game.rooms[creep.memory.birth_target].find(FIND_DROPPED_RESOURCES, {filter: (reso) =>  {return (  reso.resourceType == 'power' ) } }).length == 0 ){
                creep.suicide()
            }
        }
        if( creep.memory.harvesting && creep.store.getUsedCapacity() > 0) {
            creep.memory.harvesting = false;
            creep.memory.avoid_temp = []
        }
        
        
        FunctionStaticCount.run( creep )
        
        // avoid back and forth move on travel
        if( !creep.memory.avoid_temp ){
            creep.memory.avoid_temp = []
        }
        else if( creep.memory.pos_3_rm && creep.memory.pos_3_rm != creep.pos.roomName ){
            creep.memory.avoid_temp = []
            creep.memory.avoid_temp[0] = creep.memory.pos_3_rm
        }
        
        if( creep.ticksToLive % 200 == 0 ){
            creep.memory.avoid_temp = []
        }
        //
        
     
        //main code
        if(creep.memory.harvesting ) {
            if( creep.pos.roomName == creep.memory.birth_target ){
                
                var ruin = creep.pos.findClosestByRange(FIND_RUINS, {filter: (structure) =>  {return ( structure.store['power'] > 0 ) } })
                creep.say('ruin')
                if( ruin ){
                    
                    var action = creep.withdraw(ruin, 'power');
                    
                    if( action == OK) {
                        // do nothing
                    }
                    else if( action == ERR_NOT_IN_RANGE) {
                        creep.moveTo(ruin, {maxRooms: 1, range: 1, priority: 9999 , visualizePathStyle: {stroke: '#e342f5', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                    else if( action == ERR_INVALID_TARGET) {
                        //creep.memory.role = 'recycle'
                    }
                }
                else {
                    
                    var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (reso) =>  {return (  reso.resourceType == 'power' ) } })
                    creep.say('dropped')
                    if( dropped ){
                        
                        var action = creep.pickup(dropped);
                        
                        if( action == OK) {
                            // do nothing
                        }
                        else if( action == ERR_NOT_IN_RANGE) {
                            creep.moveTo(dropped, {maxRooms: 1, range: 1, priority: 9999 , visualizePathStyle: {stroke: '#e342f5', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                        else if( action == ERR_INVALID_TARGET) {
                            //creep.memory.role = 'recycle'
                        }
                    }
                    else {
                        
                        var bank = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_POWER_BANK  ) } })
                        creep.say('bank')
                        if( bank ){
                            
                            creep.moveTo(bank.pos, {range: 5, maxOps: 1000 , maxRooms: 1 , ignoreRoads: true, priority: 99999 , visualizePathStyle: {stroke: '#e342f5', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            
                        }
                        else{
                            if( Game.time & 7 == 0 ){
                                creep.memory.role = 'scout' 
                            }
                            else{
                                creep.suicide()
                            }
                        }
                    }
                }
            }
            else{
                var xx = 24
                var yy = 24
                var rm = creep.memory.birth_target
                var rng = 23
                
                const mid_pos = new RoomPosition(xx, yy, rm)
                
                var avoidRooms_mt = creep.memory.avoid_temp
                var avoidRooms_tmp = Memory.avoidRooms_tmp
            
                var avoidRooms_mt = _.union(avoidRooms_mt, avoidRooms_tmp)
                
                creep.moveTo(mid_pos, {range: rng, avoidRooms: avoidRooms_mt , maxOps: 8000 ,findRoute: true, ignoreRoads: true, priority: 99999 , visualizePathStyle: {stroke: '#e342f5', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            }   
        }
        else {
            
            if( creep.pos.roomName == creep.memory.birth ){
                
                if ( Game.rooms[ creep.memory.birth ].terminal && Game.rooms[ creep.memory.birth ].terminal.store.getFreeCapacity() > 50000 ){
                    var source0 = Game.rooms[ creep.memory.birth ].terminal
                }
                else{
                    var source0 = Game.rooms[ creep.memory.birth ].storage
                }
                
                var SYMBOLS= ['power']
                              
                              
                for (var i = 0 ; i < SYMBOLS.length ; i++){
                    
                    if( creep.store.getUsedCapacity(SYMBOLS[i]) ){
                                            
                        var amt = creep.store.getUsedCapacity(SYMBOLS[i])
                        
                        var action = creep.transfer(source0, SYMBOLS[i] )
                        
                        if( action == OK) {
                            // do nothing
                        }
                        else if( action == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source0, {maxRooms: 1, range: 1, priority: 9999 , visualizePathStyle: {stroke: '#e342f5', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                        else if( action == ERR_INVALID_TARGET) {
                            //creep.memory.role = 'recycle'
                        }
                    }
                }
            }
            else {
                
                var xx = 24
                var yy = 24
                var rm = creep.memory.birth
                var rng = 20

                const mid_pos = new RoomPosition(xx, yy, rm)
                
                var avoidRooms_mt = creep.memory.avoid_temp
                
                creep.moveTo(mid_pos, {range: rng, avoidRooms: avoidRooms_mt, maxOps: 8000, findRoute: true, priority: 9999 , visualizePathStyle: {stroke: '#e342f5', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            }
        }
  
        
        
        
        // random move
        if( !creep.memory.rand_pos_x ) {
            creep.memory.rand_pos_x = creep.pos.x
            creep.memory.rand_pos_y = creep.pos.y
            creep.memory.rand_cnt = 0
        }
        else if( creep.memory.rand_pos_x == creep.pos.x && creep.memory.rand_pos_y == creep.pos.y ) {
            creep.memory.rand_cnt = creep.memory.rand_cnt + 1
        }
        else if( creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49 ) {
            creep.memory.rand_cnt = creep.memory.rand_cnt + 1
        }
        else {
            creep.memory.rand_cnt = 0
            creep.memory.rand_pos_x = creep.pos.x
            creep.memory.rand_pos_y = creep.pos.y
        }
        
        if( creep.memory.rand_cnt >= 15 ){
            var rnd = Math.floor((Math.random() * 8) + 1);
            creep.move(rnd)
        }
        
    }
};

module.exports = roleCollectorPwr;