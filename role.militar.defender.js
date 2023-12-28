const Pathing = require('pathing');
var remotesIntel = require('main.remotes.mapper.intel')
var militarIntel = require('main.militar.intel')

var FunctionCreepTargetInRange = require('function.creep_targeting_inrange')

var roleOutpostDefender = {

    run: function(creep) {

        creep.say('ok')
        
        var prior  = 20
        var colour = '#0307fc'
        
        Game.map.visual.circle(creep.pos, {fill: colour, radius: 1, stroke: colour, opacity: 0.9 });
        
        // scout
        // scout for enemies
        if ( creep.ticksToLive % 2 == 0 ){
            militarIntel.run(creep.pos.roomName)
        }        
        
        // set target
        if( ( Game.time % 9 == 1 || creep.ticksToLive == 1499 ) && creep.hits == creep.hitsMax ){
            
            // hostiles
            if( !creep.memory.oupost_target_rm || creep.memory.oupost_target_rm == null ){
                
                var rm = creep.memory.birth

                var def_obj = _.filter( Game.creeps , (creep) => creep.memory.role == 'defender' &&
                                                                 creep.memory.birth == rm &&
                                                                 creep.hits == creep.hitsMax )

                var has_target = 0
                for ( var j = 0 ; j < def_obj.length ; j++){ 
                    
                    if( def_obj[j].memory.oupost_target_rm && def_obj[j].memory.oupost_target_rm != null ){
                        var has_target = 1
                        creep.memory.oupost_target_rm = def_obj[j].memory.oupost_target_rm
                        creep.memory.phase = def_obj[j].memory.phase
                        break;
                    }
                }

                if( has_target == 0 ){
                    var at = _.sum( def_obj, creep => { return creep.getActiveBodyparts(ATTACK) }) * 30;
                    var ra = _.sum( def_obj, creep => { return creep.getActiveBodyparts(RANGED_ATTACK) }) * 10;
                    var heal = _.sum( def_obj, creep => { return creep.getActiveBodyparts(HEAL) }) * 12;
                    
                    for ( var i = 0 ; i < Game.rooms[rm].memory.remotes.length ; i++){     
                        
                        var rm_tgt = Game.rooms[rm].memory.remotes[i].rm
                        
                        if( Memory.hostile && 
                            Memory.hostile[ rm_tgt ] && 
                            Memory.hostile[ rm_tgt ].hostiles >= 1 &&
                            (Memory.hostile[rm_tgt].attack + Memory.hostile[rm_tgt].ranged - heal) * (Memory.hostile[rm_tgt].tough + Memory.hostile[rm_tgt].hits )/Memory.hostile[rm_tgt].hits * 1.05  < at + ra - Memory.hostile[ rm_tgt ].heal ){

                            for ( var j = 0 ; j < def_obj.length ; j++){ 
                                def_obj[j].memory.oupost_target_rm   = rm_tgt
                                def_obj[j].memory.phase              = 1
                            }
                            break;
                        }
                    }
                }
            }

            // core
            if( !creep.memory.oupost_target_rm || creep.memory.oupost_target_rm == null ){
                
                var rm = creep.memory.birth

                if( global.rooms[rm] &&
                    global.rooms[rm].remotes &&
                    global.rooms[rm].remotes.remotes ){

                    for ( var i = 0 ; i < global.rooms[rm].remotes.remotes.length ; i++){    

                        if( global.rooms[rm].remotes.remotes[i].status == 'invader' ){
                        
                            var rm_tgt = Game.rooms[rm].memory.remotes[i].rm

                            var def_obj = _.filter( Game.creeps , (creep) => creep.memory.role         == 'defender' &&
                                                                            creep.memory.birth == rm &&
                                                                            creep.hits == creep.hitsMax &&
                                                                            ( !creep.memory.oupost_target_rm || creep.memory.oupost_target_rm == null ) )

                            for ( var j = 0 ; j < def_obj.length ; j++){ 
                                def_obj[j].memory.oupost_target_rm   = rm_tgt
                                def_obj[j].memory.phase = 1
                            }
                            break;
                        }
                    }
                }
            }
        }
        //

        // move back room - if no target
        if( !creep.memory.oupost_target_rm || creep.memory.oupost_target_rm == null ){

            // heal
            if( creep.getActiveBodyparts( HEAL ) >= 1 ){
                if( creep.hits < creep.hitsMax ){
                    creep.heal(creep)
                }
            }
            
            if( creep.pos.roomName != creep.memory.birth ){
                
                FunctionCreepTargetInRange.run(null, creep) 
            
                var rm_tgt  = creep.memory.birth
                var xx      = 23
                var yy      = 23
                
                var target = new RoomPosition(xx, yy, rm_tgt)
                
                creep.moveTo(target, {maxOps: 9000, range: 20, findRoute: true, moveOffRoad: true, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                      
            }
            else{
                
                var rm_tgt  = creep.memory.birth
                var xx      = Game.rooms[rm_tgt].memory.base_x
                var yy      = Game.rooms[rm_tgt].memory.base_x
                
                var target = new RoomPosition(xx, yy, rm_tgt)
                
                creep.moveTo(target, {maxOps: 6000, range: 10, moveOffRoad: true, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                
            }            
        }
        //      
        
        // move to target
        if( creep.memory.phase == 1){

            // heal
            if( creep.getActiveBodyparts( HEAL ) >= 1 ){
                if( creep.hits < creep.hitsMax ){
                    creep.heal(creep)
                }
            }
            
            var xx      = 23
            var yy      = 23
            var rng     = 50
            var rm_tgt  = creep.memory.oupost_target_rm

            var dist = Game.map.findRoute(creep.pos.roomName, rm_tgt, {
                            routeCallback(roomName ) {

                                if( roomName == rm_tgt || roomName == creep.pos.roomName ){
                                    return 1;
                                }
                                else if( _.intersection( [ roomName ], Object.keys(Memory.hostile)).length >= 1 ) {    // avoid this room
                                    return Infinity;
                                }
                                else{
                                    return 1;
                                }                                                                                        
                            }});
                                     

            if( dist == -2 ){
                // no path found
                console.log("<font color=\"#FF0000\">No path found " + creep.memory.role + ", from: " + creep.pos.roomName + ", to: " + rm_tgt + "</font>")

                creep.memory.phase = 0 
                creep.memory.oupost_target_rm = null
                creep.say('path issue')
            }
            else{
                if( dist.length > 1 ){
                    var rm_tgt = dist[0].room                    
                }

                var target = new RoomPosition(xx, yy, rm_tgt)
                creep.moveTo(target, {range: rng, priority: prior ,maxRooms: 1, maxOps: 3500, plainCost: 2,swampCost: 10, containerCost: 15, visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            }

            if ( creep.pos.roomName == rm_tgt ) {
                creep.memory.phase = 2
            }            
            
            FunctionCreepTargetInRange.run(null, creep)
            
        }
        // attack
        else if( creep.memory.phase == 2){ 
            
            creep.say('phase2')
            
            var obj = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: (creep) =>  {return ( _.intersection([creep.owner.username], Memory.config.ally_list).length == 0 ) } } ) 

            if( obj && obj != null ){
                // ok
            }
            else{
                var obj = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_INVADER_CORE ) } })
            }   

            if( obj ){
                
                creep.say('target')

                // flee back to main room // clean memory
                if( ( creep.getActiveBodyparts(RANGED_ATTACK) == 0 && creep.getActiveBodyparts(ATTACK) == 0 ) ){
                    
                    creep.say('flee')

                    creep.memory.phase = 0 
                    creep.memory.oupost_target_rm = null

                    var rm_tgt  = creep.memory.birth
                    var xx      = 23
                    var yy      = 23
                    
                    var target = new RoomPosition(xx, yy, rm_tgt)
                    
                    creep.moveTo(target, {maxOps: 9000, range: 20, findRoute: true, moveOffRoad: true, priority: prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                 
                }
                // advance check
                else{  
                    
                    creep.say('advance')

                    // check for numeric superiority
                    var my_creeps_in_range = obj.pos.findInRange(FIND_MY_CREEPS, 8);
                    var hos_creeps_in_range = obj.pos.findInRange(FIND_HOSTILE_CREEPS, 8);

                    var functionCreepDamageCalc = require('function.creep_damage_calc')

                    var my_at = 0
                    var my_ranged = 0
                    for( var iii = 0; iii < my_creeps_in_range.length; iii++ ){
                        var result = functionCreepDamageCalc.run(my_creeps_in_range[iii])
                        var my_at = my_at + result[0]
                        var my_ranged = my_ranged + result[1]
                    }

                    var hos_at = 0
                    var hos_ranged = 0
                    var hos_heal = 0
                    for( var iii = 0; iii < hos_creeps_in_range.length; iii++ ){
                        var result = functionCreepDamageCalc.run(hos_creeps_in_range[iii])
                        var hos_at = hos_at + result[0]
                        var hos_ranged = hos_ranged + result[1]
                        var hos_heal = hos_heal + result[2]
                    }
                    //
                        
                    var advance = 0
                    var kite = 0

                    // ADVANCE - bid advantage
                    if( ( my_at + my_ranged ) >= ( hos_at + hos_ranged ) * 1.5 ){
                        var advance = 1
                        var kite = 1
                    }
                    else if( ( my_at + my_ranged - hos_heal ) >= ( hos_at + hos_ranged ) * 1.05 ){
                        var advance = 1
                        var kite = 1
                    }
                    else if( hos_ranged == 0 && creep.getActiveBodyparts(RANGED_ATTACK) > 0 ){
                        var kite = 1
                    }  
                    
                    if( kite == 1 && hos_at == 0 && hos_ranged == 0 ){
                        var kite = 2
                    }

                    creep.say('advance'+advance+kite)

                    if( advance == 1 && creep.getActiveBodyparts(ATTACK) >= 1 ){
                        creep.say('a-a')
                        var rng = 1
                        creep.moveTo(obj, {range: rng,maxRooms: 1, plainCost:1, swampCost:5, priority:prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                    }
                    else if( kite > 0 && creep.getActiveBodyparts(RANGED_ATTACK) >= 1 ){

                        if( kite == 2 ){
                            var dist_rng = 2
                        }
                        else{
                            var dist_rng = 3
                        }

                        if( creep.pos.getRangeTo(obj) > dist_rng ){
                            creep.say('k-a')
                            creep.moveTo(obj, {range: dist_rng, maxRooms: 1, plainCost:1, swampCost:5, priority:prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                        else if( creep.pos.getRangeTo(obj) == dist_rng ){
                            // fine spot
                            creep.say('k-fine')
                        }
                        else{
                            creep.say('k-r')
                            
                            var dir = creep.pos.getDirectionTo(obj);
                            var dir_op =[[ [,],[,],[,] ],
                                         [ [1,1],[0,1],[-1,1]       ,[1,0],[-1,0]],
                                         [ [0,1],[-1,1],[-1,0]      ,[1,1],[-1,-1]],
                                         [ [-1,1],[-1,0],[-1,-1]    ,[0,1],[0,-1]],
                                         [ [-1,0],[-1,-1],[0,-1]    ,[1,-1],[-1,1]],
                                         [ [-1,-1],[0,-1],[1,-1]    ,[1,0],[-1,0]],
                                         [ [0,-1],[1,-1],[1,0]      ,[-1,-1],[1,1]],
                                         [ [1,-1],[1,0],[1,1]       ,[0,1],[0,-1]],
                                         [ [1,0],[1,1],[0,1]        ,[1,-1],[-1,1]] ]

                            const terrain = new Room.Terrain(obj.pos.roomName);
                            var dir_possible_1 = []
                            var dir_possible_2 = []
                            var dir_possible_3 = []
                            var dir_possible_4 = []

                            for ( var j = 0 ; j < dir_op[dir].length ; j++){

                                var xx = creep.pos.x + dir_op[dir][j][0]
                                var yy = creep.pos.y + dir_op[dir][j][1]

                                if( xx >= 0 && yy >= 0 && xx <= 49 && yy <= 49 ){
                                    if( terrain.get(xx,yy) == 0 ){
                                        if( j == 3 || j == 4 ){
                                            dir_possible_3[dir_possible_3.length] = [xx,yy]
                                        }
                                        else{
                                            dir_possible_1[dir_possible_1.length] = [xx,yy]
                                        }                                        
                                    }
                                    else if( terrain.get(xx,yy) == 2 ){
                                        if( j == 3 || j == 4 ){
                                            dir_possible_4[dir_possible_4.length] = [xx,yy]
                                        }
                                        else{
                                            dir_possible_2[dir_possible_1.length] = [xx,yy]
                                        }                                        
                                    }
                                }
                            }

                            var dir_mv = 0

                            if( dir_possible_1.length > 0 ){
                                var dir_mv = dir_possible_1[Math.floor(Math.random() * dir_possible_1.length)]
                            }
                            else if( dir_possible_2.length > 0 ){
                                var dir_mv = dir_possible_2[Math.floor(Math.random() * dir_possible_2.length)]
                            }
                            else if( dir_possible_3.length > 0 ){
                                var dir_mv = dir_possible_3[Math.floor(Math.random() * dir_possible_3.length)]
                            }
                            else if( dir_possible_4.length > 0 ){
                                var dir_mv = dir_possible_4[Math.floor(Math.random() * dir_possible_4.length)]
                            }

                            if( dir_mv == 0 ){
                                var dir_mv = Math.floor(Math.random() * 8)
                                creep.move(dir_mv)
                            }
                            else{
                                var rm_tgt  = creep.pos.roomName
                                var xx      = dir_mv[0]
                                var yy      = dir_mv[1]                                
                                var target = new RoomPosition(xx, yy, rm_tgt)

                                creep.moveTo(target, {range: 0, maxRooms: 1, plainCost:1, swampCost:1, priority:prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }                             
                        }
                    }
                    // keep distance
                    else{
                        creep.say('distance')
                        
                        if( creep.pos.getRangeTo(obj) > 7 ){
                            creep.say('d-a')
                            creep.moveTo(obj, {range: 6, maxRooms: 1, plainCost:1, swampCost:5, priority:prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                        }
                        else if( creep.pos.getRangeTo(obj) < 7 ){
                            creep.say('d-r')
                            var dir = creep.pos.getDirectionTo(obj);
                            var dir_op =[[ [,],[,],[,] ],
                                         [ [1,1],[0,1],[-1,1]       ,[1,0],[-1,0]],
                                         [ [0,1],[-1,1],[-1,0]      ,[1,1],[-1,-1]],
                                         [ [-1,1],[-1,0],[-1,-1]    ,[0,1],[0,-1]],
                                         [ [-1,0],[-1,-1],[0,-1]    ,[1,-1],[-1,1]],
                                         [ [-1,-1],[0,-1],[1,-1]    ,[1,0],[-1,0]],
                                         [ [0,-1],[1,-1],[1,0]      ,[-1,-1],[1,1]],
                                         [ [1,-1],[1,0],[1,1]       ,[0,1],[0,-1]],
                                         [ [1,0],[1,1],[0,1]        ,[1,-1],[-1,1]] ]

                            const terrain = new Room.Terrain(obj.pos.roomName);
                            var dir_possible_1 = []
                            var dir_possible_2 = []
                            var dir_possible_3 = []
                            var dir_possible_4 = []

                            for ( var j = 0 ; j < dir_op[dir].length ; j++){

                                var xx = creep.pos.x + dir_op[dir][j][0]
                                var yy = creep.pos.y + dir_op[dir][j][1]

                                if( xx >= 0 && yy >= 0 && xx <= 49 && yy <= 49 ){
                                    if( terrain.get(xx,yy) == 0 ){
                                        if( j == 3 || j == 4 ){ 
                                            dir_possible_3[dir_possible_3.length] = [xx,yy]
                                        }
                                        else{
                                            dir_possible_1[dir_possible_1.length] = [xx,yy]
                                        }                                        
                                    }
                                    else if( terrain.get(xx,yy) == 2 ){
                                        if( j == 3 || j == 4 ){
                                            dir_possible_4[dir_possible_4.length] = [xx,yy]
                                        }
                                        else{
                                            dir_possible_2[dir_possible_1.length] = [xx,yy]
                                        }                                        
                                    }
                                }
                            }

                            var dir_mv = 0

                            if( dir_possible_1.length > 0 ){
                                var dir_mv = dir_possible_1[Math.floor(Math.random() * dir_possible_1.length)]
                            }
                            else if( dir_possible_2.length > 0 ){
                                var dir_mv = dir_possible_2[Math.floor(Math.random() * dir_possible_2.length)]
                            }
                            else if( dir_possible_3.length > 0 ){
                                var dir_mv = dir_possible_3[Math.floor(Math.random() * dir_possible_3.length)]
                            }
                            else if( dir_possible_4.length > 0 ){
                                var dir_mv = dir_possible_4[Math.floor(Math.random() * dir_possible_4.length)]
                            }

                            if( dir_mv == 0 ){
                                var dir_mv = Math.floor(Math.random() * 8)
                                creep.move(dir_mv)
                            }
                            else{
                                var rm_tgt  = creep.pos.roomName
                                var xx      = dir_mv[0]
                                var yy      = dir_mv[1]                                
                                var target = new RoomPosition(xx, yy, rm_tgt)

                                creep.moveTo(target, {range: 0, maxRooms: 1, plainCost:1, swampCost:1, priority:prior , visualizePathStyle: {stroke: colour, lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
                            }                           
                        }
                        else{
                            creep.say('d-fine')
                        }
                    }   
                    //               
                }
            }
            else if( !obj || obj == null ){
                remotesIntel.run(creep.memory.birth, creep.pos.roomName)
                creep.memory.phase = 0 
                creep.memory.oupost_target_rm = null
            }

            FunctionCreepTargetInRange.run(obj, creep)
               
        }
        //
                
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

        if( creep.memory.rand_cnt >= 25 ){
            var rnd = Math.floor((Math.random() * 8) + 1);
            creep.move(rnd)
        }
        //
    }
};

module.exports = roleOutpostDefender;
