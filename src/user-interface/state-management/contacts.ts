import { type ReactiveProxy, reactive } from '@arrow-js/core'
import { nanoid } from 'nanoid'

export interface Contact {
    id: string
    name: string
    age: number
    country: string
}

export interface ContactStoreState {
    contacts: Contact[]
    messages: string[]
}

export class ContactStore {
    private static readonly initialState = {
        contacts: [
            { id: '1', name: 'Tony Autrey', age: 38, country: 'USA' },
            { id: '2', name: 'Siddharth Singh', age: 22, country: 'India' },
            { id: '3', name: 'Marcel Alves', age: 41, country: 'Brazil' }
        ],
        messages: []
    }

    private static readonly state: ContactStoreState = reactive(this.initialState)

    public static get readonlyState (): ReactiveProxy<Readonly<ContactStoreState>> {
        return this.state as ReactiveProxy<Readonly<ContactStoreState>>
    }

    public static addMessage (message: string): void {
        this.state.messages.push(message)
    }

    public static setContactCountry (id: string, country: string): void {
        const contactToUpdate = this.state.contacts.find(c => c.id === id)
        if (contactToUpdate) contactToUpdate.country = country
    }

    public static setContactName (id: string, name: string): void {
        const contactToUpdate = this.state.contacts.find(c => c.id === id)
        if (contactToUpdate) contactToUpdate.name = name
    }

    public static setContactAge (id: string, age: number): void {
        const contactToUpdate = this.state.contacts.find(c => c.id === id)
        if (contactToUpdate) contactToUpdate.age = age
    }
}
