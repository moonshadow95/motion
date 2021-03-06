import {BaseComponent} from "../../component.js";

export class VideoComponent extends BaseComponent<HTMLIFrameElement> {
    constructor(title: string, url: string) {
        super(`
            <section class="video">
                <div class="video__player">
                    <iframe class="video__iframe"></iframe>
                </div>
                <h2 class="video__title page-item__title"></h2>
            </section>
        `)

        const iframe = this.element.querySelector('.video__iframe')! as HTMLIFrameElement
        iframe.src = this.convertToEmbeddedURL(url)

        const titleElement = this.element.querySelector('.video__title')! as HTMLHeadingElement
        titleElement.textContent = title


    }

    private convertToEmbeddedURL(url: string): string {
        const RegExp = /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtube.com\/(?:(?:watch\?v=)|(?:embed\/))([a-zA-Z0-9-]{11}))|(?:yotubue.be\/([a-zA-Z0-9-]{11})))/
        const match = url.match(RegExp)
        const videoId = match ? match[1] || match[2] : undefined
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`
        }
        return url
    }
}
