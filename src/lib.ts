export async function verifyPermission(fileHandle: FileSystemHandle| undefined): Promise<boolean> {
    if (fileHandle == undefined){
        console.error("fixme")
        return false
    }
    const options: FileSystemHandlePermissionDescriptor = { mode: 'readwrite' };
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
    }

    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
        return true;
    }
    return false;
}

// Helper function to write a file
export async function writeFile(fileHandle: FileSystemFileHandle, contents: FileSystemWriteChunkType) {
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
}
