import {BaseComponent} from "../../component.js";

export class TodoComponent extends BaseComponent<HTMLInputElement> {
    constructor(title: string, todo: string) {
        super(`
            <section class="todo">
                <h2 class="todo__title page-item__title"></h2>
                <input type="checkbox" class="todo__checkbox">
                <label for="todo__checkbox" class="todo-label"></label>
            </section>
        `)

        const titleElement = this.element.querySelector('.todo__title')! as HTMLHeadingElement
        titleElement.textContent = title

        const todoElement = this.element.querySelector('.todo__checkbox')! as HTMLInputElement
        todoElement.insertAdjacentText('afterend', todo)

    }
}
