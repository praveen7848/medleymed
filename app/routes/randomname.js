'use strict';

// var ADJECTIVES = [
//   'Carla', 'Brash', 'Callous', 'Daft', 'Eccentric', 'Fiesty', 'Golden',
//   'Holy', 'Ignominious', 'Joltin', 'Killer', 'Luscious', 'Mushy', 'Nasty',
//   'OldSchool', 'Pompous', 'Quiet', 'Rowdy', 'Sneaky', 'Tawdry',
//   'Unique', 'Vivacious', 'Wicked', 'Xenophobic', 'Yawning', 'Zesty'
// ];

// var FIRST_NAMES = [
//   'Carla', 'Bobby', 'Cameron', 'Danny', 'Emmett', 'Frida', 'Gracie', 'Hannah',
//   'Isaac', 'Jenova', 'Kendra', 'Lando', 'Mufasa', 'Nate', 'Owen', 'Penny',
//   'Quincy', 'Roddy', 'Samantha', 'Tammy', 'Ulysses', 'Victoria', 'Wendy',
//   'Xander', 'Yolanda', 'Zelda'
// ];

// var LAST_NAMES = [
//   'Houston', 'Berlin', 'Cucamonga', 'Davenport', 'Essex', 'Fresno',
//   'Gunsight', 'Hanover', 'Indianapolis', 'Jamestown', 'Kane', 'Liberty',
//   'Minneapolis', 'Nevis', 'Oakland', 'Portland', 'Quantico', 'Raleigh',
//   'SaintPaul', 'Tulsa', 'Utica', 'Vail', 'Warsaw', 'XiaoJin', 'Yale',
//   'Zimmerman'
// ];

var ADJECTIVES = [
  'Carla', 'Brash', 'Callous', 'Daft', 'Eccentric', 'Fiesty', 'Golden',
  'Holy', 'Ignominious', 'Joltin', 'Killer', 'Luscious', 'Mushy', 'Nasty',
  'OldSchool', 'Pompous', 'Quiet', 'Rowdy', 'Sneaky', 'Tawdry',
  'Unique', 'Vivacious', 'Wicked', 'Xenophobic', 'Yawning', 'Zesty'
];

var FIRST_NAMES = [
  'Carla', 'James'
];

var LAST_NAMES = [
  'Houston', 'Street'
];

function randomItem(array) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

module.exports = function randomName() {
 // return randomItem(ADJECTIVES) +
  return randomItem(FIRST_NAMES) +
    randomItem(LAST_NAMES);
}; 
