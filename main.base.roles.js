// basics screeps
var roleBaseHarvester       = require('role.base.harvester');
var roleBaseHauler_rm       = require('role.base.hauler_rm');
var roleBaseBalancer        = require('role.base.balancer');
var rolesBaseBuilder        = require('role.base.builder');
var rolesBaseUpgrader       = require('role.base.upgrader');
var rolesBaseRepairer       = require('role.base.repairer');
var rolesHalfFiller         = require('role.base.half_filler');
var roleBaseHarvesterMineral= require('role.base.harvester_mineral');
var roleBaseHauler_rmMineral= require('role.base.hauler_rm_mineral');

var roleBaseRecycle         = require('role.base.recycle');

// var roleBasicsHarvester_st    = require('role.basics.harvester_st');

var roleMineralSK             = require('role.mineral.sk');
var roleMineralSK_helper      = require('role.mineral.sk_help');

var roleBaseLab             = require('role.base.lab');
var roleBaseClaimer         = require('role.base.claimer');
var roleBaseColonizer       = require('role.base.colonizer');
var roleBaseHelper          = require('role.base.helper');

//
// var collectorSk               = require('role.militar.collector_sk')
// var roleMoverDonation         = require('role.militar.mover_donation')
//
var roleDepoHarvester         = require('role.depo.harvester')
var roleDepoCollector         = require('role.depo.collector')
var collector_pwr             = require('role.power.collector_pwr')
var mover                     = require('role.storage.mover')
//
// var scoutAuto                 = require('role.militar.scout_auto')

// SEASON5
var season5ReactorClaim      = require('role.season5.reactor_claim')
var season5Scorer_1container = require('role.season5.scorer 1container')
var season5Scorer_2static    = require('role.season5.scorer 2static')
var season5Scorer_3mover     = require('role.season5.scorer 3mover')

var BaseRoles= {

    run: function( creep ) {

        var result = 0
    
        if( Game.cpu.bucket > 500 ){
            if(creep.memory.role == 'hauler_rm' ) {
                roleBaseHauler_rm.run(creep);
                var result = 1
            }
            else if(creep.memory.role == 'balancer' ) {
                roleBaseBalancer.run(creep);
                var result = 1
            }        
            else if(creep.memory.role == 'harvester' ) {
                roleBaseHarvester.run(creep);
                var result = 1
            }
            else if(creep.memory.role == 'builder' ) {
                rolesBaseBuilder.run(creep);
                var result = 1
            }
            else if(creep.memory.role == 'repairer' ) {
                rolesBaseRepairer.run(creep);
                var result = 1
            } 
            else if(creep.memory.role == 'upgrader' ) {
                rolesBaseUpgrader.run(creep);
                var result = 1
            }        
            else if(creep.memory.role == 'half_filler' ) {
                rolesHalfFiller.run(creep);
                var result = 1
            }    
            else if(creep.memory.role == 'mineral' ) {
                roleBaseHarvesterMineral.run(creep);
                var result = 1
            }     
            else if(creep.memory.role == 'hauler_rm_mineral' ) {
                roleBaseHauler_rmMineral.run(creep);
                var result = 1
            }         
            else if(creep.memory.role == 'lab_filler' ) {
                roleBaseLab.run(creep);
                var result = 1
            } 
            else if(creep.memory.role == 'recycle' ) {
                roleBaseRecycle.run(creep);
                var result = 1
            }
            else if(creep.memory.role == 'burner' ) {
                creep.suicide()
                creep.moveTo(Game.rooms[creep.pos.roomName].controller, {range: 11, maxRooms: 1, priority: 1 , containerCost: 15, visualizePathStyle: {stroke: 'black', lineStyle: 'dashed', opacity: .5, strokeWidth: .1} })
            }
            // SK minera miners
            else if(creep.memory.role == 'mineralSK' ) {
                roleMineralSK.run(creep);
                var result = 1
            }
            else if(creep.memory.role == 'mineralSK_help' ) {
                roleMineralSK_helper.run(creep);
                var result = 1
            } 
            // power
            else if(creep.memory.role == 'collector_pwr' ) {
                collector_pwr.run(creep);
                var result = 1
            } 
            // storage
            else if(creep.memory.role == 'mover' ) {
                mover.run(creep);
                var result = 1
            } 
            // out of the room
            else if(creep.memory.role == 'claimer' ) {
                roleBaseClaimer.run(creep);
                var result = 1
            }
            else if(creep.memory.role == 'colonizer' ) {
                roleBaseColonizer.run(creep);
                var result = 1
            }        
            else if(creep.memory.role == 'helper' ) {
                roleBaseHelper.run(creep);
                var result = 1
            }             
            else if(creep.memory.role == 'depo_harvest' ) {
                roleDepoHarvester.run(creep);
                var result = 1
            }
            else if(creep.memory.role == 'depo_collector' ) {
                roleDepoCollector.run(creep);
                var result = 1
            }
        }

        // SEASON 5
        if(creep.memory.role == 's5_reactor_claim' ) {
            season5ReactorClaim.run(creep);
            var result = 1
        }
        else if(creep.memory.role == 's5_scorer_1container' ) {
            season5Scorer_1container.run(creep);
            var result = 1
        }
        else if(creep.memory.role == 's5_scorer_2static' ) {
            season5Scorer_2static.run(creep);
            var result = 1
        }
        else if(creep.memory.role == 's5_scorer_3mover' ) {
            season5Scorer_3mover.run(creep);
            var result = 1
        }


        

        // else if(creep.memory.role == 'harvester_st' ) {
        //     roleBasicsHarvester_st.run(creep);
        //     var result = 1
        // }
        // else if(creep.memory.role == 'balancer' ) {
        //     roleBasicsBalancer.run(creep);
        //     var result = 1
        // }
        // else if(creep.memory.role == 'labber' ) {
        //     roleBasicsLab.run(creep);
        //     var result = 1
        // }
        // else if(creep.memory.role == 'defenderRampart' ) {
        //     defenderRampart.run(creep);
        //     var result = 1
        // }
        // else if(creep.memory.role == 'collector_pwr' ) {
        //     collectorPwr.run(creep);
        //     var result = 1
        // }
        // else if(creep.memory.role == 'collector_sk' ) {
        //     collectorSk.run(creep);
        //     var result = 1
        // }
        // else if(creep.memory.role == 'mover' ) {
        //     mover.run(creep);
        //     var result = 1
        // }
       
        // else if(creep.memory.role == 'recycle' ) {
        //     roleBasicsRecycle.run(creep);
        //     var result = 1
        // }
        // else if(creep.memory.role == 'controller_att' ) {
        //     controller_att.run(creep);
        //     var result = 1
        // }
        // else if(creep.memory.role == 'controller_destroy' ) {
        //     controller_destroy.run(creep);
        //     var result = 1
        // }
        // else if(creep.memory.role == 'controller_reserver' ) {
        //     controller_reserver.run(creep);
        //     var result = 1
        // }
        // else if(creep.memory.role == 'scout_auto' ) {
        //     scoutAuto.run(creep);
        //     var result = 1
        // }
        //
        // else if(creep.memory.role == '2a_healer' ) {
        //     role2a_healer.run(creep);
        //     var result = 1
        // }
        // else if(creep.memory.role == '2a_capt' ) {
        //     role2a_capt.run(creep);
        //     var result = 1
        // }
        // else if(creep.memory.role == 'blinker' ) {
        //     roleA_blinker.run(creep);
        //     var result = 1
        // }
        //
    



        return result;

    }
};

module.exports = BaseRoles;
