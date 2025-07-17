export class Button {
  dom: HTMLElement;
  active: boolean = false;
  shortcut: string;
  callback: () => void;

  constructor(name: string, shortcut: string, parentDom: HTMLElement) {
    this.dom = document.createElement("div");
    this.dom.classList.add("button");
    this.dom.classList.add("disableSelection");
    this.shortcut = shortcut;

    // build text
    let text = `${name}(<b>${shortcut}</b>)`;
    if (name.includes(shortcut)) {
      const parts = name.split(shortcut);
      text = `${parts[0]}<b>${shortcut}</b>${parts.slice(1).join("")}`;
    }
    this.dom.innerHTML = text;

    this.dom.addEventListener("click", this.onClick.bind(this));
    parentDom.appendChild(this.dom);
  }

  setActive(active: boolean) {
    this.active = active;
    this.dom.classList.toggle("activeButton", active);
  }

  onClick() {
    this.setActive(!this.active);
    if (this.callback) this.callback();
  }

  setCallback(callback: () => void) {
    this.callback = callback;
  }
}
