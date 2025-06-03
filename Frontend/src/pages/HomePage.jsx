import React from 'react';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  return (
    <div>
      this is home page
      <button onClick={() => {
        toast.success('Successfully toasted!');
      }}>
        Create Toast
      </button>
    </div>
  );
}
