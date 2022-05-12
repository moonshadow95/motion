import { PageComponent, PageItemComponent } from "./components/page/page.js";
import { ImageComponent } from "./components/page/item/image.js";
import { VideoComponent } from "./components/page/item/video.js";
import { TodoComponent } from "./components/page/item/todo.js";
import { NoteComponent } from "./components/page/item/note.js";
import { InputDialog } from "./components/dialog/dialog.js";
import { MediaInput } from "./components/dialog/input/media-input.js";
import { TextInput } from "./components/dialog/input/text-input.js";
class App {
    constructor(appRoot, dialogRoot) {
        this.dialogRoot = dialogRoot;
        this.page = new PageComponent(PageItemComponent);
        this.page.attachTo(appRoot);
        this.bindElementToDialog('#new-image', MediaInput, (input) => new ImageComponent(input.title, input.url));
        this.bindElementToDialog('#new-video', MediaInput, (input) => new VideoComponent(input.title, input.url));
        this.bindElementToDialog('#new-note', TextInput, (input) => new NoteComponent(input.title, input.body));
        this.bindElementToDialog('#new-todo', TextInput, (input) => new TodoComponent(input.title, input.body));
        this.page.addChild(new ImageComponent('IMAGE', 'https://picsum.photos/200/300'));
        this.page.addChild(new VideoComponent('VIDEO', 'https://www.youtube.com/watch?v=wRjU9xsYRZQ'));
        this.page.addChild(new NoteComponent('NOTE', '노노노노노노트트트트트트트ㅡ트트'));
        this.page.addChild(new TodoComponent('TODO', '할ㄹㄹㄹㄹㄹㄹㄹㄹ일ㄹㄹㄹㄹㄹㄹㄹㄹ'));
        this.page.addChild(new ImageComponent('IMAGE', 'https://picsum.photos/200/300'));
        this.page.addChild(new VideoComponent('VIDEO', 'https://www.youtube.com/watch?v=wRjU9xsYRZQ'));
        this.page.addChild(new NoteComponent('NOTE', '노노노노노노트트트트트트트ㅡ트트'));
        this.page.addChild(new TodoComponent('TODO', '할ㄹㄹㄹㄹㄹㄹㄹㄹ일ㄹㄹㄹㄹㄹㄹㄹㄹ'));
    }
    bindElementToDialog(selector, InputComponent, makeSection) {
        const element = document.querySelector(selector);
        element.addEventListener('click', () => {
            const dialog = new InputDialog();
            const input = new InputComponent();
            dialog.addChild(input);
            dialog.attachTo(this.dialogRoot);
            dialog.setOnCloseListener(() => {
                dialog.removeFrom(this.dialogRoot);
            });
            dialog.setOnSubmitListener(() => {
                const image = makeSection(input);
                this.page.addChild(image);
                dialog.removeFrom(this.dialogRoot);
            });
        });
    }
}
new App(document.querySelector('.document'), document.body);
