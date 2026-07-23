class MemeExtension {
    constructor() {
        this.memeList = [];
    }

    getInfo() {
        const blueColor = '#f1e74a'; // nice, readable blue

        return {
            id: 'memeExtension',
            name: 'Meme Generator',
            color1: blueColor, // optional but good practice to match block color in menus
            color2: blueColor,
            color3: blueColor,
            blocks: [
                {
                    opcode: 'getRandomMeme',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Get a random meme',
                    color: blueColor,
                    // Make it async so Scratch handles the promise properly
                    async: true
                },
                {
                    opcode: 'getMemeUrl',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Get meme URL',
                    color: blueColor
                }
            ],
        };
    }

    getRandomMeme(args, util) {
        return fetch('https://meme-api.com/gimme')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.url) {
                    this.memeList.push(data.url);
                    console.log('Fetched meme:', data.url);
                } else {
                    console.error('No meme found in the response:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching meme:', error);
            });
    }

    getMemeUrl() {
        if (this.memeList.length === 0) {
            return 'No meme available';
        }
        return this.memeList[this.memeList.length - 1];
    }
}

// Register the MemeExtension with Scratch
Scratch.extensions.register(new MemeExtension());
