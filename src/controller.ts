import { Model } from "./model";

export class ToolbarController {
    constructor(private model: Model) {}

    toolBarButtonPress(btn: string) {
        if(btn === "add") {
            this.model.addSwatch();
        }
        else if(btn === "delete") {
            this.model.deleteSwatch();
        }
    }
}

export class SwatchListController {
    constructor(private model: Model) {}

    swatchPressed(index: number) {
        this.model.updateSelected(index);
    }
}

