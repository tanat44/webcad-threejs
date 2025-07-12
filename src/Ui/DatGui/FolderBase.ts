import { GUI } from "dat.gui";
import { Graphic } from "../../Graphic/Graphic";

export abstract class FolderBase {
  protected graphic: Graphic;
  protected gui: GUI;
  protected folder: any;

  constructor(graphic: Graphic, gui: GUI, folderName: string = "undefined") {
    this.graphic = graphic;
    this.gui = gui;
    this.folder = this.gui.addFolder(folderName);
    this.create();
  }

  protected create() {}

  protected addButton(name: string, callback: () => void) {
    this.folder.add({ [name]: callback }, name);
  }
}
