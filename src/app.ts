import {Composable, PageComponent, PageItemComponent} from "./components/page/item/page.js";
import {ImageComponent} from "./components/page/item/image.js";
import {NoteComponent} from "./components/page/item/note.js";
import {TodoComponent} from "./components/page/item/todo.js";
import {VideoComponent} from "./components/page/item/video.js";
import {Component} from "./components/component.js";
import {InputDialog} from "./components/dialog/dialog.js";

class App {
    private readonly page : Component & Composable
    constructor(appRoot:HTMLElement){
        // 전달된 컴포넌트를 생성하고 그 안에 자식 컴포넌트들을 추가한다.
        // PageItemComponent -> DarkPageItemComponent 로 확장 가능하다.
        this.page = new PageComponent(PageItemComponent)
        this.page.attachTo(appRoot)

        const image = new ImageComponent('Image Title','https://picsum.photos/600/300')
        this.page.addChild(image)

        const note = new NoteComponent('Note Title', 'Note Body')
        this.page.addChild(note)

        const todo = new TodoComponent('Todo Title', 'Todo Item')
        this.page.addChild(todo)

        const video = new VideoComponent('video title','https://youtu.be/-mvim98-TWw')
        this.page.addChild(video)

        const imageButton = document.querySelector('#new-image')! as HTMLButtonElement
        // onClick 으로 콜백함수를 등록하면 기존에 있던 것을 덮어씌우므로 addEventListener 를 사용한다.
        imageButton.addEventListener('click',()=>{
            const dialog = new InputDialog()
            dialog.setOnCloseListener(()=>{
                dialog.removeFrom(document.body)
            })
            dialog.setOnSubmitListener(()=>{
                // todo - 섹션을 만들어서 페이지에 추가
                dialog.removeFrom(document.body)
            })
            dialog.attachTo(document.body)
        })
    }
}
// null 이 아니며 HTMLElement 이므로 type assertion 사용!
new App(document.querySelector('.document')! as HTMLElement)
