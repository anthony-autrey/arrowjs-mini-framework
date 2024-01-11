import { type ArrowTemplate, html } from '@arrow-js/core'

export const Button = (text: string, handler: Function): ArrowTemplate => {
    return html`<button @click="${handler}">${text}</button>`
}
