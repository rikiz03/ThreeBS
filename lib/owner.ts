// Central owner / admin configuration for Three Brother Stores.
// Keeping values here means the admin gate and the profile display stay in sync.

export const OWNER = {
    businessName: 'Three Brother Stores',
    businessEmail: 'support@threebrotherstores.com',
    ownerName: 'Olisa Emmanuel Okeke',
};

// Authorized emails that are allowed to access the admin area.
export const ADMIN_EMAILS: string[] = [OWNER.businessEmail];

// A Clerk user-id fallback for the owner (in case primary email ever changes).
export const OWNER_USER_IDS: string[] = ['user_2ofO0tE5Y4uUvU5Fp9yS5FfE6Z8'];

export function isAdmin(user: { emailAddress?: string | null; id?: string | null }): boolean {
    const email = (user?.emailAddress ?? '').toLowerCase().trim();
    const id = user?.id ?? '';
    return ADMIN_EMAILS.includes(email) || OWNER_USER_IDS.includes(id);
}