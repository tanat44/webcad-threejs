import { Editor } from "../Editor/Editor";
import { ElementBase } from "../Editor/Element/ElementBase";
import { ProcessType } from "../Editor/type";

export class ProcessElement {
  editor: Editor;
  element: ElementBase;
  dom: HTMLElement;

  constructor(element: ElementBase, editor: Editor, parent: HTMLElement) {
    this.editor = editor;
    this.element = element;

    // dom
    this.dom = document.createElement("li");
    this.dom.className = "sortable-item";
    this.dom.draggable = true;
    this.updateText();
    parent.appendChild(this.dom);
  }

  updateText() {
    this.dom.innerHTML = `<b>${
      this.element.elementType
    }</b> ${this.processTypeToString(this.element.processType)} `;
  }

  private processTypeToString(type: ProcessType): string {
    switch (type) {
      case ProcessType.Add:
        return "+";
      case ProcessType.Subtract:
        return "-";
      case ProcessType.Disable:
        return "o";
      default:
        return "o";
    }
  }
}
