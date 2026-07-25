(function (Scratch) {
    'use strict';
    // I LOVE CATS
    
    const catFacts = [
        'Snail IDE used to be based off of DevBlocks',
        'If you go to https://snail-ide.github.io/1.0/ you can use old Snail IDE',
        'Snail IDE is based off of PenguinMod',
        'Try out plungermod.',
        'Snails are real 💀'
    ];
    
    let catBreeds = [
      'Abyssinian',
      'American Bobtail',
      'American Curl',
      'American Shorthair',
      'American Wirehair',
      'Balinese',
      'Bengal',
      'Birman',
      'Bombay',
      'British Shorthair',
      'Burmese',
      'Chartreux',
      'Cornish Rex',
      'Devon Rex',
      'Egyptian Mau',
      'Exotic Shorthair',
      'Havana Brown',
      'Himalayan',
      'Japanese Bobtail',
      'Maine Coon',
      'Manx',
      'Norwegian Forest',
      'Ocicat',
      'Persian',
      'Ragdoll',
      'Russian Blue',
      'Scottish Fold',
      'Siamese',
      'Siberian',
      'Sphynx'
    ];
    
    class CAT {
      getInfo() {
        return {
          id: 'ginxilovecats',
          name: 'CATS',
          color1: '#7868B5',
          color2: '#564B7F',
          color3: '#3C3456',
          blocks: [
            {
              opcode: 'randomcatfact',
              blockType: Scratch.BlockType.REPORTER,
              text: 'random cat fact from [FORMAT]',
              disableMonitor: true,
              arguments: {
                FORMAT: {
                  type: Scratch.ArgumentType.STRING,
                  menu: 'FORMAT_MENU'
                }
              }
            },
            {
              opcode: 'catscool',
              blockType: Scratch.BlockType.BOOLEAN,
              text: 'are cats cool?',
              disableMonitor: true,
            },
            {
              opcode: 'catinfo',
              blockType: Scratch.BlockType.REPORTER,
              text: 'get info of breed [BREED]',
              disableMonitor: true,
              arguments: {
                BREED: {
                  type: Scratch.ArgumentType.STRING,
                  menu: 'BREED_MENU'
                }
              }
            }
          ],
          menus: {
            FORMAT_MENU: {
              acceptReporters: true,
              items: ['source 1 (Snail IDE Facts)', 'we dont have anything else yet lol', 'if you make a snail ide random fact website i might use it in this']
            },
            BREED_MENU: {
              acceptReporters: true,
              items: catBreeds
            }
          }
        };
      }
    
      randomcatfact(args) {
        if (args.FORMAT == "source 1 (Snail IDE Facts)") {
            return catFacts[Math.floor(Math.random() * catFacts.length)]
            .then((response) => {
              if (response.ok) {
                return catFacts[Math.floor(Math.random() * catFacts.length)]
              } else {
                throw new Error('Network response was not OK.');
              }
            })
            .then((data) => {
              return String(data.data);
            })
            .catch((error) => {
              console.error(error);
              return 'Uh oh! Something went wrong.';
            });
          } else if (args.FORMAT == "we don't have anything else yet lol") {
           return catFacts[Math.floor(Math.random() * catFacts.length)]
            .then((response) => {
                return catFacts[Math.floor(Math.random() * catFacts.length)]
            })
        } else if (args.FORMAT == 'if you make a snail ide random fact website i might use it in this') {
          return catFacts[Math.floor(Math.random() * catFacts.length)]
        }
      }
      catscool() {
        return true
      }
      catinfo(args) {
        if (!catBreeds.includes(args.BREED)) {
          // `args.BREED` is not any of the cat breeds in the `catBreeds` array
          return "I won't let you exploit this."
        }
      
        var breedsWithoutCat = [
          "American Bobtail",
          "American Curl",
          "American Shorthair",
          "American Curlhair",
          "American Wirehair",
          "Birman",
          "British Shorthair",
          "Chartreux",
          "Cornish Rex",
          "Devon Rex",
          "Egyptian Mau",
          "Exotic Shorthair",
          "Havana Brown",
          "Japanese Bobtail",
          "Maine Coon",
          "Norwegian Forest",
          "Ocicat",
          "Oriental",
          "Ragdoll",
          "Russian Blue",
          "Scottish Fold"
        ];
      
        var breed = args.BREED
        var includeCat = breedsWithoutCat.includes(breed);
      
        if (!includeCat) {
          breed += " cat";
        }
      
        return fetch("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exlimit=1&titles=" + encodeURIComponent(breed) + "&explaintext=1&exsectionformat=plain&format=json&origin=*")
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Network response was not OK.');
            }
          })
          .then((data) => {
            // Extract the relevant information from the data object
            const pageId = Object.keys(data.query.pages)[0];
            let extract = data.query.pages[pageId].extract;
            extract = extract.replace(/\s{2,}/g, ' ');
            return extract.split('.').slice(0, 2).join('.') + '. (https://en.wikipedia.org/wiki/' + breed.replace(/\s/g, '_') + ")";
          })
          .catch((error) => {
            console.error(error);
            return 'Uh oh! Something went wrong.';
          });
        
      }
    }
    Scratch.extensions.register(new CAT());
  })(Scratch);