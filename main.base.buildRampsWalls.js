var BaseBuildRampsWalls = {

    run: function(rm ) {

        var avoid_room = 'W28888N15'
        var avoid_room2 = 'W78888N25'
        var avoid_room3 = 'W88887N111'

        if( Game.gcl.level >= 2 && Game.rooms[rm].controller.level >= 4 && Game.rooms[rm].storage && 
            rm != avoid_room && rm != avoid_room2 && rm != avoid_room3 ){

            // check for tower filled
            var tower_filled = 0 
            if( Game.rooms[rm].memory.intel &&
                Game.rooms[rm].memory.intel.tower &&
                Game.rooms[rm].memory.intel.tower.length >= 1 ){

                for ( var i = 0 ; i < Game.rooms[rm].memory.intel.tower.length ; i++){
                    if( Game.rooms[rm].memory.intel.tower[i] && Game.rooms[rm].memory.intel.tower[i].id ){
                        var obj = Game.getObjectById( Game.rooms[rm].memory.intel.tower[i].id )
                        if( obj && obj.store['energy'] >= 700 ){
                            var tower_filled = 1
                            break;
                        }
                    }
                }
            }
            //

            if( tower_filled == 1 ){
 
                var build_cnt = 0

                for ( f1 in Game.flags ) {

                    if( Game.flags[f1].pos.roomName == rm ){

                        // rampart
                        if ( (Game.flags[f1].color == 5 && Game.rooms[rm].storage && Game.rooms[rm].memory.phase > 6 ) ||
                             (Game.flags[f1].color == 4 && Game.rooms[rm].terminal && Game.rooms[rm].memory.repairer_need == 0 && 1==1) ) {
                                
                                // && ( Game.rooms[rm].controller.safeMode > 0 || Game.rooms[rm].controller.safeModeCooldown > 0 || Game.shard.name == 'swc' || Game.shard.name == 'screepsplus0' || Game.shard.name == 'ba' ) )   ) {  //has tower

                            var dontbuild = 0
                            var xx = Game.flags[f1].pos.x
                            var yy = Game.flags[f1].pos.y

                            var build_strct = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy);

                            for ( var j = 0 ; j < build_strct.length ; j++){
                                if ( build_strct[j].structureType == 'rampart'  ) {
                                    for ( var i = 0 ; i < build_strct.length ; i++){
                                        if ( build_strct[i].structureType == 'road'  ) {
                                            var dontbuild = 1
                                            break;
                                        }
                                        else{
                                            var dontbuild = 0.5
                                        }
                                    }
                                }
                                else if ( build_strct[j].structureType == 'road' || build_strct[j].structureType == 'container' ) {
                                //
                                }
                            }

                            if ( dontbuild == 0 ) {
                                Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_RAMPART)
                                var build_cnt = build_cnt + 1
                                Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                            }
                            else if ( dontbuild == 0.5 && Game.flags[f1].secondaryColor == 5 && Game.rooms[rm].memory.phase > 25 ) {
                                Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_ROAD)
                                var build_cnt = build_cnt + 1
                                Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                            }

                        }
                        // WALL
                        else if ( Game.flags[f1].color == 9 && Game.rooms[rm].terminal && Game.rooms[rm].memory.repairer_need == 0 && 1==1 ) { //has tower

                            var dontbuild = 0
                            var xx = Game.flags[f1].pos.x
                            var yy = Game.flags[f1].pos.y

                            var build_strct = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy);

                            for ( var j = 0 ; j < build_strct.length ; j++){
                                if ( build_strct[j].structureType == 'constructedWall'  ) {
                                    var dontbuild = 1
                                    break;
                                }
                                else {
                                    build_strct[j].destroy()
                                }
                            }

                            if ( dontbuild == 0 ) {
                                Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_WALL)
                                var build_cnt = build_cnt + 1
                                Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                            }
                        }
                        // ROAD
                        else if ( Game.flags[f1].color == 10 && Game.rooms[rm].storage  ) { 

                            var dontbuild = 0
                            var xx = Game.flags[f1].pos.x
                            var yy = Game.flags[f1].pos.y

                            var build_strct = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy);

                            for ( var j = 0 ; j < build_strct.length ; j++){
                                if ( build_strct[j].structureType == 'road'  ) {
                                    var dontbuild = 1
                                    break;
                                }
                                else if ([j].structureType == 'container' ) {
                                    //
                                }
                                else {
                                    build_strct[j].destroy()
                                }
                            }

                            if ( dontbuild == 0 ) {
                                Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_ROAD)
                                var build_cnt = build_cnt + 1
                                Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                            }
                        }

                        if( build_cnt >= 5 ){
                            break;
                        }
                    }
                }
            }
        }
    }
};

module.exports = BaseBuildRampsWalls;
