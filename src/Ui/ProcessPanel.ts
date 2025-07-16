import { Editor } from "../Editor/Editor";
import { ElementBase } from "../Editor/Element/ElementBase";
import { ProcessElement } from "./ProcessElement";

export class ProcessPanel {
  editor: Editor;
  dom: HTMLElement;
  elementDoms: ProcessElement[] = [];
  draggingItem: HTMLElement;

  constructor(editor: Editor) {
    this.editor = editor;
    this.dom = document.getElementById("processPanel");

    // listen to element update event
    document.addEventListener("ElementUpdate", this.onElementUpdate.bind(this));

    // drag and drop sortable list
    this.dom = document.getElementById("processList");
    this.dom.addEventListener("dragstart", (e: DragEvent) => {
      this.draggingItem = e.target as HTMLElement;
      (e.target as HTMLElement).classList.add("dragging");
    });
    this.dom.addEventListener("dragend", (e: DragEvent) => {
      (e.target as HTMLElement).classList.remove("dragging");
      document
        .querySelectorAll(".sortable-item")
        .forEach((item) => item.classList.remove("over"));
      this.draggingItem = null;
    });
    this.dom.addEventListener("dragover", (e: DragEvent) => {
      e.preventDefault();
      const draggingOverItem = this.getDragAfterElement(e.clientY);
      document
        .querySelectorAll(".sortable-item")
        .forEach((item) => item.classList.remove("over"));
      if (draggingOverItem) {
        (draggingOverItem as HTMLElement).classList.add("over");
        this.dom.insertBefore(this.draggingItem, draggingOverItem);
      } else {
        this.dom.appendChild(this.draggingItem);
      }
    });
  }

  getDragAfterElement(y: number) {
    const draggableElements = Array.from(
      this.dom.querySelectorAll(".sortable-item:not(.dragging")
    );
    return (
      draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ) as any
    ).element;
  }

  addElement(element: ElementBase) {
    this.elementDoms.push(new ProcessElement(element, this.editor, this.dom));
  }

  updateElement(element: ElementBase) {
    for (const el of this.elementDoms) {
      if (el.element === element) {
        el.updateText();
        return;
      }
    }
    throw new Error("Process panel found Unknown update element");
  }

  removeElement(element: ElementBase) {
    for (const el of this.elementDoms) {
      if (el.element === element) {
        this.dom.removeChild(el.dom);
        return;
      }
    }
  }

  onElementUpdate = (event: CustomEvent) => {
    const element: ElementBase = event.detail;
    this.updateElement(element);
  };
}
