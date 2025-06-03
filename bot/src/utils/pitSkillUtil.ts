import { pendingPitSkillRegistrations } from '..';

//TODO: A Refaire en fonction du pit skill & pit rep en direct. (Problème pour scheduler)
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
        console.warn('Rookie license role ID is not set in environment variables.');
      }
      break;
    case 2: // C Class
      if (process.env.CLASS_C_LICENSE_ROLE_ID) {
        rolesId.push(process.env.CLASS_C_LICENSE_ROLE_ID);
      } else {
        console.warn('C Class license role ID is not set in environment variables.');
      }
      break;
    case 3: // B Class
      if (process.env.CLASS_B_LICENSE_ROLE_ID) {
        rolesId.push(process.env.CLASS_B_LICENSE_ROLE_ID);
      } else {
        console.warn('B Class license role ID is not set in environment variables.');
      }
      break;
    case 4: // A Class
      if (process.env.CLASS_A_LICENSE_ROLE_ID) {
        rolesId.push(process.env.CLASS_A_LICENSE_ROLE_ID);
      } else {
        console.warn('A Class license role ID is not set in environment variables.');
      }
      break;
    case 5: // S Class
      if (process.env.CLASS_S_LICENSE_ROLE_ID) {
        rolesId.push(process.env.CLASS_S_LICENSE_ROLE_ID);
      } else {
        console.warn('S Class license role ID is not set in environment variables.');
      }
      break;
    default:
      console.warn(`Unknown license class level: ${pilotData.licenseClassLevel}`);
      break;
  }

  if (pilotData.pitRep >= 20 && pilotData.pitSkill >= 4500) {
    if (process.env.ELITE_LEVEL_ROLE_ID) {
      rolesId.push(process.env.ELITE_LEVEL_ROLE_ID);
    } else {
      console.warn('Elite level role ID is not set in environment variables.');
    }
  } else if (pilotData.pitRep >= 20 && pilotData.pitSkill >= 3500) {
    if (process.env.PRO_LEVEL_ROLE_ID) {
      rolesId.push(process.env.PRO_LEVEL_ROLE_ID);
    } else {
      console.warn('Pro level role ID is not set in environment variables.');
    }
  } else if (pilotData.pitRep >= 15 && pilotData.pitSkill >= 3000) {
    if (process.env.VETERAN_LEVEL_ROLE_ID) {
      rolesId.push(process.env.VETERAN_LEVEL_ROLE_ID);
    } else {
      console.warn('Veteran level role ID is not set in environment variables.');
    }
  } else if (pilotData.pitRep >= 15 && pilotData.pitSkill >= 2500) {
    if (process.env.PLATINUM_LEVEL_ROLE_ID) {
      rolesId.push(process.env.PLATINUM_LEVEL_ROLE_ID);
    } else {
      console.warn('Platinum level role ID is not set in environment variables.');
    }
  } else if (pilotData.pitRep >= 10 && pilotData.pitSkill >= 2000) {
    if (process.env.SILVER_LEVEL_ROLE_ID) {
      rolesId.push(process.env.SILVER_LEVEL_ROLE_ID);
    } else {
      console.warn('Silver level role ID is not set in environment variables.');
    }
  } else if (pilotData.pitRep >= 10 && pilotData.pitSkill >= 1750) {
    if (process.env.STEEL_LEVEL_ROLE_ID) {
      rolesId.push(process.env.STEEL_LEVEL_ROLE_ID);
    } else {
      console.warn('Steel level role ID is not set in environment variables.');
    }
  } else if (pilotData.pitRep >= 5 && pilotData.pitSkill >= 1500) {
    if (process.env.BRONZE_LEVEL_ROLE_ID) {
      rolesId.push(process.env.BRONZE_LEVEL_ROLE_ID);
    } else {
      console.warn('Bronze level role ID is not set in environment variables.');
    }
  } else if (pilotData.pitRep >= 5 && pilotData.pitSkill >= 1000) {
    if (process.env.COPPER_LEVEL_ROLE_ID) {
      rolesId.push(process.env.COPPER_LEVEL_ROLE_ID);
    } else {
      console.warn('Copper level role ID is not set in environment variables.');
    }
  } else if (pilotData.pitRep >= 5 && pilotData.pitSkill >= 0) {
    if (process.env.AM_LEVEL_ROLE_ID) {
      rolesId.push(process.env.AM_LEVEL_ROLE_ID);
    } else {
      console.warn('AM level role ID is not set in environment variables.');
    }
  } else {
    if (process.env.PROVISIONAL_LEVEL_ROLE_ID) {
      rolesId.push(process.env.PROVISIONAL_LEVEL_ROLE_ID);
    } else {
      console.warn('Provisional level role ID is not set in environment variables.');
    }
  }

  return rolesId;
}

