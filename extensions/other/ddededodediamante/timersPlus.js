(function (Scratch) {
  // Noto Emoji by Google Inc
  let clockURI =
    "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI5MC40ODM0IiBoZWlnaHQ9IjkwLjQ4MzQiIHZpZXdCb3g9IjAsMCw5MC40ODM0LDkwLjQ4MzQiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xOTQuNzU4MywtMTM0Ljc1ODMpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0xOTQuNzU4MywxODBjMCwtMjQuOTg2MyAyMC4yNTU0LC00NS4yNDE3IDQ1LjI0MTcsLTQ1LjI0MTdjMjQuOTg2MzEsMCA0NS4yNDE3LDIwLjI1NTQgNDUuMjQxNyw0NS4yNDE3YzAsMjQuOTg2MyAtMjAuMjU1NCw0NS4yNDE3IC00NS4yNDE3LDQ1LjI0MTdjLTI0Ljk4NjMsMCAtNDUuMjQxNywtMjAuMjU1NCAtNDUuMjQxNywtNDUuMjQxN3oiIGZpbGw9IiNjN2M3YzciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0xOTkuOTcsMTgwYzAsLTIyLjEwNzk2IDE3LjkyMjA0LC00MC4wMyA0MC4wMywtNDAuMDNjMjIuMTA3OTYsMCA0MC4wMywxNy45MjIwNCA0MC4wMyw0MC4wM2MwLDIyLjEwNzk2IC0xNy45MjIwNCw0MC4wMyAtNDAuMDMsNDAuMDNjLTIyLjEwNzk2LDAgLTQwLjAzLC0xNy45MjIwNCAtNDAuMDMsLTQwLjAzeiIgZmlsbD0iI2ZhZmFmYSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIzNS44NSwxODBjMCwtMi40NTc2NiAxLjk5MjMzLC00LjQ1IDQuNDUsLTQuNDVjMi40NTc2NiwwIDQuNDUsMS45OTIzMyA0LjQ1LDQuNDVjMCwyLjQ1NzY2IC0xLjk5MjMzLDQuNDUgLTQuNDUsNC40NWMtMi40NTc2NiwwIC00LjQ1LC0xLjk5MjM0IC00LjQ1LC00LjQ1eiIgZmlsbD0iIzU2MzQyOCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI0MCwxNDkuODdjLTAuODEsMCAtMS40NywtMC42NiAtMS40NywtMS40N3YtNC40YzAsLTAuODEgMC42NiwtMS40NyAxLjQ3LC0xLjQ3YzAuODEsMCAxLjQ3LDAuNjYgMS40NywxLjQ3djQuNGMwLDAuODEgLTAuNjYsMS40NyAtMS40NywxLjQ3TTI0MCwyMTcuNDZjLTAuODEsMCAtMS40NywtMC42NiAtMS40NywtMS40N3YtNC40YzAsLTAuODEgMC42NiwtMS40NyAxLjQ3LC0xLjQ3YzAuODEsMCAxLjQ3LDAuNjYgMS40NywxLjQ3djQuNGMwLDAuODEgLTAuNjYsMS40NyAtMS40NywxLjQ3TTI3NS45OSwxODEuNDZoLTQuNGMtMC44MSwwIC0xLjQ3LC0wLjY2IC0xLjQ3LC0xLjQ3YzAsLTAuODEgMC42NiwtMS40NyAxLjQ3LC0xLjQ3aDQuNGMwLjgxLDAgMS40NywwLjY2IDEuNDcsMS40N2MwLDAuODIgLTAuNjYsMS40NyAtMS40NywxLjQ3TTIwOC40MSwxODEuNDZoLTQuNGMtMC44MSwwIC0xLjQ3LC0wLjY2IC0xLjQ3LC0xLjQ3YzAsLTAuODEgMC42NiwtMS40NyAxLjQ3LC0xLjQ3aDQuNGMwLjgxLDAgMS40NywwLjY2IDEuNDcsMS40N2MwLDAuODIgLTAuNjYsMS40NyAtMS40NywxLjQ3IiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjQwLDE0OS44N2MtMC44MSwwIC0xLjQ3LC0wLjY2IC0xLjQ3LC0xLjQ3di00LjRjMCwtMC44MSAwLjY2LC0xLjQ3IDEuNDcsLTEuNDdjMC44MSwwIDEuNDcsMC42NiAxLjQ3LDEuNDd2NC40YzAsMC44MSAtMC42NiwxLjQ3IC0xLjQ3LDEuNDdNMjQwLDIxNy40NmMtMC44MSwwIC0xLjQ3LC0wLjY2IC0xLjQ3LC0xLjQ3di00LjRjMCwtMC44MSAwLjY2LC0xLjQ3IDEuNDcsLTEuNDdjMC44MSwwIDEuNDcsMC42NiAxLjQ3LDEuNDd2NC40YzAsMC44MSAtMC42NiwxLjQ3IC0xLjQ3LDEuNDdNMjIyLjkzLDE1My4zN2wtMi4yLC0zLjgxYy0wLjQxLC0wLjcgLTAuMTcsLTEuNiAwLjU0LC0yLjAxYzAuNywtMC40MSAxLjYsLTAuMTcgMi4wMSwwLjU0bDIuMiwzLjgxYzAuNDEsMC43IDAuMTcsMS42IC0wLjU0LDIuMDFjLTAuNywwLjQgLTEuNiwwLjE2IC0yLjAxLC0wLjU0TTI1Ni43MywyMTEuOWwtMi4yLC0zLjgxYy0wLjQxLC0wLjcgLTAuMTYsLTEuNiAwLjU0LC0yLjAxYzAuNywtMC40MSAxLjYsLTAuMTYgMi4wMSwwLjU0bDIuMiwzLjgxYzAuNDEsMC43IDAuMTYsMS42IC0wLjU0LDIuMDFjLTAuNzEsMC40IC0xLjYxLDAuMTYgLTIuMDEsLTAuNTQiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMjIuOTMsMTUzLjM3bC0yLjIsLTMuODFjLTAuNDEsLTAuNyAtMC4xNywtMS42IDAuNTQsLTIuMDFjMC43LC0wLjQxIDEuNiwtMC4xNyAyLjAxLDAuNTRsMi4yLDMuODFjMC40MSwwLjcgMC4xNywxLjYgLTAuNTQsMi4wMWMtMC43LDAuNCAtMS42LDAuMTYgLTIuMDEsLTAuNTRNMjU2LjczLDIxMS45bC0yLjIsLTMuODFjLTAuNDEsLTAuNyAtMC4xNiwtMS42IDAuNTQsLTIuMDFjMC43LC0wLjQxIDEuNiwtMC4xNiAyLjAxLDAuNTRsMi4yLDMuODFjMC40MSwwLjcgMC4xNiwxLjYgLTAuNTQsMi4wMWMtMC43MSwwLjQgLTEuNjEsMC4xNiAtMi4wMSwtMC41NE0yMTEuOTEsMTY1LjQ3bC0zLjgxLC0yLjJjLTAuNywtMC40MSAtMC45NCwtMS4zIC0wLjU0LC0yLjAxYzAuNDEsLTAuNyAxLjMsLTAuOTQgMi4wMSwtMC41NGwzLjgxLDIuMmMwLjcsMC40MSAwLjk0LDEuMyAwLjU0LDIuMDFjLTAuNDEsMC43MSAtMS4zMSwwLjk1IC0yLjAxLDAuNTRNMjcwLjQ0LDE5OS4yNmwtMy44MSwtMi4yYy0wLjcsLTAuNDEgLTAuOTQsLTEuMyAtMC41NCwtMi4wMWMwLjQxLC0wLjcgMS4zLC0wLjk0IDIuMDEsLTAuNTRsMy44MSwyLjJjMC43LDAuNDEgMC45NCwxLjMgMC41NCwyLjAxYy0wLjQxLDAuNzEgLTEuMzEsMC45NSAtMi4wMSwwLjU0TTI1NS4wNiwxNTMuOTFjLTAuNywtMC40MSAtMC45NCwtMS4zIC0wLjU0LC0yLjAxbDIuMiwtMy44MWMwLjQxLC0wLjcgMS4zLC0wLjk0IDIuMDEsLTAuNTRjMC43LDAuNDEgMC45NCwxLjMgMC41NCwyLjAxbC0yLjIsMy44MWMtMC40MSwwLjcgLTEuMywwLjk0IC0yLjAxLDAuNTRNMjIxLjI3LDIxMi40NGMtMC43LC0wLjQxIC0wLjk0LC0xLjMgLTAuNTQsLTIuMDFsMi4yLC0zLjgxYzAuNDEsLTAuNyAxLjMsLTAuOTQgMi4wMSwtMC41NGMwLjcsMC40MSAwLjk0LDEuMyAwLjU0LDIuMDFsLTIuMiwzLjgxYy0wLjQxLDAuNyAtMS4zMSwwLjk0IC0yLjAxLDAuNTRNMjY2LjA5LDE2NC45M2MtMC40MSwtMC43IC0wLjE3LC0xLjYgMC41NCwtMi4wMWwzLjgxLC0yLjJjMC43LC0wLjQxIDEuNiwtMC4xNiAyLjAxLDAuNTRjMC40MSwwLjcgMC4xNiwxLjYgLTAuNTQsMi4wMWwtMy44MSwyLjJjLTAuNzEsMC40MSAtMS42MSwwLjE3IC0yLjAxLC0wLjU0TTIwNy41NiwxOTguNzNjLTAuNDEsLTAuNyAtMC4xNiwtMS42IDAuNTQsLTIuMDFsMy44MSwtMi4yYzAuNywtMC40MSAxLjYsLTAuMTYgMi4wMSwwLjU0YzAuNDEsMC43IDAuMTYsMS42IC0wLjU0LDIuMDFsLTMuODEsMi4yYy0wLjcxLDAuNCAtMS42MSwwLjE2IC0yLjAxLC0wLjU0IiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjQwLDE4MGwtMTYuMjEsLTkuMjEiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzU2MzQyOCIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjQwLjc0LDE4MGwyMi40MywtMTMuMjkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzU2MzQyOCIgc3Ryb2tlLXdpZHRoPSIzLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjQ1LjI0MTcwMDAwMDAwMDAxOjQ1LjI0MTcwMDAwMDAwMDAxLS0+";

  // Made by ddededodediamante

  class TimerExtension {
    constructor() {
      this.timers = {};
    }

    getInfo() {
      return {
        id: "ddeTimersPlus",
        name: "Timers Plus",
        color1: "#59C059",
        blockIconURI: clockURI,
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Manage Timers",
          },
          {
            opcode: "createTimer",
            blockType: Scratch.BlockType.COMMAND,
            text: "create timer with name [name]",
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Timer1",
              },
            },
          },
          {
            opcode: "startTimer",
            blockType: Scratch.BlockType.COMMAND,
            text: "start timer [name]",
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Timer1",
              },
            },
          },
          {
            opcode: "stopTimer",
            blockType: Scratch.BlockType.COMMAND,
            text: "stop timer [name]",
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Timer1",
              },
            },
          },
          {
            opcode: "resumeTimer",
            blockType: Scratch.BlockType.COMMAND,
            text: "resume timer [name]",
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Timer1",
              },
            },
          },
          {
            opcode: "deleteTimer",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete timer [name]",
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Timer1",
              },
            },
          },
          {
            opcode: "actionAllTimers",
            blockType: Scratch.BlockType.COMMAND,
            text: "[action] all timers",
            arguments: {
              action: {
                type: Scratch.ArgumentType.DROPDOWN,
                menu: "timersActions",
              },
            },
          },
          {
            opcode: "stateOfTimer",
            blockType: Scratch.BlockType.REPORTER,
            text: "state of timer [name]",
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Timer1",
              },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Timers Information",
          },
          {
            opcode: "elapsedTime",
            blockType: Scratch.BlockType.REPORTER,
            text: "elapsed [unit] in timer [name]",
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Timer1",
              },
              unit: {
                type: Scratch.ArgumentType.DROPDOWN,
                menu: "units",
              },
            },
          },
          {
            opcode: "getAllTimers",
            blockType: Scratch.BlockType.REPORTER,
            text: "name of all timers",
            disableMonitor: true,
          },
          {
            opcode: "getTimerFormatted",
            blockType: Scratch.BlockType.REPORTER,
            text: "get timer [name] in format [format]",
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Timer1",
              },
              format: {
                type: Scratch.ArgumentType.DROPDOWN,
                menu: "formats",
              },
            },
          },
        ],
        menus: {
          units: {
            acceptReporters: true,
            items: ["milliseconds", "seconds", "minutes", "hours"],
          },
          formats: {
            acceptReporters: true,
            items: ["hh:mm:ss", "mm:ss"],
          },
        },
      };
    }

    createTimer(args) {
      const timerName = args.name;
      if (!this.timers[timerName]) {
        this.timers[timerName] = {
          startTime: null,
          endTime: null,
          pausedTime: null,
          status: "stopped",
        };
      }
    }

    startTimer(args) {
      const timerName = args.name;
      const timer = this.timers[timerName];

      if (timer) {
        timer.startTime = new Date().getTime();
        timer.endTime = null;
        timer.status = "started";
      }
    }

    stopTimer(args) {
      const timerName = args.name;
      const timer = this.timers[timerName];

      if (timer) {
        timer.endTime = new Date().getTime();
        timer.status = "stopped";
      }
    }

    resumeTimer(args) {
      const timerName = args.name;
      const timer = this.timers[timerName];

      if (timer && timer.pausedTime !== unll) {
        timer.startTime += new Date().getTime() - timer.endTime;
        timer.pausedTime = null;
        timer.status = "resumed";
      }
    }

    deleteTimer(args) {
      const timerName = args.name;
      delete this.timers[timerName];
    }

    stateOfTimer(args) {
      const timerName = args.name;
      return this.timers[timerName]?.status ?? "none";
    }

    getAllTimers() {
      return JSON.stringify(Object.keys(this.timers));
    }

    elapsedTime(args) {
      const timerName = args.name;
      const timer = this.timers[timerName];
      if (!timer || timer.startTime === null) return 0;

      const endTime = timer.pausedTime !== null ? timer.pausedTime : new Date().getTime();
      const elapsedMilliseconds = endTime - timer.startTime;

      switch (args.unit.toLowerCase()) {
        case "milliseconds":
          return elapsedMilliseconds;
        case "seconds":
          return Math.floor(elapsedMilliseconds / 1000);
        case "minutes":
          return Math.floor(elapsedMilliseconds / (1000 * 60));
        case "hours":
          return Math.floor(elapsedMilliseconds / (1000 * 60 * 60));
        default:
          return 0;
      }
    }

    getTimerFormatted(args) {
      const timerName = args.name;
      const timer = this.timers[timerName];

      if (!timer || timer.startTime === null) {
        return "00:00:00";
      }

      const endTime = timer.pausedTime !== null ? timer.pausedTime : new Date().getTime();
      const elapsedMilliseconds = endTime - timer.startTime;

      const hours = Math.floor(elapsedMilliseconds / 3600000);
      const minutes = Math.floor((elapsedMilliseconds % 3600000) / 60000);
      const seconds = Math.floor((elapsedMilliseconds % 60000) / 1000);

      if (args.format === "hh:mm:ss") {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      } else if (args.format === "mm:ss") {
        const totalMinutes = hours * 60 + minutes;
        return `${totalMinutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }

      return "00:00";
    }
  }

  Scratch.extensions.register(new TimerExtension());
})(Scratch);
