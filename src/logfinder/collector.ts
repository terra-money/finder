import { LogFinderResult } from "./types";

export const collector = (result: LogFinderResult[]) => {
  const returnArray: LogFinderResult[] = [];
  result.forEach(value => {
    if (value.transformed) {
      const action = value.transformed.msgType.split("/")[1];

      if (!["transfer", "send"].includes(action)) {
        returnArray.push(value);
      }
    }
  });

  return returnArray.length > 0 ? returnArray : result;
};
