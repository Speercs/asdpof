var mainBasePlanner = require('main.base.planner0')
var mainBaseSpawn   = require('main.base.spawn0')
var mainVisualRoom  = require('main.visual.room')

var mainOneTimer    = require('main.oneTimer')
 //
var config          = require('aaa.config')
///
// var intel       = require('main.intel')
// var base1       = require('main.base1')
var baseRoles      = require('main.base.roles')
var mainBase       = require('main.base0')
var militar        = require('main.militar')
var militarRoles   = require('main.militar.roles')
var terminal       = require('main.terminal')
var power          = require('main.power')
var observer       = require('main.observer')
// var nuker       = require('main.nuker')
// var outpost     = require('main.outpost')
var remotes       = require('main.remotes')
var remotesRoles   = require('main.remotes.roles')
var expansion   = require('main.expansion')

var visualMap   = require('main.visual.map')
var visualCreep = require('main.visual.creep')
var utils       = require('utils')

var season      = require('main.season')

// var segmentMemory=require('main.segment_memory')
//
// var testeCall   = require('teste.call')
// var testeRoles  = require('teste.roles')

// 8d5fe101-1d92-4c9b-9404-9bcdc42cb7a0
// server = '212.237.39.60,1433' # to specify an alternate port
// database = 'qxz53g0wtm' 
// username = 'xrh03vceaf' 
// password = 'mypassword'

// cnxn_str = ("Driver={SQL Server};" // windows
//             "Server=212.237.39.60,1433;"
//             "Database=qxz53g0wtm;"
//             "UID=xrh03vceaf;"
//             "PWD=B1e2s3t4!!!;")

// import pyodbc
// cnxn_str = ("Driver={ODBC Driver 18 for SQL Server};" 
//             "Server=212.237.39.60,1433;"
//             "TrustServerCertificate=YES;"
//             "Database=qxz53g0wtm;"
//             "UID=xrh03vceaf;"
//             "PWD=B1e2s3t4!!!;")
// cnxn = pyodbc.connect(cnxn_str)
// cursor = cnxn.cursor()
// cursor.execute(stmt2)
// cnxn.commit() 

// cursor.execute("select * from table_name")


// import screepsapi
// TOKEN = "8d5fe101-1d92-4c9b-9404-9bcdc42cb7a0"
// api = screepsapi.API(token=TOKEN)

// oneT = api.memory('one_timer')['data']
// user = api.user_find("asdpof")

// data = oneT

// tablo =  "table_name"
// cols = ','.join([f" {k}" for k in data.keys()])
// vals = ','.join([f"'{k}'" for k in data.values()])
// stmt = f'INSERT INTO {tablo} ({cols}) VALUES ({vals})'

// cols2 = ' int ,'.join([f" {k}" for k in data.keys()])

// stmt = f'CREATE TABLE ( {tablo} ({cols2}) VALUES ({vals})'

// CREATE TABLE [database_name.][schema_name.]table_name (
//     pk_column data_type PRIMARY KEY,
//     column_1 data_type NOT NULL,
//     column_2 data_type,
//     ...,
//     table_constraints
// );

// stmt2 = f' CREATE TABLE table_name ( productionLab int , visualPlaner int , intelConstruction int , build int , sk_mining int , stronghold int , storage_loot int , power_banks int , deposits int , expansion int , report_minerals int , factory int , auto_attack int , harasser int )'

// data = pd.read_sql("SELECT TOP(100) * FROM table_name", cnxn)

