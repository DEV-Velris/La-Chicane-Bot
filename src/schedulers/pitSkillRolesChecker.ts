import { discordClient, GetPrismaClient } from "..";
import { GetPitskillDriverInfoResponse } from "../types/api";
import { GetPitSkillDiscordRoles } from "../utils";

setInterval(async () => {
  if (process.env.DISCORD_GUILD_ID === undefined) {
    console.error("DISCORD_GUILD_ID is not set in environment variables.");
    return;
  }

  const prismaClient = await GetPrismaClient();

  const usersToCheck = await prismaClient.user.findMany({
    select: {
      discordId: true,
      pitSkillId: true,
    },
  });

  usersToCheck.forEach(async (user) => {
    if (process.env.DISCORD_GUILD_ID === undefined) {
      console.error("DISCORD_GUILD_ID is not set in environment variables.");
      return;
    }
    const discordUser = discordClient.guilds.cache
      .get(process.env.DISCORD_GUILD_ID)
      ?.members.cache.get(user.discordId);

    // If the user is not found in the guild, skip to the next user
    if (discordUser === undefined) return;

    const pitSkillApiResponse = await fetch(
      `https://api.pitskill.io/api/pitskill/getdriverinfo?id=${user.pitSkillId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // If the API response is not OK
    if (pitSkillApiResponse.status !== 200) {
      console.error(`Failed to fetch PitSkill data. API error`, {
        data: await pitSkillApiResponse.json(),
      });
      return;
    }

    const pitSkillData =
      (await pitSkillApiResponse.json()) as GetPitskillDriverInfoResponse;

    if (pitSkillData.status === 0) {
      console.warn(`User ${user.discordId} has no PitSkill account.`);
      return;
    } else if (pitSkillData.status !== 1) {
      console.error(
        `PitSkill API returned an error for user ${user.discordId}`,
        {
          pitSkillData,
        }
      );
      return;
    }

    const userCurrentPitRep =
      pitSkillData.payload.tpc_driver_data.currentPitRep;
    const userCurrentPitSkill =
      pitSkillData.payload.tpc_driver_data.currentPitSkill;
    const userRoles = discordUser.roles.cache.map((role) => role.id);

    const rolesToAdd = GetPitSkillDiscordRoles(user.discordId);

    // Check for License Class Level changes
    if (userRoles.some((roleId) => rolesToAdd[0].includes(roleId))) {
      // If the user already has the roles, skip to the next user
      return;
    } else {
      const licenseRolesId = [
        process.env.ROOKIE_LICENSE_ROLE_ID,
        process.env.CLASS_C_LICENSE_ROLE_ID,
        process.env.CLASS_B_LICENSE_ROLE_ID,
        process.env.CLASS_A_LICENSE_ROLE_ID,
        process.env.CLASS_S_LICENSE_ROLE_ID,
      ];

      if (
        licenseRolesId.some((roleId) => roleId === undefined || roleId === null)
      ) {
        console.error(
          "One or more License Class Level role IDs are not set in environment variables."
        );
        return;
      }

      // Remove the old License Class Level roles
      const rolesToRemove = userRoles.filter((roleId) =>
        licenseRolesId.includes(roleId)
      );

      try {
        if (rolesToRemove.length > 0) {
          await discordUser.roles.remove(rolesToRemove);
        }
        // Add the new License Class Level roles
        await discordUser.roles.add(rolesToAdd[0]);
      } catch (error) {
        console.error(
          `Failed to update License role for user ${user.discordId}`,
          error
        );
      }
    }

    // Check for Level changes
    if (userRoles.some((roleId) => rolesToAdd[1].includes(roleId))) {
      // If the user already has the roles, skip to the next user
      return;
    } else {
      const levelRolesId = [
        process.env.PROVISIONAL_LEVEL_ROLE_ID,
        process.env.AM_LEVEL_ROLE_ID,
        process.env.COPPER_LEVEL_ROLE_ID,
        process.env.BRONZE_LEVEL_ROLE_ID,
        process.env.STEEL_LEVEL_ROLE_ID,
        process.env.SILVER_LEVEL_ROLE_ID,
        process.env.PLATINUM_LEVEL_ROLE_ID,
        process.env.VETERAN_LEVEL_ROLE_ID,
        process.env.PRO_LEVEL_ROLE_ID,
        process.env.ELITE_LEVEL_ROLE_ID,
      ];

      if (
        levelRolesId.some((roleId) => roleId === undefined || roleId === null)
      ) {
        console.error(
          "One or more Level role IDs are not set in environment variables."
        );
        return;
      }

      // Remove the old Level roles
      const rolesToRemove = userRoles.filter((roleId) =>
        levelRolesId.includes(roleId)
      );

      try {
        if (rolesToRemove.length > 0) {
          await discordUser.roles.remove(rolesToRemove);
        }
        // Add the new Level roles
        await discordUser.roles.add(rolesToAdd[1]);
      } catch (error) {
        console.error(
          `Failed to update Level role for user ${user.discordId}`,
          error
        );
      }
    }
  });
}, 60 * 60 * 1000); // every hour
