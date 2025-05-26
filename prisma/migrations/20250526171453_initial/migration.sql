-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "discordId" VARCHAR(50) NOT NULL,
    "pitSkillId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_user_discord_id" ON "User"("discordId");

-- CreateIndex
CREATE INDEX "idx_user_pit_skill_id" ON "User"("pitSkillId");

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_pitSkillId_key" ON "User"("discordId", "pitSkillId");
