require('roomVisual')

var MainVisualRoom= {

    run: function( rm ) {

        // visual
        if( Game.time % 2 == 1   ){

            // planner
            if( Game.rooms[rm].controller.level == 1 ){
                Game.rooms[rm].memory.oneTimer.visualPlaner = 350
            }
            //

            // visual planer
            if( Game.rooms[rm].memory.oneTimer.visualPlaner > 0 && Game.rooms[rm].memory.planner ){

                // buildings
                for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){

                    var xx = Game.rooms[rm].memory.planner[i][0]
                    var yy = Game.rooms[rm].memory.planner[i][1]
                    var type = Game.rooms[rm].memory.planner[i][2]
                    if( type != 'road' || 1==1){
                        Game.rooms[rm].visual.structure(xx, yy, type)
                    }
                    if( type == 'spawn' || type == 'lab' || type == 'container' || type == 'link' || type == 'tower' ){
                        new RoomVisual(rm).text(Game.rooms[rm].memory.planner[i][6], new RoomPosition(xx, yy, rm),  {color: 'white', font: 0.5});
                    }
                    else if( type == 'extension' ){
                        new RoomVisual(rm).text(Game.rooms[rm].memory.planner[i][4], new RoomPosition(xx, yy, rm),  {color: 'white', font: 0.5});
                    }
                }
                Game.rooms[rm].visual.connectRoads()

                // ramparts
                for ( f1 in Game.flags ) {

                    if( Game.flags[f1].pos.roomName == rm && ( Game.flags[f1].color == 5 ) ){
                        Game.rooms[rm].visual.structure(Game.flags[f1].pos.x, Game.flags[f1].pos.y, 'rampart')
                    }
                    else if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 9 ){
                        Game.rooms[rm].visual.structure(Game.flags[f1].pos.x, Game.flags[f1].pos.y, 'wall')
                    }
                }

                // source
                if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.sources ){
                    for ( var i = 0; i < Game.rooms[rm].memory.intel.sources.length ; i++) {
                        var x = Game.getObjectById(Game.rooms[rm].memory.intel.sources[i].id).pos.x
                        var y = Game.getObjectById(Game.rooms[rm].memory.intel.sources[i].id).pos.y
                        new RoomVisual(rm).text(i, new RoomPosition(x, y, rm),  {color: 'blue', font: 0.5});
                    }
                }
            }
            //





            // room visual
            if( Memory.oneTimer.visuals >= 1 ){

                // left
                Game.rooms[rm].visual.text( "Storage level: " + Math.round(Game.rooms[rm].memory.storage_lvl),  0 , 0 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                Game.rooms[rm].visual.text( "Phase: " + Game.rooms[rm].memory.phase,  0 , 1 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                Game.rooms[rm].visual.text( "Energy cap: " + Game.rooms[rm].memory.energy_cap,  0 , 2 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )

                Game.rooms[rm].visual.text( "Dyn rm_hauler: " + Math.round(Game.rooms[rm].memory.dyn_rm_hauler * 1000 ) / 1000,  0 , 3 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                Game.rooms[rm].visual.text( "Outpost_max_dist: " + Memory.config.outpost_max_dist,  0 , 4 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                Game.rooms[rm].visual.text( "CPU Bucket: " + Game.cpu.bucket,  0 , 5 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )

                Game.rooms[rm].visual.text( "Construction sites: " + Object.keys(Game.constructionSites).length,  0 , 6 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )

                Game.rooms[rm].visual.text( "Defence hits: " + Math.round( Memory.config.walls_def_hits[Game.rooms[rm].controller.level] / 1000000 * 10 ) / 10 + " M",  0 , 7 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                
                Game.rooms[rm].visual.text( "Repair needed: " + Game.rooms[rm].memory.repairer_need,  0 , 9 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                Game.rooms[rm].visual.text( "Repair rampart needed: " + Game.rooms[rm].memory.ramp_repairer_need,  0 , 10 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                Game.rooms[rm].visual.text( "Mode defend: " + Game.rooms[rm].memory.mode_defend,  0 , 11 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                Game.rooms[rm].visual.text( "Mode fill: " + Game.rooms[rm].memory.mode_fill,  0 , 12 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                Game.rooms[rm].visual.text( "Mode util: " + Game.rooms[rm].memory.mode_util,  0 , 13 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                Game.rooms[rm].visual.text( "Mode attack: " + Game.rooms[rm].memory.mode_attack,  0 , 14 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                Game.rooms[rm].visual.text( "Mode tower random: " + Game.rooms[rm].memory.tower_rand,  0 , 15 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
   
                // left 2 - remotes
                if( Memory.oneTimer.visuals == 2 ){
                    if( global.rooms[rm].remotes ){

                        for ( var i = 0 ; i < global.rooms[rm].remotes.remotes.length ; i++){

                            var colour = 'black'
                            
                            if( global.rooms[rm].remotes.remotes[i].distance < 1000 ){

                                Game.rooms[rm].visual.text( global.rooms[rm].remotes.remotes[i].rm_tgt,   0 , 49 - i , {stroke: 'white', strokeWidth: .2, color: colour, fontSize: 3, align: 'left' } )
                                Game.rooms[rm].visual.text( global.rooms[rm].remotes.remotes[i].distance, 3 , 49 - i , {stroke: 'white', strokeWidth: .2, color: colour, fontSize: 3, align: 'left' } )
                                Game.rooms[rm].visual.text( global.rooms[rm].remotes.remotes[i].status,   5 , 49 - i , {stroke: 'white', strokeWidth: .2, color: colour, fontSize: 3, align: 'left' } )
    
                                Game.rooms[rm].visual.text( global.rooms[rm].remotes.remotes[i].harvester,   9, 49 - i , {stroke: 'white', strokeWidth: .2, color: colour, fontSize: 3, align: 'left' } )
                                Game.rooms[rm].visual.text( Math.round(global.rooms[rm].remotes.carry_sum * 10 ) / 10, 11 , 49 - i , {stroke: 'white', strokeWidth: .2, color: colour, fontSize: 3, align: 'left' } )
                                Game.rooms[rm].visual.text( Math.round(global.rooms[rm].remotes.remotes[i].carry_need * 10 ) / 10, 13 , 49 - i , {stroke: 'white', strokeWidth: .2, color: colour, fontSize: 3, align: 'left' } )
                                Game.rooms[rm].visual.text( global.rooms[rm].remotes.remotes[i].reserver,    15 , 49 - i , {stroke: 'white', strokeWidth: .2, color: colour, fontSize: 3, align: 'left' } )
                            }
                            else{
                                break;
                            }
                        }

                        Game.rooms[rm].visual.text( "Remotes",   0 , 49 - i - 5 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                        Game.rooms[rm].visual.text( "Carry sum : " + global.rooms[rm].remotes.carry_sum,   0 , 49 - i - 4 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                        Game.rooms[rm].visual.text( "Carry need: " + Math.round( global.rooms[rm].remotes.carry_need * 10 ) / 10,  0 , 49 - i - 3 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                        Game.rooms[rm].visual.text( "------------------------------",   0 , 49 - i - 2 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                        Game.rooms[rm].visual.text( "Room     dist      status   harvester  car   car_n  reserver",   0 , 49 - i - 1 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'left' } )
                                               
                    }
                }

                // letf 3 temp remotes cpu
                if( global.remotes_cpu && 1==11 ){
                    
                    global.remotes_cpu = _.sortBy(global.remotes_cpu, 'dist')

                    Game.rooms[rm].visual.text( '--------------------------',   15 , 0 , {stroke: 'white', strokeWidth: .2, color: colour, fontSize: 3, align: 'left' } )
                    var i = 0    
                    for(var id in global.remotes_cpu ) {
                        var i = i + 1 
                        Game.rooms[rm].visual.text( global.remotes_cpu[id].rm,   15 , i , {stroke: 'white', strokeWidth: .2, color: colour, fontSize: 3, align: 'left' } )
                        Game.rooms[rm].visual.text( global.remotes_cpu[id].dist,   19 , i , {stroke: 'white', strokeWidth: .2, color: colour, fontSize: 3, align: 'left' } )
                        Game.rooms[rm].visual.text( global.remotes_cpu[id].harv,   21 , i , {stroke: 'white', strokeWidth: .2, color: colour, fontSize: 3, align: 'left' } )
     
                    }
                }


                // right
                Game.rooms[rm].visual.text( "Manager spawn",  49 , 0 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'right' } )
                if( Game.rooms[rm].memory.manager_spawn ){
                    for ( var i = 0; i < Math.min( Game.rooms[rm].memory.manager_spawn.length, 10 ) ; i++) {
                        var name = Game.rooms[rm].memory.manager_spawn[i][0]
                        var sub  = Game.rooms[rm].memory.manager_spawn[i][13]
                        Game.rooms[rm].visual.text( name + ", " + sub,  49 , 1 + i , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'right' } )
                    }
                }

                // right 2
                Game.rooms[rm].visual.text( "Manager drop",  40 , 0 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'right' } )
                if( global.rooms[rm].manager_drop ){
                    for ( var i = 0; i < Math.min( global.rooms[rm].manager_drop.length, 10 ) ; i++) {
                        var type     = global.rooms[rm].manager_drop[i].type
                        var need_av  = global.rooms[rm].manager_drop[i].need_av
                        var priority  = global.rooms[rm].manager_drop[i].priority
                        Game.rooms[rm].visual.text( type + ", " + need_av + ", " + priority,  40 , 1 + i , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'right' } )
                    }
                }

                // right 3
                Game.rooms[rm].visual.text( "Manager colect",  30 , 0 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'right' } )
                if( global.rooms[rm].manager_collect ){
                    for ( var i = 0; i < Math.min( global.rooms[rm].manager_collect.length, 10) ; i++) {
                        var type     = global.rooms[rm].manager_collect[i].type
                        var store  = global.rooms[rm].manager_collect[i].store
                        Game.rooms[rm].visual.text( type + ", " + store,  30 , 1 + i , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 3, align: 'right' } )
                    }
                }
            }


            // lab
            if( Game.rooms[rm].memory.lab_boost_1 && Game.rooms[rm].memory.lab_boost_1 != 'free' ){
                Game.rooms[rm].visual.resource(Game.rooms[rm].memory.lab_boost_1, Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y + 1)
            }
            if( Game.rooms[rm].memory.lab_boost_2 && Game.rooms[rm].memory.lab_boost_2 != 'free' ){
                Game.rooms[rm].visual.resource(Game.rooms[rm].memory.lab_boost_2, Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y - 1)
            } 

            if( global.rooms[rm].intel && global.rooms[rm].intel.lab ){
                for ( var j = 0 ; j < global.rooms[rm].intel.lab.length ; j++) {
                    if( global.rooms[rm].intel.lab[j].sts == 1 ||
                        global.rooms[rm].intel.lab[j].sts == 2 ||
                        global.rooms[rm].intel.lab[j].sts == 3 ){

                        var lab = Game.getObjectById( global.rooms[rm].intel.lab[j].id )

                        if( lab ){
                            Game.rooms[rm].visual.resource( global.rooms[rm].intel.lab[j].min, lab.pos.x , lab.pos.y)
                        }
                    }
                }
            }

            


            // storage
            if( Game.rooms[rm].storage ){
                Game.rooms[rm].visual.text(  Math.round(Game.rooms[rm].storage.store['energy']/1000),  Game.rooms[rm].storage.pos.x , Game.rooms[rm].storage.pos.y +1 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 4} )
            }
        
            // terminal
            if( Game.rooms[rm].terminal ){
                Game.rooms[rm].visual.text(  Math.round(Game.rooms[rm].terminal.store['energy']/1000),  Game.rooms[rm].terminal.pos.x , Game.rooms[rm].terminal.pos.y + 1 , {stroke: 'white', strokeWidth: .2, color: 'black', fontSize: 4} )
            }
        
            // utilization
            if( Game.rooms[rm].memory.spawn_usage_s ){
                Game.rooms[rm].visual.text(  Math.round(Game.rooms[rm].memory.spawn_usage_s) ,  Game.rooms[rm].memory.base_x , Game.rooms[rm].memory.base_y + 2 , {stroke: 'white', strokeWidth: .2, color: 'red', fontSize: 4} )
            }
        
            // spawing
            if( Game.rooms[rm].memory.intel.spawn ){
                Game.rooms[rm].visual.text(  Game.rooms[rm].memory.phase ,  Game.rooms[rm].memory.base_x , Game.rooms[rm].memory.base_y - 3 , {stroke: 'white', strokeWidth: .2, color: 'red', fontSize: 4} )
            }
        
            if( global.RoomVisualData ){
                global.RoomVisualData[rm] = Game.rooms[rm].visual.export();
            }
            else{
                global.RoomVisualData = {}
            }
        }
        else{
            if( global.RoomVisualData && global.RoomVisualData[rm] ){
                Game.rooms[rm].visual.import(global.RoomVisualData[rm]);
            }
        }
        //






    }
};

module.exports = MainVisualRoom;
