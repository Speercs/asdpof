var FunctionCostMatrixDamageCreeps = {

    run: function(rm) {

      var freq_update = 1
      
      if( !global.rooms[ rm ] ){
            global.rooms[ rm ] = {}
      }

      if( Game.rooms[rm] && ( !global.rooms[ rm ].savedMatrixDamageCreeps_tick ||
                              ( Game.time - global.rooms[ rm ].savedMatrixDamageCreeps_tick ) >= freq_update ) ){

            var costs   = new PathFinder.CostMatrix;
            var terrain = Game.rooms[rm].getTerrain()

            var obj = Game.rooms[rm].find(FIND_HOSTILE_CREEPS, {filter: (creep) =>  {return ( _.intersection([creep.owner.username], Memory.config.ally_list).length == 0 &&
                                                                                            (creep.getActiveBodyparts(ATTACK) >= 1 || creep.getActiveBodyparts(RANGED_ATTACK) >= 1 ) ) } } )

            // creep damage map
            if( obj && obj.length>= 1 ){

                for ( var i = 0 ; i < obj.length ; i++){

                    var dmg_attack = 0
                    var dmg_ranged = 0

                    for ( var j = 0 ; j < obj[i].body.length ; j++){
                        // attack
                        if( obj[i].body[j].hits > 0 && obj[i].body[j].type == ATTACK ){
                            if( obj[i].body[j].boost && obj[i].body[j].boost == 'UH' ){
                                var dmg_attack = dmg_attack + 30 * 2
                            }
                            else if( obj[i].body[j].boost && obj[i].body[j].boost == 'UH2O' ){
                                var dmg_attack = dmg_attack + 30 * 3
                            }
                            else if( obj[i].body[j].boost && obj[i].body[j].boost == 'XUH2O' ){
                                var dmg_attack = dmg_attack + 30 * 4
                            }
                            else {
                                var dmg_attack = dmg_attack + 30 * 1
                            }
                        }
                        // ranged
                        else if( obj[i].body[j].hits > 0 && obj[i].body[j].type == RANGED_ATTACK ){
                            if( obj[i].body[j].boost && obj[i].body[j].boost == 'KO' ){
                                var dmg_ranged = dmg_ranged + 10 * 2
                            }
                            else if( obj[i].body[j].boost && obj[i].body[j].boost == 'KHO2' ){
                                var dmg_ranged = dmg_ranged + 10 * 3
                            }
                            else if( obj[i].body[j].boost && obj[i].body[j].boost == 'XKHO2' ){
                                var dmg_ranged = dmg_ranged + 10 * 4
                            }
                            else {
                                var dmg_ranged = dmg_ranged + 10 * 1
                            }
                        }
                    }
                    //


                    //
                    if( dmg_attack > 0 ){

                        for ( var xx = -2 ; xx <= 2 ; xx++){
                            for ( var yy = -2 ; yy <= 2 ; yy++){
                                var xxx = obj[i].pos.x + xx
                                var yyy = obj[i].pos.y + yy
                                if( xxx <= 49 && xxx >= 0 && yyy <= 49 && yyy >= 0 && terrain.get(xxx, yyy) != 1 ){
                                    costs.set(xxx, yyy, costs.get( xxx, yyy ) + dmg_attack / 12 /4  )
                                }
                            }
                        }
                    }
                    //
                    if( dmg_ranged > 0 ){

                        for ( var xx = -4 ; xx <= 4 ; xx++){
                            for ( var yy = -4 ; yy <= 4 ; yy++){
                                var xxx = obj[i].pos.x + xx
                                var yyy = obj[i].pos.y + yy
                                if( xxx <= 49 && xxx >= 0 && yyy <= 49 && yyy >= 0 && terrain.get(xxx, yyy) != 1 ){
                                    costs.set(xxx, yyy, costs.get( xxx, yyy ) + dmg_ranged / 12 /4  )
                                }
                            }
                        }
                    }
                    //
                }
            }

            global.rooms[ rm ].savedMatrixDamageCreeps      = costs;
            global.rooms[ rm ].savedMatrixDamageCreeps_tick = Game.time

        }
    }
}

module.exports = FunctionCostMatrixDamageCreeps;
