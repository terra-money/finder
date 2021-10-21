/* eslint-disable no-undef */
import { isCoins } from "./utility";

test("isCoins", () => {
  expect(isCoins("1uluna")).toBeTruthy();
  expect(isCoins("1uluna,")).toBeTruthy();
  expect(isCoins("1uluna,1uusd")).toBeTruthy();
});
