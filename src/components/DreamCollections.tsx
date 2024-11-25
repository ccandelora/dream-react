import React, { useState } from 'react';
import { Plus, Folder, Edit2, Trash2, Sparkles, Repeat } from 'lucide-react';
import { useCollectionStore, DreamCollection } from '../store/collectionStore';
import { useDreamStore } from '../store/dreamStore';
import CollectionModal from './CollectionModal';

export default function DreamCollections() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<DreamCollection | null>(null);
  const { collections, deleteCollection } = useCollectionStore();
  const dreams = useDreamStore((state) => state.dreams);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Repeat':
        return <Repeat className="w-5 h-5" />;
      default:
        return <Folder className="w-5 h-5" />;
    }
  };

  const handleEdit = (collection: DreamCollection) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Folder className="w-6 h-6" />
            Dream Collections
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Collection
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="relative bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`text-${collection.color}-400`}>
                    {getIconComponent(collection.icon)}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{collection.name}</h3>
                    <p className="text-sm text-purple-300">
                      {collection.dreamIds.length} dreams
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(collection)}
                    className="p-1 text-purple-300 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCollection(collection.id)}
                    className="p-1 text-purple-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-purple-200 line-clamp-2">
                {collection.description}
              </p>
              {collection.dreamIds.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-sm text-purple-300 mb-2">Recent Dreams:</p>
                  <div className="space-y-1">
                    {collection.dreamIds.slice(0, 2).map((dreamId) => {
                      const dream = dreams.find((d) => d.id === dreamId);
                      return dream ? (
                        <p key={dreamId} className="text-sm text-purple-200 truncate">
                          {dream.content}
                        </p>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <CollectionModal
        isOpen={isModalOpen}
        onClose={handleClose}
        collection={editingCollection}
      />
    </>
  );
}