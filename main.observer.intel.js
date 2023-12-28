var   miliarIntel  = require('main.militar.intel')

var MainObserverIntel= {

    run: function(rm, rm_sct, roomDistance ) {

        var roomDistance = Game.map.getRoomLinearDistance(rm, rm_sct)

        miliarIntel.run( rm_sct )

        // loop storage and terminal
        if( !Game.rooms[rm_sct].controller || ( Game.rooms[rm_sct].controller && !Game.rooms[rm_sct].controller.my && !Game.rooms[rm_sct].controller.owner ) ){

            var obj = Game.rooms[rm_sct].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_TERMINAL || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER ) } } )

            if( obj && obj.length > 0 ){

                for ( var i = 0 ; i < obj.length ; i++){

                    var hasRampart = 0
                    var obj_loop = Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, obj[i] )

                    if( obj_loop.length > 1 ){
                        for ( var j = 0 ; j < obj_loop.length ; j++){
                            if( obj_loop[j].structureType == 'rampart' ){
                                var hasRampart = 1
                                break;
                            }
                        }
                    }

                    if( hasRampart == 0 ){
                        //          symbol    minumun_my_net   min_to_collect
                        var SYMBOLS= [
                                    ['energy',300000 , 5000 ],
                                    ['power', 14000 * .90, 500],
                                    ['ops',   14000 * .90, 100],

                                    ['XGHO2', 14000 * .90, 100],   // though
                                    ['XGH2O', 14000 * .90, 100],   // upgrade
                                    ['XZHO2', 14000 * .90, 100],   // fatigue
                                    ['XZH2O', 14000 * .90, 100],   // dismantle
                                    ['XLHO2', 14000 * .90, 100],   // heal
                                    ['XLH2O', 14000 * .90, 100],   // repair
                                    ['XUHO2', 14000 * .90, 100],   // harvest
                                    ['XUH2O', 14000 * .90, 100],   // attack
                                    ['XKHO2', 14000 * .90, 100],   // range attack
                                    ['XKH2O', 14000 * .90, 100],   // capacity

                                    ['GHO2',  14000 * .90, 100],   // though
                                    ['GH2O',  14000 * .90, 100],   // upgrade
                                    ['ZHO2',  14000 * .90, 100],   // fatigue
                                    ['ZH2O',  14000 * .90, 100],   // dismantle
                                    ['LHO2',  14000 * .90, 100],   // heal
                                    ['LH2O',  14000 * .90, 100],   // repair
                                    ['UHO2',  14000 * .90, 100],   // harvest
                                    ['UH2O',  14000 * .90, 100],   // attack
                                    ['KHO2',  14000 * .90, 100],   // range attack
                                    ['KH2O',  14000 * .90], 100,   // capacity

                                    ['UH', 14000 * .90, 500],
                                    ['UO', 14000 * .90, 500],
                                    ['KH', 14000 * .90, 500],
                                    ['KO', 14000 * .90, 500],
                                    ['LH', 14000 * .90, 500],
                                    ['LO', 14000 * .90, 500],
                                    ['ZH', 14000 * .90, 500],
                                    ['ZO', 14000 * .90, 500],
                                    ['GH', 14000 * .90, 500],
                                    ['GO', 14000 * .90, 500],

                                    ['silicon', 14000 * .90, 200],
                                    ['metal',   14000 * .90, 200],
                                    ['biomass', 14000 * .90, 200],
                                    ['mist',    14000 * .90, 200],

                                    ['utrium_bar',   14000 * .90, 50],
                                    ['lemergium_bar',14000 * .90, 50],
                                    ['zynthium_bar', 14000 * .90, 50],
                                    ['keanium_bar',  14000 * .90, 50],
                                    ['ghodium_melt', 14000 * .90, 50],
                                    ['oxidant',      14000 * .90, 50],
                                    ['reductant',    14000 * .90, 50],
                                    ['purifier',     14000 * .90, 50],
                                    ['battery',      14000 * .90, 50],

                                    ['wire',         14000 * .90, 10],
                                    ['cell',         14000 * .90, 10],
                                    ['alloy',        14000 * .90, 10],
                                    ['condensate',   14000 * .90, 10],

                                    ['composite',  14000 * .90, 10],
                                    ['tube',       14000 * .90, 10],
                                    ['phlegm',     14000 * .90, 10],
                                    ['switch',     14000 * .90, 10],
                                    ['concentrate',14000 * .90, 10],

                                    ['crystal',   14000 * .90, 1],
                                    ['fixtures',  14000 * .90, 1],
                                    ['tissue',    14000 * .90, 1],
                                    ['transistor',14000 * .90, 1],
                                    ['extract',   14000 * .90, 1],

                                    ['liquid',   14000 * .90, 1],
                                    ['frame',    14000 * .90, 1],
                                    ['muscle',   14000 * .90, 1],
                                    ['microchip',14000 * .90, 1],
                                    ['spirit',   14000 * .90, 1],

                                    ['hydraulics',14000 * .90, 1],
                                    ['organoid',  14000 * .90, 1],
                                    ['circuit',   14000 * .90, 1],
                                    ['emanation', 14000 * .90, 1],

                                    ['machine', 14000 * .90, 1],
                                    ['organism',14000 * .90, 1],
                                    ['device',  14000 * .90, 1],
                                    ['essence', 14000 * .90, 1],

                                    ['H', 14000 * .90, 1000],
                                    ['O', 14000 * .90, 1000],
                                    ['U', 14000 * .90, 1000],
                                    ['L', 14000 * .90, 1000],
                                    ['K', 14000 * .90, 1000],
                                    ['Z', 14000 * .90, 1000],
                                    ['X', 14000 * .90, 1000],

                                    ['ZK',    14000 * .90, 500],
                                    ['UL',    14000 * .90, 500],
                                    ['OH',    14000 * .90, 500],
                                    ['G',     14000 * .90, 250]
                                    ]

                        for ( var j = 0 ; j < SYMBOLS.length ; j++){

                            if( Memory.stats.minerals[ SYMBOLS[j][0] ] < Memory.stats.number_rooms * SYMBOLS[j][1] && obj[i].store[ SYMBOLS[j][0] ] >= SYMBOLS[j][2] ){

                                var newtolist = 1

                                if( !Memory.storage_list ){
                                    Memory.storage_list = []
                                }

                                // update if on the list
                                if( Memory.storage_list.length >= 1 ){
                                    for ( var ii = 0 ; ii < Memory.storage_list.length ; ii++){
                                        if( Memory.storage_list[ii] && Memory.storage_list[ii].rm == rm && Memory.storage_list[ii].rm_sct == rm_sct ){

                                            var newtolist = 0

                                            Memory.storage_list[ii].rm              = rm
                                            Memory.storage_list[ii].rm_sct          = rm_sct
                                            Memory.storage_list[ii].distance        = roomDistance
                                            Memory.storage_list[ii].detection_tick  = Game.time
                                            break;
                                        }
                                    }
                                }

                                // add to list
                                if( newtolist == 1 ){
                                    var cnt = Memory.storage_list.length

                                    Memory.storage_list[cnt] = {}
                                    Memory.storage_list[cnt].rm              = rm
                                    Memory.storage_list[cnt].rm_sct          = rm_sct
                                    Memory.storage_list[cnt].distance        = roomDistance
                                    Memory.storage_list[cnt].detection_tick  = Game.time
                                }

                                break;
                            }
                        }
                    }
                }
            }
        }
        //

        // loop for auto-attack intel
        if( Game.rooms[rm_sct].controller ){

            // check controller ownership
            if( Game.rooms[rm_sct].controller.my ){
                var controller_my = 1 // my room
            }
            else if( Game.rooms[rm_sct].controller.reservation && Game.rooms[rm_sct].controller.reservation.username == 'asdpof' ){
                var controller_my = 0 // my reservation
            }
            else if( !Game.rooms[rm_sct].controller.owner && !Game.rooms[rm_sct].controller.reservation ){
                var controller_my = -1 // no owner, no reservation
            }
            else if( Game.rooms[rm_sct].controller.reservation && ( Game.rooms[rm_sct].controller.reservation.username != 'asdpof'  ) ){ //&& Game.rooms[rm_sct].controller.reservation.username != 'Invader'
                var controller_my = -2 // other reservation
            }
            else if( Game.rooms[rm_sct].controller.owner && Game.rooms[rm_sct].controller.owner.username != 'asdpof' ){
                var controller_my = -3 // other owner
                // add to avoid move list
                Memory.avoidRooms_observer[ rm_sct ] = {}
            }
            else{
                var controller_my = -4
            }
            //

            if( controller_my != 1 && controller_my != -4  ){

                // check rampart/wall levels
                var obj = Game.rooms[rm_sct].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_RAMPART || structure.structureType == STRUCTURE_WALL ) } } )

                var cnt = 0
                var hits = 0

                for ( var i = 0 ; i < obj.length ; i++){
                    var cnt = cnt + 1
                    var hits = hits + obj[i].hits
                }

                if( cnt > 0 ){
                    var wall_hits = Math.round( hits / cnt / 100000 )/10
                    var wall_cnt  = cnt
                }
                else{
                    var wall_hits = 0
                    var wall_cnt  = 0
                }
                //

                // check controller level
                if( controller_my == -3 ){
                    var controller_lvl = Game.rooms[rm_sct].controller.level

                    // check safe mode
                    if( Game.rooms[rm_sct].controller.safeMode > 0 ){
                        var controller_safe = Game.rooms[rm_sct].controller.safeMode
                    }
                    else{
                        var controller_safe = 0
                    }

                    // check for number of spawns on room
                    var cnt = Game.rooms[rm_sct].find(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_SPAWN  ) } }).length
                    if( cnt > 0 ){
                        var count_spawn = cnt
                    }
                    else{
                        var count_spawn = 0
                    }

                    // count open vicinity
                    const terrain = Game.rooms[rm_sct].getTerrain();
                    var cnt_vic = 0
                    var xx = Game.rooms[rm_sct].controller.pos.x
                    var yy = Game.rooms[rm_sct].controller.pos.y
                    switch(terrain.get(xx-1,yy-1)) { case 0: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx-1, yy-1 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;
                                                     case 1: break; 
                                                     case 2: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx-1, yy-1 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;}
                    switch(terrain.get(xx-1,yy+0)) { case 0: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx-1, yy-0 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;
                                                     case 1: break; 
                                                     case 2: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx-1, yy-0 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;}
                    switch(terrain.get(xx-1,yy+1)) { case 0: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx-1, yy+1 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;
                                                     case 1: break; 
                                                     case 2: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx-1, yy+1 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;}
                    switch(terrain.get(xx+1,yy-1)) { case 0: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx+1, yy-1 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;
                                                     case 1: break; 
                                                     case 2: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx+1, yy-1 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;}
                    switch(terrain.get(xx+1,yy+0)) { case 0: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx+1, yy-0 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;
                                                     case 1: break; 
                                                     case 2: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx+1, yy-0 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;}
                    switch(terrain.get(xx+1,yy+1)) { case 0: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx+1, yy+1 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;
                                                     case 1: break; 
                                                     case 2: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx+1, yy+1 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;}
                    switch(terrain.get(xx+0,yy-1)) { case 0: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx-0, yy-1 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;
                                                     case 1: break; 
                                                     case 2: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx-0, yy-1 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;}
                    switch(terrain.get(xx+0,yy+1)) { case 0: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx-0, yy+1 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;
                                                     case 1: break; 
                                                     case 2: if( Game.rooms[rm_sct].lookForAt(LOOK_STRUCTURES, xx-0, yy+1 ).length == 0 ){cnt_vic = cnt_vic + 1} ; break;}
                    //

                    // check for number of towers on room
                    var cnt = Game.rooms[rm_sct].find(FIND_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_TOWER  ) } }).length
                    if( cnt > 0 ){
                        if( controller_lvl == 8 ){
                            var count_tower = cnt
                        }
                        else if( controller_lvl == 7 ){
                            var count_tower = Math.min(cnt,3)
                        }
                        else if( controller_lvl >= 5 ){
                            var count_tower = Math.min(cnt,2)
                        }
                        else if( controller_lvl >= 3 ){
                            var count_tower = Math.min(cnt,1)
                        }
                        else{
                            var count_tower = 0
                        }
                    }
                    else{
                        var count_tower = 0
                    }
                    // correct towers by number of enemies
                    var enemies = Game.rooms[rm_sct].find(FIND_HOSTILE_CREEPS)
                    if( enemies ){
                        var attack_creep = 0
                        for ( var ii = 0 ; ii < enemies.length ; ii++){

                            if( enemies[ii].getActiveBodyparts(ATTACK) > 0 || enemies[ii].getActiveBodyparts(RANGED_ATTACK) > 0 ){

                                for( var iii = 0; iii < enemies[ii].body.length; iii++ ){

                                    // attack
                                    if( enemies[ii].body[iii].type == ATTACK ){
                                        if( enemies[ii].body[iii].boost == 'XUH2O' ){
                                            var attack_creep = attack_creep + 120
                                        }
                                        else if( enemies[ii].body[iii].boost == 'UH2O' ){
                                            var attack_creep = attack_creep + 90
                                        }
                                        else if( enemies[ii].body[iii].boost == 'UH' ){
                                            var attack_creep = attack_creep + 60
                                        }
                                        else {
                                            var attack_creep = attack_creep + 30
                                        }
                                    }

                                    // ranged attack - only range 1 distance
                                    if( enemies[ii].body[iii].type == RANGED_ATTACK ){
                                        if( enemies[ii].body[iii].boost == 'XKHO2' ){
                                            var attack_creep = attack_creep + 40
                                        }
                                        else if( enemies[ii].body[iii].boost == 'KHO2' ){
                                            var attack_creep = attack_creep + 30
                                        }
                                        else if( enemies[ii].body[iii].boost == 'KO' ){
                                            var attack_creep = attack_creep + 20
                                        }
                                        else {
                                            var attack_creep = attack_creep + 10
                                        }
                                    }
                                }
                            }
                        }

                        var count_tower = Math.min(6, count_tower + Math.ceil(attack_creep/600) )
                    }
                    //

                    // check for owner
                    var owner = Game.rooms[rm_sct].controller.owner.username

                    // check for spawned attackers

                }
                else if( controller_my == -2 ){
                    var controller_lvl  = 0
                    var controller_safe = 0
                    var count_tower     = 0
                    var count_spawn     = 0
                    var owner           = Game.rooms[rm_sct].controller.reservation.username
                }
                else{
                    var controller_lvl  = 0
                    var controller_safe = 0
                    var count_tower     = 0
                    var count_spawn     = 0
                    var owner           = 0
                }
                //


                var filter = 0
                //filter by owner
                if( Memory.autoAttackBlockListUserName ){
                    for ( var jj = 0 ; jj < Memory.autoAttackBlockListUserName.length ; jj++){

                        if( owner == Memory.autoAttackBlockListUserName[jj][0] && ( controller_lvl >= Memory.autoAttackBlockListUserName[jj][1] || controller_lvl == -2 ) ){
                            var filter = 1
                            break
                        }
                    }
                }

                //filter by room
                if( Memory.autoAttackBlockListRoomName && filter == 0 ){
                    for ( var jj = 0 ; jj < Memory.autoAttackBlockListRoomName.length ; jj++){

                        if( rm_sct == Memory.autoAttackBlockListRoomName[jj] ){
                            var filter = 1
                            break
                        }
                    }
                }

                // add to attack list
                if( ( ( wall_cnt > 0 && wall_hits > 0 ) || controller_lvl > 0 ) && filter == 0 ){
                    if( !Memory.attack_list ){
                        Memory.attack_list = []
                    }

                    var newtolist = 1

                    // update if on the list
                    if( Memory.attack_list.length >= 1 ){
                        for ( var ii = 0 ; ii < Memory.attack_list.length ; ii++){
                            if( Memory.attack_list[ii] && Memory.attack_list[ii].rm == rm && Memory.attack_list[ii].rm_sct == rm_sct ){

                                var newtolist = 0

                                // Memory.attack_list[ii].rm              = rm
                                // Memory.attack_list[ii].rm_sct          = rm_sct
                                // Memory.attack_list[ii].distance        = roomDistance
                                Memory.attack_list[ii].owner           = owner
                                Memory.attack_list[ii].wall_hits       = wall_hits
                                Memory.attack_list[ii].wall_cnt        = wall_cnt

                                Memory.attack_list[ii].controller_my   = controller_my
                                if( Memory.attack_list[ii].controller_lvl != controller_lvl ){
                                    Memory.attack_list[ii].controller_lvl  = controller_lvl
                                    Memory.attack_list[ii].fixed_threat    = 0 // reset if downgrade
                                }

                                // Memory.attack_list[ii].fixed_threat    = 0
                                Memory.attack_list[ii].threat_lvl      = Memory.attack_list[ii].distance * 1000 + wall_hits + Memory.attack_list[ii].fixed_threat / 2
                                if( Memory.attack_list[ii].attack_level > 0 ){
                                    Memory.attack_list[ii].threat_lvl = -Memory.attack_list[ii].threat_lvl
                                }

                                Memory.attack_list[ii].controller_safe = controller_safe
                                Memory.attack_list[ii].controller_vic  = cnt_vic
                                Memory.attack_list[ii].count_spawn     = count_spawn
                                Memory.attack_list[ii].count_tower     = count_tower

                                Memory.attack_list[ii].detection_tick  = Game.time
                                // Memory.attack_list[ii].attack_level    = 0

                            }
                        }
                    }

                    // add to list
                    if( newtolist == 1 ){
                        var cnt = Memory.attack_list.length

                        Memory.attack_list[cnt] = {}
                        Memory.attack_list[cnt].rm              = rm
                        Memory.attack_list[cnt].rm_sct          = rm_sct
                        Memory.attack_list[cnt].distance        = roomDistance
                        Memory.attack_list[cnt].owner           = owner
                        Memory.attack_list[cnt].wall_hits       = wall_hits
                        Memory.attack_list[cnt].wall_cnt        = wall_cnt

                        Memory.attack_list[cnt].controller_my   = controller_my
                        Memory.attack_list[cnt].controller_lvl  = controller_lvl

                        Memory.attack_list[cnt].fixed_threat    = 0
                        Memory.attack_list[cnt].threat_lvl      = roomDistance * 1000 + wall_hits

                        Memory.attack_list[cnt].controller_safe = controller_safe
                        Memory.attack_list[ii].controller_vic  = cnt_vic
                        Memory.attack_list[cnt].count_spawn     = count_spawn
                        Memory.attack_list[cnt].count_tower     = count_tower

                        Memory.attack_list[cnt].detection_tick  = Game.time
                        Memory.attack_list[cnt].attack_level    = 0

                    }
                }
                //

                Memory.attack_list = _.sortBy(Memory.attack_list, 'threat_lvl') //.reverse();

                //

                console.log("vision on room:", rm_sct, controller_my, 'wall hits', wall_hits, 'level', controller_lvl )
            }
            else{
                // remove from list if rooom is mine
                for ( var ii = 0 ; ii < Memory.attack_list.length ; ii++){
                    if( Memory.attack_list[ii] && Memory.attack_list[ii].rm == rm && Memory.attack_list[ii].rm_sct == rm_sct ){
                        Memory.attack_list.splice(ii,1)
                        break;
                    }
                }

                console.log("vision on room:", rm_sct, controller_my, 'my room' )
            }

        }
        // loop for power-banks, deposits and stronghold intel
        else {

            // check if room is highway or not
            if( rm_sct.split("E")[0].length == rm_sct.length ){
                var lon = 'W'
            }
            else{
                var lon = 'E'
            }

            if( rm_sct.split("N")[0].length == rm_sct.length ){
                var lat = 'S'
            }
            else{
                var lat = 'N'
            }

            var split1 = rm_sct.split(lon)[1]
            var split2 = split1.split(lat)

            var lat_coord = split2[1]
            var lon_coord = split2[0]

            if( lat_coord % 10 == 0 || lon_coord % 10 == 0 ){
                var rm_type = 'highway'
            }
            // else if( lat_coord % 10 == 5 && lon_coord % 10 == 5 ){
            //     var rm_type = 'center_0'
            // }
            else if (  ( lat_coord % 10 == 4 || lat_coord % 10 == 5 || lat_coord % 10 == 6 ) &&
                       ( lon_coord % 10 == 4 || lon_coord % 10 == 5 || lon_coord % 10 == 6 ) ){
                // already checked for no controller
                var rm_type = 'center'
            }


            // HIGHWAY
            if( rm_type == 'highway' && roomDistance <= 7 ){

                // POWER BANKS
                if( Game.rooms[rm].controller.level == 8 && Memory.oneTimer.power_banks == 1 ){

                    var obj = Game.rooms[ rm_sct ].find(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return (  structure.structureType == STRUCTURE_POWER_BANK  ) } })

                    if( Memory.stats.minerals.power < Memory.stats.number_rooms * 5000 ){
                        var min_power = 2000
                    }
                    else{
                        var min_power = 8000
                    }

                    if( Game.rooms[rm].storage.store['energy'] > Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.powerBanks && obj && obj[0] && obj[0].ticksToDecay > 3000 && obj[0].power > min_power ){

                        if( !Memory.powerBanks ){
                            Memory.powerBanks = {}
                        }

                        // check if power bank is already on the list
                        var ok_bank = 1
                        if( Memory.powerBanks[ obj[0].id ]  ){
                            var ok_bank = 0
                        }

                        if( Memory.stats.minerals.power < Memory.stats.number_rooms * 13500 || ok_bank == 0 ){

                            // add new entry
                            if( ok_bank ==1 ){

                                 // power bank reacheable vicinity
                                const terrain = Game.rooms[ rm_sct ].getTerrain();
                                var cnt_vic = 0
                                var xx = obj[0].pos.x
                                var yy = obj[0].pos.y
                                switch(terrain.get(xx-1,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx-1,yy+0)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx-1,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx+1,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx+1,yy+0)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx+1,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx+0,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx+0,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}

                                if( cnt_vic >= 2 ){

                                    var id = obj[0].id

                                    Memory.powerBanks[id]              = {}
                                    Memory.powerBanks[id].id           = id
                                    Memory.powerBanks[id].rm           = rm
                                    Memory.powerBanks[id].rm_tgt       = rm_sct
                                    Memory.powerBanks[id].ticksToDecay = obj[0].ticksToDecay
                                    Memory.powerBanks[id].power        = obj[0].power
                                    Memory.powerBanks[id].tick         = Game.time
                                    Memory.powerBanks[id].cnt_vic      = cnt_vic

                                    Memory.powerBanks[id].pair1        = 0
                                    Memory.powerBanks[id].pair2        = 0
                                    Memory.powerBanks[id].pair3        = 0
                                    Memory.powerBanks[id].pair4        = 0

                                }
                            }
                            // update entry
                            else{

                                var id = obj[0].id

                                Memory.powerBanks[id].ticksToDecay = obj[0].ticksToDecay
                                Memory.powerBanks[id].power        = obj[0].power
                                Memory.powerBanks[id].tick         = Game.time

                            }
                            //
                        }
                    }
                }
                //


                // DEPOSITS
                if( Game.rooms[rm].controller.level >= 6 && Memory.oneTimer.deposits == 1 ){

                    var obj = Game.rooms[ rm_sct ].find(FIND_DEPOSITS)

                    if( Game.rooms[rm].storage.store['energy'] > Game.rooms[rm].memory.storage_lvl * Memory.config.min_energy_lvl.depositsBank && obj && obj[0] && obj[0].ticksToDecay > 5000 && obj[0].lastCooldown < 50 ){

                        var depositType = obj[0].depositType

                        if( !Memory.depositsBank ){
                            Memory.depositsBank = {}
                        }

                        // check if deposits are already on the list
                        var ok_depo = 1
                        if( Memory.depositsBank[ obj[0].id ]  ){
                            var ok_depo = 0
                        }

                        if( Memory.stats.minerals[depositType] < Memory.stats.number_rooms * 12000 || ok_depo == 0 ){

                            // add new entry
                            if( ok_depo == 1 ){

                                 // deposits reacheable vicinity
                                const terrain = Game.rooms[ rm_sct ].getTerrain();
                                var cnt_vic = 0
                                var xx = obj[0].pos.x
                                var yy = obj[0].pos.y
                                switch(terrain.get(xx-1,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx-1,yy+0)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx-1,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx+1,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx+1,yy+0)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx+1,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx+0,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                switch(terrain.get(xx+0,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}

                                if( cnt_vic >= 1 ){

                                    var id = obj[0].id

                                    Memory.depositsBank[id]              = {}
                                    Memory.depositsBank[id].id           = id
                                    Memory.depositsBank[id].rm           = rm
                                    Memory.depositsBank[id].rm_tgt       = rm_sct
                                    Memory.depositsBank[id].lastCooldown = obj[0].lastCooldown
                                    Memory.depositsBank[id].depositType  = obj[0].depositType
                                    Memory.depositsBank[id].ticksToDecay = obj[0].ticksToDecay
                                    Memory.depositsBank[id].tick         = Game.time
                                    Memory.depositsBank[id].cnt_vic      = cnt_vic

                                }
                            }
                            // update entry
                            else{

                                var id = obj[0].id

                                Memory.depositsBank[id].lastCooldown = obj[0].lastCooldown
                                Memory.depositsBank[id].ticksToDecay = obj[0].ticksToDecay
                                Memory.depositsBank[id].tick         = Game.time

                            }
                        }
                    }
                    // remove from memory
                    else if ( obj && obj[0]  ) {
                        delete Memory.depositsBank[ obj[0].id ];
                    }
                }
                //


            }
            // CENTER
            else if( rm_type == 'center' ){

                // STRONGHOLD
                if( Memory.oneTimer.stronghold == 1 ){

                    var obj = Game.rooms[ rm_sct ].find(FIND_HOSTILE_STRUCTURES, {filter: (struct) =>  {return (  struct.structureType == STRUCTURE_INVADER_CORE ) } } )

                    if( obj && obj[0] && obj[0].level > 0 ){

                        // add to block movement list
                        Memory.avoidRooms_observer[ rm_sct ] = {}
                        //

                        var ticksToDeploy = obj[0].ticksToDeploy

                        if( ticksToDeploy < 500 || obj[0].effects.length > 0 ){

                            if( !Memory.strongholds ){
                                Memory.strongholds = {}
                            }

                            // check if strongholds are already on the list
                            var ok_strong = 1
                            if( Memory.strongholds[ obj[0].id ]  ){
                                var ok_strong = 0
                            }

                            // add new entry
                            if( ok_strong == 1 ){

                                var id = obj[0].id

                                Memory.strongholds[id]              = {}
                                Memory.strongholds[id].id           = id
                                Memory.strongholds[id].rm           = rm
                                Memory.strongholds[id].rm_tgt       = rm_sct
                                Memory.strongholds[id].level        = obj[0].level
                                Memory.strongholds[id].ticksToDecay = obj[0].effects[0].ticksRemaining
                                Memory.strongholds[id].tick         = Game.time
                            }
                            // update entry
                            else{
                                var id = obj[0].id
                                Memory.strongholds[id].ticksToDecay = obj[0].effects[0].ticksRemaining
                                Memory.strongholds[id].tick         = Game.time
                            }
                        }
                    }
                    else{
                        // remove to block movement list
                        delete Memory.avoidRooms_observer[ rm_sct ]

                        // remove from "attack list"
                        var id = _.findWhere(Memory.strongholds, {rm_tgt: rm_sct})
                        if( id ){
                            delete Memory.strongholds[ id.id ]
                        }
                    }
                }
                //


                // SK MINERALS
                if( Memory.oneTimer.sk_mining == 1 ){

                    if( Game.rooms[rm].controller.level >= 7 && Game.map.getRoomLinearDistance(rm, rm_sct) <= 1 ){

                        var obj = Game.rooms[ rm_sct ].find(FIND_MINERALS, {filter: (mineral) =>  {return (  mineral.mineralAmount > 0 ) } } )

                        if( obj && obj[0]){
 
                            var mineralType = obj[0].mineralType
                            var mineralType = obj[0].mineralType

                            if( Memory.stats.minerals[mineralType] < Memory.stats.number_rooms * 4000 ){

                                if( !Memory.mineralsBank ){
                                    Memory.mineralsBank = {}
                                }

                                // check if minerals are already on the list
                                var ok_mineral = 1
                                if( Memory.mineralsBank[ obj[0].id ]  ){
                                    var ok_mineral = 0
                                }


                                // add new entry
                                if( ok_mineral == 1 ){

                                     // deposits reacheable vicinity
                                    const terrain = Game.rooms[ rm_sct ].getTerrain();
                                    var cnt_vic = 0
                                    var xx = obj[0].pos.x
                                    var yy = obj[0].pos.y
                                    switch(terrain.get(xx-1,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                    switch(terrain.get(xx-1,yy+0)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                    switch(terrain.get(xx-1,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                    switch(terrain.get(xx+1,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                    switch(terrain.get(xx+1,yy+0)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                    switch(terrain.get(xx+1,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                    switch(terrain.get(xx+0,yy-1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}
                                    switch(terrain.get(xx+0,yy+1)) { case 0: cnt_vic = cnt_vic + 1; break ; case 1: break; case 2: cnt_vic = cnt_vic + 1; break}

                                    if( cnt_vic >= 1 ){

                                        var id = obj[0].id

                                        Memory.mineralsBank[id]              = {}
                                        Memory.mineralsBank[id].id           = id
                                        Memory.mineralsBank[id].rm           = rm
                                        Memory.mineralsBank[id].rm_tgt       = rm_sct
                                        Memory.mineralsBank[id].mineralAmount= obj[0].mineralAmount
                                        Memory.mineralsBank[id].mineralType  = obj[0].mineralType
                                        Memory.mineralsBank[id].tick         = Game.time
                                        Memory.mineralsBank[id].cnt_vic      = cnt_vic

                                    }
                                }
                                // update entry
                                else{

                                    var id = obj[0].id

                                    Memory.mineralsBank[id].mineralAmount= obj[0].mineralAmount
                                    Memory.mineralsBank[id].tick         = Game.time

                                }
                            }
                        }
                    }
                }
                //

            }
        }
    }
};

module.exports = MainObserverIntel;
