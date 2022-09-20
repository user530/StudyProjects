/* Walk like an Egyptian, game project */

//Main music theme - 8-bit Desert Tune by OkamiDeluxe (https://www.youtube.com/watch?v=7CaoOAgagxM)
//All other sounds are from the freesound.org

//Big thanks to my friend Odv for his invaluable feedback and testing.

// This game is my little tribute to all this hardcore NES and Arcade platformers. It is INTENTIONALLY hard. Some areas may look unbeatable, but everything was playtested and beat several times, so it's definitely doable.

//To test this game one can use mouse click - to avoid hard jumps, modify the live count, change the enemy's speed or even to change starting position.

var isRight;
var isLeft;
var isJumping;

var platforms = []

var collectables = [];
var hearts = [];
var enemies1 = [];
var enemies1_ind = [];
var enemies2 = [];
var enemies2_info = [];
var flag;
var level_start;
var restart_point;
var timer; 
var character;

var movinig_platforms = [];

var vanishing_platforms = [];

var bg;
var mountain;
var sun;
var clouds;
var trees = [];

var g;
var ver_speed;
var cam_pos;
var v;
var jump;
var level_width;
var game_score;
var game_over;
var lives;
var UI_pos;

var BGM;
var sound_jump;
var sound_hit;
var sound_pickup;
var sound_win;
var sound_lose;

//---Resets everything to start a new game, initialize all variables 
function new_game()
{
        //Length of the level
    level_width = 11000;
    
        //Internal timer, because frameCount does not reset its value when game is restarted
    timer = 0;
    
        //Creating level, last platfrom blocks the entrance roof at the start
    platforms = [{x: 0,
                  rel_x: 0,
                  y: 500,
                  width: 500,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 620,
                  rel_x: 620,
                  y: 500,
                  width: 200,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 820,
                  rel_x: 820,
                  y: 460,
                  width: 120,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 940,
                  rel_x: 940,
                  y: 420,
                  width: 100,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 1040,
                  rel_x: 1040,
                  y: 500,
                  width: 240,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 1105,
                  rel_x: 1105,
                  y: 280,
                  width: 110,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 1280,
                  rel_x: 1260,
                  y: 420,
                  width: 100,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 1380,
                  rel_x: 1380,
                  y: 460,
                  width: 120,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 1500,
                  rel_x: 1500,
                  y: 500,
                  width: 200,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 1400,
                  rel_x: 1400,
                  y: 220,
                  width: 200,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 1750,
                  rel_x: 1750,
                  y: 180,
                  width: 200,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 1800,
                  rel_x: 1800,
                  y: 500,
                  width: 150,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 2070,
                  rel_x: 2070,
                  y: 290,
                  width: 80,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 2320,
                  rel_x: 2320,
                  y: 540,
                  width: 80,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 2400,
                  rel_x: 2400,
                  y: 500,
                  width: 100,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 2500,
                  rel_x: 2500,
                  y: 460,
                  width: 100,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 2400,
                  rel_x: 2400,
                  y: 300,
                  width: 50,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 2550,
                  rel_x: 2550,
                  y: 180,
                  width: 50,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 2330,
                  rel_x: 2330,
                  y: 60,
                  width: 50,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 2750,
                  rel_x: 2750,
                  y: 500,
                  width: 300,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 3150,
                  rel_x: 3150,
                  y: 300,
                  width: 50,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 3300,
                  rel_x: 3300,
                  y: 400,
                  width: 300,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 3750,
                  rel_x: 3750,
                  y: 450,
                  width: 150,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 3900,
                  rel_x: 3900,
                  y: 500,
                  width: 500,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 3980,
                  rel_x: 3980,
                  y: 120,
                  width: 200,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 4400,
                  rel_x: 4400,
                  y: 440,
                  width: 150,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 4330,
                  rel_x: 4330,
                  y: 180,
                  width: 50,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 4550,
                  rel_x: 4550,
                  y: 400,
                  width: 150,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 4550,
                  rel_x: 4550,
                  y: 140,
                  width: 50,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 4700,
                  rel_x: 4700,
                  y: 300,
                  width: 200,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 5050,
                  rel_x: 5050,
                  y: 400,
                  width: 150,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 5350,
                  rel_x: 5350,
                  y: 150,
                  width: 150,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 5650,
                  rel_x: 5650,
                  y: 210,
                  width: 300,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],  
                  ethereal: false},
                 {x: 5680,
                  rel_x: 5680,
                  y: 420,
                  width: 50,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 5850,
                  rel_x: 5850,
                  y: 480,
                  width: 50,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 6000,
                  rel_x: 6000,
                  y: 550,
                  width: 50,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 6150,
                  rel_x: 6150,
                  y: 250,
                  width: 120,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 6225,
                  rel_x: 6225,
                  y: 490,
                  width: 120,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 6500,
                  rel_x: 6500,
                  y: 450,
                  width: 200,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 6765,
                  rel_x: 6765,
                  y: 150,
                  width: 50,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 6880,
                  rel_x: 6880,
                  y: 450,
                  width: 200,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 6880,
                  rel_x: 6880,
                  y: 450,
                  width: 200,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 7220,
                  rel_x: 7220,
                  y: 370,
                  width: 100,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 7450,
                  rel_x: 7450,
                  y: 250,
                  width: 100,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 7700,
                  rel_x: 7700,
                  y: 120,
                  width: 100,
                  height: 600,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 7950,
                  rel_x: 7950,
                  y: 100,
                  width: 50,
                  height: 600,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 8000,
                  rel_x: 8000,
                  y: 100,
                  width: 400,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 8070,
                  rel_x: 8070,
                  y: 340,
                  width: 50,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 8120,
                  rel_x: 8120,
                  y: 550,
                  width: 100,
                  height: 300,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 8120,
                  rel_x: 8120,
                  y: 340,
                  width: 130,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 8390,
                  rel_x: 8390,
                  y: 340,
                  width: 250,
                  height: 50,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 8530,
                  rel_x: 8530,
                  y: 550,
                  width: 300,
                  height: 200,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 8550,
                  rel_x: 8550,
                  y: -200,
                  width: 100,
                  height: 590,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 8980,
                  rel_x: 8980,
                  y: 475,
                  width: 120,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 9100,
                  rel_x: 9100,
                  y: 425,
                  width: 120,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 9220,
                  rel_x: 9220,
                  y: 375,
                  width: 120,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 9340,
                  rel_x: 9340,
                  y: 325,
                  width: 120,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 9460,
                  rel_x: 9460,
                  y: 275,
                  width: 120,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 9580,
                  rel_x: 9580,
                  y: 225,
                  width: 120,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 9700,
                  rel_x: 9700,
                  y: 175,
                  width: 120,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: 9820,
                  rel_x: 9820,
                  y: 300,
                  width: 1200,
                  height: 500,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 3,
                  border_color: [50, 50, 50, 255],
                  ethereal: false},
                 {x: -100,
                  rel_x: -100,
                  y: 250,
                  width: 100,
                  height: 150,
                  fill_color: [255, 248, 220, 255],
                  border_stroke: 0,
                  border_color: [50, 50, 50, 255],
                  ethereal: false}]

        //Initializing movement options for some platforms
    movinig_platforms = [{index: 11, move: "hor", period: 20, sway: 6},
                        {index: 20, move: "ver", period: 30, sway: 3},
                        {index: 31, move: "ver", period: 30, sway: 6},
                        {index: 39, move: "ver", period: 30, sway: 6},
                        {index: 40, move: "ver", period: 30, sway: 3},
                        {index: 42, move: "hor", period: 2, sway: 2},
                        {index: 43, move: "hor", period: 4, sway: 4},
                        {index: 44, move: "hor", period: 6, sway: 3},
                        {index: 47, move: "ver", period: 60, sway: 1.8},
                        {index: 48, move: "hor", period: 30, sway: 5}];

        //Initializing vanishing options for some platforms
    vanishing_platforms = [{index: 5, on: 3, off: 2},
                           {index: 16, on: 3, off: 3},
                           {index: 17, on: 2, off: 1},
                           {index: 18, on: 1.5, off: 2},
                           {index: 26, on: 2, off: 1},
                           {index: 28, on: 1, off: 2}];
    
        //Initializing game character
    character = {x: 100,
                 rel_x: 100,
                 y: 289,
                 width: 50,
                 height: 80,
                 col_skin: [210, 180, 140],
                 col_cloth_1:[0, 0, 255],
                 col_cloth_2:[255, 255, 255],
                 col_accessories:[255, 204, 0]}    
    
        //Starting position, helpfull for testing purposes
    level_start = {x: platforms[0].x + character.width, y: platforms[0].y - character.height}
    
        //Restart point, for a checkpoint mechanic
    restart_point = level_start;
    
        //Respawn at the checkpoint
    character.x = restart_point.x;
    character.y = restart_point.y;
    
        //Initial game mechanic and physics values
    game_score = 0;
    lives = 3;
    g = 1;
    ver_speed = 0;
    v = 5;
    jump = 20;
    game_over = false;
    
        //User interface position
    UI_pos = {x:100, y: height - 10};

        //Colours for the background and other objects
    bg = {col_sand_dark: [205, 133, 63],
          col_sand_light: [244, 164, 96],
          col_stone: [255, 248, 220],
          col_green: [0, 128, 0],
          col_blue: [135, 206, 250],
          col_brown: [139, 69, 19],
          col_sky: [100, 155, 255]};
    
        //Information for drawing a sun
    sun = {pos_x: 50,
           pos_y: 50,
           d: 5,
           color: [255, 239, 50, 240]};
        
        //Initialize empty array for clouds
    clouds = [];
    
        //---Create_clouds------------------
    for (let i = 0 ; i < round(level_width/width) ; i++)
        {
            for (let j = 0 ; j < 30 ; j++)
            {
                clouds.push({x: random((width * (i-1)) + (width/random(8, 12) * j), ((width * (i+3)) + (width/random(8, 12) * j))),
                             y: random(15, 30),
                             size: random(15, 30),
                             speed: random(0.5, 2)})
            }
        }
        //----------------------------------
    
        //Information for drawing a mountain
    mountain = {pos_x: 240,
                pos_y: 295,
                colour: [189, 183, 107]};
    
        //Information for drawing "trees"
    trees = [{tr_x: platforms[0].x + platforms[0].width - 300,
              tr_y: platforms[0].y,
              size: "big"},
             {tr_x: platforms[0].x + platforms[0].width - 200,
              tr_y: platforms[0].y,
              size: "small"},
             {tr_x: platforms[0].x + platforms[0].width - 400,
              tr_y: platforms[0].y,
              size: "small"},
             {tr_x: platforms[1].x + platforms[1].width/2 - 30,
              tr_y: platforms[1].y,
              size: "big"},
             {tr_x: platforms[3].x + platforms[3].width/2 - 30,
              tr_y: platforms[3].y,
              size: "small"},
             {tr_x: platforms[6].x + platforms[6].width/2 - 30,
              tr_y: platforms[6].y,
              size: "small"},
             {tr_x: platforms[8].x + platforms[8].width/2 - 30,
              tr_y: platforms[8].y,
              size: "big"},
             {tr_x: platforms[19].x + 35,
              tr_y: platforms[19].y,
              size: "small"},
             {tr_x: platforms[19].x + platforms[19].width - 95,
              tr_y: platforms[19].y,
              size: "small"},
             {tr_x: platforms[21].x + 35,
              tr_y: platforms[21].y,
              size: "small"},
             {tr_x: platforms[21].x + platforms[21].width/2 - 30,
              tr_y: platforms[21].y,
              size: "big"},
             {tr_x: platforms[21].x + platforms[21].width - 95,
              tr_y: platforms[21].y,
              size: "small"},
             {tr_x: platforms[22].x + platforms[22].width/2 - 30,
              tr_y: platforms[22].y,
              size: "small"},
             {tr_x: platforms[25].x + platforms[25].width/2 - 30,
              tr_y: platforms[25].y,
              size: "small"},
             {tr_x: platforms[29].x + platforms[29].width/2 - 30,
              tr_y: platforms[29].y,
              size: "big"},
             {tr_x: platforms[38].x + platforms[38].width/2 - 30,
              tr_y: platforms[38].y,
              size: "small"},
             {tr_x: platforms[41].x + platforms[41].width/2 - 30,
              tr_y: platforms[41].y,
              size: "small"},
             {tr_x: platforms[49].x + platforms[49].width/2 - 30,
              tr_y: platforms[49].y,
              size: "small"},
             {tr_x: platforms[51].x + platforms[51].width - 95,
              tr_y: platforms[51].y,
              size: "big"},
             {tr_x: platforms[59].x + platforms[59].width/2 - 30,
              tr_y: platforms[59].y,
              size: "small"},
             {tr_x: platforms[60].x + 120,
              tr_y: platforms[60].y,
              size: "small"},
             {tr_x: platforms[60].x + 240,
              tr_y: platforms[60].y,
              size: "small"},
             {tr_x: platforms[60].x + 360,
              tr_y: platforms[60].y,
              size: "big"},
             {tr_x: platforms[60].x + 480,
              tr_y: platforms[60].y,
              size: "small"},
             {tr_x: platforms[60].x + 600,
              tr_y: platforms[60].y,
              size: "small"},
             {tr_x: platforms[60].x + 720,
              tr_y: platforms[60].y,
              size: "big"},
             {tr_x: platforms[60].x + 840,
              tr_y: platforms[60].y,
              size: "small"},
             {tr_x: platforms[60].x + 960,
              tr_y: platforms[60].y,
              size: "small"}];
    
        //Adjusting camera on respawn or mid-level start
    cam_adjust();
    
        //Information about collectables
    collectables = [{x: platforms[0].x + platforms[0].width - 100,
                     y: platforms[0].y - 60,
                     isFound: false},
                    {x: platforms[4].x + platforms[4].width/2 - 25,
                     y: platforms[4].y - 60,
                     isFound: false},
                    {x: platforms[12].x + platforms[12].width/2 - 25,
                     y: platforms[12].y - 60,
                     isFound: false},
                    {x: platforms[17].x + platforms[17].width/2 - 25,
                     y: platforms[17].y - 60,
                     isFound: false},
                    {x: platforms[19].x + platforms[19].width/2 - 25,
                     y: platforms[19].y - 250,
                     isFound: false},
                    {x: platforms[23].x + platforms[23].width/2 - 25,
                     y: platforms[23].y - 180,
                     isFound: false},
                    {x: platforms[34].x + platforms[34].width/2 - 25,
                     y: platforms[34].y - 60,
                     isFound: false},
                    {x: platforms[36].x + platforms[36].width/2 - 25,
                     y: platforms[36].y - 60,
                     isFound: false},
                    {x: platforms[43].x + platforms[43].width/2 - 25,
                     y: platforms[43].y - 120,
                     isFound: false},
                    {x: platforms[47].x - 25,
                     y: platforms[47].y + 120,
                     isFound: false},
                    {x: platforms[56].x + platforms[56].width/2 - 25,
                     y: platforms[56].y - 150,
                     isFound: false}];
    
        //Information about 1-Ups
    hearts = [{platf_ind: 0,
               offset: -50,
               isPickedUp: false,
               checkpoint: false},
              {platf_ind: 5,
               offset: platforms[5].width/2 - 25,
               isPickedUp: false,
               checkpoint: false},
              {platf_ind: 18,
               offset: -50,
               isPickedUp: false,
               checkpoint: false}, 
              {platf_ind: 24,
               offset: 50,
               isPickedUp: false,
               checkpoint: true},
              {platf_ind: 33,
               offset: 0,
               isPickedUp: false,
               checkpoint: false}]
    
        //Information about ground enemies, and empty array for the constructor function
    enemies1_ind = [2, 9, 19, 21, 23, 29, 32, 46, 54, 56, 58, 60, 60, 60];
    enemies1 = [];
    
        //Information about air enemies, and empty array for the constructor function
    enemies2_info = [{ind: 0,
                      offset_x: platforms[0].width + 60 - 25,
                      offset_y: -50,
                      vector: "vertical",
                      size: 50,
                      speed: random(1.5, v-1),
                      range: 350},
                     {ind: 8,
                      offset_x: platforms[8].width + 25,
                      offset_y: 50,
                      vector: "vertical",
                      size: 50,
                      speed: 0,
                      range: 250},
                     {ind: 10,
                      offset_x: 0,
                      offset_y: 50,
                      vector: "horizontal",
                      size: 50,
                      speed: random(1.5, v-1),
                      range: 300},
                     {ind: 21,
                      offset_x: platforms[21].width + 75 - 25,
                      offset_y: -150,
                      vector: "vertical",
                      size: 50,
                      speed: random(1.5, v-1),
                      range: 300},
                     {ind: 23,
                      offset_x: 50,
                      offset_y: 100,
                      vector: "horizontal",
                      size: 50,
                      speed: random(1.5, v-1),
                      range: platforms[23].width - 50},
                     {ind: 25,
                      offset_x: platforms[25].width/2 - 25,
                      offset_y: 100,
                      vector: "vertical",
                      size: 50,
                      speed: random(1.5, v-1),
                      range: 250},
                     {ind: 30,
                      offset_x: platforms[30].width + 50,
                      offset_y: -100,
                      vector: "vertical",
                      size: 50,
                      speed: random(1.5, v-1),
                      range: 250},
                     {ind: 38,
                      offset_x: platforms[38].width/2 + 25,
                      offset_y: 150,
                      vector: "horizontal",
                      size: 50,
                      speed: random(1.5, v-1),
                      range: 300},
                     {ind: 50,
                      offset_x: - 95,
                      offset_y: - 50,
                      vector: "vertical",
                      size: 50,
                      speed: 0,
                      range: 100},
                     {ind: 59,
                      offset_x: platforms[59].width + 25,
                      offset_y: 50,
                      vector: "horizontal",
                      size: 50,
                      speed: random(1.5, v-1),
                      range: 180},
                     {ind: 60,
                      offset_x: platforms[60].width/8,
                      offset_y: 120,
                      vector: "horizontal",
                      size: 50,
                      speed: random(1, v-2),
                      range: 300},
                     {ind: 60,
                      offset_x: platforms[60].width/2,
                      offset_y: 120,
                      vector: "horizontal",
                      size: 50,
                      speed: random(1, v-2),
                      range: 300}];
    enemies2 = [];

        //Filling enemies arrays based on the info from before, using constructor functions
    for (let i = 0 ; i < enemies1_ind.length ; i++)
        {
            enemies1.push(new Enemies1(platforms, enemies1_ind[i], 50, random(1.5, v - 1)));
        }
    
    for (let i = 0 ; i < enemies2_info.length ; i++)
        {
            enemies2.push(new Enemies2(platforms, enemies2_info[i].ind, 
                                       enemies2_info[i].offset_x, enemies2_info[i].offset_y, 
                                       enemies2_info[i].vector, enemies2_info[i].size,
                                       enemies2_info[i].speed, enemies2_info[i].range));
        }
    
        //Creating the end of the level flag
    flag = {x: level_width - 100, 
            y: platforms[platforms.length - 2].y - 300,
            height: 300,
            isReached: false};

}

