var BaseBuildPlanner = {

    run: function(rm ) {

        // main planner
        if( 1==1 ){

            // check if stamp exists
            var check = 0
            // half filer 1
            if( Game.rooms[rm].memory.base_x && Game.rooms[rm].memory.base_y ){
                var check = check + 1
            }

            // half filer 1
            if( Game.rooms[rm].memory.h1_x && Game.rooms[rm].memory.h1_y ){
                var check = check + 1
            }

            // half filer 2
            if( Game.rooms[rm].memory.h2_x && Game.rooms[rm].memory.h2_y ){
                var check = check + 1
            }

            if( check != 3 ){
                Game.rooms[rm].memory.flagPlacer = 0
                console.log("<font color=\"#FF0000\">Reseting stamp on room: " + rm + "!!!!</font>")
            }
            //


            // reset planner -- [ xx, yy, building_type, phase, energy_av, extra_comments]
            Game.rooms[rm].memory.planner = []

            var terrain = Game.rooms[rm].getTerrain()

            // priority
            // 1 - spawn - extension
            // 2 - tower
            // 3 - link - container
            // 4 - storage - terminal
            // 5 - lab
            // 6 - others high
            // 7 - others mid
            // 8 - others low
            // 10 - roads

            // MAIN BASE

            // spawn
            if( Game.rooms[rm].memory.h1_type == 'v' ){
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 1 , Game.rooms[rm].memory.h1_y + 0 , 'spawn', 1, 0, '',0]
            }
            else{
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 0 , Game.rooms[rm].memory.h1_y + 1 , 'spawn', 1, 0, '',0]
            }

            if( Game.rooms[rm].memory.h2_type == 'v' ){
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 1 , Game.rooms[rm].memory.h2_y + 0 , 'spawn', 24, 4300,'',1]
            }
            else{
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 0 , Game.rooms[rm].memory.h2_y + 1 , 'spawn', 24, 4300,'',1]
            }

            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 2 , Game.rooms[rm].memory.base_y + 1 , 'spawn', 32, 10600,    '',2]

            // tower
            // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y - 0 , 'tower', 6,  800   ,'',0] - twr moved to extension area in current layout
            // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y - 2 , 'tower', 13, 1800  ,'',1] - twr moved to extension area in current layout
            // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 2 , Game.rooms[rm].memory.base_y - 2 , 'tower', 25, 4300  ,'',2] - twr moved to extension area in current layout
            // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y - 0 , 'tower', 33, 10900 ,'',3] - twr moved to extension area in current layout
            // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y - 2 , 'tower', 34, 10900 ,'',4] - twr moved to extension area in current layout
            // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 0 , Game.rooms[rm].memory.base_y - 1 , 'tower', 35, 10900 ,'',5] - twr moved to extension area in current layout

            // storage - terminal - link - nuker - powerSpawn - factory
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 2 , Game.rooms[rm].memory.base_y + 2 , 'storage',7, 1300]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 2 , Game.rooms[rm].memory.base_y + 0 , 'link',  12, 1800, '' ,1]      // base
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 0 , Game.rooms[rm].memory.base_y + 0 , 'terminal',17,2300]

            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x  , Game.rooms[rm].memory.h1_y  , 'link',  25.5, 4300, '' ,3]      // half1
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x  , Game.rooms[rm].memory.h2_y  , 'link',  35.5,10900, '' ,4]      // half2

            // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 2 , Game.rooms[rm].memory.base_y - 1 , 'nuker',   41, 12900] - nuker moved to extension area in current layout
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 1 , Game.rooms[rm].memory.base_y + 2 , 'powerSpawn',42, 12900]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 1 , Game.rooms[rm].memory.base_y + 0 , 'factory', 43, 12900]

            // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 0 , Game.rooms[rm].memory.base_y - 2 , 'container',14,1800,'',3] //  not needed in current layout

            // observer
            // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.extra_x + 1 , Game.rooms[rm].memory.extra_y + 0 , 'observer',40, 12900] - observer moved to extension area in current layout


            // road stamp around base
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 3 , Game.rooms[rm].memory.base_y - 2 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 3 , Game.rooms[rm].memory.base_y - 1 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 3 , Game.rooms[rm].memory.base_y + 0 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 3 , Game.rooms[rm].memory.base_y + 1 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 3 , Game.rooms[rm].memory.base_y + 2 , 'road', 10.6, 1800]

            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 2 , Game.rooms[rm].memory.base_y + 3 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y + 3 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 0 , Game.rooms[rm].memory.base_y + 2 , 'road', 10.6, 1800] 
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 2 , Game.rooms[rm].memory.base_y - 3 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y - 3 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 0 , Game.rooms[rm].memory.base_y - 2 , 'road', 10.6, 1800] 
            
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 1 , Game.rooms[rm].memory.base_y - 1 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 2 , Game.rooms[rm].memory.base_y - 1 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 3 , Game.rooms[rm].memory.base_y + 0 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 3 , Game.rooms[rm].memory.base_y + 1 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 3 , Game.rooms[rm].memory.base_y + 2 , 'road', 10.6, 1800]

            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 3 , Game.rooms[rm].memory.base_y + 3 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 2 , Game.rooms[rm].memory.base_y + 3 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 1 , Game.rooms[rm].memory.base_y + 3 , 'road', 10.6, 1800]

            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 1 , Game.rooms[rm].memory.base_y + 1 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y + 1 , 'road', 10.6, 1800]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y - 1 , 'road', 10.6, 1800]

            // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y + 1 , 'road', 10.6, 1800]
            // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y - 1 , 'road', 10.6, 1800]
            // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x + 1 , Game.rooms[rm].memory.base_y + 1 , 'road', 10.6, 1800]
           
            // LAB CORE

            // labs 
            //    8 9 - -
            //    4 - 5 -
            //    0 3 T -
            //    2 - 1 -
            //    6 7 - -

            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 2 , Game.rooms[rm].memory.base_y - 0 , 'lab', 23.7, 2300,'',0]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 0 , Game.rooms[rm].memory.base_y + 1 , 'lab', 23.8, 2300,'',1]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 2 , Game.rooms[rm].memory.base_y + 1 , 'lab', 23.9, 2300,'',2]
        
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y - 0 , 'lab', 29, 5600,'',3]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 2 , Game.rooms[rm].memory.base_y - 1 , 'lab', 30, 5600,'',4]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 0 , Game.rooms[rm].memory.base_y - 1 , 'lab', 31, 5600,'',5]

            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 2 , Game.rooms[rm].memory.base_y + 2 , 'lab', 36, 12900,'',6]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y + 2 , 'lab', 37, 12900,'',7]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 2 , Game.rooms[rm].memory.base_y - 2 , 'lab', 38, 12900,'',8]
            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 1 , Game.rooms[rm].memory.base_y - 2 , 'lab', 39, 12900,'',9]


            // half filler 1 extension stamp lvl 2 and 3
            if( Game.rooms[rm].memory.h1_type == 'v' ){
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 1 , Game.rooms[rm].memory.h1_y - 1 , 'extension', 0, 2, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 1 , Game.rooms[rm].memory.h1_y - 2 , 'extension', 0, 2, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 0 , Game.rooms[rm].memory.h1_y - 2 , 'extension', 0, 2, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 1 , Game.rooms[rm].memory.h1_y - 2 , 'extension', 0, 3, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 1 , Game.rooms[rm].memory.h1_y - 1 , 'extension', 0, 3, 0]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 1 , Game.rooms[rm].memory.h1_y + 1 , 'extension', 0, 2, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 1 , Game.rooms[rm].memory.h1_y + 2 , 'extension', 0, 2, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 0 , Game.rooms[rm].memory.h1_y + 2 , 'extension', 0, 3, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 1 , Game.rooms[rm].memory.h1_y + 2 , 'extension', 0, 3, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 1 , Game.rooms[rm].memory.h1_y + 1 , 'extension', 0, 3, 0]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 1 , Game.rooms[rm].memory.h1_y - 0 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 0 , Game.rooms[rm].memory.h1_y - 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 0 , Game.rooms[rm].memory.h1_y + 1 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 2 , Game.rooms[rm].memory.h1_y - 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 2 , Game.rooms[rm].memory.h1_y - 1 , 'road', 10.1, 1800]
                //Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 2 , Game.rooms[rm].memory.h1_y - 0 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 2 , Game.rooms[rm].memory.h1_y + 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 2 , Game.rooms[rm].memory.h1_y + 2 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 2 , Game.rooms[rm].memory.h1_y - 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 2 , Game.rooms[rm].memory.h1_y - 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 2 , Game.rooms[rm].memory.h1_y - 0 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 2 , Game.rooms[rm].memory.h1_y + 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 2 , Game.rooms[rm].memory.h1_y + 2 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 1 , Game.rooms[rm].memory.h1_y - 3 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 0 , Game.rooms[rm].memory.h1_y - 3 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 1 , Game.rooms[rm].memory.h1_y - 3 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 1 , Game.rooms[rm].memory.h1_y + 3 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 0 , Game.rooms[rm].memory.h1_y + 3 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 1 , Game.rooms[rm].memory.h1_y + 3 , 'road', 10.1, 1800]
            }
            else{
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 1 , Game.rooms[rm].memory.h1_y - 1 , 'extension', 0, 2, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 2 , Game.rooms[rm].memory.h1_y - 1 , 'extension', 0, 2, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 2 , Game.rooms[rm].memory.h1_y - 0 , 'extension', 0, 2, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 2 , Game.rooms[rm].memory.h1_y + 1 , 'extension', 0, 3, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 1 , Game.rooms[rm].memory.h1_y + 1 , 'extension', 0, 3, 0]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 1 , Game.rooms[rm].memory.h1_y - 1 , 'extension', 0, 3, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 2 , Game.rooms[rm].memory.h1_y - 1 , 'extension', 0, 3, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 2 , Game.rooms[rm].memory.h1_y - 0 , 'extension', 0, 3, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 2 , Game.rooms[rm].memory.h1_y + 1 , 'extension', 0, 2, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 1 , Game.rooms[rm].memory.h1_y + 1 , 'extension', 0, 2, 0]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 0 , Game.rooms[rm].memory.h1_y - 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 1 , Game.rooms[rm].memory.h1_y - 0 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 1 , Game.rooms[rm].memory.h1_y - 0 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 2 , Game.rooms[rm].memory.h1_y - 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 1 , Game.rooms[rm].memory.h1_y - 2 , 'road', 10.1, 1800]
                //Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 0 , Game.rooms[rm].memory.h1_y - 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 1 , Game.rooms[rm].memory.h1_y - 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 2 , Game.rooms[rm].memory.h1_y - 2 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 2 , Game.rooms[rm].memory.h1_y + 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 1 , Game.rooms[rm].memory.h1_y + 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 0 , Game.rooms[rm].memory.h1_y + 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 1 , Game.rooms[rm].memory.h1_y + 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 2 , Game.rooms[rm].memory.h1_y + 2 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 3 , Game.rooms[rm].memory.h1_y - 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 3 , Game.rooms[rm].memory.h1_y - 0 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x - 3 , Game.rooms[rm].memory.h1_y + 1 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 3 , Game.rooms[rm].memory.h1_y - 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 3 , Game.rooms[rm].memory.h1_y - 0 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x + 3 , Game.rooms[rm].memory.h1_y + 1 , 'road', 10.1, 1800]
            }

            // half filler 1 extension stamp lvl 8
            if( Game.rooms[rm].memory.h2_type == 'v' ){
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 1 , Game.rooms[rm].memory.h2_y - 1 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 1 , Game.rooms[rm].memory.h2_y - 2 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 0 , Game.rooms[rm].memory.h2_y - 2 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 1 , Game.rooms[rm].memory.h2_y - 2 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 1 , Game.rooms[rm].memory.h2_y - 1 , 'extension', 0, 4, 0]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 1 , Game.rooms[rm].memory.h2_y + 1 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 1 , Game.rooms[rm].memory.h2_y + 2 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 0 , Game.rooms[rm].memory.h2_y + 2 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 1 , Game.rooms[rm].memory.h2_y + 2 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 1 , Game.rooms[rm].memory.h2_y + 1 , 'extension', 0, 4, 0]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 1 , Game.rooms[rm].memory.h2_y - 0 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 0 , Game.rooms[rm].memory.h2_y - 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 0 , Game.rooms[rm].memory.h2_y + 1 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 2 , Game.rooms[rm].memory.h2_y - 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 2 , Game.rooms[rm].memory.h2_y - 1 , 'road', 10.1, 1800]
                //Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 2 , Game.rooms[rm].memory.h2_y - 0 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 2 , Game.rooms[rm].memory.h2_y + 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 2 , Game.rooms[rm].memory.h2_y + 2 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 2 , Game.rooms[rm].memory.h2_y - 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 2 , Game.rooms[rm].memory.h2_y - 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 2 , Game.rooms[rm].memory.h2_y - 0 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 2 , Game.rooms[rm].memory.h2_y + 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 2 , Game.rooms[rm].memory.h2_y + 2 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 1 , Game.rooms[rm].memory.h2_y - 3 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 0 , Game.rooms[rm].memory.h2_y - 3 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 1 , Game.rooms[rm].memory.h2_y - 3 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 1 , Game.rooms[rm].memory.h2_y + 3 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 0 , Game.rooms[rm].memory.h2_y + 3 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 1 , Game.rooms[rm].memory.h2_y + 3 , 'road', 10.1, 1800]

            }
            else{
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 1 , Game.rooms[rm].memory.h2_y - 1 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 2 , Game.rooms[rm].memory.h2_y - 1 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 2 , Game.rooms[rm].memory.h2_y - 0 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 2 , Game.rooms[rm].memory.h2_y + 1 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 1 , Game.rooms[rm].memory.h2_y + 1 , 'extension', 0, 4, 0]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 1 , Game.rooms[rm].memory.h2_y - 1 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 2 , Game.rooms[rm].memory.h2_y - 1 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 2 , Game.rooms[rm].memory.h2_y - 0 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 2 , Game.rooms[rm].memory.h2_y + 1 , 'extension', 0, 4, 0]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 1 , Game.rooms[rm].memory.h2_y + 1 , 'extension', 0, 4, 0]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 0 , Game.rooms[rm].memory.h2_y - 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 1 , Game.rooms[rm].memory.h2_y - 0 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 1 , Game.rooms[rm].memory.h2_y - 0 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 2 , Game.rooms[rm].memory.h2_y - 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 1 , Game.rooms[rm].memory.h2_y - 2 , 'road', 10.1, 1800]
                //Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 0 , Game.rooms[rm].memory.h2_y - 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 1 , Game.rooms[rm].memory.h2_y - 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 2 , Game.rooms[rm].memory.h2_y - 2 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 2 , Game.rooms[rm].memory.h2_y + 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 1 , Game.rooms[rm].memory.h2_y + 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 0 , Game.rooms[rm].memory.h2_y + 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 1 , Game.rooms[rm].memory.h2_y + 2 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 2 , Game.rooms[rm].memory.h2_y + 2 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 3 , Game.rooms[rm].memory.h2_y - 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 3 , Game.rooms[rm].memory.h2_y - 0 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x - 3 , Game.rooms[rm].memory.h2_y + 1 , 'road', 10.1, 1800]

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 3 , Game.rooms[rm].memory.h2_y - 1 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 3 , Game.rooms[rm].memory.h2_y - 0 , 'road', 10.1, 1800]
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x + 3 , Game.rooms[rm].memory.h2_y + 1 , 'road', 10.1, 1800]

            }


            // road flags
            for ( f1 in Game.flags ) {
                if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 10 ){
                    Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.flags[f1].pos.x , Game.flags[f1].pos.y , 'road', 18, 2300]
                }
            }
            //


            // create cost matrix for the containers
            var costs_container = new PathFinder.CostMatrix;

            Game.rooms[rm].find(FIND_STRUCTURES).forEach(function(struct) {
              if (struct.structureType == STRUCTURE_CONTAINER ) {
                costs_container.set(struct.pos.x, struct.pos.y, 1);
              }
              else if (struct.structureType == STRUCTURE_ROAD ) {
                costs_container.set(struct.pos.x, struct.pos.y, 2);
              }
              else if ( struct.structureType !== STRUCTURE_CONTAINER &&
                       (struct.structureType !== STRUCTURE_RAMPART || !struct.my)) {
                // Can't walk through non-walkable buildings
                costs_container.set(struct.pos.x, struct.pos.y, 0xff);
              }
            });

              for ( var iii = 0 ; iii < Game.rooms[rm].memory.planner.length ; iii++){
                  if( Game.rooms[rm].memory.planner[iii][2] != 'road' && Game.rooms[rm].memory.planner[iii][2] != 'container'  ){
                      costs_container.set(Game.rooms[rm].memory.planner[iii][0], Game.rooms[rm].memory.planner[iii][1], 0xff);
                  }
              }

              for (let y = 0; y < 50; y++) {
                  for (let x = 0; x < 50; x++) {
                      if( x == 0 || x == 49 || y == 0 || y == 49 ){
                          costs_container.set(x, y, 255);
                      }
                      else if ( ( x == 1 || x == 48 || y == 1 || y == 48 ) && terrain.get(x, y) != 1 ){
                          costs_container.set(x, y, 150);
                      }
                      else if ( ( x == 2 || x == 47 || y == 2 || y == 47 ) && terrain.get(x, y) != 1 ){
                          costs_container.set(x, y, 100);
                      }
                  }
              }




            //


            // container source0
            if( Memory.rooms[rm].intel && Memory.rooms[rm].intel.sources && Memory.rooms[rm].intel.sources[0] && Memory.rooms[rm].intel.sources[0].id ){

                var x1 = Game.getObjectById( Memory.rooms[rm].intel.sources[0].id ).pos.x
                var y1 = Game.getObjectById( Memory.rooms[rm].intel.sources[0].id ).pos.y

                for (let y = -1; y <= 1; y++) {
                    for (let x = -1; x <= 1; x++) {
                        if( x == 0 && y == 0 ){
                            //
                        }
                        else if ( terrain.get(x1+x, y1+y) != 1 ){
                            costs_container.set(x1+x, y1+y, costs_container.get(x1+x, y1+y) + 25 );
                        }
                    }
                }

                for (let y = -1; y <= 1; y++) {
                    for (let x = -1; x <= 1; x++) {
                        if( x == 0 && y == 0 ){
                            //
                        }
                        else if ( terrain.get(x1+x, y1+y) == 1 ){
                            for (let yy = -1; yy <= 1; yy++) {
                                for (let xx = -1; xx <= 1; xx++) {
                                    if ( terrain.get(x1+x+xx,  y1+y+yy) != 1 ){
                                        costs_container.set(x1+x+xx, y1+y+yy, costs_container.get(x1+x+xx, y1+y+yy) - 5 );
                                    }
                                }
                            }
                        }
                    }
                }

                var start = Game.getObjectById( Memory.rooms[rm].intel.sources[0].id )
                var end = new RoomPosition(Game.rooms[ rm ].memory.base_x, Game.rooms[ rm ].memory.base_y, rm)

                var build_path = PathFinder.search(start.pos, [{pos: end , range:2}], {plainCost: 19,swampCost: 20, roomCallback: function(roomName) { return costs_container; },} ).path

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [build_path[0].x , build_path[0].y , 'container', 3.1, 550, 'container_source0', 0] // source0
                // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [build_path[1].x , build_path[1].y , 'road',      3, 550]
            }
            //

            // container source1
            if( Memory.rooms[rm].intel && Memory.rooms[rm].intel.sources && Memory.rooms[rm].intel.sources[1] && Memory.rooms[rm].intel.sources[1].id ){

                var x1 = Game.getObjectById( Memory.rooms[rm].intel.sources[1].id ).pos.x
                var y1 = Game.getObjectById( Memory.rooms[rm].intel.sources[1].id ).pos.y

                for (let y = -1; y <= 1; y++) {
                    for (let x = -1; x <= 1; x++) {
                        if( x == 0 && y == 0 ){
                            //
                        }
                        else if ( terrain.get(x1+x, y1+y) != 1 ){
                            costs_container.set(x1+x, y1+y, costs_container.get(x1+x, y1+y) + 25 );
                        }
                    }
                }

                for (let y = -1; y <= 1; y++) {
                    for (let x = -1; x <= 1; x++) {
                        if( x == 0 && y == 0 ){
                            //
                        }
                        else if ( terrain.get(x1+x, y1+y) == 1 ){
                            for (let yy = -1; yy <= 1; yy++) {
                                for (let xx = -1; xx <= 1; xx++) {
                                    if ( terrain.get(x1+x+xx,  y1+y+yy) != 1 ){
                                        costs_container.set(x1+x+xx, y1+y+yy, costs_container.get(x1+x+xx, y1+y+yy) + 5 );
                                    }
                                }
                            }
                        }
                    }
                }

                var start = Game.getObjectById( Memory.rooms[rm].intel.sources[1].id )
                var end = new RoomPosition(Game.rooms[ rm ].memory.base_x, Game.rooms[ rm ].memory.base_y, rm)

                var build_path = PathFinder.search(start.pos, [{pos: end , range:2}], {plainCost: 19,swampCost: 20, roomCallback: function(roomName) { return costs_container; },} ).path

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [build_path[0].x , build_path[0].y , 'container', 3.2, 550, 'container_source1', 1] // source1
                // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [build_path[1].x , build_path[1].y , 'road',      4, 550]
            }
            //



            // container half 1 and 2
            if( Game.rooms[rm].memory.h1_type == 'v' ){
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x-1, Game.rooms[rm].memory.h1_y , 'container', 3, 350, 'container_h1', 2] // controller
            }
            else{
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h1_x, Game.rooms[rm].memory.h1_y-1, 'container', 3, 350, 'container_h1', 2] // controller
            }

            if( Game.rooms[rm].memory.h2_type == 'v' ){
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x-1, Game.rooms[rm].memory.h2_y , 'container', 6.2, 850, 'container_h2', 3] // controller
            }
            else{
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.h2_x, Game.rooms[rm].memory.h2_y-1, 'container', 6.2, 850, 'container_h2', 3] // controller
            }


            // container mineral and extractor
            if( Memory.rooms[rm].intel && Memory.rooms[rm].intel.minerals && Memory.rooms[rm].intel.minerals[0] && Memory.rooms[rm].intel.minerals[0].id ){

                var start = Game.getObjectById( Memory.rooms[rm].intel.minerals[0].id )
                var end = new RoomPosition(Game.rooms[ rm ].memory.base_x, Game.rooms[ rm ].memory.base_y, rm)

                var build_path = PathFinder.search(start.pos, [{pos: end , range:1}], {plainCost: 19,swampCost: 20, roomCallback: function(roomName) { return costs_container; },} ).path

                // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [build_path[0].x , build_path[0].y , 'container', 19, 2300,'',2] // mineral
                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [start.pos.x , start.pos.y , 'extractor',         21, 2300]
            }
            //


            // container controller
            if( Game.rooms[rm].controller ){

                // modifi cost matrix to not build close to walls
                for (let y = 1; y <= 49; y++) {
                    for (let x = 1; x <= 49; x++) {
                        if( terrain.get(x, y) == 1  ){
                            for (let yy = -1; yy <= 1; yy++) {
                                for (let xx = -1; xx <= 1; xx++) {
                                    if( yy == 0 && xx ==0){
                                      //
                                    }
                                    else if( terrain.get(x+xx, y+yy) != 1 && costs_container.get(x+xx, y+yy) < 200 ){
                                        costs_container.set(x+xx, y+yy, 200)
                                    }
                                }
                            }
                        }
                    }
                }
                //

                var start = new RoomPosition(Game.rooms[ rm ].memory.base_x+2, Game.rooms[ rm ].memory.base_y+2, rm)
                var end = Game.rooms[rm].controller

                var build_path = PathFinder.search(start, [{pos: end.pos , range:1}], {plainCost: 19,swampCost: 20, roomCallback: function(roomName) { return costs_container; },} ).path

                Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [build_path[build_path.length-2].x , build_path[build_path.length-2].y , 'container', 4, 550, 'container_controller', 4] // controller

                // plus around controller
                var road_matrix = [
                                    [1,0],[0,1],[-1,0],[0,-1]
                                  ]

                for ( var i = 0 ; i < road_matrix.length ; i++){

                    var xx = build_path[build_path.length-2].x + road_matrix[i][0]
                    var yy = build_path[build_path.length-2].y + road_matrix[i][1]

                    var terraintype = terrain.get(xx, yy)

                    if( terraintype != 1 ){

                        var pos_ok = 1

                        for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                            if( Game.rooms[rm].memory.planner[k][0] == xx &&
                                Game.rooms[rm].memory.planner[k][1] == yy ){
                                  // posiçõa ocupada
                                  var pos_ok = 0
                                  break
                            }
                        }
                        if ( pos_ok == 1 ){
                            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road',5.4, 550, 'road_controller']
                        }
                    }
                }
                //

            }
            //


            // link containers - precisa ficar depois de adicionar os containers e antes dos roads e extensions
            for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){

                if( Game.rooms[rm].memory.planner[i][5] == 'container_source0' ||
                    Game.rooms[rm].memory.planner[i][5] == 'container_source1' ){

                    var path_to_road = [[ 1, 1], [ 0, 1], [-1, 1], [ 1, 0], [-1, 0], [ 1,-1], [ 0,-1], [-1,-1]]

                    outer_loop:
                    for ( var j = 0 ; j < path_to_road.length ; j++){

                        var xx = path_to_road[j][0] + Game.rooms[rm].memory.planner[i][0]
                        var yy = path_to_road[j][1] + Game.rooms[rm].memory.planner[i][1]

                        var terraintype = terrain.get(xx, yy)

                        if( terraintype != 1 && xx > 1 && yy > 1 && xx < 48 && yy < 48 ){

                            if( terrain.get(xx+1, yy) == 1 && terrain.get(xx-1, yy) == 1 ){
                                // bloqueia passagem
                            }
                            else if( terrain.get(xx, yy+1) == 1 && terrain.get(xx, yy-1) == 1 ){
                                // bloqueia passagem
                            }
                            else{
                                for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                                    if( Game.rooms[rm].memory.planner[k][0] == xx &&
                                        Game.rooms[rm].memory.planner[k][1] == yy ){
                                        // posiçao ocupada
                                    }
                                    else{
                                        if( Game.rooms[rm].memory.planner[i][5] == 'container_source0' ){
                                            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'link', 11, 1800, '', 0] // source0
                                        }
                                        else if( Game.rooms[rm].memory.planner[i][5] == 'container_source1' ){
                                            Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'link', 15, 2300, '', 2] // source1
                                        }

                                        break outer_loop;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // extensions !!!!!!!
            var obj_sc = _.sortBy( Game.rooms[rm].find(FIND_SOURCES) ,  function(o) { return  o.id; });
            var obj_mn = Game.rooms[rm].find(FIND_MINERALS)

            // border costmatric - range3
            var vr = new PathFinder.CostMatrix;

            for (let aa = 0; aa <= 49; aa++) {
                if( terrain.get(aa, 0) != 1 ){
                    vr.set(aa,0,1)
                }
                if( terrain.get(aa, 49) != 1 ){
                    vr.set(aa,49,1)
                }
                if( terrain.get(0, aa) != 1 ){
                    vr.set(0, aa,1)
                }
                if( terrain.get(49, aa) != 1 ){
                    vr.set(49, aa,1)
                }
            }

            // make 5 title from border unavailable
            for (var cnt = 1; cnt <= 4; cnt++) {
              for (let y = 0; y <= 49; y++) {
                for (let x = 0; x <= 49; x++) {
                  if( vr.get(x,y) == cnt ){
                    for (var yy = -1; yy <= 1; yy++) {
                      for (var xx = -1; xx <= 1; xx++) {
                        var xxx = xx + x
                        var yyy = yy + y
                        if( xx == 0 && yy == 0 ){

                        }
                        else if( terrain.get(xxx, yyy) != 1 && vr.get(xxx,yyy) == 0  ){
                          vr.set(xxx,yyy,cnt+1)
                        }
                      }
                    }
                  }
                }
              }
            }

            // floodfill for distance from 
            var v = new PathFinder.CostMatrix;            

            // posição ocupada
            for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                // posiçõa ocupada
                if( Game.rooms[rm].memory.planner[k][2] != 'road' ){
                    v.set(Game.rooms[rm].memory.planner[k][0],Game.rooms[rm].memory.planner[k][1],255)
                }
            }
            //

            // start position 
            v.set(Game.rooms[rm].memory.base_x + 3,Game.rooms[rm].memory.base_y + 1,1)
            v.set(Game.rooms[rm].memory.base_x + 3,Game.rooms[rm].memory.base_y + 2,1)
            v.set(Game.rooms[rm].memory.base_x + 2,Game.rooms[rm].memory.base_y + 3,1)
            v.set(Game.rooms[rm].memory.base_x + 1,Game.rooms[rm].memory.base_y + 3,1)
            v.set(Game.rooms[rm].memory.base_x + 3,Game.rooms[rm].memory.base_y + 3,1)

            
            
            var cnt_ext = 0

            for (var cnt = 1; cnt <= 40; cnt++) {

                if( cnt_ext >= 48 ){
                    break;
                }

                for (let y = 1; y <= 48; y++) {
                    for (let x = 1; x <= 48; x++) {
                        if( v.get(x,y) == cnt ){
                            for (var yy2 = -1; yy2 <= 1; yy2++) {
                                for (var xx2 = -1; xx2 <= 1; xx2++) {
                                    
                                    var xxx = xx2 + x
                                    var yyy = yy2 + y

                                    if( xx2 == 0 && yy2 == 0 ){

                                        // check for placement
                                        if( cnt_ext < 48 ){                                            
                                        
                                            var x_check = xxx
                                            var y_check = yyy

                                            var xxx = x_check % 4
                                            var yyy = y_check % 4 

                                            if( (yyy == 0 && ( xxx == 0 || xxx == 2 ||xxx == 3 ) ) ||
                                                (yyy == 1 && ( xxx == 1 || xxx == 3 ) ) ||
                                                (yyy == 2 && ( xxx == 0 || xxx == 1 ||xxx == 2 ) ) ||
                                                (yyy == 3 && ( xxx == 1 || xxx == 3  ) ) ) {

                                                var xx = x_check
                                                var yy = y_check

                                                var terraintype = terrain.get(xx, yy)

                                                if( terraintype != 1 && vr.get(xx,yy) == 0 && xx <= 48 && xx >= 1 && yy <= 48 && yy >= 1 ){

                                                    var pos_ok = 1

                                                    // posição ocupada
                                                    for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

                                                        if( Game.rooms[rm].memory.planner[k][0] == xx &&
                                                            Game.rooms[rm].memory.planner[k][1] == yy ){
                                                            // posiçõa ocupada
                                                            var pos_ok = 0
                                                            break
                                                        }
                                                    }
                                                    //

                                                    //check for controller in range
                                                    if ( pos_ok == 1 ){
                                                        if( Math.max( Math.abs(xx-Game.rooms[rm].controller.pos.x),Math.abs(yy-Game.rooms[rm].controller.pos.y) ) < 3 ){
                                                            var pos_ok = 0
                                                        }
                                                    }
                                                    //

                                                    //check for source in range
                                                    if ( pos_ok == 1 ){
                                                        for ( var ii = 0; ii < obj_sc.length ; ii++) {
                                                            if( Math.max( Math.abs(xx-obj_sc[ii].pos.x),Math.abs(yy-obj_sc[ii].pos.y) ) <= 2 ){
                                                                var pos_ok = 0
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    //

                                                    //check for mineral in range
                                                    if ( pos_ok == 1 ){
                                                        for ( var ii = 0; ii < obj_mn.length ; ii++) {
                                                            if( Math.max( Math.abs(xx-obj_mn[ii].pos.x),Math.abs(yy-obj_mn[ii].pos.y) ) <= 2 ){
                                                                var pos_ok = 0
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    //

                                                    //check for flag
                                                    if ( pos_ok == 1 ){
                                                        for ( f1 in Game.flags ) {
                                                            if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].pos.x == xx && Game.flags[f1].pos.y == yy ){
                                                                var pos_ok = 0
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    //

                                                    //check for edge cases
                                                    if ( pos_ok == 1 && 1==11 ){
                                                        var pos_orig = new RoomPosition(Game.rooms[rm].memory.base_x, Game.rooms[rm].memory.base_y, rm)
                                                        var pos_prob = new RoomPosition(xx, yy, rm)
                                                        var path_leght = PathFinder.search(pos_orig, pos_prob, {plainCost: 1, swampCost: 1,maxRooms: 1}).path

                                                        if( path_leght && path_leght.length >= pos_orig.getRangeTo(pos_prob) + 5 ){
                                                            var pos_ok = 0
                                                        }
                                                    }
                                                    //

                                                    if ( pos_ok == 1 ){                                                      

                                                        var cnt_ext = cnt_ext + 1 

                                                        if( cnt_ext <= 10 + 6){
                                                        var lvl = 5
                                                        }
                                                        else if( cnt_ext <= 20 + 6 ){
                                                        var lvl = 6
                                                        }
                                                        else if( cnt_ext <= 30 + 6 ){
                                                        var lvl = 7
                                                        }
                                                        else if( cnt_ext <= 40 + 6 ){
                                                        var lvl = 8
                                                        }
                                                        else if( cnt_ext <= 48 ){ // 6 towers, 1 observer, 1 nuker
                                                        var lvl = 9
                                                        }

                                                        var rank = Math.max( Math.abs(xx-Game.rooms[rm].memory.base_x-3),Math.abs(yy-Game.rooms[rm].memory.base_y-1))
                                                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'extension', 0, lvl, cnt] // adding rank here
                                                    }
                                                }
                                            }
                                        }  
                                        else{
                                            break;
                                        }
                                    }
                                    else if( terrain.get(xxx, yyy) != 1 && v.get(xxx,yyy) == 0  ){
                                        v.set(xxx,yyy,cnt+1)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //

            // plot costmatrix
            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                  new RoomVisual(rm).text(v.get(x, y), x, y, {color: 'green', font: 0.5});
                }
            }
            //
      
            // towers and observer on extension positions
            if( 1==1 ){

                var cnt = 0

                for ( var k = Game.rooms[rm].memory.planner.length - 1 ; k >= 0 ; k--){

                    // observer on last extension
                    if( cnt == 0 && Game.rooms[rm].memory.planner[k][2] == 'extension' ){
                        Game.rooms[rm].memory.planner[k][2] = 'observer'
                        Game.rooms[rm].memory.planner[k][3] = 40
                        Game.rooms[rm].memory.planner[k][4] = 12900

                        var cnt = cnt + 1

                        // observer
                        // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.extra_x + 1 , Game.rooms[rm].memory.extra_y + 0 , 'observer',40, 12900] - observer moved to extension area in current layout
                    }

                    // nuker on pen-last extension
                    else if( cnt == 1 && Game.rooms[rm].memory.planner[k][2] == 'extension' ){
                        Game.rooms[rm].memory.planner[k][2] = 'nuker'
                        Game.rooms[rm].memory.planner[k][3] = 41
                        Game.rooms[rm].memory.planner[k][4] = 12900

                        var cnt = cnt + 1

                        // Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [Game.rooms[rm].memory.base_x - 2 , Game.rooms[rm].memory.base_y - 1 , 'nuker',   41, 12900] - nuker moved to extension area in current layout
                    } 


                    // // last link
                    // if( cnt == 2 && Game.rooms[rm].memory.planner[k][2] == 'extension' ){
                    //     Game.rooms[rm].memory.planner[k][2] = 'link'
                    //     Game.rooms[rm].memory.planner[k][3] = 35.6
                    //     Game.rooms[rm].memory.planner[k][4] = 10900
                    //     Game.rooms[rm].memory.planner[k][5] = ''
                    //     Game.rooms[rm].memory.planner[k][6] = 5

                    //     var cnt = cnt + 1
                    // }

                    if( cnt >= 2){
                        break;
                    }
                }
                //

                var cnt = 0

                for ( var k = 0 ; Game.rooms[rm].memory.planner.length ; k++){

                    // tower on central X extension
                    if( Game.rooms[rm].memory.planner[k][2] == 'extension' && Game.rooms[rm].memory.planner[k][4] >= 5 ){
                        if( cnt == 0 ){
                            Game.rooms[rm].memory.planner[k][2] = 'tower'
                            Game.rooms[rm].memory.planner[k][3] = 6
                            Game.rooms[rm].memory.planner[k][4] = 550
                            Game.rooms[rm].memory.planner[k][5] = ''
                            Game.rooms[rm].memory.planner[k][6] = 0
                        }
                        else if( cnt == 1 ){
                            Game.rooms[rm].memory.planner[k][2] = 'tower'
                            Game.rooms[rm].memory.planner[k][3] = 10.9
                            Game.rooms[rm].memory.planner[k][4] = 1800
                            Game.rooms[rm].memory.planner[k][5] = ''
                            Game.rooms[rm].memory.planner[k][6] = 1
                        }
                        else if( cnt == 2 ){
                            Game.rooms[rm].memory.planner[k][2] = 'tower'
                            Game.rooms[rm].memory.planner[k][3] = 25
                            Game.rooms[rm].memory.planner[k][4] = 4300
                            Game.rooms[rm].memory.planner[k][5] = ''
                            Game.rooms[rm].memory.planner[k][6] = 2
                        }
                        else if( cnt == 3 ){
                            Game.rooms[rm].memory.planner[k][2] = 'tower'
                            Game.rooms[rm].memory.planner[k][3] = 33
                            Game.rooms[rm].memory.planner[k][4] = 10900
                            Game.rooms[rm].memory.planner[k][5] = ''
                            Game.rooms[rm].memory.planner[k][6] = 3
                        }
                        else if( cnt == 4 ){
                            Game.rooms[rm].memory.planner[k][2] = 'tower'
                            Game.rooms[rm].memory.planner[k][3] = 34
                            Game.rooms[rm].memory.planner[k][4] = 10900
                            Game.rooms[rm].memory.planner[k][5] = ''
                            Game.rooms[rm].memory.planner[k][6] = 4
                        }
                        else if( cnt == 5 ){
                            Game.rooms[rm].memory.planner[k][2] = 'tower'
                            Game.rooms[rm].memory.planner[k][3] = 35
                            Game.rooms[rm].memory.planner[k][4] = 10900
                            Game.rooms[rm].memory.planner[k][5] = ''
                            Game.rooms[rm].memory.planner[k][6] = 5
                        }

                        var cnt = cnt + 1
                        
                    }

                    if( cnt >= 6){
                        break;
                    }
                }
            }
            //


            //
            // create cost matrix for the road pathing
            var costs_road = new PathFinder.CostMatrix;

            for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){

                var xx = Game.rooms[rm].memory.planner[i][0]
                var yy = Game.rooms[rm].memory.planner[i][1]
                var type = Game.rooms[rm].memory.planner[i][2]

                if( type == 'road' ){
                    costs_road.set(xx, yy, 4);
                }
                else if( type == 'rampart' ){
                    costs_road.set(xx, yy, 7);
                }
                else if( type == 'container' ){
                    costs_road.set(xx, yy, 50);
                }
                else {
                    costs_road.set(xx, yy, 255);
                }
            }

            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    if( x == 0 || x == 49 || y == 0 || y == 49 ){
                        costs_road.set(x, y, 250);
                    }
                    else if ( ( x == 1 || x == 48 || y == 1 || y == 48 ) && terrain.get(x, y) != 1 ){
                        costs_road.set(x, y, 150);
                    }
                    else if ( ( x == 2 || x == 47 || y == 2 || y == 47 ) && terrain.get(x, y) != 1 ){
                        costs_road.set(x, y, 100);
                    }
                }
            }
            //

            //


            // road source0 to half1
            if( Memory.rooms[rm].intel && Memory.rooms[rm].intel.sources && Memory.rooms[rm].intel.sources[0] && Memory.rooms[rm].intel.sources[0].id ){

                // find container
                for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){
                    if( Game.rooms[rm].memory.planner[i][2] == 'container' && Game.rooms[rm].memory.planner[i][6] == 0 ){
                        // var start = Game.getObjectById( Memory.rooms[rm].intel.sources[0].id )
                        var start = new RoomPosition(Game.rooms[rm].memory.planner[i][0],Game.rooms[rm].memory.planner[i][1], rm)
                        break;
                    }
                }

                var end = new RoomPosition(Game.rooms[ rm ].memory.h1_x, Game.rooms[ rm ].memory.h1_y, rm)

                var build_path = PathFinder.search(start, [{pos: end , range:1}], {plainCost:19,swampCost: 20, roomCallback: function(roomName) { return costs_road; }, } ).path

                for ( var i = 0 ; i < build_path.length ; i++){

                    var xx = build_path[i].x
                    var yy = build_path[i].y

                    if( costs_road.get(xx, yy) != 5 ) {
                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 5.1, 550, 'road_source0']
                        costs_road.set(xx, yy, 5);
                    }
                }
            }
            //


            // road source1 to half1
            if( Memory.rooms[rm].intel && Memory.rooms[rm].intel.sources && Memory.rooms[rm].intel.sources[1] && Memory.rooms[rm].intel.sources[1].id ){

                // find container
                for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){
                    if( Game.rooms[rm].memory.planner[i][2] == 'container' && Game.rooms[rm].memory.planner[i][6] == 1 ){
                        // var start = Game.getObjectById( Memory.rooms[rm].intel.sources[1].id )
                        var start = new RoomPosition(Game.rooms[rm].memory.planner[i][0],Game.rooms[rm].memory.planner[i][1], rm)
                        break;
                    }
                }

                var end = new RoomPosition(Game.rooms[ rm ].memory.h1_x, Game.rooms[ rm ].memory.h1_y, rm)

                var build_path = PathFinder.search(start, [{pos: end , range:1}], {plainCost:19,swampCost: 20, roomCallback: function(roomName) { return costs_road; }, } ).path

                for ( var i = 0 ; i < build_path.length ; i++){

                    var xx = build_path[i].x
                    var yy = build_path[i].y

                    if( costs_road.get(xx, yy) != 5 ) {
                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 5.2, 550, 'road_source1']
                        costs_road.set(xx, yy, 5);
                    }
                }
            }


            // road controller (container) to half1
            if( 1==1 ){

                // find container
                for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){
                    if( Game.rooms[rm].memory.planner[i][2] == 'container' && Game.rooms[rm].memory.planner[i][6] == 4 ){
                        // var end = Game.rooms[rm].controller
                        var end = new RoomPosition(Game.rooms[rm].memory.planner[i][0],Game.rooms[rm].memory.planner[i][1], rm)
                        break;
                    }
                }

                var start = new RoomPosition(Game.rooms[ rm ].memory.h1_x, Game.rooms[ rm ].memory.h1_y, rm)

                var build_path = PathFinder.search(start, [{pos: end , range:1}], {plainCost: 19,swampCost: 20, roomCallback: function(roomName) { return costs_road; }, } ).path

                for ( var i = 0 ; i < build_path.length ; i++){

                    var xx = build_path[i].x
                    var yy = build_path[i].y

                    if( costs_road.get(xx, yy) != 5 ) {
                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 5.3, 550, 'road_controller']
                        costs_road.set(xx, yy, 5);
                    }
                }
            }
            //

            // road source0 to half2
            if( Memory.rooms[rm].intel && Memory.rooms[rm].intel.sources && Memory.rooms[rm].intel.sources[0] && Memory.rooms[rm].intel.sources[0].id ){

                // find container
                for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){
                    if( Game.rooms[rm].memory.planner[i][2] == 'container' && Game.rooms[rm].memory.planner[i][6] == 0 ){
                        // var start = Game.getObjectById( Memory.rooms[rm].intel.sources[0].id )
                        var start = new RoomPosition(Game.rooms[rm].memory.planner[i][0],Game.rooms[rm].memory.planner[i][1], rm)
                        break;
                    }
                }

                var end = new RoomPosition(Game.rooms[ rm ].memory.h2_x, Game.rooms[ rm ].memory.h2_y, rm)

                var build_path = PathFinder.search(start, [{pos: end , range:1}], {plainCost:19,swampCost: 20, roomCallback: function(roomName) { return costs_road; }, } ).path

                for ( var i = 0 ; i < build_path.length ; i++){

                    var xx = build_path[i].x
                    var yy = build_path[i].y

                    if( costs_road.get(xx, yy) != 5 ) {
                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 6.1, 850, 'road_source0']
                        costs_road.set(xx, yy, 5);
                    }
                }
            }
            //


            // road source1 to half2
            if( Memory.rooms[rm].intel && Memory.rooms[rm].intel.sources && Memory.rooms[rm].intel.sources[1] && Memory.rooms[rm].intel.sources[1].id ){

                // find container
                for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){
                    if( Game.rooms[rm].memory.planner[i][2] == 'container' && Game.rooms[rm].memory.planner[i][6] == 1 ){
                        // var start = Game.getObjectById( Memory.rooms[rm].intel.sources[1].id )
                        var start = new RoomPosition(Game.rooms[rm].memory.planner[i][0],Game.rooms[rm].memory.planner[i][1], rm)
                        break;
                    }
                }

                var end = new RoomPosition(Game.rooms[ rm ].memory.h2_x, Game.rooms[ rm ].memory.h2_y, rm)

                var build_path = PathFinder.search(start, [{pos: end , range:2}], {plainCost:19,swampCost: 20, roomCallback: function(roomName) { return costs_road; }, } ).path

                for ( var i = 0 ; i < build_path.length ; i++){

                    var xx = build_path[i].x
                    var yy = build_path[i].y

                    if( costs_road.get(xx, yy) != 5 ) {
                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 6.1, 850, 'road_source1']
                        costs_road.set(xx, yy, 5);
                    }
                }
            }


            // road half1 to half2
            if( 1==1 ){

                var end = new RoomPosition(Game.rooms[ rm ].memory.h1_x, Game.rooms[ rm ].memory.h1_y, rm)
                var end = new RoomPosition(Game.rooms[ rm ].memory.h2_x, Game.rooms[ rm ].memory.h2_y, rm)

                var build_path = PathFinder.search(start, [{pos: end , range:1}], {plainCost:19,swampCost: 20, roomCallback: function(roomName) { return costs_road; }, } ).path

                for ( var i = 0 ; i < build_path.length ; i++){

                    var xx = build_path[i].x
                    var yy = build_path[i].y

                    if( costs_road.get(xx, yy) != 5 ) {
                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 6.1, 850, 'road_halfs']
                        costs_road.set(xx, yy, 5);
                    }
                }
            }


            // road source0 to storage
            if( Memory.rooms[rm].intel && Memory.rooms[rm].intel.sources && Memory.rooms[rm].intel.sources[0] && Memory.rooms[rm].intel.sources[0].id ){

                // find container
                for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){
                    if( Game.rooms[rm].memory.planner[i][2] == 'container' && Game.rooms[rm].memory.planner[i][6] == 0 ){
                        // var start = Game.getObjectById( Memory.rooms[rm].intel.sources[0].id )
                        var start = new RoomPosition(Game.rooms[rm].memory.planner[i][0],Game.rooms[rm].memory.planner[i][1], rm)
                        break;
                    }
                }

                var end = new RoomPosition(Game.rooms[ rm ].memory.base_x+2, Game.rooms[ rm ].memory.base_y+2, rm)

                var build_path = PathFinder.search(start, [{pos: end , range:1}], {plainCost:19,swampCost: 20, roomCallback: function(roomName) { return costs_road; }, } ).path

                for ( var i = 0 ; i < build_path.length ; i++){

                    var xx = build_path[i].x
                    var yy = build_path[i].y

                    if( costs_road.get(xx, yy) != 5 ) {
                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 8, 1300, 'road_source0']
                        costs_road.set(xx, yy, 5);
                    }
                }
            }
            //


            // road source1 to storage
            if( Memory.rooms[rm].intel && Memory.rooms[rm].intel.sources && Memory.rooms[rm].intel.sources[1] && Memory.rooms[rm].intel.sources[1].id ){

                // find container
                for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){
                    if( Game.rooms[rm].memory.planner[i][2] == 'container' && Game.rooms[rm].memory.planner[i][6] == 1 ){
                        // var start = Game.getObjectById( Memory.rooms[rm].intel.sources[1].id )
                        var start = new RoomPosition(Game.rooms[rm].memory.planner[i][0],Game.rooms[rm].memory.planner[i][1], rm)
                        break;
                    }
                }

                var end = new RoomPosition(Game.rooms[ rm ].memory.base_x+2, Game.rooms[ rm ].memory.base_y+2, rm)

                var build_path = PathFinder.search(start, [{pos: end , range:1}], {plainCost:19,swampCost: 20, roomCallback: function(roomName) { return costs_road; }, } ).path

                for ( var i = 0 ; i < build_path.length ; i++){

                    var xx = build_path[i].x
                    var yy = build_path[i].y

                    if( costs_road.get(xx, yy) != 5 ) {
                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 9, 1300, 'road_source1']
                        costs_road.set(xx, yy, 5);
                    }
                }
            }


            // road controller (container) to storage
            if( 1==1 ){

                // find container
                for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){
                    if( Game.rooms[rm].memory.planner[i][2] == 'container' && Game.rooms[rm].memory.planner[i][6] == 4 ){
                        // var end = Game.rooms[rm].controller
                        var end = new RoomPosition(Game.rooms[rm].memory.planner[i][0],Game.rooms[rm].memory.planner[i][1], rm)
                        break;
                    }
                }

                var start = new RoomPosition(Game.rooms[ rm ].memory.base_x+2, Game.rooms[ rm ].memory.base_y+2, rm)

                var build_path = PathFinder.search(start, [{pos: end , range:1}], {plainCost: 19,swampCost: 20, roomCallback: function(roomName) { return costs_road; }, } ).path

                for ( var i = 0 ; i < build_path.length ; i++){

                    var xx = build_path[i].x
                    var yy = build_path[i].y

                    if( costs_road.get(xx, yy) != 5 ) {
                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 10, 1300, 'road_controller']
                        costs_road.set(xx, yy, 5);
                    }
                }
            }
            //


            // road center to half1
            if( 1==1 ){

                var start = new RoomPosition(Game.rooms[ rm ].memory.h1_x, Game.rooms[ rm ].memory.h1_y, rm)
                var end = new RoomPosition(Game.rooms[ rm ].memory.base_x+2, Game.rooms[ rm ].memory.base_y+2, rm)

                var build_path = PathFinder.search(start, [{pos: end , range:1}], {plainCost:19,swampCost: 20, roomCallback: function(roomName) { return costs_road; }, } ).path

                for ( var i = 1 ; i < build_path.length ; i++){

                    var xx = build_path[i].x
                    var yy = build_path[i].y

                    if( costs_road.get(xx, yy) != 5 ) {
                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 10.1, 1800, 'road_pos_storage']
                        costs_road.set(xx, yy, 5);
                    }
                }
            }
            //

            // road centor to half2
            if( 1==1 ){

                var start = new RoomPosition(Game.rooms[ rm ].memory.h2_x, Game.rooms[ rm ].memory.h2_y, rm)
                var end = new RoomPosition(Game.rooms[ rm ].memory.base_x+2, Game.rooms[ rm ].memory.base_y+2, rm)

                var build_path = PathFinder.search(start, [{pos: end , range:1}], {plainCost:19,swampCost: 20, roomCallback: function(roomName) { return costs_road; }, } ).path

                for ( var i = 1 ; i < build_path.length ; i++){

                    var xx = build_path[i].x
                    var yy = build_path[i].y

                    if( costs_road.get(xx, yy) != 5 ) {
                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 10.1, 1800, 'road_lab']
                        costs_road.set(xx, yy, 5);
                    }
                }
            }
            //


            // road mineral to storage
            if( Memory.rooms[rm].intel && Memory.rooms[rm].intel.minerals && Memory.rooms[rm].intel.minerals[0] && Memory.rooms[rm].intel.minerals[0].id ){

                // mineral
                if( Memory.rooms[rm].intel && Memory.rooms[rm].intel.minerals && Memory.rooms[rm].intel.minerals[0] && Memory.rooms[rm].intel.minerals[0].id ){
                    var start = Game.getObjectById( Memory.rooms[rm].intel.minerals[0].id ).pos
                }

                var end = new RoomPosition(Game.rooms[ rm ].memory.base_x+2, Game.rooms[ rm ].memory.base_y+2, rm)

                var build_path = PathFinder.search(start, [{pos: end , range:1}], {plainCost:19,swampCost: 20, roomCallback: function(roomName) { return costs_road; }, } ).path

                for ( var i = 0 ; i < build_path.length ; i++){

                    var xx = build_path[i].x
                    var yy = build_path[i].y

                    if( costs_road.get(xx, yy) != 5 ) {
                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 18, 2300, 'road_mineral']
                        costs_road.set(xx, yy, 5);
                    }
                }
            }
            //








            // road net
            // create cost matrix for the road net
            Game.rooms[rm].memory.planner = _.sortBy( Game.rooms[rm].memory.planner,  function(o) { return o[3]*10000+o[4]; });
            var costs_net = new PathFinder.CostMatrix;

            // set buildings
            for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){

                var xx = Game.rooms[rm].memory.planner[i][0]
                var yy = Game.rooms[rm].memory.planner[i][1]

                costs_net.set(xx, yy, 66);                
            }

            // set net
            var coords_net = [ [1,0], [-1,0], [0,-1], [0,1] ]
            for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){

                var type = Game.rooms[rm].memory.planner[i][2]
                           
                if( type == 'extension' || type == 'tower' || type == 'observer' || type == 'nuker' ){

                    var xx = Game.rooms[rm].memory.planner[i][0]
                    var yy = Game.rooms[rm].memory.planner[i][1]                    

                    for ( var j = 0 ; j < coords_net.length ; j++){

                        var x_net = coords_net[j][0] + xx
                        var y_net = coords_net[j][1] + yy

                        if( terrain.get(x_net,y_net) == TERRAIN_MASK_WALL ){
                            // ok
                        }
                        else if( costs_net.get(x_net, y_net) != 66 ){
                            costs_net.set(x_net, y_net, 7);
                        }  
                    }                  
                }
            } 

            // add net to planner
            for (let yy = 0; yy < 50; yy++) {
                for (let xx = 0; xx < 50; xx++) {
                    if( costs_net.get(xx, yy) == 7 ) {
                        Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 10.6, 1800]
                        costs_road.set(xx, yy, 5);
                    }
                }
            }



            


            // // max rank
            // var max_rank = 0
            // for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){
            //     if( Game.rooms[rm].memory.planner[i][2] == 'extension' && Game.rooms[rm].memory.planner[i][5] > max_rank ){
            //           var max_rank = Game.rooms[rm].memory.planner[i][5] + 1.5
            //     }
            // }

            // var road_matrix = [
            //   [5,3], [5,1], [3,3], [6,2], [4,4], [4,0], [7,5], [7,3], [7,-1], [7,1], [5,5], [5,-1], [3,5], [1,5],
            //   [1,3], [8,4], [8,0], [6,6], [6,-2], [2,6], [0,4], [0,2], [9,7], [9,5], [9,-3], [9,3], [9,-1], [9,1], [7,7],
            //   [7,-3], [5,7], [5,-3], [3,7], [-1,7], [1,7], [-1,5], [-2,0],[-2,2],[-1,3], [8,8], [8,-4], [4,8], [4,-4], [-2,6],
            //   [10,6], [10,-2], [10,2], [0,8], [0,-4], [9,9], [9,-5], [7,9], [7,-5], [5,9], [5,-5], [-3,9], [3,9], [-3,7],
            //   [-3,-5], [-3,5], [3,-5], [-3,3], [11,9], [11,7], [11,-5], [11,5], [11,-3], [11,3], [11,-1], [11,1], [-1,9],
            //   [1,9], [-1,-5], [1,-5], [6,-6], [6,10], [-4,8], [-4,-4], [-4,4], [-3,-1], [-3,1], [-3,3], [-4,0], [-2,-6], [2,-6], [-2,10], [2,10],
            //   [12,8], [12,-4], [12,4], [12,0], [10,-6], [10,10], [9,-7], [9,11], [7,-7], [7,11], [-5,9], [-5,-7], [-5,7],
            //   [5,-7], [-5,-5], [-5,5], [-5,-3], [-5,3], [-5,11], [5,11], [-5,-1], [-5,1], [-3,-7], [3,-7], [-3,11], [3,11],
            //   [13,9], [13,-7], [13,7], [13,-5], [13,5], [13,-3], [13,3], [13,11], [13,-1], [13,1], [11,-7], [11,11],
            //   [-1,-7], [1,-7], [-1,11], [1,11], [8,-8], [8,12], [-6,-6], [-6,6], [-6,-2], [-6,2], [-6,10], [-4,-8],
            //   [4,-8], [-4,12], [4,12], [14,-6], [14,6], [14,-2], [14,2], [14,10], [12,-8], [12,12], [0,-8], [0,12],
            //   [9,-9], [9,13], [-7,9], [7,-9], [-7,-7], [-7,7], [-7,-5], [-7,5], [-7,-3], [-7,3], [-7,13], [7,13],
            //   [-7,11], [-7,-1], [-7,1], [-5,-9], [5,-9], [-5,13], [5,13], [-3,-9], [3,-9], [-3,13], [3,13], [15,-9],
            //   [15,9], [15,-7], [15,7], [15,-5], [15,5], [15,-3], [15,3], [15,11], [15,-1], [15,1], [13,-9], [13,13],
            //   [11,-9], [11,13], [-1,-9], [1,-9], [-1,13], [1,13], [-8,8], [-8,-4], [-8,4], [-8,12], [-8,0], [6,-10],
            //   [-2,-10], [2,-10], [14,-10], [10,-10], [-9,9], [-9,7], [-9,-5], [-9,5], [-9,-3], [-9,3], [-9,13], [-9,11],
            //   [9,-11], [-9,-1], [-9,1], [7,-11], [5,-11], [-3,-11], [3,-11], [15,-11], [13,-11], [11,-11], [-1,-11], [1,-11],
            //   [-7,-9],[-8,-8],[-8,-10],[-6,-10],[15,13],[-9,-7],[-5,-11],[8,-12],[6,14],[4,-12],[2,14],[16,8],[16,4],[16,14],
            //   [16,12],[16,0],[16,-8],[16,-4],[16,-12],[14,14],[12,-12],[10,14],[0,-12],[-6,14],[-6,-12],[-4,-12],[-2,14],
            //   [-10,6],[-10,2],[-10,14],[-10,10],[-10,-8],[-10,-6],[-10,-2],[9,15],[9,-13],[7,15],[7,-13],[5,15],[5,-13],
            //   [3,15],[3,-13],[17,9],[17,7],[17,5],[17,3],[17,11],[17,1],[17,-9],[17,-7],[17,-5],[17,-3],[17,-11],[17,-1],
            //   [15,-13],[13,15],[13,-13],[11,15],[11,-13],[1,15],[1,-13],[-9,15],[-7,15],[-5,15],[-3,15],[-3,-13],[-11,9],
            //   [-11,7],[-11,5],[-11,3],[-11,13],[-11,11],[-11,1],[-11,-5],[-11,-3],[-11,-1],[-1,15],[-1,-13],[6,16],[6,-14],
            //   [2,16],[2,-14],[18,8],[18,4],[18,12],[18,0],[18,-8],[18,-4],[18,-12],[16,-14],[14,16],[14,-14],[10,16],[10,-14],
            //   [-6,16],[-4,-14],[-2,16],[-2,-14],[-12,6],[-12,2],[-12,14],[-12,10],[-12,-6],[-12,-2],[-10,16]
            //                   ]


            // for ( var i = 0 ; i < road_matrix.length ; i++){

            //     var xx = Game.rooms[rm].memory.base_x + road_matrix[i][0]
            //     var yy = Game.rooms[rm].memory.base_y + road_matrix[i][1]

            //     var terraintype = terrain.get(xx, yy)

            //     if( terraintype != 1 ){

            //         var pos_ok = 1

            //         for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){

            //             if( Game.rooms[rm].memory.planner[k][0] == xx &&
            //                 Game.rooms[rm].memory.planner[k][1] == yy ){
            //                   // posiçõa ocupada
            //                   var pos_ok = 0
            //                   break
            //             }
            //         }

            //         // check rank
            //         if ( pos_ok == 1 ){
            //             var rank = Math.max( Math.abs(xx-Game.rooms[rm].memory.base_x-4),Math.abs(yy-Game.rooms[rm].memory.base_y-2))
            //             if( rank <= max_rank  ){
            //                 // ok
            //             }
            //             else{
            //                 var pos_ok = 0
            //                 //break
            //             }
            //         }

            //         if ( pos_ok == 1 ){
            //             if( costs_road.get(xx, yy) != 5 ) {
            //                 Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx , yy , 'road', 10.6, 1800]
            //                 costs_road.set(xx, yy, 5);
            //             }
            //         }
            //     }
            // }
            // //

            // remove edge-cases for path block
            for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){

                var xx = Game.rooms[rm].memory.planner[i][0]
                var yy = Game.rooms[rm].memory.planner[i][1]
                var type = Game.rooms[rm].memory.planner[i][2]

                //
                var ok = 1
                if ( type == 'extension' ){
                    // p1 - one side of a exteion facing wall should be road
                    if ( terrain.get(xx+1, yy) == 1 && ok == 1 ){
                        for ( var j = 0 ; j < Game.rooms[rm].memory.planner.length ; j++){
                            var xx2 = Game.rooms[rm].memory.planner[j][0]
                            var yy2 = Game.rooms[rm].memory.planner[j][1]
                            var type2 = Game.rooms[rm].memory.planner[j][2]
                            if( xx2 == xx -1 && yy2 == yy && type2 != 'road' ){
                              var ok = 0
                              break
                            }
                        }
                    }
                    // p2 - one side of a exteion facing wall should be road
                    if ( terrain.get(xx-1, yy) == 1 && ok == 1 ){
                        for ( var j = 0 ; j < Game.rooms[rm].memory.planner.length ; j++){
                            var xx2 = Game.rooms[rm].memory.planner[j][0]
                            var yy2 = Game.rooms[rm].memory.planner[j][1]
                            var type2 = Game.rooms[rm].memory.planner[j][2]
                            if( xx2 == xx+1 && yy2 == yy && type2 != 'road' ){
                              var ok = 0
                              break
                            }
                        }
                    }
                    // p3 - one side of a exteion facing wall should be road
                    if ( terrain.get(xx, yy+1) == 1 && ok == 1 ){
                        for ( var j = 0 ; j < Game.rooms[rm].memory.planner.length ; j++){
                            var xx2 = Game.rooms[rm].memory.planner[j][0]
                            var yy2 = Game.rooms[rm].memory.planner[j][1]
                            var type2 = Game.rooms[rm].memory.planner[j][2]
                            if( xx2 == xx && yy2 == yy -1 && type2 != 'road' ){
                              var ok = 0
                              break
                            }
                        }
                    }
                    // p4 - one side of a exteion facing wall should be road
                    if ( terrain.get(xx, yy-1) == 1 && ok == 1 ){
                        for ( var j = 0 ; j < Game.rooms[rm].memory.planner.length ; j++){
                            var xx2 = Game.rooms[rm].memory.planner[j][0]
                            var yy2 = Game.rooms[rm].memory.planner[j][1]
                            var type2 = Game.rooms[rm].memory.planner[j][2]
                            if( xx2 == xx && yy2 == yy+1 && type2 != 'road' ){
                              var ok = 0
                              break
                            }
                        }
                    }

                    // p1 - both sites with wall should be a road
                    if ( terrain.get(xx+1, yy) == 1 && terrain.get(xx-1, yy) == 1 && ok == 1 ){
                        var ok = 0
                    }

                    // p2 - both sites with wall should be a road
                    if ( terrain.get(xx, yy+1) == 1 && terrain.get(xx, yy-1) == 1 && ok == 1 ){
                        var ok = 0
                    }

                    // p1 - 3 walls/flag on one side of the extension should be road
                    if ( terrain.get(xx+1, yy) == 1 && ok == 1 ){
                        if( terrain.get(xx+1, yy+1) == 1 && terrain.get(xx+1, yy-1) == 1 ){
                            var ok = 0
                        }
                        else if( terrain.get(xx+1, yy+1) == 1 || terrain.get(xx+1, yy-1) == 1 ){
                            var flagpos1 = 0
                            var flagpos2 = 0

                            for ( f1 in Game.flags ) {
                                if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 10 ){
                                    if(      Game.flags[f1].pos.x == xx+1 && Game.flags[f1].pos.y == yy+1 ){
                                        var flagpos1 = 1
                                    }
                                    else if( Game.flags[f1].pos.x == xx+1 && Game.flags[f1].pos.y == yy-1 ){
                                        var flagpos2 = 1
                                    }
                                }
                            }

                            if( ( terrain.get(xx+1, yy+1) == 1 || flagpos1 == 1 ) && ( terrain.get(xx+1, yy-1) == 1 || flagpos2 == 1 ) ){
                                var ok = 0
                            }
                        }
                    }

                    // p2 - 3 walls/flag on one side of the extension should be road
                    if ( terrain.get(xx-1, yy) == 1 && ok == 1 ){
                        if( terrain.get(xx-1, yy+1) == 1 && terrain.get(xx-1, yy-1) == 1 ){
                            var ok = 0
                        }
                        else if( terrain.get(xx-1, yy+1) == 1 || terrain.get(xx-1, yy-1) == 1 ){
                            var flagpos1 = 0
                            var flagpos2 = 0

                            for ( f1 in Game.flags ) {
                                if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 10 ){
                                    if(      Game.flags[f1].pos.x == xx-1 && Game.flags[f1].pos.y == yy+1 ){
                                        var flagpos1 = 1
                                    }
                                    else if( Game.flags[f1].pos.x == xx-1 && Game.flags[f1].pos.y == yy-1 ){
                                        var flagpos2 = 1
                                    }
                                }
                            }

                            if( ( terrain.get(xx-1, yy+1) == 1 || flagpos1 == 1 ) && ( terrain.get(xx-1, yy-1) == 1 || flagpos2 == 1 ) ){
                                var ok = 0
                            }
                        }
                    }

                    // p3 - 3 walls/flag on one side of the extension should be road
                    if ( terrain.get(xx, yy+1) == 1 && ok == 1 ){
                        if( terrain.get(xx-1, yy+1) == 1 && terrain.get(xx+1, yy+1) == 1 ){
                            var ok = 0
                        }
                        else if( terrain.get(xx-1, yy+1) == 1 || terrain.get(xx+1, yy+1) == 1 ){
                            var flagpos1 = 0
                            var flagpos2 = 0

                            for ( f1 in Game.flags ) {
                                if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 10 ){
                                    if(      Game.flags[f1].pos.x == xx-1 && Game.flags[f1].pos.y == yy+1 ){
                                        var flagpos1 = 1
                                    }
                                    else if( Game.flags[f1].pos.x == xx+1 && Game.flags[f1].pos.y == yy+1 ){
                                        var flagpos2 = 1
                                    }
                                }
                            }

                            if( ( terrain.get(xx-1, yy+1) == 1 || flagpos1 == 1 ) && ( terrain.get(xx+1, yy+1) == 1 || flagpos2 == 1 ) ){
                                var ok = 0
                            }
                        }
                    }

                    // p4 - 3 walls/flag on one side of the extension should be road
                    if ( terrain.get(xx, yy-1) == 1 && ok == 1 ){
                        if( terrain.get(xx-1, yy-1) == 1 && terrain.get(xx+1, yy-1) == 1 ){
                            var ok = 0
                        }
                        else if( terrain.get(xx-1, yy-1) == 1 || terrain.get(xx+1, yy-1) == 1 ){
                            var flagpos1 = 0
                            var flagpos2 = 0

                            for ( f1 in Game.flags ) {
                                if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 10 ){
                                    if(      Game.flags[f1].pos.x == xx-1 && Game.flags[f1].pos.y == yy-1 ){
                                        var flagpos1 = 1
                                    }
                                    else if( Game.flags[f1].pos.x == xx+1 && Game.flags[f1].pos.y == yy-1 ){
                                        var flagpos2 = 1
                                    }
                                }
                            }

                            if( ( terrain.get(xx-1, yy-1) == 1 || flagpos1 == 1 ) && ( terrain.get(xx+1, yy-1) == 1 || flagpos2 == 1 ) ){
                                var ok = 0
                            }
                        }
                    }

                    // place road-flag
                    if( ok == 0 ){
                      // add road flag
                      Game.rooms[rm].createFlag(xx,yy,'p'+rm+xx+yy,10,10);
                    }

                }

            }

            // // plot costmatrix
            // for (let y = 0; y < 50; y++) {
            //     for (let x = 0; x < 50; x++) {
            //       new RoomVisual(rm).text(costs_rampart.get(x, y), x, y, {color: 'green', font: 0.5});
            //     }
            // }
            // //

            Game.rooms[rm].memory.planner = _.sortBy( Game.rooms[rm].memory.planner,  function(o) { return o[3]*10000+o[4]; });


        }
    }
};

module.exports = BaseBuildPlanner;
