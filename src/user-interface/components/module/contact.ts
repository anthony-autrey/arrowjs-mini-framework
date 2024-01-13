import { ContactStore, type Contact as ContactData } from '@/user-interface/state-management/contacts'
import { type ArrowTemplate, html } from '@arrow-js/core'
import css from './contact.module.css'
import { Button } from '../base/button'
import { Router } from '@/user-interface/core/router'
import { WebComponent } from '@/user-interface/core/webcomponent'

interface Props { id: string }
export class Contact extends WebComponent<Props> {
    private messageInterval: NodeJS.Timeout | number = 0

    private get contact (): ContactData { return ContactStore.readonlyState.contacts.find(c => c.id === this.props.id) as ContactData }

    protected mount (): void {
        ContactStore.addMessage(`onMount() called for Contact ${this.props.id}: ${this.contact?.name}`)

        this.messageInterval = setInterval(() => {
            ContactStore.addMessage(`${this.contact?.name} component is still alive`)
        }, 2000)
    }

    protected unmount (): void {
        clearInterval(this.messageInterval)
        ContactStore.addMessage(`onUnmount() called for Contact ${this.props.id}: ${this.contact?.name}`)
    }

    public get html (): ArrowTemplate {
        return html`
        <div class="${css.contactComponent}">
            <div class="helper wide">
                💡 This section is resolved through a RouterView component, just like the contact section you clicked to get here. 
                Try editing contact data here to see state management working across several components.
            </div>
            <h3>Edit Contact ${this.props.id}</h3>
            <div>
                <div class="${css.contactDetail}">
                    Name: 
                    <input 
                        value="${() => this.contact?.name ?? ''}"
                        @input="${(e) => ContactStore.setContactName(this.props.id, e.target.value)}"
                    />
                </div>
                <div class="${css.contactDetail}">
                    Age: 
                    <input 
                        value="${() => this.contact?.age ?? ''}"
                        type="number"
                        @input="${(e) => ContactStore.setContactAge(this.props.id, e.target.value)}"
                    />
                </div>
                <div class="${css.contactDetail}">
                    Country: 
                    <input 
                        value="${() => this.contact?.country ?? ''}"
                        @input="${(e) => ContactStore.setContactCountry(this.props.id, e.target.value)}"
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
                    ${this.contact && Button(food, () => Router.push(`/contacts/${this.contact.id}${food}`))}
                    `)}
                </div>
                <div class="${css.foodRouterView}">
                    ${html`<x-routeview></x-routeview>`}
                </div>
            </div>
        </div>
    `
    }
}
