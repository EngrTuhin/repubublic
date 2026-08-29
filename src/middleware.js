import { proxy } from "./proxy";

export async function middleware(req) {
  return proxy(req);
}

export { config } from "./proxy";
