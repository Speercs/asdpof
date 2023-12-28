var FunctionStaticCount = {
    run: function(creep) {

        // initialize memory
        if( !creep.memory.pos_0_xx  ){ 
            creep.memory.pos_0_xx  = creep.pos.x - 0; 
            creep.memory.pos_0_yy  = creep.pos.y - 0; 
            creep.memory.pos_0_rm  = creep.pos.roomName 
        
            creep.memory.pos_1_xx  = creep.pos.x - 1; 
            creep.memory.pos_1_yy  = creep.pos.y - 1; 
            creep.memory.pos_1_rm  = creep.pos.roomName 
        
            creep.memory.pos_2_xx  = creep.pos.x - 2; 
            creep.memory.pos_2_yy  = creep.pos.y - 2; 
            creep.memory.pos_2_rm  = creep.pos.roomName 
        
            creep.memory.pos_3_xx  = creep.pos.x - 3; 
            creep.memory.pos_3_yy  = creep.pos.y - 3; 
            creep.memory.pos_3_rm  = creep.pos.roomName 
        }
        //

        // static count
        if( creep.pos.x == creep.memory.pos_0_xx && creep.pos.y == creep.memory.pos_0_yy && creep.fatigue == 0 ){
            if( creep.memory.static_cnt >= 0   ){
                creep.memory.static_cnt = creep.memory.static_cnt + 1
            }
            else{
                creep.memory.static_cnt = 0
            }
        }
        else if( !(creep.pos.x == creep.memory.pos_0_xx && creep.pos.y == creep.memory.pos_0_yy) ){
            creep.memory.static_cnt = 0

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
}

module.exports = FunctionStaticCount;
