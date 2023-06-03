import * as idb from 'idb-keyval'

import { verifyPermission, writeFile } from './lib';

// Set Badge on install
chrome.runtime.onInstalled.addListener(async () => {
    chrome.action.setBadgeText({ text: 'off', });
    chrome.action.setBadgeBackgroundColor({ color: 'red' })
});

// TODO: Bookmarks page Handler
// Click Handler
chrome.action.onClicked.addListener(async (tab) => {
    console.log("clicked")
    // Load file handles
    const handle = await idb.get("directory")
    // Uninitialized handle
    if (handle == undefined) {
        // Open options page
        console.log("uninitialized")
        return
    }
    const ok = (await handle.queryPermission({ mode: 'readwrite' })) === 'granted'
    // console.log(handle)
    chrome.action.setBadgeText({ text: ok ? 'on' : 'off' });
    chrome.action.setBadgeBackgroundColor({ color: ok ? 'green' : 'red', })

    // Only save http/s links
    if (ok && tab.url.startsWith("http")) {
        console.log("ok")
        // Generate safe filename.
        let filename = `${tab.url
            .replace("https://", "")
            .replace("http://", "")
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase()}.mhtml`
        console.log(filename)
        await save(tab, handle, filename)
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
    chrome.action.setBadgeBackgroundColor({ color: ok ? 'green' : 'red', })
})


// Save tab dom tree to file
async function save(tab: chrome.tabs.Tab, dirHandle: FileSystemDirectoryHandle, path: string) {
    let fileHandle: FileSystemFileHandle
    try {
        fileHandle = await dirHandle.getFileHandle(path, { create: true });
    } catch (err) {
        console.log(err)
        return
    }
        
    // Save file
    if (verifyPermission(fileHandle)) {
        chrome.pageCapture.saveAsMHTML({ tabId: tab.id }, async (data: Blob) => {
            await writeFile(fileHandle, data)
        })
        console.log("saved")
    } else {
        console.log("bad permission")
    }
}

