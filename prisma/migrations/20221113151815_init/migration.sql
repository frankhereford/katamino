-- CreateTable
CREATE TABLE "colors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hexCode" TEXT NOT NULL DEFAULT '#ffffff',

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pieces" (
    "id" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,
    "shape" JSONB NOT NULL,

    CONSTRAINT "pieces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocks" (
    "id" TEXT NOT NULL,
    "last_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pieceId" TEXT NOT NULL,
    "pentaId" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "translation" JSONB NOT NULL,
    "rotation" JSONB NOT NULL,
    "reflection" BOOLEAN NOT NULL,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pentas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "columns" INTEGER NOT NULL,
    "borderWidth" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "pentas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "available_blocks" (
    "id" TEXT NOT NULL,
    "last_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pieceId" TEXT NOT NULL,
    "availablePentaId" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "translation" JSONB NOT NULL,
    "rotation" JSONB NOT NULL,
    "reflection" BOOLEAN NOT NULL,

    CONSTRAINT "available_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "available_pentas" (
    "id" TEXT NOT NULL,
    "slamName" TEXT NOT NULL,
    "rowName" TEXT NOT NULL,
    "columns" INTEGER NOT NULL,
    "borderWidth" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "available_pentas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "colors_name_key" ON "colors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pieces_colorId_key" ON "pieces"("colorId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "pieces" ADD CONSTRAINT "pieces_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "pieces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_pentaId_fkey" FOREIGN KEY ("pentaId") REFERENCES "pentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pentas" ADD CONSTRAINT "pentas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_blocks" ADD CONSTRAINT "available_blocks_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "pieces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_blocks" ADD CONSTRAINT "available_blocks_availablePentaId_fkey" FOREIGN KEY ("availablePentaId") REFERENCES "available_pentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
