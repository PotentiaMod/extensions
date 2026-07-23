(function (Scratch) {
  const variables = {};

  class Extension {
    getInfo() {
      return {
        id: 'fetch',
        name: 'Fetch+',
        blocks: [
          {
            opcode: "get",
            blockType: Scratch.BlockType.REPORTER,
            text: "GET [URL]",
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "https://extensions.turbowarp.org/hello.txt",
              },
            },
          },
          {
            opcode: 'getJsonPropertyValue',
            text: 'GET JSON property: [VALUE] from JSON [JSON]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
              },
              JSON: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{}',
              },
            },
          },
          {
            opcode: 'getURL',
            text: 'GET JSON property [VALUE] from URL [URL]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'VALUE',
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/api',
              },
            },
          },
          "---",
          {
            opcode: 'post',
            blockType: Scratch.BlockType.COMMAND,
            text: 'POST [DATA] to URL [URL]',
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{}',
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/api',
              },
            },
          },
          {
            opcode: 'postJsonProperty',
            blockType: Scratch.BlockType.COMMAND,
            text: 'POST [DATA] to URL [URL] and get JSON property [VALUE]',
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{}',
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/api',
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'property_name',
              },
            },
          },
          {
            opcode: 'postAndGet',
            blockType: Scratch.BlockType.REPORTER,
            text: 'POST [DATA] to URL [URL] and get response',
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{}',
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/api',
              },
            },
          },
        ],
        menus: {},
      };
    }

    get(args) {
      return Scratch.fetch(args.URL)
        .then((r) => r.text())
        .catch(() => "");
    }

    post(args, util) {
      let data = args.DATA;
      let url = args.URL;

      return this._postData(url, data);
    }

    getURL(args, util) {
      let VALUE = args.VALUE;
      let URL = args.URL;

      return new Promise((resolve) => {
        this._FetchURL(URL)
          .then((data) => resolve(data[VALUE]))
          .catch((error) => resolve(`Error fetching data: ${error}`));
      });
    }

    getJsonPropertyValue(args) {
      const value = args.VALUE;
      const jsonString = args.JSON;
    
      try {
        const jsonObject = JSON.parse(jsonString);
        if (jsonObject && typeof jsonObject === 'object') {
          const result = jsonObject[value];
          return result !== undefined ? result : null;
        } else {
          console.error('Invalid JSON format:', jsonString);
          return null;
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
      }
    }

    // POST function for get block
    postAndGet(args, util) {
      const data = args.DATA;
      const url = args.URL;

      return this._postData(url, data)
        .then((response) => response.text())
        .catch(() => "");
    }

    // POST function for get JSON property block
    postJsonProperty(args, util) {
      const data = args.DATA;
      const url = args.URL;
      const value = args.VALUE;

      return this._postData(url, data)
        .then((response) => response.json())
        .then((jsonObject) => {
          if (jsonObject && typeof jsonObject === 'object') {
            const result = jsonObject[value];
            return result !== undefined ? result : null;
          } else {
            console.error('Invalid JSON format:', jsonObject);
            return null;
          }
        })
        .catch(() => null);
    }

    /* Not Functions of Blocks*/

    _FetchURL(URL) {
      return fetch(URL)
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => {
          console.error('Error fetching data:', error);
          return {};
        });
    }

    _postData(url, data) {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to post data: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          console.error('Error posting data:', error.message);
          return {};
        });
    }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
