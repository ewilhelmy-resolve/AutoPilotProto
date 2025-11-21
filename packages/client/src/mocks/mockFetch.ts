/**
 * mockFetch - Global fetch interceptor for designer/demo mode
 *
 * This intercepts all API calls and returns mock data immediately
 * without needing a backend server.
 */

const originalFetch = window.fetch;

const mockResponses: Record<string, any> = {
  '/api/organizations/current': {
    organization: {
      id: 'mock-org-id',
      name: 'Dev Organization',
      user_role: 'owner',
      member_count: 1,
      created_at: new Date().toISOString(),
    },
  },
  '/api/conversations': {
    conversations: [],
  },
  '/api/data-sources': [],
  '/api/files': {
    documents: [
      {
        id: 'demo-file-1',
        filename: 'Product Documentation.pdf',
        type: 'pdf',
        source: 'upload',
        status: 'processed',
        size: 1024000,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'demo-file-2',
        filename: 'Technical Specifications.docx',
        type: 'docx',
        source: 'upload',
        status: 'processed',
        size: 512000,
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'demo-file-3',
        filename: 'User Guide.pdf',
        type: 'pdf',
        source: 'upload',
        status: 'processed',
        size: 2048000,
        created_at: new Date(Date.now() - 259200000).toISOString(),
      },
    ],
    total: 3,
    limit: 50,
    offset: 0,
  },
};

export function enableMockFetch() {
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

    // Check if this is an API call
    if (url.includes('/api/') || url.includes('/auth/')) {
      console.log('[MockFetch] Intercepting:', url);

      // Find matching mock
      for (const [path, data] of Object.entries(mockResponses)) {
        if (url.includes(path)) {
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      // Default empty success response for unmocked endpoints
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Pass through non-API calls
    return originalFetch(input, init);
  };
}

export function disableMockFetch() {
  window.fetch = originalFetch;
}
