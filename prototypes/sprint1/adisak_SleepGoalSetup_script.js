document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById("saveBtn");
    saveBtn.addEventListener("click", saveData);
});

function saveData() {
    // ดึงข้อมูล
    const age = document.getElementById("age").value;
    const sleepTime = document.getElementById("sleepTime").value;

    // ดึงกิจกรรมที่เลือก
    const activities = [];
    document.querySelectorAll(".activities input[type='checkbox']:checked").forEach((item) => {
        activities.push(item.value);
    });

    // บันทึกลง Local Storage
    localStorage.setItem("age", age);
    localStorage.setItem("sleepTime", sleepTime);
    localStorage.setItem("activities", JSON.stringify(activities));

    // แจ้งเตือน
    alert("บันทึกข้อมูลเรียบร้อย");

    // ไปยังหน้าถัดไป (เปิดใช้งานเมื่อพร้อม)
    // window.location.href = "result.html";
}