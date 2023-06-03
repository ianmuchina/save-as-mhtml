import * as idb from 'idb-keyval'
import { verifyPermission } from './lib.js';

const btn1: HTMLButtonElement = document.querySelector('#btn1')
const btn2: HTMLButtonElement = document.querySelector('#btn2')
const msg: HTMLPreElement = document.querySelector('#msg')

btn1.addEventListener('click', async () => {
    try {
        // Prompt user to Select folder
        const dirHandle = await window.showDirectoryPicker();
        // Update indexed db
        await idb.set('directory', dirHandle);
        // Log
        msg.textContent += `\nStored directory handle for "${dirHandle.name}" in IndexedDB.`;
        // Ask permissions
        const ok = await verifyPermission(dirHandle)
        if (ok !== undefined) {
            msg.textContent += `\nPermissions granted to ${dirHandle.name}`;
        }

    } catch (error) {
        console.log(error.name, error.message);
    }
});

btn2.addEventListener('click', async () => {
    let dirHandle = await idb.get('directory');

    // Show file Picker
    if (dirHandle == undefined) {
        // TODO: Disabled if undefined
        msg.textContent = "Select A folder"
        console.log("no permissions")
        return
    }
    const ok = await verifyPermission(dirHandle);
    if (ok) {
        msg.textContent = 'Permissions OK'
        chrome.runtime.sendMessage({ message: "permissions-ok", id: "foo" });
    }
    chrome.action.setBadgeText({
        text: ok ? 'on' : 'off',
    });
})

// Confirm before closing
btn1.addEventListener('click', () => {
    window.onbeforeunload = function (e) {
        return 'Dialog text here.';
    };
})

// Set button to disabled
let handle = await idb.get('directory')

if (handle == undefined) {
    msg.textContent = 'Select A folder'
    btn2.disabled = true
} else {
    btn2.disabled = false
}