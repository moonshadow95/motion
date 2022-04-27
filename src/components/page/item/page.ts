import {BaseComponent, Component} from "../../component.js";

export interface Composable{
    addChild(child:Component):void
}
type OnCloseListener =()=>void
class PageItemComponent extends BaseComponent<HTMLElement> implements Composable{
    // 외부로부터 전달받은 콜백함수
    private closeListener?:OnCloseListener
    constructor(){
        // super() 사용하여
        super('<li class="page-item"><section class="page-item__body"><div class="page-item__controls"><button class="close">&times;</button></div></section></li>')
        const closeButton = this.element.querySelector('.close')! as HTMLButtonElement
        closeButton.onclick=()=>{
            // PageItemComponent 를 삭제해야하는데 어디에 속해있는지 알 수 없다.
            // 외부로부터 콜백함수를 전달받아야 한다.
            this.closeListener && this.closeListener()
        }
    }
    addChild(child:Component){
        const container = this.element.querySelector('.page-item__body')! as HTMLElement
        child.attachTo(container)
    }
    setOnCloseListener(listener:OnCloseListener){
        this.closeListener = listener
    }
}

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable{
    constructor(){
        super('<ul class="page"></ul>')
    }
    addChild(section:Component){
        const item = new PageItemComponent()
        item.addChild(section);
        item.attachTo(this.element, 'beforeend')
        item.setOnCloseListener(()=>{
            // 자신을 부모에게서 삭제
            item.removeFrom(this.element)
        })
    }
}
