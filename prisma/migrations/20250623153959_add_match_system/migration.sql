-- CreateTable
CREATE TABLE "Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "likerId" INTEGER NOT NULL,
    "likedId" INTEGER NOT NULL,
    "isMatch" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Match_likerId_fkey" FOREIGN KEY ("likerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_likedId_fkey" FOREIGN KEY ("likedId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Match_likerId_idx" ON "Match"("likerId");

-- CreateIndex
CREATE INDEX "Match_likedId_idx" ON "Match"("likedId");

-- CreateIndex
CREATE INDEX "Match_isMatch_idx" ON "Match"("isMatch");

-- CreateIndex
CREATE UNIQUE INDEX "Match_likerId_likedId_key" ON "Match"("likerId", "likedId");
