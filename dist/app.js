import { PageComponent } from "./components/page/item/page.js";
import { ImageComponent } from "./components/page/item/image.js";
class App {
    constructor(appRoot) {
        this.page = new PageComponent();
        this.page.attachTo(appRoot);
        const image = new ImageComponent('Image Title', 'https://picsum.photos/600/300');
        image.attachTo(appRoot, "beforebegin");
    }
}
new App(document.querySelector('.document'));