//---Adjusts "camera" position if the character is spawned/restarted mid level
function cam_adjust()
{
    if (character.x > width/2)
    {
        cam_pos = width/2 - character.x;
    }
    else cam_pos = 0;
}

//---Loading sounds before the game start to make everything synched up
//Working with sounds was harder that it looks on the outside. For some security reasons, browser started to spew out errors and warnings, blocking the sound. The only workaround I was able to find is to use side extension to load the game through webserver. But the concept itself is not this hard, and I think it is was helpfull in the way that it works almost the same way with the pictures. We can preload them, and then use them in variables, functions and methods.
function preload()
{
    soundFormats('mp3', 'wav');
    BGM = loadSound('sound/BGM.mp3');
    sound_jump = loadSound('sound/jump.wav');
    sound_hit = loadSound('sound/hit.wav');
    sound_pickup = loadSound('sound/pickup.wav');
    sound_win = loadSound('sound/win.wav');
    sound_lose = loadSound('sound/lose.wav');
}

//---Creating canvas and starting the game
function setup()
{
    createCanvas(1024, 576);
    new_game();
}

//---Runs everything if a player has at least 1 life
function draw()
{   
    if (!game_over)
    {
            //Stops game_over music if the player restarts game quickly
        sound_lose.stop();
        
            //Drawing clouds and sun in the background
        colour_sky();
        draw_sun();
        
            //Counting the time from the game start 
        time();
        
//------------------------------------------------------------------------
            //Drawing scenery that "moves" with the camera
        push();
        
            //Shifting level based on the player position
        translate(cam_pos, 0);
        
            //Drawing level scenery
        draw_clouds(clouds);
        draw_desertBG();
        draw_trees(trees);

            //Drawing level itself
        draw_platforms_hor();
            
            //Drawing the "Piramid" entrance, a starting position
        draw_level_start();
        
            //Drawing and checking collectables
        for (let i = 0; i < collectables.length ; i++)
            {
                draw_collectables(collectables[i]);
                check_collectables(collectables[i]);
            }

            //Drawing and checking 1-Ups
        for (let i = 0; i < hearts.length ; i++)
            {
                draw_1up(platforms, hearts[i]);
                check_1up(platforms, hearts[i]);
            }

            //Drawing and checking the flagpole, a finish position
        draw_flagpole(flag);
        check_flagpole(flag);
        
            //Drawing sneks
        for (let i = 0 ; i < enemies1.length ; i++)
            {
                enemies1[i].draw();
            }
        
            //Drawing burds
        
        for (let i = 0 ; i < enemies2.length ; i++)
            {
                enemies2[i].draw();
            }
        
        pop();
//------------------------------------------------------------------------
        
            //Drawing the game character
        drawGameChar(character);
        
            //Drawing "darkness" in the piramid. It's after the character, so he can "walk" inside
        draw_entrance();
        
            //Checking is after the character is drawn, because the gameover text should overlap the character
        //-------------------------------------------------------------------------------------
        push();
            translate(cam_pos, 0);
        
            for (let i = 0 ; i < enemies1.length ; i++)
                {
                    enemies1[i].check_contact();
                }
            for (let i = 0 ; i < enemies2.length ; i++)
                {
                    enemies2[i].check_contact();
                }

            check_game_over();
        pop();
        //-------------------------------------------------------------------------------------
        
            //Initializing the game physics
        gravity(character, platforms, ver_speed);
        out_of_bounds(character, platforms);

        intersection_down(character, platforms, ver_speed);
        intersection_top(character, platforms, ver_speed);
        intersection_to_right(character, platforms, v);      
        intersection_to_left(character, platforms, v);

            //Platforms movement and vanishing
        platform_movement(platforms, movinig_platforms);
        ethereal(platforms, vanishing_platforms);
        
            //Draw the player health and score
        draw_UI(UI_pos.x, UI_pos.y);

            //Player movement
        if (isRight)
        {
            move_right(character, platforms, v);
        }
        else if (isLeft) 
        {
            move_left(character, platforms, v);
        }

    }
    
}

//---Drawing the background and scenery
//I grew in the NES era and played a lot of platformers in my time. I love this project, and from the start wanted to make something to pay my tribute to all games I played growing up. These games were simple in concept but tough as nails. I modified my project to better represent the old 2-d platformer. I added some additional features like advanced physics, different types of enemies, different types of platforms, etc.

//I also was beg fan of the mythology of Ancient Egypt. So I decided to theme my game around this idea, but alas I am artistically impaired, so the game still looks bad. But I had a blast working on this project. I practiced pixel art with drawing functions, mastered coordinate grid, shapes, and simple figures.
function colour_sky()
{
    background(bg.col_sky); 
}

function draw_sun()
{
    //Draw and Colour Sun
    noStroke(); 
    fill(sun.color);
    
    ellipse(sun.pos_x, sun.pos_y, sun.d * 8);
}

function draw_clouds(cloud_arr)
{
    for (let i = 0 ; i < cloud_arr.length ; i++)
        {
            
            //---Draw_clouds
            noStroke();
            fill('white');

            ellipse(cloud_arr[i].x, 
                    cloud_arr[i].y,
                    cloud_arr[i].size);
            ellipse(cloud_arr[i].x - cloud_arr[i].size/2, 
                    cloud_arr[i].y,
                    cloud_arr[i].size * 0.7);
            ellipse(cloud_arr[i].x + cloud_arr[i].size/2, 
                    cloud_arr[i].y,
                    cloud_arr[i].size * 0.7);
            
            
            //---Clouds_movement
            if (cloud_arr[i].x > level_width)
            {
                cloud_arr[i].x = abs(cam_pos) - width * 2;
            }
            else 
            {
                cloud_arr[i].x += cloud_arr[i].speed;
            }
        }
}

function draw_desertBG()
{
    for (let i = 0 ; i < round(level_width/width, 0) ; i++)
    {
        noStroke();
        strokeWeight(1);
        fill(bg.col_sand_light);

        beginShape();
            vertex(0 + (i * width), 187);
            vertex(240 + (i * width), 187);
            vertex(370 + (i * width), 190);
            vertex(465 + (i * width), 195);
            vertex(545 + (i * width), 186);
            vertex(675 + (i * width), 192);
            vertex(780 + (i * width), 190);
            vertex(910 + (i * width), 180);
            vertex(width + (i * width), 187);
            vertex(width + (i * width), height);
            vertex(0 + (i * width), height);
        endShape(CLOSE);

        stroke(0);
        line(0 + (i * width), 222, 105 + (i * width), 187);
        line(105 + (i * width), 187, 190 + (i * width), 201);
        line(190 + (i * width), 201, 324 + (i * width), 188);
        line(0 + (i * width), 335, 180 + (i * width), 376);    


        fill(bg.col_sand_dark);
        beginShape();
            vertex(755 + (i * width), 237);
            vertex(832 + (i * width), 172);
            vertex(width + (i * width), 247);
        endShape(CLOSE);

        beginShape();
            vertex(180 + (i * width), 376);
            vertex(457 + (i * width), 284);
            vertex(764 + (i * width), 417);
        endShape(CLOSE);

        fill(bg.col_sand_light);
        beginShape();
            vertex(764 + (i * width), 417);
            vertex(457 + (i * width), 284);
            vertex(584 + (i * width), 246);
            vertex(755 + (i * width), 237);
            vertex(width + (i * width), 247);
        endShape(CLOSE);



        //---Oasis
        strokeWeight(1);
        stroke(0);

        fill(bg.col_green);
        ellipse(676 + (i * width), 208, 120, 9);

        fill(bg.col_blue);
        ellipse(670 + (i * width), 208, 90, 4);

        //---BG_TreeTrunk#1

        fill(bg.col_brown);
        beginShape();
            vertex(726 + (i * width), 206);
            vertex(724 + (i * width), 200);
            vertex(720 + (i * width), 170);
            vertex(724 + (i * width), 177);
        endShape(CLOSE);

        //---BG_TreeTrunk#2
        beginShape();
            vertex(700 + (i * width), 210);
            vertex(697 + (i * width), 176);
            vertex(702 + (i * width), 175);
        endShape(CLOSE);

        //---BG_TreeTrunk#3
        beginShape();
            vertex(630 + (i * width), 205);
            vertex(627 + (i * width), 197);
            vertex(628 + (i * width), 182);
        endShape(CLOSE);

        //---BG_TreeCanopy#1
        fill(bg.col_green);

        beginShape();
            vertex(711 + (i * width), 165);
            vertex(728 + (i * width), 176);
            vertex(734 + (i * width), 166);
            vertex(711 + (i * width), 172);
        endShape(CLOSE);

        //---BG_TreeCanopy#2
        beginShape();
            vertex(706 + (i * width), 177);
            vertex(704 + (i * width), 168);
            vertex(690 + (i * width), 179);
            vertex(685 + (i * width), 170);
        endShape(CLOSE);

        //---BG_TreeCanopy#3
        beginShape();
            vertex(633 + (i * width), 176);
            vertex(638 + (i * width), 180);
            vertex(618 + (i * width), 187);
            vertex(615 + (i * width), 179);
        endShape(CLOSE);

        //---Pyramid_(Mountain)---
        strokeWeight(1);
        fill(mountain.colour);
        beginShape(TRIANGLES);
            vertex(mountain.pos_x - 170 + (i * width), mountain.pos_y - 50);
            vertex(mountain.pos_x + (i * width), mountain.pos_y);
            vertex(mountain.pos_x + (i * width), mountain.pos_y - 205);
            vertex(mountain.pos_x + 80 + (i * width), mountain.pos_y - 89);
            vertex(mountain.pos_x + (i * width), mountain.pos_y);
            vertex(mountain.pos_x + (i * width), mountain.pos_y - 205);
        endShape(CLOSE);

        line(mountain.pos_x - 148 + (i * width), mountain.pos_y - 71,
                mountain.pos_x - 1 + (i * width), mountain.pos_y - 31);
        line(mountain.pos_x - 125 + (i * width), mountain.pos_y - 92,
                mountain.pos_x - 1 + (i * width), mountain.pos_y - 60);
        line(mountain.pos_x - 103 + (i * width), mountain.pos_y - 112,
                mountain.pos_x - 1 + (i * width), mountain.pos_y - 90);
        line(mountain.pos_x - 82 + (i * width), mountain.pos_y - 131,
                mountain.pos_x - 1 + (i * width), mountain.pos_y - 115);
        line(mountain.pos_x - 59 + (i * width), mountain.pos_y - 152,
                mountain.pos_x - 1 + (i * width), mountain.pos_y - 143);
        line(mountain.pos_x - 34 + (i * width), mountain.pos_y - 175,
                mountain.pos_x + 1 + (i * width), mountain.pos_y - 172);
        line(mountain.pos_x - 1 + (i * width), mountain.pos_y - 172,
                mountain.pos_x + 15 + (i * width), mountain.pos_y - 184);
        line(mountain.pos_x - 1 + (i * width), mountain.pos_y - 143,
                mountain.pos_x + 25 + (i * width), mountain.pos_y - 167);
        line(mountain.pos_x - 1 + (i * width), mountain.pos_y - 115,
                mountain.pos_x + 35 + (i * width), mountain.pos_y - 151);
        line(mountain.pos_x - 1 + (i * width), mountain.pos_y - 90,
                mountain.pos_x + 47 + (i * width), mountain.pos_y - 137);
        line(mountain.pos_x - 1 + (i * width), mountain.pos_y - 60,
                mountain.pos_x + 57 + (i * width), mountain.pos_y - 121);
        line(mountain.pos_x - 1 + (i * width), mountain.pos_y - 30,
                mountain.pos_x + 69 + (i * width), mountain.pos_y - 105);

        line(mountain.pos_x - 115 + (i * width), mountain.pos_y - 63,
                mountain.pos_x - 126 + (i * width), mountain.pos_y - 39);
        line(mountain.pos_x - 76 + (i * width), mountain.pos_y - 51,
                mountain.pos_x - 86 + (i * width), mountain.pos_y - 25);
        line(mountain.pos_x - 35 + (i * width), mountain.pos_y - 39,
                mountain.pos_x - 44 + (i * width), mountain.pos_y - 15);
        line(mountain.pos_x - 123 + (i * width), mountain.pos_y - 92,
                mountain.pos_x - 135 + (i * width), mountain.pos_y - 69);
        line(mountain.pos_x - 87 + (i * width), mountain.pos_y - 82,
                mountain.pos_x - 96 + (i * width), mountain.pos_y - 58);
        line(mountain.pos_x - 46 + (i * width), mountain.pos_y - 72,
                mountain.pos_x - 57 + (i * width), mountain.pos_y - 47);
        line(mountain.pos_x - 1 + (i * width), mountain.pos_y - 60,
                mountain.pos_x - 8 + (i * width), mountain.pos_y - 34);
        line(mountain.pos_x - 93 + (i * width), mountain.pos_y - 110,
                mountain.pos_x - 104 + (i * width), mountain.pos_y - 88);
        line(mountain.pos_x - 58 + (i * width), mountain.pos_y - 103,
                mountain.pos_x - 69 + (i * width), mountain.pos_y - 79);
        line(mountain.pos_x - 16 + (i * width), mountain.pos_y - 93,
                mountain.pos_x - 27 + (i * width), mountain.pos_y - 68);
        line(mountain.pos_x - 69 + (i * width), mountain.pos_y - 127,
                mountain.pos_x - 78 + (i * width), mountain.pos_y - 107);
        line(mountain.pos_x - 28 + (i * width), mountain.pos_y - 121,
                mountain.pos_x - 37 + (i * width), mountain.pos_y - 98);
        line(mountain.pos_x - 40 + (i * width), mountain.pos_y - 149,
                mountain.pos_x - 50 + (i * width), mountain.pos_y - 124);
        line(mountain.pos_x - 3 + (i * width), mountain.pos_y - 143,
                mountain.pos_x - 13 + (i * width), mountain.pos_y - 118);
        line(mountain.pos_x - 16 + (i * width), mountain.pos_y - 174,
                mountain.pos_x - 28 + (i * width), mountain.pos_y - 148);

        line(mountain.pos_x + 65 + (i * width), mountain.pos_y - 74,
                mountain.pos_x + 58 + (i * width), mountain.pos_y - 94);
        line(mountain.pos_x + 45 + (i * width), mountain.pos_y - 51,
                mountain.pos_x + 37 + (i * width), mountain.pos_y - 70);
        line(mountain.pos_x + 24 + (i * width), mountain.pos_y - 30,
                mountain.pos_x + 18 + (i * width), mountain.pos_y - 51);
        line(mountain.pos_x + 16 + (i * width), mountain.pos_y - 79,
                mountain.pos_x + 25 + (i * width), mountain.pos_y - 59);
        line(mountain.pos_x + 47 + (i * width), mountain.pos_y - 82,
                mountain.pos_x + 40 + (i * width), mountain.pos_y - 102);
        line(mountain.pos_x + 17 + (i * width), mountain.pos_y - 108,
                mountain.pos_x + 27 + (i * width), mountain.pos_y - 90);
        line(mountain.pos_x + 49 + (i * width), mountain.pos_y - 112,
                mountain.pos_x + 40 + (i * width), mountain.pos_y - 129);
        line(mountain.pos_x - 1 + (i * width), mountain.pos_y - 115,
                mountain.pos_x + 7 + (i * width), mountain.pos_y - 97);
        line(mountain.pos_x + 19 + (i * width), mountain.pos_y - 136,
                mountain.pos_x + 30 + (i * width), mountain.pos_y - 120);
        line(mountain.pos_x + 4 + (i * width), mountain.pos_y - 147,
                mountain.pos_x + 13 + (i * width), mountain.pos_y - 130);
        line(mountain.pos_x + 21 + (i * width), mountain.pos_y - 163,
                mountain.pos_x + 30 + (i * width), mountain.pos_y - 146);
        line(mountain.pos_x + 6 + (i * width), mountain.pos_y - 178,
                mountain.pos_x + 13 + (i * width), mountain.pos_y - 157);
    }
}

