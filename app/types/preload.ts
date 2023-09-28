import { Log } from '../modules/developers';
import { AppControlAction } from '../modules/general';
import { UpdateEvent, UpdateStatus } from '../modules/update';
import { ConfigStoreValues } from '../stores/config';

export interface ElectronRendererContext {
  onUpdate: (callback: (event: UpdateEvent, data: any) => void) => void;

  initlizeUpdater: () => void;
  appControl: (action: AppControlAction) => void;
  openExternal: (link: string) => void;
  openPath: (link: string) => void;
  checkForUpdate: () => void;
  quitAndInstall: () => void;

  operateVideoDownLoad: (action: any) => Promise<any>;
  operateVideoList: (action: any) => Promise<any>;
  operateVideoLoad: (callback: (data: any) => void) => void;
  operateVideoDel: () => Promise<any>;

  getFilesName: (action: any) => Promise<any>,

  getConfig: () => Promise<ConfigStoreValues>;
  setConfig: (config: ConfigStoreValues) => Promise<ConfigStoreValues>;

  getVersion: () => Promise<string>;
  getUpdaterStatus: () => Promise<UpdateStatus>;

  getStorePath: () => Promise<string>;
  getLogs: () => Promise<Log[]>;
  clearLogs: () => Promise<boolean>;
}
