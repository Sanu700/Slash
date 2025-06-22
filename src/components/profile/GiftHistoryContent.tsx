import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GiftHistory } from '@/lib/data/types';
import { Gift, Calendar, Mail, User } from 'lucide-react';

interface GiftHistoryContentProps {
  giftHistory: GiftHistory[];
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

const GiftingHistoryContent = ({ giftHistory }: GiftHistoryContentProps) => {
  const navigate = useNavigate();

  return (
    <>
      {giftHistory.length > 0 ? (
        <div className="space-y-12 relative">
          {/* Timeline accent */}
          <div className="hidden md:block absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-200/80 to-pink-100/0 rounded-full z-0" />
          {giftHistory.map((gift, idx) => (
            <div key={gift.id} className="relative md:flex md:items-stretch md:gap-8 group">
              {/* Timeline dot */}
              <div className="hidden md:flex flex-col items-center z-10">
                <div className="w-5 h-5 rounded-full border-4 border-white bg-pink-400 shadow-lg group-hover:scale-110 transition-transform" />
                {idx !== giftHistory.length - 1 && (
                  <div className="flex-1 w-1 bg-pink-100" />
                )}
              </div>
              <Card className="flex-1 flex flex-col md:flex-row md:items-stretch shadow-xl border-0 bg-white/90 md:ml-10 relative z-10">
                {/* Left: Recipient & Experience */}
                <div className="flex flex-col md:w-1/2 p-6 gap-4 border-b md:border-b-0 md:border-r border-pink-50 bg-gradient-to-br from-pink-50/60 to-white/0 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                  <div className="flex items-center gap-4">
                    {/* Recipient avatar */}
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-md border-2 border-pink-200" style={{ background: stringToColor(gift.recipientName) }}>
                      <User className="w-7 h-7 text-white/80" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-pink-700">{gift.recipientName}</div>
                      {gift.recipientEmail && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 mr-1 text-pink-400" />
                          {gift.recipientEmail}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <img
                      src={gift.experience.imageUrl}
                      alt={gift.experience.title}
                      className="w-24 h-20 object-cover rounded-lg border border-pink-100 shadow-sm"
                    />
                    <div>
                      <div className="font-medium text-pink-800 text-base leading-tight line-clamp-1">
                        {gift.experience.title}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{gift.experience.location}</div>
                    </div>
                  </div>
                </div>
                {/* Right: Date & Message */}
                <div className="flex flex-col justify-between md:w-1/2 p-6 gap-4 bg-white rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
                  <div className="flex items-center gap-2 text-pink-600 font-medium text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(gift.giftedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="relative max-w-xl w-full ml-0 md:ml-4">
                      <div className="bg-pink-50 border border-pink-100 rounded-2xl px-5 py-3 shadow-sm text-gray-700 text-base font-normal leading-relaxed before:content-[''] before:absolute before:-left-3 before:top-4 before:w-4 before:h-4 before:bg-pink-50 before:rounded-full before:shadow-md">
                        {gift.message ? (
                          <span>{gift.message}</span>
                        ) : (
                          <span className="italic text-muted-foreground">No message</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <span className="text-xs text-muted-foreground">Gifted on: {new Date(gift.giftedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No gifting history</h3>
          <p className="text-gray-500 mb-6">You haven't sent any gifts yet</p>
          <Button onClick={() => navigate('/experiences')}>Send a Gift</Button>
        </div>
      )}
    </>
  );
};

export default GiftingHistoryContent; 