function draw_level_start()
{
    strokeWeight(3);
    fill(bg.col_stone);
    rect(0, platforms[0].y - 100, 20, 100);
}

function draw_entrance()
{
    push();
    translate(cam_pos, 0); 
    
    fill(0);
    quad(0, platforms[0].y + 10, 
         0, platforms[0].y - 80,
         15, platforms[0].y - 90,
         15, platforms[0].y);
    pop();
}

function draw_trees(trees_arr)
{
    for (let i = 0 ; i < trees_arr.length ; i++)
        {
            if (trees_arr[i].size == "big")
                {
                    //---Column1_(BigTree)---
                    stroke(0);
                    strokeWeight(2);
                    fill('Purple');

                    beginShape();
                        vertex(trees_arr[i].tr_x, trees_arr[i].tr_y);
                        vertex(trees_arr[i].tr_x, trees_arr[i].tr_y - 10);
                        vertex(trees_arr[i].tr_x + 60, trees_arr[i].tr_y - 10);
                        vertex(trees_arr[i].tr_x + 60, trees_arr[i].tr_y);
                    endShape(CLOSE);

                    fill('white');
                    beginShape();
                        vertex(trees_arr[i].tr_x, trees_arr[i].tr_y - 10);
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 30);
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 80);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 80);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 30);
                        vertex(trees_arr[i].tr_x + 60, trees_arr[i].tr_y - 10);
                    endShape(CLOSE);

                    fill('Cyan');
                    beginShape();
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 80);
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 100);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 100);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 80);
                    endShape(CLOSE);

                    fill('White');
                    beginShape();
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 100);
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 120);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 120);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 100);
                    endShape(CLOSE);

                    fill('Blue');
                    beginShape();
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 120);
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 140);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 140);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 120);
                    endShape(CLOSE);

                    fill('Crimson');
                    beginShape();
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 140);
                        vertex(trees_arr[i].tr_x + 5, trees_arr[i].tr_y - 150);
                        vertex(trees_arr[i].tr_x + 55, trees_arr[i].tr_y - 150);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 140);
                    endShape(CLOSE);

                    fill('White');
                    beginShape();
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 150);
                        vertex(trees_arr[i].tr_x + 5, trees_arr[i].tr_y - 160);
                        vertex(trees_arr[i].tr_x + 55, trees_arr[i].tr_y - 160);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 150);
                    endShape(CLOSE);

                    fill(character.col_accessories);
                    beginShape();
                        vertex(trees_arr[i].tr_x + 5, trees_arr[i].tr_y - 160);
                        vertex(trees_arr[i].tr_x, trees_arr[i].tr_y - 200);
                        vertex(trees_arr[i].tr_x + 60, trees_arr[i].tr_y - 200);
                        vertex(trees_arr[i].tr_x + 55, trees_arr[i].tr_y - 160);
                    endShape(CLOSE);
                }
            else
                {
                    //---Column2_(SmallTree)---
                    stroke(0);
                    strokeWeight(2);
                    fill('Purple');

                    beginShape();
                        vertex(trees_arr[i].tr_x, trees_arr[i].tr_y);
                        vertex(trees_arr[i].tr_x, trees_arr[i].tr_y - 10);
                        vertex(trees_arr[i].tr_x + 60, trees_arr[i].tr_y - 10);
                        vertex(trees_arr[i].tr_x + 60, trees_arr[i].tr_y);
                    endShape(CLOSE);

                    fill('White');
                    beginShape();
                        vertex(trees_arr[i].tr_x, trees_arr[i].tr_y - 10);
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 30);
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 60);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 60);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 30);
                        vertex(trees_arr[i].tr_x + 60, trees_arr[i].tr_y - 10);
                    endShape(CLOSE);

                    fill('Cyan');
                    beginShape();
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 60);
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 80);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 80);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 60);
                    endShape(CLOSE);

                    fill('Blue');
                    beginShape();
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 80);
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 100);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 100);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 80);
                    endShape(CLOSE);

                    fill('Crimson');
                    beginShape();
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 100);
                        vertex(trees_arr[i].tr_x + 5, trees_arr[i].tr_y - 110);
                        vertex(trees_arr[i].tr_x + 55, trees_arr[i].tr_y - 110);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 100);
                    endShape(CLOSE);

                    fill('White');
                    beginShape();
                        vertex(trees_arr[i].tr_x + 15, trees_arr[i].tr_y - 110);
                        vertex(trees_arr[i].tr_x + 5, trees_arr[i].tr_y - 130);
                        vertex(trees_arr[i].tr_x + 55, trees_arr[i].tr_y - 130);
                        vertex(trees_arr[i].tr_x + 45, trees_arr[i].tr_y - 110);
                    endShape(CLOSE);

                    fill(character.col_accessories);
                    beginShape();
                        vertex(trees_arr[i].tr_x + 5, trees_arr[i].tr_y - 130);
                        vertex(trees_arr[i].tr_x, trees_arr[i].tr_y - 160);
                        vertex(trees_arr[i].tr_x + 60, trees_arr[i].tr_y - 160);
                        vertex(trees_arr[i].tr_x + 55, trees_arr[i].tr_y - 130);
                    endShape(CLOSE);
                }
        }
    
}

//---Drawing user interface
function draw_UI(pos_x, pos_y)
{
    push();
    fill("#8B0000");
    textSize(45);
    text("SCORE: " + game_score, width - pos_x - textWidth("SCORE: "), pos_y);
    
    text("LIVES: ", pos_x, pos_y);
    for (let i = 0; i < lives ; i++)
        {
            draw_heart(pos_x + textWidth("LIVES: ") - 10 + i * 35, pos_y + 30, 1.5);  
        }
    
    
    pop();
}

//---Function to draw a game character
function drawGameChar(ch)
{
    ch.rel_x = ch.x + cam_pos;
    
    //---Walking_Right---

    
    if ((isRight) && (intersection_down(character, platforms, ver_speed).isIntersecting))
{
//--------------------------------------------------------------------------------------------------WALKNG_RIGHT_START
    
    //!---------WALKING_RIGHT_TORSO----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57); 
    endShape(CLOSE); 
    //pop();
    
    
    
    //!--------WALKING_RIGHT_HANDS---------
    
    //----------WALKING_RIGHT_RightHand----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 25, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 20, ch.y + 77 - 57);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 20, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 25, ch.y + 77 - 52);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 24, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 24, ch.y + 77 - 68);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 68);
    endShape(CLOSE);
    
    //----------WALKING_RIGHT_LeftHand----------
    
    beginShape();
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 20, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 25, ch.y + 77 - 57);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 - 20, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 43);
        vertex(ch.rel_x + 25 - 25, ch.y + 77 - 57);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 42);
        vertex(ch.rel_x + 25 - 24, ch.y + 77 - 42);
        vertex(ch.rel_x + 25 - 24, ch.y + 77 - 43);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 43);
    endShape(CLOSE);
    
    //pop();
    
    
    
    //!---------WALKING_RIGHT_LEGS----------
    
    //----------WALKING_RIGHT_RightThigh----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 12);
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
    endShape(CLOSE);
    
    //----------WALKING_RIGHT_RightShin----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 17);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 + 2);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 17);
    endShape(CLOSE);
    
    //----------WALKING_RIGHT_RightFeet----------
    
    beginShape();
//        vertex(ch.rel_x + 25 + 23, ch.y + 77);
//        vertex(ch.rel_x + 25 + 23, ch.y + 77 + 3);
//        vertex(ch.rel_x + 25 + 13, ch.y + 77 + 3);
//        vertex(ch.rel_x + 25 + 13, ch.y + 77);
    rect(ch.rel_x + 25 + 13, ch.y + 77, 12,3);
    endShape(CLOSE);
    
    //----------WALKING_RIGHT_LeftThigh----------
    
    beginShape();
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
        vertex(ch.rel_x + 25, ch.y + 77 - 12);
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
    endShape(CLOSE);
    
    //----------WALKING_RIGHT_LeftShin----------
    
    beginShape();
        vertex(ch.rel_x + 25, ch.y + 77 - 17);
        vertex(ch.rel_x + 25, ch.y + 77 - 12);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 + 2);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 17);
    endShape(CLOSE);
    
    //----------WALKING_RIGHT_LeftFeet----------
    
    rect(ch.rel_x + 25 - 20 + 3, ch.y + 77, 12,3);
    
    //pop();
    
    
    
    //!---------WALKING_RIGHT_CLOTHES----------
    
    //----------WALKING_RIGHT_Chestpiece----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_cloth_2);
    triangle(ch.rel_x + 25 - 15, ch.y + 77 - 57,
                ch.rel_x + 25 + 15, ch.y + 77 - 57,
                    ch.rel_x + 25, ch.y + 77 - 42);
    
    strokeWeight(1);
    stroke('Black');
    beginShape();
        vertex(ch.rel_x + 25 - 3, ch.y + 77 - 53);
        vertex(ch.rel_x + 25 + 3, ch.y + 77 - 53);
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 - 4, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 + 4, ch.y + 77 - 50);
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25, ch.y + 77 - 45)
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 - 3, ch.y + 77 - 53);
    endShape();
    
    //pop();
    
    //----------WALKING_RIGHT_Skirt----------
    
    //push()
    stroke(0);
    strokeWeight(1);
    fill(ch.col_cloth_1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 17);
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 17);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
    endShape();
    
    fill(ch.col_cloth_2);
    triangle(ch.rel_x + 25 - 10, ch.y + 77 - 17,
                ch.rel_x + 25, ch.y + 77 - 32,
                    ch.rel_x + 25 + 15, ch.y + 77 - 17);
    
    //pop();
    
    //----------WALKING_RIGHT_Belt-----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_accessories);
    rect(ch.rel_x + 25 - 7, ch.y + 77 - 36, 14, 3);
    //pop();
    
    
    
    //!---------WALKING_RIGHT_HEAD----------
    
    //----------WALKING_RIGHT_Headress---------- 
    
    //push();
    fill(ch.col_cloth_1);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 54);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 54);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 72);
    endShape(CLOSE);
    //pop();
    
    //push();
    stroke(ch.col_accessories);
    strokeWeight(1);
    line(ch.rel_x + 25 + 5, ch.y + 77 - 67, 
            ch.rel_x + 25 - 10 + 1, ch.y + 77 - 67);
    line(ch.rel_x + 25 + 5, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 - 10 + 1, ch.y + 77 - 67 + 2.5);
    line(ch.rel_x + 25 + 5, ch.y + 77 - 67 + 5, 
            ch.rel_x + 25 - 10 + 1, ch.y + 77 - 67 + 5);
    line(ch.rel_x + 25 + 5, ch.y + 77 - 67 + 7.5, 
            ch.rel_x + 25 - 10 + 1, ch.y + 77 - 67 + 7.5);
    line(ch.rel_x + 25 + 4, ch.y + 77 - 67 + 10, 
            ch.rel_x + 25 - 5, ch.y + 77 - 67 + 10);
    //pop();
    

    //----------WALKING_RIGHT_Emblem----------
    //push();
    fill(ch.col_accessories);
    stroke(0);
    strokeWeight(0.5);
        
    rect(ch.rel_x + 25 + 5 + 1, ch.y + 77 - 67 - 2 - 2, 1, 3);
    
    //----------WALKING_RIGHT_Crown----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 5 + 2, ch.y + 77 - 67 - 2);
        vertex(ch.rel_x + 25 + 5 + 1, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 67 - 2);
    endShape(CLOSE);
    


    //----------WALKING_RIGHT_Face----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(0.5);
    
    beginShape();
        vertex(ch.rel_x + 25 + 5 , ch.y + 77 - 67);
        bezierVertex(ch.rel_x + 25 + 5 + 3, ch.y + 77 - 67,
                        ch.rel_x + 25 + 5 + 3, ch.y + 77 - 57,
                            ch.rel_x + 25 + 5 + 3, ch.y + 77 - 62);
        bezierVertex(ch.rel_x + 25 + 5 + 3, ch.y + 77 - 67,
                        ch.rel_x + 25 + 5 + 3, ch.y + 77 - 57,
                            ch.rel_x + 25 + 5 + 3, ch.y + 77 - 60);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 57);

    endShape(CLOSE);
    
    //----------WALKING_RIGHT_Eyes----------
    
    line(ch.rel_x + 25 + 5 +  2, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 + 5 + 1, ch.y + 77 - 67 + 2.5);
    line(ch.rel_x + 25 + 5 +  1, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 + 5 + 1, ch.y + 77 - 67 + 3);
    
    //----------WALKING_RIGHT_Nouse + Mouth----------
    
    line(ch.rel_x + 25 + 5 + 3, ch.y + 77 - 60, 
            ch.rel_x + 25 + 5 + 1, ch.y + 77 - 60);

    //----------WALKING_RIGHT_Beard----------
    
    strokeWeight(0.5);
    line(ch.rel_x + 25 + 5 + 2, ch.y + 77 - 60,
            ch.rel_x + 25 + 5 + 2, ch.y + 77 - 56);
    
//----------------------------------------------------------------------------------------------------WALKNG_RIGHT_END
}

                                        //---Walking_Left---
    
    else if ((isLeft) && (intersection_down(character, platforms, ver_speed).isIntersecting))
        
