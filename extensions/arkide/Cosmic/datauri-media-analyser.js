(function(Scratch) {
  'use strict';
  
  class MediaAnalyzer {
    constructor() {
      this.currentMediaInfo = null;
    }

    getInfo() {
      return {
        id: 'mediaanalyzer',
        name: 'Media Analyzer',
        color1: '#FF6680',
        color2: '#FF4D6A',
        color3: '#E63C5A',
        blocks: [
          {
            opcode: 'analyzeMedia',
            blockType: Scratch.BlockType.COMMAND,
            text: 'analyze media from [DATAURI]',
            arguments: {
              DATAURI: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'data:image/png;base64,...'
              }
            }
          },
          {
            opcode: 'getMediaType',
            blockType: Scratch.BlockType.REPORTER,
            text: 'media type'
          },
          {
            opcode: 'getWidth',
            blockType: Scratch.BlockType.REPORTER,
            text: 'width'
          },
          {
            opcode: 'getHeight',
            blockType: Scratch.BlockType.REPORTER,
            text: 'height'
          },
          {
            opcode: 'getResolution',
            blockType: Scratch.BlockType.REPORTER,
            text: 'resolution'
          },
          {
            opcode: 'getDuration',
            blockType: Scratch.BlockType.REPORTER,
            text: 'duration (seconds)'
          },
          {
            opcode: 'getFileSize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'file size (bytes)'
          },
          {
            opcode: 'getMimeType',
            blockType: Scratch.BlockType.REPORTER,
            text: 'MIME type'
          },
          {
            opcode: 'getAspectRatio',
            blockType: Scratch.BlockType.REPORTER,
            text: 'aspect ratio'
          },
          {
            opcode: 'isAnalyzed',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'media analyzed?'
          }
        ]
      };
    }

    analyzeMedia(args) {
      return new Promise((resolve) => {
        const dataUri = args.DATAURI;
        
        if (!dataUri || !dataUri.startsWith('data:')) {
          this.currentMediaInfo = null;
          resolve();
          return;
        }

        // Parse the data URI
        const matches = dataUri.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) {
          this.currentMediaInfo = null;
          resolve();
          return;
        }

        const mimeType = matches[1];
        const base64Data = matches[2];
        
        // Calculate file size
        const fileSize = Math.ceil(base64Data.length * 0.75);

        // Initialize info object
        this.currentMediaInfo = {
          mimeType: mimeType,
          fileSize: fileSize,
          width: 0,
          height: 0,
          duration: 0,
          type: mimeType.split('/')[0] // 'image' or 'video'
        };

        // Determine if it's an image or video
        if (mimeType.startsWith('image/')) {
          const img = new Image();
          img.onload = () => {
            this.currentMediaInfo.width = img.width;
            this.currentMediaInfo.height = img.height;
            resolve();
          };
          img.onerror = () => {
            resolve();
          };
          img.src = dataUri;
        } else if (mimeType.startsWith('video/')) {
          const video = document.createElement('video');
          video.preload = 'metadata';
          
          video.onloadedmetadata = () => {
            this.currentMediaInfo.width = video.videoWidth;
            this.currentMediaInfo.height = video.videoHeight;
            this.currentMediaInfo.duration = video.duration;
            resolve();
          };
          
          video.onerror = () => {
            resolve();
          };
          
          video.src = dataUri;
        } else {
          resolve();
        }
      });
    }

    getMediaType() {
      if (!this.currentMediaInfo) return '';
      return this.currentMediaInfo.type;
    }

    getWidth() {
      if (!this.currentMediaInfo) return 0;
      return this.currentMediaInfo.width;
    }

    getHeight() {
      if (!this.currentMediaInfo) return 0;
      return this.currentMediaInfo.height;
    }

    getResolution() {
      if (!this.currentMediaInfo) return '';
      return `${this.currentMediaInfo.width}x${this.currentMediaInfo.height}`;
    }

    getDuration() {
      if (!this.currentMediaInfo) return 0;
      return Math.round(this.currentMediaInfo.duration * 100) / 100;
    }

    getFileSize() {
      if (!this.currentMediaInfo) return 0;
      return this.currentMediaInfo.fileSize;
    }

    getMimeType() {
      if (!this.currentMediaInfo) return '';
      return this.currentMediaInfo.mimeType;
    }

    getAspectRatio() {
      if (!this.currentMediaInfo || this.currentMediaInfo.width === 0 || this.currentMediaInfo.height === 0) {
        return '';
      }
      
      const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
      const divisor = gcd(this.currentMediaInfo.width, this.currentMediaInfo.height);
      
      return `${this.currentMediaInfo.width / divisor}:${this.currentMediaInfo.height / divisor}`;
    }

    isAnalyzed() {
      return this.currentMediaInfo !== null;
    }
  }

  Scratch.extensions.register(new MediaAnalyzer());
})(Scratch);