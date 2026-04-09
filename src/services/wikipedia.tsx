const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

export interface WikipediaSearchResult {
    title: string;
    pageid: number;
    snippet?: string;
}

export interface WikipediaPageContent {
    title: string;
    html: string;
    links: string[];
}

export async function searchPages(query: string): Promise<WikipediaSearchResult[]> {
    if (!query.trim()) return [];

    const params = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        origin: '*',
    });

    try {
        const response = await fetch(`${WIKIPEDIA_API_URL}?${params.toString()}`);
        const data = await response.json();
        return data.query.search || [];
    } catch (error) {
        console.error('Error searching Wikipedia:', error);
        return [];
    }
}

export async function getPageContent(title: string): Promise<WikipediaPageContent | null> {
    const params = new URLSearchParams({
        action: 'parse',
        page: title,
        format: 'json',
        origin: '*',
        redirects: '1',
        prop: 'text|links',
        disableeditsection: '1',
        mobileformat: '1',
    });

    try {
        const response = await fetch(`${WIKIPEDIA_API_URL}?${params.toString()}`);
        const data = await response.json();

        if (data.error) {
            console.error('Wikipedia API error:', data.error);
            return null;
        }

        return {
            title: data.parse.title,
            html: data.parse.text['*'].replace(/src="\/\//g, 'src="https://'),
            links: data.parse.links.map((l: any) => l['*']),
        };
    } catch (error) {
        console.error('Error fetching Wikipedia page:', error);
        return null;
    }
}

export async function validatePage(title: string): Promise<string | null> {
    const params = new URLSearchParams({
        action: 'query',
        titles: title,
        format: 'json',
        origin: '*',
        redirects: '1',
    });

    try {
        const response = await fetch(`${WIKIPEDIA_API_URL}?${params.toString()}`);
        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId === '-1') return null;

        // If there was a redirect, the normalized title or redirect title will be in the response
        const normalized = data.query.normalized?.[0]?.to;
        const redirected = data.query.redirects?.[0]?.to;

        return redirected || normalized || pages[pageId].title;
    } catch (error) {
        console.error('Error validating Wikipedia page:', error);
        return null;
    }
}

export async function getRandomPage(): Promise<string> {
    const params = new URLSearchParams({
        action: 'query',
        list: 'random',
        rnnamespace: '0',
        rnlimit: '1',
        format: 'json',
        origin: '*',
    });

    try {
        const response = await fetch(`${WIKIPEDIA_API_URL}?${params.toString()}`);
        const data = await response.json();
        return data.query.random[0].title;
    } catch (error) {
        console.error('Error getting random page:', error);
        return 'Wikipedia';
    }
}
