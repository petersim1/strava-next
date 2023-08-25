import { StravaActivitySimpleI } from "@/types/data";

export class DB {
  storeName: string;

  version: number;

  constructor(storeName: string, version?: number) {
    this.storeName = storeName;
    this.version = version || 1;

    this.initDB();
  }

  initDB(): void {
    const request = indexedDB.open(this.storeName);

    // onupgradeneeded won't exist if version is passed.
    request.onupgradeneeded = (): void => {
      const db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains("datas")) {
        console.log("Creating users store");
        const store = db.createObjectStore("datas", { keyPath: "id" });
        store.createIndex("sport", "sportType", { unique: false });
        store.createIndex("date", "startDate", { unique: false });
      }
    };

    request.onsuccess = (): void => {
      const db = request.result;
      this.version = db.version;
    };

    request.onerror = (event): void => {
      console.log(event);
    };
  }

  requestDB(): IDBRequest {
    return indexedDB.open(this.storeName, this.version);
  }

  addData(datas: StravaActivitySimpleI[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = this.requestDB();

      request.onsuccess = (): void => {
        const db = request.result;
        const tx = db.transaction("datas", "readwrite");
        const store = tx.objectStore("datas");

        datas.forEach((data) => {
          const d = store.put(data);
          d.onerror = (): void => {
            reject(new Error(d.error.message));
          };
        });

        tx.oncomplete = (): void => {
          db.close();
          resolve(true);
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

  getDataByDate(): Promise<StravaActivitySimpleI[]> {
    return new Promise((resolve, reject) => {
      const request = this.requestDB();

      request.onsuccess = (): void => {
        const db = request.result;
        const tx = db.transaction("datas", "readonly");
        const store = tx.objectStore("datas");
        const index = store.index("date");

        const range = IDBKeyRange.bound(
          new Date("june 1 2023").valueOf(),
          new Date("june 2 2023").valueOf(),
        );
        const query = index.openCursor(range, "next");

        const objList: StravaActivitySimpleI[] = [];
        query.onsuccess = (): void => {
          const cursor = query.result;
          if (cursor) {
            console.log(cursor.value);
            objList.push(cursor.value);
            cursor.continue();
          } else {
            resolve(objList);
          }
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

  getDataByIndex(): Promise<StravaActivitySimpleI[]> {
    return new Promise((resolve, reject) => {
      const request = this.requestDB();

      request.onsuccess = (): void => {
        const db = request.result;
        const tx = db.transaction("datas", "readonly");
        const store = tx.objectStore("datas");
        const index = store.index("sport");

        const query = index.getAll(["Ride"]);

        query.onsuccess = (): void => {
          resolve(query.result);
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

  deleteData(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = this.requestDB();

      request.onsuccess = (): void => {
        const db = request.result;
        const tx = db.transaction("datas", "readwrite");
        const store = tx.objectStore("datas");
        const res = store.delete(key);

        res.onsuccess = (): void => {
          resolve(true);
        };
        res.onerror = (): void => {
          reject(new Error(res.error?.message));
        };
      };

      request.onerror = (): void => {
        reject(new Error(request.error?.message));
      };
    });
  }
}
