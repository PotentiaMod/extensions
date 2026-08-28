(function (Scratch) {
  const icon =
    "data:image/svg+xml;base64,PHN2ZyB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzYgMzYiIHdpZHRoPSIzNiIgIGhlaWdodD0iMzYiID48cGF0aCBmaWxsPSIjOUFBQUI0IiBkPSJNMjcuMzg4IDI0LjY0MkwyNC41NiAyNy40N2wtNC45NS00Ljk1IDIuODI4LTIuODI4eiIvPjxwYXRoIGZpbGw9IiM2Njc1N0YiIGQ9Ik0zNC42ODMgMjkuMTFsLTUuODc5LTUuODc5Yy0uNzgxLS43ODEtMi4wNDctLjc4MS0yLjgyOCAwbC0yLjgyOCAyLjgyOGMtLjc4MS43ODEtLjc4MSAyLjA0NyAwIDIuODI4bDUuODc5IDUuODc5YzEuNTYyIDEuNTYzIDQuMDk2IDEuNTYzIDUuNjU4IDAgMS41Ni0xLjU2MSAxLjU1OS00LjA5NC0uMDAyLTUuNjU2eiIvPjxjaXJjbGUgZmlsbD0iIzg4OTlBNiIgY3g9IjEzLjU4NiIgY3k9IjEzLjY2OSIgcj0iMTMuNSIvPjxjaXJjbGUgZmlsbD0iI0JCRERGNSIgY3g9IjEzLjU4NiIgY3k9IjEzLjY2OSIgcj0iOS41Ii8+PC9zdmc+";
  class ddeNasaMediaExt {
    getInfo() {
      return {
        id: "ddeNasaMediaSearch",
        name: "Nasa Media Search",
        color1: "#543275",
        blockIconURI: icon,
        blocks: [
          {
            opcode: "searchNasaMedia",
            blockType: Scratch.BlockType.REPORTER,
            text: "search for nasa images of [search]",
            arguments: {
              search: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "moon",
              },
            },
          },
          {
            opcode: "searchRaw",
            blockType: Scratch.BlockType.REPORTER,
            text: "search for raw query [search]",
            arguments: {
              search: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "moon",
              },
            },
          },
        ],
      };
    }

    async searchNasaMedia({ search }) {
      const apiNasaUrl = `https://images-api.nasa.gov/search?q=${encodeURI(search)}`;

      try {
        const response = await fetch(apiNasaUrl);
        const data = await response.json();
        const items = data.collection.items;
        const mediaItems = items.filter(item => item.data[0].media_type == "image");

        const randomMedia = mediaItems[Math.floor(Math.random() * mediaItems.length)];

        const mediaDate = new Date(randomMedia.data[0].date_created);

        let { description, title, keywords } = randomMedia.data[0];

        console.log(randomMedia);
        return JSON.stringify({
          url: encodeURI(randomMedia.links[0].href),
          title,
          description,
          keywords,
          date_created: {
            year: mediaDate.getFullYear(),
            month: mediaDate.getMonth() + 1,
            dayOfWeek: mediaDate.getDay(),
            hours: mediaDate.getHours(),
          },
        });
      } catch (err) {
        console.error(err);
        return 'Error: ' + err?.message || err;
      }
    }

    async searchRaw({ search }) {
      const apiNasaUrl = `https://images-api.nasa.gov/search?q=${encodeURI(search)}`;

      try {
        const response = await fetch(apiNasaUrl);
        const data = await response.json();
        return JSON.stringify(data);
      } catch (err) {
        console.error(err);
        return 'Error: ' + err?.message || err;
      }
    }
  }

  Scratch.extensions.register(new ddeNasaMediaExt());
})(Scratch);
