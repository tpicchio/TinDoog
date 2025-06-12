"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Camera className="text-red-500" />
      <p>Conto: {count}</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Aumenta
      </button>
    </div>
  );
}
