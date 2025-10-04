import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSimpleNews } from "@/hooks/useSimpleNews";

const SimpleTest = () => {
  const [source, setSource] = useState<'reddit' | 'hackernews' | 'devto' | 'all'>('reddit');
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useSimpleNews(source, 5);

  console.log('SimpleTest Debug:', { 
    data, 
    isLoading, 
    error, 
    source, 
    isFetching 
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Simple News Test</h1>
        
        {/* Source Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Select Source:</h2>
          <div className="flex gap-2">
            {(['reddit', 'hackernews', 'devto', 'all'] as const).map((s) => (
              <Button
                key={s}
                onClick={() => setSource(s)}
                variant={source === s ? 'default' : 'outline'}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Status:</h3>
            <div className="space-y-1 text-sm">
              <p>Source: <span className="font-mono">{source}</span></p>
              <p>Loading: <span className={isLoading ? 'text-blue-600' : 'text-gray-600'}>{isLoading ? 'Yes' : 'No'}</span></p>
              <p>Fetching: <span className={isFetching ? 'text-blue-600' : 'text-gray-600'}>{isFetching ? 'Yes' : 'No'}</span></p>
              <p>Error: <span className={error ? 'text-red-600' : 'text-gray-600'}>{error ? 'Yes' : 'No'}</span></p>
              {data && <p>Articles: <span className="text-green-600">{data.articles.length}</span></p>}
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <Button 
            onClick={() => refetch()} 
            disabled={isLoading || isFetching}
            className="mr-2"
          >
            {isLoading || isFetching ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="p-4 mb-6 border-red-200 bg-red-50">
            <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
            <p className="text-red-700 text-sm">{error.message}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-red-600">Show full error</summary>
              <pre className="mt-2 text-xs text-red-600 overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          </Card>
        )}

        {/* Loading State */}
        {(isLoading || isFetching) && (
          <Card className="p-4 mb-6">
            <p className="text-blue-600">Loading news from {source}...</p>
          </Card>
        )}

        {/* Results */}
        {data && data.articles.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Found {data.articles.length} articles from {data.source}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Last updated: {new Date(data.lastUpdated).toLocaleString()}
            </p>
            
            <div className="space-y-4">
              {data.articles.map((article, index) => (
                <Card key={article.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg flex-1 mr-4">{article.title}</h4>
                    <Badge variant="outline" className="ml-2">
                      {article.source}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{article.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Published: {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <Button 
                      size="sm"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      Read More
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {data && data.articles.length === 0 && !isLoading && (
          <Card className="p-4">
            <p className="text-gray-600">No articles found from {source}. Try a different source.</p>
          </Card>
        )}

        {/* Debug Info */}
        <details className="mt-8">
          <summary className="cursor-pointer text-sm text-gray-600 mb-2">Debug Info</summary>
          <Card className="p-4">
            <pre className="text-xs overflow-auto">
              {JSON.stringify({ data, isLoading, error, source }, null, 2)}
            </pre>
          </Card>
        </details>
      </div>
    </div>
  );
};

export default SimpleTest;
