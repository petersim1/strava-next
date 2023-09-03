import { StravaActivitySimpleI } from "@/types/data";

export class DB {
  storeName: string;

  version: number;

  constructor(storeName: string, version?: number) {
    this.storeName = storeName;
    this.version = version || 3;

    this.initDB();
  }

  requestDB(): IDBOpenDBRequest {
    return indexedDB.open(this.storeName, this.version);
  }

  initDB(): void {
    const request = this.requestDB();

    // onupgradeneeded will trigger only for new version, or if DB didn't exist.
    request.onupgradeneeded = (): void => {
      console.log("onupgradeneeded triggered");
      const db = request.result;

      if (db.objectStoreNames.contains("activities")) {
        // to be safe, I'll just delete the object store upon upgrade.
        db.deleteObjectStore("activities");
      }
      const store = db.createObjectStore("activities", { keyPath: "id" });
      store.createIndex("sport", "sport_type", { unique: false });
      store.createIndex("date", "start_date", { unique: false });
      store.createIndex("sport_date", ["sport_type", "start_date"], { unique: false });
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
        const tx = db.transaction("activities", "readwrite");
        const store = tx.objectStore("activities");

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

  getMostRecent(): Promise<number> {
    // Fetch the most recent observation.
    // will help limit GET requests to strava, and only be based on data that the client has.

    return new Promise((resolve, reject) => {
      const request = this.requestDB();

      request.onsuccess = (): void => {
        const db = request.result;
        const tx = db.transaction("activities", "readonly");
        const store = tx.objectStore("activities");
        const index = store.index("date");

        const query = index.openCursor(null, "prev");

        query.onsuccess = (): void => {
          const cursor = query.result;
          if (cursor) {
            // only care about first instance. Don't need cursor.continue().
            resolve(cursor.value.start_date);
          } else {
            // means that there isn't data yet. Don't reject it, just resolve with 0.
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
        const tx = db.transaction("activities", "readonly");
        const store = tx.objectStore("activities");
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

  clearDataStore(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = this.requestDB();

      request.onsuccess = (): void => {
        const db = request.result;
        const tx = db.transaction("activities", "readwrite");
        const store = tx.objectStore("activities");
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
