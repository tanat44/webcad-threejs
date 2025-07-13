import { Editor } from "./Editor";

export class KeyShortcut {
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
    document.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey) {
      // handle meta
      if (event.key === "s") {
        event.preventDefault();
        this.editor.process.save();
      } else if (event.key === "l") {
        event.preventDefault();
        this.editor.process.load();
      }
    } else {
      this.editor.toolbox.handleKeyDown(event);
    }
  }
}
