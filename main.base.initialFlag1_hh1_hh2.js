var MainBaseInitialFlag1_hh1_hh2 = {

    run: function( rm ) {

        var xx_base = 0
        var yy_base = 0
        var xx_halfv1 = 0
        var yy_halfv1 = 0
        var xx_halfv2 = 0
        var yy_halfv2 = 0

        // rampart wall costmatrix
        var v = new PathFinder.CostMatrix;
        var terrain = Game.rooms[rm].getTerrain()

        // border costmatric - range3
        if( 1==1 ){
          for (let aa = 0; aa <= 49; aa++) {
              if( terrain.get(aa, 0) != 1 ){
                  v.set(aa,0,1)
              }
              if( terrain.get(aa, 49) != 1 ){
                  v.set(aa,49,1)
              }
              if( terrain.get(0, aa) != 1 ){
                  v.set(0, aa,1)
              }
              if( terrain.get(49, aa) != 1 ){
                  v.set(49, aa,1)
              }
          }

          // make 7 title from border unavailable
          for (var cnt = 1; cnt <= 6; cnt++) {
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
        //

        // controller zone
        var xx_cont = Game.rooms[rm].controller.pos.x
        var yy_cont = Game.rooms[rm].controller.pos.y
        var ex = 3

        for ( var xx = -2-ex ; xx <= 2+ex ; xx++){
            for ( var yy = -2-ex ; yy <= 2+ex ; yy++){
                if( xx_cont+xx > 0 && yy_cont+yy > 0 && xx_cont+xx < 50 && yy_cont+yy < 50 && v.get(xx_cont+xx,yy_cont+yy) != 255 ){
                    v.set(xx_cont+xx,yy_cont+yy,255)
                }
            }
        }
        //


        //sources zone
        var obj = _.sortBy( Game.rooms[rm].find(FIND_SOURCES) ,  function(o) { return  o.id; });
        var ex = 2

        for ( var i = 0; i < obj.length ; i++) {

            var s_xx = obj[i].pos.x
            var s_yy = obj[i].pos.y

            for ( var xx = -2-ex ; xx <= 2+ex ; xx++){
                for ( var yy = -2-ex ; yy <= 2+ex ; yy++){
                    if( s_xx+xx > 0 && s_yy+yy > 0 && s_xx+xx < 50 && s_yy+yy < 50 && v.get(s_xx+xx,s_yy+yy) != 255 ){
                        v.set(s_xx+xx,s_yy+yy,255)
                    }
                }
            }
        }
        //

        var v_filler = v.clone()

        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                // border distance
                if( v.get(x,y) > 0 ){
                    v.set(x,y, 255)
                }
                // stamp distance
                if ( terrain.get(x, y) == 1 ) {

                    for ( var xx = -2 ; xx <= 2 ; xx++){
                        for ( var yy = -2 ; yy <= 2 ; yy++){
                            if( x+xx > 0 && y+yy > 0 && x+xx < 50 && y+yy < 50 && v.get(x+xx,y+yy) != 255 ){
                                v.set(x+xx,y+yy,255)
                            }
                        }
                    }
                }
            }
        }
        // //


        // check for edge cases (border roads)
        var extra_roads = [ [-3,-2],
                            [-3,-1],
                            [-3,0],
                            [-3,1],
                            [-3,2],

                            [-2,3],
                            [-1,3],
                            [0,2],
                            [-2,-3],
                            [-1,-3],
                            [0,-2],

                            [1,-1],
                            [2,-1],
                            [3,0],
                            [3,1],
                            [3,2],

                            [3,3],
                            [2,3],
                            [1,3]  ]


        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                if ( v.get(x,y) != 255 ) {
                    var ok = 1
                    for ( var i = 0 ; i < extra_roads.length ; i++){
                        var xx = extra_roads[i][0]
                        var yy = extra_roads[i][1]
                        if( x+xx > 0 && y+yy > 0 && x+xx < 50 && y+yy < 50 && terrain.get(x+xx, y+yy) != 1  ){
                            // ok
                        }
                        else{
                            v.set(x,y,255)
                            break
                        }
                    }
                }
            }
        }
        //



        // distance transform
        var v2 = new PathFinder.CostMatrix();
        for (let y = 0; y < 50; y++) {
          for (let x = 0; x < 50; x++) {
              if( y == 0 || y == 49 || x== 0 || x == 49){
                v2.set(x,y,255)
              }
              else if ( terrain.get(x, y) == 1 ){
                v2.set(x,y,255)
              }
              else{
                v2.set(x,y,0)
              }
          }
        }
        v2.set(Game.rooms[rm].controller.pos.x,Game.rooms[rm].controller.pos.y,1)

        for (var cnt = 1; cnt <= 50; cnt++) {
          for (let y = 2; y <= 47; y++) {
            for (let x = 2; x <= 47; x++) {
              if( v2.get(x,y) == cnt ){
                for (let yy = -1; yy <= 1; yy++) {
                  for (let xx = -1; xx <= 1; xx++) {
                    var xxx = xx + x
                    var yyy = yy + y
                    if( xx == 0 && yy == 0 ){

                    }
                    else if( xxx > 1 && yyy > 1 && xxx < 48 && yyy < 48 && terrain.get(xxx, yyy) != 1 && v2.get(xxx,yyy) == 0  ){
                      v2.set(xxx,yyy,cnt+1)
                    }
                  }
                }
              }
            }
          }
        }
        //


        // mix both cost matrixes
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                if( v.get(x,y) != 255 ){
                    if( v2.get(x,y) == 0 ){
                      v.set(x,y,100)
                    }
                    else{
                      v.set(x,y,v2.get(x,y))
                    }
                }
            }
        }
        //


        // define base+lab flag position
        var min = 255
        var xx = 0
        var yy = 0
        for (let y = 4; y < 47; y++) {
            for (let x = 4; x < 47; x++) {
                if( v.get(x,y) < min && v.get(x,y) > 1 ){
                    var min = v.get(x,y)
                    var xx = x
                    var yy = y
                }
            }
        }
        //

        if( xx && yy ){

            if( Game.rooms[rm].memory.base_x && Game.rooms[rm].memory.base_y ){
                var xx_base = Game.rooms[rm].memory.base_x
                var yy_base = Game.rooms[rm].memory.base_y
            }
            else{
                var xx_base = xx
                var yy_base = yy
            }

            Game.rooms[rm].visual.circle(new RoomPosition(xx_base, yy_base, rm),  {fill: 'yellow', radius: 0.55, stroke: 'yellow'});
            new RoomVisual(rm).text('1', new RoomPosition(xx_base, yy_base, rm),  {color: 'black', font: 0.5});
            // Game.rooms[rm].visual.circle(new RoomPosition(xx_lab, yy_lab, rm),    {fill: 'orange', radius: 0.55, stroke: 'orange'});
            // new RoomVisual(rm).text('1', new RoomPosition(xx_lab, yy_lab, rm),    {color: 'black', font: 0.5});

        }


        //////////////////////////////////// half filler - horizontal 1
        if( xx_base > 0 && yy_base > 0 ){

            var v = v_filler.clone()

            // controller zone
            var xx_cont = xx_base
            var yy_cont = yy_base

            for ( var xx = -5 ; xx <= 5 ; xx++){
                for ( var yy = -4 ; yy <= 4 ; yy++){
                    if( xx_cont+xx > 0 && yy_cont+yy > 0 && xx_cont+xx < 50 && yy_cont+yy < 50 && v.get(xx_cont+xx,yy_cont+yy) != 255 ){
                        v.set(xx_cont+xx,yy_cont+yy,255)
                    }
                }
            }
            //

            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    // border distance
                    if( v.get(x,y) > 0 ){
                        v.set(x,y, 255)
                    }
                    // stamp distance
                    if ( terrain.get(x, y) == 1 ) {

                        for ( var xx = -2 ; xx <= 2 ; xx++){
                            for ( var yy = -1 ; yy <= 1 ; yy++){
                                if( x+xx > 0 && y+yy > 0 && x+xx < 50 && y+yy < 50 && v.get(x+xx,y+yy) != 255 ){
                                    v.set(x+xx,y+yy,255)
                                }
                            }
                        }
                    }
                }
            }
            // //

            // check for edge cases (border roads)
            var extra_roads = [ [-2,2],
                                [-1,2],
                                [0,2],
                                [1,2],
                                [2,2],

                                [-2,-2],
                                [-1,-2],
                                [0,-2],
                                [1,-2],
                                [2,-2],

                                [-3,-1],
                                [-3,0],
                                [-3,1],

                                [3,-1],
                                [3,0],
                                [3,1]  ]


            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    if ( v.get(x,y) != 255 ) {
                        for ( var i = 0 ; i < extra_roads.length ; i++){
                            var xx = extra_roads[i][0]
                            var yy = extra_roads[i][1]
                            if( x+xx > 0 && y+yy > 0 && x+xx < 50 && y+yy < 50 && terrain.get(x+xx, y+yy) != 1  ){
                                // ok
                            }
                            else{
                                v.set(x,y,255)
                                break
                            }
                        }
                    }
                }
            }
            //


            //build closer to storage (overwriting close to controller)
            if( 1==1 ){
                // distance transform
                var v2 = new PathFinder.CostMatrix();
                for (let y = 0; y < 50; y++) {
                  for (let x = 0; x < 50; x++) {
                      if( y == 0 || y == 49 || x== 0 || x == 49){
                        v2.set(x,y,255)
                      }
                      else if ( terrain.get(x, y) == 1 ){
                        v2.set(x,y,255)
                      }
                      else{
                        v2.set(x,y,0)
                      }
                  }
                }
                v2.set(xx_base+2,yy_base+1,1)

                for (var cnt = 1; cnt <= 35; cnt++) {
                  for (let y = 2; y <= 47; y++) {
                    for (let x = 2; x <= 47; x++) {
                      if( v2.get(x,y) == cnt ){
                        for (let yy = -1; yy <= 1; yy++) {
                          for (let xx = -1; xx <= 1; xx++) {
                            var xxx = xx + x
                            var yyy = yy + y
                            if( xx == 0 && yy == 0 ){

                            }
                            else if( xxx > 1 && yyy > 1 && xxx < 48 && yyy < 48 && terrain.get(xxx, yyy) != 1 && v2.get(xxx,yyy) == 0  ){
                              v2.set(xxx,yyy,cnt+1)
                            }
                          }
                        }
                      }
                    }
                  }
                }
            }
            //



            // mix both cost matrixes
            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    if( v.get(x,y) != 255 ){
                        if( v2.get(x,y) == 0 ){
                          v.set(x,y,100)
                        }
                        else{
                          v.set(x,y,v2.get(x,y))
                        }
                    }
                }
            }
            //

            // // plot heatmap for debug
            // for (let y = 0; y < 50; y++) {
            //     for (let x = 0; x < 50; x++) {
            //         new RoomVisual(rm).text(v.get(x, y), x, y, {color: 'green', font: 0.5});
            //     }
            // }


            // define base+lab flag position
            var min = 255
            var xx = 0
            var yy = 0
            for (let y = 4; y < 47; y++) {
                for (let x = 4; x < 47; x++) {
                    if( v.get(x,y) < min && v.get(x,y) > 1 ){
                        var min = v.get(x,y)
                        var xx = x
                        var yy = y
                    }
                }
            }
            //

            if( xx && yy ){

                if( Game.rooms[rm].memory.h1_x && Game.rooms[rm].memory.h1_y ){
                    if( Game.rooms[rm].memory.h1_type == 'h' ){
                        var xx_halfv1 = Game.rooms[rm].memory.h1_x
                        var yy_halfv1 = Game.rooms[rm].memory.h1_y
                    }
                    else{
                        var xx_halfv1 = 0
                        var yy_halfv1 = 0
                    }
                }
                else{
                    var xx_halfv1 = xx
                    var yy_halfv1 = yy
                }

                Game.rooms[rm].visual.circle(new RoomPosition(xx_halfv1, yy_halfv1, rm),  {fill: 'orange', radius: 0.55, stroke: 'orange'});
                new RoomVisual(rm).text('hh1', new RoomPosition(xx_halfv1, yy_halfv1, rm),  {color: 'black', font: 0.5});
                // Game.rooms[rm].visual.circle(new RoomPosition(xx_lab, yy_lab, rm),    {fill: 'orange', radius: 0.55, stroke: 'orange'});
                // new RoomVisual(rm).text('1', new RoomPosition(xx_lab, yy_lab, rm),    {color: 'black', font: 0.5});

            }
        }



        //////////////////////////////////// half filler - horizontal 2
        if( xx_base > 0 && yy_base > 0 && xx_halfv1 > 0 && yy_halfv1 > 0  ){

            var v = v_filler.clone()

            // controller zone
            var xx_cont = xx_base
            var yy_cont = yy_base

            for ( var xx = -5 ; xx <= 5 ; xx++){
                for ( var yy = -4 ; yy <= 4 ; yy++){
                    if( xx_cont+xx > 0 && yy_cont+yy > 0 && xx_cont+xx < 50 && yy_cont+yy < 50 && v.get(xx_cont+xx,yy_cont+yy) != 255 ){
                        v.set(xx_cont+xx,yy_cont+yy,255)
                    }
                }
            }
            //

            // xx_halfv1 zone
            var xx_cont = xx_halfv1
            var yy_cont = yy_halfv1

            for ( var xx = -5 ; xx <= 5 ; xx++){
                for ( var yy = -3 ; yy <= 3 ; yy++){
                    if( xx_cont+xx > 0 && yy_cont+yy > 0 && xx_cont+xx < 50 && yy_cont+yy < 50 && v.get(xx_cont+xx,yy_cont+yy) != 255 ){
                        v.set(xx_cont+xx,yy_cont+yy,255)
                    }
                }
            }
            //


            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    // border distance
                    if( v.get(x,y) > 0 ){
                        v.set(x,y, 255)
                    }
                    // stamp distance
                    if ( terrain.get(x, y) == 1 ) {

                        for ( var xx = -2 ; xx <= 2 ; xx++){
                            for ( var yy = -1 ; yy <= 1 ; yy++){
                                if( x+xx > 0 && y+yy > 0 && x+xx < 50 && y+yy < 50 && v.get(x+xx,y+yy) != 255 ){
                                    v.set(x+xx,y+yy,255)
                                }
                            }
                        }
                    }
                }
            }
            // //

            // check for edge cases (border roads)
            var extra_roads = [ [-2,2],
                                [-1,2],
                                [0,2],
                                [1,2],
                                [2,2],

                                [-2,-2],
                                [-1,-2],
                                [0,-2],
                                [1,-2],
                                [2,-2],

                                [-3,-1],
                                [-3,0],
                                [-3,1],

                                [3,-1],
                                [3,0],
                                [3,1]  ]


            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    if ( v.get(x,y) != 255 ) {
                        for ( var i = 0 ; i < extra_roads.length ; i++){
                            var xx = extra_roads[i][0]
                            var yy = extra_roads[i][1]
                            if( x+xx > 0 && y+yy > 0 && x+xx < 50 && y+yy < 50 && terrain.get(x+xx, y+yy) != 1  ){
                                // ok
                            }
                            else{
                                v.set(x,y,255)
                                break
                            }
                        }
                    }
                }
            }
            //

            //build closer to storage (overwriting close to controller)
            if( 1==1 ){
                // distance transform
                var v2 = new PathFinder.CostMatrix();
                for (let y = 0; y < 50; y++) {
                  for (let x = 0; x < 50; x++) {
                      if( y == 0 || y == 49 || x== 0 || x == 49){
                        v2.set(x,y,255)
                      }
                      else if ( terrain.get(x, y) == 1 ){
                        v2.set(x,y,255)
                      }
                      else{
                        v2.set(x,y,0)
                      }
                  }
                }
                v2.set(xx_base+2,yy_base+1,1)

                for (var cnt = 1; cnt <= 50; cnt++) {
                  for (let y = 2; y <= 47; y++) {
                    for (let x = 2; x <= 47; x++) {
                      if( v2.get(x,y) == cnt ){
                        for (let yy = -1; yy <= 1; yy++) {
                          for (let xx = -1; xx <= 1; xx++) {
                            var xxx = xx + x
                            var yyy = yy + y
                            if( xx == 0 && yy == 0 ){

                            }
                            else if( xxx > 1 && yyy > 1 && xxx < 48 && yyy < 48 && terrain.get(xxx, yyy) != 1 && v2.get(xxx,yyy) == 0  ){
                              v2.set(xxx,yyy,cnt+1)
                            }
                          }
                        }
                      }
                    }
                  }
                }
            }
            //

            // mix both cost matrixes
            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    if( v.get(x,y) != 255 ){
                        if( v2.get(x,y) == 0 ){
                          v.set(x,y,100)
                        }
                        else{
                          v.set(x,y,v2.get(x,y))
                        }
                    }
                }
            }
            //

            // // plot heatmap for debug
            // for (let y = 0; y < 50; y++) {
            //     for (let x = 0; x < 50; x++) {
            //         new RoomVisual(rm).text(v.get(x, y), x, y, {color: 'green', font: 0.5});
            //     }
            // }


            // define base+lab flag position
            var min = 255
            var xx = 0
            var yy = 0
            for (let y = 4; y < 47; y++) {
                for (let x = 4; x < 47; x++) {
                    if( v.get(x,y) < min && v.get(x,y) > 1 ){
                        var min = v.get(x,y)
                        var xx = x
                        var yy = y
                    }
                }
            }
            //

            if( xx && yy ){

                if( Game.rooms[rm].memory.h2_x && Game.rooms[rm].memory.h2_y ){
                    if( Game.rooms[rm].memory.h2_type == 'h' ){
                        var xx_halfv2 = Game.rooms[rm].memory.h2_x
                        var yy_halfv2 = Game.rooms[rm].memory.h2_y
                    }
                    else{
                        var xx_halfv2 = 0
                        var yy_halfv2 = 0
                    }
                }
                else{
                    var xx_halfv2 = xx
                    var yy_halfv2 = yy
                }

                Game.rooms[rm].visual.circle(new RoomPosition(xx_halfv2, yy_halfv2, rm),  {fill: 'orange', radius: 0.55, stroke: 'orange'});
                new RoomVisual(rm).text('hh2', new RoomPosition(xx_halfv2, yy_halfv2, rm),  {color: 'black', font: 0.5});
                // Game.rooms[rm].visual.circle(new RoomPosition(xx_lab, yy_lab, rm),    {fill: 'orange', radius: 0.55, stroke: 'orange'});
                // new RoomVisual(rm).text('1', new RoomPosition(xx_lab, yy_lab, rm),    {color: 'black', font: 0.5});

            }
        }

        // min cut for wall
        if( 1==1 ){
          const MinCut = require('minCut2');

          const terrain = new Room.Terrain(rm);
          var vr = new PathFinder.CostMatrix;
          const sources = [];

          // base
          var xxx = xx_base
          var yyy = yy_base
          vr.set(xxx,yyy,1)

          // half1
          var xxx = xx_halfv1
          var yyy = yy_halfv1
          vr.set(xxx,yyy,1)

          // half2
          var xxx = xx_halfv2
          var yyy = yy_halfv2
          vr.set(xxx,yyy,1)

          // center s1
          if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[0] && Game.rooms[rm].memory.intel.sources[0].id ){

              var start = Game.getObjectById( Game.rooms[rm].memory.intel.sources[0].id ).pos
              var end = new RoomPosition(xx_base, yy_base, rm)
              var path = PathFinder.search( start, end, { plainCost: 19, swampCost: 20, maxRooms: 1 } ).path
              for ( var i = 0 ; i < path.length ; i++){
                  if( path[i].x > 1 && path[i].y > 1 && path[i].x < 49 && path[i].y < 49 ){
                      vr.set(path[i].x,path[i].y,1)
                  }
              }
          }

          // center s2
          if( Game.rooms[rm].memory.intel && Game.rooms[rm].memory.intel.sources && Game.rooms[rm].memory.intel.sources[1] && Game.rooms[rm].memory.intel.sources[1].id ){
              var start = Game.getObjectById( Game.rooms[rm].memory.intel.sources[1].id ).pos
              var end = new RoomPosition(xx_base, yy_base, rm)
              var path = PathFinder.search( start, end, { plainCost: 19, swampCost: 20, maxRooms: 1 } ).path
              for ( var i = 0 ; i < path.length ; i++){
                  if( path[i].x > 1 && path[i].y > 1 && path[i].x < 49 && path[i].y < 49 ){
                      vr.set(path[i].x,path[i].y,1)
                  }
              }
          }

          // center controller
          if( Game.rooms[rm].memory.intel && Game.rooms[rm].controller ){
              var start = Game.rooms[rm].controller.pos
              var end = new RoomPosition(xx_base, yy_base, rm)
              var path = PathFinder.search( start, end, { plainCost: 19, swampCost: 20, maxRooms: 1 } ).path
              for ( var i = 0 ; i < path.length ; i++){
                  if( path[i].x > 1 && path[i].y > 1 && path[i].x < 49 && path[i].y < 49 ){
                      vr.set(path[i].x,path[i].y,1)
                  }
              }
          }

          // make 2 title from buildings unavailable (so rampart is on 3rd)
          for (var cnt = 1; cnt <= 3; cnt++) {
            for (let y = 2; y <= 47; y++) {
              for (let x = 2; x <= 47; x++) {
                if( vr.get(x,y) == cnt ){
                  for (let yy = -1; yy <= 1; yy++) {
                    for (let xx = -1; xx <= 1; xx++) {
                      var xxx = xx + x
                      var yyy = yy + y
                      if( xx == 0 && yy == 0 ){

                      }
                      else if( xxx > 1 && yyy > 1 && xxx < 48 && yyy < 48 && terrain.get(xxx, yyy) != 1 && vr.get(xxx,yyy) == 0  ){
                        vr.set(xxx,yyy,cnt+1)
                      }
                    }
                  }
                }
              }
            }
          }

          for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
              if( vr.get(x,y) > 0 ){
                sources.push({x: x, y: y})
              }
            }
          }

          let bounds={x1: 0, y1: 0, x2:49, y2: 49};

          let positions=MinCut.GetCutTiles(rm,sources,bounds);

          var ramp_cnt = positions.length
        }

        // priority (lower better)
        var priority = Math.max(Math.abs(xx_base-Game.rooms[rm].controller.pos.x), Math.abs(yy_base-Game.rooms[rm].controller.pos.y) ) * 5 + ramp_cnt

        if( !( ramp_cnt >= 0 ) ){
            var ramp_cnt = 9999
        }
        if( !( priority >= 0 ) ){
            var priority = 9999
        }

        return [ xx_base, yy_base, xx_halfv1, yy_halfv1, xx_halfv2, yy_halfv2 , ramp_cnt , priority, 'h', 'h'];

    }
};

module.exports = MainBaseInitialFlag1_hh1_hh2;
