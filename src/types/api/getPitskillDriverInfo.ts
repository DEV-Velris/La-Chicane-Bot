export interface GetPitskillDriverInfoResponse {
    status: number;
    code: string;
    message: string | null;
    payload: {
        tpc_driver_data: {
            currentPitPace: number;
            currentPitRating: number;
            currentPitRep: number;
            currentPitSkill: number;
            driverId: number | null;
            driverNo: number | null;
            is_provisional: boolean;
            licence_class: string;
            licence_class_short: string;
            licence_class_level: number;
            championship_licence: number;
            name: string;
            rank: number;
            licence_penalties: {
                warnings: number;
                bans: number;
            };
            showDetail: boolean;
        };
        sigma_user_data: {
            user_id: number;
            discord_avatar: string;
            refferal_code: string;
            removed: boolean;
            created_at: string;
            updated_at: string;
            createdAt: string;
            updatedAt: string;
            profile_data: {
                user_profile_id: number;
                user_id: number;
                first_name: string;
                last_name: string;
                nickname: string;
                driver_number: number | null;
                shortname: string;
                driverCountry: string;
                marketing: boolean;
                server_location: string;
                createdAt: string;
                updatedAt: string;
                avatar_url: string;
            };
            partners: any[];
            discord_uid: string;
            twitch_login: string;
            youtube_login: string | null;
            badge_levels: any[];
            signupDate: string;
            is_vip: boolean;
            vip_level: string;
            refferals: number;
            redeemed_refferals: number;
        };
        team_invitations: any[];
    };
}