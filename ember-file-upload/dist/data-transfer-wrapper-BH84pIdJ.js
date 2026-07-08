import { a as _defineProperty } from './rate-b0qPHNDH.js';

// Reads dropped directories via the File and Directory Entries API
// (`webkitGetAsEntry`). This remains the only cross-browser way to
// traverse dropped folders — `DataTransferItem.getAsFileSystemHandle()`
// is Chromium-only.
// https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry

function getEntry(item) {
  return item.getAsEntry?.() ?? item.webkitGetAsEntry();
}
function isFileEntry(entry) {
  return entry.isFile;
}
function isDirectoryEntry(entry) {
  return entry.isDirectory;
}

// `fullPath` is absolute from the drop root, e.g. `/folder/sub/file.txt`
function relativePathFor(entry) {
  return entry.fullPath.replace(/^\//, '');
}
function readFile(entry) {
  return new Promise(resolve => {
    entry.file(resolve, error => {
      // A single unreadable file should not fail the whole drop
      console.warn(`ember-file-upload: could not read dropped file ${entry.fullPath}`, error);
      resolve(null);
    });
  });
}
function readAllEntries(directory) {
  const reader = directory.createReader();
  const entries = [];
  return new Promise(resolve => {
    // Chromium returns at most 100 entries per `readEntries` call, so keep
    // reading until an empty chunk signals the end of the directory.
    const readChunk = () => {
      reader.readEntries(chunk => {
        if (chunk.length > 0) {
          entries.push(...chunk);
          readChunk();
        } else {
          resolve(entries);
        }
      }, error => {
        // An unreadable directory should not fail the whole drop
        console.warn(`ember-file-upload: could not read dropped directory ${directory.fullPath}`, error);
        resolve(entries);
      });
    };
    readChunk();
  });
}
async function walkEntry(entry) {
  if (isFileEntry(entry)) {
    const file = await readFile(entry);
    return file ? [{
      file,
      relativePath: relativePathFor(entry)
    }] : [];
  }
  if (isDirectoryEntry(entry)) {
    const children = await readAllEntries(entry);
    const nested = await Promise.all(children.map(walkEntry));
    return nested.flat();
  }
  return [];
}

/**
 * Read all files from dropped `DataTransferItem`s, recursing into
 * directories.
 *
 * Must be called synchronously from the `drop` event handler — browsers
 * neuter `DataTransferItem`s once the handler yields, so entries and
 * plain files are captured before this function first awaits.
 */
function readDataTransferItems(items) {
  const captured = items.map(item => ({
    entry: getEntry(item),
    file: item.getAsFile()
  }));
  return Promise.all(captured.map(async ({
    entry,
    file
  }) => {
    if (entry && isDirectoryEntry(entry)) {
      return walkEntry(entry);
    }
    // Top-level plain file (or non-file item, which `getAsFile`
    // returns `null` for)
    return file ? [{
      file,
      relativePath: ''
    }] : [];
  })).then(nested => nested.flat());
}

const getDataSupport = {};
class DataTransferWrapper {
  constructor(event) {
    _defineProperty(this, "dataTransfer", void 0);
    _defineProperty(this, "itemDetails", void 0);
    _defineProperty(this, "source", void 0);
    this.source = event.source;
    this.dataTransfer = event.dataTransfer;
    this.itemDetails = event.itemDetails;
  }
  getData(type) {
    const dataTransfer = this.dataTransfer;
    if (!dataTransfer) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (getDataSupport[type] == null) {
      try {
        const data = dataTransfer.getData(type);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getDataSupport[type] = true;
        return data;
      } catch {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getDataSupport[type] = false;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    } else if (getDataSupport[type]) {
      return dataTransfer.getData(type);
    }
    return '';
  }
  get filesOrItems() {
    return this.files.length ? this.files : this.items;
  }

  /**
   * Read all dropped files, recursing into dropped directories.
   *
   * Must be called synchronously from the `drop` event handler — browsers
   * neuter `DataTransferItem`s once the handler yields.
   */
  getFilesWithPaths() {
    const items = Array.from(this.dataTransfer?.items ?? []);
    if (items.length) {
      return readDataTransferItems(items);
    }
    return Promise.resolve(this.files.map(file => ({
      file,
      relativePath: ''
    })));
  }
  get files() {
    return Array.from(this.dataTransfer?.files ?? []);
  }
  get items() {
    return this.itemDetails ?? Array.from(this.dataTransfer?.items ?? []);
  }
}

export { DataTransferWrapper as D, readDataTransferItems as r };
//# sourceMappingURL=data-transfer-wrapper-BH84pIdJ.js.map
