import { type Route, Router, RouteView } from '@/user-interface/core/router'
import { html } from '@arrow-js/core'
import { Navigation } from '@/user-interface/components/module/navigation'
import { Home } from '@/user-interface/components/page/home'
import { Contacts } from '@/user-interface/components/page/contacts'
import { Contact } from '@/user-interface/components/module/contact'
import { ContactStore } from '@/user-interface/state-management/contacts'

Contacts.define('x-contacts', Contacts)
Contact.define('x-contact', Contact)
Home.define('x-home', Home)
RouteView.define('x-routeview', RouteView)

const root = document.body

const contactPaths: Route[] = [
    { path: '/', element: html`🍽️` },
    { path: '/tacos', element: html`🌮` },
    { path: '/pizza', element: html`🍕` },
    { path: '/ice-cream', element: html`🍨` }
]

const router = new Router([
    { path: '/', element: html`<x-home></x-home>` },
    {
        path: '/contacts',
        element: html`<x-contacts></x-contacts>`,
        children: [
            { path: '/1', element: html`<x-contact id="1"></x-contact>`, children: contactPaths },
            { path: '/2', element: html`<x-contact id="2"></x-contact>`, children: contactPaths },
            { path: '/3', element: html`<x-contact id="3"></x-contact>`, children: contactPaths }
        ]
    }
])

const getJsonData = (): string => {
    return '⚡ Watch state changes here! \n\nContacts: ' +
    JSON.stringify(ContactStore.readonlyState.contacts, null, 4) +
    `\n\n💌 Messages: ${JSON.stringify(ContactStore.readonlyState.messages, null, 4)}`
}

html`
    <div class="wrapper">
        <div class="main-application">
            ${Navigation()}
            <br/>
            ${html`<x-routeview></x-routeview>`}
        </div>
        <div class="data-watcher">
            <textarea disabled value="${() => getJsonData()}">
            </textarea>
        </div>
    </div>
`(root)
