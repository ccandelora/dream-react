import React, { useState } from 'react';
import { X, Copy, Facebook, Twitter, MessageCircle, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  dreamId: string;
  dreamContent: string;
}

export default function ShareModal({ isOpen, onClose, dreamId, dreamContent }: ShareModalProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/dream/${dreamId}`;
  const shareText = `Check out this dream: "${dreamContent.slice(0, 100)}${dreamContent.length > 100 ? '...' : ''}"`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(shareUrl);
      setQrCode(qrDataUrl);
    } catch (err) {
      console.error('QR Code generation failed:', err);
    }
  };

  const shareButtons = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      color: 'bg-[#1877F2] hover:bg-[#1877F2]/80'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-[#1DA1F2] hover:bg-[#1DA1F2]/80'
    },
    {
      name: 'Message',
      icon: <MessageCircle className="w-5 h-5" />,
      url: `sms:?body=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      color: 'bg-[#25D366] hover:bg-[#25D366]/80'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Share Dream</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-purple-200 mb-2">Direct Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-grow bg-white/5 border border-purple-300/20 rounded-lg py-2 px-4 text-white"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                {copied ? (
                  'Copied!'
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {shareButtons.map((button) => (
              <a
                key={button.name}
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${button.color} text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 transition-colors`}
              >
                {button.icon}
                <span className="hidden sm:inline">{button.name}</span>
              </a>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={generateQRCode}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <QrCode className="w-4 h-4" />
              Generate QR Code
            </button>
            {qrCode && (
              <div className="mt-4">
                <img src={qrCode} alt="QR Code" className="mx-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}