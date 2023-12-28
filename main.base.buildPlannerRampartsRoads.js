var BaseBuildPlannerRampartRoads = {

    run: function(rm ) {

       // create cost matrix for the containers
       var costs_container = new PathFinder.CostMatrix;
       var terrain = Game.rooms[rm].getTerrain()

       for ( var iii = 0 ; iii < Game.rooms[rm].memory.planner.length ; iii++){
           if( Game.rooms[rm].memory.planner[iii][2] == 'road' ){
               costs_container.set(Game.rooms[rm].memory.planner[iii][0], Game.rooms[rm].memory.planner[iii][1], 7);
           }
           else if( Game.rooms[rm].memory.planner[iii][2] == 'container' ){
               costs_container.set(Game.rooms[rm].memory.planner[iii][0], Game.rooms[rm].memory.planner[iii][1], 50);
           }
           else{
               costs_container.set(Game.rooms[rm].memory.planner[iii][0], Game.rooms[rm].memory.planner[iii][1], 255);
           }
       }

       for (let y = 0; y < 50; y++) {
           for (let x = 0; x < 50; x++) {
               if( x == 0 || x == 49 || y == 0 || y == 49 ){
                   costs_container.set(x, y, 255);
               }
               else if ( ( x == 1 || x == 48 || y == 1 || y == 48 ) && terrain.get(x, y) != 1 ){
                   costs_container.set(x, y, 150);
               }
               else if ( ( x == 2 || x == 47 || y == 2 || y == 47 ) && terrain.get(x, y) != 1 ){
                   costs_container.set(x, y, 100);
               }
           }
       }

       for ( f1 in Game.flags ) {
           if(  Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 9 ){
               costs_container.set(Game.flags[f1].pos.x, Game.flags[f1].pos.y, 255);
           }
       }
       //

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

           for (var cnt = 1; cnt <= 90; cnt++) {
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

       // merge cost matrix
       for (let y = 0; y <= 49; y++) {
         for (let x = 0; x <= 49; x++) {
           if( vv.get(x,y) > 0 ){
             costs_container.set(x, y, costs_container.get(x, y) + 50 );
           }
         }
       }
       //

       var end = new RoomPosition(Game.rooms[ rm ].memory.base_x, Game.rooms[ rm ].memory.base_y, rm)

       for ( f1 in Game.flags ) {
          if(  Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 5 ){

              var start = new RoomPosition(Game.flags[f1].pos.x, Game.flags[f1].pos.y, rm)

              var build_path = PathFinder.search(start, [{pos: end , range:4}], {plainCost: 11,swampCost: 11, roomCallback: function(roomName) { return costs_container; },} ).path

              for ( var i = 0 ; i < build_path.length ; i++){

                  var xx = build_path[i].x
                  var yy = build_path[i].y

                  if( costs_container.get( xx, yy ) != 7 && costs_container.get( xx, yy ) != 50 ){
                      Game.rooms[rm].memory.planner[Game.rooms[rm].memory.planner.length] = [xx, yy , 'road',24, 2300, '', 0] // buildPlannerRamparts
                      costs_container.set( xx, yy, 7 )
                  }
              }
          }
       }
    }
};

module.exports = BaseBuildPlannerRampartRoads;
