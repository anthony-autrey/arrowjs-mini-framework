import { ContactStore } from '@/user-interface/state-management/contacts'
import { type ArrowTemplate, html } from '@arrow-js/core'
import css from './contacts.module.css'
import { Router } from '@/user-interface/core/router'
import { WebComponent } from '@/user-interface/core/webcomponent'
const contactStore = ContactStore.readonlyState

export class Contacts extends WebComponent {
    protected get html (): ArrowTemplate {
        return html`
        <div class="page">
            <div>
                <div class="helper">
                    💡 Try clicking a contact to see nested routes in action.
                </div>
                <h3>Contacts</h3>
                <div class="${css.contactButtons}">
                    ${() => contactStore.contacts.map(contact => html`
                        <div class="${css.contact}" @click="${() => Router.push(`/contacts/${contact.id}`)}">
                            ${contact.name}
                        </div>
                    `)}
                </div>
                <div class="helper wide">
                    💡 Notice that when you click a contact, it causes the Contact component's lifecycle functions to put messages into the queue on the right when it gets placed into or removed from the DOM
                </div>
            </div>
            <div class="${css.selectedContact}">
                ${html`<x-routeview></x-routeview>`}
            </div>
        </div>`
    }
}
