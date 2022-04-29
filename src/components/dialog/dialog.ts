import {BaseComponent, Component} from "../component.js";
import {Composable} from "../page/item/page.js";
type OnCloseListener = () =>void
type OnSubmitListener = () =>void
// 동적으로 HTML 요소를 추가하고 자신을 삭제하고 할 수 있도록 BaseComponent 를 확장
// 내부에 자식 요소를 추가할 수 있도록 Composable 인터페이스를 구현
export class InputDialog extends BaseComponent<HTMLElement> implements Composable {
    closeListener?: OnCloseListener
    submitListener?: OnSubmitListener
    constructor(){
        super(`
            <dialog class="dialog">
                <div class="dialog__container">
                    <button class="close">&times;</button>
                    <div id="dialog__body"></div>
                    <button class="dialog__submit">ADD</button>
                </div>
            </dialog>
        `)
        const closeButton = this.element.querySelector('.close')! as HTMLElement
        closeButton.onclick = () =>{
            this.closeListener && this.closeListener()
        }
        const submitButton = this.element.querySelector('.dialog__submit')! as HTMLElement
        submitButton.onclick = () =>{
            this.submitListener && this.submitListener()
        }
    }
    setOnCloseListener(listener:OnCloseListener){
        this.closeListener = listener
    }
    setOnSubmitListener(listener:OnSubmitListener){
        this.submitListener = listener
    }
    addChild(child:Component){
        const body = this.element.querySelector('#dialog__body')! as HTMLElement
        child.attachTo(body)
    }
}
