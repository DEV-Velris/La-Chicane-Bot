declare namespace NodeJS {
  interface ProcessEnv {
    DISCORD_TOKEN: string;
    DISCORD_BOT_ID: string;
    DISCORD_GUILD_ID: string;
    DEBUG_MODE?: string;
    DATABASE_URL: string;
    // Environment variables for Channels
    REGULATIONS_CHANNEL_ID: string;
    BOT_COMMANDS_CHANNEL_ID: string;
    // Environment variables for Roles
    REGULATIONS_ACCEPTED_ROLE_ID: string;
    // Environment variables for Licenses Roles
    ROOKIE_LICENSE_ROLE_ID: string;
    CLASS_C_LICENSE_ROLE_ID: string;
    CLASS_B_LICENSE_ROLE_ID: string;
    CLASS_A_LICENSE_ROLE_ID: string;
    CLASS_S_LICENSE_ROLE_ID: string;
    // Discord Roles for Levels
    PROVISIONAL_LEVEL_ROLE_ID: string;
    AM_LEVEL_ROLE_ID: string;
    COPPER_LEVEL_ROLE_ID: string;
    BRONZE_LEVEL_ROLE_ID: string;
    STEEL_LEVEL_ROLE_ID: string;
    SILVER_LEVEL_ROLE_ID: string;
    PLATINUM_LEVEL_ROLE_ID: string;
    VETERAN_LEVEL_ROLE_ID: string;
    PRO_LEVEL_ROLE_ID: string;
    ELITE_LEVEL_ROLE_ID: string;
    // Environment variables for Tickets
    TICKETS_CATEGORY_ID: string;
  }
}
