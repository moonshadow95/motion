// 제목과 url 을 인자로 받는다.
// template 태그를 생성하고 그 안에 html 태그로 이미지와 제목을 생성한다.
// 자신을 추가할 수 있는 api
import {BaseComponent} from "../../component.js";

export class ImageComponent extends BaseComponent<HTMLImageElement> {
    constructor(title: string, url: string) {
        super(`
            <section class="image">
                <div class="image__holder">
                    <img class="image__thumbnail" src="" alt="">
                </div>
                <h2 class="image__title page-item__title"></h2>
            </section>
        `)

        const imageElement = this.element.querySelector('.image__thumbnail')! as HTMLImageElement
        imageElement.src = url
        imageElement.alt = title

        const titleElement = this.element.querySelector('.image__title')! as HTMLHeadingElement
        titleElement.textContent = title
    }
}
