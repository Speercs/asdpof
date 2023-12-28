var utils = {

    run: function() {

        // // clean old matrixes
        // if ( Game.time % 125 == 7 ) {
        //     // clean memory
        //     for(var name in Memory.rooms) {
        //         if( Memory.rooms[name] && Memory.rooms[name].savedMatrix_tick && Memory.rooms[name].savedMatrix && ( Game.time - Memory.rooms[name].savedMatrix_tick ) > 500 ) {
        //             delete Memory.rooms[name].savedMatrix_tick;
        //             delete Memory.rooms[name].savedMatrix;
        //         }
        //     }
        // }
        // //
        
        // delete specific position from planner
        if( 1==11 ){
            var rm = 'W59N18'
            
            // to delete
            var xx = 12
            var yy = 40
            var type = 'road'
            
            if( Game.rooms[rm].memory.planner ){
                for (var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){
                    if( Game.rooms[rm].memory.planner[i][0] == xx && Game.rooms[rm].memory.planner[i][1] == yy && Game.rooms[rm].memory.planner[i][2] == type ){
                         Game.rooms[rm].memory.planner.splice(i,1)
                         break;
                    }
                }
            }
        }

        // clean dead creeps memory
        if ( Game.time % 25 == 7 && 1==11 ) {
            // clean memory
            for(var name in Memory.creeps) {
                if(!Game.creeps[name]) {delete Memory.creeps[name];
                    //console.log('Clearing non-existing creep memory:', name);
                }
            }
        }
        //
        
        // clean rooms from memory
        if ( Game.time % 1500 == 7 ) {
            // clean memory
            for(var name in Memory.rooms) {
                var rm = name;
                if ( Game.rooms[rm] && Game.rooms[rm].controller && Game.rooms[rm].controller.my ) {
                    // ok
                }
                else{
                    delete Memory.rooms[rm]
                }
            }
        }
        //
        
        // remove extension if not active
        if( Game.time % 750 == 0 ){
            for(var name in Memory.rooms) {
                var rm = name;
                if ( Game.rooms[rm] && Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].controller.level < 8 ) {
                    
                    var ext = Game.rooms[rm].find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION } } );
                    
                    if( ( Game.rooms[rm].controller.level == 7 && ext.length > 50 ) ||
                        ( Game.rooms[rm].controller.level == 6 && ext.length > 40 ) ||
                        ( Game.rooms[rm].controller.level == 5 && ext.length > 30 ) ||
                        ( Game.rooms[rm].controller.level == 4 && ext.length > 20 ) ||
                        ( Game.rooms[rm].controller.level == 3 && ext.length > 10 ) ||
                        ( Game.rooms[rm].controller.level == 2 && ext.length > 5 ) ){
                           
                        for ( var i = 0 ; i < ext.length ; i++){
                           ext[i].destroy()
                        }
                        
                        Game.rooms[rm].memory.oneTimer.build = 2
                        Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                    }
                }
            }
        }
        //

        // empty terminal 
        if( Game.time % 5 == 0 && 1==1 ){

            var rm = 'W76N49'

            if( Game.rooms[rm] && Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].terminal && Game.rooms[rm].terminal.cooldown == 0 ){

                var SYMBOLS=
                         [

                        'XUH2O','XUHO2','XKH2O','XKHO2','XLH2O','XLHO2','XZH2O','XZHO2','XGH2O','XGHO2',

                        'machine','organism','device','essence',
                        'hydraulics','organoid','circuit','emanation',

                        'UH2O','UHO2','KH2O','KHO2','LH2O','LHO2','ZH2O','ZHO2','GH2O','GHO2',
                        'UH','UO','KH','KO','LH','LO','ZH','ZO','GH','GO',
                        'OH','ZK','UL',
                        'G',

                        'power','ops',

                        'composite','tube','phlegm','switch','concentrate',
                        'utrium_bar','lemergium_bar','zynthium_bar','keanium_bar','ghodium_melt','oxidant','reductant','purifier','battery','wire','cell','alloy','condensate',

                        'liquid','frame','muscle','microchip','spirit',
                        'crystal','fixtures','tissue', 'transistor', 'extract',
                        'silicon','metal','biomass', 'mist',

                        'energy',

                        'H','O','U','L','K','Z','X'



                        ]

                for (var i = 0 ; i < SYMBOLS.length ; i++){
                    symb = SYMBOLS[i]
                    if( Game.rooms[rm].terminal && Game.rooms[rm].terminal.store[symb] > 100 ){
                        var amt = Game.rooms[rm].terminal.store[symb]
                        break;
                    }
                }

                for(var name2 in Game.rooms) {

                    if ( name2 != rm && Game.rooms[name2].controller && Game.rooms[name2].controller.my && Game.rooms[name2].terminal && Game.rooms[name2].storage ){

                        var rm_tgt = name2;

                        if( amt > 5000 ){
                            var amt = 5000
                        }

                        if( Game.rooms[rm_tgt].terminal.store.getFreeCapacity() >= 20000 ){

                            Game.rooms[rm].terminal.send(symb, amt, rm_tgt)

                        }
                    }
                }
            }
        }


        // log rooms lvls
        if( Game.time % 50 == 0 ){

            for(var name in Game.rooms) {

                var rm = name

                if( Game.rooms[rm] && Game.rooms[rm].controller && Game.rooms[rm].controller.my ){

                    if( !Memory.logger ){
                        Memory.logger = {}
                    }

                    if( !Memory.logger[rm] ){
                        Memory.logger[rm] = []
                    }

                    if( !Memory.logger[rm][0] || Memory.logger[rm][0] == null ){
                        Memory.logger[rm][0] = Game.time
                    }

                    if( !Memory.logger[rm][ Game.rooms[rm].controller.level ] ){
                        Memory.logger[rm][ Game.rooms[rm].controller.level ] = Game.time - Memory.logger[rm][0]
                    }
                }
            }
        }
        //

        //
        // // clean unclaimed rooms from segments
        // if( Game.time % 5555 == 0 ){
        //     for(var name in Memory.segmentMemory) {
        //         if( Game.rooms[name] && Game.rooms[name].controller && Game.rooms[name].controller.my ){
        //             // ok
        //         }
        //         else {
        //             delete Memory.segmentMemory[name]
        //         }
        //     }
        // }
        // //
        //
        //
        // // stop fatory production if low on minerals
        // if( Game.time % 1000 == 7 && 1==11){
        //     var factory = 1
        //     for(var name in Game.rooms) {
        //         rm = name;
        //         if( Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].controller.level == 8 && Game.rooms[rm].storage ){
        //             if (Game.rooms[rm].storage.store['H'] > 1000 &&
        //                 Game.rooms[rm].storage.store['O'] > 1000 &&
        //                 Game.rooms[rm].storage.store['U'] > 1000 &&
        //                 Game.rooms[rm].storage.store['L'] > 1000 &&
        //                 Game.rooms[rm].storage.store['Z'] > 1000 &&
        //                 Game.rooms[rm].storage.store['K'] > 1000 &&
        //                 Game.rooms[rm].storage.store['X'] > 1000 ) {
        //                   //
        //             }
        //             else {
        //                 var factory = 0
        //                 break;
        //             }
        //         }
        //     }
        //
        //     if( factory == 1 ){
        //         Memory.one_timer.factory = 1
        //     }
        //     else{
        //         Memory.one_timer.factory = 0
        //     }
        // }
        // //
        //
        // // clean ramparts // walls without flags
        // if( Game.time % 5000 == 7 && Game.cpu.bucket > 9000 && 1==11 ){
        //
        //     for(var name in Game.rooms) {
        //         rm = name;
        //         if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.cpu.getUsed()  <450 ) {
        //
        //             var objs = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_RAMPART || structure.structureType == STRUCTURE_WALL ) } } )
        //
        //             for ( var i = 0 ; i < objs.length ; i++){
        //                 var obj_loop = Game.rooms[rm].lookForAt(LOOK_FLAGS, objs[i].pos )
        //                 if( obj_loop.length >= 1 ){
        //                     if( objs[i].structureType == STRUCTURE_RAMPART && ( obj_loop[0].color == 4 || obj_loop[0].color == 5 ) ){
        //                         // ok
        //                     }
        //                     else if( objs[i].structureType == STRUCTURE_WALL && obj_loop[0].color == 9 ){
        //                         // ok
        //                     }
        //                     else{
        //                         var obj_loop = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, objs[i].pos )
        //                         if( obj_loop.length >= 1 ){
        //                             if( obj_loop[0] && ( obj_loop[0].structureType == STRUCTURE_SPAWN || obj_loop[0].structureType == STRUCTURE_TERMINAL || obj_loop[0].structureType == STRUCTURE_STORAGE)  ){
        //                                 // ok
        //                             }
        //                             else if( obj_loop[1] && ( obj_loop[1].structureType == STRUCTURE_SPAWN || obj_loop[1].structureType == STRUCTURE_TERMINAL || obj_loop[1].structureType == STRUCTURE_STORAGE)  ){
        //                                 // ok
        //                             }
        //                             else{
        //                                 objs[i].destroy()
        //                             }
        //                         }
        //                         else{
        //                             objs[i].destroy()
        //                         }
        //                     }
        //                 }
        //                 else{
        //                     var obj_loop = Game.rooms[rm].lookForAt(LOOK_STRUCTURES, objs[i].pos )
        //                     if( obj_loop.length >= 1 ){
        //                         if( obj_loop[0] && ( obj_loop[0].structureType == STRUCTURE_SPAWN || obj_loop[0].structureType == STRUCTURE_TERMINAL || obj_loop[0].structureType == STRUCTURE_STORAGE)  ){
        //                             // ok
        //                         }
        //                         else if( obj_loop[1] && ( obj_loop[1].structureType == STRUCTURE_SPAWN || obj_loop[1].structureType == STRUCTURE_TERMINAL || obj_loop[1].structureType == STRUCTURE_STORAGE)  ){
        //                             // ok
        //                         }
        //                         else{
        //                             objs[i].destroy()
        //                         }
        //                     }
        //                     else{
        //                         objs[i].destroy()
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        // //
        
        // destroy buildings sites    
        if ( Game.time % 50 == 11 ) {

            if( Object.keys(Game.constructionSites).length >= 85 ){

                // only roads on unowned rooms
                var obj = _.filter(Game.constructionSites, (id) => id.structureType == 'road' && 
                                                                    id.progress == 0 &&
                                                                    (   !id.room || 
                                                                        ( id.room && id.room.controller && !id.room.controller.my ) ||
                                                                        ( id.room && !id.room.controller )  ) )

                if( obj.length >= 1 ){
                    for ( var i = 0 ; i < Math.min(obj.length,40) ; i++){
                        var id = obj[i].id
                        Game.getObjectById(id).remove()
                    }
                }
                else{

                     var obj = _.filter(Game.constructionSites, (id) => !id.room )

                    if( obj.length >= 1 ){
                        for ( var i = 0 ; i < Math.min(obj.length,40) ; i++){
                            var id = obj[i].id
                            Game.getObjectById(id).remove()
                        }
                    }
                }
            }
        } 
        //
        
        // report minerals
        if( ( Memory.oneTimer.reportMinerals > 0 && Game.time % Memory.oneTimer.reportMinerals == 0 ) || !Memory.stats ){

            var mineral      =  [
                                    ['H',        0,     '#ffffff'],
                                    ['O',        0,     '#ffffff'],
                                    ['U',        0,     '#ffffff'],
                                    ['K',        0,     '#ffffff'],
                                    ['L',        0,     '#ffffff'],
                                    ['Z',        0,     '#ffffff'],
                                    ['X',        0,     '#ffffff'],
        
                                    ['OH',       0,     '#ffffff'],
                                    ['ZK',       0,     '#ffffff'],
                                    ['UL',       0,     '#ffffff'],
                                    ['G',        0,     '#ffffff'],
        
                                    ['UH',       0,     '#ffffff'],
                                    ['UO',       0,     '#ffffff'],
                                    ['KH',       0,     '#ffffff'],
                                    ['KO',       0,     '#ffffff'],
                                    ['LH',       0,     '#ffffff'],
                                    ['LO',       0,     '#ffffff'],
                                    ['ZH',       0,     '#ffffff'],
                                    ['ZO',       0,     '#ffffff'],
                                    ['GH',       0,     '#ffffff'],
                                    ['GO',       0,     '#ffffff'],
        
                                    ['UH2O',     0,     '#ffffff'],
                                    ['UHO2',     0,     '#ffffff'],
                                    ['KH2O',     0,     '#ffffff'],
                                    ['KHO2',     0,     '#ffffff'],
                                    ['LH2O',     0,     '#ffffff'],
                                    ['LHO2',     0,     '#ffffff'],
                                    ['ZH2O',     0,     '#ffffff'],
                                    ['ZHO2',     0,     '#ffffff'],
                                    ['GH2O',     0,     '#ffffff'],
                                    ['GHO2',     0,     '#ffffff'],
        
                                    ['XUH2O',    0,     '#ffffff'],
                                    ['XUHO2',    0,     '#ffffff'],
                                    ['XKH2O',    0,     '#ffffff'],
                                    ['XKHO2',    0,     '#ffffff'],
                                    ['XLH2O',    0,     '#ffffff'],
                                    ['XLHO2',    0,     '#ffffff'],
                                    ['XZH2O',    0,     '#ffffff'],
                                    ['XZHO2',    0,     '#ffffff'],
                                    ['XGH2O',    0,     '#ffffff'],
                                    ['XGHO2',    0,     '#ffffff'],
        
                                    ['energy',   0,     '#ffffff'],
        
                                    ['power',    0,     '#ffffff'],
                                    ['ops',      0,     '#ffffff'],
        
                                    ['utrium_bar',0,    '#ffffff'],
                                    ['lemergium_bar',0, '#ffffff'],
                                    ['zynthium_bar',0,  '#ffffff'],
                                    ['keanium_bar',0,   '#ffffff'],
                                    ['ghodium_melt',0,  '#ffffff'],
                                    ['oxidant',  0,     '#ffffff'],
                                    ['reductant',0,     '#ffffff'],
                                    ['purifier', 0,     '#ffffff'],
                                    ['battery',  0,     '#ffffff'],
        
                                    ['composite',0,     '#ffffff'],
                                    ['crystal',  0,     '#ffffff'],
                                    ['liquid',   0,     '#ffffff'],
        
                                    ['silicon',  0,     '#ffffff'],
                                    ['wire',     0,     '#ffffff'],
                                    ['switch',   0,     '#ffffff'],
                                    ['transistor',0,    '#ffffff'],
                                    ['microchip',0,     '#ffffff'],
                                    ['circuit',  0,     '#ffffff'],
                                    ['device',   0,     '#ffffff'],
        
                                    ['biomass',  0,     '#ffffff'],
                                    ['cell',     0,     '#ffffff'],
                                    ['phlegm',   0,     '#ffffff'],
                                    ['tissue',   0,     '#ffffff'],
                                    ['muscle',   0,     '#ffffff'],
                                    ['organoid', 0,     '#ffffff'],
                                    ['organism', 0,     '#ffffff'],
        
                                    ['metal',    0,     '#ffffff'],
                                    ['alloy',    0,     '#ffffff'],
                                    ['tube',     0,     '#ffffff'],
                                    ['fixtures', 0,     '#ffffff'],
                                    ['frame',    0,     '#ffffff'],
                                    ['hydraulics',0,    '#ffffff'],
                                    ['machine',  0,     '#ffffff'],
        
                                    ['mist',     0,     '#ffffff'],
                                    ['condensate',0,    '#ffffff'],
                                    ['concentrate',0,   '#ffffff'],
                                    ['extract',  0,     '#ffffff'],
                                    ['spirit',   0,     '#ffffff'],
                                    ['emanation',0,     '#ffffff'],
                                    ['essence',  0,     '#ffffff']
        
                                ]
        
        
        
        
        
            var cnt = 0
            for(var name in Game.rooms) {
        
                rm = name;
        
                if (  Game.rooms[rm].controller && Game.rooms[rm].controller.my && Game.rooms[rm].storage && Game.rooms[rm].terminal ) {
        
                    cnt = cnt + 1
        
                    for( var i = 0; i < mineral.length; i++ ){
        
                        var res = mineral[i][0]
                        var amt = 0
        
                        if( Game.rooms[rm] && Game.rooms[rm].terminal ){
                            amt = amt + Game.rooms[rm].terminal.store[res]
                        }
        
                        if( Game.rooms[rm] && Game.rooms[rm].storage ){
                            amt = amt + Game.rooms[rm].storage.store[res]
                        }
        
                        // if( Game.rooms[rm] && Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.factory && Game.rooms[rm].memory.intel.factory[0] ){
                        //     amt = amt + Game.getObjectById( Game.rooms[rm].memory.intel.factory[0].id ).store[res]
                        // }
        
                        mineral[i][1] = mineral[i][1] + amt
        
                        if( Game.rooms[rm].memory.lab_boost == res ){
                            mineral[i][2] = '#66d44a'
                        }
                    }
                }
            }
        
        
            console.log("<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[41][0] + ".png'/>", mineral[41][1], 'avg:', Math.round(mineral[41][1]/cnt) )
        
            console.log("<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[42][0] + ".png'/>", mineral[42][1], 'avg:', Math.round(mineral[42][1]/cnt),
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[43][0] + ".png'/>", mineral[43][1], 'avg:', Math.round(mineral[43][1]/cnt) )
        
            console.log("<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[0][0] + ".png'/>", "<font color=\"" + mineral[0][2] + "\">" + mineral[0][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[1][0] + ".png'/>", "<font color=\"" + mineral[1][2] + "\">" + mineral[1][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[2][0] + ".png'/>", "<font color=\"" + mineral[2][2] + "\">" + mineral[2][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[3][0] + ".png'/>", "<font color=\"" + mineral[3][2] + "\">" + mineral[3][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[4][0] + ".png'/>", "<font color=\"" + mineral[4][2] + "\">" + mineral[4][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[5][0] + ".png'/>", "<font color=\"" + mineral[5][2] + "\">" + mineral[5][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[6][0] + ".png'/>", "<font color=\"" + mineral[6][2] + "\">" + mineral[6][1] + "</font>"  )
        
            console.log("<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[7][0] + ".png'/>", "<font color=\"" + mineral[7][2] + "\">" + mineral[7][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[8][0] + ".png'/>", "<font color=\"" + mineral[8][2] + "\">" + mineral[8][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[9][0] + ".png'/>", "<font color=\"" + mineral[9][2] + "\">" + mineral[9][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[10][0] + ".png'/>","<font color=\"" + mineral[10][2] + "\">" + mineral[10][1]+ "</font>" )
        
            console.log("<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[11][0] + ".png'/>", "<font color=\"" + mineral[11][2] + "\">" + mineral[11][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[12][0] + ".png'/>", "<font color=\"" + mineral[12][2] + "\">" + mineral[12][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[13][0] + ".png'/>", "<font color=\"" + mineral[13][2] + "\">" + mineral[13][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[14][0] + ".png'/>", "<font color=\"" + mineral[14][2] + "\">" + mineral[14][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[15][0] + ".png'/>", "<font color=\"" + mineral[15][2] + "\">" + mineral[15][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[16][0] + ".png'/>", "<font color=\"" + mineral[16][2] + "\">" + mineral[16][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[17][0] + ".png'/>", "<font color=\"" + mineral[17][2] + "\">" + mineral[17][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[18][0] + ".png'/>", "<font color=\"" + mineral[18][2] + "\">" + mineral[18][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[19][0] + ".png'/>", "<font color=\"" + mineral[19][2] + "\">" + mineral[19][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[20][0] + ".png'/>", "<font color=\"" + mineral[20][2] + "\">" + mineral[20][1] + "</font>" )
        
            console.log("<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[21][0] + ".png'/>", "<font color=\"" + mineral[21][2] + "\">" + mineral[21][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[22][0] + ".png'/>", "<font color=\"" + mineral[22][2] + "\">" + mineral[22][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[23][0] + ".png'/>", "<font color=\"" + mineral[23][2] + "\">" + mineral[23][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[24][0] + ".png'/>", "<font color=\"" + mineral[24][2] + "\">" + mineral[24][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[25][0] + ".png'/>", "<font color=\"" + mineral[25][2] + "\">" + mineral[25][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[26][0] + ".png'/>", "<font color=\"" + mineral[26][2] + "\">" + mineral[26][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[27][0] + ".png'/>", "<font color=\"" + mineral[27][2] + "\">" + mineral[27][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[28][0] + ".png'/>", "<font color=\"" + mineral[28][2] + "\">" + mineral[28][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[29][0] + ".png'/>", "<font color=\"" + mineral[29][2] + "\">" + mineral[29][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[30][0] + ".png'/>", "<font color=\"" + mineral[30][2] + "\">" + mineral[30][1] + "</font>" )
        
            console.log("<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[31][0] + ".png'/>", "<font color=\"" + mineral[31][2] + "\">" + mineral[31][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[32][0] + ".png'/>", "<font color=\"" + mineral[32][2] + "\">" + mineral[32][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[33][0] + ".png'/>", "<font color=\"" + mineral[33][2] + "\">" + mineral[33][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[34][0] + ".png'/>", "<font color=\"" + mineral[34][2] + "\">" + mineral[34][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[35][0] + ".png'/>", "<font color=\"" + mineral[35][2] + "\">" + mineral[35][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[36][0] + ".png'/>", "<font color=\"" + mineral[36][2] + "\">" + mineral[36][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[37][0] + ".png'/>", "<font color=\"" + mineral[37][2] + "\">" + mineral[37][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[38][0] + ".png'/>", "<font color=\"" + mineral[38][2] + "\">" + mineral[38][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[39][0] + ".png'/>", "<font color=\"" + mineral[39][2] + "\">" + mineral[39][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[40][0] + ".png'/>", "<font color=\"" + mineral[40][2] + "\">" + mineral[40][1] + "</font>" )
        
            console.log("<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[44][0] + ".png'/>", "<font color=\"" + mineral[44][2] + "\">" + mineral[44][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[45][0] + ".png'/>", "<font color=\"" + mineral[45][2] + "\">" + mineral[45][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[46][0] + ".png'/>", "<font color=\"" + mineral[46][2] + "\">" + mineral[46][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[47][0] + ".png'/>", "<font color=\"" + mineral[47][2] + "\">" + mineral[47][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[48][0] + ".png'/>", "<font color=\"" + mineral[48][2] + "\">" + mineral[48][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[49][0] + ".png'/>", "<font color=\"" + mineral[49][2] + "\">" + mineral[49][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[50][0] + ".png'/>", "<font color=\"" + mineral[50][2] + "\">" + mineral[50][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[51][0] + ".png'/>", "<font color=\"" + mineral[51][2] + "\">" + mineral[51][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[52][0] + ".png'/>", "<font color=\"" + mineral[52][2] + "\">" + mineral[52][1] + "</font>" )
        
            console.log("<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[53][0] + ".png'/>", "<font color=\"" + mineral[53][2] + "\">" + mineral[53][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[54][0] + ".png'/>", "<font color=\"" + mineral[54][2] + "\">" + mineral[54][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[55][0] + ".png'/>", "<font color=\"" + mineral[55][2] + "\">" + mineral[55][1] + "</font>" )
        
            console.log("<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[56][0] + ".png'/>", "<font color=\"" + mineral[56][2] + "\">" + mineral[56][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[57][0] + ".png'/>", "<font color=\"" + mineral[57][2] + "\">" + mineral[57][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[58][0] + ".png'/>", "<font color=\"" + mineral[58][2] + "\">" + mineral[58][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[59][0] + ".png'/>", "<font color=\"" + mineral[59][2] + "\">" + mineral[59][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[60][0] + ".png'/>", "<font color=\"" + mineral[60][2] + "\">" + mineral[60][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[61][0] + ".png'/>", "<font color=\"" + mineral[61][2] + "\">" + mineral[61][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[62][0] + ".png'/>", "<font color=\"" + mineral[62][2] + "\">" + mineral[62][1] + "</font>" )
        
            console.log("<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[63][0] + ".png'/>", "<font color=\"" + mineral[63][2] + "\">" + mineral[63][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[64][0] + ".png'/>", "<font color=\"" + mineral[64][2] + "\">" + mineral[64][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[65][0] + ".png'/>", "<font color=\"" + mineral[65][2] + "\">" + mineral[65][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[66][0] + ".png'/>", "<font color=\"" + mineral[66][2] + "\">" + mineral[66][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[67][0] + ".png'/>", "<font color=\"" + mineral[67][2] + "\">" + mineral[67][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[68][0] + ".png'/>", "<font color=\"" + mineral[68][2] + "\">" + mineral[68][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[69][0] + ".png'/>", "<font color=\"" + mineral[69][2] + "\">" + mineral[69][1] + "</font>" )
        
            console.log("<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[70][0] + ".png'/>", "<font color=\"" + mineral[70][2] + "\">" + mineral[70][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[71][0] + ".png'/>", "<font color=\"" + mineral[71][2] + "\">" + mineral[71][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[72][0] + ".png'/>", "<font color=\"" + mineral[72][2] + "\">" + mineral[72][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[73][0] + ".png'/>", "<font color=\"" + mineral[73][2] + "\">" + mineral[73][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[74][0] + ".png'/>", "<font color=\"" + mineral[74][2] + "\">" + mineral[74][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[75][0] + ".png'/>", "<font color=\"" + mineral[75][2] + "\">" + mineral[75][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[76][0] + ".png'/>", "<font color=\"" + mineral[76][2] + "\">" + mineral[76][1] + "</font>" )
        
            console.log("<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[77][0] + ".png'/>", "<font color=\"" + mineral[77][2] + "\">" + mineral[77][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[78][0] + ".png'/>", "<font color=\"" + mineral[78][2] + "\">" + mineral[78][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[79][0] + ".png'/>", "<font color=\"" + mineral[79][2] + "\">" + mineral[79][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[80][0] + ".png'/>", "<font color=\"" + mineral[80][2] + "\">" + mineral[80][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[81][0] + ".png'/>", "<font color=\"" + mineral[81][2] + "\">" + mineral[81][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[82][0] + ".png'/>", "<font color=\"" + mineral[82][2] + "\">" + mineral[82][1] + "</font>",
                        "<img src='https://static.screeps.com/upload/mineral-icons/" + mineral[83][0] + ".png'/>", "<font color=\"" + mineral[83][2] + "\">" + mineral[83][1] + "</font>" )
        
        
        
        
            // stats // grafana
            if( !Memory.stats ){ Memory.stats = {} }
            if( !Memory.stats.minerals ){ Memory.stats.minerals = {} }
        
            Memory.stats.minerals.H      = mineral[0][1]
            Memory.stats.minerals.O      = mineral[1][1]
            Memory.stats.minerals.U      = mineral[2][1]
            Memory.stats.minerals.K      = mineral[3][1]
            Memory.stats.minerals.L      = mineral[4][1]
            Memory.stats.minerals.Z      = mineral[5][1]
            Memory.stats.minerals.X      = mineral[6][1]
        
            Memory.stats.minerals.OH      = mineral[7][1]
            Memory.stats.minerals.ZK      = mineral[8][1]
            Memory.stats.minerals.UL      = mineral[9][1]
            Memory.stats.minerals.G       = mineral[10][1]
        
            Memory.stats.minerals.UH      = mineral[11][1]
            Memory.stats.minerals.UO      = mineral[12][1]
            Memory.stats.minerals.KH      = mineral[13][1]
            Memory.stats.minerals.KO      = mineral[14][1]
            Memory.stats.minerals.LH      = mineral[15][1]
            Memory.stats.minerals.LO      = mineral[16][1]
            Memory.stats.minerals.ZH      = mineral[17][1]
            Memory.stats.minerals.ZO      = mineral[18][1]
            Memory.stats.minerals.GH      = mineral[19][1]
            Memory.stats.minerals.GO      = mineral[20][1]
        
            Memory.stats.minerals.UH2O      = mineral[21][1]
            Memory.stats.minerals.UHO2      = mineral[22][1]
            Memory.stats.minerals.KH2O      = mineral[23][1]
            Memory.stats.minerals.KHO2      = mineral[24][1]
            Memory.stats.minerals.LH2O      = mineral[25][1]
            Memory.stats.minerals.LHO2      = mineral[26][1]
            Memory.stats.minerals.ZH2O      = mineral[27][1]
            Memory.stats.minerals.ZHO2      = mineral[28][1]
            Memory.stats.minerals.GH2O      = mineral[29][1]
            Memory.stats.minerals.GHO2      = mineral[30][1]
        
            Memory.stats.minerals.XUH2O      = mineral[31][1]
            Memory.stats.minerals.XUHO2      = mineral[32][1]
            Memory.stats.minerals.XKH2O      = mineral[33][1]
            Memory.stats.minerals.XKHO2      = mineral[34][1]
            Memory.stats.minerals.XLH2O      = mineral[35][1]
            Memory.stats.minerals.XLHO2      = mineral[36][1]
            Memory.stats.minerals.XZH2O      = mineral[37][1]
            Memory.stats.minerals.XZHO2      = mineral[38][1]
            Memory.stats.minerals.XGH2O      = mineral[39][1]
            Memory.stats.minerals.XGHO2      = mineral[40][1]
        
            Memory.stats.minerals.energy     = mineral[41][1]
        
            Memory.stats.minerals.power      = mineral[42][1]
            Memory.stats.minerals.ops        = mineral[43][1]
        
            Memory.stats.minerals.utrium_bar    = mineral[44][1]
            Memory.stats.minerals.lemergium_bar = mineral[45][1]
            Memory.stats.minerals.zynthium_bar  = mineral[46][1]
            Memory.stats.minerals.keanium_bar   = mineral[47][1]
            Memory.stats.minerals.ghodium_melt  = mineral[48][1]
            Memory.stats.minerals.oxidant       = mineral[49][1]
            Memory.stats.minerals.reductant     = mineral[50][1]
            Memory.stats.minerals.purifier      = mineral[51][1]
            Memory.stats.minerals.battery       = mineral[52][1]
        
            Memory.stats.minerals.composite     = mineral[53][1]
            Memory.stats.minerals.crystal       = mineral[54][1]
            Memory.stats.minerals.liquid        = mineral[55][1]
        
            Memory.stats.minerals.silicon       = mineral[56][1]
            Memory.stats.minerals.wire          = mineral[57][1]
            Memory.stats.minerals.switch        = mineral[58][1]
            Memory.stats.minerals.transistor    = mineral[59][1]
            Memory.stats.minerals.microchip     = mineral[60][1]
            Memory.stats.minerals.circuit       = mineral[61][1]
            Memory.stats.minerals.device        = mineral[62][1]
        
            Memory.stats.minerals.biomass       = mineral[63][1]
            Memory.stats.minerals.cell          = mineral[64][1]
            Memory.stats.minerals.phlegm        = mineral[65][1]
            Memory.stats.minerals.tissue        = mineral[66][1]
            Memory.stats.minerals.muscle        = mineral[67][1]
            Memory.stats.minerals.organoid      = mineral[68][1]
            Memory.stats.minerals.organism      = mineral[69][1]
        
            Memory.stats.minerals.metal         = mineral[70][1]
            Memory.stats.minerals.alloy         = mineral[71][1]
            Memory.stats.minerals.tube          = mineral[72][1]
            Memory.stats.minerals.fixtures      = mineral[73][1]
            Memory.stats.minerals.frame         = mineral[74][1]
            Memory.stats.minerals.hydraulics    = mineral[75][1]
            Memory.stats.minerals.machine       = mineral[76][1]
        
            Memory.stats.minerals.mist          = mineral[77][1]
            Memory.stats.minerals.condensate    = mineral[78][1]
            Memory.stats.minerals.concentrate   = mineral[79][1]
            Memory.stats.minerals.extract       = mineral[80][1]
            Memory.stats.minerals.spirit        = mineral[81][1]
            Memory.stats.minerals.emanation     = mineral[82][1]
            Memory.stats.minerals.essence       = mineral[83][1]
        
            Memory.stats.misc = {}
            Memory.stats.misc.energy        = Math.round(mineral[41][1]/cnt)
            Memory.stats.misc.construction  = Game.constructionSites.length
            
            Memory.stats.misc.t1_max_lvl  = 14000 * Memory.stats.number_rooms * .5
            Memory.stats.misc.t2_max_lvl  = 14000 * Memory.stats.number_rooms * .25
            Memory.stats.misc.t3_min_lvl  = 14000 * 5
            Memory.stats.misc.t3_max_lvl  = 14000 * Memory.stats.number_rooms * .85
        }
        
        
        
        // stats
        if( Game.time % 500 == 0 ){
            Memory.stats.time = Game.time
            var rm_cnt = 0
        
            // rooms
            Memory.stats.rooms        = {}
        
            for(var name in Game.rooms) {
        
                rm = name;
                if (  Game.rooms[rm].controller && Game.rooms[rm].controller.my ) {
        
                    Memory.stats.rooms[ rm ] = {}
        
                    Memory.stats.rooms[ rm ].creeps  = _.filter(Game.creeps, (creep) => creep.memory.birth == rm ).length
                    var amt = 0
        
                    if( Game.rooms[rm].storage ){
                        Memory.stats.rooms[ rm ].storage  = Game.rooms[rm].storage.store.getUsedCapacity()/1000
                        var amt = amt + Game.rooms[rm].storage.store['energy']
                    }
        
                    if( Game.rooms[rm].terminal ){
                        if( Game.rooms[rm].controller.level >= 6 ){
                            var rm_cnt = rm_cnt + 1
                        }
                        Memory.stats.rooms[ rm ].terminal = Game.rooms[rm].terminal.store.getUsedCapacity()/1000
                        var amt = amt + Game.rooms[rm].terminal.store['energy']
                    }
        
                    Memory.stats.rooms[ rm ].energy = Math.round( amt / 1000 )
        
                    if( 1 == 1 ){
                        var obj = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) =>  {return ( structure.structureType == STRUCTURE_RAMPART ) } } )
        
                        var cnt = 0
                        var hits = 0
        
                        var min = 300000000
                        var base_x_min = Game.rooms[rm].memory.base_x - 2
                        var base_x_max = Game.rooms[rm].memory.base_x + 2
                        var base_y_min = Game.rooms[rm].memory.base_y - 3
                        var base_y_max = Game.rooms[rm].memory.base_y
        
                        var lab_x_min = Game.rooms[rm].memory.lab_x - 2
                        var lab_x_max = Game.rooms[rm].memory.lab_x + 2
                        var lab_y_min = Game.rooms[rm].memory.lab_y - 2
                        var lab_y_max = Game.rooms[rm].memory.lab_y
        
                        for ( var i = 0 ; i < obj.length ; i++){
        
                            var ramp_x = obj[i].pos.x
                            var ramp_y = obj[i].pos.y
        
                            // CORE
                            if( ramp_x >= base_x_min &&
                                ramp_y >= base_y_min &&
                                ramp_x <= base_x_max &&
                                ramp_y <= base_y_max ){
        
                                // core ramp
                            }
                            // LAB
                            else if( ramp_x >= lab_x_min &&
                                ramp_y >= lab_y_min &&
                                ramp_x <= lab_x_max &&
                                ramp_y <= lab_y_max ){
        
                                // lab ramp
                            }
                            // RAMPART from defence
                            else{
                                var cnt = cnt + 1
                                if( obj[i].hits < min ){
                                    var min = obj[i].hits
                                }
                                var hits = hits + obj[i].hits
                            }
                        }
        
                        if( cnt >0 ){
                            Memory.stats.rooms[ rm ].wall_hits     = Math.round( hits / cnt / 100000 )/10
                            Memory.stats.rooms[ rm ].wall_hits_min = Math.round( min / 100000 )/10
                        }
                    }
        
                    Memory.stats.rooms[ rm ].spawn_usage_s = Game.rooms[rm].memory.spawn_usage_s
        
                }
                else if( Memory.stats.rooms[ rm ] ){
                    delete Memory.stats.rooms[ rm ]
                }
            }
        
        
            var cnt = 0
            var avg = 0
            if( Game.time % 3000 == 0  ){
                for(var name in Memory.stats.rooms) {
                    if( Game.rooms[name] && Game.rooms[name].controller && Game.rooms[name].controller.my && Game.rooms[name].controller.level == 8 && Memory.stats.rooms[ name ].wall_hits_min > 0 ){
                        var cnt = cnt + 1
                        var avg = avg + Memory.stats.rooms[ name ].wall_hits
                    }
                }
                Memory.stats.wall_hits_avg = avg / cnt
                Memory.stats.wall_hits = Memory.stats.wall_hits_avg
            }
        
            Memory.stats.number_rooms  = rm_cnt
        
            Memory.stats.attack_list       = 0
            for( var aa = 0; aa < Memory.attack_list.length; aa++ ){
                if( Memory.attack_list[aa].count_tower > 0 ){
                    var count_tower = Memory.attack_list[aa].count_tower
                }
                else{
                    var count_tower = 1
                }
                Memory.stats.attack_list       = Memory.stats.attack_list + count_tower
            }
            Memory.stats.runs_simultaneous = _.filter( Memory.attack_list , (target) => target.threat_lvl < 0 ).length
            Memory.stats.outpost_max_dist  = Memory.config.outpost_max_dist
        }

        // MODES
        if( Game.time % 50 == 0 && Memory.stats ){
         
            for(var name in Game.rooms) {        
                rm = name;
                if (  Game.rooms[rm].controller && Game.rooms[rm].controller.my && Memory.stats.rooms && Memory.stats.rooms[rm] ) {
                    Memory.stats.rooms[rm].repairer_need = Game.rooms[rm].memory.repairer_need
                    Memory.stats.rooms[rm].ramp_repairer_need = Game.rooms[rm].memory.ramp_repairer_need
                    Memory.stats.rooms[rm].mode_defend = Game.rooms[rm].memory.mode_defend
                    Memory.stats.rooms[rm].mode_fill = Game.rooms[rm].memory.mode_fill
                    Memory.stats.rooms[rm].mode_util = Game.rooms[rm].memory.mode_util
                    Memory.stats.rooms[rm].mode_attack = Game.rooms[rm].memory.mode_attack
                }
            }
        }

        
        // cpu
        if( !Memory.stats.cpu  ){ Memory.stats.cpu  = {} }
        Memory.stats.cpu.bucket  = Game.cpu.bucket
        // Memory.stats.cpu.used    = Math.round(Game.cpu.getUsed()) is in the end of main()
        Memory.stats.cpu.limit   = Game.cpu.limit
        
        // Memory - normalized to 10k range
        Memory.stats.memory = RawMemory.get().length / 200
        
        // creeps
        // Memory.stats.number_creeps = _.filter(Game.creeps, (creep) => creep.ticksToLive <= 1499 ).length // on the predictor code
        
        // GCL
        if( !Memory.stats.gcl_progress ){
            Memory.stats.gcl_progress = Game.gcl.progress
            Memory.stats.gcl_level = Game.gcl.level
        }
        if( Memory.stats.gcl_level == Game.gcl.level ){
            Memory.stats.energy_tick = Game.gcl.progress - Memory.stats.gcl_progress
            Memory.stats.gcl_progress = Game.gcl.progress
        }
        Memory.stats.gcl_level = Game.gcl.level
        
        // GPL
        if( !Memory.stats.gpl_progress ){
            Memory.stats.gpl_progress = Game.gpl.progress
            Memory.stats.gpl_level = Game.gpl.level
        }
        if( Memory.stats.gpl_level == Game.gpl.level ){
            Memory.stats.energy_power_tick = ( Game.gpl.progress - Memory.stats.gpl_progress ) * 50
            Memory.stats.gpl_progress = Game.gpl.progress
        }
        Memory.stats.gpl_level = Game.gpl.level
        
        Memory.stats.energy_total_tick = Memory.stats.energy_tick + Memory.stats.energy_power_tick

        // max room lvl
        if( Game.time % 1000 == 0 || Game.gcl.level == 1 ){
            Memory.stats.max_room_lvl = 1
            // room Stuff
            for(var name in Game.rooms) {
                var rm = name;
                if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my ) {
                    Memory.stats.max_room_lvl = Math.max(Memory.stats.max_room_lvl, Game.rooms[rm].controller.level)
                }
            }
        }
        //

    }
};

module.exports = utils;