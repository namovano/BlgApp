import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// Кастомні метрики
const responseTimeTrend = new Trend('response_time');
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '12s', target: 50 },   // розігрів
    { duration: '20s', target: 100 },  // пікова точка
    { duration: '18s', target: 50 },   // відновлення
  ],

thresholds: {
  errors: ['rate<0.2'],  // наприклад, дозволити до 20% помилок
  http_req_duration: ['p(95)<1000'],
}

};



const BASE_URL = 'http://localhost:8080';
const USERS = [
  { username: 'user1', password: 'pass1' },
  { username: 'user2', password: 'pass2' }
];

export default function () {
  const user = USERS[Math.floor(Math.random() * USERS.length)];
  
  // 1. Логін
  let loginRes = http.post(`${BASE_URL}/login`, user);
  check(loginRes, { 'Logged in': (r) => r.status === 200 }) || errorRate.add(1);
  responseTimeTrend.add(loginRes.timings.duration);
  
  // 2. Отримання постів
  let postsRes = http.get(`${BASE_URL}/posts`);
  check(postsRes, { 'Posts loaded': (r) => r.status === 200 }) || errorRate.add(1);
  responseTimeTrend.add(postsRes.timings.duration);
  
  // 3. Перегляд випадкового поста
  if (postsRes.status === 200) {
    const posts = JSON.parse(postsRes.body);
    if (posts.length > 0) {
      const postId = posts[0]._id; // Беремо перший пост для стабільності тесту
      let postRes = http.get(`${BASE_URL}/post/${postId}`);
      check(postRes, { 'Post loaded': (r) => r.status === 200 }) || errorRate.add(1);
      responseTimeTrend.add(postRes.timings.duration);
    }
  }
  
  sleep(Math.random() * 2 + 1);
}