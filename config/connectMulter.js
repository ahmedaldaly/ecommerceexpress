const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../image')); // مسار حفظ الصور
  },
  filename: function (req, file, cb) {
    const name = `${Date.now()}-${file.originalname}`; // صيغة اسم الملف
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
