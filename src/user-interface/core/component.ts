import { type ArrowTemplate, type ReactiveProxy, reactive } from '@arrow-js/core'
import { type DataSource } from '@ui/core/types'
import { nanoid } from 'nanoid'

export abstract class Component<T extends DataSource> {
    private readonly debugMode = process.env.DEBUG
    private started: boolean = false
    private mutationObserver: MutationObserver | null = null

    // Components have access to their reactive state through this property
    protected state: ReactiveProxy<T>
    // Components may access UUID property, which identifies its element via a uuid attribute
    protected readonly uuid: string = `${this.constructor.name}-${nanoid()}`
    // Components can get access to their own element reference through this property
    protected element: HTMLElement | null = null

    public constructor (state: T) {
        this.state = reactive(state)
        this.initialize()
    }

    // All components must implement an html property that returns an Arrow Template
    public abstract get html (): ArrowTemplate

    // onMount lifecyle function will be called when the component is first found in the DOM
    protected onMount (): void { }

    // onUnmount lifecycle function will be called when the component is not found in the DOM...
    // ... but only after being found in the DOM at least once
    protected onUnmount (): void { }

    // onDomMutation lifecycle function can be utilized in components to react to DOM mutation events
    protected onDomMutation (): void { }

    protected async initialize (): Promise<void> {
        this.watchForDomMutations()
        if (this.debugMode) this.applyDebugStyles()
    }

    // If the DEBUG environment variable is active, this function will apply an outline and background color styling...
    // ..for 1 second to help the developer visualize Components being instantiated.
    // Run "npm run debug" to automatically apply the DEBUG environment variable
    private applyDebugStyles (): void {
        if (this.element !== null) {
            const originalBgColor = this.element.style.backgroundColor
            const originalOutline = this.element.style.outline
            this.element.style.backgroundColor = '#0000ff15'
            this.element.style.outline = 'solid 1px #00000090'
            this.element.style.boxSizing = 'border-box'
            setTimeout(() => {
                if (this.element) {
                    this.element.style.backgroundColor = originalBgColor
                    this.element.style.outline = originalOutline
                }
            }, 1000)
        }
    }

    // Initializes a MutationObserver which will watch for this element to be added or removed from the DOM...
    // ...this is used to implement lifecycle hooks, start, end, and onDomMutation
    protected watchForDomMutations (): void {
        const mutationCallback = (): void => {
            const elementInDOM = document.querySelector(`[uuid="${this.uuid}"]`)
            if (!this.started && elementInDOM) {
                this.onMount()
                this.started = true
            }

            this.onDomMutation()
            this.handleElementRemoval(elementInDOM)
        }

        const config: MutationObserverInit = { childList: true, subtree: true }
        this.mutationObserver = new MutationObserver(() => mutationCallback())
        this.mutationObserver.observe(document.documentElement || document.body, config)
    }

    // If the element has run the start function and is no longer found in the DOM, run the onUnmount function
    private async handleElementRemoval (elementInDOM: Element | null): Promise<void> {
        if (!this.started) return
        if (elementInDOM == null) {
            this.onUnmount()
            this.started = false
        }
    }
}
