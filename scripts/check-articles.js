/**
 * Script kiểm tra nhanh dữ liệu articles trong Firestore
 * Chạy: node scripts/check-articles.js
 */
const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, '../khmerapp-9895c-firebase-adminsdk-fbsvc-c52a5dc7fe.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  projectId: 'khmerapp-9895c',
});

const db = admin.firestore();

async function checkArticles() {
  console.log('🔍 Đang kiểm tra collection "articles" trong Firestore...\n');

  const snapshot = await db.collection('articles').get();

  if (snapshot.empty) {
    console.log('❌ Collection "articles" TRỐNG hoàn toàn!');
    process.exit(1);
  }

  console.log(`✅ Tìm thấy ${snapshot.size} bài viết:\n`);
  snapshot.forEach((doc, idx) => {
    const data = doc.data();
    console.log(`  ${idx + 1}. [${doc.id}]`);
    console.log(`     Tiêu đề: ${data.title}`);
    console.log(`     Danh mục: ${data.category}`);
    console.log(`     Xuất bản: ${data.published}`);
    console.log(`     createdAt: ${data.createdAt}\n`);
  });

  process.exit(0);
}

checkArticles().catch(err => {
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
});
