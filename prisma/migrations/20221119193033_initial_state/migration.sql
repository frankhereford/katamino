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
    "shape" JSONB NOT NULL DEFAULT '[[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]]',

    CONSTRAINT "pieces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moves" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pentaId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "moveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incomingTransformationId" TEXT NOT NULL,
    "outgoingTransformationId" TEXT NOT NULL,

    CONSTRAINT "moves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocks" (
    "id" TEXT NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pieceId" TEXT NOT NULL,
    "pentaId" TEXT NOT NULL,
    "transformationId" TEXT NOT NULL,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transformations" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockId" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "reflection" BOOLEAN NOT NULL DEFAULT false,
    "rotation" INTEGER NOT NULL DEFAULT 0,
    "translationUp" INTEGER NOT NULL DEFAULT 0,
    "translationRight" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "transformations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pentas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "availablePentaId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "moveCount" INTEGER NOT NULL DEFAULT 0,
    "columns" INTEGER NOT NULL DEFAULT 5,
    "borderWidth" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "pentas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "available_blocks" (
    "id" TEXT NOT NULL,
    "last_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pieceId" TEXT NOT NULL,
    "availablePentaId" TEXT NOT NULL,
    "availableTransformationId" TEXT NOT NULL,

    CONSTRAINT "available_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "available_transformations" (
    "id" TEXT NOT NULL,
    "availableBlockId" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "reflection" BOOLEAN NOT NULL DEFAULT false,
    "rotation" INTEGER NOT NULL DEFAULT 0,
    "translationUp" INTEGER NOT NULL DEFAULT 0,
    "translationRight" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "available_transformations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "available_pentas" (
    "id" TEXT NOT NULL,
    "slamId" TEXT NOT NULL,
    "rowName" TEXT NOT NULL DEFAULT 'A',
    "columns" INTEGER NOT NULL DEFAULT 5,
    "borderWidth" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "available_pentas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Slam',
    "slamOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "slams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
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

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "colors_name_key" ON "colors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pieces_colorId_key" ON "pieces"("colorId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "pieces" ADD CONSTRAINT "pieces_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moves" ADD CONSTRAINT "moves_pentaId_fkey" FOREIGN KEY ("pentaId") REFERENCES "pentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moves" ADD CONSTRAINT "moves_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moves" ADD CONSTRAINT "moves_incomingTransformationId_fkey" FOREIGN KEY ("incomingTransformationId") REFERENCES "transformations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moves" ADD CONSTRAINT "moves_outgoingTransformationId_fkey" FOREIGN KEY ("outgoingTransformationId") REFERENCES "transformations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "pieces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_pentaId_fkey" FOREIGN KEY ("pentaId") REFERENCES "pentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_transformationId_fkey" FOREIGN KEY ("transformationId") REFERENCES "transformations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transformations" ADD CONSTRAINT "transformations_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pentas" ADD CONSTRAINT "pentas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pentas" ADD CONSTRAINT "pentas_availablePentaId_fkey" FOREIGN KEY ("availablePentaId") REFERENCES "available_pentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_blocks" ADD CONSTRAINT "available_blocks_availableTransformationId_fkey" FOREIGN KEY ("availableTransformationId") REFERENCES "available_transformations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_blocks" ADD CONSTRAINT "available_blocks_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "pieces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_blocks" ADD CONSTRAINT "available_blocks_availablePentaId_fkey" FOREIGN KEY ("availablePentaId") REFERENCES "available_pentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_transformations" ADD CONSTRAINT "available_transformations_availableBlockId_fkey" FOREIGN KEY ("availableBlockId") REFERENCES "available_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_pentas" ADD CONSTRAINT "available_pentas_slamId_fkey" FOREIGN KEY ("slamId") REFERENCES "slams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
