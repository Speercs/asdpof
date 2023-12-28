var baseBuildReset = {

    run: function(rm, lvl) {  

        // time
        if( Game.time % 18000 == 0 ){
            Game.rooms[rm].memory.phase = 1
            Game.rooms[rm].memory.oneTimer.intelConstruction = 2
            Game.rooms[rm].memory.oneTimer.build = 2
        }

        // spawn
        if ( Game.rooms[rm].memory.intel.spawn ){
            for ( i = 0 ; i < Game.rooms[rm].memory.intel.spawn.length ; i++){
                if( Game.rooms[rm].memory.intel.spawn[i] && Game.rooms[rm].memory.intel.spawn[i].id && !Game.getObjectById( Game.rooms[rm].memory.intel.spawn[i].id ) ){
                    Game.rooms[rm].memory.phase = 1      
                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                    Game.rooms[rm].memory.oneTimer.build = 2     

                    Game.rooms[rm].memory.intel.spawn[i] = {}
                }
            }
        }
        //

        // extension
        if( Game.rooms[rm].memory.energy_cap < Game.rooms[rm].energyCapacityAvailable ||
            ( Game.rooms[rm].controller.level == 8 && Game.rooms[rm].memory.intel.extension.length > 60 ) ){
            Game.rooms[rm].memory.phase = 1
            Game.rooms[rm].memory.oneTimer.intelConstruction = 2
            Game.rooms[rm].memory.oneTimer.build = 2
        }

        // extension 2
        if( Game.rooms[rm].controller.level == 8 && Game.rooms[rm].memory.intel.extension.length != 60 ){
            
            var obj = Game.rooms[rm].find(FIND_MY_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_EXTENSION )}})             
        
            for ( i = 0 ; i < obj.length ; i++){

                var obj_id = obj[i].id
                var ok = 0 

                for ( j = 0 ; j < Game.rooms[rm].memory.intel.extension.length ; j++){

                    if( Game.rooms[rm].memory.intel.extension[j].id == obj_id ){
                        var ok = 1
                        break;
                    }  
                }

                if( ok == 0 ){
                    var cnt = Game.rooms[rm].memory.intel.extension.length
                    Game.rooms[rm].memory.intel.extension[cnt] = {}
                    Game.rooms[rm].memory.intel.extension[cnt].id = obj_id
                }
            }
        } 
        //

        // storage
        if ( Game.rooms[rm].memory.phase > 7 && !Game.rooms[rm].storage ){
            Game.rooms[rm].memory.phase = 1
            Game.rooms[rm].memory.oneTimer.intelConstruction = 2
            Game.rooms[rm].memory.oneTimer.build = 2
        }
        //

        // terminal
        if ( Game.rooms[rm].memory.phase > 17 && !Game.rooms[rm].terminal ){
            Game.rooms[rm].memory.phase = 1
            Game.rooms[rm].memory.oneTimer.intelConstruction = 2
            Game.rooms[rm].memory.oneTimer.build = 2
        }
        //

        // tower
        if ( Game.rooms[rm].memory.intel.tower ){
            for ( i = 0 ; i < Game.rooms[rm].memory.intel.tower.length ; i++){
                if( Game.rooms[rm].memory.intel.tower[i].id && !Game.getObjectById( Game.rooms[rm].memory.intel.tower[i].id ) ){
                    Game.rooms[rm].memory.phase = 1
                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                    Game.rooms[rm].memory.oneTimer.build = 2

                    Game.rooms[rm].memory.intel.tower[i] = {}
                }
            }
        }
        //

        // link
        if ( Game.rooms[rm].memory.intel.link ){
            for ( i = 0 ; i < Game.rooms[rm].memory.intel.link.length ; i++){
                if( Game.rooms[rm].memory.intel.link[i] && Game.rooms[rm].memory.intel.link[i].id && !Game.getObjectById( Game.rooms[rm].memory.intel.link[i].id ) ){
                    Game.rooms[rm].memory.phase = 1
                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                    Game.rooms[rm].memory.oneTimer.build = 2

                    Game.rooms[rm].memory.intel.link[i] = {}
                }
            }
        }
        //

        // half container
        if ( Game.rooms[rm].memory.intel.container ){
            if( Game.rooms[rm].memory.phase > 3.2 && 
                ( !Game.rooms[rm].memory.intel.container[2] || 
                  ( Game.rooms[rm].memory.intel.container[2] && !Game.rooms[rm].memory.intel.container[2].id ) || 
                  ( Game.rooms[rm].memory.intel.container[2] && Game.rooms[rm].memory.intel.container[2].id && !Game.getObjectById( Game.rooms[rm].memory.intel.container[2].id ) ) ) ) {
                    
                Game.rooms[rm].memory.phase = 1
                Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                Game.rooms[rm].memory.oneTimer.build = 2
            }
        }

        // container
        if ( Game.rooms[rm].memory.intel.container ){
            for ( i = 0 ; i < Game.rooms[rm].memory.intel.container.length ; i++){
                if( Game.rooms[rm].memory.intel.container[i] && Game.rooms[rm].memory.intel.container[i].id ){

                    var obj = Game.getObjectById( Game.rooms[rm].memory.intel.container[i].id )

                    if( !obj ){                    
                        Game.rooms[rm].memory.phase = 1
                        Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                        Game.rooms[rm].memory.oneTimer.build = 2

                        Game.rooms[rm].memory.intel.container[i] = {}
                    }
                    else{
                        if( Game.rooms[rm].memory.intel.sources &&
                            Game.rooms[rm].memory.intel.sources[i] && 
                            Game.rooms[rm].memory.intel.sources[i].id ){  

                            var si = Game.getObjectById( Game.rooms[rm].memory.intel.sources[i].id )

                            if( si && obj.pos.isNearTo(si) ){
                                // ok
                            }
                            else{
                                if( i == 0 ){
                                    var s = 1
                                }
                                else if( i == 1 ){
                                    var s = 0
                                }

                                if( s != i &&
                                    Game.rooms[rm].memory.intel.sources[s] && 
                                    Game.rooms[rm].memory.intel.sources[s].id ){ 

                                    var ss = Game.getObjectById( Game.rooms[rm].memory.intel.sources[s].id )
                                    
                                    if( ss && obj.pos.isNearTo(ss)  ){
                                        for ( var j = 0 ; j < Game.rooms[rm].memory.planner.length ; j++){
                                            if( Game.rooms[rm].memory.planner[j][2] == 'container' &&
                                                Game.rooms[rm].memory.planner[j][0] == obj.pos.x &&
                                                Game.rooms[rm].memory.planner[j][1] == obj.pos.y  ){

                                                if( s == 0 ){
                                                    Game.rooms[rm].memory.planner[j][4] = 3
                                                    Game.rooms[rm].memory.planner[j][5] = 'container_source0'
                                                    Game.rooms[rm].memory.planner[j][6] = 0

                                                }
                                                else if( s == 1 ){
                                                    Game.rooms[rm].memory.planner[j][4] = 3.1
                                                    Game.rooms[rm].memory.planner[j][5] = 'container_source1'
                                                    Game.rooms[rm].memory.planner[j][6] = 1
                                                }

                                                Game.rooms[rm].memory.oneTimer.plannerReset = 2
                                                Game.rooms[rm].memory.phase = 1
                                                Game.rooms[rm].memory.oneTimer.build = 2

                                                Game.rooms[rm].memory.planner = _.sortBy( Game.rooms[rm].memory.planner,  function(o) { return o[3]*10000+o[4]; });
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        //    
        
        
        // link
        if ( Game.rooms[rm].memory.intel.link ){
            for ( i = 0 ; i < Game.rooms[rm].memory.intel.link.length ; i++){
                if( Game.rooms[rm].memory.intel.link[i] && Game.rooms[rm].memory.intel.link[i].id ){
                    
                    var obj = Game.getObjectById( Game.rooms[rm].memory.intel.link[i].id )

                    if( !obj ){                    
                        Game.rooms[rm].memory.phase = 1
                        Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                        Game.rooms[rm].memory.oneTimer.build = 10

                        Game.rooms[rm].memory.intel.container[i] = {}
                    }
                    else if( i == 0 ){
                        if( Game.rooms[rm].memory.intel.container &&
                            Game.rooms[rm].memory.intel.container[0] && 
                            Game.rooms[rm].memory.intel.container[0].id ){  

                            var c0 = Game.getObjectById( Game.rooms[rm].memory.intel.container[0].id )

                            if( c0 && obj.pos.isNearTo(c0) ){
                                // ok
                            }
                            else{

                                if( Game.rooms[rm].memory.intel.container &&
                                    Game.rooms[rm].memory.intel.container[1] && 
                                    Game.rooms[rm].memory.intel.container[1].id ){

                                    var c1 = Game.getObjectById( Game.rooms[rm].memory.intel.container[1].id )
                                    
                                    if( c1 && obj.pos.isNearTo(c1)  ){

                                        for ( var j = 0 ; j < Game.rooms[rm].memory.planner.length ; j++){

                                            if( Game.rooms[rm].memory.planner[j][2] == 'link' &&
                                                Game.rooms[rm].memory.planner[j][0] == obj.pos.x &&
                                                Game.rooms[rm].memory.planner[j][1] == obj.pos.y  ){
               
                                                Game.rooms[rm].memory.planner[j][3] = 15
                                                Game.rooms[rm].memory.planner[j][4] = 2300
                                                Game.rooms[rm].memory.planner[j][5] = ''
                                                Game.rooms[rm].memory.planner[j][6] = 2

                                                delete Game.rooms[rm].memory.intel.link[i]

                                                Game.rooms[rm].memory.oneTimer.plannerReset = 2
                                                Game.rooms[rm].memory.phase = 1
                                                Game.rooms[rm].memory.oneTimer.build = 15

                                                Game.rooms[rm].memory.planner = _.sortBy( Game.rooms[rm].memory.planner,  function(o) { return o[3]*10000+o[4]; });
                                                break;
                                            }    
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if( i == 2 ){
                        if( Game.rooms[rm].memory.intel.container &&
                            Game.rooms[rm].memory.intel.container[1] && 
                            Game.rooms[rm].memory.intel.container[1].id ){  

                            var c1 = Game.getObjectById( Game.rooms[rm].memory.intel.container[1].id )

                            if( c1 && obj.pos.isNearTo(c1) ){
                                // ok
                            }
                            else{

                                if( Game.rooms[rm].memory.intel.container &&
                                    Game.rooms[rm].memory.intel.container[0] && 
                                    Game.rooms[rm].memory.intel.container[0].id ){

                                    var c0 = Game.getObjectById( Game.rooms[rm].memory.intel.container[0].id )
                                    
                                    if( c0 && obj.pos.isNearTo(c0)  ){

                                        for ( var j = 0 ; j < Game.rooms[rm].memory.planner.length ; j++){

                                            if( Game.rooms[rm].memory.planner[j][2] == 'link' &&
                                                Game.rooms[rm].memory.planner[j][0] == obj.pos.x &&
                                                Game.rooms[rm].memory.planner[j][1] == obj.pos.y  ){
                                               
                                                Game.rooms[rm].memory.planner[j][3] = 11
                                                Game.rooms[rm].memory.planner[j][4] = 1800
                                                Game.rooms[rm].memory.planner[j][5] = ''
                                                Game.rooms[rm].memory.planner[j][6] = 0

                                                delete Game.rooms[rm].memory.intel.link[i]

                                                Game.rooms[rm].memory.oneTimer.plannerReset = 2
                                                Game.rooms[rm].memory.phase = 1
                                                Game.rooms[rm].memory.oneTimer.build = 15

                                                Game.rooms[rm].memory.planner = _.sortBy( Game.rooms[rm].memory.planner,  function(o) { return o[3]*10000+o[4]; });
                                                break;
                                            }  
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        // 



    }
};

module.exports = baseBuildReset;
