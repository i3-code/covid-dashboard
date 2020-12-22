import { KEYS } from "./keys";

export default class Keyboard {
  constructor(inject) {
    this.layout = "en";
    this.justLoaded = true;
    this.shift = false;
    this.caps = false;
    this.insert = false;
    this.init();
  }

  init() {
    this.keys = KEYS;
    const kbDiv = document.createElement("div");
    kbDiv.classList.add("keyboard");
    const main = document.querySelector(".Left");
    const layout = this.keys[this.layout];
    const icons = this.keys["icons"];
    const specials = this.keys["specials"];
    for (const [kbLineName, kbLine] of Object.entries(layout.lines)) {
      const kbLineDiv = document.createElement("div");
      kbLineDiv.classList.add("kb-line", `kb-line-${kbLineName}`);
      kbDiv.appendChild(kbLineDiv);
      for (const [keyCode, keyValue] of Object.entries(kbLine)) {
        let keyChar = keyValue;
        let keyShiftChar = "";
        if (typeof keyChar !== "string") {
          keyShiftChar = keyChar[1];
          keyChar = keyChar[0];
        }
        if (layout.letters.indexOf(keyShiftChar.toLocaleLowerCase()) !== -1)
          keyShiftChar = "";
        const keyKey = keyChar;
        const keyCodeLower = keyCode.toLowerCase();
        if (icons[keyChar])
          keyChar = `<span class="${icons[keyChar]}">${keyChar}</span>`;
        if (specials[keyChar]) keyChar = specials[keyChar];
        if (specials[keyShiftChar]) keyShiftChar = specials[keyShiftChar];
        const kbKeyDiv = document.createElement("div");
        kbKeyDiv.classList.add("kb-key");
        kbKeyDiv.id = `${keyCodeLower}`;
        kbKeyDiv.setAttribute("key", keyKey.toLowerCase());
        kbKeyDiv.setAttribute("code", keyCode);
        kbKeyDiv.innerHTML = `
                                          <div class="kb-shift-key" id="shift-${keyCodeLower}">${keyShiftChar}</div>
                                          <div id="char-${keyCodeLower}">${keyChar}</div>
                                          <div></div>
                                         `;
        kbLineDiv.appendChild(kbKeyDiv);
        kbKeyDiv.addEventListener("click", this.inputEngine.bind(this));
      }
    }
    main.appendChild(kbDiv);
  }

  renderKeyboard() {
    const layout = this.keys[this.layout];
    const specials = this.keys["specials"];
    for (const [, kbLine] of Object.entries(layout.lines)) {
      for (const [keyCode, keyValue] of Object.entries(kbLine)) {
        if (typeof keyValue === "string") continue;
        let keyChar = keyValue[+this.shift];
        let keyShiftChar = keyValue[+!this.shift];
        if (layout.letters.indexOf(keyChar.toLowerCase()) !== -1 && this.caps) {
          keyChar = keyValue[+(this.caps && !this.shift)];
          keyShiftChar = keyValue[+!(this.caps && !this.shift)];
        }
        if (layout.letters.indexOf(keyShiftChar.toLocaleLowerCase()) !== -1)
          keyShiftChar = "";
        const keyCodeLower = keyCode.toLowerCase();
        const keyKey = keyChar;
        if (specials[keyChar]) keyChar = specials[keyChar];
        if (specials[keyShiftChar]) keyShiftChar = specials[keyShiftChar];
        const keyDiv = document.querySelector(`#${keyCodeLower}`);
        const keyShiftDiv = document.querySelector(`#shift-${keyCodeLower}`);
        const keyCharDiv = document.querySelector(`#char-${keyCodeLower}`);
        keyDiv.setAttribute("key", keyKey);
        keyShiftDiv.innerHTML = keyShiftChar;
        keyCharDiv.innerHTML = keyChar;
      }
    }
  }

  toggleKeyboard(force) {
    const keyboardDiv = document.querySelector(".keyboard");
    const inputField = document.getElementById("keyboard-input");
    if (force === 1) {
      if (keyboardDiv.classList.contains("keyboard-visible")) return;
      keyboardDiv.classList.add("keyboard-visible");
      if (this.justLoaded) {
        inputField.setAttribute("placeholder", "");
        this.justLoaded = false;
      }
    } else {
      keyboardDiv.classList.toggle("keyboard-visible");
    }
  }

