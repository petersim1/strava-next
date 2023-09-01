import { StravaActivitySimpleI } from "@/types/data";

export class DB {
  storeName: string;

  version: number;

  constructor(storeName: string, version?: number) {
    this.storeName = storeName;
    this.version = version || 2;

    this.initDB();
  }

  requestDB(): IDBOpenDBRequest {
    return indexedDB.open(this.storeName, this.version);
  }

  initDB(): void {
    const request = this.requestDB();

    // onupgradeneeded won't exist if version is passed.
    request.onupgradeneeded = (e): void => {
      console.log("upgrade needed");
      const db = request.result;
      console.log(db.version, e.oldVersion);

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains("datas")) {
        const store = db.createObjectStore("datas", { keyPath: "id" });
        store.createIndex("sport", "sport_type", { unique: false });
        store.createIndex("date", "start_date_local", { unique: false });
        store.createIndex("sport_date", ["sport_type", "start_date_local"], { unique: false });
      }
    };

    request.onsuccess = (): void => {
      console.log("db success");
      const db = request.result;
      console.log(db.version);
      this.version = db.version;
    };

    request.onerror = (event): void => {
      console.log(event);
    };
  }

  addData(datas: StravaActivitySimpleI[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = this.requestDB();

      request.onsuccess = (): void => {
        const db = request.result;
        const tx = db.transaction("datas", "readwrite");
        const store = tx.objectStore("datas");

        datas.forEach((data) => {
          const d = store.put(data);
          d.onerror = (): void => {
            reject(new Error(d.error?.message));
          };
        });

        tx.oncomplete = (): void => {
          db.close();
          resolve();
        };

        tx.onerror = (): void => {
          reject(tx.error?.message);
        };
      };

      request.onerror = (): void => {
        reject(request.error?.message);
      };
    });
  }

  getDataByKey(key: string): Promise<StravaActivitySimpleI> {
    return new Promise((resolve, reject) => {
      const request = this.requestDB();

      request.onsuccess = (): void => {
        const db = request.result;
        const tx = db.transaction("datas", "readonly");
        const store = tx.objectStore("datas");

        const query = store.get(key);

        query.onsuccess = (): void => {
          if (query.result === undefined) {
            reject(new Error("no data exists"));
          }
          resolve(query.result);
        };

        query.onerror = (): void => {
          reject(new Error(query.error?.message));
        };

        tx.oncomplete = (): void => {
          db.close();
        };

        tx.onerror = (): void => {
          reject(new Error(tx.error?.message));
        };
      };

      request.onerror = (): void => {
        reject(new Error(request.error?.message));
      };
    });
  }

  getMostRecent(): Promise<number> {
    // Fetch the most recent observation.
    // will help limit GET requests to strava, and only be based on data that the client has.

    return new Promise((resolve, reject) => {
      const request = this.requestDB();
      console.log("CALLING MOST RECENT");

      request.onsuccess = (): void => {
        const db = request.result;
        const tx = db.transaction("datas", "readonly");
        const store = tx.objectStore("datas");
        const index = store.index("date");

        const query = index.openCursor(null, "prev");

        query.onsuccess = (): void => {
          const cursor = query.result;
          if (cursor) {
            resolve(cursor.value.start_date_local);
          } else {
            resolve(0);
          }
        };

        query.onerror = (): void => {
          reject(new Error(query.error?.message));
        };

        tx.oncomplete = (): void => {
          db.close();
        };

        tx.onerror = (): void => {
          reject(new Error(tx.error?.message));
        };
      };

      request.onerror = (): void => {
        reject(new Error(request.error?.message));
      };
    });
  }

  getDataFilter({
    sportType,
    fromDate,
    toDate,
  }: {
    sportType: string;
    fromDate?: number;
    toDate?: number;
  }): Promise<StravaActivitySimpleI[]> {
    fromDate = fromDate ?? 0;
    const makeOpen = !!toDate;
    if (!toDate) {
      toDate = new Date().valueOf();
    } else {
      toDate = toDate + 60 * 60 * 24 * 1000;
    }

    return new Promise((resolve, reject) => {
      const request = this.requestDB();

      request.onsuccess = (): void => {
        const db = request.result;
        const tx = db.transaction("datas", "readonly");
        const store = tx.objectStore("datas");
        const index = store.index("sport_date");

        const range = IDBKeyRange.bound([sportType, fromDate], [sportType, toDate], true, makeOpen);
        const query = index.openCursor(range, "prev");

        const objList: StravaActivitySimpleI[] = [];
        query.onsuccess = (): void => {
          const cursor = query.result;
          if (cursor) {
            objList.push(cursor.value);
            cursor.continue();
          } else {
            resolve(objList);
          }
        };

        query.onerror = (): void => {
          reject(new Error(query.error?.message));
        };

        tx.oncomplete = (): void => {
          db.close();
        };

        tx.onerror = (): void => {
          reject(new Error(tx.error?.message));
        };
      };
      request.onerror = (): void => {
        reject(new Error(request.error?.message));
      };
    });
  }

  getDistinctKeys(indexName: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const request = this.requestDB();

      request.onsuccess = (): void => {
        const db = request.result;
        const tx = db.transaction("datas", "readonly");
        const store = tx.objectStore("datas");
        const index = store.index(indexName);

        // const query = index.getAll();
        const query = index.openCursor(undefined, "nextunique");

        const keys: string[] = [];
        query.onsuccess = (): void => {
          const cursor = query.result;
          if (cursor) {
            keys.push(cursor.key as string);
            cursor.continue();
          } else {
            resolve(keys);
          }
        };

        query.onerror = (): void => {
          reject(new Error(query.error?.message));
        };

        tx.oncomplete = (): void => {
          db.close();
        };

        tx.onerror = (): void => {
          reject(new Error(tx.error?.message));
        };

        // query.onsuccess = (): void => {
        //   const keys: Set<string> = new Set(
        //     query.result.map((res: StravaActivitySimpleI) => res.sportType),
        //   );
        //   resolve(Array.from(keys));
        // };
      };
      request.onerror = (): void => {
        reject(new Error(request.error?.message));
      };
    });
  }

  clearDataStore(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = this.requestDB();

      request.onsuccess = (): void => {
        const db = request.result;
        const tx = db.transaction("datas", "readwrite");
        const store = tx.objectStore("datas");
        const deleteReq = store.clear();

        deleteReq.onsuccess = (): void => {
          resolve(true);
        };
        deleteReq.onerror = (): void => {
          reject(new Error(deleteReq.error?.message));
        };
        tx.oncomplete = (): void => {
          db.close();
        };

        tx.onerror = (): void => {
          reject(new Error(tx.error?.message));
        };
      };

      request.onerror = (): void => {
        reject(new Error(request.error?.message));
      };
    });
  }
}
