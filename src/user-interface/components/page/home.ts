import { type ArrowTemplate, html } from '@arrow-js/core'

export const Home = (): ArrowTemplate => {
    const textarea1 = `
    interface MyState {favoriteFood: 🍔 | 🍟}
    class MyComponent extends Component<MyState> {
        constructor () {
            super{favoriteFood: 🍔}
        }

        onMount () {
            console.log('I'm in the DOM')
        }

        onUnmount () {
            console.log('I've left the DOM')
        }

        get html () {
          return html\`
            //⚠️uuid attribute must be set for lifecycle hooks to run
            <div uuid="\${this.uuid}">
                \${() => this.state.favoriteFood}
            </div>\`
        }
    }`

    const textarea2 = `
    const myComponent = new MyComponent();
    html\`myComponent.html\`
    `

    const textarea3 = `
    const router = new Router([
        {   path: '/', 
            element: html\`
                <div>I'm Home</div>
                <div>\${new RouterView().html}</div>
            \`,
            children: [{ path: '/knock', element: html\`🚪\`}]
        },
        {
            path: '/animals',
            element: new Animals().html,
            children: [
                { path: '/horse', element: html\`🐎\`},
                { path: '/turtle', element: html\`🐢\`},
                { path: '/elephant', element: html\`🐘\`},
            ]
        }
    ])
    `

    return html`
    <div class="page home">
        <h2>Features</h2>
        <ul>
            <li>
                Typed Class Components with Lifecycle Hooks
            </li>
            <li>
                Nested Routing
            </li>
            <li>
                State Management
            </li>
        </ul>
        

        <h3>✅ Typed Class Components</h3>
        A component looks something like this:
        <textarea disabled class="code-block" style="height: 450px">
            ${textarea1}
        </textarea>
        Then use it in your app like this: 
        <textarea disabled class="code-block" style="height: 100px">
            ${textarea2}
        </textarea>
        
        <h4> Lifecycle Hooks and Component Properties</h4>
        You can add the below functions to your component, and they will be automatically called on their triggering events:

        <ul>
            <li>
                <b>onMount()</b> is called when the component's element is first detected in the DOM.
            </li>
            <li>
                <b>onUnmount()</b> is called when the component's element is removed from the DOM, but only after start() has been called.
            </li>
            <li>
                <b>onDomMutation()</b> is called any time the DOM is updated.
            </li>
        </ul>
    
        From within a component, access the following properties

        <ul>
            <li>
                <b>element</b> the Component's element in the DOM
            </li>
            <li>
                <b>uuid</b> the component's auto-generated universally unique ID

            </li>
            <li>
                <b>state</b> the component's internal state
            </li>
        </ul>

        <h3>✅ Nested Routing</h3>
        A simple routing scheme that takes a router configuration and matches routes to RouterView components in your app.
        <textarea disabled class="code-block" style="height: 360px">
            ${textarea3}
        </textarea>
        <p>
            Just set up your routes by initializing a Router and putting RouterView components in your app. These routes will be resolved to the RouterViews and will show the correct elements based on the browser path.
        </p>
        <p>
            You can nest these routes as deeply as you need!
        </p>

        <h3>✅ State Management</h3>
        <p>
            Components (and any other code) can share state through a pattern of Static classes that have a private state, made reactive by arrowjs.
        </p>
        <p>
            Simply import a class and watch for changes across your application.
        </p>
    </div>
    `
}
