var BaseBuildPlannerRampart_lvl2 = {

    run: function( rm ) {

        // remove flags
        // for ( f1 in Game.flags ) {
        //     if( Game.flags[f1].pos.roomName == rm && ( Game.flags[f1].color == 4 || Game.flags[f1].color == 9 ) ){
        //         Game.flags[f1].remove()
        //     }
        // }

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

        // distance transform - Ramparts lvl 2
        if( 1==1 ){

            // for (var cnt = 1; cnt <= 80; cnt++) {
              for (let y = 0; y <= 49; y++) {
                for (let x = 0; x <= 49; x++) {
                  if( vv.get(x,y) == 255 ){
                    for (let yy = -1; yy <= 1; yy++) {
                      for (let xx = -1; xx <= 1; xx++) {
                        var xxx = xx + x
                        var yyy = yy + y
                        if( xx == 0 && yy == 0 ){

                        }
                        else if( terrain.get(xxx, yyy) != 1 && vv.get(xxx,yyy) == 0  ){
                          vv.set(xxx,yyy,200)
                        }
                      }
                    }
                  }
                }
              }
            // }
        }

        // distance transform - Ramparts lvl 3
        if( 1==1 ){

            // for (var cnt = 1; cnt <= 80; cnt++) {
              for (let y = 0; y <= 49; y++) {
                for (let x = 0; x <= 49; x++) {
                  if( vv.get(x,y) == 200 ){
                    for (let yy = -1; yy <= 1; yy++) {
                      for (let xx = -1; xx <= 1; xx++) {
                        var xxx = xx + x
                        var yyy = yy + y
                        if( xx == 0 && yy == 0 ){

                        }
                        else if( terrain.get(xxx, yyy) != 1 && vv.get(xxx,yyy) == 0  ){
                          vv.set(xxx,yyy,201)
                        }
                      }
                    }
                  }
                }
              }
            // }
        }


        // building cost matrix
        var vvv = new PathFinder.CostMatrix();

        for ( var i = 0 ; i < Game.rooms[rm].memory.planner.length ; i++){

            var xx   = Game.rooms[rm].memory.planner[i][0]
            var yy   = Game.rooms[rm].memory.planner[i][1]
            var type = Game.rooms[rm].memory.planner[i][2]

            if( type != 'road' && type != 'extractor' ){
                vvv.set(xx,yy,255)
            }
        }
        //

        // sourcer and controller pos
        var sources = _.sortBy( Game.rooms[rm].find(FIND_SOURCES) ,  function(o) { return  o.id; });
        //

        // place walls lvl 2 - version 2
        if( 1 == 1 ){
          for (let y = 0; y <= 49; y++) {
            for (let x = 0; x <= 49; x++) {
              if( vv.get(x,y) == 200 || vv.get(x,y) == 201 ){
                if( (y % 2) != (x % 2) &&   // quadriculado
                  sources[0].pos.getRangeTo(x,y) > 2 &&
                  sources[1].pos.getRangeTo(x,y) > 2 &&
                  Game.rooms[rm].controller.pos.getRangeTo(x,y) > 2 ){ // distancia das sources e controller

                    var cnt = 0

                    var xx = 1
                    var yy = 0
                    if( terrain.get(x+xx,y+yy) == 1 || vvv.get(x+xx,y+yy) == 255 ){
                      var cnt = cnt + 1
                    }

                    var xx = -1
                    var yy = 0
                    if( terrain.get(x+xx,y+yy) == 1 || vvv.get(x+xx,y+yy) == 255 ){
                      var cnt = cnt + 1
                    }

                    var xx = 0
                    var yy = 1
                    if( terrain.get(x+xx,y+yy) == 1 || vvv.get(x+xx,y+yy) == 255 ){
                      var cnt = cnt + 1
                    }

                    var xx = 0
                    var yy = -1
                    if( terrain.get(x+xx,y+yy) == 1 || vvv.get(x+xx,y+yy) == 255 ){
                      var cnt = cnt + 1
                    }

                    var xx = 0
                    var yy = 0
                    if( terrain.get(x+xx,y+yy) == 1 || vvv.get(x+xx,y+yy) == 255 ){
                      var cnt = cnt + 1
                    }

                    if( cnt == 0 ){
                        Game.rooms[rm].createFlag(x,y,'w'+rm+parseInt(x*100)+parseInt(y),9,9);
                        vv.set(x,y,255)

                        // remove road from planner in case there is one
                        for ( var ii = 0 ; ii < Game.rooms[rm].memory.planner.length ; ii++){

                            var xx   = Game.rooms[rm].memory.planner[ii][0]
                            var yy   = Game.rooms[rm].memory.planner[ii][1]
                            var type = Game.rooms[rm].memory.planner[ii][2]

                            if( type == 'road' && xx == x && yy == y ){
                                Game.rooms[rm].memory.planner.splice(ii,1)
                                if (ii > 0) { ii = ii - 1 }
                            }
                        }
                        //
                    }
                    else{
                        Game.rooms[rm].createFlag(x,y,'r'+rm+parseInt(x*100)+parseInt(y),4,4);
                        vv.set(x,y,255)
                    }
                }
                else{
                  Game.rooms[rm].createFlag(x,y,'r'+rm+parseInt(x*100)+parseInt(y),4,4);
                  //Game.rooms[rm].visual.structure(x, y, 'rampart')
                  vv.set(x,y,255)
                }
              }
            }
          }
        }
        //


        // plot costmatrix
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                new RoomVisual(rm).text(vv.get(x, y), x, y, {color: 'green', font: 0.5});
            }
        }
        //





    }
};

module.exports = BaseBuildPlannerRampart_lvl2;
