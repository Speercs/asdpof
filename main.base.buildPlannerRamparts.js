var BaseBuildPlannerRamparts = {

    run: function(rm ) {

        // pandora
        // const MinCut = require('minCut');
        //
        // const terrain = new Room.Terrain(rm);
        // const sources = [];
        //
        // for ( var iii = 0 ; iii < Game.rooms[rm].memory.planner.length ; iii++){
        //     if( Game.rooms[rm].memory.planner[iii][5] && Game.rooms[rm].memory.planner[iii][5] == 'road_mineral' ){
        //         // do not add
        //     }
        //     else if( Game.rooms[rm].memory.planner[iii][2] && Game.rooms[rm].memory.planner[iii][2] == 'extractor' ){
        //         // do not add
        //     }
        //     else if( Game.rooms[rm].memory.planner[iii][2] && Game.rooms[rm].memory.planner[iii][2] == 'container' && Game.rooms[rm].memory.planner[iii][6] && Game.rooms[rm].memory.planner[iii][6] == 2 ){
        //         // do not add
        //     }
        //     else{
        //         var xx = Game.rooms[rm].memory.planner[iii][0]
        //         var yy = Game.rooms[rm].memory.planner[iii][1]
        //         if( xx > 1 && yy > 1 && xx < 49 && yy < 49 ){
        //             sources.push(xx, yy)
        //         }
        //     }
        // }
        //
        // minCut = MinCut.create(terrain, sources, {extendSources: 3});
        //
        // // visualize
        // const visual = new RoomVisual(rm);
        // for (let x = 0; x <= 49; x++) {
        //   	for (let y = 0; y <= 49; y++) {
        //     		const label = minCut.getLabel(x, y);
        //     		if (label !== MINCUT_UNPATHABLE) { // 255
        //       			let color = 'white';
        //       			if (label === MINCUT_SINK) { // 2
        //       				  color = '#ff4232';
        //       			}
        //             else if (label === MINCUT_SOURCE) { // 1
        //       			    color = 'yellow';
        //
        //                 var xx = x
        //                 var yy = y
        //                 if( Game.rooms[rm].lookForAt(LOOK_FLAGS, xx, yy).length > 0 ){
        //                     // ok
        //                 }
        //                 else{
        //                     Game.rooms[rm].createFlag(xx,yy,'ramp'+rm+parseInt(xx*100)+parseInt(yy),5,5);
        //                 }
        //       			}
        //       			visual.circle(x, y, {radius: 0.2, fill: color, opacity: 0.6});
        //     		}
        //   	}
        // }

        // saruss
        const MinCut = require('minCut2');

        const terrain = new Room.Terrain(rm);
        var vr = new PathFinder.CostMatrix;
        const sources = [];

        for ( var iii = 0 ; iii < Game.rooms[rm].memory.planner.length ; iii++){
            if( Game.rooms[rm].memory.planner[iii][5] && Game.rooms[rm].memory.planner[iii][5] == 'road_mineral' ){
                // do not add
            }
            else if( Game.rooms[rm].memory.planner[iii][2] && Game.rooms[rm].memory.planner[iii][2] == 'extractor' ){
                // do not add
            }
            else{
                var xx = Game.rooms[rm].memory.planner[iii][0]
                var yy = Game.rooms[rm].memory.planner[iii][1]

                vr.set(xx,yy,1)
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

        for ( var i = 0 ; i < positions.length ; i++){

            var x = positions[i].x
            var y = positions[i].y

            if( Game.rooms[rm].lookForAt(LOOK_FLAGS, x, y).length > 0 ){

            }
            else{
              Game.rooms[rm].createFlag(x,y,'ramp'+rm+parseInt(x*100)+parseInt(y),5,5);
            }

        }

    }
};

module.exports = BaseBuildPlannerRamparts;
