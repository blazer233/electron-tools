import { ipcMain } from 'electron';
import { ModuleFunction } from '@app/app';
import fg from 'fast-glob';
import fs from 'fs';
import path from 'path'
import FuzzySearch from 'fuzzy-search'

import { configStore } from '@app/stores/config';

let fileIndex: { name: string; path: string }[] = [];

const buildFileIndex = async (dir: string): Promise<void> => {
  try {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const promises = entries.map(async (entry) => {
      const fullPath = { path: path.join(dir, entry.name), name: entry.name };
      if (entry.isDirectory()) {
        await buildFileIndex(fullPath.path);
      } else {
        fileIndex.push(fullPath as never);
      }
    });
    await Promise.all(promises);
  } catch (error) {
    console.log(error)
  }
}
const searchFiles = async (query: string): Promise<any[]> => {
  const searcher = new FuzzySearch(fileIndex, ['name'], { caseSensitive: true });
  return query ? searcher.search(query) : []
}
// 获取所有非系统盘
const getNonSystemDrives = () => process.platform === 'win32' ? 'DEF'.split('').map(i => `${i}:\\`) : ['/']

const walkRoot = async (dir: string): Promise<string[]> => {
  let fileList: string[] = [];
  try {
    const files = await fs.promises.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      try {
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
          try {
            const subFiles = await walkRoot(filePath);
            fileList = fileList.concat(subFiles);
          } catch (error) {
            console.error(`Error reading isDirectory or directory "${filePath}":`, error);
          }
        } else {
          fileList.push(filePath);
        }
      } catch (error) {
        console.error(`Error reading file or directory "${filePath}":`, error);
      }
    }
  } catch (error) {
    console.error(`Error reading directory "${dir}":`, error);
  }
  return fileList;
}
const searchFilesModule: ModuleFunction = () => {

  // 获取文件名
  ipcMain.handle('getFilesName', async (_, action) => {
    fileIndex = []
    // const patterns = getNonSystemDrives().map(drive => `${drive}/**/*.*`);
    // const allFiles = await fg(patterns, { dot: true });
    // console.log(allFiles.length, '=====')
    await buildFileIndex(configStore.store.downloadaddress)
    return searchFiles(action)
  });
};

export default searchFilesModule;
