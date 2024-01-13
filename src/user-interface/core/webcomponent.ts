import { type ArrowTemplate, reactive } from '@arrow-js/core'

export abstract class WebComponent<T = {}> extends HTMLElement {
    protected _props = reactive({})
    protected static watchedAttributes: string[] = []
    private static readonly definedTokens = new Set<string>()

    public constructor () {
        super()

        const attributes = Array.from(this.attributes)
        for (const attribute of attributes) {
            this._props[attribute.name] = attribute.value
        }

        this.render()
    }

    public static define (token: string, customElement: CustomElementConstructor): void {
        if (this.definedTokens.has(token)) return

        if (this.definedTokens) { customElements.define(token, customElement) }
        this.definedTokens.add(token)
    }

    protected static get observedAttributes (): string[] {
        return this.watchedAttributes
    }

    public attributeChangedCallback (name: string, oldValue: string, newValue: string): void {
        this._props[name] = newValue
    }

    public connectedCallback (): void {
        this.mount()
    }

    public disconnectedCallback (): void {
        this.unmount()
    }

    protected get props (): T {
        return this._props as T
    }

    protected mount (): void {}
    protected unmount (): void {}
    protected abstract get html (): ArrowTemplate

    private render (): void {
        this.html(this)
    }
}
