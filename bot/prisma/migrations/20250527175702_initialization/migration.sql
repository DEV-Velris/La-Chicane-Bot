-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "discordId" VARCHAR(50) NOT NULL,
    "pitSkillId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "User_pitSkillId_key" ON "User"("pitSkillId");

-- CreateIndex
CREATE INDEX "idx_user_discord_id" ON "User"("discordId");

-- CreateIndex
CREATE INDEX "idx_user_pit_skill_id" ON "User"("pitSkillId");
