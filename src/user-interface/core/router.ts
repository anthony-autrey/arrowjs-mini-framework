import { type ArrowTemplate, type ReactiveProxy, reactive, html, watch } from '@arrow-js/core'
import { Component } from './component'
import { waitForClearCallstack } from '../utility'

export interface Route {
    path: string
    element: ArrowTemplate
    children?: Route[]
}

interface RouteState {
    routes: Route[]
    location: string
    routeViewClaims: Record<string, Route>
}

interface RouteViewState {
    element: ArrowTemplate | false
}

// RouteStore holds state for Router
class RouteStore {
    private static readonly initialState = {
        routes: [],
        location: window.location.pathname,
        routeViewClaims: {}
    }

    private static readonly state = reactive(this.initialState)

    public static get readonlyState (): ReactiveProxy<Readonly<RouteState>> {
        return this.state as ReactiveProxy<Readonly<RouteState>>
    }

    public static setLocation (): void {
        if (window.location.pathname !== this.state.location) {
            // Clear claims so route views can be resolved again
            this.state.routeViewClaims = {}
            this.state.location = window.location.pathname
        }
    }

    public static configureRoutes (routes: Route[]): void {
        this.state.routes = routes
    }

    public static claimRouteForRouteView (routeViewUuid: string, route: Route): void {
        this.state.routeViewClaims[routeViewUuid] = route
    }
}

// Router handles browser history changes and assigns RouteView components in the DOM heirarchy to the current path
export class Router {
    private static routeViewInitializeDebounceTimeout: NodeJS.Timeout | number = 0
    private static readonly initialized = false

    // Instantiate a Router by passing in a Route array
    public constructor (routes: Route[]) {
        if (!Router.initialized) {
            RouteStore.configureRoutes(routes)
            Router.initialize()
        }

        // When routes are configured or the location changes, begin resolving RouteViews recursively
        watch(() => [
            RouteStore.readonlyState.location,
            RouteStore.readonlyState.routes
        ], () => {
            Router.recursiveRouteViewSearch(RouteStore.readonlyState.routes, window.location.pathname, document)
        })
    }

    // Recursively search for RouteViews and match them to routes...
    // ...if a route can be resolved, set a claim for the Route and begin searching the RouteView element for more RouteViews
    public static async recursiveRouteViewSearch (routes: Route[], path: string, elementToSearch: Element): Promise<void> {
        const routerView = elementToSearch.querySelector('[type="RouteView"]')
        if (!routerView) return

        const routeViewUuid = routerView.getAttribute('uuid')
        for (const route of routes) {
            const match = Router.pathMatchesRoute(path, route)
            if (match && routeViewUuid) {
                RouteStore.claimRouteForRouteView(routeViewUuid, route)
                const nextToken = Router.getNextTokenForPath(path)
                this.recursiveRouteViewSearch(route.children ?? [], nextToken, routerView)
            }
        }
    }

    // Gets the next token for a path. Example: '/company/contacts/tony' returns '/contacts/tony'
    private static getNextTokenForPath (path: string): string {
        const tokens = path.split('/')

        if (tokens.length === 1) return ''

        const thing = tokens.filter(val => val)
        const sliced = thing.slice(1)
        const nextToken = sliced.join('/')

        return nextToken
    }

    // Checks if the path token can be resolved to the route
    private static pathMatchesRoute (path: string, route: Route): boolean {
        const pathToken = path.split('/').filter(t => t)[0] ?? '/'
        const match = route.path === pathToken || route.path === `/${pathToken}`

        return match
    }

    // Hooks the router up to the pop event
    private static initialize (): void {
        window.addEventListener('popstate', (e) => this.handlePop(e))
    }

    // Internally sets location on pop
    private static handlePop (e: Event): void {
        e.preventDefault()
        RouteStore.setLocation()
    }

    // Used to change the router's location so RouterViews can be reassigned
    public static push (route: string): void {
        history.pushState({}, '', route)
        RouteStore.setLocation()
    }

    // When this function is called, it will debounce the requests...
    // ...and after all initialize calls are finished, set all RouteView claims
    public static routeViewInitialized (): void {
        clearTimeout(this.routeViewInitializeDebounceTimeout)
        this.routeViewInitializeDebounceTimeout = setTimeout(() => {
            Router.recursiveRouteViewSearch(RouteStore.readonlyState.routes, window.location.pathname, document)
        })
    }
}

// RouteView is used to expose HTML via browser urls, resolved by the Router
export class RouteView extends Component<RouteViewState> {
    private static readonly defaultOutlet: ArrowTemplate | false = false

    public constructor () {
        super({ element: RouteView.defaultOutlet })
    }

    protected onMount (): void {
        // Let the router know this RouteView is initializing, so it can begin resolving route claims...
        // ...this is debounced so resolution only occurs after all RouteViews have initialized
        Router.routeViewInitialized()
    }

    public get html (): ArrowTemplate {
        // If the RouteView claims have changed, either update their internal templates or reset them to default
        watch(() => RouteStore.readonlyState.routeViewClaims, async (routeViewClaims) => {
            // If this RouteView has been resolved to a route, set to that route's element
            const claimForThisUuid = routeViewClaims[this.uuid]
            if (claimForThisUuid) this.state.element = claimForThisUuid.element

            // After the current call stack is done re-resolving claims,
            // if there is no claim for this RouteView, clear its element
            await waitForClearCallstack()
            if (!claimForThisUuid) { this.state.element = false }
        })

        return html`
            <div uuid="${this.uuid}" type="RouteView">
                ${() => this.state.element}
            </div>
        `
    }
}
