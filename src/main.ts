
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
