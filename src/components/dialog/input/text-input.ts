import {BaseComponent} from "../../component.js";
import {TextData} from "../dialog.js";

export class TextInput extends BaseComponent<HTMLInputElement> implements TextData {
    constructor() {
        super(`
            <div>
                <div class="form__container">
                    <label for="title">Title</label>
                    <input id="title" type="text">
                </div>
                <div class="form__container">
                    <label for="body">Body</label>
                    <input type="text" id="body">
                </div>    
            </div>
        `)
    }

    get title(): string {
        const element = this.element.querySelector("#title")! as HTMLInputElement
        return element.value
    }

    get body(): string {
        const element = this.element.querySelector("#body")! as HTMLInputElement
        return element.value
    }
}
