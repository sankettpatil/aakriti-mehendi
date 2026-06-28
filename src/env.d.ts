/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

type D1Database = import("@cloudflare/workers-types").D1Database;
type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

declare namespace App {
  interface Locals {
    runtime: {
      env: {
        DB: D1Database;
        SESSION: KVNamespace;
        GALLERY_BUCKET: import("@cloudflare/workers-types").R2Bucket;
      };
    };
  }
}
