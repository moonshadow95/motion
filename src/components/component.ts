// page, image, video ... 컴포넌트들 모두 attachTo api 를 가지므로 interface 를 만들어주고
// 베이스 컴포넌트를 만들어 확장하도록 한다.
// 닫기 버튼을 공통적으로 추가하기 위해 컴포넌트 인터페이스에 추가한다.
export interface Component {
    attachTo(parent: HTMLElement, position?: InsertPosition): void

    removeFrom(parent: HTMLElement): void
}

export class BaseComponent<T extends HTMLElement> implements Component {
    protected readonly element: T

    constructor(htmlString: string) {
        const template = document.createElement('template')
        template.innerHTML = htmlString
        this.element = template.content.firstElementChild! as T
    }

    attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
        parent.insertAdjacentElement(position, this.element)
    }

    // 부모를 받아 자식을 삭제하는 함수
    removeFrom(parent: HTMLElement) {
        if (parent !== this.element.parentElement) {
            throw Error('Parent does not match!')
        }
        parent.removeChild(this.element)
    }
}