{
//---------------------------------------------------------------------------------------------------WALKNG_LEFT_START
    
    //!---------WALKING_LEFT_TORSO----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57); 
    endShape(CLOSE); 
    //pop();
    
    
    
    //!--------WALKING_LEFT_HANDS---------
    
    //----------WALKING_LEFT_LeftHand----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 25, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 20, ch.y + 77 - 57);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 20, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 25, ch.y + 77 - 52);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 24, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 24, ch.y + 77 - 68);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 68);
    endShape(CLOSE);
    
    //----------WALKING_LEFT_RightHand----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 20, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 25, ch.y + 77 - 57);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 + 20, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 43);
        vertex(ch.rel_x + 25 + 25, ch.y + 77 - 57);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 42);
        vertex(ch.rel_x + 25 + 24, ch.y + 77 - 42);
        vertex(ch.rel_x + 25 + 24, ch.y + 77 - 43);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 43);
    endShape(CLOSE);
    
    //pop();
    
    
    
    //!---------WALKING_LEFT_LEGS----------
    
    //----------WALKING_LEFT_LeftThigh----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 12);
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
    endShape(CLOSE);
    
    //----------WALKING_LEFT_LeftShin----------
    
    beginShape();
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 17);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 + 2);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 17);
    endShape(CLOSE);
    
    //----------WALKING_LEFT_LeftFeet----------
    
    beginShape();
    rect(ch.rel_x, ch.y + 77, 12,3);
    endShape(CLOSE);
    
    //----------WALKING_LEFT_RightThigh----------
    
    beginShape();
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
        vertex(ch.rel_x + 25, ch.y + 77 - 12);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
    endShape(CLOSE);
    
    //----------WALKING_LEFT_RightShin----------
    
    beginShape();
        vertex(ch.rel_x + 25, ch.y + 77 - 17);
        vertex(ch.rel_x + 25, ch.y + 77 - 12);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 + 2);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 17);
    endShape(CLOSE);
    
    //----------WALKING_LEFT_RightFeet----------
    
    rect(ch.rel_x + 25 + 10 - 3, ch.y + 77, 12,3);
    
    //pop();
    
    
    
    //!---------WALKING_LEFT_CLOTHES----------
    
    //----------WALKING_LEFT_Chestpiece----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_cloth_2);
    triangle(ch.rel_x + 25 - 15, ch.y + 77 - 57,
                ch.rel_x + 25 + 15, ch.y + 77 - 57,
                    ch.rel_x + 25, ch.y + 77 - 42);
    
    strokeWeight(1);
    stroke('Black');
    beginShape();
        vertex(ch.rel_x + 25 - 3, ch.y + 77 - 53);
        vertex(ch.rel_x + 25 + 3, ch.y + 77 - 53);
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 - 4, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 + 4, ch.y + 77 - 50);
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25, ch.y + 77 - 45)
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 - 3, ch.y + 77 - 53);
    endShape();
    
    //pop();
    
    //----------WALKING_LEFT_Skirt----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_cloth_1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 17);
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 17);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
    endShape();
    
    fill(ch.col_cloth_2);
    triangle(ch.rel_x + 25 - 15, ch.y + 77 - 17,
                ch.rel_x + 25, ch.y + 77 - 32,
                    ch.rel_x + 25 + 10, ch.y + 77 - 17);
    
    //pop();
    
    //----------WALKING_LEFT_Belt-----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_accessories);
    rect(ch.rel_x + 25 - 7, ch.y + 77 - 36, 14, 3);
    //pop();
    
    
    
    //!---------WALKING_LEFT_HEAD----------
    
    //----------WALKING_LEFT_Headress---------- 
    
    //push();
    fill(ch.col_cloth_1);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 54);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 54);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 72);
    endShape(CLOSE);
    //pop();
    
    //push();
    stroke(ch.col_accessories);
    strokeWeight(1);
    line(ch.rel_x + 25 - 5, ch.y + 77 - 67, 
            ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67);
    line(ch.rel_x + 25 - 5, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 2.5);
    line(ch.rel_x + 25 - 5, ch.y + 77 - 67 + 5, 
            ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 5);
    line(ch.rel_x + 25 - 5, ch.y + 77 - 67 + 7.5, 
            ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 7.5);
    line(ch.rel_x + 25 - 5, ch.y + 77 - 67 + 10, 
            ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67 + 10);
    //pop();
    

    //----------WALKING_LEFT_Emblem----------
    //push();
    fill(ch.col_accessories);
    stroke(0);
    strokeWeight(0.5);
        
    rect(ch.rel_x + 25 - 5 - 2, ch.y + 77 - 67 - 2 - 2, 1, 3);
    
    //----------WALKING_LEFT_Crown----------
    
    beginShape();
        vertex(ch.rel_x + 25 - 5 - 2, ch.y + 77 - 67 - 2);
        vertex(ch.rel_x + 25 - 5 - 1, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 67 - 2);
    endShape(CLOSE);
    


    //----------WALKING_LEFT_Face----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(0.5);
    
    beginShape();
        vertex(ch.rel_x + 25 - 5 , ch.y + 77 - 67);
        bezierVertex(ch.rel_x + 25 - 5 - 3, ch.y + 77 - 67,
                        ch.rel_x + 25 - 5 - 3, ch.y + 77 - 57,
                            ch.rel_x + 25 - 5 - 3, ch.y + 77 - 62);
        bezierVertex(ch.rel_x + 25 - 5 - 3, ch.y + 77 - 67,
                        ch.rel_x + 25 - 5 - 3, ch.y + 77 - 57,
                            ch.rel_x + 25 - 5 - 3, ch.y + 77 - 60);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 57);

    endShape(CLOSE);
    
    //----------WALKING_LEFT_Eyes----------
    
    line(ch.rel_x + 25 - 5 -  2, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 - 5 - 1, ch.y + 77 - 67 + 2.5);
    line(ch.rel_x + 25 - 5 -  1, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 - 5 - 1, ch.y + 77 - 67 + 3);
    
    //----------WALKING_LEFT_Nouse + Mouth----------
    
    line(ch.rel_x + 25 - 5 - 3, ch.y + 77 - 60, 
            ch.rel_x + 25 - 5 - 1, ch.y + 77 - 60);

    //----------WALKING_LEFT_Beard----------
    
    strokeWeight(0.5);
    line(ch.rel_x + 25 - 5 - 2, ch.y + 77 - 60,
            ch.rel_x + 25 - 5 - 2, ch.y + 77 - 56);
    
//-----------------------------------------------------------------------------------------------------WALKNG_LEFT_END
}

                                        //---Jumping_Right---
    
    else if((isRight) && (!intersection_down(character, platforms, ver_speed).isIntersecting))
    
{
//-------------------------------------------------------------------------------------------------JUMPING_RIGHT_START
    
    //!---------JUMPING_RIGHT_TORSO----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57); 
    endShape(CLOSE); 
    //pop();
    
    
    
    //!--------JUMPING_RIGHT_HANDS---------
    
    //----------JUMPING_RIGHT_RightHand----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 20, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 57);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 + 20, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 20, ch.y + 77 - 52);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 + 17, ch.y + 77 - 74);
        vertex(ch.rel_x + 25 + 20, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 + 24, ch.y + 77 - 77);
    endShape(CLOSE);
    
    //----------JUMPING_RIGHT_LeftHand----------
    
    beginShape();
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 20, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 25, ch.y + 77 - 57);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 - 20, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 43);
        vertex(ch.rel_x + 25 - 25, ch.y + 77 - 57);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 42);
        vertex(ch.rel_x + 25 - 24, ch.y + 77 - 42);
        vertex(ch.rel_x + 25 - 24, ch.y + 77 - 43);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 43);
    endShape(CLOSE);
    
    //pop();
    
    
    
    //!---------JUMPING_RIGHT_LEGS----------
    
    //----------JUMPING_RIGHT_RightThigh----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25, ch.y + 77 - 25);
        vertex(ch.rel_x + 25 + 24, ch.y + 77 - 10);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
    endShape(CLOSE);
    
    
    //----------JUMPING_RIGHT_RightFeet----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 22, ch.y + 77 - 8);
        vertex(ch.rel_x + 25 + 24, ch.y + 77 - 8);
        vertex(ch.rel_x + 25 + 24, ch.y + 77 - 18);
        vertex(ch.rel_x + 25 + 22, ch.y + 77 - 18);
    endShape(CLOSE);
    
    //----------JUMPING_RIGHT_LeftThigh----------
    
    beginShape();
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 12);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 32);
    endShape(CLOSE);
    
    //----------JUMPING_RIGHT_LeftShin----------
    
    beginShape();
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 17);
        vertex(ch.rel_x + 25 - 24, ch.y + 77 - 7);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 10);
    endShape(CLOSE);
    
    //----------JUMPING_RIGHT_LeftFeet----------
    
    beginShape();
        vertex(ch.rel_x + 25 - 24, ch.y + 77 - 10);
        vertex(ch.rel_x + 25 - 24, ch.y + 77);
        vertex(ch.rel_x + 25 - 21, ch.y + 77);
        vertex(ch.rel_x + 25 - 21, ch.y + 77 - 10);
    endShape(CLOSE);
    
    //pop();
    
    
    
    //!---------JUMPING_RIGHT_CLOTHES----------
    
    //----------JUMPING_RIGHT_Chestpiece----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_cloth_2);
    triangle(ch.rel_x + 25 - 15, ch.y + 77 - 57,
                ch.rel_x + 25 + 15, ch.y + 77 - 57,
                    ch.rel_x + 25, ch.y + 77 - 42);
    
    strokeWeight(1);
    stroke('Black');
    beginShape();
        vertex(ch.rel_x + 25 - 3, ch.y + 77 - 53);
        vertex(ch.rel_x + 25 + 3, ch.y + 77 - 53);
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 - 4, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 + 4, ch.y + 77 - 50);
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25, ch.y + 77 - 45)
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 - 3, ch.y + 77 - 53);
    endShape();
    
    //pop();
    
    //----------JUMPING_RIGHT_Skirt----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_cloth_1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 23);
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 23);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
    endShape();
    
    fill(ch.col_cloth_2);
    triangle(ch.rel_x + 25 - 10, ch.y + 77 - 22,
                ch.rel_x + 25, ch.y + 77 - 32,
                    ch.rel_x + 25 + 15, ch.y + 77 - 23);
    
    //pop();
    
    //----------JUMPING_RIGHT_Belt-----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_accessories);
    rect(ch.rel_x + 25 - 7, ch.y + 77 - 36, 14, 3);
    //pop();
    
    
    
    //!---------JUMPING_RIGHT_HEAD----------
    
    //----------JUMPING_RIGHT_Headress---------- 
    
    //push();
    fill(ch.col_cloth_1);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 54);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 54);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 72);
    endShape(CLOSE);
    //pop();
    
    //push();
    stroke(ch.col_accessories);
    strokeWeight(1);
    line(ch.rel_x + 25 + 5, ch.y + 77 - 67, 
            ch.rel_x + 25 - 10 + 1, ch.y + 77 - 67);
    line(ch.rel_x + 25 + 5, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 - 10 + 1, ch.y + 77 - 67 + 2.5);
    line(ch.rel_x + 25 + 5, ch.y + 77 - 67 + 5, 
            ch.rel_x + 25 - 10 + 1, ch.y + 77 - 67 + 5);
    line(ch.rel_x + 25 + 5, ch.y + 77 - 67 + 7.5, 
            ch.rel_x + 25 - 10 + 1, ch.y + 77 - 67 + 7.5);
    line(ch.rel_x + 25 + 4, ch.y + 77 - 67 + 10, 
            ch.rel_x + 25 - 5, ch.y + 77 - 67 + 10);
    //pop();
    

    //----------JUMPING_RIGHT_Emblem----------
    //push();
    fill(ch.col_accessories);
    stroke(0);
    strokeWeight(0.5);
        
    rect(ch.rel_x + 25 + 5 + 1, ch.y + 77 - 67 - 2 - 2, 1, 3);
    
    //----------JUMPING_RIGHT_Crown----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 5 + 2, ch.y + 77 - 67 - 2);
        vertex(ch.rel_x + 25 + 5 + 1, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 67 - 2);
    endShape(CLOSE);
    


    //----------JUMPING_RIGHT_Face----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(0.5);
    
    beginShape();
        vertex(ch.rel_x + 25 + 5 , ch.y + 77 - 67);
        bezierVertex(ch.rel_x + 25 + 5 + 3, ch.y + 77 - 67,
                        ch.rel_x + 25 + 5 + 3, ch.y + 77 - 57,
                            ch.rel_x + 25 + 5 + 3, ch.y + 77 - 62);
        bezierVertex(ch.rel_x + 25 + 5 + 3, ch.y + 77 - 67,
                        ch.rel_x + 25 + 5 + 3, ch.y + 77 - 57,
                            ch.rel_x + 25 + 5 + 3, ch.y + 77 - 60);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 57);

    endShape(CLOSE);
    
    //----------JUMPING_RIGHT_Eyes----------
    
    line(ch.rel_x + 25 + 5 +  2, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 + 5 + 1, ch.y + 77 - 67 + 2.5);
    line(ch.rel_x + 25 + 5 +  1, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 + 5 + 1, ch.y + 77 - 67 + 3);
    
    //----------JUMPING_RIGHT_Nouse + Mouth----------
    
    ellipse(ch.rel_x + 25 + 5 + 2, ch.y + 77 - 60, 2,1);

    //----------JUMPING_RIGHT_Beard----------
    
    strokeWeight(0.5);
    line(ch.rel_x + 25 + 5 + 2, ch.y + 77 - 60,
            ch.rel_x + 25 + 5 + 2, ch.y + 77 - 56);

    
    
