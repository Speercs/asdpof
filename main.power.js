// outpost
var rolePowerCreep         = require('role.power_creep');

var mainPower = {

    run: function() {

        var pc_matrix = [
                            ['Deaf_01', '64f5b4f09e546c0c06e6ba6d'], // W13N59
                            ['Deaf_02', '64f27357723af8d519674e3a'], // W17N53
                            ['Deaf_03', '64f7a33e338a2380cea060ad'], // W18N52
                            ['Deaf_04', '64f6239c44df8cc93eeb51ab'], // W18N8
                            ['Deaf_05', '6504a5beb041fa50b9e79a5a'], // W59N18
                            ['Deaf_06', '64abc0f196304c3b704f16d3'] // W52N11
                          //  ['Deaf_07', '6324f954af1dbcd651aa6828'], // W22N55
                          //  ['Deaf_08', '63bae61a414b453336f71a91']  // W13N2
                        ]

        for ( var i = 0 ; i < pc_matrix.length ; i++){

            var pc = Game.powerCreeps[pc_matrix[i][0]]

            if( pc && pc.ticksToLive > 0 ) {
                rolePowerCreep.run(pc);
            }
            else{
                if( pc && !(Game.powerCreeps[pc_matrix[i][0]].spawnCooldownTime > 0 ) ) {
                    var obj = Game.getObjectById( pc_matrix[i][1] )
                    if( obj ){
                        pc.spawn(obj)
                    }
                }
            }
        }
    }
};

module.exports = mainPower;
