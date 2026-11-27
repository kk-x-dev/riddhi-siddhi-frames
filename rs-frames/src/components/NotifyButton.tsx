"use client";

import toast from 'react-hot-toast';

export default function NotifyButton() {
  const notify = () => toast.success('Successfully toasted!');

  return (
    <button onClick={notify}>
      Show Notification
    </button>
  );
}