//---------------------------------------------------------------------------------------------------JUMPING_RIGHT_END
}

                                        //---Jumping_Left---
    
    else if ((isLeft) && (!intersection_down(character, platforms, ver_speed).isIntersecting)) 
{
    
//--------------------------------------------------------------------------------------------------JUMPING_LEFT_START
    
    //!---------JUMPING_LEFT_TORSO----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57); 
    endShape(CLOSE); 
    //pop();
    
    
    
    //!--------JUMPING_LEFT_HANDS---------
    
    //----------JUMPING_LEFT_LeftHand----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 20, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 57);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 - 20, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 20, ch.y + 77 - 52);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 - 17, ch.y + 77 - 74);
        vertex(ch.rel_x + 25 - 20, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 - 24, ch.y + 77 - 77);
    endShape(CLOSE);
    
    //----------JUMPING_LEFT_RightHand----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 20, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 25, ch.y + 77 - 57);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 + 20, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 43);
        vertex(ch.rel_x + 25 + 25, ch.y + 77 - 57);
    endShape(CLOSE);
    
    beginShape();
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 42);
        vertex(ch.rel_x + 25 + 24, ch.y + 77 - 42);
        vertex(ch.rel_x + 25 + 24, ch.y + 77 - 43);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 43);
    endShape(CLOSE);
    
    //pop();
    
    
    
    //!---------JUMPING_LEFT_LEGS----------
    
    //----------JUMPING_LEFT_LeftThigh----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25, ch.y + 77 - 25);
        vertex(ch.rel_x + 25 - 24, ch.y + 77 - 10);
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
    endShape(CLOSE);
    
    
    //----------JUMPING_LEFT_LeftFeet----------
    
    beginShape();
        vertex(ch.rel_x + 25 - 22, ch.y + 77 - 8);
        vertex(ch.rel_x + 25 - 24, ch.y + 77 - 8);
        vertex(ch.rel_x + 25 - 24, ch.y + 77 - 18);
        vertex(ch.rel_x + 25 - 22, ch.y + 77 - 18);
    endShape(CLOSE);
    
    //----------JUMPING_LEFT_RightThigh----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 12);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 32);
    endShape(CLOSE);
    
    //----------JUMPING_LEFT_RightShin----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 17);
        vertex(ch.rel_x + 25 + 24, ch.y + 77 - 7);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 10);
    endShape(CLOSE);
    
    //----------JUMPING_LEFT_RightFeet----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 24, ch.y + 77 - 10);
        vertex(ch.rel_x + 25 + 24, ch.y + 77);
        vertex(ch.rel_x + 25 + 21, ch.y + 77);
        vertex(ch.rel_x + 25 + 21, ch.y + 77 - 10);
    endShape(CLOSE);
    
    //pop();
    
    
    
    //!---------JUMPING_LEFT_CLOTHES----------
    
    //----------JUMPING_LEFT_Chestpiece----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_cloth_2);
    triangle(ch.rel_x + 25 - 15, ch.y + 77 - 57,
                ch.rel_x + 25 + 15, ch.y + 77 - 57,
                    ch.rel_x + 25, ch.y + 77 - 42);
    
    strokeWeight(1);
    stroke('Black');
    beginShape();
        vertex(ch.rel_x + 25 - 3, ch.y + 77 - 53);
        vertex(ch.rel_x + 25 + 3, ch.y + 77 - 53);
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 - 4, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 + 4, ch.y + 77 - 50);
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25, ch.y + 77 - 45)
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 - 3, ch.y + 77 - 53);
    endShape();
    
    //pop();
    
    //----------JUMPING_LEFT_Skirt----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_cloth_1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 23);
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 23);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
    endShape();
    
    fill(ch.col_cloth_2);
    triangle(ch.rel_x + 25 - 15, ch.y + 77 - 22,
                ch.rel_x + 25, ch.y + 77 - 32,
                    ch.rel_x + 25 + 10, ch.y + 77 - 23);
    
    //pop();
    
    //----------JUMPING_LEFT_Belt-----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_accessories);
    rect(ch.rel_x + 25 - 7, ch.y + 77 - 36, 14, 3);
    //pop();
    
    
    
    //!---------JUMPING_LEFT_HEAD----------
    
    //----------JUMPING_LEFT_Headress---------- 
    
    //push();
    fill(ch.col_cloth_1);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 54);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 54);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 72);
    endShape(CLOSE);
    //pop();
    
    //push();
    stroke(ch.col_accessories);
    strokeWeight(1);
    line(ch.rel_x + 25 - 5, ch.y + 77 - 67, 
            ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67);
    line(ch.rel_x + 25 - 5, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 2.5);
    line(ch.rel_x + 25 - 5, ch.y + 77 - 67 + 5, 
            ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 5);
    line(ch.rel_x + 25 - 5, ch.y + 77 - 67 + 7.5, 
            ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 7.5);
    line(ch.rel_x + 25 - 5, ch.y + 77 - 67 + 10, 
            ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67 + 10);
    //pop();
    

    //----------JUMPING_LEFT_Emblem----------
    //push();
    fill(ch.col_accessories);
    stroke(0);
    strokeWeight(0.5);
        
    rect(ch.rel_x + 25 - 5 - 2, ch.y + 77 - 67 - 2 - 2, 1, 3);
    
    //----------JUMPING_LEFT_Crown----------
    
    beginShape();
        vertex(ch.rel_x + 25 - 5 - 2, ch.y + 77 - 67 - 2);
        vertex(ch.rel_x + 25 - 5 - 1, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 67 - 2);
    endShape(CLOSE);
    


    //----------JUMPING_LEFT_Face----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(0.5);
    
    beginShape();
        vertex(ch.rel_x + 25 - 5 , ch.y + 77 - 67);
        bezierVertex(ch.rel_x + 25 - 5 - 3, ch.y + 77 - 67,
                        ch.rel_x + 25 - 5 - 3, ch.y + 77 - 57,
                            ch.rel_x + 25 - 5 - 3, ch.y + 77 - 62);
        bezierVertex(ch.rel_x + 25 - 5 - 3, ch.y + 77 - 67,
                        ch.rel_x + 25 - 5 - 3, ch.y + 77 - 57,
                            ch.rel_x + 25 - 5 - 3, ch.y + 77 - 60);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 57);

    endShape(CLOSE);
    
    //----------JUMPING_LEFT_Eyes----------
    
    line(ch.rel_x + 25 - 5 -  2, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 - 5 - 1, ch.y + 77 - 67 + 2.5);
    line(ch.rel_x + 25 - 5 -  1, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 - 5 - 1, ch.y + 77 - 67 + 3);
    
    //----------JUMPING_LEFT_Nouse + Mouth----------
    
    ellipse(ch.rel_x + 25 - 5 - 2, ch.y + 77 - 60, 2,1);


    //----------JUMPING_LEFT_Beard----------
    
    strokeWeight(0.5);
    line(ch.rel_x + 25 - 5 - 2, ch.y + 77 - 60,
            ch.rel_x + 25 - 5 - 2, ch.y + 77 - 56);

    
//----------------------------------------------------------------------------------------------------JUMPING_LEFT_END   
}

                                        //---Neutral_Jump---
    
else if ((!isRight) && (!isLeft) && (!intersection_down(character, platforms, ver_speed).isIntersecting))    
{
    
//----------------------------------------------------------------------------------------------------JUMP_FRONT_START
    
    //!---------JUMP_FRONT_TORSO----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57); 
    endShape(CLOSE); 
    //pop();
    
    
    
    //!--------JUMP_FRONT_HANDS---------
    
    //----------JUMP_FRONT_LeftHand----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 - 21, ch.y + 77 - 62);
        vertex(ch.rel_x + 25 - 16, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 - 18, ch.y + 77 - 75);
        vertex(ch.rel_x + 25 - 16, ch.y + 77 - 74);
        vertex(ch.rel_x + 25 - 14, ch.y + 77 - 73);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 - 16, ch.y + 77 - 62);
    endShape(CLOSE);
    
    //----------JUMP_FRONT_RightHand----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 + 21, ch.y + 77 - 62);
        vertex(ch.rel_x + 25 + 16, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 + 18, ch.y + 77 - 75);
        vertex(ch.rel_x + 25 + 16, ch.y + 77 - 74);
        vertex(ch.rel_x + 25 + 14, ch.y + 77 - 73);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 + 16, ch.y + 77 - 62);
    endShape(CLOSE);
    
    //pop();
    
    
    
    //!---------JUMP_FRONT_LEGS----------
    
    //----------JUMP_FRONT_LeftThigh----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 - 20, ch.y + 77 - 22);
        vertex(ch.rel_x + 25 - 13, ch.y + 77 - 22);
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
    endShape(CLOSE);
    
    //----------JUMP_FRONT_LeftShin----------
    
    beginShape();
        vertex(ch.rel_x + 25 - 20, ch.y + 77 - 22);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 12);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 7);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 10);
        vertex(ch.rel_x + 25 - 13, ch.y + 77 - 22);
    endShape(CLOSE);
    
    //----------JUMP_FRONT_LeftFeet----------
    
    beginShape();
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 12);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 7);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 10);
    endShape(CLOSE);
    
    //----------JUMP_FRONT_RightThigh----------
       
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 20, ch.y + 77 - 22);
        vertex(ch.rel_x + 25 + 13, ch.y + 77 - 22);
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
    endShape(CLOSE);
    
    //----------JUMP_FRONT_LeftShin----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 20, ch.y + 77 - 22);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 12);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 7);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 10);
        vertex(ch.rel_x + 25 + 13, ch.y + 77 - 22);
    endShape(CLOSE);
    
    //----------JUMP_FRONT_LeftFeet----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 12);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 7);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 10);
    endShape(CLOSE);
    
    //pop();
    
    
    
    //!---------JUMP_FRONT_CLOTHES----------
    
    //----------JUMP_FRONT_Chestpiece----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_cloth_2);

    beginShape();
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 62);
        vertex(ch.rel_x + 25, ch.y + 77 - 45);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 62);
    endShape(CLOSE);
    
    strokeWeight(1);
    stroke('Black');
    beginShape();
        vertex(ch.rel_x + 25 - 3, ch.y + 77 - 53 - 2);
        vertex(ch.rel_x + 25 + 3, ch.y + 77 - 53 - 2);
        vertex(ch.rel_x + 25, ch.y + 77 - 50 - 2);
        vertex(ch.rel_x + 25 - 3, ch.y + 77 - 50 - 2);
        vertex(ch.rel_x + 25 + 3, ch.y + 77 - 50 - 2);
        vertex(ch.rel_x + 25, ch.y + 77 - 50 - 2);
        vertex(ch.rel_x + 25, ch.y + 77 - 45 - 4)
        vertex(ch.rel_x + 25, ch.y + 77 - 50 - 2);
        vertex(ch.rel_x + 25 - 3, ch.y + 77 - 53 - 2);
    endShape();
    
    //pop();
    
    //----------JUMP_FRONT_Skirt----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_cloth_1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 - 20, ch.y + 77 - 25);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 25);
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 25);
        vertex(ch.rel_x + 25 + 20, ch.y + 77 - 25);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
    endShape();
    
    fill(ch.col_cloth_2);
    triangle(ch.rel_x + 25 - 10, ch.y + 77 - 25,
                ch.rel_x + 25, ch.y + 77 - 32,
                    ch.rel_x + 25 + 10, ch.y + 77 - 25);
    
    //pop();
    
    //----------JUMP_FRONT_Belt-----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_accessories);
    rect(ch.rel_x + 25 - 7, ch.y + 77 - 36, 14, 3);
    //pop();
    
    
    
    //!---------JUMP_FRONT_HEAD----------
    
    //----------JUMP_FRONT_Headress---------- 
    
    //push();
    fill(ch.col_cloth_1);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10 + 2, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 5 + 1 - 1, ch.y + 77 - 67 - 2);
        vertex(ch.rel_x + 25 + 5 - 1 + 1, ch.y + 77 - 67 - 2);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 10 - 2, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 72);
    endShape(CLOSE);
    //pop();
    
    //push();
    stroke(ch.col_accessories);
    strokeWeight(1);
    line(ch.rel_x + 25 - 10, ch.y + 77 - 67, 
            ch.rel_x + 25 - 5, ch.y + 77 - 67);
    line(ch.rel_x + 25 - 10, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 - 5, ch.y + 77 - 67 + 2.5);
    line(ch.rel_x + 25 - 10, ch.y + 77 - 67 + 5, 
            ch.rel_x + 25 - 5, ch.y + 77 - 67 + 5);
    line(ch.rel_x + 25 - 10, ch.y + 77 - 67 + 7.5, 
            ch.rel_x + 25 - 5, ch.y + 77 - 67 + 7.5);
    line(ch.rel_x + 25 - 10, ch.y + 77 - 67 + 10, 
            ch.rel_x + 25 - 5, ch.y + 77 - 67 + 10);
    
    line(ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67, 
            ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67);
    line(ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67 + 2.5);
    line(ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 5, 
            ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67 + 5);
    line(ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 7.5, 
            ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67 + 7.5);
    line(ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 10, 
            ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67 + 10);
    //pop();
    
    //----------JUMP_FRONT_Backside (darker tone)----------
    
    fill(ch.col_cloth_1);
    strokeWeight(1);
    beginShape();
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 62);
        vertex(ch.rel_x + 25, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 62);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 57); 
    endShape(CLOSE);
    
    //----------JUMP_FRONT_Crown----------
    
    //push();
    fill(ch.col_accessories);
    stroke(0);
    strokeWeight(0.5);
    
    beginShape();
        vertex(ch.rel_x + 25 - 5 + 1 - 1, ch.y + 77 - 67 - 2);
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5 - 1 + 1, ch.y + 77 - 67 - 2);
    endShape(CLOSE);
    
    //----------JUMP_FRONT_Emblem----------
    
    rect(ch.rel_x + 25-1, ch.y + 77 - 67 - 2 - 2, 2, 3);
    

    
    //----------JUMP_FRONT_Face----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(0.5);
    
    beginShape();
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 62);
        vertex(ch.rel_x + 25, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 62);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67);
    endShape(CLOSE);
    
    //----------JUMP_FRONT_Eyes----------
    
    line(ch.rel_x + 25 - 3, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 - 1, ch.y + 77 - 67 + 2.5);
    
    line(ch.rel_x + 25 - 2, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 - 2, ch.y + 77 - 67 + 3);
    
    line(ch.rel_x + 25 + 3, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25, ch.y + 77 - 67 + 2.5);
    
    line(ch.rel_x + 25 + 2, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 + 2, ch.y + 77 - 67 + 3);
    
    
    //----------JUMP_FRONT_Nouse + Mouth----------
    
    line(ch.rel_x + 25, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25, ch.y + 77 - 62);
    ellipse(ch.rel_x + 25, ch.y + 77 - 60, 3, 1);

    //----------JUMP_FRONT_Beard----------
    
    strokeWeight(0.5);
    line(ch.rel_x + 25, ch.y + 77 - 58,
            ch.rel_x + 25, ch.y + 77 - 56);

    
//------------------------------------------------------------------------------------------------------JUMP_FRONT_END
}
    
                                        //---Standing_Still---    
