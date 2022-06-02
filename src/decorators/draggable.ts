import {Component} from "../components/component.js";
import {Draggable, Droppable, Hoverable} from "../components/common/type.js";

/**
 * Decorator 를 사용하는 이유?
 * 1. 드래그에 관련된 이벤트를 듣기 위해서 많은 이벤트 리스너를 등록하고 (dragstart, dragend, dragenter, dragleave)
 *    클래스에 정의된 함수를 각각 이벤트에 맞게 호출했다. (onDragStart, onDragEnd, onDragEnter, onDragLeave)
 *    드래그를 사용할 때마다 하나씩 등록하고 클래스 내부의 함수를 호출하는 것은 번거로운 일이다.
 * 2. 생성자에서 각각 이벤트 리스너와 콜백함수를 추가하는 것이 아니라 원하는 것을 만드는 로직만 두는 것이 좋다.
 * 3. HTML5 에서 dragOver 와 onDrop 일 때 preventDefault() 를 호출하도록 하는데 이것을 알아서 처리하도록 한다.
 */

type GConstructor<T = {}> = new (...args: any[]) => T
type DraggableClass = GConstructor<Component & Draggable>

// Base Class 를 받아와서 그 클래스의 생성자를 감싼다.
// Draggable Class 만 받을 수 있다.
export function EnableDragging<TBase extends DraggableClass>(Base: TBase) {
    return class DraggableItem extends Base {
        constructor(...args: any[]) {
            // 기존 클래스의 생성자를 그대로 호출
            super(...args)
            // 클래스의 this 의 register event listener 를 통해서 dragstart -> onDragStart 를 호출한다.
            this.registerEventListener('dragstart', (event: DragEvent) => {
                this.onDragStart(event)
            })
            this.registerEventListener('dragend', (event: DragEvent) => {
                this.onDragEnd(event)
            })
        }
    }
}

type DragHoverClass = GConstructor<Component & Hoverable>

export function EnableHovering<TBase extends DragHoverClass>(Base: TBase) {
    return class DragHoverArea extends Base {
        constructor(...args: any[]) {
            super(...args)
            this.registerEventListener('dragenter', (event: DragEvent) => {
                event.preventDefault()
                this.onDragEnter(event)
            })
            this.registerEventListener('dragleave', (event: DragEvent) => {
                event.preventDefault()
                this.onDragLeave(event)
            })
        }
    }
}

type DropTargetClass = GConstructor<Component & Droppable>

export function EnableDrop<TBase extends DropTargetClass>(Base: TBase) {
    return class DropArea extends Base {
        constructor(...args: any[]) {
            super(...args)
            this.registerEventListener('dragover', (event: DragEvent) => {
                event.preventDefault()
                this.onDragOver(event)
            })
            this.registerEventListener('drop', (event: DragEvent) => {
                event.preventDefault()
                this.onDrop(event)
            })
        }
    }
}
