const Pathing       = require('pathing');
var FunctionBoost   = require('function.boost')

var roleSquad = {

    /** @param {Creep} creep **/
    run: function(creep) {

        pos2 = new RoomPosition(25, 25, creep.memory.birth_target);

        Game.map.visual.circle(creep.pos, {fill: '#ff0000', radius: 2, stroke: '#ff0000', opacity: 0.9 });
        Game.map.visual.line(creep.pos, pos2,{color: '#ff0000', lineStyle: 'dashed', width: 1 });

        var rm_tgt  = creep.memory.birth_target
        var rm      = creep.memory.birth

        if( creep.memory.boosted != 1 || !creep.memory.boosted ){
            FunctionBoost.run( creep )
        }


        // squad - rally on blue flag and get squad_number
        if ( creep.memory.boosted == 1 && !creep.memory.squaded ){

            for ( f1 in Game.flags ) {

                if ( Game.flags[f1].pos.roomName == rm && Game.flags[f1].color == 3 && Game.flags[f1].secondaryColor == 3 ) {

                    var xx = Game.flags[f1].pos.x
                    var yy = Game.flags[f1].pos.y

                    const pos = new RoomPosition(xx, yy, rm)
                    creep.moveTo(pos, {priority: 1000, visualizePathStyle: { stroke: '#0313fc', opacity: .5, strokeWidth: .1} })

                }
            }

            var rm_tgt = creep.memory.birth_target
            var birth_info_4 = creep.memory.birth_info_4

            var creep_temp = _.filter(Game.creeps, (creep) => creep.memory.role == 'squad' && creep.memory.birth == rm && creep.memory.birth_target == rm_tgt && creep.memory.boosted == 1 && creep.memory.birth_info_4 == birth_info_4 && !creep.memory.squad_number )

            if ( creep_temp.length >= 4 ) {

                var squad_number = Math.floor( Game.time * Math.random() );

                for ( var j = 0 ; j < creep_temp.length ; j++){
                    creep_temp[j].memory.squaded = 1
                    creep_temp[j].memory.squad_number = squad_number
                }
            }
        }
        //


        // organize squad - assign captain
        if ( creep.memory.boosted == 1 && creep.memory.squaded == 1 && !creep.memory.capt ){

            var squad_num = creep.memory.squad_number
            var creep_temp_1 = _.filter(Game.creeps, (creep) => creep.memory.role == 'squad' && creep.memory.birth == rm && creep.memory.boosted == 1 && creep.memory.squaded == 1 && creep.memory.birth_info_4 == birth_info_4 && creep.memory.squad_number == squad_num )

            if ( creep_temp_1.length == 4 ) {

                for ( var j = 0 ; j < creep_temp_1.length ; j++){

                    if ( creep_temp_1[j].memory.birth_info_2 == 1 ){

                        creep_temp_1[j].memory.role2 = 'squad_cpt'

                        for ( var k = 0 ; k < creep_temp_1.length ; k++){

                            if ( creep_temp_1[k].memory.birth_info_2 == 2 ){ creep_temp_1[j].memory.squad2 = creep_temp_1[k].name }
                            if ( creep_temp_1[k].memory.birth_info_2 == 3 ){ creep_temp_1[j].memory.squad3 = creep_temp_1[k].name }
                            if ( creep_temp_1[k].memory.birth_info_2 == 4 ){ creep_temp_1[j].memory.squad4 = creep_temp_1[k].name }

                        }
                    }

                    creep_temp_1[j].memory.capt = 1

                }
            }
        }
        //

        // unform if capt die
        if ( Game.time % 1 == 0 && creep.memory.boosted == 1 && creep.memory.squaded == 1 && creep.memory.capt == 1 ){

            var num = creep.memory.squad_number
            var creep_temp_1 = _.filter(Game.creeps, (creep) => creep.memory.role2 == 'squad_cpt' && creep.memory.squad_number && creep.memory.squad_number == num )

            if( creep_temp_1.length >= 1 ){
                // ok
            }
            else{
                if( creep.getActiveBodyparts(ATTACK) >= 1 || creep.getActiveBodyparts(RANGED_ATTACK) >= 1 || creep.getActiveBodyparts(WORK) >= 1 ){
                    creep.memory.role = 'blinker'
                }
                else{
                    creep.suicide()
                }
            }
        }




        //
        // position into memory
        //
        // initialize memory
        if( !creep.memory.pos_0_xx || !creep.memory.pos_0_yy ){ creep.memory.pos_0_xx  = creep.pos.x - 0; creep.memory.pos_0_yy  = creep.pos.y - 0; creep.memory.pos_0_rm  = creep.pos.roomName }
        if( !creep.memory.pos_1_xx || !creep.memory.pos_1_yy ){ creep.memory.pos_1_xx  = creep.pos.x - 1; creep.memory.pos_1_yy  = creep.pos.y - 1; creep.memory.pos_1_rm  = creep.pos.roomName }
        if( !creep.memory.pos_1_xx || !creep.memory.pos_2_yy ){ creep.memory.pos_2_xx  = creep.pos.x - 2; creep.memory.pos_2_yy  = creep.pos.y - 2; creep.memory.pos_2_rm  = creep.pos.roomName }
        if( !creep.memory.pos_2_xx || !creep.memory.pos_3_yy ){ creep.memory.pos_3_xx  = creep.pos.x - 3; creep.memory.pos_3_yy  = creep.pos.y - 3; creep.memory.pos_3_rm  = creep.pos.roomName }
        // memoryze path
        if( creep.pos.x != creep.memory.pos_0_xx || creep.pos.y != creep.memory.pos_0_yy ){
            creep.memory.pos_3_xx  = creep.memory.pos_2_xx
            creep.memory.pos_3_yy  = creep.memory.pos_2_yy
            creep.memory.pos_3_rm  = creep.memory.pos_2_rm

            creep.memory.pos_2_xx  = creep.memory.pos_1_xx
            creep.memory.pos_2_yy  = creep.memory.pos_1_yy
            creep.memory.pos_2_rm  = creep.memory.pos_1_rm

            creep.memory.pos_1_xx  = creep.memory.pos_0_xx
            creep.memory.pos_1_yy  = creep.memory.pos_0_yy
            creep.memory.pos_1_rm  = creep.memory.pos_0_rm

            creep.memory.pos_0_xx  = creep.pos.x
            creep.memory.pos_0_yy  = creep.pos.y
            creep.memory.pos_0_rm  = creep.pos.roomName
        }
        //

    }
};

module.exports = roleSquad;