else
{
    
//---------------------------------------------------------------------------------------------------STAND_FRONT_START
    
    //!---------STAND_FRONT_TORSO----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57); 
    endShape(CLOSE); 
    //pop();
    
    
    
    //!--------STAND_FRONT_HANDS---------
    
    //----------STAND_FRONT_LeftHand----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 37);
        vertex(ch.rel_x + 25 - 10 - 1.5, ch.y + 77 - 37 + 2.5);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 37 + 5);
        vertex(ch.rel_x + 25 - 10 - 1, ch.y + 77 - 27);
        vertex(ch.rel_x + 25 - 15 + 1, ch.y + 77 - 27);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 37 + 5);
        vertex(ch.rel_x + 25 - 15 - 1.5, ch.y + 77 - 37 + 5);
        vertex(ch.rel_x + 25 - 15 + 2, ch.y + 77 - 37 + 2.5);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 37);
        vertex(ch.rel_x + 25 - 15, ch.y + 77 - 52);
    endShape(CLOSE);
    
    //----------STAND_FRONT_RightHand----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 37);
        vertex(ch.rel_x + 25 + 10 + 1.5, ch.y + 77 - 37 + 2.5);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 37 + 5);
        vertex(ch.rel_x + 25 + 10 + 1, ch.y + 77 - 27);
        vertex(ch.rel_x + 25 + 15 - 1, ch.y + 77 - 27);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 37 + 5);
        vertex(ch.rel_x + 25 + 15 + 1.5, ch.y + 77 - 37 + 5);
        vertex(ch.rel_x + 25 + 15 - 2, ch.y + 77 - 37 + 2.5);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 37);
        vertex(ch.rel_x + 25 + 15, ch.y + 77 - 52);
    endShape(CLOSE);
    
    //pop();
    
    
    
    //!---------STAND_FRONT_LEGS----------
    
    //----------STAND_FRONT_LeftThigh----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 12);
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 17);
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
    endShape(CLOSE);
    
    //----------STAND_FRONT_LeftShin----------
    
    beginShape();
        vertex(ch.rel_x + 25 - 11, ch.y + 77 - 17);
        vertex(ch.rel_x + 25 - 11 + 5, ch.y + 77 - 17 + 5);
        vertex(ch.rel_x + 25 - 13 + 1.5, ch.y + 77);
        vertex(ch.rel_x + 25 - 13, ch.y + 77);
    endShape(CLOSE);
    
    //----------STAND_FRONT_LeftFeet----------
    
    rect(ch.rel_x + 2, ch.y + 77, 12, 3);
    
    //----------STAND_FRONT_RightThigh----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 12);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 17);
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
    endShape(CLOSE);
    
    //----------STAND_FRONT_RightShin----------
    
    beginShape();
        vertex(ch.rel_x + 25 + 11, ch.y + 77 - 17);
        vertex(ch.rel_x + 25 + 11 - 5, ch.y + 77 - 17 + 5);
        vertex(ch.rel_x + 25 + 13 - 1.5, ch.y + 77);
        vertex(ch.rel_x + 25 + 13, ch.y + 77);
    endShape(CLOSE);
    
    //----------STAND_FRONT_RightFeet----------
    
    rect(ch.rel_x + 25 + 14 - 3, ch.y + 77, 12, 3);
    
    //pop();
    
    
    
    //!---------STAND_FRONT_CLOTHES----------
    
    //----------STAND_FRONT_Chestpiece----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_cloth_2);
    triangle(ch.rel_x + 25 - 15, ch.y + 77 - 57,
                ch.rel_x + 25 + 15, ch.y + 77 - 57,
                    ch.rel_x + 25, ch.y + 77 - 42);
    
    strokeWeight(1);
    stroke('Black');
    beginShape();
        vertex(ch.rel_x + 25 - 3, ch.y + 77 - 53);
        vertex(ch.rel_x + 25 + 3, ch.y + 77 - 53);
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 - 4, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 + 4, ch.y + 77 - 50);
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25, ch.y + 77 - 45)
        vertex(ch.rel_x + 25, ch.y + 77 - 50);
        vertex(ch.rel_x + 25 - 3, ch.y + 77 - 53);
    endShape();
    
    //pop();
    
    //----------STAND_FRONT_Skirt----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_cloth_1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 7, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 17);
        vertex(ch.rel_x + 25, ch.y + 77 - 32);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 17);
        vertex(ch.rel_x + 25 + 7, ch.y + 77 - 32);
    endShape();
    
    fill(ch.col_cloth_2);
    triangle(ch.rel_x + 25 - 10, ch.y + 77 - 17,
                ch.rel_x + 25, ch.y + 77 - 32,
                    ch.rel_x + 25 + 10, ch.y + 77 - 17);
    
    //pop();
    
    //----------STAND_FRONT_Belt-----------
    
    //push();
    stroke(0);
    strokeWeight(1);
    fill(ch.col_accessories);
    rect(ch.rel_x + 25 - 7, ch.y + 77 - 36, 14, 3);
    //pop();
    
    
    
    //!---------STAND_FRONT_HEAD----------
    
    //----------STAND_FRONT_Headress---------- 
    
    //push();
    fill(ch.col_cloth_1);
    stroke(0);
    strokeWeight(1);
    
    beginShape();
        vertex(ch.rel_x + 25 - 5, ch.y + 77 - 72);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 10 + 2, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 5 + 1 - 1, ch.y + 77 - 67 - 2);
        vertex(ch.rel_x + 25 + 5 - 1 + 1, ch.y + 77 - 67 - 2);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 10 - 2, ch.y + 77 - 52);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 10, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5, ch.y + 77 - 72);
    endShape(CLOSE);
    //pop();
    
    //push();
    stroke(ch.col_accessories);
    strokeWeight(1);
    line(ch.rel_x + 25 - 10, ch.y + 77 - 67, 
            ch.rel_x + 25 - 5, ch.y + 77 - 67);
    line(ch.rel_x + 25 - 10, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 - 5, ch.y + 77 - 67 + 2.5);
    line(ch.rel_x + 25 - 10, ch.y + 77 - 67 + 5, 
            ch.rel_x + 25 - 5, ch.y + 77 - 67 + 5);
    line(ch.rel_x + 25 - 10, ch.y + 77 - 67 + 7.5, 
            ch.rel_x + 25 - 5, ch.y + 77 - 67 + 7.5);
    line(ch.rel_x + 25 - 10, ch.y + 77 - 67 + 10, 
            ch.rel_x + 25 - 5, ch.y + 77 - 67 + 10);
    
    line(ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67, 
            ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67);
    line(ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 2.5, 
            ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67 + 2.5);
    line(ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 5, 
            ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67 + 5);
    line(ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 7.5, 
            ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67 + 7.5);
    line(ch.rel_x + 25 + 10 - 1, ch.y + 77 - 67 + 10, 
            ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67 + 10);
    //pop();
    
    //----------STAND_FRONT_Backside (darker tone)----------
    
    fill(ch.col_cloth_1);
    strokeWeight(1);
    beginShape();
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 62);
        vertex(ch.rel_x + 25, ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 62);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 57); 
    endShape(CLOSE);
    
    //----------STAND_FRONT_Crown----------
    
    //push();
    fill(ch.col_accessories);
    stroke(0);
    strokeWeight(0.5);
    
    beginShape();
        vertex(ch.rel_x + 25 - 5 + 1 - 1, ch.y + 77 - 67 - 2);
        vertex(ch.rel_x + 25 - 5 + 1, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5 - 1, ch.y + 77 - 67);
        vertex(ch.rel_x + 25 + 5 - 1 + 1, ch.y + 77 - 67 - 2);
    endShape(CLOSE);
    
    //----------STAND_FRONT_Emblem----------
    
    rect(ch.rel_x + 25 - 1,
         ch.y + 77 - 67 - 2 - 2,
         2,
         3);
    

    
    //----------STAND_FRONT_Face----------
    
    //push();
    fill(ch.col_skin);
    stroke(0);
    strokeWeight(0.5);
    
    beginShape();
        vertex(ch.rel_x + 25 - 5 + 1,
               ch.y + 77 - 67);
        vertex(ch.rel_x + 25 - 5 + 1,
               ch.y + 77 - 62);
        vertex(ch.rel_x + 25,
               ch.y + 77 - 57);
        vertex(ch.rel_x + 25 + 5 - 1,
               ch.y + 77 - 62);
        vertex(ch.rel_x + 25 + 5 - 1,
               ch.y + 77 - 67);
    endShape(CLOSE);
    
    //----------STAND_FRONT_Eyes----------
    
    line(ch.rel_x + 25 - 3,
         ch.y + 77 - 67 + 2.5,
         ch.rel_x + 25 - 1,
         ch.y + 77 - 67 + 2.5);
    line(ch.rel_x + 25 + 3,
         ch.y + 77 - 67 + 2.5,
         ch.rel_x + 25,
         ch.y + 77 - 67 + 2.5); 
    
    //----------STAND_FRONT_Nouse + Mouth----------
    
    line(ch.rel_x + 25,
         ch.y + 77 - 67 + 2.5, 
         ch.rel_x + 25,
         ch.y + 77 - 62);
    line(ch.rel_x + 25 - 1,
         ch.y + 77 - 60,
         ch.rel_x + 25 + 1,
         ch.y + 77 - 60);

    //----------STAND_FRONT_Beard----------
    
    strokeWeight(0.5);
    line(ch.rel_x + 25, ch.y + 77 - 58,
            ch.rel_x + 25, ch.y + 77 - 56);
    
//-----------------------------------------------------------------------------------------------------STAND_FRONT_END
}
}

//---Functions for the collectables
function draw_collectables(collect_item)
{
    if (!collect_item.isFound)
        {
            // Part 1 - Gold
            strokeWeight(1.5);
            fill(character.col_accessories);

            beginShape();
                vertex(collect_item.x + 1, collect_item.y + 43);
                vertex(collect_item.x + 1, collect_item.y + 50);
                vertex(collect_item.x + 8, collect_item.y + 50);
            endShape(CLOSE);

            beginShape();
                vertex(collect_item.x + 14, collect_item.y + 41);
                vertex(collect_item.x + 10, collect_item.y + 37);
                vertex(collect_item.x + 17, collect_item.y + 30);
            vertex(collect_item.x + 21, collect_item.y + 34);
            endShape(CLOSE);

            beginShape();
                vertex(collect_item.x + 28, collect_item.y + 27);
                vertex(collect_item.x + 24, collect_item.y + 23);
                vertex(collect_item.x + 32, collect_item.y + 15);
            vertex(collect_item.x + 36, collect_item.y + 19);
            endShape(CLOSE);

            beginShape();
                vertex(collect_item.x + 35, collect_item.y + 11);
                vertex(collect_item.x + 31, collect_item.y + 7);
                vertex(collect_item.x + 35, collect_item.y + 3);
            vertex(collect_item.x + 39, collect_item.y + 7);
            endShape(CLOSE);

            beginShape();
                vertex(collect_item.x + 39, collect_item.y + 7);
                vertex(collect_item.x + 44, collect_item.y + 2);
                vertex(collect_item.x + 49, collect_item.y + 7);
            vertex(collect_item.x + 44, collect_item.y + 12);
            endShape(CLOSE);

            beginShape();
                vertex(collect_item.x + 44, collect_item.y + 15);
                vertex(collect_item.x + 47, collect_item.y + 18);
                vertex(collect_item.x + 39, collect_item.y + 22);
            endShape(CLOSE);

            // Part 2 - Gold
            beginShape();
                vertex(collect_item.x + 50, collect_item.y + 43);
                vertex(collect_item.x + 43, collect_item.y + 50);
                vertex(collect_item.x + 50, collect_item.y + 50);
            endShape(CLOSE);

            beginShape();
                vertex(collect_item.x + 44, collect_item.y + 48);
                vertex(collect_item.x + 26, collect_item.y + 30);
                vertex(collect_item.x + 30, collect_item.y + 26);
                vertex(collect_item.x + 48, collect_item.y + 44);
            endShape(CLOSE);

            beginShape();
                vertex(collect_item.x + 21, collect_item.y + 25);
                vertex(collect_item.x + 25, collect_item.y + 21);
                vertex(collect_item.x + 8, collect_item.y + 4);
                vertex(collect_item.x + 8, collect_item.y + 12);
            endShape(CLOSE);

            // Part 1 - Blue
            fill(character.col_cloth_1);

            beginShape();
                vertex(collect_item.x + 3, collect_item.y + 44);
                vertex(collect_item.x + 7, collect_item.y + 48);
                vertex(collect_item.x + 13, collect_item.y + 42);
                vertex(collect_item.x + 13, collect_item.y + 41);
                vertex(collect_item.x + 10, collect_item.y + 38);
                vertex(collect_item.x + 9, collect_item.y + 38);
            endShape(CLOSE);

            beginShape();
                vertex(collect_item.x + 18, collect_item.y + 30);
                vertex(collect_item.x + 18, collect_item.y + 29);
                vertex(collect_item.x + 23, collect_item.y + 24);
                vertex(collect_item.x + 24, collect_item.y + 24);
                vertex(collect_item.x + 27, collect_item.y + 27);
                vertex(collect_item.x + 27, collect_item.y + 28);
                vertex(collect_item.x + 22, collect_item.y + 33);
                vertex(collect_item.x + 21, collect_item.y + 33);
            endShape(CLOSE);

            beginShape();
                vertex(collect_item.x + 36, collect_item.y + 18);
                vertex(collect_item.x + 30, collect_item.y + 12);
                vertex(collect_item.x + 30, collect_item.y + 8);
                vertex(collect_item.x + 31, collect_item.y + 8);
                vertex(collect_item.x + 37, collect_item.y + 14);
            endShape(CLOSE);

            beginShape();
                vertex(collect_item.x + 36, collect_item.y + 3);
                vertex(collect_item.x + 36, collect_item.y + 2);
                vertex(collect_item.x + 37, collect_item.y + 1);
                vertex(collect_item.x + 43, collect_item.y + 1);
                vertex(collect_item.x + 43, collect_item.y + 3);
                vertex(collect_item.x + 40, collect_item.y + 6);
                vertex(collect_item.x + 39, collect_item.y + 6);
            endShape(CLOSE);

            beginShape();
                vertex(collect_item.x + 44, collect_item.y + 14);
                vertex(collect_item.x + 45, collect_item.y + 12);
                vertex(collect_item.x + 49, collect_item.y + 8);
                vertex(collect_item.x + 50, collect_item.y + 8);
                vertex(collect_item.x + 50, collect_item.y + 17);
                vertex(collect_item.x + 48, collect_item.y + 18);
            endShape(CLOSE);

            // Part 2 - Blue
            fill('Crimson');
            beginShape();
                vertex(collect_item.x + 8, collect_item.y + 4);
                vertex(collect_item.x + 14, collect_item.y + 17);
                vertex(collect_item.x + 2, collect_item.y + 17);
            endShape(CLOSE);

            line(collect_item.x + 2, collect_item.y + 28, 
                 collect_item.x + 2, collect_item.y + 18);
            line(collect_item.x + 8, collect_item.y + 28, 
                 collect_item.x + 8, collect_item.y + 18);
            line(collect_item.x + 14, collect_item.y + 28, 
                 collect_item.x + 14, collect_item.y + 18);
        }            
}

function check_collectables(collect_item)
{
    if((!collect_item.isFound) && 
        dist(character.x + character.width/2, character.y + character.height/2, 
             collect_item.x + 25, collect_item.y + 25) < 35)
        {
            collect_item.isFound = true;
            game_score += 1;
            
            sound_pickup.play();
        }
}

//---Dunctions for the 1-Ups
function draw_heart(count_x, count_y, scale)
{
        strokeWeight(1);
        stroke(0);
        fill(character.col_accessories);
        beginShape(TRIANGLES);
        
            vertex(count_x + 25 - 25 * scale / 10, 
                   count_y - 30);
            vertex(count_x + 25 + 25 * scale / 10, 
                   count_y - 30);
            vertex(count_x + 25, 
                   count_y - 30 - 25 * scale / 2);
            vertex(count_x + 25,
                   count_y - 30 - 25 * scale / 2);
            vertex(count_x + 25 + 25 * scale / 4,
                   count_y - 30 - 25 * scale / 3);
            vertex(count_x + 25 + 25 * scale / 4,
                   count_y - 30 - 25 * scale / 2);
            vertex(count_x + 25,
                   count_y - 30 - 25 * scale / 2);
            vertex(count_x + 25 - 25 * scale / 4,
                   count_y - 30 - 25 * scale / 3);
            vertex(count_x + 25 - 25 * scale / 4,
                   count_y - 30 - 25 * scale / 2);
            vertex(count_x + 25,
                   count_y - 30 - 25 * scale / 3);
            vertex(count_x + 25 - 25 * scale / 4,
                   count_y - 30 - 25 * scale / 1.05);
            vertex(count_x + 25 + 25 * scale / 4,
                   count_y - 30 - 25 * scale / 1.05);
        endShape(CLOSE);

        fill('Crimson')
        beginShape();
            vertex(count_x + 25,
                   count_y - 30 - 25 * scale / 1.8);
            vertex(count_x + 25 - 25 * scale / 9,
                   count_y - 30 - 25 * scale / 1.2);
            vertex(count_x + 25 + 25 * scale / 9,
                   count_y - 30 - 25 * scale / 1.2);
        endShape(CLOSE);
}

function draw_1up(platf, heart)
{
    let heart_x = platf[heart.platf_ind].x + heart.offset;
    let heart_y = platf[heart.platf_ind].y;
        
    if (!heart.isPickedUp)
    { 
        draw_heart(heart_x, heart_y, 1.4);
    }
    
    if (heart.checkpoint)
    {
            //---Postament
            fill(bg.col_stone);
            beginShape();
                vertex(heart_x + 25 - 15, heart_y );
                vertex(heart_x + 25 - 15, heart_y  - 15);
                vertex(heart_x + 40, heart_y  - 15);
                vertex(heart_x + 40, heart_y );
            endShape(CLOSE);

            fill('Crimson')
            beginShape();
                vertex(heart_x + 25 - 15, heart_y  - 15);
                vertex(heart_x + 25 - 25, heart_y  - 30);
                vertex(heart_x + 25 + 25, heart_y  - 30);
                vertex(heart_x + 25 + 15, heart_y  - 15);
            endShape(CLOSE);
        }
    
}

function check_1up(platf, heart)
{
    let heart_x = platf[heart.platf_ind].x + heart.offset;
    let heart_y = platf[heart.platf_ind].y;
    if ((!heart.isPickedUp) && 
        (dist(character.x + character.width/2, character.y + character.height/2, heart_x + 25, heart_y - 40) < 35))
        {
            heart.isPickedUp = true;
            lives += 1;
            
            if (heart.checkpoint)
                {
                    restart_point.x = heart_x;
                    restart_point.y = heart_y - character.height;
                }
            
            sound_pickup.play();
        }
}

//---Checking the fall into the canyon
function check_game_over()
{
    if ((character.y > height) || (flag.isReached))
        {
            gameover();
        }
}

//---Checking different gameover situations (lose a life, win/lose the game) and responding accordingly
function gameover()
{
    if ((!flag.isReached) && (lives > 1))
        {
            lives -= 1;
            character.x = restart_point.x;
            character.y = restart_point.y;
            ver_speed = 0;
            cam_adjust();
            
            sound_hit.play();
        }
   
    else 
        {
            push();

            strokeWeight(3);
            stroke(0);       
            textSize(50);
            textAlign(CENTER, CENTER);

            if (!flag.isReached)
                {
                    lives -= 1;
                    fill(255, 0, 0);
                    text("Game over.\nPress space to continue.", width/2 - cam_pos, height/2);
                    
                    BGM.pause();
                    sound_lose.play();
                }
            
            else
                {
                    fill(0, 255, 0);
                    text("Level complete.\nPress space to continue.", width/2 - cam_pos, height/2);
                    
                    BGM.pause();
                    sound_win.play();
                }
            
            pop();

            game_over = true;
        }
}

