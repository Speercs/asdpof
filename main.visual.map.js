var visualMap= {

    run: function(  ) {

        if( Game.time % 67 == 1 || !global.MapVisualData ){

            // // remotes
            // for(var name in Game.rooms) {
            //     rm = name;
            //     if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my ){

            //         // outpost
            //         if( Game.rooms[rm].memory.outpostOrder ){
            //             pos1 = new RoomPosition(Game.rooms[rm].memory.base_x, Game.rooms[rm].memory.base_y, rm);

            //             for ( var i = 0 ; i < Game.rooms[rm].memory.outpostOrder.length ; i++){

            //                 if( Game.rooms[rm].memory.outpostOrder[i].distance <= Memory.config.outpost_max_dist && Game.rooms[rm].memory.outpostOrder[i].distance > 0 ){

            //                     pos2 = new RoomPosition(Game.rooms[rm].memory.outpostOrder[i].sources_x, Game.rooms[rm].memory.outpostOrder[i].sources_y, Game.rooms[rm].memory.outpostOrder[i].rm );
            //                     Game.map.visual.line(pos1, pos2,{color: '#D8CF15', lineStyle: 'dashed', width: 1 });
            //                 }
            //             }
            //         }
            //     }
            // }
            // //

            // rooms exclusions
            for ( var i = 0 ; i < Memory.avoidRooms_tmp.length ; i++){
                Game.map.visual.rect(new RoomPosition(0, 0, Memory.avoidRooms_tmp[i]), 49, 49,{ fill: '#DAF7A6', stroke: '#DAF7A6', opacity:0.3 });
            }
            //


            // attack list
            if( Memory.attack_list ){
                for ( var i = 0 ; i < Memory.attack_list.length ; i++){

                    if( Game.rooms[Memory.attack_list[i].rm] && Game.rooms[Memory.attack_list[i].rm].memory && Game.rooms[Memory.attack_list[i].rm].memory.lab_boost == 'boost3'){

                        pos1 = new RoomPosition(24, 24, Memory.attack_list[i].rm);
                        pos2 = new RoomPosition(24, 24, Memory.attack_list[i].rm_sct);
                        var line_width = 0.5
                        if( Memory.attack_list[i].attack_level > 0 ){
                            var line_width = 1.5
                        }

                        Game.map.visual.line(pos1, pos2,{color: '#ff0096', lineStyle: 'dashed', width: line_width });

                        Game.map.visual.text("Update: " + (Game.time - Memory.attack_list[i].detection_tick), new RoomPosition(0,3,Memory.attack_list[i].rm_sct), {color: '#eeeeee', fontSize: 6, align: 'left'});
                        Game.map.visual.text("Level:  " + (Memory.attack_list[i].controller_lvl), new RoomPosition(0,3 + 7 * 1,Memory.attack_list[i].rm_sct), {color: '#eeeeee', fontSize: 6, align: 'left'});
                        Game.map.visual.text("Threat: " + (Memory.attack_list[i].threat_lvl), new RoomPosition(0,3 + 7 * 2,Memory.attack_list[i].rm_sct), {color: '#eeeeee', fontSize: 6, align: 'left'});
                        Game.map.visual.text("Wall:   " + (Memory.attack_list[i].wall_hits), new RoomPosition(0,3 + 7 * 3,Memory.attack_list[i].rm_sct), {color: '#eeeeee', fontSize: 6, align: 'left'});
                        Game.map.visual.text("Spawn:  " + (Memory.attack_list[i].count_spawn), new RoomPosition(0,3 + 7 * 4,Memory.attack_list[i].rm_sct), {color: '#eeeeee', fontSize: 6, align: 'left'});
                        Game.map.visual.text("Tower:  " + (Memory.attack_list[i].count_tower), new RoomPosition(0,3 + 7 * 5,Memory.attack_list[i].rm_sct), {color: '#eeeeee', fontSize: 6, align: 'left'});
                        Game.map.visual.text("Attack: " + (Memory.attack_list[i].attack_level), new RoomPosition(0,3 + 7 * 6,Memory.attack_list[i].rm_sct), {color: '#eeeeee', fontSize: 6, align: 'left'});

                    }
                }
            }
            else{
                Memory.attack_list = []
            }

            // expansion
            if( Memory.oneTimer.expansion == 1 && Memory.expansion && Memory.expansion.map ){
                for ( var j = 0 ; j < Memory.expansion.map.length; j++){
                    if( Memory.expansion.map[j] && Memory.expansion.map[j].available && Memory.expansion.map[j].available == 1 ){
                        Game.map.visual.text("🚩" + Memory.expansion.map[j].roomDistance, new RoomPosition(42,42,Memory.expansion.map[j].rm_tgt), {color: '#FF0000', fontSize: 11});
                    }
                }

                if( Memory.expansion.task && Memory.expansion.task.timer && Memory.expansion.task.timer > 0 ){
                    Game.map.visual.text(Memory.expansion.task.timer, new RoomPosition(32,6,Memory.expansion.task.rm_tgt), {color: '#9d32a8', fontSize: 11});

                    pos1 = new RoomPosition(24, 24, Memory.expansion.task.rm);
                    pos2 = new RoomPosition(24, 24, Memory.expansion.task.rm_tgt);
                    Game.map.visual.line(pos1, pos2,{color: '#9d32a8', lineStyle: 'dashed', width: 2 });
                }
            }
            //

            // storage_loot
            if( Memory.oneTimer.storage_loot == 1 && Memory.storage_list ){
                for ( var id in Memory.storage_list ){
                    Game.map.visual.text("💰", new RoomPosition(42,42,Memory.storage_list[id].rm_sct ), {color: '#FF0000', fontSize: 11});
                }
            }
            //

            // stronghold
            if( Memory.oneTimer.stronghold == 1 && Memory.strongholds ){
                for ( var id in Memory.strongholds ){
                    Game.map.visual.text("🏰", new RoomPosition(28,42,Memory.strongholds[id].rm_tgt ), {color: '#FF0000', fontSize: 11});
                }
            }
            //

            // depositsBank
            if( Memory.oneTimer.deposits == 1 && Memory.depositsBank ){
                for ( var id in Memory.depositsBank){
                    Game.map.visual.text("🟣", new RoomPosition(42,42,Memory.depositsBank[id].rm_tgt ), {color: '#FF0000', fontSize: 8});
                }
            }
            //

            // power_banks
            if( Memory.oneTimer.power_banks == 1 && Memory.powerBanks ){
                for ( var id in Memory.powerBanks ){
                    Game.map.visual.text("🔴", new RoomPosition(28,42,Memory.powerBanks[id].rm_tgt ), {color: '#FF0000', fontSize: 8});
                }
            }
            //

            // Memory.MapVisualData = Game.map.visual.export();
            global.MapVisualData = Game.map.visual.export();
        }
        else{
            // Game.map.visual.import(Memory.MapVisualData);
            Game.map.visual.import(global.MapVisualData);
        }


    }
};

module.exports = visualMap;
