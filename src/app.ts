import {PageComponent} from "./components/page/item/page.js";
import {ImageComponent} from "./components/page/item/image.js";

class App {
    private readonly page : PageComponent
    constructor(appRoot:HTMLElement){
        this.page = new PageComponent()
        this.page.attachTo(appRoot)

        const image = new ImageComponent('Image Title','https://picsum.photos/600/300')
        image.attachTo(appRoot,"beforeend")
    }
}
// null 이 아니며 HTMLElement 이므로 type assertion 사용!
new App(document.querySelector('.document')! as HTMLElement)