//---Functions for the flagpole, I switched the dist check, because it doesn't interact very well with the objects of the different size
function draw_flagpole(flag)
{
    strokeWeight(2);
    
    //Left side
    fill('#FFE082');
    
    rect(flag.x + 1, flag.y + 280, 65, 20);
    
    beginShape();
        vertex(flag.x + 24, flag.y + 280);
        vertex(flag.x + 35, flag.y + 20);
        vertex(flag.x + 50, flag.y + 20);
        vertex(flag.x + 50, flag.y + 280);    
    endShape(CLOSE);
    
    //Right side
    fill ('#FFCA28');
    
    rect(flag.x + 65, flag.y + 280, 35, 20);
    
    beginShape();
        vertex(flag.x + 50, flag.y + 20);
        vertex(flag.x + 50, flag.y + 280);
        vertex(flag.x + 76, flag.y + 280);
        vertex(flag.x + 65, flag.y + 20);    
    endShape(CLOSE);
     
    
    
    //Separation
    line(flag.x + 50, flag.y + 20, flag.x + 50, flag.y + 280);
    line(flag.x + 35, flag.y + 20, flag.x + 65, flag.y + 20);
    
    if (flag.isReached)
        {
            //Top
            fill("#FF0000");
            triangle(flag.x + 35, flag.y + 20, 
                        flag.x + 50, flag.y + 1, 
                            flag.x + 50, flag.y + 20);
            
            fill("#DC143C");
            triangle(flag.x + 65, flag.y + 20, 
                        flag.x + 50, flag.y + 1, 
                            flag.x + 50, flag.y + 20);
        }
}

function check_flagpole(end_point)
{
    if (!end_point.isReached)
        {
//            if (dist(character.x + character.width/2, character.y + character.height/2, 
//                        end_point.x + 50, end_point.y + 300 - character.height/2) < 50)
            if (isIntersecting_leftBorder(character, flag, v).intersect)
                {
                    end_point.isReached = true;
                    draw_flagpole(flag);
                    gameover();
                }
        }
}

//---Functions that checks intersection between two rectangular objects: it builds 3 vectors from one line to the other, and checks if they will "connect". It's also returns the distance between them.
//The whole idea besides my take on the "platforms" concept - if the character moves, we check distances to the platform in horizontal and vertical dimensions, and if the next "step" would make them intersect it move them one to another and don't let them intersect, creating something akin to the solid borders.
function isIntersecting_topBorder(ch, section, vec)
{
    let vector_down_1 = ((ch.x >= section.x) && 
                         (ch.x <= section.x + section.width) && 
                         (ch.y + ch.height <= section.y) && 
                         (ch.y + ch.height + vec >= section.y));

    let vector_down_2 = ((ch.x + ch.width/2 >= section.x) && 
                         (ch.x + ch.width/2 <= section.x + section.width) && 
                         (ch.y + ch.height <= section.y) && 
                         (ch.y + ch.height + vec >= section.y));

    let vector_down_3 = ((ch.x + ch.width >= section.x) && 
                         (ch.x + ch.width <= section.x + section.width) && 
                         (ch.y + ch.height <= section.y) && 
                         (ch.y + ch.height + vec >= section.y));

    let dist_to_top_platform = (section.y - ch.y - ch.height - 1);
    
    return {intersect: (vector_down_1 || vector_down_2 || vector_down_3), dist: dist_to_top_platform};
}

function isIntersecting_leftBorder(ch, section, vec)
{
    let vector_right_1 = ((ch.x + ch.width <= section.x) && 
                     (ch.x + ch.width + vec >= section.x) && 
                     (ch.y >= section.y) && 
                     (ch.y <= section.y + section.height));

    let vector_right_2 = ((ch.x + ch.width <= section.x) && 
                     (ch.x + ch.width + vec >= section.x) && 
                     (ch.y + ch.height/2 >= section.y) && 
                     (ch.y + ch.height/2 <= section.y + section.height));

    let vector_right_3 = ((ch.x + ch.width <= section.x) && 
                     (ch.x + ch.width + vec >= section.x) && 
                     (ch.y + ch.height >= section.y) && 
                     (ch.y + ch.height <= section.y + section.height));

    let dist_to_left_wall = (section.x - ch.x - ch.width - 1);
    
    return {intersect: (vector_right_1 || vector_right_2 || vector_right_3), dist: dist_to_left_wall};
}

function isIntersecting_rightBorder(ch, section, vec)
{
    let vector_left_1 = ((ch.x >= section.x + section.width) && 
                     (ch.x - vec <= section.x + section.width) && 
                     (ch.y >= section.y) && 
                     (ch.y <= section.y + section.height));

    let vector_left_2 = ((ch.x >= section.x + section.width) && 
                     (ch.x - vec <= section.x + section.width) && 
                     (ch.y + ch.height/2 >= section.y) && 
                     (ch.y + ch.height/2 <= section.y + section.height));

    let vector_left_3 = ((ch.x >= section.x + section.width) && 
                     (ch.x - vec <= section.x + section.width) && 
                     (ch.y + ch.height >= section.y) && 
                     (ch.y + ch.height <= section.y + section.height));

    let dist_to_right_wall = (ch.x - section.x - section.width - 1);
    
    return {intersect: (vector_left_1 || vector_left_2 || vector_left_3), dist: dist_to_right_wall};
}

function isIntersecting_botBorder(ch, section, vec)
{
    let vector_up_1 = ((ch.x >= section.x) && 
                         (ch.x <= section.x + section.width) && 
                         (ch.y >= section.y + section.height) && 
                         (ch.y + vec <= section.y + section.height));

    let vector_up_2 = ((ch.x + ch.width/2 >= section.x) && 
                         (ch.x + ch.width/2 <= section.x + section.width) && 
                         (ch.y >= section.y + section.height) && 
                         (ch.y + vec <= section.y + section.height));

    let vector_up_3 = ((ch.x + ch.width >= section.x) && 
                         (ch.x + ch.width <= section.x + section.width) && 
                         (ch.y >= section.y + section.height) && 
                         (ch.y + vec <= section.y + section.height));

    let dist_to_bot_platform = (ch.y - section.y - section.height);
    
    return {intersect: (vector_up_1 || vector_up_2 || vector_up_3), dist: dist_to_bot_platform};
}

//---Functions that check all the intersections between character and all platforms
function intersection_down(ch, arr, vec)
{
    let intersect = false;
    let min_dist_to_top_platform = g;
    
    for (let i = 0 ; i < arr.length ; i++)
        {
            if (!arr[i].ethereal)
                {
                    intersect = (intersect || isIntersecting_topBorder(ch, arr[i], vec).intersect);

                    if (isIntersecting_topBorder(ch, arr[i], vec).intersect)
                        {
                            min_dist_to_top_platform = min(min_dist_to_top_platform, 
                                                           isIntersecting_topBorder(ch, arr[i], vec).dist);
                        }
                }
            

        }

    return {isIntersecting: intersect, distance: min_dist_to_top_platform};
}

function intersection_to_right(ch, arr, vec)
{
    let intersect = false;
    let min_dist_to_left_wall = vec;
    
    for (let i = 0 ; i < arr.length ; i++)
        {
            if (!arr[i].ethereal)
                {
                    intersect = (intersect || isIntersecting_leftBorder(ch, arr[i], vec).intersect);
            
                    if (isIntersecting_leftBorder(ch, arr[i], vec).intersect)
                        {
                            min_dist_to_left_wall = min(min_dist_to_left_wall, 
                                                        isIntersecting_leftBorder(ch, arr[i], vec).dist);
                        }
                }
            
            
        }   
    
    return {isIntersecting: intersect, distance: min_dist_to_left_wall}
}

function intersection_to_left(ch, arr, vec)
{
    let intersect = false;
    let min_dist_to_right_wall = vec;
    
    for (let i = 0 ; i < arr.length ; i++)
        {
            if (!arr[i].ethereal)
            {
                intersect = (intersect || isIntersecting_rightBorder(ch, arr[i], vec).intersect);
            
                if (isIntersecting_rightBorder(ch, arr[i], vec).intersect)
                    {
                        min_dist_to_right_wall = min(min_dist_to_right_wall, 
                                                     isIntersecting_rightBorder(ch, arr[i], vec).dist);
                    }
            }
                
            
        }   
    
    return {isIntersecting: intersect, distance: min_dist_to_right_wall}
}

function intersection_top(ch, arr, vec)
{
    let intersect = false;
    let min_dist_to_bot_platform = vec;
    
    for (let i = 0 ; i < arr.length ; i++)
        {
            if (!arr[i].ethereal)
            {
                intersect = (intersect || isIntersecting_botBorder(ch, arr[i], vec).intersect);

                if (isIntersecting_botBorder(ch, arr[i], vec).intersect)
                    {
                        min_dist_to_bot_platform = min(min_dist_to_bot_platform, 
                                                       isIntersecting_botBorder(ch, arr[i], vec).dist);
                    }
            }

        }
    return {isIntersecting: intersect, distance: min_dist_to_bot_platform};
}

//---Functions that "activates" platform movement and describe physical interactions with the character
function platform_movement(platforms, moving_platforms)
{
    for (let i = 0 ; i < moving_platforms.length ; i++)
        {
            
            if (moving_platforms[i].index <= (platforms.length - 1))
                {
                    platforms[moving_platforms[i].index].moving = true;
                    let step = sin(timer/moving_platforms[i].period) * moving_platforms[i].sway;
                    
                    if (moving_platforms[i].move == "hor")
                    {
                        if (isIntersecting_topBorder(character, platforms[moving_platforms[i].index], ver_speed).intersect)
                            {
                                if (step > 0)
                                    {
                                        move_right(character, platforms, step);
                                    }
                                else 
                                    {
                                        move_left(character, platforms, -step);
                                    }
                            }

                        if ((!platforms[moving_platforms[i].index].ethereal) && 
                            (isIntersecting_leftBorder(character, platforms[moving_platforms[i].index], abs(step)).intersect))
                            {
                                let dist_to_left = isIntersecting_leftBorder(character, platforms[moving_platforms[i].index], abs(step)).dist;
                                if (dist_to_left > abs(step))
                                    {
                                        platforms[moving_platforms[i].index].x += step;
                                    }
                                else
                                    {
                                        platforms[moving_platforms[i].index].x += step;
                                        if (step > 0)
                                            {
                                                move_right(character, platforms, (step/abs(step)) * (abs(step) - dist_to_left));
                                            }
                                        else 
                                            {
                                                move_left(character, platforms, -(step/abs(step)) * (abs(step) - dist_to_left));
                                            }
                                    }

                            }
                        else if ((!platforms[moving_platforms[i].index].ethereal) && 
                                 (isIntersecting_rightBorder(character, platforms[moving_platforms[i].index], step).intersect))
                            {
                                let dist_to_right = isIntersecting_rightBorder(character, platforms[moving_platforms[i].index], step).dist;
                                if (dist_to_right > abs(step))
                                    {
                                        platforms[moving_platforms[i].index].x += step;
                                    }
                                else
                                    {
                                        platforms[moving_platforms[i].index].x += step;
                                        if (step > 0)
                                            {
                                                move_right(character, platforms, (step/abs(step)) * (abs(step) - dist_to_right));
                                            }
                                        else 
                                            {
                                                move_left(character, platforms, -(step/abs(step)) * (abs(step) - dist_to_right));
                                            }
                                    }
                            }
                        else 
                            {
                                platforms[moving_platforms[i].index].x += step;
                            }
                    }
                    
                    else
                    {
                        if ((!platforms[moving_platforms[i].index].ethereal) && 
                            (isIntersecting_topBorder(character, platforms[moving_platforms[i].index], ver_speed).intersect))
                            {
                                platforms[moving_platforms[i].index].y += step;
                                character.y = platforms[moving_platforms[i].index].y - character.height;
                            }
//                        
                        else platforms[moving_platforms[i].index].y += step;
                    }
                }
        }
}

//---Function that makes vanishing blocks appear and disappear 
function ethereal(all_platforms, vanishing_info)
{
    for (let i = 0 ; i < all_platforms.length ; i++)
        {
            for (let j = 0 ; j < vanishing_info.length ; j++)
                {
                    if (i == vanishing_info[j].index)
                    {
                        if ((timer%(60 * (vanishing_info[j].on + vanishing_info[j].off)) - 
                                                timer%(60)) < (60 * vanishing_info[j].on))
                            {
                                all_platforms[i].ethereal = false;
                                all_platforms[i].border_color[3] = 255;
                                all_platforms[i].fill_color[3] = 255;
                            }
                        else
                            {
                                all_platforms[i].ethereal = true;
                                all_platforms[i].border_color[3] = 50;
                                all_platforms[i].fill_color[3] = 50;
                            }
                    }
                }            
        }
}

//---Function that pushes player up, if he is intersected with the moving platform 
function out_of_bounds(ch, arr)
{
    for (let i = 0; i < arr.length ; i++)
        {
            let x_inside = (((ch.x >= arr[i].x) && 
                                (ch.x <= arr[i].x + arr[i].width)) || 
                           ((ch.x + ch.width >= arr[i].x) && 
                                (ch.x + ch.width <= arr[i].x + arr[i].width)));
            let y_inside = (((ch.y + ch.height > arr[i].y) && 
                          (ch.y + ch.height < arr[i].y + arr[i].height)));
            if (!arr[i].ethereal)
                {
                    if (x_inside && y_inside)
                        {
                            console.log("kek");
                            ch.y = arr[i].y - ch.height;
                        }
                }
        }
        
}

//---Function that add gravitational physics (uniformly accelerated movement)to the game
function gravity(ch, platf, gravity)
{
    let grav = g;
    
    if ((!intersection_down(ch, platf, gravity).isIntersecting) && (!intersection_top(ch, platf, gravity).isIntersecting))
        {
            grav = pow(grav, 1.000001);
            ver_speed += grav;
            ch.y += ver_speed;
        }
    else
        {
            ch.y += intersection_down(ch, platf, gravity).distance;
            ver_speed = g;
            grav = g;
        }
}

//---Function that draw platforms
function draw_platforms_hor()
{
    for (let i = 0 ; i < platforms.length ; i++)
        {
            strokeWeight(platforms[i].border_stroke);
            stroke(platforms[i].border_color);            
            fill(platforms[i].fill_color);

            rect(platforms[i].x,
                 platforms[i].y, 
                 platforms[i].width, 
                 platforms[i].height);
        }
}

//---Functions to "teleport" character to the cursor
function mousePressed()
{
    character.x = mouseX - cam_pos;
    character.y = mouseY;   
}

//---Game timer that resets unlike the frameCount
function time()
{
    timer += 1;
}

//---Constructor functions for the enemies.

//The first function creates enemies array based on the indexes of the platforms. It also specifies the starting position, range of the movement, size, and speed of the enemy. There is also an update method, to control the position of the moving enemy, draw it, and check the interaction with the player.

//The second function creates enemies in the air, by shifting from the selected platform. This type of enemies come in two ways: horizontal- and vertical- moving.

