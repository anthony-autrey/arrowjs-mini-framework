import { ContactStore } from '@/user-interface/state-management/contacts'
import { type ArrowTemplate, html } from '@arrow-js/core'
import css from './contact.module.css'
import { Button } from '../base/button'
import { Router, RouteView } from '@/user-interface/core/router'
import { Component } from '@/user-interface/core/component'

export class Contact extends Component<{}> {
    private readonly contactId: string
    private messageInterval: NodeJS.Timeout | number = 0

    public constructor (contactId: string) {
        super({})
        this.contactId = contactId
    }

    protected onMount (): void {
        const contact = ContactStore.readonlyState.contacts.find(c => c.id === this.contactId)
        ContactStore.addMessage(`onMount() called for Contact ${this.contactId}: ${contact?.name}`)

        this.messageInterval = setInterval(() => {
            ContactStore.addMessage(`${contact?.name} component is still alive`)
        }, 2000)
    }

    protected onUnmount (): void {
        clearInterval(this.messageInterval)
        const contact = ContactStore.readonlyState.contacts.find(c => c.id === this.contactId)
        ContactStore.addMessage(`onUnmount() called for Contact ${this.contactId}: ${contact?.name}`)
    }

    public get html (): ArrowTemplate {
        const contact = ContactStore.readonlyState.contacts.find(c => c.id === this.contactId)

        return html`
        <div uuid=${this.uuid} class="${css.contactComponent}">
            <div class="helper wide">
                💡 This section is resolved through a RouterView component, just like the contact section you clicked to get here. 
                Try editing contact data here to see state management working across several components.
            </div>
            <h3>Edit Contact ${this.contactId}</h3>
            <div>
                <div class="${css.contactDetail}">
                    Name: 
                    <input 
                        value="${() => contact?.name ?? ''}"
                        @input="${(e) => ContactStore.setContactName(this.contactId, e.target.value)}"
                    />
                </div>
                <div class="${css.contactDetail}">
                    Age: 
                    <input 
                        value="${() => contact?.age ?? ''}"
                        type="number"
                        @input="${(e) => ContactStore.setContactAge(this.contactId, e.target.value)}"
                    />
                </div>
                <div class="${css.contactDetail}">
                    Country: 
                    <input 
                        value="${() => contact?.country ?? ''}"
                        @input="${(e) => ContactStore.setContactCountry(this.contactId, e.target.value)}"
                    />
                </div>
            </div>
            <div>
                <br/>
                <div class="helper wide">
                    💡 Click one of the foods to see even further route nesting. That's three levels now.
                </div>
                <div style="margin-top: 1em; margin-bottom: 1em">
                    ${['/tacos', '/pizza', '/ice-cream'].map(food => html`
                    ${Button(food, () => Router.push(`/contacts/${contact.id}${food}`))}
                    `)}
                </div>
                <div class="${css.foodRouterView}">
                    ${new RouteView().html}
                </div>
            </div>
        </div>
    `
    }
}
