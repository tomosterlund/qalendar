export const mountComponent = (mount: Function, component: any) => (options: object|unknown) => mount(component, options)

export const dataRefFrom = (dataRefText) => `[data-ref="${dataRefText}"]`