//Constructor functions are a neat tool, and if I would not be so time constricted I would try to remake some early parts using constructors. Thanks to the video, I understood the concept pretty quickly, but to implement them more effectively took some experimentation time. Constructor functions are based upon all previous concepts, so working with them I practiced everything: arrays, functions, properties, and methods.    
function Enemies1(platf_arr, enemy_ind, size, speed)
{
    this.x = platf_arr[enemy_ind].x;
    this.start = platf_arr[enemy_ind].x;
    this.y = platf_arr[enemy_ind].y - size;
    this.range = platf_arr[enemy_ind].width;
    this.size = size;
    this.speed = speed;
    
    let path = this.x + this.range - this.size;
    
    this.update = function()
    {
        if ((this.speed > 0) && (this.x + this.speed <= path - (path % speed)))
            {
                this.x += this.speed;
            }
        else if ((this.speed < 0) && (this.x + this.speed >= this.start))
            {
                this.x += this.speed;
            }
        else
            {
                this.speed = - this.speed;
            }
    }
    
    this.draw = function()
    {
        this.update();
        
        //Move_right
        if(this.speed > 0)
            {
                strokeWeight(1);
                stroke('Black');

                fill('Green');          
                beginShape();                
                    vertex(this.x + 1, this.y + 25);
                    vertex(this.x + 1, this.y + 50);
                    vertex(this.x + 8, this.y + 50);
                    vertex(this.x + 8, this.y + 40);
                endShape(CLOSE);

                beginShape();                
                    vertex(this.x + 17, this.y + 30);
                    vertex(this.x + 17, this.y + 50);
                    vertex(this.x + 22, this.y + 50);
                    vertex(this.x + 22, this.y + 40);
                    vertex(this.x + 24, this.y + 40);
                    vertex(this.x + 24, this.y + 50);
                    vertex(this.x + 29, this.y + 50);
                    vertex(this.x + 29, this.y + 30);
                endShape(CLOSE);

                beginShape();                
                    vertex(this.x + 43, this.y + 1);
                    vertex(this.x + 50, this.y + 8);
                    vertex(this.x + 50, this.y + 13);
                    vertex(this.x + 39, this.y + 18);
                    vertex(this.x + 50, this.y + 29);
                    vertex(this.x + 50, this.y + 50);
                    vertex(this.x + 37, this.y + 50);
                    vertex(this.x + 37, this.y + 30);
                    vertex(this.x + 23, this.y + 13);
                    vertex(this.x + 32, this.y + 1);
                endShape(CLOSE);

                beginShape();                
                    vertex(this.x + 23, this.y + 1);
                    vertex(this.x + 12, this.y + 12);
                    vertex(this.x + 28, this.y + 26);
                    vertex(this.x + 25, this.y + 26);
                    vertex(this.x + 8, this.y + 13);
                    vertex(this.x + 19, this.y + 1);
                endShape(CLOSE);

                fill("yellow");
                beginShape();
                    vertex(this.x + 8, this.y + 40);
                    vertex(this.x + 8, this.y + 50);
                    vertex(this.x + 17, this.y + 50);
                    vertex(this.x + 17, this.y + 30);
                    vertex(this.x + 11, this.y + 30);
                    vertex(this.x + 11, this.y + 40);
                endShape(CLOSE);

                beginShape();
                    vertex(this.x + 29, this.y + 30);
                    vertex(this.x + 29, this.y + 50);
                    vertex(this.x + 37, this.y + 50);
                    vertex(this.x + 37, this.y + 40);
                    vertex(this.x + 35, this.y + 40);
                    vertex(this.x + 35, this.y + 30);
                endShape(CLOSE);

                beginShape();
                    vertex(this.x + 32, this.y + 1);
                    vertex(this.x + 23, this.y + 13);
                    vertex(this.x + 34, this.y + 27);
                    vertex(this.x + 27, this.y + 26);
                    vertex(this.x + 12, this.y + 12);
                    vertex(this.x + 23, this.y + 1);
                endShape(CLOSE);

                line(this.x + 39, this.y + 5,
                        this.x + 39, this.y + 9);
                line(this.x + 37, this.y + 7,
                        this.x + 41, this.y + 7);

                stroke('Red');
                line(this.x + 50, this.y + 18,
                this.x + 45, this.y + 16);
            }
        //Move_left
        else
            {
                strokeWeight(1);
                stroke('Black');

                fill('Green');          
                beginShape();                
                    vertex(this.x + 50, this.y + 25);
                    vertex(this.x + 50, this.y + 50);
                    vertex(this.x + 43, this.y + 50);
                    vertex(this.x + 43, this.y + 40);
                endShape(CLOSE);

                beginShape();                
                    vertex(this.x + 22, this.y + 30);
                    vertex(this.x + 22, this.y + 50);
                    vertex(this.x + 27, this.y + 50);
                    vertex(this.x + 27, this.y + 40);
                    vertex(this.x + 29, this.y + 40);
                    vertex(this.x + 29, this.y + 50);
                    vertex(this.x + 34, this.y + 50);
                    vertex(this.x + 34, this.y + 30);
                endShape(CLOSE);

                beginShape();                
                    vertex(this.x + 8, this.y + 1);
                    vertex(this.x + 1, this.y + 8);
                    vertex(this.x + 1, this.y + 13);
                    vertex(this.x + 12, this.y + 18);
                    vertex(this.x + 1, this.y + 29);
                    vertex(this.x + 1, this.y + 50);
                    vertex(this.x + 14, this.y + 50);
                    vertex(this.x + 14, this.y + 30);
                    vertex(this.x + 28, this.y + 13);
                    vertex(this.x + 19, this.y + 1);
                endShape(CLOSE);

                beginShape();                
                    vertex(this.x + 28, this.y + 1);
                    vertex(this.x + 39, this.y + 12);
                    vertex(this.x + 23, this.y + 26);
                    vertex(this.x + 26, this.y + 26);
                    vertex(this.x + 43, this.y + 13);
                    vertex(this.x + 32, this.y + 1);
                endShape(CLOSE);

                fill("yellow");
                beginShape();
                    vertex(this.x + 43, this.y + 40);
                    vertex(this.x + 43, this.y + 50);
                    vertex(this.x + 34, this.y + 50);
                    vertex(this.x + 34, this.y + 30);
                    vertex(this.x + 40, this.y + 30);
                    vertex(this.x + 40, this.y + 40);
                endShape(CLOSE);

                beginShape();
                    vertex(this.x + 22, this.y + 30);
                    vertex(this.x + 22, this.y + 50);
                    vertex(this.x + 14, this.y + 50);
                    vertex(this.x + 14, this.y + 40);
                    vertex(this.x + 16, this.y + 40);
                    vertex(this.x + 16, this.y + 30);
                endShape(CLOSE);

                beginShape();
                    vertex(this.x + 19, this.y + 1);
                    vertex(this.x + 28, this.y + 13);
                    vertex(this.x + 17, this.y + 27);
                    vertex(this.x + 23, this.y + 26);
                    vertex(this.x + 39, this.y + 12);
                    vertex(this.x + 28, this.y + 1);
                endShape(CLOSE);

                line(this.x + 12, this.y + 5,
                        this.x + 12, this.y + 9);
                line(this.x + 10, this.y + 7,
                        this.x + 14, this.y + 7);

                stroke('Red');
                line(this.x + 1, this.y + 18,
                this.x + 6, this.y + 16);    
            }
        
    }
    
    this.check_contact = function()
    {
        if (dist(character.x + character.width/2, character.y + character.height/2,
                 this.x + size/2, this.y + size/2) < 60)
            {
                gameover();
            }
    }
}

function Enemies2(platf_arr, enemy_ind, offset_x, offset_y, vector, size, speed, range)
{
    this.x = platf_arr[enemy_ind].x + offset_x;
    this.start_x = platf_arr[enemy_ind].x + offset_x;
    this.y = platf_arr[enemy_ind].y - size - offset_y;
    this.start_y = platf_arr[enemy_ind].y - size - offset_y;
    this.vect = vector;
    this.size = size;
    this.speed = speed;
    this.range = range;
    
    this.update = function()
    {
        if (this.vect == "vertical")
            {
                let path = this.start_y - this.range;
                    
                if ((this.speed > 0) && (this.y - this.speed > path - (path % this.speed)))
                    {
                        this.y -= this.speed;
                    }
                else if ((this.speed < 0) && (this.y + this.speed < this.start_y))
                    {
                        this.y -= this.speed
                    }
                else
                    {
                        this.speed = - this.speed;
                    }
            }
        else
            {
                let path = this.start_x + this.range;
                
                if ((this.speed > 0) && (this.x + this.speed < path - (path % this.speed)))
                    {
                        this.x += this.speed;
                    }
                else if ((this.speed < 0) && (this.x + this.speed > this.start_x))
                    {
                        this.x += this.speed
                    }
                else
                    {
                        this.speed = - this.speed;
                    }
            }
    }
    
    this.draw = function()
    {
        this.update();
        
        if(((this.vect == "vertical") && (character.x <= this.x)) || 
                ((this.vect == "horizontal") && (this.speed < 0)))
            {
                // Bird_move_left

                strokeWeight(1);
                stroke('Black');
                fill('#800000');

                //Main-body
                beginShape();
                    vertex(this.x + 7, this.y + 1);
                    vertex(this.x + 4, this.y + 4);
                    vertex(this.x + 4, this.y + 10);
                    vertex(this.x + 20, this.y + 26);
                    vertex(this.x + 23, this.y + 38);
                    vertex(this.x + 38, this.y + 38);
                    vertex(this.x + 38, this.y + 27);
                    vertex(this.x + 12, this.y + 1);
                endShape(CLOSE);

                //Leg
                beginShape();
                    vertex(this.x + 11, this.y + 25);
                    vertex(this.x + 8, this.y + 33);
                    vertex(this.x + 18, this.y + 29);
                endShape(CLOSE);

                //Wing
                fill('#800000');
                beginShape();
                    vertex(this.x + 19, this.y + 1);
                    vertex(this.x + 14, this.y + 14);
                    vertex(this.x + 20, this.y + 21);
                    vertex(this.x + 36, this.y + 18);
                    vertex(this.x + 38, this.y + 1);
                endShape(CLOSE);

                //Breast + strokes
                strokeWeight(0.5);
                fill('White');
                beginShape();
                    vertex(this.x + 8, this.y + 13);
                    vertex(this.x + 8, this.y + 23);
                    vertex(this.x + 21, this.y + 32);
                    vertex(this.x + 20, this.y + 25);
                endShape(CLOSE);

                beginShape();
                    vertex(this.x + 38, this.y + 1);
                    vertex(this.x + 36, this.y + 18);
                    vertex(this.x + 38, this.y + 18);
                    vertex(this.x + 40, this.y + 1);
                endShape(CLOSE);

                beginShape();
                    vertex(this.x + 23, this.y + 38);
                    vertex(this.x + 23, this.y + 40);
                    vertex(this.x + 40, this.y + 40);
                    vertex(this.x + 40, this.y + 29);
                    vertex(this.x + 38, this.y + 27);
                    vertex(this.x + 38, this.y + 38);
                endShape(CLOSE);

                //Beak + claw
                strokeWeight(1);
                fill('Black');

                beginShape();
                    vertex(this.x + 4, this.y + 4);
                    vertex(this.x + 1, this.y + 6);
                    vertex(this.x + 1, this.y + 14);
                    vertex(this.x + 4, this.y + 10);
                endShape(CLOSE);

                beginShape();
                    vertex(this.x + 8, this.y + 32);
                    vertex(this.x + 5, this.y + 35);
                    vertex(this.x + 1, this.y + 36);
                    vertex(this.x + 4, this.y + 36);
                    vertex(this.x + 1, this.y + 40);
                    vertex(this.x + 5, this.y + 37);
                    vertex(this.x + 5, this.y + 40);
                    vertex(this.x + 6, this.y + 36);
                    vertex(this.x + 9, this.y + 33);
                endShape(CLOSE);

                //Eye and stroke's
                line(this.x + 9, this.y + 4, this.x + 9, this.y + 6);
                line(this.x + 8, this.y + 5, this.x + 10, this.y + 5);

                line(this.x + 25, this.y + 7, this.x + 40, this.y + 7);

                line(this.x + 24, this.y + 13, this.x + 39, this.y + 13);

                line(this.x + 29, this.y + 23, this.x + 40, this.y + 36);

                line(this.x + 25, this.y + 25, this.x + 32, this.y + 40);
            }
        
        else
            {
                // Bird_move_right
                
                //Main-body
                strokeWeight(1);
                stroke('Black');
                fill('#800000');
                beginShape();
                    vertex(this.x + 34, this.y + 1);
                    vertex(this.x + 29, this.y + 1);
                    vertex(this.x + 3, this.y + 27);
                    vertex(this.x + 3, this.y + 38);
                    vertex(this.x + 18, this.y + 38);
                    vertex(this.x + 21, this.y + 25);
                    vertex(this.x + 37, this.y + 10);
                    vertex(this.x + 37, this.y + 4);
                endShape(CLOSE);

                //Leg
                beginShape();
                    vertex(this.x + 23, this.y + 29);
                    vertex(this.x + 30, this.y + 25);
                    vertex(this.x + 33, this.y + 33);
                endShape(CLOSE);

                //Wing
                fill('#800000');
                beginShape();
                    vertex(this.x + 22, this.y + 1);
                    vertex(this.x + 3, this.y + 1);
                    vertex(this.x + 5, this.y + 18);
                    vertex(this.x + 21, this.y + 21);
                    vertex(this.x + 27, this.y + 14);
                endShape(CLOSE);

                //Breast + strokes
                strokeWeight(0.5);
                fill('White');
                beginShape();
                    vertex(this.x + 33, this.y + 13);
                    vertex(this.x + 21, this.y + 25);
                    vertex(this.x + 20, this.y + 32);
                    vertex(this.x + 33, this.y + 23);
                endShape(CLOSE);

                beginShape();
                    vertex(this.x + 1, this.y + 1);
                    vertex(this.x + 3, this.y + 18);
                    vertex(this.x + 5, this.y + 18);
                    vertex(this.x + 3, this.y + 1);
                endShape(CLOSE);

                beginShape();
                    vertex(this.x + 3, this.y + 27);
                    vertex(this.x + 1, this.y + 29);
                    vertex(this.x + 1, this.y + 40);
                    vertex(this.x + 18, this.y + 40);
                    vertex(this.x + 18, this.y + 38);
                    vertex(this.x + 3, this.y + 38);
                endShape(CLOSE);

                //Beak + claw
                strokeWeight(1);
                fill('Black');

                beginShape();
                    vertex(this.x + 37, this.y + 4);
                    vertex(this.x + 40, this.y + 6);
                    vertex(this.x + 40, this.y + 14);
                    vertex(this.x + 37, this.y + 10);
                endShape(CLOSE);

                beginShape();
                    vertex(this.x + 33, this.y + 32);
                    vertex(this.x + 36, this.y + 35);
                    vertex(this.x + 40, this.y + 36);
                    vertex(this.x + 37, this.y + 36);
                    vertex(this.x + 40, this.y + 40);
                    vertex(this.x + 36, this.y + 37);
                    vertex(this.x + 36, this.y + 40);
                    vertex(this.x + 35, this.y + 36);
                    vertex(this.x + 32, this.y + 33);
                endShape(CLOSE);

                //Eye and stroke's
                line(this.x + 32, this.y + 4, this.x + 32, this.y + 6);
                line(this.x + 31, this.y + 5, this.x + 33, this.y + 5);

                line(this.x + 1, this.y + 7, this.x + 16, this.y + 7);

                line(this.x + 2, this.y + 13, this.x + 17, this.y + 13);

                line(this.x + 12, this.y + 23, this.x + 1, this.y + 36);

                line(this.x + 16, this.y + 25, this.x + 9, this.y + 40);
            }        
    }
    
    this.check_contact = function()
    {
        if (dist(character.x + character.width/2, character.y + character.height/2,
                 this.x + size/2, this.y + size/2) < 45)
            {
                gameover();
            }
    }
}

//---Functions that describe the game controls
function keyPressed()
{ 
    if (!BGM.isPlaying())
        {
            BGM.loop();
        }
    
    if (keyCode == 39)
        {
            isRight = true;
            isLeft = false;
        }
    else if (keyCode == 37) 
        {
            isRight = false;
            isLeft = true;
        }
    else if (keyCode == 32)
        {
            if (intersection_down(character, platforms, ver_speed).isIntersecting)
                {
                    isJumping = true;
                    ver_speed -= jump;
                    sound_jump.play();
                }
            if (game_over)
                {
                    new_game();
                }
        }
}

function keyReleased()
{
    if (keyCode == 39){
        isRight = false;
    }
    else if (keyCode == 37){
        isLeft = false;
    }
    else if (keyCode == 32){
        isJumping = false;
    }
}

//---Functions that describe the movement
function move_right(ch, platf, distance)
{
    if (!intersection_to_right(ch, platf, v).isIntersecting)
        {
            ch.x = min(level_width - ch.width, ch.x + distance);
            
            if ((ch.x < level_width - 0.5 * width) && (ch.x + cam_pos > 0.5 * width))
                {
                    cam_pos -= distance;
                }
        }
    else
        {
            ch.x = min(level_width - ch.width, ch.x + intersection_to_right(ch, platf, v).distance)
            
            if ((ch.x < level_width - 0.5 * width) && (ch.x + cam_pos > 0.5 * width))
                {
                    cam_pos -= distance;
                }
        }
}

function move_left(ch, platf, distance)
{
    if (!intersection_to_left(ch, platf, v).isIntersecting)
        {
            ch.x = max(-ch.width, ch.x - distance);
            
            if ((ch.x > 0.5 * width) && (ch.x + cam_pos < 0.5 * width))
                {
                    cam_pos += distance;
                }
        }
    else
        {
            ch.x = max(0, ch.x - intersection_to_left(ch, platf, v).distance)
            
            if ((ch.x > 0.5 * width) && (ch.x + cam_pos < 0.5 * width))
                {
                    cam_pos += distance;
                }
        }
}

