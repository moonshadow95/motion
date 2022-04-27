import {BaseComponent} from "../../component.js";

export class VideoComponent extends BaseComponent<HTMLElement>{
    constructor(title:string ,url:string){
        super(`
            <section class="video">
                <div class="video__player">
                    <iframe src="" frameborder="0" class="video__iframe" crossorigin></iframe>
                </div>
                <h3 class="video__title"></h3>
            </section>
        `)

        const iframe = this.element.querySelector('.video__iframe')! as HTMLIFrameElement
        iframe.src = url
        const titleElement = this.element.querySelector('.video__title')! as HTMLHeadingElement
        titleElement.textContent = title
    }
}
