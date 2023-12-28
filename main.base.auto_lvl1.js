var base1Auto_lvl1= {

    run: function( kk, rm_tgt ) {
        
        var change_in_matrix = 1
                        
        if( !Memory.attack_list[kk].fixed_threat || Memory.attack_list[kk].fixed_threat < 10000 ){
             // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
            var roles = [ 
                ['scout_auto',         0,  1,     0,    2,      0,       0,       0,      0,     0,       0,     '',       0,      rm_tgt , 10,       '0',            '0',            '10',        '0'    ]
                ]
        }
        else{
             // role,        actual,     total,  tough,  move,   work,   carry,  attack, ranged, heal,   claim,  ,body   ,ticks  ,target-info  ,priority ,info2 (pos)    ,info3 (boost)  ,info4      ,info5 
            var roles = [ 
                ['scout_auto',         0,  1,     0,    5,      0,       0,       0,      0,     0,       0,     '',       0,      rm_tgt , 10,       '0',            '0',            '10',        '0'    ]
                ]
        }
        
        return [ change_in_matrix, roles ];
    }
};

module.exports = base1Auto_lvl1;