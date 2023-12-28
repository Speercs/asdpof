const Pathing           = require('pathing');
var moveToTargetRoom_1  = require('function.moveToTargetRoom_1')

var roleDepoCollector = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var prior  = 0
        var colour = '#FFFF00'

        Game.map.visual.circle(creep.pos, {fill: colour, radius: 1, stroke: colour, opacity: 0.9 });

        if(!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
            creep.memory.harvesting = true;
            if( creep.ticksToLive < 600 ){
                creep.suicide()
            }
        }
        if( creep.memory.harvesting && creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 600 || 
            ( creep.getActiveBodyparts(MOVE) < creep.getActiveBodyparts(CARRY) && creep.store.getUsedCapacity() > creep.getActiveBodyparts(MOVE)*50-50  ) ) {
            creep.memory.harvesting = false;
        }
        
        var rm = creep.memory.birth
        var rm_tgt = creep.memory.birth_target
        
        // suicide harvester that changed role
        if( creep.pos.roomName == rm && creep.store.getUsedCapacity() == 0 && creep.getActiveBodyparts(WORK) > 0  ){
            creep.suicide()
        }
        
        
        //
        if( Game.time % 3 == 0 && creep.store.getUsedCapacity() > 0 ){
            var obj = creep.pos.findInRange( FIND_HOSTILE_CREEPS, 7, {filter: (creep) =>  {return ( creep.getActiveBodyparts(ATTACK) >=1 || creep.getActiveBodyparts(RANGED_ATTACK) >=1  )  }  }  ); 
            
            if( obj && obj[0] ){
                creep.memory.harvesting = false;
            }
        }
        //
        

        // harvesting
        if(creep.memory.harvesting ) {
   
            if( creep.pos.roomName == rm_tgt ){
                
                var collect_from = Game.rooms[rm_tgt].find(FIND_MY_CREEPS , {filter: (creep) =>  {return (    creep.store.getUsedCapacity() > 0 && creep.memory.role == 'depo_harvest'  )  } }   ); 
                
                var collect_from = collect_from.sort(function(a,b){return a.store.getFreeCapacity() - b.store.getFreeCapacity() ;} );
            
                if( collect_from && collect_from[0] ){
                    
                    if( creep.pos.findInRange([collect_from[0]],1).length >= 1 ){
                        // ok
                    }
                    else{
                        creep.say(collect_from[0].name)
                        
                        creep.moveTo(collect_from[0].pos, {maxRooms: 2, range: 1, plainCost: 1, swampCost: 1, roomCallback: function() {
                
                                                        let room = Game.rooms[creep.pos.roomName];
                                                        let costs = new PathFinder.CostMatrix;
                                                        
                                                        // terrain
                                                        const terrain = Game.map.getRoomTerrain( rm );
                                            
                                                        // avoid move in the border
                                                        for ( var xx = -7 ; xx <= 7 ; xx++){ 
                                                            for ( var yy = -7 ; yy <= 7 ; yy++){   
                                                                var xxx = creep.pos.x + xx
                                                                var yyy = creep.pos.y + yy
                                                                if( xxx <= 49 && xxx >= 0 && yyy <= 49 && yyy >= 0 ){
                                                                    switch(terrain.get(xxx,yyy)) {
                                                                        case TERRAIN_MASK_WALL:
                                                                            costs.set(xxx, yyy, 0)
                                                                        case TERRAIN_MASK_SWAMP:
                                                                            costs.set(xxx, yyy, 5)
                                                                        case 0:
                                                                            costs.set(xxx, yyy, 5)
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        
                                                    
                                                        // avoid creeps in the room
                                                        var objs = room.find(FIND_CREEPS)
                                                        
                                                        for ( var i = 0 ; i < objs.length ; i++){ 
                                                            if( creep.name != objs[i].name ){
                                                                var creep2 = objs[i]
                                                                costs.set(creep2.pos.x, creep2.pos.y, 255);
                                                            }
                                                        };
                                                 
                                                        return costs;
                                                      },
                                                    }
                                                )
                    }   
                }
            }
            else{
                moveToTargetRoom_1.run( creep )
            }
        }
        else {
            
            // unload on damage
            if( Game.time % 5 == 0 && creep.memory.birth_info_3 == 0 && creep.getActiveBodyparts(HEAL) == 0  ){
                
                if( creep.store.getUsedCapacity() > (creep.getActiveBodyparts(MOVE) * 50) ){
                    
                    var SYMBOLS= [
                                      'energy',
                                      'H','O','U','L','K','Z','X','G',
                                      'OH','ZK','UL',
                                      'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',
                                      'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                                      'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2',
                                      'power','ops',
                                      'silicon','metal','biomass','mist'
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
            else{
                if( creep.getActiveBodyparts(HEAL) >= 1 && creep.hits < creep.hitsMax){
                    creep.heal(creep)
                }
            }
            //
            
            
            // dropping home
            if( creep.pos.roomName == rm ){
    
                var obj = Game.rooms[rm].terminal
                
                if( obj && obj.store.getFreeCapacity() > 50000 ){
                    
                    var SYMBOLS= [
                                  'silicon','metal','biomass','mist'
                             ] 
                                 
                    for ( var i = 0 ; i < SYMBOLS.length ; i++){ 
                        var symb = SYMBOLS[i]
                        if( creep.store[symb] > 0 ){
                            break;
                        }   
                    }
                        
                    var action = creep.transfer(obj, symb)
                    
                    if ( action == OK ){
                        //
                    }
                    else if ( action == ERR_NOT_IN_RANGE ){
                        creep.moveTo(obj.pos, {range: 1, visualizePathStyle: {stroke: '#e342f5', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                    
                    creep.moveTo(obj.pos, {range: 1, visualizePathStyle: {stroke: '#e342f5', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    
                }
            }
            else {
                
                moveToTargetRoom_1.run( creep )
               
            }
        }
    }
};

module.exports = roleDepoCollector;
