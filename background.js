import * as idb from './idb-keyval.js'
import { verifyPermission, writeFile } from './lib.js';

// Set Badge on install
chrome.runtime.onInstalled.addListener(async () => {
    const handle = await idb.get("directory")
    const ok = await verifyPermission(handle);
    chrome.action.setBadgeText({
        text: ok ? 'on' : 'off',
    });
    chrome.action.setBadgeBackgroundColor({color: ok ? 'green' : 'red',})
});

// TODO: Bookmark Handler
// Click Handler
chrome.action.onClicked.addListener(async (tab) => {
    console.log("clicked")
    // Load file handles
    const handle = await idb.get("directory")
    const ok = (await handle.queryPermission({mode: 'readwrite'})) === 'granted'
    // console.log(handle)
    chrome.action.setBadgeText({ text: ok ? 'on' : 'off' });
    chrome.action.setBadgeBackgroundColor({color: ok ? 'green' : 'red',})
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

// Update extension badge and indicate permissions status
chrome.runtime.onMessage.addListener((e) => {
    let ok = e.message == 'permissions-ok'
    console.log(ok, e)
    chrome.action.setBadgeText({
        text: ok ? 'on' : 'off',
    });
    chrome.action.setBadgeBackgroundColor({color: ok ? 'green' : 'red',})
})


// Save tab dom tree to file
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

