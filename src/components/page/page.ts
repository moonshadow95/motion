import {BaseComponent, Component} from "../component.js";

// 두 컴포넌트 모두 addChild() api 를 가지고 있으므로 인터페이스로 규약한다.
// Composable = 작성 가능, 구성 가능
export interface Composable {
    addChild(element: Component): void
}

type OnCloseListener = () => void

interface SectionContainer extends Component, Composable {
    setOnCloseListener(listener: OnCloseListener): void
}

type SectionItemConstructor = {
    new(): SectionContainer
}

// 페이지 컴포넌트에 들어가는 페이지 아이템 컴포넌트를 생성한다.
export class PageItemComponent extends BaseComponent<HTMLLIElement> implements SectionContainer {
    private closeListener?: OnCloseListener

    constructor() {
        super(`
            <li class="page-item" draggable="true">
                <section class="page-item__body"></section>
                <div class="page-item__controls">
                    <button class="close">&times;</button>
                </div>
            </li>       
        `)
        // 닫기 함수
        const closeButton = this.element.querySelector('.close')! as HTMLButtonElement
        closeButton.onclick = () => {
            // 클릭이 된 버튼을 담고있는 페이지 아이템 컴포넌트를 삭제해야 하는데, 자신이 어디에 들어있는지 알 수 없으므로
            // closeListener 라는 멤버변수를 만들어 외부로부터 전달받은 콜백함수를 저장한다.
            this.closeListener && this.closeListener()
        }
    }

    // 섹션에 아이템을 추가하는 api
    addChild(child: Component) {
        const container = this.element.querySelector('.page-item__body')! as HTMLElement
        child.attachTo(container)
    }

    // close 버튼에 콜백함수를 등록하는 api
    setOnCloseListener(listener: OnCloseListener) {
        this.closeListener = listener
    }
}

// li 로 페이지 아이템을 담을 ul 태그, 패이지 컴포넌트를 만든다.
// 페이지 컴포넌트는 자신을 추가할 수 있는 api 를 가지고 있어야 한다.
export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
    constructor(private pageItemConstructor: SectionItemConstructor) {
        super('<ul class="page"></ul>')
    }

    addChild(section: Component) {
        // 페이지 컴포넌트에서 페이지 아이템 컴포넌트를 직접 만들어 사용중,
        // 클래스 간 커플링이 되어있다. -> pageItemComponent 이외의 클래스를 만들 수 없다.
        // dependency injection 을 통한 디커플링
        // 1. 페이지 아이템 컴포넌트를 규격하는 인터페이스 생성 -> SectionContainer
        // 2. 페이지 아이템 컴포넌트의 생성자를 인자로 받기 위해,
        // SectionContainer 인터페이스를 따르는 클래스를 생성하는 생성자여야 한다. -> type SectionItemConstructor
        // 3. App 에서 PageComponent 를 생성할 때, 하위 컴포넌트를 만들 생성자를 전달하여 동적으로 생성한다.
        const item = new this.pageItemConstructor()
        item.addChild(section)
        item.attachTo(this.element, 'beforeend')

        // 생성한 아이템에 콜백함수를 등록
        // 삭제하는 콜백함수는 베이스 컴포넌트에 있는 removeFrom() api
        // 이 엘리먼트에서 아이템을 삭제한다.
        item.setOnCloseListener(() => {
            item.removeFrom(this.element)
        })
    }
}

