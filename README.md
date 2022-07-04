<h1>ยินดีต้อนรับเข้าสู่ ThaiVivat Parking API v1.0</h1>

<h3>วิธีติดตั้งผ่าน Docker compose</h3>                 
<ul>
    <li>1. pull docker-compose file จาก https://github.com/joystats/ttv-compose</li>
    <li>2. พิมพ์คำสั่ง docker-compose up -d</li>
    <li>3. initial mockup database
        <ul>
            <li>1. docker exec -it mysql_container bash</li>
            <li>2. mysql -u root -p</li>
            <li>3. กรอกรหัสผ่าน 1234</li>
            <li>4. เข้าสู่ mysql prompt mode พิมพ์ source thaivivat.sql</li>
        </ul>
    </li>
    <li>4. หน้า Welcome API http://localhost/</li>
    <li>5. หน้า Dashboard http://localhost/dashboard</li>
    <li>docker image ที่เกี่ยวข้อง joystats/api, joystats/parking_database, phpmyadmin/phpmyadmin</li>
</ul>

<h3>Features</h3>
<ul>
    <li>สามารถดู <a href="/dashboard" target="_blank">Dashboard</a> แบบ Realtime</li>
    <li>สามารถเพิ่ม Slot ได้ <i class="bi bi-check-circle-fill text-success"></i></li>
    <li>สามารถจอง/ยกเลิกการจอง Slot ได้</li>
    <li>สามารถนำรถเข้าจอดได้ <i class="bi bi-check-circle-fill text-success"></i></li>
    <li>สามารถนำรถออกได้ <i class="bi bi-check-circle-fill text-success"></i></li>
    <li>สามารถ เปิด/ปิด การใช้งานแต่ละ Slot ได้</li>
    <li>สามารถดู Slot ทั้งหมดได้</li>
    <li>สามารถดู Slot ตาม Slot code ได้</li>
    <li>สามารถดู Slot ถนัดไปที่ใกล้ที่สุดได้</li>
    <li>สามารถดู Status ของรายการ Slot ทั้งหมดได้ <i class="bi bi-check-circle-fill text-success"></i></li>
    <li>สามารถดู Plate Number ทั้งหมด ตาม size ของรถได้ <i class="bi bi-check-circle-fill text-success"></i></li>
    <li>สามารถดู Slot ทั้งหมด ตาม size ของรถได้ <i class="bi bi-check-circle-fill text-success"></i></li>
    <li>สามารถดูข้อมูลของรถที่จอดอยู่ทั้งหมดได้ เช่น Slot, Plate number, size, เวลาเข้าจอด</li>
    <li>สามารถดูประวัติการจอดทั้งหมดได้ เช่น Slot, Plate number, size, เวลาเข้าจอด, เวลาออก, ค่าบริการ</li>
    <li>คิดค่าที่จอดเป็นชั่วโมง เศษของชั่วโมงคิดเป็น 1 ชั่วโมง</li>
    <li>สามารถตั้งแค่ที่จอดใน Configuration file ได้ default = 30 บาท/ชั่วโมง</li>
</ul>

<h3>แนวคิด Programming</h3>
<ul>
    <li>ในแต่ละ Slot จะมีลำดับเลขตามความใกล้</li>
    <li>สถานะทั้งหมดของ Slot มี 4 สถานะ คือ<br/>
        <ul>
            <li>1. Inactivated (ไม่ใช้งาน)</li>
            <li>2. Available (ว่าง, พร้อมใช้งาน)</li>
            <li>3. Not available (ไม่ว่าง)</li>
            <li>4. Reserved (จอง)</li>
        </ul>
    </li>
    <li>เมื่อสร้าง Slot ใหม่ ระบบจะจัดเรียงลำดับให้อัตโนมัติ สถานะ Default คือ Available</li>
    <li>เมื่อ Check In (เข้าจอด) ระบบจะเปลี่ยนสถานะของ Slot เป็น Not available</li>
    <li>เมื่อ Check Out (นำรถออก) ระบบจะคำนวณและแสดงค่าบริการ ระบบจะเปลี่ยนสถานะของ Slot เป็น Available</li>
    <li>ใช้ trigger ในการอัพเดท Status เมื่อเข้ารถเข้าจอด-ออก</li>
    <li>ข้อยกเว้น: สมมุติว่าทะเบียนรถที่เข้ามาจอดไม่ซ้ำกันกับรถที่จอดอยู่</li>
</ul>

<h3>Stack ที่ใช้</h3>                 
<ul>
    <li>NodeJs</li>
    <li>Express Framework</li>
    <li>Socket.io</li>
    <li>EJS Template Engine</li>
    <li>Bootstrap CSS Framework</li>
    <li>PM2 Process manager</li>
    <li>MySQL</li>
    <li>PhpMyadmin</li>
    <li>Git</li>
    <li>Docker</li>
</ul>
