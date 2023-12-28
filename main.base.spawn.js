var functionSpawn = require('function.spawn')

var baseSpawn= {

    run: function(rm) {

        for ( var i = 0; i < Game.rooms[rm].memory.intel.spawn.length ; i++) {
            
            if( Game.rooms[rm].memory.intel.spawn[i] && Game.rooms[rm].memory.intel.spawn[i].id ){

                var obj = Game.getObjectById( Game.rooms[rm].memory.intel.spawn[i].id )
               
                // check if spawn is busy
                if( obj && obj.spawning && obj.spawning != null ){
                    // do nothing
    
                    if( obj.spawning.remainingTime == 0 ){
                        var block = Game.rooms[rm].lookForAt(LOOK_CREEPS, obj.pos.x, obj.pos.y + 1 );
    
                        if( block && block.length == 0 ){
                            var block = Game.rooms[rm].lookForAt(LOOK_CREEPS, obj.pos.x + 1, obj.pos.y );
                        }
    
                        if( block && block.length == 1 ){
                            var xx = Math.floor(Math.random() * 3 - 1 ) + block[0].pos.x
                            var yy = Math.floor(Math.random() * 3 - 1 ) + block[0].pos.y
                            if( xx > 49 ){ var xx = 49 }
                            if( xx < 0  ){ var xx = 0  }
                            if( yy > 49 ){ var yy = 49 }
                            if( yy < 0  ){ var yy = 0  }
                            block[0].say('sp block')
                            block[0].moveTo(new RoomPosition(xx, yy, rm), {range: 0 })
                        }
                    }
                }
                else if( obj ) {
                    // check if there is someone on the list and if enough energy
                    if( Game.rooms[rm].memory.manager_spawn && Game.rooms[rm].memory.manager_spawn.length >= 1 ){
    
                        var role = Game.rooms[rm].memory.manager_spawn[0]
    
                        var spawn_result = functionSpawn.run(obj.name,rm,role)
                        // console.log( obj.name,rm,role ,spawn_result )
                        if( spawn_result == 0 ){
                            Game.rooms[rm].memory.manager_spawn.splice(0,1)
                        }
                    }
                }
            }
        }
    }
};

module.exports = baseSpawn;
