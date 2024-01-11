# ArrowJS Mini Framework Features

- Typed Class Components with Lifecycle Hooks
- Nested Routing
- State Management

## Typed Class Components ✅

A component looks something like this:

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
          return html`
            //⚠️uuid attribute must be set for lifecycle hooks to run
            <div uuid="${this.uuid}">
                ${() => this.state.favoriteFood}
            </div>`
        }
    }

Then use it in your app like this: 

    const myComponent = new MyComponent();
    html`myComponent.html`


### Lifecycle Hooks and Component Properties
You can add the below functions to your component, and they will be automatically called on their triggering events:

- **onMount**() is called when the component's element is first detected in the DOM
- **onUnmount**() is called when the component's element is removed from the DOM, but only after onMount() has been called.
- **onDomMutation**() is called any time the DOM is updated.

From within a component, access the following properties
- **element**: the Component's element in the DOM
- **uuid**: the component's auto-generated universally unique ID
- **state**: the component's internal state


## Nested Routing ✅

Simple routing scheme that takes a router configuration and matches routes to RouterView components in your app.

    const router = new Router([
        {   path: '/', 
            element: html`
                <div>I'm Home</div>
                <div>new RouterView().html</div>
            `
        },
        {
            path: '/animals',
            element: new Animals().html,
            children: [
                { path: '/horse', element: html`🐎`},
                { path: '/turtle', element: html`🐢`},
                { path: '/elephant', element: html`🐘`},
            ]
        }
    ])

Just set up your routes by initializing a Router and putting RouterView components in your app. These routes will be resolved to the RouterViews and will show the correct elements based on the browser path.

You can nest these routes as deeply as you need!

## State Management ✅
Components (and any other code) can share state through a pattern of Static classes that have a private state, made reactive by arrowjs. 

Simply import a class and watch for changes across your application.