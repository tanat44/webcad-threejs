import { Editor } from "./Editor/Editor";
import { Graphic } from "./Graphic/Graphic";
import { Ui } from "./Ui/Ui";
import "./main.css";
import "./sortable.css";

const graphic = new Graphic();
const ui = new Ui(graphic);
const editor = new Editor(graphic, ui);
ui.setEditor(editor);
