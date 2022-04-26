export class PageComponent{
    private element:HTMLUListElement
    constructor(){
        this.element = document.createElement('ul')
        this.element.setAttribute('class', 'page')
        this.element.textContent = 'this is PageComponent';
    }

    attachTo(parent:HTMLElement, position:InsertPosition = 'afterbegin'){
        // insertAdjacentElement(position: InsertPosition, insertedElement: Element): Element | null;
        // type InsertPosition = "beforebegin" | "afterbegin" | "beforeend" | "afterend";
        parent.insertAdjacentElement(position, this.element)
    }
}
