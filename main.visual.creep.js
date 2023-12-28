var visualCreep= {

    run: function( creep ) {

        if( creep.memory.role ){

            var role = creep.memory.role

            // room - greem
            if( role == 'hauler_rm' || role == 'balancer'  || role == 'harvester' || role == 'builder' || role == 'repairer' || role == 'upgrader' || 
                role == 'half_filler' || role == 'mineral' || role == 'hauler_rm_mineral' || role == 'lab_filler' || role == 'recycle' || role == 'burner' ) {
                Game.map.visual.circle(creep.pos, {fill: '#00FF00', radius: 1, stroke: '#00FF00', opacity: 1 });
            }
            // out of the room - blue
            else if( role == 'claimer' || role == 'colonizer'  || role == 'depo_harvest' || role == 'depo_collector' ||
                     role == 'mineralSK' || role == 'mineralSK_help' ) {
                Game.map.visual.circle(creep.pos, {fill: '#001eff', radius: 1, stroke: '#001eff', opacity: 1 });
            }
            // remotes - yellow
            else if( role == 'scout' || role == 'harvester_out'  || role == 'hauler_out' || role == 'reserver' ) {
                Game.map.visual.circle(creep.pos, {fill: '#f2ff00', radius: 1, stroke: '#f2ff00', opacity: 1 });
            }
            // militar - red
            else if( role == '2a_healer' || role == '2a_capt'  || role == 'defender' ) {
                Game.map.visual.circle(creep.pos, {fill: '#ff0000', radius: 1, stroke: '#ff0000', opacity: 1 });
            }
            // others - white
            else if( role == 's5_scorer_1container' || role == 's5_scorer_2static'  || role == 's5_scorer_3mover' ) {
                Game.map.visual.circle(creep.pos, {fill: '#ffffff', radius: 1, stroke: '#ffffff', opacity: 1 });
            }
            else{
                console.log("<font color=\"#FFA500\">Missing role "+ role + " on visual creep module</font>")
            }
            //

            // if( creep.pos.roomName != creep.memory.birth_target ){
            //     Game.map.visual.line(creep.pos, new RoomPosition(25, 25, creep.memory.birth_target),{color: '#fc0303', lineStyle: 'dashed', width: 0.3 });
            // }

        }
    }
};

module.exports = visualCreep;
