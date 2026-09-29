// Turns on HOREB's Tutagora look (horeb-look.css) while a HOREB screen is open.
import { useEffect } from 'react';
import './horeb-look.css';

let users = 0;
export function useHorebLook() {
  useEffect(() => {
    users += 1;
    document.documentElement.classList.add('horeb-tg');
    return () => {
      users -= 1;
      if (users <= 0) { users = 0; document.documentElement.classList.remove('horeb-tg'); }
    };
  }, []);
}
