import {BaseComponent, Component} from "../../component.js";

export interface Composable{
    addChild(child:Component):void
}
type OnCloseListener =()=>void
// SectionContainer 는
// Component 인터페이스를 구현해야하고, 자식을 추가할 수 있는 Composable 인터페이스도 구현해야 한다.
// 닫을 수 있도록 setOnCloseListener() api 를 가지고 있어야 한다.
interface SectionContainer extends Component, Composable {
    setOnCloseListener(listener:OnCloseListener):void
}

type SectionContainerConstructor = {
    // 'SectionContainer 인터페이스를 따르는 클래스' 를 만드는 생성자를 가져야 한다.
    new ():SectionContainer
}
export class PageItemComponent extends BaseComponent<HTMLElement> implements SectionContainer{
    // 외부로부터 전달받은 콜백함수
    private closeListener?:OnCloseListener
    constructor(){
        // super() 사용하여
        super(`
            <li class="page-item">
                <section class="page-item__body">
                    <div class="page-item__controls">
                        <button class="close">&times;</button>
                    </div>
                </section>
            </li>
        `)
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
// 현재 PageComponent 는 PageItemComponent 한가지 밖에 만들지 못한다.
// -> DarkPageItemComponent 처럼 다른 컴포넌트를 만들고 싶다면?
// Dependency injection
export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable{
    // 어떤 타입의 데이터를 만들 수 있는지 전달해준다.
    // -> SectionContainer 인터페이스를 따르는 클래스
    // -> Component 와 Composable 을 포함하며 setOnCloseListener() api 를 가진 클래스
    constructor(private pageItemConstructor:SectionContainerConstructor){
        super('<ul class="page"></ul>')
    }
    addChild(section:Component){
        // 생성자에서 전달받은 타입의 클래스를 만든다.
        const item = new this.pageItemConstructor()
        item.addChild(section);
        item.attachTo(this.element, 'beforeend')
        item.setOnCloseListener(()=>{
            // 자신을 부모에게서 삭제
            item.removeFrom(this.element)
        })
    }
}
