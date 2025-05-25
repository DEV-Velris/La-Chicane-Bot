-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "discordId" VARCHAR(50) NOT NULL,
    "pitSkillId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
