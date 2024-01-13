import { type ArrowTemplate, html } from '@arrow-js/core'
import css from './navigation.module.css'
import { Router } from '@/user-interface/core/router'

export const Navigation = (): ArrowTemplate => {
    return html`
    <nav class="${css.navigation}">
        <span class="${css.title}">ArrowJS Mini Framework</span>
        <div @click="${() => Router.push('/')}">Features</div>
        <div @click="${() => Router.push('/contacts')}">Demo</div>
    </nav>`
}
