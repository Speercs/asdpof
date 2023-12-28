
var mainSeason= {

    run: function( rm ) {

        // season5

        // memory segments
        if( rm == 'W6N13' && 1==11){
            
            RawMemory.setDefaultPublicSegment(90);
            RawMemory.setPublicSegments([90])

            if (Game.time % 2 == 0) {
                RawMemory.setActiveSegments([90]);
                //RawMemory.setDefaultPublicSegment(90);
                //RawMemory.setPublicSegments(90)
            } else if (Game.time % 2 == 1) {
                if (90 in RawMemory.segments) {
                    const string1 = Game.rooms['W6N13'].storage.store['T'] + Game.rooms['W6N13'].terminal.store['T']

                    thor = {}
                    thor.amount = string1

                    RawMemory.segments[90] = JSON.stringify( thor )
                    console.log('Season T: ', thor.amount )
                }
            }
        }

        // mineral extractor
        if( Game.time % 7 == 0 && 1==11 ){

            if( rm == 'W2N15' && 1==11 ){

                var obj = Game.getObjectById('64765074d6ad5e002e061caa')

                Game.rooms[rm].memory.intel.minerals[0].id = obj.id
                //if( obj.mineralAmount < 2500 ){ var amt = 0 }else{ var amt = obj.mineralAmount }
                Game.rooms[rm].memory.intel.minerals[0].mineralAmount = obj.mineralAmount
                Game.rooms[rm].memory.intel.minerals[0].mineralType = obj.mineralType
                Game.rooms[rm].memory.intel.minerals[0].vicinity = 1
                Game.rooms[rm].memory.intel.minerals[0].db = 14

                for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){
                    if( Game.rooms[rm].memory.planner[i][2] == 'extractor' ){
                        Game.rooms[rm].memory.planner[i][0] = obj.pos.x
                        Game.rooms[rm].memory.planner[i][1] = obj.pos.y
                        break;
                    }
                }

                //Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [start.pos.x , start.pos.y , 'extractor',         21, 2300]
            }   

            if( rm == 'W7N23' && 1==11){

                var obj = Game.getObjectById('64765074d6ad5e002e061b3b')

                Game.rooms[rm].memory.intel.minerals[0].id = obj.id
                //if( obj.mineralAmount < 2500 ){ var amt = 0 }else{ var amt = obj.mineralAmount }
                Game.rooms[rm].memory.intel.minerals[0].mineralAmount = obj.mineralAmount
                Game.rooms[rm].memory.intel.minerals[0].mineralType = obj.mineralType
                Game.rooms[rm].memory.intel.minerals[0].vicinity = 3
                Game.rooms[rm].memory.intel.minerals[0].db = 40

                for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){
                    if( Game.rooms[rm].memory.planner[i][2] == 'extractor' ){
                        Game.rooms[rm].memory.planner[i][0] = obj.pos.x
                        Game.rooms[rm].memory.planner[i][1] = obj.pos.y
                        break;
                    }
                }

                //Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [start.pos.x , start.pos.y , 'extractor',         21, 2300]
            } 
         
        }
        //

        // terminal aggregator
        if( 1==11&&
            rm != 'W6N13' &&
            Game.rooms[rm] &&
            Game.rooms[rm].terminal &&
            Game.rooms[rm].terminal.cooldown == 0 &&
            Game.rooms[rm].terminal.store['T'] > 0 ){
            
            Game.rooms[rm].terminal.send('T', Math.min(1000, Game.rooms[rm].terminal.store['T']), 'W6N13' )
        }
        //
    }
};

module.exports = mainSeason;
