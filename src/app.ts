import {Composable, PageComponent, PageItemComponent} from "./components/page/page.js";
import {ImageComponent} from "./components/page/item/image.js";
import {VideoComponent} from "./components/page/item/video.js";
import {TodoComponent} from "./components/page/item/todo.js";
import {NoteComponent} from "./components/page/item/note.js";
import {Component} from "./components/component.js";
import {InputDialog, MediaData, TextData} from "./components/dialog/dialog.js";
import {MediaInput} from "./components/dialog/input/media-input.js";
import {TextInput} from "./components/dialog/input/text-input.js";

// 타입도 마찬가지로 인터페이스로 지정
type InputComponentConstructor<T = (MediaData | TextData) & Component> = {
    new(): T
}

class App {
    // 페이지 컴포넌트는 addChild() api 를 가지고 있다.
    private readonly page: Component & Composable

    constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
        // 인자로 받은 Root 에 페이지 컴포넌트를 만들어 추가한다.
        this.page = new PageComponent(PageItemComponent)
        this.page.attachTo(appRoot)

        this.bindElementToDialog(
            '#new-image',
            MediaInput,
            (input: MediaInput) => new ImageComponent(input.title, input.url)
        )
        this.bindElementToDialog(
            '#new-video',
            MediaInput,
            (input: MediaInput) => new VideoComponent(input.title, input.url)
        )
        this.bindElementToDialog(
            '#new-note',
            TextInput,
            (input: TextInput) => new NoteComponent(input.title, input.body)
        )
        this.bindElementToDialog(
            '#new-todo',
            TextInput,
            (input: TextInput) => new TodoComponent(input.title, input.body)
        )

        // For demo
        this.page.addChild(new ImageComponent('IMAGE', 'https://picsum.photos/200/300'))
        this.page.addChild(new VideoComponent('VIDEO', 'https://www.youtube.com/watch?v=wRjU9xsYRZQ'))
        this.page.addChild(new NoteComponent('NOTE', '노노노노노노트트트트트트트ㅡ트트'))
        this.page.addChild(new TodoComponent('TODO', '할ㄹㄹㄹㄹㄹㄹㄹㄹ일ㄹㄹㄹㄹㄹㄹㄹㄹ'))
        this.page.addChild(new ImageComponent('IMAGE', 'https://picsum.photos/200/300'))
        this.page.addChild(new VideoComponent('VIDEO', 'https://www.youtube.com/watch?v=wRjU9xsYRZQ'))
        this.page.addChild(new NoteComponent('NOTE', '노노노노노노트트트트트트트ㅡ트트'))
        this.page.addChild(new TodoComponent('TODO', '할ㄹㄹㄹㄹㄹㄹㄹㄹ일ㄹㄹㄹㄹㄹㄹㄹㄹ'))
    }

    // - 중복 코드를 함수로 만든다.
    // - 셀렉터를 첫번째 인자로 받는다.
    // - 다이얼로그 속 인풋 생성자를 두번째 인자로 받는다. -> 생성자 제네릭 타입을 만들어준다.
    // - dialogRoot 에 접근하기 위해 private 으로 만들어준다.
    // - 세번째 인자로 콜백 함수를 받는다.
    // - 콜백함수는 인풋을 인자로 받고, 컴포넌트를 리턴한다.
    // - 미디어 인풋, 텍스트 인풋을 직접 사용하지 않고 언터페이스로 지정한다. -> 다른 인풋을 요구할 수도 있기 때문이다.
    // - 미디어 데이타 혹은 텍스트 데이타이면서 컴포넌트를 구현한 아이를 받는다.

    private bindElementToDialog<T extends (MediaData | TextData) & Component>(
        selector: string,
        InputComponent: InputComponentConstructor<T>,
        makeSection: (input: T) => Component
    ) {
        const element = document.querySelector(selector)! as HTMLButtonElement
        element.addEventListener('click', () => {
            const dialog = new InputDialog()
            const input = new InputComponent()
            dialog.addChild(input)
            dialog.attachTo(this.dialogRoot)
            dialog.setOnCloseListener(() => {
                dialog.removeFrom(this.dialogRoot)
            })
            dialog.setOnSubmitListener(() => {
                const image = makeSection(input)
                this.page.addChild(image)
                dialog.removeFrom(this.dialogRoot)
            })
        })
    }

}

// Root 는 .document
new App(document.querySelector('.document') as HTMLElement, document.body)

