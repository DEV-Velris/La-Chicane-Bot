import { pendingPitSkillRegistrations } from "..";

/**
 * Utility function to get Discord roles based on a Discord ID.
 * @param discordId {string} - The Discord ID of the user.
 * @returns {string[]} - An array of role IDs associated with the Discord user.
 */
export function GetPitSkillDiscordRoles(discordId: string): string[] {
  const rolesId: string[] = [];
  const pilotData = pendingPitSkillRegistrations.get(discordId);

  if (pilotData === undefined) {
    return rolesId;
  }

  switch (pilotData.licenseClassLevel) {
    case 1: // Rookie
      if (process.env.ROOKIE_LICENSE_ROLE_ID) {
        rolesId.push(process.env.ROOKIE_LICENSE_ROLE_ID);
      } else {
        console.warn(
          "Rookie license role ID is not set in environment variables."
        );
      }
      break;
    case 2: // C Class
      if (process.env.CLASS_C_LICENSE_ROLE_ID) {
        rolesId.push(process.env.CLASS_C_LICENSE_ROLE_ID);
      } else {
        console.warn(
          "C Class license role ID is not set in environment variables."
        );
      }
      break;
    case 3: // B Class
      if (process.env.CLASS_B_LICENSE_ROLE_ID) {
        rolesId.push(process.env.CLASS_B_LICENSE_ROLE_ID);
      } else {
        console.warn(
          "B Class license role ID is not set in environment variables."
        );
      }
      break;
    case 4: // A Class
      if (process.env.CLASS_A_LICENSE_ROLE_ID) {
        rolesId.push(process.env.CLASS_A_LICENSE_ROLE_ID);
      } else {
        console.warn(
          "A Class license role ID is not set in environment variables."
        );
      }
      break;
    case 5: // S Class
      if (process.env.CLASS_S_LICENSE_ROLE_ID) {
        rolesId.push(process.env.CLASS_S_LICENSE_ROLE_ID);
      } else {
        console.warn(
          "S Class license role ID is not set in environment variables."
        );
      }
      break;
    default:
      console.warn(
        `Unknown license class level: ${pilotData.licenseClassLevel}`
      );
      break;
  }

  if (pilotData.pitRep >= 20 && pilotData.pitSkill >= 4500) {
    if (process.env.ELITE_LEVEL_ROLE_ID) {
      rolesId.push(process.env.ELITE_LEVEL_ROLE_ID);
    } else {
      console.warn("Elite level role ID is not set in environment variables.");
    }
  } else if (pilotData.pitRep >= 20 && pilotData.pitSkill >= 3500) {
    if (process.env.PRO_LEVEL_ROLE_ID) {
      rolesId.push(process.env.PRO_LEVEL_ROLE_ID);
    } else {
      console.warn("Pro level role ID is not set in environment variables.");
    }
  } else if (pilotData.pitRep >= 15 && pilotData.pitSkill >= 3000) {
    if (process.env.VETERAN_LEVEL_ROLE_ID) {
      rolesId.push(process.env.VETERAN_LEVEL_ROLE_ID);
    } else {
      console.warn(
        "Veteran level role ID is not set in environment variables."
      );
    }
  } else if (pilotData.pitRep >= 15 && pilotData.pitSkill >= 2500) {
    if (process.env.PLATINUM_LEVEL_ROLE_ID) {
      rolesId.push(process.env.PLATINUM_LEVEL_ROLE_ID);
    } else {
      console.warn(
        "Platinum level role ID is not set in environment variables."
      );
    }
  } else if (pilotData.pitRep >= 10 && pilotData.pitSkill >= 2000) {
    if (process.env.SILVER_LEVEL_ROLE_ID) {
      rolesId.push(process.env.SILVER_LEVEL_ROLE_ID);
    } else {
      console.warn("Silver level role ID is not set in environment variables.");
    }
  } else if (pilotData.pitRep >= 10 && pilotData.pitSkill >= 1750) {
    if (process.env.STEEL_LEVEL_ROLE_ID) {
      rolesId.push(process.env.STEEL_LEVEL_ROLE_ID);
    } else {
      console.warn("Steel level role ID is not set in environment variables.");
    }
  } else if (pilotData.pitRep >= 5 && pilotData.pitSkill >= 1500) {
    if (process.env.BRONZE_LEVEL_ROLE_ID) {
      rolesId.push(process.env.BRONZE_LEVEL_ROLE_ID);
    } else {
      console.warn("Bronze level role ID is not set in environment variables.");
    }
  } else if (pilotData.pitRep >= 5 && pilotData.pitSkill >= 1000) {
    if (process.env.COPPER_LEVEL_ROLE_ID) {
      rolesId.push(process.env.COPPER_LEVEL_ROLE_ID);
    } else {
      console.warn("Copper level role ID is not set in environment variables.");
    }
  } else if (pilotData.pitRep >= 5 && pilotData.pitSkill >= 0) {
    if (process.env.AM_LEVEL_ROLE_ID) {
      rolesId.push(process.env.AM_LEVEL_ROLE_ID);
    } else {
      console.warn("AM level role ID is not set in environment variables.");
    }
  } else {
    if (process.env.PROVISIONAL_LEVEL_ROLE_ID) {
      rolesId.push(process.env.PROVISIONAL_LEVEL_ROLE_ID);
    } else {
      console.warn(
        "Provisional level role ID is not set in environment variables."
      );
    }
  }

  return rolesId;
}
