import { Editor } from "./Editor";

export class KeyShortcut {
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
    document.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey) {
      if (event.key === "s") {
        event.preventDefault();
        this.editor.process.save();
      } else if (event.key === "l") {
        event.preventDefault();
        this.editor.process.load();
      }
    } else if (event.key === "Tab") {
      this.editor.toggleMode();
    } else {
      this.editor.toolbox.handleKeyDown(event);
    }
  }
}
