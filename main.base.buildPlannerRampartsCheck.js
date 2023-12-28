var BaseBuildPlannerRampartCheck = {

    run: function(rm ) {

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

            for ( f1 in Game.flags ) {
                if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 5 ){
                    vv.set(Game.flags[f1].pos.x,Game.flags[f1].pos.y,255)
                }
            }

            for (var cnt = 1; cnt <= 120; cnt++) {
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

        // check if base center is connected to border
        if( vv.get(Game.rooms[rm].memory.base_x,Game.rooms[rm].memory.base_y) == 0 ){
            // all fine, base is secured
            console.log('all fine on ramps,', rm )
        }
        else{
            // remove all ramparts and wall flags
            for ( f1 in Game.flags ) {
                if( Game.flags[f1].pos.roomName == rm && ( Game.flags[f1].color == 4 || Game.flags[f1].color == 5 || Game.flags[f1].color == 9 ) ){
                    Game.flags[f1].remove()
                }
            }
        }
        //
    }
};

module.exports = BaseBuildPlannerRampartCheck;
