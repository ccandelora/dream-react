import React, { useState, useEffect } from 'react';
import { X, Folder, Sparkles, Repeat, Check } from 'lucide-react';
import { useCollectionStore, DreamCollection } from '../store/collectionStore';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection?: DreamCollection | null;
}

export default function CollectionModal({ isOpen, onClose, collection }: CollectionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Folder');
  const [color, setColor] = useState('purple');
  
  const { addCollection, updateCollection } = useCollectionStore();

  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description);
      setIcon(collection.icon);
      setColor(collection.color);
    } else {
      setName('');
      setDescription('');
      setIcon('Folder');
      setColor('purple');
    }
  }, [collection]);

  if (!isOpen) return null;

  const icons = [
    { name: 'Folder', component: <Folder className="w-5 h-5" /> },
    { name: 'Sparkles', component: <Sparkles className="w-5 h-5" /> },
    { name: 'Repeat', component: <Repeat className="w-5 h-5" /> },
  ];

  const colors = [
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'green', class: 'bg-green-500' },
    { name: 'rose', class: 'bg-rose-500' },
    { name: 'amber', class: 'bg-amber-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const collectionData = {
      userId: '1', // Replace with actual user ID
      name,
      description,
      icon,
      color,
      dreamIds: [],
    };

    if (collection) {
      updateCollection(collection.id, collectionData);
    } else {
      addCollection(collectionData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          {collection ? 'Edit Collection' : 'New Collection'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-200 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 px-4 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              placeholder="Collection name"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 px-4 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 h-24 resize-none"
              placeholder="Describe your collection..."
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-2">Icon</label>
            <div className="flex gap-2">
              {icons.map((i) => (
                <button
                  key={i.name}
                  type="button"
                  onClick={() => setIcon(i.name)}
                  className={`p-3 rounded-lg ${
                    icon === i.name
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-purple-300 hover:bg-white/10'
                  } transition-colors`}
                >
                  {i.component}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-purple-200 mb-2">Color</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  className={`w-8 h-8 rounded-full ${c.class} flex items-center justify-center`}
                >
                  {color === c.name && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-2 transition-colors mt-6"
          >
            {collection ? 'Update Collection' : 'Create Collection'}
          </button>
        </form>
      </div>
    </div>
  );
}