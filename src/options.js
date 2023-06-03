import * as idbKeyvalJs from './idb-keyval.js'
import { verifyPermission } from './lib.js';

// Directory handle
btn1.addEventListener('click', async () => {
    try {
        const directoryHandleOrUndefined = await idbKeyvalJs.get('directory');
        console.log(directoryHandleOrUndefined)
        if (directoryHandleOrUndefined) {
            pre2.textContent = `Retrieved directroy handle "${directoryHandleOrUndefined.name}" from IndexedDB.`;
            return;
        }
        console.log("b")
        const directoryHandle = await window.showDirectoryPicker();
        console.log("v2")
        await idbKeyvalJs.set('directory', directoryHandle);
        console.log("c")
        pre2.textContent = `Stored directory handle for "${directoryHandle.name}" in IndexedDB.`;
    } catch (error) {
        console.log(error.name, error.message);
    }
});

btn2.addEventListener('click', reload)
async function reload() {
    const dirHandle = await idbKeyvalJs.get('directory')
    const ok = await verifyPermission(dirHandle)
    console.log(dirHandle)
    console.log(await verifyPermission(dirHandle))
    pre3.innerText = "Permissions granted. Don't close this tab"
    if (ok) {
        chrome.runtime.sendMessage({message: "permissions-ok", id: "foo"})
        // for await (const entry of dirHandle.values()) {
            // console.log(entry.kind, entry.name);
        // }
        btn2.disabled = true;
    }
    chrome.action.setBadgeText({
        text: ok? 'on': 'off' ,
    });
}

