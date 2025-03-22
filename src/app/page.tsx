'use client'

import React, { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";

export const socket = (() => {
  if (typeof window == "undefined") return io();
  if (!(window as any)._socket) {
    (window as any)._socket = io();
  }
  return (window as any)._socket as Socket;
})();

export default function Page() {
  const UserAuthed = { id: 1 }
  const [ListNotif, setListNotif] = useState<{
    user_id: number;
    url: string;
    description: string;
    created_at: string;
    status: "READ" | "UNREAD";
  }[]>([]);



  /**
   * Function handler
   */
  function onSendNotif(data: any) {
    console.log(data);
    setListNotif((prev) => ([data, ...prev]));
  };



  /**
   * Use effect
   */
  useEffect(() => {
    // fetch('/api/socket/init-server');
    socket.on("s_SendNotif", onSendNotif);

    return () => {
      socket.off("s_SendNotif", onSendNotif);
    };
  }, []);

  useEffect(() => {
    if (UserAuthed.id) {
      socket.emit("c_SubscribeNotif", { user_id: UserAuthed?.id });
    }
  }, [UserAuthed])



  /**
   * Render JSX
   */
  return (
    <section className="relative z-10 overflow-hidden px-6 pb-16 pt-10 md:pb-20 lg:pb-28 lg:pt-[140px]">
      <div className="mx-auto max-w-full pt-16">
        <div>ini notif:</div>
        <div>
          {ListNotif.map((notification, indexNotification) => (
            <div key={indexNotification} className={'px-4 py-3 cursor-pointer'}>
              <div dangerouslySetInnerHTML={{ __html: notification.description ?? '' }} />
              <div className='mt-2 text-sm text-blue-500'>{notification.created_at}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
