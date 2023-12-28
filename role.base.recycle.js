const Pathing       = require('pathing');

var roleRecycle = {

    /** @param {Creep} creep **/
    run: function( creep ) {

        var rm = creep.memory.birth

        if( !creep.memory.sucide_xx ){

            var done = 0

            if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container ){
            
                for ( var i = 0 ; i < Game.rooms[rm].memory.intel.container.length ; i++){

                    var obj = Game.getObjectById( Game.rooms[rm].memory.intel.container[i] )

                    if( obj && obj.store.getFreeCapacity() > done ){
                        var done = obj.store.getFreeCapacity()
                        creep.memory.sucide_xx = obj.pos.x
                        creep.memory.sucide_yy = obj.pos.y
                    }
                }
            }

            if( done == 0 ){
                if( Game.rooms[rm].memory.h1_type == 'h' ){
                    creep.memory.sucide_xx = Game.rooms[rm].memory.base_x + 0
                    creep.memory.sucide_yy = Game.rooms[rm].memory.base_y - 2
                }
                else{
                    creep.memory.sucide_xx = Game.rooms[rm].memory.base_x - 2
                    creep.memory.sucide_yy = Game.rooms[rm].memory.base_y + 0
                }
            }
        }
        else{
            var xx = creep.memory.sucide_xx
            var yy = creep.memory.sucide_yy
        }
        //        
 
        if (creep.pos.roomName == rm ) {

            if( creep.pos.x == xx && creep.pos.y == yy ){
                creep.suicide()
            }
            else{
                const target = new RoomPosition(xx, yy, rm);
                creep.moveTo(target, {range: 0, priority: Math.floor(Math.random() * 80) , visualizePathStyle: {stroke: '#c7f0ff', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            }
        }
        else {
            creep.moveTo( new RoomPosition(xx, yy, rm) , {range: 20, findRoute: true, ignoreRoads: true, priority: Math.floor(Math.random() * 5) , visualizePathStyle: {stroke: '#c7f0ff', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
        }
	}
};

module.exports = roleRecycle;
