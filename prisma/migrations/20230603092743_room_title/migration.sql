/*
  Warnings:

  - You are about to alter the column `logo_base64` on the `companies` table. The data in that column could be lost. The data in that column will be cast from `String` to `Binary`.
  - Added the required column `title` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "logo_base64" BLOB NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_companies" ("created_at", "description", "id", "logo_base64", "name", "updated_at") SELECT "created_at", "description", "id", "logo_base64", "name", "updated_at" FROM "companies";
DROP TABLE "companies";
ALTER TABLE "new_companies" RENAME TO "companies";
CREATE TABLE "new_rooms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "logo_rule" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    CONSTRAINT "rooms_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_rooms" ("capacity", "companyId", "description", "id", "logo_rule", "price") SELECT "capacity", "companyId", "description", "id", "logo_rule", "price" FROM "rooms";
DROP TABLE "rooms";
ALTER TABLE "new_rooms" RENAME TO "rooms";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
