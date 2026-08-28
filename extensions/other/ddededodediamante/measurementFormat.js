(function (Scratch) {
  const icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNiAzNiI+PHBhdGggZmlsbD0iI0ZGQ0M0RCIgZD0iTTMwLjAyMSAzNC4yNjRjLTEuNTYzIDEuNTYzLTQuMDk1IDEuNTYyLTUuNjU2IDBMMS43MzYgMTEuNjM2Yy0xLjU2Mi0xLjU2Mi0xLjU2My00LjA5NCAwLTUuNjU3bDQuMjQzLTQuMjQyYzEuNTYyLTEuNTYyIDQuMDk1LTEuNTYyIDUuNjU3IDBsMjIuNjI2IDIyLjYyOGMxLjU2MiAxLjU2MiAxLjU2MiA0LjA5Ni4wMDEgNS42NTZsLTQuMjQyIDQuMjQzeiIvPjxwYXRoIGZpbGw9IiMyOTJGMzMiIGQ9Ik05LjUxNSA2LjY4N2MtLjM5MS4zOS0xLjAyMy4zOS0xLjQxNCAwLS4zOS0uMzkxLS4zOS0xLjAyNCAwLTEuNDE1bDMuNTM2LTMuNTM2IDEuNDE0IDEuNDE1LTMuNTM2IDMuNTM2em01LjY1NiAxLjQxNGMtLjM5LjM5MS0xLjAyNC4zOTEtMS40MTQgMC0uMzkxLS4zOTEtLjM5MS0xLjAyNCAwLTEuNDE0bDEuNDE1LTEuNDE1IDEuNDE0IDEuNDE1LTEuNDE1IDEuNDE0em0xLjQxNSA1LjY1NmMtLjM5MS4zOTEtMS4wMjQuMzkxLTEuNDE0IDAtLjM5LS4zOTEtLjM5LTEuMDI0IDAtMS40MTRsMy41MzYtMy41MzZjLjQ4Ni40ODYuOTI5LjkyOCAxLjQxNCAxLjQxNWwtMy41MzYgMy41MzV6bTUuNjU2IDEuNDE0Yy0uMzkuMzkxLTEuMDIzLjM5MS0xLjQxMyAwLS4zOTItLjM5MS0uMzkxLTEuMDI0IDAtMS40MTRsMS40MTQtMS40MTVjLjQ4NS40ODcuOTI4LjkyOCAxLjQxNCAxLjQxNWwtMS40MTUgMS40MTR6bTEuNDE1IDUuNjU3Yy0uMzkxLjM5MS0xLjAyMy4zOTItMS40MTQgMC0uMzkxLS4zOTEtLjM5MS0xLjAyMy0uMDAxLTEuNDE0bDMuNTM2LTMuNTM1IDEuNDE0IDEuNDE0LTMuNTM1IDMuNTM1em03LjA3MSA3LjA3MWMtLjM5LjM5MS0xLjAyMy4zOTEtMS40MTMgMC0uMzkyLS4zOTEtLjM5Mi0xLjAyMy0uMDAxLTEuNDE0bDMuNTM2LTMuNTM1IDEuNDE0IDEuNDE0LTMuNTM2IDMuNTM1em0tMS40MTUtNS42NTdjLS4zOTEuMzkxLTEuMDIyLjM5MS0xLjQxNC4wMDEtLjM5MS0uMzkxLS4zOS0xLjAyNCAwLTEuNDE0bDEuNDE1LTEuNDE0IDEuNDEzIDEuNDEzLTEuNDE0IDEuNDE0eiIvPjwvc3ZnPg==";

  const categories = {
    length: {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.34,
    },
    weight: {
      g: 0.001,
      kg: 1,
      lb: 0.453592,
      oz: 0.0283495,
    },
    volume: {
      ml: 0.001,
      l: 1,
      gal: 3.78541,
      cup: 0.24,
    },
  };

  const units = Object.fromEntries(
    Object.entries(categories).flatMap(([type, unitMap]) =>
      Object.keys(unitMap).map(unit => [unit, { type, factor: unitMap[unit] }])
    )
  );

  const sortedUnits = Object.entries(units)
    .sort(([, a], [, b]) => b.factor - a.factor)
    .map(([unit]) => unit);

  const unitNames = {
    mm: "millimeter",
    cm: "centimeter",
    m: "meter",
    km: "kilometer",
    in: "inch",
    ft: "foot",
    yd: "yard",
    mi: "mile",
    g: "gram",
    kg: "kilogram",
    lb: "pound",
    oz: "ounce",
    ml: "milliliter",
    l: "liter",
    gal: "gallon",
    cup: "cup",
  };

  class MeasurementFormatExtension {
    getInfo() {
      return {
        id: "ddeMeasurementFormat",
        name: "Measurement Format",
        menuIconURI: icon,
        blockIconURI: icon,
        color1: "#fc9003",
        blocks: [
          {
            opcode: "convert",
            blockType: Scratch.BlockType.REPORTER,
            text: "convert [VALUE] [FROM] to [TO]",
            arguments: {
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              FROM: {
                type: Scratch.ArgumentType.STRING,
                menu: "units",
                defaultValue: "cm",
              },
              TO: {
                type: Scratch.ArgumentType.STRING,
                menu: "units",
                defaultValue: "m",
              },
            },
          },
          {
            opcode: "areUnitsCompatible",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "are [UNIT1] and [UNIT2] compatible?",
            arguments: {
              UNIT1: {
                type: Scratch.ArgumentType.STRING,
                menu: "units",
                defaultValue: "m",
              },
              UNIT2: {
                type: Scratch.ArgumentType.STRING,
                menu: "units",
                defaultValue: "cm",
              },
            },
          },
          {
            opcode: "formatReadable",
            blockType: Scratch.BlockType.REPORTER,
            text: "format [VALUE] [UNIT] as readable text",
            arguments: {
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1.5 },
              UNIT: {
                type: Scratch.ArgumentType.STRING,
                menu: "units",
                defaultValue: "m",
              },
            },
          },
          {
            opcode: "autoConvert",
            blockType: Scratch.BlockType.REPORTER,
            text: "auto convert [VALUE] [FROM] to best unit",
            arguments: {
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1500 },
              FROM: {
                type: Scratch.ArgumentType.STRING,
                menu: "units",
                defaultValue: "m",
              },
            },
          },
          {
            opcode: "unitFactor",
            blockType: Scratch.BlockType.REPORTER,
            text: "factor of unit [UNIT]",
            arguments: {
              UNIT: {
                type: Scratch.ArgumentType.STRING,
                menu: "units",
                defaultValue: "m",
              },
            },
          },
          {
            opcode: "listUnits",
            blockType: Scratch.BlockType.REPORTER,
            text: "list all units",
          },
        ],
        menus: {
          units: { items: Object.keys(units), acceptReporters: true },
        },
      };
    }

    convert({ VALUE, FROM, TO }) {
      VALUE = Scratch.Cast.toNumber(VALUE);
      const from = units[FROM],
        to = units[TO];

      if (!from || !to) return "Invalid unit";
      if (from.type !== to.type) return "Incompatible units";

      const result = VALUE * (from.factor / to.factor);
      return Number.isFinite(result) ? result : null;
    }

    areUnitsCompatible({ UNIT1, UNIT2 }) {
      const u1 = units[UNIT1],
        u2 = units[UNIT2];
      if (!u1 || !u2) return false;
      return u1.type === u2.type;
    }

    formatReadable({ VALUE, UNIT }) {
      VALUE = Scratch.Cast.toNumber(VALUE);
      if (!units[UNIT] || !unitNames[UNIT]) return null;

      const rounded = Math.round(VALUE * 1000) / 1000;
      const name = unitNames[UNIT] + (Math.abs(rounded) === 1 ? "" : "s");

      return `${rounded} ${name}`;
    }

    autoConvert({ VALUE, FROM }) {
      VALUE = Scratch.Cast.toNumber(VALUE);
      const from = units[FROM];
      if (!from) return null;

      const base = VALUE * from.factor;
      const category = from.type;

      let bestUnit = FROM;
      let bestValue = VALUE;

      for (const unit of sortedUnits) {
        const u = units[unit];
        if (u.type !== category) continue;
        const converted = base / u.factor;
        if (converted >= 1) {
          bestUnit = unit;
          bestValue = converted;
          break;
        }
      }

      bestValue = Math.round(bestValue * 1000) / 1000;
      return `${bestValue} ${bestUnit}`;
    }

    unitFactor({ UNIT }) {
      const unit = units[UNIT];
      return unit ? unit.factor : null;
    }

    listUnits() {
      return Object.keys(units).sort().join(", ");
    }
  }

  Scratch.extensions.register(new MeasurementFormatExtension());
})(Scratch);
