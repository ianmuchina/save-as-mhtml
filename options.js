import { get, set } from './idb-keyval.js'

// Directory handle
btn.addEventListener('click', async () => {
    try {
        const directoryHandleOrUndefined = await get('directory');
        if (directoryHandleOrUndefined) {
            pre2.textContent = `Retrieved directroy handle "${directoryHandleOrUndefined.name}" from IndexedDB.`;
            return;
        }
        const directoryHandle = await window.showDirectoryPicker();
        await set('directory', directoryHandle);
        pre2.textContent = `Stored directory handle for "${directoryHandle.name}" in IndexedDB.`;
    } catch (error) {
        alert(error.name, error.message);
    }
});

btn2.addEventListener('click', reload)
async function reload() {
    const dirHandle = await get('directory')
    const ok = await verifyPermission(dirHandle)
    console.log(dirHandle)
    console.log(await verifyPermission(dirHandle))

    if (ok) {
        for await (const entry of dirHandle.values()) {
            console.log(entry.kind, entry.name);
        }
    }
}

async function verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
        options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
    }

    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
        return true;
    }
    // The user didn't grant permission, so return false.
    return false;
}