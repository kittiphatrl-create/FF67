# Three.js 3D Interactive Project 🚀

โปรเจกต์นี้ได้รับการติดตั้งและตั้งค่า **Three.js** เรียบร้อยแล้ว พร้อมใช้งานได้ 2 รูปแบบ:

---

## วิธีที่ 1: เปิดใช้งานได้ทันที (ไม่ต้องติดตั้งโปรแกรมเพิ่ม)
คุณสามารถเปิดดูผลงาน 3D ได้ทันทีผ่าน Browser:
1. ไปที่โฟลเดอร์นี้ (`c:\Users\kitti\Downloads\New folder`)
2. ดับเบิ้ลคลิกไฟล์ [index.html](file:///c:/Users/kitti/Downloads/New%20folder/index.html) เพื่อเปิดใน Google Chrome, Microsoft Edge หรือเว็บเบราว์เซอร์ใดก็ได้
3. ใช้งานระบบ 3D Interactive:
   - **คลิกซ้าย + ลาก**: หมุนมุมกล้อง (OrbitControls)
   - **Scroll Mouse**: ซูมเข้า - ออก
   - **คลิกขวา + ลาก**: เลื่อนตำแหน่งกล้อง (Pan)
   - **แผงควบคุมด้านขวา**: เปลี่ยนรูปทรง (Torus Knot, Sphere, Icosahedron), เปลี่ยนวัสดุ (Hologram, Chrome, Glow, Wireframe), สลับสีไฟนีออน และปรับความเร็วการหมุน

---

## วิธีที่ 2: ติดตั้งผ่าน Node.js และ npm (`npm install three`)
หากคุณต้องการพัฒนาโปรเจกต์ด้วยเครื่องมือสมัยใหม่ เช่น Vite, Webpack หรือ React:

1. **ติดตั้ง Node.js**:
   - ในโฟลเดอร์ Downloads มีไฟล์ติดตั้ง `node-v24.21.0-x64.msi` อยู่แล้ว
   - สามารถดับเบิ้ลคลิกติดตั้งได้ที่ [node-v24.21.0-x64.msi](file:///c:/Users/kitti/Downloads/node-v24.21.0-x64.msi) แล้วกด Next จนเสร็จสิ้น
2. **ติดตั้ง Three.js ใน Terminal**:
   ```bash
   npm install three
   ```
3. **ตัวอย่างการ Import ใน ES Modules / Vite**:
   ```javascript
   import * as THREE from 'three';
   import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

   const scene = new THREE.Scene();
   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   const renderer = new THREE.WebGLRenderer();
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);
   ```

---

## โครงสร้างไฟล์ในโปรเจกต์ (Project Structure)
```
📁 New folder/
├── 📄 index.html          # หน้าหลักแสดงผล 3D Scene และ HUD Controls
├── 📄 style.css           # สไตล์ Cyberpunk / Glassmorphism
├── 📄 main.js             # Logic การสร้าง Scene, Mesh, Light, Animation
├── 📁 lib/
│   ├── 📄 three.min.js    # Three.js Core library (Offline & Standalone)
│   └── 📄 OrbitControls.js# ระบบควบคุมมุมมองกล้องด้วยเมาส์
├── 📄 package.json        # กำหนดค่าสำหรับโปรเจกต์ Node.js / npm
└── 📄 node-v24.21.0-x64.msi# ตัวติดตั้ง Node.js สำหรับ Windows
```
