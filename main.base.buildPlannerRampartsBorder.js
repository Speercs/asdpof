var BaseBuildPlannerRampartBorder = {

    run: function( rm ) {

        var terrain = Game.rooms[rm].getTerrain()

        // distance transform - borders
        if( 1==1 ){
            var vv = new PathFinder.CostMatrix();

            for (let y = 0; y <= 49; y++) {
                for (let x = 0; x <= 49; x++) {
                    if( ( y == 0 || x == 0 || y == 49 || x == 49 ) && terrain.get(x,y) != 1 ){
                        vv.set(x,y,1)
                    }
                }
            }

            for (var cnt = 1; cnt <= 3; cnt++) {
              for (let y = 0; y <= 49; y++) {
                for (let x = 0; x <= 49; x++) {
                  if( vv.get(x,y) == cnt ){
                    for (let yy = -1; yy <= 1; yy++) {
                      for (let xx = -1; xx <= 1; xx++) {
                        var xxx = xx + x
                        var yyy = yy + y
                        if( xxx >= 0 && yyy>=0 && xxx <=49 && yyy <=49 ){
                            if( xx == 0 && yy == 0 ){

                            }
                            else if( terrain.get(xxx, yyy) != 1 && vv.get(xxx,yyy) == 0  ){
                              vv.set(xxx,yyy,cnt+1)
                            }
                        }
                      }
                    }
                  }
                }
              }
            }
        }
        //


        // place flags
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                if( vv.get(x,y) == 3 ){
                    if( Game.rooms[rm].lookForAt(LOOK_FLAGS, x, y).length > 0 ){

                    }
                    else{
                      Game.rooms[rm].createFlag(x,y,'ramp'+rm+parseInt(x*100)+parseInt(y),5,5);
                    }
                }
            }
        }
        //
    }
};

module.exports = BaseBuildPlannerRampartBorder;
