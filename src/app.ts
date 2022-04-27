import {PageComponent} from "./components/page/item/page.js";
import {ImageComponent} from "./components/page/item/image.js";
import {NoteComponent} from "./components/page/item/note.js";
import {TodoComponent} from "./components/page/item/todo.js";
import {VideoComponent} from "./components/page/item/video.js";

class App {
    private readonly page : PageComponent
    constructor(appRoot:HTMLElement){
        this.page = new PageComponent()
        this.page.attachTo(appRoot)

        const image = new ImageComponent('Image Title','https://picsum.photos/600/300')
        image.attachTo(appRoot,"beforeend")

        const note = new NoteComponent('Note Title', 'Note Body')
        note.attachTo(appRoot,'beforeend')

        const todo = new TodoComponent('Todo Title', 'Todo Item')
        todo.attachTo(appRoot, 'beforeend')

        const video = new VideoComponent('video title','https://youtu.be/-mvim98-TWw')
        video.attachTo(appRoot,'beforeend')
    }
}
// null 이 아니며 HTMLElement 이므로 type assertion 사용!
new App(document.querySelector('.document')! as HTMLElement)
