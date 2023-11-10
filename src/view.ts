import { SwatchListController, ToolbarController } from "./controller";
import { Model } from "./model";
import { Color, colorToString, randomColor } from "./color";

export interface Observer {
    update(): void;
}

export class Toolbar implements Observer {
    public addButton: HTMLButtonElement = document.getElementById("add") as HTMLButtonElement;
    public deleteButton: HTMLButtonElement = document.getElementById("delete") as HTMLButtonElement;

    constructor(private model: Model, controller: ToolbarController) {
        this.addButton.addEventListener("click", () => { controller.toolBarButtonPress("add"); });
        this.deleteButton.addEventListener("click", () => { controller.toolBarButtonPress("delete"); });
        this.model.addObserver(this);
    }

    update(): void {
      this.deleteButton.disabled = (this.model.swatchList.length < 2) ? true : false;
      this.addButton.disabled = (this.model.swatchList.length > 15) ? true : false;
    }
}

export class StatusBar implements Observer {
    public label: HTMLParagraphElement = document.getElementById("status") as HTMLParagraphElement;

    constructor(private model: Model) {
        this.model.addObserver(this);
    }

    update(): void {
        this.label.innerHTML = `${this.model.swatchList.length} swatches (selected #${this.model.selectedSwatch})`;
    }
}

export class SwatchList implements Observer {
    public swatchList: HTMLDivElement = document.getElementById("swatchlist") as HTMLDivElement;
    constructor(private model: Model, public controller: SwatchListController) {
        this.model.addObserver(this);
    }

    update(): void {
      // Delete all swatches
      this.swatchList.innerHTML = '';
      //Repopulate swatches
      for(let i = 1; i <= this.model.swatchList.length; i++) {
        let swatch = document.createElement("div");
        swatch.style.backgroundColor = colorToString(this.model.swatchList[i - 1]);
        swatch.className = (i == this.model.selectedSwatch) ? "selected swatch" : "swatch";
        swatch.addEventListener("click", () => { this.controller.swatchPressed(i); });
        this.swatchList.appendChild(swatch);
      }
  }
}

export class ViewPort  implements Observer {
    public view: HTMLDivElement = document.getElementById("view") as HTMLDivElement;
    public editor: HTMLDivElement = document.getElementById("editor") as HTMLDivElement;
    public hueTextfield: HTMLInputElement = document.getElementById("huetextfield") as HTMLInputElement;
    public hueSlider: HTMLInputElement = document.getElementById("hueslider") as HTMLInputElement;
    public satTextfield: HTMLInputElement = document.getElementById("sattextfield") as HTMLInputElement;
    public satSlider: HTMLInputElement = document.getElementById("satslider") as HTMLInputElement;
    public lumTextfield: HTMLInputElement = document.getElementById("lumtextfield") as HTMLInputElement;
    public lumSlider: HTMLInputElement = document.getElementById("lumslider") as HTMLInputElement;
    constructor(private model: Model) {
      this.createEventListener("hue", model, this.hueTextfield, 0, 360);
      this.createEventListener("hue", model, this.hueSlider, 0, 360);
      this.createEventListener("sat", model, this.satTextfield, 0, 100);
      this.createEventListener("sat", model, this.satSlider, 0, 100);
      this.createEventListener("lum", model, this.lumTextfield, 0, 100);
      this.createEventListener("lum", model, this.lumSlider, 0, 100);
      this.model.addObserver(this);
    }

    createEventListener(type: string, model: Model, obj: HTMLInputElement, min: number, max: number) {
      obj.addEventListener("input", () => { 
        if(parseInt(obj.value) > max) obj.value = max.toString();
        if(obj.value == '') obj.value = min.toString();
        if(type == "hue") model.updateHue(parseInt(obj.value));
        if(type == "sat") model.updateSat(parseInt(obj.value));
        if(type == "lum") model.updateLum(parseInt(obj.value));
      });
    }

    update(): void {
      this.view.style.backgroundColor = colorToString(this.model.selectedColor);
      this.hueTextfield.value = this.hueSlider.value = this.model.selectedColor.H.toString();
      this.satTextfield.value = this.satSlider.value = this.model.selectedColor.S.toString();
      this.lumTextfield.value = this.lumSlider.value = this.model.selectedColor.L.toString();
    }
}
