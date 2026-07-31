class PYdatabase {
    constructor() {
        this.fileList = []; // stores uploaded files
        this.lastUploaded = null; // last uploaded file
        this.serverUrl = "https://pyserver-j0du.onrender.com/";
        this.defaultFileName = "save.txt"; // default file name
        this.defaultContent = "example"; // default content
    }

    getInfo() {
        const tealColor = "#1e90ff";

        return {
            id: "PYdatabase",
            name: "File Manager",
            color1: tealColor,
            color2: tealColor,
            color3: tealColor,
            blocks: [
                {
                    opcode: "setFileContent",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Set [FILE] content to [CONTENT]",
                    arguments: {
                        FILE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: this.defaultFileName
                        },
                        CONTENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "Hello, Python!"
                        }
                    },
                    color: tealColor
                },
                {
                    opcode: "uploadFile",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Upload file [FILE]",
                    arguments: {
                        FILE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: this.defaultFileName
                        }
                    },
                    color: tealColor,
                    async: true
                },
                {
                    opcode: "openDatabase",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Open database in browser",
                    color: tealColor
                },
                {
                    opcode: "getFiles",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Get uploaded files",
                    color: tealColor
                },
                {
                    opcode: "getLastFile",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Last uploaded file",
                    color: tealColor
                },

                // 🔽 NEW REPORTER BLOCK
                {
                    opcode: "getSpecificFile",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Get file [FILE]",
                    arguments: {
                        FILE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: this.defaultFileName
                        }
                    },
                    color: tealColor
                },

                // 🔽 NEW BOOLEAN BLOCK
                {
                    opcode: "fileExists",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "file [FILE] exists?",
                    arguments: {
                        FILE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: this.defaultFileName
                        }
                    },
                    color: tealColor
                }
            ]
        };
    }

    // Sets the content for a file
    setFileContent(args) {
        const fileName = args.FILE;
        const content = args.CONTENT;
        if (!fileName) return;

        this.defaultFileName = fileName;
        this.defaultContent = content;
        console.log(`Set content for ${fileName}: ${content}`);
    }

    // Uploads the file to Flask server
    async uploadFile(args) {
        const fileName = args.FILE || this.defaultFileName;
        const content = this.defaultContent || "Empty file";

        try {
            const file = new Blob([content], { type: "text/plain" });
            const formData = new FormData();
            formData.append("file", file, fileName);

            const response = await fetch(this.serverUrl, {
                method: "POST",
                body: formData
            });

            if (response.redirected) {
                await fetch(response.url);
            }

            this.lastUploaded = fileName;
            if (!this.fileList.includes(fileName)) {
                this.fileList.push(fileName);
            }

            console.log(`Uploaded file: ${fileName}`);
        } catch (err) {
            console.error("Error uploading file:", err);
        }
    }

    // Opens the Flask database page in a new tab
    openDatabase() {
        window.open(this.serverUrl, "_blank");
    }

    // Returns a comma-separated list of uploaded files
    getFiles() {
        return this.fileList.length
            ? this.fileList.join(", ")
            : "No files uploaded";
    }

    // Returns the last uploaded file
    getLastFile() {
        return this.lastUploaded || "No file uploaded yet";
    }

    // 🔽 NEW: Returns a specific file if it exists
    getSpecificFile(args) {
        const fileName = args.FILE;
        if (!fileName) return "No file specified";

        return this.fileList.includes(fileName)
            ? fileName
            : "File not found";
    }

    // 🔽 NEW: Boolean check for file existence
    fileExists(args) {
        const fileName = args.FILE;
        return this.fileList.includes(fileName);
    }
}

// Register the extension with Scratch
Scratch.extensions.register(new PYdatabase());
