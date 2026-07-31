(function(Scratch) {
    'use strict';

    class ItalianBrainrotExtension {
        constructor() {
            this.latestImage = 'No image loaded yet';
        }

        getInfo() {
            return {
                id: 'italianbrainrot',
                name: 'Italian Brainrot Extension',
                color1: '#FF5733',   // Vibrant orange-red
                color2: '#C70039',   // Deep red accent
                color3: '#900C3F',   // Darker accent
                blocks: [
                    {
                        opcode: 'fetchRandomImage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'GET Italian Brainrot URL'
                    },
                    {
                        opcode: 'getStoredImage',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'URL'
                    }
                ]
            };
        }

        async fetchRandomImage() {
            try {
                const response = await fetch('https://pcdelatara.github.io/sigma-api/imgdata.json');
                const data = await response.json();
                const randomIndex = Math.floor(Math.random() * data.images.length);
                const randomImage = data.images[randomIndex];
                this.latestImage = randomImage;
            } catch (err) {
                console.error('Failed to fetch:', err);
                this.latestImage = 'Failed to load image';
            }
        }

        getStoredImage() {
            return this.latestImage;
        }
    }

    Scratch.extensions.register(new ItalianBrainrotExtension());
})(Scratch);
