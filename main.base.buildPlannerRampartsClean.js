var BaseBuildPlannerRampartClean = {

    run: function(rm ) {

        var terrain = Game.rooms[rm].getTerrain()

        // distance transform - base center
        if( 1==1 ){
            var v = new PathFinder.CostMatrix();

            // base
            v.set(Game.rooms[rm].memory.base_x, Game.rooms[rm].memory.base_y,   1)
            v.set(Game.rooms[rm].memory.h1_x,  Game.rooms[rm].memory.h1_y,    1)
            v.set(Game.rooms[rm].memory.h2_x,  Game.rooms[rm].memory.h2_y,    1)

            // controller
            var cont_x = Game.rooms[rm].controller.pos.x
            var cont_y = Game.rooms[rm].controller.pos.y

            for (let yy = -1; yy <= 1; yy++) {
              for (let xx = -1; xx <= 1; xx++) {
                var xxx = xx + cont_x
                var yyy = yy + cont_y
                if( xx == 0 && yy == 0 ){

                }
                else if( terrain.get(xxx, yyy) != 1 ){
                  v.set(xxx,yyy,1)
                }
              }
            }
            //

            // source
            for (let ii = 0; ii <= 1 ; ii++) {
                if ( Game.rooms[rm].memory.intel.sources[ii] && Game.rooms[rm].memory.intel.sources[ii].id ){
                    var cont_x = Game.getObjectById( Game.rooms[rm].memory.intel.sources[ii].id ).pos.x
                    var cont_y = Game.getObjectById( Game.rooms[rm].memory.intel.sources[ii].id ).pos.y

                    for (let yy = -1; yy <= 1; yy++) {
                      for (let xx = -1; xx <= 1; xx++) {
                        var xxx = xx + cont_x
                        var yyy = yy + cont_y
                        if( xx == 0 && yy == 0 ){

                        }
                        else if( terrain.get(xxx, yyy) != 1 ){
                          v.set(xxx,yyy,1)
                        }
                      }
                    }
                }
            }

            for ( f1 in Game.flags ) {
                if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 5 ){
                    v.set(Game.flags[f1].pos.x,Game.flags[f1].pos.y,255)
                }
            }

            for (var cnt = 1; cnt <= 80; cnt++) {
              for (let y = 0; y <= 49; y++) {
                for (let x = 0; x <= 49; x++) {
                  if( v.get(x,y) == cnt ){
                    for (let yy = -1; yy <= 1; yy++) {
                      for (let xx = -1; xx <= 1; xx++) {
                        var xxx = xx + x
                        var yyy = yy + y
                        if( xx == 0 && yy == 0 ){

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
        }


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

            for (var cnt = 1; cnt <= 80; cnt++) {
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


        // merge transforms
        var vvv = new PathFinder.CostMatrix();

        for (let y = 0; y <= 49; y++) {
            for (let x = 0; x <= 49; x++) {
                if( terrain.get(x, y) == 1 ){
                    vvv.set(x,y,255)
                }
                else if( v.get(x,y) >= 1 && v.get(x,y) < 255 ){
                    vvv.set(x,y,1)
                }
                else if( vv.get(x,y) >= 1 && vv.get(x,y) < 255 ){
                    vvv.set(x,y,2)
                }
                else{
                    // neighbor rampart
                    vvv.set(x,y,3)
                }
            }
        }

        // remove disconected flags
        for ( f1 in Game.flags ) {
            if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 5 ){
                var rem1 = 1
                var rem2 = 1
                var keep = 0
                for (let yy = -1; yy <= 1; yy++) {
                    for (let xx = -1; xx <= 1; xx++) {
                        if( yy == 0 && xx == 0 ){

                        }
                        else {
                            if( vvv.get(Game.flags[f1].pos.x+xx,Game.flags[f1].pos.y+yy) == 1 ){
                                var rem1 = 0
                            }
                            else if( vvv.get(Game.flags[f1].pos.x+xx,Game.flags[f1].pos.y+yy) == 3 ){
                                if( vvv.get(Game.flags[f1].pos.x+xx*2,Game.flags[f1].pos.y+yy*2) == 1 ){
                                    var rem1 = 0
                                }
                            }

                            if( vvv.get(Game.flags[f1].pos.x+xx,Game.flags[f1].pos.y+yy) == 2 ){
                                var rem2 = 0
                            }
                            else if( vvv.get(Game.flags[f1].pos.x+xx,Game.flags[f1].pos.y+yy) == 3 ){
                                if( vvv.get(Game.flags[f1].pos.x+xx*2,Game.flags[f1].pos.y+yy*2) == 2 ){
                                    var rem2 = 0
                                }
                            }

                            //controler around
                            if( Game.flags[f1].pos.x+xx == Game.rooms[rm].controller.pos.x && Game.flags[f1].pos.y+yy == Game.rooms[rm].controller.pos.y ){
                                var keep = 1
                            }
                        }
                    }
                }

                if( ( rem1 == 1 || rem2 == 1 ) && keep == 0 ){
                    Game.flags[f1].remove()
                }
            }
        }




          // plot costmatrix
          for (let y = 0; y < 50; y++) {
              for (let x = 0; x < 50; x++) {
                  new RoomVisual(rm).text(vvv.get(x, y), x, y, {color: 'green', font: 0.5});
              }
          }
          //





    }
};

module.exports = BaseBuildPlannerRampartClean;
