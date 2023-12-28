var FunctionCostMatrixDamageTower = {

    run: function(rm) {

        var freq_update = 5
        
        if( !global.rooms[ rm ] ){
            global.rooms[ rm ] = {}
        }


        if( Game.rooms[rm] && (  !global.rooms[ rm ].savedMatrixDamageTower_tick ||
                                ( Game.time - global.rooms[ rm ].savedMatrixDamageTower_tick ) > freq_update ) ){

            if( !global.rooms[ rm ].towers_tick || global.rooms[ rm ].towers_tick != Game.time ){
                global.rooms[ rm ].towers_tick = Game.time
                global.rooms[ rm ].towers = Game.rooms[rm].find(FIND_HOSTILE_STRUCTURES, {filter: (structure) =>  {return (  ( !structure.owner || _.intersection([structure.owner.username], Memory.config.ally_list).length == 0  ) &&
                                                                                                                              structure.structureType == STRUCTURE_TOWER &&
                                                                                                                              structure.store['energy'] > 0
                                                                                                                              ) } })
            }

            var costs   = new PathFinder.CostMatrix;
            var terrain = Game.rooms[rm].getTerrain()

            var obj = global.rooms[ rm ].towers
            //var obj = Game.rooms[rm].find(FIND_STRUCTURES, {filter: (structure) => {return ( structure.structureType == STRUCTURE_TOWER ) } } )

            // tower damage map
            if( obj && obj.length>= 1 ){
                for ( var i = 0 ; i < obj.length ; i++){

                    for (let y = 0; y <= 49; y++) {
                        for (let x = 0; x <= 49; x++) {
                            if( terrain.get(x, y) != 1 ){

                                var rng = Math.max( Math.abs(obj[i].pos.x - x), Math.abs(obj[i].pos.y - y))

                                if( rng >= 20 ){
                                    var dmg = 150
                                }
                                else if( rng <= 5 ){
                                    var dmg = 600
                                }
                                else{
                                    var dmg = 600-(rng-5)*30
                                }

                                costs.set(x, y, costs.get( x, y ) + dmg / 12 / 4 )
                                // costs.set(x, y, costs.get( x, y ) + Math.ceil( dmg / 12 / 4 ) )
                            }
                            else{
                                //
                            }
                        }
                    }
                }
            }
            //

            global.rooms[ rm ].savedMatrixDamageTower       = costs;
            global.rooms[ rm ].savedMatrixDamageTower_tick  = Game.time

        }
    }
}

module.exports = FunctionCostMatrixDamageTower;
