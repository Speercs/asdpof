var FunctionManualPath = {

    run: function(creep) {

        var portal          = 0

        var rm              = creep.memory.birth
        var rm_tgt          = creep.memory.birth_target

        if( !creep.memory.route_manual ){ creep.memory.route_manual = 0 }

        if( Game.shard.name == 'swc' ){

          //
          var route_matrix = [
                                    // rooms path
              // birth    type        room1    room2    room3    room4    room5    room6    room7    room8    room9    room10   room11   room12   room13  targets exclusion
              ['E29N19',  'portal1',  'E30N20','E20N30','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['E16N28','E11N28','E13N28','E18N29','E19N26','E17N25'],
                          []   ],

              ['E27N12',  'portal1',  'E30N10','E20N0','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['E19N2','E15N2','E16N1'],
                          []   ]





              ]


        }
        else {

          //
          var route_matrix = [
                                    // rooms path
              // birth    type        room1    room2    room3    room4    room5    room6    room7    room8    room9    room10   room11   room12   room13  targets exclusion
              ['W69N48',  'helper',   'W69N44','W67N44','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['W67N46'],
                          []   ],

              ['W58N26',  'portal1',  'W60N24','W50N24','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['W50N21','W50N22','W50N23','W50N24','W50N25','W51N23','W51N24'],
                          []   ],

              ['W18N8',  'portal1',  'W20N11','W30N11','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['W32N11'],
                          []   ],

              ['W74N41',  'portal3',  'W74N40','W74N30','W75N30','W75N20','W80N20','W80N0',      '',      '',      '',      '',      '',      '',      '',
                          ['W79S5','W79S5'],
                          []   ],

              ['W71N31',  'portal1',  'W71N30','W71N20','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['W71N20','W70N20','W72N20','W70N21','W70N22'],
                          []   ],

              ['W71N31',  'portal1',  'W70N33','W80N33','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['W79N32','W80N31','W80N32'],
                          []   ],

              ['W71N31',  'portal1',  'W69N30','W69S10','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['W71S9','W74S8','W75S8','W78S9','W79S7'],
                          []   ],

              ['W59N18',  'portal1',  'W60N21','W50N21','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['W51N23','W51N24','W50N23','W50N24','W50N22'],
                          []   ],

              ['W59N18',  'portal2',  'W60N21','W70N21','W71N20','W71N0',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['W71S1','W74S1','W72S2','W71S4','W79S3','W71S2'],
                          []   ],

              ['W39N53',  'portal1',  'W40N53','W70N53','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['W68N56'],
                          ['W69N53','W69N54','W69N55']   ],

              ['W61N69',  'portal1',  'W60N70','W30N40','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['W28N41'],
                          ['W29N41']   ],

              // birth    type        room1    room2    room3    room4    room5    room6    room7    room8    room9    room10   room11   room12   room13  targets exclusion
              ['W71N31',  'portal1',  'W70N31','W60N31','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['W58N26'],
                          []   ],

              // birth    type        room1    room2    room3    room4    room5    room6    room7    room8    room9    room10   room11   room12   room13  targets exclusion
              ['W61N69',  'portal1',  'W60N69','W0N69','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['E2N69','E2N68'],
                          ['E2N70','E1N69','W0N70','E0N69']   ],

              // birth    type        room1    room2    room3    room4    room5    room6    room7    room8    room9    room10   room11   room12   room13  targets exclusion
              ['W69N71',  'portal1',  'W60N69','W0N69','',      '',      '',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['E2N69','E2N68'],
                          ['E2N70','E1N69','W0N70','E0N69']   ],


              // // birth    type        room1    room2    room3    room4    room5    room6    room7    room8    room9    room10   room11   room12   room13  targets exclusion
              // ['E39N48',  'portal2',  'E39N50','E39N60','E40N58','E30N58','',      '',      '',      '',      '',      '',      '',      '',      '',
              //             ['E31N64'],
              //             []   ],

              // birth    type        room1    room2    room3    room4    room5    room6    room7    room8    room9    room10   room11   room12   room13  targets exclusion
              ['W8N48',   'portal3',  'W10N49','W20N49','W19N50','W19N40','W20N39','W30N39',      '',      '',      '',      '',      '',      '',      '',
                          ['W28N41'],
                          []   ],

              // birth    type        room1    room2    room3    room4    room5    room6    room7    room8    room9    room10   room11   room12   room13  targets exclusion
              ['W18N52',  'portal3',  'W19N50','W19N40','W22N40','W22N30','W21N30','W21N10',      '',      '',      '',      '',      '',      '',      '',
                          ['W18N8','W19N12','W17N11','W15N13','W16N9','W13N11','W15N8','W16N7'],
                          []   ],

              // birth    type        room1    room2    room3    room4    room5    room6    room7    room8    room9    room10   room11   room12   room13  targets exclusion
              ['W13N59',  'portal1',  'W10N60' ,'W0N60','','','',      '',      '',      '',      '',      '',      '',      '',      '',
                          ['E3N61'],
                          []   ]



              ]

        }



        //
        for ( var i = 0 ; i < route_matrix.length ; i++){

            var run = 0

            if( route_matrix[i][0] == rm ){

                for ( var j = 0 ; j < route_matrix[i][15].length ; j++){

                    if( route_matrix[i][15][j] == rm_tgt ){


                        // helper - manual routing for hard paths
                        if( route_matrix[i][1] == 'helper' ){

                            var avoidRooms_mt   = route_matrix[i][16]
                            var rm_cur          = creep.pos.roomName

                            // room1
                            if( creep.memory.route_manual == 0 ){
                                var rm_tgt = route_matrix[i][2]
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][3]  }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 1 ; creep.memory.path_to_room = null}
                            }
                            else if( creep.memory.route_manual == 1 ){
                                var rm_tgt = route_matrix[i][3]
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][2] }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 2 ; creep.memory.path_to_room = null}
                            }

                            else if( creep.memory.route_manual == 2 ){
                                if( creep.memory.harvesting == false ){ var rm_tgt = creep.memory.birth }
                            }

                            var run = 1
                            break;
                        }
                        //


                        // one portals
                        if( route_matrix[i][1] == 'portal1' ){

                            var avoidRooms_mt   = route_matrix[i][16]
                            var rm_cur          = creep.pos.roomName

                            // portal 1
                            if( creep.memory.route_manual == 0 ){
                                var rm_tgt = route_matrix[i][2]
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][3]  }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 1 ; creep.memory.path_to_room = null}
                            }
                            else if( creep.memory.route_manual == 1 ){
                                var rm_tgt = route_matrix[i][3]
                                var portal = 1
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][2] }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 2 ; creep.memory.path_to_room = null}
                            }

                            else if( creep.memory.route_manual == 2 ){
                                var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][2]])
                                if( creep.memory.harvesting == false ){ var rm_tgt = creep.memory.birth }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = route_matrix[i][16] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][3]]) }
                            }

                            var run = 1
                            break;
                        }
                        //


                        // two portals
                        if( route_matrix[i][1] == 'portal2' ){

                            var avoidRooms_mt   = route_matrix[i][16]
                            var rm_cur          = creep.pos.roomName

                            // portal 1
                            if( creep.memory.route_manual == 0 ){
                                var rm_tgt = route_matrix[i][2]
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][5]  }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 1 ; creep.memory.path_to_room = null}
                            }
                            else if( creep.memory.route_manual == 1 ){
                                var rm_tgt = route_matrix[i][3]
                                var portal = 1
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][4] }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 2 ; creep.memory.path_to_room = null}
                            }

                            // portal 2
                            else if( creep.memory.route_manual == 2 ){
                                var rm_tgt = route_matrix[i][4]
                                var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][2]])
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][3] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = route_matrix[i][16] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][5]]) }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 3 ; creep.memory.path_to_room = null}
                            }
                            else if( creep.memory.route_manual == 3 ){
                                var rm_tgt = route_matrix[i][5]
                                var portal = 1
                                var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][3]])
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][2] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = route_matrix[i][16] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][4]]) }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 4 ; creep.memory.path_to_room = null}
                            }

                            else if( creep.memory.route_manual == 4 ){
                                var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][4]])
                                if( creep.memory.harvesting == false ){ var rm_tgt = creep.memory.birth }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = route_matrix[i][16] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][3]]) }
                            }

                            var run = 1
                            break;
                        }
                        //


                        // three portals
                        if( route_matrix[i][1] == 'portal3' ){

                            var avoidRooms_mt   = route_matrix[i][16]
                            var rm_cur          = creep.pos.roomName

                            // portal 1
                            if( creep.memory.route_manual == 0 ){
                                var rm_tgt = route_matrix[i][2]
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][7]  }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 1 ; creep.memory.path_to_room = null}
                            }
                            else if( creep.memory.route_manual == 1 ){
                                var rm_tgt = route_matrix[i][3]
                                var portal = 1
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][6] }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 2 ; creep.memory.path_to_room = null}
                            }

                            // portal 2
                            else if( creep.memory.route_manual == 2 ){
                                var rm_tgt = route_matrix[i][4]
                                var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][2]])
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][5] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = route_matrix[i][16] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][7]]) }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 3 ; creep.memory.path_to_room = null}
                            }
                            else if( creep.memory.route_manual == 3 ){
                                var rm_tgt = route_matrix[i][5]
                                var portal = 1
                                var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][3]])
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][4] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = route_matrix[i][16] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][6]]) }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 4 ; creep.memory.path_to_room = null}
                            }

                            // portal 3
                            else if( creep.memory.route_manual == 4 ){
                                var rm_tgt = route_matrix[i][6]
                                var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][4]])
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][3] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = route_matrix[i][16] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][5]]) }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 5 ; creep.memory.path_to_room = null}
                            }
                            else if( creep.memory.route_manual == 5 ){
                                var rm_tgt = route_matrix[i][7]
                                var portal = 1
                                var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][5]])
                                if( creep.memory.harvesting == false ){ var rm_tgt = route_matrix[i][2] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = route_matrix[i][16] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][4]]) }
                                if( rm_cur == rm_tgt ){ creep.memory.route_manual = 6 ; creep.memory.path_to_room = null}
                            }

                            else if( creep.memory.route_manual == 6 ){
                                var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][6]])
                                if( creep.memory.harvesting == false ){ var rm_tgt = creep.memory.birth }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = route_matrix[i][16] }
                                if( creep.memory.harvesting == false ){ var avoidRooms_mt   = _.union(avoidRooms_mt, [route_matrix[i][3]]) }
                            }

                            var run = 1
                            break;
                        }
                        //

                    }
                }

                // break
                if( run == 1 ){ break; }
            }
        }


        if( run == 0 ){
            if( creep.memory.harvesting == false ){ var rm_tgt = creep.memory.birth }
        }

        return [ avoidRooms_mt, rm_tgt, portal ];

    }
}

module.exports = FunctionManualPath;
