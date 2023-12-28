var baseBuild = {

    run: function( rm ) {
 
        Game.rooms[rm].memory.energy_cap = Game.rooms[rm].energyCapacityAvailable
        var contruction_sites = Game.rooms[rm].find( FIND_CONSTRUCTION_SITES   )

        // create memory if it is first time
        if (!Game.rooms[rm].memory.phase ){
            Game.rooms[rm].memory.phase = 1
        }
        //

        // remove all construction sites if phase 1
        if( Game.rooms[rm].memory.phase == 1 ){
            // remove not essential buildings
            for ( var i = 0 ; i < contruction_sites.length ; i++){
                if( ( contruction_sites[i].structureType == 'rampart' || contruction_sites[i].structureType == 'wall' || contruction_sites[i].structureType == 'road' ) && contruction_sites[i].progress == 0 ){
                    contruction_sites[i].remove()
                }
            }
        }
        //

        // fix for missing spawn on intel
        if( contruction_sites.length > 0 ){
            if( Game.rooms[rm].memory.intel.spawn && Game.rooms[rm].memory.intel.spawn[0] && Game.getObjectById( Game.rooms[rm].memory.intel.spawn[0].id ) ){

            }
            else{
                // remove all but spawn construction site
                for ( var i = 0 ; i < contruction_sites.length ; i++){
                    if( contruction_sites[i].structureType != 'spawn' ){
                        contruction_sites[i].remove()
                    }
                }
            }
        }

        //
        if( 1==1 ){

            var lvl     = Game.rooms[rm].controller.level
            var phase   = Game.rooms[rm].memory.phase
            var enrg_av = Game.rooms[rm].energyCapacityAvailable

            for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){
                var planner_phase   = Game.rooms[rm].memory.planner[i][3]
                var planner_enrg_av = Game.rooms[rm].memory.planner[i][4]

                if( planner_phase == phase || planner_phase == 0 ){
  
                    // EXTENSION 
                    if( enrg_av == 12900 && Game.rooms[rm].memory.planner[i][2] == 'extension' ){
                        var i = 59
                    }
                    else if(  Game.rooms[rm].memory.planner[i][2] == 'extension' &&
                                ( ( Game.rooms[rm].memory.intel.spawn && Game.rooms[rm].memory.intel.spawn[0] && !Game.getObjectById( Game.rooms[rm].memory.intel.spawn[0].id ) ||
                                  ( Game.rooms[rm].memory.intel.spawn && !Game.rooms[rm].memory.intel.spawn[0] ) ) ) ){
                        Game.rooms[rm].memory.phase = 1
                        // var i = 59
                        if( Game.rooms[rm].memory.intel.spawn && Game.rooms[rm].memory.intel.spawn[0] ){
                            Game.rooms[rm].memory.intel.spawn.splice(0,1)
                        }
                    }
                    else if( enrg_av < 12900 && Game.rooms[rm].memory.planner[i][2] == 'extension' ){
 
                        if( Game.rooms[rm].memory.phase == 0 ){ Game.rooms[rm].memory.phase = 1 }

                        var my_spawns = Game.rooms[rm].find( FIND_MY_SPAWNS, { filter: object => object.isActive() == true } );

                        if( lvl == 8 ){
                            var cnt_ext = 60
                            var planner_enrg_av = cnt_ext * 200 + my_spawns.length * 300
                        }
                        else if( lvl == 7 ){
                            var cnt_ext = 50
                            var planner_enrg_av = cnt_ext * 100 + my_spawns.length * 300
                        }
                        else if( lvl == 6 ){
                            var cnt_ext = 40
                            var planner_enrg_av = cnt_ext * 50 + my_spawns.length * 300
                        }
                        else if( lvl == 5 ){
                            var cnt_ext = 30
                            var planner_enrg_av = cnt_ext * 50 + my_spawns.length * 300
                        }
                        else if( lvl == 4 ){
                            var cnt_ext = 20
                            var planner_enrg_av = cnt_ext * 50 + my_spawns.length * 300
                        }
                        else if( lvl == 3 ){
                            var cnt_ext = 10
                            var planner_enrg_av = cnt_ext * 50 + my_spawns.length * 300
                        }
                        else if( lvl == 2 ){
                            var cnt_ext = 5
                            var planner_enrg_av = cnt_ext * 50 + my_spawns.length * 300
                        }
                        else{
                            var cnt_ext = 0
                            var planner_enrg_av = cnt_ext + my_spawns.length * 300
                        }

                        // reset extension intel
                        if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.extension && Game.rooms[rm].memory.intel.extension.length >= cnt_ext && enrg_av < planner_enrg_av ){

                            for ( var j = 0 ; j < Game.rooms[rm].memory.intel.extension.length ; j++){

                                var obj = Game.getObjectById( Game.rooms[rm].memory.intel.extension[j].id )

                                if( obj && obj.id ){
                                    // ok
                                }
                                else{
                                    // remove from intel
                                    Game.rooms[rm].memory.intel.extension.splice(j,1)
                                    var j = j - 1
                                }
                            }
                        } 

                        // building
                        if( enrg_av < planner_enrg_av || cnt_ext > Game.rooms[rm].memory.intel.extension.length ){

                            var xx = Game.rooms[rm].memory.planner[i][0]
                            var yy = Game.rooms[rm].memory.planner[i][1]

                            var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                            var ok = 1

                            if( obj && obj[0] ){
                                for ( var j = 0 ; j < obj.length ; j++){
                                    if( obj[j].structureType == 'extension' ){
                                        var already = 0
                                        for ( var k = 0 ; k < Game.rooms[rm].memory.intel.extension.length ; k++){
                                            if( Game.rooms[rm].memory.intel.extension[k].id == obj[j].id ){
                                                var already = 1
                                                var ok = 0
                                                break
                                            }
                                        }
                                        if( already == 0 ){
                                            var cnt = Game.rooms[rm].memory.intel.extension.length
                                            Game.rooms[rm].memory.intel.extension[cnt] = {}
                                            Game.rooms[rm].memory.intel.extension[cnt].id = obj[j].id
                                        }
                                    }
                                    else if( obj[j].structureType == 'rampart' ){
                                        // do not destroy
                                    }
                                    else{
                                        obj[j].destroy()
                                    }
                                }
                            }

                            if( ok == 1 ){
                                var obj = Game.rooms[rm].lookForAt(LOOK_CONSTRUCTION_SITES, xx, yy )
                                
                                if( obj && obj[0] ){
                                    var ok = 0
                                }
                            }

                            if( ok == 1 && ( ( Game.rooms[rm].controller.level >= 3 && contruction_sites.length <= 1 ) ||
                                             ( Game.rooms[rm].controller.level <= 2 && contruction_sites.length == 0 ) || 
                                             ( Game.rooms[rm].controller.level <= 2 && contruction_sites.length <= 1 && Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[2] && Game.rooms[rm].memory.intel.container[2].id && Game.getObjectById( Game.rooms[rm].memory.intel.container[2].id ) ) ) ){
                                var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_EXTENSION )
                                var i = 59
 
                                if( act == OK ){
                                    Game.rooms[rm].memory.oneTimer.build = 2
                                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    contruction_sites[contruction_sites.length] = 'extra building'
                                }
                                else if( act == ERR_FULL ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_INVALID_TARGET ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_RCL_NOT_ENOUGH ){
                                    console.log('room: ', rm ,'building extensions ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient')
                                }
                            }
                        }
                        else{
                            var i = 59
                        }
                    }
                    // SPAWN
                    else if( Game.rooms[rm].memory.planner[i][2] == 'spawn' && Game.rooms[rm].memory.planner[i][4] <= enrg_av ){

                        var cnt = Game.rooms[rm].memory.planner[i][6]
                        var xx =  Game.rooms[rm].memory.planner[i][0]
                        var yy =  Game.rooms[rm].memory.planner[i][1]

                        if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.spawn && Game.rooms[rm].memory.intel.spawn[cnt] && Game.rooms[rm].memory.intel.spawn[cnt].id ){

                            var obj = Game.getObjectById( Game.rooms[rm].memory.intel.spawn[cnt].id )

                            if( obj && obj.pos.x == xx && obj.pos.y == yy ){  
                                // ok - already exists
                                var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                                var ok = 0
        
                                if( obj && obj[0] ){
                                    for ( var j = 0 ; j < obj.length ; j++){
                                        // add to intel
                                        if( obj[j].structureType == 'rampart' ){
                                            var ok = 1
                                            break;
                                        }
                                    }
                                }
                                
                                if( ok == 1 ){
                                    Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                                }
                                else{
                                    if( Game.rooms[rm].controller.level >= 3 ){
                                        if( Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_RAMPART ) == OK ){
                                            Game.rooms[rm].memory.oneTimer.build = 2
                                            Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                        }
                                        Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                                    }
                                    else{
                                        Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                                    }
                                }
                            }
                            else{
                                Game.rooms[rm].memory.intel.spawn[cnt] = {}
                                // obj.destroy() gambiarra pre merge MMO
                                var i = i - 1
                            }
                        }
                        else{
                            var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                            var ok = 0

                            if( obj && obj[0] ){
                                for ( var j = 0 ; j < obj.length ; j++){
                                    // add to intel
                                    if( obj[j].structureType == 'spawn' ){

                                        if( !Game.rooms[rm].memory.intel.spawn ){
                                            Game.rooms[rm].memory.intel.spawn = []
                                        }

                                        Game.rooms[rm].memory.intel.spawn[cnt] = {}
                                        Game.rooms[rm].memory.intel.spawn[cnt].id = obj[j].id
                                        var ok = 1
                                    }
                                    // do not destroy
                                    else if( obj[j].structureType == 'rampart' ){
                                        //
                                    }
                                    // destroy
                                    else{
                                      obj[j].destroy()
                                    }
                                }
                            }

                            if( ok == 0 && Game.rooms[rm].controller.level >=2 ){
                                var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_SPAWN )
                                
                                if( act == OK ){
                                    Game.rooms[rm].memory.oneTimer.build = 2
                                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    contruction_sites[contruction_sites.length] = 'extra building'
                                }
                                else if( act == ERR_FULL ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_RCL_NOT_ENOUGH ){
                                    console.log('room: ', rm ,'building STRUCTURE_SPAWN ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient','...... fixing it')

                                    var obj_twr = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_SPAWN ) } } )
                                    for ( var ti = 0 ; ti < obj_twr.length ; ti++){
                                        var del = 1
                                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                                            if( Game.rooms[rm].memory.planner[k][2] == 'spawn' ){

                                                var xx =  Game.rooms[rm].memory.planner[k][0]
                                                var yy =  Game.rooms[rm].memory.planner[k][1]

                                                if( obj_twr[ti].pos.x == xx && obj_twr[ti].pos.y == yy ){
                                                    var del = 0
                                                    break;
                                                }
                                            }
                                        }
                                        if( del == 1 ){
                                            obj_twr[ti].destroy()
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // CONTAINER
                    else if( Game.rooms[rm].memory.planner[i][2] == 'container' && Game.rooms[rm].memory.planner[i][4] <= enrg_av ){

                        var cnt = Game.rooms[rm].memory.planner[i][6]
                        var xx =  Game.rooms[rm].memory.planner[i][0]
                        var yy =  Game.rooms[rm].memory.planner[i][1]

                        if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.container && Game.rooms[rm].memory.intel.container[cnt] != null &&
                            Game.rooms[rm].memory.intel.container[cnt].id && Game.getObjectById( Game.rooms[rm].memory.intel.container[cnt].id ) &&
                            Game.getObjectById( Game.rooms[rm].memory.intel.container[cnt].id ).pos.x == xx &&
                            Game.getObjectById( Game.rooms[rm].memory.intel.container[cnt].id ).pos.y == yy ){

                            var obj = Game.getObjectById( Game.rooms[rm].memory.intel.container[cnt].id )

                            if( obj && obj.pos.x == xx && obj.pos.y == yy ){
                                // ok - already exists
                                // if( Game.rooms[rm].memory.planner[i][5] == 'container_source0' || Game.rooms[rm].memory.planner[i][5] == 'container_source1'){
                                //     Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3] // soma dois aqui pq constroi uma estrada (old depeciated - soma 1)
                                // }
                                // else{
                                    Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                                // }
                            }
                            else{
                                delete Game.rooms[rm].memory.intel.container[cnt]
                                if( obj ){
                                    obj.destroy()
                                }
                                var i = i - 1
                            }
                        }
                        else{

                            var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                            var ok = 0

                            if( obj && obj[0] ){
                                for ( var j = 0 ; j < obj.length ; j++){
                                    // add to intel
                                    if( obj[j].structureType == 'container' ){

                                        if( !Game.rooms[rm].memory.intel.container ){
                                            Game.rooms[rm].memory.intel.container = []
                                        }

                                        Game.rooms[rm].memory.intel.container[cnt] = {}
                                        Game.rooms[rm].memory.intel.container[cnt].id = obj[j].id
                                        Game.rooms[rm].memory.intel.container[cnt].pos_x = obj[j].pos.x
                                        Game.rooms[rm].memory.intel.container[cnt].pos_y = obj[j].pos.y

                                        Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i-1][3]

                                        Game.rooms[rm].memory.oneTimer.build = 2

                                        var ok = 1
                                    }
                                    // do not destroy
                                    else if( obj[j].structureType == 'rampart' || obj[j].structureType == 'road' ){
                                        //
                                    }
                                    // destroy
                                    else{
                                        obj[j].destroy()
                                    }
                                }
                            }

                            if( ok == 0 && contruction_sites.length <= 1 ){
                                var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_CONTAINER )
                                
                                if( act == OK ){
                                    Game.rooms[rm].memory.oneTimer.build = 2
                                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    contruction_sites[contruction_sites.length] = 'extra building'
                                }
                                else if( act == ERR_FULL ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_RCL_NOT_ENOUGH ){
                                    console.log('room: ', rm ,'building STRUCTURE_CONTAINER ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient','...... fixing it')

                                    var obj_twr = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_CONTAINER ) } } )
                                    for ( var ti = 0 ; ti < obj_twr.length ; ti++){
                                        var del = 1
                                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                                            if( Game.rooms[rm].memory.planner[k][2] == 'container' ){

                                                var xx =  Game.rooms[rm].memory.planner[k][0]
                                                var yy =  Game.rooms[rm].memory.planner[k][1]

                                                if( obj_twr[ti].pos.x == xx && obj_twr[ti].pos.y == yy ){
                                                    var del = 0
                                                    break;
                                                }
                                            }
                                        }
                                        if( del == 1 ){
                                            obj_twr[ti].destroy()
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // TOWER
                    else if( Game.rooms[rm].memory.planner[i][2] == 'tower' && Game.rooms[rm].memory.planner[i][4] <= enrg_av ){

                        var cnt = Game.rooms[rm].memory.planner[i][6]
                        var xx =  Game.rooms[rm].memory.planner[i][0]
                        var yy =  Game.rooms[rm].memory.planner[i][1]

                        if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.tower && Game.rooms[rm].memory.intel.tower[cnt] && Game.rooms[rm].memory.intel.tower[cnt].id  ){

                            var obj = Game.getObjectById( Game.rooms[rm].memory.intel.tower[cnt].id )

                            if( obj && obj.pos.x == xx && obj.pos.y == yy ){
                                // ok - already exists
                                var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                                var ok = 0
        
                                if( obj && obj[0] ){
                                    for ( var j = 0 ; j < obj.length ; j++){
                                        // add to intel
                                        if( obj[j].structureType == 'rampart' ){
                                            var ok = 1
                                            break;
                                        }
                                    }
                                }
                                
                                if( ok == 1 ){
                                    Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                                }
                                else{
                                    if( Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_RAMPART ) == OK ){
                                        Game.rooms[rm].memory.oneTimer.build = 2
                                        Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    }
                                    Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                                }
                            }
                            else{
                                Game.rooms[rm].memory.intel.tower[cnt] = {}
                                obj.destroy()
                                var i = i - 1
                            }
                        }
                        else{

                            var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                            var ok = 0

                            if( obj && obj[0] ){
                                for ( var j = 0 ; j < obj.length ; j++){
                                    // add to intel
                                    if( obj[j].structureType == 'tower' ){

                                        if( !Game.rooms[rm].memory.intel.tower ){
                                            Game.rooms[rm].memory.intel.tower = []
                                        }

                                        Game.rooms[rm].memory.intel.tower[cnt] = {}
                                        Game.rooms[rm].memory.intel.tower[cnt].id = obj[j].id
                                        var ok = 1
                                    }
                                    // do not destroy
                                    else if( obj[j].structureType == 'rampart' ){
                                        //
                                    }
                                    // destroy
                                    else{
                                        obj[j].destroy()
                                    }
                                }
                            }

                            if( ok == 0 && contruction_sites.length <= 1 ){
                                var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_TOWER )
                                
                                if( act == OK ){
                                    Game.rooms[rm].memory.oneTimer.build = 2
                                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    contruction_sites[contruction_sites.length] = 'extra building'
                                }
                                else if( act == ERR_FULL ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_RCL_NOT_ENOUGH ){
                                    console.log('room: ', rm ,'building tower ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient','...... fixing it')

                                    var obj_twr = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_TOWER ) } } )
                                    for ( var ti = 0 ; ti < obj_twr.length ; ti++){
                                        var del = 1
                                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                                            if( Game.rooms[rm].memory.planner[k][2] == 'tower' ){

                                                var xx =  Game.rooms[rm].memory.planner[k][0]
                                                var yy =  Game.rooms[rm].memory.planner[k][1]

                                                if( obj_twr[ti].pos.x == xx && obj_twr[ti].pos.y == yy ){
                                                    var del = 0
                                                    break;
                                                }
                                            }
                                        }
                                        if( del == 1 ){
                                            obj_twr[ti].destroy()
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // STORAGE
                    else if( Game.rooms[rm].memory.planner[i][2] == 'storage' && Game.rooms[rm].memory.planner[i][4] <= enrg_av ){

                        var xx =  Game.rooms[rm].memory.planner[i][0]
                        var yy =  Game.rooms[rm].memory.planner[i][1]

                        if( Game.rooms[rm].storage  ){

                            var obj = Game.rooms[rm].storage

                            if( obj && obj.pos.x == xx && obj.pos.y == yy ){
                                // ok - already exists
                                var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                                var ok = 0
        
                                if( obj && obj[0] ){
                                    for ( var j = 0 ; j < obj.length ; j++){
                                        // add to intel
                                        if( obj[j].structureType == 'rampart' ){
                                            var ok = 1
                                            break;
                                        }
                                    }
                                }
                                
                                if( ok == 1 ){
                                    Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                                }
                                else{
                                    if( Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_RAMPART ) == OK ){
                                        Game.rooms[rm].memory.oneTimer.build = 2
                                        Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    }
                                    Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                                }
                            }
                            else {
                                obj.destroy()
                                var i = i - 1
                            }
                        }
                        else{

                            var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                            var ok = 0

                            if( obj && obj[0] ){
                                for ( var j = 0 ; j < obj.length ; j++){
                                    // add to intel
                                    if( obj[j].structureType == 'storage' ){
                                        var ok = 1
                                    }
                                    // do not destroy
                                    else if( obj[j].structureType == 'rampart' ){
                                        //
                                    }
                                    // destroy
                                    else{
                                        obj[j].destroy()
                                    }
                                }
                            }

                            if( ok == 0 && contruction_sites.length <= 1 ){
                                var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_STORAGE )
                                
                                if( act == OK ){
                                    Game.rooms[rm].memory.oneTimer.build = 2
                                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    contruction_sites[contruction_sites.length] = 'extra building'
                                }
                                else if( act == ERR_FULL ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_RCL_NOT_ENOUGH ){
                                    console.log('room: ', rm ,'building storage ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient','...... fixing it')
                                    if( Game.rooms[rm].storage ){
                                        Game.rooms[rm].storage.destroy()
                                    }
                                }
                            }
                        }
                    }
                    // ROAD
                    else if( Game.rooms[rm].memory.planner[i][2] == 'road' && Game.rooms[rm].memory.planner[i][4] <= enrg_av ){

                        for ( var k = i ; k < Game.rooms[rm].memory.planner.length ; k++){

                            if( Game.rooms[rm].memory.planner[k][2] == 'road' && Game.rooms[rm].memory.planner[k][3] == Game.rooms[rm].memory.planner[i][3] ){

                                var xx =  Game.rooms[rm].memory.planner[k][0]
                                var yy =  Game.rooms[rm].memory.planner[k][1]

                                if( xx >= 1  && yy >=1 && xx <= 48 && yy <= 48 ){

                                    var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                                    var ok = 0

                                    if( obj && obj[0] ){
                                        for ( var j = 0 ; j < obj.length ; j++){
                                            // add to intel
                                            if( obj[j].structureType == 'road' ){
                                                var ok = 1
                                            }
                                            // do not destroy
                                            else if( obj[j].structureType == 'rampart' || obj[j].structureType == 'container' ){
                                                //
                                            }
                                            // destroy
                                            else{
                                                obj[j].destroy()
                                            }
                                        }
                                    }

                                    if( ok == 0 && contruction_sites.length <= 5 ){
                                        var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_ROAD )                                        
                                        
                                        if( act == OK ){
                                            Game.rooms[rm].memory.oneTimer.build = 2
                                            Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                            contruction_sites[contruction_sites.length] = 'extra building'
                                        }
                                        else if( act == ERR_FULL ){
                                            // run construction site checks - TO DO
                                        }
                                        else if( act == ERR_RCL_NOT_ENOUGH ){
                                            console.log('room: ', rm ,'building road ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient')
                                        }
                                        break;
                                    }
                                }
                                else{
                                    Game.rooms[rm].memory.planner.splice(k,1)
                                    var k= k - 1
                                }
                            }
                            else if( Game.rooms[rm].memory.planner[k][3] > Game.rooms[rm].memory.planner[i][3] && contruction_sites.length <= 5 ){
                                Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[k][3]
                                break
                            }
                        }
                    }
                    // LINK
                    else if( Game.rooms[rm].memory.planner[i][2] == 'link' && Game.rooms[rm].memory.planner[i][4] <= enrg_av ){

                        var cnt = Game.rooms[rm].memory.planner[i][6]
                        var xx =  Game.rooms[rm].memory.planner[i][0]
                        var yy =  Game.rooms[rm].memory.planner[i][1]

                        if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.link && Game.rooms[rm].memory.intel.link[cnt] && Game.rooms[rm].memory.intel.link[cnt].id  ){

                            var obj = Game.getObjectById( Game.rooms[rm].memory.intel.link[cnt].id )

                            if( obj && obj.pos.x == xx && obj.pos.y == yy ){
                                // ok - already exists
                                Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                            }
                            else{
                                Game.rooms[rm].memory.intel.link[cnt] = {}
                                obj.destroy()
                                var i = i - 1
                            }
                        }
                        else{

                            var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                            var ok = 0

                            if( obj && obj[0] ){
                                for ( var j = 0 ; j < obj.length ; j++){
                                    // add to intel
                                    if( obj[j].structureType == 'link' ){

                                        if( !Game.rooms[rm].memory.intel.link ){
                                            Game.rooms[rm].memory.intel.link = []
                                        }

                                        Game.rooms[rm].memory.intel.link[cnt] = {}
                                        Game.rooms[rm].memory.intel.link[cnt].id = obj[j].id
                                        var ok = 1
                                    }
                                    // do not destroy
                                    else if( obj[j].structureType == 'rampart' ){
                                        //
                                    }
                                    // destroy
                                    else{
                                        obj[j].destroy()
                                    }
                                }
                            }

                            if( ok == 0 && contruction_sites.length <= 1 ){
                                var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_LINK )
                                
                                if( act == OK ){
                                    Game.rooms[rm].memory.oneTimer.build = 2
                                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    contruction_sites[contruction_sites.length] = 'extra building'
                                }
                                else if( act == ERR_FULL ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_RCL_NOT_ENOUGH ){
                                    console.log('room: ', rm ,'building STRUCTURE_LINK ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient','...... fixing it')

                                    var obj_twr = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_LINK ) } } )
                                    for ( var ti = 0 ; ti < obj_twr.length ; ti++){
                                        var del = 1
                                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                                            if( Game.rooms[rm].memory.planner[k][2] == 'link' ){

                                                var xx =  Game.rooms[rm].memory.planner[k][0]
                                                var yy =  Game.rooms[rm].memory.planner[k][1]

                                                if( obj_twr[ti].pos.x == xx && obj_twr[ti].pos.y == yy ){
                                                    var del = 0
                                                    break;
                                                }
                                            }
                                        }
                                        if( del == 1 ){
                                            obj_twr[ti].destroy()
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // TERMINAL
                    else if( Game.rooms[rm].memory.planner[i][2] == 'terminal' && Game.rooms[rm].memory.planner[i][4] <= enrg_av ){

                        var xx =  Game.rooms[rm].memory.planner[i][0]
                        var yy =  Game.rooms[rm].memory.planner[i][1]

                        if( Game.rooms[rm].terminal  ){

                            var obj = Game.rooms[rm].terminal

                            if( obj && obj.pos.x == xx && obj.pos.y == yy ){
                                // ok - already exists
                                var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                                var ok = 0
        
                                if( obj && obj[0] ){
                                    for ( var j = 0 ; j < obj.length ; j++){
                                        // add to intel
                                        if( obj[j].structureType == 'rampart' ){
                                            var ok = 1
                                            break;
                                        }
                                    }
                                }
                                
                                if( ok == 1 ){
                                    Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                                }
                                else{
                                    if( Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_RAMPART ) == OK ){
                                        Game.rooms[rm].memory.oneTimer.build = 2
                                        Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    }
                                    Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                                }
                            }
                            else {
                                obj.destroy()
                                var i = i - 1
                            }
                        }
                        else{

                            var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )

                            if( obj && obj[0] ){
                                for ( var j = 0 ; j < obj.length ; j++){
                                    // add to intel
                                    if( obj[j].structureType == 'terminal' ){
                                        //
                                    }
                                    // do not destroy
                                    else if( obj[j].structureType == 'rampart' ){
                                        //
                                    }
                                    // destroy
                                    else{
                                        obj[j].destroy()
                                    }
                                }
                            }
                            else if( contruction_sites.length <= 1 ){
                                var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_TERMINAL )
                                
                                if( act == OK ){
                                    Game.rooms[rm].memory.oneTimer.build = 2
                                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    contruction_sites[contruction_sites.length] = 'extra building'
                                }
                                else if( act == ERR_FULL ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_RCL_NOT_ENOUGH ){
                                    console.log('room: ', rm ,'building STRUCTURE_TERMINAL ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient','...... fixing it')
                                    if( Game.rooms[rm].terminal ){
                                        Game.rooms[rm].terminal.destroy()
                                    }
                                }
                            }
                        }
                    }
                    // EXTRACTOR
                    else if( Game.rooms[rm].memory.planner[i][2] == 'extractor' && Game.rooms[rm].memory.planner[i][4] <= enrg_av ){

                        var cnt = 0
                        var xx =  Game.rooms[rm].memory.planner[i][0]
                        var yy =  Game.rooms[rm].memory.planner[i][1]

                        if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.extractor && Game.rooms[rm].memory.intel.extractor[cnt] && Game.rooms[rm].memory.intel.extractor[cnt].id  ){

                            var obj = Game.getObjectById( Game.rooms[rm].memory.intel.extractor[cnt].id )

                            if( obj && obj.pos.x == xx && obj.pos.y == yy ){
                                // ok - already exists
                                Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                            }
                            else{
                                Game.rooms[rm].memory.intel.extractor[cnt] = {}
                                obj.destroy()
                                var i = i - 1
                            }
                        }
                        else{

                            var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                            var ok = 0

                            if( obj && obj[0] ){
                                for ( var j = 0 ; j < obj.length ; j++){
                                    // add to intel
                                    if( obj[j].structureType == 'extractor' ){

                                        if( !Game.rooms[rm].memory.intel.extractor ){
                                            Game.rooms[rm].memory.intel.extractor = []
                                        }

                                        Game.rooms[rm].memory.intel.extractor[cnt] = {}
                                        Game.rooms[rm].memory.intel.extractor[cnt].id = obj[j].id
                                        var ok = 1
                                    }
                                    // do not destroy
                                    else if( obj[j].structureType == 'rampart' ){
                                        //
                                    }
                                    // destroy
                                    else{
                                        obj[j].destroy()
                                    }
                                }
                            }

                            if( ok == 0 && contruction_sites.length <= 1 ){
                                var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_EXTRACTOR )
                                
                                if( act == OK ){
                                    Game.rooms[rm].memory.oneTimer.build = 2
                                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    contruction_sites[contruction_sites.length] = 'extra building'
                                }
                                else if( act == ERR_FULL ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_RCL_NOT_ENOUGH ){
                                    console.log('room: ', rm ,'building STRUCTURE_EXTRACTOR ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient','...... fixing it')

                                    var obj_twr = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_EXTRACTOR ) } } )
                                    for ( var ti = 0 ; ti < obj_twr.length ; ti++){
                                        var del = 1
                                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                                            if( Game.rooms[rm].memory.planner[k][2] == 'extractor' ){

                                                var xx =  Game.rooms[rm].memory.planner[k][0]
                                                var yy =  Game.rooms[rm].memory.planner[k][1]

                                                if( obj_twr[ti].pos.x == xx && obj_twr[ti].pos.y == yy ){
                                                    var del = 0
                                                    break;
                                                }
                                            }
                                        }
                                        if( del == 1 ){
                                            obj_twr[ti].destroy()
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // LAB
                    else if( Game.rooms[rm].memory.planner[i][2] == 'lab' && Game.rooms[rm].memory.planner[i][4] <= enrg_av ){
                        
                        var cnt = Game.rooms[rm].memory.planner[i][6]
                        var xx =  Game.rooms[rm].memory.planner[i][0]
                        var yy =  Game.rooms[rm].memory.planner[i][1]

                        if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.lab && Game.rooms[rm].memory.intel.lab[cnt] && Game.rooms[rm].memory.intel.lab[cnt].id  ){

                            var obj = Game.getObjectById( Game.rooms[rm].memory.intel.lab[cnt].id )

                            if( obj && obj.pos.x == xx && obj.pos.y == yy ){
                                // ok - already exists
                                Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                            }
                            else{
                                Game.rooms[rm].memory.intel.lab[cnt] = {}
                                obj.destroy()
                                var i = i - 1
                            }
                        }
                        else{

                            var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                            var ok = 0

                            if( obj && obj[0] ){
                                for ( var j = 0 ; j < obj.length ; j++){
                                    // add to intel
                                    if( obj[j].structureType == 'lab' ){

                                        if( !Game.rooms[rm].memory.intel.lab ){
                                            Game.rooms[rm].memory.intel.lab = []
                                        }

                                        Game.rooms[rm].memory.intel.lab[cnt] = {}
                                        Game.rooms[rm].memory.intel.lab[cnt].id = obj[j].id
                                        var ok = 1
                                    }
                                    // do not destroy
                                    else if( obj[j].structureType == 'rampart' ){
                                        //
                                    }
                                    // destroy
                                    else{
                                        obj[j].destroy()
                                    }
                                }
                            }

                            if( ok == 0 && contruction_sites.length <= 1 ){
                                var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_LAB )
                                
                                if( act == OK ){
                                    Game.rooms[rm].memory.oneTimer.build = 2
                                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    contruction_sites[contruction_sites.length] = 'extra building'
                                }
                                else if( act == ERR_FULL ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_RCL_NOT_ENOUGH ){
                                    console.log('room: ', rm ,'building STRUCTURE_LAB ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient','...... fixing it', xx,yy,cnt)

                                    var obj_twr = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_LAB ) } } )
                                    for ( var ti = 0 ; ti < obj_twr.length ; ti++){
                                        var del = 1
                                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                                            if( Game.rooms[rm].memory.planner[k][2] == 'lab' ){

                                                var xx =  Game.rooms[rm].memory.planner[k][0]
                                                var yy =  Game.rooms[rm].memory.planner[k][1]

                                                if( obj_twr[ti].pos.x == xx && obj_twr[ti].pos.y == yy ){
                                                    var del = 0
                                                    break;
                                                }
                                            }
                                        }
                                        if( del == 1 ){
                                            obj_twr[ti].destroy()
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // OBSERVER
                    else if( Game.rooms[rm].memory.planner[i][2] == 'observer' && Game.rooms[rm].memory.planner[i][4] <= enrg_av ){

                        var cnt = 0
                        var xx =  Game.rooms[rm].memory.planner[i][0]
                        var yy =  Game.rooms[rm].memory.planner[i][1]

                        if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.observer && Game.rooms[rm].memory.intel.observer[cnt] && Game.rooms[rm].memory.intel.observer[cnt].id  ){

                            var obj = Game.getObjectById( Game.rooms[rm].memory.intel.observer[cnt].id )

                            if( obj && obj.pos.x == xx && obj.pos.y == yy ){
                                // ok - already exists
                                Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                            }
                            else{
                                Game.rooms[rm].memory.intel.observer[cnt] = {}
                                obj.destroy()
                                var i = i - 1
                            }
                        }
                        else{

                            var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                            var ok = 0

                            if( obj && obj[0] ){
                                for ( var j = 0 ; j < obj.length ; j++){
                                    // add to intel
                                    if( obj[j].structureType == 'observer' ){

                                        if( !Game.rooms[rm].memory.intel.observer ){
                                            Game.rooms[rm].memory.intel.observer = []
                                        }

                                        Game.rooms[rm].memory.intel.observer[cnt] = {}
                                        Game.rooms[rm].memory.intel.observer[cnt].id = obj[j].id
                                        var ok = 1
                                    }
                                    // do not destroy
                                    else if( obj[j].structureType == 'rampart' ){
                                        //
                                    }
                                    // destroy
                                    else{
                                        obj[j].destroy()
                                    }
                                }
                            }

                            if( ok == 0 && contruction_sites.length <= 1 ){
                                var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_OBSERVER )
                                
                                if( act == OK ){
                                    Game.rooms[rm].memory.oneTimer.build = 2
                                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    contruction_sites[contruction_sites.length] = 'extra building'
                                }
                                else if( act == ERR_FULL ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_RCL_NOT_ENOUGH ){
                                    console.log('room: ', rm ,'building STRUCTURE_OBSERVER ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient','...... fixing it')

                                    var obj_twr = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_OBSERVER ) } } )
                                    for ( var ti = 0 ; ti < obj_twr.length ; ti++){
                                        var del = 1
                                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                                            if( Game.rooms[rm].memory.planner[k][2] == 'observer' ){

                                                var xx =  Game.rooms[rm].memory.planner[k][0]
                                                var yy =  Game.rooms[rm].memory.planner[k][1]

                                                if( obj_twr[ti].pos.x == xx && obj_twr[ti].pos.y == yy ){
                                                    var del = 0
                                                    break;
                                                }
                                            }
                                        }
                                        if( del == 1 ){
                                            obj_twr[ti].destroy()
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // NUKER
                    else if( Game.rooms[rm].memory.planner[i][2] == 'nuker' && Game.rooms[rm].memory.planner[i][4] <= enrg_av ){

                        var cnt = 0
                        var xx =  Game.rooms[rm].memory.planner[i][0]
                        var yy =  Game.rooms[rm].memory.planner[i][1]

                        if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.nuker && Game.rooms[rm].memory.intel.nuker[cnt] && Game.rooms[rm].memory.intel.nuker[cnt].id  ){

                            var obj = Game.getObjectById( Game.rooms[rm].memory.intel.nuker[cnt].id )

                            if( obj && obj.pos.x == xx && obj.pos.y == yy ){
                                // ok - already exists
                                Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                            }
                            else{
                                Game.rooms[rm].memory.intel.nuker[cnt] = {}
                                obj.destroy()
                                var i = i - 1
                            }
                        }
                        else{

                            var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                            var ok = 0

                            if( obj && obj[0] ){
                                for ( var j = 0 ; j < obj.length ; j++){
                                    // add to intel
                                    if( obj[j].structureType == 'nuker' ){

                                        if( !Game.rooms[rm].memory.intel.nuker ){
                                            Game.rooms[rm].memory.intel.nuker = []
                                        }

                                        Game.rooms[rm].memory.intel.nuker[cnt] = {}
                                        Game.rooms[rm].memory.intel.nuker[cnt].id = obj[j].id
                                        var ok = 1
                                    }
                                    // do not destroy
                                    else if( obj[j].structureType == 'rampart' ){
                                        //
                                    }
                                    // destroy
                                    else{
                                        obj[j].destroy()
                                    }
                                }
                            }

                            if( ok == 0 && contruction_sites.length <= 1 ){
                                var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_NUKER )
                                
                                if( act == OK ){
                                    Game.rooms[rm].memory.oneTimer.build = 2
                                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    contruction_sites[contruction_sites.length] = 'extra building'
                                }
                                else if( act == ERR_FULL ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_RCL_NOT_ENOUGH ){
                                    console.log('room: ', rm ,'building STRUCTURE_NUKER ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient','...... fixing it')

                                    var obj_twr = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_NUKER ) } } )
                                    for ( var ti = 0 ; ti < obj_twr.length ; ti++){
                                        var del = 1
                                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                                            if( Game.rooms[rm].memory.planner[k][2] == 'nuker' ){

                                                var xx =  Game.rooms[rm].memory.planner[k][0]
                                                var yy =  Game.rooms[rm].memory.planner[k][1]

                                                if( obj_twr[ti].pos.x == xx && obj_twr[ti].pos.y == yy ){
                                                    var del = 0
                                                    break;
                                                }
                                            }
                                        }
                                        if( del == 1 ){
                                            obj_twr[ti].destroy()
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // POWER SPAWN
                    else if( Game.rooms[rm].memory.planner[i][2] == 'powerSpawn' && Game.rooms[rm].memory.planner[i][4] <= enrg_av ){

                        var cnt = 0
                        var xx =  Game.rooms[rm].memory.planner[i][0]
                        var yy =  Game.rooms[rm].memory.planner[i][1]

                        if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.powerSpawn && Game.rooms[rm].memory.intel.powerSpawn[cnt] && Game.rooms[rm].memory.intel.powerSpawn[cnt].id  ){

                            var obj = Game.getObjectById( Game.rooms[rm].memory.intel.powerSpawn[cnt].id )

                            if( obj && obj.pos.x == xx && obj.pos.y == yy ){
                                // ok - already exists
                                Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3]
                            }
                            else{
                                Game.rooms[rm].memory.intel.powerSpawn[cnt] = {}
                                obj.destroy()
                                var i = i - 1
                            }
                        }
                        else{

                            var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                            var ok = 0

                            if( obj && obj[0] ){
                                for ( var j = 0 ; j < obj.length ; j++){
                                    // add to intel
                                    if( obj[j].structureType == 'powerSpawn' ){

                                        if( !Game.rooms[rm].memory.intel.powerSpawn ){
                                            Game.rooms[rm].memory.intel.powerSpawn = []
                                        }

                                        Game.rooms[rm].memory.intel.powerSpawn[cnt] = {}
                                        Game.rooms[rm].memory.intel.powerSpawn[cnt].id = obj[j].id
                                        var ok = 1
                                    }
                                    // do not destroy
                                    else if( obj[j].structureType == 'rampart' ){
                                        //
                                    }
                                    // destroy
                                    else{
                                        obj[j].destroy()
                                    }
                                }
                            }

                            if( ok == 0 && contruction_sites.length <= 1 ){
                                var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_POWER_SPAWN )
                                
                                if( act == OK ){
                                    Game.rooms[rm].memory.oneTimer.build = 2
                                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    contruction_sites[contruction_sites.length] = 'extra building'
                                }
                                else if( act == ERR_FULL ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_RCL_NOT_ENOUGH ){
                                    console.log('room: ', rm ,'building STRUCTURE_POWER_SPAWN ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient','...... fixing it')

                                    var obj_twr = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_POWER_SPAWN ) } } )
                                    for ( var ti = 0 ; ti < obj_twr.length ; ti++){
                                        var del = 1
                                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                                            if( Game.rooms[rm].memory.planner[k][2] == 'powerSpawn' ){

                                                var xx =  Game.rooms[rm].memory.planner[k][0]
                                                var yy =  Game.rooms[rm].memory.planner[k][1]

                                                if( obj_twr[ti].pos.x == xx && obj_twr[ti].pos.y == yy ){
                                                    var del = 0
                                                    break;
                                                }
                                            }
                                        }
                                        if( del == 1 ){
                                            obj_twr[ti].destroy()
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // FACTORY
                    else if( Game.rooms[rm].memory.planner[i][2] == 'factory' && Game.rooms[rm].memory.planner[i][4] <= enrg_av ){

                        var cnt = 0
                        var xx =  Game.rooms[rm].memory.planner[i][0]
                        var yy =  Game.rooms[rm].memory.planner[i][1]

                        if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.factory && Game.rooms[rm].memory.intel.factory[cnt] && Game.rooms[rm].memory.intel.factory[cnt].id  ){

                            var obj = Game.getObjectById( Game.rooms[rm].memory.intel.factory[cnt].id )

                            if( obj && obj.pos.x == xx && obj.pos.y == yy ){
                                // ok - already exists
                                var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                                var ok = 0
        
                                if( obj && obj[0] ){
                                    for ( var j = 0 ; j < obj.length ; j++){
                                        // add to intel
                                        if( obj[j].structureType == 'rampart' ){
                                            var ok = 1
                                            break;
                                        }
                                    }
                                }
                                
                                if( ok == 1 ){
                                    // Game.rooms[rm].memory.phase = Game.rooms[rm].memory.planner[i+1][3] // last one
                                }
                                else{
                                    if( Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_RAMPART ) == OK ){
                                        Game.rooms[rm].memory.oneTimer.build = 2
                                        Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    }
                                }
                            }
                            else{
                                Game.rooms[rm].memory.intel.factory[cnt] = {}
                                obj.destroy()
                                var i = i - 1
                            }
                        }
                        else{

                            var obj = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, xx, yy )
                            var ok = 0

                            if( obj && obj[0] ){
                                for ( var j = 0 ; j < obj.length ; j++){
                                    // add to intel
                                    if( obj[j].structureType == 'factory' ){

                                        if( !Game.rooms[rm].memory.intel.factory ){
                                            Game.rooms[rm].memory.intel.factory = []
                                        }

                                        Game.rooms[rm].memory.intel.factory[cnt] = {}
                                        Game.rooms[rm].memory.intel.factory[cnt].id = obj[j].id
                                        var ok = 1
                                    }
                                    // do not destroy
                                    else if( obj[j].structureType == 'rampart' ){
                                        //
                                    }
                                    // destroy
                                    else{
                                        obj[j].destroy()
                                    }
                                }
                            }

                            if( ok == 0 && contruction_sites.length <= 1 ){
                                var act = Game.rooms[rm].createConstructionSite( xx, yy, STRUCTURE_FACTORY )
                                
                                if( act == OK ){
                                    Game.rooms[rm].memory.oneTimer.build = 2
                                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                                    contruction_sites[contruction_sites.length] = 'extra building'
                                }
                                else if( act == ERR_FULL ){
                                    // run construction site checks - TO DO
                                }
                                else if( act == ERR_RCL_NOT_ENOUGH ){
                                    console.log('room: ', rm ,'building STRUCTURE_FACTORY ', 'ERR_RCL_NOT_ENOUGH	-14	Room Controller Level insufficient','...... fixing it')

                                    var obj_twr = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_FACTORY ) } } )
                                    for ( var ti = 0 ; ti < obj_twr.length ; ti++){
                                        var del = 1
                                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                                            if( Game.rooms[rm].memory.planner[k][2] == 'factory' ){

                                                var xx =  Game.rooms[rm].memory.planner[k][0]
                                                var yy =  Game.rooms[rm].memory.planner[k][1]

                                                if( obj_twr[ti].pos.x == xx && obj_twr[ti].pos.y == yy ){
                                                    var del = 0
                                                    break;
                                                }
                                            }
                                        }
                                        if( del == 1 ){
                                            obj_twr[ti].destroy()
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //
                    else{
                        break;
                    }

                }
            }
        }




        //
        // lvl 0
        // phase 0 - extensions               x     0

        // lvl 1
        // phase 1 - spawn                    0     0

        // lvl 2
        // phase 3 - container source0        0     550
        // phase 3.1- container source1       1     550
        // phase 3.2- container half1         2     550    // build_reset
        // phase 4  - container controler     4     550
        // phase 5.1 - road to source0        x     550    // road
        // phase 5.2 - road to source1        x     550    // road
        // phase 5.3 - road to controller     x     550    // road
        // phase 5.4 - plus around controller x     550    // road

        // lvl 3
        // phase 6 - tower                    0     550
        // phase 6.1 - road to s1 & s2 & halfsx     850    // road
        // phase 6.2-  container half2        3     850

        // lvl 4        
        // phase 7 - storage                  x     1300    // base2.build_reset
        // phase 8 - road to source0          x     1300
        // phase 9 - road to source1          x     1300
        // phase 10 - road stg to controller  x     1300
        // phase 10.1- road to h1 & h1        x     1800 // flags - ramparts
        // phase 10.5- road around base       x     1800
        // phase 10.6 - road net              x     1800  

        // lvl 5
        // phase 10.9- tower                  1     1800
        // phase 11- link                     0     1800 // s0
        // phase 12- link                     1     1800 // base

        // lvl 6
        // phase 15- link                     2     2300  // s1
        // phase 17- terminal                 x     2300  // base2.build_reset // base1.manager - wall repair
        // phase 18- road mineral             x     2300
        // phase 21- extractor                0     2300        
        // phase 23.7- lab                    0     2300   
        // phase 23.8- lab                    1     2300   
        // phase 23.9- lab                    2     2300   
        // phase 24  - lab                    x     2300   // road to ramparts

        // lvl 7
        // phase 24- spawn                    1     4300
        // phase 25- tower                    2     4300   // base1.manager - wall repair
        // phase 25.5- link                   3     4300   // half1
        // phase 29- lab                      3     5600
        // phase 30- lab                      4     5600
        // phase 31- lab                      5     5600
        // phase 31.5-road lab                x     5600 // terminal booster send
        
        // lvl 8
        // phase 32- spawn                    2     10600
        // phase 33- tower                    3     10900
        // phase 34- tower                    4     10900
        // phase 35- tower                    5     10900
        // phase 35.5- link                   4     10900 // half2
        // phase 35.6- link                   5     10900
        // phase 36- lab                      6     12900
        // phase 37- lab                      7     12900
        // phase 38- lab                      8     12900
        // phase 39- lab                      9     12900

        // phase 40- observer                 0     12900
        // phase 41- nuker                    0     12900
        // phase 42- powerSpawn               0     12900
        // phase 43- factory                  0     12900 // terminal booster send


    }
};

module.exports = baseBuild;
