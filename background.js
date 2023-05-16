import { verifyPermission } from './lib.js';
import * as idb from './idb-keyval.js'

chrome.runtime.onInstalled.addListener(async () => {
    const handle = await idb.get("directory")
    const ok = await verifyPermission(handle);
    chrome.action.setBadgeText({
        text: ok ? 'on' : 'off',
    });
});

const extensions = 'https://developer.chrome.com/docs/extensions'
const webstore = 'https://developer.chrome.com/docs/webstore'

chrome.action.onClicked.addListener(async (tab) => {
    console.log("clicked")
    // Load file handles
    const handle = await idb.get("directory")
    const ok = (await handle.queryPermission({mode: 'readwrite'})) === 'granted'
    // console.log(handle)
    chrome.action.setBadgeText({ text: ok ? 'on' : 'off' });
    // Save mhtml
    let x = ''
    
    if (ok && tab.url.startsWith("https://")) {
        console.log("ok")
        let path = tab.url
        path = path.replace("https://", "")
        path = path.replace("http://", "")
        path = path.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        path = `${path}.mhtml`
        console.log(path)
        await save(tab, handle, path)
        console.log(ok)
        for await (const entry of handle.values()) {
            console.log(entry.kind, entry.name);
        }
    }
});

chrome.runtime.onMessage.addListener((e) => {
    let ok = e.message == 'permissions-ok'
    console.log(ok, e)
    chrome.action.setBadgeText({
        text: ok ? 'on' : 'off',
    });
})

async function save(tab, dirHandle, path) {
    let fileHandle
    try {
        fileHandle = await dirHandle.getFileHandle(path, { create: true });
    }catch (err) {
        console.log(err)
        return
    }
    let ok = verifyPermission(fileHandle)
    if (ok) {   
        console.log("mhtml permissions ok")
        chrome.pageCapture.saveAsMHTML({tabId: tab.id}, async (data) => {
            await writeFile(fileHandle, data)
        })
        console.log("saved")
    } else {
        console.log("bad permission")
    }
}

async function writeFile(fileHandle, contents) {
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
}