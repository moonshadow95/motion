import {BaseComponent} from "../../component.js";

export class MediaSectionInput extends BaseComponent<HTMLElement> {
    constructor(){
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
    // 사용자가 정보를 입력하고 ADD 버튼을 누르면 getter 가 DOM 요소의 title, url 을 읽어온다.
    get title() :string{
        const element = this.element.querySelector('#title')! as HTMLInputElement
        return element.value

    }
    get url(): string{
        const element = this.element.querySelector('#url')! as HTMLInputElement
        return element.value
    }
}
