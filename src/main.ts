
import { Model } from "./model";
import { SwatchListController, ToolbarController } from "./controller";
import { StatusBar, SwatchList, Toolbar, ViewPort } from "./view";

let model = new Model();

let toolbarController = new ToolbarController(model);
new Toolbar(model, toolbarController);

new ViewPort(model);

let swatchListController = new SwatchListController(model);
new SwatchList(model, swatchListController);

new StatusBar(model);

function isWithinRange(index: number): Boolean {
    return (0 < index &&  index <= model.swatchList.length);
}

export function rows(): number {
    let width = (window.innerWidth - (2 * 10));
    let blocksInRow = Math.floor(width / (50 + 20));
    let remainingSpace = width % (50 + 20);
    if(remainingSpace >= 50) blocksInRow++;
    return blocksInRow;
}

function rowsWithScrollbar(): number {
    let width = (window.innerWidth - (2 * 10) - 17);
    let blocksInRow = Math.floor(width / (50 + 20));
    let remainingSpace = width % (50 + 20);
    if(remainingSpace >= 50) blocksInRow++;
    return blocksInRow;
}

function columns(): number {
    let height = ((window.innerHeight - (2 * 50)) / 2) - (2 * 10);
    let blocksInColumn = Math.floor(height / (50 + 20));
    let remainingSpace = height % (50 + 20);
    if(remainingSpace >= 50) blocksInColumn++;
    return blocksInColumn;
}

function totalBlocks(): number {
    return rows() * columns();
}

let controlsDisabled: boolean = false;

document.onclick = () => {
    let swatchlist = document.getElementById("swatchlist") as HTMLDivElement;
    let inputs = document.getElementsByTagName("input");
    let activeElement = document.activeElement;
    for(let i = 0; i < inputs.length; i++) {
        if(inputs[i] == activeElement) {
            controlsDisabled = true;
            return;
        }
    }
    controlsDisabled = false;
    swatchlist.focus();
}



document.onkeydown = (e) => {
    if(controlsDisabled) return;
    let swatchlist = document.getElementById("swatchlist") as HTMLDivElement;
    let blocksInRow = rows();
    //If scrollbar exists
    if(model.swatchList.length > totalBlocks()) blocksInRow = rowsWithScrollbar();

    if(e.key == "ArrowLeft" && isWithinRange(model.selectedSwatch - 1)) {
        model.updateSelected(model.selectedSwatch - 1);
        if(model.selectedSwatch % blocksInRow == 0) {
            e.preventDefault();
            swatchlist.scrollBy(0, -70);
        }
    }
    if(e.key == "ArrowRight" && isWithinRange(model.selectedSwatch + 1)) {
        model.updateSelected(model.selectedSwatch + 1);
        if(model.selectedSwatch % blocksInRow == 1) {
            e.preventDefault();
            swatchlist.scrollBy(0, 70);
        }
    }
    if(e.key == "ArrowUp" && isWithinRange(model.selectedSwatch - blocksInRow)) {
        e.preventDefault();
        swatchlist.scrollBy(0, -70);
        model.updateSelected(model.selectedSwatch - blocksInRow);
    }
    if(e.key == "ArrowDown") {
        if(isWithinRange(model.selectedSwatch + blocksInRow)) {
            e.preventDefault();
            swatchlist.scrollBy(0, 70);
            model.updateSelected(model.selectedSwatch + blocksInRow);
        }
        else {
            if(model.swatchList.length % blocksInRow != 0) {
                let blocksInLastRow = model.swatchList.length % blocksInRow;
                let remainingBlocks = blocksInRow - blocksInLastRow;
                let startOfRow = model.swatchList.length - remainingBlocks;
                let endOfRow = model.swatchList.length + remainingBlocks;
                let index = model.selectedSwatch + blocksInRow;
                if(startOfRow <= index && index <= endOfRow) {
                    e.preventDefault();
                    swatchlist.scrollBy(0, 70);
                    model.updateSelected(model.swatchList.length);
                }
            }
        }
    }
    if(e.key == "+") model.addSwatch();
    if(e.key == "-") model.deleteSwatch();
};


