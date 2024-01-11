import { type Route, Router, RouteView } from '@/user-interface/core/router'
import { html } from '@arrow-js/core'
import { Navigation } from '@/user-interface/components/module/navigation'
import { Home } from '@/user-interface/components/page/home'
import { Contacts } from '@/user-interface/components/page/contacts'
import { Contact } from '@/user-interface/components/module/contact'
import { ContactStore } from '@/user-interface/state-management/contacts'

const root = document.body

const contactPaths: Route[] = [
    { path: '/', element: html`🍽️` },
    { path: '/tacos', element: html`🌮` },
    { path: '/pizza', element: html`🍕` },
    { path: '/ice-cream', element: html`🍨` }
]

const router = new Router([
    { path: '/', element: Home() },
    {
        path: '/contacts',
        element: Contacts(),
        children: [
            { path: '/1', element: new Contact('1').html, children: contactPaths },
            { path: '/2', element: new Contact('2').html, children: contactPaths },
            { path: '/3', element: new Contact('3').html, children: contactPaths }
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
            ${new Navigation().html}
            <br/>
            ${new RouteView().html}
        </div>
        <div class="data-watcher">
            <textarea disabled value="${() => getJsonData()}">
            </textarea>
        </div>
    </div>
`(root)
