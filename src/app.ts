import {Composable, PageComponent, PageItemComponent} from "./components/page/item/page.js";
import {ImageComponent} from "./components/page/item/image.js";
import {NoteComponent} from "./components/page/item/note.js";
import {Component} from "./components/component.js";
import {InputDialog} from "./components/dialog/dialog.js";
import {MediaSectionInput} from "./components/dialog/input/media-input.js";
import {VideoComponent} from "./components/page/item/video.js";
import {TodoComponent} from "./components/page/item/todo.js";
import {TextSectionInput} from "./components/dialog/input/text-input.js";

class App {
    private readonly page : Component & Composable
    // appRoot 를 전달받아 그 안에 생성한 것처럼 dialog 안에 다양하게 추가해야 하므로 dialogRoot 를 받아준다.
    constructor(appRoot:HTMLElement, dialogRoot:HTMLElement){
        // 전달된 컴포넌트를 생성하고 그 안에 자식 컴포넌트들을 추가한다.
        // PageItemComponent -> DarkPageItemComponent 로 확장 가능하다.
        this.page = new PageComponent(PageItemComponent)
        this.page.attachTo(appRoot)

        const imageButton = document.querySelector('#new-image')! as HTMLButtonElement
        // onClick 으로 콜백함수를 등록하면 기존에 있던 것을 덮어씌우므로 addEventListener 를 사용한다.
        imageButton.addEventListener('click',()=>{
            const dialog = new InputDialog()
            const inputSection = new MediaSectionInput()
            dialog.addChild(inputSection)
            dialog.attachTo(dialogRoot)

            dialog.setOnCloseListener(()=>{
                dialog.removeFrom(document.body)
            })

            dialog.setOnSubmitListener(()=>{
                // 직접 추가하지 않고 다이얼로그에서 받아온 정보로 추가한다.
                const image = new ImageComponent(inputSection.title, inputSection.url)
                this.page.addChild(image)
                dialog.removeFrom(dialogRoot)
            })
        })

        const noteButton = document.querySelector('#new-note')! as HTMLButtonElement
        noteButton.addEventListener('click',()=>{
            const dialog = new InputDialog()
            const inputSection = new TextSectionInput()
            dialog.addChild(inputSection)
            dialog.attachTo(dialogRoot)

            dialog.setOnCloseListener(()=>{
                dialog.removeFrom(document.body)
            })

            dialog.setOnSubmitListener(()=>{
                const image = new NoteComponent(inputSection.title, inputSection.body)
                this.page.addChild(image)
                dialog.removeFrom(dialogRoot)
            })
        })

        const videoButton = document.querySelector('#new-video')! as HTMLButtonElement
        videoButton.addEventListener('click',()=>{
            const dialog = new InputDialog()
            const inputSection = new MediaSectionInput()
            dialog.addChild(inputSection)
            dialog.attachTo(dialogRoot)

            dialog.setOnCloseListener(()=>{
                dialog.removeFrom(document.body)
            })

            dialog.setOnSubmitListener(()=>{
                const image = new VideoComponent(inputSection.title, inputSection.url)
                this.page.addChild(image)
                dialog.removeFrom(dialogRoot)
            })
        })
        const todoButton = document.querySelector('#new-todo')! as HTMLButtonElement
        todoButton.addEventListener('click',()=>{
            const dialog = new InputDialog()
            const inputSection = new TextSectionInput()
            dialog.addChild(inputSection)
            dialog.attachTo(dialogRoot)

            dialog.setOnCloseListener(()=>{
                dialog.removeFrom(document.body)
            })

            dialog.setOnSubmitListener(()=>{
                const image = new TodoComponent(inputSection.title, inputSection.body)
                this.page.addChild(image)
                dialog.removeFrom(dialogRoot)
            })
        })
    }
}
// null 이 아니며 HTMLElement 이므로 type assertion 사용!
new App(document.querySelector('.document')! as HTMLElement, document.body)
