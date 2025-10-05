import { useState } from "react";
import isEqual from "lodash.isequal";
import { AsyncStorageError } from "@uniplay-io/async-storage";

type Log = { type: "info" | "ok" | "err"; messages: string[] };

export type TestRunner = {
  logs: Log[];
  clearLogs: () => void;
  tests: { name: string; run: (() => void) | (() => Promise<void>) }[];
};

type TestValue =
  | string
  | number
  | string[]
  | Record<string, string | null>
  | null
  | undefined
  | void;

export function useTests() {
  const [logs, setLogs] = useState<Log[]>([]);

  function addLog(message: string | string[]) {
    setLogs((l) => [
      ...l,
      { type: "info", messages: Array.isArray(message) ? message : [message] },
    ]);
  }

  function addErr(message: string | string[]) {
    setLogs((l) => [
      ...l,
      { type: "err", messages: Array.isArray(message) ? message : [message] },
    ]);
  }

  function addOk(message: string | string[]) {
    setLogs((l) => [
      ...l,
      { type: "ok", messages: Array.isArray(message) ? message : [message] },
    ]);
  }

  function clearLog() {
    setLogs([]);
  }

  function reportError(e: any) {
    if (e instanceof AsyncStorageError) {
      alert("AsyncStorageError" + "\n" + `type: ${e.type}` + "\n" + e.message);
    } else if (e instanceof Error) {
      alert(e.name + "\n" + e.message);
    } else {
      alert(JSON.stringify(e, null, 2));
    }
  }

  function assertEqual(
    expected: TestValue,
    actual: TestValue,
    testName: string
  ) {
    if (!isEqual(expected, actual)) {
      addErr([
        `failed: ${testName}`,
        `expected:`,
        `${JSON.stringify(expected)}`,
        `actual:`,
        `${JSON.stringify(actual)}`,
      ]);
      const error = new Error(testName);
      error.name = "assertion failed";
      throw error;
    } else {
      addOk([testName, `result: ${JSON.stringify(actual)}`]);
    }
  }

  return {
    logs,
    info: addLog,
    error: addErr,
    ok: addOk,
    assert: assertEqual,
    clear: clearLog,
    report: reportError,
  };
}
