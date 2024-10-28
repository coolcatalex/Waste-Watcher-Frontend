import { writable } from "svelte/store";

const pageStore = writable({
    pagename: "Dashboard",
    title: "Main Dashboard",
    sidebar: true
})

export default pageStore
