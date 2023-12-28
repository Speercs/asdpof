var FunctionCreepDamageCalc = {

    run: function(creep) {

        var creep_heal = 0 
        var creep_tough = 0
        var creep_attack = 0
        var creep_ranged = 0
        
        // map body parts
        if( creep ){

            if( creep.getActiveBodyparts( HEAL ) > 0 || 
                creep.getActiveBodyparts( ATTACK ) > 0 || 
                creep.getActiveBodyparts( RANGED_ATTACK ) > 0 ){

                for( var iii = 0; iii < creep.body.length; iii++ ){

                    // heal
                    if( creep.body[iii].type == HEAL  ){
                        if( creep.body[iii].boost == 'XLHO2'  ){
                            var creep_heal = creep_heal + 48
                        }
                        else if( creep.body[iii].boost == 'LHO2'  ){
                            var creep_heal = creep_heal + 36
                        }
                        else if( creep.body[iii].boost == 'LO'  ){
                            var creep_heal = creep_heal + 24
                        }
                        else {
                            var creep_heal = creep_heal + 12
                        }
                    }

                    // tough
                    if( creep.body[iii].type == TOUGH  ){
                        if( creep.body[iii].boost == 'XGHO2'  ){
                            var creep_tough = creep_tough + 70
                        }
                        else if( creep.body[iii].boost == 'GHO2'  ){
                            var creep_tough = creep_tough + 50
                        }
                        else if( creep.body[iii].boost == 'GO'  ){
                            var creep_tough = creep_tough + 30
                        }
                        else {
                            var creep_tough = creep_tough + 0
                        }
                    }

                    // attack
                    if( creep.body[iii].type == ATTACK  ){
                        if( creep.body[iii].boost == 'XUH2O'  ){
                            var creep_attack = creep_attack + 120
                        }
                        else if( creep.body[iii].boost == 'UH2O'  ){
                            var creep_attack = creep_attack + 90
                        }
                        else if( creep.body[iii].boost == 'UH'  ){
                            var creep_attack = creep_attack + 60
                        }
                        else {
                            var creep_attack = creep_attack + 30
                        }
                    }

                    // ranged attack - only range 1 distance
                    if( creep.body[iii].type == RANGED_ATTACK  ){
                        if( creep.body[iii].boost == 'XKHO2'  ){
                            var creep_ranged = creep_ranged + 40
                        }
                        else if( creep.body[iii].boost == 'KHO2'  ){
                            var creep_ranged = creep_ranged + 30
                        }
                        else if( creep.body[iii].boost == 'KO'  ){
                            var creep_ranged = creep_ranged + 20
                        }
                        else {
                            var creep_ranged = creep_ranged + 10
                        }
                    }
                }
            }
            //   
        }
        //
       
        return [creep_attack, creep_ranged, creep_heal, creep_tough]

    } 
}

module.exports = FunctionCreepDamageCalc;