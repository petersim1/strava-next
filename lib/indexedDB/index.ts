import { StravaActivitySimpleI } from "@/types/data";

export class DB {
  storeName: string;

  version: number;

  constructor(storeName: string) {
    this.storeName = storeName;
    this.version = 1;

    this.initDB();
  }

  initDB(): void {
    const request = indexedDB.open(this.storeName);

    request.onupgradeneeded = (): void => {
      const db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains("datas")) {
        console.log("Creating users store");
        const store = db.createObjectStore("datas", { keyPath: "id" });
        store.createIndex("sport", ["sportType"], { unique: false });
        store.createIndex("date", ["startDate"], { unique: false });
      }
      // no need to resolve here
    };

    request.onsuccess = (): void => {
      const db = request.result;
      this.version = db.version;
      console.log("request.onsuccess - initDB", this.version);
    };

    request.onerror = (event): void => {
      console.log("error creating db");
      console.log(event);
    };
  }

  addData(datas: StravaActivitySimpleI[]): void {
    const request = indexedDB.open(this.storeName, this.version);

    request.onsuccess = (): void => {
      console.log("request.onsuccess - addData");
      const db = request.result;
      const tx = db.transaction("datas", "readwrite");
      const store = tx.objectStore("datas");

      datas.forEach((data) => {
        store.put(data);
      });

      tx.oncomplete = (): void => {
        db.close();
      };
    };

    request.onerror = (): void => {
      const error = request.error?.message;
      console.log(error);
    };
  }

  getDataByKey(key: string): Promise<StravaActivitySimpleI> {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.storeName);

      request.onsuccess = (): void => {
        console.log("request.onsuccess - getDataByKey");
        const db = request.result;
        const tx = db.transaction("datas", "readonly");
        const store = tx.objectStore("datas");

        const query = store.get(key);

        query.onsuccess = (): void => {
          resolve(query.result);
        };

        tx.oncomplete = (): void => {
          db.close();
        };
      };
    });
  }

  getDataByIndex(): Promise<StravaActivitySimpleI[]> {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.storeName);

      request.onsuccess = (): void => {
        console.log("request.onsuccess - getDataByIndex");
        const db = request.result;
        const tx = db.transaction("datas", "readonly");
        const store = tx.objectStore("datas");
        const sportIndex = store.index("sport");

        const query = sportIndex.getAll(["Ride"]);

        query.onsuccess = (): void => {
          resolve(query.result);
        };

        tx.oncomplete = (): void => {
          db.close();
        };
      };
    });
  }

  deleteData(key: string): void {
    const request = indexedDB.open(this.storeName, this.version);

    request.onsuccess = (): void => {
      console.log("request.onsuccess - deleteData", key);
      const db = request.result;
      const tx = db.transaction("datas", "readwrite");
      const store = tx.objectStore("datas");
      const res = store.delete(key);

      // add listeners that will resolve the Promise
      res.onsuccess = (): void => {
        console.log("deleted data");
      };
      res.onerror = (): void => {
        console.log("couldn't delete data");
      };
    };
  }
}
