import {BaseComponent} from "../../component.js";
import {MediaData} from "../dialog.js";

export class MediaInput extends BaseComponent<HTMLInputElement> implements MediaData {
    constructor() {
        super(`
            <div>
                <div class="form__container">
                    <label for="title">Title</label>
                    <input id="title" type="text">
                </div>
                <div class="form__container">
                    <label for="url">URL</label>
                    <input type="text" id="url">
                </div>    
            </div>
        `)
    }

    get title(): string {
        const element = this.element.querySelector("#title")! as HTMLInputElement
        return element.value
    }

    get url(): string {
        const element = this.element.querySelector("#url")! as HTMLInputElement
        return element.value
    }
}
