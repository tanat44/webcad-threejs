import { Editor } from "./Editor/Editor";
import { Graphic } from "./Graphic/Graphic";
import { Ui } from "./Ui/Ui";
import "./main.css";

const graphic = new Graphic();
const editor = new Editor(graphic);
new Ui(graphic, editor);