  inputEngine(event, eventKey, eventCode) {
      console.log(event);
    const keyboardDiv = document.querySelector(".keyboard");
    const inputField = document.getElementById("keyboard-input");

    if (event.type === "focus") {
      if (keyboardDiv.classList.contains("keyboard-visible")) return;
      this.toggleKeyboard(1);
      return;
    }

    if (event.type === "click") {
      const kbKeyDiv = event.currentTarget;
      event.key = kbKeyDiv.getAttribute("key");
      event.code = kbKeyDiv.getAttribute("code");
    }

    const keyCode = event.code;
    const keyId = keyCode.toLowerCase();
    const key = document.getElementById(keyId);
    if (key) {
      event.preventDefault();
      let keyChar = key.getAttribute("key");
      const keyReplace = this.keys.replaces[keyChar];
      if (keyReplace) keyChar = String.fromCharCode(keyReplace);
      if (event.type === "keydown") key.classList.add("kb-key-press");
      if (event.type === "keyup") key.classList.remove("kb-key-press");
      if (event.type !== "keyup") {
        let start = inputField.selectionStart;
        let end = inputField.selectionEnd;
        let direction = inputField.selectionDirection;
        let value = inputField.value;
        const wipe = Number(start === end);

        if (keyChar.length < 2) {
          if (keyCode === "Tab") keyChar = "    ";
          value =
            value.slice(0, start) + keyChar + value.slice(end + +this.insert);
          start += keyChar.length;
          end = start;
        }

        if (keyCode === "Delete") {
          value = value.slice(0, start) + value.slice(end + wipe);
          end = start;
        }

        if (keyCode === "Backspace" && (start || (!start && !wipe))) {
          value = value.slice(0, start - wipe) + value.slice(end);
          start -= wipe;
          end = start;
        }

        if (keyCode === "ArrowLeft" && start) {
          if (!this.shift) {
            start = wipe ? start - 1 : start;
            end = start;
          } else {
            if (wipe) direction = "backward";
            if (direction === "backward") start -= 1;
            if (direction === "forward") end -= 1;
          }
        }

        if (keyCode === "ArrowRight" && start < value.length) {
          if (!this.shift) {
            start = wipe ? start + 1 : end;
            end = start;
          } else {
            if (wipe) direction = "forward";
            if (direction === "backward") start += 1;
            if (direction === "forward") end += 1;
          }
        }

        if (keyCode === "ArrowUp" || keyCode === "ArrowDown") {
          const enterChar = String.fromCharCode(13);
          const lineArray = [];
          const posArray = [];
          let [lineStart, linePos] = [0, 0];
          let [currentLine, currentPos] = [0, 0];
          for (let i = 0; i <= value.length; i++) {
            const lineBreak = value[i] === enterChar;
            linePos++;
            const selectionUp =
              this.shift && i === start && direction === "backward";
            const selectionDown =
              this.shift && i === end && direction === "forward";
            if ((!this.shift && i === start) || selectionUp || selectionDown) {
              currentPos = linePos - 1;
              currentLine = lineArray.length;
            }
            if (linePos > 85 || lineBreak || i === value.length) {
              const line = value.slice(lineStart, lineStart + linePos);
              const previousLine = lineArray[lineArray.length - 1];
              if (
                line === enterChar &&
                previousLine &&
                previousLine.length === 86
              ) {
                linePos--;
                lineStart += 1;
                continue;
              }
              lineArray.push(line);
              posArray.push(lineStart);
              if (i !== value.length) {
                lineStart += linePos;
                linePos = 0;
              }
            }
          }

          if (keyCode === "ArrowUp" && currentLine) {
            const prevLine = lineArray[currentLine - 1];
            if (currentPos >= prevLine.length) currentPos = prevLine.length - 1;
            const tmpPos = posArray[currentLine - 1] + currentPos;
            if (!this.shift) {
              start = wipe ? tmpPos : start;
              end = start;
            } else {
              if (wipe) direction = "backward";
              if (direction === "backward") start = tmpPos;
              if (direction === "forward") end = tmpPos;
            }
          }

          if (keyCode === "ArrowUp" && !wipe && !this.shift) {
            end = start;
          }

          if (keyCode === "ArrowDown" && currentLine < lineArray.length - 1) {
            let nextLine = lineArray[currentLine + 1];
            if (currentPos >= nextLine.length) {
              currentPos = nextLine.length - 1;
              if (currentLine + 1 === lineArray.length - 1) currentPos++;
            }
            const tmpPos = posArray[currentLine + 1] + currentPos;
            if (!this.shift) {
              start = wipe ? tmpPos : end;
              end = start;
            } else {
              if (wipe) direction = "forward";
              if (direction === "backward") start = tmpPos;
              if (direction === "forward") end = tmpPos;
            }
          }
        }
        inputField.blur();
        inputField.value = value;
        inputField.setSelectionRange(start, end, direction);
        inputField.focus();
      }

      if (event.type !== "keydown") {
        if (
          keyCode === "ShiftLeft" ||
          keyCode === "CapsLock" ||
          keyCode === "Insert"
        ) {
          key.classList.toggle("kb-key-toggle");
        }

        if (keyCode === "ShiftLeft") {
          this.shift = !this.shift;
          this.renderKeyboard();
        }

        if (keyCode === "CapsLock") {
          this.caps = !this.caps;
          this.renderKeyboard();
        }

        if (keyCode === "Insert") {
          inputField.classList.toggle("keyboard-insert");
          this.insert = !this.insert;
        }

        if (keyCode === "Language") {
          this.layout = this.layout === "en" ? "ru" : "en";
          const languageDiv = document.querySelector("#char-language");
          languageDiv.innerHTML = this.layout;
          this.renderKeyboard();
        }

        if (keyCode === "IntlBackslash") {
          key.classList.toggle("kb-key-toggle");
          this.recognize();
        }

        if (keyCode === "Keyboard") {
          this.toggleKeyboard();
          inputField.blur();
        }
      }
    }
  }
}
