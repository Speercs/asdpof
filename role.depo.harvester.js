const Pathing           = require('pathing');
var moveToTargetRoom_1  = require('function.moveToTargetRoom_1')

var roleDepoHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var prior  = 0
        var colour = '#FFFF00'

        Game.map.visual.circle(creep.pos, {fill: colour, radius: 1, stroke: colour, opacity: 0.9 });

        if(!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
            creep.memory.harvesting = true;
        }
        if(!creep.memory.harvesting ){
            var obj = Game.getObjectById( creep.memory.deposit )
            // return to base if limit is reached
            if( obj && obj.lastCooldown > 52 && creep.ticksToLive < 750 ){
                creep.memory.role = 'depo_collector'
                creep.memory.harvesting = false;
            }
        }
        if( creep.memory.harvesting && creep.store.getFreeCapacity() < creep.getActiveBodyparts(WORK) ) {
            creep.memory.harvesting = false;
        }

        var rm = creep.memory.birth
        var rm_tgt = creep.memory.birth_target
        
        
        // remove deposit from list
        if( Game.time % 3 == 0 && creep.getActiveBodyparts(MOVE) == 0 ){
            if( creep.memory.deposit ){
                delete Memory.depositsBank[ creep.memory.deposit ];
            }
        }
        //
        

        if( creep.pos.roomName == rm_tgt ){
        
            // harvesting
            if(creep.memory.harvesting ) {
                
                if( !creep.memory.deposit ){
                    
                    var depositId = creep.memory.birth_info_4
                    
                    var obj = Game.getObjectById( depositId ) 
                    
                    if( obj ){
                        creep.memory.deposit = creep.memory.birth_info_4
                    }
                    else {
                        delete Memory.depositsBank[ creep.memory.birth_info_4 ];
                    }
                }
                else{
                    
                    var obj = Game.getObjectById( creep.memory.deposit )
                    
                    if( obj && obj.cooldown == 0 ){
                        
                        var action = creep.harvest( obj )
                        
                        if ( action == OK ){
                            // update deposit list
                            var id = creep.memory.deposit
                            
                            if( Memory.depositsBank[id] ){
                            
                                Memory.depositsBank[id].ticksToDecay = obj.ticksToDecay
                                Memory.depositsBank[id].power        = obj.power
                                Memory.depositsBank[id].tick         = Game.time
                            }
                        }
                        else if ( action == ERR_NOT_IN_RANGE ){
                            creep.moveTo(obj.pos, {range: 1, visualizePathStyle: {stroke: '#e342f5', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                    }
                    else{
                        creep.moveTo(obj.pos, {range: 1, visualizePathStyle: {stroke: '#e342f5', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                    
                    // return to base if limit is reached
                    if( obj && obj.lastCooldown > 52 && creep.ticksToLive < 750 ){
                        creep.memory.role = 'depo_collector'
                        creep.memory.harvesting = false;
                    }
                    //
                    
                    // collect tomb or ground
                    if( creep.ticksToLive % 17 == 0 && obj && obj.cooldown > 0 ){
                        var obj = creep.pos.findInRange(FIND_TOMBSTONES, 1, {filter: (tomb) =>  {return (  tomb.store['silicon'] > 0 || tomb.store['metal'] > 0 ||tomb.store['biomass'] > 0 ||tomb.store['mist'] > 0   )  } }   );
                        
                        if( obj && obj[0] ){
                            
                            var SYMBOLS= [
                                  'silicon','metal','biomass','mist'
                             ] 
                                 
                            for ( var i = 0 ; i < SYMBOLS.length ; i++){ 
                                var symb = SYMBOLS[i]
                                if( obj[0].store[symb] > 0 ){
                                    break;
                                }   
                            }
                            
                            creep.withdraw(obj[0], symb )
                            
                        }
                    }
                }
            }
            
            if( creep.ticksToLive % 10 == 0 || creep.ticksToLive < 20  ) {
                
                var obj = creep.pos.findInRange(FIND_MY_CREEPS, 1, {filter: (creep) =>  {return (    creep.memory.role == 'depo_collector'  )  } }   ); 
                
                var obj = obj.sort(function(a,b){return a.store.getFreeCapacity() - b.store.getFreeCapacity();}) // deixa o com mais storage como primeiro
           
                if( obj && obj[0] ){
                    
                    var SYMBOLS= [
                                  'silicon','metal','biomass','mist'
                             ] 
                                 
                    for ( var i = 0 ; i < SYMBOLS.length ; i++){ 
                        var symb = SYMBOLS[i]
                        if( creep.store[symb] > 0 ){
                            break;
                        }   
                    }
                        
                    creep.transfer(obj[0], symb)
                    
                }
            }
        }
        else{
            
            moveToTargetRoom_1.run( creep )
            // const mid_pos = new RoomPosition(24, 24, rm_tgt )
            // creep.moveTo(mid_pos, {range: 23, findRoute: true, maxOps: 4000, ignoreRoads: true, priority: -1 , visualizePathStyle: {stroke: '#e342f5', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            
        }
    }
};

module.exports = roleDepoHarvester;
