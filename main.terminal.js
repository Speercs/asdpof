// outpost
var TerminalBalancer  = require('main.terminal.balance')
var TerminalBooster   = require('main.terminal.booster')
var Lab               = require('main.terminal.lab')
var Market            = require('main.terminal.market')

var MainTerminal= {

    run: function( ) {

        // // Terminal Booster
        TerminalBooster.run(  )

        // Terminal
        TerminalBalancer.run(  )
    
        // Market
        Market.run(  )

        // LAB
        if( Game.time % Memory.config.freq_lab == 0 || Memory.oneTimer.lab > 0 ){

            Lab.run(  )
        }
    }
};

module.exports = MainTerminal;
