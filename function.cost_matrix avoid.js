var FunctionCostMatrix_avoid = {

    run: function(rm, hostiles) {

        if( !global.rooms[rm] ){
            global.rooms[rm] = {}
        }

        if( !global.rooms[rm].costMatrix_avoid || 
            ( global.rooms[rm].costMatrix_avoid_tick && global.rooms[rm].costMatrix_avoid_tick != Game.time ) ){
        
            var costs = new PathFinder.CostMatrix;
            
            const terrain = Game.map.getRoomTerrain( rm );

            // set border
            for (var xx = 0 ; xx <= 49 ; xx++){
                for (var yy = 0 ; yy <= 49 ; yy++){
                    
                    if( terrain.get(xx,yy) == TERRAIN_MASK_WALL ) {
                        costs.set(xx, yy, 255)                  
                    }
                    else if( xx == 0 || xx == 49 || yy == 0 || yy == 49 ){
                        costs.set(xx, yy, 4 )  
                    }
                    else if( xx == 1 || xx == 48 || yy == 1 || yy == 48 ){
                        costs.set(xx, yy, 3 )  
                    }
                }
            }

            // set swamp
            for (var xx = 1 ; xx <= 48 ; xx++){
                for (var yy = 1 ; yy <= 48 ; yy++){
                    
                    if( terrain.get(xx,yy) == TERRAIN_MASK_SWAMP ) {
                        costs.set(xx, yy, costs.get(xx, yy) + 5 )                   
                    }
                }
            }
                     
            // hostiles
            if( hostiles && hostiles.length > 0 && 1==1 ){

                for ( var i = 0 ; i < hostiles.length ; i++){

                    if( hostiles[i].getActiveBodyparts(RANGED_ATTACK) > 0 ){
                        var rng = 3
                    }
                    else if( hostiles[i].getActiveBodyparts(ATTACK) > 0 ){
                        var rng = 1
                    }
                    else{
                        var rng = 0
                    }

                    var x = hostiles[i].pos.x
                    var y = hostiles[i].pos.y

                    for (var xx = -(rng + 4) ; xx <= (rng + 4) ; xx++){
                        for (var yy = -(rng + 4) ; yy <= (rng + 4) ; yy++){
                            
                            if( xx == 0 && yy == 0 ) {
                                costs.set(x+xx, y+yy, 255)                      
                            }
                            else if( x+xx >= 0 && x+xx <= 49 && y+yy >= 0 && y+yy <= 49 ){

                                if( Math.max( Math.abs(xx), Math.abs(yy) ) <= rng + 1 ){
                                    var val = 255
                                }
                                else{
                                    var val = 10
                                }
                                
                                costs.set(x+xx, y+yy, Math.max( costs.get(x+xx, y+yy), val ) )                                  
                            }
                        }
                    }
                }
            }
            
            global.rooms[rm].costMatrix_avoid      = costs.serialize();
            global.rooms[rm].costMatrix_avoid_tick = Game.time
            
        }
    } 
}

module.exports = FunctionCostMatrix_avoid;