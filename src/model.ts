import { Color, randomColor } from "./color.ts";
import { Observer } from "./view.ts"

export class Subject {
    private observers: Observer[] = [];
    
    addObserver(observer: Observer) {
        this.observers.push(observer);
        observer.update();
    }

    protected notifyObservers() {
        this.observers.forEach((o) => o.update());
    }
}

export class Model extends Subject {
    public swatchList: Color[] = [];
    public selectedSwatch: number = 0;
    public selectedColor: Color = randomColor();

    public defaultSwatches: number = 10;
    public minSwatches: number = 1;
    public maxSwatches: number = 1000;

    constructor() {
        super();
        for(let i = 0; i < this.defaultSwatches; i++) this.addSwatch();
        this.updateSelected(1);
    }

    updateSelected(index: number) {
        this.selectedSwatch = index;
        this.selectedColor = this.swatchList[this.selectedSwatch - 1];
        this.notifyObservers();
    }

    updateHue(H: number) {
        this.selectedColor.H = H;
        this.swatchList[this.selectedSwatch - 1].H = H;
        this.notifyObservers();
    }

    updateSat(S: number) {
        this.selectedColor.S = S;
        this.swatchList[this.selectedSwatch - 1].S = S;
        this.notifyObservers();
    }

    updateLum(L: number) {
        this.selectedColor.L = L;
        this.swatchList[this.selectedSwatch - 1].L = L;
        this.notifyObservers();
    }

    addSwatch() {
        if(this.swatchList.length < this.maxSwatches) {
            this.selectedColor = randomColor();
            this.swatchList.push(this.selectedColor);
            this.selectedSwatch = this.swatchList.length;
            this.notifyObservers();
        }
    }

    deleteSwatch() {
        if(this.swatchList.length > this.minSwatches) {
            let newList: Color[] = [];
            for(let i = 0; i < this.swatchList.length; i++) {
                if(i != this.selectedSwatch - 1) {
                    newList.push(this.swatchList[i]);
                }
            }
            this.swatchList = newList;
            this.selectedSwatch = this.swatchList.length;
            this.selectedColor = this.swatchList[this.selectedSwatch - 1];
            this.notifyObservers();
        }
    }
}
