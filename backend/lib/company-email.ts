const FREEMAIL = new Set([
    'gmail.com',
    'googlemail.com',
    'yahoo.com',
    'yahoo.co.in',
    'outlook.com',
    'hotmail.com',
    'live.com',
    'icloud.com',
    'proton.me',
    'protonmail.com',
    'aol.com',
]);

export function extractEmailDomain(email: string): string | null {
    const e = email.trim().toLowerCase();
    const at = e.lastIndexOf('@');
    if (at < 1 || at === e.length - 1) return null;
    return e.slice(at + 1);
}

export function isFreemailDomain(domain: string): boolean {
    return FREEMAIL.has(domain);
}

function slug(s: string): string {
    return s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '')
        .trim();
}

/**
 * True if the email's domain plausibly belongs to the stated employer.
 * Uses a simple slug overlap check (e.g. Zepto + zepto.com).
 */
export function companyDomainMatchesCompany(companyName: string, email: string): boolean {
    const domain = extractEmailDomain(email);
    if (!domain) return false;
    if (isFreemailDomain(domain)) return false;

    const companySlug = slug(companyName);
    if (companySlug.length < 2) return false;

    const domainMain = domain.split('.')[0] ?? '';
    const domainSlug = slug(domainMain);

    if (domainSlug.includes(companySlug) || companySlug.includes(domainSlug)) return true;

    const fullDomainSlug = slug(domain.replace(/\./g, ''));
    return fullDomainSlug.includes(companySlug);
}
