// ===== ADMIN DASHBOARD SCRIPT =====

document.addEventListener("DOMContentLoaded", function () {
    loadKajian();
});

// Tambah kajian
function tambahKajian() {
    const judul = document.getElementById("judul").value;
    const tanggal = document.getElementById("tanggal").value;
    const ustadz = document.getElementById("ustadz").value;

    if (!judul || !tanggal || !ustadz) {
        alert("Semua field wajib diisi!");
        return;
    }

    let kajianList = JSON.parse(localStorage.getItem("kajianList")) || [];

    kajianList.push({
        id: Date.now(),
        judul,
        tanggal,
        ustadz
    });

    localStorage.setItem("kajianList", JSON.stringify(kajianList));

    document.getElementById("judul").value = "";
    document.getElementById("tanggal").value = "";
    document.getElementById("ustadz").value = "";

    loadKajian();
}

// Load kajian ke tabel admin
function loadKajian() {
    let kajianList = JSON.parse(localStorage.getItem("kajianList")) || [];
    const table = document.getElementById("admin-kajian-list");

    if (!table) return;

    table.innerHTML = "";

    kajianList.forEach(kajian => {
        table.innerHTML += `
            <tr>
                <td>${kajian.judul}</td>
                <td>${kajian.tanggal}</td>
                <td>${kajian.ustadz}</td>
                <td>
                    <button onclick="hapusKajian(${kajian.id})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

// Hapus kajian
function hapusKajian(id) {
    let kajianList = JSON.parse(localStorage.getItem("kajianList")) || [];
    kajianList = kajianList.filter(k => k.id !== id);
    localStorage.setItem("kajianList", JSON.stringify(kajianList));
    loadKajian();
}
