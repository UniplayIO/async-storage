import type { AsyncStorage } from "@uniplay-io/async-storage";
import { type TestRunner, useTests } from "../useTests";

export function usePerformanceTest(storage: AsyncStorage): TestRunner {
  const tests = useTests();

  const testSavingBigData = async () => {
    try {
      tests.clear();
      const key = "big-data";
      const data = JSON.stringify(new Array(500_000).fill("a"));
      tests.info(`Saving ${key} with data size ${data.length}`);
      const timeNow = +Date.now();
      await storage.setItem(key, data);
      tests.info(`saving took ${+Date.now() - timeNow}ms`);

      tests.info(`reading ${key}`);
      const res = await storage.getItem(key);
      tests.assert(res?.length, data.length, "restored data is same size");
    } catch (e) {
      tests.report(e);
    }
  };

  const testLargeNumberOfKeys = async () => {
    try {
      tests.clear();
      await storage.clear();

      const entries: Record<string, string> = {};
      for (let i = 0; i < 1000; i++) {
        entries[`key-${i}`] = `value-${i}`;
      }

      tests.info("Saving 1000 keys at once");
      const timeNow = +Date.now();
      await storage.setMany(entries);
      tests.info(`saving took ${+Date.now() - timeNow}ms`);

      const keys = await storage.getAllKeys();
      tests.assert(
        Object.keys(entries).sort(),
        keys.sort(),
        "All keys are stored"
      );

      const fetched = await storage.getMany(Object.keys(entries));
      tests.assert(entries, fetched, "All values match");
    } catch (e) {
      tests.report(e);
    }
  };

  return {
    logs: tests.logs,
    clearLogs: tests.clear,
    tests: [
      {
        name: "Big data set",
        run: testSavingBigData,
      },
      {
        name: "Large number of keys",
        run: testLargeNumberOfKeys,
      },
    ],
  };
}
