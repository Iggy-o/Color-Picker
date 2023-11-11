import { SwatchListController, ToolbarController } from "./controller";
import { Model } from "./model";
import { colorToString, rgbStringToNum, rgbToHex } from "./color";
import { genericNames } from "./generic-color-names";
import { rows } from "./main";

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
      this.deleteButton.disabled = (this.model.swatchList.length < this.model.minSwatches + 1) ? true : false;
      this.addButton.disabled = (this.model.swatchList.length > this.model.maxSwatches - 1) ? true : false;
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

//Rebuild
export class SwatchList implements Observer {
    public swatchList: HTMLDivElement = document.getElementById("swatchlist") as HTMLDivElement;
    constructor(private model: Model, public controller: SwatchListController) {
      this.model.addObserver(this);
      // this.swatchList.focus();
      // this.swatchList.addEventListener("keydown", () => { this.swatchList.focus(); });
      // this.swatchList.focus();
    }

    update(): void {
      let oldNodeCount = this.swatchList.childElementCount;
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
      let blocksInRow = rows();
      if(this.model.swatchList.length % blocksInRow == 1 && oldNodeCount < this.model.swatchList.length) {
        this.swatchList.scrollBy(0, 70);
      }
      // else if(this.model.swatchList.length % blocksInRow == 0 && oldNodeCount > this.model.swatchList.length) {
      //   this.swatchList.scrollBy(0, -70);
      // }
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
    public rgbview: HTMLParagraphElement = document.getElementById("RGB") as HTMLParagraphElement;
    public hslview: HTMLParagraphElement = document.getElementById("HSL") as HTMLParagraphElement;
    public hexview: HTMLParagraphElement = document.getElementById("HEX") as HTMLParagraphElement;
    public genericview: HTMLParagraphElement = document.getElementById("Generic-Name") as HTMLParagraphElement;
    public namecontainer: HTMLParagraphElement = document.getElementById("name-container") as HTMLParagraphElement;
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
      this.rgbview.innerHTML = this.view.style.backgroundColor;
      this.hslview.innerHTML = colorToString(this.model.selectedColor);
      let hex = rgbToHex(rgbStringToNum(this.view.style.backgroundColor))
      this.hexview.innerHTML = hex;
      // console.log(getColorName(hex));
      // console.log(hex);
      this.genericview.innerHTML = getColorName(hex);
      this.namecontainer.style.display = (getColorName(hex) != "") ? "flex" : "none";
    }
}

// function getColorName(hexName: string): string {
//   for (const [key, value] of Object.entries(genericNames)) {
//     if(value.toUpperCase() == hexName) return key;
//   }
//   return "";
// }

function getColorName(hexName: string): string {
  for (let i = 0; i < genericNames.length; i++) {
    if(genericNames[i].hex == hexName) return genericNames[i].name;
  }
  return "";
}

// var fs = require('fs');

// fs.readFile('file.json', 'utf-8', function (err, data) {
//     if (err) throw err;

//     var obj = JSON.parse(data);

//     console.log(obj);
// });
