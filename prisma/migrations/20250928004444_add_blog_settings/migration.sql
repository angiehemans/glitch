-- CreateTable
CREATE TABLE "public"."BlogSettings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'My Blog',
    "description" TEXT NOT NULL DEFAULT 'A personal blog with thoughts and ideas',
    "language" TEXT NOT NULL DEFAULT 'en-us',
    "managingEditor" TEXT NOT NULL DEFAULT 'Blog Admin',
    "webMaster" TEXT NOT NULL DEFAULT 'Blog Admin',
    "generator" TEXT NOT NULL DEFAULT 'Next.js Blog',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogSettings_pkey" PRIMARY KEY ("id")
);
