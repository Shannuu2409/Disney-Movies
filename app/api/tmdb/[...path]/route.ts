import { NextRequest, NextResponse } from 'next/server';

function buildTmdbUrl(pathSegments: string[], request: NextRequest): URL {
	// Incoming path usually starts with ['3', '...'] because the client passed '/3/...'
	// Build against the root host to avoid accidental double '/3/3/...'
	const base = 'https://api.themoviedb.org';
	const joinedPath = pathSegments.join('/');
	const url = new URL(`${base}/${joinedPath}`);
	for (const [key, value] of request.nextUrl.searchParams.entries()) {
		url.searchParams.set(key, value);
	}
	return url;
}

async function proxy(request: NextRequest, context: { params: { path: string[] } }) {
	const bearerToken = process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_API_KEY;
	if (!bearerToken) {
		return NextResponse.json({ error: 'TMDB token is not configured' }, { status: 500 });
	}

	const url = buildTmdbUrl(context.params.path || [], request);
	const response = await fetch(url.toString(), {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${bearerToken}`,
		},
		// Do not cache aggressively via the proxy; let upstream handle typical freshness
		next: { revalidate: 60 * 60 },
	});

	if (!response.ok) {
		const errorBody = await response.text().catch(() => '<no body>');
		return NextResponse.json(
			{ error: `TMDB request failed: ${response.status} ${response.statusText} - ${errorBody}` },
			{ status: response.status }
		);
	}

	const data = await response.json();
	return NextResponse.json(data, { status: 200 });
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const params = await context.params;
    return proxy(request, { params });
}


