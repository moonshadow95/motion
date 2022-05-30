import {BaseComponent, Component} from "../component.js";

// 두 컴포넌트 모두 addChild() api 를 가지고 있으므로 인터페이스로 규약한다.
// Composable = 작성 가능, 구성 가능
export interface Composable {
    addChild(element: Component): void
}

type OnCloseListener = () => void
type DragState = 'start' | 'stop' | 'enter' | 'leave'
// 첫번째 인자인 타겟은 제네릭으로 설정하며 컴포넌트를 확장한 녀석이다.
// 두번째 인자인 드래그 상태는 시작하거나 끝나거나 들어오거나 나가거나이다.
type OnDragStateListener<T extends Component> = (target: T, state: DragState) => void

interface SectionContainer extends Component, Composable {
    setOnCloseListener(listener: OnCloseListener): void

    // 드래그 상태를 듣는 함수
    setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void

    // 자식 요소 포인터를 비활성/활성하는 함수
    muteChildren(state: 'mute' | 'unmute'): void

    getBoundingClientRect(): DOMRect
}

type SectionItemConstructor = {
    new(): SectionContainer
}

// 페이지 컴포넌트에 들어가는 페이지 아이템 컴포넌트를 생성한다.
export class PageItemComponent extends BaseComponent<HTMLLIElement> implements SectionContainer {
    private closeListener?: OnCloseListener
    private dragStateListener?: OnDragStateListener<PageItemComponent>

    constructor() {
        super(`
            <!-- draggable='true' -->
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
        // 드래그 이벤트
        this.element.addEventListener('dragstart', (event: DragEvent) => {
            this.onDragStart(event)
        })
        this.element.addEventListener('dragend', (event: DragEvent) => {
            this.onDragEnd(event)
        })
        this.element.addEventListener('dragenter', (event: DragEvent) => {
            this.onDragEnter(event)
        })
        this.element.addEventListener('dragleave', (event: DragEvent) => {
            this.onDragLeave(event)
        })
    }

    // 드래그 이벤트 콜백함수 - 드래그 상태를 알려준다.
    onDragStart(_: DragEvent) {
        this.notifyDragObservers('start')
    }

    onDragEnd(_: DragEvent) {
        this.notifyDragObservers('stop')
    }

    onDragEnter(_: DragEvent) {
        this.notifyDragObservers('enter')
    }

    onDragLeave(_: DragEvent) {
        this.notifyDragObservers('leave')
    }

    // 함수로 만들어 4가지 경우를 한번에 관리한다.
    notifyDragObservers(state: DragState) {
        // 등록된 리스너가 있다면 등록된 리스너로 자기 자신과 드래그 상태를 전달한다.
        this.dragStateListener && this.dragStateListener(this, state)
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

    // drag 되면 콜백함수를 등록하는 api
    setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
        // 내부 변수에 리스너를 등록
        this.dragStateListener = listener
    }

    // 자식 요소의 포인터를 활성/비활성 하는 함수
    muteChildren(state: "mute" | "unmute") {
        if (state === 'mute') {
            this.element.classList.add('mute-children')
        } else {
            this.element.classList.remove('mute-children')
        }
    }

    getBoundingClientRect(): DOMRect {
        return this.element.getBoundingClientRect()
    }
}

// li 로 페이지 아이템을 담을 ul 태그, 패이지 컴포넌트를 만든다.
// 페이지 컴포넌트는 자신을 추가할 수 있는 api 를 가지고 있어야 한다.
export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
    // 드래그 이벤트
    // 드래그가 발생하면 그것을 기억했다가 드랍이 발생하면 위치를 변경해준다.
    // dragTarget, dropTarget 매개변수 추가
    private dragTarget?: SectionContainer
    private dropTarget?: SectionContainer
    // 드래그를 할 때 자식 요소들에게도 enter leave 이벤트가 발생하는 문제를 해결하기 위해 드래그를 시작하자마자 다른 모든 요소들의 pointer 를 없애준다.
    // 모든 섹션 자식들을 알기 위해 children 변수 추가
    // Set -> Map 과 달리 중복된 데이터를 가질 수 없는 자료구조
    private children = new Set<SectionContainer>();

    constructor(private pageItemConstructor: SectionItemConstructor) {
        super('<ul class="page"></ul>')
        this.element.addEventListener('dragover', (event: DragEvent) => {
            this.onDragOver(event)
        })
        this.element.addEventListener('drop', (event: DragEvent) => {
            this.onDrop(event)
        })
    }

    // 드래그 이벤트 콜백함수
    onDragOver(event: DragEvent) {
        event.preventDefault()
        console.log('dragover')
    }

    onDrop(event: DragEvent) {
        event.preventDefault()
        console.log('drop')
        // 드랍시 여기서 위치를 바꿔준다.
        if (!this.dragTarget) return
        if (this.dragTarget && this.dragTarget !== this.dropTarget) {
            const dropY = event.clientY
            const srcElement = this.dragTarget.getBoundingClientRect()
            this.dragTarget.removeFrom(this.element)
            this.dropTarget?.attach(this.dragTarget, (dropY < srcElement.y) ? 'beforebegin' : 'afterend')
        }
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
        // children 이라는 Set 에 모든 자식 요소들을 추가해준다.
        this.children.add(item)
        // 생성한 아이템에 콜백함수를 등록
        // 삭제하는 콜백함수는 베이스 컴포넌트에 있는 removeFrom() api
        // 이 엘리먼트에서 아이템을 삭제한다.
        item.setOnCloseListener(() => {
            item.removeFrom(this.element)
            // children 이라는 Set 에서 자식 요소들 삭제
            this.children.delete(item)
        })

        // 드래그 상태를 듣는 함수 등록
        item.setOnDragStateListener((target: SectionContainer, state: DragState) => {
            switch (state) {
                case 'start':
                    this.dragTarget = target
                    // pointer 를 뮤트시킨다.
                    this.updateSections('mute')
                    break
                case 'stop':
                    this.dragTarget = undefined
                    this.updateSections('unmute')
                    break
                case 'enter':
                    this.dropTarget = target
                    break
                case 'leave':
                    this.dropTarget = undefined
                    break
                default:
                    throw Error(`unsupported state: ${state}`)
            }
        })
    }

    // 섹션이 업데이트 되고 있으면 자식 요소들의 포인터를 비활성한다.
    private updateSections(state: 'mute' | 'unmute') {
        this.children.forEach((section: SectionContainer) => {
            section.muteChildren(state)
        })
    }
}