// Main Loop
module.exports.loop = function () {

    // memhack
    if ( global.lastMemoryTick && global.LastMemory && Game.time == (lastMemoryTick + 1)) {
        delete global.Memory
        global.Memory = global.LastMemory
        RawMemory._parsed = global.LastMemory
    } else {
        Memory;
        global.LastMemory = RawMemory._parsed
    }
    lastMemoryTick = Game.time
    //

    console.log( 'Start=========================================================================================================================================================' )
    console.log( 'Game tick:', Game.time )

    console.log("<font color=\"#66d44a\">" + Game.time + "</font>")

    try{ config.run() }catch(error){ console.log('Error stack: '+error.stack);}

    if( !global.rooms ){
        global.rooms = {}
        global.reset = 1
    }
    else{
        global.reset = 0
    }

    if( !global.creeps ){
        global.creeps = {}
    }

    if( !Memory.hostile ){
        Memory.hostile = {}
    }        
    
    // room Stuff
    for(var name in Game.rooms) {
        var rm = name;
        if ( Game.rooms[rm].controller && Game.rooms[rm].controller.my ) {
            
            if( !global.rooms[rm] ){
                global.rooms[rm] = {}
            }
            
            // gambiarra para mudar de cõdigo MMO
            if( Game.time % 2 == 0 && 1==11){
                var spw_ob = Game.rooms[rm].find(FIND_MY_SPAWNS)
                if( spw_ob && spw_ob[0] && spw_ob[0].spawning && spw_ob[0].spawning.remainingTime == 0 ){
                    spw_ob[0].spawning.cancel()
                }
                if( spw_ob && spw_ob[1] && spw_ob[1].spawning && spw_ob[1].spawning.remainingTime == 0 ){
                    spw_ob[1].spawning.cancel()
                }
                if( spw_ob && spw_ob[2] && spw_ob[2].spawning && spw_ob[2].spawning.remainingTime == 0 ){
                    spw_ob[2].spawning.cancel()
                }
            }

            if( Game.cpu.bucket  > 500 ){
            
                // planner            
                try{
                    mainBasePlanner.run( rm )
                }
                catch(error){
                    console.log('Error stack: '+error.stack, rm);
                }           

                // base
                try{
                    mainBase.run( rm )
                }
                catch(error){
                    console.log('Error stack: '+error.stack, rm);
                }

                // remotes (needs to be before spawn due to heap data)
                try{
                    remotes.run( rm )
                }
                catch(error){
                    console.log('Error stack: '+error.stack, rm);
                }

                // spawn            
                try{
                    if( Game.cpu.bucket > 1000 ){
                        mainBaseSpawn.run( rm )
                    }
                }
                catch(error){
                    console.log('Error stack: '+error.stack, rm);
                }

                // visual room            
                try{
                    mainVisualRoom.run( rm )
                }
                catch(error){
                    console.log('Error stack: '+error.stack, rm);
                }
            

                // observer
                try{                
                    observer.run( rm )
                    // nuker.run( rm )               
                }
                catch(error){
                    console.log('Error stack: '+error.stack, rm);
                }


                // militar
                try{                
                    militar.run( rm )
                }
                catch(error){
                    console.log('Error stack: '+error.stack, rm);
                }
        
                // season
                if( 1==11 ){
                    try{                
                        season.run( rm )
                    }
                    catch(error){
                        console.log('Error stack: '+error.stack, rm);
                    } 
                }
            }           
        }
        else{
            delete Memory.rooms[rm]
        }
    } 


    // power creeps
    try{            
        power.run(  )
    }
    catch(error){
        console.log('Error stack: '+error.stack);
    }
    //

    // creeps
    for(var name in Memory.creeps) {

        var cpu_creep = Game.cpu.getUsed()

        var runned = 0
        var creep  = Game.creeps[name];

        // clean memory
        if( !creep ) {
            delete Memory.creeps[name];
        }
        // roles loop
        else if( creep.spawning == false && 
                 ( !creep.memory.cpu_load || creep.memory.cpu_load == 0 ) ){

            try{
                // Base Roles
                if( runned == 0 ){
                    var runned = baseRoles.run( creep )
                }

                // Militar Roles                
                if( runned == 0 ){
                    var runned = militarRoles.run( creep )
                }

                // Remote Roles                  
                if( runned == 0 ){
                    var runned = remotesRoles.run( creep )
                } 
              
            }
            catch(error){
                console.log(creep.name, creep.pos.roomName, creep.pos.x, creep.pos.y );
                console.log('Error stack: '+error.stack);
            }
            
            // visual creep
            if( Game.cpu.bucket  > 500 ){
                try{
                    visualCreep.run( creep )
                }
                catch(error){
                    console.log('Error stack: '+error.stack, creep);
                }
            }
            
            // log cpu use
            if( 1==1 ){
                if( creep.memory.role ){
                    
                    if( !Memory.stats.roles || (Game.time - Memory.stats.roles.tick) >= 1  ){
                        Memory.stats.roles = {}
                        Memory.stats.roles.tick = Game.time
                    }
                    
                    if( !Memory.stats.roles[creep.memory.role] ){
                        Memory.stats.roles[creep.memory.role] = {}
                        Memory.stats.roles[creep.memory.role].cnt = 0
                        Memory.stats.roles[creep.memory.role].cpu = 0 
                        Memory.stats.roles[creep.memory.role].avg = 0 
                    }
                    
                    Memory.stats.roles[creep.memory.role].cnt = Memory.stats.roles[creep.memory.role].cnt + 1
                    Memory.stats.roles[creep.memory.role].cpu = Memory.stats.roles[creep.memory.role].cpu + ( Game.cpu.getUsed() - cpu_creep )
                    Memory.stats.roles[creep.memory.role].avg = Memory.stats.roles[creep.memory.role].cpu / Memory.stats.roles[creep.memory.role].cnt
                    
                }
            }
        }
        
        
        // cpu use loop halt
        if( creep && creep.memory.role != 'squad' && creep.memory.role != '2a_capt' && creep.memory.role != '2a_healer' && creep.memory.role != 'blinker' && creep.memory.role != 'defender' && 
            creep.memory.role != 'defenderRampart' ){
            if( Game.cpu.getUsed() - cpu_creep > 3 ){
                console.log( 'bug, cpu used for creep:', Game.cpu.getUsed() - cpu_creep, creep.pos.roomName, creep.memory.role, creep.memory.cpu_load )
                if( Game.cpu.getUsed() - cpu_creep > 15 ){
                    if( creep.memory.cpu_load ){
                        creep.memory.cpu_load = creep.memory.cpu_load + 15
                    }
                    else{
                        creep.memory.cpu_load = 10
                    }
                }
            }
            else{
                if( creep.memory.cpu_load ){
                    creep.memory.cpu_load = Math.max( creep.memory.cpu_load - 1, 0)
                }
            }
        }
        //
    }
    Pathing.runMoves();   
    
    
    // not room or creep
    if( Game.cpu.bucket  > 500 ){

        // auto expansion    
        try{
            if( Memory.oneTimer.expansion == 1 ){
                expansion.run(  )
            }
        }
        catch(error){
            console.log('Error stack: '+error.stack, 'expansion');
        }
        //

        // terminal
        try{            
            terminal.run(  )
        }
        catch(error){
            console.log('Error stack: '+error.stack);
        }
        //        

        // visual map
        try{            
            visualMap.run( )
        }
        catch(error){
            console.log('Error stack: '+error.stack);
        }

        // utils
        try{
            utils.run()
        }
        catch(error){
            console.log('Error stack: '+error.stack);
        }
        // 
        
        // one-timer triggers
        try{
            mainOneTimer.run()
        }
        catch(error){
            console.log('Error stack: '+error.stack);
        }
        //
    }

    // creep count usage predictor         
    try{

        var update_freq = 100

        if( !Memory.cpuPredictor ){
            Memory.cpuPredictor = {}
            Memory.cpuPredictor.limit0 = Game.cpu.limit
            Memory.cpuPredictor.creeps0 = Game.cpu.limit / 0.4
            Memory.cpuPredictor.limit1 = 0
            Memory.cpuPredictor.creeps1 = 0
            Memory.cpuPredictor.creepsLimit = Memory.cpuPredictor.creeps0
            Memory.cpuPredictor.target = 8000
        }
        else{
            if( Game.time % update_freq == 0 && Memory.cpuPredictor.limit1 != 0 ){
                Memory.cpuPredictor.limit0 = Memory.cpuPredictor.limit1
                Memory.cpuPredictor.creeps0 = Memory.cpuPredictor.creeps1
                Memory.cpuPredictor.limit1 = 0
                Memory.cpuPredictor.creeps1 = 0
            }

            // var creep_cnt = _.filter( Game.creeps , (creep) => creep.ticksToLive <= 1499 ).length
            
            var creep_cnt = _.filter( Game.creeps , (creep) => creep.ticksToLive <= 1499 || creep.ticksToLive >= 2 ).length
            var creep_sp_cnt = _.filter( Game.creeps , (creep) => creep.spawning == true ).length
           
            Memory.cpuPredictor.limit1 = Memory.cpuPredictor.limit1 + Game.cpu.getUsed() //+ Math.max( Memory.cpuPredictor.target - Game.cpu.bucket, 0 ) / creep_cnt
            Memory.cpuPredictor.creeps1 = Memory.cpuPredictor.creeps1 + creep_cnt

            var creepCpu = ( (Memory.cpuPredictor.limit1 / Memory.cpuPredictor.creeps1) * (Game.time % update_freq) + (Memory.cpuPredictor.limit0 / Memory.cpuPredictor.creeps0) * ( update_freq - Game.time % update_freq ) ) / update_freq
            var cpuToUse = Math.max( -(Memory.cpuPredictor.target - Game.cpu.bucket) + update_freq * Game.cpu.limit,0)
            
            var new_limit = cpuToUse / creepCpu / update_freq 
            
            var bucket_delta = 10000 - Memory.cpuPredictor.target
            
            var max_delta = 0.5 / update_freq * Math.abs( Game.cpu.bucket - Memory.cpuPredictor.target ) / bucket_delta
            
            if( new_limit > Memory.cpuPredictor.creepsLimit && Game.cpu.bucket > Memory.cpuPredictor.target && ( creep_cnt + creep_sp_cnt ) >= Memory.cpuPredictor.creepsLimit ){
                var new_limit = Math.min( new_limit,  Memory.cpuPredictor.creepsLimit + max_delta )
            }
            else if( new_limit <= Memory.cpuPredictor.creepsLimit && Game.cpu.bucket < Memory.cpuPredictor.target ){
                var new_limit = Math.max( new_limit,  Memory.cpuPredictor.creepsLimit - max_delta )
            }
            else{
                var new_limit = Memory.cpuPredictor.creepsLimit
            }

            Memory.cpuPredictor.creepsLimit = new_limit 
            
            if(  Memory.stats ){
                Memory.stats.number_creeps = creep_cnt
                Memory.stats.number_creeps_2 = creep_cnt + creep_sp_cnt
                Memory.stats.creepsLimit = new_limit
            } 
        }

        console.log( 'Creeps predictor:', Math.round(Memory.cpuPredictor.creepsLimit), 'CPU per creep:', Math.round(creepCpu*1000)/1000,  'Current count:', creep_cnt, 'Target CPU:', Memory.cpuPredictor.target, 'pass:', Game.time % update_freq, 'Outpost max dist:', Math.round(Memory.config.outpost_max_dist * 10 ) / 10 )

    }
    catch(error){
        console.log('Error stack: '+error.stack+ 'cpu predictor');
    } 

    console.log('BUCKET:', Game.cpu.bucket , ' CPU used:', Math.round( Game.cpu.getUsed() * 10 ) / 10 )
    
    // cpu used log
    try{
        if( Memory.stats && Memory.stats.cpu ){
            Memory.stats.cpu.used = Math.round(Game.cpu.getUsed()) 
        }
    }
    catch(error){
        console.log('Error stack: '+error.stack+ 'cpu predictor');
    } 

}
