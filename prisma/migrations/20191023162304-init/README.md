# Migration `20191023162304-init`

This migration has been generated by Tom Houlé at 10/23/2019, 4:23:04 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration ..20191023162304-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,28 @@
+generator photon {
+  provider = "photonjs"
+}
+
+datasource db {
+  provider = "sqlite"
+  url      = "file:dev.db"
+}
+
+model Dog {
+  id         String      @default(cuid()) @id
+  name       String      @unique
+  attributes Attribute[]
+  score      Int
+}
+
+model Attribute {
+  id                String            @default(cuid()) @id
+  attributeTemplate AttributeTemplate
+  value             String
+}
+
+model AttributeTemplate {
+  id          String   @default(cuid()) @id
+  name        String   @unique
+  description String
+  choices     String[]
+}
```

## Photon Usage

You can use a specific Photon built for this migration (20191023162304-init)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/20191023162304-init'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
