import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function getLocalNickname() {
  return localStorage.getItem('pickl_nickname') || '';
}

export function setLocalNickname(name) {
  localStorage.setItem('pickl_nickname', name);
}

export async function shareCourse(spots, courseTitle = '나만의 핫플 코스') {
  const nickname = getLocalNickname() || '익명';
  
  const docRef = await addDoc(collection(db, 'courses'), {
    title: courseTitle,
    nickname: nickname,
    spots: spots.map(s => ({
      id: s.id || '',
      name: s.name || '',
      category: s.category || '',
      lat: s.lat || 0,
      lng: s.lng || 0
    })),
    createdAt: serverTimestamp()
  });

  return docRef.id;
}