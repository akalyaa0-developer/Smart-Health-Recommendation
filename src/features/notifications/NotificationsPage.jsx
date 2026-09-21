import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Bell, CheckCheck, Trash2, Droplets, CalendarCheck, Utensils, Sparkles } from 'lucide-react';

export function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications } = useNotifications();

  const getNotifIcon = (type) => {
    switch (type) {
      case 'hydration': return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'assessment': return <CalendarCheck className="w-4 h-4 text-emerald-500" />;
      case 'meal': return <Utensils className="w-4 h-4 text-teal-500" />;
      default: return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              Notifications &amp; Reminders
            </h1>
            {unreadCount > 0 && (
              <Badge variant="emerald" size="sm">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time hydration reminders, assessment prompts, and weekly reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              icon={CheckCheck}
              onClick={markAllAsRead}
            >
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={clearAllNotifications}
              className="text-slate-500 hover:text-rose-600"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="p-8 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Notifications</h3>
            <p className="text-xs text-slate-400">You're all caught up with your daily wellness prompts.</p>
          </Card>
        ) : (
          notifications.map(notif => (
            <Card
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-4 transition-all cursor-pointer ${
                !notif.read ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                  {getNotifIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
