var BaseBuildPlannerRampartTowers = {

    run: function(rm ) {

        var terrain = Game.rooms[rm].getTerrain()

        // distance transform - borders
        if( 1==1 ){
            var vv = new PathFinder.CostMatrix();

            for (let y = 0; y <= 49; y++) {
                for (let x = 0; x <= 49; x++) {
                    if( ( y == 0 || x == 0 || y == 49 || x == 49 ) ){
                        vv.set(x,y,26)
                    }
                }
            }

            // regressivo
            for (var cnt = 26; cnt >= 1; cnt--) {
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
                            else if( vv.get(xxx,yyy) == 0  ){
                              vv.set(xxx,yyy,cnt-1)
                            }
                        }
                      }
                    }
                  }
                }
              }
            }
            //

            // double all values
            for (let y = 0; y <= 49; y++) {
              for (let x = 0; x <= 49; x++) {
                vv.set(x,y,vv.get(x,y)*1)
              }
            }
            //
        }


        // look for wall flag with lower value
        var val = 666

        // tower 0
        if( val == 666 ){
            var flag = 0
            for ( f1 in Game.flags ) {
                if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 9 ){
                    if( vv.get(Game.flags[f1].pos.x,Game.flags[f1].pos.y) < val  ){
                      var val = vv.get(Game.flags[f1].pos.x,Game.flags[f1].pos.y)
                      var flag = f1
                    }
                }
            }

            if( val != 666 ){
                for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                    if( Game.rooms[rm].memory.planner[k][2] == 'tower' && Game.rooms[rm].memory.planner[k][6] == 0 &&
                        vv.get(Game.flags[flag].pos.x,Game.flags[flag].pos.y) != 255 ){
                        Game.flags[flag].setColor(4, 4)
                        Game.rooms[rm].memory.planner[k][0] = Game.flags[flag].pos.x
                        Game.rooms[rm].memory.planner[k][1] = Game.flags[flag].pos.y
                        var val = 666
                        break;
                    }
                }

                // calibrate costmatrix
                var x = Game.flags[flag].pos.x
                var y = Game.flags[flag].pos.y
                for (let yy = -8; yy <= 8; yy++) {
                  for (let xx = -8; xx <= 8; xx++) {
                    var xxx = xx + x
                    var yyy = yy + y
                    if( xxx >= 0 && yyy >= 0 && xxx <= 49 && yyy <= 49 ){
                        if( xx == 0 && yy == 0 ){
                            vv.set(xxx,yyy,255)
                        }
                        else if( terrain.get(xxx, yyy) != 1 ){
                            vv.set(xxx,yyy,vv.get(xxx,yyy) +  25  )
                        }
                    }
                  }
                }
          }
        }
        //

        // tower 1
        if( val == 666 ){
            var flag = 0
            for ( f1 in Game.flags ) {
                if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 9 ){
                    if( vv.get(Game.flags[f1].pos.x,Game.flags[f1].pos.y) < val  ){
                      var val = vv.get(Game.flags[f1].pos.x,Game.flags[f1].pos.y)
                      var flag = f1
                    }
                }
            }

            if( val != 666 ){
                for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                    if( Game.rooms[rm].memory.planner[k][2] == 'tower' && Game.rooms[rm].memory.planner[k][6] == 1 &&
                        vv.get(Game.flags[flag].pos.x,Game.flags[flag].pos.y) != 255 ){
                        Game.flags[flag].setColor(4, 4)
                        Game.rooms[rm].memory.planner[k][0] = Game.flags[flag].pos.x
                        Game.rooms[rm].memory.planner[k][1] = Game.flags[flag].pos.y
                        var val = 666
                        break;
                    }
                }

                // calibrate costmatrix
                var x = Game.flags[flag].pos.x
                var y = Game.flags[flag].pos.y
                for (let yy = -8; yy <= 8; yy++) {
                  for (let xx = -8; xx <= 8; xx++) {
                    var xxx = xx + x
                    var yyy = yy + y
                    if( xxx >= 0 && yyy >= 0 && xxx <= 49 && yyy <= 49 ){
                        if( xx == 0 && yy == 0 ){
                            vv.set(xxx,yyy,255)
                        }
                        else if( terrain.get(xxx, yyy) != 1 ){
                            vv.set(xxx,yyy,vv.get(xxx,yyy) +  25  )
                        }
                    }
                  }
                }
            }
        }


        // tower 2
        if( val == 666 ){
            var flag = 0
            for ( f1 in Game.flags ) {
                if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 9 ){
                    if( vv.get(Game.flags[f1].pos.x,Game.flags[f1].pos.y) < val  ){
                      var val = vv.get(Game.flags[f1].pos.x,Game.flags[f1].pos.y)
                      var flag = f1
                    }
                }
            }

            if( val != 666 ){
                for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                    if( Game.rooms[rm].memory.planner[k][2] == 'tower' && Game.rooms[rm].memory.planner[k][6] == 2 &&
                        vv.get(Game.flags[flag].pos.x,Game.flags[flag].pos.y) != 255 ){
                        Game.flags[flag].setColor(4, 4)
                        Game.rooms[rm].memory.planner[k][0] = Game.flags[flag].pos.x
                        Game.rooms[rm].memory.planner[k][1] = Game.flags[flag].pos.y
                        var val = 666
                        break;
                    }
                }

                // calibrate costmatrix
                var x = Game.flags[flag].pos.x
                var y = Game.flags[flag].pos.y
                for (let yy = -8; yy <= 8; yy++) {
                  for (let xx = -8; xx <= 8; xx++) {
                    var xxx = xx + x
                    var yyy = yy + y
                    if( xxx >= 0 && yyy >= 0 && xxx <= 49 && yyy <= 49 ){
                        if( xx == 0 && yy == 0 ){
                            vv.set(xxx,yyy,255)
                        }
                        else if( terrain.get(xxx, yyy) != 1 ){
                            vv.set(xxx,yyy,vv.get(xxx,yyy) +  25  )
                        }
                    }
                  }
                }
            }
        }
        //

        // tower 3
        if( val == 666 ){
            var flag = 0
            for ( f1 in Game.flags ) {
                if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 9 ){
                    if( vv.get(Game.flags[f1].pos.x,Game.flags[f1].pos.y) < val  ){
                      var val = vv.get(Game.flags[f1].pos.x,Game.flags[f1].pos.y)
                      var flag = f1
                    }
                }
            }

            if( val != 666 ){
                for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                    if( Game.rooms[rm].memory.planner[k][2] == 'tower' && Game.rooms[rm].memory.planner[k][6] == 3 &&
                        vv.get(Game.flags[flag].pos.x,Game.flags[flag].pos.y) != 255 ){
                        Game.flags[flag].setColor(4, 4)
                        Game.rooms[rm].memory.planner[k][0] = Game.flags[flag].pos.x
                        Game.rooms[rm].memory.planner[k][1] = Game.flags[flag].pos.y
                        var val = 666
                        break;
                    }
                }

                // calibrate costmatrix
                var x = Game.flags[flag].pos.x
                var y = Game.flags[flag].pos.y
                for (let yy = -8; yy <= 8; yy++) {
                  for (let xx = -8; xx <= 8; xx++) {
                    var xxx = xx + x
                    var yyy = yy + y
                    if( xxx >= 0 && yyy >= 0 && xxx <= 49 && yyy <= 49 ){
                        if( xx == 0 && yy == 0 ){
                            vv.set(xxx,yyy,255)
                        }
                        else if( terrain.get(xxx, yyy) != 1 ){
                            vv.set(xxx,yyy,vv.get(xxx,yyy) +  25  )
                        }
                    }
                  }
                }
            }
        }
        else{

        }
        //

        // tower 4
        if( val == 666 ){
            var flag = 0
            for ( f1 in Game.flags ) {
                if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 9 ){
                    if( vv.get(Game.flags[f1].pos.x,Game.flags[f1].pos.y) < val  ){
                      var val = vv.get(Game.flags[f1].pos.x,Game.flags[f1].pos.y)
                      var flag = f1
                    }
                }
            }

            if( val != 666 ){
                for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                    if( Game.rooms[rm].memory.planner[k][2] == 'tower' && Game.rooms[rm].memory.planner[k][6] == 4 &&
                        vv.get(Game.flags[flag].pos.x,Game.flags[flag].pos.y) != 255 ){
                        Game.flags[flag].setColor(4, 4)
                        Game.rooms[rm].memory.planner[k][0] = Game.flags[flag].pos.x
                        Game.rooms[rm].memory.planner[k][1] = Game.flags[flag].pos.y
                        var val = 666
                        break;
                    }
                }

                // calibrate costmatrix
                var x = Game.flags[flag].pos.x
                var y = Game.flags[flag].pos.y
                for (let yy = -8; yy <= 8; yy++) {
                  for (let xx = -8; xx <= 8; xx++) {
                    var xxx = xx + x
                    var yyy = yy + y
                    if( xxx >= 0 && yyy >= 0 && xxx <= 49 && yyy <= 49 ){
                        if( xx == 0 && yy == 0 ){
                            vv.set(xxx,yyy,255)
                        }
                        else if( terrain.get(xxx, yyy) != 1 ){
                            vv.set(xxx,yyy,vv.get(xxx,yyy) +  25  )
                        }
                    }
                  }
                }
            }
        }
        //

        // tower 5
        if( val == 666 ){
            var flag = 0
            for ( f1 in Game.flags ) {
                if( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 9 ){
                    if( vv.get(Game.flags[f1].pos.x,Game.flags[f1].pos.y) < val  ){
                      var val = vv.get(Game.flags[f1].pos.x,Game.flags[f1].pos.y)
                      var flag = f1
                    }
                }
            }

            if( val != 666 ){
                for ( var k = 0 ; k < Game.rooms[rm].memory.planner.length ; k++){
                    if( Game.rooms[rm].memory.planner[k][2] == 'tower' && Game.rooms[rm].memory.planner[k][6] == 5 &&
                        vv.get(Game.flags[flag].pos.x,Game.flags[flag].pos.y) != 255 ){
                        Game.flags[flag].setColor(4, 4)
                        Game.rooms[rm].memory.planner[k][0] = Game.flags[flag].pos.x
                        Game.rooms[rm].memory.planner[k][1] = Game.flags[flag].pos.y
                        var val = 666
                        break;
                    }
                }
            }
        }
        //

        // // plot costmatrix
        // for (let y = 0; y < 50; y++) {
        //     for (let x = 0; x < 50; x++) {
        //       new RoomVisual(rm).text(vv.get(x, y), x, y, {color: 'green', font: 0.5});
        //     }
        // }
        // //

        Game.rooms[rm].memory.planner = _.sortBy( Game.rooms[rm].memory.planner,  function(o) { return o[3]*10000+o[4]; });

    }
};

module.exports = BaseBuildPlannerRampartTowers;
