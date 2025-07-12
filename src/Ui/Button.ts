export class Button {
  dom: HTMLElement;
  active: boolean = false;
  callback: () => void;

  constructor(name: string, parentDom: HTMLElement, callback: () => void) {
    this.dom = document.createElement("button");
    this.dom.textContent = name;
    this.callback = callback;
    this.dom.addEventListener("click", this.onClick.bind(this));
    parentDom.appendChild(this.dom);
  }

  setActive(active: boolean) {
    this.active = active;
    this.dom.classList.toggle("activeButton", active);
  }

  onClick() {
    this.setActive(!this.active);
    this.callback();
  }
}
