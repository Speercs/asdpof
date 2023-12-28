var MainOneTimer = {

    run: function() {

        // room stuff
        for(var name in Game.rooms) {
            var rm = name;
            if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my ) {

                // create memory
                if( !Game.rooms[rm].memory.oneTimer ){
                    Game.rooms[rm].memory.oneTimer = {}
                    Game.rooms[rm].memory.oneTimer.visualPlaner = 0    
                    Game.rooms[rm].memory.oneTimer.plannerReset = 2     
                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2  
                    Game.rooms[rm].memory.oneTimer.build = 2 
                    Game.rooms[rm].memory.oneTimer.repair = 2 
                }   
                if( !global.rooms[rm].oneTimer ){
                    global.rooms[rm].oneTimer = {}
                }
                //

                // level
                var lvl = Game.rooms[rm].controller.level
                if( Game.rooms[rm].memory.mode_defend == 1  ){
                    var lvl = 9
                }   
                //

                // visualize planner
                if( !Game.rooms[rm].memory.oneTimer.visualPlaner == 0  ){
                    if( Game.rooms[rm].memory.oneTimer.visualPlaner > 0 ){
                        Game.rooms[rm].memory.oneTimer.visualPlaner = Game.rooms[rm].memory.oneTimer.visualPlaner - 1
                    }
                    else{
                        Game.rooms[rm].memory.oneTimer.visualPlaner = 0
                    }
                    console.log('VISUAL PLANNER up for:', Game.rooms[rm].memory.oneTimer.visualPlaner + 1 , 'ticks on room: ', rm)
                }
                //

                // planner reseter
                if( !Game.rooms[rm].memory.oneTimer.plannerReset == 0 ){
                    Game.rooms[rm].memory.oneTimer.plannerReset = Game.rooms[rm].memory.oneTimer.plannerReset - 1
                    //console.log("<font color=\"#FFA500\">BASE BUILD RESET ON ROOM: " + rm + "</font>")
                }
                else if( Game.time % Memory.config.freq_base_reset[lvl] == 0 ){
                    Game.rooms[rm].memory.oneTimer.plannerReset = 2
                }
                //

                // construction sites
                if( !Game.rooms[rm].memory.oneTimer.intelConstruction == 0 ){
                    Game.rooms[rm].memory.oneTimer.intelConstruction = Game.rooms[rm].memory.oneTimer.intelConstruction - 1
                    //console.log("<font color=\"#FFFF00\">INTEL CONSTRUCTION UPDATE ON ROOM: " + rm + "</font>")
                }
                else if( Game.time % Memory.config.freq_intel_construction[lvl] == 0 ){
                    Game.rooms[rm].memory.oneTimer.intelConstruction = 2
                }
                //
           
                // build code
                if( !Game.rooms[rm].memory.oneTimer.build == 0 ){
                    Game.rooms[rm].memory.oneTimer.build = Game.rooms[rm].memory.oneTimer.build - 1
                    //console.log("<font color=\"#FFFF00\">BUILD UPDATE ON ROOM: " + rm + "</font>")
                }
                else if( Game.time % Memory.config.freq_base_build[lvl] == 0 ){
                    Game.rooms[rm].memory.oneTimer.build = 2
                }
                //
                
                // run repair code
                if( !Game.rooms[rm].memory.oneTimer.repair == 0 ){                 
                    Game.rooms[rm].memory.oneTimer.repair = Game.rooms[rm].memory.oneTimer.repair - 1
                    //console.log("<font color=\"#FFFF00\">REPAIR UPDATE ON ROOM: " + rm + "</font>")             
                }
                else if( Game.time % Memory.config.freq_intel_repair[lvl] == 0 ){
                    Game.rooms[rm].memory.oneTimer.repair = 2
                }
                //
            }
        }

        // start memory
        if( !Memory.oneTimer ){
            Memory.oneTimer = {}
        }

        // room and map visuals 
        if( !(Memory.oneTimer.visuals >= 0 )  ){
            Memory.oneTimer.visuals = 2
        }
        //

        // LAB
        if( !(Memory.oneTimer.lab >= 0) || Memory.oneTimer.lab > 0 ){
            Memory.oneTimer.lab = 0
            console.log("<font color=\"#FFFF00\">LAB UPDATE</font>")
        }
        //   
        
        // stronghold
        if( !(Memory.oneTimer.stronghold >= 0 )  ){
            Memory.oneTimer.stronghold = 1
        }
        //
        
        // storage_loot
        if( !(Memory.oneTimer.storage_loot >= 0 )  ){
            Memory.oneTimer.storage_loot = 1
        }
        //
        
        // // harasser
        // if( !(Memory.one_timer.harasser >= 0 )  ){
        //     Memory.one_timer.harasser = 1
        // }
        // //
        //
        // power_banks
        if( !(Memory.oneTimer.power_banks >= 0 )  ){
            Memory.oneTimer.power_banks = 0
        }
        //
        
        // deposits
        if( !(Memory.oneTimer.deposits >= 0 )  ){
            Memory.oneTimer.deposits = 1
        }
        //
        
        // expansion
        if( !(Memory.oneTimer.expansion >= 0 )  ){
            Memory.oneTimer.expansion = 1
        }
        //
        
        // report minerals
        if( !(Memory.oneTimer.reportMinerals >= 0 )  ){
            Memory.oneTimer.reportMinerals = 20
        }
        //
        
        // factory
        if( !(Memory.oneTimer.factory >= 0 )  ){
            Memory.oneTimer.factory = 0
        }
        //

        // SK mining
        if( !(Memory.oneTimer.sk_mining >= 0 )  ){
            Memory.oneTimer.sk_mining = 1
        }
        //
        
        // auto_attack
        if( !(Memory.oneTimer.auto_attack >= 0 )  ){
            Memory.oneTimer.auto_attack = 1
        }
        //
    }
};

module.exports = MainOneTimer;