/**
 * Utility function to get the pit skill level name based on pilot's reputation and skill.
 * @param pilotPitRep The pilot's pit reputation.
 * @param pilotPitSkill  The pilot's pit skill.
 * @param longVersion If true, returns the full name of the pit skill level; otherwise, returns the short name.
 * @returns {string} The name of the pit skill level.
 */
export function GetPitSkillLevelName(
  pilotPitRep: number,
  pilotPitSkill: number,
  longVersion?: boolean,
): string {
  if (pilotPitRep >= 20 && pilotPitSkill >= 4500) {
    return longVersion ? 'Elite' : 'ELT';
  } else if (pilotPitRep >= 20 && pilotPitSkill >= 3500) {
    return longVersion ? 'Pro' : 'PRO';
  } else if (pilotPitRep >= 15 && pilotPitSkill >= 3000) {
    return longVersion ? 'Veteran' : 'VET';
  } else if (pilotPitRep >= 15 && pilotPitSkill >= 2500) {
    return longVersion ? 'Platinum' : 'PLT';
  } else if (pilotPitRep >= 10 && pilotPitSkill >= 2000) {
    return longVersion ? 'Silver' : 'SLV';
  } else if (pilotPitRep >= 10 && pilotPitSkill >= 1750) {
    return longVersion ? 'Steel' : 'STL';
  } else if (pilotPitRep >= 5 && pilotPitSkill >= 1500) {
    return longVersion ? 'Bronze' : 'BRZ';
  } else if (pilotPitRep >= 5 && pilotPitSkill >= 1000) {
    return longVersion ? 'Copper' : 'CPR';
  } else if (pilotPitRep >= 5 && pilotPitSkill >= 0) {
    return longVersion ? 'Amateur' : 'AM';
  } else {
    return longVersion ? 'Provisional' : 'PRV';
  }
}

/**
 * Utility function to get the pit skill level emoji ID based on pilot's reputation and skill.
 * @param pilotPitRep The pilot's pit reputation.
 * @param pilotPitSkill The pilot's pit skill.
 * @returns {string} The emoji ID corresponding to the pit skill level.
 */
export function GetPitSkillLevelEmojiId(pilotPitRep: number, pilotPitSkill: number): string {
  if (pilotPitRep >= 20 && pilotPitSkill >= 4500) {
    return '<:Elite:1376587507365318716>';
  } else if (pilotPitRep >= 20 && pilotPitSkill >= 3500) {
    return '<:Professionnel:1376587540232011776>';
  } else if (pilotPitRep >= 15 && pilotPitSkill >= 3000) {
    return '<:Vtran:1376587568686039190>';
  } else if (pilotPitRep >= 15 && pilotPitSkill >= 2500) {
    return '<:Platine:1376587530052440185>';
  } else if (pilotPitRep >= 10 && pilotPitSkill >= 2000) {
    return '<:Silver:1376587558057938974>';
  } else if (pilotPitRep >= 10 && pilotPitSkill >= 1750) {
    return '<:Fer:1376587518085959860>';
  } else if (pilotPitRep >= 5 && pilotPitSkill >= 1500) {
    return '<:Bronze:1376587479846748170>';
  } else if (pilotPitRep >= 5 && pilotPitSkill >= 1000) {
    return '<:Copper:1376587493935415387>';
  } else if (pilotPitRep >= 5 && pilotPitSkill >= 0) {
    return '<:Amateur:1376587471428784299>';
  } else {
    return '<:Provisionnal:1376587549446770688>';
  }
}

/**
 * Utility function to get the pit skill class emoji ID based on the class level.
 * @param classLevel The class level of the pit skill.
 * @returns {string} - The emoji ID corresponding to the class level.
 */
export function GetPitSkillClassEmojiId(classLevel: number): string {
  switch (classLevel) {
    case 1:
      return '<:ClasseRK:1376245500595929168>';
    case 2:
      return '<:ClasseC:1376245491117064334>';
    case 3:
      return '<:ClasseB:1376245482887712779>';
    case 4:
      return '<:ClasseA:1376245473639268554>';
    case 5:
      return '<:ClasseS:1376245508762243162>';
    default:
      console.warn(`Unknown class level: ${classLevel}`);
      return '';
  }
}
