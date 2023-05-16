import * as idbKeyvalJs from './idb-keyval.js'
import { verifyPermission } from './lib.js';

// Directory handle
btn.addEventListener('click', async () => {
    try {
        const directoryHandleOrUndefined = await idbKeyvalJs.get('directory');
        if (directoryHandleOrUndefined) {
            pre2.textContent = `Retrieved directroy handle "${directoryHandleOrUndefined.name}" from IndexedDB.`;
            return;
        }
        const directoryHandle = await window.showDirectoryPicker();
        await idbKeyvalJs.set('directory', directoryHandle);
        pre2.textContent = `Stored directory handle for "${directoryHandle.name}" in IndexedDB.`;
    } catch (error) {
        alert(error.name, error.message);
    }
});

btn2.addEventListener('click', reload)
async function reload() {
    const dirHandle = await idbKeyvalJs.get('directory')
    const ok = await verifyPermission(dirHandle)
    console.log(dirHandle)
    console.log(await verifyPermission(dirHandle))
    pre3.innerText = "ok"
    if (ok) {
        chrome.runtime.sendMessage({message: "permissions-ok", id: "foo"})
        for await (const entry of dirHandle.values()) {
            console.log(entry.kind, entry.name);
        }
    }
    chrome.action.setBadgeText({
        text: ok? 'on': 'off' ,
    });
}

