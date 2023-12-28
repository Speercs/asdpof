var FunctionCostMatrix = {

    run: function(rm) {
            
        if( Game.rooms[rm] && !Game.rooms[ rm ].memory.savedMatrix ){
        
            var costs = new PathFinder.CostMatrix;
            
            const terrain = Game.map.getRoomTerrain( rm );
            
            for (var xx = 0 ; xx <= 49 ; xx++){
                for (var yy = 0 ; yy <= 49 ; yy++){
                    
                    // around swamp
                    switch(terrain.get(xx,yy)) {
                        case TERRAIN_MASK_WALL:
                            break;
                        case TERRAIN_MASK_SWAMP:
                            if( xx == 0 && yy == 0 ){
                                 costs.set(xx+0, yy+1, 3)
                                 costs.set(xx+1, yy+1, 3)
                                 costs.set(xx+1, yy+0, 3)
                            }
                            else if( xx == 0 && yy == 49 ){
                                costs.set(xx+0, yy-1, 3)
                                costs.set(xx+1, yy-1, 3)
                                costs.set(xx+1, yy+0, 3)
                            }
                            else if( xx == 49 && yy == 49 ){
                                costs.set(xx+0, yy-1, 3)
                                costs.set(xx-1, yy-1, 3)
                                costs.set(xx-1, yy+0, 3)
                            }
                            else if( xx == 49 && yy == 0 ){
                                costs.set(xx+0, yy+1, 3)
                                costs.set(xx-1, yy+1, 3)
                                costs.set(xx-1, yy+0, 3)
                            }
                            else if( xx == 0 ){
                                costs.set(xx+0, yy-1, 3)
                                costs.set(xx+1, yy-1, 3)
                                costs.set(xx+1, yy+0, 3)
                                costs.set(xx+1, yy+1, 3)
                                costs.set(xx+0, yy+1, 3)
                            }
                            else if( xx == 49 ){
                                costs.set(xx+0, yy-1, 3)
                                costs.set(xx-1, yy-1, 3)
                                costs.set(xx-1, yy+0, 3)
                                costs.set(xx-1, yy+1, 3)
                                costs.set(xx+0, yy+1, 3)
                            }
                            else if( yy == 0 ){
                                costs.set(xx+1, yy+0, 3)
                                costs.set(xx-1, yy+0, 3)
                                costs.set(xx-1, yy+1, 3)
                                costs.set(xx+0, yy+1, 3)
                                costs.set(xx+1, yy+1, 3)
                            }
                            else if( yy == 49 ){
                                costs.set(xx+1, yy+0, 3)
                                costs.set(xx-1, yy+0, 3)
                                costs.set(xx-1, yy-1, 3)
                                costs.set(xx+0, yy-1, 3)
                                costs.set(xx+1, yy-1, 3)
                            }
                            else{
                                costs.set(xx-1, yy-1, 3)
                                costs.set(xx-1, yy+0, 3)
                                costs.set(xx-1, yy+1, 3)
                                costs.set(xx+0, yy-1, 3)
                                costs.set(xx+0, yy+1, 3)
                                costs.set(xx+1, yy-1, 3)
                                costs.set(xx+1, yy+0, 3)
                                costs.set(xx+1, yy+1, 3)
                            }
                            break;
                        case 0:
                            break;
                    }
                }
            }
            
            for (var xx = 0 ; xx <= 49 ; xx++){
                for (var yy = 0 ; yy <= 49 ; yy++){
            
                    // swamp
                    switch(terrain.get(xx,yy)) {
                        case TERRAIN_MASK_WALL:
                            break;
                        case TERRAIN_MASK_SWAMP:
                            costs.set(xx, yy, 5)
                            break;
                        case 0:
                            break;
                    }
                }
            }
            
            
            // avoid move in the border
            for (var xx = 0 ; xx <= 49 ; xx++){
                for (var yy = 0 ; yy <= 49 ; yy++){
            
                    if( xx == 0 || xx == 1 || xx == 48 || xx == 49 ){
                        var act = costs.get(xx, yy)
                        if( act != 255 && act != 17 ){
                            costs.set(xx, yy, 7)
                        }
                    }
                    
                    if( yy == 0 || yy == 1 || yy == 48 || yy == 49 ){
                        var act = costs.get(xx, yy)
                        if( act != 255 && act != 17 ){
                            costs.set(xx, yy, 7)
                        }
                    }
                }
            }
            
            
            for (var xx = 0 ; xx <= 49 ; xx++){
                for (var yy = 0 ; yy <= 49 ; yy++){
                    
                    // around wall
                    switch(terrain.get(xx,yy)) {
                        case TERRAIN_MASK_WALL:
                            if( xx == 0 && yy == 0 ){
                                if( costs.get(xx+0, yy+1) == 17 ){ costs.set(xx+0, yy+1, 255) }else{ costs.set(xx+0, yy+1, 17) }
                                if( costs.get(xx+1, yy+0) == 17 ){ costs.set(xx+1, yy+0, 255) }else{ costs.set(xx+1, yy+0, 17) }
                                if( costs.get(xx+1, yy+1) == 17 ){ costs.set(xx+1, yy+1, 255) }else{ costs.set(xx+1, yy+1, 17) }
                            }
                            else if( xx == 0 && yy == 49 ){
                                if( costs.get(xx+0, yy-1) == 17 ){ costs.set(xx+0, yy-1, 255) }else{ costs.set(xx+0, yy-1, 17) }
                                if( costs.get(xx+1, yy+0) == 17 ){ costs.set(xx+1, yy+0, 255) }else{ costs.set(xx+1, yy+0, 17) }
                                if( costs.get(xx+1, yy-1) == 17 ){ costs.set(xx+1, yy-1, 255) }else{ costs.set(xx+1, yy-1, 17) }
                            }
                            else if( xx == 49 && yy == 49 ){
                                if( costs.get(xx+0, yy-1) == 17 ){ costs.set(xx+0, yy-1, 255) }else{ costs.set(xx+0, yy-1, 17) }
                                if( costs.get(xx-1, yy+0) == 17 ){ costs.set(xx-1, yy+0, 255) }else{ costs.set(xx-1, yy+0, 17) }
                                if( costs.get(xx-1, yy-1) == 17 ){ costs.set(xx-1, yy-1, 255) }else{ costs.set(xx-1, yy-1, 17) }
                            }
                            else if( xx == 49 && yy == 0 ){
                                if( costs.get(xx+0, yy+1) == 17 ){ costs.set(xx+0, yy+1, 255) }else{ costs.set(xx+0, yy+1, 17) }
                                if( costs.get(xx-1, yy+0) == 17 ){ costs.set(xx-1, yy+0, 255) }else{ costs.set(xx-1, yy+0, 17) }
                                if( costs.get(xx-1, yy+1) == 17 ){ costs.set(xx-1, yy+1, 255) }else{ costs.set(xx-1, yy+1, 17) }
                            }
                            else if( xx == 0 ){
                                if( costs.get(xx+0, yy-1) == 17 ){ costs.set(xx+0, yy-1, 255) }else{ costs.set(xx+0, yy-1, 17) }
                                //if( costs.get(xx+1, yy-1) == 17 ){ costs.set(xx+1, yy-1, 255) }else{ costs.set(xx+1, yy-1, 17) }
                                if( costs.get(xx+1, yy+0) == 17 ){ costs.set(xx+1, yy+0, 255) }else{ costs.set(xx+1, yy+0, 17) }
                                //if( costs.get(xx+1, yy+1) == 17 ){ costs.set(xx+1, yy+1, 255) }else{ costs.set(xx+1, yy+1, 17) }
                                if( costs.get(xx+0, yy+1) == 17 ){ costs.set(xx+0, yy+1, 255) }else{ costs.set(xx+0, yy+1, 17) }
                            }
                            else if( xx == 49 ){
                                if( costs.get(xx+0, yy-1) == 17 ){ costs.set(xx+0, yy-1, 255) }else{ costs.set(xx+0, yy-1, 17) }
                                //if( costs.get(xx-1, yy-1) == 17 ){ costs.set(xx-1, yy-1, 255) }else{ costs.set(xx-1, yy-1, 17) }
                                if( costs.get(xx-1, yy+0) == 17 ){ costs.set(xx-1, yy+0, 255) }else{ costs.set(xx-1, yy+0, 17) }
                                //if( costs.get(xx-1, yy+1) == 17 ){ costs.set(xx-1, yy+1, 255) }else{ costs.set(xx-1, yy+1, 17) }
                                if( costs.get(xx+0, yy+1) == 17 ){ costs.set(xx+0, yy+1, 255) }else{ costs.set(xx+0, yy+1, 17) }
                            }
                            else if( yy == 0 ){
                                if( costs.get(xx+1, yy+0) == 17 ){ costs.set(xx+1, yy+0, 255) }else{ costs.set(xx+1, yy+0, 17) }
                                //if( costs.get(xx+1, yy+1) == 17 ){ costs.set(xx+1, yy+1, 255) }else{ costs.set(xx+1, yy+1, 17) }
                                if( costs.get(xx+0, yy+1) == 17 ){ costs.set(xx+0, yy+1, 255) }else{ costs.set(xx+0, yy+1, 17) }
                                //if( costs.get(xx-1, yy+1) == 17 ){ costs.set(xx-1, yy+1, 255) }else{ costs.set(xx-1, yy+1, 17) }
                                if( costs.get(xx-1, yy+0) == 17 ){ costs.set(xx-1, yy+0, 255) }else{ costs.set(xx-1, yy+0, 17) }
                            }
                            else if( yy == 49 ){
                                if( costs.get(xx+1, yy+0) == 17 ){ costs.set(xx+1, yy+0, 255) }else{ costs.set(xx+1, yy+0, 17) }
                                //if( costs.get(xx+1, yy-1) == 17 ){ costs.set(xx+1, yy-1, 255) }else{ costs.set(xx+1, yy-1, 17) }
                                if( costs.get(xx+0, yy-1) == 17 ){ costs.set(xx+0, yy-1, 255) }else{ costs.set(xx+0, yy-1, 17) }
                                //if( costs.get(xx+1, yy-1) == 17 ){ costs.set(xx+1, yy-1, 255) }else{ costs.set(xx+1, yy-1, 17) }
                                if( costs.get(xx-1, yy+0) == 17 ){ costs.set(xx-1, yy+0, 255) }else{ costs.set(xx-1, yy+0, 17) }
                            }
                            else{
                                //if( costs.get(xx-1, yy-1) == 17 ){ costs.set(xx-1, yy-1, 255) }else{ costs.set(xx-1, yy-1, 17) }
                                if( costs.get(xx-1, yy+0) == 17 ){ costs.set(xx-1, yy+0, 255) }else{ costs.set(xx-1, yy+0, 17) }
                                //if( costs.get(xx-1, yy+1) == 17 ){ costs.set(xx-1, yy+1, 255) }else{ costs.set(xx-1, yy+1, 17) }
                                
                                //if( costs.get(xx+1, yy-1) == 17 ){ costs.set(xx+1, yy-1, 255) }else{ costs.set(xx+1, yy-1, 17) }
                                if( costs.get(xx+1, yy+0) == 17 ){ costs.set(xx+1, yy+0, 255) }else{ costs.set(xx+1, yy+0, 17) }
                                //if( costs.get(xx+1, yy+1) == 17 ){ costs.set(xx+1, yy+1, 255) }else{ costs.set(xx+1, yy+1, 17) }
                                
                                if( costs.get(xx+0, yy-1) == 17 ){ costs.set(xx+0, yy-1, 255) }else{ costs.set(xx+0, yy-1, 17) }
                                if( costs.get(xx+0, yy+1) == 17 ){ costs.set(xx+0, yy+1, 255) }else{ costs.set(xx+0, yy+1, 17) }
                            }
                           
                            break;
                        case TERRAIN_MASK_SWAMP:
                            break;
                        case 0:
                            break;
                    }
                }
            }
            
            
            for (var xx = 0 ; xx <= 49 ; xx++){
                for (var yy = 0 ; yy <= 49 ; yy++){
                    
                    // wall
                    switch(terrain.get(xx,yy)) {
                        case TERRAIN_MASK_WALL:
                            costs.set(xx, yy, 255)
                            break;
                        case TERRAIN_MASK_SWAMP:
                            break;
                        case 0:
                            break;
                    }
                }
            }
            
            Game.rooms[ rm ].memory.savedMatrix      = costs.serialize();
            Game.rooms[ rm ].memory.savedMatrix_tick = Game.time
            
        }
    } 
}

module.exports = FunctionCostMatrix;