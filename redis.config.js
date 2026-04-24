import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: "https://worthy-albacore-105614.upstash.io",
  token: "gQAAAAAAAZyOAAIgcDIxYmUzMWU3NmRiNjM0MDZlYTZmY2EwMjZhZWUzZGYzZA",
});

export default redis;
