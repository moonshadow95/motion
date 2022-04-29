import {BaseComponent} from "../../component.js";
import {TextData} from "../dialog.js";

export class TextSectionInput extends BaseComponent<HTMLElement> implements TextData {
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

    // 사용자가 정보를 입력하고 ADD 버튼을 누르면 getter 가 DOM 요소의 title, url 을 읽어온다.
    get title(): string {
        const element = this.element.querySelector('#title')! as HTMLInputElement
        return element.value

    }

    get body(): string {
        const element = this.element.querySelector('#body')! as HTMLInputElement
        return element.value
    }
}
