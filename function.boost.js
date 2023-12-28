var FunctionBoost = {

    run: function(creep) {

        var rm_tgt = creep.memory.birth_target
        var rm = creep.memory.birth

         // NO BOOST
        if ( creep.memory.birth_info_3 != 1 && creep.spawning == false  ){
            creep.memory.boosted = 1
        }
        //

        // Some error
        if ( creep.memory.birth_info_3  == 1 && creep.ticksToLive <= 1150 ){
            creep.memory.boosted = 1
        }
        //

        // boost phase 1
        if (creep.pos.roomName == rm && !creep.memory.boosted && Game.rooms[rm].memory.intel.lab ){

            xx = Game.rooms[rm].memory.base_x - 3
            yy = Game.rooms[rm].memory.base_y - 1

            // 0 4 8

            if ( creep.pos.x == xx && creep.pos.y == yy ){

                // 0
                if( Game.rooms[rm].memory.intel.lab[0] ){
                    var lab0_id = Game.rooms[rm].memory.intel.lab[0].id
                }
                else{
                    var lab0_id = null
                }

                // 4
                if( Game.rooms[rm].memory.intel.lab[4] ){
                    var lab4_id = Game.rooms[rm].memory.intel.lab[4].id
                }
                else{
                    var lab4_id = null
                }

                // 8
                if( Game.rooms[rm].memory.intel.lab[8] ){
                    var lab8_id = Game.rooms[rm].memory.intel.lab[8].id
                }
                else{
                    var lab8_id = null
                }

                // // 8
                // if( Game.rooms[rm].memory.intel.lab[8] ){
                //     var lab8_id = Game.rooms[rm].memory.intel.lab[8].id
                // }
                // else{
                //     var lab8_id = null
                // }

                var cnt = 0

                // 0
                if ( Game.getObjectById(lab0_id) ) {
                    if( Game.getObjectById(lab0_id).boostCreep(creep)== -5 || Game.getObjectById(lab0_id).boostCreep(creep)== -6 ) {
                        cnt = cnt + 1
                    }
                }
                else {
                    cnt = cnt + 1
                }

                // 2
                if ( Game.getObjectById(lab4_id) ) {
                    if( Game.getObjectById(lab4_id).boostCreep(creep)== -5 || Game.getObjectById(lab4_id).boostCreep(creep)== -6 ) {
                        cnt = cnt + 1
                    }
                }
                else {
                    cnt = cnt + 1
                }

                // 6
                if ( Game.getObjectById(lab8_id) ) {
                    if( Game.getObjectById(lab8_id).boostCreep(creep)== -5 || Game.getObjectById(lab8_id).boostCreep(creep)== -6 ) {
                        cnt = cnt + 1
                    }
                }
                else {
                    cnt = cnt + 1
                }

                // // 8
                // if ( Game.getObjectById(lab8_id) ) {
                //     if( Game.getObjectById(lab8_id).boostCreep(creep)== -5 || Game.getObjectById(lab8_id).boostCreep(creep)== -6 ) {
                //         cnt = cnt + 1
                //     }
                // }
                // else {
                //     cnt = cnt + 1
                // }

                // cnt cnt
                if ( cnt == 3 ){
                    creep.memory.boosted = 0.5
                }
            }
            else {

                var rm = creep.memory.birth
                const mid_pos = new RoomPosition(xx, yy, rm)
                creep.moveTo(mid_pos, {maxOps: 2000, range: 0, ignoreRoads: true, priority: Math.floor(Math.random() * 999) , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

            }
        }

        // boost phase 2
        if (creep.pos.roomName == rm && creep.memory.boosted == 0.5 ){

            xx = Game.rooms[rm].memory.base_x 
            yy = Game.rooms[rm].memory.base_y + 2

            // 1 7

            if ( creep.pos.x == xx && creep.pos.y == yy && Game.rooms[rm].memory.intel.lab){

                // 1
                if( Game.rooms[rm].memory.intel.lab[1] ){
                    var lab1_id = Game.rooms[rm].memory.intel.lab[1].id
                }
                else{
                    var lab1_id = null
                }

                // 7
                if( Game.rooms[rm].memory.intel.lab[7] ){
                    var lab7_id = Game.rooms[rm].memory.intel.lab[7].id
                }
                else{
                    var lab7_id = null
                }

                // 5
                // if( Game.rooms[rm].memory.intel.lab[5] ){
                //     var lab5_id = Game.rooms[rm].memory.intel.lab[5].id
                // }
                // else{
                //     var lab5_id = null
                // }

                // 6
                // if( Game.rooms[rm].memory.intel.lab[6] ){
                //     var lab6_id = Game.rooms[rm].memory.intel.lab[6].id
                // }
                // else{
                //     var lab6_id = null
                // }

                var cnt = 0

                // 1
                if ( Game.getObjectById(lab1_id) ) {
                    if( Game.getObjectById(lab1_id).boostCreep(creep)== -5 || Game.getObjectById(lab1_id).boostCreep(creep)== -6 ) {
                        cnt = cnt + 1
                    }
                }
                else {
                    cnt = cnt + 1
                }

                // 7
                if ( Game.getObjectById(lab7_id) ) {
                    if( Game.getObjectById(lab7_id).boostCreep(creep)== -5 || Game.getObjectById(lab7_id).boostCreep(creep)== -6 ) {
                        cnt = cnt + 1
                    }
                }
                else {
                    cnt = cnt + 1
                }

                // 5
                // if ( Game.getObjectById(lab5_id) ) {
                //     if( Game.getObjectById(lab5_id).boostCreep(creep)== -5 || Game.getObjectById(lab5_id).boostCreep(creep)== -6 ) {
                //         cnt = cnt + 1
                //     }
                // }
                // else {
                //     cnt = cnt + 1
                // }

                // 6
                // if ( Game.getObjectById(lab6_id) ) {
                //     if( Game.getObjectById(lab6_id).boostCreep(creep)== -5 || Game.getObjectById(lab6_id).boostCreep(creep)== -6 ) {
                //         cnt = cnt + 1
                //     }
                // }
                // else {
                //     cnt = cnt + 1
                // }

                // cnt cnt
                if ( cnt == 2 ){
                    creep.memory.boosted = 0.75
                }

            }
            else {

                var rm = creep.memory.birth
                const mid_pos = new RoomPosition(xx, yy, rm)
                creep.moveTo(mid_pos, {maxOps: 2000, range: 0, priority: Math.floor(Math.random() * 999) , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })

            }
        }
        //
        
        
        // boost phase 3
        if (creep.pos.roomName == rm && creep.memory.boosted == 0.75 ){

            xx = Game.rooms[rm].memory.base_x 
            yy = Game.rooms[rm].memory.base_y - 2
            
            if( creep.getActiveBodyparts(RANGED_ATTACK) >= 1 ){

                // 5
                if ( creep.pos.x == xx && creep.pos.y == yy && Game.rooms[rm].memory.intel.lab){
                    
                    // 5
                    if( Game.rooms[rm].memory.intel.lab[5] ){
                        var lab5_id = Game.rooms[rm].memory.intel.lab[5].id
                    }
                    else{
                        var lab5_id = null
                    }
    
                    var cnt = 0
    
                    // 5
                    if ( Game.getObjectById(lab5_id) ) {
                        if( Game.getObjectById(lab5_id).boostCreep(creep)== -5 || Game.getObjectById(lab5_id).boostCreep(creep)== -6 ) {
                            cnt = cnt + 1
                        }
                    }
                    else {
                        cnt = cnt + 1
                    }
    
                    // cnt cnt
                    if ( cnt == 1 ){
                        creep.memory.boosted = 1
                    }
    
                }
                else {
    
                    var rm = creep.memory.birth
                    const mid_pos = new RoomPosition(xx, yy, rm)
                    creep.moveTo(mid_pos, {maxOps: 2000, range: 0, priority: Math.floor(Math.random() * 999) , visualizePathStyle: {stroke: '#0313fc', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
    
                }
            }
            else{
                creep.memory.boosted = 1
            }
        }
        //

    }
}

module.exports = FunctionBoost;
