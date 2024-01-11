import { type ArrowTemplate, html } from '@arrow-js/core'
import { Component } from '@ui/core/component'
import css from './navigation.module.css'
import { Router } from '@/user-interface/core/router'

export class Navigation extends Component<{}> {
    public constructor () {
        super({})
    }

    public get html (): ArrowTemplate {
        return html`
        <nav uuid="${this.uuid}" class="${css.navigation}">
            <span class="${css.title}">ArrowJS Mini Framework</span>
            <div @click="${() => Router.push('/')}">Features</div>
            <div @click="${() => Router.push('/contacts')}">Demo</div>
        </nav>
        `
    }
}
