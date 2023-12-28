const Pathing            = require('pathing');
var FunctionBoost        = require('function.boost')
var FunctionManualPath2  = require('function.manual_path2')
var FunctionStaticCount  = require('function.static_count')

var MainObserverIntel    = require('main.observer.intel')

var role2aHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        Game.map.visual.circle(creep.pos, {fill: '#d18660', radius: 2, stroke: '#d18660', opacity: 0.9 });
        
        var rm_tgt  = creep.memory.birth_target
        var rm      = creep.memory.birth 

        if( creep.memory.boosted != 1 || !creep.memory.boosted ){
            FunctionBoost.run( creep )
        }
        
        // auto-attack life and death update
        if( creep.ticksToLive == 1498 ){
            // register birth
            for ( var i = 0 ; i < Memory.attack_list.length ; i++){
                
                if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt ){
                    
                    if( !Memory.attack_list[i].creep_count ){
                        Memory.attack_list[i].creep_count = 1
                    }
                    else{
                        Memory.attack_list[i].creep_count ++
                    }
                    break;
                }
            }
        }
        else if( creep.ticksToLive == 2 && creep.pos.roomName == rm_tgt ){
            // register death
            for ( var i = 0 ; i < Memory.attack_list.length ; i++){
                
                if( Memory.attack_list[i].rm == rm && Memory.attack_list[i].rm_sct == rm_tgt ){
                    
                    if( creep.pos.roomName == rm_tgt ){
                        MainObserverIntel.run( rm, rm_tgt )
                    }
                    
                    Memory.attack_list[i].creep_count = Memory.attack_list[i].creep_count - 1
                    break;
                }
            }
        }
        //

        // squad
        if ( creep.memory.boosted == 1 && !creep.memory.squaded ){
            
            var rm      = creep.memory.birth
            
            // rally
            for ( f1 in Game.flags ) {
                    
                var rm_flg = Game.flags[f1].pos.roomName
  
                if ( rm_flg == rm && Game.flags[f1].color == 3 && Game.flags[f1].secondaryColor == 3 ) {
                        
                    var xx = Game.flags[f1].pos.x
                    var yy = Game.flags[f1].pos.y
                    const mid_pos1 = new RoomPosition(xx, yy, rm)
                    creep.moveTo(mid_pos1, {maxRooms: 1, maxOps: 1000, ignoreRoads: true, range: 1, priority: 15 , visualizePathStyle: {stroke: '#d18660', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    
                }
            }
            
            var birth_info   = creep.memory.birth_info
            var birth_info_4 = creep.memory.birth_info_4
                        
            var creep_temp = _.filter(Game.creeps, (creep) => creep.memory.role == '2a_capt' && creep.pos.roomName == rm && creep.memory.boosted == 1 && creep.memory.birth_info_4 == birth_info_4 &&
                                                            ( !creep.memory.squad_number || creep.memory.squad_number == null ) )
    
            if ( creep_temp.length >= 1 ) {
                    
                var squad_number = (0 + Math.floor( (Game.time - 0) * Math.random() ) );

                creep_temp[0].memory.squaded        = 1
                creep_temp[0].memory.squad_number   = squad_number
                creep_temp[0].memory.squad_creep    = []
                creep_temp[0].memory.squad_creep[0] = creep.name
                
                creep.memory.squaded                = 1
                creep.memory.squad_number           = squad_number
                creep.memory.squad_capt             = creep_temp[0].name
            }
            
            if( creep.hits < creep.hitsMax ){
            
                creep.heal(creep) 
                
            }
        }
        
        if ( creep.memory.boosted == 1 && creep.memory.squaded == 1 &&1==2 ){
            if( creep.pos.roomName == rm_tgt ){
                creep.memory.portal = 0 
            }
            else{
                
                FunctionStaticCount.run( creep )
            
                var return0         = []
                var return0         = FunctionManualPath2.run(creep)
                var avoidRooms_mt   = return0[0]
                var rm_tgt          = return0[1]
                var portal          = return0[2]
    
                var max_rms = 16
                
                creep.memory.portal = portal
                
                if( portal == 1 ){
                    creep.memory.static_cnt = 0 
                    var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >2 && structure.pos.y >2 && structure.pos.x <48 && structure.pos.y <48 && !structure.destination.shard && structure.destination.roomName==rm_tgt ) } })
                    if( portal ){    
                        creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                }
                else if( creep.memory.static_cnt >= 5 ){
                    creep.memory.static_cnt = 0 
                    var portal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_PORTAL && structure.pos.x >2 && structure.pos.y >2 && structure.pos.x <48 && structure.pos.y <48 && !structure.destination.shard  ) } })
                    if( portal ){    
                        creep.moveTo(portal.pos, {maxRooms: 1, maxOps: 1000, range: 0, priority: 999 , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                }
            }
        }
        
        // chekc if capt is alive
        if ( creep.memory.boosted == 1 && creep.memory.squaded == 1 && Game.time % 3 == 0 ){
            
            if( Game.creeps[creep.memory.squad_capt ] ){
                creep.memory.route_manual = Game.creeps[creep.memory.squad_capt ].memory.route_manual
            }
            else{
                creep.memory.role = 'blinker'  
            }
        }
        
    }
};

module.exports = role2aHealer;