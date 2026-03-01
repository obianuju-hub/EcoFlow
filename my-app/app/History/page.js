"use client";
import { useEffect, useState } from "react";
import { Clock, X } from "lucide-react";

const HistoryPage = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch history');
        return res.json();
      })
      .then((data) => {
        setHistoryItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">Loading your history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!historyItems.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Upload History</h2>
            <p className="text-gray-500">You haven't uploaded any products yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload History</h1>
          <p className="text-gray-600">View all your previous eco-rating analyses</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {historyItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  className="w-full h-48 object-cover"
                  alt="Uploaded product"
                />
              )}
              <div className="p-4">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Eco Rating</span>
                    <span className="text-2xl font-bold text-green-600">{item.rating || 'N/A'}</span>
                  </div>
                  {item.rating && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(item.rating / 10) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {item.reasoning && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 line-clamp-3">{item.reasoning}</p>
                  </div>
                )}

                <div className="mt-3 text-right">
                  <span className="text-xs text-green-600 font-medium">Click for details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Analysis Details</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Image */}
                {selectedItem.imageUrl && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={selectedItem.imageUrl}
                      className="w-full h-auto object-contain max-h-96"
                      alt="Product"
                    />
                  </div>
                )}

                {/* Rating */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-6xl font-extrabold text-green-600">{selectedItem.rating}</span>
                      <span className="text-2xl font-semibold text-gray-600">/10</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-2">Environmental Rating</p>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full transition-all"
                          style={{ width: `${(selectedItem.rating / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reasoning */}
                {selectedItem.reasoning && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{selectedItem.reasoning}</p>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {selectedItem.recommendation && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Eco-Friendly Alternatives</h3>
                    <div className="space-y-3">
                      {(() => {
                        try {
                          const recs = JSON.parse(selectedItem.recommendation);
                          if (Array.isArray(recs)) {
                            return recs.map((item, index) => (
                              <div key={index} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                                <p className="text-gray-700">{item}</p>
                              </div>
                            ));
                          }
                        } catch (e) {
                          // Not JSON or not an array
                        }
                        // Fallback to string display
                        return (
                          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedItem.recommendation}</p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
