import {Composable, PageComponent, PageItemComponent} from "./components/page/item/page.js";
import {ImageComponent} from "./components/page/item/image.js";
import {NoteComponent} from "./components/page/item/note.js";
import {Component} from "./components/component.js";
import {InputDialog, MediaData, TextData} from "./components/dialog/dialog.js";
import {MediaSectionInput} from "./components/dialog/input/media-input.js";
import {VideoComponent} from "./components/page/item/video.js";
import {TodoComponent} from "./components/page/item/todo.js";
import {TextSectionInput} from "./components/dialog/input/text-input.js";

// InputComponentConstructor 는 MediaSectionInput 또는 TextSectionInput 클래스이다.
// 클래스를 직접 받지 않도록 인터페이스를 만들어 디커플링 시켜준다. (MediaData, TextData)
type InputComponentConstructor<T = (MediaData | TextData) & Component> = {
    new(): T
}

class App {
    private readonly page: Component & Composable

    // appRoot 를 전달받아 그 안에 생성한 것처럼 dialog 안에 다양하게 추가해야 하므로 dialogRoot 를 받아준다.
    constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
        // 전달된 컴포넌트를 생성하고 그 안에 자식 컴포넌트들을 추가한다.
        // PageItemComponent -> DarkPageItemComponent 로 확장 가능하다.
        this.page = new PageComponent(PageItemComponent)
        this.page.attachTo(appRoot)

        // 이미지 섹션 생성 다이얼로그
        this.bindElementToDialog<MediaSectionInput>(
            // selector
            '#new-image',
            // MediaSectionInput 컴포넌트
            MediaSectionInput,
            // 위 컴포넌트를 인자로 받아 생성할 ImageComponent 생성 함수
            (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
        )

        // 비디오 섹션 생성 다이얼로그
        this.bindElementToDialog<MediaSectionInput>(
            '#new-video',
            MediaSectionInput,
            (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
        )

        // 노트 섹션 생성 다이얼로그
        this.bindElementToDialog<TextSectionInput>(
            '#new-note',
            TextSectionInput,
            (input: TextSectionInput) => new NoteComponent(input.title, input.body)
        )
        // 할 일 섹션 생성 다이얼로그
        this.bindElementToDialog<TextSectionInput>(
            '#new-todo',
            TextSectionInput,
            (input: TextSectionInput) => new TodoComponent(input.title, input.body)
        )
    }

    // 중복코드 복사하여 함수로 만들기
    // 생성할 셀렉터와 생성자를 인자로 받는다.
    // 인자로 받을 생성자는 MediaInput 또는 TextInput 을 타입으로 받는 제네릭 타입이기 때문에 제네릭 함수로 만든다.
    // MediaSectionInput | TextSectionInput 만 받는다.
    // MediaSectionInput, TextSectionInput 과 커플링되어 있으므로 각 Data 인터페이스를 만들어 가져온다.
    // MediaData 혹은 TextData 인터페이스와 Component 를 동시에 따른다.
    private bindElementToDialog<T extends (MediaData | TextData) & Component>(
        selector: string,
        InputComponent: InputComponentConstructor<T>,
        // MediaSectionInput 또는 TextSectionInput 을 인자로 받아서 컴포넌트를 만드는 함수
        makeSection: (input: T) => Component
    ) {
        const element = document.querySelector(selector)! as HTMLButtonElement
        element.addEventListener('click', () => {
            const dialog = new InputDialog()
            // 인자로 받은 InputComponent 생성자를 이용하여 input 을 생성한다.
            const input = new InputComponent()
            dialog.addChild(input)
            // dialogRoot 는 App 컴포넌트의 생성자의 인자로 받았으므로 접근하기 위해 인자에 private 을 붙여주고,
            // 접근시 this.dialogRoot 로 접근한다.
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

// null 이 아니며 HTMLElement 이므로 type assertion 사용!
new App(document.querySelector('.document')! as HTMLElement, document.body)
