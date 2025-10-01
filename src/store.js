import { writable, derived } from "svelte/store";

export const isOpenCaseModalStore = writable({
    isMounted: false,
    isView: false,
    rect: {},
    data: null,
    text: null,
});
